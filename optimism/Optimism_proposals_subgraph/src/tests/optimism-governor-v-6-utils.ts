import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
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
  VotingPeriodSet
} from "../generated/OptimismGovernorV6/OptimismGovernorV6"

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createProposalCanceledEvent(
  proposalId: BigInt
): ProposalCanceled {
  let proposalCanceledEvent = changetype<ProposalCanceled>(newMockEvent())

  proposalCanceledEvent.parameters = new Array()

  proposalCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )

  return proposalCanceledEvent
}

export function createProposalCreatedEvent(
  proposalId: BigInt,
  proposer: Address,
  targets: Array<Address>,
  values: Array<BigInt>,
  signatures: Array<string>,
  calldatas: Array<Bytes>,
  startBlock: BigInt,
  endBlock: BigInt,
  description: string,
  proposalType: i32
): ProposalCreated {
  let proposalCreatedEvent = changetype<ProposalCreated>(newMockEvent())

  proposalCreatedEvent.parameters = new Array()

  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam("targets", ethereum.Value.fromAddressArray(targets))
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "values",
      ethereum.Value.fromUnsignedBigIntArray(values)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "signatures",
      ethereum.Value.fromStringArray(signatures)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "calldatas",
      ethereum.Value.fromBytesArray(calldatas)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "startBlock",
      ethereum.Value.fromUnsignedBigInt(startBlock)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endBlock",
      ethereum.Value.fromUnsignedBigInt(endBlock)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(proposalType))
    )
  )

  return proposalCreatedEvent
}

export function createProposalCreated1Event(
  proposalId: BigInt,
  proposer: Address,
  votingModule: Address,
  proposalData: Bytes,
  startBlock: BigInt,
  endBlock: BigInt,
  description: string,
  proposalType: i32
): ProposalCreated1 {
  let proposalCreated1Event = changetype<ProposalCreated1>(newMockEvent())

  proposalCreated1Event.parameters = new Array()

  proposalCreated1Event.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  proposalCreated1Event.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )
  proposalCreated1Event.parameters.push(
    new ethereum.EventParam(
      "votingModule",
      ethereum.Value.fromAddress(votingModule)
    )
  )
  proposalCreated1Event.parameters.push(
    new ethereum.EventParam(
      "proposalData",
      ethereum.Value.fromBytes(proposalData)
    )
  )
  proposalCreated1Event.parameters.push(
    new ethereum.EventParam(
      "startBlock",
      ethereum.Value.fromUnsignedBigInt(startBlock)
    )
  )
  proposalCreated1Event.parameters.push(
    new ethereum.EventParam(
      "endBlock",
      ethereum.Value.fromUnsignedBigInt(endBlock)
    )
  )
  proposalCreated1Event.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  proposalCreated1Event.parameters.push(
    new ethereum.EventParam(
      "proposalType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(proposalType))
    )
  )

  return proposalCreated1Event
}

export function createProposalCreated2Event(
  proposalId: BigInt,
  proposer: Address,
  votingModule: Address,
  proposalData: Bytes,
  startBlock: BigInt,
  endBlock: BigInt,
  description: string
): ProposalCreated2 {
  let proposalCreated2Event = changetype<ProposalCreated2>(newMockEvent())

  proposalCreated2Event.parameters = new Array()

  proposalCreated2Event.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  proposalCreated2Event.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )
  proposalCreated2Event.parameters.push(
    new ethereum.EventParam(
      "votingModule",
      ethereum.Value.fromAddress(votingModule)
    )
  )
  proposalCreated2Event.parameters.push(
    new ethereum.EventParam(
      "proposalData",
      ethereum.Value.fromBytes(proposalData)
    )
  )
  proposalCreated2Event.parameters.push(
    new ethereum.EventParam(
      "startBlock",
      ethereum.Value.fromUnsignedBigInt(startBlock)
    )
  )
  proposalCreated2Event.parameters.push(
    new ethereum.EventParam(
      "endBlock",
      ethereum.Value.fromUnsignedBigInt(endBlock)
    )
  )
  proposalCreated2Event.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )

  return proposalCreated2Event
}

export function createProposalCreated3Event(
  proposalId: BigInt,
  proposer: Address,
  targets: Array<Address>,
  values: Array<BigInt>,
  signatures: Array<string>,
  calldatas: Array<Bytes>,
  startBlock: BigInt,
  endBlock: BigInt,
  description: string
): ProposalCreated3 {
  let proposalCreated3Event = changetype<ProposalCreated3>(newMockEvent())

  proposalCreated3Event.parameters = new Array()

  proposalCreated3Event.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  proposalCreated3Event.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )
  proposalCreated3Event.parameters.push(
    new ethereum.EventParam("targets", ethereum.Value.fromAddressArray(targets))
  )
  proposalCreated3Event.parameters.push(
    new ethereum.EventParam(
      "values",
      ethereum.Value.fromUnsignedBigIntArray(values)
    )
  )
  proposalCreated3Event.parameters.push(
    new ethereum.EventParam(
      "signatures",
      ethereum.Value.fromStringArray(signatures)
    )
  )
  proposalCreated3Event.parameters.push(
    new ethereum.EventParam(
      "calldatas",
      ethereum.Value.fromBytesArray(calldatas)
    )
  )
  proposalCreated3Event.parameters.push(
    new ethereum.EventParam(
      "startBlock",
      ethereum.Value.fromUnsignedBigInt(startBlock)
    )
  )
  proposalCreated3Event.parameters.push(
    new ethereum.EventParam(
      "endBlock",
      ethereum.Value.fromUnsignedBigInt(endBlock)
    )
  )
  proposalCreated3Event.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )

  return proposalCreated3Event
}

export function createProposalDeadlineUpdatedEvent(
  proposalId: BigInt,
  deadline: BigInt
): ProposalDeadlineUpdated {
  let proposalDeadlineUpdatedEvent = changetype<ProposalDeadlineUpdated>(
    newMockEvent()
  )

  proposalDeadlineUpdatedEvent.parameters = new Array()

  proposalDeadlineUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  proposalDeadlineUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "deadline",
      ethereum.Value.fromUnsignedBigInt(deadline)
    )
  )

  return proposalDeadlineUpdatedEvent
}

export function createProposalExecutedEvent(
  proposalId: BigInt
): ProposalExecuted {
  let proposalExecutedEvent = changetype<ProposalExecuted>(newMockEvent())

  proposalExecutedEvent.parameters = new Array()

  proposalExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )

  return proposalExecutedEvent
}

export function createProposalThresholdSetEvent(
  oldProposalThreshold: BigInt,
  newProposalThreshold: BigInt
): ProposalThresholdSet {
  let proposalThresholdSetEvent = changetype<ProposalThresholdSet>(
    newMockEvent()
  )

  proposalThresholdSetEvent.parameters = new Array()

  proposalThresholdSetEvent.parameters.push(
    new ethereum.EventParam(
      "oldProposalThreshold",
      ethereum.Value.fromUnsignedBigInt(oldProposalThreshold)
    )
  )
  proposalThresholdSetEvent.parameters.push(
    new ethereum.EventParam(
      "newProposalThreshold",
      ethereum.Value.fromUnsignedBigInt(newProposalThreshold)
    )
  )

  return proposalThresholdSetEvent
}

export function createProposalTypeUpdatedEvent(
  proposalId: BigInt,
  proposalType: i32
): ProposalTypeUpdated {
  let proposalTypeUpdatedEvent = changetype<ProposalTypeUpdated>(newMockEvent())

  proposalTypeUpdatedEvent.parameters = new Array()

  proposalTypeUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  proposalTypeUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(proposalType))
    )
  )

  return proposalTypeUpdatedEvent
}

export function createQuorumNumeratorUpdatedEvent(
  oldQuorumNumerator: BigInt,
  newQuorumNumerator: BigInt
): QuorumNumeratorUpdated {
  let quorumNumeratorUpdatedEvent = changetype<QuorumNumeratorUpdated>(
    newMockEvent()
  )

  quorumNumeratorUpdatedEvent.parameters = new Array()

  quorumNumeratorUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldQuorumNumerator",
      ethereum.Value.fromUnsignedBigInt(oldQuorumNumerator)
    )
  )
  quorumNumeratorUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newQuorumNumerator",
      ethereum.Value.fromUnsignedBigInt(newQuorumNumerator)
    )
  )

  return quorumNumeratorUpdatedEvent
}

export function createVoteCastEvent(
  voter: Address,
  proposalId: BigInt,
  support: i32,
  weight: BigInt,
  reason: string
): VoteCast {
  let voteCastEvent = changetype<VoteCast>(newMockEvent())

  voteCastEvent.parameters = new Array()

  voteCastEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam(
      "support",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(support))
    )
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam("weight", ethereum.Value.fromUnsignedBigInt(weight))
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )

  return voteCastEvent
}

export function createVoteCastWithParamsEvent(
  voter: Address,
  proposalId: BigInt,
  support: i32,
  weight: BigInt,
  reason: string,
  params: Bytes
): VoteCastWithParams {
  let voteCastWithParamsEvent = changetype<VoteCastWithParams>(newMockEvent())

  voteCastWithParamsEvent.parameters = new Array()

  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  )
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam(
      "support",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(support))
    )
  )
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam("weight", ethereum.Value.fromUnsignedBigInt(weight))
  )
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam("params", ethereum.Value.fromBytes(params))
  )

  return voteCastWithParamsEvent
}

export function createVotingDelaySetEvent(
  oldVotingDelay: BigInt,
  newVotingDelay: BigInt
): VotingDelaySet {
  let votingDelaySetEvent = changetype<VotingDelaySet>(newMockEvent())

  votingDelaySetEvent.parameters = new Array()

  votingDelaySetEvent.parameters.push(
    new ethereum.EventParam(
      "oldVotingDelay",
      ethereum.Value.fromUnsignedBigInt(oldVotingDelay)
    )
  )
  votingDelaySetEvent.parameters.push(
    new ethereum.EventParam(
      "newVotingDelay",
      ethereum.Value.fromUnsignedBigInt(newVotingDelay)
    )
  )

  return votingDelaySetEvent
}

export function createVotingPeriodSetEvent(
  oldVotingPeriod: BigInt,
  newVotingPeriod: BigInt
): VotingPeriodSet {
  let votingPeriodSetEvent = changetype<VotingPeriodSet>(newMockEvent())

  votingPeriodSetEvent.parameters = new Array()

  votingPeriodSetEvent.parameters.push(
    new ethereum.EventParam(
      "oldVotingPeriod",
      ethereum.Value.fromUnsignedBigInt(oldVotingPeriod)
    )
  )
  votingPeriodSetEvent.parameters.push(
    new ethereum.EventParam(
      "newVotingPeriod",
      ethereum.Value.fromUnsignedBigInt(newVotingPeriod)
    )
  )

  return votingPeriodSetEvent
}
