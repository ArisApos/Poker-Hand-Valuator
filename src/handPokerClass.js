//Usefull libraries
//groupBy with reduce
function groupBy(list, projectReturnKey) {
  return list.reduce(
    (groups, curObjElem) => {
      var key = projectReturnKey(curObjElem) //We take the key from the call back
      var groupArray = groups[key]
        ? [...groups[key], curObjElem]
        : [curObjElem]; //Does this key already exists?Yes->addThisElement to the existed array

      groups[key] = groupArray //Update the groupObject with the specific key-value.We make Overwriting or New Writing
      return groups;
    },
    {} //Initial value with an empty Object...
  );
}

//API
class Card {
  constructor(rank, suit) {
    this.rank = rank
    this.suit = suit
  }
}
Card.DIAMONDS = "d"
Card.CLUBS = "c"
Card.HEARTS = "h"
Card.SPADES = "s"

//Composition Pattern
class Hand {
  constructor(cardList) {
    this.h = cardList;
    this.deH = Hand.descendingRank(cardList);
    this._strDeH = Hand.straightData(this.deH);
    this.gsDeH = Hand.groupSuit(this.deH);
    this._fluDeH = Hand.flushData(this.gsDeH);
    this._royDeH = Hand.royalData(this._strDeH, this._fluDeH);
    this._strFluDeH = Hand.straightFlushData(this._strDeH, this._fluDeH);
    this.grDeH = Hand.groupRank(this.deH);
    this._kinPaiHei = Hand.kindPairHeighData(this.grDeH);
    this._value = Hand._valueData(this);
  }

  //Static methods of the Hand Class

  //-------------Descending sort by rank. We return a new array to avoid mutation!
  static descendingRank(list) {
    return list.slice(0).sort((after, before) => before.rank - after.rank); //Big to small ---return negative = swap
  }

  //---------------Group Casting of an  DescendedByRankHand<>deH. We dont touch the deRankHand... we just return an object casted by the deRankHand array.
  //var gsh = groupSuit(deH);     diamonds: (5)[card, card, card, card, card]
  static groupSuit(deRankHand) {
    return groupBy(deRankHand, ({ suit }) =>
      suit == Card.DIAMONDS
        ? "diamonds"
        : suit == Card.CLUBS
        ? "clubs"
        : suit == Card.HEARTS
        ? "hearts"
        : "spads"
    );
  }

  //grDeH
  static groupRank(deRankHand) {
    return groupBy(deRankHand, ({ rank }) =>
      rank == 14
        ? 14
        : rank == 13
        ? 13
        : rank == 12
        ? 12
        : rank == 11
        ? 11
        : rank == 10
        ? 10
        : rank == 9
        ? 9
        : rank == 8
        ? 8
        : rank == 7
        ? 7
        : rank == 6
        ? 6
        : rank == 5
        ? 5
        : rank == 4
        ? 4
        : rank == 3
        ? 3
        : 2
    );
  }

  //_str
  static straightData(sortedDecrHandList) {
    var serieStatus = sortedDecrHandList.reduce(
      (previousResult, curCardElem) =>
        !previousResult.rank
          ? {
              rank: curCardElem.rank,
              rankSerie: 1
            }
          : previousResult.rank - curCardElem.rank === 1
          ? {
              rank: curCardElem.rank,
              rankSerie: ++previousResult.rankSerie
            }
          : {
              rank: curCardElem.rank,
              rankSerie: previousResult.rankSerie
            },
      {
        rankSerie: 1
      }
    );
    return serieStatus.rankSerie === 5
      ? {
          ...serieStatus,
          straight: true
        }
      : {
          ...serieStatus,
          straight: false
        };
  }

  //_flu, All five cards are of the same suit...CodeMeaning Object.keys(_gh).length == 1 (_gh=grouped hand by suit)
  static flushData(groupedSuit) {
    var valueSuitArray = Object.values(groupedSuit); //List of one array.length=5 with the same suit and descended rank
    return valueSuitArray.length == 1
      ? {
          flush: true,
          rank: valueSuitArray[0][4].rank
        }
      : {
          flush: false
        };
  }

  //_roy INPUT(straightData, flushData) straightData.straight = true &&  flushData.flush = true && smallest rank==10 
  static royalData({ rank, straight }, { flush }) {
    return straight && flush && rank === 10
      ? {
          royal: true,
          rank
        }
      : {
          royal: false
        };
  }

  //_strFlu 
  static straightFlushData({ rank, straight }, { flush }) {
    return straight && flush && rank < 10
      ? {
          straightFlush: true,
          rank
        }
      : {
          straightFlush: false
        };
  }
  //_kinPaiHei  KIND PAIR AND HEIGH DATA INPUT(groupByRank the decrised by rank Hand)
  static kindPairHeighData(grDeH) {
    var values = Object.values(grDeH); //Array of lists|arrays
    var deValues = values
      .slice(0)
      .sort((after, before) => before.length - after.length);//SORT BY ARRAYS LENGTHS
    var dePairedRank = deValues
      .slice(0)
      .sort(
        (after, before) =>
          before.length == after.length
            ? before[0].rank - after[0].rank
            : +1 //IF WE HAVE SAME LENGTH(PAIRS) THEN SORT BY RANKS IN DESCENDIG ORDER
      );

    switch (values.length) {
      case 2: {//Four of Kind or Full house
        return dePairedRank[0].length == 4//Four cards with same rank and oneAlone 
          ? {
              fourKind: true,
              bigest: dePairedRank[0][0].rank,
              secondest: dePairedRank[1][0].rank
            }
          : {//Three cards with same rank and onePair
              fullHouse: true,
              bigest: dePairedRank[0][0].rank,
              secondest: dePairedRank[1][0].rank
            }; //With two groups we will have only two combinations||cases  g4+g1 || g3+g2
      }
      case 3: {//3sameRank and 2singles OR 2pairs and 1single
        return dePairedRank[0].length == 3
          ? {
              threeKind: true,
              bigest: dePairedRank[0][0].rank,
              secondest: dePairedRank[1][0].rank,
              thirdest: dePairedRank[2][0].rank
            }
          : {
              twoPair: true,
              bigest: dePairedRank[0][0].rank,
              secondest: dePairedRank[1][0].rank,
              thirdest: dePairedRank[2][0].rank
            };
      }
      case 4: {
        return {
          onePair: true,
          bigest: dePairedRank[0][0].rank,
          secondest: dePairedRank[1][0].rank,
          thirdest: dePairedRank[2][0].rank,
          fourdest: dePairedRank[3][0].rank
        };
      }
      default:
        return {
          heighCard: true,
          bigest: dePairedRank[0][0].rank,
          secondest: dePairedRank[1][0].rank,
          thirdest: dePairedRank[2][0].rank,
          fourdest: dePairedRank[3][0].rank,
          fivedest: dePairedRank[4][0].rank
        };
    }
  }

  static _valueData(hand) {
    return hand._royDeH.royal
      ? { handValue: 10, handType: "Royal Sraight Flush", ...hand._royDeH }
      : hand._strFluDeH.straightFlush
      ? { handValue: 9, handType: "Straight Flush", ...hand._strFluDeH }
      : hand._kinPaiHei.fourKind
      ? { handValue: 8, handType: "Four of a Kind", ...hand._kinPaiHei }
      : hand._kinPaiHei.fullHouse
      ? { handValue: 7, handType: "Full House", ...hand._kinPaiHei }
      : hand._fluDeH.flush
      ? { handValue: 6, handType: "Flush", ...hand._fluDeH }
      : hand._strDeH.straight
      ? { handValue: 5, handType: "Straight", ...hand._strDeH }
      : hand._kinPaiHei.threeKind
      ? { handValue: 4, handType: "Three of a kind", ...hand._kinPaiHei }
      : hand._kinPaiHei.twoPair
      ? { handValue: 3, handType: "Two Pair", ...hand._kinPaiHei }
      : hand._kinPaiHei.onePair
      ? { handValue: 2, handType: "One Pair", ...hand._kinPaiHei }
      : { handValue: 1, handType: "High Card", ...hand._kinPaiHei };
  }
}

//------------------------- UI

//---Stage1 Check
//Royal straight flush
//Straight Flush
//Flush
//Straight

//Straight value=5
var h1 = new Hand([
    new Card(2, Card.CLUBS),
    new Card(3, Card.DIAMONDS),
    new Card(5, Card.DIAMONDS),
    new Card(4, Card.DIAMONDS),
    new Card(6, Card.DIAMONDS)
]);
//Straight Flush value = 9
var h2 = new Hand([
  new Card(5, Card.HEARTS),
  new Card(2, Card.HEARTS),
  new Card(3, Card.HEARTS),
  new Card(6, Card.HEARTS),
  new Card(4, Card.HEARTS)
]);
//Royal Straight Flush value =10
var h3 = new Hand([
  new Card(10, Card.HEARTS),
  new Card(14, Card.HEARTS),
  new Card(13, Card.HEARTS),
  new Card(11, Card.HEARTS),
  new Card(12, Card.HEARTS)
]);
//Flush value = 6
var h4 = new Hand([
  new Card(10, Card.DIAMONDS),
  new Card(12, Card.DIAMONDS),
  new Card(11, Card.DIAMONDS),
  new Card(5, Card.DIAMONDS),
  new Card(4, Card.DIAMONDS)
]);


//---Stage2
//check RankGroups

//Four of a kind value=8- groupOf4 = 2groups. Bigest length equals to 4
var h5 = new Hand([
  new Card(10, Card.CLUBS),
  new Card(10, Card.HEARTS),
  new Card(13, Card.DIAMONDS),
  new Card(10, Card.HEARTS),
  new Card(10, Card.HEARTS)
]);

//Full House value=7- groupOf3 && grouOf2 = 2groups. Bigest length equals to 3
var h6 = new Hand([
  new Card(12, Card.HEARTS),
  new Card(12, Card.DIAMONDS),
  new Card(4, Card.DIAMONDS),
  new Card(12, Card.CLUBS),
  new Card(4, Card.SPADES)
]);
//Three of a kind value=4- groupOf3 = 3groups. Bigest length equals to 3
var h7 = new Hand([
  new Card(5, Card.HEARTS),
  new Card(5, Card.DIAMONDS),
  new Card(2, Card.DIAMONDS),
  new Card(5, Card.CLUBS),
  new Card(4, Card.SPADES)
]);
//Two pair value=3- groupOf2&&groupOf2 value=3-  3groups. Bigest length equals to 2
var h8 = new Hand([
  new Card(10, Card.HEARTS),
  new Card(10, Card.DIAMONDS),
  new Card(4, Card.DIAMONDS),
  new Card(5, Card.CLUBS),
  new Card(4, Card.SPADES)
]);
//One pair value=2- groupOf2 = 4groups.
var h9 = new Hand([
  new Card(10, Card.HEARTS),
  new Card(12, Card.DIAMONDS),
  new Card(12, Card.DIAMONDS),
  new Card(5, Card.CLUBS),
  new Card(4, Card.SPADES)
]);
//High card value=1- groupOf1 = 5groups.
var h10 = new Hand([
  new Card(10, Card.HEARTS),
  new Card(12, Card.DIAMONDS),
  new Card(11, Card.DIAMONDS),
  new Card(5, Card.CLUBS),
  new Card(4, Card.SPADES)
]);

//Stage 3 -->PlayGround
function printAllGrDeH() {
    for (let i = 1; i <= 10; i++) console.log('h' + i + '.grDeH:', window['h' + i].grDeH)
}
//printAllGrDeH()

function printAllHandsValues(){
    for(let i=1;i<=10;i++) console.log('h'+i+'._value:', window['h'+i]._value)
}
printAllHandsValues()
