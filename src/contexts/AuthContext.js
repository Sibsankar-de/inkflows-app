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
                        setTimeout(() => {
                            setIsAuthenticated(logStatus)
                        }, 600)
                    })
            } catch (error) {
                // console.log("Auth Error", error);
                setTimeout(() => {
                    setIsAuthenticated(false)
                }, 600)
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
    const [lineLogo, setLineLogo] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setLineLogo(true)
        }, 1000)
        setTimeout(() => {
            setLoading(true)
        }, 3000)
    }, [])
    return (
        <div className='if-document-loading-box'>
            <div className='if-document-loadbox-img-box'>
                <div><img src={require("../assets/img/inkflows-home.png")} alt="" width={lineLogo ? 50 : 100} /></div>
                {lineLogo && <div><img src={require("../assets/img/inkflows-line-logo.png")} alt="" width={200} /></div>}
            </div>
            {loading && <DotSpinner />}
        </div>
    )
}

export default AuthContext
