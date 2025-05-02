"use client"

import React, { createContext, useState, useEffect, useContext } from 'react'

interface User {
    id: number
    username: string
    email: string
    firstName?: string
    lastName?: string
    role: string
    profileImage?: string
    bio?: string
}

interface AuthTokens {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
}

interface AuthContextType {
    user: User | null
    tokens: AuthTokens | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (username: string, email: string, password: string, firstName?: string, lastName?: string) => Promise<void>
    logout: () => Promise<void>
    updateProfile: (data: Partial<User>) => Promise<void>
    refreshAccessToken: () => Promise<string | null>
    authFetch: (url: string, options?: RequestInit) => Promise<Response>
    error: string | null
    clearError: () => void
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9876/api'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Initialize state
    const [user, setUser] = useState<User | null>(null)
    const [tokens, setTokens] = useState<AuthTokens | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null) // Error message state
    const [refreshTimerId, setRefreshTimerId] = useState<NodeJS.Timeout | null>(null)

    // Set up token refresh timer
    const setupTokenRefreshTimer = (expiresIn: number) => {
        // Clear any existing timer
        if (refreshTimerId) {
            clearTimeout(refreshTimerId)
        }

        // Convert expiresIn from seconds to milliseconds and refresh 1 minute before expiration
        const refreshTime = (expiresIn * 1000) - (60 * 1000)

        // Only set up timer if refreshTime is positive
        if (refreshTime > 0) {
            console.log(`Setting up token refresh timer for ${refreshTime}ms from now`)
            const timerId = setTimeout(async () => {
                console.log('Token refresh timer triggered')
                await refreshAccessToken()
            }, refreshTime)

            setRefreshTimerId(timerId)
        }
    }

    // Check if user is already logged in (on mount)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedAccessToken = localStorage.getItem('access_token')
                const storedRefreshToken = localStorage.getItem('refresh_token')
                const storedTokenType = localStorage.getItem('token_type')
                const storedExpiresIn = localStorage.getItem('expires_in')

                if (storedAccessToken && storedRefreshToken && storedTokenType && storedExpiresIn) {
                    console.log('Found stored tokens, setting token state')
                    const authTokens: AuthTokens = {
                        access_token: storedAccessToken,
                        refresh_token: storedRefreshToken,
                        token_type: storedTokenType,
                        expires_in: parseInt(storedExpiresIn, 10)
                    }
                    setTokens(authTokens)
                    await fetchUserProfile(authTokens.access_token)

                    // Set up token refresh timer
                    setupTokenRefreshTimer(authTokens.expires_in)
                } else {
                    // For backward compatibility with old token storage
                    const legacyToken = localStorage.getItem('token')
                    if (legacyToken) {
                        console.log('Found legacy token, setting token state')
                        const authTokens: AuthTokens = {
                            access_token: legacyToken,
                            refresh_token: '',
                            token_type: 'Bearer',
                            expires_in: 0
                        }
                        setTokens(authTokens)
                        await fetchUserProfile(legacyToken)
                    }
                }
            } catch (err) {
                console.error('Auth initialization error:', err)
                // Error handling is done in fetchUserProfile
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()

        // Clean up timer on unmount
        return () => {
            if (refreshTimerId) {
                clearTimeout(refreshTimerId)
            }
        }
    }, [])

    // Set up refresh timer whenever tokens change
    useEffect(() => {
        if (tokens?.access_token && tokens?.refresh_token && tokens?.expires_in > 0) {
            setupTokenRefreshTimer(tokens.expires_in)
        }
    }, [tokens?.access_token])

    // Fetch user profile with the token
    const fetchUserProfile = async (authToken: string) => {
        try {
            console.log('Fetching user profile with token')

            const response = await fetch(`${API_URL}/profile`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                }
                // Removed credentials: 'include' to avoid CORS issues
            })

            // Check if the response is JSON
            let userData
            const contentType = response.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
                userData = await response.json()
                console.log('User profile data:', userData)
            } else {
                const text = await response.text()
                console.log('Profile response (text):', text)
                throw new Error('Invalid response format from server')
            }

            if (!response.ok) {
                console.error('Profile fetch failed with status:', response.status, userData)
                // Tokens might be expired or invalid
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('token_type')
                localStorage.removeItem('expires_in')
                localStorage.removeItem('token') // Remove legacy token too
                setTokens(null)
                setUser(null)
                setError(userData.message || userData.error || `Failed to fetch profile: ${response.status}`)
                return
            }

            // If the user data is nested in a 'user' or 'data' field, extract it
            const userObject = userData.user || userData.data || userData

            if (!userObject || typeof userObject !== 'object') {
                console.error('Invalid user data format:', userData)
                throw new Error('Invalid user data format received')
            }

            setUser(userObject)
        } catch (err) {
            console.error('Failed to fetch user profile:', err)
            setUser(null)
            setError('Failed to load user profile. Please try logging in again.')
            // Clear tokens as they might be invalid
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('token_type')
            localStorage.removeItem('expires_in')
            localStorage.removeItem('token') // Remove legacy token too
            setTokens(null)
        } finally {
            setIsLoading(false)
        }
    }

    // Login function
    const login = async (email: string, password: string) => {
        setIsLoading(true)
        setError(null)

        try {
            console.log('Logging in with:', { email })

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
                // Removed credentials: 'include' to avoid CORS issues
            }).catch(error => {
                console.error('Fetch error during login:', error);
                throw new Error(`Network error: ${error.message}`);
            });

            // First check if the response can be parsed as JSON
            let data
            const contentType = response.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
                data = await response.json()
                console.log('Login response:', data)
            } else {
                const text = await response.text()
                console.log('Login response (text):', text)
                data = { error: 'Invalid response format from server' }
            }

            if (!response.ok) {
                // Handle specific error messages from the server
                const errorMessage = data.message || data.error || `Login failed with status ${response.status}`
                console.error('Login failed:', errorMessage)
                throw new Error(errorMessage)
            }

            // Check for the new token format
            if (data.access_token && data.refresh_token && data.token_type) {
                console.log('Received new token format')

                const authTokens: AuthTokens = {
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                    token_type: data.token_type,
                    expires_in: data.expires_in || 900 // Default to 15 minutes if not provided
                }

                // Store tokens in localStorage
                localStorage.setItem('access_token', authTokens.access_token)
                localStorage.setItem('refresh_token', authTokens.refresh_token)
                localStorage.setItem('token_type', authTokens.token_type)
                localStorage.setItem('expires_in', authTokens.expires_in.toString())

                // Remove legacy token if it exists
                localStorage.removeItem('token')

                setTokens(authTokens)

                // Set up token refresh timer
                setupTokenRefreshTimer(authTokens.expires_in)

                // Fetch user profile with the access token
                await fetchUserProfile(authTokens.access_token)
            } else {
                // Fallback for legacy token format
                const token = data.token || data.accessToken

                if (!token) {
                    console.error('No token in response:', data)
                    throw new Error('No token received from server')
                }

                console.log('Received legacy token format')

                // Store the token in localStorage
                localStorage.setItem('token', token)

                const authTokens: AuthTokens = {
                    access_token: token,
                    refresh_token: '',
                    token_type: 'Bearer',
                    expires_in: 0
                }

                setTokens(authTokens)

                // Fetch user profile
                await fetchUserProfile(token)
            }
        } catch (err: any) {
            console.error('Login error:', err)
            setError(err.message || 'An error occurred during login')
            setUser(null)
            setTokens(null)
            throw err // Re-throw to allow the component to handle it
        } finally {
            setIsLoading(false)
        }
    }

    // Register function
    const register = async (username: string, email: string, password: string, firstName?: string, lastName?: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    first_name: firstName,
                    last_name: lastName
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed')
            }

            // You could auto-login the user here or redirect to login
            return data
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration')
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    // Logout function
    const logout = async () => {
        setIsLoading(true)

        try {
            // Clear any existing refresh timer
            if (refreshTimerId) {
                clearTimeout(refreshTimerId)
                setRefreshTimerId(null)
            }

            if (tokens?.access_token) {
                // Call the logout endpoint to blacklist the token
                await fetch(`${API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${tokens.token_type} ${tokens.access_token}`
                    }
                })
            }
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            // Clear all tokens from local storage
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('token_type')
            localStorage.removeItem('expires_in')

            // Also remove legacy token if it exists
            localStorage.removeItem('token')

            setTokens(null)
            setUser(null)
            setIsLoading(false)
        }
    }

    // Update user profile
    const updateProfile = async (data: Partial<User>) => {
        if (!tokens?.access_token) {
            setError('You must be logged in to update your profile')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // Use authFetch which handles token refresh automatically
            const response = await authFetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to update profile')
            }

            // Update the user state with the new data
            setUser(prevUser => prevUser ? { ...prevUser, ...responseData.user } : null)
            return responseData
        } catch (err: any) {
            setError(err.message || 'An error occurred while updating profile')
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    // Create an authenticated fetch that handles token refreshing
    const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
        if (!tokens?.access_token) {
            throw new Error('No access token available')
        }

        // Add authorization header to the original request
        const authOptions: RequestInit = {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `${tokens.token_type} ${tokens.access_token}`
            }
        }

        // Try the request with the current token
        let response = await fetch(url, authOptions)

        // If we get a 401 Unauthorized error, try to refresh the token and retry the request
        if (response.status === 401) {
            console.log('Got 401 response, attempting to refresh token')

            const newToken = await refreshAccessToken()

            if (newToken) {
                // Update the authorization header with the new token
                authOptions.headers = {
                    ...authOptions.headers,
                    'Authorization': `${tokens.token_type} ${newToken}`
                }

                // Retry the request with the new token
                response = await fetch(url, authOptions)
            }
        }

        return response
    }

    // Refresh access token using refresh token
    const refreshAccessToken = async (): Promise<string | null> => {
        if (!tokens?.refresh_token) {
            console.error('No refresh token available')
            return null
        }

        try {
            console.log('Refreshing access token')

            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ refresh_token: tokens.refresh_token })
                // Removed credentials: 'include' to avoid CORS issues
            })

            // Check if the response can be parsed as JSON
            let data
            const contentType = response.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
                data = await response.json()
                console.log('Token refresh response:', data)
            } else {
                const text = await response.text()
                console.log('Token refresh response (text):', text)
                throw new Error('Invalid response format from server')
            }

            if (!response.ok) {
                const errorMessage = data.message || data.error || `Token refresh failed with status ${response.status}`
                console.error('Token refresh failed:', errorMessage)
                throw new Error(errorMessage)
            }

            // Check if we received new tokens
            if (data.access_token) {
                // Update tokens in state and localStorage
                const updatedTokens: AuthTokens = {
                    ...tokens,
                    access_token: data.access_token,
                    // Update refresh_token if a new one was provided
                    ...(data.refresh_token && { refresh_token: data.refresh_token }),
                    // Update expires_in if provided
                    ...(data.expires_in && { expires_in: data.expires_in })
                }

                localStorage.setItem('access_token', updatedTokens.access_token)
                if (data.refresh_token) {
                    localStorage.setItem('refresh_token', updatedTokens.refresh_token)
                }
                if (data.expires_in) {
                    localStorage.setItem('expires_in', updatedTokens.expires_in.toString())
                }

                setTokens(updatedTokens)
                return updatedTokens.access_token
            } else {
                throw new Error('No access token in refresh response')
            }
        } catch (err: any) {
            console.error('Token refresh error:', err)

            // If refresh fails, we should log the user out
            if (err.message.includes('expired') || err.message.includes('invalid')) {
                await logout()
            }

            setError(err.message || 'Failed to refresh access token')
            return null
        }
    }

    // Clear error state
    const clearError = () => {
        console.log('Clearing error state')
        setError(null)
    }

    const contextValue: AuthContextType = {
        user,
        tokens,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshAccessToken,
        authFetch,
        error,
        clearError
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use the auth context
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}