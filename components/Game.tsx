
"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import GreenCar from "@/public/assets/vehicles/greenCar.png";

const Game = () => {
  const vehicleRef = useRef<HTMLImageElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [quote, setQuote] = useState("");
  const [userInput, setUserInput] = useState("");
  const [stepSize, setStepSize] = useState(0);
  const [currentCharacterCounter, setCurrentCharacterCounter] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [accuracy, setAccuracy] = useState(100); // Initial accuracy 100%
  const [wpm, setWPM] = useState(0);
  const [countdown, setCountdown] = useState(5); // Countdown timer state
  const [typingTime, setTypingTime] = useState(0); // Typing timer state

  // Function to start or restart the game
  const startGame = () => {
    if (gameStarted) {
      resetGame();
    } else {
      setCountdown(5);
      setGameStarted(true);
    }
  };

  // Function to reset the game state
  const resetGame = () => {
    setPosition(0);
    setUserInput("");
    setCurrentCharacterCounter(0);
    setStartTime(0);
    setEndTime(0);
    setAccuracy(100);
    setWPM(0);
    setCountdown(5);
    setTypingTime(0);
    fetchRandomQuote();
    setGameStarted(false);
  };

  // Function to calculate accuracy based on user input
  const calculateAccuracy = () => {
    setAccuracy((prev) => {
      return prev <= 0 ? 0 : prev - 100 / quote.length;
    });
  };

  // Function to calculate WPM based on user input
  const calculateWPM = () => {
    const wordsTyped = userInput.trim().split(/\s+/).length;
    const minutesElapsed = (Date.now() - startTime) / 1000 / 60;
    return Math.round(wordsTyped / minutesElapsed);
  };

  // Fetch a random quote
  const fetchRandomQuote = async () => {
    const response = await fetch(`https://api.quotable.io/random`);
    const res = await response.json();
    console.log("Fetched Quote:", res.content);
    setQuote(res.content);
  };

  // Fetch a random quote when the component mounts
  useEffect(() => {
    fetchRandomQuote();
  }, []);

  // Handle key press events for typing and backspace
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || countdown > 0) return; // Do not handle key presses if game has not started or countdown is ongoing

      if (e.key === "Backspace") {
        if (currentCharacterCounter > 0) {
          setPosition((prev) => prev - stepSize);
          setCurrentCharacterCounter((prev) => (prev > 0 ? prev - 1 : 0));
          setUserInput((prev) => prev.slice(0, -1));
        }
      } else if (e.key.length === 1) {
        // Only consider single character keys
        const keyPressed = e.key;
        const currentCharacterOnQuote = quote[currentCharacterCounter];

        if (keyPressed === currentCharacterOnQuote) {
          setPosition((prev) => prev + stepSize);
          setCurrentCharacterCounter((prev) => prev + 1);
          setUserInput((prev) => prev + keyPressed);
        } else {
          calculateAccuracy(); // Update accuracy on incorrect key press
        }
      }

      // Update WPM on every key press
      setWPM(calculateWPM());

      // Check if user has completed typing the quote
      if (currentCharacterCounter === quote.length - 1) {
        setEndTime(Date.now());
        setGameStarted(false); // End the game
      }

      console.log("Position:", position);
      console.log("Step Size:", stepSize);
      console.log("Quote:", quote);
      console.log("Key Pressed:", e.key);
      console.log("Current Character Counter:", currentCharacterCounter);
      console.log("Current Character", quote[currentCharacterCounter]);
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    gameStarted,
    countdown,
    stepSize,
    quote,
    currentCharacterCounter,
    startTime,
    endTime,
    userInput,
  ]);

  // Calculate the step size based on the length of the quote and the track width
  useEffect(() => {
    if (quote && trackRef.current) {
      const trackWidth = trackRef.current.offsetWidth;
      if (trackWidth) {
        const newStepSize = trackWidth / quote.length;
        console.log("Track Width:", trackWidth);
        console.log("Quote Length:", quote.length);
        console.log("New Step Size:", newStepSize);

        setStepSize(newStepSize);
      }
    }
  }, [quote]);

  // Effect to handle game start countdown and game end
  useEffect(() => {
    if (!gameStarted || countdown === 0) return;

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          setStartTime(Date.now());
          clearInterval(countdownTimer);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [gameStarted, countdown]);

  // Effect to update typing time
  useEffect(() => {
    if (!gameStarted || countdown > 0) return;

    const typingTimer = setInterval(() => {
      if (endTime) {
        clearInterval(typingTimer);
      } else {
        setTypingTime(Date.now() - startTime);
      }
    }, 100);

    return () => clearInterval(typingTimer);
  }, [gameStarted, countdown, startTime, endTime]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto text-center">
        <p className="mb-6 text-2xl font-bold">{quote}</p>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded mb-6"
          onClick={startGame}
        >
          {gameStarted && countdown === 0 ? "Race Again" : "Start Game"}
        </button>
        <div
          ref={trackRef}
          className="relative w-full h-24 bg-gray-800 rounded overflow-hidden mb-6"
        >
          <Image
            ref={vehicleRef}
            style={{ left: `${position}px` }}
            alt="greenCar"
            src={GreenCar.src}
            width={100}
            height={100}
            className="absolute bottom-0 h-20 w-20"
          />
        </div>

        <div className="flex justify-between w-full mb-6">
          <div>
            <p className="text-xl">Accuracy: {accuracy}%</p>
            <p className="text-xl">WPM: {wpm}</p>
          </div>
          <div>
            {countdown > 0 ? (
              <p className="text-xl">Game starts in: {countdown} seconds</p>
            ) : (
              <p className="text-xl">
                Typing Time: {(typingTime / 1000).toFixed(2)} seconds
              </p>
            )}
          </div>
        </div>

        <div className="w-full">
          <textarea
            autoFocus
            autoComplete="false"
            autoCorrect="false"
            value={userInput}
            onChange={() => {}} // No need to handle this as we're updating userInput directly in handleKeyPress
            className="w-full h-24 bg-black text-white border border-gray-700 rounded p-4 resize-none"
          ></textarea>
        </div>
      </div>
    </main>
  );
};

export default Game;

