import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  OrderCreated as OrderCreatedEvent,
} from "../generated/Deorder/DeOrder"
import {
  OrderCounter
} from "../generated/schema"

export function handleOrderCreated(event: OrderCreatedEvent): void {
  let entity = OrderCounter.load("1")
  if (!entity) {
    entity = new OrderCounter("1")
    entity.OrderCreatedCount = BigInt.fromI32(0)
  }
  entity.OrderCreatedCount = entity.OrderCreatedCount.plus(BigInt.fromI32(1))
  entity.save()
}