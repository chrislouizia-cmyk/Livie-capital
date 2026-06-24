"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin/permissions";

function redirectWithAuthError(message: string) {
  const params = new URLSearchParams({
    error: "auth",
    message,
  });

  redirect(`/login?${params.toString()}`);
}

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectWithAuthError(error.message);
  }

  const admin = await isAdmin();

  console.log("[app/admin/login/actions.ts:signInAdmin] isAdmin result", {
    isAdmin: admin,
  });

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/login?error=not-admin");
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
