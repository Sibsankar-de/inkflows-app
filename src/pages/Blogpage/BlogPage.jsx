import React, { useContext, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from "swiper/modules"
import { BlogViewer } from '../../components/Blogviewer/BlogViewer'
import "./blogpage.style.css"
import { useScrollDirection } from '../../hooks/detect-scroll-dir'
import { BlogItemHorizontal } from '../../components/Blogitems/BlogItemHorizontal'
import { BlogItemVertical } from '../../components/Blogitems/BlogItemVertical'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from '../../configs/axios-configs'
import { formatDate } from '../../utils/functions/convertIsoDateString'
import { handleRemoveSaveBlog, handleSaveBlog } from '../../utils/api-functions/saveBtnHandler'
import { handleFollow, handleUnFollow } from '../../utils/api-functions/followBtnHandler'
import { DotSpinner } from '../../components/LoadingSpinner/DotSpinner'
import { useCurrentUser } from '../../hooks/get-currentuser'
import { handleLike, handleRemoveLike } from '../../utils/api-functions/likeBtnHandlers'
import { handleShare } from '../../utils/api-functions/shareBtnHandler'
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from 'react-share'
import AuthContext from '../../contexts/AuthContext'
import { Tooltip } from 'react-tooltip'
import { ProfileLoadBoxSmall } from '../../components/LoadBoxes/ProfileLoadBox'

export const BlogPage = () => {
    const suggestionSlideOptions = {
        slidesPerView: 3,
        spaceBetween: 20,
        modules: [Navigation],
    }

    const navigate = useNavigate()

    // get user signin
    const { isAuthenticated } = useContext(AuthContext)

    // get blogid from params
    const params = useParams()
    const blogId = params.blogId

    // Fetch blog from id
    const [blog, setBlog] = useState(null)
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                await axios.get(`/blog/get-blog/${blogId}`)
                    .then(res => {
                        setBlog(res?.data?.data)
                    })
            } catch (error) {
                console.log(error);
                navigate("*")
            }
        }
        if (blogId) fetchBlog()
    }, [blogId])

    // Fetch current user
    const currentUser = useCurrentUser();

    // Fetch user details
    const [blogCreator, setBlogCreator] = useState(null)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                await axios.get(`/user/get-by-id/${blog?.creator}`)
                    .then(res => setBlogCreator(res?.data?.data))
            } catch (error) {
                console.log(error);
            }
        }

        if (blog?.creator) fetchUser()
    }, [blog])

    // Handle Views add
    useEffect(() => {
        const addViews = async () => {
            try {
                await axios.post('/blog/add-views', { blogId })
                    .then(() => console.log("Views added"))
            } catch (error) {
                console.log(error);
            }
        }
        // adds views 9sec after view the blog
        if (isAuthenticated && blogId) setTimeout(() => addViews(), 9000)
    }, [blogId, isAuthenticated])


    // Like Functions
    // Check liked or not
    const [isLiked, setIsLiked] = useState(false)
    useEffect(() => {
        const fetchLike = async () => {
            try {
                await axios.get(`/blog/check-like/${blogId}`)
                    .then((res) => setIsLiked(res?.data?.data?.isLiked))
            } catch (error) {
                console.log(error);
            }
        }

        if (blogId) fetchLike()
    }, [blogId])

    // Like counts
    const [likeCount, setLikeCount] = useState(0)
    useEffect(() => {
        setLikeCount(blog?.totalLikes)
    }, [blog])

    // Like btn handler
    const likeBtnHandler = async () => {
        if (!isLiked) {
            await handleLike(blogId)
            setIsLiked(true)
            setLikeCount(likeCount + 1)
        } else {
            await handleRemoveLike(blogId)
            setIsLiked(false)
            setLikeCount(likeCount - 1)
        }
    }

    // Save btn handler
    const [blogSave, setBlogSave] = useState(false)
    useEffect(() => {
        const fetchBlogIdList = async () => {
            try {
                await axios.get('/blog/savedblogId-list')
                    .then((res) => {
                        const idList = res?.data?.data?.blogIdList
                        if (idList?.includes(blogId)) {
                            setBlogSave(true)
                        }
                    })
            } catch (error) {
                console.log(error);

            }
        }
        fetchBlogIdList()
    }, [blogId])

    const saveBtnHandler = async () => {
        if (!blogSave) {
            await handleSaveBlog(blogId)
            setBlogSave(true)
        } else {
            await handleRemoveSaveBlog(blogId)
            setBlogSave(false)
        }
    }

    // Share btn handler
    const shareBtnHandler = async () => {
        await handleShare(blog?.blogTitle, `Read this blog on Inkflows`, window?.location.href)
    }

    // User follow btn handler
    // checks following or not
    const [isFollowing, setIsFollowing] = useState(false)
    useEffect(() => {
        const checkFollow = async () => {
            if (blogCreator?._id !== undefined) {
                try {
                    await axios.get(`/user/check-follow/${blogCreator?._id}`)
                        .then(res => setIsFollowing(res?.data?.data?.isFollowed))
                } catch (error) {
                    console.log(error);
                }
            }
        }
        checkFollow()
    }, [blogCreator])

    // Handle follow and unfollow
    const [followLoader, setFollowLoader] = useState(false)
    const followBtnHandler = async () => {
        if (!isFollowing) {
            const loader = await handleFollow(blogCreator?._id, blogCreator?.userName)
            setFollowLoader(loader)
            setIsFollowing(true)
        } else {
            const loader = await handleUnFollow(blogCreator?._id, blogCreator?.userName)
            setFollowLoader(loader)
            setIsFollowing(false)
        }
    }

    // Fetch more blogs from creator
    const [creatorBlogList, setCreatorBlogList] = useState(null)
    useEffect(() => {
        const fetchBlogList = async () => {
            try {
                await axios.get(`/blog/user-bloglist?userName=${blogCreator?.userName}&blogType=public`)
                    .then((res) => {
                        setCreatorBlogList(res?.data?.data)
                    })
            } catch (error) {
                console.log(error);
            }
        }
        if (blogCreator) fetchBlogList()
    }, [blogCreator])

    // removes current blog from list
    useEffect(() => {
        if (creatorBlogList?.some(e => e?._id === blogId)) {
            setCreatorBlogList(creatorBlogList?.filter(e => {
                return e?._id !== blogId
            }))
        }
    }, [creatorBlogList])

    // Fetch suggested blog list
    const [suggBlogList, setSuggBlogList] = useState(null)
    useEffect(() => {
        const fetchBlogList = async () => {
            try {
                await axios.get('/blog/get-bloglist')
                    .then(res => {
                        setSuggBlogList(res?.data?.data)
                    })
            } catch (error) {
                console.log(error);
            }
        }

        fetchBlogList()
    }, [])

    // Handle show more btn
    const [suggLimit, setSugglimit] = useState(4)

    // Handle next blog
    const [nextBlog, setNextBlog] = useState(null)
    useEffect(() => {
        if (creatorBlogList?.length > 0) {
            setNextBlog(creatorBlogList[0])
        }
        else if (suggBlogList?.length > 0) {
            setNextBlog(suggBlogList[0])
        }
    }, [creatorBlogList, suggBlogList])

    return (
        <div className='container if-blog-container'>
            <section className='if-blog-section if-blog-section-width'>
                <div className='if-blog-top-user-sec'>
                    {blogCreator ?
                        <div className='if-blog-short-user-det-box'>
                            <div>
                                <Link to={`/profile/${blogCreator?.userName}`} className='if-url-normal'>
                                    <img src={blogCreator?.avatar || require('../../assets/img/profile-img.png')} alt="" className='if-border-round' />
                                </Link>
                            </div>
                            <div>
                                <span className='if-font-m'>
                                    <Link to={`/profile/${blogCreator?.userName}`} className='if-url-normal'>
                                        {blogCreator?.fullName}
                                    </Link>
                                </span>
                                <span className='if-col-fade if-font-s mx-2'><i className="bi bi-dot"></i></span>
                                <span className='if-col-fade if-font-s' data-tooltip-id='if-blog-page-tooltip' data-tooltip-place='bottom' data-tooltip-content={`Last updated at - ${formatDate(blog?.updatedAt)}`}>{formatDate(blog?.updatedAt)}</span>
                            </div>
                        </div>
                        : <ProfileLoadBoxSmall />
                    }
                    <div className='if-blog-btn-box'>
                        <div className='d-flex align-items-center'>
                            <button className="if-btn" onClick={likeBtnHandler}>
                                {!isLiked ? <i className="ri-thumb-up-line"></i>
                                    : <div class="if-like-logo"><i class="ri-thumb-up-fill"></i></div>}
                            </button>
                            <span>{likeCount}</span>
                        </div>
                        <div>
                            <button className="if-btn" onClick={saveBtnHandler}>
                                <i className={blogSave ? "ri-heart-add-2-fill" : "ri-heart-add-2-line"}></i>
                            </button>
                        </div>
                        <div>
                            <button className="if-btn" onClick={shareBtnHandler}>
                                <i className="ri-share-forward-line"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <BlogViewer blogData={blog} />
                </div>
                <div className='mb-5'>
                    <div className='mb-3'>
                        <h5>Share on</h5>
                    </div>
                    <div className='d-flex gap-3'>
                        <FacebookShareButton url={window?.location.href} title={blog?.blogTitle}>
                            <FacebookIcon size={40} round />
                        </FacebookShareButton>
                        <WhatsappShareButton url={window?.location.href} title={blog?.blogTitle}>
                            <WhatsappIcon size={40} round />
                        </WhatsappShareButton>
                        <TwitterShareButton url={window?.location.href} title={blog?.blogTitle}>
                            <XIcon size={40} round />
                        </TwitterShareButton>
                        <LinkedinShareButton url={window?.location.href} title={blog?.blogTitle}>
                            <LinkedinIcon size={40} round />
                        </LinkedinShareButton>
                    </div>
                </div>
            </section>
            <section className='if-blog-user-section'>
                <div className='if-blog-user-sec-content if-blog-section-width'>
                    <div>
                        <div className='mb-4'>
                            <h4>Writer</h4>
                        </div>
                        <div className='if-blog-user-details-box'>
                            <div>
                                <Link to={`/profile/${blogCreator?.userName}`} className='if-url-normal'>
                                    <img className='if-border-round' src={blogCreator?.avatar || require('../../assets/img/profile-img.png')} alt="" />
                                </Link>
                            </div>
                            <div className='d-grid gap-3'>
                                <div>
                                    <div className='if-profile-user-name-para'>
                                        <Link to={`/profile/${blogCreator?.userName}`} className='if-url-normal'>{blogCreator?.fullName}
                                        </Link>
                                    </div>
                                    <div>{blogCreator?.userName}</div>
                                </div>
                                {currentUser?._id !== blogCreator?._id &&
                                    <div>
                                        {!isFollowing ?
                                            <button className="if-btn-2 if-btn-blue--grad" onClick={followBtnHandler} disabled={followLoader}>
                                                {followLoader && <DotSpinner />}
                                                <span>Follow</span>
                                                <span><i className="ri-user-add-line"></i></span>
                                            </button> :
                                            <button className="if-btn-2 if-marked-btn if-btn-br-blue rounded-5" onClick={followBtnHandler} disabled={followLoader}>
                                                {followLoader && <DotSpinner />}
                                                <span>Following</span>
                                                <span><i class="ri-user-follow-line"></i></span>
                                            </button>
                                        }
                                    </div>}
                            </div>
                        </div>
                    </div>
                    {creatorBlogList?.length > 0 &&
                        <div>
                            <div className='mb-5'>
                                <h4>More from Writer</h4>
                            </div>
                            <div>
                                <ul className="if-blog-user-seggestion-box">
                                    <Swiper {...suggestionSlideOptions} navigation className='if-blog-user-seggestion-list' >
                                        {
                                            creatorBlogList?.map((item, index) => {
                                                return (
                                                    <SwiperSlide className='if-blog-user-seggestion-slide-item' key={index}>
                                                        <BlogItemVertical data={item} />
                                                    </SwiperSlide>
                                                )
                                            })
                                        }

                                    </Swiper>
                                </ul>
                            </div>
                        </div>
                    }
                </div>
            </section>
            <section className='if-blog-section-width'>
                <div className='mb-5'>
                    <h4>Suggested For you</h4>
                </div>
                <div>
                    <ul className='if-blog-more-sugg-item-list'>
                        {
                            suggBlogList?.map((item, index) => {
                                return index <= suggLimit && <BlogItemHorizontal key={index} data={item} />
                            })
                        }

                        {suggBlogList?.length > 4 && <div className='if-blog-sugg-s-more-btn-box'>
                            <button className="if-btn-2 if-btn-purple--grad" onClick={() => setSugglimit(7)}><span>Show more</span><span><i className="ri-arrow-down-s-line"></i></span></button>
                        </div>}
                    </ul>
                </div>
            </section>
            <section className='my-5' >
                {nextBlog && <NextBlogSection blog={nextBlog} />}
            </section>
            <BlogShortNav
                onLikeClick={likeBtnHandler}
                onSaveClick={saveBtnHandler}
                onShareClick={shareBtnHandler}
                options={
                    {
                        isLiked,
                        isSaved: blogSave,
                        likeCount
                    }
                }
            />
            <section className='if-blog-footer text-center if-col-fade'>
                &copy;Inkflows 2024. All rights are reserved.
            </section>
            <Tooltip id='if-blog-page-tooltip' />
        </div>
    )
}

const BlogShortNav = ({ options, onLikeClick, onSaveClick, onShareClick }) => {
    const scrollUp = useScrollDirection();
    const [showBox, setShowBox] = useState(false)
    useEffect(() => {
        const topSkipHight = document.getElementsByClassName('if-blog-top-user-sec')[0].clientHeight
        const maxHeight = document.getElementsByClassName('if-blog-section')[0].clientHeight
        const handleScroll = () => {
            const scroll = window.scrollY
            if (scroll > topSkipHight && scroll < maxHeight && !scrollUp) {
                setShowBox(true)
            }
            else {
                setShowBox(false)
            }
        }

        document.addEventListener('scroll', handleScroll)
    })
    return (
        <div className={`if-blog-short-nav ${!showBox && 'if-hide-blog-s-nav'}`}>
            <div>
                <button className="if-blog-s-nav-btn" onClick={() => onLikeClick()}>
                    {!options?.isLiked ? <i className="ri-thumb-up-line"></i>
                        : <div class="if-like-logo"><i class="ri-thumb-up-fill"></i></div>}
                    <span className='if-font-s'>{options?.likeCount}</span>
                </button>
            </div>
            <div>
                <button className="if-blog-s-nav-btn" onClick={() => onShareClick()}>
                    <i className="ri-share-forward-line"></i>
                </button>
            </div>
            <div>
                <button className="if-blog-s-nav-btn" onClick={() => onSaveClick()}>
                    <i className={options?.isSaved ? "ri-heart-add-2-fill" : "ri-heart-add-2-line"}></i>
                </button>
            </div>
        </div>
    )
}

const NextBlogSection = ({ blog }) => {
    const navigate = useNavigate()
    return (
        <div className='if-next-blog-show-box' onClick={() => navigate(`/blog/${blog?._id}`)}>
            <div className='if-next-blog-show-box-img-sec'>
                <div>
                    <img src={blog?.thumbnail || require('../../assets/img/blank-image.png')} alt="" />
                </div>
                <div>
                    <h6 className='if-text-max-line-2 mb-0'>{blog?.blogTitle}</h6>
                </div>
            </div>
            <div className='if-next-blog-show-box-btn-sec'>
                <span>Read next</span>
                <span><i className="ri-arrow-right-s-line"></i></span>
            </div>
        </div>
    )
}