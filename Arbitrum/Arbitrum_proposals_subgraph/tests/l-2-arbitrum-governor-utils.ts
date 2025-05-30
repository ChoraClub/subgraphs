import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
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

} from "../generated/L2ArbitrumGovernor/L2ArbitrumGovernor"

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

export function createLateQuorumVoteExtensionSetEvent(
  oldVoteExtension: BigInt,
  newVoteExtension: BigInt
): LateQuorumVoteExtensionSet {
  let lateQuorumVoteExtensionSetEvent = changetype<LateQuorumVoteExtensionSet>(
    newMockEvent()
  )

  lateQuorumVoteExtensionSetEvent.parameters = new Array()

  lateQuorumVoteExtensionSetEvent.parameters.push(
    new ethereum.EventParam(
      "oldVoteExtension",
      ethereum.Value.fromUnsignedBigInt(oldVoteExtension)
    )
  )
  lateQuorumVoteExtensionSetEvent.parameters.push(
    new ethereum.EventParam(
      "newVoteExtension",
      ethereum.Value.fromUnsignedBigInt(newVoteExtension)
    )
  )

  return lateQuorumVoteExtensionSetEvent
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
  description: string
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

  return proposalCreatedEvent
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

export function createProposalExtendedEvent(
  proposalId: BigInt,
  extendedDeadline: BigInt
): ProposalExtended {
  let proposalExtendedEvent = changetype<ProposalExtended>(newMockEvent())

  proposalExtendedEvent.parameters = new Array()

  proposalExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  proposalExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "extendedDeadline",
      ethereum.Value.fromUnsignedBigInt(extendedDeadline)
    )
  )

  return proposalExtendedEvent
}

export function createProposalQueuedEvent(
  proposalId: BigInt,
  eta: BigInt
): ProposalQueued {
  let proposalQueuedEvent = changetype<ProposalQueued>(newMockEvent())

  proposalQueuedEvent.parameters = new Array()

  proposalQueuedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  proposalQueuedEvent.parameters.push(
    new ethereum.EventParam("eta", ethereum.Value.fromUnsignedBigInt(eta))
  )

  return proposalQueuedEvent
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

export function createTimelockChangeEvent(
  oldTimelock: Address,
  newTimelock: Address
): TimelockChange {
  let timelockChangeEvent = changetype<TimelockChange>(newMockEvent())

  timelockChangeEvent.parameters = new Array()

  timelockChangeEvent.parameters.push(
    new ethereum.EventParam(
      "oldTimelock",
      ethereum.Value.fromAddress(oldTimelock)
    )
  )
  timelockChangeEvent.parameters.push(
    new ethereum.EventParam(
      "newTimelock",
      ethereum.Value.fromAddress(newTimelock)
    )
  )

  return timelockChangeEvent
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

