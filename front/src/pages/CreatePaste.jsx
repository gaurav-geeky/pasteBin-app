import { useState } from "react";
import axios from "axios";

export default function CreatePaste() {
    const [content, setContent] = useState("");
    const [ttl, setTtl] = useState("");
    const [maxViews, setMaxViews] = useState("");
    const [link, setLink] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLink("");
        setLoading(true);

        if (ttl && Number(ttl) <= 0) {
            setError("TTL must be a positive number");
            return;
        }

        if (maxViews && Number(maxViews) <= 0) {
            setError("Max views must be a positive number");
            return;
        }

        let api = `${import.meta.env.VITE_BACKEND_URL}/api/pastes`
        try {
            const payload = {
                content,
                ...(ttl && { ttl_seconds: Number(ttl) }),
                ...(maxViews && { max_views: Number(maxViews) }),
            };

            const res = await axios.post(api, payload);
            setLink(`${window.location.origin}/p/${res.data.id}`);
            setContent("");
            setTtl("");
            setMaxViews("");
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    PasteBin App
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Content */}
                    <textarea
                        className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows="8"
                        placeholder="Create your text here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />

                    {/* TTL & Max Views */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="number"
                            min="1"
                            placeholder="TTL (seconds)"
                            className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={ttl}
                            onChange={(e) => setTtl(e.target.value)}
                        />

                        <input
                            type="number"
                            min="1"
                            placeholder="Max views"
                            className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={maxViews}
                            onChange={(e) => setMaxViews(e.target.value)}
                        />
                    </div>

                    {/* Button */}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className=" inline-flex bg-pink-600 text-white
                            px-12 py-2 rounded-md font-medium
                            hover:bg-blue-700 transition
                            disabled:opacity-50 disabled:cursor-not-allowed "
                        >
                            {loading ? "Creating..." : "Create Paste"}
                        </button>
                    </div>

                </form>

                {/* Success Link */}
                {link && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                        <p className="text-green-700 font-medium">Paste created successfully 🎉</p>
                        <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline break-all"
                        >
                            {link}
                        </a>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
