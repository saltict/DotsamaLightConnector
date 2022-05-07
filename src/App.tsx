import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { LightConnector } from './lib/connector/LightConnector';
import { NETWORKS } from './lib/connector/NetworkList';
import { Button, Col, Input, Row } from 'antd';

const _connectorMap: Record<string, LightConnector> = {}

function App () {
  const [connectorMap, setConnectorMap] = useState<Record<string, LightConnector>>({});
  const [balanceMap, setBalanceMap] = useState<Record<string, string>>({});
  const [metadataMap, setMetadataMap] = useState<Record<string, string>>({});
  const [address, setAddress] = useState<string>('5FEdUhBmtK1rYifarmUXYzZhi6fmLbC6SZ7jcNvGuC2gaa2r');
  const [lookupType, setLookupType] = useState<Record<string, { id: string, rs: string }>>({});

  useEffect(() => {
    Object.entries(NETWORKS).forEach(([key, info]) => {
      try {
        let connector = _connectorMap[key];
        if (!connector) {
          connector = new LightConnector(key, info.provider)
          _connectorMap[key] = connector;
        }
        connector.provider.on('connected', () => {
          setConnectorMap(prevState => ({ ...prevState, [key]: connector }))
        })
        connector.provider.on('disconnected', () => {
          setConnectorMap(prevState => ({ ...prevState, [key]: connector }))
        })
      } catch (e) {
        console.log(e);
      }

      setConnectorMap(prevState => ({ ..._connectorMap }))
    })
  }, [])

  const subscribleBalance = useCallback(
    () => {
      Object.entries(connectorMap).forEach(([key, connector]) => {
        setBalanceMap((prevMap) => ({ ...prevMap, [key]: '[waiting...]' }))
      })
      Object.entries(connectorMap).forEach(([key, connector]) => {
        connector.getBalance([address], (rs) => {
          console.log(rs);
          const rss = rs.map((r) => {
            return r.data.toHuman();
          })
          setBalanceMap((prevMap) => ({ ...prevMap, [key]: JSON.stringify(rss) }))
        })

        connector.provider.on('disconnected', () => {
          setBalanceMap((prevMap) => ({ ...prevMap, [key]: '[waiting...]' }))
        })
      })
    },
    [address, connectorMap],
  );

  const getMetadata = useCallback(
    (networkKey: string) => {
      setMetadataMap(prevState => ({ ...prevState, [networkKey]: '[waiting...]' }))
      connectorMap[networkKey]?.getMetadata((metadata) => {
        setMetadataMap(prevState => ({ ...prevState, [networkKey]: metadata.toString() }))
      })
    },
    [connectorMap],
  );

  const runLookupType = useCallback(
    (networkKey: string) => {
      setLookupType(prevState => ({ ...prevState, [networkKey]: {id: prevState[networkKey]?.id, rs: '[waiting...]'}}));
      connectorMap[networkKey]?.getTypeDef(lookupType[networkKey].id, (rs) => {
        setLookupType(prevState => ({ ...prevState, [networkKey]: {id: prevState[networkKey]?.id, rs: rs} }));
      })
      connectorMap[networkKey]?.runGetAcalaAssets((rs) => {
        console.log(rs);
      })
    },
    [connectorMap, lookupType],
  );

  const connectApiPromise = useCallback(
    () => {
      Object.entries(connectorMap).forEach(([key, connector]) => {
        getMetadata(key);
      })
    },
    [getMetadata, connectorMap],
  );

  const onChangeAddress = useCallback(
    (e: any) => {
      setAddress(e.target.value);
    },
    [],
  );

  return (
    <div className="main-wrapper">
      <div className="main">
        <div className="basic-padding header">
          <Row gutter={16}>
            <Col>
              <Input.Group compact>
                <Input onChange={onChangeAddress} value={address} type="text" style={{ width: '420px' }}/>
                <Button onClick={subscribleBalance} type="primary">Subscribe Balances</Button>
              </Input.Group>
            </Col>
            <Col>
              <Button onClick={connectApiPromise} type="primary">Get Metadata</Button>
            </Col>
          </Row>
        </div>
        <div className="basic-padding main-content">
          <table className="network-table">
            <thead>
            <tr>
              <th style={{ width: '120px' }}>Network</th>
              <th style={{ width: '400px' }}>Balance</th>
              <th style={{ width: '400px' }}>Metadata</th>
              <th style={{ width: '600px' }}>Action</th>
            </tr>
            </thead>
            <tbody>
            {Object.entries(connectorMap).map(([key, connector]) => (
              <tr key={key}>
                <th>
                  <div className={connector.provider?.isConnected ? 'network-status connected' : 'network-status disconnected'}>{connector.networkKey}</div>
                </th>
                <td>
                  <div>
                    <Input readOnly={true} value={balanceMap[key]} type="text"/>
                  </div>
                </td>
                <td>
                  <div>
                    <Input readOnly={true} value={metadataMap[key]} type="text"/>
                  </div>
                </td>
                <td>
                  <Input.Group compact>
                    <Input onChange={(e: any) => {setLookupType(prevState => ({...prevState, [key]: {id: e.target.value, rs: ''}}))}} value={lookupType[key]?.id} type="text" placeholder="Type ID" style={{ width: '150px' }}/>
                    <Button disabled={lookupType[key]?.id === undefined} onClick={() => {
                      runLookupType(key)
                    }} type="primary">Lookup</Button>
                    <Input readOnly={true} value={lookupType[key]?.rs} type="text" placeholder="Result" style={{ width: '300px' }}/>
                  </Input.Group>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className="basic-padding footer">
        </div>
      </div>
    </div>
  );
}

export default App;
