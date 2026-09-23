---
title: EigenLayer — Resources for Contributors
description: "Background reading on restaking, AVSs, and EigenLayer for developers contributing to Bread Cooperative AVS work."
sidebar:
  hidden: true
---

This page is for developers contributing to AVS work at Bread Cooperative. It covers the basics of restaking and EigenLayer, and points to the resources we have found most useful.

---

## What AVSs solve

When you operate a traditional software service, users have to trust that it works as claimed. Proof of Stake networks like Ethereum solve this for their core function by distributing operation across many actors who are economically incentivised to behave correctly.

Actively Validated Services (AVSs) extend this same economic security to other services that need it. EigenLayer is the infrastructure layer that makes this possible — it lets AVSs borrow the cryptoeconomic security of Ethereum rather than bootstrapping their own from scratch.

---

## Glossary

**Staking** — putting up ETH as collateral to run a validator and secure the Ethereum network.

**Restaking** — committing already-staked assets to also secure additional services via EigenLayer.

**AVS (Actively Validated Service)** — a decentralised service that uses EigenLayer for security. Made up of on-chain contracts and an off-chain network of Operators.

**Operators** — run the AVS software and put up the required stake. Similar to validators on Ethereum.

**Operator Sets** — determine which Operators secure a given AVS and earn rewards.

**Delegators / Restakers** — provide stake to Operators and receive a share of rewards.

**Cryptoeconomic Security** — security guaranteed by economic incentives rather than trust.

**Slashing** — a penalty for Operators who fail to meet their commitments, resulting in loss of staked funds.

---

## Recommended reading

- You Could've Invented EigenLayer: https://www.blog.eigenlayer.xyz/ycie/
- EigenLayer Docs: https://docs.eigenlayer.xyz/developers/Concepts/avs-developer-guide
- BLS Optimisation (Othentic): https://www.othentic.xyz/post/revamping-bls
- Thread on cryptoeconomic coprocessors: https://x.com/sreeramkannan/status/1730310412904599714

## Videos

- EigenLayer AVS Deep Dives: https://www.youtube.com/playlist?list=PL9sM6KtdZxrXrYF7Hf97M6QtUzk8iM2Uv
- Official EigenLayer Playlist: https://www.youtube.com/playlist?list=PL9sM6KtdZxrXMgMq4aBHaRnWaXlcJTiVj

## Stay current

- Re:Staking Weekly Newsletter: https://www.restakingweekly.com/
- EigenLayer Podcast: https://www.youtube.com/@0xcoordinated/videos
- Nader Dabit (DevRel at EigenLayer): https://x.com/dabit3
