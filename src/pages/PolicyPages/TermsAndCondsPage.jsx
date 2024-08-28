import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const TermsAndCondsPage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Inkflows - Terms and conditions"
    }, [])
    return (
        <div className='container'>
            <div className='mb-5'>
                <h1>Terms and Conditions for Inkflows</h1>
            </div>
            <div>
                <span>
                    Welcome to Inkflows ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of our website, <a href="" className='if-url-coloured'>Inkflows.com</a>, and any related services provided by Inkflows. By accessing or using our website, you agree to comply with and be bound by these Terms.
                </span>
            </div>
            <div className='d-grid gap-5 my-5'>
                <div>
                    <h3 className='mb-4'>1. Acceptance of Terms</h3>
                    <div>
                        By using Inkflows, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use our website.
                    </div>
                </div>
                <div>
                    <h3 className='mb-4'>2. User Accounts</h3>
                    <div>
                        <ul>
                            <li>
                                <strong>Account Creation: </strong>
                                <span>To access certain features of Inkflows, you may be required to create an account. You must provide accurate and complete information when creating an account.</span>
                            </li>
                            <li>
                                <strong>Account Security: </strong>
                                <span>You are responsible for maintaining the confidentiality of your account login information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</span>
                            </li>
                            <li>
                                <strong>Account Termination: </strong>
                                <span>We reserve the right to suspend or terminate your account at any time, without prior notice, if you violate these Terms or engage in any activity that we deem harmful to Inkflows or other users.</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    <h3 className='mb-4'>3. User Content</h3>
                    <div>
                        <ul>
                            <li>
                                <strong>Ownership: </strong>
                                <span>You retain ownership of any content (e.g., blogs, comments, images) you create and publish on Inkflows. By posting content on our website, you grant us a non-exclusive, worldwide, royalty-free license to use, display, distribute, and modify your content in connection with the operation of Inkflows.</span>
                            </li>
                            <li>
                                <strong>Responsibility: </strong>
                                <span>You are solely responsible for the content you post on Inkflows. You agree not to post any content that is illegal, defamatory, obscene, abusive, or otherwise violates these Terms or any applicable law.</span>
                            </li>
                            <li>
                                <strong>Content Removal: </strong>
                                <span>We reserve the right to remove or modify any content that we believe violates these Terms or is otherwise objectionable, without prior notice.</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    <h3 className='mb-4'>4. Prohibited Activities</h3>
                    <div>
                        <span>When using Inkflows, you agree not to:</span>
                        <ul>
                            <li>Use the website for any unlawful purpose or in violation of any applicable laws.</li>
                            <li>Post or transmit any harmful, offensive, or inappropriate content.</li>
                            <li>Engage in any activity that disrupts or interferes with the proper functioning of the website.</li>
                            <li>Impersonate another person or entity or misrepresent your affiliation with any person or entity.</li>
                            <li>Attempt to gain unauthorized access to Inkflows, other users' accounts, or any related systems or networks.</li>
                        </ul>
                    </div>
                </div>
                <div>
                    <h3 className='mb-4'>5. Intellectual Property</h3>
                    <div>
                        <ul>
                            <li>
                                <strong>Website Content: </strong>
                                <span>All content and materials available on Inkflows, including text, graphics, logos, and software, are the property of Inkflows or its licensors and are protected by intellectual property laws.</span>
                            </li>
                            <li>
                                <strong>Trademarks: </strong>
                                <span>"Inkflows" and our logos are trademarks of Inkflows. You may not use these trademarks without our prior written consent.</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    <h3 className='mb-4'>6. Disclaimer of Warranties</h3>
                    <div>
                        Inkflows is provided on an "as-is" and "as-available" basis. We make no warranties or representations, express or implied, regarding the operation or availability of the website, or the accuracy, reliability, or completeness of any content.
                    </div>
                </div>
                <div>
                    <h3 className='mb-4'>7. Limitation of Liability</h3>
                    <div>
                        To the fullest extent permitted by law, Inkflows shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of the website, even if we have been advised of the possibility of such damages.
                    </div>
                </div>
                <div>
                    <h3 className='mb-4'>8. Indemnification</h3>
                    <div>
                        You agree to indemnify and hold Inkflows, its affiliates, officers, directors, employees, and agents harmless from any claims, liabilities, damages, losses, or expenses, including legal fees, arising out of your use of the website or your violation of these Terms.
                    </div>
                </div>
                <div>
                    <h3 className='mb-4'>9. Governing Law</h3>
                    <div>
                        These Terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law principles. Any disputes arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the courts located in [Your Jurisdiction].
                    </div>
                </div>
                <div>
                    <h3 className='mb-4'>10. Changes to These Terms</h3>
                    <div>
                        We may update these Terms from time to time. We will notify you of any changes by posting the updated Terms on this page with an updated effective date. Your continued use of Inkflows after the changes take effect constitutes your acceptance of the revised Terms.
                    </div>
                </div>
                <div className='justify-self-center'>
                    <button className="if-btn-2 if-btn-blue--grad" onClick={() => navigate(-1)}>Accept</button>
                </div>
            </div>
        </div>
    )
}
