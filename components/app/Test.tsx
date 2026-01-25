"use client"

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ExtractedFile {
  fileName: string;
  content: string;
}

const FolderSync = ({
    folderId,
    user,
}: {
    folderId: string;
    user: { id: string; name: string };
}) => {
    const [status, setStatus] = useState("Idle");
    const [files, setFiles] = useState<ExtractedFile[]>([]);

    useEffect(() => {
        // Connect to WebSocket
        const socket = new WebSocket(`ws://localhost:8000/ws/${user.id}`);

        socket.onopen = () => {
            console.log("Connected to sync service");
            setStatus("Connected & Waiting");
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === "FILE_PROCESSED") {
                setFiles((prev) => [...prev, message.data]);
                toast.success(`Processed: ${message.data.fileName}`);
            }
        };

        socket.onclose = () => {
            setStatus("Disconnected");
            console.log("Socket closed");
        };

        socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
            setStatus("Error Connecting");
        };

        return () => socket.close();
    }, [user]);

    const startMonitoring = async () => {
        setStatus("Initiating Watch...");
        try {
            const response = await fetch(`http://localhost:8000/watch-folder/${folderId}/${user.id}`);
            if (response.ok) {
                toast.info("Backend is now watching your folder");
            } else {
                toast.error("Failed to start monitoring");
            }
        } catch (err) {
            toast.error("Network error starting monitor");
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <button 
                    onClick={startMonitoring}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Start Extraction
                </button>
                <span className={`px-2 py-1 rounded text-sm ${status === 'Connected & Waiting' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {status}
                </span>
            </div>

            <div className="space-y-2">
                <h3 className="font-bold">Files Extracted: ({files.length})</h3>
                {files.length === 0 && <p className="text-gray-400 italic">No files yet... for User : {user.name}</p>}
                {files.map((file, index) => (
                    <div key={index} className="p-3 bg-white border rounded shadow-sm flex justify-between items-center">
                        <span className="font-medium">{file.fileName}</span>
                        <span className="text-xs text-green-600 font-bold">✓ Ready</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FolderSync;