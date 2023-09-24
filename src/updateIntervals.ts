/* eslint-disable prefer-const */
import {
  log,
  BigInt,
  BigDecimal,
  Address,
  ethereum,
} from "@graphprotocol/graph-ts";
import { Pool, PoolHourData } from "../generated/schema";
import { ONE_BI, ZERO_BD, ZERO_BI } from "./constants";

export function updatePoolHourData(
  event: ethereum.Event,
  poolKey: string
): PoolHourData {
  let timestamp = event.block.timestamp.toI32();
  let hourIndex = timestamp / 3600; // get unique hour within unix history
  let hourStartUnix = hourIndex * 3600; // want the rounded effect
  let hourPoolID = poolKey.concat("-").concat(hourIndex.toString());
  let pool = Pool.load(poolKey);
  if (pool === null) {
    throw "pool is not created";
  }
  let poolHourData = PoolHourData.load(hourPoolID);
  if (poolHourData === null) {
    poolHourData = new PoolHourData(hourPoolID);
    poolHourData.periodStartUnix = hourStartUnix;
    poolHourData.pool = pool.id;
    // things that dont get initialized always
    poolHourData.txCount = ZERO_BI;
    poolHourData.open = pool.token0Price;
    poolHourData.high = pool.token0Price;
    poolHourData.low = pool.token0Price;
    poolHourData.close = pool.token0Price;
  }

  if (pool.token0Price.gt(poolHourData.high)) {
    poolHourData.high = pool.token0Price;
  }
  if (pool.token0Price.lt(poolHourData.low)) {
    poolHourData.low = pool.token0Price;
  }

  poolHourData.liquidity = pool.liquidity;
  poolHourData.sqrtPrice = pool.sqrtPrice;
  poolHourData.token0Price = pool.token0Price;
  poolHourData.token1Price = pool.token1Price;
  poolHourData.close = pool.token0Price;
  poolHourData.tick = pool.tick;
  poolHourData.txCount = poolHourData.txCount.plus(ONE_BI);
  poolHourData.save();

  // test
  return poolHourData as PoolHourData;
}
