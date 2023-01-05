import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ApplyFor,
  Approval,
  ApprovalForAll,
  CancelApply,
  Locked,
  ModifyFee,
  OwnershipTransferred,
  TaskCreated,
  TaskDisabled,
  TaskModified,
  Transfer,
  Unlocked
} from "../generated/Contract/Contract"

export function createApplyForEvent(
  taskId: BigInt,
  worker: Address,
  cost: BigInt
): ApplyFor {
  let applyForEvent = changetype<ApplyFor>(newMockEvent())

  applyForEvent.parameters = new Array()

  applyForEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  applyForEvent.parameters.push(
    new ethereum.EventParam("worker", ethereum.Value.fromAddress(worker))
  )
  applyForEvent.parameters.push(
    new ethereum.EventParam("cost", ethereum.Value.fromUnsignedBigInt(cost))
  )

  return applyForEvent
}

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createCancelApplyEvent(
  taskId: BigInt,
  worker: Address
): CancelApply {
  let cancelApplyEvent = changetype<CancelApply>(newMockEvent())

  cancelApplyEvent.parameters = new Array()

  cancelApplyEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  cancelApplyEvent.parameters.push(
    new ethereum.EventParam("worker", ethereum.Value.fromAddress(worker))
  )

  return cancelApplyEvent
}

export function createLockedEvent(tokenId: BigInt): Locked {
  let lockedEvent = changetype<Locked>(newMockEvent())

  lockedEvent.parameters = new Array()

  lockedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return lockedEvent
}

export function createModifyFeeEvent(
  taskFee: BigInt,
  applyFee: BigInt,
  feeReceiver: Address
): ModifyFee {
  let modifyFeeEvent = changetype<ModifyFee>(newMockEvent())

  modifyFeeEvent.parameters = new Array()

  modifyFeeEvent.parameters.push(
    new ethereum.EventParam(
      "taskFee",
      ethereum.Value.fromUnsignedBigInt(taskFee)
    )
  )
  modifyFeeEvent.parameters.push(
    new ethereum.EventParam(
      "applyFee",
      ethereum.Value.fromUnsignedBigInt(applyFee)
    )
  )
  modifyFeeEvent.parameters.push(
    new ethereum.EventParam(
      "feeReceiver",
      ethereum.Value.fromAddress(feeReceiver)
    )
  )

  return modifyFeeEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createTaskCreatedEvent(
  taskId: BigInt,
  issuer: Address,
  task: ethereum.Tuple
): TaskCreated {
  let taskCreatedEvent = changetype<TaskCreated>(newMockEvent())

  taskCreatedEvent.parameters = new Array()

  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("issuer", ethereum.Value.fromAddress(issuer))
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("task", ethereum.Value.fromTuple(task))
  )

  return taskCreatedEvent
}

export function createTaskDisabledEvent(
  taskId: BigInt,
  disabled: boolean
): TaskDisabled {
  let taskDisabledEvent = changetype<TaskDisabled>(newMockEvent())

  taskDisabledEvent.parameters = new Array()

  taskDisabledEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskDisabledEvent.parameters.push(
    new ethereum.EventParam("disabled", ethereum.Value.fromBoolean(disabled))
  )

  return taskDisabledEvent
}

export function createTaskModifiedEvent(
  taskId: BigInt,
  issuer: Address,
  task: ethereum.Tuple
): TaskModified {
  let taskModifiedEvent = changetype<TaskModified>(newMockEvent())

  taskModifiedEvent.parameters = new Array()

  taskModifiedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskModifiedEvent.parameters.push(
    new ethereum.EventParam("issuer", ethereum.Value.fromAddress(issuer))
  )
  taskModifiedEvent.parameters.push(
    new ethereum.EventParam("task", ethereum.Value.fromTuple(task))
  )

  return taskModifiedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createUnlockedEvent(tokenId: BigInt): Unlocked {
  let unlockedEvent = changetype<Unlocked>(newMockEvent())

  unlockedEvent.parameters = new Array()

  unlockedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return unlockedEvent
}
