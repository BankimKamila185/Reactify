import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Users, Zap, BarChart3, MessageSquare, Brain, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { authApi } from '../api/auth.api';

export const Landing = () => {
    const navigate = useNavigate();
    const isAuthenticated = authApi.isAuthenticated();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/signup');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-24 sm:pb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI-Powered Interactive Polling Platform
                        </motion.div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 bg-clip-text text-transparent">
                                Engage Your Audience
                            </span>
                            <br />
                            <span className="text-gray-900">In Real-Time</span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Create interactive polls, collect instant feedback, and generate questions automatically with AI.
                            Perfect for classrooms, presentations, and events.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                size="lg"
                                onClick={handleGetStarted}
                                className="min-w-[200px] text-lg group"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <Link to="/login">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="min-w-[200px] text-lg"
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </div>

                        {/* Social Proof */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600"
                        >
                            <div className="flex items-center">
                                <div className="flex -space-x-2 mr-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-2 border-white" />
                                    ))}
                                </div>
                                <span>Trusted by 10,000+ users</span>
                            </div>
                            <div className="flex items-center">
                                <div className="flex text-yellow-400 mr-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <span>4.9/5 rating</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary-200 rounded-full opacity-20 blur-3xl" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-secondary-200 rounded-full opacity-20 blur-3xl" />
            </section>

            {/* Features Section */}
            <section className="py-20 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                            Everything You Need to
                            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> Engage</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to make your presentations interactive and memorable
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="w-10 h-10" />}
                            title="Real-time Results"
                            description="Watch responses flow in instantly with beautiful animated charts that update in real-time"
                            gradient="from-yellow-400 to-orange-500"
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Brain className="w-10 h-10" />}
                            title="AI-Powered Generation"
                            description="Upload content and let AI automatically generate relevant poll questions for you"
                            gradient="from-purple-400 to-pink-500"
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Users className="w-10 h-10" />}
                            title="Easy Participation"
                            description="Participants join with a simple code - no signup or app download required"
                            gradient="from-blue-400 to-cyan-500"
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={<BarChart3 className="w-10 h-10" />}
                            title="Beautiful Charts"
                            description="Visualize responses with stunning, animated charts that captivate your audience"
                            gradient="from-green-400 to-emerald-500"
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={<MessageSquare className="w-10 h-10" />}
                            title="Live Feedback"
                            description="Collect both public and private feedback to understand your audience better"
                            gradient="from-red-400 to-rose-500"
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={<Sparkles className="w-10 h-10" />}
                            title="Multiple Formats"
                            description="Create single choice, multiple choice, open text, and rating polls effortlessly"
                            gradient="from-indigo-400 to-purple-500"
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 sm:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                            Get Started in
                            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> 3 Easy Steps</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        <StepCard
                            number="1"
                            title="Create Your Session"
                            description="Sign up and create a new polling session in seconds. Choose to create polls manually or upload content for AI generation."
                            delay={0.1}
                        />
                        <StepCard
                            number="2"
                            title="Share the Code"
                            description="Get a unique 6-digit code and share it with your audience. They can join instantly from any device."
                            delay={0.2}
                        />
                        <StepCard
                            number="3"
                            title="See Results Live"
                            description="Watch responses come in real-time with stunning visualizations. Engage your audience like never before."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 sm:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-12 sm:p-16 text-white"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                            Ready to Transform Your Presentations?
                        </h2>
                        <p className="text-xl mb-8 text-primary-50">
                            Join thousands of educators and professionals using Reactify
                        </p>
                        <Button
                            size="lg"
                            onClick={handleGetStarted}
                            className="bg-white text-primary-600 hover:bg-gray-100 text-lg min-w-[200px] group"
                        >
                            Start Free Today
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, gradient, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="relative group"
        >
            <div className="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradient} text-white mb-4`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};

const StepCard = ({ number, title, description, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="relative"
        >
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-2xl font-bold flex items-center justify-center mb-6 shadow-lg">
                    {number}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};
