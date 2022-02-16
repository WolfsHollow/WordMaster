//initialize variables/
let guessArray = [];
let guessDivArray = [];
let letterBox=[];
let letterBoxDivArray = [];
let currentGuess='';
let guessNum = 0;
let currentLetterBox = null;
let currentBoxNum = 0;
let word;
let isKeyboardActive = true;
let isEnduranceActive = false;
let isHardModeActive = false;
let isColorBlindActive = false;
let hmWord = ['-','-','-','-','-'];
let boxColorAbsent = 'grey';
let boxColorCorrect = 'green';
let boxColorPresent = 'gold';

const WORD_LENGTH = 5;
const GUESSES = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// get div variables set up
const page = document.getElementById('page');
const guessContainer = document.getElementById('guessContainer');
const keyboardContainer = document.getElementById('keyboardContainer');
let displayMessage = document.getElementById('displayMessage');
const root = document.querySelector(':root');


//setup overlay for seeds
const seedButton = document.getElementById('seedButton');
const seedWindow = document.getElementById('seedWindow');
const seedInput = document.getElementById('seedInput');
const seedForm = document.getElementById('seedForm');
const currentSeed = document.getElementById('currentSeedMessage');
const seedClose = document.getElementById('seedClose');

// use seed to get new word from input
seedForm.onsubmit = () =>{let indices = getIndicesFromSeed(seedInput.value);
  word = wordList[indices[0]][indices[1]].toUpperCase();
  console.log(word);
  displayText('Word changed successfully');
  currentSeed.innerText = seedInput.value;
  toggleSeedWindow();
  return false;
};
seedButton.addEventListener('click', (e)=> {toggleWindow(seedWindow); e.target.blur()});
seedClose.addEventListener('click', (e)=> {toggleWindow(seedWindow); e.target.blur()});

//settings window setup
const settingsButton = document.getElementById('settingsButton');
const settingsWindow = document.getElementById('settingsWindow');
const settingsForm = document.getElementById('settingsForm');
const enduranceSlider = document.getElementById('enduranceSlider');
const hardmodeSlider = document.getElementById('hardmodeSlider');
const colorBlindSlider = document.getElementById('colorblindSlider');
const settingsClose = document.getElementById('settingsClose');
const themeDropdown = document.getElementById('theme');

themeDropdown.onchange = ()=>{themeChange(themeDropdown.value)};
settingsButton.addEventListener('click', (e) =>{toggleWindow(settingsWindow), e.target.blur()});
settingsClose.addEventListener('click', (e) =>{toggleWindow(settingsWindow), e.target.blur()});

function themeChange(theme){
  switch (theme){
    case 'Dark':
      root.style.setProperty('--background', 'linear-gradient(#141e30, #243b55)');
      root.style.setProperty('--textColor','white');
      root.style.setProperty('--displayTextColor','white');
      root.style.setProperty('--menuTextColor','white');
      root.style.setProperty('--keyColor', 'lightgrey');
      root.style.setProperty('--borderColor', '#E6E6E6');
      root.style.setProperty('--displayMessageBackground', 'black');
      root.style.setProperty('--menuBorderColor', 'black');
      boxColorPresent = 'gold';
      boxColorCorrect = 'green';
      boxColorAbsent = 'grey';
      break;
    case 'Wordle':
      root.style.setProperty('--background', `linear-gradient('#FFFFFF', '#000000')`);
      root.style.setProperty('--textColor', 'black');
      root.style.setProperty('--displayTextColor','black');
      root.style.setProperty('--menuTextColor','black');
      root.style.setProperty('--keyColor', 'green');
      root.style.setProperty('--borderColor', '#d3d6da');
      root.style.setProperty('--displayMessageBackground', 'white');
      root.style.setProperty('--menuBorderColor', 'black');
      boxColorPresent = '#c9b458';
      boxColorCorrect = '#6aaa64';
      boxColorAbsent = '#787c7e';      
      break;
    case 'Darker':
      root.style.setProperty('--background', 'linear-gradient(#000000, #0e2642)');
      root.style.setProperty('--textColor','lightgrey');
      root.style.setProperty('--displayTextColor','lightgrey');
      root.style.setProperty('--menuTextColor','lightgrey');
      root.style.setProperty('--keyColor', 'darkgrey');
      root.style.setProperty('--borderColor', '#8d8d8d');
      root.style.setProperty('--displayMessageBackground', 'black');
      root.style.setProperty('--menuBorderColor', 'black');
      boxColorPresent = '#b59feb';
      boxColorCorrect = '#538d4e';
      boxColorAbsent = '#3a3a3c';
      break;
  }
  console.log(`theme changed`);
}

//stats window setup
const statsButton = document.getElementById('statsButton');
const statsWindow = document.getElementById('statsWindow');
const chart = document.getElementById('guessChart');
const streakDiv = document.getElementById('streakDiv');
const winLossDiv = document.getElementById('winLoss');
const statsClose = document.getElementById('statsClose');
let guessNumCount = [0,0,0,0,0,0,0]; //[oneGuesses,twoGuesses,..., losses]

// winLossDiv.innerText = `Wins/Loss - ${}`

let gameCount = 0;
let streak = 0;
streakDiv.innerText = `Current Streak: ${streak}`;

let yValues = ["1", "2", "3", "4", "5", "6", "Loss"];
let xValues = guessNumCount;
let barColors = ["red", "green","blue","orange","brown","purple", 'white'];

let guessChart = new Chart(chart, {
  type: "horizontalBar",
  data: {
    labels: yValues,
    datasets: [{
      backgroundColor: barColors,
      data: xValues
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {display: false},
    title: {
      display: true,
      text: "Wins"
    },
    scales: {     
      xAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(value) {if (value % 1 === 0) {return value;}}
        }
      }]
    }    
  }
});

statsButton.addEventListener('click', (e) => {toggleWindow(statsWindow), e.target.blur()});
statsClose.addEventListener('click', (e) => {toggleWindow(statsWindow), e.target.blur()});

//Setup page

enduranceSlider.addEventListener('click',()=>{isEnduranceActive = !isEnduranceActive});
hardmodeSlider.addEventListener('click',()=>{isHardModeActive = !isHardModeActive});
colorBlindSlider.addEventListener('click',()=>{displayText('not currently implemented'); isColorBlindActive = !isColorBlindActive});
setup();
window.addEventListener("keydown", keypressEvent, true); //process keys

//New word button and setup
const newWordButton = document.getElementById('newWord');
newWordButton.addEventListener('click', (e) => {resetGame(); e.target.blur()});

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
  keyboardSetup();  
  word = getWord();
  console.log(word);
}

function getWord(){ 
  let randomLetterIndex = getRandomNumber(0,25);
  console.log(randomLetterIndex, wordList[randomLetterIndex].length)
  let listLength = wordList[randomLetterIndex].length;
  let randomWordIndex = getRandomNumber(0, listLength);
  let seed = generateSeed(randomLetterIndex, randomWordIndex);
  currentSeedMessage.innerText = seed;

  return wordList[randomLetterIndex][randomWordIndex].toUpperCase();  
}

function getRandomNumber(min,max){ //taken from internet for RNG
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function keyboardSetup(){  //adds click event to on screen keyboard
  let keyBox = document.getElementsByClassName('key');
  for (let i = 0; i<keyBox.length; i++){
    keyBox[i].addEventListener('click', (event)=>{processKeyEvent(event)});
  } 
}

function keypressEvent(event){
  processKeyEvent(event);
}

function processKeyEvent(event){ 
  if (guessNum <=5){
    keyPressed = event.key;
    if (event.key === undefined){ //through onscreen keyboard input
      keyPressed = event.target.innerText;
    }
    if (keyPressed == 'Enter'){
      submitWord();
      return;
    }
    if (keyPressed == 'Backspace' || keyPressed == 'Back'){
      previousBox()
      return;
    }
    else if (currentGuess.length <5){      
      keyPressed = keyPressed.toUpperCase();
      if (ALPHABET.indexOf(keyPressed)>=0){
        displayKey(keyPressed);
        nextBox();
      }
      else {
        return;
      }
    }
  }
}

function nextBox(){ 
  currentBoxNum +=1;
  currentLetterBox = letterBox[currentBoxNum];
}

function previousBox(){ 
  if (!currentGuess == ''){
    currentBoxNum -=1;
    currentLetterBox = letterBox[currentBoxNum];
    currentLetterBox.innerText = '';
    currentGuess = currentGuess.slice(0,-1);
  }
}

function displayKey(key){ 
  currentLetterBox.innerText = key;
  // currentLetterBox.classList.add('letterPop');
  // setTimeout(()=>{currentLetterBox.classList.remove('letterPop')}, 30);
  if (currentGuess.length <5){
    currentGuess += key;
  }
}

function checkWord(){  
  giveHints();
  if (currentGuess == word){    
    displayText('You win!');
    streak+=1;
    streakDiv.innerText = `Current Streak: ${streak}`;
    guessNumCount[guessNum]+=1;
    gameCount +=1;
    guessChart.update();
    if (isEnduranceActive){
      enduranceStart();
    }
  }
  else if (guessNum == 5){
    displayText(`The word was ${word}`);
    streak = 0;
    streakDiv.innerText = `Current Streak: ${streak}`;
    guessNumCount[6] +=1;
    gameCount +=1;
    guessChart.update();
  }  
}

function enduranceStart(){
  let firstGuess = currentGuess;
      setTimeout(()=>{resetGame();
                      currentGuess = firstGuess;
                      for (let i = 0; i<currentGuess.length; i++){
                        displayKey(currentGuess[i]);
                        nextBox();
                      }
                      submitWord();                      
                     }, 5000);  
}

function hardModeCheck(){ //checks to see if new guess has letter in described position before
  for (let i = 0; i<5; i++){
    if (hmWord[i] == '-'){
      continue;
    }
    else if (hmWord[i] != '-' && hmWord[i] == currentGuess[i]){
      continue;
    }    
    else {
      return false;
    }
  }
  return true;
}

function giveHints(){ // colors keys and boxes for hints
  firstLetterBox = guessNum*5;  
  let keyDiv;
  let color;
  for (let i = 0; i < 5; i++){
    currentLetterBox = letterBox[firstLetterBox];
    keyDiv = document.getElementById(currentGuess[i]);

    if (word[i] == currentGuess[i]){
      color = boxColorCorrect;
      hmWord[i] = currentGuess[i];
    }
    else if (word.indexOf(currentGuess[i]) > -1){
      color = boxColorPresent
    }
    else{
      color = boxColorAbsent      
    }       
    
    let card = currentLetterBox;
    let cardColor = color;
    let keyboardKey = keyDiv;

    //add timer to animate sequentially
    setTimeout(()=>{card.classList.add('flipLetter');
                    card.style.backgroundColor = cardColor;
                    card.style.border = `2px solid ${cardColor}`;
                    keyboardKey.style.backgroundColor = cardColor;                    
                  }
              , 300*i);
    setTimeout(()=>{card.classList.remove('flipLetter');                   
                  }
              , 2000);//remove class to be able to apply it again later for new word
        
    firstLetterBox +=1;
  }
}

function submitWord(){  
  if (currentGuess.length == 5){    
    let isWord = validateGuess();
    if (isWord){
      if (isHardModeActive){
        if (!hardModeCheck()){
          displayText(`Hard Mode is active, you must match discovered green letters in your guess`);
          return;
        };
      }
      checkWord();
      guessNum+=1;
      currentGuess = '';
      currentBoxNum = guessNum*5;
      currentLetterBox = letterBox[currentBoxNum];
      return;
    }
    else {
      displayText(`That's not an acceptable word`);
      currentLetterBox = letterBox[currentBoxNum-1];
      let wordContainer = currentLetterBox.parentElement;
      wordContainer.classList.remove('shakeWord');
      setTimeout(()=>{wordContainer.classList.add('shakeWord')}, 100); 
    return;
    }
  }
  else if (currentGuess.length != 5){
    displayText('Not enough letters in word');
    let wordContainer = currentLetterBox.parentElement;
    wordContainer.classList.remove('shakeWord');
    setTimeout(()=>{wordContainer.classList.add('shakeWord')}, 100); 
    return;
  }
}

function validateGuess(){
  let firstLetter = currentGuess[0];
  let letterIndex = ALPHABET.indexOf(firstLetter);
  return completeWordList[letterIndex].includes(currentGuess);
}

function displayText(message){ 
  displayMessage.innerText = message;
  displayMessage.classList.add('show');
  setTimeout(()=>{displayMessage.classList.remove('show')}, 2000);
}

function generateSeed(letterNum, wordNum){ 
  
  let wordNumDigits;
  wordNum = wordNum.toString();
  
  //insert random numbers to obscure word letter
  let firstRanDigits = getRandomNumber(1,10);  
  let secondRanDigits = getRandomNumber(0,10);
  let thirdRanDigits = getRandomNumber(0,10);

  //add 0's to keep number length
  let letterNumDigits = ("0" + letterNum).slice(-2);
  if (wordNum.length == 1){
    wordNumDigits = ("000" + wordNum);
  }
  else if (wordNum.length == 2){
    wordNumDigits = ("00" + wordNum);
  }
  else if (wordNum.length == 3){
    wordNumDigits = ("0" + wordNum);
  }
  else {
    wordNumDigits = wordNum;
  }
  
  //put seed together, X,####X,##X
  let seed = firstRanDigits + wordNumDigits + secondRanDigits + letterNumDigits + thirdRanDigits;
  
  return seed;
}

function getIndicesFromSeed(seed){  
  if (seed >= 100000000 && seed < 999999999){
    let wordNum = seed.slice(1,5);
    let letterNum = seed.slice(6,8);
    wordNum = Number(wordNum);
    letterNum = Number(letterNum);
    return [letterNum, wordNum];
  }
}

function toggleWindow(window){
  let classes = window.classList;
  if (classes.contains('show')){
    classes.remove('show');
  }
  else {
    classes.add('show');
  }
  toggleKeyboard();
}

function toggleKeyboard(){ //toggle listener on/off for keyboard input
  isKeyboardActive = !isKeyboardActive;
  if (isKeyboardActive){
    window.addEventListener("keydown", keypressEvent, true);    
  }
  else if (isKeyboardActive == false){
    window.removeEventListener("keydown", keypressEvent, true);
  }  
}

function resetGame(){
  console.log('reset the game');
  for (let j = 0; j<GUESSES*WORD_LENGTH; j++){
    letterBox[j].style.backgroundColor = null;
    letterBox[j].style.border = null;
    letterBox[j].innerText = '';
  }  
  let keyBox = document.getElementsByClassName('key');
  for (let i = 0; i<keyBox.length; i++){
    keyBox[i].style.backgroundColor = null;
  } 
  guessNum = 0;
  currentGuess = '';
  hmWord = ['-','-','-','-','-'];
  currentBoxNum = 0;
  currentLetterBox = letterBox[currentBoxNum];

  word = getWord();
  console.log(word);
  displayText('New word obtained');
}