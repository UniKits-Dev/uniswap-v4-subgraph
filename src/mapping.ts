import {
  Initialize,
  ModifyPosition,
  Swap as SwapEvent,
} from "../generated/PoolManager/PoolManager";
import { Pool, PoolSnapshot, Position, Swap } from "../generated/schema";
import { Bytes } from "@graphprotocol/graph-ts";
import { ONE_BI, ZERO_BI } from "./constants";
import { loadTransaction } from "./helpers";

function getLatestSnapshot(poolKey: Bytes): PoolSnapshot | null {
  let snapshot = PoolSnapshot.load(poolKey.toHexString());
  return snapshot;
}

export function handleInitialize(event: Initialize): void {
  let pool = new Pool(event.params.id.toHexString());
  pool.poolKey = event.params.id;
  pool.currency0 = event.params.currency0;
  pool.currency1 = event.params.currency1;
  pool.fee = event.params.fee;
  pool.tickSpacing = event.params.tickSpacing;
  pool.hookAddress = event.params.hooks;
  pool.txCnt = ZERO_BI;
  pool.save();
  let snapshot = new PoolSnapshot(pool.poolKey.toHexString());
  snapshot.liquidity = ZERO_BI;
  snapshot.sqrtPriceX96 = ONE_BI;
  snapshot.save();
}

export function handleModifyPosition(event: ModifyPosition): void {
  let trans = loadTransaction(event);
  let pool = Pool.load(event.params.id.toHexString());
  if (pool === null) {
    throw `Pool ${event.params.id.toHexString()} is non-existent when modifying liquidity.`;
  }
  let position = new Position(
    trans.id.toString() + "#" + pool.txCnt.toString()
  );
  position.transaction = trans.id;
  position.poolKey = event.params.id;
  position.sender = event.params.sender;
  position.logIndex = event.logIndex;

  position.currency0 = pool.currency0;
  position.currency1 = pool.currency1;
  pool.txCnt = pool.txCnt.plus(ONE_BI);
  pool.save();

  let snapshot = getLatestSnapshot(position.poolKey);
  if (snapshot === null) {
    throw "something wrong! Snapshot not found when modifying positions.";
  }
  position.liquidity = event.params.liquidityDelta.plus(snapshot.liquidity);
  position.sqrtPriceX96 = snapshot.sqrtPriceX96;
  position.save();
  snapshot.liquidity = position.liquidity;
  snapshot.save();
}

export function handleSwap(event: SwapEvent): void {
  let trans = loadTransaction(event);
  let pool = Pool.load(event.params.id.toHexString());
  if (pool === null) {
    throw `Pool ${event.params.id.toHexString()} is non-existent when doing swap.`;
  }
  let swap = new Swap(trans.id.toString() + "#" + pool.txCnt.toString());
  swap.transaction = trans.id;
  swap.poolKey = event.params.id;
  swap.sender = event.params.sender;

  swap.currency0 = pool.currency0;
  swap.currency1 = pool.currency1;
  pool.txCnt = pool.txCnt.plus(ONE_BI);
  pool.save();

  swap.liquidity = event.params.liquidity;
  swap.sqrtPriceX96 = event.params.sqrtPriceX96;
  swap.amount0Delta = event.params.amount0;
  swap.amount1Delta = event.params.amount1;
  swap.logIndex = event.logIndex;
  swap.save();
  let snapshot = getLatestSnapshot(swap.poolKey);
  if (snapshot === null) {
    throw "something wrong! Snapshot not found when swapping.";
  }
  snapshot.liquidity = swap.liquidity;
  snapshot.sqrtPriceX96 = swap.sqrtPriceX96;
  snapshot.save();
}
