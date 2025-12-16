import React from 'react';
import { Link } from 'react-router-dom';
import reactifyLogo from '../../assets/icons/reactify-logo.svg';

export const Navbar = () => {
    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-3">
                        <img
                            src={reactifyLogo}
                            alt="Reactify Logo"
                            className="h-10 w-auto"
                        />
                        <span className="text-2xl font-bold text-gray-800">
                            Reactify
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-primary-600 transition-smooth font-medium"
                        >
                            Home
                        </Link>
                        <Link
                            to="/host"
                            className="text-gray-600 hover:text-primary-600 transition-smooth font-medium"
                        >
                            Create Session
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
