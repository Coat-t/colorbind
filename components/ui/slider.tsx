"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
interface CustomSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  customColor?: string;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  customColor,
  ...props
}: CustomSliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )
  const rainbowColor = "linear-gradient(to top,hsl(0, 100%, 50%),hsl(60, 100%, 50%),hsl(120, 100%, 50%),hsl(180, 100%, 50%),hsl(240, 100%, 50%),hsl(300, 100%, 50%),hsl(360, 100%, 50%)"
  let finalColor
  if (customColor) {
    finalColor = customColor;
  } else {
    finalColor = rainbowColor;
  }
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        style={{ background: finalColor}}
        className='relative grow overflow-hidden\
        rounded-lg data-horizontal:h-2 data-horizontal:w-full data-vertical:h-1/2 data-vertical:w-14'
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute select-none data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="block h-4 w-4 shrink-0 rounded-full bg-white select-none ring-1 outline-10 border-0 outline-white data-vertical:h-px data-vertical:w-px"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
