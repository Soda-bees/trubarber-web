import axios from "axios";
import { axiosInstance } from "../axiosInstance";
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

export const validateEmailAvailability = async (body: any) => {
    try {
        const response = await axiosInstance.post(`auth/validateEmailAvailability`, body)
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
        const response = await axiosInstance.post('auth/signin', body)
        return response
    } catch (error: any) {
        return error
    }
}

export const getAllBarbers = async () => {
    try {
        const response = await axiosInstance.get('user/allBarber')
        return response
    } catch (error) {
        return error
    }
}

export const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
        console.log("GOOGLE_MAPS_API_KEY", GOOGLE_MAPS_API_KEY);

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
        );
        if (response.data.status === 'OK') {
            const fullAddress = response.data.results[0].formatted_address;
            return fullAddress;
        } else {
            console.log('Error fetching address:', response.data.status);
        }
    } catch (error) {
        console.log('Error in geocoding:', error);
    }
};

export const createChatRoom = async (token: any, body: any) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const response = await axiosInstance.post('user/createChatRoom', body, { headers })
        return response
    } catch (error) {
        return error
    }
}

export const updateReviewApi = async (token: any, body: any) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const response = await axiosInstance.post('user/updateReview', body, { headers })
        return response?.data
    } catch (error) {
        return error
    }
}

export const postReview = async (token: any, body: any) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const response = await axiosInstance.post('user/postReview', body, { headers })
        return response?.data
    } catch (error) {
        return error
    }
}

export const deleteReviewApi = async (token: any, reviewId: any) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const response = await axiosInstance.post(`user/deleteReview/${reviewId}`, {}, { headers })
        return response?.data
    } catch (error) {
        return error
    }
}

export const addFavorite = async (token: any, body: any) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const response = await axiosInstance.post('user/addFavourite', body, { headers })
        return response?.data
    } catch (error) {
        return error
    }
}

export const handleGetBookAppointment = async (token: any, id: any) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const response = await axiosInstance.get(`user/getBookedAppoinmentTime/${id}`, { headers })
        return response
    } catch (error) {
        return error
    }
}

