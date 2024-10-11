import axios from "axios";
import { axiosInstance } from "../axiosInstance";

const baseURL = 'http://192.168.100.110:8080/'

export const validateEmailAvailability = async (body: any) => {
    try {
        const response = await axiosInstance.post(`${baseURL}auth/validateEmailAvailability`, body)
        return response
    } catch (error) {
        return error
    }
}

export const uploadProfile = async (formData: FormData) => {
    try {
        const response = await axiosInstance.post('user/uploadProfile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Upload Profile Error:', error);
        throw error;
    }
};

export const handleSignup = async (body: any) => {
    try {
        const response = await axiosInstance.post('auth/signup', body)
        return response.data
    } catch (error) {
        return error
    }
}

export const handleSignin = async (body: any) => {
    try {
        const response = await axiosInstance.post('auth/signin' , body)        
        return response
    } catch (error:any) {
        return error
    }
}