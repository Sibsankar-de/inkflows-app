import React from 'react'

export const BlogLoadBox = ({className=''}) => {
    return (
        <div className={`if-blog-load-box ${className}`}>
            <div className='if-blog-load-box-s1 loadbox-anim'></div>
            <div className='if-blog-load-box-s2'>
                <div className='if-blog-load-box-s2-p1 loadbox-anim'></div>
                <div className='if-blog-load-box-s2-p2 loadbox-anim'></div>
                <div className='if-blog-load-box-s2-p3 loadbox-anim'></div>
                <div className='if-blog-load-box-s2-p4'>
                    <div className='if-blog-load-box-s2-p4-l1 loadbox-anim'></div>
                    <div className='if-blog-load-box-s2-p4-l2 loadbox-anim'></div>
                </div>
            </div>
        </div>
    )
}
