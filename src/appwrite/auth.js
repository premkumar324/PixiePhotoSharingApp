import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
            
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method
                return this.login({email, password});
            } else {
               return  userAccount;
            }
        } catch (error) {
            console.error("Appwrite service :: createAccount :: error", error);
            throw error;
        }
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            console.error("Appwrite service :: login :: error", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const user = await this.account.get();
            if (user) {
                // Store user info in localStorage for other components to use
                localStorage.setItem('currentUser', JSON.stringify({
                    $id: user.$id,
                    name: user.name,
                    email: user.email
                }));
            }
            return user;
        } catch (error) {
            console.error("Appwrite service :: getCurrentUser :: error", error);
            return null;
        }
    }

    async getUserPrefs() {
        try {
            return await this.account.getPrefs();
        } catch (error) {
            console.error("Appwrite service :: getUserPrefs :: error", error);
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
            localStorage.removeItem('currentUser'); // Clear stored user info
        } catch (error) {
            console.error("Appwrite service :: logout :: error", error);
            throw error;
        }
    }

    // Get user info from localStorage if it's the current user
    getUserInfo(userId) {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.$id === userId) {
                return currentUser;
            }
            return null;
        } catch (error) {
            console.error("Appwrite service :: getUserInfo :: error", error);
            return null;
        }
    }
}

const authService = new AuthService();

export default authService


