import { TypeRegistry } from '@polkadot/types';
import { decodeAddress, xxhashAsHex } from '@polkadot/util-crypto';
import { getHasher } from '@polkadot/types/metadata/decorate/storage/getHasher';
import { u8aToHex } from '@polkadot/util';
import { Vec } from '@polkadot/types-codec';
import { KeyValueOption } from '@polkadot/types/interfaces/state/types';
import { FrameSystemAccountInfo } from '@polkadot/types/lookup';

export const registry = new TypeRegistry()

const hashCache: Record<string, string> = {}
function __hashMethod(input: string): string {
  const cached = hashCache[input];
  if (!cached) {
    hashCache[input] = xxhashAsHex(input, 128);
  }

  return hashCache[input];
}

export function methodHash(...args: string[]): string[] {
  return args.map(__hashMethod)
}

export function concatHash(...args: string[]) {
  return '0x' + args.map((s) => (s.replace('0x', ''))).join('')
}

export const Blake2_128Concat = getHasher(registry.createType('StorageHasher', 'Blake2_128Concat'));

export function hashAddress (address: string) {
  return u8aToHex(Blake2_128Concat(decodeAddress(address)), undefined, false)
}

const FrameSystemAccountInfoJSON = JSON.stringify({"nonce":"u32","consumers":"u32","providers":"u32","sufficients":"u32","data":{"free":"u128","reserved":"u128","miscFrozen":"u128","feeFrozen":"u128"}})

export const balanceFormatter = ([storageKey, value]: Vec<KeyValueOption>) => {
  return registry.createType(FrameSystemAccountInfoJSON, value) as FrameSystemAccountInfo;
}

export const ModuleAssetRegistryModuleAssetMetadataJSON = JSON.stringify({"name":"Bytes","symbol":"Bytes","decimals":"u8","minimalBalance":"u128"})
export const ModuleAssetRegistryModuleAssetIdsJSON = JSON.stringify({
    "_enum": {
        "Erc20": "H160",
        "StableAssetId": "u32",
        "ForeignAssetId": "u16",
        "NativeAssetId": {
            "_enum": {
                "Token": {"_enum":{"ACA":0,"AUSD":1,"DOT":2,"LDOT":3,"__Unused4":4,"__Unused5":5,"__Unused6":6,"__Unused7":7,"__Unused8":8,"__Unused9":9,"__Unused10":10,"__Unused11":11,"__Unused12":12,"__Unused13":13,"__Unused14":14,"__Unused15":15,"__Unused16":16,"__Unused17":17,"__Unused18":18,"__Unused19":19,"RENBTC":20,"CASH":21,"__Unused22":22,"__Unused23":23,"__Unused24":24,"__Unused25":25,"__Unused26":26,"__Unused27":27,"__Unused28":28,"__Unused29":29,"__Unused30":30,"__Unused31":31,"__Unused32":32,"__Unused33":33,"__Unused34":34,"__Unused35":35,"__Unused36":36,"__Unused37":37,"__Unused38":38,"__Unused39":39,"__Unused40":40,"__Unused41":41,"__Unused42":42,"__Unused43":43,"__Unused44":44,"__Unused45":45,"__Unused46":46,"__Unused47":47,"__Unused48":48,"__Unused49":49,"__Unused50":50,"__Unused51":51,"__Unused52":52,"__Unused53":53,"__Unused54":54,"__Unused55":55,"__Unused56":56,"__Unused57":57,"__Unused58":58,"__Unused59":59,"__Unused60":60,"__Unused61":61,"__Unused62":62,"__Unused63":63,"__Unused64":64,"__Unused65":65,"__Unused66":66,"__Unused67":67,"__Unused68":68,"__Unused69":69,"__Unused70":70,"__Unused71":71,"__Unused72":72,"__Unused73":73,"__Unused74":74,"__Unused75":75,"__Unused76":76,"__Unused77":77,"__Unused78":78,"__Unused79":79,"__Unused80":80,"__Unused81":81,"__Unused82":82,"__Unused83":83,"__Unused84":84,"__Unused85":85,"__Unused86":86,"__Unused87":87,"__Unused88":88,"__Unused89":89,"__Unused90":90,"__Unused91":91,"__Unused92":92,"__Unused93":93,"__Unused94":94,"__Unused95":95,"__Unused96":96,"__Unused97":97,"__Unused98":98,"__Unused99":99,"__Unused100":100,"__Unused101":101,"__Unused102":102,"__Unused103":103,"__Unused104":104,"__Unused105":105,"__Unused106":106,"__Unused107":107,"__Unused108":108,"__Unused109":109,"__Unused110":110,"__Unused111":111,"__Unused112":112,"__Unused113":113,"__Unused114":114,"__Unused115":115,"__Unused116":116,"__Unused117":117,"__Unused118":118,"__Unused119":119,"__Unused120":120,"__Unused121":121,"__Unused122":122,"__Unused123":123,"__Unused124":124,"__Unused125":125,"__Unused126":126,"__Unused127":127,"KAR":128,"KUSD":129,"KSM":130,"LKSM":131,"TAI":132,"__Unused133":133,"__Unused134":134,"__Unused135":135,"__Unused136":136,"__Unused137":137,"__Unused138":138,"__Unused139":139,"__Unused140":140,"__Unused141":141,"__Unused142":142,"__Unused143":143,"__Unused144":144,"__Unused145":145,"__Unused146":146,"__Unused147":147,"__Unused148":148,"__Unused149":149,"__Unused150":150,"__Unused151":151,"__Unused152":152,"__Unused153":153,"__Unused154":154,"__Unused155":155,"__Unused156":156,"__Unused157":157,"__Unused158":158,"__Unused159":159,"__Unused160":160,"__Unused161":161,"__Unused162":162,"__Unused163":163,"__Unused164":164,"__Unused165":165,"__Unused166":166,"__Unused167":167,"BNC":168,"VSKSM":169,"PHA":170,"KINT":171,"KBTC":172}},
                "DexShare": [
                    {
                        "_enum": {
                            "Token": {"_enum":{"ACA":0,"AUSD":1,"DOT":2,"LDOT":3,"__Unused4":4,"__Unused5":5,"__Unused6":6,"__Unused7":7,"__Unused8":8,"__Unused9":9,"__Unused10":10,"__Unused11":11,"__Unused12":12,"__Unused13":13,"__Unused14":14,"__Unused15":15,"__Unused16":16,"__Unused17":17,"__Unused18":18,"__Unused19":19,"RENBTC":20,"CASH":21,"__Unused22":22,"__Unused23":23,"__Unused24":24,"__Unused25":25,"__Unused26":26,"__Unused27":27,"__Unused28":28,"__Unused29":29,"__Unused30":30,"__Unused31":31,"__Unused32":32,"__Unused33":33,"__Unused34":34,"__Unused35":35,"__Unused36":36,"__Unused37":37,"__Unused38":38,"__Unused39":39,"__Unused40":40,"__Unused41":41,"__Unused42":42,"__Unused43":43,"__Unused44":44,"__Unused45":45,"__Unused46":46,"__Unused47":47,"__Unused48":48,"__Unused49":49,"__Unused50":50,"__Unused51":51,"__Unused52":52,"__Unused53":53,"__Unused54":54,"__Unused55":55,"__Unused56":56,"__Unused57":57,"__Unused58":58,"__Unused59":59,"__Unused60":60,"__Unused61":61,"__Unused62":62,"__Unused63":63,"__Unused64":64,"__Unused65":65,"__Unused66":66,"__Unused67":67,"__Unused68":68,"__Unused69":69,"__Unused70":70,"__Unused71":71,"__Unused72":72,"__Unused73":73,"__Unused74":74,"__Unused75":75,"__Unused76":76,"__Unused77":77,"__Unused78":78,"__Unused79":79,"__Unused80":80,"__Unused81":81,"__Unused82":82,"__Unused83":83,"__Unused84":84,"__Unused85":85,"__Unused86":86,"__Unused87":87,"__Unused88":88,"__Unused89":89,"__Unused90":90,"__Unused91":91,"__Unused92":92,"__Unused93":93,"__Unused94":94,"__Unused95":95,"__Unused96":96,"__Unused97":97,"__Unused98":98,"__Unused99":99,"__Unused100":100,"__Unused101":101,"__Unused102":102,"__Unused103":103,"__Unused104":104,"__Unused105":105,"__Unused106":106,"__Unused107":107,"__Unused108":108,"__Unused109":109,"__Unused110":110,"__Unused111":111,"__Unused112":112,"__Unused113":113,"__Unused114":114,"__Unused115":115,"__Unused116":116,"__Unused117":117,"__Unused118":118,"__Unused119":119,"__Unused120":120,"__Unused121":121,"__Unused122":122,"__Unused123":123,"__Unused124":124,"__Unused125":125,"__Unused126":126,"__Unused127":127,"KAR":128,"KUSD":129,"KSM":130,"LKSM":131,"TAI":132,"__Unused133":133,"__Unused134":134,"__Unused135":135,"__Unused136":136,"__Unused137":137,"__Unused138":138,"__Unused139":139,"__Unused140":140,"__Unused141":141,"__Unused142":142,"__Unused143":143,"__Unused144":144,"__Unused145":145,"__Unused146":146,"__Unused147":147,"__Unused148":148,"__Unused149":149,"__Unused150":150,"__Unused151":151,"__Unused152":152,"__Unused153":153,"__Unused154":154,"__Unused155":155,"__Unused156":156,"__Unused157":157,"__Unused158":158,"__Unused159":159,"__Unused160":160,"__Unused161":161,"__Unused162":162,"__Unused163":163,"__Unused164":164,"__Unused165":165,"__Unused166":166,"__Unused167":167,"BNC":168,"VSKSM":169,"PHA":170,"KINT":171,"KBTC":172}},
                            "Erc20": "H160",
                            "LiquidCrowdloan": "u32",
                            "ForeignAsset": "u16",
                            "StableAssetPoolToken": "u32"
                        }
                    },
                    {
                        "_enum": {
                            "Token": {"_enum":{"ACA":0,"AUSD":1,"DOT":2,"LDOT":3,"__Unused4":4,"__Unused5":5,"__Unused6":6,"__Unused7":7,"__Unused8":8,"__Unused9":9,"__Unused10":10,"__Unused11":11,"__Unused12":12,"__Unused13":13,"__Unused14":14,"__Unused15":15,"__Unused16":16,"__Unused17":17,"__Unused18":18,"__Unused19":19,"RENBTC":20,"CASH":21,"__Unused22":22,"__Unused23":23,"__Unused24":24,"__Unused25":25,"__Unused26":26,"__Unused27":27,"__Unused28":28,"__Unused29":29,"__Unused30":30,"__Unused31":31,"__Unused32":32,"__Unused33":33,"__Unused34":34,"__Unused35":35,"__Unused36":36,"__Unused37":37,"__Unused38":38,"__Unused39":39,"__Unused40":40,"__Unused41":41,"__Unused42":42,"__Unused43":43,"__Unused44":44,"__Unused45":45,"__Unused46":46,"__Unused47":47,"__Unused48":48,"__Unused49":49,"__Unused50":50,"__Unused51":51,"__Unused52":52,"__Unused53":53,"__Unused54":54,"__Unused55":55,"__Unused56":56,"__Unused57":57,"__Unused58":58,"__Unused59":59,"__Unused60":60,"__Unused61":61,"__Unused62":62,"__Unused63":63,"__Unused64":64,"__Unused65":65,"__Unused66":66,"__Unused67":67,"__Unused68":68,"__Unused69":69,"__Unused70":70,"__Unused71":71,"__Unused72":72,"__Unused73":73,"__Unused74":74,"__Unused75":75,"__Unused76":76,"__Unused77":77,"__Unused78":78,"__Unused79":79,"__Unused80":80,"__Unused81":81,"__Unused82":82,"__Unused83":83,"__Unused84":84,"__Unused85":85,"__Unused86":86,"__Unused87":87,"__Unused88":88,"__Unused89":89,"__Unused90":90,"__Unused91":91,"__Unused92":92,"__Unused93":93,"__Unused94":94,"__Unused95":95,"__Unused96":96,"__Unused97":97,"__Unused98":98,"__Unused99":99,"__Unused100":100,"__Unused101":101,"__Unused102":102,"__Unused103":103,"__Unused104":104,"__Unused105":105,"__Unused106":106,"__Unused107":107,"__Unused108":108,"__Unused109":109,"__Unused110":110,"__Unused111":111,"__Unused112":112,"__Unused113":113,"__Unused114":114,"__Unused115":115,"__Unused116":116,"__Unused117":117,"__Unused118":118,"__Unused119":119,"__Unused120":120,"__Unused121":121,"__Unused122":122,"__Unused123":123,"__Unused124":124,"__Unused125":125,"__Unused126":126,"__Unused127":127,"KAR":128,"KUSD":129,"KSM":130,"LKSM":131,"TAI":132,"__Unused133":133,"__Unused134":134,"__Unused135":135,"__Unused136":136,"__Unused137":137,"__Unused138":138,"__Unused139":139,"__Unused140":140,"__Unused141":141,"__Unused142":142,"__Unused143":143,"__Unused144":144,"__Unused145":145,"__Unused146":146,"__Unused147":147,"__Unused148":148,"__Unused149":149,"__Unused150":150,"__Unused151":151,"__Unused152":152,"__Unused153":153,"__Unused154":154,"__Unused155":155,"__Unused156":156,"__Unused157":157,"__Unused158":158,"__Unused159":159,"__Unused160":160,"__Unused161":161,"__Unused162":162,"__Unused163":163,"__Unused164":164,"__Unused165":165,"__Unused166":166,"__Unused167":167,"BNC":168,"VSKSM":169,"PHA":170,"KINT":171,"KBTC":172}},
                            "Erc20": "H160",
                            "LiquidCrowdloan": "u32",
                            "ForeignAsset": "u16",
                            "StableAssetPoolToken": "u32"
                        }
                    }
                ],
                "Erc20": "H160",
                "StableAssetPoolToken": "u32",
                "LiquidCrowdloan": "u32",
                "ForeignAsset": "u16"
            }
        }
    }
})

export const acalaAssetsFormatter = ([storageKey, value]: Vec<KeyValueOption>) => {
  console.log(storageKey, value);
  const k = registry.createType(ModuleAssetRegistryModuleAssetIdsJSON, storageKey) as unknown;
  const v = registry.createType(ModuleAssetRegistryModuleAssetMetadataJSON, value) as unknown;
  return [k,v]
}



