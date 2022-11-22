import {
  ApplyFor as ApplyForEvent,
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  CancelApply as CancelApplyEvent,
  Locked as LockedEvent,
  ModifyFee as ModifyFeeEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  TaskCreated as TaskCreatedEvent,
  TaskDisabled as TaskDisabledEvent,
  TaskModified as TaskModifiedEvent,
  Transfer as TransferEvent,
  Unlocked as UnlockedEvent
} from "../generated/Contract/Contract"
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
} from "../generated/schema"

export function handleApplyFor(event: ApplyForEvent): void {
  let entity = new ApplyFor(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.worker = event.params.worker
  entity.cost = event.params.cost

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancelApply(event: CancelApplyEvent): void {
  let entity = new CancelApply(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.worker = event.params.worker

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLocked(event: LockedEvent): void {
  let entity = new Locked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleModifyFee(event: ModifyFeeEvent): void {
  let entity = new ModifyFee(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskFee = event.params.taskFee
  entity.applyFee = event.params.applyFee
  entity.feeReceiver = event.params.feeReceiver

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskCreated(event: TaskCreatedEvent): void {
  let entity = new TaskCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.issuer = event.params.issuer
  entity.task_title = event.params.task.title
  entity.task_desc = event.params.task.desc
  entity.task_attachment = event.params.task.attachment
  entity.task_currency = event.params.task.currency
  entity.task_budget = event.params.task.budget
  entity.task_period = event.params.task.period
  entity.task_skills = event.params.task.skills
  entity.task_disabled = event.params.task.disabled

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskDisabled(event: TaskDisabledEvent): void {
  let entity = new TaskDisabled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.disabled = event.params.disabled

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskModified(event: TaskModifiedEvent): void {
  let entity = new TaskModified(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.issuer = event.params.issuer
  entity.task_title = event.params.task.title
  entity.task_desc = event.params.task.desc
  entity.task_attachment = event.params.task.attachment
  entity.task_currency = event.params.task.currency
  entity.task_budget = event.params.task.budget
  entity.task_period = event.params.task.period
  entity.task_skills = event.params.task.skills
  entity.task_disabled = event.params.task.disabled

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnlocked(event: UnlockedEvent): void {
  let entity = new Unlocked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
