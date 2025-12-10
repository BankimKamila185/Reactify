import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Landing } from './pages/Landing';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { HostDashboard } from './pages/HostDashboard';
import { AudienceJoin } from './pages/AudienceJoin';
import { Dashboard } from './pages/Dashboard';
import { MyPresentations } from './pages/MyPresentations';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/home" element={<><Navbar /><Home /></>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/my-presentations" element={<MyPresentations />} />
                    <Route path="/host" element={<><Navbar /><HostDashboard /></>} />
                    <Route path="/join" element={<><Navbar /><AudienceJoin /></>} />
                    {/* Additional routes will be added */}
                    <Route path="*" element={
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
                                <p className="text-gray-600">Page not found</p>
                            </div>
                        </div>
                    } />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
