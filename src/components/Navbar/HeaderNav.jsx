import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { SelectDropdown } from '../../utils/dropdown/SelectDropdown';
import { closeOnBackClick } from '../../utils/functions/closeOnBackClick';
import { PopupContainer } from '../../utils/popup/PopupContainer';
import { SearchBox } from '../SearchBox/SearchBox';
import AuthContext from '../../contexts/AuthContext';
import './nav.style.css';
import { AuthenticatedContainer } from '../../utils/auth-utils/AuthenticatedContainer';
import { PreAuthContainer } from '../../utils/auth-utils/PreAuthContainer';
import { useCurrentUser } from '../../hooks/get-currentuser';
import profImg from '../../assets/img/profile-img.png'
import { useScrollDirection } from '../../hooks/detect-scroll-dir';
import { handleThemeChange } from '../../utils/functions/themeHandler';

export const HeaderNav = () => {
    const navigate = useNavigate()

    // Profile dropdown 
    const [openprDropdown, setOpenPrDropdown] = useState(false)
    const profileRef = useRef(null)
    useEffect(() => {
        const handleClose = () => {
            closeOnBackClick(openprDropdown, profileRef, () => setOpenPrDropdown(false))
        }
        document.addEventListener('click', handleClose)
        document.addEventListener('scroll', () => setOpenPrDropdown(false))
        return () => {
            document.removeEventListener('click', handleClose)
            document.removeEventListener('scroll', handleClose)
        }
    })

    // Notification popup handler
    const [notificationOpen, setNotificationOpen] = useState(false)

    // Search box handler 
    const [openSearchBox, setOpenSearchBox] = useState(false)

    // get current user
    const currentUser = useCurrentUser()

    // State to hide nav bar
    const [hideNav, setHideNav] = useState(false)

    // hide navbar 
    const location = useLocation()
    const scrollUp = useScrollDirection()
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            if (scrollY > 111.11 && scrollUp) {
                setHideNav(true)
            } else {
                setHideNav(false)
            }
        }

        // hides nav bar on scroll up
        if (location.pathname.includes('/blog/')) {
            document.addEventListener('scroll', handleScroll)
        }
        // hides nav during blog writing and auth pages
        else if (location.pathname.includes("/create/new") || location.pathname.includes("/auth/")) {
            setHideNav(true)
        }
        else {
            setHideNav(false)
        }

        return () => document.removeEventListener("scroll", handleScroll)
    }, [location, scrollUp])

    // search input handlers
    const [searchInput, setSearchInput] = useState("")
    const searchbarRef = useRef(null)

    // handle input field write
    const handleInputWrite = (text) => {
        setSearchInput(text)
        searchbarRef?.current?.focus()
    }

    // handle after search
    const handleSearch = () => {
        setOpenSearchBox(false)
        searchbarRef?.current?.blur()

    }

    // set q value on refresh
    const [searchParams] = useSearchParams()
    const query = decodeURI(searchParams.get("q"))
    useEffect(() => {
        if (query !== "null") {
            setSearchInput(query)
        } else {
            setSearchInput('')
        }
    }, [location])


    return (
        <>
            <nav className={`if-header-nav ${hideNav ? "if-hide-nav" : ''}`}>
                <section className='if-nav-sec'>
                    <div>
                        <Link to='/home' className='if-url-normal'>
                            <div><img src={require("../../assets/img/inkflows-home.png")} width={25} alt="" data-tooltip-id='if-nav-tooltip' data-tooltip-content={'Home'} /></div>
                        </Link>
                    </div>
                    <div className='if-nav-search-box'>
                        <span className='if-search-logo-box'><i className='ri-search-2-line'></i></span>
                        <input
                            type="text"
                            placeholder='search blogs'
                            className='if-search-bar'
                            ref={searchbarRef}
                            onChange={e => setSearchInput(e.target.value)}
                            value={searchInput}
                            onFocus={(e) => { setOpenSearchBox(true) }}
                            onClick={e => e.stopPropagation()}
                        />
                    </div>
                </section>
                <section className='if-nav-sec if-nav-right-sec'>
                    <div className='if-nav-search-btn-box'>
                        <button className='if-btn if-nav-btn' data-tooltip-id='if-nav-tooltip' data-tooltip-content={'Search'} onClick={() => navigate('/search-bar')}>
                            <span><i className='ri-search-2-line fs-4'></i></span>
                        </button>
                    </div>

                    <div className='d-grid'>
                        <button className='if-btn if-nav-btn' onClick={(e) => { e.stopPropagation(); setNotificationOpen(true) }} data-tooltip-id='if-nav-tooltip' data-tooltip-content={'Notifications'}>
                            <span><i className="ri-notification-3-line fs-5"></i></span>
                        </button>
                        {/* <div className='if-notification-badge'></div> */}
                    </div>
                    <div>
                        <Link to='/create/new' className='if-url-normal'>
                            <button className='if-btn if-nav-btn' data-tooltip-id='if-nav-tooltip' data-tooltip-content={'Write blog'}>
                                <span><i className="ri-pen-nib-line fs-4 if-col-blue"></i></span>
                            </button>
                        </Link>
                    </div>
                    <div ref={profileRef} >
                        <AuthenticatedContainer>
                            <img src={currentUser?.avatar || profImg} alt="" width={40} height={40} onClick={() => setOpenPrDropdown(!openprDropdown)} className='c-pointer if-border-round' data-tooltip-id='if-nav-tooltip' data-tooltip-content={'User profile'} />
                        </AuthenticatedContainer>
                        <PreAuthContainer>
                            <div className='if-nav-sign-in-prof-opt' onClick={() => setOpenPrDropdown(!openprDropdown)} >
                                <div>
                                    <img src={profImg} alt="" width={30} height={30} className='c-pointer if-border-round' data-tooltip-id='if-nav-tooltip' data-tooltip-content={'User profile'} />
                                </div>
                                <div>Sync</div>
                            </div>
                        </PreAuthContainer>
                        <div className='if-nav-profile-btn-sec'>
                            <ProfileDropdown activeState={openprDropdown} onClose={() => setOpenPrDropdown(false)} currentUser={currentUser} />
                        </div>
                    </div>

                </section>
                <Tooltip id='if-nav-tooltip' delayShow={2000} place={'bottom'} />
            </nav>
            <NotificationPopup activeState={notificationOpen} onClose={() => setNotificationOpen(false)} />
            <SearchBox openState={openSearchBox} onClose={() => setOpenSearchBox(false)} input={searchInput} onWrite={handleInputWrite} onSearch={handleSearch} />
        </>
    )
}

const ProfileDropdown = ({ activeState, onClose, currentUser }) => {
    const { isAuthenticated } = useContext(AuthContext)
    const navigate = useNavigate()
    const handleOptionClick = (event) => {
        navigate(event)
        onClose(false)
    }

    // Const handle toogle theme
    const [isDarkMode, setIsDarkMode] = useState(false)
    const handleToogleBtn = () => {
        const theme = localStorage.getItem("theme") || "light"
        if (theme === "dark") setIsDarkMode(true)
        else { setIsDarkMode(false) }
    }
    const handleToogleTheme = () => {
        handleThemeChange()
        handleToogleBtn()
    }

    useEffect(() => {
        handleToogleBtn()
    })

    return (
        <SelectDropdown activeState={activeState} className='if-profile-dropdown-box'>
            <AuthenticatedContainer>
                <div className='if-prof-dropdown-sections'>
                    <div className='mb-2'>General</div>
                    <div className='d-grid gap-1'>
                        <div><button className='if-btn' onClick={() => handleOptionClick(`profile/${currentUser?.userName}`)}><span><i className="ri-user-line"></i></span><span>Profile</span></button></div>
                        <div><button className='if-btn' onClick={() => handleOptionClick('saved-blog')}><span><i className="ri-heart-add-2-line"></i></span><span>Saved blogs</span></button></div>
                        <div><button className='if-btn' onClick={() => handleOptionClick(`profile/${currentUser?.userName}/drafts`)}><span><i className="ri-draft-line"></i></span><span>Drafted blogs</span></button></div>
                        <div><button className='if-btn' onClick={() => handleOptionClick('settings')}><span><i className="ri-settings-4-line"></i></span><span>Settings</span></button></div>
                    </div>
                </div>
            </AuthenticatedContainer>
            <PreAuthContainer>
                <div className='if-prof-dropdown-sections'>
                    <button className="if-btn-2 if-btn-blue--grad justify-content-center" onClick={() => handleOptionClick("/auth/login")}><span><i className="ri-loop-right-line"></i></span><span>Sign in</span></button>
                </div>
            </PreAuthContainer>
            <div className='if-prof-dropdown-sections'>
                <div className='mb-2'>Appearance</div>
                <div className='mx-2'>
                    <div className='if-profile-d-down-theme-opt'>
                        <div>
                            Theme
                        </div>
                        <div className='justify-self-end'>
                            <label htmlFor="toggle-input" className='d-flex align-items-center gap-1'>
                                <input type="checkbox" name="" id="toggle-input" className='if-toggle-input' onChange={handleToogleTheme} checked={isDarkMode} />
                                <div><i className="ri-sun-line"></i></div>
                                <div className='if-toggler'>
                                    <div className='if-toggler-track'></div>
                                    <div className='if-toggler-thumb'></div>
                                </div>
                                <div><i className="ri-moon-clear-line"></i></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-grid gap-1'>
                <div>
                    <Link to={`/blog/66c8ae8de32820c13859ed7a`} className='if-url-coloured'><span><i className="ri-question-line"></i></span> <span>How to write a blog?</span></Link>
                </div>
                <div>
                    <Link to="/privacy-terms" target='_blank' className='if-url-coloured'><span><i className="ri-key-2-line"></i></span> <span>Privacy terms</span></Link>
                </div>
            </div>
        </SelectDropdown>
    )
}

const NotificationPopup = ({ activeState, onClose }) => {
    return (
        <PopupContainer activeState={activeState} pauseDocumentScroll className='if-notification-container' closeOnBackClick onClose={() => onClose()}>
            <div className='if-popup-header if-notif-popup-header'>
                <h5>Notifications <i className="ri-notification-3-line"></i></h5>
                <div className='justify-self-end'>
                    <button className='if-btn' onClick={() => onClose()}><i className="ri-close-large-line"></i></button>
                </div>
            </div>
            <div className='if-popup-body'>
                <div className='d-flex align-items-center gap-2 mb-3'>
                    <div className='if-notif-pup-nav-item'>
                        <span>All</span>
                    </div>
                    <div className='if-notif-pup-nav-item'>
                        <span>Unreads</span>
                    </div>
                </div>
                <div className='if-notification-content'>
                    <ul>
                        No notifications to display
                    </ul>
                </div>
            </div>
        </PopupContainer>
    )
}

