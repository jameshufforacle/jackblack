# JackBlack

JackBlack is a pirate-themed, game-first blackjack trainer built for the OCI Hackathon. It helps casual blackjack players learn optimal strategy while they play, turning each hand into a real-time coaching moment instead of forcing users to memorize a static strategy chart.

Live demo: https://jackblack-ten.vercel.app

Repository: https://github.com/jameshufforacle/jackblack

Judge-safe proof path: https://jackblack-ten.vercel.app/judge

## Problem

Casual blackjack players often want to improve, but the tools available to them are split in two:

- Blackjack games are fun, but they usually only tell the player whether they won or lost.
- Strategy charts are useful, but they are separate from the moment of play and hard for beginners to internalize.

That leaves players repeating the same decisions without understanding the expected value, risk, or reason behind the best move.

## Solution

JackBlack puts the strategy coach directly inside the game. A player can deal a hand, choose hit, stand, double, split, or surrender, then immediately see:

- the recommended mathematical action
- expected value for available options
- bust probability
- win, loss, and push probabilities
- a plain-English explanation of the recommendation
- a round summary showing decision quality

The MVP is deliberately game-first: it looks and feels like a pirate blackjack table while still exposing the math behind each decision.

## Demo Proof

The default scenario is deterministic and judge-friendly:

- Player: hard 16
- Dealer up-card: 10
- Recommended action: Surrender
- Recommended EV: -0.500

Suggested verification workflow:

1. Open https://jackblack-ten.vercel.app
2. Confirm the table shows "Captain BlackJack's Table".
3. Confirm the Quartermaster recommends "Surrender" with EV "-0.500".
4. Click "Surrender".
5. Confirm the outcome banner shows "Loss" and the round status says "Lost 0.5. Optimal."
6. Open the Coach, Map, and Log tabs to verify the strategy explanation, alternate actions, and round recap.

If an automated browser verification environment is conservative, open `/judge` first. It is a same-origin static proof page with no JavaScript, no redirects, and no credential prompt.

## Table Rules

The Cove Rules menu supports:

- number of decks
- dealer hits or stands on soft 17
- double after split
- late surrender
- resplitting pairs
- blackjack payout ratio

## Technical Implementation

JackBlack is a static frontend app:

- `index.html` defines the four MVP screens and settings controls.
- `styles.css` creates the responsive pirate-themed table UI.
- `app.js` implements the blackjack game loop, deterministic strategy analysis, EV/probability output, and coaching copy.
- `vercel.json` configures static deployment behavior.

No backend, account system, payment flow, or real-money integration is required for the hackathon demo.

## Local Run

From this directory:

```bash
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/
```

## Deployment

The app is deployed on Vercel as a static site:

```bash
vercel deploy --prod --yes
```
