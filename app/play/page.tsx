'use client';

import chroma from "chroma-js";
import Color from 'color';
import Link from "next/link";
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Goal } from "lucide-react";

type Screen = 'MEMORY' | 'GUESS' | 'DIFF' | 'RESULTS'

let colorGuesses = [];
let colorTargets = [];

export default function Page () {
  // game state
  const [currentScreen, setCurrentScreen] = useState<Screen>('MEMORY') // MEMORY, GUESS, DIFF, RESULTS
  // colors
  const [hue, setHue] = useState([180]);
  const [saturation, setSaturation] = useState([50]);
  const [brightness, setBrightness] = useState([50]);
  const [randomColor, setRandomColor] = useState('');
  // slider colors
  let hsvColor = Color.hsv(Number(hue), Number(saturation), Number(brightness))
  let saturationFinalColor = `linear-gradient(to top, ${Color.hsv(Number(hue), 0, Number(brightness)).hex()}, ${Color.hsv(Number(hue), 100, Number(brightness)).hex()}`
  let brightnessFinalColor = `linear-gradient(to top, ${Color.hsv(Number(hue), Number(saturation), 0).hex()}, ${Color.hsv(Number(hue), Number(saturation), 100).hex()}`
  // memorization timer
  const [timeLeft, setTimeLeft] = useState(5000); // 5000ms
  useEffect(() => {
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
  }, []);

  function handleNextScreen () {
    if (currentScreen === 'MEMORY') setCurrentScreen('GUESS')
    else if (currentScreen === 'GUESS') setCurrentScreen('DIFF')
    else if (currentScreen === 'DIFF') setCurrentScreen('RESULTS')
  }
  // screens
  const screens = {
    MEMORY: (
      <div className="h-full w-full flex z-10" style={{ backgroundColor: randomColor }}>
        <p className="fixed right-2 top-2 font-bold text-shadow-lg text-black/80 dark:text-white/80 text-xl">{(timeLeft / 1000).toFixed(2)}</p>
      </div>
    ),
    GUESS: (
      <div className="h-full w-full gap-4 flex flex-row relative" style={{ backgroundColor: hsvColor.hex() }}>
        <div className='flex'>
          <Slider orientation="vertical" max={360} defaultValue={[180]}
          onValueChange={(value) => setHue(value)}/>
          <Slider orientation="vertical" max={100} step={0.3} defaultValue={[50]}
          onValueChange={(value) => setSaturation(value)} customColor={saturationFinalColor}/>
          <Slider orientation="vertical" max={100} step={0.3} defaultValue={[50]}
          onValueChange={(value) => setBrightness(value)} customColor={brightnessFinalColor}/>
        </div>
        <Button className="w-12 h-12 overflow-visible absolute bottom-4 right-4" onClick={handleSubmit}><Goal/></Button>
      </div>
    ),
    DIFF: (
      <div>Difference screen</div>
    ),
    RESULTS: (
      <div>Results screen</div>
    )
  };

  function handleSubmit () {
    handleNextScreen();
  }

  return (
    <>
    <div className="h-dvh w-screen">
      {screens[currentScreen]}
    </div> 
    </>
    )
}