'use client';

import chroma from "chroma-js";
import Color, { ColorInstance } from 'color';
import Link from "next/link";
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Goal, ArrowBigRight, RotateCcw } from "lucide-react";

type Screen = 'MEMORY' | 'GUESS' | 'DIFF' | 'RESULTS'


// user guess judging
const midpoint = 13.7; // where the 50% score happens
const steepness = 0.39; // lower is more forgiving
const gamesAmount = 3;

export default function Page () {
  // game state
  const [currentScreen, setCurrentScreen] = useState<Screen>('MEMORY') // MEMORY, GUESS, DIFF, RESULTS
  // history
  const [colorGuesses, setColorGuesses] = useState<string[]>([]);
  const [colorTargets, setColorTargets] = useState<string[]>([]); // unused for now
  const [accHistory, setAccHistory] = useState<number[]>([]);
  // colors
  const [hue, setHue] = useState([180]);
  const [saturation, setSaturation] = useState([50]);
  const [brightness, setBrightness] = useState([50]);
  const [randomColor, setRandomColor] = useState('');
  // accuracy & grading 
  const [colorAcc, setColorAcc] = useState<number>(0);
  const [gradeLabel, setGradeLabel] = useState('');
  // slider colors
  let userColor = Color.hsv(Number(hue), Number(saturation), Number(brightness)).hex()
  let saturationFinalColor = `linear-gradient(to top, ${Color.hsv(Number(hue), 0, Number(brightness)).hex()}, ${Color.hsv(Number(hue), 100, Number(brightness)).hex()}`
  let brightnessFinalColor = `linear-gradient(to top, ${Color.hsv(Number(hue), Number(saturation), 0).hex()}, ${Color.hsv(Number(hue), Number(saturation), 100).hex()}`
  // memorization timer
  const [timeLeft, setTimeLeft] = useState(5000); // 5000ms
  useEffect(() => {
    if (currentScreen != 'MEMORY') return;
    
    const startTime = Date.now();
    const duration = 5000;
    setRandomColor(chroma.random().hex())
    const timerId = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(duration - elapsed, 0);
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(timerId);
        handleNextScreen();
      }
    }, 10); // 10ms update
    return () => clearInterval(timerId);
  }, [currentScreen]);

  function addColorGuess(score: number) {
    setColorGuesses((prevColorGuesses) => {
      const updatedColorGuesses = [...prevColorGuesses, Color.hsv(Number(hue), Number(saturation), Number(brightness)).hex()];
      return updatedColorGuesses;
    });
    setColorTargets((prevColorTargets) => {
      const updatedColorTargets = [...prevColorTargets, randomColor];
      return updatedColorTargets;
    });
    setAccHistory((prevAccHistory) => {
      const updatedAccHistory = [...prevAccHistory, score];
      return updatedAccHistory;
    });
  }

  function resetSliders() {
    setHue([180]);
    setSaturation([50]);
    setBrightness([50]);
  }

  function handleNextScreen () {
    if (currentScreen === 'MEMORY') setCurrentScreen('GUESS')
    else if (currentScreen === 'GUESS') setCurrentScreen('DIFF')
    else if (currentScreen === 'DIFF') {
      if (colorGuesses.length <= gamesAmount - 1) {
        setCurrentScreen('MEMORY')
        setTimeLeft(5000)
        resetSliders();
      } else {
        setCurrentScreen('RESULTS')
      }
    }
  }

  function calculateColorAcc() {
    const deltaE = chroma.deltaE(Color.hsv(Number(hue), Number(saturation), Number(brightness)).hex(), randomColor)
    const score = Math.round(100 / (1 + Math.exp(steepness * (deltaE - midpoint))));
    setColorAcc(score);
    let label = "Different";
    if (score <= 65) label = "Clearly a miss";
    else if (score <= 75) label = "Similar";
    else if (score <= 85) label = "Almost got it";
    else if (score <= 95) label = "Nearly Identical";
    else if (score <= 100) label = "Spot on!";
    setGradeLabel(label);
    return score;
  }
  // screens
  const screens = {
    MEMORY: (
      <div className="h-full w-full flex z-10" style={{ backgroundColor: randomColor }}>
        <p className="fixed right-2 top-2 font-bold font-mono text-shadow-lg text-black/80 dark:text-white/80 text-xl">{(timeLeft / 1000).toFixed(2)}</p>
      </div>
    ),
    GUESS: (
      <div className="h-full w-full gap-4 flex flex-row relative" style={{ backgroundColor: userColor }}>
        <div className='flex'>
          <Slider orientation="vertical" max={360} value={hue}
          onValueChange={(value) => setHue(value)}/>
          <Slider orientation="vertical" max={100} step={0.3} value={saturation}
          onValueChange={(value) => setSaturation(value)} customColor={saturationFinalColor}/>
          <Slider orientation="vertical" max={100} step={0.3} value={brightness}
          onValueChange={(value) => setBrightness(value)} customColor={brightnessFinalColor}/>
        </div>
        <Button className="w-12 h-12 overflow-visible absolute bottom-4 right-4" onClick={handleSubmit}><Goal/></Button>
        <p className="absolute bottom-18 right-4">{colorGuesses.length + 1}/{gamesAmount}</p>
      </div>
    ),
    DIFF: (
      <div className="h-full w-full flex flex-col" >
        <div className="h-full w-full py-2 px-4 flex flex-col-reverse" style={{ backgroundColor: randomColor }}>
          <p className="font-mono font-bold text-white/80">TARGET COLOR</p>
        </div>
        <div className="h-full w-full py-2 px-4" style={{ backgroundColor: userColor }}>
          <p className="font-mono font-bold text-white/80">YOUR COLOR</p>
          <p className="font-mono font-bold text-white/80">Accuracy: {colorAcc}%</p>
          <p className="font-mono font-bold text-white/80">{gradeLabel}</p>
        </div>
        <Button className="w-12 h-12 overflow-visible absolute bottom-4 right-4" onClick={handleProceed}><ArrowBigRight /></Button>
      </div>
    ),
    RESULTS: (
      <div className="h-full w-full z-10 p-4 bg-background">
        <p className="font-bold font-mono mb-10">Results</p>
        
        <Button className="w-12 h-12 overflow-visible absolute bottom-4 right-4" onClick={resetGame}><RotateCcw /></Button>
        <div className="m-2 md:mx-10 flex">
          <p className="flex-1 text-xs">YOUR COLORS</p>
          <p className="text-right text-xs">TARGET COLORS</p>
        </div>
        
        <div className="flex flex-row m-2 md:mx-10">
          <div className="flex flex-1 flex-col gap-5">
            {colorGuesses.map((guess, guessIndex) => (
                <div className='h-10 w-full flex rounded-l-md items-center pl-4' style={{background: guess}} key={guessIndex}>
                  {accHistory.map((accuracy, accIndex) => (
                    <p key={accIndex} className="font-medium font-mono text-shadow-lg">
                      {guessIndex === accIndex && `${accuracy}%`}
                    </p>
                  ))}
                </div>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-5">
            {colorTargets.map((target, index) => (
                <div className='h-10 w-full rounded-r-md' style={{background: target}} key={index}>
                </div>
            ))}
          </div>

        </div>
      </div>
    )
  };

  function handleSubmit () {
    const score = calculateColorAcc();
    addColorGuess(score);
    handleNextScreen();
  }
  function handleProceed () {
    handleNextScreen();
  }
  function resetGame () {
    setCurrentScreen('MEMORY');
    setTimeLeft(5000)
    setColorGuesses([]);
    setColorTargets([]);
    setAccHistory([]);
    resetSliders();
  }
  return (
    <>
    <div className="h-dvh w-screen">
      {screens[currentScreen]}
    </div> 
    </>
    )
}
