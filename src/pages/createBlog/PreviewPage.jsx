import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BlogViewer } from '../../components/Blogviewer/BlogViewer'
import axios from '../../configs/axios-configs'
import { useCurrentUser } from '../../hooks/get-currentuser'

export const PreviewPage = () => {
    const navigate = useNavigate()
    const params = useParams()
    const blogId = params.blogId
    // Fetch blog from Id
    const [blog, setBlog] = useState(null);
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                await axios.get(`/blog/get-blog/${blogId}`)
                    .then((res) => {
                        setBlog(res?.data?.data)
                    })
            } catch (error) {
                console.log(error);
                if (error?.response?.status === 402 || error?.response?.status === 500) navigate('*')
            }
        }
        fetchBlog()
    }, [blogId])

    // Throws unauthorised requests
    const currentUser = useCurrentUser();
    useEffect(() => {
        if (blog && currentUser && blog?.creator !== currentUser?._id) {
            navigate('*')
        }
    }, [blog, currentUser])

    // Back button click handler
    const backBtnHandler = () => {
        if (blogId) navigate(`/create/new?edit=true&editId=${blogId}`)
    }


    // handle page title
    useEffect(() => {
        document.title = blog?`Preview - ${blog?.blogTitle}`:"Loading..."
    }, [blog])

    return (
        <div className='container if-blog-preview-container'>
            <div className='if-font-s'>
                <span>This is a preview of your blog. <a href="">Learn more</a></span>
            </div>
            <div>
                <BlogViewer blogData={blog} />
            </div>
            <div className='if-blog-edit-p-btm-btn-box mb-4'>
                <div>
                    <button className='if-btn-2' onClick={backBtnHandler} ><span><i className="ri-arrow-left-s-line"></i></span><span>Back to edit</span></button>
                </div>
                <div>
                    <button className='if-btn-2 if-btn-blue--grad' onClick={() => navigate(`/create/publish/${blogId}`)}><span>Save & Continue</span><span><i className="ri-arrow-right-s-line"></i></span></button>
                </div>
            </div>
        </div>
    )
}
