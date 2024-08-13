import React from 'react'
import errorSvg from "../../assets/svg/error-page.svg"
import "./errorPage.style.css"

export const ErrorPage = () => {
    return (
        <div className='container if-errorpage-container'>
            <div className='if-errorpage-img-box'>
                <img src={errorSvg} alt=" " />
            </div>
            <div className='text-center'>
                <h1>OOps!</h1>
                <h6>Unable to find your browse</h6>
            </div>
        </div>
    )
}
