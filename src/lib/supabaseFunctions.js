import { supabase } from "./supabase";

/**
 * Invoke a Supabase Edge Function.
 */
export async function invokeEdge(name, body) {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    throw new Error(error.message || `Function ${name} failed`);
  }
  return data;
}
