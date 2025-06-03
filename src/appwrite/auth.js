import conf from '../conf/conf.js';
import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

// Log the values of each variable in conf to check if they hold the correct value


export class AuthService {
    client;
    account;

    constructor() {
        try {
            this.client = new Client()
                .setEndpoint(conf.appwriteUrl)
                .setProject(conf.appwriteProjectId);
            this.account = new Account(this.client);
            console.log('Appwrite client and account initialized');
        } catch (err) {
            console.error('Error initializing Appwrite client:', err.message);
        }
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            
            if (userAccount) {
                console.log('Account created successfully:', userAccount);
                return this.login({ email, password }); // Auto-login
            } else {
                throw new Error('Account creation failed - empty response');
            }
        } catch (err) {
            if (err.code === 409) {
                console.error('Error: Account already exists with this email');
                throw new Error('Account already exists with this email');
            } else if (err.code === 400) {
                console.error('Error: Bad request. Please check your input data');
                throw new Error('Bad request. Please check your input data');
            } else {
                console.error('Error creating account:', err.message || err);
                throw new Error(err.message || 'An unknown error occurred while creating the account');
            }
        }
    }

    async login({ email, password }) {
        try {
            const session = await this.account.createEmailSession(email, password);
            console.log('Login successful:', session);
            return session;
        } catch (err) {
            if (err.code === 401) {
                console.error('Invalid email or password');
                throw new Error('Invalid email or password');
            }
            console.error('Login failed:', err.message || err);
            throw new Error(err.message || 'Login failed');
        }
    }

    async getcurrentUser() {
        try {
            const user = await this.account.get();
            console.log('Current user:', user);
            return user;
        } catch (err) {
            if (err.code === 401) {
                console.warn('No session found. User might be logged out.');
            }
            console.error('Error getting current user:', err.message || err);
            throw new Error(err.message || 'Failed to retrieve current user');
        }
    }

    async logout() {
        try {
            const res = await this.account.deleteSessions('current');
            console.log('Logged out successfully');
            return res;
        } catch (err) {
            console.error('Error logging out:', err.message || err);
            throw new Error(err.message || 'Failed to log out');
        }
    }
}

const authService = new AuthService();
export default authService;
