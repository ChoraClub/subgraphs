import {
  Approval as ApprovalEvent,
  DelegateChanged as DelegateChangedEvent,
  DelegateVotesChanged as DelegateVotesChangedEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent,
  Transfer1 as Transfer1Event
} from "../generated/L2ArbitrumToken/L2ArbitrumToken"
import {
  Approval,
  DelegateChanged,
  DelegateVotesChanged,
  Initialized,
  Delegate,
  OwnershipTransferred,
  Transfer,
  Transfer1
} from "../generated/schema"
import { BigInt, Bytes } from "@graphprotocol/graph-ts"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDelegateChanged(event: DelegateChangedEvent): void {
  let fromDelegateId = event.params.fromDelegate.toHexString()
  let toDelegateId = event.params.toDelegate.toHexString()
  let delegatorId = event.params.delegator.toHexString()

  // Handle the 'from' delegate
  let fromDelegate = Delegate.load(fromDelegateId)
  if (fromDelegate != null) {
    fromDelegate.delegatedFromCount = fromDelegate.delegatedFromCount.minus(BigInt.fromI32(1))
    let delegators = fromDelegate.delegators
    let index = delegators.indexOf(event.params.delegator)
    if (index > -1) {
      delegators.splice(index, 1)
    }
    fromDelegate.delegators = delegators
    fromDelegate.save()
  }

  // Handle the 'to' delegate
  let toDelegate = Delegate.load(toDelegateId)
  if (toDelegate == null) {
    toDelegate = new Delegate(toDelegateId)
    toDelegate.latestBalance = BigInt.fromI32(0)
    toDelegate.delegatedFromCount = BigInt.fromI32(0)
    toDelegate.delegators = []
  }
  toDelegate.delegatedFromCount = toDelegate.delegatedFromCount.plus(BigInt.fromI32(1))
  let delegators = toDelegate.delegators
  if (delegators.indexOf(event.params.delegator) == -1) {
    delegators.push(event.params.delegator)
  }
  toDelegate.delegators = delegators
  toDelegate.blockTimestamp = event.block.timestamp
  toDelegate.save()

  let entity = new DelegateChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.delegator = event.params.delegator
  entity.fromDelegate = event.params.fromDelegate
  entity.toDelegate = event.params.toDelegate
  entity.newBalance = toDelegate.latestBalance
  entity.balanceBlockTimestamp = toDelegate.blockTimestamp
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDelegateVotesChanged(
  event: DelegateVotesChangedEvent
): void {
  let delegateId = event.params.delegate.toHexString()
  
  // Create or update the Delegate entity
  let delegate = Delegate.load(delegateId)
  if (delegate == null) {
    delegate = new Delegate(delegateId)
    delegate.delegatedFromCount = BigInt.fromI32(0)
    delegate.delegators = []
  }
  
  // Update the balance
  delegate.latestBalance = event.params.newBalance
  delegate.blockTimestamp = event.block.timestamp
  delegate.save()

  let entity = new DelegateVotesChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.delegate = event.params.delegate
  entity.previousBalance = event.params.previousBalance
  entity.newBalance = event.params.newBalance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

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

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.data = event.params.data

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer1(event: Transfer1Event): void {
  let entity = new Transfer1(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}