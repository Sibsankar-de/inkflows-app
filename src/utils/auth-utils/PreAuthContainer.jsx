import React, { useContext } from 'react'
import AuthContext from '../../contexts/AuthContext'

export const PreAuthContainer = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext)
    if (!isAuthenticated) {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        )
    } else {
        return null
    }
}
