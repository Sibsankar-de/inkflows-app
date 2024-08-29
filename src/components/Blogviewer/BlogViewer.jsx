import React, { useEffect, useState } from 'react'
import "./blogview.style.css"
import parse from 'html-react-parser';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'react-toastify';

export const BlogViewer = ({ blogData }) => {
    const [blog, setBlog] = useState(null)
    useEffect(() => {
        if (blogData) {
            setBlog(blogData)
        }
    }, [blogData])

    // Set margin bottom for containers
    const setStyle = (margin) => {
        return { marginBottom: margin }
    }


    return (
        <div className='if-blog-container'>
            <section className='mb-5 if-blog-title-box'>
                <div>
                    <h1 className='poppins-bold'>{blog?.blogTitle}</h1>
                </div>
            </section>
            <section className='if-blog-content-box'>
                {
                    blog?.contentList?.map((item, index) => {
                        return <React.Fragment key={index}>

                            {item?.type === 'text' &&
                                <div style={setStyle(item?.mb)}>
                                    <TextViewer content={item?.content} />
                                </div>
                            }
                            {item?.type === 'code' &&
                                <div style={setStyle(item?.mb)}>
                                    <CodeViewer content={item?.content} />
                                </div>
                            }
                            {item?.type === 'image' &&
                                <div style={setStyle(item?.mb)}>
                                    <ImgViewer content={item?.content} />
                                </div>
                            }
                            {item?.type === 'ytvideo' &&
                                <div style={setStyle(item?.mb)}>
                                    <VideoViewer content={item?.content} />
                                </div>
                            }
                        </React.Fragment>
                    })
                }
            </section>
        </div>
    )
}

const TextViewer = ({ content }) => {
    return (
        <div className='if-blog-view-text-content'>
            {content?.value && parse(content?.value)}
        </div>
    )
}

const ImgViewer = ({ content }) => {
    return (
        <div className='if-blog-view-img-content'>
            <div className='if-blog-view-img-box'>
                <img src={content?.value || require('../../assets/img/blank-image.png')} alt="" draggable={false} />
            </div>
            <div className='if-img-short-para'>
                <span>{content?.shortPara}</span>
            </div>
        </div>
    )
}

const CodeViewer = ({ content }) => {
    // Changes theme of the highlighter
    const [editorTheme, setEditorTheme] = useState(oneLight)
    useEffect(() => {
        const theme = localStorage.getItem("theme") || "light"
        theme === "dark" ? setEditorTheme(oneDark) : setEditorTheme(oneLight)
    })

    // Copy to clipbaord handler
    const [isCopied, setIsCopied] = useState(false)
    const handleCopy = async () => {
        if (!isCopied) {
            try {
                await navigator?.clipboard.writeText(content?.value)
                setIsCopied(true);
                toast.success("Code copied to clipboard")
                setTimeout(() => setIsCopied(false), 3000)
            } catch (error) {
                // console.log(error);
            }
        }
    }
    return (
        <div className='if-blog-view-code-block-container'>
            <div className='if-blog-view-code-block-content'>
                <div className='if-code-blog-head-bar'>
                    <div>{content?.codelang || 'javascript'}</div>
                    <div className='justify-self-end'>
                        <button className='if-btn' onClick={handleCopy}>
                            <span><i className={`bi bi-clipboard${isCopied ? "-check" : ''} mx-2`}></i></span>
                            <span>Cop{isCopied ? 'ied' : 'y'}</span>
                        </button>
                    </div>
                </div>
                <div className='if-blog-view-code-block'>
                    <SyntaxHighlighter
                        language={content?.codelang || 'javascript'}
                        showLineNumbers={true}
                        style={editorTheme}
                    >
                        {content?.value}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    )
}

const VideoViewer = ({ content }) => {
    return (
        <div className='if-video-viewer-container'>
            <iframe src={content?.value} allowFullScreen={true} className='if-blog-view-video-player' ></iframe>
        </div>
    )
}
