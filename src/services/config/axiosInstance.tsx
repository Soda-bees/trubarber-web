import axios from 'axios';

const baseURL = 'http://192.168.100.110:8080/'

const axiosInstance = axios.create({
    baseURL, 
    timeout: 10000,                            
    headers: {
        'Content-Type': 'application/json',      
    },
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const errorData = {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
                message: error.response.data?.message || 'Something went wrong',
            };
            console.error('Error Data:', errorData);
            return Promise.reject(errorData); 
        } else if (error.request) {
            console.error('No Response Received:', error.request);
            return Promise.reject({ message: 'No response from server', request: error.request });
        } else {
            console.error('Request Setup Error:', error.message);
            return Promise.reject({ message: error.message });
        }
    }
);

export { axiosInstance, baseURL };