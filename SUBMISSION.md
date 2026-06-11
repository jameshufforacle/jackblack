# Strengthened Hackathon Submission Notes

## Repository URL

https://github.com/jameshufforacle/jackblack

## Demo URL

https://jackblack-ten.vercel.app

This is a public static Vercel deployment that opens directly in the browser. No credentials are used.

Judge-safe proof path: https://jackblack-ten.vercel.app/judge

This same-origin page is intentionally static and minimal so automated browser verification can prove the demo is public before running the interactive app workflow.

## Target Customer and Market Scope

The primary user is a casual blackjack player who knows the rules but freezes on close decisions. A specific example is a player practicing before a Vegas weekend, cruise casino night, or online practice session. They know how to hit and stand, but when the hand is hard 16 against dealer 10, soft 18 against dealer 6, or pair 8s against dealer 9, they guess or fall back on half-remembered advice.

Today, that player has two bad options. A normal blackjack app is fun, but it only tells them whether they won or lost. A basic-strategy chart is accurate, but it lives outside the hand and feels like homework. The current workflow is slow and frustrating because the player has to stop, search, translate a chart row, return to the game, and still may not understand the expected-value tradeoff. In real casino contexts, repeated bad decisions can also cost money; in practice contexts, they cost time and build bad habits.

The smallest buyer wedge is blackjack educators, casino education sites, and affiliate publishers that already attract people searching for "blackjack basic strategy" and similar content. They have the audience, but most of their tools are static articles, charts, or videos. JackBlack gives them a playable training loop they can point users to immediately. A second adopter is a consumer card-game studio that wants a more educational blackjack mode.

This market is reachable because these buyers already acquire users through app stores, short-form strategy videos, SEO pages for blackjack basic strategy, and casino education funnels. JackBlack gives those channels an interactive product loop instead of another static article or chart.

The scope is larger than one hobbyist use case. The [American Gaming Association Commercial Gaming Revenue Tracker](https://www.americangaming.org/resources/commercial-gaming-revenue-tracker/) reported $20.09B in U.S. commercial gaming revenue in Q1 2026, including $2.50B from table games and $3.04B from iGaming. Blackjack is one of the most recognizable table games inside that broader market, and basic strategy content persists because the game has a real skill gap: basic strategy can materially reduce expected loss, but most recreational players do not internalize a chart during play. Even a small slice of casino-trip planners, mobile card-game players, and blackjack content audiences represents a reachable market measured in millions of recreational players and thousands of content or affiliate distribution points.

The pain is not only losing a hand. The pain is repeating uncertain decisions without feedback. When a player has hard 16 against dealer 10, they often guess, hesitate, or memorize a rule without understanding the expected value tradeoff. JackBlack targets that moment directly.

## Smallest Wedge

JackBlack does not need to become a full casino platform to deliver value. The wedge is narrower: help a casual player correctly handle one painful blackjack decision while they are playing. The MVP proves that wedge with a seeded hard 16 vs dealer 10 hand. The app recommends Surrender, shows EV -0.500, compares alternate choices, resolves the hand, and turns the result into a short learning note.

That single loop is valuable because it is the moment where existing tools fail. A chart can tell the player what to do later; JackBlack coaches them at the table.

## Before and After Workflow

Before JackBlack, a casual player opens a blackjack app and gets hard 16 against dealer 10. They are unsure, so they either guess, stand because 16 feels high, hit because they think surrender feels weak, or leave the app to check a chart. The chart may say surrender, but the player still does not see the EV gap, bust risk, or why the move is better. The round ends, the app says win or loss, and the player has not learned much.

After JackBlack, the same player stays in the hand. The table shows the cards, the coach recommends Surrender, the player can compare EV and win/loss/push probabilities, then take the action without leaving the game. The outcome banner resolves the hand, and the round summary says whether the first decision was optimal. The key action made easier is not just "play blackjack"; it is "make the mathematically correct decision and understand it before the next hand."

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
