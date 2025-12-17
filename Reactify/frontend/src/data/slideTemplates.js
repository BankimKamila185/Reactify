/**
 * Slide Templates Data Store
 * Contains 3+ templates for each slide type
 */

export const slideTemplates = {
    // ========================================
    // MULTIPLE CHOICE TEMPLATES (4 templates)
    // ========================================
    'multiple-choice': [
        {
            id: 'mc-favorite-subject',
            name: 'Favorite Subject in School',
            description: 'A fun icebreaker to learn about your audience',
            preview: 'favorite-subject',
            slideData: {
                type: 'multiple-choice',
                question: 'What was your favorite subject in school?',
                options: [
                    { id: 1, text: 'Mathematics', color: '#5B7FFF', image: null },
                    { id: 2, text: 'Geography', color: '#FF8B8B', image: null },
                    { id: 3, text: 'Chemistry', color: '#8B7FFF', image: null },
                    { id: 4, text: 'Social Science', color: '#7FEFBD', image: null },
                    { id: 5, text: 'History', color: '#FFB366', image: null }
                ],
                settings: {
                    visualizationType: 'bar',
                    showAsPercentage: false,
                    selectMultiple: false
                }
            }
        },
        {
            id: 'mc-time-travel',
            name: 'Time Travel Choice',
            description: 'A classic "Would You Rather" question',
            preview: 'time-travel',
            slideData: {
                type: 'multiple-choice',
                question: 'Would you rather travel backwards or forwards in time?',
                options: [
                    { id: 1, text: 'Backwards', color: '#8B5CF6', image: null },
                    { id: 2, text: 'Forwards', color: '#06B6D4', image: null }
                ],
                settings: {
                    visualizationType: 'donut',
                    showAsPercentage: true,
                    selectMultiple: false
                }
            }
        },
        {
            id: 'mc-meeting-satisfaction',
            name: 'Meeting Satisfaction',
            description: 'Get feedback on your meeting quality',
            preview: 'meeting-satisfaction',
            slideData: {
                type: 'multiple-choice',
                question: 'How satisfied are you with today\'s meeting?',
                options: [
                    { id: 1, text: 'Very Satisfied 😊', color: '#10B981', image: null },
                    { id: 2, text: 'Satisfied 🙂', color: '#60A5FA', image: null },
                    { id: 3, text: 'Neutral 😐', color: '#FBBF24', image: null },
                    { id: 4, text: 'Dissatisfied 😕', color: '#FB923C', image: null },
                    { id: 5, text: 'Very Dissatisfied 😞', color: '#EF4444', image: null }
                ],
                settings: {
                    visualizationType: 'bar',
                    showAsPercentage: true,
                    selectMultiple: false
                }
            }
        },
        {
            id: 'mc-vacation-spot',
            name: 'Best Vacation Destination',
            description: 'Discover where your team wants to travel',
            preview: 'vacation-spot',
            slideData: {
                type: 'multiple-choice',
                question: 'What\'s your dream vacation destination?',
                options: [
                    { id: 1, text: 'Beach Paradise 🏖️', color: '#06B6D4', image: null },
                    { id: 2, text: 'Mountain Adventure ⛰️', color: '#10B981', image: null },
                    { id: 3, text: 'Historic Cities 🏛️', color: '#8B5CF6', image: null },
                    { id: 4, text: 'Tropical Jungle 🌴', color: '#22C55E', image: null }
                ],
                settings: {
                    visualizationType: 'pie',
                    showAsPercentage: true,
                    selectMultiple: false
                }
            }
        }
    ],

    // ========================================
    // WORD CLOUD TEMPLATES (3 templates)
    // ========================================
    'word-cloud': [
        {
            id: 'wc-describe-team',
            name: 'Describe Our Team',
            description: 'Collect words that describe your team culture',
            preview: 'word-cloud-team',
            slideData: {
                type: 'word-cloud',
                question: 'Describe our team in one word',
                words: [],
                maxWordsPerParticipant: 3,
                profanityFilter: true
            }
        },
        {
            id: 'wc-priorities',
            name: 'Top Priorities',
            description: 'Gather what\'s most important to your audience',
            preview: 'word-cloud-priorities',
            slideData: {
                type: 'word-cloud',
                question: 'What are your top priorities for this quarter?',
                words: [],
                maxWordsPerParticipant: 5,
                profanityFilter: true
            }
        },
        {
            id: 'wc-first-thought',
            name: 'First Thought',
            description: 'Quick reactions and first impressions',
            preview: 'word-cloud-thought',
            slideData: {
                type: 'word-cloud',
                question: 'What\'s the first word that comes to mind when you think of our product?',
                words: [],
                maxWordsPerParticipant: 1,
                profanityFilter: true
            }
        }
    ],

    // ========================================
    // OPEN ENDED TEMPLATES (3 templates)
    // ========================================
    'open-ended': [
        {
            id: 'oe-biggest-challenge',
            name: 'Biggest Challenge',
            description: 'Understand your audience\'s pain points',
            preview: 'open-ended-challenge',
            slideData: {
                type: 'open-ended',
                question: 'What\'s your biggest challenge right now?',
                openEndedResponses: [],
                maxCharacters: 500,
                showResponsesLive: true
            }
        },
        {
            id: 'oe-share-ideas',
            name: 'Share Your Ideas',
            description: 'Collect innovative suggestions',
            preview: 'open-ended-ideas',
            slideData: {
                type: 'open-ended',
                question: 'Share your best idea for improving our workflow',
                openEndedResponses: [],
                maxCharacters: 500,
                showResponsesLive: true
            }
        },
        {
            id: 'oe-session-feedback',
            name: 'Session Feedback',
            description: 'Get detailed feedback on your presentation',
            preview: 'open-ended-feedback',
            slideData: {
                type: 'open-ended',
                question: 'What did you find most valuable in today\'s session?',
                openEndedResponses: [],
                maxCharacters: 300,
                showResponsesLive: false
            }
        }
    ],

    // ========================================
    // SCALES TEMPLATES (3 templates)
    // ========================================
    'scales': [
        {
            id: 'sc-morning-evening',
            name: 'Morning vs Evening Person',
            description: 'A fun personality scale question',
            preview: 'scales-morning',
            slideData: {
                type: 'scales',
                question: 'Are you a morning person or an evening person?',
                scaleConfig: {
                    min: 1,
                    max: 10,
                    minLabel: 'Early Bird 🌅',
                    maxLabel: 'Night Owl 🌙'
                },
                scaleResponses: []
            }
        },
        {
            id: 'sc-rate-session',
            name: 'Rate This Session',
            description: 'Quick session rating scale',
            preview: 'scales-rating',
            slideData: {
                type: 'scales',
                question: 'How would you rate this session?',
                scaleConfig: {
                    min: 1,
                    max: 5,
                    minLabel: 'Poor',
                    maxLabel: 'Excellent'
                },
                scaleResponses: []
            }
        },
        {
            id: 'sc-confidence',
            name: 'Confidence Level',
            description: 'Measure how confident your team feels',
            preview: 'scales-confidence',
            slideData: {
                type: 'scales',
                question: 'How confident do you feel about this project?',
                scaleConfig: {
                    min: 1,
                    max: 10,
                    minLabel: 'Not Confident',
                    maxLabel: 'Very Confident'
                },
                scaleResponses: []
            }
        }
    ],

    // ========================================
    // RANKING TEMPLATES (3 templates)
    // ========================================
    'ranking': [
        {
            id: 'rk-quarterly-priorities',
            name: 'Quarterly Priorities',
            description: 'Prioritize goals for the quarter',
            preview: 'ranking-priorities',
            slideData: {
                type: 'ranking',
                question: 'Rank these priorities for next quarter',
                rankingItems: [
                    { id: '1', text: 'Increase Revenue', averageRank: 0 },
                    { id: '2', text: 'Improve Customer Satisfaction', averageRank: 0 },
                    { id: '3', text: 'Launch New Features', averageRank: 0 },
                    { id: '4', text: 'Reduce Costs', averageRank: 0 },
                    { id: '5', text: 'Team Development', averageRank: 0 }
                ]
            }
        },
        {
            id: 'rk-features',
            name: 'Rank Features',
            description: 'Prioritize product features',
            preview: 'ranking-features',
            slideData: {
                type: 'ranking',
                question: 'Which features are most important to you?',
                rankingItems: [
                    { id: '1', text: 'Dark Mode', averageRank: 0 },
                    { id: '2', text: 'Mobile App', averageRank: 0 },
                    { id: '3', text: 'Integrations', averageRank: 0 },
                    { id: '4', text: 'Analytics Dashboard', averageRank: 0 }
                ]
            }
        },
        {
            id: 'rk-topics',
            name: 'Rank Topics',
            description: 'Let your audience choose discussion topics',
            preview: 'ranking-topics',
            slideData: {
                type: 'ranking',
                question: 'Which topics should we discuss first?',
                rankingItems: [
                    { id: '1', text: 'Strategy Update', averageRank: 0 },
                    { id: '2', text: 'Team Announcements', averageRank: 0 },
                    { id: '3', text: 'Q&A Session', averageRank: 0 }
                ]
            }
        }
    ],

    // ========================================
    // Q&A TEMPLATES (3 templates)
    // ========================================
    'qa': [
        {
            id: 'qa-ama',
            name: 'Ask Me Anything',
            description: 'Open AMA session template',
            preview: 'qa-ama',
            slideData: {
                type: 'qa',
                question: 'Ask Me Anything! 💬',
                questions: [],
                allowAnonymous: true,
                isModerated: false,
                allowUpvoting: true
            }
        },
        {
            id: 'qa-session',
            name: 'Session Q&A',
            description: 'Collect questions during your presentation',
            preview: 'qa-session',
            slideData: {
                type: 'qa',
                question: 'Submit your questions here',
                questions: [],
                allowAnonymous: true,
                isModerated: true,
                allowUpvoting: true
            }
        },
        {
            id: 'qa-forum',
            name: 'Open Forum Discussion',
            description: 'Facilitate open discussion with your audience',
            preview: 'qa-forum',
            slideData: {
                type: 'qa',
                question: 'What would you like to discuss?',
                questions: [],
                allowAnonymous: false,
                isModerated: false,
                allowUpvoting: true
            }
        }
    ],

    // ========================================
    // QUIZ TEMPLATES - SELECT ANSWER (3 templates)
    // ========================================
    'select-answer': [
        {
            id: 'quiz-knowledge-check',
            name: 'Knowledge Check',
            description: 'Test your audience\'s understanding',
            preview: 'quiz-knowledge',
            slideData: {
                type: 'select-answer',
                question: 'What is the capital of France?',
                options: [
                    { id: 1, text: 'London', color: '#EF4444', image: null, isCorrect: false },
                    { id: 2, text: 'Paris', color: '#10B981', image: null, isCorrect: true },
                    { id: 3, text: 'Berlin', color: '#3B82F6', image: null, isCorrect: false },
                    { id: 4, text: 'Madrid', color: '#F59E0B', image: null, isCorrect: false }
                ],
                settings: {
                    timeLimit: 30,
                    points: 100
                }
            }
        },
        {
            id: 'quiz-trivia',
            name: 'Team Trivia',
            description: 'Fun trivia for team building',
            preview: 'quiz-trivia',
            slideData: {
                type: 'select-answer',
                question: 'Which planet is known as the Red Planet?',
                options: [
                    { id: 1, text: 'Venus', color: '#F59E0B', image: null, isCorrect: false },
                    { id: 2, text: 'Mars', color: '#EF4444', image: null, isCorrect: true },
                    { id: 3, text: 'Jupiter', color: '#8B5CF6', image: null, isCorrect: false },
                    { id: 4, text: 'Saturn', color: '#06B6D4', image: null, isCorrect: false }
                ],
                settings: {
                    timeLimit: 20,
                    points: 100
                }
            }
        },
        {
            id: 'quiz-pop',
            name: 'Pop Quiz',
            description: 'Quick pop quiz format',
            preview: 'quiz-pop',
            slideData: {
                type: 'select-answer',
                question: 'What year did the first iPhone launch?',
                options: [
                    { id: 1, text: '2005', color: '#6B7280', image: null, isCorrect: false },
                    { id: 2, text: '2007', color: '#10B981', image: null, isCorrect: true },
                    { id: 3, text: '2009', color: '#3B82F6', image: null, isCorrect: false },
                    { id: 4, text: '2010', color: '#F59E0B', image: null, isCorrect: false }
                ],
                settings: {
                    timeLimit: 15,
                    points: 50
                }
            }
        }
    ],

    // ========================================
    // QUIZ TEMPLATES - TYPE ANSWER (3 templates)
    // ========================================
    'type-answer': [
        {
            id: 'type-math',
            name: 'Math Challenge',
            description: 'Quick mental math question',
            preview: 'type-math',
            slideData: {
                type: 'type-answer',
                question: 'What is 25 × 4?',
                correctAnswer: '100',
                settings: {
                    timeLimit: 20,
                    points: 100,
                    caseSensitive: false
                }
            }
        },
        {
            id: 'type-geography',
            name: 'Geography Quiz',
            description: 'Test geography knowledge',
            preview: 'type-geography',
            slideData: {
                type: 'type-answer',
                question: 'What is the largest country in the world by area?',
                correctAnswer: 'Russia',
                settings: {
                    timeLimit: 30,
                    points: 100,
                    caseSensitive: false
                }
            }
        },
        {
            id: 'type-general',
            name: 'General Knowledge',
            description: 'Test general knowledge',
            preview: 'type-general',
            slideData: {
                type: 'type-answer',
                question: 'Who wrote Romeo and Juliet?',
                correctAnswer: 'Shakespeare',
                alternativeAnswers: ['William Shakespeare', 'W. Shakespeare'],
                settings: {
                    timeLimit: 30,
                    points: 100,
                    caseSensitive: false
                }
            }
        }
    ],

    // ========================================
    // CONTENT SLIDE TEMPLATES (3 templates)
    // ========================================
    'text': [
        {
            id: 'content-title',
            name: 'Title Slide',
            description: 'A bold title slide to start your presentation',
            preview: 'content-title',
            slideData: {
                type: 'text',
                question: 'Welcome to Our Presentation',
                label: 'Subtitle or date goes here',
                additionalDetails: ''
            }
        },
        {
            id: 'content-agenda',
            name: 'Agenda Slide',
            description: 'Outline your presentation topics',
            preview: 'content-agenda',
            slideData: {
                type: 'text',
                question: 'Today\'s Agenda',
                label: '',
                additionalDetails: '1. Introduction\n2. Main Topic\n3. Discussion\n4. Q&A\n5. Wrap-up'
            }
        },
        {
            id: 'content-break',
            name: 'Break Time',
            description: 'Announce a break in your session',
            preview: 'content-break',
            slideData: {
                type: 'text',
                question: '☕ Break Time!',
                label: 'We\'ll be back in 10 minutes',
                additionalDetails: ''
            }
        }
    ],

    // ========================================
    // INSTRUCTIONS TEMPLATES (3 templates)
    // ========================================
    'instructions': [
        {
            id: 'inst-how-to-join',
            name: 'How to Join',
            description: 'Instructions for participants to join',
            preview: 'instructions-join',
            slideData: {
                type: 'instructions',
                question: 'How to Participate',
                label: '',
                additionalDetails: '1. Go to reacti.com\n2. Enter the code shown on screen\n3. Answer the questions as they appear\n4. See your responses live!'
            }
        },
        {
            id: 'inst-rules',
            name: 'Ground Rules',
            description: 'Set expectations for your session',
            preview: 'instructions-rules',
            slideData: {
                type: 'instructions',
                question: 'Session Ground Rules',
                label: '',
                additionalDetails: '• Participate actively\n• Respect all opinions\n• Keep cameras on if possible\n• Mute when not speaking\n• Have fun!'
            }
        },
        {
            id: 'inst-next-steps',
            name: 'Next Steps',
            description: 'Outline action items after the session',
            preview: 'instructions-next',
            slideData: {
                type: 'instructions',
                question: 'Next Steps',
                label: '',
                additionalDetails: '✅ Review the materials shared\n✅ Complete the feedback form\n✅ Schedule follow-up meeting\n✅ Share insights with your team'
            }
        }
    ]
};

/**
 * Get all templates for a specific slide type
 */
export const getTemplatesForType = (slideType) => {
    return slideTemplates[slideType] || [];
};

/**
 * Get a specific template by ID
 */
export const getTemplateById = (templateId) => {
    for (const type of Object.keys(slideTemplates)) {
        const template = slideTemplates[type].find(t => t.id === templateId);
        if (template) return template;
    }
    return null;
};

/**
 * Get all templates grouped by category
 */
export const getTemplatesByCategory = () => {
    return {
        'Interactive Questions': [
            ...slideTemplates['multiple-choice'],
            ...slideTemplates['word-cloud'],
            ...slideTemplates['open-ended'],
            ...slideTemplates['scales'],
            ...slideTemplates['ranking'],
            ...slideTemplates['qa']
        ],
        'Quiz Competitions': [
            ...slideTemplates['select-answer'],
            ...slideTemplates['type-answer']
        ],
        'Content Slides': [
            ...slideTemplates['text'],
            ...slideTemplates['instructions']
        ]
    };
};

/**
 * Get all template categories with their templates
 */
export const getAllCategories = () => [
    {
        id: 'multiple-choice',
        name: 'Multiple Choice',
        icon: '📊',
        color: '#4285F4',
        templates: slideTemplates['multiple-choice']
    },
    {
        id: 'word-cloud',
        name: 'Word Cloud',
        icon: '☁️',
        color: '#EA4335',
        templates: slideTemplates['word-cloud']
    },
    {
        id: 'open-ended',
        name: 'Open Ended',
        icon: '💬',
        color: '#FF7B7B',
        templates: slideTemplates['open-ended']
    },
    {
        id: 'scales',
        name: 'Scales',
        icon: '📏',
        color: '#7B8FFF',
        templates: slideTemplates['scales']
    },
    {
        id: 'ranking',
        name: 'Ranking',
        icon: '🏆',
        color: '#34A853',
        templates: slideTemplates['ranking']
    },
    {
        id: 'qa',
        name: 'Q&A',
        icon: '❓',
        color: '#FF9F7B',
        templates: slideTemplates['qa']
    },
    {
        id: 'select-answer',
        name: 'Quiz - Select',
        icon: '✓',
        color: '#4285F4',
        templates: slideTemplates['select-answer']
    },
    {
        id: 'type-answer',
        name: 'Quiz - Type',
        icon: '⌨',
        color: '#34A853',
        templates: slideTemplates['type-answer']
    },
    {
        id: 'text',
        name: 'Text Slides',
        icon: 'T',
        color: '#4285F4',
        templates: slideTemplates['text']
    },
    {
        id: 'instructions',
        name: 'Instructions',
        icon: '⊞',
        color: '#1A1A1A',
        templates: slideTemplates['instructions']
    }
];
