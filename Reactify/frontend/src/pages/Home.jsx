import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to Reactify
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Create and manage interactive polls with ease
                    </p>

                    <div className="flex justify-center gap-4">
                        <Link
                            to="/dashboard"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go to Dashboard
                        </Link>
                        <Link
                            to="/join"
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Join a Poll
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
