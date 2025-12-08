import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Building, Phone, Briefcase, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { authApi } from '../api/auth.api';

export const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        organization: '',
        role: 'individual',
        phoneNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleNext = () => {
        setError('');

        if (step === 1) {
            if (!formData.email || !formData.password || !formData.confirmPassword) {
                setError('Please fill in all fields');
                return;
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            setStep(2);
        }
    };

    const handleBack = () => {
        setStep(1);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.fullName) {
            setError('Please enter your full name');
            return;
        }

        setLoading(true);

        try {
            await authApi.signup(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Signup failed');
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
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-secondary mb-4"
                    >
                        <UserPlus className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            Create Account
                        </span>
                    </h1>
                    <p className="text-gray-600">Join Reactify and start creating interactive polls</p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-6">
                    <div className="flex items-center justify-center space-x-2">
                        <div className={`h-2 w-16 rounded-full transition-colors ${step >= 1 ? 'bg-primary-600' : 'bg-gray-200'}`} />
                        <div className={`h-2 w-16 rounded-full transition-colors ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">
                        Step {step} of 2
                    </p>
                </div>

                <Card className="p-6 sm:p-8">
                    <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()} className="space-y-5">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-5"
                            >
                                <div className="relative">
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-9" />
                                </div>

                                <div className="relative">
                                    <Input
                                        label="Password"
                                        type="password"
                                        name="password"
                                        placeholder="At least 6 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-9" />
                                </div>

                                <div className="relative">
                                    <Input
                                        label="Confirm Password"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Re-enter password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-9" />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-5"
                            >
                                <div className="relative">
                                    <Input
                                        label="Full Name"
                                        type="text"
                                        name="fullName"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-9" />
                                </div>

                                <div className="relative">
                                    <Input
                                        label="Organization (Optional)"
                                        type="text"
                                        name="organization"
                                        placeholder="Company or School"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <Building className="w-5 h-5 text-gray-400 absolute left-3 top-9" />
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        I am a...
                                    </label>
                                    <div className="relative">
                                        <Briefcase className="w-5 h-5 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth appearance-none bg-white"
                                        >
                                            <option value="educator">Educator / Teacher</option>
                                            <option value="business">Business Professional</option>
                                            <option value="individual">Individual</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="relative">
                                    <Input
                                        label="Phone Number (Optional)"
                                        type="tel"
                                        name="phoneNumber"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-9" />
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="flex gap-3">
                            {step === 2 && (
                                <Button
                                    type="button"
                                    onClick={handleBack}
                                    variant="outline"
                                    size="lg"
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                            )}

                            <Button
                                type={step === 2 ? 'submit' : 'button'}
                                onClick={step === 1 ? handleNext : undefined}
                                fullWidth={step === 1}
                                size="lg"
                                disabled={loading}
                                className={`${step === 2 ? 'flex-1' : ''} group`}
                            >
                                {loading ? 'Creating...' : step === 1 ? 'Next' : 'Create Account'}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                            >
                                Sign in
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
