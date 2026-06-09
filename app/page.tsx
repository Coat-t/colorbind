'use client';

import { Play, Users, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'
import { toast } from "sonner"


const supabase = createClient('https://yirxbwtyoimeeoguvtih.supabase.co', 'sb_publishable_Lw354M7HaqqTaJiROB7J3g_a4Vt2kvt')

export default function Home() {
  const [nickname, setNickname] = useState('');

  const handleNameInputChange = (event:any) => {
    setNickname(event.target.value); 
  };

  async function handleSignIn () {
    console.log(nickname)
    const { data, error } = await supabase.auth.signInAnonymously({
      options: {
        data: {
          nickname: nickname
        }
      }
    })
    if (error) {
      console.error("Sign in failed.", error.message)
      toast("Failed to sign in.")

      return;
    }

    console.log("Login succesful! User data:", data)
    // do something
    toast("Signed in successfully.")
  }

  return (
    <>
    <div className="h-dvh flex flex-col items-left justify-center gap-4 bg-background p-10">
      <p className="font-bold font-mono text-xl md:text-2xl">Colorbind.xyz</p>
      <Button className="w-20 h-20 rounded-full" asChild>
        <Link href="/play" className="flex items-center justify-center">
          <Play className="size-8"/>
        </Link>
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-20 h-20 rounded-full">
            <Globe className="size-8"/>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Enter your name</DialogTitle>
          <DialogDescription>
            Start playing online.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              placeholder="Nickname"
              value={nickname}
              onChange={handleNameInputChange}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" onClick={handleSignIn}>Enter</Button>
        </DialogFooter>
      </DialogContent>
      </Dialog>
    </div>
    </>
  );
}
