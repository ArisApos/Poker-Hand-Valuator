// Example implementation used in the Think Functional course
//  Util Functions

//Imutability perpose
function deepFreeze(object) {
    if (typeof object !== 'object') {
        return object;
    }
    Object.freeze(object);
    Object.values(object)
        .forEach(value => deepFreeze(value));//SubObjects

    return object;
}

//Possible solution
const maxInARow = weights =>
    _.chain(weights)
        .sortBy()
        .uniq()
        .map((num, i) => num - i)
        .groupBy()
        .orderBy('length')
        .last()
        .value()
        .length;

// Playing Cards class definition and implementation
// in a functional fashiom
const Ranks = Object.freeze(['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']);
const Suits = Object.freeze(['hearts', 'clubs', 'diams', 'spades']);

const Cards = deepFreeze(
    //Question1
    Object.entries(Ranks).reduce(
        (cards, [weight, rank]) =>//[index,curRank]//(reducer,curentValue,curentIndex)
            [...cards, ...Suits.map(suit => ({ rank, suit, weight }) )],
        []
    )
);


class RateableCards {

    constructor(cards) {
        this.cards = cards;
        this.weight = cards.map(({ weight }) => weight);
        //-----art
        this.ranks = _.groupBy(cards, 'rank');
        this.suits = _.groupBy(cards, 'suit');
        this.rankTimes = _.groupBy(this.ranks, 'length');
        this.suitTimes = _.groupBy(this.suits, 'length');
        this.maxInARow = maxInARow(cards.map(({ weight }) => weight));//weights array [12, 12, 12, 8, 12, 6]
    }
   //Question2-Is it worth to make the methods statics
    getOfSameRank(n) { return this.rankTimes[n] || []; }//n=same of rank, n=1Singles, n=2 Doubles|Pairs, n=3 Triples 

    getOfSameSuit(n) { return this.suitTimes[n] || []; }//n=same of suit n=1Singles, n=2 Doubles|Pairs, n=3 Triples

    hasAce() { return !!this.ranks['A']; }

    hasOfSameRank(n) { return this.getOfSameRank(n).length; }//How many same of rank(n)

    hasOfSameSuit(n) { return this.getOfSameSuit(n).length; }//How many same of suit(n)

    hasInARow(n) { return this.maxInARow >= n; }


    getWorstSingles() {
        return _.chain(this.getOfSameRank(1))
            .flatten()
            .sortBy('weight')
            .value();
    }

}

// Poker Ratings
//Wrong, we have 6Cards so hasInARow(6)
const PokerRating = {
    RoyalFlush: hand => hand.hasInARow(5) && hand.hasOfSameSuit(5) && hand.hasAce(),
    StraightFlush: hand => hand.hasInARow(5) && hand.hasOfSameSuit(5),

    FourOfAKind: hand => hand.hasOfSameRank(4),
    FullHouse: hand => hand.hasOfSameRank(3) && hand.hasOfSameRank(2),
    Flush: hand => hand.hasOfSameSuit(5),
    Straight: hand => hand.hasInARow(5),
    ThreeOfAKind: hand => hand.hasOfSameRank(3),
    TwoPair: hand => hand.hasOfSameRank(2) >= 2,
    OnePair: hand => hand.hasOfSameRank(2),
    HighCard: hand => hand.hasOfSameRank(1) >= 5,
};

const PokerHandRate = cards => Object.entries(PokerRating).find(([rate, is]) => is(cards) )[0];

//
// Tests
//
// Ranks = Object.freeze([ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A' ]);
// weights =             [  0,   1,   2,   3,   4,   5,   6,   7,    8,   9,   10,  11,  12 ];
// Suits = Object.freeze([ 'hearts', 'clubs', 'diams', 'spades' ]);

const [H, C, D, S] = Suits;
const c = (weight, suit) => ({ rank: Ranks[weight], suit, weight });

const hands = [
  [c(12, H), c(8, H), c(12, C), c(8, C), c(7, S), c(12, D)],
  [c(12, H), c(12, D), c(12, C), c(8, C), c(12, S), c(6, D)],
  [c(12, H), c(8, H), c(11, H), c(10, H), c(9, H), c(9, C)],
  [c(12, H), c(8, H), c(12, C), c(6, C), c(7, S), c(7, D)],
  [c(12, H), c(8, H), c(7, C), c(3, C), c(5, S), c(4, D)],
  [c(12, H), c(11, H), c(10, H), c(9, H), c(8, H), c(7, H)],
];

hands.forEach(hand =>
    console.log(PokerHandRate(new RateableCards(hand)))
);

console.log(
  "-------------new RateableCards(hands[3]).getWorstSingles())-----------------------"
);

console.log(new RateableCards(hands[3]).getWorstSingles());

console.log('--------------new RateableCards(hands[4]).getWorstSingles()----------------------');

console.log(new RateableCards(hands[4]).getWorstSingles());



//---------------------------art
var neo = hands[0];
var neo2 = hands[1];
var neo3 = hands[2];
var neo4 = hands[3];
var neo5 = hands[4];
var neo6 = hands[5];

var neoR = new RateableCards(neo)
var neoR2 = new RateableCards(neo2)
var neoR3 = new RateableCards(neo3);
var neoR4 = new RateableCards(neo4);
var neoR5 = new RateableCards(neo5);
var neoR6 = new RateableCards(neo6);

var da = neoR4.weight;


var maxInARow100 = weights =>
    _.chain(weights)
        .sortBy()
        .value();

var maxInARow101 = weights =>
  _.chain(weights)
    .sortBy()
    .uniq()
    .value();

var maxInARow102 = weights =>
    _.chain(weights)
        .sortBy()
        .uniq()
        .map((num, i) => num - i)
        .value();

var maxInARow103 = weights =>
  _.chain(weights)
    .sortBy()
    .uniq()
    .map((num, i) => num - i)
    .groupBy()
    .value();

var maxInARow104 = weights =>
    _.chain(weights)
        .sortBy()
        .uniq()
        .map((num, i) => num - i)
        .groupBy()
        .orderBy('length')
        .value();

var maxInARow105 = weights =>
  _.chain(weights)
    .sortBy()
    .uniq()
    .map((num, i) => num - i)
    .groupBy()
    .orderBy("length")
    .last()
    .value();

var maxInARow106 = weights =>
    _.chain(weights)
        .sortBy()
        .uniq()
        .map((num, i) => num - i)
        .groupBy()
        .orderBy("length")
        .last()
        .value()
        .length;

    maxInARow101(da)


// const CardsAndDeck = (currentDeck, n = 0) => {
//     const deck = currentDeck !== Cards
//         ? currentDeck.slice(n, deck.length)
//         : currentDeck.slice(n, deck.length).sort(() => Math.random() - 0.5);

//     Object.freeze(deck);
//     const cards = Object.freeze(deck.slice(n));

//     return {
//         cards,
//         deck,
//     };
// };