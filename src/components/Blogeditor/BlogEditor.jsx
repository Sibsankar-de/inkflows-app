import React, { useState, useEffect, useRef } from 'react'
import './blogEditor.style.css'
import 'react-quill/dist/quill.snow.css';
import 'quill-better-table/dist/quill-better-table.css';

import { Tooltip } from 'react-tooltip'
import ReactQuill from 'react-quill'
import { Toolbar } from './Toolbar.jsx'
import { Editor } from '@monaco-editor/react'
import { SelectDropdown } from '../../utils/dropdown/SelectDropdown.jsx'
import { closeOnBackClick } from '../../utils/functions/closeOnBackClick.js'
import { Spinner } from '../../components/LoadingSpinner/Spinner.jsx'
import { toast, ToastContainer } from 'react-toastify';

export const BlogEditor = ({ data, onChange }) => {

    // Blog title handler
    const [blogTitle, setBlogTitle] = useState('')

    //Content box creation 
    const [contentList, setContentList] = useState([])
    useEffect(() => {
        if (data) {
            setContentList(data?.contentList)
            setBlogTitle(data?.blogTitle)
        }
    }, [data])

    const handleContentCreate = (type) => {
        const id = contentList?.length > 0 ? contentList[contentList?.length - 1].sectionId + 1 : 0
        // Removes box if it is empty
        const lastIndex = contentList?.length - 1
        if (contentList?.length >= 1) {
            if (contentList[lastIndex].content?.value) {
                setContentList([...contentList, { sectionId: id, type: type }])
            }
            else {
                let list = [...contentList]
                list.splice(lastIndex, 1)
                setContentList([...list, { sectionId: id, type: type }])
            }
        }
        else if (contentList?.length === 0) {
            setContentList([...contentList, { sectionId: id, type: type }])
        }

    }

    // Handle input from fields
    const handleContent = (content, sectionId) => {
        const index = contentList?.findIndex(e => e.sectionId === sectionId)
        let list = [...contentList]
        if (index !== -1) {
            list[index] = { ...list[index], content }
            setContentList(list)
        } else {
            setContentList(contentList)
        }

    }

    // Handle margin add to btm
    const handleMarginAdd = (margin, sectionId) => {
        const index = contentList?.findIndex(e => e.sectionId === sectionId)
        let list = [...contentList]
        if (index !== -1) {
            list[index] = { ...list[index], mb: margin }
            setContentList(list)
        } else {
            setContentList(contentList)
        }
    }

    // Data flow
    useEffect(() => {
        onChange({ contentList, blogTitle })
    }, [contentList, blogTitle])

    return (
        <div>
            <section className='if-blog-edit-container'>
                <div>
                    <h2><input type="text" placeholder='Title of the blog*' className='if-blog-title-input' onChange={e => setBlogTitle(e.target.value)} value={blogTitle} /></h2>
                </div>
            </section>
            <section className='mt-3 if-add-blog-editor-section'>
                {
                    contentList?.map((item, index) => {
                        return (
                            <ContentSection key={index} section={item} onContentChange={cont => handleContent(cont, item?.sectionId)} contentList={contentList} index={index} sectionId={item?.sectionId} onMarginAdd={handleMarginAdd} />
                        )
                    })
                }
                <FieldAddSection onOptionClick={handleContentCreate} />
            </section>
            <Tooltip id='if-crb-ttip-id' />
        </div>
    )
}

const ContentSection = ({ section, onContentChange, contentList, index, sectionId, onMarginAdd }) => {
    // Handle gap flag
    const [showFlag, setShowFlag] = useState(false);
    useEffect(() => {
        if (contentList?.length !== index + 1) {
            setShowFlag(true)
        }
        else {
            setShowFlag(false)
        }
    }, [contentList])
    const [margin, setMargin] = useState(Number(section?.mb?.replace('px')) || 0)
    const style = {
        marginBottom: margin + 'px',
        transition: 'margin 0.2s'
    }
    useEffect(() => {
        onMarginAdd(margin + 'px', sectionId)
    }, [margin])
    return (
        <React.Fragment>

            {section?.type === 'text' &&
                <div style={style}>
                    <TextEditor content={section?.content} onContentChange={cont => onContentChange(cont)} sectionId={sectionId} />
                </div>
            }
            {section?.type === 'code' &&
                <div style={style}>
                    <CodeEditor content={section?.content} onContentChange={cont => onContentChange(cont)} />
                </div>
            }
            {section?.type === 'image' &&
                <div style={style}>
                    <ImageEditor content={section?.content} onContentChange={cont => onContentChange(cont)} />
                </div>
            }
            {section?.type === 'ytvideo' &&
                <div style={style}>
                    <VideoEditor content={section?.content} onContentChange={cont => onContentChange(cont)} />
                </div>
            }
            {showFlag && <div>
                <div className='if-gap-flag-box'>
                    <div className='if-gap-flag'>
                        <div className='if-gap-flag-cont'>
                            <span onClick={() => setMargin(margin + 5)}><i className="ri-add-line"></i></span>
                            <span>Gap</span>
                            {margin > 0 && <span onClick={() => setMargin(margin - 5)}><i className="ri-subtract-line"></i></span>}
                        </div>
                    </div>
                </div>
            </div>}

        </React.Fragment>
    )
}


const FieldAddSection = ({ onOptionClick }) => {
    // Add field button handlers
    const [addFieldActive, setAddFieldActive] = useState(false)
    const addFieldRef = useRef()
    useEffect(() => {
        closeOnBackClick(addFieldActive, addFieldRef, () => setAddFieldActive(false))
    })

    const btnClickHandler = type => {
        onOptionClick(type);
        setAddFieldActive(false)
    }
    return (
        <div className='d-flex gap-2 mt-4' ref={addFieldRef}>
            <button className='if-btn if-blog-comp-add-btn' data-tooltip-id='if-crb-ttip-id' data-tooltip-place='bottom' data-tooltip-delay-show={1500} data-tooltip-content={'Add fields'} onClick={() => setAddFieldActive(!addFieldActive)} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={` ${addFieldActive && 'if-blog-comp-add-btn-active'}`} viewBox="0 0 16 16">
                    <path className='if-text-fade' d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path className='if-col-blue' d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
            </button>
            <div>
                <SelectDropdown activeState={addFieldActive}>

                    <div>
                        <button className='if-btn' onClick={() => btnClickHandler('text')}><span><i className="ri-file-text-line"></i></span> <span>Text</span></button>
                    </div>
                    <div>
                        <button className='if-btn' onClick={() => btnClickHandler('code')}><span><i className="ri-code-s-slash-line"></i></span> <span>Code block</span></button>
                    </div>
                    <div>
                        <button className='if-btn' onClick={() => btnClickHandler('image')}><span><i className="ri-image-add-fill"></i></span> <span>Image</span></button>
                    </div>
                    <div>
                        <button className='if-btn' onClick={() => btnClickHandler('ytvideo')}><span><i className="ri-youtube-fill"></i></span> <span>YouTube Video</span></button>
                    </div>
                </SelectDropdown>
            </div>
        </div>
    )
}

const TextEditor = ({ content, onContentChange, sectionId }) => {
    const editorRef = useRef(null)
    const editorBoxRef = useRef(null)

    // Handle toolbar open close
    const [toolbarActive, setToolbarActive] = useState(false)
    const toolbarRef = useRef(null)
    useEffect(() => {
        const handleClose = (e) => {
            if (toolbarActive && !editorBoxRef.current?.contains(e.target) && !toolbarRef.current?.contains(e.target)) {
                setToolbarActive(false)
            }
        }
        document.addEventListener('click', handleClose)
        return () => document.removeEventListener('click', handleClose)
    })

    const handleTextColorChange = (color) => {
        const editor = editorRef.current.getEditor();
        editor.format('color', color);
    };

    const handleBackgroundColorChange = (color) => {
        const editor = editorRef.current.getEditor();
        editor.format('background', color);
    };

    const modules = {
        toolbar: {
            container: `#if-quill-toolbar--${sectionId}`
        },
        clipboard: {
            matchVisual: false
        }
    }
    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'link', 'table', 'color', 'background', 'align', 'list', 'blockquote', 'code-block', 'indent'
    ];
    // Auto focus
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.getEditor().focus()
        }
    }, [])

    // handle input and pass value to parent
    const [input, setInput] = useState(content?.value || '')
    useEffect(() => {
        onContentChange({ value: input?.replace('<p><br></p>', '') })
    }, [input])

    return (
        <div className='if-blog-text-editor-box'>
            <Toolbar activeState={toolbarActive} onColorChange={handleTextColorChange} onBgColorChange={handleBackgroundColorChange} toolbarRef={toolbarRef} sectionId={sectionId} />
            <div ref={editorBoxRef}>
                <ReactQuill
                    formats={formats}
                    modules={modules}
                    className={'if-blog-text-editor'}
                    placeholder='Start adding text'
                    onFocus={() => setToolbarActive(true)}
                    ref={editorRef}
                    theme={'snow'}
                    onChange={e => setInput(e)}
                    value={input}
                />
            </div>
        </div>
    )
}

const CodeEditor = ({ content, onContentChange }) => {

    // Editor options
    const options = {
        automaticLayout: true
    }

    // Changes theme of the editor
    const [editorTheme, setEditorTheme] = useState("vs-light")
    useEffect(() => {
        const theme = localStorage.getItem("theme") || "light"
        theme === "dark" ? setEditorTheme("vs-dark") : setEditorTheme("vs-light")
    })

    // dropdown state management
    const [openDropdown, setOpenDropdown] = useState(false)
    const dropdownRef = useRef(null)
    useEffect(() => {
        closeOnBackClick(openDropdown, dropdownRef, () => setOpenDropdown(false))
    })
    // editor preffered languages
    const laguages = ['javascript', 'python', 'csharp', 'cpp', 'html', 'css', 'java', 'xml', 'json', 'php', 'sql', 'markdown', 'go', 'ruby', 'swift', 'kotlin', 'rust', 'perl', 'shell']
    const [selectedLang, setSelectedLang] = useState(content?.codelang || 'javascript')
    const handleLanguageSelection = lang => {
        setSelectedLang(lang)
        setOpenDropdown(false)
    }

    const configureLanguageFormat = (lang) => {
        if (lang === 'cpp') return 'C++'
        else if (lang === 'csharp') return 'C#'
        else if (lang === 'html') return 'HTML'
        else if (lang === 'css') return 'CSS'
        else return lang[0].toUpperCase() + lang.slice(1)
    }

    // handle input and pass value to parent
    const [input, setInput] = useState(content?.value || '')
    useEffect(() => {
        onContentChange({ value: input, codelang: selectedLang })
    }, [input])


    return (
        <div>
            <div className='if-code-lang-change-box'>
                <div>Choose language<i className="ri-arrow-right-s-line"></i></div>
                <div ref={dropdownRef}>
                    <button className='if-btn' onClick={() => setOpenDropdown(!openDropdown)}><span>{configureLanguageFormat(selectedLang)}</span><span><i className="ri-arrow-down-s-fill"></i></span> </button>
                    <div>
                        <SelectDropdown activeState={openDropdown} className='if-code-lang-dropdown if-scrollbar-thin'>
                            {
                                laguages.map((lang, index) => {
                                    return (
                                        <button className={`if-btn ${selectedLang === lang && 'if-marked-btn'}`} onClick={() => handleLanguageSelection(lang)} key={index}>{configureLanguageFormat(lang)}</button>
                                    )
                                })
                            }
                        </SelectDropdown>
                    </div>
                </div>

            </div>
            <Editor
                language={selectedLang}
                theme={editorTheme}
                height='70vh'
                width='100%'
                className='if-blog-add-code-editor'
                options={options}
                onChange={e => setInput(e)}
                value={input}
            />
        </div>
    )
}

const ImageEditor = ({ onContentChange, content }) => {
    const [imageFile, setImageFile] = useState(content?.value || null)
    const imgUploadHandler = async (e) => {
        const file = e.target.files[0]
        if (file?.size <= 5242880) {
            setImageFile(file)
        } else {
            toast.warn("File size must be within 5MB")
        }
    }

    // Set imageurl
    const [imageUrl, setImageUrl] = useState(null)
    useEffect(() => {
        if (imageFile && imageFile instanceof File) {
            setImageUrl(URL.createObjectURL(imageFile))
        } else {
            setImageUrl(imageFile)
        }
    }, [imageFile])

    const [shortPara, setShortPara] = useState(content?.shortPara || '')

    // pass value to parent
    useEffect(() => {
        onContentChange({ value: imageFile, shortPara })
    }, [imageFile, shortPara])

    return (
        <div className='if-img-uploader-box'>
            {!imageFile && <label htmlFor="if-img-uploader" className='d-flex align-items-center'>
                <div className='if-blog-image-upload-logo-box'>
                    <img src={require('../../assets/img/img-selector.png')} alt="" />
                    <span>Upload an image file within <strong>5MB</strong></span>
                </div>
                <input type="file" multiple accept='image/*' id='if-img-uploader' className='d-none' onChange={imgUploadHandler} />
            </label>}
            {imageFile &&
                <div>
                    <div className='if-img-preview-box'>
                        <img src={imageUrl} alt=" " />
                        <SelectDropdown activeState={true} className='if-preview-img-control-opt-box'>
                            <div>
                                <label htmlFor="if-upload-img-change">
                                    <span className='if-btn' data-tooltip-id='if-crb-ttip-id' data-tooltip-place='bottom' data-tooltip-content={'Change image'}>
                                        <i className="ri-camera-switch-fill"></i>
                                    </span>
                                </label>
                                <input type="file" className='d-none' multiple accept='image/*' id='if-upload-img-change' onChange={imgUploadHandler} />
                            </div>
                            <div>
                                <button className='if-btn' data-tooltip-id='if-crb-ttip-id' data-tooltip-place='bottom' data-tooltip-content={'Remove image'} onClick={() => setImageFile(null)}>
                                    <i className="ri-delete-bin-fill"></i>
                                </button>
                            </div>
                        </SelectDropdown>
                    </div>
                    <div className='mt-2'>
                        <input type="text" placeholder='Write a short line about image' className='if-img-short-para-input' onChange={e => setShortPara(e.target.value)} />
                    </div>
                </div>
            }
        </div>
    )
}

const VideoEditor = ({ onContentChange, content }) => {
    const [urlInput, setUrlInput] = useState(content?.value || '')
    const iframeRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [loadVideo, setLoadVideo] = useState(false)

    const modifyUrl = (url) => {
        if (url?.includes('/watch?v=')) {
            return url.trim().replace('/watch?v=', '/embed/')
        }
        else if (url?.includes('/shorts/')) {
            return url.trim().replace('/shorts/', '/embed/')
        } else { return url }
    }

    useEffect(() => {

        setLoading(true)
        if (modifyUrl(urlInput) && modifyUrl(urlInput).includes('https://www.youtube.com/embed/')) {
            setLoading(false)
        }
        else if (urlInput === null || urlInput.trim() === '') {
            setLoading(false)
        }
    }, [urlInput])

    const addVideoHandler = () => {
        if (!loading && urlInput && urlInput.includes('https://www.youtube.com/')) {
            setLoadVideo(true)
        }
    }

    //pass value to parent
    useEffect(() => {
        onContentChange({ value: modifyUrl(urlInput) })
    }, [urlInput])

    return (
        <div className='if-blog-video-editor-box'>
            {!loadVideo && <div className='if-blog-video-add-box'>
                <div>
                    <input type="text" placeholder='Ex@https://www.youtube.com/watch?v=<video_id>' className='if-input if-video-url-input' onChange={e => setUrlInput(e.target.value)} value={urlInput} />
                </div>
                {loading && <div className='d-flex gap-2'>
                    <span><Spinner width={30} /></span> <span>Fetching video...</span>
                </div>}
                <div className='justify-self-end'>
                    <button className="if-btn if-btn-green" onClick={addVideoHandler} disabled={loading} ><span>Add Video</span></button>
                </div>
            </div>}
            {loadVideo &&
                <div className='d-grid'>
                    <div>
                        <iframe src={modifyUrl(urlInput)} frameborder="0" className='if-blog-yt-video-preview-iframe' allowFullScreen ref={iframeRef} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                    </div>

                    <SelectDropdown activeState={true} className='if-video-preview-control-box'>
                        <div>
                            <button className='if-btn' data-tooltip-id='if-crb-ttip-id' data-tooltip-place='bottom' data-tooltip-content={'Edit url'} onClick={() => setLoadVideo(false)}>
                                <i className="ri-edit-box-fill"></i>
                            </button>
                        </div>
                        <div>
                            <button className='if-btn' data-tooltip-id='if-crb-ttip-id' data-tooltip-place='bottom' data-tooltip-content={'Remove Video'} onClick={() => { setLoadVideo(false); setUrlInput('') }}>
                                <i className="ri-delete-bin-fill"></i>
                            </button>
                        </div>
                    </SelectDropdown>
                </div>
            }
        </div>
    )
}
