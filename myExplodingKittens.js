const isDiffuseAvailable = function (cards) {
  if (cards.includes("DIFFUSE")) {
    return "remove the diffuse";
  }

  return "playergone";
};

const isDanger = (pickedCard) => pickedCard === "BOMB";

const isDiffuse = (card) => card === "DIFFUSE";

const removeCard = function (playerCards, card) {
  if (card !== "DIFFUSE") {
    return playerCards.toSpliced(
      playerCards.findIndex(function (element) {
        return card === element;
      })
    );
  }

  if (isDiffuseAvailable(playerCards) === "remove the diffuse") {
    return playerCards.toSpliced(playerCards.findIndex(isDiffuse), 1);
  }
  return "GAME OVER";
};

const drawAndProcess = function (playerName, playerCards, cardPicked) {
  console.log(playerName + " has picked " + cardPicked);

  if (isDanger(cardPicked)) {
    return removeCard(playerCards, "DIFFUSE");
  }

  return playerCards.concat(cardPicked);
};

const pullCard = (deck) => deck[0];

const mapIndex = (card, index) => [card, index];

const getCardFromOpponent = function (cards) {
  console.log(cards.map(mapIndex));
  const cardSelected = prompt("ENTER CARD OF YOUR CHOICE");
  return cards[cardSelected];
};

const performAction = function (
  playerName,
  playerCards,
  opponentCards,
  deck,
  card
) {
  let updatedDeck = [...deck];
  console.log("updated deck is :", updatedDeck);
  if (playerCards[card] === "SKIP") {
    const cardsOfPlayer = removeCard(playerCards, "SKIP");
    return [cardsOfPlayer, opponentCards, updatedDeck];
  }

  if (playerCards[card] === "SEE THE FUTURE") {
    console.log(updatedDeck[0] + " " + updatedDeck[1] + " " + updatedDeck[2]);
    const cardsOfPlayer = removeCard(playerCards, "SEE THE FUTURE");
    return playerTurn(playerName, cardsOfPlayer, opponentCards, updatedDeck);
  }

  if (playerCards[card] === "SHUFFLE") {
    updatedDeck = shuffleDeck(updatedDeck);
    const cardsOfPlayer = removeCard(playerCards, "SHUFFLE");
    return playerTurn(playerName, cardsOfPlayer, opponentCards, updatedDeck);
  }

  if (playerCards[card] === "ATTACK") {
    const cardsOfPlayer = removeCard(playerCards, "ATTACK");
    return playerTurn(playerName, cardsOfPlayer, opponentCards, updatedDeck);
  }

  if (playerCards[card] === "FAVOUR") {
    const cardsOfPlayer = removeCard(playerCards, "FAVOUR");
    console.log("player cards are:", playerCards);
    console.log("opponent cards are:", opponentCards);
    const getCardFromPLayer = getCardFromOpponent(opponentCards);
    const newPlayerCards = cardsOfPlayer.concat(getCardFromPLayer);
    console.log(opponentCards, getCardFromPLayer);
    const newOpponentCards = removeCard(opponentCards, getCardFromPLayer);
    console.log(newOpponentCards, getCardFromPLayer);
    return playerTurn(
      playerName,
      newPlayerCards,
      newOpponentCards,
      updatedDeck
    );
  }
};

const playerTurn = function (playerName, playerCards, opponentCards, deck) {
  console.log(playerName + " your cards are\n", playerCards);
  console.log("opponent cards are:", opponentCards);
  let updatedCards = [playerCards, opponentCards, [...deck]];

  if (confirm(playerName + " DO YOU WANT TO PERFORM ANY ACTION")) {
    let updatedDeck = [...deck];
    console.log(playerCards.map(mapIndex));
    const card = prompt("CHOSSE THE CARD");

    if (playerCards[card] === "SKIP") {
      const cardsOfPlayer = removeCard(playerCards, "SKIP");
      return [cardsOfPlayer, updatedDeck, opponentCards];
    }

    return performAction(playerName, playerCards, opponentCards, deck, card);
  }

  const [cardsOfMainPerson, cardsOfOtherPerson, newDeck] = updatedCards;
  const cardPickedByPlayer = pullCard(newDeck);
  newDeck.shift();
  const updatesCardsOfOne = drawAndProcess(
    playerName,
    cardsOfMainPerson,
    cardPickedByPlayer
  );

  return [updatesCardsOfOne, newDeck, cardsOfOtherPerson];
};

const game = function (player1, player2, player1Cards, player2Cards, deck) {
  const elements = playerTurn(player1, player1Cards, player2Cards, deck);

  const [cardsOfPlayer1, updatedDeck, opponentCards] = elements;

  if (cardsOfPlayer1 === "GAME OVER") {
    return player2 + " has won the game";
  }

  const elementsOf2 = playerTurn(
    player2,
    opponentCards,
    cardsOfPlayer1,
    updatedDeck
  );

  const [cardsOfPlayer2, deckUpdated, p1Cards] = elementsOf2;
  if (cardsOfPlayer2 === "GAME OVER") {
    return player1 + " has won the game";
  }

  return game(player1, player2, p1Cards, cardsOfPlayer2, deckUpdated);
};

const shuffleDeck = function (cards) {
  const deck = [...cards];

  const shuffledDeck = deck.sort(function () {
    return Math.random() - 0.5;
  });
  return shuffledDeck;
};

const givecards = ([card, noOfCards]) => Array(noOfCards).fill([card]);

const giveDeckOfCards = function () {
  const array = [
    ["BEARD CAT", 4],
    ["HAIRY POTATO CAT", 4],
    ["TACO CAT", 4],
    ["RAINBOW CAT ", 4],
    ["CATERMELON", 4],
    ["SKIP", 4],
    ["SHUFFLE", 4],
    ["ATTACK", 4],
    ["FAVOUR", 4],
    ["NOPE", 5],
    ["SEE THE FUTURE", 5],
  ];

  const deck = array.map(givecards);

  return shuffleDeck(deck.flat());
};

const explodingKittens = function (player1, player2) {
  let deck = giveDeckOfCards();
  deck = deck.flat();
  const player1Cards = [deck.shift(), deck.shift(), deck.shift(), deck.shift()];
  const player2Cards = [deck.shift(), deck.shift(), deck.shift(), deck.shift()];

  player1Cards.push("DIFFUSE");
  player2Cards.push("DIFFUSE");

  deck.push("DIFFUSE", "BOMB", "BOMB", "BOMB", "BOMB");
  deck = shuffleDeck(deck);

  return game(player1, player2, player1Cards, player2Cards, deck);
};

const getName = () => prompt("ENTER THE PLAYER NAME :");

console.log(explodingKittens(getName(), getName()));
