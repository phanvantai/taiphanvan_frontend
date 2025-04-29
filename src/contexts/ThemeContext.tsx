"use client"

import React, { createContext, useState, useEffect, useContext } from 'react'

type Theme = 'light' | 'dark'

// Available color choices
export const colorOptions = {
    purple: '#8a85e6', // Soft purple
    blue: '#6b9aef',   // Soft blue
    teal: '#5bbab3',   // Soft teal
    rose: '#f07a98'    // Soft rose
}

export type PrimaryColor = keyof typeof colorOptions

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    primaryColor: PrimaryColor
    setPrimaryColor: (color: PrimaryColor) => void
    colorHex: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light')
    const [primaryColor, setPrimaryColor] = useState<PrimaryColor>('purple')

    // On mount, check for user preferences
    useEffect(() => {
        // Check for theme preference
        const savedTheme = localStorage.getItem('theme') as Theme | null
        if (savedTheme) {
            setTheme(savedTheme)
        }
        else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark')
        }

        // Check for color preference
        const savedColor = localStorage.getItem('primaryColor') as PrimaryColor | null
        if (savedColor && savedColor in colorOptions) {
            setPrimaryColor(savedColor)
        }
    }, [])

    // Update the document when theme changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    // Update the document when primary color changes
    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', colorOptions[primaryColor])
        localStorage.setItem('primaryColor', primaryColor)
    }, [primaryColor])

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
    }

    const handleSetPrimaryColor = (color: PrimaryColor) => {
        setPrimaryColor(color)
    }

    return (
        <ThemeContext.Provider value={{
            theme,
            toggleTheme,
            primaryColor,
            setPrimaryColor: handleSetPrimaryColor,
            colorHex: colorOptions[primaryColor]
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}