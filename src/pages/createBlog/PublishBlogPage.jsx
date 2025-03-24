import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BlogSetup } from '../../components/BlogSetupComps/BlogSetup'
import { useCurrentUser } from '../../hooks/get-currentuser'
import axios from '../../configs/axios-configs'
import { toast } from 'react-toastify'
import { DotSpinner } from '../../components/LoadingSpinner/DotSpinner'

export const PublishBlogPage = () => {

    const navigate = useNavigate()
    const params = useParams()
    const blogId = params.blogId
    // Fetch blog from Id
    const [blog, setBlog] = useState(null);
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                await axios.get(`/blog/get-auth-blog/${blogId}`)
                    .then((res) => {
                        setBlog(res?.data?.data)
                    })
            } catch (error) {
                // console.log(error);
                if (error?.response?.status >= 400) navigate('*')
            }
        }
        fetchBlog()
    }, [blogId])

    // Get data from child
    const [blogSetupData, setBlogSetupData] = useState({})
    const handleSetupData = (data) => {
        setBlogSetupData(data)
    }

    // Upload thumbnail image
    const handleThumbnailUpload = async () => {
        let imageUrl = blogSetupData?.thumbnail
        if (imageUrl && imageUrl instanceof File) {
            try {
                const imageData = new FormData()
                imageData.append("image", blogSetupData?.thumbnail)
                await axios.post('/blog/upload-image', imageData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
                )
                    .then((res) => {
                        imageUrl = res?.data?.data?.imageUrl

                    })
            } catch (error) {
                // console.log(error);
            }
        }

        return imageUrl
    }

    // Save handler
    const handleSetupSave = async () => {
        // upload thumbnail iamge
        const thumbnail = await handleThumbnailUpload()

        // Update thumbnail
        try {
            await axios.patch('/blog/update-tnail', { blogId, thumbnail })
        } catch (error) {
            // console.log(error);
            if (error?.response?.status === 401) toast.error('You are not authorised to edit this blog')
        }

        // update taglist
        try {
            await axios.patch('/blog/update-tags', { blogId, tagList: blogSetupData?.tagList })
        } catch (error) {
            // console.log(error);
            if (error?.response?.status === 401) toast.error('You are not authorised to edit this blog')
        }

    }

    // Publish button handler
    const [publishLoader, setPublishLoader] = useState(false)
    const handlePublish = async () => {
        if (blogSetupData?.tagList?.length > 0) {
            setPublishLoader(true)
            try {
                await handleSetupSave()
                await axios.patch('/blog/upload-status', { blogId, status: 'public' })
                    .then(() => {
                        setPublishLoader(false)
                        toast.success("Blog uploaded successfully")
                        navigate('/home')
                    })
            } catch (error) {
                // console.log(error);
                setPublishLoader(false)
                toast.error('Unable to publish your blog')
            }
        }
        else {
            toast.error("Atleast one tag is required")
        }
    }

    // draft button handler
    const [draftLoader, setDraftLoader] = useState(false)
    const handleDraftSave = async () => {
        if (blogSetupData?.tagList?.length > 0) {
            setDraftLoader(true)
            try {
                await handleSetupSave()
                await axios.patch('/blog/upload-status', { blogId, status: 'draft' })
                    .then(() => {
                        setDraftLoader(false)
                        toast.success("Blog saved as draft")
                    })
            } catch (error) {
                // console.log(error);
                setDraftLoader(false)
            }
        }
        else {
            toast.error("Atleast one tag is required")
        }
    }


    // handle page title
    useEffect(() => {
        document.title = blog ? `Setup blog - ${blog?.blogTitle}` : "Loading..."
    }, [blog])

    return (
        <div className='container if-blog-publish-container'>
            <div className='if-blog-preview-btn-box'>
                <div className='d-flex align-items-center gap-2'>
                    <Link className='if-url-normal' to={`/create/new?edit=true&editId=${blogId}`}><div className='if-preview-btn'><i class="ri-arrow-left-s-line"></i> Edit</div></Link>
                    <h6 className='mb-0'>View your blog</h6>
                </div>
                <Link className='if-url-normal' to={`/create/preview/${blogId}`} target='_blank'><div className='if-preview-btn'>Show preview <i class="ri-arrow-right-s-line"></i></div></Link>
            </div>
            <div>
                <h4>Setup your upload</h4>
            </div>
            <div>
                <BlogSetup onChangeBlog={handleSetupData} data={blog} />
            </div>
            <div className='if-blog-edit-p-btm-btn-box mb-4'>
                <div>
                    <button className='if-btn-2 if-btn-green--grad' onClick={handleDraftSave} disabled={draftLoader || publishLoader}>
                        <span><i className="ri-draft-line"></i></span>
                        <span>{draftLoader ? "Saving..." : "Move to draft"}</span>
                    </button>
                </div>
                <div>
                    <button className='if-btn-2 if-btn-purple--grad' onClick={handlePublish} disabled={draftLoader || publishLoader}>
                        <span><i className="ri-earth-line"></i></span>
                        <span>{publishLoader ? "Publishing..." : "Publish"}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
