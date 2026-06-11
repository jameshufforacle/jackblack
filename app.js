const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const ANALYSIS_RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const SUITS = ["spades", "hearts", "diamonds", "clubs"];
const SUIT_MARKS = {
  spades: "&spades;",
  hearts: "&hearts;",
  diamonds: "&diams;",
  clubs: "&clubs;"
};
const ACTION_LABELS = {
  hit: "Hit",
  stand: "Stand",
  double: "Double Down",
  split: "Split",
  surrender: "Surrender"
};

const SCENARIOS = {
  hard16: {
    label: "16 vs 10",
    player: [
      { rank: "10", suit: "spades" },
      { rank: "6", suit: "hearts" }
    ],
    dealerUp: { rank: "10", suit: "diamonds" },
    dealerHole: { rank: "5", suit: "clubs" }
  },
  soft18: {
    label: "Soft 18 vs 6",
    player: [
      { rank: "A", suit: "clubs" },
      { rank: "7", suit: "hearts" }
    ],
    dealerUp: { rank: "6", suit: "diamonds" },
    dealerHole: { rank: "10", suit: "clubs" }
  },
  pair8: {
    label: "Pair 8s vs 9",
    player: [
      { rank: "8", suit: "clubs" },
      { rank: "8", suit: "diamonds" }
    ],
    dealerUp: { rank: "9", suit: "spades" },
    dealerHole: { rank: "7", suit: "hearts" }
  },
  eleven: {
    label: "11 vs 6",
    player: [
      { rank: "5", suit: "spades" },
      { rank: "6", suit: "clubs" }
    ],
    dealerUp: { rank: "6", suit: "hearts" },
    dealerHole: { rank: "10", suit: "diamonds" }
  }
};

const elements = {
  roundState: document.querySelector("#roundState"),
  dealerHand: document.querySelector("#dealerHand"),
  playerHand: document.querySelector("#playerHand"),
  dealerTotal: document.querySelector("#dealerTotal"),
  playerTotal: document.querySelector("#playerTotal"),
  playerSeatLabel: document.querySelector("#playerSeatLabel"),
  outcomeBanner: document.querySelector("#outcomeBanner"),
  outcomeKicker: document.querySelector("#outcomeKicker"),
  outcomeTitle: document.querySelector("#outcomeTitle"),
  outcomeDetail: document.querySelector("#outcomeDetail"),
  newRoundButton: document.querySelector("#newRoundButton"),
  tableRecommendation: document.querySelector("#tableRecommendation"),
  tableEv: document.querySelector("#tableEv"),
  tableBust: document.querySelector("#tableBust"),
  shoeCount: document.querySelector("#shoeCount"),
  coachAction: document.querySelector("#coachAction"),
  coachExplanation: document.querySelector("#coachExplanation"),
  coachEv: document.querySelector("#coachEv"),
  coachWin: document.querySelector("#coachWin"),
  coachLose: document.querySelector("#coachLose"),
  coachPush: document.querySelector("#coachPush"),
  probabilityBars: document.querySelector("#probabilityBars"),
  evBoard: document.querySelector("#evBoard"),
  deepExplanation: document.querySelector("#deepExplanation"),
  whatIfCopy: document.querySelector("#whatIfCopy"),
  comparisonTable: document.querySelector("#comparisonTable"),
  summaryResult: document.querySelector("#summaryResult"),
  summaryQuality: document.querySelector("#summaryQuality"),
  summaryNote: document.querySelector("#summaryNote"),
  roundLog: document.querySelector("#roundLog"),
  settingsButton: document.querySelector("#settingsButton"),
  settingsPanel: document.querySelector("#settingsPanel"),
  settingsBackdrop: document.querySelector("#settingsBackdrop"),
  settingsClose: document.querySelector("#settingsClose"),
  ruleSummary: document.querySelector("#ruleSummary"),
  deckCount: document.querySelector("#deckCount"),
  soft17: document.querySelector("#soft17"),
  doubleAfterSplit: document.querySelector("#doubleAfterSplit"),
  lateSurrender: document.querySelector("#lateSurrender"),
  resplitPairs: document.querySelector("#resplitPairs"),
  blackjackPayout: document.querySelector("#blackjackPayout")
};

const state = {
  rules: readRules(),
  scenarioId: "hard16",
  shoe: [],
  dealerHand: [],
  dealerRevealed: false,
  playerHands: [],
  activeHandIndex: 0,
  splitCount: 0,
  status: "playing",
  firstDecision: null,
  summary: null,
  log: []
};

function readRules() {
  return {
    decks: Number(elements.deckCount?.value || 6),
    dealerSoft17: elements.soft17?.value || "stand",
    doubleAfterSplit: Boolean(elements.doubleAfterSplit?.checked ?? true),
    lateSurrender: Boolean(elements.lateSurrender?.checked ?? true),
    resplitPairs: Boolean(elements.resplitPairs?.checked ?? true),
    blackjackPayout: Number(elements.blackjackPayout?.value || 1.5)
  };
}

function cloneCard(card) {
  return { rank: card.rank, suit: card.suit };
}

function normalizeRank(rank) {
  return ["10", "J", "Q", "K"].includes(rank) ? "10" : rank;
}

function rankValue(rank) {
  const normalized = normalizeRank(rank);
  if (normalized === "A") return 11;
  return Number(normalized);
}

function buildShoe(decks) {
  const shoe = [];
  for (let deck = 0; deck < decks; deck += 1) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        shoe.push({ rank, suit });
      }
    }
  }
  return shoe;
}

function removeCardByRank(shoe, card) {
  const index = shoe.findIndex((candidate) => candidate.rank === card.rank);
  if (index >= 0) {
    shoe.splice(index, 1);
    return;
  }

  const normalized = normalizeRank(card.rank);
  const fallback = shoe.findIndex((candidate) => normalizeRank(candidate.rank) === normalized);
  if (fallback >= 0) shoe.splice(fallback, 1);
}

function drawCard() {
  if (!state.shoe.length) state.shoe = buildShoe(state.rules.decks);
  const index = Math.floor(Math.random() * state.shoe.length);
  return state.shoe.splice(index, 1)[0];
}

function handInfo(cards) {
  let total = 0;
  let softAces = 0;
  for (const card of cards) {
    const normalized = normalizeRank(card.rank);
    if (normalized === "A") softAces += 1;
    total += rankValue(normalized);
  }
  while (total > 21 && softAces > 0) {
    total -= 10;
    softAces -= 1;
  }

  return {
    total,
    soft: softAces > 0,
    bust: total > 21,
    blackjack: cards.length === 2 && total === 21,
    pair: cards.length === 2 && cards[0].rank === cards[1].rank
  };
}

function activeHand() {
  return state.playerHands[state.activeHandIndex] || state.playerHands[0];
}

function startScenario(id = state.scenarioId || "hard16") {
  const scenario = SCENARIOS[id] || SCENARIOS.hard16;
  state.rules = readRules();
  state.scenarioId = id;
  state.shoe = buildShoe(state.rules.decks);
  const playerCards = scenario.player.map(cloneCard);
  const dealerUp = cloneCard(scenario.dealerUp);

  [...playerCards, dealerUp].forEach((card) => removeCardByRank(state.shoe, card));
  const dealerHole = scenario.dealerHole ? cloneCard(scenario.dealerHole) : drawCard();
  if (scenario.dealerHole) removeCardByRank(state.shoe, dealerHole);

  state.dealerHand = [dealerUp, dealerHole];
  state.dealerRevealed = false;
  state.playerHands = [createHand(playerCards, false, 0)];
  state.activeHandIndex = 0;
  state.splitCount = 0;
  state.status = "playing";
  state.firstDecision = null;
  state.summary = null;
  state.log = [`Loaded ${scenario.label}.`];
  updateScenarioButtons();
  checkNaturalBlackjack();
  render();
}

function startRandomRound() {
  state.rules = readRules();
  state.scenarioId = "";
  state.shoe = buildShoe(state.rules.decks);
  const playerCards = [drawCard(), drawCard()];
  state.dealerHand = [drawCard(), drawCard()];
  state.dealerRevealed = false;
  state.playerHands = [createHand(playerCards, false, 0)];
  state.activeHandIndex = 0;
  state.splitCount = 0;
  state.status = "playing";
  state.firstDecision = null;
  state.summary = null;
  state.log = ["New round from the shoe."];
  updateScenarioButtons();
  checkNaturalBlackjack();
  render();
}

function createHand(cards, fromSplit, splitDepth) {
  return {
    cards,
    wager: 1,
    fromSplit,
    splitDepth,
    status: "active",
    result: null,
    payout: 0,
    doubled: false
  };
}

function checkNaturalBlackjack() {
  const player = state.playerHands[0];
  const playerInfo = handInfo(player.cards);
  const dealerInfo = handInfo(state.dealerHand);
  if (!playerInfo.blackjack && !dealerInfo.blackjack) return;

  state.dealerRevealed = true;
  state.status = "roundOver";
  if (playerInfo.blackjack && dealerInfo.blackjack) {
    player.status = "stand";
    player.result = "push";
    player.payout = 0;
    state.log.push("Both hands show blackjack. Push.");
  } else if (playerInfo.blackjack) {
    player.status = "stand";
    player.result = "blackjack";
    player.payout = state.rules.blackjackPayout;
    state.log.push(`Blackjack pays ${formatPayoutRatio(state.rules.blackjackPayout)}.`);
  } else {
    player.status = "stand";
    player.result = "loss";
    player.payout = -1;
    state.log.push("Dealer blackjack.");
  }
  buildSummary();
}

function validActions(hand = activeHand()) {
  if (!hand || state.status !== "playing" || hand.status !== "active") return [];
  const info = handInfo(hand.cards);
  if (info.bust || info.blackjack) return ["stand"];

  const actions = ["hit", "stand"];
  const canDouble = hand.cards.length === 2 && (!hand.fromSplit || state.rules.doubleAfterSplit);
  const canSplit = info.pair && hand.cards.length === 2 && (!hand.fromSplit || state.rules.resplitPairs) && state.splitCount < 3;
  const canSurrender = state.rules.lateSurrender && state.playerHands.length === 1 && hand.cards.length === 2;

  if (canDouble) actions.push("double");
  if (canSplit) actions.push("split");
  if (canSurrender) actions.push("surrender");
  return actions;
}

function takeAction(action) {
  const hand = activeHand();
  if (!validActions(hand).includes(action)) return;

  if (!state.firstDecision) {
    const analysis = analyzeCurrentHand();
    const chosen = analysis.options[action];
    const best = analysis.options[analysis.recommended];
    state.firstDecision = {
      action,
      recommended: analysis.recommended,
      analysis,
      evGap: chosen && best ? best.ev - chosen.ev : 0
    };
  }

  if (action === "hit") {
    const card = drawCard();
    hand.cards.push(card);
    state.log.push(`Hit draws ${card.rank}.`);
    const info = handInfo(hand.cards);
    if (info.bust) {
      hand.status = "bust";
      hand.result = "loss";
      hand.payout = -hand.wager;
      state.log.push(`Hand ${state.activeHandIndex + 1} busts at ${info.total}.`);
      advanceHandOrDealer();
    } else if (info.total === 21) {
      hand.status = "stand";
      state.log.push(`Hand ${state.activeHandIndex + 1} reaches 21.`);
      advanceHandOrDealer();
    }
  }

  if (action === "stand") {
    hand.status = "stand";
    state.log.push(`Stand on ${handInfo(hand.cards).total}.`);
    advanceHandOrDealer();
  }

  if (action === "double") {
    hand.wager *= 2;
    hand.doubled = true;
    const card = drawCard();
    hand.cards.push(card);
    const info = handInfo(hand.cards);
    state.log.push(`Double down draws ${card.rank}.`);
    if (info.bust) {
      hand.status = "bust";
      hand.result = "loss";
      hand.payout = -hand.wager;
      state.log.push(`Doubled hand busts at ${info.total}.`);
    } else {
      hand.status = "stand";
    }
    advanceHandOrDealer();
  }

  if (action === "split") {
    splitHand(hand);
  }

  if (action === "surrender") {
    hand.status = "surrender";
    hand.result = "loss";
    hand.payout = -0.5 * hand.wager;
    state.status = "roundOver";
    state.dealerRevealed = false;
    state.log.push("Late surrender saves half the stake.");
    buildSummary();
  }

  render();
}

function splitHand(hand) {
  const [first, second] = hand.cards;
  const firstHand = createHand([first, drawCard()], true, hand.splitDepth + 1);
  const secondHand = createHand([second, drawCard()], true, hand.splitDepth + 1);
  const index = state.activeHandIndex;
  state.playerHands.splice(index, 1, firstHand, secondHand);
  state.activeHandIndex = index;
  state.splitCount += 1;
  state.log.push(`Split ${first.rank}s into two hands.`);
}

function advanceHandOrDealer() {
  const nextIndex = state.playerHands.findIndex((hand, index) => index > state.activeHandIndex && hand.status === "active");
  if (nextIndex >= 0) {
    state.activeHandIndex = nextIndex;
    return;
  }

  const liveHands = state.playerHands.filter((hand) => hand.status === "stand");
  if (liveHands.length) {
    playDealer();
  } else {
    state.status = "roundOver";
    state.dealerRevealed = true;
    buildSummary();
  }
}

function playDealer() {
  state.dealerRevealed = true;
  state.status = "dealer";
  while (dealerShouldHit(handInfo(state.dealerHand))) {
    const card = drawCard();
    state.dealerHand.push(card);
    state.log.push(`Dealer draws ${card.rank}.`);
  }
  settleRound();
}

function dealerShouldHit(info) {
  if (info.bust) return false;
  if (info.total < 17) return true;
  return info.total === 17 && info.soft && state.rules.dealerSoft17 === "hit";
}

function settleRound() {
  const dealerInfo = handInfo(state.dealerHand);
  const dealerBlackjack = state.dealerHand.length === 2 && dealerInfo.blackjack;

  for (const hand of state.playerHands) {
    const playerInfo = handInfo(hand.cards);
    if (hand.status === "bust" || hand.status === "surrender") continue;

    if (playerInfo.blackjack && !hand.fromSplit && !dealerBlackjack) {
      hand.result = "blackjack";
      hand.payout = state.rules.blackjackPayout * hand.wager;
    } else if (dealerBlackjack && !playerInfo.blackjack) {
      hand.result = "loss";
      hand.payout = -hand.wager;
    } else if (dealerInfo.bust) {
      hand.result = "win";
      hand.payout = hand.wager;
    } else if (playerInfo.total > dealerInfo.total) {
      hand.result = "win";
      hand.payout = hand.wager;
    } else if (playerInfo.total < dealerInfo.total) {
      hand.result = "loss";
      hand.payout = -hand.wager;
    } else {
      hand.result = "push";
      hand.payout = 0;
    }
  }

  state.status = "roundOver";
  state.log.push(roundResultText());
  buildSummary();
}

function roundResultText() {
  const net = state.playerHands.reduce((sum, hand) => sum + hand.payout, 0);
  if (net > 0) return `Round wins ${formatSigned(net)} units.`;
  if (net < 0) return `Round loses ${formatSigned(Math.abs(net))} units.`;
  return "Round pushes.";
}

function buildSummary() {
  const net = state.playerHands.reduce((sum, hand) => sum + hand.payout, 0);
  let quality = "No decision needed";
  let note = "Natural blackjacks settle before a player decision.";

  if (state.firstDecision) {
    const gap = Math.max(0, state.firstDecision.evGap);
    if (gap <= 0.005) quality = "Optimal";
    else if (gap <= 0.045) quality = `Close call, ${formatEv(gap)} EV`;
    else quality = `Costly deviation, ${formatEv(gap)} EV`;

    const chosen = ACTION_LABELS[state.firstDecision.action];
    const best = ACTION_LABELS[state.firstDecision.recommended];
    note = gap <= 0.005
      ? `${chosen} matched the best EV line for this rule set.`
      : `${best} was stronger than ${chosen}; the gap is the long-run cost per original unit.`;
  }

  state.summary = {
    result: net > 0 ? `Won ${formatSigned(net)}` : net < 0 ? `Lost ${formatSigned(Math.abs(net))}` : "Push",
    quality,
    note
  };
}

function visibleCardsForAnalysis() {
  const cards = [];
  for (const hand of state.playerHands) cards.push(...hand.cards);
  if (state.dealerHand[0]) cards.push(state.dealerHand[0]);
  if (state.dealerRevealed) cards.push(...state.dealerHand.slice(1));
  return cards;
}

function buildAnalysisCounts(decks, visibleCards) {
  const counts = {
    A: 4 * decks,
    "2": 4 * decks,
    "3": 4 * decks,
    "4": 4 * decks,
    "5": 4 * decks,
    "6": 4 * decks,
    "7": 4 * decks,
    "8": 4 * decks,
    "9": 4 * decks,
    "10": 16 * decks
  };

  for (const card of visibleCards) {
    const rank = normalizeRank(card.rank);
    counts[rank] = Math.max(0, counts[rank] - 1);
  }
  return counts;
}

function probabilitiesFromCounts(counts) {
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  return ANALYSIS_RANKS.map((rank) => ({
    rank,
    probability: total ? counts[rank] / total : 0
  })).filter((entry) => entry.probability > 0);
}

function analyzeCurrentHand() {
  const hand = activeHand() || state.playerHands[0];
  const actions = validActions(hand);
  return analyzeHand({
    cards: hand.cards,
    dealerUp: state.dealerHand[0],
    rules: state.rules,
    actions: actions.length ? actions : ["stand"],
    visibleCards: visibleCardsForAnalysis(),
    fromSplit: hand.fromSplit
  });
}

function analyzeHand({ cards, dealerUp, rules, actions, visibleCards, fromSplit }) {
  const counts = buildAnalysisCounts(rules.decks, visibleCards);
  const probabilities = probabilitiesFromCounts(counts);
  const dealerRank = normalizeRank(dealerUp.rank);
  const model = createEvModel(probabilities, dealerRank, rules);
  const options = {};

  for (const action of actions) {
    if (action === "hit") options.hit = model.hit(cards);
    if (action === "stand") options.stand = model.stand(cards, 1, handInfo(cards).blackjack && !fromSplit);
    if (action === "double") options.double = model.double(cards);
    if (action === "split") options.split = model.split(cards, rules.doubleAfterSplit);
    if (action === "surrender") options.surrender = { ev: -0.5, win: 0, loss: 1, push: 0, bust: 0 };
  }

  const ordered = Object.entries(options).sort((a, b) => b[1].ev - a[1].ev);
  const recommended = ordered[0]?.[0] || "stand";
  const secondBest = ordered[1]?.[0] || recommended;
  const explanation = buildCoachExplanation(cards, dealerUp, recommended, secondBest, options, rules);

  return {
    cards,
    dealerUp,
    options,
    recommended,
    secondBest,
    explanation,
    counts
  };
}

function createEvModel(probabilities, dealerRank, rules) {
  const dealerDist = calculateDealerDistribution(dealerRank, probabilities, rules);
  const bestMemo = new Map();
  const hitMemo = new Map();

  function stand(cards, wager = 1, blackjackPays = false) {
    const info = handInfo(cards);
    if (info.bust) return { ev: -wager, win: 0, loss: 1, push: 0, bust: 1 };

    const outcome = { ev: 0, win: 0, loss: 0, push: 0, bust: 0 };
    for (const [dealerOutcome, probability] of Object.entries(dealerDist)) {
      if (!probability) continue;

      if (dealerOutcome === "blackjack") {
        if (blackjackPays) {
          outcome.push += probability;
        } else {
          outcome.loss += probability;
          outcome.ev -= wager * probability;
        }
        continue;
      }

      if (dealerOutcome === "bust") {
        outcome.win += probability;
        outcome.ev += (blackjackPays ? rules.blackjackPayout : wager) * probability;
        continue;
      }

      const dealerTotal = Number(dealerOutcome);
      if (info.total > dealerTotal) {
        outcome.win += probability;
        outcome.ev += (blackjackPays ? rules.blackjackPayout : wager) * probability;
      } else if (info.total < dealerTotal) {
        outcome.loss += probability;
        outcome.ev -= wager * probability;
      } else {
        outcome.push += probability;
      }
    }
    return outcome;
  }

  function doubleDown(cards) {
    let aggregate = emptyOutcome();
    for (const entry of probabilities) {
      const nextCards = [...cards, analysisCard(entry.rank)];
      const info = handInfo(nextCards);
      const outcome = info.bust
        ? { ev: -2, win: 0, loss: 1, push: 0, bust: 1 }
        : stand(nextCards, 2, false);
      aggregate = addWeighted(aggregate, outcome, entry.probability);
    }
    return aggregate;
  }

  function hit(cards) {
    const key = handStateKey(cards);
    if (hitMemo.has(key)) return hitMemo.get(key);

    let aggregate = emptyOutcome();
    for (const entry of probabilities) {
      const nextCards = [...cards, analysisCard(entry.rank)];
      const info = handInfo(nextCards);
      const outcome = info.bust
        ? { ev: -1, win: 0, loss: 1, push: 0, bust: 1 }
        : bestContinuation(nextCards, false);
      aggregate = addWeighted(aggregate, outcome, entry.probability);
    }
    hitMemo.set(key, aggregate);
    return aggregate;
  }

  function bestContinuation(cards, canDouble) {
    const info = handInfo(cards);
    if (info.bust) return { ev: -1, win: 0, loss: 1, push: 0, bust: 1 };

    const key = `${info.total}|${info.soft ? 1 : 0}|${canDouble ? 1 : 0}`;
    if (bestMemo.has(key)) return bestMemo.get(key);

    const candidates = [stand(cards, 1, false), hit(cards)];
    if (canDouble && cards.length === 2) candidates.push(doubleDown(cards));
    const best = candidates.sort((a, b) => b.ev - a.ev)[0];
    bestMemo.set(key, best);
    return best;
  }

  function split(cards, doubleAfterSplit) {
    const pairRank = normalizeRank(cards[0].rank);
    let oneHand = emptyOutcome();
    for (const entry of probabilities) {
      const splitCards = [analysisCard(pairRank), analysisCard(entry.rank)];
      const outcome = bestContinuation(splitCards, doubleAfterSplit);
      oneHand = addWeighted(oneHand, outcome, entry.probability);
    }

    return {
      ev: oneHand.ev * 2,
      win: oneHand.win,
      loss: oneHand.loss,
      push: oneHand.push,
      bust: oneHand.bust
    };
  }

  return {
    stand,
    hit,
    double: doubleDown,
    split
  };
}

function calculateDealerDistribution(upRank, probabilities, rules) {
  const distribution = { blackjack: 0, bust: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0 };
  const memo = new Map();

  for (const entry of probabilities) {
    let start = addRankToTotal({ total: 0, softAces: 0 }, upRank);
    start = addRankToTotal(start, entry.rank);
    const natural = isNaturalBlackjack(upRank, entry.rank);

    if (natural) {
      distribution.blackjack += entry.probability;
    } else {
      const tail = dealerTail(start.total, start.softAces);
      for (const [key, value] of Object.entries(tail)) {
        distribution[key] += value * entry.probability;
      }
    }
  }

  function dealerTail(total, softAces) {
    const adjusted = adjustAces(total, softAces);
    const key = `${adjusted.total}|${adjusted.softAces}`;
    if (memo.has(key)) return memo.get(key);

    const result = { bust: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0 };
    if (adjusted.total > 21) {
      result.bust = 1;
      memo.set(key, result);
      return result;
    }

    const soft = adjusted.softAces > 0;
    const stands = adjusted.total > 17 || (adjusted.total === 17 && (!soft || rules.dealerSoft17 === "stand"));
    if (stands) {
      result[adjusted.total] = 1;
      memo.set(key, result);
      return result;
    }

    for (const entry of probabilities) {
      const next = addRankToTotal(adjusted, entry.rank);
      const tail = dealerTail(next.total, next.softAces);
      for (const [outcome, value] of Object.entries(tail)) {
        result[outcome] += value * entry.probability;
      }
    }

    memo.set(key, result);
    return result;
  }

  return distribution;
}

function addRankToTotal(stateTotal, rank) {
  const normalized = normalizeRank(rank);
  let total = stateTotal.total + rankValue(normalized);
  let softAces = stateTotal.softAces + (normalized === "A" ? 1 : 0);
  return adjustAces(total, softAces);
}

function adjustAces(total, softAces) {
  while (total > 21 && softAces > 0) {
    total -= 10;
    softAces -= 1;
  }
  return { total, softAces };
}

function isNaturalBlackjack(firstRank, secondRank) {
  const first = normalizeRank(firstRank);
  const second = normalizeRank(secondRank);
  return (first === "A" && second === "10") || (first === "10" && second === "A");
}

function analysisCard(rank) {
  return { rank: normalizeRank(rank), suit: "spades" };
}

function emptyOutcome() {
  return { ev: 0, win: 0, loss: 0, push: 0, bust: 0 };
}

function addWeighted(base, outcome, weight) {
  return {
    ev: base.ev + outcome.ev * weight,
    win: base.win + outcome.win * weight,
    loss: base.loss + outcome.loss * weight,
    push: base.push + outcome.push * weight,
    bust: base.bust + outcome.bust * weight
  };
}

function handStateKey(cards) {
  const info = handInfo(cards);
  return `${info.total}|${info.soft ? 1 : 0}|${cards.length}`;
}

function buildCoachExplanation(cards, dealerUp, recommended, secondBest, options, rules) {
  const info = handInfo(cards);
  const dealer = normalizeRank(dealerUp.rank);
  const best = options[recommended];
  const second = options[secondBest] || best;
  const gap = best && second ? Math.max(0, best.ev - second.ev) : 0;
  const handName = describeHand(info, cards);
  const dealerName = dealer === "A" ? "ace" : dealer;

  if (recommended === "surrender") {
    return `${handName} into a dealer ${dealerName} is a rough lane. Late surrender locks the loss at half a unit, beating the next line by ${formatEv(gap)} EV.`;
  }
  if (recommended === "split") {
    return `${handName} plays better as two starting hands. Splitting avoids carrying a weak total and projects ${formatEv(best.ev)} EV across the two hands.`;
  }
  if (recommended === "double") {
    return `${handName} has enough drawing power against the dealer ${dealerName} to press the stake. Doubling leads the table with ${formatEv(best.ev)} EV.`;
  }
  if (recommended === "hit") {
    return `${handName} needs another card before it can fight the dealer ${dealerName}. Hitting keeps more long-run value than standing by ${formatEv(gap)} EV.`;
  }
  return `${handName} is strong enough to make the dealer finish the hand. Standing has the best long-run value under ${rules.dealerSoft17 === "hit" ? "H17" : "S17"} rules.`;
}

function describeHand(info, cards) {
  if (info.blackjack) return "Blackjack";
  if (info.pair) return `Pair of ${cards[0].rank}s`;
  if (info.soft) return `Soft ${info.total}`;
  return `Hard ${info.total}`;
}

function render() {
  const analysis = state.status === "playing" ? analyzeCurrentHand() : state.firstDecision?.analysis || analyzeCurrentHand();
  renderHands();
  renderActions();
  renderCoach(analysis);
  renderSummary();
  renderLog();
  renderRoundState(analysis);
  renderOutcomeBanner();
  renderRuleSummary();
}

function renderHands() {
  const dealerVisibleCards = state.dealerRevealed ? state.dealerHand : [state.dealerHand[0], { hidden: true }];
  elements.dealerHand.innerHTML = dealerVisibleCards.map((card, index) => renderCard(card, index)).join("");
  elements.dealerTotal.textContent = state.dealerRevealed
    ? totalText(handInfo(state.dealerHand))
    : `Showing ${visibleTotal(state.dealerHand[0])}`;

  elements.playerHand.innerHTML = state.playerHands.map((hand, index) => {
    const info = handInfo(hand.cards);
    const active = index === state.activeHandIndex && state.status === "playing";
    return `
      <div class="hand-cluster ${active ? "is-current" : ""}">
        <div class="hand-chip">Hand ${index + 1} ${hand.doubled ? "x2" : ""}</div>
        <div class="cluster-cards">${hand.cards.map((card, cardIndex) => renderCard(card, cardIndex)).join("")}</div>
        <div class="hand-total">${totalText(info)}${hand.result ? `, ${resultLabel(hand.result)}` : ""}</div>
      </div>
    `;
  }).join("");

  const hand = activeHand();
  const info = hand ? handInfo(hand.cards) : handInfo([]);
  elements.playerSeatLabel.textContent = state.playerHands.length > 1 ? `Player, hand ${state.activeHandIndex + 1}` : "Player";
  elements.playerTotal.textContent = hand ? totalText(info) : "No hand";
  elements.shoeCount.textContent = `${state.shoe.length}`;
}

function renderCard(card, index) {
  if (!card || card.hidden) {
    return `
      <div class="playing-card back" style="--tilt:${index % 2 ? 2 : -2}deg">
        <div class="corner">JB</div>
        <div class="pip">&spades;</div>
        <div class="corner bottom">JB</div>
      </div>
    `;
  }

  const red = card.suit === "hearts" || card.suit === "diamonds";
  const suit = SUIT_MARKS[card.suit] || "&spades;";
  return `
    <div class="playing-card ${red ? "red" : ""}" style="--tilt:${index % 2 ? 2 : -2}deg">
      <div class="corner">${card.rank}<br>${suit}</div>
      <div class="pip">${suit}</div>
      <div class="corner bottom">${card.rank}<br>${suit}</div>
    </div>
  `;
}

function renderActions() {
  const allowed = validActions();
  document.querySelectorAll(".action-button").forEach((button) => {
    const action = button.dataset.action;
    button.disabled = !allowed.includes(action);
  });
}

function renderCoach(analysis) {
  const best = analysis.options[analysis.recommended];
  elements.tableRecommendation.textContent = ACTION_LABELS[analysis.recommended];
  elements.tableEv.textContent = formatEv(best.ev);
  elements.tableBust.textContent = formatPercent(best.bust);

  elements.coachAction.textContent = ACTION_LABELS[analysis.recommended];
  elements.coachExplanation.textContent = analysis.explanation;
  elements.coachEv.textContent = formatEv(best.ev);
  elements.coachWin.textContent = formatPercent(best.win);
  elements.coachLose.textContent = formatPercent(best.loss);
  elements.coachPush.textContent = formatPercent(best.push);

  const bars = [
    ["Win", best.win, "#51b77b"],
    ["Lose", best.loss, "#b84b51"],
    ["Push", best.push, "#d9a441"],
    ["Bust", best.bust, "#2d7182"]
  ];

  elements.probabilityBars.innerHTML = bars.map(([label, value, color]) => `
    <div class="probability-row">
      <header><span>${label}</span><strong>${formatPercent(value)}</strong></header>
      <div class="bar-track"><div class="bar-fill" style="--value:${Math.max(1, value * 100)}%; --bar-color:${color}"></div></div>
    </div>
  `).join("");

  const entries = sortedOptions(analysis.options);
  elements.evBoard.innerHTML = entries.map(([action, outcome]) => `
    <article class="ev-card ${action === analysis.recommended ? "best" : ""}">
      <span>${action === analysis.recommended ? "Best line" : "Alternate line"}</span>
      <h3>${ACTION_LABELS[action]}</h3>
      <strong>${formatEv(outcome.ev)}</strong>
      <div class="ev-micro">
        <b>Win ${formatPercent(outcome.win)}</b>
        <b>Lose ${formatPercent(outcome.loss)}</b>
        <b>Push ${formatPercent(outcome.push)}</b>
        <b>Bust ${formatPercent(outcome.bust)}</b>
      </div>
    </article>
  `).join("");

  const second = analysis.options[analysis.secondBest];
  const gap = second ? best.ev - second.ev : 0;
  elements.deepExplanation.textContent = `${analysis.explanation} The coach compares only legal actions for the current rules, then ranks them by expected units won or lost per original stake.`;
  elements.whatIfCopy.textContent = analysis.secondBest === analysis.recommended
    ? "No alternate action is currently legal."
    : `${ACTION_LABELS[analysis.secondBest]} is the closest alternate at ${formatEv(second.ev)}, which trails by ${formatEv(Math.max(0, gap))} EV.`;

  renderComparisonTable(analysis);
}

function renderComparisonTable(analysis) {
  const rows = sortedOptions(analysis.options);
  elements.comparisonTable.innerHTML = `
    <div class="comparison-row header">
      <span>Action</span><span>EV</span><span>Win</span><span>Lose</span><span>Push</span><span>Bust</span>
    </div>
    ${rows.map(([action, outcome]) => `
      <div class="comparison-row ${action === analysis.recommended ? "best" : ""}">
        <strong>${ACTION_LABELS[action]}</strong>
        <span>${formatEv(outcome.ev)}</span>
        <span>${formatPercent(outcome.win)}</span>
        <span>${formatPercent(outcome.loss)}</span>
        <span>${formatPercent(outcome.push)}</span>
        <span>${formatPercent(outcome.bust)}</span>
      </div>
    `).join("")}
  `;
}

function renderSummary() {
  const summary = state.summary || {
    result: "Round in progress",
    quality: state.firstDecision ? "Decision recorded" : "Awaiting choice",
    note: state.firstDecision
      ? `${ACTION_LABELS[state.firstDecision.action]} was your first move.`
      : "The coach will compare your first decision against the best available EV."
  };

  elements.summaryResult.textContent = summary.result;
  elements.summaryQuality.textContent = summary.quality;
  elements.summaryNote.textContent = summary.note;
}

function renderLog() {
  elements.roundLog.innerHTML = state.log.slice(-8).reverse().map((entry) => `
    <div class="log-entry">${entry}</div>
  `).join("");
}

function renderOutcomeBanner() {
  if (state.status !== "roundOver" || !state.summary) {
    elements.outcomeBanner.hidden = true;
    return;
  }

  const net = state.playerHands.reduce((sum, hand) => sum + hand.payout, 0);
  const resultTypes = new Set(state.playerHands.map((hand) => hand.result).filter(Boolean));
  let tone = "push";
  let title = "Push";
  let detail = "Parley at the cove. No treasure changes hands.";

  if (resultTypes.has("blackjack")) {
    tone = "blackjack";
    title = "Win";
    detail = `Treasure chest unlocked. A golden 21 pays ${formatPayoutRatio(state.rules.blackjackPayout)}.`;
  } else if (state.playerHands.some((hand) => hand.status === "surrender")) {
    tone = "loss";
    title = "Loss";
    detail = "Walk the plank halfway. Half the stake returns to your chest.";
  } else if (net > 0) {
    tone = "win";
    title = "Win";
    detail = `Treasure chest opened. ${formatDoubloons(net)} hauled into your hold.`;
  } else if (net < 0) {
    tone = "loss";
    title = "Loss";
    detail = `Walk the plank. The house claims ${formatDoubloons(net)}.`;
  } else {
    tone = "push";
    title = "Push";
    detail = "Parley at the cove. No treasure changes hands.";
  }

  elements.outcomeKicker.textContent = state.playerHands.length > 1 ? "Round Result" : "Hand Result";
  elements.outcomeTitle.textContent = title;
  elements.outcomeDetail.textContent = detail;
  elements.outcomeBanner.className = `outcome-banner is-${tone}`;
  elements.outcomeBanner.hidden = false;
}

function renderRoundState(analysis) {
  if (state.status === "roundOver") {
    elements.roundState.textContent = state.summary ? `${state.summary.result}. ${state.summary.quality}.` : "Round complete.";
    return;
  }

  if (state.status === "dealer") {
    elements.roundState.textContent = "Dealer is resolving the table.";
    return;
  }

  const hand = activeHand();
  const info = handInfo(hand.cards);
  elements.roundState.textContent = `${describeHand(info, hand.cards)} against dealer ${state.dealerHand[0].rank}. Coach says ${ACTION_LABELS[analysis.recommended]}.`;
}

function renderRuleSummary() {
  const ruleParts = [
    `${state.rules.decks} decks`,
    state.rules.dealerSoft17 === "hit" ? "H17" : "S17",
    state.rules.doubleAfterSplit ? "DAS" : "No DAS",
    state.rules.lateSurrender ? "Late surrender" : "No surrender",
    state.rules.resplitPairs ? "Resplit" : "No resplit",
    formatPayoutRatio(state.rules.blackjackPayout)
  ];
  elements.ruleSummary.textContent = ruleParts.join(" / ");
}

function sortedOptions(options) {
  return Object.entries(options).sort((a, b) => b[1].ev - a[1].ev);
}

function totalText(info) {
  if (info.bust) return `Bust ${info.total}`;
  if (info.blackjack) return "Blackjack";
  return info.soft ? `Soft ${info.total}` : `${info.total}`;
}

function visibleTotal(card) {
  if (!card) return "";
  const rank = normalizeRank(card.rank);
  return rank === "A" ? "A" : rank;
}

function resultLabel(result) {
  if (result === "blackjack") return "blackjack";
  if (result === "win") return "win";
  if (result === "loss") return "loss";
  if (result === "push") return "push";
  return result;
}

function formatEv(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(3)}`;
}

function formatSigned(value) {
  return `${value.toFixed(value % 1 ? 1 : 0)}`;
}

function formatPercent(value) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  if (pct > 0 && pct < 1) return `${pct.toFixed(1)}%`;
  return `${Math.round(pct)}%`;
}

function formatPayoutRatio(value) {
  return value === 1.2 ? "6:5" : "3:2";
}

function formatDoubloons(value) {
  const amount = Math.abs(value);
  const label = Math.abs(amount - 1) < 0.001 ? "doubloon" : "doubloons";
  return `${formatSigned(amount)} ${label}`;
}

function updateScenarioButtons() {
  document.querySelectorAll(".scenario-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scenario === state.scenarioId);
  });
}

function openSettings() {
  elements.settingsPanel.hidden = false;
  elements.settingsBackdrop.hidden = false;
  elements.settingsButton.setAttribute("aria-expanded", "true");
}

function closeSettings() {
  elements.settingsPanel.hidden = true;
  elements.settingsBackdrop.hidden = true;
  elements.settingsButton.setAttribute("aria-expanded", "false");
}

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach((tab) => tab.classList.remove("is-active"));
    document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("is-active"));
    button.classList.add("is-active");
    document.querySelector(`#screen-${button.dataset.screen}`).classList.add("is-active");
  });
});

document.querySelectorAll(".scenario-button").forEach((button) => {
  button.addEventListener("click", () => startScenario(button.dataset.scenario));
});

document.querySelectorAll(".action-button").forEach((button) => {
  button.addEventListener("click", () => takeAction(button.dataset.action));
});

elements.newRoundButton.addEventListener("click", startRandomRound);
elements.settingsButton.addEventListener("click", openSettings);
elements.settingsClose.addEventListener("click", closeSettings);
elements.settingsBackdrop.addEventListener("click", closeSettings);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.settingsPanel.hidden) closeSettings();
});

[elements.deckCount, elements.soft17, elements.doubleAfterSplit, elements.lateSurrender, elements.resplitPairs, elements.blackjackPayout].forEach((control) => {
  control.addEventListener("change", () => {
    const previousDecks = state.rules.decks;
    state.rules = readRules();
    if (state.rules.decks !== previousDecks && state.scenarioId) {
      startScenario(state.scenarioId);
    } else {
      render();
    }
  });
});

startScenario("hard16");
