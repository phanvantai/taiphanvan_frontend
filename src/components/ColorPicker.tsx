"use client"

import { useState, useRef, useEffect } from 'react'
import { useTheme, colorOptions, PrimaryColor } from '@/contexts/ThemeContext'

export default function ColorPicker() {
    const { primaryColor, setPrimaryColor } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const colorPickerRef = useRef<HTMLDivElement>(null)

    // Close color picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleColorChange = (color: PrimaryColor) => {
        setPrimaryColor(color)
        setIsOpen(false)
    }

    return (
        <div className="color-picker" ref={colorPickerRef}>
            <button
                className="color-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Change primary color"
                title="Change primary color"
                style={{
                    backgroundColor: colorOptions[primaryColor],
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    border: '1px solid var(--border-color)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                }}
            >
                <i className="fas fa-palette"></i>
            </button>

            {isOpen && (
                <div className="color-dropdown">
                    {Object.entries(colorOptions).map(([color, hex]) => (
                        <button
                            key={color}
                            className={`color-option ${primaryColor === color ? 'active' : ''}`}
                            style={{ backgroundColor: hex }}
                            onClick={() => handleColorChange(color as PrimaryColor)}
                            aria-label={`Set ${color} as primary color`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}