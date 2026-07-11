"use client";

import { createSupabaseBrowserClient } from "./supabase";

export async function sendOTP(email: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      // No emailRedirectTo = forces OTP code mode (no magic link)
    },
  });
  return { error };
}

export async function verifyOTP(email: string, token: string) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  return { data, error };
}

export async function signOut() {
  const supabase = createSupabaseBrowserClient();
  await supabase.auth.signOut();
}

export async function getUser() {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
