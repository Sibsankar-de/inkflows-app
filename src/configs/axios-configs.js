import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = `${process.env.REACT_APP_PROXY_URL}/api/v1`
const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: baseUrl
})

axiosInstance.interceptors.response.use(
    response => { return response },
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                await axios.get(`${baseUrl}/user/refresh-token`, {}, {
                    withCredentials: true,
                });
                return axiosInstance(originalRequest);
            } catch (e) {
                // Handle token refresh failure
                console.error('Refresh token failed', e);
                await axios.get(`${baseUrl}/user/logout-user`)
            }
        }
        else if (!error.response) {
            console.log(error)
            toast.error("Network is not connected")
        }
        return Promise.reject(error);
    }
)

export default axiosInstance