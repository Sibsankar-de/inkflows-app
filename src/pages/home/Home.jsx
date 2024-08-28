import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BlogLoadBox } from '../../components/LoadBoxes/BlogLoadBox'
import axios from '../../configs/axios-configs'
import { handleRemoveLike } from '../../utils/api-functions/likeBtnHandlers'
import { handleRemoveSaveBlog, handleSaveBlog } from '../../utils/api-functions/saveBtnHandler'
import { handleShare } from '../../utils/api-functions/shareBtnHandler'
import { formatDate } from '../../utils/functions/convertIsoDateString'
import './home.style.css'

export const Home = () => {

    // fetch blog list
    const [blogList, setBlogList] = useState(null)
    useEffect(() => {
        const fetchBlogList = async () => {
            try {
                await axios.get('/blog/get-bloglist')
                    .then(res => {
                        setBlogList(res?.data?.data)
                    })
            } catch (error) {
                console.log(error);
            }
        }

        fetchBlogList()
    }, [])

    
    // handle page title
    useEffect(() => {
        document.title = "Inkflows - Where Ideas Take Shape and Stories Unfold"
    }, [])

    return (
        <div className='container'>
            <div className='if-home-content-box'>
                <ul className='if-bolg-items-container'>
                    {
                        blogList?.map((item, index) => {
                            return <BlogItem key={index} data={item} />
                        })
                    }
                    {
                        blogList === null &&
                        new Array(3).fill(null).map((_, index) => {
                            return <BlogLoadBox className='if-blog-item' key={index} />
                        })
                    }
                </ul>
                {blogList !== null &&
                    <div className='d-flex align-items-center flex-column my-5'>
                        <h6>All caught up!</h6>
                        <button className="if-btn-2" onClick={() => window.location.reload()}>Refresh</button>
                    </div>
                }
            </div>
        </div>
    )
}

const BlogItem = ({ data }) => {

    // fetch blog creator
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

    // Save btn handler
    const [blogSave, setBlogSave] = useState(false)
    useEffect(() => {
        const fetchBlogIdList = async () => {
            try {
                await axios.get('/blog/savedblogId-list')
                    .then((res) => {
                        const idList = res?.data?.data?.blogIdList
                        if (idList?.includes(data?._id)) {
                            setBlogSave(true)
                        }
                    })
            } catch (error) {
                console.log(error);
            }
        }
        fetchBlogIdList()
    }, [data])

    const saveBtnHandler = async () => {
        if (!blogSave) {
            await handleSaveBlog(data?._id)
            setBlogSave(true)
        } else {
            await handleRemoveSaveBlog(data?._id)
            setBlogSave(false)
        }
    }

    // Share btn handler
    const shareBtnHandler = async () => {
        await handleShare(data?.blogTitle, `Read this blog on Inkflows`, window?.location.href)
    }

    return (
        <li className='if-blog-item'>
            <div className='if-blog-item-img-box'>
                <Link className='if-url-normal' to={`/blog/${data?._id}`}>
                    <img src={data?.thumbnail || require('../../assets/img/blank-image.png')} alt="" />
                </Link>
                <div className='if-home-cont-user-btn-box-und-img'>
                    <div><button className='if-btn' onClick={saveBtnHandler} ><i className={blogSave ? "ri-heart-add-2-fill fs-5" : "ri-heart-add-2-line fs-5"}></i></button></div>
                    <div><button className='if-btn' onClick={shareBtnHandler} ><i className="ri-share-forward-line fs-5"></i></button></div>
                </div>
            </div>
            <div className='if-blog-details-box'>
                <div>
                    <div>
                        <div>
                            <Link className='if-url-normal' to={`/blog/${data?._id}`}>
                                <h5 className='poppins-bold if-text-max-line-2'>{data?.blogTitle}</h5>
                            </Link>
                        </div>
                        <div className='if-font-s'>
                            <span className='if-col-fade'>{formatDate(data?.updatedAt)}</span>
                            <span><i className="bi bi-dot mx-2"></i></span>
                            <span className='if-col-blue'>public</span>
                        </div>
                    </div>
                </div>
                <div className='d-flex align-items-center'>
                    <div>
                        <span>{data?.totalViews} reads</span>
                    </div>
                    <div><span><i className="bi bi-dot"></i></span></div>
                    <div className='d-flex align-items-center gap-1'>
                        <div className='if-like-logo'><i className="ri-thumb-up-fill"></i></div>
                        <div><span>{data?.totalLikes}</span></div>
                    </div>
                </div>
                <div className='if-blog-upload-des-box'>
                    <Link className='if-url-normal' to={`/profile/${blogCreator?.userName}`}>
                        <div className='d-flex align-items-center gap-2 c-pointer'>
                            <div><img src={blogCreator?.avatar || require('../../assets/img/profile-img.png')} alt="" width={30} className="if-border-round" /></div>
                            <div>{blogCreator?.fullName}</div>
                        </div>
                    </Link>
                    <div className='if-home-cont-user-btn-box'>
                        <div><button className='if-btn' onClick={saveBtnHandler} ><i className={blogSave ? "ri-heart-add-2-fill fs-5" : "ri-heart-add-2-line fs-5"}></i></button></div>
                        <div><button className='if-btn' onClick={shareBtnHandler}><i className="ri-share-forward-line fs-5"></i></button></div>
                    </div>

                </div>

            </div>
        </li>
    )
}
