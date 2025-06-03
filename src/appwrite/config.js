import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage,Query } from 'appwrite'; 
export class Service{
    client=new Client();
    databases;
    bucket;

    constructor(){
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)
        this.databases=new Databases(this.client)
        this.bucket=new Storage(this.client);
    }
    async getPosts(queries=[Query.equal('status','active')]){
        try{
            return await this.databases.listDocuments(conf.appwriteDatabaseId,conf.appwriteCollectionId,queries,)
           
        }catch(err){
            throw err
        }
    }
    async createPost({title,slug,content,featuredImage,status,userID}){
        try{
            return await this.databases.createDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,slug,{title,content,featuredImage,status,userID,})
        }catch(err){
            console.log()
        }
    }
    async updatePost(slug,{title,content,featuredImage,status}){
        try{
            return await this.databases.updateDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,slug,{title,content,featuredImage,status,})
        }catch(err){
            console.log()
        }
    }
    async deletePost(slug){
        try{
            await this.databases.deleteDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,slug)
        }catch(err){
            console.log()
        }
    }
    async getPost(slug){
        try{
            return await this.databases.getDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,slug)
           
        }catch(err){
            console.log()
        }
    }
    // Upload file to bucket
    async uploadFile(file){
        try{
            return await this.bucket.createFile(conf.appwriteBucketId,ID.unique(),file)
        }catch(err){
            console.log()
        }
    }
    async deleteDocumentt(fileId){
        try{
            await this.bucket.deleteFile(conf.appwriteBucketId,fileId)    
            return true;
        }   
       
        catch(err){
            console.log()
        }
    }
    async getFilePreview(fileId){
        try{
            return this.bucket.getFilePreview(conf.appwriteBucketId,fileId)
        }catch(err){
            console.log()
        }
    }

}

const service=new Service()
export default service