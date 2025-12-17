import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { EditorHeader } from '../components/poll/EditorHeader';
import { SlidesPanel } from '../components/poll/SlidesPanel';
import { PollCanvas } from '../components/poll/PollCanvas';
import { SettingsPanel } from '../components/poll/SettingsPanel';
import { SlideSettingsPanel } from '../components/poll/SlideSettingsPanel';
import { QuestionSettingsPanel } from '../components/poll/QuestionSettingsPanel';
import { MultipleChoicePanel } from '../components/poll/MultipleChoicePanel';
import { WordCloudPanel } from '../components/poll/WordCloudPanel';
import { OpenEndedPanel } from '../components/poll/OpenEndedPanel';
import { ScalesPanel } from '../components/poll/ScalesPanel';
import { RankingPanel } from '../components/poll/RankingPanel';
import { QAPanel } from '../components/poll/QAPanel';
import { WordCloudCanvas } from '../components/poll/WordCloudCanvas';
import { RankingCanvas } from '../components/poll/RankingCanvas';
import { ScalesCanvas } from '../components/poll/ScalesCanvas';
import { OpenEndedCanvas } from '../components/poll/OpenEndedCanvas';
import { QACanvas } from '../components/poll/QACanvas';
import { ImageUploadModal } from '../components/poll/ImageUploadModal';
import { ToolsSidebar } from '../components/poll/ToolsSidebar';
import { PollResults } from '../components/poll/PollResults';
import { ShareModal } from '../components/poll/ShareModal';
import { SlideTemplatesPicker } from '../components/poll/SlideTemplatesPicker';
import { CommentsPanel } from '../components/poll/CommentsPanel';
import { ThemesPicker } from '../components/poll/ThemesPicker';
import { InteractivityPanel } from '../components/poll/InteractivityPanel';
import { HelpModal } from '../components/poll/HelpModal';
import { AIGenerateModal } from '../components/poll/AIGenerateModal';
import { TextCanvas, ImageCanvas, VideoCanvas, InstructionsCanvas } from '../components/poll/ContentSlideCanvas';
import {
    GuessNumberCanvas,
    HundredPointsCanvas,
    TwoByTwoGridCanvas,
    PinOnImageCanvas,
    QuickFormCanvas,
    SelectAnswerCanvas,
    TypeAnswerCanvas,
    ImportSlidesCanvas
} from '../components/poll/AdvancedSlideCanvas';
import { sessionApi } from '../api/session.api';
import { pollApi } from '../api/poll.api';
import { useSocket } from '../hooks/useSocket';
import './PollEditor.css';

export const PollEditor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { pollId } = useParams();
    const template = location.state?.template;

    // State
    const [presentationTitle, setPresentationTitle] = useState('New presentation');
    // Join code should only come from the backend - empty until session is created
    const [joinCode, setJoinCode] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [activeTool, setActiveTool] = useState('edit');
    const [selectedElement, setSelectedElement] = useState(null);
    const [isStarting, setIsStarting] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isPresentationMode, setIsPresentationMode] = useState(false);
    const [slides, setSlides] = useState([
        {
            id: 1,
            type: 'multiple-choice',
            question: '',
            label: '',
            additionalDetails: '',
            options: [
                { id: 1, text: '', color: '#5B7FFF', image: null },
                { id: 2, text: '', color: '#FF8B8B', image: null },
                { id: 3, text: '', color: '#8B7FFF', image: null }
            ],
            settings: {
                visualizationType: 'bar',
                showAsPercentage: false,
                chooseCorrectAnswers: false,
                selectMultiple: false,
                showResponses: 'on-click',
                visualizationTextColor: '#9CA3AF',
                segmentation: 'none'
            },
            slideSettings: {
                backgroundColor: '#FFFFFF',
                backgroundImage: null,
                showInstructionsBar: true,
                showQRCode: false
            }
        }
    ]);
    const [activeSlideId, setActiveSlideId] = useState(1);
    const [imageModalState, setImageModalState] = useState({ isOpen: false, optionId: null });
    const [activeView, setActiveView] = useState('create');
    const [showSettingsPanel, setShowSettingsPanel] = useState(true);
    const [showTemplatesPicker, setShowTemplatesPicker] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [showAIModal, setShowAIModal] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('default');
    const [isSessionCreating, setIsSessionCreating] = useState(false);
    const [participantCount, setParticipantCount] = useState(0);
    const [hoveredSlideType, setHoveredSlideType] = useState(null); // For hover preview
    const [pendingSessionCreation, setPendingSessionCreation] = useState(false); // Defer session creation

    // Socket connection
    const socket = useSocket();

    // Auto-save state
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const saveTimeoutRef = useRef(null);
    const isInitialLoad = useRef(true);
    const isUpdatingFromSave = useRef(false); // Track when updating slides from auto-save

    // Create session helper function - called on demand, not immediately on mount
    const createNewSession = async () => {
        if (sessionId || isSessionCreating) return sessionId; // Already have a session

        setIsSessionCreating(true);
        try {
            console.log('Creating new session on demand...');
            const response = await sessionApi.createSession({
                title: presentationTitle || 'New presentation'
            });

            if (response.success && response.data?.session) {
                const { session } = response.data;
                const token = response.data.token || '';

                setSessionId(session.id);
                setJoinCode(session.sessionCode);

                localStorage.setItem('hostToken', token);
                localStorage.setItem('currentSessionId', session.id);
                localStorage.setItem('currentSessionCode', session.sessionCode);

                console.log('Session created with code:', session.sessionCode);
                setPendingSessionCreation(false);
                return session.id;
            } else {
                console.error('Invalid session response:', response);
            }
        } catch (error) {
            console.error('Failed to create session:', error);
        } finally {
            setIsSessionCreating(false);
        }
        return null;
    };

    // Load existing session on component mount OR check for existing session in localStorage
    useEffect(() => {
        const loadOrPrepareSession = async () => {
            // If we have a pollId (sessionId) from URL, load that existing session
            if (pollId) {
                console.log('Loading existing session from URL:', pollId);
                try {
                    const response = await sessionApi.getSession(pollId);
                    if (response.success && response.data?.session) {
                        const { session, polls } = response.data;

                        setSessionId(session.id);
                        setJoinCode(session.sessionCode);
                        setPresentationTitle(session.title || 'New presentation');

                        // Store in localStorage for refresh
                        localStorage.setItem('currentSessionId', session.id);
                        localStorage.setItem('currentSessionCode', session.sessionCode);

                        // If there are polls, load them as slides
                        if (polls && polls.length > 0) {
                            const loadedSlides = polls.map((poll, index) => ({
                                id: index + 1,
                                pollId: poll._id,
                                type: poll.type === 'single-choice' ? 'multiple-choice' : poll.type,
                                question: poll.question || '',
                                label: '',
                                additionalDetails: '',
                                options: poll.options?.map((opt, i) => ({
                                    id: i + 1,
                                    text: opt.text || '',
                                    color: ['#5B7FFF', '#FF8B8B', '#8B7FFF', '#7FEFBD', '#FFB366', '#FF7FB3'][i % 6],
                                    votes: opt.votes || 0,
                                    image: null
                                })) || [],
                                settings: {
                                    visualizationType: 'bar',
                                    showAsPercentage: false,
                                    chooseCorrectAnswers: false,
                                    selectMultiple: false,
                                    showResponses: 'on-click',
                                    visualizationTextColor: '#9CA3AF',
                                    segmentation: 'none'
                                },
                                slideSettings: {
                                    backgroundColor: '#FFFFFF',
                                    backgroundImage: null,
                                    showInstructionsBar: true,
                                    showQRCode: false
                                }
                            }));
                            setSlides(loadedSlides);
                        }

                        console.log('Loaded session:', session.title, 'Code:', session.sessionCode);
                        return;
                    }
                } catch (error) {
                    console.error('Failed to load existing session:', error);
                }
            }

            // Check if we have an existing session in localStorage
            const existingSessionId = localStorage.getItem('currentSessionId');
            const existingSessionCode = localStorage.getItem('currentSessionCode');

            if (existingSessionId && existingSessionCode) {
                // Use existing session
                setSessionId(existingSessionId);
                setJoinCode(existingSessionCode);
                console.log('Loaded existing session from localStorage:', existingSessionCode);
                return;
            }

            // Mark that session creation is pending - will be created on first save or presentation start
            // This prevents creating empty sessions when user just visits the editor
            setPendingSessionCreation(true);
            console.log('Session creation deferred until user makes changes');
        };

        loadOrPrepareSession();
    }, [pollId]); // Re-run when pollId changes

    // Socket connection and participant count tracking
    useEffect(() => {
        if (!socket || !sessionId) return;

        // Join the session room
        socket.emit('join-session', { sessionId });

        // Listen for participant count updates
        const handleSessionState = (data) => {
            if (data.participantCount !== undefined) {
                setParticipantCount(data.participantCount);
            }
        };

        const handleParticipantJoined = (data) => {
            if (data.participantCount !== undefined) {
                setParticipantCount(data.participantCount);
            }
        };

        const handleParticipantLeft = (data) => {
            if (data.participantCount !== undefined) {
                setParticipantCount(data.participantCount);
            }
        };

        socket.on('session-state', handleSessionState);
        socket.on('participant-joined', handleParticipantJoined);
        socket.on('participant-left', handleParticipantLeft);

        return () => {
            socket.off('session-state', handleSessionState);
            socket.off('participant-joined', handleParticipantJoined);
            socket.off('participant-left', handleParticipantLeft);
        };
    }, [socket, sessionId]);

    // Initialize with template data or question type from navigation
    useEffect(() => {
        const questionType = location.state?.questionType;

        if (questionType && questionType !== 'multiple-choice') {
            // Get type-specific defaults
            const getTypeDefaults = (type) => {
                switch (type) {
                    case 'word-cloud':
                        return {
                            words: [],
                            maxWordsPerParticipant: 3,
                            profanityFilter: false
                        };
                    case 'open-ended':
                        return {
                            openEndedResponses: [],
                            maxCharacters: 500,
                            showResponsesLive: true
                        };
                    case 'scales':
                        return {
                            scaleConfig: {
                                min: 1,
                                max: 10,
                                minLabel: '',
                                maxLabel: ''
                            },
                            scaleResponses: []
                        };
                    case 'ranking':
                        return {
                            rankingItems: [
                                { id: '1', text: '', averageRank: 0 },
                                { id: '2', text: '', averageRank: 0 },
                                { id: '3', text: '', averageRank: 0 }
                            ]
                        };
                    case 'qa':
                        return {
                            questions: [],
                            allowAnonymous: true,
                            isModerated: false,
                            allowUpvoting: true
                        };
                    default:
                        return {};
                }
            };

            const typeDefaults = getTypeDefaults(questionType);
            setSlides([{
                id: 1,
                type: questionType,
                question: '',
                label: '',
                additionalDetails: '',
                ...typeDefaults,
                settings: {
                    visualizationType: 'bar',
                    showAsPercentage: false,
                    chooseCorrectAnswers: false,
                    selectMultiple: false,
                    showResponses: 'on-click',
                    visualizationTextColor: '#9CA3AF',
                    segmentation: 'none'
                },
                slideSettings: {
                    backgroundColor: '#FFFFFF',
                    backgroundImage: null,
                    showInstructionsBar: true,
                    showQRCode: false
                }
            }]);
        } else if (template) {
            const templateDefaults = getTemplateDefaults(template);
            setSlides([{
                ...slides[0],
                question: templateDefaults.question,
                options: templateDefaults.options.map((text, index) => ({
                    id: index + 1,
                    text,
                    color: getOptionColor(index),
                    image: null
                }))
            }]);
        }

        // Handle AI-generated slides from Dashboard
        const aiGeneratedSlides = location.state?.aiGeneratedSlides;
        if (aiGeneratedSlides && aiGeneratedSlides.length > 0) {
            const formattedSlides = aiGeneratedSlides.map((slide, index) => ({
                id: index + 1,
                type: slide.type || 'multiple-choice',
                question: slide.question || '',
                label: '',
                additionalDetails: '',
                options: slide.options?.map((opt, i) => ({
                    id: i + 1,
                    text: typeof opt === 'string' ? opt : opt.text || '',
                    color: getOptionColor(i),
                    image: null
                })) || [],
                settings: {
                    visualizationType: 'bar',
                    showAsPercentage: false,
                    chooseCorrectAnswers: false,
                    selectMultiple: false,
                    showResponses: 'on-click',
                    visualizationTextColor: '#9CA3AF',
                    segmentation: 'none'
                },
                slideSettings: {
                    backgroundColor: '#FFFFFF',
                    backgroundImage: null,
                    showInstructionsBar: true,
                    showQRCode: false
                }
            }));
            setSlides(formattedSlides);
            if (formattedSlides.length > 0) {
                setActiveSlideId(1);
            }
        }
    }, [template, location.state?.questionType, location.state?.aiGeneratedSlides]);

    // Auto-save function
    const autoSave = useCallback(async () => {
        if (isInitialLoad.current) {
            return;
        }

        // If session creation is pending, create it now
        let currentSessionId = sessionId;
        if (pendingSessionCreation && !sessionId) {
            currentSessionId = await createNewSession();
            if (!currentSessionId) {
                console.error('Failed to create session for auto-save');
                return;
            }
        }

        if (!currentSessionId) {
            return;
        }

        setIsSaving(true);
        try {
            // Save the session title
            await sessionApi.updateSession(currentSessionId, {
                title: presentationTitle || 'New presentation'
            });

            // Save slides - update existing polls or create new ones
            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];
                // Always save slides, use placeholder question if empty
                const questionText = slide.question?.trim() || 'Your question here';
                const pollData = {
                    type: slide.type || 'multiple-choice',
                    question: questionText,
                    options: slide.options?.map(opt => ({ text: opt.text || `Option ${opt.id}` })) || [],
                    ...(slide.type === 'word-cloud' && { maxWordsPerParticipant: slide.maxWordsPerParticipant || 3 }),
                    ...(slide.type === 'open-ended' && { maxCharacters: slide.maxCharacters || 500 }),
                    ...(slide.type === 'scales' && { scaleConfig: slide.scaleConfig }),
                    ...(slide.type === 'ranking' && { rankingItems: slide.rankingItems }),
                    ...(slide.type === 'qa' && {
                        allowAnonymous: slide.allowAnonymous ?? true,
                        isModerated: slide.isModerated || false
                    })
                };

                try {
                    // Only update if we have a valid pollId (non-empty string)
                    if (slide.pollId && typeof slide.pollId === 'string' && slide.pollId !== 'undefined') {
                        // Update existing poll
                        console.log('[AutoSave] Updating existing poll:', slide.pollId);
                        await pollApi.updatePoll(slide.pollId, pollData);
                    } else {
                        // Create new poll and store the pollId to prevent duplicates
                        console.log('[AutoSave] Creating new poll for slide');
                        const result = await pollApi.createPoll(currentSessionId, pollData);
                        if (result.success && result.data?.poll?._id) {
                            // Store pollId directly on slide object (will be synced to state below)
                            slides[i].pollId = result.data.poll._id;
                            console.log('[AutoSave] Created poll with ID:', result.data.poll._id);
                        }
                    }
                } catch (pollError) {
                    console.error('Failed to save poll during auto-save:', pollError);
                }
            }

            // Update slides state with new pollIds (use flag to prevent re-triggering auto-save)
            isUpdatingFromSave.current = true;
            setSlides([...slides]);
            setTimeout(() => { isUpdatingFromSave.current = false; }, 100);

            setLastSaved(new Date());
            setHasUnsavedChanges(false);
            console.log('[AutoSave] ✅ Auto-saved slides and title at', new Date().toLocaleTimeString(), '- hasUnsavedChanges set to FALSE');
        } catch (error) {
            console.error('[AutoSave] ❌ Auto-save failed with error:', error);
            console.error('[AutoSave] Error details:', error.message, error.stack);
            setIsSaving(false); // Ensure we clear saving status even on error
        } finally {
            console.log('[AutoSave] Finally block - setting isSaving to false');
            setIsSaving(false);
        }
    }, [sessionId, presentationTitle, slides, pendingSessionCreation, createNewSession]);

    // Debounced auto-save when title or slides change
    useEffect(() => {
        // Skip on initial load
        if (isInitialLoad.current) {
            // Mark initial load as complete after first render with sessionId
            if (sessionId || pendingSessionCreation) {
                setTimeout(() => {
                    isInitialLoad.current = false;
                }, 1000);
            }
            return;
        }

        // Skip if update is from auto-save (prevents infinite loop)
        if (isUpdatingFromSave.current) {
            console.log('[AutoSave] Skipping useEffect because update is from auto-save');
            return;
        }

        // Mark as having unsaved changes
        console.log('[AutoSave] ⚠️ hasUnsavedChanges set to TRUE - change detected');
        setHasUnsavedChanges(true);

        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Set new timeout for auto-save (2 seconds debounce)
        console.log('[AutoSave] Starting 2-second countdown to auto-save...');
        saveTimeoutRef.current = setTimeout(() => {
            console.log('[AutoSave] 2 seconds elapsed, calling autoSave()...');
            autoSave();
        }, 2000);

        // Cleanup
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [presentationTitle, slides, autoSave]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    const getOptionColor = (index) => {
        const colors = ['#5B7FFF', '#FF8B8B', '#8B7FFF', '#7FEFBD', '#FFB366', '#FF7FB3'];
        return colors[index % colors.length];
    };

    const getTemplateDefaults = (template) => {
        const defaults = {
            'blank': {
                question: '',
                options: ['', '']
            },
            'favorite-subject': {
                question: 'What was your favorite subject in school?',
                options: ['Mathematics', 'Geography', 'Chemistry', 'Social science', 'History']
            },
            'time-travel': {
                question: 'Would you rather travel backwards or forwards in time?',
                options: ['Backwards', 'Forwards']
            },
            'morning-evening': {
                question: 'Are you a morning person or an evening person?',
                options: ['Morning', 'Evening']
            }
        };
        return defaults[template?.id] || defaults['blank'];
    };

    const activeSlide = slides.find(s => s.id === activeSlideId);

    // Handlers
    const handleQuestionChange = (newQuestion) => {
        setSlides(slides.map(slide =>
            slide.id === activeSlideId ? { ...slide, question: newQuestion } : slide
        ));
    };

    // Generic slide update handler for content slides
    const handleSlideUpdate = (updates) => {
        setSlides(slides.map(slide =>
            slide.id === activeSlideId ? { ...slide, ...updates } : slide
        ));
    };

    const handleOptionChange = (optionId, newText) => {
        setSlides(slides.map(slide =>
            slide.id === activeSlideId
                ? {
                    ...slide,
                    options: slide.options.map(opt =>
                        opt.id === optionId ? { ...opt, text: newText } : opt
                    )
                }
                : slide
        ));
    };

    const handleOptionColorChange = (optionId, newColor) => {
        setSlides(slides.map(slide =>
            slide.id === activeSlideId
                ? {
                    ...slide,
                    options: slide.options.map(opt =>
                        opt.id === optionId ? { ...opt, color: newColor } : opt
                    )
                }
                : slide
        ));
    };

    const handleOptionRemove = (optionId) => {
        if (activeSlide.options.length > 2) {
            setSlides(slides.map(slide =>
                slide.id === activeSlideId
                    ? { ...slide, options: slide.options.filter(opt => opt.id !== optionId) }
                    : slide
            ));
        }
    };

    const handleAddOption = () => {
        if (activeSlide.options.length < 6) {
            const newId = Math.max(...activeSlide.options.map(o => o.id)) + 1;
            setSlides(slides.map(slide =>
                slide.id === activeSlideId
                    ? {
                        ...slide,
                        options: [...slide.options, {
                            id: newId,
                            text: '',
                            color: getOptionColor(slide.options.length),
                            image: null
                        }]
                    }
                    : slide
            ));
        }
    };

    const handleImageUpload = (optionId) => {
        setImageModalState({ isOpen: true, optionId });
    };

    const handleImageSelect = (imageDataUrl) => {
        const optionId = imageModalState.optionId;
        if (optionId) {
            setSlides(slides.map(slide =>
                slide.id === activeSlideId
                    ? {
                        ...slide,
                        options: slide.options.map(opt =>
                            opt.id === optionId ? { ...opt, image: imageDataUrl } : opt
                        )
                    }
                    : slide
            ));
        }
    };

    const handleImageRemove = (optionId) => {
        setSlides(slides.map(slide =>
            slide.id === activeSlideId
                ? {
                    ...slide,
                    options: slide.options.map(opt =>
                        opt.id === optionId ? { ...opt, image: null } : opt
                    )
                }
                : slide
        ));
    };

    const handleLabelChange = (newLabel) => {
        setSlides(slides.map(slide =>
            slide.id === activeSlideId ? { ...slide, label: newLabel } : slide
        ));
    };

    const handleAdditionalDetailsChange = (newDetails) => {
        setSlides(slides.map(slide =>
            slide.id === activeSlideId ? { ...slide, additionalDetails: newDetails } : slide
        ));
    };

    const handleSettingChange = (setting, value) => {
        setSlides(slides.map(slide =>
            slide.id === activeSlideId
                ? { ...slide, settings: { ...slide.settings, [setting]: value } }
                : slide
        ));
    };

    const handleSlideSettingChange = (setting, value) => {
        setSlides(slides.map(slide =>
            slide.id === activeSlideId
                ? { ...slide, slideSettings: { ...slide.slideSettings, [setting]: value } }
                : slide
        ));
    };

    // Helper to get defaults for a slide type
    const getTypeDefaults = (type) => {
        switch (type) {
            case 'word-cloud':
                return {
                    words: [],
                    maxWordsPerParticipant: 3,
                    profanityFilter: false
                };
            case 'open-ended':
                return {
                    openEndedResponses: [],
                    maxCharacters: 500,
                    showResponsesLive: true
                };
            case 'scales':
                return {
                    scaleConfig: {
                        min: 1,
                        max: 10,
                        minLabel: '',
                        maxLabel: ''
                    },
                    scaleResponses: []
                };
            case 'ranking':
                return {
                    rankingItems: [
                        { id: '1', text: '', averageRank: 0 },
                        { id: '2', text: '', averageRank: 0 },
                        { id: '3', text: '', averageRank: 0 }
                    ]
                };
            case 'qa':
                return {
                    questions: [],
                    allowAnonymous: true,
                    isModerated: false,
                    allowUpvoting: true
                };
            default: // multiple-choice
                return {
                    options: [
                        { id: 1, text: '', color: '#5B7FFF', image: null },
                        { id: 2, text: '', color: '#FF8B8B', image: null },
                        { id: 3, text: '', color: '#8B7FFF', image: null }
                    ]
                };
        }
    };

    const handleSlideTypeChange = (newType) => {
        const typeDefaults = getTypeDefaults(newType);
        setSlides(slides.map(slide =>
            slide.id === activeSlideId ? {
                ...slide,
                type: newType,
                // Merge defaults but preserve some existing data if valid? 
                // For now, full reset of content-specific fields, keep common settings
                ...typeDefaults,
                // Reset visualization type based on new slide type if needed
                settings: {
                    ...slide.settings,
                    visualizationType: newType === 'multiple-choice' ? 'bar' : 'bar' // Default or based on type
                }
            } : slide
        ));
    };
    // Generate a preview slide for hover state with demo data
    const getPreviewSlide = (typeId) => {
        if (!typeId) return null;
        const typeDefaults = getTypeDefaults(typeId);

        // Demo data for different slide types
        const demoData = {
            'multiple-choice': {
                options: [
                    { id: 1, text: 'Option A', color: '#5B7FFF', votes: 42, image: null },
                    { id: 2, text: 'Option B', color: '#FF8B8B', votes: 28, image: null },
                    { id: 3, text: 'Option C', color: '#8B7FFF', votes: 35, image: null },
                    { id: 4, text: 'Option D', color: '#4ECCA3', votes: 19, image: null }
                ]
            },
            'word-cloud': {
                words: [
                    { text: 'Innovation', count: 8 },
                    { text: 'Teamwork', count: 6 },
                    { text: 'Growth', count: 5 },
                    { text: 'Quality', count: 4 },
                    { text: 'Success', count: 7 },
                    { text: 'Creativity', count: 3 }
                ]
            },
            'open-ended': {
                responses: [
                    { id: 1, text: 'Great idea!' },
                    { id: 2, text: 'Very helpful session' },
                    { id: 3, text: 'Looking forward to more' }
                ]
            },
            'ranking': {
                rankingItems: [
                    { id: 1, text: 'First Priority', score: 85 },
                    { id: 2, text: 'Second Priority', score: 72 },
                    { id: 3, text: 'Third Priority', score: 58 }
                ]
            },
            'scales': {
                scaleStatements: [
                    { id: 1, text: 'I feel engaged', average: 4.2 },
                    { id: 2, text: 'The content is clear', average: 3.8 }
                ],
                scaleConfig: { minLabel: 'Disagree', maxLabel: 'Agree', steps: 5 }
            },
            'qa': {
                qaQuestions: [
                    { id: 1, question: 'What is the timeline?', upvotes: 5 },
                    { id: 2, question: 'Can we get slides?', upvotes: 3 }
                ]
            }
        };

        return {
            id: 'preview',
            type: typeId,
            question: getTypeLabel(typeId),
            label: '',
            additionalDetails: '',
            ...typeDefaults,
            ...(demoData[typeId] || {}),
            settings: {
                visualizationType: 'bar',
                showAsPercentage: false,
                chooseCorrectAnswers: false,
                selectMultiple: false,
                showResponses: 'on-click',
                visualizationTextColor: '#9CA3AF',
                segmentation: 'none'
            },
            slideSettings: {
                backgroundColor: '#FFFFFF',
                backgroundImage: null,
                showInstructionsBar: true,
                showQRCode: false
            }
        };
    };

    // Get human-readable type label
    const getTypeLabel = (typeId) => {
        const labels = {
            'multiple-choice': 'Multiple Choice',
            'word-cloud': 'Word Cloud',
            'open-ended': 'Open Ended',
            'scales': 'Scales',
            'ranking': 'Ranking',
            'qa': 'Q&A',
            'guess-number': 'Guess the Number',
            '100-points': '100 Points',
            '2x2-grid': '2 x 2 Grid',
            'pin-on-image': 'Pin on Image',
            'text': 'Text',
            'image': 'Image',
            'video': 'Video',
            'instructions': 'Instructions',
            'select-answer': 'Select Answer',
            'type-answer': 'Type Answer'
        };
        return labels[typeId] || typeId;
    };

    // Compute the display slide (preview or actual)
    const displaySlide = hoveredSlideType ? getPreviewSlide(hoveredSlideType) : activeSlide;
    const isPreviewMode = hoveredSlideType !== null;

    const handleNewSlide = (slideType) => {
        // Check if it's AI generate type
        if (slideType?.id === 'ai-generate') {
            setShowAIModal(true);
            return;
        }

        const newId = Math.max(...slides.map(s => s.id)) + 1;
        // Use the selected slide type or default to multiple-choice
        const selectedType = slideType?.id || 'multiple-choice';

        const typeDefaults = getTypeDefaults(selectedType);

        const newSlide = {
            id: newId,
            type: selectedType,
            question: '',
            label: '',
            additionalDetails: '',
            ...typeDefaults,
            settings: {
                visualizationType: 'bar',
                showAsPercentage: false,
                chooseCorrectAnswers: false,
                selectMultiple: false,
                showResponses: 'on-click',
                visualizationTextColor: '#9CA3AF',
                segmentation: 'none'
            },
            slideSettings: {
                backgroundColor: '#FFFFFF',
                backgroundImage: null,
                showInstructionsBar: true,
                showQRCode: false
            }
        };
        setSlides([...slides, newSlide]);
        setActiveSlideId(newId);
    };

    // Delete slide
    const handleDeleteSlide = (slideId) => {
        if (slides.length <= 1) return; // Keep at least one slide

        const slideIndex = slides.findIndex(s => s.id === slideId);
        const newSlides = slides.filter(s => s.id !== slideId);
        setSlides(newSlides);

        // If deleting active slide, select adjacent slide
        if (activeSlideId === slideId) {
            const newActiveIndex = Math.min(slideIndex, newSlides.length - 1);
            setActiveSlideId(newSlides[newActiveIndex].id);
        }
    };

    // Duplicate slide
    const handleDuplicateSlide = (slideId) => {
        const slideToDuplicate = slides.find(s => s.id === slideId);
        if (!slideToDuplicate) return;

        const newId = Math.max(...slides.map(s => s.id)) + 1;
        const duplicatedSlide = {
            ...JSON.parse(JSON.stringify(slideToDuplicate)),
            id: newId,
            pollId: undefined,  // Remove pollId - this is a NEW slide, needs its own poll
            question: slideToDuplicate.question ? `${slideToDuplicate.question} (copy)` : ''
        };

        // Insert after the original
        const slideIndex = slides.findIndex(s => s.id === slideId);
        const newSlides = [
            ...slides.slice(0, slideIndex + 1),
            duplicatedSlide,
            ...slides.slice(slideIndex + 1)
        ];
        setSlides(newSlides);
        setActiveSlideId(newId);
    };

    // Reorder slides
    const handleReorderSlides = (fromIndex, toIndex) => {
        const newSlides = [...slides];
        const [movedSlide] = newSlides.splice(fromIndex, 1);
        newSlides.splice(toIndex, 0, movedSlide);
        setSlides(newSlides);
    };

    // AI Generation handler
    const handleAIGenerate = async (data) => {
        const result = await pollApi.generateWithAI(data);
        return result;
    };

    // Handle adding AI-generated slides
    const handleAIGeneratedSlides = (generatedSlides) => {
        if (!generatedSlides || generatedSlides.length === 0) {
            setShowAIModal(false);
            return;
        }

        const startId = Math.max(...slides.map(s => s.id)) + 1;
        const newSlides = generatedSlides.map((slide, index) => ({
            id: startId + index,
            type: slide.type || 'multiple-choice',
            question: slide.question || '',
            label: '',
            additionalDetails: '',
            options: slide.options?.map((opt, i) => ({
                id: i + 1,
                text: opt.text || opt,
                color: getOptionColor(i),
                image: null
            })) || [],
            settings: {
                visualizationType: 'bar',
                showAsPercentage: false,
                chooseCorrectAnswers: false,
                selectMultiple: false,
                showResponses: 'on-click',
                visualizationTextColor: '#9CA3AF',
                segmentation: 'none'
            },
            slideSettings: {
                backgroundColor: '#FFFFFF',
                backgroundImage: null,
                showInstructionsBar: true,
                showQRCode: false
            }
        }));

        setSlides([...slides, ...newSlides]);
        setActiveSlideId(newSlides[0].id);
        setShowAIModal(false);
    };


    // Start Presentation - Use existing session and create polls, then navigate to live results
    const handleStartPresentation = async () => {
        setIsStarting(true);
        try {
            // Create session on demand if pending
            let currentSessionId = sessionId;
            if (pendingSessionCreation && !sessionId) {
                currentSessionId = await createNewSession();
                if (!currentSessionId) {
                    console.error('Failed to create session for presentation');
                    setIsStarting(false);
                    return;
                }
            }

            // Use the existing session that was created on mount
            if (!currentSessionId) {
                console.error('No session ID available');
                setIsPresentationMode(true);
                setIsStarting(false);
                return;
            }

            // Create polls only for slides that don't already have a pollId (avoid duplicates)
            for (const slide of slides) {
                // Skip slides that already have a pollId (already saved to backend)
                if (slide.pollId) {
                    console.log('[StartPresentation] Skipping slide with existing pollId:', slide.pollId);
                    continue;
                }

                if (slide.question && slide.question.trim()) {
                    await pollApi.createPoll(currentSessionId, {
                        type: slide.type === 'multiple-choice' ? 'single-choice' : slide.type,
                        question: slide.question,
                        options: slide.options?.map(opt => ({ text: opt.text || `Option ${opt.id}` })) || [],
                        // Pass type-specific data
                        ...(slide.type === 'word-cloud' && { maxWordsPerParticipant: slide.maxWordsPerParticipant || 3 }),
                        ...(slide.type === 'open-ended' && { maxCharacters: slide.maxCharacters || 500 }),
                        ...(slide.type === 'scales' && { scaleConfig: slide.scaleConfig }),
                        ...(slide.type === 'ranking' && { rankingItems: slide.rankingItems }),
                        ...(slide.type === 'qa' && {
                            allowAnonymous: slide.allowAnonymous ?? true,
                            isModerated: slide.isModerated || false
                        })
                    });
                }
            }

            // Navigate to live results page for host view
            navigate(`/live/${currentSessionId}`);
        } catch (error) {
            console.error('Failed to start presentation:', error);
            // Still enter presentation mode even if API fails
            setIsPresentationMode(true);
        } finally {
            setIsStarting(false);
        }
    };

    // Handle back button - save presentation and clear localStorage for next one
    const handleBack = async () => {
        try {
            // Always save the presentation if we have a session
            if (sessionId) {
                // Update session title
                await sessionApi.updateSession(sessionId, { title: presentationTitle || 'New presentation' });

                // Save slides - update existing polls or create new ones
                for (const slide of slides) {
                    // Always save slides, use placeholder question if empty
                    const questionText = slide.question?.trim() || 'Your question here';
                    const pollData = {
                        type: slide.type || 'multiple-choice',
                        question: questionText,
                        options: slide.options?.map(opt => ({ text: opt.text || `Option ${opt.id}` })) || [],
                        ...(slide.type === 'word-cloud' && { maxWordsPerParticipant: slide.maxWordsPerParticipant || 3 }),
                        ...(slide.type === 'open-ended' && { maxCharacters: slide.maxCharacters || 500 }),
                        ...(slide.type === 'scales' && { scaleConfig: slide.scaleConfig }),
                        ...(slide.type === 'ranking' && { rankingItems: slide.rankingItems }),
                        ...(slide.type === 'qa' && {
                            allowAnonymous: slide.allowAnonymous ?? true,
                            isModerated: slide.isModerated || false
                        })
                    };

                    try {
                        if (slide.pollId) {
                            // Update existing poll
                            console.log('[HandleBack] Updating existing poll:', slide.pollId);
                            await pollApi.updatePoll(slide.pollId, pollData);
                        } else {
                            // Create new poll (this slide was never saved)
                            console.log('[HandleBack] Creating new poll for unsaved slide');
                            await pollApi.createPoll(sessionId, pollData);
                        }
                    } catch (pollError) {
                        console.error('Failed to save poll:', pollError);
                    }
                }

                console.log('Presentation and slides saved:', presentationTitle);
            }
        } catch (error) {
            console.error('Failed to save presentation:', error);
        }

        // Clear localStorage so next new presentation gets a fresh session
        localStorage.removeItem('currentSessionId');
        localStorage.removeItem('currentSessionCode');
        localStorage.removeItem('hostToken');

        // Navigate to dashboard
        navigate('/dashboard');
    };


    // Exit presentation mode
    const handleExitPresentation = () => {
        setIsPresentationMode(false);
    };

    // Navigate slides in presentation mode
    const handleNextSlide = () => {
        const currentIndex = slides.findIndex(s => s.id === activeSlideId);
        if (currentIndex < slides.length - 1) {
            setActiveSlideId(slides[currentIndex + 1].id);
        }
    };

    const handlePrevSlide = () => {
        const currentIndex = slides.findIndex(s => s.id === activeSlideId);
        if (currentIndex > 0) {
            setActiveSlideId(slides[currentIndex - 1].id);
        }
    };

    // Handle template selection
    const handleTemplateSelect = (template) => {
        if (!template.slideData) {
            // Blank template - just close picker
            setShowTemplatesPicker(false);
            return;
        }

        const newId = Math.max(...slides.map(s => s.id)) + 1;
        const newSlide = {
            id: newId,
            ...template.slideData,
            label: '',
            additionalDetails: template.slideData.additionalDetails || '',
            settings: {
                visualizationType: template.slideData.settings?.visualizationType || 'bar',
                showAsPercentage: template.slideData.settings?.showAsPercentage || false,
                chooseCorrectAnswers: false,
                selectMultiple: template.slideData.settings?.selectMultiple || false,
                showResponses: 'on-click',
                visualizationTextColor: '#9CA3AF',
                segmentation: 'none'
            },
            slideSettings: {
                backgroundColor: '#FFFFFF',
                backgroundImage: null,
                showInstructionsBar: true,
                showQRCode: false
            }
        };

        setSlides([...slides, newSlide]);
        setActiveSlideId(newId);
        setShowTemplatesPicker(false);
    };

    // Determine if settings panel is visible
    const isSettingsPanelVisible = selectedElement !== null || showSettingsPanel;

    // Handle clicking on the canvas background
    const handleCanvasClick = () => {
        if (selectedElement !== null) {
            setSelectedElement(null);
        }
        setActiveTool('edit');
    };

    return (
        <div className={`poll-editor-grid ${!isSettingsPanelVisible ? 'no-settings-panel' : ''}`}>
            <EditorHeader
                title={presentationTitle}
                onTitleChange={setPresentationTitle}
                onBack={handleBack}
                joinCode={joinCode}
                activeTab={activeView}
                onTabChange={setActiveView}
                totalResponses={slides.reduce((total, slide) =>
                    total + (slide.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0), 0
                )}
                onShare={() => setIsShareModalOpen(true)}
                onStartPresentation={handleStartPresentation}
                onPreview={() => setIsPresentationMode(true)}
                isStarting={isStarting}
                isSaving={isSaving}
                lastSaved={lastSaved}
                hasUnsavedChanges={hasUnsavedChanges}
            />

            {activeView === 'results' ? (
                <PollResults
                    slides={slides}
                    activeSlideIndex={slides.findIndex(s => s.id === activeSlideId)}
                    onSlideSelect={(index) => setActiveSlideId(slides[index].id)}
                />
            ) : (
                <>
                    <SlidesPanel
                        slides={slides}
                        activeSlideId={activeSlideId}
                        onSlideSelect={(slideId) => {
                            setActiveSlideId(slideId);
                            setSelectedElement(null);
                            setShowSettingsPanel(true);
                            setActiveTool('edit'); // Ensure we are in edit mode
                        }}
                        onNewSlide={handleNewSlide}
                        onDeleteSlide={handleDeleteSlide}
                        onDuplicateSlide={handleDuplicateSlide}
                        onReorderSlides={handleReorderSlides}
                        onSlideTypeHover={setHoveredSlideType}
                    />

                    {/* Conditional Canvas based on slide type - Wrapped for Animation */}
                    <div className={`canvas-animation-wrapper ${isPreviewMode ? 'preview-mode' : ''}`} key={`${displaySlide?.id}-${displaySlide?.type}`}>
                        {displaySlide?.type === 'word-cloud' ? (
                            <WordCloudCanvas
                                words={displaySlide?.words || []}
                                question={activeSlide?.question || ''}
                                joinCode={joinCode}
                                showPreview={true}
                                onQuestionChange={handleQuestionChange}
                                onSelectVisualization={() => setSelectedElement('visualization')}
                                onCanvasClick={handleCanvasClick}
                                isSelected={selectedElement === null}
                                isEditorMode={true}
                            />
                        ) : displaySlide?.type === 'ranking' ? (
                            <RankingCanvas
                                items={displaySlide?.rankingItems || []}
                                question={displaySlide?.question || ''}
                                joinCode={joinCode}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                onSelectVisualization={() => setSelectedElement('visualization')}
                                onCanvasClick={handleCanvasClick}
                                isSelected={selectedElement === null}
                                isEditorMode={!isPreviewMode}
                            />
                        ) : displaySlide?.type === 'scales' ? (
                            <ScalesCanvas
                                statements={displaySlide?.scaleStatements || []}
                                question={displaySlide?.question || ''}
                                joinCode={joinCode}
                                minLabel={displaySlide?.scaleConfig?.minLabel || 'Strongly disagree'}
                                maxLabel={displaySlide?.scaleConfig?.maxLabel || 'Strongly agree'}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                onSelectVisualization={() => setSelectedElement('visualization')}
                                onCanvasClick={handleCanvasClick}
                                isSelected={selectedElement === null}
                                isEditorMode={!isPreviewMode}
                            />
                        ) : displaySlide?.type === 'open-ended' ? (
                            <OpenEndedCanvas
                                slide={displaySlide}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                joinCode={joinCode}
                                backgroundColor={displaySlide?.slideSettings?.backgroundColor}
                                backgroundImage={displaySlide?.slideSettings?.backgroundImage}
                                showQRCode={displaySlide?.slideSettings?.showQRCode}
                                onCanvasClick={handleCanvasClick}
                                isSelected={selectedElement === null}
                                isEditorMode={!isPreviewMode}
                            />
                        ) : displaySlide?.type === 'qa' ? (
                            <QACanvas
                                slide={displaySlide}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                joinCode={joinCode}
                                backgroundColor={displaySlide?.slideSettings?.backgroundColor}
                                backgroundImage={displaySlide?.slideSettings?.backgroundImage}
                                showQRCode={displaySlide?.slideSettings?.showQRCode}
                                onCanvasClick={handleCanvasClick}
                                isSelected={selectedElement === null}
                                isEditorMode={!isPreviewMode}
                            />
                        ) : displaySlide?.type === 'text' ? (
                            <TextCanvas
                                slide={displaySlide}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                onContentChange={!isPreviewMode ? (content) => handleSlideUpdate({ content }) : undefined}
                                joinCode={joinCode}
                                isEditorMode={!isPreviewMode}
                                isSelected={selectedElement === null}
                            />
                        ) : displaySlide?.type === 'image' ? (
                            <ImageCanvas
                                slide={displaySlide}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                onImageChange={!isPreviewMode ? (imageUrl) => handleSlideUpdate({ imageUrl }) : undefined}
                                joinCode={joinCode}
                                isEditorMode={!isPreviewMode}
                                isSelected={selectedElement === null}
                            />
                        ) : displaySlide?.type === 'video' ? (
                            <VideoCanvas
                                slide={displaySlide}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                onVideoUrlChange={!isPreviewMode ? (videoUrl) => handleSlideUpdate({ videoUrl }) : undefined}
                                joinCode={joinCode}
                                isEditorMode={!isPreviewMode}
                                isSelected={selectedElement === null}
                            />
                        ) : displaySlide?.type === 'instructions' ? (
                            <InstructionsCanvas
                                slide={displaySlide}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                joinCode={joinCode}
                                isEditorMode={!isPreviewMode}
                                isSelected={selectedElement === null}
                            />
                        ) : displaySlide?.type === 'guess-number' ? (
                            <GuessNumberCanvas
                                slide={displaySlide}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                onAnswerChange={!isPreviewMode ? (answer) => handleSlideUpdate({ correctAnswer: answer }) : undefined}
                                joinCode={joinCode}
                                isEditorMode={!isPreviewMode}
                                isSelected={selectedElement === null}
                            />
                        ) : displaySlide?.type === '100-points' ? (
                            <HundredPointsCanvas
                                slide={displaySlide}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                onItemsChange={!isPreviewMode ? (items) => handleSlideUpdate({ pointItems: items }) : undefined}
                                joinCode={joinCode}
                                isEditorMode={!isPreviewMode}
                                isSelected={selectedElement === null}
                            />
                        ) : displaySlide?.type === '2x2-grid' ? (
                            <TwoByTwoGridCanvas
                                slide={displaySlide}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                onLabelsChange={!isPreviewMode ? (labels) => handleSlideUpdate({ gridLabels: labels }) : undefined}
                                joinCode={joinCode}
                                isEditorMode={!isPreviewMode}
                                isSelected={selectedElement === null}
                            />
                        ) : displaySlide?.type === 'pin-on-image' ? (
                            <PinOnImageCanvas
                                slide={displaySlide}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                onImageChange={!isPreviewMode ? (image) => handleSlideUpdate({ pinImage: image }) : undefined}
                                joinCode={joinCode}
                                isEditorMode={!isPreviewMode}
                                isSelected={selectedElement === null}
                            />
                        ) : displaySlide?.type === 'quick-form' ? (
                            <QuickFormCanvas
                                slide={displaySlide}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                joinCode={joinCode}
                                isEditorMode={!isPreviewMode}
                                isSelected={selectedElement === null}
                            />
                        ) : displaySlide?.type === 'select-answer' ? (
                            <SelectAnswerCanvas
                                slide={displaySlide}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                onOptionsChange={!isPreviewMode ? (options) => handleSlideUpdate({ options }) : undefined}
                                joinCode={joinCode}
                                isEditorMode={!isPreviewMode}
                                isSelected={selectedElement === null}
                            />
                        ) : displaySlide?.type === 'type-answer' ? (
                            <TypeAnswerCanvas
                                slide={displaySlide}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                onCorrectAnswerChange={!isPreviewMode ? (answers) => handleSlideUpdate({ correctAnswers: answers }) : undefined}
                                joinCode={joinCode}
                                isEditorMode={!isPreviewMode}
                                isSelected={selectedElement === null}
                            />
                        ) : displaySlide?.type === 'google-slides' || displaySlide?.type === 'powerpoint' || displaySlide?.type === 'pdf' ? (
                            <ImportSlidesCanvas
                                importType={displaySlide?.type}
                                onFileSelect={!isPreviewMode ? (file) => handleSlideUpdate({ importedFile: file }) : undefined}
                                joinCode={joinCode}
                                isEditorMode={!isPreviewMode}
                                isSelected={selectedElement === null}
                            />
                        ) : (
                            <PollCanvas
                                question={displaySlide?.question || ''}
                                onQuestionChange={!isPreviewMode ? handleQuestionChange : undefined}
                                options={displaySlide?.options || []}
                                selectedElement={selectedElement}
                                onSelectQuestion={() => setSelectedElement('question')}
                                onSelectVisualization={() => setSelectedElement('visualization')}
                                onCanvasClick={handleCanvasClick}
                                joinCode={joinCode}
                                visualizationType={displaySlide?.settings?.visualizationType || 'bar'}
                                backgroundColor={displaySlide?.slideSettings?.backgroundColor}
                                backgroundImage={displaySlide?.slideSettings?.backgroundImage}
                                showQRCode={displaySlide?.slideSettings?.showQRCode}
                                participantCount={participantCount}
                                isSelected={selectedElement === null}
                            />
                        )}
                    </div>

                    {/* Conditional Settings Panel */}
                    {selectedElement === 'question' ? (
                        <QuestionSettingsPanel
                            label={activeSlide?.label || ''}
                            onLabelChange={handleLabelChange}
                            additionalDetails={activeSlide?.additionalDetails || ''}
                            onAdditionalDetailsChange={handleAdditionalDetailsChange}
                            onClose={() => setSelectedElement(null)}
                        />
                    ) : selectedElement === 'visualization' ? (
                        // Render type-specific settings panel
                        activeSlide?.type === 'word-cloud' ? (
                            <WordCloudPanel
                                maxWordsPerParticipant={activeSlide?.maxWordsPerParticipant || 3}
                                onMaxWordsChange={(value) => {
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? { ...s, maxWordsPerParticipant: value } : s
                                    ));
                                }}
                                profanityFilter={activeSlide?.profanityFilter || false}
                                onProfanityFilterChange={(value) => {
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? { ...s, profanityFilter: value } : s
                                    ));
                                }}
                                onClose={() => setSelectedElement(null)}
                            />
                        ) : activeSlide?.type === 'open-ended' ? (
                            <OpenEndedPanel
                                maxCharacters={activeSlide?.maxCharacters || 500}
                                onMaxCharactersChange={(value) => {
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? { ...s, maxCharacters: value } : s
                                    ));
                                }}
                                showResponses={activeSlide?.showResponsesLive ?? true}
                                onShowResponsesChange={(value) => {
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? { ...s, showResponsesLive: value } : s
                                    ));
                                }}
                                onClose={() => setSelectedElement(null)}
                            />
                        ) : activeSlide?.type === 'scales' ? (
                            <ScalesPanel
                                minValue={activeSlide?.scaleConfig?.min || 1}
                                maxValue={activeSlide?.scaleConfig?.max || 10}
                                minLabel={activeSlide?.scaleConfig?.minLabel || ''}
                                maxLabel={activeSlide?.scaleConfig?.maxLabel || ''}
                                onMinValueChange={(value) => {
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? { ...s, scaleConfig: { ...s.scaleConfig, min: value } } : s
                                    ));
                                }}
                                onMaxValueChange={(value) => {
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? { ...s, scaleConfig: { ...s.scaleConfig, max: value } } : s
                                    ));
                                }}
                                onMinLabelChange={(value) => {
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? { ...s, scaleConfig: { ...s.scaleConfig, minLabel: value } } : s
                                    ));
                                }}
                                onMaxLabelChange={(value) => {
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? { ...s, scaleConfig: { ...s.scaleConfig, maxLabel: value } } : s
                                    ));
                                }}
                                onClose={() => setSelectedElement(null)}
                            />
                        ) : activeSlide?.type === 'ranking' ? (
                            <RankingPanel
                                items={activeSlide?.rankingItems || []}
                                onItemsChange={(newItems) => {
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? { ...s, rankingItems: newItems } : s
                                    ));
                                }}
                                onAddItem={() => {
                                    const newId = String(Date.now());
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? {
                                            ...s,
                                            rankingItems: [...(s.rankingItems || []), { id: newId, text: '', averageRank: 0 }]
                                        } : s
                                    ));
                                }}
                                onRemoveItem={(itemId) => {
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? {
                                            ...s,
                                            rankingItems: s.rankingItems.filter(item => item.id !== itemId)
                                        } : s
                                    ));
                                }}
                                onClose={() => setSelectedElement(null)}
                            />
                        ) : activeSlide?.type === 'qa' ? (
                            <QAPanel
                                allowAnonymous={activeSlide?.allowAnonymous ?? true}
                                onAllowAnonymousChange={(value) => {
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? { ...s, allowAnonymous: value } : s
                                    ));
                                }}
                                isModerated={activeSlide?.isModerated || false}
                                onIsMderatedChange={(value) => {
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? { ...s, isModerated: value } : s
                                    ));
                                }}
                                allowUpvoting={activeSlide?.allowUpvoting ?? true}
                                onAllowUpvotingChange={(value) => {
                                    setSlides(slides.map(s =>
                                        s.id === activeSlideId ? { ...s, allowUpvoting: value } : s
                                    ));
                                }}
                                onClose={() => setSelectedElement(null)}
                            />
                        ) : (
                            <MultipleChoicePanel
                                visualizationType={activeSlide?.settings.visualizationType}
                                onVisualizationChange={(type) => handleSettingChange('visualizationType', type)}
                                showAsPercentage={activeSlide?.settings.showAsPercentage}
                                onShowAsPercentageChange={(value) => handleSettingChange('showAsPercentage', value)}
                                options={activeSlide?.options || []}
                                onOptionChange={handleOptionChange}
                                onOptionColorChange={handleOptionColorChange}
                                onOptionRemove={handleOptionRemove}
                                onOptionImageUpload={handleImageUpload}
                                onOptionImageRemove={handleImageRemove}
                                onAddOption={handleAddOption}
                                chooseCorrectAnswers={activeSlide?.settings.chooseCorrectAnswers}
                                onChooseCorrectAnswersChange={(value) => handleSettingChange('chooseCorrectAnswers', value)}
                                selectMultiple={activeSlide?.settings.selectMultiple}
                                onSelectMultipleChange={(value) => handleSettingChange('selectMultiple', value)}
                                showResponses={activeSlide?.settings.showResponses}
                                onShowResponsesChange={(value) => handleSettingChange('showResponses', value)}
                                visualizationTextColor={activeSlide?.settings.visualizationTextColor}
                                onVisualizationTextColorChange={(value) => handleSettingChange('visualizationTextColor', value)}
                                segmentation={activeSlide?.settings.segmentation}
                                onSegmentationChange={(value) => handleSettingChange('segmentation', value)}
                                onClose={() => setSelectedElement(null)}
                            />
                        )
                    ) : showSettingsPanel ? (
                        <SlideSettingsPanel
                            questionType={activeSlide?.type || 'multiple-choice'}
                            onQuestionTypeChange={handleSlideTypeChange}
                            onSlideTypeHover={setHoveredSlideType}
                            backgroundColor={activeSlide?.slideSettings?.backgroundColor || '#FFFFFF'}
                            onBackgroundColorChange={(color) => handleSlideSettingChange('backgroundColor', color)}
                            backgroundImage={activeSlide?.slideSettings?.backgroundImage || null}
                            onBackgroundImageChange={(image) => handleSlideSettingChange('backgroundImage', image)}
                            showInstructionsBar={activeSlide?.slideSettings?.showInstructionsBar ?? true}
                            onShowInstructionsBarChange={(value) => handleSlideSettingChange('showInstructionsBar', value)}
                            showQRCode={activeSlide?.slideSettings?.showQRCode ?? false}
                            onShowQRCodeChange={(value) => handleSlideSettingChange('showQRCode', value)}
                            onResetToTheme={() => {
                                // Reset slide settings to default theme values
                                setSlides(slides.map(slide =>
                                    slide.id === activeSlideId ? {
                                        ...slide,
                                        slideSettings: {
                                            backgroundColor: '#FFFFFF',
                                            backgroundImage: null,
                                            showInstructionsBar: true,
                                            showQRCode: false
                                        }
                                    } : slide
                                ));
                            }}
                            onClose={() => setShowSettingsPanel(false)}
                        />
                    ) : null}

                    <ToolsSidebar
                        activeTool={activeTool}
                        onToolChange={(tool) => {
                            setActiveTool(tool);
                            // Reopen settings panel when Edit tool is clicked
                            if (tool === 'edit' && !showSettingsPanel) {
                                setShowSettingsPanel(true);
                            }
                            // Open templates picker when Templates tool is clicked
                            if (tool === 'templates') {
                                setShowTemplatesPicker(true);
                            }
                        }}
                        onHelpClick={() => setIsHelpModalOpen(true)}
                    />
                </>
            )}

            {/* Tool Panels based on active tool */}
            {activeTool === 'comments' && (
                <div className="tool-panel-overlay">
                    <CommentsPanel
                        slides={slides}
                        activeSlideId={activeSlideId}
                        onClose={() => setActiveTool('edit')}
                    />
                </div>
            )}

            {activeTool === 'themes' && (
                <div className="tool-panel-overlay">
                    <ThemesPicker
                        currentTheme={currentTheme}
                        onThemeChange={(theme) => setCurrentTheme(theme.id)}
                        onClose={() => setActiveTool('edit')}
                    />
                </div>
            )}

            {activeTool === 'interactivity' && (
                <div className="tool-panel-overlay">
                    <InteractivityPanel
                        onClose={() => setActiveTool('edit')}
                    />
                </div>
            )}

            {/* Help Modal */}
            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
            />

            {/* Image Upload Modal */}
            <ImageUploadModal
                isOpen={imageModalState.isOpen}
                onClose={() => setImageModalState({ isOpen: false, optionId: null })}
                onImageSelect={handleImageSelect}
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                joinCode={joinCode}
                sessionId={sessionId}
                onStartPresentation={handleStartPresentation}
                isStarting={isStarting}
                presentationTitle={presentationTitle}
            />

            {/* Templates Picker Modal */}
            {showTemplatesPicker && (
                <SlideTemplatesPicker
                    onSelectTemplate={handleTemplateSelect}
                    onClose={() => setShowTemplatesPicker(false)}
                />
            )}

            {/* AI Generate Modal */}
            <AIGenerateModal
                isOpen={showAIModal}
                onClose={handleAIGeneratedSlides}
                onGenerate={handleAIGenerate}
            />

            {/* Fullscreen Presentation Mode - Reactify Style */}
            {isPresentationMode && (
                <div className="presentation-fullscreen" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: '#1a1a1a',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Black Top Bar */}
                    <div style={{ height: '40px', background: '#1a1a1a' }} />

                    {/* White Content Area */}
                    <div style={{
                        flex: 1,
                        background: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '24px 40px'
                        }}>
                            {/* Close Button */}
                            <button
                                onClick={handleExitPresentation}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '24px',
                                    color: '#333'
                                }}
                            >
                                ✕
                            </button>

                            {/* Join Code */}
                            <div style={{
                                background: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: '30px',
                                padding: '12px 28px',
                                fontSize: '16px',
                                color: '#333'
                            }}>
                                Join at <strong>reacti.com</strong> | use code <strong>{joinCode}</strong>
                            </div>

                            {/* Reactify Logo */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 12L8 6L12 12L16 6V18H12V12L8 18L4 12V18H0V6L4 12Z" fill="#5B7FFF" />
                                </svg>
                                <span style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>Reactify</span>
                            </div>
                        </div>

                        {/* Question */}
                        <div style={{ padding: '20px 60px' }}>
                            <h1 style={{
                                fontSize: '42px',
                                fontWeight: '400',
                                color: '#1a1a1a',
                                margin: 0,
                                fontFamily: 'Georgia, serif'
                            }}>
                                {activeSlide?.question || 'Your Poll question here'}
                            </h1>
                        </div>

                        {/* Spacer */}
                        <div style={{ flex: 1 }} />

                        {/* Options at Bottom */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '80px',
                            padding: '40px 60px 60px'
                        }}>
                            {(activeSlide?.options || []).map((option, index) => (
                                <div key={option.id} style={{ textAlign: 'center', minWidth: '150px' }}>
                                    <div style={{ fontSize: '32px', color: '#666', marginBottom: '12px' }}>
                                        {option.votes || 0}
                                    </div>
                                    <div style={{
                                        height: '4px',
                                        background: option.color || '#5B7FFF',
                                        borderRadius: '2px',
                                        marginBottom: '12px'
                                    }} />
                                    <div style={{ fontSize: '18px', color: '#333' }}>
                                        {option.text || `Option ${index + 1}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Black Bottom Bar with Controls */}
                    <div style={{
                        height: '60px',
                        background: '#1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 20px'
                    }}>
                        {/* Left Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={handlePrevSlide}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    opacity: slides.findIndex(s => s.id === activeSlideId) === 0 ? 0.5 : 1
                                }}
                            >
                                ←
                            </button>
                            <button style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '8px'
                            }}>
                                📍
                            </button>
                            <button
                                onClick={handleExitPresentation}
                                style={{
                                    background: 'white',
                                    border: 'none',
                                    color: '#333',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                → End presentation
                            </button>
                        </div>

                        {/* Center Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button style={{
                                background: '#333',
                                border: 'none',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                Exit fullscreen <span style={{ opacity: 0.7 }}>⌘</span>
                            </button>
                        </div>

                        {/* Right Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ color: 'white', fontSize: '14px' }}>
                                {slides.findIndex(s => s.id === activeSlideId) + 1}/{slides.length}
                            </span>
                            <button
                                onClick={handleNextSlide}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    opacity: slides.findIndex(s => s.id === activeSlideId) === slides.length - 1 ? 0.5 : 1
                                }}
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
