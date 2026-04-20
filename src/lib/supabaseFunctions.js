import { supabase } from "./supabase";
import { FunctionsHttpError } from "@supabase/supabase-js";

async function messageFromFunctionsError(error) {
  if (error instanceof FunctionsHttpError && error.context?.json) {
    try {
      const parsed = await error.context.clone().json();
      if (parsed && typeof parsed === "object" && parsed.error != null) {
        return String(parsed.error);
      }
    } catch {
      /* body not JSON */
    }
  }
  return error.message || "Request failed";
}

/**
 * Invoke a Supabase Edge Function.
 */
export async function invokeEdge(name, body) {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    const msg = await messageFromFunctionsError(error);
    throw new Error(msg || `Function ${name} failed`);
  }
  return data;
}
