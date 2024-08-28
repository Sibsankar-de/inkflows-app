import axios from "../../configs/axios-configs"

export const handleLike = async (blogId) => {
    try {
        await axios.post('/blog/create-like', { blogId })
    } catch (error) {
        console.log(error);

    }
}

export const handleRemoveLike = async (blogId) => {
    try {
        await axios.post('/blog/remove-like', { blogId })
    } catch (error) {
        console.log(error);
    }
}