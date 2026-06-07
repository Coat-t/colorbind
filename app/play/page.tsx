'use client';

import chroma from "chroma-js";
import Color, { ColorInstance } from 'color';
import Link from "next/link";
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Goal, ArrowBigRight, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

type Screen = 'MEMORY' | 'GUESS' | 'DIFF' | 'RESULTS'


// user guess judging
const midpoint = 13.7; // where the 50% score happens
const steepness = 0.39; // lower is more forgiving
const gamesAmount = 3;
const memorizeDuration = 5000; // ms to memorize

const colorCardEnter : any = {
    hidden: { 
      x: "100vw",
      opacity: 0,
      scale: 0.8
    },
    visible: { 
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 25,
        restDelta: 0.001
      }
    }
};
export default function Page () {
  // game state
  const [currentScreen, setCurrentScreen] = useState<Screen>('MEMORY') // MEMORY, GUESS, DIFF, RESULTS
  const [isCardFlipeed, setIsCardFlipped] = useState(false);
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
    
    setIsCardFlipped(true);
    const startTime = Date.now();
    const duration = memorizeDuration;
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
      <div className="h-full w-full flex items-center justify-center overflow-hidden">
        <motion.div
          className="w-40 h-60 perspective-[1000px]"
          variants={colorCardEnter}
          initial="hidden"
          animate="visible">
          <motion.div className="h-full w-full relative transform-3d"
          animate={{ rotateY: isCardFlipeed ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}>
            <div className="absolute inset-0 w-full h-full border-4 border-neutral-900 rounded-lg backface-hidden  transform-[rotateY(180deg)]" style={{ backgroundColor: randomColor }}>
            </div>
            <div className="absolute inset-0 w-full h-full border-4 border-neutral-900 rounded-lg backface-hidden bg-neutral-950">
            </div>
          </motion.div>
        </motion.div>
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
        
        <div className="flex flex-col m-2 md:mx-10 gap-4">
          {colorGuesses.map((guess, i) => (
            <div key={i} className="flex flex-1">
              <div
                className="h-10 flex-1 flex items-center pl-4 rounded-l-md font-medium font-mono text-shadow-lg"
                style={{ background: guess }}
              >
                {accHistory[i]}%
              </div>
              <div
                className="h-10 flex-1 rounded-r-md"
                style={{ background: colorTargets[i] }}
              />
            </div>
          ))}
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
    setTimeLeft(memorizeDuration)
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
