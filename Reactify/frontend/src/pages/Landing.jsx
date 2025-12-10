import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

export const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.container}>
                    <Link to="/" className={styles.logo}>Reactify</Link>
                    <div className={styles.menu}>
                        <a href="#features">Features</a>
                        <a href="#ai-tools">AI Tools</a>
                        <a href="#templates">Templates</a>
                        <a href="#how-it-works">How it Works</a>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.btnLogin} onClick={() => navigate('/login')}>
                            Log in
                        </button>
                        <button className={styles.btnPrimary} onClick={() => navigate('/signup')}>
                            Start Free
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroGrid}>
                        <div className={styles.heroLeft}>
                            <div className={styles.badge}>
                                ✨ Trusted by 10,000+ educators worldwide
                            </div>
                            <h1>Create Interactive Polls & Feedback Instantly with AI.</h1>
                            <p>Upload text, videos, or files and Reactify generates polls, quizzes, and real-time feedback automatically.</p>
                            <div className={styles.heroBtns}>
                                <button className={styles.btnPrimary} onClick={() => navigate('/signup')}>
                                    Start with AI
                                </button>
                                <button className={styles.btnSecondary} onClick={() => navigate('/login')}>
                                    Try Demo
                                </button>
                            </div>
                        </div>
                        <div className={styles.heroRight}>
                            <div className={styles.previewCard}>
                                <div className={styles.pollHeader}>
                                    <span>Live Poll</span>
                                    <span className={styles.liveIndicator}>● Live</span>
                                </div>
                                <div className={styles.pollQuestion}>What's your preferred learning method?</div>
                                <div className={styles.pollOptions}>
                                    <div className={styles.pollOption}>
                                        <span>Visual content</span>
                                        <div className={styles.pollBarWrapper}>
                                            <div className={styles.pollBar} style={{ width: '68%' }}></div>
                                            <span className={styles.pollPercent}>68%</span>
                                        </div>
                                    </div>
                                    <div className={styles.pollOption}>
                                        <span>Interactive exercises</span>
                                        <div className={styles.pollBarWrapper}>
                                            <div className={styles.pollBar} style={{ width: '52%' }}></div>
                                            <span className={styles.pollPercent}>52%</span>
                                        </div>
                                    </div>
                                    <div className={styles.pollOption}>
                                        <span>Reading materials</span>
                                        <div className={styles.pollBarWrapper}>
                                            <div className={styles.pollBar} style={{ width: '41%' }}></div>
                                            <span className={styles.pollPercent}>41%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className={styles.features}>
                <div className={styles.container}>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={`${styles.featureIcon} ${styles.iconMint}`}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <h3>AI Poll Generation</h3>
                            <p>Upload any content and let AI create relevant, engaging poll questions automatically in seconds.</p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={`${styles.featureIcon} ${styles.iconGold}`}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            </div>
                            <h3>Real-Time Voting</h3>
                            <p>Collect instant responses from your audience with live updates and beautiful visualizations.</p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={`${styles.featureIcon} ${styles.iconMint}`}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                    <line x1="9" y1="15" x2="15" y2="9" />
                                </svg>
                            </div>
                            <h3>Instant Analytics</h3>
                            <p>Get deep insights with comprehensive analytics and exportable reports for all your polls.</p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={`${styles.featureIcon} ${styles.iconGold}`}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>
                            <h3>Integrated Feedback System</h3>
                            <p>Capture qualitative feedback alongside quantitative data for complete audience understanding.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className={styles.howItWorks}>
                <div className={styles.container}>
                    <h2>How it works</h2>
                    <div className={styles.stepsGrid}>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>01</div>
                            <h3>Upload content</h3>
                            <p>Upload YouTube videos, PowerPoint presentations, or text documents</p>
                        </div>
                        <div className={styles.stepNumber}>02</div>
                        <div className={styles.step}>
                            <h3>Reactify's AI generates polls</h3>
                            <p>Our AI analyzes your content and creates engaging poll questions automatically</p>
                        </div>
                        <div className={styles.stepNumber}>03</div>
                        <div className={styles.step}>
                            <h3>Share link & collect results</h3>
                            <p>Share a simple link and watch real-time responses flow in with beautiful analytics</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className={styles.testimonials}>
                <div className={styles.container}>
                    <div className={styles.testimonialsGrid}>
                        <div className={styles.testimonialCard}>
                            <div className={styles.quote}>Reactify transformed how we engage students. The AI saves hours of prep time and the real-time feedback is incredible.</div>
                            <div className={styles.author}>
                                <strong>Dr. Sarah Mitchell</strong>
                                <span>Professor, Stanford University</span>
                            </div>
                            <div className={styles.accent}></div>
                        </div>

                        <div className={styles.testimonialCard}>
                            <div className={styles.quote}>The best polling tool we've used. Simple, powerful, and our team actually enjoys using it during presentations.</div>
                            <div className={styles.author}>
                                <strong>James Chen</strong>
                                <span>Head of Training, Microsoft</span>
                            </div>
                            <div className={styles.accent}></div>
                        </div>

                        <div className={styles.testimonialCard}>
                            <div className={styles.quote}>Game-changer for our virtual events. Audience engagement went up 300% since we started using Reactify.</div>
                            <div className={styles.author}>
                                <strong>Maria Garcia</strong>
                                <span>Event Director, TechConf</span>
                            </div>
                            <div className={styles.accent}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.container}>
                    <div className={styles.footerGrid}>
                        <div className={styles.footerBrand}>
                            <div className={styles.footerLogo}>Reactify</div>
                            <p>Create interactive polls and feedback with AI</p>
                        </div>

                        <div className={styles.footerColumn}>
                            <h4>Product</h4>
                            <Link to="/features">Features</Link>
                            <Link to="/ai-tools">AI Tools</Link>
                            <Link to="/templates">Templates</Link>
                            <Link to="/integrations">Integrations</Link>
                        </div>

                        <div className={styles.footerColumn}>
                            <h4>Resources</h4>
                            <Link to="/docs">Documentation</Link>
                            <Link to="/guides">Guides</Link>
                            <Link to="/blog">Blog</Link>
                            <Link to="/support">Support</Link>
                        </div>

                        <div className={styles.footerColumn}>
                            <h4>Company</h4>
                            <Link to="/about">About</Link>
                            <Link to="/careers">Careers</Link>
                            <Link to="/contact">Contact</Link>
                            <Link to="/privacy">Privacy</Link>
                        </div>
                    </div>

                    <div className={styles.footerBottom}>
                        <p>© 2024 Reactify. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
