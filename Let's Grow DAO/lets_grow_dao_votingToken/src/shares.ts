import {
  AdminChanged as AdminChangedEvent,
  Approval as ApprovalEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  DelegateChanged as DelegateChangedEvent,
  DelegateVotesChanged as DelegateVotesChangedEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  Snapshot as SnapshotEvent,
  Transfer as TransferEvent,
  Unpaused as UnpausedEvent,
  Upgraded as UpgradedEvent
} from "../generated/Shares/Shares"
import {
  AdminChanged,
  Approval,
  BeaconUpgraded,
  DelegateChanged,
  DelegateVotesChanged,
  Initialized,
  OwnershipTransferred,
  Paused,
  Snapshot,
  Transfer,
  Unpaused,
  Upgraded,
  Delegate
} from "../generated/schema"
import { BigInt, Bytes, store, Address } from "@graphprotocol/graph-ts"

export function handleAdminChanged(event: AdminChangedEvent): void {
  let entity = new AdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousAdmin = event.params.previousAdmin
  entity.newAdmin = event.params.newAdmin

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
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBeaconUpgraded(event: BeaconUpgradedEvent): void {
  let entity = new BeaconUpgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beacon = event.params.beacon

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDelegateChanged(event: DelegateChangedEvent): void {
  // Create DelegateChanged entity
  let entity = new DelegateChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.delegator = event.params.delegator
  entity.fromDelegate = event.params.fromDelegate
  entity.toDelegate = event.params.toDelegate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // Handle the from-delegate (remove delegator from list if not zero address)
  if (event.params.fromDelegate.notEqual(Address.zero())) {
    let fromDelegate = Delegate.load(event.params.fromDelegate)
    if (fromDelegate) {
      // Update delegator count
      fromDelegate.delegatorCount = fromDelegate.delegatorCount - 1
      
      // Remove delegator from list if it exists
      let delegators = fromDelegate.delegators
      let index = delegators.indexOf(event.params.delegator)
      if (index !== -1) {
        // Create new array without the delegator
        let newDelegators: Bytes[] = []
        for (let i = 0; i < delegators.length; i++) {
          if (i != index) {
            newDelegators.push(delegators[i])
          }
        }
        fromDelegate.delegators = newDelegators
      }
      
      fromDelegate.blockTimestamp = event.block.timestamp
      fromDelegate.save()
    }
  }

  // Handle the to-delegate (add delegator to list if not zero address)
  if (event.params.toDelegate.notEqual(Address.zero())) {
    let toDelegate = Delegate.load(event.params.toDelegate)
    
    // Create delegate entity if it doesn't exist
    if (!toDelegate) {
      toDelegate = new Delegate(event.params.toDelegate)
      toDelegate.latestBalance = BigInt.fromI32(0)
      toDelegate.delegatorCount = 0
      toDelegate.delegators = []
    }
    
    // Update delegator count
    toDelegate.delegatorCount = toDelegate.delegatorCount + 1
    
    // Add delegator to list if it doesn't exist
    let delegators = toDelegate.delegators
    if (delegators.indexOf(event.params.delegator) === -1) {
      delegators.push(event.params.delegator)
      toDelegate.delegators = delegators
    }
    
    toDelegate.blockTimestamp = event.block.timestamp
    toDelegate.save()
  }
}

export function handleDelegateVotesChanged(
  event: DelegateVotesChangedEvent
): void {
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

  // Update the delegate entity with new balance
  let delegate = Delegate.load(event.params.delegate)
  if (delegate) {
    delegate.latestBalance = event.params.newBalance
    delegate.blockTimestamp = event.block.timestamp
    delegate.save()
  } else if (event.params.newBalance.gt(BigInt.fromI32(0))) {
    // Create a new delegate entity if it doesn't exist but has a balance
    let newDelegate = new Delegate(event.params.delegate)
    newDelegate.latestBalance = event.params.newBalance
    newDelegate.delegatorCount = 1  // Assume at least one delegator if there's a balance
    newDelegate.delegators = []     // We don't know the delegator here
    newDelegate.blockTimestamp = event.block.timestamp
    newDelegate.save()
  }
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

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSnapshot(event: SnapshotEvent): void {
  let entity = new Snapshot(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id

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

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}