"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface TypingStats {
    wpm: number;
    accuracy: number;
    timeElapsed: number;
    charactersTyped: number;
    errorsCount: number;
}

interface TypingSpeedTestProps {
    className?: string;
}

const TypingSpeedTest: React.FC<TypingSpeedTestProps> = ({ className = '' }) => {
    // Sample paragraphs for typing practice
    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once. It has been used for decades to test typewriters and computer keyboards, as well as to display fonts and test typing skills.",
        "Technology has revolutionized the way we communicate, work, and live our daily lives. From smartphones that connect us instantly to artificial intelligence that assists with complex tasks, innovation continues to shape our future in remarkable ways.",
        "Reading books expands our knowledge, improves vocabulary, and enhances critical thinking skills. Whether fiction or non-fiction, each page offers new perspectives and insights that contribute to personal growth and intellectual development throughout our lives.",
        "Climate change represents one of the most significant challenges facing humanity today. Rising temperatures, melting ice caps, and extreme weather patterns require immediate action from governments, businesses, and individuals to ensure a sustainable future for generations to come.",
        "The art of cooking combines creativity, science, and tradition to create delicious meals that bring people together. From selecting fresh ingredients to mastering various techniques, culinary skills develop through practice, patience, and a willingness to experiment with flavors.",
        "Space exploration continues to captivate human imagination and push the boundaries of scientific knowledge. From landing on the moon to sending rovers to Mars, each mission reveals new discoveries about our universe and potential for life beyond Earth.",
        "Education serves as the foundation for personal development and societal progress. Through learning, we acquire knowledge, develop skills, and cultivate critical thinking abilities that enable us to solve problems and contribute meaningfully to our communities.",
        "Physical exercise promotes both mental and physical well-being, reducing stress while strengthening muscles and improving cardiovascular health. Regular activity, whether walking, swimming, or playing sports, contributes to a longer, healthier, and more fulfilling life."
    ];

    // State management
    const [currentText, setCurrentText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [stats, setStats] = useState<TypingStats>({
        wpm: 0,
        accuracy: 100,
        timeElapsed: 0,
        charactersTyped: 0,
        errorsCount: 0
    });

    // Refs
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize with random text
    useEffect(() => {
        resetTest();
    }, []);

    // Timer effect
    useEffect(() => {
        if (isActive && !isPaused && !isComplete) {
            intervalRef.current = setInterval(() => {
                setTimeElapsed(prevTime => prevTime + 1);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, isPaused, isComplete]);

    // Calculate typing statistics
    const calculateStats = useCallback((input: string, targetText: string, timeInSeconds: number): TypingStats => {
        const charactersTyped = input.length;
        const correctCharacters = input.split('').filter((char, index) => char === targetText[index]).length;
        const errorsCount = charactersTyped - correctCharacters;
        const accuracy = charactersTyped > 0 ? Math.round((correctCharacters / charactersTyped) * 100) : 100;

        // Calculate WPM (assuming average word length of 5 characters)
        const timeInMinutes = timeInSeconds / 60;
        const wordsTyped = correctCharacters / 5;
        const wpm = timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;

        return {
            wpm,
            accuracy,
            timeElapsed: timeInSeconds,
            charactersTyped,
            errorsCount
        };
    }, []);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;

        // Prevent typing beyond the text length
        if (value.length > currentText.length) {
            return;
        }

        setUserInput(value);

        // Start timer on first character
        if (!isActive && value.length === 1) {
            setIsActive(true);
        }

        // Check if test is complete
        if (value.length === currentText.length) {
            setIsComplete(true);
            setIsActive(false);
        }

        // Update stats in real-time
        if (timeElapsed > 0 || value.length === currentText.length) {
            const currentStats = calculateStats(value, currentText, timeElapsed);
            setStats(currentStats);
        }
    };

    // Reset test with new random text
    const resetTest = () => {
        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        setCurrentText(randomText);
        setUserInput('');
        setIsActive(false);
        setIsPaused(false);
        setIsComplete(false);
        setTimeElapsed(0);
        setStats({
            wpm: 0,
            accuracy: 100,
            timeElapsed: 0,
            charactersTyped: 0,
            errorsCount: 0
        });

        // Focus input after reset
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    // Toggle pause/resume
    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    // Format time display
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Get character class for styling
    const getCharacterClass = (index: number): string => {
        if (index >= userInput.length) {
            return 'text-gray-400 dark:text-gray-500'; // Untyped
        }

        if (userInput[index] === currentText[index]) {
            return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'; // Correct
        } else {
            return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'; // Incorrect
        }
    };

    return (
        <div className={`typing-speed-test ${className}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-4xl mx-auto transition-colors duration-200">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Typing Speed Test
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Test your typing speed and accuracy
                    </p>
                </div>

                {/* Statistics Display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-700 transition-colors duration-200">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.wpm}
                        </div>
                        <div className="text-sm text-blue-800 dark:text-blue-300">WPM</div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center border border-green-200 dark:border-green-700 transition-colors duration-200">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {stats.accuracy}%
                        </div>
                        <div className="text-sm text-green-800 dark:text-green-300">Accuracy</div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 text-center border border-purple-200 dark:border-purple-700 transition-colors duration-200">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {formatTime(timeElapsed)}
                        </div>
                        <div className="text-sm text-purple-800 dark:text-purple-300">Time</div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-4 text-center border border-orange-200 dark:border-orange-700 transition-colors duration-200">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {stats.errorsCount}
                        </div>
                        <div className="text-sm text-orange-800 dark:text-orange-300">Errors</div>
                    </div>
                </div>

                {/* Text Display */}
                <div className="mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-600 transition-colors duration-200">
                        <div className="text-lg leading-relaxed font-mono text-gray-900 dark:text-gray-100">
                            {currentText.split('').map((char, index) => (
                                <span
                                    key={index}
                                    className={`${getCharacterClass(index)} ${index === userInput.length ? 'border-l-2 border-blue-500 dark:border-blue-400 animate-pulse' : ''
                                        }`}
                                >
                                    {char}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="mb-6">
                    <textarea
                        ref={inputRef}
                        value={userInput}
                        onChange={handleInputChange}
                        disabled={isComplete || isPaused}
                        placeholder={isComplete ? "Test completed!" : "Start typing here..."}
                        className="w-full h-32 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg resize-none text-lg font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-200"
                        spellCheck={false}
                        autoComplete="off"
                    />
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={resetTest}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <polyline points="1 20 1 14 7 14"></polyline>
                            <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                        </svg>
                        New Test
                    </button>

                    {isActive && !isComplete && (
                        <button
                            onClick={togglePause}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md ${isPaused
                                ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white'
                                : 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white'
                                }`}
                        >
                            {isPaused ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                    Resume
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="6" y="4" width="4" height="16"></rect>
                                        <rect x="14" y="4" width="4" height="16"></rect>
                                    </svg>
                                    Pause
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Completion Message */}
                {isComplete && (
                    <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700 transition-colors duration-200">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                                🎉 Test Completed!
                            </h3>
                            <p className="text-green-700 dark:text-green-300 mb-4">
                                Great job! Here are your final results:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-green-100 dark:bg-green-800/30 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {stats.wpm}
                                    </div>
                                    <div className="text-sm text-green-800 dark:text-green-300">Words per minute</div>
                                </div>
                                <div className="text-center p-3 bg-green-100 dark:bg-green-800/30 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {stats.accuracy}%
                                    </div>
                                    <div className="text-sm text-green-800 dark:text-green-300">Accuracy</div>
                                </div>
                                <div className="text-center p-3 bg-green-100 dark:bg-green-800/30 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {formatTime(stats.timeElapsed)}
                                    </div>
                                    <div className="text-sm text-green-800 dark:text-green-300">Total time</div>
                                </div>
                                <div className="text-center p-3 bg-green-100 dark:bg-green-800/30 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {stats.charactersTyped}
                                    </div>
                                    <div className="text-sm text-green-800 dark:text-green-300">Characters typed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Instructions:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• Click in the text area below and start typing to begin the test</li>
                        <li>• Type the text exactly as shown above, including punctuation and spaces</li>
                        <li>• Your typing speed (WPM) and accuracy will be calculated in real-time</li>
                        <li>• You can pause and resume the test at any time</li>
                        <li>• Click &ldquo;New Test&rdquo; to try again with a different paragraph</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TypingSpeedTest;
