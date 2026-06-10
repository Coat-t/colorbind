'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function loginAnonymously(nickname: string) {
  const supabase = createClient('https://yirxbwtyoimeeoguvtih.supabase.co', 'sb_publishable_Lw354M7HaqqTaJiROB7J3g_a4Vt2kvt')


  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      data: {
        // saved to user_metadata
        nickname: nickname, 
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}