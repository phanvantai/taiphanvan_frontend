"use client"

import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react'

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
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

    // Create a ref for refreshAccessToken to break circular dependency
    const refreshAccessTokenRef = useRef<() => Promise<string | null>>(() => Promise.resolve(null))

    // Set up token refresh timer - using useCallback with empty dependencies
    const setupTokenRefreshTimer = useCallback((expiresIn: number) => {
        // Clear any existing timer
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current)
            refreshTimerRef.current = null
        }

        // Convert expiresIn from seconds to milliseconds and refresh at 75% of the token lifetime
        // This is more reliable than a fixed time before expiration
        const refreshTime = Math.floor((expiresIn * 1000) * 0.75)

        // Only set up timer if refreshTime is positive
        if (refreshTime > 0) {
            console.log(`Setting up token refresh timer for ${refreshTime}ms from now (${new Date(Date.now() + refreshTime).toLocaleTimeString()})`)
            refreshTimerRef.current = setTimeout(async () => {
                console.log('Token refresh timer triggered at', new Date().toLocaleTimeString())
                try {
                    await refreshAccessTokenRef.current()
                } catch (error) {
                    console.error('Error in refresh timer:', error)
                    // If refresh fails, try again in 30 seconds if we still have a refresh token
                    if (localStorage.getItem('refresh_token')) {
                        console.log('Scheduling another refresh attempt in 30 seconds')
                        refreshTimerRef.current = setTimeout(async () => {
                            await refreshAccessTokenRef.current()
                        }, 30000)
                    }
                }
            }, refreshTime)
        } else {
            console.warn('Invalid expiration time provided:', expiresIn)
        }
    }, []) // Empty dependency array to prevent recreating this function

    // Fetch user profile with the token
    const fetchUserProfile = useCallback(async (authToken: string) => {
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
                console.log('Profile fetch failed with status:', response.status)

                // If we get a 401 Unauthorized, try to refresh the token first
                if (response.status === 401 && localStorage.getItem('refresh_token')) {
                    console.log('Attempting to refresh token after 401 in profile fetch')

                    // Try to refresh the token
                    const newToken = await refreshAccessTokenRef.current()

                    if (newToken) {
                        console.log('Token refreshed successfully, retrying profile fetch')
                        // Retry the profile fetch with the new token (recursive call)
                        return await fetchUserProfile(newToken)
                    } else {
                        console.log('Token refresh failed, proceeding with logout')
                    }
                }

                // If we reach here, either it wasn't a 401 error or token refresh failed
                console.error('Profile fetch failed with status:', response.status, userData)

                // Only clear tokens and log out if it's an authentication issue
                if (response.status === 401 || response.status === 403) {
                    // Tokens are expired or invalid
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('refresh_token')
                    localStorage.removeItem('token_type')
                    localStorage.removeItem('expires_in')
                    localStorage.removeItem('token') // Remove legacy token too
                    setTokens(null)
                    setUser(null)

                    // Set a more user-friendly error message
                    setError('Your session has expired. Please log in again.')
                } else {
                    // For other errors, keep the tokens but set an error
                    setError(userData.message || userData.error || `Failed to fetch profile: ${response.status}`)
                }
                return
            }

            // If the user data is nested in a 'user' or 'data' field, extract it
            const userObject = userData.user || userData.data || userData

            if (!userObject || typeof userObject !== 'object') {
                console.error('Invalid user data format:', userData)
                throw new Error('Invalid user data format received')
            }

            // Clear any previous errors since we successfully got the profile
            setError(null)
            setUser(userObject)
        } catch (err) {
            console.error('Failed to fetch user profile:', err)

            // Don't immediately clear tokens on network errors
            if (err instanceof TypeError && err.message.includes('network')) {
                setError('Network error. Please check your internet connection and try again.')
            } else {
                setUser(null)
                setError('Failed to load user profile. Please try logging in again.')
                // Clear tokens as they might be invalid
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('token_type')
                localStorage.removeItem('expires_in')
                localStorage.removeItem('token') // Remove legacy token too
                setTokens(null)
            }
        } finally {
            setIsLoading(false)
        }
    }, []) // Remove API_URL from dependencies as it's defined outside the component

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

                    // Parse the expiration time
                    let expiresIn = parseInt(storedExpiresIn, 10)
                    if (isNaN(expiresIn) || expiresIn <= 0) {
                        console.warn('Invalid expires_in value, defaulting to 900 seconds')
                        expiresIn = 900 // Default to 15 minutes
                        localStorage.setItem('expires_in', '900')
                    }

                    const authTokens: AuthTokens = {
                        access_token: storedAccessToken,
                        refresh_token: storedRefreshToken,
                        token_type: storedTokenType,
                        expires_in: expiresIn
                    }
                    setTokens(authTokens)

                    try {
                        // Try to fetch the user profile with the stored token
                        await fetchUserProfile(authTokens.access_token)

                        // Set up token refresh timer
                        setupTokenRefreshTimer(authTokens.expires_in)
                    } catch (profileError) {
                        console.error('Failed to fetch profile with stored token:', profileError)

                        // If profile fetch fails, try to refresh the token
                        console.log('Attempting to refresh token during initialization')
                        const newToken = await refreshAccessToken()

                        if (!newToken) {
                            // If refresh fails, clear tokens and set loading to false
                            console.log('Token refresh failed during initialization, clearing auth state')
                            setTokens(null)
                            setUser(null)
                            setIsLoading(false)
                        }
                        // If refresh succeeds, the user profile will be fetched in refreshAccessToken
                    }
                } else {
                    // For backward compatibility with old token storage
                    const legacyToken = localStorage.getItem('token')
                    if (legacyToken) {
                        console.log('Found legacy token, attempting to use it')
                        try {
                            // Try to fetch the user profile with the legacy token
                            await fetchUserProfile(legacyToken)

                            // If successful, set up the token state
                            const authTokens: AuthTokens = {
                                access_token: legacyToken,
                                refresh_token: '', // No refresh token for legacy tokens
                                token_type: 'Bearer',
                                expires_in: 900 // Default to 15 minutes
                            }
                            setTokens(authTokens)

                            // No refresh timer for legacy tokens since we don't have a refresh token
                        } catch (legacyError) {
                            console.error('Failed to use legacy token:', legacyError)
                            // Clear the invalid legacy token
                            localStorage.removeItem('token')
                            setIsLoading(false)
                        }
                    } else {
                        // No tokens found - set loading to false
                        console.log('No authentication tokens found')
                        setIsLoading(false)
                    }
                }
            } catch (err) {
                console.error('Auth initialization error:', err)
                // Clear any potentially invalid tokens
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('token_type')
                localStorage.removeItem('expires_in')
                localStorage.removeItem('token') // Remove legacy token too
                setTokens(null)
                setUser(null)
                setIsLoading(false)
            }
        }

        checkAuth()

        // Clean up timer on unmount
        return () => {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current)
                refreshTimerRef.current = null
            }
        }
    }, [fetchUserProfile, setupTokenRefreshTimer]) // We can't add refreshAccessToken to dependencies due to circular reference

    // Refresh access token using refresh token
    const refreshAccessToken = async (): Promise<string | null> => {
        // Get the latest refresh token from localStorage (in case it was updated elsewhere)
        const currentRefreshToken = localStorage.getItem('refresh_token')

        if (!currentRefreshToken) {
            console.error('No refresh token available in localStorage')
            // Clear any potentially stale token data
            localStorage.removeItem('access_token')
            localStorage.removeItem('token_type')
            localStorage.removeItem('expires_in')
            localStorage.removeItem('token') // Remove legacy token too
            setTokens(null)
            setError('Your session has expired. Please log in again.')
            return null
        }

        try {
            console.log('Refreshing access token at', new Date().toLocaleTimeString())

            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ refresh_token: currentRefreshToken })
            }).catch(error => {
                console.error('Network error during token refresh:', error);
                // For network errors, don't clear tokens yet
                throw new Error(`Network error: ${error.message}`);
            });

            // Check if the response can be parsed as JSON
            let data
            const contentType = response.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
                data = await response.json()
                console.log('Token refresh response:', JSON.stringify(data))
            } else {
                const text = await response.text()
                console.log('Token refresh response (text):', text)
                throw new Error('Invalid response format from server')
            }

            if (!response.ok) {
                const errorMessage = data.message || data.error || `Token refresh failed with status ${response.status}`
                console.error('Token refresh failed:', errorMessage)

                // For 401/403 errors, clear tokens and set a user-friendly error
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('refresh_token')
                    localStorage.removeItem('token_type')
                    localStorage.removeItem('expires_in')
                    localStorage.removeItem('token')
                    setTokens(null)
                    setUser(null)
                    setError('Your session has expired. Please log in again.')
                }

                throw new Error(errorMessage)
            }

            // Check if we received new tokens - handle both nested and top-level response formats
            const tokenData = data.data || data;
            console.log('Extracted token data for refresh:', JSON.stringify(tokenData));

            if (tokenData.access_token) {
                // Create updated tokens object
                const updatedTokens: AuthTokens = {
                    access_token: tokenData.access_token,
                    refresh_token: tokenData.refresh_token || currentRefreshToken,
                    token_type: tokenData.token_type || 'Bearer',
                    expires_in: tokenData.expires_in || 900 // Default to 15 minutes if not provided
                }

                console.log('Using refresh token:', tokenData.refresh_token ? 'New from response' : 'Existing from localStorage');

                // Update localStorage with new token data
                localStorage.setItem('access_token', updatedTokens.access_token)
                localStorage.setItem('refresh_token', updatedTokens.refresh_token)
                localStorage.setItem('token_type', updatedTokens.token_type)
                localStorage.setItem('expires_in', updatedTokens.expires_in.toString())

                // Update state
                setTokens(updatedTokens)
                console.log('Token refreshed successfully, expires in', updatedTokens.expires_in, 'seconds')

                // Set up a new refresh timer with the updated expiration
                setupTokenRefreshTimer(updatedTokens.expires_in)

                // Try to fetch the user profile with the new token to ensure it's valid
                try {
                    await fetchUserProfile(updatedTokens.access_token)
                } catch (profileError) {
                    console.error('Failed to fetch profile after token refresh:', profileError)
                    // Continue anyway since we have a valid token
                }

                // Clear any previous errors since we successfully refreshed the token
                setError(null)
                return updatedTokens.access_token
            } else {
                throw new Error('No access token in refresh response')
            }
        } catch (err: unknown) {
            console.error('Token refresh error:', err)

            // If refresh fails due to token issues, log the user out
            if (err instanceof Error &&
                (err.message.includes('expired') ||
                    err.message.includes('invalid') ||
                    err.message.includes('401') ||
                    err.message.includes('403'))) {
                console.log('Token refresh failed due to token issues, logging out')
                // Clear tokens
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('token_type')
                localStorage.removeItem('expires_in')
                localStorage.removeItem('token')
                setTokens(null)
                setUser(null)
                setError('Your session has expired. Please log in again.')
            } else if (err instanceof TypeError && err.message.includes('network')) {
                // For network errors, keep the tokens but set a network error message
                setError('Network error. Please check your internet connection and try again.')
            } else {
                // For other errors, keep the user logged in but set error
                setError(err instanceof Error ? err.message : 'Failed to refresh access token')
            }

            return null
        }
    }

    // Assign the refreshAccessToken function to the ref
    refreshAccessTokenRef.current = refreshAccessToken;

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
            if (data.access_token) {
                console.log('Received token from login response')

                // Ensure we have all required token data with defaults if needed
                const authTokens: AuthTokens = {
                    access_token: data.access_token,
                    refresh_token: data.refresh_token || '', // Some APIs might not use refresh tokens
                    token_type: data.token_type || 'Bearer',
                    expires_in: data.expires_in || 900 // Default to 15 minutes if not provided
                }

                console.log('Token expires in:', authTokens.expires_in, 'seconds')

                // Store tokens in localStorage
                localStorage.setItem('access_token', authTokens.access_token)

                if (authTokens.refresh_token) {
                    localStorage.setItem('refresh_token', authTokens.refresh_token)
                }

                localStorage.setItem('token_type', authTokens.token_type)
                localStorage.setItem('expires_in', authTokens.expires_in.toString())

                // Remove legacy token if it exists
                localStorage.removeItem('token')

                // Update state
                setTokens(authTokens)

                // Set up token refresh timer if we have a refresh token
                if (authTokens.refresh_token) {
                    console.log('Setting up refresh timer for token')
                    setupTokenRefreshTimer(authTokens.expires_in)
                } else {
                    console.log('No refresh token provided, skipping refresh timer')
                }

                // Fetch user profile with the access token
                try {
                    await fetchUserProfile(authTokens.access_token)
                } catch (profileError) {
                    console.error('Failed to fetch profile after login:', profileError)
                    throw new Error('Login successful but failed to load user profile')
                }
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
                    expires_in: 900 // Default to 15 minutes
                }

                setTokens(authTokens)

                // Fetch user profile
                try {
                    await fetchUserProfile(token)
                } catch (profileError) {
                    console.error('Failed to fetch profile with legacy token:', profileError)
                    throw new Error('Login successful but failed to load user profile')
                }
            }
        } catch (err: unknown) {
            console.error('Login error:', err)
            setError(err instanceof Error ? err.message : 'An error occurred during login')
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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred during registration')
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
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current)
                refreshTimerRef.current = null
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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred while updating profile')
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    // Create an authenticated fetch that handles token refreshing
    const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
        // Get the latest token from localStorage
        const currentAccessToken = localStorage.getItem('access_token')
        const currentTokenType = localStorage.getItem('token_type') || 'Bearer'

        if (!currentAccessToken) {
            console.error('No access token available for authenticated request')
            // Set a user-friendly error message
            setError('Your session has expired. Please log in again.')
            throw new Error('Authentication required. Please log in again.')
        }

        // Add authorization header to the original request
        const authOptions: RequestInit = {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `${currentTokenType} ${currentAccessToken}`,
                'Accept': 'application/json',
                ...(options.method !== 'GET' && { 'Content-Type': 'application/json' })
            }
        }

        try {
            // Try the request with the current token
            let response = await fetch(url, authOptions)

            // If we get a 401 Unauthorized error, try to refresh the token and retry the request
            if (response.status === 401) {
                console.log('Got 401 response, attempting to refresh token')

                // Check if we have a refresh token before attempting refresh
                const refreshToken = localStorage.getItem('refresh_token')
                if (!refreshToken) {
                    console.log('No refresh token available, cannot refresh')
                    // Clear any remaining tokens
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('token_type')
                    localStorage.removeItem('expires_in')
                    localStorage.removeItem('token') // Remove legacy token too
                    setTokens(null)
                    setUser(null)
                    setError('Your session has expired. Please log in again.')
                    throw new Error('Authentication required. Please log in again.')
                }

                // Try to refresh the token
                const newToken = await refreshAccessToken()

                if (newToken) {
                    console.log('Token refreshed successfully, retrying original request')

                    // Get the updated token type (might have changed during refresh)
                    const updatedTokenType = localStorage.getItem('token_type') || 'Bearer'

                    // Update the authorization header with the new token
                    authOptions.headers = {
                        ...authOptions.headers,
                        'Authorization': `${updatedTokenType} ${newToken}`
                    }

                    // Retry the request with the new token
                    response = await fetch(url, authOptions)

                    // If we still get a 401 after refresh, the refresh token might be invalid
                    if (response.status === 401) {
                        console.error('Still getting 401 after token refresh, logging out')
                        // Force logout
                        localStorage.removeItem('access_token')
                        localStorage.removeItem('refresh_token')
                        localStorage.removeItem('token_type')
                        localStorage.removeItem('expires_in')
                        localStorage.removeItem('token')
                        setTokens(null)
                        setUser(null)
                        setError('Your session has expired. Please log in again.')
                        throw new Error('Authentication failed. Please log in again.')
                    }
                } else {
                    console.error('Token refresh failed, cannot complete the request')
                    // Clear auth state
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('refresh_token')
                    localStorage.removeItem('token_type')
                    localStorage.removeItem('expires_in')
                    localStorage.removeItem('token')
                    setTokens(null)
                    setUser(null)
                    setError('Your session has expired. Please log in again.')
                    throw new Error('Authentication failed. Please log in again.')
                }
            }

            return response
        } catch (error) {
            console.error('Error in authFetch:', error)

            // If it's a network error, add more context but don't clear auth state
            if (error instanceof TypeError && error.message.includes('network')) {
                setError('Network error. Please check your internet connection and try again.')
                throw new Error('Network error. Please check your internet connection.')
            }

            throw error
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