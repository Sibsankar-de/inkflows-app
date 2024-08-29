import React, { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Tooltip } from 'react-tooltip'
import { ImageCropper } from '../../components/ImageCropper/ImageCropper'
import { PopInput } from '../../components/Input/PopInput'
import { DotSpinner } from '../../components/LoadingSpinner/DotSpinner'
import axios from '../../configs/axios-configs'
import { useCurrentUser } from '../../hooks/get-currentuser'
import { imageCompressor } from '../../utils/functions/imageCompressor'
import { handleThemeChange } from '../../utils/functions/themeHandler'
import { validateUsername } from '../../utils/functions/validateUsername'
import { PopupContainer } from '../../utils/popup/PopupContainer'
import "./settings.style.css"

export const Settings = () => {
    return (
        <div className='container if-settings-container'>
            <SettingsSideNav />
            <SettingsTopNav />
            <section className='if-settings-body'>
                <Outlet />
            </section>
            <Tooltip id='if-settings-tooltip' />
        </div>
    )
}

const SettingsSideNav = () => {
    return (
        <section className='if-settings-side-nav'>
            <ul className='if-settings-nav-list'>
                <div>
                    <h5 className='mb-3'>Settings</h5>
                </div>
                <li className='if-settings-nav-opt'>
                    <NavLink to="profile">
                        <div>
                            <span><i className="ri-user-line"></i></span>
                            <span>Profile</span>
                        </div>
                    </NavLink>
                </li>
                <li className='if-settings-nav-opt'>
                    <NavLink to="themes">
                        <div>
                            <span><i className="ri-t-shirt-line"></i></span>
                            <span>Appearance</span>
                        </div>
                    </NavLink>
                </li>
                <li className='if-settings-nav-opt'>
                    <NavLink to="security">
                        <div>
                            <span><i className="ri-lock-2-line"></i></span>
                            <span>Security</span>
                        </div>
                    </NavLink>
                </li>
            </ul>
        </section>
    )
}

const SettingsTopNav = () => {
    return (
        <section className='if-settings-top-nav-box'>
            <div className='if-settings-top-nav-opt-box'>
                <NavLink className="if-settings-top-nav-link" to="profile">
                    <div className="if-settings-top-nav-opt">
                        <span><i className="ri-user-line"></i></span>
                    </div>
                </NavLink>
            </div>
            <div className='if-settings-top-nav-opt-box'>
                <NavLink className="if-settings-top-nav-link" to="themes">
                    <div className="if-settings-top-nav-opt">
                        <span><i className="ri-t-shirt-line"></i></span>
                    </div>
                </NavLink>
            </div>
            <div className='if-settings-top-nav-opt-box'>
                <NavLink className="if-settings-top-nav-link" to="security">
                    <div className="if-settings-top-nav-opt">
                        <span><i className="ri-lock-2-line"></i></span>
                    </div>
                </NavLink>
            </div>
        </section>
    )
}

export const ProfileSettings = () => {
    // profile iamge
    const [activeImage, setActiveImage] = useState(null)
    // fetch current user
    const currentUser = useCurrentUser();
    const [userInput, setUserInput] = useState({ fullName: "", userName: "" })

    useEffect(() => {
        setUserInput({ fullName: currentUser?.fullName, userName: currentUser?.userName })
        currentUser?.avatar && setActiveImage(currentUser?.avatar)
    }, [currentUser])


    // Image input handler
    const [imageInput, setImageInput] = useState(null)
    const [croppedImage, setCroppedIamge] = useState(null)

    const handleImageInput = async e => {
        const file = e.target.files[0]
        // Takes images under 5mb
        if (file?.size <= 5242880) {
            setImageInput(file)
        } else {
            toast.error("Maximum taken image size is 5MB")
        }
    }

    // Changes active image file to URl
    useEffect(() => {
        if (croppedImage && croppedImage instanceof File) {
            const imageUrl = URL.createObjectURL(croppedImage)
            setActiveImage(imageUrl)
        }
    }, [croppedImage])

    // validate username and check avaibality
    const [isUserAvailable, setIsUserAvailable] = useState(true)
    const [isUserValidate, setIsUserValidate] = useState(true)
    useEffect(() => {
        const fetchUserNameList = async () => {
            try {
                await axios.get('/user/get-usernamelist')
                    .then(res => {
                        const userNameList = res?.data?.data
                        const userName = userInput?.userName
                        if (userName !== currentUser?.userName && userNameList?.includes(userName)) {
                            setIsUserAvailable(false)
                        } else {
                            setIsUserAvailable(true)
                        }
                    })
            } catch (error) {
                // console.log(error);
                setIsUserAvailable(false)
            }
        }

        const checkUserValidity = async () => {
            const { status, isUserValidate } = await validateUsername(userInput?.userName)
            if (userInput?.userName !== currentUser?.userName) {
                setIsUserValidate(isUserValidate)
            }
        }

        fetchUserNameList()
        checkUserValidity()

    }, [userInput?.userName, currentUser])

    // Handle change submission
    const handleAvatarChange = async () => {
        // compress image
        const compressedImage = await imageCompressor(croppedImage, 0.5)

        try {
            await axios.patch('/user/update-avatar', { avatar: compressedImage }, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
        } catch (error) {
            // console.log(error);
        }
    }

    const [saveLoader, setSaveLoader] = useState(false)
    const handleProfileSave = async () => {
        if (userInput?.fullName?.length > 3 && userInput?.fullName?.length <= 20 && isUserValidate && isUserAvailable) {
            setSaveLoader(true)
            // updates avatar
            if (croppedImage) await handleAvatarChange()
            // updates user info
            try {
                await axios.patch("/user/update-user", { userName: userInput?.userName, fullName: userInput?.fullName })
                    .then(() => {
                        setSaveLoader(false)
                    })
            } catch (error) {
                // console.log(error);
                setSaveLoader(false)
            }
        }
        else if (userInput?.fullName?.length > 3 && userInput?.fullName?.length <= 20) {
            toast.error("Full name must be between 4 to 20 characters")
        }
    }

    // handle page title
    useEffect(() => {
        document.title = currentUser ? `Settings - ${currentUser?.fullName}'s profile` : "Loading..."
    }, [currentUser])

    return (
        <>
            <div>
                <div className='d-flex align-items-center gap-2 mb-3'>
                    <h5 className='mb-0'>Profile</h5>
                </div>
                <div className='if-settings-body-container'>
                    <div className='d-flex gap-3 align-items-center mb-3'>
                        <div className='if-settings-profile-img-box'>
                            <img src={activeImage || require('../../assets/img/profile-img.png')} alt="" />
                        </div>
                        <div>
                            <label htmlFor="if-avatar-input">
                                <span className='if-btn-2 if-change-prof-img-btn c-pointer' data-tooltip-id='if-settings-tooltip' data-tooltip-place='bottom' data-tooltip-content={'Change image'} data-tooltip-delay-show={1000}>
                                    <i className="ri-camera-fill"></i>
                                </span>
                                <input type="file" name="" id="if-avatar-input" className='d-none' multiple={false} accept="image/*" onChange={handleImageInput} />
                            </label>
                        </div>
                    </div>
                    <div className='if-setttings-profile-user-det-box'>
                        <div className='fs-5'>
                            <div className='if-setttings-profile-user-input-box'>
                                <input type="text" placeholder='Full name' className='if-settings-prof-det-input' id='if-set-profile-uname-input' value={userInput?.fullName||''} onChange={e => setUserInput({ ...userInput, fullName: e.target.value })} disabled={saveLoader} />
                            </div>
                        </div>
                        <div className='justify-self-end'>
                            <label htmlFor="if-set-profile-uname-input">
                                <span className='if-btn c-pointer'><i className="ri-pencil-fill fs-5"></i></span>
                            </label>
                        </div>
                    </div>
                    <div className='if-setttings-profile-user-det-box'>
                        <div className='if-setttings-profile-user-input-box'>
                            <input type='text' name="" id="if-set-profile-des-input" placeholder='user name' className='if-settings-prof-det-input' value={userInput?.userName} onChange={e => setUserInput({ ...userInput, userName: e.target.value })} disabled={saveLoader} />
                        </div>
                        <div className='justify-self-end'>
                            <label htmlFor="if-set-profile-des-input">
                                <span className='if-btn c-pointer'><i className="ri-pencil-fill fs-5"></i></span>
                            </label>
                        </div>
                    </div>
                    {!isUserAvailable && <p className='text-danger if-font-s'><span><i className="ri-information-2-line"></i> </span><span>User name already taken</span></p>}
                    {!isUserValidate && <p className='text-danger if-font-s'><span><i className="ri-information-2-line"></i> </span><span>User name is not valid.</span> <a href="" className='if-url-coloured'>Learn more</a></p>}

                </div>
            </div>
            <div className='justify-self-end align-self-end'>
                <button className='if-btn-2 if-btn-green--grad' onClick={handleProfileSave} disabled={saveLoader}>
                    {saveLoader && <DotSpinner />}
                    <span>Save Changes</span>
                </button>
            </div>
            <ImageCropPopup activeState={imageInput ? true : false} imageFile={imageInput} onClose={() => setImageInput(null)} onCropped={file => file && setCroppedIamge(file)} />
        </>
    )
}

const ImageCropPopup = ({ activeState, imageFile, onClose, onCropped }) => {
    const [croppedFile, setCroppedFile] = useState(null)
    // handle crop
    const handleCrop = async () => {
        await onCropped(croppedFile);
        onClose()
    }
    return (
        <PopupContainer activeState={activeState} pauseDocumentScroll className='if-crop-img-popup' >
            <div className='if-img-crop-popup-body'>
                <div className='if-crop-img-popup-img-crop-box'>
                    <ImageCropper imageFile={imageFile} onCropped={file => setCroppedFile(file)} />
                </div>
            </div>
            <div className='if-popup-footer'>
                <div className='if-popup-ftr-btn-box'>
                    <button className="if-btn-2" onClick={() => onClose()}>Cancel</button>
                    <button className="if-btn-2 if-btn-blue--grad" onClick={handleCrop}>Crop</button>
                </div>
            </div>
        </PopupContainer>
    )
}

export const ThemeSettings = () => {
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

    // handle page title
    useEffect(() => {
        document.title = "Settings - Change occurences"
    }, [])

    return (
        <div>
            <div className='d-flex align-items-center gap-2 mb-4'>
                <h5 className='mb-0'>Themes</h5>
            </div>
            <div className='if-theme-change-box'>
                <div>
                    <h6 className='mb-0 if-font-m'>Change theme</h6>
                    <div className='if-col-fade'>{isDarkMode ? "Dark" : "Light"} mode is active</div>
                </div>
                <div className='justify-self-end'>
                    <div>
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
    )
}

export const SecuritySettings = () => {
    const navigate = useNavigate()
    const [passwordChangePopup, setPasswordChangePopup] = useState(false)

    // Handle logout
    const [logoutLoader, setLogOutLoader] = useState(false)
    const handleLogOut = async () => {
        try {
            setLogOutLoader(true)
            await axios.get('/user/logout-user')
                .then(() => {
                    localStorage.removeItem("isLoggedIn")
                    window.location.reload()
                    setLogOutLoader(false)
                })
        } catch (error) {
            // console.log(error);
            toast.error("Unable to logout ")
            setLogOutLoader(false)
        }
    }

    // fetch currentUser
    const currentUser = useCurrentUser()

    // Handles password change access
    const [canChangePassword, setCanChangePassword] = useState(null)
    useEffect(() => {
        if (currentUser?.authBy === "google") {
            setCanChangePassword(false)
        } else {
            setCanChangePassword(true)
        }
    }, [currentUser])

    // handle page title
    useEffect(() => {
        document.title = "Settings - Security"
    }, [])
    return (
        <div>
            <div className='d-flex align-items-center gap-2 mb-4'>
                <h5 className='mb-0'>Security</h5>
            </div>
            <div>
                <div className='mb-4'>
                    <ul className='p-0'>
                        <li className='if-settings-security-item' onClick={() => canChangePassword && setPasswordChangePopup(true)}>
                            <div className='if-settings-security-item-content'>
                                <div><i className='ri-key-2-line fs-5'></i></div>
                                <div>
                                    <div>Change Password</div>
                                    <div className='if-font-s if-col-fade'>
                                        {canChangePassword === false ? <span className='text-danger'>
                                            <i className="ri-information-2-line"></i> You are authenticated using google. So you cannot change password.
                                        </span> :
                                            <span>
                                                Updating password secures your account more effectively.
                                            </span>}
                                    </div>
                                </div>
                                <div className='justify-self-end'><i className='bi bi-chevron-right'></i></div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div>
                    <div className='mb-2'>
                        <Link to="/privacy-terms" className='if-url-coloured'><span><i className="ri-article-line"></i></span> <span>Privacy Policy</span></Link>
                    </div>
                    <div>
                        <Link to="/terms-conditions" className='if-url-coloured'><span><i className="ri-article-line"></i></span> <span>Terms and conditions</span></Link>
                    </div>
                </div>
                <div className='mt-5'>
                    <div className='mb-2'>Log out from this account</div>
                    <div>
                        <button className='if-btn-2 text-danger' onClick={handleLogOut} disabled={logoutLoader}>
                            {logoutLoader && <DotSpinner />}
                            <span>Log out</span>
                        </button>
                    </div>
                </div>
            </div>
            <PasswordChangePopup activeState={passwordChangePopup} onClose={e => setPasswordChangePopup(e)} />
        </div>
    )
}

const PasswordChangePopup = ({ activeState, onClose }) => {
    const [passwordInput, setPasswordInput] = useState({ oldPassword: "", newPassword: "" })
    const [loader, setLoader] = useState(false)
    const handlePasswordChange = async () => {
        if (passwordInput?.newPassword?.length >= 5 && passwordInput?.oldPassword) {
            try {
                setLoader(true)
                await axios.patch("/user/update-password", { currentPassword: passwordInput?.oldPassword, newPassword: passwordInput?.newPassword })
                    .then(() => {
                        setLoader(false)
                        onClose()
                        toast.success("Password updated successfully")
                    })
            } catch (error) {
                // console.log(error);
                setLoader(false)
                if (error?.response?.status === 402) toast.error("Current password is not correct")
            }
        } else {
            toast.error("New password length must be 5 or more")
        }
    }
    return (
        <PopupContainer activeState={activeState} className='if-password-popup-box' pauseDocumentScroll>
            <div className="if-popup-header">
                <h5>Change Password</h5>
            </div>
            <div className='if-popup-body'>
                <div className='mb-4'>
                    <PopInput placeholder='Enter current password' type='password' onChange={e => setPasswordInput({ ...passwordInput, oldPassword: e })} />
                </div>
                <div>
                    <PopInput placeholder='Enter new password' type='password' onChange={e => setPasswordInput({ ...passwordInput, newPassword: e })} />
                </div>
                <div className='if-font-s mt-3'>
                    <span className='text-success'><i className="ri-information-2-line"></i></span> <span>Minimum 5 characters are required. Use a combination of letters, special chars and numbers.</span>
                </div>
            </div>
            <div className='if-popup-footer'>
                <div className='if-popup-ftr-btn-box'>
                    <button className='if-btn-2' onClick={() => onClose(false)}>Cancel</button>
                    <button className='if-btn-2 if-btn-blue--grad' disabled={loader} onClick={handlePasswordChange}>
                        {loader && <DotSpinner />}
                        <span>Change Password</span>
                    </button>
                </div>
            </div>
        </PopupContainer>
    )
}
