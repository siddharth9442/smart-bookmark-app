"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import BookmarkForm from "./components/BookmarkForm";
import BookmarksList from "./components/BookmarksList";
import { getCurrentUserId } from "./lib/auth";

type User = {
  fullName: string;
  avtarUrl: string;
};

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id)
      setUser({
      fullName: session.user.user_metadata.full_name,
      avtarUrl: session.user.user_metadata.avatar_url
    });
    } else {
      getCurrentUserId().then((id) => setUserId(id));
    }
  }, [session]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };
  
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // sign in
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-sky-50 p-6">
        <div className="max-w-3xl w-full bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left: Hero */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center bg-linear-to-tr from-blue-600 to-indigo-600 text-white p-8">
              <div className="space-y-4 text-center">
                <svg className="w-20 h-20 mx-auto" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="2" y="4" width="20" height="16" rx="2" fill="rgba(255,255,255,0.08)" />
                  <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h2 className="text-2xl font-semibold">Welcome to Smart Bookmarks</h2>
                <p className="text-sm text-sky-100 max-w-xs mx-auto">
                  Save links quickly, keep them private, and see updates instantly across tabs.
                </p>
              </div>
            </div>

            {/* Right: Sign in area */}
            <div className="w-full md:w-1/2 p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-slate-800">Welcome back</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Sign in with Google to access your private bookmarks and sync in real time.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
                  aria-label="Sign in with Google"
                >
                  {/* Google icon */}
                  <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.4h146.9c-6.3 34.1-25.6 62.9-54.6 82.1v68.2h88.2c51.6-47.5 81-117.6 81-195.3z" fill="#4285F4" />
                    <path d="M272 544.3c73.6 0 135.4-24.4 180.6-66.2l-88.2-68.2c-24.5 16.5-55.8 26.3-92.4 26.3-71 0-131.2-47.9-152.6-112.2H28.9v70.6C74.1 486.6 167.6 544.3 272 544.3z" fill="#34A853" />
                    <path d="M119.4 323.9c-10.8-32.1-10.8-66.6 0-98.7V154.6H28.9c-39.6 77.9-39.6 169.6 0 247.5l90.5-78.2z" fill="#FBBC05" />
                    <path d="M272 107.7c39.9 0 75.8 13.7 104.1 40.6l78-78C407.4 24.6 345.6 0 272 0 167.6 0 74.1 57.7 28.9 154.6l90.5 70.6C140.8 155.6 201 107.7 272 107.7z" fill="#EA4335" />
                  </svg>

                  <span className="text-sm font-medium text-slate-700">Sign in with Google</span>
                </button>

                <div className="text-center text-xs text-slate-400">
                  By signing in you agree to the app using your Google account for authentication.
                </div>

                <div className="mt-4 border-t pt-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Why Smart Bookmarks</h3>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-2 h-2 bg-sky-500 rounded-full mt-2" />
                      Private bookmarks tied to your Google account
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-2 h-2 bg-sky-500 rounded-full mt-2" />
                      Real time sync across tabs
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-2 h-2 bg-sky-500 rounded-full mt-2" />
                      Simple, fast, and mobile friendly
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-slate-400">
                <button onClick={() => { /* optional: show demo mode or help */ }} className="underline">
                  Need help signing in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-teal-100 to-blue-100 min-h-screen p-10 text-gray-800">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Your Bookmarks</h1>
          <div>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition"
            >
              Logout
            </button>
          </div>
        </div>

        {user && (
          <div className="flex items-center mb-8">
            <img
              src={user?.avtarUrl || "/default-profile.jpg"}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4 shadow-md"
            />
            <p className="text-xl font-medium text-gray-700">
              <span className="font-semibold">{user?.fullName}</span>
            </p>
          </div>
        )}

        <div className="bg-white p-8 rounded-lg shadow-lg backdrop-blur-md mb-8">
          <BookmarkForm userId={userId!} onAdded={() => { /* handle bookmark addition */ }} />
        </div>

        <div className="mt-8">
          <BookmarksList userId={userId!} />
        </div>
      </div>
    </div>
  );
}