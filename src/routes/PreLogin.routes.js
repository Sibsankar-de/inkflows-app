import React from 'react'
import AuthContext from '../contexts/AuthContext'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'

export const PreLoginRouter = ({ element, ...rest }) => {
    const { isAuthenticated } = useContext(AuthContext)

    if (!isAuthenticated) {
        return element
    } else {
        return <Navigate to="/home" />
    }
}
