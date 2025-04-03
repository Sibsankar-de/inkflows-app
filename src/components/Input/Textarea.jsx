import React, { useEffect, useRef, useState } from 'react'

export const Textarea = ({ placeholder, className, value, onChange }) => {
    const textareaRef = useRef(null);
    const [input, setInput] = useState("")
    useEffect(() => {
        if (value)
            setInput(value);
    }, [value])
    // auto grow text area
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }, [input]);

    // send input
    useEffect(() => {
        onChange(input);
    }, [input]);
    
    return (
        <textarea placeholder={placeholder} className={`if-textarea text-break ${className}`} ref={textareaRef} onChange={e => setInput(e.target.value)} value={input} />
    )
}
