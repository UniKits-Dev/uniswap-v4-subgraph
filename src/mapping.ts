import {
  Initialize,
  ModifyPosition,
  Swap as SwapEvent,
} from "../generated/PoolManager/PoolManager";
import { Pool, Swap } from "../generated/schema";

// export function handleNewGravatar(event: NewGravatar): void {
//   let gravatar = new Gravatar(event.params.id.toHex())
//   gravatar.owner = event.params.owner
//   gravatar.displayName = event.params.displayName
//   gravatar.imageUrl = event.params.imageUrl
//   gravatar.save()
// }

// export function handleUpdatedGravatar(event: UpdatedGravatar): void {
//   let id = event.params.id.toHex()
//   let gravatar = Gravatar.load(id)
//   if (gravatar == null) {
//     gravatar = new Gravatar(id)
//   }
//   gravatar.owner = event.params.owner
//   gravatar.displayName = event.params.displayName
//   gravatar.imageUrl = event.params.imageUrl
//   gravatar.save()
// }

export function handleInitialize(event: Initialize): void {
  let pool = new Pool(event.params.id.toHexString());
  pool.poolKey = event.params.id;
  pool.currency0 = event.params.currency0;
  pool.currency1 = event.params.currency1;
  pool.fee = event.params.fee;
  pool.tickSpacing = event.params.tickSpacing;
  pool.hookAddress = event.params.hooks;
  pool.save();
}

export function handleModifyPosition(event: ModifyPosition): void {}

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
  swap.amount0Delta = event.params.amount0;
  swap.amount1Delta = event.params.amount1;
  swap.from = event.transaction.from;
  swap.logIndex = event.logIndex;
  swap.save();
}
