'use client';

import Link from "next/link";
import { Slider } from "@/components/ui/slider"
import { useState } from "react";

export default function Page () {
  const [hue, setHue] = useState([0]);
    return (
    <div className="h-dvh items-center justify-center gap-4 bg-background p-10">
      <Slider orientation="vertical" max={100} defaultValue={[0]} onValueChange={(value) => setHue(value)} selectedColor="#4287f5" className="max-h-2/3"/>
      <div className="fixed left-10 top-10 p-4 bg-muted">
        <Link href="/">Go back</Link>
        <div className="h-10 w-10">{hue}</div>
      </div>

    </div>
    )
}