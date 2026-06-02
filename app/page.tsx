import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
    <div className="h-dvh flex flex-col items-left justify-center gap-4 bg-background p-10">
      <p className="font-bold font-mono text-xl md:text-2xl">Colorbind.xyz</p>
      <Button className="w-20 h-20 rounded-full" asChild>
        <Link href="/play" className="flex items-center justify-center">
          <Play className="size-8" />
        </Link>
      </Button>
    </div>
    </>
  );
}
