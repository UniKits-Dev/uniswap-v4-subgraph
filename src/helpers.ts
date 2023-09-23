/* eslint-disable prefer-const */
import {
  log,
  BigInt,
  BigDecimal,
  Address,
  ethereum,
} from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

// rebass tokens, dont count in tracked volume
export let UNTRACKED_PAIRS: string[] = [
  "0x9ea3b5b4ec044b70375236a281986106457b20ef",
];

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function bigDecimalExp18(): BigDecimal {
  return BigDecimal.fromString("1000000000000000000");
}

export function convertEthToDecimal(eth: BigInt): BigDecimal {
  return eth.toBigDecimal().div(exponentToBigDecimal(new BigInt(18)));
}

export function convertTokenToDecimal(
  tokenAmount: BigInt,
  exchangeDecimals: BigInt
): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function equalToZero(value: BigDecimal): boolean {
  const formattedVal = parseFloat(value.toString());
  const zero = parseFloat(ZERO_BD.toString());
  if (zero == formattedVal) {
    return true;
  }
  return false;
}

export function isNullEthValue(value: string): boolean {
  return (
    value ==
    "0x0000000000000000000000000000000000000000000000000000000000000001"
  );
}

// HOT FIX: we cant implement try catch for overflow catching so skip total supply parsing on these tokens that overflow
// TODO: find better way to handle overflow
let SKIP_TOTAL_SUPPLY: string[] = [
  "0x0000000000bf2686748e1c0255036e7617e7e8a5",
];
