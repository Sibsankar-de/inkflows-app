import React, { useContext } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import { ErrorPage } from '../pages/errorpage/ErrorPage.jsx'
import AuthContext from '../contexts/AuthContext.js'


export const PrivateRouter = ({ element, ...rest }) => {
    const { isAuthenticated } = useContext(AuthContext)

    if (isAuthenticated) {
        return element
    } else  {
        return <Navigate to="/auth/login" />
    }
}
