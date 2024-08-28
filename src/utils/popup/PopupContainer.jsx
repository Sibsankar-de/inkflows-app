import React, { useEffect, useRef, useState } from 'react'
import "./popup.style.css"

export const PopupContainer = ({ children, className = '', activeState = false, pauseDocumentScroll = false, closeOnBackClick = false, onClose = Function }) => {
    const popupRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [closeAnim, setCloseAnim] = useState(false)
    useEffect(() => {
        if (activeState) {
            setOpen(activeState)
        }
        else {
            setCloseAnim(true)
            setTimeout(() => {
                setOpen(false)
                setCloseAnim(false)
            }, 300)
        }
    }, [activeState])

    useEffect(() => {
        const element = document.getElementsByTagName('body')
        if (open && pauseDocumentScroll && document) {
            element[0].style.overflowY = 'hidden'
        }
        else {
            element[0].style.overflowY = 'auto'
        }
    })

    // Close on background click
    useEffect(() => {
        const handleClose = e => {
            if (closeOnBackClick && activeState && !popupRef.current?.contains(e.target) && onClose) {
                onClose()
            }
        }
        document.addEventListener('click', handleClose)
        return () => document.removeEventListener('click', handleClose)
    })

    return (
        open && <div className={`if-popup-container ${closeAnim && 'if-fadeout-anim'}`}>
            <div className={`if-popup-box ${closeAnim && 'if-popup-out-anim'} ${className}`} ref={popupRef} onClick={e=>e.stopPropagation()} >
                {children}
            </div>
        </div>
    )
}
