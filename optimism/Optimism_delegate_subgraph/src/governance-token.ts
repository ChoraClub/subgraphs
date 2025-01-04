// import {
//   Approval as ApprovalEvent,
//   DelegateChanged as DelegateChangedEvent,
//   DelegateVotesChanged as DelegateVotesChangedEvent,
//   OwnershipTransferred as OwnershipTransferredEvent,
//   Transfer as TransferEvent,
//   GovernanceToken
// } from "../generated/GovernanceToken/GovernanceToken"
// import {
//   Approval,
//   DelegateChanged,
//   DelegateVotesChanged,
//   Delegate,
//   OwnershipTransferred,
//   Transfer,
//   Account
// } from "../generated/schema"
// import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"

// export function handleApproval(event: ApprovalEvent): void {
//   let entity = new Approval(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.owner = event.params.owner
//   entity.spender = event.params.spender
//   entity.value = event.params.value
//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash
//   entity.save()
// }
// function getOrCreateAccount(address: Address): Account {
//   let account = Account.load(address.toHexString())
//   if (account == null) {
//     account = new Account(address.toHexString())
//     account.balance = BigInt.fromI32(0)
//     account.delegate = address
//     account.save()
//   }
//   return account as Account
// }

// function updateDelegation(account: Account, newDelegate: Address, blockTimestamp: BigInt): void {
//   let oldDelegateAddress = Address.fromString(account.delegate.toHexString())
//   let oldDelegate = Delegate.load(oldDelegateAddress.toHexString())
  
//   // Remove from old delegate if there's a change and account has non-zero balance
//   if (oldDelegate != null && !oldDelegateAddress.equals(newDelegate) && account.balance.gt(BigInt.fromI32(0))) {
//     oldDelegate.delegatedFromCount = oldDelegate.delegatedFromCount.minus(BigInt.fromI32(1))
//     let oldDelegators = oldDelegate.delegators
//     let index = oldDelegators.indexOf(Bytes.fromHexString(account.id))
//     if (index > -1) {
//       oldDelegators.splice(index, 1)
//     }
//     oldDelegate.delegators = oldDelegators
//     oldDelegate.blockTimestamp = blockTimestamp
//     oldDelegate.save()
//   }

//   let newDelegateEntity = Delegate.load(newDelegate.toHexString())
//   if (newDelegateEntity == null) {
//     newDelegateEntity = new Delegate(newDelegate.toHexString())
//     newDelegateEntity.latestBalance = BigInt.fromI32(0)
//     newDelegateEntity.delegatedFromCount = BigInt.fromI32(0)
//     newDelegateEntity.delegators = []
//   }

//   // Add to new delegate only if it's not self-delegation and account has non-zero balance
//   if (!Address.fromString(account.id).equals(newDelegate) && account.balance.gt(BigInt.fromI32(0))) {
//     newDelegateEntity.delegatedFromCount = newDelegateEntity.delegatedFromCount.plus(BigInt.fromI32(1))
//     let newDelegators = newDelegateEntity.delegators
//     if (!newDelegators.includes(Bytes.fromHexString(account.id))) {
//       newDelegators.push(Bytes.fromHexString(account.id))
//     }
//     newDelegateEntity.delegators = newDelegators
//   }

//   newDelegateEntity.blockTimestamp = blockTimestamp
//   newDelegateEntity.save()
//   account.delegate = newDelegate
//   account.save()
// }

// export function handleDelegateChanged(event: DelegateChangedEvent): void {
//   // let fromDelegateId = event.params.fromDelegate.toHexString()
//   // let toDelegateId = event.params.toDelegate.toHexString()

//   // // Handle the 'from' delegate
//   // let fromDelegate = Delegate.load(fromDelegateId)
//   // if (fromDelegate != null && !Bytes.fromHexString(fromDelegateId).equals(Bytes.fromHexString("0x0000000000000000000000000000000000000000"))) {
//   //   fromDelegate.delegatedFromCount = fromDelegate.delegatedFromCount.minus(BigInt.fromI32(1))
//   //   fromDelegate.save()
//   // }
//   // // Handle the 'to' delegate
//   // let toDelegate = Delegate.load(toDelegateId)
//   // if (toDelegate == null) {
//   //   toDelegate = new Delegate(toDelegateId)
//   //   toDelegate.latestBalance = BigInt.fromI32(0)
//   //   toDelegate.delegatedFromCount = BigInt.fromI32(0)
//   // }
//   // toDelegate.delegatedFromCount = toDelegate.delegatedFromCount.plus(BigInt.fromI32(1))
//   // toDelegate.blockTimestamp = event.block.timestamp
//   // toDelegate.save()
//   let account = getOrCreateAccount(event.params.delegator)
//   updateDelegation(account, event.params.toDelegate, event.block.timestamp)

//   let entity = new DelegateChanged(
//     event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
//   )
//   entity.delegator = event.params.delegator
//   entity.fromDelegate = event.params.fromDelegate
//   entity.toDelegate = event.params.toDelegate
//   entity.newBalance = account.balance
//   entity.balanceBlockTimestamp = event.block.timestamp
//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }
// export function handleDelegateVotesChanged(
//   event: DelegateVotesChangedEvent
// ): void {
//   let delegateId = event.params.delegate.toHexString()
  
//   let delegate = Delegate.load(delegateId)
//   if (delegate == null) {
//     delegate = new Delegate(delegateId)
//     delegate.delegatedFromCount = BigInt.fromI32(0)
//   }
  
//   delegate.latestBalance = event.params.newBalance
//   delegate.blockTimestamp = event.block.timestamp
//   delegate.save()

//   let entity = new DelegateVotesChanged(
//     event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
//   )
//   entity.delegate = event.params.delegate
//   entity.previousBalance = event.params.previousBalance
//   entity.newBalance = event.params.newBalance

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }
// export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
//   let entity = new OwnershipTransferred(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.previousOwner = event.params.previousOwner
//   entity.newOwner = event.params.newOwner
//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash
//   entity.save()
// }

// export function handleTransfer(event: TransferEvent): void {
//   let fromAccount = getOrCreateAccount(event.params.from)
//   let toAccount = getOrCreateAccount(event.params.to)

//   // Update balances
//   fromAccount.balance = fromAccount.balance.minus(event.params.value)
//   toAccount.balance = toAccount.balance.plus(event.params.value)

//   let contract = GovernanceToken.bind(event.address)
  
//  // Update delegation for 'from' account if it has changed
// let fromDelegate = contract.delegates(event.params.from)
// if (!fromAccount.delegate.equals(fromDelegate)) {
//   updateDelegation(fromAccount, fromDelegate, event.block.timestamp)
// }

// // Update delegation for 'to' account if it has changed
// let toDelegate = contract.delegates(event.params.to)
// if (!toAccount.delegate.equals(toDelegate)) {
//   updateDelegation(toAccount, toDelegate, event.block.timestamp)
// }
//   fromAccount.save()
//   toAccount.save()
//   let entity = new Transfer(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.from = event.params.from
//   entity.to = event.params.to
//   entity.value = event.params.value
//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash
//   entity.save()
// }

import {
  Approval as ApprovalEvent,
  DelegateChanged as DelegateChangedEvent,
  DelegateVotesChanged as DelegateVotesChangedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent,
  GovernanceToken
} from "../generated/GovernanceToken/GovernanceToken"
import {
  Approval,
  DelegateChanged,
  DelegateVotesChanged,
  Delegate,
  OwnershipTransferred,
  Transfer,
  Account
} from "../generated/schema"
import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"

function getOrCreateAccount(address: Address): Account {
  let account = Account.load(address.toHexString())
  if (account == null) {
    account = new Account(address.toHexString())
    account.balance = BigInt.fromI32(0)
    account.delegate = address
    account.save()
  }
  return account as Account
}

function getOrCreateDelegate(address: Address, timestamp: BigInt): Delegate {
  let delegate = Delegate.load(address.toHexString())
  if (delegate == null) {
    delegate = new Delegate(address.toHexString())
    delegate.latestBalance = BigInt.fromI32(0)
    delegate.delegatedFromCount = BigInt.fromI32(0)
    delegate.delegators = []
    delegate.blockTimestamp = timestamp
    delegate.save()
  }
  return delegate as Delegate
}

function updateDelegation(account: Account, newDelegate: Address, blockTimestamp: BigInt): void {
  let oldDelegateAddress = Address.fromString(account.delegate.toHexString())
  
  if (!oldDelegateAddress.equals(newDelegate)) {
    let oldDelegate = getOrCreateDelegate(oldDelegateAddress, blockTimestamp)
    let newDelegateEntity = getOrCreateDelegate(newDelegate, blockTimestamp)

    if (account.balance.gt(BigInt.fromI32(0))) {
      // Remove from old delegate
      oldDelegate.delegatedFromCount = oldDelegate.delegatedFromCount.minus(BigInt.fromI32(1))
      let oldDelegators = oldDelegate.delegators
      let index = oldDelegators.indexOf(Bytes.fromHexString(account.id))
      if (index > -1) {
        oldDelegators.splice(index, 1)
      }
      oldDelegate.delegators = oldDelegators

      // Add to new delegate if it's not self-delegation
      if (!Address.fromString(account.id).equals(newDelegate)) {
        newDelegateEntity.delegatedFromCount = newDelegateEntity.delegatedFromCount.plus(BigInt.fromI32(1))
        let newDelegators = newDelegateEntity.delegators
        if (!newDelegators.includes(Bytes.fromHexString(account.id))) {
          newDelegators.push(Bytes.fromHexString(account.id))
        }
        newDelegateEntity.delegators = newDelegators
      }
    }

    oldDelegate.blockTimestamp = blockTimestamp
    newDelegateEntity.blockTimestamp = blockTimestamp
    oldDelegate.save()
    newDelegateEntity.save()
    account.delegate = newDelegate
    account.save()
  }
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

export function handleDelegateChanged(event: DelegateChangedEvent): void {
  let account = getOrCreateAccount(event.params.delegator)
  updateDelegation(account, event.params.toDelegate, event.block.timestamp)

  let entity = new DelegateChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.delegator = event.params.delegator
  entity.fromDelegate = event.params.fromDelegate
  entity.toDelegate = event.params.toDelegate
  entity.newBalance = account.balance
  entity.balanceBlockTimestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDelegateVotesChanged(event: DelegateVotesChangedEvent): void {
  let delegate = getOrCreateDelegate(event.params.delegate, event.block.timestamp)
  
  delegate.latestBalance = event.params.newBalance
  delegate.blockTimestamp = event.block.timestamp
  delegate.save()

  let entity = new DelegateVotesChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.delegate = event.params.delegate
  entity.previousBalance = event.params.previousBalance
  entity.newBalance = event.params.newBalance
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
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
  let fromAccount = getOrCreateAccount(event.params.from)
  let toAccount = getOrCreateAccount(event.params.to)

  // Update balances
  fromAccount.balance = fromAccount.balance.minus(event.params.value)
  toAccount.balance = toAccount.balance.plus(event.params.value)

  // Update delegations if necessary
  if (fromAccount.balance.equals(BigInt.fromI32(0)) || toAccount.balance.equals(event.params.value)) {
    let contract = GovernanceToken.bind(event.address)
    
    // Update delegation for 'from' account if it has changed to zero balance
    if (fromAccount.balance.equals(BigInt.fromI32(0))) {
      let fromDelegate = contract.delegates(event.params.from)
      if (!fromAccount.delegate.equals(fromDelegate)) {
        updateDelegation(fromAccount, fromDelegate, event.block.timestamp)
      }
    }

    // Update delegation for 'to' account if it has changed from zero balance
    if (toAccount.balance.equals(event.params.value)) {
      let toDelegate = contract.delegates(event.params.to)
      if (!toAccount.delegate.equals(toDelegate)) {
        updateDelegation(toAccount, toDelegate, event.block.timestamp)
      }
    }
  }

  fromAccount.save()
  toAccount.save()

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
