import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../configs/axios-configs'
import { formatDate } from '../../utils/functions/convertIsoDateString'

export const BlogItemVertical = ({ data }) => {
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
        <div className='if-blog-item-vertical'>
            <div className='if-blog-item-vert-img-box'>
                <Link to={blogUrl} className='if-url-normal'>
                    <img src={data?.thumbnail || require('../../assets/img/blank-image.png')} alt="" />
                </Link>
            </div>
            <div className='if-blog-item-vert-des-box'>
                <div className='mb-2'>
                    <Link to={blogUrl} className='if-url-normal'>
                        <h5 className='mb-0 if-text-max-line-2'>{data?.blogTitle}</h5>
                    </Link>
                </div>
                <div className='d-flex align-items-center gap-1 if-font-s mb-2'>
                    <div>
                        {data?.totalViews} reads
                    </div>
                    <div><i className="bi bi-dot"></i></div>
                    <div>
                        <div className="d-flex align-items-center gap-1"><div className="if-like-logo"><i className="ri-thumb-up-fill"></i></div><div><span>{data?.totalLikes}</span></div></div>
                    </div>
                </div>
                <div className='d-flex gap-2 align-items-center mt-2 if-font-s'>
                    <div>
                        <img src={blogCreator?.avatar || require('../../assets/img/profile-img.png')} width={25} alt="" className='if-border-round' />
                    </div>
                    <div>{blogCreator?.fullName}</div>
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
