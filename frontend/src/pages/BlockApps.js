import React, { useState, useEffect } from 'react';

function BlockApps() {
    const [apps, setApps] = useState([]);
    const [newApp, setNewApp] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch blocked apps when component mounts
    useEffect(() => {
        fetchBlockedApps();
    }, []);

    // Fetch all blocked apps from backend
    const fetchBlockedApps = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/blocked-apps');
            if (!response.ok) throw new Error('Failed to fetch blocked apps');
            const data = await response.json();
            setApps(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load blocked applications');
            setLoading(false);
        }
    };

    // Add new app to backend
    const handleAddApp = async (e) => {
        e.preventDefault();
        if (newApp.trim()) {
            try {
                const appName = newApp.toLowerCase().endsWith('.exe') 
                    ? newApp.trim() 
                    : `${newApp.trim()}.exe`;

                const response = await fetch('http://localhost:5000/api/blocked-apps', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ appName }),
                });

                if (!response.ok) throw new Error('Failed to add app');

                const addedApp = await response.json();
                setApps([...apps, addedApp]);
                setNewApp('');
            } catch (err) {
                setError('Failed to add application');
            }
        }
    };

    // Remove app from backend
    const handleRemoveApp = async (appToRemove) => {
        try {
            const response = await fetch(`http://localhost:5000/api/blocked-apps/${encodeURIComponent(appToRemove)}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to remove app');

            setApps(apps.filter(app => app !== appToRemove));
        } catch (err) {
            setError('Failed to remove application');
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Block Applications</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Add App Form */}
                <form onSubmit={handleAddApp} className="mb-8">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newApp}
                            onChange={(e) => setNewApp(e.target.value)}
                            placeholder="Enter app name (e.g., chrome.exe)"
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add App
                        </button>
                    </div>
                </form>

                {/* Blocked Apps List */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Blocked Applications</h2>
                        
                        {apps.length === 0 ? (
                            <p className="text-gray-500">No applications blocked yet.</p>
                        ) : (
                            <ul className="space-y-3">
                                {apps.map((app, index) => (
                                    <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">{app}</span>
                                        <button
                                            onClick={() => handleRemoveApp(app)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlockApps; 