import React, { useEffect, useRef, useState } from 'react'
import "./input.style.css"

export const PopInput = ({ className = '', placeholder = '', value = '', onChange, options = {}, type = 'text' }) => {

    const id = 'input' + Math.random() * 100
    const [inputWidth, setInputWidth] = useState(0)
    const inputRef = useRef(null)
    useEffect(() => {
        const width = inputRef?.current.clientWidth
        setInputWidth(width)
    }, [window, inputRef])

    const [focusState, setFocusState] = useState(false);
    const [input, setInput] = useState(value)

    const focusHandler = () => {
        setFocusState(true);
    }

    const blurHandler = () => {
        if (input.length === 0 && focusState) {
            setFocusState(false)
        }

    }

    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (onChange) {
            onChange(input)
        }
    }, [input])

    return (
        <div className='if-pop-input-box'>
            <input type={showPassword ? 'text' : type} className={`if-pop-input ${className}`} id={id} ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onFocus={focusHandler} onBlur={blurHandler} {...options} />
            <label htmlFor={id} className={`if-pop-input-placeholder ${focusState && 'if-input-focused-pholder'}`} >{placeholder}</label>
            {type === 'password' && <div className='if-eye-btn' onClick={() => setShowPassword(!showPassword)}>{!showPassword ? <i className="ri-eye-close-line"></i> : <i className="ri-eye-line"></i>}</div>}
        </div>
    )
}
