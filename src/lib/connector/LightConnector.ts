import '@polkadot/types-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Vec } from '@polkadot/types-codec';
import { KeyValueOption } from '@polkadot/types/interfaces/state/types';
import { FrameSystemAccountInfo } from '@polkadot/types/lookup';
import { ScProvider } from '@polkadot/rpc-provider/substrate-connect/ScProvider';
import { balanceFormatter, methodHash, hashAddress, concatHash, acalaAssetsFormatter } from './utils';
import { MetadataLatest } from '@polkadot/types/interfaces/metadata';
// import { WellKnownChain } from '@substrate/connect';
// const WELL_KNOWN_CHAIN_MAP: Record<string, string> = {
//   polkadot: WellKnownChain.polkadot,
//   kusama: WellKnownChain.ksmcc3,
//   rococo: WellKnownChain.rococo_v2_2,
//   westend: WellKnownChain.westend2
// }

const API_KEY = 'bed94ae7-26da-48e4-821a-0f3b528581ce'

export class LightConnector {
  provider: WsProvider | ScProvider;
  networkKey: string;
  chainInfoIsReady: Promise<void>;
  endpoint?: string;
  chainName?: string;
  genesisHash?: string;
  ss58Format?: number;
  tokenDecimals?: Array<number>;
  tokenSymbol?: Array<string>;
  isReady: Promise<WsProvider | ScProvider>;
  private _api?: ApiPromise;

  constructor (networkKey: string, endpoint: string) {
    this.networkKey = networkKey;
    if (endpoint.includes('onfinality.io')) {
      endpoint = endpoint + '?apikey=' + API_KEY
    }
    this.endpoint = endpoint;

    // Init provider from endpoit
    let provider: WsProvider | ScProvider;
    // if (endpoint.startsWith('light://')) {
    //   const scName = endpoint.replace('light://substrate-connect/', '')
    //   const wellKnownChain = WELL_KNOWN_CHAIN_MAP[scName];
    //   provider = new ScProvider(wellKnownChain);
    //
    //   this.isReady = new Promise<ScProvider>(((resolve, reject) => {
    //     provider.connect().then(() => {
    //       resolve(provider as ScProvider);
    //     }).catch(console.error);
    //   }))
    // } else {
    //
    // }

    provider = new WsProvider(endpoint, 9000);
    this.isReady = provider.isReady;
    this.provider = provider;


    this.chainInfoIsReady = this.getChainInfo();
  }

  get api () {
    if (!this._api) {
      this._api = new ApiPromise({ provider: this.provider })
    }

    return this._api;
  }

  public async getConstant<T> (key: string) {
    await this.isReady;
    return (await this.provider.send(key, [], true)) as T
  }

  public async getChainInfo () {
    await this.isReady;
    Promise.all([
      this.getConstant<string>('chain_getBlockHash'),
      this.getConstant<{ ss58Format: number, tokenDecimals: number | number[], tokenSymbol: string | string[] }>('system_properties'),
      this.getConstant<string>('system_chain')
    ])
      .then(([genesisHash, { ss58Format, tokenDecimals, tokenSymbol }, chainName]) => {
        this.genesisHash = genesisHash;
        this.ss58Format = ss58Format;
        this.tokenDecimals = (typeof tokenDecimals === 'number') ? [tokenDecimals] : tokenDecimals;
        this.tokenSymbol = (typeof tokenSymbol === 'string') ? [tokenSymbol] : tokenSymbol;
        this.chainName = chainName;
      })
  }

  public async subscribeStorage (storageKeys: string[], formatter: ([reference, change]: Vec<KeyValueOption>) => any, callback: (rs: any) => void) {
    await this.isReady;
    // Force stop while request is not ready
    let forceStop = false;
    const subProm = this.provider.subscribe('state_storage', 'state_subscribeStorage', [storageKeys], (_, value) => {
      const rs = value?.changes.map(formatter)
      if (!forceStop) {
        callback(rs);
      }
    })

    return () => {
      forceStop = true;
      subProm.then((unsubKey) => {
        // @ts-ignore
        this.provider.unsubscribe('state_storage', 'state_subscribeStorage', unsubKey).catch(console.log)
      }).catch(console.log)
    }
  }

  public async queryStorageAt (storageKeys: string[]) {
    await this.isReady;
    return this.provider.send('state_queryStorageAt', [storageKeys])
  }

  public getBalance (addresses: string[], callback: (rs: FrameSystemAccountInfo[]) => void) {
    const storageKeys = addresses.map((address) => (concatHash(...methodHash('System', 'Account'), hashAddress(address))));
    return this.subscribeStorage(storageKeys, balanceFormatter, callback).catch(console.error);
  }

  public getMetadata (callback: (metadata: MetadataLatest) => void) {
    this.api.isReady.then(() => {
      callback(this.api.registry.metadata)
    }).catch(console.error)
  }

  public getTypeDef (typeName: string, callback: (typedef: string) => void) {
    this.api.isReady.then(() => {
      // callback(this.api.registry.metadata.lookup.getTypeDef(lookupId).type)
      const t = this.api.registry.createType(typeName);
      callback(t.toRawType())
    }).catch((e) => {
      callback(e.messsage)
    })
  }

  public runGetAcalaAssets (callback: (rs: any) => void) {
    const storageKeys = [
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd8809d373fabc6bbf6b030083",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd88268787f17a68e5f30100000000",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd8831331335019fe2b1030080",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd883509e5e08c3255450300a8",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd883d4641328ffa7b7f030084",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd8842a77ad9d7b2c324020400",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd885815446ea1a514d7020600",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd885c1a9562ae5bf06e020200",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd886d19bff72b8fce8e0300aa",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd8875086eebc2e42cd9020100",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd888fa32cfd5cf702f10300ab",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd8892a72b59fc8b67b7020000",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd8899a871e7f6fb5af2020500",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd889a09f53b9410c4520300a9",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd88aad3ed95b938da97001f3a10587a20114ea25ba1b388ee2dd4a337ce27",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd88b9610d695f5f3286030082",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd88d95d03c7ea8acac5030081",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd88e0278987e47bddfc0300ac",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd88f3d6eaa69fb7edb5020700",
    "0x6e9a9b71050cd23f2d7d1b72e8c1a625b7affc73a3c113dc6f4c7d986a1ddd88fccf42dfdf6df713020300"
];
    return this.queryStorageAt(storageKeys).then(callback).catch(console.error);
  }
}