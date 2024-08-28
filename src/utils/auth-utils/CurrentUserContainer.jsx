import React from 'react'
import { useCurrentUser } from '../../hooks/get-currentuser'

export const CurrentUserContainer = ({ children, userName }) => {
    const currentUser = useCurrentUser()

    if (currentUser?.userName === userName) {
        return <>{children}</>
    } else return null
}
