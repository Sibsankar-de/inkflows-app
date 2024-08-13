import React from 'react'
import { useState, useEffect, createContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { DotSpinner } from '../components/LoadingSpinner/DotSpinner';
import axios from '../configs/axios-configs';

const AuthContext = createContext()




export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(null);
    useEffect(() => {
        const handleAuth = async () => {
            try {
                await axios.get('/user/check-auth')
                    .then(res => {
                        const logStatus = res.data?.data?.isAuthenticated
                        setIsAuthenticated(logStatus)
                    })
            } catch (error) {
                console.log("Auth Error", error);
                setIsAuthenticated(false)
            }
        }
        handleAuth()
    }, [])


    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {
                isAuthenticated === null ?
                    <LoadingComp /> :
                    children
            }
        </AuthContext.Provider>
    )
}

const LoadingComp = () => {
    return (
        <div className='if-document-loading-box'>
            <DotSpinner width={50} />
        </div>
    )
}

export default AuthContext
