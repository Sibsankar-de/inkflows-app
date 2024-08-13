import React from 'react'
import "./loadBox.style.css"

export const ProfileLoadBox = ({ fullProfile = true }) => {
    return (
        <div className='if-profile-load-box'>
            <div className='if-profile-load-box-l1 loadbox-anim'></div>
            <div className='if-profile-load-box-l2 loadbox-anim'></div>
            {fullProfile && <>
                <div className='if-profile-load-box-l3 loadbox-anim'></div>
                <div className='if-profile-load-box-l4 loadbox-anim'></div>
            </>
            }
        </div>
    )
}

export const ProfileLoadBoxSmall = ()=>{
    return(
        <div className='if-profile-load-box-sm'>
            <div className='if-profile-load-box-sm-s1 loadbox-anim'></div>
            <div className='if-profile-load-box-sm-s2 loadbox-anim'></div>
        </div>
    )
}
