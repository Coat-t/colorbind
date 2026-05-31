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
    <div className="h-dvh gap-4 bg-background p-10 flex">
      <div className='flex '>
        <Slider orientation="vertical" max={360} defaultValue={[180]} onValueChange={(value) => setHue(value)} className="max-h-2/3"/>
        <Slider orientation="vertical" max={100} defaultValue={[50]} onValueChange={(value) => setSaturation(value)} className="max-h-2/3" customColor={saturationFinalColor}/>
        <Slider orientation="vertical" max={100} defaultValue={[50]} onValueChange={(value) => setBrightness(value)} className="max-h-2/3" customColor={brightnessFinalColor}/>
      </div>
      <div className="fixed left-10 top-10 p-4 bg-muted/20 ">
        <Link href="/">Go back</Link>
        <div className="h-10 w-10"
        style={{ backgroundColor: hsvColor.hex() }}>
          {hue} {saturation}
        </div>
      </div>

    </div>
    )
}