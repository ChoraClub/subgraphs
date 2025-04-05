import {
  Initialized as InitializedEvent,
  LateQuorumVoteExtensionSet as LateQuorumVoteExtensionSetEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  ProposalCanceled as ProposalCanceledEvent,
  ProposalCreated as ProposalCreatedEvent,
  ProposalExecuted as ProposalExecutedEvent,
  ProposalExtended as ProposalExtendedEvent,
  ProposalQueued as ProposalQueuedEvent,
  ProposalThresholdSet as ProposalThresholdSetEvent,
  QuorumNumeratorUpdated as QuorumNumeratorUpdatedEvent,
  TimelockChange as TimelockChangeEvent,
  VoteCast as VoteCastEvent,
  VoteCastWithParams as VoteCastWithParamsEvent,
} from "../generated/L2ArbitrumGovernor/L2ArbitrumGovernor"
import { Bytes } from "@graphprotocol/graph-ts";
import {
  Initialized,
  LateQuorumVoteExtensionSet,
  OwnershipTransferred,
  ProposalCanceled,
  ProposalCreated,
  ProposalExecuted,
  ProposalExtended,
  ProposalQueued,
  ProposalThresholdSet,
  QuorumNumeratorUpdated,
  TimelockChange,
  VoteCast,
  VoteCastWithParams,
  ProposalVoteSummary,
  VoterDetail,
  ProposalDailyVoteSummary,
  ContractSource
} from "../generated/schema"
import {
  BigInt,
  BigDecimal,
  store,
  log
} from "@graphprotocol/graph-ts"
import { Address } from "@graphprotocol/graph-ts"

// Utility constants
const ZERO_BI = BigInt.fromI32(0)
const ZERO_BD = BigDecimal.fromString("0")
const ONE_BI = BigInt.fromI32(1)
const SECONDS_PER_DAY = BigInt.fromI32(86400)



// Define contract addresses
const L1_CONTRACT_ADDRESS = Address.fromString("0x789fC99093B09aD01C34DC7251D0C89ce743e5a4") // Replace with actual L1 contract address
const L2_CONTRACT_ADDRESS = Address.fromString("0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9") // Replace with actual L2 contract address

// Helper function to determine contract source
function getContractSource(contractAddress: Address): ContractSource {
  if (contractAddress.equals(L1_CONTRACT_ADDRESS)) {
    let contractSource = new ContractSource("0x789fC99093B09aD01C34DC7251D0C89ce743e5a4")
    contractSource.contractAddress = "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
    contractSource.governors = "Arbitrum Treasury"
    return contractSource
  }
  if (contractAddress.equals(L2_CONTRACT_ADDRESS)) {
    let contractSource = new ContractSource("0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9")
    contractSource.contractAddress = "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
    contractSource.governors = "Arbitrum Core"
    return contractSource
  }
  let contractSource = new ContractSource("default")
  contractSource.contractAddress = ''
  contractSource.governors = ''
  return contractSource
}


// Utility function to get start of day timestamp
function getStartOfDay(timestamp: BigInt): BigInt {
  return timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY)
}

// Utility function to format date as YYYY-MM-DD
function formatDate(timestamp: BigInt): string {
  let date = new Date(timestamp.toI64() * 1000)
  return date.toISOString().split('T')[0]
}


function updateProposalDailyVoteSummary(
  proposalId: BigInt,
  support: i32,
  weight: BigInt,
  timestamp: BigInt
): void {
  let dayStart = getStartOfDay(timestamp)
  let summaryId = proposalId.toString() + "-" + dayStart.toString()
  
  let dailySummary = ProposalDailyVoteSummary.load(summaryId)
  
  if (!dailySummary) {
    dailySummary = new ProposalDailyVoteSummary(summaryId)
    dailySummary.proposalId = proposalId
    dailySummary.day = dayStart
    dailySummary.dayString = formatDate(timestamp)
    dailySummary.votesFor = ZERO_BI
    dailySummary.votesAgainst = ZERO_BI
    dailySummary.votesAbstain = ZERO_BI
    dailySummary.totalVotes = ZERO_BI
    dailySummary.totalWeight = ZERO_BI
    dailySummary.weightFor = ZERO_BI
    dailySummary.weightAgainst = ZERO_BI
    dailySummary.weightAbstain = ZERO_BI
    
    // Link to proposal
    dailySummary.proposal = Bytes.fromByteArray(Bytes.fromBigInt(proposalId))
  }
  
  // Update counters
  dailySummary.totalVotes = dailySummary.totalVotes.plus(ONE_BI)
  dailySummary.totalWeight = dailySummary.totalWeight.plus(weight)
  
  if (support === 0) {
    dailySummary.votesAgainst = dailySummary.votesAgainst.plus(ONE_BI)
    dailySummary.weightAgainst = dailySummary.weightAgainst.plus(weight)
  } else if (support === 1) {
    dailySummary.votesFor = dailySummary.votesFor.plus(ONE_BI)
    dailySummary.weightFor = dailySummary.weightFor.plus(weight)
  } else if (support === 2) {
    dailySummary.votesAbstain = dailySummary.votesAbstain.plus(ONE_BI)
    dailySummary.weightAbstain = dailySummary.weightAbstain.plus(weight)
  }
  
  // Calculate percentages
  if (dailySummary.totalVotes.gt(ZERO_BI)) {
    dailySummary.percentFor = dailySummary.votesFor.toBigDecimal()
      .div(dailySummary.totalVotes.toBigDecimal())
      .times(BigDecimal.fromString("100"))
    
    dailySummary.percentAgainst = dailySummary.votesAgainst.toBigDecimal()
      .div(dailySummary.totalVotes.toBigDecimal())
      .times(BigDecimal.fromString("100"))
    
    dailySummary.percentAbstain = dailySummary.votesAbstain.toBigDecimal()
      .div(dailySummary.totalVotes.toBigDecimal())
      .times(BigDecimal.fromString("100"))
  }
  
  dailySummary.save()
}
// Utility function to update/create ProposalVoteSummary

function updateProposalVoteSummary(
  proposalId: BigInt,
  support: i32,
  weight: BigInt,
  voter: Bytes,
  timestamp: BigInt,
  transactionHash: Bytes
): void {
  let summaryId = proposalId.toString()
  let summary = ProposalVoteSummary.load(summaryId)
  
  if (!summary) {
    summary = new ProposalVoteSummary(summaryId)
    summary.proposalId = proposalId
    summary.totalVotes = ZERO_BI
    summary.totalWeight = ZERO_BI
    summary.votesFor = ZERO_BI
    summary.votesAgainst = ZERO_BI
    summary.votesAbstain = ZERO_BI
    summary.weightFor = ZERO_BI
    summary.weightAgainst = ZERO_BI
    summary.weightAbstain = ZERO_BI
    summary.lastUpdated = timestamp
    
    // Link to proposal
    let proposalIdBytes = Bytes.fromByteArray(Bytes.fromBigInt(proposalId))
    summary.proposal = proposalIdBytes
  }

  // Create voter detail
  let voterDetailId = `${proposalId.toString()}-${voter.toHexString()}-${timestamp.toString()}`
  let voterDetail = new VoterDetail(voterDetailId)
  voterDetail.voter = voter
  voterDetail.proposalId = proposalId
  voterDetail.votingPower = weight
  voterDetail.support = support
  voterDetail.timestamp = timestamp
  voterDetail.transactionHash = transactionHash
  voterDetail.proposal = Bytes.fromByteArray(Bytes.fromBigInt(proposalId))
  voterDetail.save()

  // Update summary counters
  summary.totalVotes = summary.totalVotes.plus(ONE_BI)
  summary.totalWeight = summary.totalWeight.plus(weight)
  
  if (support === 0) {
    summary.votesAgainst = summary.votesAgainst.plus(ONE_BI)
    summary.weightAgainst = summary.weightAgainst.plus(weight)
  } else if (support === 1) {
    summary.votesFor = summary.votesFor.plus(ONE_BI)
    summary.weightFor = summary.weightFor.plus(weight)
  } else if (support === 2) {
    summary.votesAbstain = summary.votesAbstain.plus(ONE_BI)
    summary.weightAbstain = summary.weightAbstain.plus(weight)
  }
  
  // Calculate percentages
  if (summary.totalVotes.gt(ZERO_BI)) {
    summary.percentFor = summary.votesFor.toBigDecimal()
      .div(summary.totalVotes.toBigDecimal())
      .times(BigDecimal.fromString("100"))
    
    summary.percentAgainst = summary.votesAgainst.toBigDecimal()
      .div(summary.totalVotes.toBigDecimal())
      .times(BigDecimal.fromString("100"))
    
    summary.percentAbstain = summary.votesAbstain.toBigDecimal()
      .div(summary.totalVotes.toBigDecimal())
      .times(BigDecimal.fromString("100"))
  }

  summary.lastUpdated = timestamp
  summary.save()
}
// Function to track voting breakdown by 24-hour periods
// function updateVotingPeriodBreakdown(
//   proposalId: BigInt, 
//   support: i32, 
//   weight: BigInt,
//   timestamp: BigInt
// ): void {
//   // Calculate voting periods (24-hour intervals)
//   let proposal = ProposalCreated.load(Bytes.fromBigInt(proposalId))
//   if (!proposal)
//     {
//       log.warning('No ProposalCreateds found for proposalId: {}', [proposalId.toString()])
//       return
//     } 

//   let proposalStartTime = proposal.blockTimestamp
//   let periodIndex = timestamp.minus(proposalStartTime).div(DAY_IN_SECONDS)
//   let periodId = `${proposalId.toString()}-${periodIndex.toString()}`
//   let periodBreakdown = VotingPeriodCount.load(periodId)
  
//   if (!periodBreakdown) {
//     periodBreakdown = new VotingPeriodCount(periodId)
//     periodBreakdown.proposalId = proposalId
//     periodBreakdown.periodStartTimestamp = proposalStartTime.plus(periodIndex.times(DAY_IN_SECONDS))
//     periodBreakdown.periodEndTimestamp = proposalStartTime.plus(periodIndex.plus(ONE_BI).times(DAY_IN_SECONDS))
//     periodBreakdown.votesFor = ZERO_BI
//     periodBreakdown.votesAgainst = ZERO_BI
//     periodBreakdown.votesAbstain = ZERO_BI
//     periodBreakdown.totalVotes = ZERO_BI
//     periodBreakdown.totalWeight = ZERO_BI
//   }
  
//   // Update period breakdown
//   periodBreakdown.totalVotes = periodBreakdown.totalVotes.plus(ONE_BI)
//   periodBreakdown.totalWeight = periodBreakdown.totalWeight.plus(weight)
  
//   if (support === 0) {  // Against
//     periodBreakdown.votesAgainst = periodBreakdown.votesAgainst.plus(ONE_BI)
//   } else if (support === 1) {  // For
//     periodBreakdown.votesFor = periodBreakdown.votesFor.plus(ONE_BI)
//   } else if (support === 2) {  // Abstain
//     periodBreakdown.votesAbstain = periodBreakdown.votesAbstain.plus(ONE_BI)
//   }
  
//   periodBreakdown.save()
// }


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

export function handleLateQuorumVoteExtensionSet(
  event: LateQuorumVoteExtensionSetEvent
): void {
  let entity = new LateQuorumVoteExtensionSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldVoteExtension = event.params.oldVoteExtension
  entity.newVoteExtension = event.params.newVoteExtension

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

export function handleProposalCanceled(event: ProposalCanceledEvent): void {
  let entity = new ProposalCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proposalId = event.params.proposalId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProposalCreated(event: ProposalCreatedEvent): void {
  let entity = new ProposalCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  // Get contract source
  let contractSourceId = event.address.toHexString()
  let contractSource = ContractSource.load(contractSourceId)
  if (!contractSource) {
    contractSource = new ContractSource(contractSourceId)
    contractSource.contractAddress = event.address.toHexString()
    contractSource.governors = event.address.equals(L1_CONTRACT_ADDRESS) 
      ? "Arbitrum Treasury" 
      : "Arbitrum Core"
    contractSource.save()
  }
  
  entity.proposalId = event.params.proposalId
  entity.proposer = event.params.proposer
  entity.targets = changetype<Bytes[]>(event.params.targets)
  entity.values = event.params.values
  entity.signatures = event.params.signatures
  entity.calldatas = event.params.calldatas
  entity.startBlock = event.params.startBlock
  entity.endBlock = event.params.endBlock
  entity.description = event.params.description
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // Reference the contract source
  entity.contractSource = contractSourceId

  entity.save()
}


export function handleProposalExecuted(event: ProposalExecutedEvent): void {
  let entity = new ProposalExecuted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proposalId = event.params.proposalId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProposalExtended(event: ProposalExtendedEvent): void {
  let entity = new ProposalExtended(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proposalId = event.params.proposalId
  entity.extendedDeadline = event.params.extendedDeadline

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProposalQueued(event: ProposalQueuedEvent): void {
  let entity = new ProposalQueued(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proposalId = event.params.proposalId
  entity.eta = event.params.eta

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProposalThresholdSet(
  event: ProposalThresholdSetEvent
): void {
  let entity = new ProposalThresholdSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldProposalThreshold = event.params.oldProposalThreshold
  entity.newProposalThreshold = event.params.newProposalThreshold

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuorumNumeratorUpdated(
  event: QuorumNumeratorUpdatedEvent
): void {
  let entity = new QuorumNumeratorUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldQuorumNumerator = event.params.oldQuorumNumerator
  entity.newQuorumNumerator = event.params.newQuorumNumerator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTimelockChange(event: TimelockChangeEvent): void {
  let entity = new TimelockChange(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldTimelock = event.params.oldTimelock
  entity.newTimelock = event.params.newTimelock

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
export function handleVoteCast(event: VoteCastEvent): void {
  let entity = new VoteCast(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  // Find the associated proposal
  let proposalId = event.params.proposalId
  let proposalIdBytes = Bytes.fromByteArray(Bytes.fromBigInt(proposalId))
  
  // Create entity fields
  entity.voter = event.params.voter
  entity.proposalId = proposalId
  entity.support = event.params.support
  entity.weight = event.params.weight
  entity.reason = event.params.reason
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.proposal = proposalIdBytes // Set the proposal reference

  entity.save()

  // Update vote summaries
  updateProposalVoteSummary(
    proposalId,
    event.params.support,
    event.params.weight,
    event.params.voter,
    event.block.timestamp,
    event.transaction.hash
  )
  
  updateProposalDailyVoteSummary(
    proposalId,
    event.params.support,
    event.params.weight,
    event.block.timestamp
  )
}


export function handleVoteCastWithParams(event: VoteCastWithParamsEvent): void {
  let entity = new VoteCastWithParams(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  // Find the associated proposal
  let proposalId = event.params.proposalId
  let proposalIdBytes = Bytes.fromByteArray(Bytes.fromBigInt(proposalId))
  
  entity.voter = event.params.voter
  entity.proposalId = proposalId
  entity.support = event.params.support
  entity.weight = event.params.weight
  entity.reason = event.params.reason
  entity.params = event.params.params
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.proposal = proposalIdBytes // Set the proposal reference

  entity.save()

  updateProposalVoteSummary(
    proposalId,
    event.params.support,
    event.params.weight,
    event.params.voter,
    event.block.timestamp,
    event.transaction.hash
  )
  
  updateProposalDailyVoteSummary(
    proposalId,
    event.params.support,
    event.params.weight,
    event.block.timestamp
  )
}


