---
title: Finances
description: "Where Bread Cooperative's money sits — the Bread Coop Core treasury, the Solidarity Fund, and the Shared Treasury — and who controls each."
sidebar:
  order: 2
---

Bread Cooperative's funds are held on-chain and are publicly viewable. There is no single pot: money is split across wallets with different purposes, different signers, and different rules for spending it.

Everything below runs on Gnosis Chain.

---

## Bread Coop Core

The core team treasury funds the day-to-day work of the cooperative — development, design, marketing, tooling, hosting, travel, and the monthly wages of core team members.

**Safe (Gnosis Chain)**
`0x918dEf5d593F46735f74F9E2B280Fe51AF3A99ad`

[View on Safe](https://app.safe.global/home?safe=gno:0x918dEf5d593F46735f74F9E2B280Fe51AF3A99ad)

**Who controls it**

Core team members are signers on this Safe. Spending is decided by the team: wages are set democratically and paid through monthly spending limits, and other expenses are proposed by core members and approved by majority vote. Wages are revisited every three to six months against available runway.

The vast majority of assets held by the core team are held in $BREAD, so that the funds themselves continue to generate yield for the network.

See [Core Team](/cooperative/governance/core-team/) for how wages are set and who is eligible to be a signer.

---

## Solidarity Fund Treasury

Two distinct things sit under this heading: the fund contract that backs $BREAD, and the Shared Treasury that the network spends from.

### The Solidarity Fund contract

Every $BREAD in circulation is backed 1:1 by xDAI deposited into the Solidarity Fund. Those deposits are converted to sDAI, and the yield they generate is what gets distributed to member projects each month. The principal is not spent by anyone — it belongs to the people who baked it, and can be burned back to xDAI at any time.

**Contract (Gnosis Chain)**
`0xa555d5344f6fb6c65da19e403cb4c1ec4a1a5ee3`

[View on Gnosisscan](https://gnosisscan.io/token/0xa555d5344f6fb6c65da19e403cb4c1ec4a1a5ee3)

See [How it Works](/tools/solidarity-fund/how-it-works/) for how the yield is generated and voted on.

### The Shared Treasury

The Shared Treasury is the multi-signature wallet for the resources of the Bread Cooperative network as a whole. It funds grants for prioritised work, sponsorships for aligned events, and support for new initiatives within the network — things outside the scope of any single member project.

**Safe (Gnosis Chain)**
`0x6A148b997e6651237F2fCfc9E30330a6480519f0`

[View on Safe](https://app.safe.global/home?safe=gno:0x6A148b997e6651237F2fCfc9E30330a6480519f0)

**Who controls it**

The wallet includes one representative from each member project, chosen by that project. New signers are added when a new project is accepted into the cooperative. Every transaction is proposed, deliberated, and confirmed by a majority of signers. Signers are expected to join monthly governance calls to give updates and align on strategy.

The Shared Treasury also receives a share of each monthly yield distribution. Rather than being paid out, that share is returned to the fund, where it adds to the pool that generates yield — compounding what's available to distribute in future.

---

## Transparency

Both Safes and the fund contract are public. Anyone can inspect balances and transaction history at the links above without asking us for anything.
