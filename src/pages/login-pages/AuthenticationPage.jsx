import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { PopInput } from '../../components/Input/PopInput'
import googleSvg from "../../assets/svg/google.svg"
import './loginPage.style.css'
import axios from '../../configs/axios-configs'
import { toast } from 'react-toastify'
import { DotSpinner } from '../../components/LoadingSpinner/DotSpinner'
import { validateUsername } from '../../utils/functions/validateUsername'

const AuthenticationPage = () => {
    return (
        <div className='container if-auth-page-container'>
            <section className='if-auth-page-img-sec'>
                <div className='if-auth-page-vector-img-box'>
                    <img src={require('../../assets/img/login-vector.png')} draggable={false} alt="" />
                </div>
            </section>
            <section className='if-auth-page-work-section'>
                <Outlet />
            </section>
        </div>
    )
}


const LoginBox = () => {
    const navigate = useNavigate();

    // Handle inputs
    const [input, setInput] = useState({ email: "", password: "" })

    // Handle login
    const [loader, setLoader] = useState(false)
    const handleLogin = async (e) => {
        e?.preventDefault();
        if (input.email && input.password) {
            setLoader(true)
            try {
                await axios.post('/user/login-user', input)
                    .then(res => {
                        setLoader(false)
                        navigate('/')
                        window.location.reload()
                    })
            } catch (error) {
                console.log(error);
                if (error.response?.status === 403) toast.error("User does not exist")
                if (error.response?.status === 402) toast.error("Incorrect password")
                if (error.response?.status === 400) toast.error("Unable to login")
                setLoader(false)
            }
        }
        else {
            toast.error("All fields are required")
        }
    }

    // Register user by google
    const [googleLoader, setGoogleLoader] = useState(false)
    const handleGoogleRegistration = async () => {
        setGoogleLoader(true)
        window.location.href = `${process.env.REACT_APP_PROXY_URL}/api/v1/user/google-login`
    }

    const location = useLocation()

    useEffect(() => {
        const queries = new URLSearchParams(location.search)
        const token = queries?.get('token')

        const handleGetUserInfo = async () => {
            setGoogleLoader(true)
            await axios.get('/user/google-login/auth-user')
                .then(async (res) => {
                    const userInfo = res?.data?.data
                    const data = { email: userInfo?.email, loginId: userInfo.id }
                    await axios.post("/user/login-user", data)
                        .then(() => {
                            navigate('/')
                            window.location.reload()
                            setGoogleLoader(false)
                        })
                        .catch((err) => {
                            toast.error('Can not login right now')
                        })
                })
                .catch(err => {
                    // console.log(err)
                    toast.error("Something went wrong")
                    setGoogleLoader(false)
                })
        }

        if (token) handleGetUserInfo()

    }, [location])


    // handle page title
    useEffect(() => {
        document.title = "Inkflows - Sync yourself"
    }, [])

    return (
        <div>
            <div className='mb-5 if-auth-page-header'>
                <h2>Log into <span className='if-col-blue'>Inkflows</span> </h2>
            </div>
            <div className='mb-5'>
                <div className='mb-4'>
                    <PopInput placeholder='Email or username' onChange={(e) => setInput({ ...input, email: e })} />
                </div>
                <div>
                    <PopInput placeholder='Enter password' type='password' onChange={(e) => setInput({ ...input, password: e })} />
                </div>
            </div>
            <div className='d-flex justify-content-end'>
                <button className="if-btn-2 if-login-btn" onClick={handleLogin} disabled={loader}>
                    {loader && <DotSpinner />}
                    <span>Login</span>
                    <span><i className="ri-login-circle-line"></i></span>
                </button>
            </div>
            <div className='if-or-flag mt-4'></div>
            <div className='mx-3'>
                <button className="if-btn-2 if-login-page-lg-btn" onClick={handleGoogleRegistration} disabled={googleLoader} >
                    {googleLoader && <DotSpinner />}
                    <span><img src={googleSvg} width={22} alt="" /></span>
                    <span>Sign up with Google</span>
                </button>
            </div>
            <div className='if-or-flag mt-4'></div>
            <div className='mx-3'>
                <button className="if-btn-2 if-login-page-lg-btn if-btn-purple--grad" onClick={() => navigate('/auth/register')}>
                    <span><i className="ri-mail-fill fs-5"></i></span>
                    <span>Sign up with email</span>
                </button>
            </div>
        </div>
    )
}

const RegistrationBox = () => {
    const navigate = useNavigate()
    const [input, setInput] = useState({ fullName: "", email: "", password: "" })
    // Register user by email
    const [loading, setLoading] = useState(false)
    const handleEmailRegistration = async () => {
        if (input.fullName.length >= 4 && input.email && input.password?.length >= 5) {
            // fetches userlist to validate


            const generateUsername = async () => {
                let emailname = input.email.match(/^[^@]+/)[0];
                for (let i = 0; i <= 100; i++) {
                    let { status, isUserValidate } = await validateUsername(emailname)
                    if (isUserValidate) {
                        break;
                    } else {
                        emailname = `${emailname}${i}`
                    }
                }

                return emailname
            }


            try {
                const userName = await generateUsername()
                const postData = {
                    ...input,
                    userName,
                    authBy: "email"
                }
                // console.log(postData);

                setLoading(true)
                await axios.post('/user/create-user', postData)
                    .then(async () => {
                        try {
                            await axios.post('/user/login-user', { email: input.email, password: input.password })
                                .then(() => {
                                    setLoading(false)
                                    navigate('/')
                                    window.location.reload()
                                })
                        } catch (error) {
                            // console.log(error);
                        }
                    })
            } catch (error) {
                setLoading(false)
                toast.error("Unable to create account")
                // console.log(error);

            }
        }
        if (input.fullName.length < 4) {
            toast.error("Full name lenght must be 4 or more ")
        }

        if (input.password.length < 5) {
            toast.error("Password lenght must be 5 or more ")
        }
    }

    // Register user by google
    const [googleLoader, setGoogleLoader] = useState(false)
    const handleGoogleRegistration = async () => {
        setGoogleLoader(true)
        window.location.href = `${process.env.REACT_APP_PROXY_URL}/api/v1/user/google-login`
    }

    // handle page title
    useEffect(() => {
        document.title = "Inkflows - Connect yourself with us!"
    }, [])

    return (
        <div>
            <div className='mb-5  if-auth-page-header'>
                <h2>Register yourself on <span className='if-col-blue'>Inkflows</span> </h2>
            </div>
            <div className='mb-5'>
                <div className='mb-4'>
                    <PopInput placeholder='Enter full name' onChange={(e) => setInput({ ...input, fullName: e })} />
                </div>
                <div className='mb-4'>
                    <PopInput placeholder='Enter email' type='email' onChange={(e) => setInput({ ...input, email: e })} />
                </div>
                <div>
                    <PopInput placeholder='Create password' type='password' onChange={(e) => setInput({ ...input, password: e })} />
                </div>
                <div className='mt-3'>
                    <span className='if-font-s if-col-fade'>Already have an account?</span> <Link className='if-url-coloured' to='/auth/login'>Log in</Link>
                </div>
                <div className='mt-1'>
                    <span className='if-font-s if-col-fade'>When you create account, you will accept our</span> <Link className='if-url-coloured' to='/terms-conditions' target='_blank'>terms and conditions</Link>
                </div>

            </div>
            <div className='d-flex justify-content-end'>
                <button className="if-btn-2 if-login-btn" onClick={handleEmailRegistration}>
                    {loading && <DotSpinner />}
                    <span>Create Account</span>
                    <span><i className="ri-login-circle-line"></i></span>
                </button>
            </div>
            <div className='if-or-flag mt-4'></div>
            <div className='mx-3 mb-4'>
                <button className="if-btn-2 if-login-page-lg-btn" onClick={handleGoogleRegistration} disabled={googleLoader} >
                    {googleLoader && <DotSpinner />}
                    <span><img src={googleSvg} width={22} alt="" draggable={false} /></span>
                    <span>Sign up with Google</span>
                </button>
            </div>
        </div>
    )
}

export {
    AuthenticationPage,
    LoginBox,
    RegistrationBox
}