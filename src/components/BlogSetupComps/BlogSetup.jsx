import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import "./blogSetup.style.css"

export const BlogSetup = ({ data, onChangeBlog }) => {

    const [blogData, setBlogData] = useState({})

    useEffect(() => {
        if (data) setBlogData(data)
    }, [data])

    // handle inputs from editors
    const editorChangeHandler = (inputType, input) => {
        setBlogData({ ...blogData, [inputType]: input })
    }

    // flows data to parent
    useEffect(() => {
        onChangeBlog(blogData)
    }, [blogData])

    return (
        <div className='if-blog-set-up-box'>
            <div>
                <div className='mb-4'>
                    <h5>Update Thumbnail</h5>
                </div>
                <div><ThumbnailImgBox onChange={e => editorChangeHandler('thumbnail', e)} currentImg={data?.thumbnail} /></div>
            </div>
            <div>
                <div className='mb-4'><h5>Add searching tags</h5></div>
                <div><TagBox onChange={e => editorChangeHandler('tagList', e)} list={blogData.tagList} /></div>
            </div>
        </div>
    )
}

const ThumbnailImgBox = ({ currentImg, onChange }) => {
    const [imageInput, setImageInput] = useState(null)

    const [activeThumbnail, setActiveThumbnail] = useState({ type: 'genImg', img: currentImg })

    // Flows data to parent
    useEffect(() => {
        onChange(activeThumbnail?.img)
    }, [activeThumbnail])

    return (
        <div className='if-add-thumbnail-box'>
            <div>
                <label htmlFor="thumbnail-image-input">
                    <div className='if-thumbnail-uploader-box'>
                        <span><i className="ri-image-add-fill"></i></span>
                    </div>
                </label>
                <input type="file" name="thumbnail-image-uploader" id="thumbnail-image-input" accept='image/*' className='d-none' onChange={async e => setImageInput(e.target.files[0])} />
            </div>
            {currentImg && <div className='if-uploaded-thumbnail-img-box'>
                <label htmlFor={`img-gen`} className="if-uploaded-thumbnail-label">
                    <img src={currentImg} alt="" className={`${activeThumbnail.type === 'genImg' ? 'if-active-thumbnail' : ''}`} />
                    {activeThumbnail.type === 'genImg' && <div className='if-thumbnail-opt-tic'><i class="ri-check-line"></i></div>}
                </label>
                <input type="radio" name="thumb-img" id={`img-gen`} className='d-none' onChange={() => setActiveThumbnail({ type: 'genImg', img: currentImg })} />
            </div>}
            {imageInput && <div className='if-uploaded-thumbnail-img-box'>
                <label htmlFor={`img-upload`} className="if-uploaded-thumbnail-label">
                    <img src={URL.createObjectURL(imageInput)} alt="" className={`${activeThumbnail.type === 'uploadImg' ? 'if-active-thumbnail' : ''}`} />
                    {activeThumbnail.type === 'uploadImg' && <div className='if-thumbnail-opt-tic'><i class="ri-check-line"></i></div>}
                </label>
                <input type="radio" name="thumb-img" id={`img-upload`} className='d-none' onChange={() => setActiveThumbnail({ type: 'uploadImg', img: imageInput })} />
            </div>}
        </div>
    )
}

const TagBox = ({ list, onChange }) => {

    const [tagList, setTagList] = useState([])
    const [showPlaceholder, setShowPlaceHolder] = useState(true)
    useEffect(() => {
        list && setTagList(list)
        if (list?.length > 0) setShowPlaceHolder(false)
    }, [list])

    const inputRef = useRef(null)
    const tagBoxClickHandler = () => {
        if (tagList?.length === 0) {
            setShowPlaceHolder(false)
        }
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }, 50)
    }
    const [tagInput, setTagInput] = useState('')
    const inputChangeHandler = (e) => {
        const value = e.target.value
        if (value.length <= 70) {
            setTagInput(value)
        }
    }

    const submitHandler = (e) => {
        e?.preventDefault()
        if (tagList?.length < 9) {
            if (!tagList?.includes(tagInput) && tagInput?.trim().length > 0) {
                setTagList([...tagList, tagInput.trim()])
                setTagInput('')
            } else if (tagList?.includes(tagInput)) {
                toast.warn("Don't need to use same tags")
            }
        } else {
            toast.warn('You can add maximum 9 tags')
        }
    }

    // Tag box blur handler 
    const handleBlur = () => {
        tagList.length === 0 && setShowPlaceHolder(true)
        submitHandler()
    }
    const tagRemoveHandler = tag => {
        setTagList(tagList.filter(e => {
            return e !== tag
        }))
    }

    useEffect(() => {
        onChange(tagList)
    }, [tagList])


    return (
        <ul className='if-tag-textarea' onClick={tagBoxClickHandler}>
            {
                tagList?.map((tag, index) => {
                    return (
                        <li className='if-tag-item' key={index}>
                            <div className='if-tag-para'>{tag}</div>
                            <div onClick={() => tagRemoveHandler(tag)} className='c-pointer'><i className="ri-close-circle-fill fs-5"></i></div>
                        </li>
                    )
                })
            }

            {!showPlaceholder && <div>
                <form action="" onSubmit={submitHandler}>
                    <input type="text" placeholder='Type a tag' className='if-tag-input' onChange={inputChangeHandler} value={tagInput} ref={inputRef} onBlur={handleBlur} />
                </form>
            </div>}
            {(tagList?.length === 0 && showPlaceholder) && <div>Click to type tags. Press 'enter' to add tags</div>}
        </ul>
    )
}
