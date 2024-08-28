import { useState, useEffect } from "react"

export const useScrollDirection = () => {
    const [scrollUp, setScrollUp] = useState(false)

    let initScroll = 0

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY - initScroll > 0) {
                setScrollUp(true)
            }
            else {
                setScrollUp(false)
            }

            initScroll = window.scrollY
        }

        document.addEventListener('scroll', handleScroll)
        return () => document.removeEventListener('scroll', handleScroll)
    }, [])

    return scrollUp
}