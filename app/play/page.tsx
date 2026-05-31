'use client';

import Color from 'color';
import Link from "next/link";
import { Slider } from "@/components/ui/slider"
import { useState } from "react";

export default function Page () {
  const [hue, setHue] = useState([180]);
  const [saturation, setSaturation] = useState([50]);
  const [brightness, setBrightness] = useState([50]);
  let hsvColor = Color.hsv(Number(hue), Number(saturation), Number(brightness))
  let saturationBottomColor = Color.hsv(Number(hue), 0, Number(brightness))
  let saturationTopColor = Color.hsv(Number(hue), 100, Number(brightness))
  let saturationFinalColor = `linear-gradient(to top, ${saturationBottomColor.hex()}, ${saturationTopColor.hex()}`
  let brightnessBottomColor = Color.hsv(Number(hue), Number(saturation), 0)
  let brightnessTopColor = Color.hsv(Number(hue), Number(saturation), 100)
  let brightnessFinalColor = `linear-gradient(to top, ${brightnessBottomColor.hex()}, ${brightnessTopColor.hex()}`

    return (
    <div className="h-dvh gap-4 flex" style={{ backgroundColor: hsvColor.hex() }}>
      <div className='flex '>
        <Slider className="" orientation="vertical" max={360} defaultValue={[180]}
         onValueChange={(value) => setHue(value)}/>
        <Slider className="" orientation="vertical" max={100} step={0.3} defaultValue={[50]}
         onValueChange={(value) => setSaturation(value)} customColor={saturationFinalColor}/>
        <Slider className="" orientation="vertical" max={100} step={0.3} defaultValue={[50]}
         onValueChange={(value) => setBrightness(value)} customColor={brightnessFinalColor}/>
      </div>
      <div className='fixed bottom-1 right-2 font-mono font-bold text-white/50 text-sm'>Colorbind.xyz</div>
    </div>
    )
}