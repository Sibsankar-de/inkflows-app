import React, { useEffect, useRef, useState } from 'react'
import "./toolbar.style.css"
import { SketchPicker } from 'react-color'
import { SelectDropdown } from '../../utils/dropdown/SelectDropdown'

export const Toolbar = ({ activeState, onColorChange, onBgColorChange, toolbarRef, sectionId }) => {
    const [textColorOpen, setTextColorOpen] = useState(false)
    const [bgColorOpen, setBgColorOpen] = useState(false)
    const [colorHex, setColorHex] = useState('#267E92');
    const textColorRef = useRef(null)
    const bgColorRef = useRef(null)

    useEffect(() => {
        const handleClose = (e) => {
            if (textColorOpen && textColorRef.current && !textColorRef.current.contains(e.target)) {
                setTextColorOpen(false)
            }
            else if (bgColorOpen && bgColorRef.current && !bgColorRef.current.contains(e.target)) {
                setBgColorOpen(false)
            }
        }
        document.addEventListener('click', handleClose)
        return () => document.removeEventListener('click', handleClose)
    })

    return (
        <div className={`if-quill-toolbar-container ${!activeState && 'if-toolbar-deactive'}`} ref={toolbarRef} >
            <div id={`if-quill-toolbar--${sectionId}`} className='if-quill-toolbar'>
                <section className='if-toolbar-btn-sec'>
                    <div className='d-flex'>
                        <button className="ql-bold if-toolbar-btn"><i className="bi bi-type-bold"></i></button>
                        <button className="ql-italic if-toolbar-btn"><i className="bi bi-type-italic"></i></button>
                        <button className="ql-underline if-toolbar-btn"><i className="bi bi-type-underline"></i></button>
                        <button className="ql-strike if-toolbar-btn"><i className="bi bi-type-strikethrough"></i></button>
                    </div>
                    <span className='if-text-fade'>|</span>
                    <div className='d-flex'>
                        <button className="ql-link if-toolbar-btn">Link</button>
                        <button className="ql-blockquote if-toolbar-btn">blockquote</button>
                    </div>
                    <span className='if-text-fade'>|</span>
                    <div className='d-flex'>
                        <button className="ql-header if-toolbar-btn" value='2'><i className="bi bi-type-h2"></i></button>
                        <button className="ql-header if-toolbar-btn" value='3'><i className="bi bi-type-h3"></i></button>
                        <button className="ql-header if-toolbar-btn" value='4'><i className="bi bi-type-h4"></i></button>
                    </div>
                    <span className='if-text-fade'>|</span>
                    <div className='d-flex'>
                        <button className="ql-align if-toolbar-btn" value='justify'>justify</button>
                        <button className="ql-align if-toolbar-btn" value='center'>center</button>
                        <button className="ql-align if-toolbar-btn" value='right'>right</button>
                    </div>
                    <span className='if-text-fade'>|</span>
                    <div className='d-flex'>
                        <button className="ql-list if-toolbar-btn" value='ordered'>ordered</button>
                        <button className="ql-list if-toolbar-btn" value='bullet'>bullet</button>
                        <button className="ql-list if-toolbar-btn" value='check'>check</button>
                    </div>
                    <span className='if-text-fade'>|</span>
                    <div className='d-flex'>
                        <button className="ql-indent if-toolbar-btn" value='+1'>indent</button>
                        <button className="ql-indent if-toolbar-btn" value='-1'>indent</button>
                    </div>
                    <span className='if-text-fade'>|</span>
                    <div className='if-color-picker-btn-box'>
                        <button className="if-toolbar-btn" onClick={() => setTextColorOpen(!textColorOpen)}><i className="ri-font-color"></i></button>
                        <SelectDropdown activeState={textColorOpen} className='if-editor-toolbar-color-picker' boxRef={textColorRef}>
                            <SketchPicker
                                onChangeComplete={(color) => {
                                    onColorChange(color.hex)
                                    setColorHex(color.hex)
                                }}
                                color={colorHex}
                            />
                        </SelectDropdown>

                        <button className="if-toolbar-btn" onClick={() => setBgColorOpen(!bgColorOpen)} ><i className="bi bi-paint-bucket"></i></button>
                        <SelectDropdown activeState={bgColorOpen} className='if-editor-toolbar-color-picker' boxRef={bgColorRef}>
                            <SketchPicker
                                onChangeComplete={(color) => {
                                    onBgColorChange(color.hex)
                                    setColorHex(color.hex)
                                }}
                                color={colorHex}
                            />
                        </SelectDropdown>
                    </div>
                </section>
            </div>
        </div>
    )
}
