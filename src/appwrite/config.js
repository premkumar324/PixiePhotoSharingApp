import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async getUser(userId) {
        try {
            const response = await fetch(`${conf.appwriteUrl}/users/${userId}`, {
                method: 'GET',
                headers: {
                    'X-Appwrite-Project': conf.appwriteProjectId,
                    'X-Appwrite-Key': import.meta.env.VITE_APPWRITE_API_KEY,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error("Appwrite service :: getUser :: error", error);
            return null;
        }
    }

    async createPost({title, slug, content, featuredimage, status, userid}){
        try {
            if (!title || !slug || !content || !featuredimage || !status || !userid) {
                throw new Error("Missing required fields");
            }
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status,
                    userid,
                }
            )
        } catch (error) {
            console.error("Appwrite service :: createPost :: error", error);
            throw error;
        }
    }

    async updatePost(slug, {title, content, featuredimage, status}){
        try {
            if (!slug) {
                throw new Error("Slug is required for updating post");
            }
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status,
                }
            )
        } catch (error) {
            console.error("Appwrite service :: updatePost :: error", error);
            throw error;
        }
    }

    async deletePost(slug){
        try {
            if (!slug) {
                throw new Error("Slug is required for deleting post");
            }
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.error("Appwrite service :: deletePost :: error", error);
            throw error;
        }
    }

    async getPost(slug){
        try {
            if (!slug) {
                throw new Error("Slug is required to get post");
            }
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.error("Appwrite service :: getPost :: error", error);
            throw error;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )
        } catch (error) {
            console.error("Appwrite service :: getPosts :: error", error);
            throw error;
        }
    }

    async uploadFile(file, progressCallback = null){
        try {
            if (!file) {
                throw new Error("File is required for upload");
            }
            
            console.log("Uploading file:", file.name, "Size:", file.size, "Type:", file.type);
            
            // Create a unique ID for the file
            const fileId = ID.unique();
            
            // Set up the upload with progress tracking
            const uploadPromise = this.bucket.createFile(
                conf.appwriteBucketId,
                fileId,
                file,
                ['read("any")'],
                // Progress callback
                progressCallback ? (progress) => {
                    // Calculate percentage based on chunks
                    const percentage = (progress.chunksUploaded / progress.chunksTotal) * 100;
                    progressCallback(percentage);
                } : undefined
            );
            
            // Wait for the upload to complete
            const result = await uploadPromise;
            console.log("File uploaded successfully. File ID:", result.$id);
            return result;
        } catch (error) {
            console.error("Appwrite service :: uploadFile :: error", error);
            throw error;
        }
    }

    async deleteFile(fileId){
        try {
            if (!fileId) {
                throw new Error("File ID is required for deletion");
            }
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.error("Appwrite service :: deleteFile :: error", error);
            throw error;
        }
    }

    getFilePreview(fileId){
        if (!fileId) {
            throw new Error("File ID is required for preview");
        }
        return this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId
        )
    }
}

const service = new Service()
export default service