import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  TaskCreated as TaskCreatedEvent,
} from "../generated/Contract/Contract"
import {
  TaskCounter,
} from "../generated/schema"

export function handleTaskCreated(event: TaskCreatedEvent): void {
  let entity = TaskCounter.load("1")
  if (!entity) {
    entity = new TaskCounter("1")
    entity.TaskCreatedCount = BigInt.fromI32(0)
  }

  entity.TaskCreatedCount = entity.TaskCreatedCount.plus(BigInt.fromI32(1))
  entity.save()
}