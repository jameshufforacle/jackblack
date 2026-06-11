# Strengthened Hackathon Submission Notes

## Repository URL

Add the public GitHub repository URL once created.

## Demo URL

https://jackblack-ten.vercel.app

This is a public static Vercel deployment with no authentication, login, OAuth, MFA, payment, or account creation.

## Target Customer and Market Scope

The primary user is a casual blackjack player who understands the basic rules but does not know how to make optimal decisions under pressure. Today, that player either uses a casino-style blackjack app that gives no strategic feedback, or pauses the game to look up a separate strategy chart. Both workflows are frustrating because the learning happens away from the moment of decision.

JackBlack also serves beginner players preparing for a casino trip, content creators teaching blackjack strategy, and gaming or education platforms that want probability lessons to feel interactive. The broader market is not limited to blackjack gamblers; it includes recreational skill-building, casual casino gaming, and consumer edtech experiences where users learn decision-making through repeated feedback.

The problem is repeatable: millions of people play blackjack casually, but most learning tools still separate gameplay from strategy explanation. The pain is not just losing hands; it is playing repeatedly without understanding why a decision was good or bad.

## Technical Execution and Demo Proof

JackBlack is working software deployed publicly on Vercel. The demo opens directly in the browser without authentication. The default seeded hand gives judges a deterministic proof path:

- Player has hard 16 against dealer 10.
- The app recommends Surrender.
- The table shows EV -0.500 and bust risk 0%.
- After clicking Surrender, the app resolves the hand and shows "Lost 0.5. Optimal."
- The Coach screen explains why surrender is best.
- The Map screen compares alternate actions.
- The Log screen recaps the hand and decision quality.

This proves the core product loop: playable blackjack, deterministic strategy analysis, real-time coaching, and post-hand learning feedback.

## Differentiation

Most blackjack apps are either games without instruction or charts without gameplay. JackBlack combines both. It is game-first enough to feel fun and educational enough to teach the math behind every decision. The deterministic strategy engine keeps recommendations trustworthy, while the pirate-themed coaching layer makes the learning experience approachable.

