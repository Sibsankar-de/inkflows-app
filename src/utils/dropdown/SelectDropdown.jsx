import React, { useEffect, useState } from 'react'
import "./selectDroDown.style.css"

export const SelectDropdown = ({ children, activeState, className, boxRef }) => {
    const [isActive, setIsActive] = useState(false)
    const [closeAnim, setCloseAnim] = useState(false)
    useEffect(() => {
        if (activeState) {
            setIsActive(activeState)
        }
        else {
            setCloseAnim(true)
            setTimeout(() => {
                setIsActive(false)
                setCloseAnim(false)
            }, 200)
        }
    }, [activeState])

    return (
        isActive && <div className={`if-add-dropdown ${className} ${closeAnim && 'if-add-dropdown-close'}`} ref={boxRef}>
            {children}
        </div>
    )
}
