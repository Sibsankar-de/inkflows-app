import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import "./blogSetup.style.css"
import { Dropdown } from '../dropdown/Dropdown'
import axios from '../../configs/axios-configs'
import AuthContext from '../../contexts/AuthContext'

export const BlogSetup = ({ data, onChangeBlog }) => {

    const [blogData, setBlogData] = useState({})

    useEffect(() => {
        if (data) setBlogData(data)
    }, [data])

    // handle inputs from editors
    const editorChangeHandler = (inputType, input) => {
        setBlogData({ ...blogData, [inputType]: input })
    }


    // get active contributor list 
    const [contributorList, setContributorList] = useState(null);
    useEffect(() => {
        const fetchList = async () => {
            try {
                await axios.get(`/blog/contributor-list/${blogData?._id}`)
                    .then(res => {
                        setContributorList(res.data?.data);
                    })
            } catch (error) {

            }
        }

        if (blogData) fetchList();
    }, [blogData]);

    // get all users list
    const [searchInput, setSearchInput] = useState("");
    const [openDropdown, setOpenDropdown] = useState(false);
    const [userList, setUserList] = useState(null);
    useEffect(() => {
        const fetchUserList = async () => {
            try {
                await axios.get("/user/get-userlist")
                    .then(res => {
                        setUserList(res.data?.data);
                    })
            } catch (error) {

            }
        }
        fetchUserList();
    }, [openDropdown]);

    // filter userlist
    const [filteredList, setFilteredList] = useState([]);
    const { currentUser } = useContext(AuthContext);
    useEffect(() => {
        if (userList && searchInput) {
            setFilteredList(userList?.filter(e => e?._id != currentUser?._id && (e?.userName?.includes(searchInput.toLowerCase()) || e?.email?.includes(searchInput.toLowerCase())) && !contributorList?.some(cont => e?._id === cont?.userId)));
        }
    }, [userList, searchInput, currentUser, contributorList]);

    // handle open close dropdown
    useEffect(() => {
        if (searchInput) setOpenDropdown(true)
        else setOpenDropdown(false)
    }, [searchInput]);

    // handle add new contributors
    const addContributor = async (contributor) => {
        if (!data || !contributor) return;
        const postData = {
            blogId: data._id,
            contributorId: contributor._id
        }
        try {
            await axios.post("/blog/add-contributor", postData)
                .then((res) => {
                    toast.success("Contributor added");
                    setContributorList([...contributorList, res.data?.data]);
                    setOpenDropdown(false);
                    setSearchInput("");
                })
        } catch (error) {
            if (error.response?.status === 402) toast.warn("Contributor already exist");
            else toast.error("Failed to add contributor");
        }
    }

    // remove contributions
    const removeContribution = async (contribution) => {
        if (!contribution) return;
        try {
            await axios.patch(`/blog/remove-contribution/${contribution?._id}`)
                .then(() => {
                    toast.info(`${contribution?.userName} removed from contributor`);
                    setContributorList(contributorList.filter(e => e?._id !== contribution?._id));
                })
        } catch (error) {
            toast.error("Failed to remove contributor");
        }
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
            <div>
                <h5 className='mb-3'>Add Contributors</h5>
                <div>
                    <div style={{ position: "relative" }} className='mb-3'>
                        {blogData?.creator === currentUser?._id &&
                            <input type="text" className='if-input mb-1' placeholder='Type email or username of a contributor' onChange={(e) => setSearchInput(e.target.value)} value={searchInput} />
                        }
                        <div>
                            <Dropdown openState={openDropdown} className='if-contributor-find-dropdown' onClose={() => setOpenDropdown(false)} closeOnBackClick>
                                <ul>
                                    {filteredList?.length === 0 && <p>No matches found!</p>}
                                    {filteredList?.map((item, index) => {
                                        return (
                                            <li key={index} className='mb-2' onClick={() => addContributor(item)}>
                                                <img src={item?.avatar || require("../../assets/img/profile-img.png")} alt="" className='rounded-5' width={40} />
                                                <p className='mb-0'>{item?.userName}</p>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div>
                        <h6 className='mb-3'>Active contributors</h6>
                        {contributorList && <ul className='m-0 p-0 d-flex flex-wrap gap-3'>
                            {contributorList?.length === 0 && <p>No active contributors</p>}
                            {contributorList?.map((item, index) => {
                                return <ContributorItem key={index} data={item} onRemove={() => removeContribution(item)} blogData={blogData} currentUser={currentUser} />
                            })}
                        </ul>}
                    </div>
                </div>
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
                    {activeThumbnail.type === 'genImg' && <div className='if-thumbnail-opt-tic'><i className="ri-check-line"></i></div>}
                </label>
                <input type="radio" name="thumb-img" id={`img-gen`} className='d-none' onChange={() => setActiveThumbnail({ type: 'genImg', img: currentImg })} />
            </div>}
            {imageInput && <div className='if-uploaded-thumbnail-img-box'>
                <label htmlFor={`img-upload`} className="if-uploaded-thumbnail-label">
                    <img src={URL.createObjectURL(imageInput)} alt="" className={`${activeThumbnail.type === 'uploadImg' ? 'if-active-thumbnail' : ''}`} />
                    {activeThumbnail.type === 'uploadImg' && <div className='if-thumbnail-opt-tic'><i className="ri-check-line"></i></div>}
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

const ContributorItem = ({ data, onRemove, blogData, currentUser }) => {
    return (
        <li className='if-contributor-item'>
            <div className='d-grid'>
                <img src={data?.avatar || require("../../assets/img/profile-img.png")} alt="" className='rounded-5 mb-2' width={60} />
                {blogData?.creator === currentUser?._id &&
                    <span className='if-contributor-remove-btn' onClick={onRemove}><i class="ri-close-circle-fill"></i></span>
                }
            </div>
            <p className='mb-0 text-break text-center'>{data?.userName}</p>
        </li>
    )
}