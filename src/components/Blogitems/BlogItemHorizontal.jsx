import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../configs/axios-configs'
import { formatDate } from '../../utils/functions/convertIsoDateString'
import './blogItem.style.css'

export const BlogItemHorizontal = ({ data }) => {
    const [blogCreator, setBlogCreator] = useState(null)
    useEffect(() => {
        const fetchuser = async () => {
            try {
                await axios.get(`/user/get-by-id/${data?.creator}`)
                    .then((res) => {
                        setBlogCreator(res?.data?.data)
                    })
            } catch (error) {
                console.log(error);
            }
        }
        if (data?.creator) {
            fetchuser()
        }
    }, [data])


    // blog url
    const blogUrl = `/blog/${data?._id}`
    return (
        <div className='if-blog-item-horizontal'>
            <div className='if-blog-item-horz-img-box'>
                <Link className='if-url-normal' to={blogUrl}>
                    <img src={data?.thumbnail || require('../../assets/img/blank-image.png')} alt="" />
                </Link>
            </div>
            <div className='if-blog-item-horz-details-box'>
                <div>
                    <Link className='if-url-normal' to={blogUrl}>
                        <h5 className='mb-0 if-text-max-line-2'>{data?.blogTitle}</h5>
                    </Link>
                </div>
                <div className='d-flex align-items-center gap-1 if-font-s'>
                    <div>
                        <div className="d-flex align-items-center gap-1"><div className="if-like-logo"><i className="ri-thumb-up-fill"></i></div><div><span>{data?.totalLikes}</span></div></div>
                    </div>
                    <div><i className="bi bi-dot"></i></div>
                    <div>
                        {data?.totalViews} reads
                    </div>
                </div>
                <div className='d-flex gap-2 align-items-center mt-2'>
                    <div>
                        <Link className='if-url-normal' to={`/profile/${blogCreator?.userName}`}>
                            <img src={blogCreator?.avatar || require('../../assets/img/profile-img.png')} width={25} alt="" className='if-border-round' />
                        </Link>
                    </div>
                    <div>
                        <Link className='if-url-normal' to={`/profile/${blogCreator?.userName}`}>{blogCreator?.fullName}</Link>
                    </div>
                    <div className='if-col-fade if-font-s if-blog-item-time-p-btm'>
                        <span><i className="bi bi-dot"></i></span>
                        <span>
                            {formatDate(data?.updatedAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
