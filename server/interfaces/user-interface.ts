import { Document } from 'mongoose';

export interface IUser extends Document{
    
    user: string,
    firstName: string,
    lastName: string,
    password:string, 
    email:string,
    age: Date,
    bio?:string,
    picture?:string

}