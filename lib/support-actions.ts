"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, SupportRequest } from "@/lib/types";

function messageFrom(caught: unknown): string {
  return caught instanceof Error ? caught.message : "Unexpected error";
}

export async function setSupportRequestStatus(
  id: string,
  status: SupportRequest["status"],
): Promise<ActionResult> {
  await requireUser();

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("support_requests")
      .update({ status })
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      return { ok: false, error: error.message };
    }

    if (!data) {
      return { ok: false, error: "Support request could not be found." };
    }

    revalidatePath("/admin/support-requests");
    return { ok: true, id: data.id };
  } catch (caught: unknown) {
    return { ok: false, error: messageFrom(caught) };
  }
}
