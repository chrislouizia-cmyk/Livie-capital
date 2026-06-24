import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.log("[lib/admin/permissions.ts:getCurrentUser] auth error", {
      error,
    });
    return null;
  }

  return user;
}

export async function isAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    console.log("[lib/admin/permissions.ts:isAdmin] returning false", {
      reason: "No authenticated user returned by getCurrentUser()",
      authenticatedUserId: null,
      searchedAdminUserId: null,
      adminUsersResult: null,
    });
    return false;
  }

  console.log("[lib/admin/permissions.ts:isAdmin] authenticated user", {
    authenticatedUserId: user.id,
  });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id,user_id,role")
    .eq("user_id", user.id)
    .maybeSingle();

  console.log("[lib/admin/permissions.ts:isAdmin] admin_users lookup", {
    authenticatedUserId: user.id,
    searchedAdminUserId: user.id,
    adminUsersResult: data,
    adminUsersError: error,
  });

  if (error) {
    console.log("[lib/admin/permissions.ts:isAdmin] returning false", {
      reason: "admin_users query returned an error",
      authenticatedUserId: user.id,
      searchedAdminUserId: user.id,
      adminUsersResult: data,
      adminUsersError: error,
    });
    return false;
  }

  if (!data) {
    console.log("[lib/admin/permissions.ts:isAdmin] returning false", {
      reason: "No matching admin_users row found",
      authenticatedUserId: user.id,
      searchedAdminUserId: user.id,
      adminUsersResult: data,
    });
  }

  return Boolean(data);
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    redirect("/login?error=not-admin");
  }

  return user;
}
