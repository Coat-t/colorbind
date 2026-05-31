'use client';

import Color from 'color';
import Link from "next/link";
import { Slider } from "@/components/ui/slider"
import { useState } from "react";

export default function Page () {
  const [hue, setHue] = useState([0]);
  function changeHue(hue: any) {
    setHue(hue)
  }
    return (
    <div className="h-dvh items-center justify-center gap-4 bg-background p-10">
      <Slider orientation="vertical" max={360} defaultValue={[0]} onValueChange={(value) => changeHue(value)} className="max-h-2/3"/>
      <div className="fixed left-10 top-10 p-4 bg-muted">
        <Link href="/">Go back</Link>
        <div className="h-10 w-10"
        style={{ backgroundColor: `hsl(${Number(hue)}, 100%, 50%)` }}>
          {hue}
        </div>
      </div>

    </div>
    )
}