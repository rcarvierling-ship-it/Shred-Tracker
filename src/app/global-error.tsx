"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global Error:", error);
    }, [error]);

    return (
        <html>
            <body className="bg-gray-950 text-white p-4">
                <div className="flex flex-col items-center justify-center h-screen space-y-4">
                    <h2 className="text-2xl font-bold text-red-500">Something went wrong!</h2>
                    <pre className="bg-gray-900 p-4 rounded text-xs overflow-auto max-w-full text-red-200">
                        {error.message}
                        {error.stack}
                    </pre>
                    <button
                        onClick={() => reset()}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
