import {
  Approval as ApprovalEvent,
  AvatarSet as AvatarSetEvent,
  CancelProposal as CancelProposalEvent,
  ChangedGuard as ChangedGuardEvent,
  GovernanceConfigSet as GovernanceConfigSetEvent,
  Initialized as InitializedEvent,
  LockAdmin as LockAdminEvent,
  LockGovernor as LockGovernorEvent,
  LockManager as LockManagerEvent,
  LootPaused as LootPausedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  ProcessProposal as ProcessProposalEvent,
  Ragequit as RagequitEvent,
  SetTrustedForwarder as SetTrustedForwarderEvent,
  SetupComplete as SetupCompleteEvent,
  ShamanSet as ShamanSetEvent,
  SharesPaused as SharesPausedEvent,
  SponsorProposal as SponsorProposalEvent,
  SubmitProposal as SubmitProposalEvent,
  SubmitVote as SubmitVoteEvent,
  TargetSet as TargetSetEvent
} from "../generated/Baal/Baal"
import {
  Approval,
  AvatarSet,
  CancelProposal,
  ChangedGuard,
  GovernanceConfigSet,
  Initialized,
  LockAdmin,
  LockGovernor,
  LockManager,
  LootPaused,
  OwnershipTransferred,
  ProcessProposal,
  Ragequit,
  SetTrustedForwarder,
  SetupComplete,
  ShamanSet,
  SharesPaused,
  SponsorProposal,
  SubmitProposal,
  SubmitVote,
  TargetSet
} from "../generated/schema"
import { Address, Bytes } from "@graphprotocol/graph-ts";

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAvatarSet(event: AvatarSetEvent): void {
  let entity = new AvatarSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousAvatar = event.params.previousAvatar
  entity.newAvatar = event.params.newAvatar

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancelProposal(event: CancelProposalEvent): void {
  let entity = new CancelProposal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proposal = event.params.proposal

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangedGuard(event: ChangedGuardEvent): void {
  let entity = new ChangedGuard(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.guard = event.params.guard

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGovernanceConfigSet(
  event: GovernanceConfigSetEvent
): void {
  let entity = new GovernanceConfigSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.voting = event.params.voting
  entity.grace = event.params.grace
  entity.newOffering = event.params.newOffering
  entity.quorum = event.params.quorum
  entity.sponsor = event.params.sponsor
  entity.minRetention = event.params.minRetention

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

export function handleLockAdmin(event: LockAdminEvent): void {
  let entity = new LockAdmin(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.adminLock = event.params.adminLock

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLockGovernor(event: LockGovernorEvent): void {
  let entity = new LockGovernor(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.governorLock = event.params.governorLock

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLockManager(event: LockManagerEvent): void {
  let entity = new LockManager(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.managerLock = event.params.managerLock

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLootPaused(event: LootPausedEvent): void {
  let entity = new LootPaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.paused = event.params.paused

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

export function handleProcessProposal(event: ProcessProposalEvent): void {
  let entity = new ProcessProposal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proposal = event.params.proposal
  entity.passed = event.params.passed
  entity.actionFailed = event.params.actionFailed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRagequit(event: RagequitEvent): void {
  let entity = new Ragequit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.member = event.params.member
  entity.to = event.params.to
  entity.lootToBurn = event.params.lootToBurn
  entity.sharesToBurn = event.params.sharesToBurn
  entity.tokens = event.params.tokens.map<Bytes>((token: Address) => token as Bytes);

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetTrustedForwarder(
  event: SetTrustedForwarderEvent
): void {
  let entity = new SetTrustedForwarder(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.forwarder = event.params.forwarder

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetupComplete(event: SetupCompleteEvent): void {
  let entity = new SetupComplete(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.lootPaused = event.params.lootPaused
  entity.sharesPaused = event.params.sharesPaused
  entity.gracePeriod = event.params.gracePeriod
  entity.votingPeriod = event.params.votingPeriod
  entity.proposalOffering = event.params.proposalOffering
  entity.quorumPercent = event.params.quorumPercent
  entity.sponsorThreshold = event.params.sponsorThreshold
  entity.minRetentionPercent = event.params.minRetentionPercent
  entity.name = event.params.name
  entity.symbol = event.params.symbol
  entity.totalShares = event.params.totalShares
  entity.totalLoot = event.params.totalLoot

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleShamanSet(event: ShamanSetEvent): void {
  let entity = new ShamanSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.shaman = event.params.shaman
  entity.permission = event.params.permission

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSharesPaused(event: SharesPausedEvent): void {
  let entity = new SharesPaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.paused = event.params.paused

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSponsorProposal(event: SponsorProposalEvent): void {
  let entity = new SponsorProposal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.member = event.params.member
  entity.proposal = event.params.proposal
  entity.votingStarts = event.params.votingStarts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubmitProposal(event: SubmitProposalEvent): void {
  let entity = new SubmitProposal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proposal = event.params.proposal
  entity.proposalDataHash = event.params.proposalDataHash
  entity.votingPeriod = event.params.votingPeriod
  entity.proposalData = event.params.proposalData
  entity.expiration = event.params.expiration
  entity.baalGas = event.params.baalGas
  entity.selfSponsor = event.params.selfSponsor
  entity.timestamp = event.params.timestamp
  entity.details = event.params.details

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubmitVote(event: SubmitVoteEvent): void {
  let entity = new SubmitVote(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.member = event.params.member
  entity.balance = event.params.balance
  entity.proposal = event.params.proposal
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTargetSet(event: TargetSetEvent): void {
  let entity = new TargetSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousTarget = event.params.previousTarget
  entity.newTarget = event.params.newTarget

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
