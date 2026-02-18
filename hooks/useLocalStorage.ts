import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// FIX: Update function signature to use imported Dispatch and SetStateAction types.
// This resolves the "Cannot find namespace 'React'" error by avoiding the React namespace.
function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
    // Step 1: Lazy initial state. This function will only be executed on the initial render.
    // This safely reads from localStorage without causing issues during server-side rendering or build time.
    const [storedValue, setStoredValue] = useState<T>(() => {
        // Check if window is defined to prevent errors in non-browser environments
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.error(error);
            return initialValue;
        }
    });

    // Step 2: Use useEffect to update localStorage when the state changes.
    // This synchronizes the state with localStorage whenever `storedValue` is updated.
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

export default useLocalStorage;