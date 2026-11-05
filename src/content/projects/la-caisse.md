---
title: La Caisse
description: The digital cashbox for solidarity funds. Open source, behind La CLASS (food social security in Schaerbeek) and Pay for Brussels (the don suspendu fund of Brussels Pay ASBL, which holds this Solidarity Fund membership).
url: https://lacaisse.eu/
Project Lead: Kevin Sundar Raj
Email: kevin@citizenpay.eu
Treasury: https://gnosisscan.io/address/0x7de041Fa35ab466e6E725dad60b960f654E727Df
status: active
image: "../../../images/member-projects/la_caisse.png"
isMemberProject: true
---

**Useful links**

- [lacaisse.eu](https://lacaisse.eu/) — La Caisse
- [laclass.be](https://laclass.be/) — La CLASS, food social security in Schaerbeek
- [pay.brussels](https://pay.brussels/) — Pay for Brussels, the don suspendu fund
- [citizenpay.eu](https://citizenpay.eu/) — Citizen Pay, terminals, cards and platform
- [github.com/lacaisse/webapp](https://github.com/lacaisse/webapp) — source code, AGPL-3.0
- [Karma GAP](https://www.karmahq.org/project/la-caisse-by-citizen-pay) — La Caisse by Citizen Pay

:::note[Formerly listed as Citizen Wallet]
This membership joined the Solidarity Fund in early 2025 as Citizen Wallet. It is now held by Brussels Pay ASBL, the non-profit behind Pay for Brussels. The yield lands with Brussels Pay ASBL and goes straight to the spending pool that people in need spend from through partner organisations in Brussels. La Caisse is the software both funds run on.
:::

## BASICS

---

### About La Caisse

**The digital cashbox for solidarity funds.**

La Caisse is an open source digital cashbox for communities that need to move money without becoming a bank. Euros come in by bank transfer or card and are issued as tokens. Tokens are spent at the fund's partner shops with a tap of an NFC card. Shops are paid out from the fund based on the tokens they received.

The token is the books: euros in the account equal tokens in circulation plus reserve, so the fund has a live view of its treasury and never has to track who is owed what. Legally the token is a limited-network accounting unit, not e-money, so a fund needs no payment licence to run one.

La Caisse is a digital public good. The software is licensed under AGPL-3.0, co-financed by Citizen Pay and La CLASS ASBL, and offered to other funds at no cost for the software itself.

![The La CLASS card, Schaerbeek](/images/la-caisse-laclass-card.webp)

### Who is behind it

Three organisations stand behind La Caisse. The funds govern; Citizen Pay runs the plumbing.

- **Brussels Pay ASBL** — the non-profit that runs Pay for Brussels, the don suspendu fund, and holds the Solidarity Fund membership. Donations increase the $BREAD it holds; the yield goes straight to the spending pool.
- **La CLASS ASBL** — runs the food social security fund in Schaerbeek and co-finances the software.
- **Citizen Pay** (BV/SRL, Brussels, run by Kevin Sundar Raj) — builds the terminals, NFC cards and acquiring integrations, and operates La Caisse day to day. It is a company rather than a co-op because terminals and acquiring sit next to regulated money and need an entity that can carry licences and liability.

### Purpose

**Mission.** Give communities the tools to decide who gets what, at which shops, without a card network taking a cut or excluding people who have no account.

**Vision.** Money for solidarity should be as easy to hand out, and as accountable, as cash in a box, in a city where cash is disappearing.

**Theory of change.** Merchants in Brussels are pushed to accept digital payments and pay for it in fees. People without a bank account or a smartphone get shut out at the same time. A token layer on top of existing rails fixes both sides at once: the community funds the allowance, the merchant gets paid in full, and the cardholder taps a card like anyone else. If that layer is cheap enough to run and the code stays open, schemes that could never justify a payment licence or a marketplace fee can exist, and the movement behind them can do its democratic work instead of fintech on the side.

### Associated Projects and Initiatives

**La CLASS**

[https://laclass.be/](https://laclass.be/) — Food social security for Schaerbeek, in the north of Brussels, live on La Caisse since October 2025. Members contribute between €100 and €225 a month, self-assessed, and receive 150 CLASS tokens a month to spend at partner shops the members choose.

**Pay for Brussels**

[https://pay.brussels/](https://pay.brussels/) — The don suspendu scheme of Brussels Pay ASBL. Donors fund coffees and meals at partner shops; cards go to people who need them through partner organisations that already have their trust.

**Zinne**

The local currency of Brussels has just got its own La Caisse instance. La CLASS and Citizen Pay are also working with three to four new funds in the south of Belgium that want to start on La Caisse.

**Citizen Pay**

[https://citizenpay.eu/](https://citizenpay.eu/) — Payment terminals and NFC cards for local currencies, printed and assembled at OpenFab Brussels. One terminal takes bank cards and the local currency on a single device; a cheaper variant takes local currency only.

![The terminal with NFC reader, printed and assembled in Brussels](/images/la-caisse-terminal.webp)

## IMPACT REPORT 2026

---

First reporting cycle, 1 October 2025 to 30 September 2026. Both funds launched inside this period, so these are also the all-time numbers. What this year was about, in one word: feasibility.

| Metric | 12 months to 30 Sep 2026 |
| --- | --- |
| Funds running on La Caisse | 2 (La CLASS, Pay for Brussels) |
| Paid to merchants | ~€200k, no cut taken |
| Cards issued | 240 |
| Merchants / terminals active | 13 / 13 |
| Transactions (card tapped at a shop) | ~5,100 (La CLASS 5,043, Pay for Brussels 48) |

### La CLASS: food social security, on our rails

Food social security is a proposed new branch of social security, modelled on public healthcare: contribute by your means, receive by your needs. Universal: everyone gets the allowance, no means test, no stigma. Solidarity: contributions go to dedicated local funds. Democratic: members decide which shops qualify.

La CLASS launched in October 2025 with three partner shops, one of them BEES coop, and finished the year with ~230 members, 12 shops, 12 monthly payout cycles and ~€200k paid out to shops. Card only, no app.

- **For a member.** You get an NFC card. Each month 150 tokens land on it. You shop at a partner shop and tap. No internet, no smartphone, no login. A lost card is blocked and a new one assigned. Topping up is a bank transfer with your card ID as reference, so anyone can do it, including someone paying on behalf of someone else.
- **For a shop.** The fund provides a terminal that sits next to the till. Nobody changes their till unless it is broken, so we do not ask them to. Each month the shop receives a payout in euros for the tokens it collected.

Three things were simplified to make it work: the token is the books, one ledger and no double accounting; the terminal sits next to the till rather than replacing it; and no app, because every login issue, dropped wifi connection or extra step adds friction and support.

**Showcase: the card itself.** It looks like any other card and it works like one: tap at the till, walk out. Nothing says to the person behind you in the queue that this is an allowance. At BEES coop, the first shop, it sits next to the regular terminal and nobody has had to learn anything new. That is the whole design, and it took a year of removing things to get there.

**What is still hard.** First, the €1M notification threshold: a fund that passes €1M in 12 months has to notify the National Bank, which decides whether the limited-network exemption still holds. La CLASS is well under it for now, but it is the ceiling the model will meet if it works. Second, sustainability: how to price infrastructure without taxing solidarity.

### Pay for Brussels: don suspendu

Brussels Pay ASBL raised €5,015 from 32 donors on Growfunding over three months, roughly 1,600 coffees or 500 warm meals. Rather than spread cards across the city, the first year was a deliberate one-shop, one-partner pilot. The shop is Mazette, a cooperative brewpub. The partner is Le Pilier, a low-threshold reception service run by Modus Vivendi, the Brussels harm-reduction organisation. Le Pilier handed out 10 cards. Over the period, 48 transactions were paid from the fund, €253.20 in total, about 84 coffees.

A few hundred euros is not a big number, but every one of those 48 taps was someone sitting down in a bar like any other customer, with no form to fill in and no explanation to give at the counter.

> "I was able to watch the Belgium match during the World Cup with everyone else."
>
> — Someone who received a card through Le Pilier

> "At first we thought you were going to sell us a terminal."
>
> — Mazette, when we first came by

**What we learned:** the bottleneck is not donations or shops, it is distribution. Cards only work if an organisation that already has the trust of the people concerned hands them out and follows up. The next step is finding more of them.

### Platform work

What shipped in La Caisse this year, written as what it lets a fund do:

- **Top-ups through open banking.** Fixed monthly periods, or members topping up as they go. Either way the euro lands in the fund's account and the tokens appear on the card.
- **Tiered top-ups with ranges.** The self-assessed contribution model La CLASS runs on (give between €100 and €225, receive 150) is a setting, not custom code.
- **Member cards.** Assign a card to a member, block a lost or stolen one, assign a new one, without the member needing an app or an account.
- **Merchant onboarding and payouts.** A shop is added, gets a terminal, and is paid out from the fund on a schedule. Twelve payout cycles ran for La CLASS without manual accounting.
- **Optional merchant fee.** Off by default. La CLASS switched it on in 2026 at 1% of payouts, so the fund covers its own costs on its own terms.
- **Email automation** for members and merchants.

### Money

Funding received in the 2026 cycle, by source:

- Bread Solidarity Fund: 2,483 $BREAD (~$2,480) from 10 yield distributions. No Shared Treasury grant.
- Growfunding donations to Pay for Brussels: €5,015 from 32 donors
- La CLASS ASBL contribution to La Caisse: €3,500
- Citizen Pay own contribution (unbilled time, hardware): €3,500

What it paid for: building the platform itself, migrating all of La CLASS's operations onto it, and teaching members and shops how to use it. Nothing was invoiced to merchants for the service in 2025. In 2026, La CLASS started charging shops 1% on payouts to cover the fund's own running costs. Pay for Brussels charges nothing.

### What's next

- **One terminal, many currencies.** Many different systems are in use across Belgium and that is a strength. A supermarket onboarded in one city should simply be activated in its branch in another, and other currencies should be able to run on our terminal.
- **La CLASS:** grow steadily, one side at a time. New merchants and new members are added in alternation so that supply and demand stay balanced.
- **Pay for Brussels:** host an event at Mazette to raise donations and introduce the next merchants. More partner organisations like Le Pilier to get cards to the people who will use them.
- **La Caisse:** Zinne's instance, and three to four new funds in the south of Belgium.
- **Bread:** the Solidarity Fund yield goes straight to the Pay for Brussels spending pool. Incoming donations go to increasing the $BREAD held by Brussels Pay ASBL, so the yield grows over time instead of the donation pool shrinking.

## QUESTIONS!

---

### How do you plan to incorporate BREAD in your org?

Brussels Pay ASBL holds the Solidarity Fund membership. Donations to Pay for Brussels go to increasing the $BREAD it holds, and the yield goes straight to the spending pool that people in need spend from through our partners in Brussels. The fund earns yield instead of drawing down its donation pool.

$BREAD acceptance has also been built for Citizen Pay terminals, with Monerium integration for the euro leg. It is not yet switched on for merchants; that is the next step.

In kind, we helped run the Bread stand at DappCon: we baked a Breadtzel and ran a guess-the-weight game where people bought a ticket in $BREAD to play. The game is open source at [github.com/kevtechi/breadtzel](https://github.com/kevtechi/breadtzel) for anyone running a Bread stand.

### What do you plan to do in the short term with the funds received from Bread Cooperative?

The yield goes straight into the Pay for Brussels spending pool and helps people in need take part in the life of the city again: coffees and meals at partner shops, with cards handed out through organisations like Le Pilier. Incoming donations go to increasing the $BREAD held by Brussels Pay ASBL, so the yield grows.

### What processes do you have to determine how funds from Bread Cooperative are allocated?

The funds govern; Citizen Pay runs the plumbing. Brussels Pay ASBL holds the membership: the yield goes straight to the spending pool, and partner organisations in Brussels that already have the trust of the people concerned decide who receives a card. La CLASS members decide which shops qualify and who receives the allowance; the fund's own finances are the members' business.

### What have you done so far with the funds you've received?

Received 2,483 $BREAD (~$2,480) from 10 Solidarity Fund yield distributions between October 2025 and September 2026. Together with the contributions from La CLASS ASBL and Citizen Pay, it paid for building La Caisse, migrating La CLASS onto it and training members and shops. Two funds ran live on the result, ~€200k was paid out to shops with no cut taken, and the code is public under AGPL-3.0.

No spotlight post yet; we would welcome one in the next cycle.
