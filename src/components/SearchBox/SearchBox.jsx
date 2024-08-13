import React, { useEffect, useRef, useState } from 'react'
import { closeOnBackClick } from '../../utils/functions/closeOnBackClick'
import "./searchbox.style.css"

export const SearchBox = ({ openState, onClose }) => {
    const [open, setOpen] = useState(false)
    const [close, setClose] = useState(false)
    useEffect(() => {
        if (openState) {
            setOpen(openState)
        }
        else {
            setClose(true)
            setTimeout(() => {
                setOpen(false)
                setClose(false)
            }, 200)
        }
    }, [openState])

    const boxRef = useRef(null)
    useEffect(() => {
        closeOnBackClick(open, boxRef, () => onClose())
        document.getElementsByTagName('body')[0].style.overflowY = open ? 'hidden' : 'auto'
    })

    return (
        open && <div className={`if-search-box-container if-fadein-anim ${close ? 'if-fadeout-anim' : ''}`}>
            <div className='if-search-box' ref={boxRef} onClick={e => e.stopPropagation()} >
                <div>
                    <h6>Recomended Searches</h6>
                </div>

            </div>
        </div>
    )
}
