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
import { Bytes, BigInt, Address, store } from "@graphprotocol/graph-ts"

// Constants to avoid repeated instantiation
const ZERO_BI = BigInt.fromI32(0)
const ONE_BI = BigInt.fromI32(1)

function getOrCreateAccount(address: Address): Account {
  let account = Account.load(address.toHexString())
  
  if (!account) {
    account = new Account(address.toHexString())
    account.balance = ZERO_BI
    account.delegate = address as Bytes
    account.save()
  }
  return account
}

function getOrCreateDelegate(address: Address, timestamp: BigInt): Delegate {
  let delegate = Delegate.load(address.toHexString())
  
  if (!delegate) {
    delegate = new Delegate(address.toHexString())
    delegate.latestBalance = ZERO_BI
    delegate.delegatedFromCount = ZERO_BI
    delegate.delegators = [] // Initialize empty array
    delegate.blockTimestamp = timestamp
    delegate.save()
  }
  return delegate
}

function updateDelegation(account: Account, newDelegate: Address, blockTimestamp: BigInt): void {
  let oldDelegateAddress = Address.fromBytes(account.delegate)
  
  if (oldDelegateAddress.equals(newDelegate)) {
    return
  }

  let oldDelegate = getOrCreateDelegate(oldDelegateAddress, blockTimestamp)
  let newDelegateEntity = getOrCreateDelegate(newDelegate, blockTimestamp)
  let accountBytes = Bytes.fromHexString(account.id)

  if (account.balance.gt(ZERO_BI)) {
    // Update old delegate
    oldDelegate.delegatedFromCount = oldDelegate.delegatedFromCount.minus(ONE_BI)
    
    // Ensure oldDelegate.delegators is initialized
    let oldDelegators = oldDelegate.delegators
    if (!oldDelegators) {
      oldDelegators = []
    }
    
    let newOldDelegators: Bytes[] = []
    for (let i = 0; i < oldDelegators.length; i++) {
      if (!oldDelegators[i].equals(accountBytes)) {
        newOldDelegators.push(oldDelegators[i])
      }
    }
    oldDelegate.delegators = newOldDelegators

    // Update new delegate if not self-delegation
    if (!Address.fromString(account.id).equals(newDelegate)) {
      newDelegateEntity.delegatedFromCount = newDelegateEntity.delegatedFromCount.plus(ONE_BI)
      
      // Ensure newDelegateEntity.delegators is initialized
      let currentDelegators = newDelegateEntity.delegators
      if (!currentDelegators) {
        currentDelegators = []
      }
      
      let exists = false
      for (let i = 0; i < currentDelegators.length; i++) {
        if (currentDelegators[i].equals(accountBytes)) {
          exists = true
          break
        }
      }
      
      if (!exists) {
        let newDelegators = currentDelegators
        newDelegators.push(accountBytes)
        newDelegateEntity.delegators = newDelegators
      }
    }
  }

  oldDelegate.blockTimestamp = blockTimestamp
  newDelegateEntity.blockTimestamp = blockTimestamp
  
  oldDelegate.save()
  newDelegateEntity.save()
  account.delegate = newDelegate as Bytes
  account.save()
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
  
  if (!delegate.latestBalance.equals(event.params.newBalance)) {
    delegate.latestBalance = event.params.newBalance
    delegate.blockTimestamp = event.block.timestamp
    delegate.save()
  }

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
  let value = event.params.value

  // Update balances
  fromAccount.balance = fromAccount.balance.minus(value)
  toAccount.balance = toAccount.balance.plus(value)

  // Check if delegation updates are needed
  if (fromAccount.balance.equals(ZERO_BI) || toAccount.balance.equals(value)) {
    let contract = GovernanceToken.bind(event.address)
    
    if (fromAccount.balance.equals(ZERO_BI)) {
      let fromDelegate = contract.delegates(event.params.from)
      if (!Address.fromBytes(fromAccount.delegate).equals(fromDelegate)) {
        updateDelegation(fromAccount, fromDelegate, event.block.timestamp)
      }
    }

    if (toAccount.balance.equals(value)) {
      let toDelegate = contract.delegates(event.params.to)
      if (!Address.fromBytes(toAccount.delegate).equals(toDelegate)) {
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
  entity.value = value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}