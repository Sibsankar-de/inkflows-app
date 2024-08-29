import { useEffect, useState } from "react"
import axios from "../configs/axios-configs"

export const useCurrentUser = () => {
    const [userData, setUserData] = useState(null)
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                axios.get('/user/current-user')
                    .then(res => setUserData(res.data?.data))
                    .catch(err => {
                        // console.log((err))
                    })
            } catch (error) {
                // console.log(error);
            }
        }
        fetchCurrentUser()
    }, [])

    return userData
}