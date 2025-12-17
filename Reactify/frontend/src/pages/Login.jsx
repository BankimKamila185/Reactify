import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export const Login = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
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
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            // Firebase error messages
            const errorCode = err.code;
            let errorMessage = 'Login failed. Please try again.';

            switch (errorCode) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email address.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password.';
                    break;
                default:
                    errorMessage = err.message || 'Login failed. Please try again.';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            const errorCode = err.code;
            let errorMessage = 'Google login failed. Please try again.';

            if (errorCode === 'auth/popup-closed-by-user') {
                errorMessage = 'Login cancelled.';
            } else if (errorCode === 'auth/popup-blocked') {
                errorMessage = 'Popup was blocked. Please allow popups for this site.';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        if (provider === 'Google') {
            handleGoogleLogin();
        } else {
            setError(`${provider} login is coming soon.`);
        }
    };

    return (
        <div className="login-container">
            {/* Left Section */}
            <div className="login-left">
                <div className="login-content">
                    {/* Logo */}
                    <div className="login-logo">
                        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="38" height="38" rx="8" fill="#131313" />
                            <path d="M19 10L28 16V26L19 32L10 26V16L19 10Z" fill="#F6F1EB" />
                            <circle cx="19" cy="21" r="4" fill="#131313" />
                        </svg>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="login-header">
                        <h1 className="login-title">Welcome back</h1>
                        <p className="login-subtitle">
                            Sign in to your account to continue creating engaging polls and collecting valuable feedback.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="forgot-password">
                            <button
                                type="button"
                                className="forgot-link"
                                onClick={() => alert('Password reset functionality coming soon!')}
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || authLoading}
                            className="btn-primary"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        {/* Divider */}
                        <div className="divider">
                            <span className="divider-text">Or continue with</span>
                        </div>

                        {/* Social Buttons */}
                        <div className="social-buttons">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('Google')}
                                disabled={loading || authLoading}
                                className="btn-social"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4" />
                                    <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853" />
                                    <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05" />
                                    <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335" />
                                </svg>
                                <span>Google</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('Github')}
                                disabled={loading || authLoading}
                                className="btn-social"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" fill="#131313" />
                                </svg>
                                <span>Github</span>
                            </button>
                        </div>

                        {/* Footer Links */}
                        <div className="login-footer">
                            <p className="footer-text">
                                Don't have an account?{' '}
                                <Link to="/signup" className="footer-link">Sign up</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Section */}
            <div className="login-right">
                <div className="illustration-container">
                    <img
                        src="/login-illustration.png"
                        alt="Analytics illustration"
                        className="illustration-image"
                        onError={(e) => {
                            // Fallback if custom image not found
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
