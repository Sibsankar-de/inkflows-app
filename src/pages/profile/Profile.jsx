import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
import axios from '../../configs/axios-configs'
import { useCurrentUser } from '../../hooks/get-currentuser'
import { CurrentUserContainer } from '../../utils/auth-utils/CurrentUserContainer'
import profImg from '../../assets/img/profile-img.png'
import "./profile.style.css"
import { DotSpinner } from '../../components/LoadingSpinner/DotSpinner'
import { toast } from 'react-toastify'
import { formatDate } from '../../utils/functions/convertIsoDateString'
import { handleRemoveSaveBlog, handleSaveBlog } from '../../utils/api-functions/saveBtnHandler'
import { ProfileLoadBox } from '../../components/LoadBoxes/ProfileLoadBox'
import { loader } from '@monaco-editor/react'
import { handleShare } from '../../utils/api-functions/shareBtnHandler'

export const Profile = () => {
    const navigate = useNavigate()

    // controls Navbar position 
    const [navPosition, setNavPosition] = useState('absolute')
    const [navTop, setNavTop] = useState('unset');
    const navStyle = { position: navPosition, top: navTop }
    const navRef = useRef(null)
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY
            const userBoxElem = document.getElementsByClassName("if-profile-user-details-upper-sec")
            if (userBoxElem) {
                const topHeight = userBoxElem[0]?.clientHeight
                if (scrollPosition >= topHeight + 35) {
                    setNavPosition('fixed')
                    setNavTop('60px')
                }
                else {
                    setNavPosition('absolute')
                    setNavTop('unset')
                }
            }
        }
        document.addEventListener('scroll', handleScroll)
        return () => { document.removeEventListener('scroll', handleScroll) }
    }, [])

    // fetch current user
    const currentUser = useCurrentUser()

    // const get user from param
    const params = useParams()
    const userName = params.param

    // Fetch user by username
    const [userData, setUserData] = useState(null)
    const [userLoader, setUserLoader] = useState(false)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setUserLoader(true)
                await axios.get(`/user/get-by-name/${userName}`)
                    .then((res) => {
                        setUserData(res?.data?.data)
                        setUserLoader(false)
                    })
            } catch (error) {
                navigate('*')
                console.log(error);
            }
        }
        fetchUser()
    }, [userName])

    // checks following or not
    const [isFollowing, setIsFollowing] = useState(false)
    useEffect(() => {
        const checkFollow = async () => {
            if (userData?._id !== undefined) {
                try {
                    await axios.get(`/user/check-follow/${userData?._id}`)
                        .then(res => setIsFollowing(res?.data?.data?.isFollowed))
                } catch (error) {
                    console.log(error);
                }
            }
        }
        checkFollow()
    }, [userData])

    // Handle follow and unfollow
    const [followLoader, setFollowLoader] = useState(false)
    const handleFollow = async () => {
        try {
            setFollowLoader(true)
            await axios.post('/user/create-follow', { followingTo: userData?._id })
                .then(() => {
                    setFollowLoader(false)
                    setIsFollowing(true)
                    toast.success(`You are now following ${userData?.userName}`)
                })

        } catch (error) {
            setFollowLoader(false)
            console.log(error);
        }
    }

    const handleUnFollow = async () => {
        try {
            setFollowLoader(true)
            await axios.post('/user/remove-follow', { followingTo: userData?._id })
                .then(() => {
                    setFollowLoader(false)
                    setIsFollowing(false)
                    toast.success(`You unfollowed ${userData?.userName}`)
                })

        } catch (error) {
            setFollowLoader(false)
            console.log(error);
        }
    }

    // Handle profile share
    const handleProfileShare = async () => {
        if (userData) {
            try {
                await handleShare(userData?.fullName, "", window.location.origin + "/profile/" + userData?.userName)
            } catch (error) {

            }
        }
    }

    // Fetch blog numbers
    const [blogNum, setBlogNum] = useState(null)
    useEffect(() => {
        const fetchBlogNum = async () => {
            try {
                await axios.get(`/blog/get-blognumber/${userData?._id}`)
                    .then(res => {
                        setBlogNum(res?.data?.data)
                    })
            } catch (error) {
                console.log(error);
            }
        }
        if (userData?._id) fetchBlogNum()
    }, [userData])

    // handle page title
    useEffect(() => {
        document.title = userData?`Inkflows profile - ${userData?.fullName}`:"Loading..."
    }, [userData])

    return (
        <div className='container if-profile-container'>
            <div className='if-profile-content-box'>
                <section className='if-profile-user-details-upper-sec'>
                    <div className='if-profile-user-details-section'>
                        <div className='if-profile-user-img-box'>
                            <div>
                                <img src={userData?.avatar || profImg} alt="" />
                            </div>
                            <div className='if-profile-edit-btn' onClick={() => navigate('/settings/profile')}><i className="ri-pencil-line"></i></div>
                        </div>
                        {userData && <div className='if-profile-user-details-box'>
                            <div className='if-profile-user-det-box-name-sec'>
                                <div className='d-flex align-items-center gap-3'>
                                    <span className='if-profile-user-name-para'>{userData?.fullName}</span>
                                    <CurrentUserContainer userName={userName}>
                                        <div className='if-profile-fname-end-btn-box'>
                                            <button className='if-btn' data-tooltip-id='if-profile-tool-tip' data-tooltip-place='bottom' data-tooltip-content={'User settings'} onClick={() => navigate('/settings')} >
                                                <span><i className="ri-settings-4-line fs-5"></i></span>
                                            </button>
                                        </div>
                                    </CurrentUserContainer>
                                </div>
                                <div><span>{userData?.userName}</span></div>
                                <div className='mt-3'>
                                    <span className='if-profile-followers-para'>{userData?.followersCount} followers</span>
                                    <span><i className="bi bi-dot mx-2"></i></span>
                                    <span>{userData?.followingsCount} followings</span>
                                </div>
                            </div>
                            {currentUser &&
                                <div className='if-profile-user-det-box-follow-sec'>
                                    {currentUser?.userName !== userName ?
                                        <div>
                                            {!isFollowing ?
                                                <button className="if-btn-2 if-btn-blue--grad" onClick={handleFollow} disabled={followLoader}>
                                                    {followLoader && <DotSpinner />}
                                                    <span>Follow</span>
                                                    <span><i className="ri-user-add-line"></i></span>
                                                </button> :
                                                <button className="if-btn-2 if-marked-btn if-btn-br-blue rounded-5" onClick={handleUnFollow} disabled={followLoader}>
                                                    {followLoader && <DotSpinner />}
                                                    <span>Following</span>
                                                    <span><i className="ri-user-follow-line"></i></span>
                                                </button>
                                            }
                                        </div> :
                                        <div>
                                            <button className='if-btn-2 if-btn-green--grad' onClick={() => navigate('/settings/profile')}>
                                                <span>Edit profile</span>
                                                <span><i className="ri-pencil-line"></i></span>
                                            </button>
                                        </div>
                                    }
                                    <div className='if-profile-share-btn-box'>
                                        <button className="if-btn-2" data-tooltip-id='if-profile-tool-tip' data-tooltip-delay-show={2000} data-tooltip-content='Share' data-tooltip-place='bottom' onClick={handleProfileShare}><i className="ri-share-forward-line"></i></button>
                                    </div>
                                </div>
                            }
                        </div>}
                        {userData === null && <ProfileLoadBox />}
                    </div>

                </section>
                <section>
                    <div className='if-profile-nav-box'>
                        <div className='if-profile-nav-bar' style={navStyle} ref={navRef}>
                            <div className='if-profile-nav-bar-item'>
                                <NavLink to="uploads">
                                    <button className='if-profile-nav-btn'>
                                        <div className='d-flex align-items-center gap-2'>
                                            <div>Uploads</div>
                                            {blogNum?.publicBlogCount > 0 && <div className='if-prof-nav-upload-count-box'>{blogNum?.publicBlogCount}</div>}
                                        </div>
                                        <div className='if-profile-nav-opt-bottom'></div>
                                    </button>
                                </NavLink>
                            </div>
                            <CurrentUserContainer userName={userName}>
                                <div className='if-profile-nav-bar-item'>
                                    <NavLink to="drafts">
                                        <button className='if-profile-nav-btn'>
                                            <div className='d-flex align-items-center gap-2'>
                                                <div className='if-text-no-break'>Drafted blogs</div>
                                                {blogNum?.draftBlogCount > 0 && <div className='if-prof-nav-upload-count-box'>{blogNum?.draftBlogCount}</div>}
                                            </div>
                                            <div className='if-profile-nav-opt-bottom'></div>
                                        </button>
                                    </NavLink>
                                </div>
                            </CurrentUserContainer>
                        </div>
                    </div>
                    <div className='if-profile-outlet-box'>
                        <Outlet />
                    </div>
                </section>
            </div>
            <Tooltip id='if-profile-tool-tip' />
        </div>
    )
}

export const UploadSection = () => {
    // const get user from param
    const params = useParams()
    const userName = params.param

    const navigate = useNavigate()
    // Fetch blog list
    const [blogList, setBlogList] = useState(null)
    useState(() => {
        const fetchBlogList = async () => {
            if (userName) {
                try {
                    await axios.get(`/blog/user-bloglist?userName=${userName}&blogType=public`)
                        .then(res => {
                            setBlogList(res?.data?.data)
                        })
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchBlogList()
    }, [userName])


    return (
        <div>
            <ul className='if-profile-created-content-list'>
                {
                    blogList === null && <div className='d-grid align-items-center justify-content-center my-3'><DotSpinner /></div>
                }
                {
                    blogList?.map((item, index) => {
                        return <BlogItem key={index} data={item} />
                    })
                }
                {
                    blogList?.length === 0 &&
                    <div className='d-grid align-items-center justify-content-center gap-3'>
                        <div>No Uploads to display !</div>
                        <CurrentUserContainer userName={userName}>
                            <div className='justify-self-center'>
                                <button className="if-btn if-nav-btn rounded-5 px-3" onClick={() => navigate('/create/new')}>
                                    <span><i className="ri-pen-nib-line fs-4 if-col-blue"></i></span>
                                    <span>Write a blog</span>
                                </button>
                            </div>
                        </CurrentUserContainer>
                    </div>
                }
            </ul>
        </div>
    )
}

export const DraftedBlogSection = () => {
    useEffect(() => {
        window.scrollTo(0, 312)
    }, [])

    const navigate = useNavigate()

    // const get user from param
    const params = useParams()
    const userName = params.param

    // Fetch blog list
    const [blogList, setBlogList] = useState(null)
    useState(() => {
        const fetchBlogList = async () => {
            if (userName) {
                try {
                    await axios.get(`/blog/user-bloglist?userName=${userName}&blogType=draft`)
                        .then(res => {
                            setBlogList(res?.data?.data)
                        })
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchBlogList()
    }, [userName])

    return (
        <div>
            <ul className='if-profile-created-content-list'>
                {
                    blogList === null && <div className='d-grid align-items-center justify-content-center my-3'><DotSpinner /></div>
                }
                {
                    blogList?.map((item, index) => {
                        return <BlogItem key={index} data={item} />
                    })
                }
                {
                    blogList?.length === 0 &&
                    <div className='d-grid align-items-center justify-content-center gap-3'>
                        <div>No drafted blogs to display !</div>
                        <CurrentUserContainer userName={userName}>
                            <div className='justify-self-center'>
                                <button className="if-btn if-nav-btn rounded-5 px-3" onClick={() => navigate('/create/new')}>
                                    <span><i className="ri-pen-nib-line fs-4 if-col-blue"></i></span>
                                    <span>Write a blog</span>
                                </button>
                            </div>
                        </CurrentUserContainer>
                    </div>
                }
            </ul>
        </div>
    )
}

const BlogItem = ({ data }) => {
    // const get user from param
    const params = useParams()
    const userName = params.param

    const navigate = useNavigate()
    // Blog url
    const blogUrl = `/blog/${data?._id}`

    const date = formatDate(data?.updatedAt)

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

    // share handler
    const shareBtnHandler = ()=>{
        handleShare(data?.blogTitle, "", `${window.location.origin}/blog/${data?._id}`)
    }

    return (
        <li className='if-profile-blog-item'>
            <div className='if-profile-blog-img-box'>
                <div>
                    <img src={data?.thumbnail || require('../../assets/img/blank-image.png')} alt="" onClick={() => navigate(blogUrl)} />
                </div>
                <div className='if-profile-blog-item-img-btm-box'>
                    <div>
                        <button className='if-btn' onClick={saveBtnHandler}>
                            <i className={blogSave ? "ri-heart-add-2-fill" : "ri-heart-add-2-line"}></i>
                        </button>
                    </div>
                    <div>
                        <button className='if-btn'>
                            <i className="ri-share-forward-line"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className='if-profile-blog-details-box'>
                <div className='if-pf-blog-title'>
                    <Link to={blogUrl} className='if-url-normal if-text-max-line-2'>{data?.blogTitle}</Link>
                </div>
                <div className='d-flex gap-1 align-items-center'>
                    <div className={`if-pf-blog-upload-stat-para ${data?.uploadStatus === 'public' ? 'if-text-primary' : 'text-success'}`}>
                        <span>{data?.uploadStatus}</span>
                    </div>
                    <div><span><i className="bi bi-dot"></i></span></div>
                    <div><span className='if-font-s if-col-fade'>{date}</span></div>
                </div>
                <div className='if-pf-blog-state-box'>
                    <div>
                        <span>{data?.totalViews} reads</span>
                    </div>
                    <div><span><i className="bi bi-dot"></i></span></div>
                    <div className='d-flex align-items-center gap-1'>
                        <div className='if-like-logo'><i className="ri-thumb-up-fill"></i></div>
                        <div><span>{data?.totalLikes}</span></div>
                    </div>

                </div>
                <div className='d-flex gap-1 align-items-center'>
                    <div className='if-profile-blog-item-btn-box'>
                        <div>
                            <button className='if-btn' onClick={saveBtnHandler}>
                                <i className={blogSave ? "ri-heart-add-2-fill" : "ri-heart-add-2-line"}></i>
                            </button>
                        </div>
                        <div>
                            <button className='if-btn' onClick={shareBtnHandler}>
                                <i className="ri-share-forward-line"></i>
                            </button>
                        </div>
                    </div>
                    <CurrentUserContainer userName={userName}>
                        <div>
                            <button className='if-btn-2 if-btn-purple--grad' onClick={() => navigate(`/create/new?edit=true&editId=${data?._id}`)}><span>Edit blog</span><span><i className="ri-draft-fill"></i></span></button>
                        </div>
                    </CurrentUserContainer>
                </div>
            </div>
        </li>
    )
}
