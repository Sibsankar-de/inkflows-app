import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const PrivacyTermsPage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Inkflows - Privacy terms"
    }, [])
    return (
        <div>
            <div className='container'>
                <div className='mb-5'>
                    <h1>Privacy Terms for Inkflows</h1>
                </div>
                <div>
                    <span>
                        Welcome to Inkflows! Your privacy is important to us. This Privacy Terms page outlines how we collect, use, and protect your information when you create an account, write blogs, and interact with our platform.
                    </span>
                </div>
                <div className='d-grid gap-5 my-5'>
                    <div>
                        <h3 className='mb-4'>1. Information We Collect</h3>
                        <div>
                            <p>When you use Inkflows, we may collect the following types of information:</p>
                            <ul>
                                <li>
                                    <strong>Personal Information: </strong>
                                    <span>This includes your name, email address, and any other information you provide when creating a user profile.</span>
                                </li>
                                <li>
                                    <strong>Profile Information: </strong>
                                    <span>Information you choose to include in your profile, such as a profile picture, bio, or any other optional details you wish to share.</span>
                                </li>
                                <li>
                                    <strong>Content Data: </strong>
                                    <span>This includes the blogs you write, comments you post, and other content you share on Inkflows.</span>
                                </li>
                                <li>
                                    <strong>Usage Data: </strong>
                                    <span>We collect information about your interactions with the platform, such as page views, time spent on pages, and navigation through our website.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h3 className='mb-4'>2. How We Use Your Information</h3>
                        <div>
                            <p>The information we collect is used for the following purposes:</p>
                            <ul>
                                <li>
                                    <strong>To Provide and Improve Our Services: </strong>
                                    <span>We use your information to operate, maintain, and enhance the features and functionality of Inkflows.</span>
                                </li>
                                <li>
                                    <strong>Personalization: </strong>
                                    <span>To personalize your experience on Inkflows, including recommending content and tailoring the content displayed based on your interests.</span>
                                </li>
                                <li>
                                    <strong>Communication: </strong>
                                    <span>To communicate with you about your account, blog updates, or changes to our policies.
                                    </span>
                                </li>
                                <li>
                                    <strong>Security: </strong>
                                    <span>To detect and prevent fraudulent activity, abuse, or other harmful activity.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h3 className='mb-4'>3. Profile and Content Visibility</h3>
                        <div>
                            <ul>
                                <li>
                                    <strong>Public Profiles:</strong>
                                    <span>Your profile on Inkflows is public by default, which means your name, profile picture, and other profile information you choose to share are visible to other users. You have the option to edit or remove this information at any time through your account settings.</span>
                                </li>
                                <li>
                                    <strong>Public Blogs: </strong>
                                    <span>Blogs that you create and publish on Inkflows are public and can be viewed by all users of the platform. You have the option to edit or delete your blogs at any time.</span>
                                </li>
                                <li>
                                    <strong>Comments and Interactions: </strong>
                                    <span>Any comments or interactions you make on Inkflows are public and may be visible to other users.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h3 className='mb-4'>4. Data Sharing and Disclosure
                        </h3>
                        <div>
                            <ul>
                                <li>
                                    <strong>Third-Party Services: </strong>
                                    <span>We may use third-party services to help operate our platform, such as analytics providers or hosting services. These services may have access to your information only to perform tasks on our behalf and are obligated not to disclose or use it for other purposes.</span>
                                </li>
                                <li>
                                    <strong>Legal Requirements: </strong>
                                    <span>We may disclose your information if required by law, regulation, or legal request, or if we believe disclosure is necessary to protect the safety, rights, or property of Inkflows, its users, or the public.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h3 className='mb-4'>5. Data Retention</h3>
                        <div>
                            We retain your personal information and content for as long as your account is active or as needed to provide you with our services. You can delete your account or any content you have created at any time through your account settings.
                        </div>
                    </div>
                    <div>
                        <h3 className='mb-4'>6. Your Rights</h3>
                        <div>
                            <p>You have the following rights regarding your information:</p>
                            <ul>
                                <li>
                                    <strong>Access and Correction: </strong>
                                    <span>You have the right to access and correct your personal information at any time through your account settings.</span>
                                </li>
                                <li>
                                    <strong>Deletion: </strong>
                                    <span>You can delete your account and all associated data at any time. Deleting your account will permanently remove all your information from our servers.</span>
                                </li>
                                <li>
                                    <strong>Opt-Out: </strong>
                                    <span>You can opt out of receiving promotional communications from us by following the unsubscribe instructions provided in those communications.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h3 className='mb-4'>7. Security</h3>
                        <div>
                            We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no internet or email transmission is ever fully secure or error-free, so you should take special care in deciding what information you send to us.
                        </div>
                    </div>
                    <div>
                        <h3 className='mb-4'>8. Changes to This Privacy Terms</h3>
                        <div>
                            We may update our Privacy Terms from time to time. If we make any material changes, we will notify you by email (sent to the email address specified in your account) or by means of a notice on our website before the change becomes effective.
                        </div>
                    </div>
                    <div className='justify-self-center'>
                        <button className="if-btn-2 if-btn-blue--grad" onClick={() => navigate(-1)}>Accept</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
