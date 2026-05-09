import React, { createContext, useContext, useState, useEffect } from 'react';

const FocusTimerContext = createContext();

export const useFocusTimer = () => useContext(FocusTimerContext);

export const FocusTimerProvider = ({ children }) => {
    // Load initial state from localStorage if exists
    const loadInitialState = () => {
        const saved = localStorage.getItem('focusTimerState');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // If it was not paused and endTime has passed, we should handle it
                // For simplicity, we just load it. The effect will check if time is up.
                return parsed;
            } catch (e) {
                return null;
            }
        }
        return null;
    };

    const initialState = loadInitialState() || {
        activeTask: null,
        endTime: null,
        isPaused: false,
        pausedTimeRemaining: null,
        isMinimized: false,
    };

    const [timerState, setTimerState] = useState(initialState);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [hasNotified, setHasNotified] = useState(false);

    // Sync to localStorage on change
    useEffect(() => {
        localStorage.setItem('focusTimerState', JSON.stringify(timerState));
    }, [timerState]);

    // Timer calculation loop
    useEffect(() => {
        let interval;
        if (timerState.activeTask && !timerState.isPaused && !isFinished) {
            interval = setInterval(() => {
                const now = Date.now();
                const remaining = Math.max(0, timerState.endTime - now);
                setTimeRemaining(remaining);

                if (remaining === 0) {
                    setIsFinished(true);
                    if (!hasNotified) {
                        triggerNotification(timerState.activeTask);
                        setHasNotified(true);
                    }
                }
            }, 100); // Check frequently for smooth UI updates
        } else if (timerState.isPaused && timerState.pausedTimeRemaining) {
            setTimeRemaining(timerState.pausedTimeRemaining);
        } else if (!timerState.activeTask) {
            setTimeRemaining(0);
            setIsFinished(false);
            setHasNotified(false);
        }
        
        return () => clearInterval(interval);
    }, [timerState, isFinished, hasNotified]);

    const triggerNotification = (task) => {
        // Request permission if not granted
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        if (Notification.permission === 'granted') {
            new Notification('Time is up!', {
                body: `You finished your focus session for: ${task.title}`,
            });
        }

        // Play gentle chime using Web Audio API
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
            oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.1); // C6
            
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 1.5);
        } catch(e) {
            console.log('Audio notification failed', e);
        }
    };

    const startTimer = (task, minutes = null) => {
        // Default to 25 if not set
        const durationMins = minutes || task.estimated_minutes || 25;
        const durationMs = durationMins * 60 * 1000;
        
        setTimerState({
            activeTask: task,
            endTime: Date.now() + durationMs,
            isPaused: false,
            pausedTimeRemaining: null,
            isMinimized: false,
        });
        setIsFinished(false);
        setHasNotified(false);
        
        // Request notification permission upfront when they click play
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };

    const pauseTimer = () => {
        setTimerState(prev => ({
            ...prev,
            isPaused: true,
            pausedTimeRemaining: Math.max(0, prev.endTime - Date.now())
        }));
    };

    const resumeTimer = () => {
        setTimerState(prev => ({
            ...prev,
            isPaused: false,
            endTime: Date.now() + prev.pausedTimeRemaining,
            pausedTimeRemaining: null
        }));
    };

    const stopTimer = () => {
        setTimerState({
            activeTask: null,
            endTime: null,
            isPaused: false,
            pausedTimeRemaining: null,
            isMinimized: false,
        });
        setIsFinished(false);
        setHasNotified(false);
    };

    const toggleMinimize = () => {
        setTimerState(prev => ({
            ...prev,
            isMinimized: !prev.isMinimized
        }));
    };

    const addTime = (minutes) => {
        const addedMs = minutes * 60 * 1000;
        setTimerState(prev => ({
            ...prev,
            endTime: (prev.isPaused ? Date.now() + prev.pausedTimeRemaining : Math.max(Date.now(), prev.endTime)) + addedMs,
            pausedTimeRemaining: prev.isPaused ? prev.pausedTimeRemaining + addedMs : null
        }));
        setIsFinished(false);
        setHasNotified(false);
    };

    return (
        <FocusTimerContext.Provider value={{
            ...timerState,
            timeRemaining,
            isFinished,
            startTimer,
            pauseTimer,
            resumeTimer,
            stopTimer,
            toggleMinimize,
            addTime,
        }}>
            {children}
        </FocusTimerContext.Provider>
    );
};
