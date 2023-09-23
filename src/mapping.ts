import {
  Initialize,
  ModifyPosition,
  Swap as SwapEvent,
} from "../generated/PoolManager/PoolManager";
import { Pool, PoolSnapshot, Position, Swap } from "../generated/schema";
import { Bytes } from "@graphprotocol/graph-ts";
import { ONE_BI, ZERO_BI } from "./constants";

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
  pool.save();
  let snapshot = new PoolSnapshot(pool.poolKey.toHexString());
  snapshot.liquidity = ZERO_BI;
  snapshot.sqrtPriceX96 = ONE_BI;
  snapshot.save();
}

export function handleModifyPosition(event: ModifyPosition): void {
  let position = new Position(event.transaction.hash.toHexString());
  position.poolKey = event.params.id;
  position.transaction = event.transaction.hash;
  position.timestamp = event.block.timestamp;
  position.sender = event.params.sender;
  position.from = event.transaction.from;
  position.logIndex = event.logIndex;
  const pool = Pool.load(position.poolKey.toHexString());
  if (pool !== null) {
    position.currency0 = pool.currency0;
    position.currency1 = pool.currency1;
  }
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
  let swap = new Swap(event.transaction.hash.toHexString());
  swap.poolKey = event.params.id;
  swap.transaction = event.transaction.hash;
  swap.timestamp = event.block.timestamp;
  swap.sender = event.params.sender;
  const pool = Pool.load(swap.poolKey.toHexString());
  if (pool !== null) {
    swap.currency0 = pool.currency0;
    swap.currency1 = pool.currency1;
  }
  swap.liquidity = event.params.liquidity;
  swap.sqrtPriceX96 = event.params.sqrtPriceX96;
  swap.amount0Delta = event.params.amount0;
  swap.amount1Delta = event.params.amount1;
  swap.from = event.transaction.from;
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
