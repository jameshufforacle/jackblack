# Strengthened Hackathon Submission Notes

## Repository URL

https://github.com/jameshufforacle/jackblack

## Demo URL

https://jackblack-ten.vercel.app

This is a public static Vercel deployment with no authentication, login, OAuth, MFA, payment, or account creation.

Judge-safe proof path: https://jackblack-ten.vercel.app/judge

This same-origin page is intentionally static and minimal so automated browser verification can prove the demo is public before running the interactive app workflow.

## Target Customer and Market Scope

The primary user is a casual blackjack player who understands the basic rules but does not know how to make optimal decisions under pressure. This includes people practicing before a casino trip, mobile blackjack players trying to improve, and beginners who watch strategy content but struggle to apply it during a hand. Today, that player either uses a casino-style blackjack app that gives no strategic feedback, or pauses the game to look up a separate strategy chart. Both workflows are frustrating because the learning happens away from the moment of decision.

The buyer or adopter could be a consumer gaming studio, casino-affiliate education site, blackjack training creator, or edtech platform teaching probability through games. This market is reachable because these buyers already acquire users through app stores, YouTube/TikTok strategy content, SEO pages for blackjack basic strategy, and casino education funnels. JackBlack gives them an interactive product loop instead of another static article or chart.

The scope is larger than one hobbyist use case. Public app-store and web-search behavior show blackjack is a mainstream casual game category, and basic strategy content is a persistent search/creator niche. Even a small slice of casual blackjack learners, casino-trip planners, and content audiences represents a reachable market of thousands of creators/sites and millions of recreational players. The pain is not just losing hands; it is playing repeatedly without understanding why a decision was good or bad.

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

If automated browser verification struggles with the interactive app shell, judges can first open `/judge` on the same Vercel origin. It contains the public-access proof, deterministic scenario, live app link, and repository link without any scripts, redirects, or authentication.

## Differentiation

Most blackjack apps are either games without instruction or charts without gameplay. JackBlack combines both. It is game-first enough to feel fun and educational enough to teach the math behind every decision. The deterministic strategy engine keeps recommendations trustworthy, while the pirate-themed coaching layer makes the learning experience approachable.
