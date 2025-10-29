import { supabase } from "./supabaseClient";


export const signUp = async (email, password, name, role = "customer") => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
    },
  });
  if (error) throw error;
  return data;
};


export const logIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};


export const logOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};


export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};


export const logInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin, 
    },
  });
  if (error) throw error;
  return data;
};