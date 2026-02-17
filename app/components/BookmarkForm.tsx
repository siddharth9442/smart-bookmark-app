"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function BookmarkForm({ userId, onAdded }: { userId: string; onAdded: () => void; }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addBookmark = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !url.trim()) {
      setError("Both title and URL are required.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("bookmarks")
        .insert([{ title: title.trim(), url: url.trim(), user_id: userId }]);
      if (error) throw error;
      setTitle("");
      setUrl("");
      onAdded();
    } catch (err: any) {
      setError(err.message || "Failed to add bookmark.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={addBookmark} className="space-y-2 mb-6">
      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded text-black"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="flex-1 border px-3 py-2 rounded text-black"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {saving ? "Saving..." : "Add"}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}