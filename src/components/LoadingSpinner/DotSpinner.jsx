import React from 'react'

export const DotSpinner = ({ width=20 }) => {
    return (
        <div className="sk-chase" style={{ width: width, height: width }}>
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
        </div>
    )
}
