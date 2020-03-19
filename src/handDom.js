//HandDom//////////////////////////////////////////////////////////////////

var pokerGround = document.getElementById("pokerGround")
var pickersGround = document.getElementById("pickersGround");

class CardDom{
    constructor(card){
        this.color = (card.suit == Card.HEARTS || card.suit == Card.DIAMONDS) ? 'red' : 'black'

        this.suit = card.suit == Card.HEARTS ? "♥"
                    :card.suit ==Card.CLUBS  ? "♣"
                    :card.suit ==Card.SPADES ? "♠"
                    :"♦"
        this.rank = card.rank == 14 ? 'A'
                  :card.rank == 13 ? 'K'
                  :card.rank == 12 ? 'Q'
                  :card.rank == 11 ? 'J'
                  :card.rank

        this.cardM = document.createElement('div')
        this.cardM.setAttribute("class", "grid-item")

        this.cardM.innerHTML = `<div class="rank top-left">${this.rank}<br>
            <div class="suit" style="color:${this.color}">${this.suit}</div>
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div class="suit suitCenter" style="color:${this.color}">${this.suit}</div>
            <div></div>
            <div></div>
            <div></div>
            <div class="rank bottom-right">${this.rank}<br>
            <div class="suit" style="color:${this.color}">${this.suit}</div>
            </div>`;
    }
}

class HandDom{
    constructor(hand, handDomeNode = pokerGround ){
        this.hand =hand.h
        this.handM = document.createElement('div')
        this.handM.setAttribute("class", "grid-container")

        this.cardMList = this.hand.map(card => new CardDom(card) )
        this.cardMList.forEach(cardDomed => this.handM.appendChild(cardDomed.cardM))

        this.handState = document.createElement('div')
        this.handState.setAttribute("class", "handState")
        
        this.rank = hand._value.rank? `<div class='status'>SmallestRank</div><div>${hand._value.rank}</div>`
            : hand._value.handValue == 3 ? `<div class='status'>Bigest-Smallest</div><div>${hand._value.bigest}-${hand._value.secondest}-${hand._value.thirdest}</div>`
            : hand._value.handValue == 2 ? `<div class='status'>Bigest-Smallest</div><div>${hand._value.bigest}-${hand._value.secondest}-${hand._value.thirdest}-${hand._value.fourdest}</div>`
            : hand._value.handValue == 1 ? `<div class='status'>Bigest-Smallest</div><div>${hand._value.bigest}-${hand._value.secondest}-${hand._value.thirdest}-${hand._value.fourdest}-${hand._value.fivedest}</div>`                
            : `<div class='status'>Bigest</div><div>${hand._value.bigest}`
        this.handState.innerHTML = `<div class='status'>HandValue</div>
                                    <div>${hand._value.handValue}</div>
                                    <div class='status'>HandType</div>
                                    <div>${hand._value.handType}</div>
                                    ${this.rank}`;

        this.handM.appendChild(this.handState)

        handDomeNode.appendChild(this.handM)

    }
}


new HandDom(h1)
new HandDom(h2)
new HandDom(h3)

////////////////////////////////////////////////////////Testerrrrrrrr


const Test = (function(){
    const suitArray = [Card.HEARTS, Card.CLUBS, Card.DIAMONDS, Card.SPADES]
    const rankArray = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14]
    let index = 0
    let suitIndex = 0
    let cardArray = rankArray.map(rank => {
        return { rank, suit: suitArray[suitIndex++ % suitArray.length] }
    })
    let handName
    let handNames = []
    let indexManual = 0
    const body = document.getElementsByTagName("BODY")[0]


    function createHand(manual=false, hand) {
        if(!manual){

        if (cardArray.length < 5) return;
        let cardList = []
        for (let i = 0; i < 5; i++) {
            let randomIndex = Math.floor(Math.random() * cardArray.length)
            let randomCard = cardArray.splice(randomIndex, 1)[0]
            cardList.push(new Card(randomCard.rank, randomCard.suit))
        }
        handName = 'randomHand' + index++
        this[handName] = new Hand(cardList)

        handNames.push( this[handName] )//{handName, this[handName]}
        new HandDom(this[handName])


    }else{
        handName = 'manualHand'+ ++indexManual
        new HandDom(hand)
    }

}
// let luckySuitArray = [Card.HEARTS]
// let luckyRankArray = [10,11,12,13,14]
// let luckyIndex = 0

// function createLuckyHand() {
//     let cardList = []
//     for (let i = 0; i < 5; i++) {
//         let randomSuit = luckySuitArray[Math.floor(Math.random() * luckySuitArray.length)]
//         let randomRank = luckyRankArray[Math.floor(Math.random() * luckyRankArray.length)]
//         cardList.push(new Card(randomRank, randomSuit))
//     }
//     let luckyHandName = 'luckyHand' + luckyIndex++
//     window[luckyHandName] = new Hand(cardList)
//     new HandDom(window[luckyHandName])

// }


//////////OBSERVERRRRRRRRRRRR
    function scroller(mis){
        var scrollPosition = window.pageYOffset
        var windowSize = window.innerHeight
        var bodyHeight = document.body.offsetHeight
        var botomDistance = Math.max(bodyHeight - (scrollPosition + windowSize), 0)
        window.scrollTo(0, window.scrollY + 10)
        setTimeout(function () { if(botomDistance > 0) scroller() }, mis)
    }

    // Select the node that will be observed for mutations
    var targetNode = pokerGround
    // Options for the observer (which mutations to observe)
    var config = { attributes: false, childList: true, subtree: false }
    // Callback function to execute when mutations are observed
    var callback = function (mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                console.log('A child node has been added or removed.', targetNode, handName)
                targetNode.lastElementChild.style.background = "rgba(96, 141, 180, 0.45)";

                let randomLabel = document.createElement('div')
                randomLabel.style.color = 'red'
                randomLabel.style.fontSize = '15px'
                randomLabel.innerHTML =  handName
                targetNode.lastElementChild.lastElementChild.appendChild(randomLabel)
                scroller(10)      
            }
        }
    }
    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback)
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config)
    //Later, you can stop observing observer.disconnect()

//////////OBSERVERRRRRRRRRRRR ENDSSSSS
   return {cardArray, createHand, handNames};
})()

//////////////////////////////////////////////////PickersLoader

var PickersLoader = (function () {

   let picker = document.createElement('div')
   picker.setAttribute("id", "picker")
   let picker2 = document.createElement('div')
   picker2.setAttribute("id", "picker2")

    let ulRanksPick = document.createElement('ul')
    ulRanksPick.setAttribute("class", "ranks-pick")
    let ulRanksPick2 = document.createElement('ul')
    ulRanksPick2.setAttribute("class", "ranks-pick")


    const rankArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    const suitArray = [Card.HEARTS, Card.CLUBS, Card.DIAMONDS, Card.SPADES]

    rankArray.forEach(rank => {
        let rankH = rank == 11 ? 'J'
                   :rank == 12 ? 'Q'
                   :rank == 13 ? 'K'
                   :rank == 14 ? 'A'
                   :rank



        let liRanks = document.createElement("li")
        liRanks.setAttribute("class", "ranks")


        let ulCardsPick = document.createElement('ul')
        ulCardsPick.setAttribute("class", "cards-pick")

        suitArray.forEach(suit =>{
            let color = suit == Card.HEARTS || suit == Card.DIAMONDS ? "red" : "black"
            let shape = suit == Card.HEARTS ? "♥" 
                      : suit == Card.CLUBS ? "♣" 
                      : suit == Card.SPADES ? "♠" 
                      : "♦"
            ulCardsPick.innerHTML += `<li class="card" data-rank=${rank} data-suit=${suit}>
                        <div class="rank">${rankH}</div>
                        <div class="suit" style="color:${color}">${shape}</div>
                    </li>`
        })
        liRanks.appendChild(ulCardsPick)
        if(rank < 9){
            ulRanksPick.appendChild(liRanks)
            picker.appendChild(ulRanksPick)
            } 
        else{
            ulRanksPick2.appendChild(liRanks)
            picker2.appendChild(ulRanksPick2)
        } 
   })
   pickersGround.appendChild(picker)
   pickersGround.appendChild(picker2)
  
})()


///////////////////////Manual Picker

var ManualPicker = (function () {
    

    function myScript() {
         if(this.classList[1]) return;
         this.classList.add("active") 
        }
    var cardsPicksColection = document.getElementsByClassName('cards-pick')
    var cardsPicks = [...cardsPicksColection]
    cardsPicks.forEach(cardsPick => { cardsPick.addEventListener("click", myScript) })

})()

///////////////////////Manual Picker Cards Objects

var ManualPickerCardsObjects = (function () {

    const rankArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    const ranksForClick = rankArray.slice(0)
    let indexOut

    const suitArray = [Card.HEARTS, Card.CLUBS, Card.DIAMONDS, Card.SPADES]
    const cards = rankArray.map(rank =>suitArray.map(suit =>new Card(rank, suit)))
    let manualHand = []
    let domPickers = []
    function myScript() {
       
       let shapeH = this.dataset.suit
       let rank = Number(this.dataset.rank)
        if (ranksForClick.findIndex(x => x == rank) > -1){
            ranksForClick.splice(ranksForClick.findIndex(x => x == rank), 1)
            return ;
        }
        //this.style.display = 'none'
        this.classList.toggle("clicked")
        domPickers.push(this)
        if(domPickers.length == 5){
            domPickers.forEach(pickedEl=>pickedEl.classList.toggle('clicked'))
            domPickers = []
        }
       
       let rankIndex = rank -2 
       let suitIndex = shapeH == Card.HEARTS ? 0 : shapeH == Card.CLUBS ? 1 : shapeH == Card.SPADES ? 3 : 2

        manualHand.push( cards[rankIndex][suitIndex] )
        if (manualHand.length == 5) {
            let newHand = new Hand(manualHand)
            manualHand = []
            Test.createHand(true, newHand )
           }
    }
    let cardsCol = document.getElementsByClassName('card')
    let cardsDom = [...cardsCol]
    cardsDom.forEach(card => { card.addEventListener("click", myScript) })

})()






