import { toast } from "react-toastify"
import axios from "../../configs/axios-configs"

export const handleSaveBlog = async (blogId) => {
    try {
        await axios.post(`/blog/add-savelist/${blogId}`)
            .then(() => {
                toast.success("Blog added to saved list")
            })
    } catch (error) {
        // console.log(error);
        error?.response?.status === 402 && toast.warn("Blog has already saved")
    }
}

export const handleRemoveSaveBlog = async (blogId) => {
    try {
        await axios.post(`/blog/remove-savelist/${blogId}`)
            .then(() => {
                toast.success("Blog removed from saved list")
            })
    } catch (error) {
        // console.log(error);
        error?.response?.status === 402 && toast.warn("Blog already removed")
    }
}