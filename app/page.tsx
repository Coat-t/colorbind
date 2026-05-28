import Link from "next/link";

export default function Home() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center gap-4 bg-background">
      <p>ColorBind</p>
      <p>Welcome!</p>
      <Link href="/play">Play</Link>
    </div>
  );
}
