import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { authApi } from '../api/auth.api';

export const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            await authApi.login(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4"
                    >
                        <LogIn className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            Welcome Back
                        </span>
                    </h1>
                    <p className="text-gray-600">Sign in to continue to Reactify</p>
                </div>

                <Card className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                className="pl-10"
                            />
                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-9" />
                        </div>

                        <div className="relative">
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                className="pl-10"
                            />
                            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-9" />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            disabled={loading}
                            className="group"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </Card>

                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};
