import React, { useEffect, useRef, useState } from 'react'
import "./dropdown.style.css"

export const Dropdown = ({ openState, children, className = '', closeOnBackClick = false, onClose, closeOnScroll = false }) => {
    const [open, setOpen] = useState(false);

    // Handle dropdown close
    const [closeAnim, setCloseAnim] = useState(false);
    useEffect(() => {
        if (openState) setOpen(true);
        else {
            setCloseAnim(true);
            setTimeout(() => {
                setOpen(false);
                setCloseAnim(false);
            }, 350);
        }
    }, [openState])

    // Handle close on back click
    const boxRef = useRef(null);
    useEffect(() => {
        const handleClose = (e) => {
            if (closeOnBackClick && open && !boxRef.current?.contains(e.target)) {
                onClose();
            }
        }

        document.addEventListener("click", handleClose);
        if (closeOnScroll) {
            document.addEventListener("scroll", () => onClose());
        }
    });

    return (
        open && <div className={`if-dropdown-box ${closeAnim && 'if-ddown-close-anim'} ${className}`} onClick={e => e.stopPropagation()}>
            {children}
        </div>
    )
}
