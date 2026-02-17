"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Bookmark = {
    id: string;
    title: string;
    url: string;
    created_at: string;
    user_id: string;
};

export default function BookmarksList({ userId }: { userId: string }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        let isMounted = true;

        // initial fetch
        supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .then(({ data, error }) => {
                if (!isMounted) return;
                if (error) setError(error.message);
                else setBookmarks(data ?? []);
                setLoading(false);
            });

        // realtime subscription filtered by user_id
        const channel = supabase
            .channel(`public:bookmarks:user=${userId}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "bookmarks", filter: `user_id=eq.${userId}` },
                (payload) => {
                    const { eventType, new: newRow, old: oldRow } = payload;
                    setBookmarks((prev) => {
                        if (eventType === "INSERT") {
                            return [newRow as Bookmark, ...prev];
                        }
                        if (eventType === "UPDATE") {
                            return prev.map((b) => (b.id === newRow.id ? (newRow as Bookmark) : b));
                        }
                        if (eventType === "DELETE") {
                            return prev.filter((b) => b.id !== oldRow.id);
                        }
                        return prev;
                    });
                }
            )
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const deleteBookmark = async (id: string) => {
        try {
            const { error } = await supabase.from("bookmarks").delete().eq("id", id);
            if (error) throw error;
            // no need to manually remove — realtime will handle it; but optimistic update is fine:
            setBookmarks((prev) => prev.filter((b) => b.id !== id));
        } catch (err: any) {
            alert(err.message || "Failed to delete");
        }
    };

    if (loading) return <p>Loading bookmarks...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (bookmarks.length === 0) return <p>No bookmarks yet.</p>;

    return (
        <ul className="space-y-6">
            {bookmarks.map((b) => (
                <li key={b.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-200">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-800">{b.title}</h2>
                        <a
                            href={`https://${b.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-indigo-600 hover:underline"
                        >
                            {b.url}
                        </a>
                    </div>

                    <button
                        onClick={() => deleteBookmark(b.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>

    );
}