import {
  Initialized as InitializedEvent,
  ProposalCanceled as ProposalCanceledEvent,
  ProposalCreated as ProposalCreatedEvent,
  ProposalCreated1 as ProposalCreated1Event,
  ProposalCreated2 as ProposalCreated2Event,
  ProposalCreated3 as ProposalCreated3Event,
  ProposalDeadlineUpdated as ProposalDeadlineUpdatedEvent,
  ProposalExecuted as ProposalExecutedEvent,
  ProposalThresholdSet as ProposalThresholdSetEvent,
  ProposalTypeUpdated as ProposalTypeUpdatedEvent,
  QuorumNumeratorUpdated as QuorumNumeratorUpdatedEvent,
  VoteCast as VoteCastEvent,
  VoteCastWithParams as VoteCastWithParamsEvent,
  VotingDelaySet as VotingDelaySetEvent,
  VotingPeriodSet as VotingPeriodSetEvent
} from "../generated/OptimismGovernorV6/OptimismGovernorV6"
import { Bytes,log } from "@graphprotocol/graph-ts";
import {
  Initialized,
  ProposalCanceled,
  ProposalCreated,
  ProposalCreated1,
  ProposalCreated2,
  ProposalCreated3,
  ProposalDeadlineUpdated,
  ProposalExecuted,
  ProposalThresholdSet,
  ProposalTypeUpdated,
  QuorumNumeratorUpdated,
  VoteCast,
  VoteCastWithParams,
  VotingDelaySet,
  VotingPeriodSet,
  ProposalDailyVoteSummary,
  ProposalVoteSummary,
  VoterDetail
} from "../generated/schema"
import {
  BigInt,
  BigDecimal,
  store
} from "@graphprotocol/graph-ts"
// Utility constants
const ZERO_BI = BigInt.fromI32(0)
const ZERO_BD = BigDecimal.fromString("0")
const ONE_BI = BigInt.fromI32(1)
const SECONDS_PER_DAY = BigInt.fromI32(86400)

// Utility function to get start of day
function getStartOfDay(timestamp: BigInt): BigInt {
  return timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY)
}

// Utility function to format date as YYYY-MM-DD
function formatDate(timestamp: BigInt): string {
  let date = new Date(timestamp.toI64() * 1000)
  return date.toISOString().split('T')[0]
}

function findProposalById(proposalId: BigInt): Bytes | null {
  // Try to find the proposal in different ProposalCreated event types
  let proposalEvent = ProposalCreated.load(Bytes.fromByteArray(Bytes.fromBigInt(proposalId)));
  if (proposalEvent) return proposalEvent.id

  let proposal1Event = ProposalCreated1.load(Bytes.fromByteArray(Bytes.fromBigInt(proposalId)));
  if (proposal1Event) return proposal1Event.id

  let proposal2Event = ProposalCreated2.load(Bytes.fromByteArray(Bytes.fromBigInt(proposalId)));
  if (proposal2Event) return proposal2Event.id

  let proposal3Event = ProposalCreated3.load(Bytes.fromByteArray(Bytes.fromBigInt(proposalId)));
  if (proposal3Event) return proposal3Event.id

  return null
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
  
  // Create if not exists
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
    
    // Link to original proposal from any of the ProposalCreated event types
    let proposalLinkId = findProposalById(proposalId)
    if (proposalLinkId) {
      log.info('Proposal found for proposalId: {}', [proposalId.toString()])
      dailySummary.proposal = proposalLinkId
    }
  }
  
  // Update counters based on support type
  dailySummary.totalVotes = dailySummary.totalVotes.plus(ONE_BI)
  dailySummary.totalWeight = dailySummary.totalWeight.plus(weight)
  
  if (support === 0) {  // Against
    dailySummary.votesAgainst = dailySummary.votesAgainst.plus(ONE_BI)
    dailySummary.weightAgainst = dailySummary.weightAgainst.plus(weight)
  } else if (support === 1) {  // For
    dailySummary.votesFor = dailySummary.votesFor.plus(ONE_BI)
    dailySummary.weightFor = dailySummary.weightFor.plus(weight)
  } else if (support === 2) {  // Abstain
    dailySummary.votesAbstain = dailySummary.votesAbstain.plus(ONE_BI)
    dailySummary.weightAbstain = dailySummary.weightAbstain.plus(weight)
  }
  
  // Calculate percentages
  dailySummary.percentFor = dailySummary.totalVotes.gt(ZERO_BI)
    ? dailySummary.votesFor.toBigDecimal().div(dailySummary.totalVotes.toBigDecimal()).times(BigDecimal.fromString("100"))
    : ZERO_BD
  
  dailySummary.percentAgainst = dailySummary.totalVotes.gt(ZERO_BI)
    ? dailySummary.votesAgainst.toBigDecimal().div(dailySummary.totalVotes.toBigDecimal()).times(BigDecimal.fromString("100"))
    : ZERO_BD
  
  dailySummary.percentAbstain = dailySummary.totalVotes.gt(ZERO_BI)
    ? dailySummary.votesAbstain.toBigDecimal().div(dailySummary.totalVotes.toBigDecimal()).times(BigDecimal.fromString("100"))
    : ZERO_BD
  
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
  
  // Create if not exists
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
    summary.voterDetails = []
    summary.dailySummaries = []; // Initialize with an empty array

    // // Optional: Link to original proposal
    // let proposal = ProposalCreated.load(summaryId)
    // if (proposal) {
    //   summary.proposal = proposal.id
    // }
  }
   // Add Voter Details
   let voterDetailId = `${summaryId}-${voter.toHexString()}-${timestamp.toString()}`
   let voterDetail = new VoterDetail(voterDetailId)
   voterDetail.voter = voter
   voterDetail.proposalId = proposalId
   voterDetail.votingPower = weight
   voterDetail.support = support
   voterDetail.timestamp = timestamp
   voterDetail.transactionHash = transactionHash
   voterDetail.save()
   
   // Update summary's voter details
   let voterDetails = summary.voterDetails
   voterDetails.push(voterDetailId)
   summary.voterDetails = voterDetails

  // Update counters based on support type
  summary.totalVotes = summary.totalVotes.plus(ONE_BI)
  summary.totalWeight = summary.totalWeight.plus(weight)
  
  if (support === 0) {  // Against
    summary.votesAgainst = summary.votesAgainst.plus(ONE_BI)
    summary.weightAgainst = summary.weightAgainst.plus(weight)
  } else if (support === 1) {  // For
    summary.votesFor = summary.votesFor.plus(ONE_BI)
    summary.weightFor = summary.weightFor.plus(weight)
  } else if (support === 2) {  // Abstain
    summary.votesAbstain = summary.votesAbstain.plus(ONE_BI)
    summary.weightAbstain = summary.weightAbstain.plus(weight)
  }
  
  // Calculate percentages (optional)
  summary.percentFor = summary.totalVotes.gt(ZERO_BI)
    ? summary.votesFor.toBigDecimal().div(summary.totalVotes.toBigDecimal()).times(BigDecimal.fromString("100"))
    : ZERO_BD
  
  summary.percentAgainst = summary.totalVotes.gt(ZERO_BI)
    ? summary.votesAgainst.toBigDecimal().div(summary.totalVotes.toBigDecimal()).times(BigDecimal.fromString("100"))
    : ZERO_BD
  
  summary.percentAbstain = summary.totalVotes.gt(ZERO_BI)
    ? summary.votesAbstain.toBigDecimal().div(summary.totalVotes.toBigDecimal()).times(BigDecimal.fromString("100"))
    : ZERO_BD
  
  summary.lastUpdated = timestamp
  summary.save()
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
  entity.proposalId = event.params.proposalId
  entity.proposer = event.params.proposer
  entity.targets = changetype<Bytes[]>(event.params.targets)
  entity.values = event.params.values
  entity.signatures = event.params.signatures
  entity.calldatas = event.params.calldatas
  entity.startBlock = event.params.startBlock
  entity.endBlock = event.params.endBlock
  entity.description = event.params.description
  entity.proposalType = event.params.proposalType

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProposalCreated1(event: ProposalCreated1Event): void {
  let entity = new ProposalCreated1(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proposalId = event.params.proposalId
  entity.proposer = event.params.proposer
  entity.votingModule = event.params.votingModule
  entity.proposalData = event.params.proposalData
  entity.startBlock = event.params.startBlock
  entity.endBlock = event.params.endBlock
  entity.description = event.params.description
  entity.proposalType = event.params.proposalType

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProposalCreated2(event: ProposalCreated2Event): void {
  let entity = new ProposalCreated2(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proposalId = event.params.proposalId
  entity.proposer = event.params.proposer
  entity.votingModule = event.params.votingModule
  entity.proposalData = event.params.proposalData
  entity.startBlock = event.params.startBlock
  entity.endBlock = event.params.endBlock
  entity.description = event.params.description

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProposalCreated3(event: ProposalCreated3Event): void {
  let entity = new ProposalCreated3(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
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

  entity.save()
}

export function handleProposalDeadlineUpdated(
  event: ProposalDeadlineUpdatedEvent
): void {
  let entity = new ProposalDeadlineUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proposalId = event.params.proposalId
  entity.deadline = event.params.deadline

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

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

export function handleProposalTypeUpdated(
  event: ProposalTypeUpdatedEvent
): void {
  let entity = new ProposalTypeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proposalId = event.params.proposalId
  entity.proposalType = event.params.proposalType

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

export function handleVoteCast(event: VoteCastEvent): void {
  let entity = new VoteCast(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.voter = event.params.voter
  entity.proposalId = event.params.proposalId
  entity.support = event.params.support
  entity.weight = event.params.weight
  entity.reason = event.params.reason

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
    // Update or Create ProposalVoteSummary
    updateProposalVoteSummary(
      event.params.proposalId, 
      event.params.support, 
      event.params.weight,
      event.params.voter,
      event.block.timestamp,
      event.transaction.hash
    )
    updateProposalDailyVoteSummary(
      event.params.proposalId, 
      event.params.support, 
      event.params.weight,
      event.block.timestamp
    )
}

export function handleVoteCastWithParams(event: VoteCastWithParamsEvent): void {
  let entity = new VoteCastWithParams(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.voter = event.params.voter
  entity.proposalId = event.params.proposalId
  entity.support = event.params.support
  entity.weight = event.params.weight
  entity.reason = event.params.reason
  entity.params = event.params.params

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
   // Update or Create ProposalVoteSummary
   updateProposalVoteSummary(
    event.params.proposalId, 
    event.params.support, 
    event.params.weight,
    event.params.voter,
    event.block.timestamp,
    event.transaction.hash
  )
  updateProposalDailyVoteSummary(
    event.params.proposalId, 
    event.params.support, 
    event.params.weight,
    event.block.timestamp
  )
}

export function handleVotingDelaySet(event: VotingDelaySetEvent): void {
  let entity = new VotingDelaySet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldVotingDelay = event.params.oldVotingDelay
  entity.newVotingDelay = event.params.newVotingDelay

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVotingPeriodSet(event: VotingPeriodSetEvent): void {
  let entity = new VotingPeriodSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldVotingPeriod = event.params.oldVotingPeriod
  entity.newVotingPeriod = event.params.newVotingPeriod

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
