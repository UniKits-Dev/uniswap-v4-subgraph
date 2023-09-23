import { Initialize, ModifyPosition } from '../generated/PoolManager/PoolManager'
import { Pool } from '../generated/schema'

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
  let pool = new Pool(event.params.id.toString())
  pool.poolKey = event.params.id
  pool.currency0 = event.params.currency0
  pool.currency1 = event.params.currency1
  pool.save()
}

export function handleModifyPosition(event: ModifyPosition): void {

}