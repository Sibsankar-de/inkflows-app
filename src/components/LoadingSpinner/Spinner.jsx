import React from 'react'
import './spinner.style.css'

export const Spinner = ({ width = 20 }) => {
    return (
        <div className="loader" style={{ width: width, height: width }}></div>
    )
}
