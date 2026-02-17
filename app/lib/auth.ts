"use client";

import { supabase } from "./supabase";

export async function getCurrentUserId() {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}