import { toast } from "react-toastify"
import axios from "../../configs/axios-configs"

export const handleFollow = async (userId, userName = '') => {
    let loading = true
    try {
        await axios.post('/user/create-follow', { followingTo: userId })
            .then(() => {
                loading = false
                toast.success(`You are now following ${userName}`)
            })

    } catch (error) {
        // console.log(error);
        loading = false
    }

    return loading
}

export const handleUnFollow = async (userId, userName = '') => {
    let loading = true
    try {
        await axios.post('/user/remove-follow', { followingTo: userId })
            .then(() => {
                loading = false
                toast.success(`You unfollowed ${userName}`)
            })

    } catch (error) {
        // console.log(error);
        loading = false
    }
}