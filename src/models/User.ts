/**
 * User Model
 * 
 * This model represents a user in the system.
 * It contains all the properties and types related to a user.
 */

export interface User {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    profileImage?: string;
    bio?: string;
    [key: string]: unknown;
}

/**
 * User registration data
 */
export interface UserRegistrationData {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    [key: string]: unknown;
}

/**
 * User login credentials
 */
export interface UserLoginCredentials {
    email: string;
    password: string;
    [key: string]: unknown;
}

/**
 * User profile update data
 */
export interface UserProfileUpdateData {
    firstName?: string;
    lastName?: string;
    bio?: string;
    [key: string]: unknown;
}

/**
 * Authentication tokens
 */
export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    [key: string]: unknown;
}

/**
 * Helper function to create a default user object
 */
export function createDefaultUser(): User {
    return {
        id: 0,
        username: '',
        email: '',
        role: 'user',
    };
}

/**
 * Helper function to map API response to User model
 * Handles both camelCase and snake_case API responses
 */
export function mapApiResponseToUser(userData: Record<string, unknown>): User {
    if (!userData || typeof userData !== 'object') {
        throw new Error('Invalid user data format received');
    }

    // If the user data is nested in a 'user' or 'data' field, extract it
    const userObject = (userData.user as Record<string, unknown>) ||
        (userData.data as Record<string, unknown>) ||
        userData;

    // Create the base user object with required fields
    const user: User = {
        id: Number(userObject.id) || 0,
        username: String(userObject.username || ''),
        email: String(userObject.email || ''),
        firstName: userObject.firstName ? String(userObject.firstName) : userObject.first_name ? String(userObject.first_name) : '',
        lastName: userObject.lastName ? String(userObject.lastName) : userObject.last_name ? String(userObject.last_name) : '',
        role: userObject.role ? String(userObject.role) : 'user',
        profileImage: userObject.profileImage ? String(userObject.profileImage) : userObject.profile_image ? String(userObject.profile_image) : '',
        bio: userObject.bio ? String(userObject.bio) : ''
    };

    // Add any additional properties from the API response
    Object.keys(userObject).forEach(key => {
        if (!user.hasOwnProperty(key) && key !== 'first_name' && key !== 'last_name' && key !== 'profile_image') {
            user[key] = userObject[key];
        }
    });

    return user;
}