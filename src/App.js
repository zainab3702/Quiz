import React, { useState, useEffect } from "react";
import quizData from "./quiz.json";

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAns, setCorrectAns] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(600);
  const [fullScreen, setFullScreen] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const storedState = localStorage.getItem("quizState");
    if (storedState) {
      const { currentQuestion, answers, timer } = JSON.parse(storedState);
      setCurrentQuestion(currentQuestion);
      setAnswers(answers);
      setTimer(timer);
    }
  }, []);

  useEffect(() => {
    const saveState = () => {
      const state = { currentQuestion, answers, timer };
      localStorage.setItem("quizState", JSON.stringify(state));
    };
    saveState();
  }, [currentQuestion, answers, timer]);

  useEffect(() => {
    if (fullScreen) {
      startTimer();
    }
  }, [fullScreen]);

  const startTimer = () => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(intervalId);
          alert("Time's up!");
          submitQuiz();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleAnswer = (answer) => {
    setAnswers((prevAnswers) => [...prevAnswers, answer]);
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = () => {
    let correctAnswersCount = quizData.filter((question, index) => answers[index] === question.answer).length;
    setCorrectAns(correctAnswersCount);
    setQuizCompleted(true);
  };

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setFullScreen(document.fullscreenElement !== null);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  if (!fullScreen) {
    return (
      <>
      <h1 id="main"> Quiz Competition</h1>
      <div className="quiz-container" style={{textAlign:"center"}}>
        <h1>Please enter full screen mode to start the quiz!</h1>
        <button onClick={handleFullScreen}>Enter Full Screen</button>
      </div>
      </>
    );
  }

  if (quizCompleted) {
    return (
      <div className="quiz-container">
        <h1>Quiz completed!</h1>
        <p>Number of Correct answers: {correctAns}</p>
      </div>
    );
  }

  const currentQuestionData = quizData[currentQuestion];

  return (
    <div className="quiz-container">
      <h2>{currentQuestionData?.question}</h2>
      <ul>
        {currentQuestionData?.options.map((option, index) => (
          <li key={index}>
            <button onClick={() => handleAnswer(option)}>{option}</button>
          </li>
        ))}
      </ul>
      <p>
        Question {currentQuestion + 1} of {quizData.length} - Time remaining:{" "}
        {Math.ceil(timer / 60)} minutes
      </p>
    </div>
  );
}

export default Quiz;
