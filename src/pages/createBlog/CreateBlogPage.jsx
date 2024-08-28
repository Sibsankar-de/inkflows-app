import React, { useEffect, useRef, useState } from 'react'
import "./createBlogPage.style.css"
import { BlogEditor } from '../../components/Blogeditor/BlogEditor'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from '../../configs/axios-configs'
import { toast } from 'react-toastify'
import { useCurrentUser } from '../../hooks/get-currentuser'
import { DotSpinner } from '../../components/LoadingSpinner/DotSpinner'
import { useScreenShotFromString } from '../../hooks/create-screenshot'
import { imageCompressor } from '../../utils/functions/imageCompressor'

export const CreateBlogPage = () => {
    const navigate = useNavigate()

    // Fetch current user
    const currentUser = useCurrentUser()

    // Handle blog from Blog editor
    const [data, setData] = useState(null)
    const handleEditorChange = (value) => {
        setData(value)
    }

    // Filter data
    const filterData = () => {
        let filterdData = {}
        if (data?.contentList?.length > 0 && data?.blogTitle?.length > 0) {
            filterdData = {
                contentList: data?.contentList?.filter(e => {
                    return e?.content?.value
                }),
                blogTitle: data?.blogTitle
            }

            return filterdData
        }
    }

    // handle image upload
    const handleImageUpload = async () => {
        const blogData = filterData()
        let contentList = blogData?.contentList || []
        for (let i in contentList) {
            const imageData = contentList[i]?.content?.value
            if (contentList && contentList[i]?.type === 'image' && imageData instanceof File) {
                // Compress image 
                const compressedImage = await imageCompressor(imageData, 0.5)
                const imageForm = new FormData()
                imageForm.append("image", compressedImage)
                try {

                    await axios.post('/blog/upload-image', imageForm, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    })
                        .then(res => {
                            contentList[i] = { ...contentList[i], content: { ...contentList[i]?.content, value: res?.data?.data?.imageUrl } }
                        })
                } catch (error) {
                    setSaveLoader(false)
                    toast.error("Unable to save. Try again")
                    console.log(error);
                }
            }
        }
        setData({ ...blogData, contentList })
        return contentList
    }

    // create a Thumbnail
    const createdTnail = useScreenShotFromString(data?.blogTitle, 'if-generated-thumbnail')
    const [genThumbnail, setGenThumbnail] = useState(null)
    useEffect(() => {
        if (createdTnail) setGenThumbnail(createdTnail)
    }, [createdTnail])

    const uploadThumbnail = async () => {
        let imageUrl = null
        if (createdTnail) {
            try {
                await axios.post('/blog/upload-image', { image: genThumbnail }, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                    .then((res) => {
                        if (res?.data?.data?.imageUrl) {
                            imageUrl = res?.data?.data?.imageUrl
                        }
                    })
            } catch (error) {
                console.log(error);
            }

            return imageUrl
        }
    }

    // Handle blog upload
    const [blog, setBlog] = useState(null)
    const [saveLoader, setSaveLoader] = useState(false)
    const [isBlogCreated, setIsBlogCreated] = useState(false);
    const handleBlogCreate = async () => {
        setSaveLoader(true)

        // upload Images of the blog and get url of that
        const contentList = await handleImageUpload();

        // handle Thumbnail upload
        const thumbnailImage = await uploadThumbnail()

        const blogData = filterData()
        try {
            const postData = {
                blogTitle: blogData?.blogTitle,
                contentList: contentList,
                thumbnail: thumbnailImage
            }
            await axios.post('/blog/create-blog', postData)
                .then((res) => {
                    setIsBlogCreated(true)
                    setBlog(res?.data?.data)
                    toast.success("Blog created successfully")
                    setSaveLoader(false)
                })
        } catch (error) {
            setSaveLoader(false)
            toast.error("Failed to save blog")
            console.log(error);
        }
    }

    // Handle edit for create page
    const [queries] = useSearchParams()
    const edit = queries.get('edit')
    const blogId = queries.get('editId')
    const [fetchedBlog, setFetchedBlog] = useState(null)
    useEffect(() => {
        const fetchBlog = async () => {
            await axios.get(`/blog/get-blog/${blogId}`)
                .then((res) => {
                    setData(res?.data?.data)
                    setFetchedBlog(res?.data?.data)

                })
                .catch(err => {
                    if (err?.response?.status === 402) navigate('*')
                })
        }
        if (edit && blogId) {
            fetchBlog()
        }
    }, [blogId, edit])

    const handleEditBlog = async () => {
        setSaveLoader(true)
        // upload Images of the blog and get url of that
        const contentList = await handleImageUpload();

        const blogData = filterData()
        const postData = {
            blogTitle: blogData?.blogTitle,
            contentList: contentList,
            blogId
        }
        try {
            await axios.patch('/blog/update-blog', postData)
                .then((res) => {
                    setBlog(res?.data?.data)
                    toast.success("Blog saved successfully")
                    setSaveLoader(false)
                })
        } catch (error) {
            console.log(error);
            setSaveLoader(false)
            if (error?.response?.status === 401) toast.error('You are not authorised to edit this blog')
        }
    }

    // handle Blog submission
    const handleBlogSubmit = async () => {
        const blogData = filterData()
        if (blogData?.blogTitle?.length > 10 && blogData?.contentList?.length > 0) {
            if ((edit && blogId && data) || isBlogCreated) {
                await handleEditBlog()
            } else {
                await handleBlogCreate()
            }
        }
        if (!blogData?.blogTitle?.length > 10) {
            toast.error("Blog title length must be 10 or more")
        }
        if (!blogData?.contentList?.length > 0) {
            toast.error("Atleast one Content is required")
        }
    }

    // Handle Continue btn
    const [nxtPage, setNxtPage] = useState(false)
    const handleContinue = async () => {
        await handleBlogSubmit();
        setNxtPage(true)
    }
    useEffect(() => {
        if (nxtPage && blog?._id) navigate(`/create/preview/${blog?._id}`)
    }, [nxtPage, blog])

    // handle page title
    useEffect(() => {
        document.title = `Inkflows - Craft a new think`
    }, [])

    return (
        <div className='container if-create-blog-page-container'>
            <div className='if-create-blog-header-box'>
                <button className='if-btn if-nav-btn' onClick={() => navigate(-1)}><i className="ri-arrow-left-line fs-4"></i></button>
                <div>
                    <span><h5>Start Writing the blog</h5></span>
                    <span><Link to={`/blog/66c8ae8de32820c13859ed7a`} className='if-url-coloured' href="">How to write blog?</Link></span>
                </div>
            </div>
            <div className='if-blog-editor-container'>
                <BlogEditor onChange={handleEditorChange} data={fetchedBlog} />
            </div>
            <div className='if-blog-edit-p-btm-btn-box mb-4'>
                <div>
                    <button className='if-btn-2 if-btn-green--grad' onClick={handleBlogSubmit} disabled={saveLoader}>
                        {saveLoader && <DotSpinner />}
                        <span><i className="ri-draft-line"></i></span>
                        <span>Save as draft</span>
                    </button>
                </div>
                <div>
                    <button className='if-btn-2 if-btn-blue--grad' disabled={saveLoader} onClick={handleContinue} >
                        <span>Continue to preview</span>
                        <span><i className="ri-arrow-right-s-line"></i></span>
                    </button>
                </div>
            </div>
        </div>
    )
}


