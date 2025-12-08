import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Users, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 bg-clip-text text-transparent">
                            Interactive Polling
                        </span>
                        <br />
                        <span className="text-gray-900">Made Simple</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        Create engaging polls, collect real-time feedback, and generate questions with AI.
                        Perfect for presentations, classrooms, and events.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/host">
                            <Button size="lg" className="min-w-[200px]">
                                <Users className="w-5 h-5 mr-2 inline" />
                                Create Session
                            </Button>
                        </Link>

                        <Link to="/join">
                            <Button size="lg" variant="outline" className="min-w-[200px]">
                                Join Session
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid md:grid-cols-3 gap-8 mt-24"
                >
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-primary-600" />}
                        title="Real-time Results"
                        description="See responses update instantly with beautiful animated charts"
                    />
                    <FeatureCard
                        icon={<Sparkles className="w-8 h-8 text-secondary-600" />}
                        title="AI-Powered"
                        description="Generate poll questions automatically from your content"
                    />
                    <FeatureCard
                        icon={<Users className="w-8 h-8 text-accent-600" />}
                        title="Easy to Join"
                        description="Participants join with a simple code - no signup required"
                    />
                </motion.div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-smooth">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};
