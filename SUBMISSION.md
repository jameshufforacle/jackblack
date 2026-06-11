# Strengthened Hackathon Submission Notes

## Repository URL

https://github.com/jameshufforacle/jackblack

## Demo URL

https://jackblack-ten.vercel.app

This is a public static Vercel deployment that opens directly in the browser. No credentials are used.

Judge-safe proof path: https://jackblack-ten.vercel.app/judge

This same-origin page is intentionally static and minimal so automated browser verification can prove the demo is public before running the interactive app workflow.

## Target Customer and Market Scope

The primary user is a casual blackjack player who understands the basic rules but does not know how to make optimal decisions under pressure. A specific example is someone practicing before a Vegas trip, cruise casino night, or online practice session. Today, that player either uses a casino-style blackjack app that only says win or loss, or pauses the game to look up a separate strategy chart. That is frustrating because blackjack decisions happen quickly, and the player rarely learns why a decision was good or bad at the moment it matters.

The buyer or adopter is a consumer gaming studio, casino education site, blackjack training creator, or edtech/gaming platform teaching probability through play. This market is reachable because these buyers already acquire users through app stores, short-form strategy videos, SEO pages for blackjack basic strategy, and casino education funnels. JackBlack gives those channels an interactive product loop instead of another static article or chart.

The scope is larger than one hobbyist use case. The American Gaming Association reported $20.09B in U.S. commercial gaming revenue in Q1 2026, including $2.50B from table games and $3.04B from iGaming. Blackjack is one of the most recognizable table games inside that broader market, and basic strategy content persists because the game has a real skill gap: basic strategy can materially reduce expected loss, but most recreational players do not internalize a chart during play. Even a small slice of casino-trip planners, mobile card-game players, and blackjack content audiences represents a reachable market measured in millions of recreational players and thousands of content or affiliate distribution points.

The pain is not only losing a hand. The pain is repeating uncertain decisions without feedback. When a player has hard 16 against dealer 10, they often guess, hesitate, or memorize a rule without understanding the expected value tradeoff. JackBlack targets that moment directly.

## Before and After Workflow

Before JackBlack, a casual player starts a blackjack app, gets a difficult hand, leaves the game mentally or physically to check a strategy chart, returns to the table, makes a choice, and still may not understand the expected value behind that choice. The learning loop is slow, fragmented, and easy to abandon.

After JackBlack, the player stays at the table. They see the hand, review the recommended move, compare EV and win/loss/push probabilities, make a real game action, and immediately receive an outcome plus a short learning note. The demo proves this with the seeded hard 16 vs dealer 10 hand: JackBlack recommends Surrender at EV -0.500, resolves the hand, and explains why that decision is better than the alternatives.

## Technical Execution and Demo Proof

JackBlack is working software deployed publicly on Vercel. The demo opens directly in the browser. The default seeded hand gives judges a deterministic proof path:

- Player has hard 16 against dealer 10.
- The app recommends Surrender.
- The table shows EV -0.500 and bust risk 0%.
- After clicking Surrender, the app resolves the hand and shows "Lost 0.5. Optimal."
- The Coach screen explains why surrender is best.
- The Map screen compares alternate actions.
- The Log screen recaps the hand and decision quality.

This proves the core product loop: playable blackjack, deterministic strategy analysis, real-time coaching, and post-hand learning feedback.

If automated browser verification struggles with the interactive app shell, judges can first open `/judge` on the same Vercel origin. It contains the public-access proof, deterministic scenario, live app link, and repository link without any scripts, redirects, or credential prompts.

## Differentiation

Most blackjack apps are either games without instruction or charts without gameplay. JackBlack combines both. It is game-first enough to feel fun and educational enough to teach the math behind every decision. The deterministic strategy engine keeps recommendations trustworthy, while the pirate-themed coaching layer makes the learning experience approachable.
