// get divs set up
const page = document.getElementById('page');
const guessContainer = document.getElementById('guessContainer');
const keyboardContainer = document.getElementById('keyboardContainer');
const testContainer = document.createElement('div');
page.append(testContainer);
let guessArray = [];
let guessDivArray = [];
let letterBox=[];
let letterBoxDivArray = [];
let currentGuess='';
let guessNum = 0;
let currentLetterBox = null;
let currentBoxNum = 0;

let word;
const WORD_LENGTH = 5;
const GUESSES = 6;
const disabledKeys = ['Escape', 'Tab', 'Shift', 'CapsLock', 'Control', 'Meta', 'Alt', 'ContentMenu', 'NumLock', 'ScrollLock', 'Pause', 'Delete', 'End', 'PageDown', 'PageUp', 'Home', 'Insert', 'ArrowUp', 'ArrowLeft', 'ArrowDown','ArrowRight', '*', '+', ' ','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12', '`', '1','2','3','4','5','6','7','8','9','0','-', "`","'", '=', '[',']', '\\', ';', '/', '.', '\,'];
console.log(disabledKeys);

function setup(){
  for (let j = 0; j<GUESSES*WORD_LENGTH; j++){
      letterBox[j] = document.createElement('div');
      letterBox[j].classList.add('letterBox');
  }
  
  let count = 0;
  currentLetterBox = letterBox[currentBoxNum];
  
  for (let i = 0; i<6; i++){
    count = i*5;
    guessDivArray[i] = document.createElement('div');
    guessContainer.appendChild(guessDivArray[i]);
    guessDivArray[i].classList.add('wordContainer');
    for (let k=count; k<count+5; k++){
      guessDivArray[i].appendChild(letterBox[k]);
    }
  }
  
  word = getWord();
}

function getWord(){
  return 'TRUTH';
}

setup();

window.addEventListener("keydown", function(event) { //process keypresses
  console.log(event.key, event.code);
  if (event.key == 'Enter'){
    submitWord();
    return;
  }
  if (event.key == 'Backspace'){
    previousBox()
    return;
  }
  else if (currentGuess.length <5){
    if (disabledKeys.includes(event.key)){
      console.log('that not allowed');
      return;
    }
    else{
      displayKey(event.key);
      nextBox();
    }
  }
    
}, true);

function startGame(){
  
}

function nextBox(){ // move to next box
  currentBoxNum +=1;
  currentLetterBox = letterBox[currentBoxNum];
}

function previousBox(){ //move to previous box and clear it
  currentBoxNum -=1;
  currentLetterBox = letterBox[currentBoxNum];
  currentLetterBox.innerText = '';
  currentGuess = currentGuess.slice(0,-1);
}

function displayKey(key){ // put keypress in box
  key = key.toUpperCase();
  console.log(currentBoxNum);
  currentLetterBox.innerText = key;
  currentGuess += key;
}

function checkWord(){
  if (currentGuess == word){
    alert('you win');
  }
  else{
    giveHints();
  }
  console.log('thats not the word');
}

function giveHints(){
  firstLetterBox = guessNum*5;  
  for (let i = 0; i < 5; i++){
    currentLetterBox = letterBox[firstLetterBox];
    if (word[i] == currentGuess[i]){
      console.log(currentLetterBox, currentLetterBox.style.backgroundColor);                 
      currentLetterBox.style.backgroundColor = 'green';          
    }
    else if (word.indexOf(currentGuess[i]) > -1){
      console.log(currentLetterBox, currentLetterBox.style.backgroundColor);                 
      currentLetterBox.style.backgroundColor = 'gold';
    }
    else{
      console.log(currentLetterBox, currentLetterBox.style.backgroundColor);                 
      currentLetterBox.style.backgroundColor = 'grey';
    }
    firstLetterBox +=1;
  }
}

function submitWord(){
  if (currentGuess.length == 5){
      checkWord();
      guessNum+=1;
      currentGuess = '';
      currentBoxNum = guessNum*5;
      currentLetterBox = letterBox[currentBoxNum];
      return;
    }
    else{
      alert('not enough letters in word');
      return;
    }
}