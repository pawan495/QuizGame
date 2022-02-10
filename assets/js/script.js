//* Variables

const introSection = document.querySelector("#JS-intro");
const quizSection = document.querySelector("#JS-quiz");
const formSection = document.querySelector(".form-container");
const highScoresSection = document.querySelector("#JS-high-scores");
const quizHeader = document.querySelector("#JS-quiz h1");

const quizAnswersArray = Array.from(document.querySelectorAll(".option"));
const quizAnswers = document.querySelectorAll(".option");
const quizParent = document.querySelector("#JS-option-list");
const quizbutton = document.querySelectorAll(".button-wrapper");

// Buttons
const startButtonEl = document.querySelector("#start-quiz");
const submitButtonEl = document.querySelector("#submit");
const clearScoresButtonEl = document.querySelector(".clear-scores");
const restartButtonEl = document.querySelector(".restart");

// Other variables
const textCorrect = document.querySelector(".choice-correct");
const textWrong = document.querySelector(".choice-wrong");
const timer = document.querySelector("#time-countdown");
const timeText = document.querySelector(".time-text");
const scoreText = document.querySelector("#score-text");
const scoreLink = document.querySelector("#scores-link");
const input = document.querySelector("#input-name");
const listOfScores = document.querySelector("#JS-all-scores");

// Current question being asked
let currentQuestions = {};
// List of unique questions left
let availableQuestions = [];
// Variable for prevent user from clicking too quickly too many times thus messing up the game
let acceptingAnswers = false;
// What the timer will start it and is also the score
let startTime = 100;

// Since we are getting the highscores for the first time this will initialize our empty array which the scores will be saved to
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
let currentScore = localStorage.getItem("currentScore") || [];

//* Questions List

let questions = [
    {
        question: "Inside which HTML element do we put the JavaScript??",
        option1: "<script>",
        option2: "<javascript>",
        option3: "<js>",
        option4: "<scripting>",
        answer: 1
      },
      {
        question: "What is the correct syntax for referring to an external script called 'xxx.js'?",
        option1: "<script href='xxx.js'>",
        option2: "<script name='xxx.js'>",
        option3: "<script src='xxx.js'>",
        option4: "<script file='xxx.js'>",
        answer: 3
      },
      {
        question: " How do you write 'Hello World' in an alert box?",
        option1: "msgBox('Hello World');",
        option2: "alertBox('Hello World');",
        option3: "msg('Hello World');",
        option4: "alert('Hello World');",
        answer: 4
      },
  
  {
    question: "Where are variables declared in the global scope accessible?",
    option1: "1. Anywhere ",
    option2: "2. Only inside the function they were declared in",
    option3: "3. nowhere",
    option4: "4. Variables can't be declared",
    answer: 1,
  },
  
  {
    question: "Where is Javascript code executed?",
    option1: "1. In the browser",
    option2: "2. The Call stack",
    option3: "3. The Heap",
    option4: "4. The Variable Environment",
    answer: 2,
  },
  {
    question:
      "What 3 languages are usually used together for front end development",
    option1: "1. HTML, CSS, Python",
    option2: "2. HTML, JavaScript, C+",
    option3: "3. HTML, CSS, Javascript",
    option4: "4. Only Javascript",
    answer: 3,
  },
  {
      question:
      "Where is Client-side JavaScript code is embedded within HTML documents?",
   option1: "A URL that uses the special javascript: code",
   option2: "A URL that uses the special javascript: protocol",
   option3: "A URL that uses the special javascript: encoding",
   option4: "A URL that uses the special javascript: stack",
      answer:2
  }
 
];

availableQuestions = [...questions];

//*FUNCTIONS

function countDownFunction() {
  if (startTime >= 0 && sectionCounter === 1) {
    timer.innerText = startTime;
    startTime--;
  } else if (startTime < 0 && sectionCounter < 2) {
    nextSection();
  }
}

let sectionCounter = 0;
const nextSection = function () {
  const oneMinute = setInterval(countDownFunction, 1000);
  sectionCounter++;
 
  if (sectionCounter === 1) {
    introSection.classList.add("hide");
    quizSection.classList.remove("hide");
   
   
    getNewQuestions();
  } else if (sectionCounter === 2) {
    clearInterval(oneMinute);
    quizSection.classList.add("hide");
    formSection.classList.remove("hide");
    
    
    finalScore();
  } else if (sectionCounter === 3) {
    scoresList();
    formSection.classList.add("hide");
    highScoresSection.classList.remove("hide");
    scoreLink.classList.add("hide");
  } else {
    sectionCounter = 0;
  }
};

function getNewQuestions() {

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);

    currentQuestions = availableQuestions[questionIndex];

    if (availableQuestions.length === 0) {
    nextSection();
  } else {
    quizHeader.innerText = currentQuestions.question;
    quizAnswersArray.forEach(function (option) {
      const number = option.dataset["number"];
      option.innerText = currentQuestions["option" + number];
    });
  }

  // Removes a repeated question so it can't be used anymore
  availableQuestions.splice(questionIndex, 1);

  acceptingAnswers = true;
}

// Function that validates answer
function validateAnswer(e) {
  if (!acceptingAnswers) return;
  acceptingAnswers = false;
  const choice = e.target;
  const answer = choice.dataset["number"];
  let correctOrWrong;
  if (
    answer != currentQuestions.answer &&
    choice.classList.contains("option")
  ) {
    correctOrWrong = "wrong";
    startTime -= 10;
    textWrong.classList.remove("hide");
  } else if (
    answer == currentQuestions.answer &&
    choice.classList.contains("option")
  ) {
    correctOrWrong = "correct";
    textCorrect.classList.remove("hide");
  }
  // Adds 'correct' or 'wrong' class
  choice.classList.add(correctOrWrong);

  setTimeout(function () {
    choice.classList.remove(correctOrWrong);
    getNewQuestions();
  }, 1000);

  setTimeout(function () {
    textCorrect.classList.add("hide");
    textWrong.classList.add("hide");
  }, 1000);
}

function finalScore() {
  if (startTime != null) {
    // Final score will be sent to local storage
    localStorage.setItem("currentScore", timer.innerText);
    scoreText.innerText = localStorage.getItem("currentScore");
  }
}

function saveScore(e) {
  e.preventDefault();
  currentScore = localStorage.getItem("currentScore");
  const score = {
    score: currentScore,
    name: input.value,
  };
  highScores.push(score);
  highScores.sort(function (a, b) {
    return b.score - a.score;
  });
  highScores.splice(5);
  localStorage.setItem("highScores", JSON.stringify(highScores));
  // Moves on to the highscore section
  nextSection();
}
let place = 1;
function scoresList() {
  listOfScores.innerHTML = highScores
    .map(function (score) {
      return `<li class="score-item">${place++}. ${score.name.toUpperCase()}-${score.score}</li>`;
    })
    .join("");
}

//*EVENT LISTENERS

startButtonEl.addEventListener("click", nextSection);

quizParent.addEventListener("click", validateAnswer);

submitButtonEl.addEventListener("click", saveScore);

clearScoresButtonEl.addEventListener("click", function () {
  localStorage.clear();
  nextSection();
});

scoreLink.addEventListener("click", function () {
  highScoresSection.classList.remove("hide");
  introSection.classList.add("hide");
  quizSection.classList.add("hide");
  formSection.classList.add("hide");
  scoresList();
});
