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