import React, { useEffect, useRef, useState } from 'react'
import { closeOnBackClick } from '../../utils/functions/closeOnBackClick'
import "./searchbox.style.css"
import { addListToDb, clearListFromDb, getListFromDb } from './settingIndexedDB'
import axios from '../../configs/axios-configs'
import { Link, useNavigate } from 'react-router-dom'



export const SearchBox = ({ openState, onClose, input, onWrite, onSearch }) => {
    const [open, setOpen] = useState(false)
    const [close, setClose] = useState(false)
    useEffect(() => {
        if (openState) {
            setOpen(openState)
        }
        else {
            setClose(true)
            setTimeout(() => {
                setOpen(false)
                setClose(false)
            }, 200)
        }
    }, [openState])

    const boxRef = useRef(null)
    useEffect(() => {
        closeOnBackClick(open, boxRef, () => onClose())
        document.getElementsByTagName('body')[0].style.overflowY = open ? 'hidden' : 'auto'
    })

    // get search history from indexedDB
    const [searchHistory, setSearchhistory] = useState([])
    useEffect(() => {
        const handleList = async () => {
            const list = await getListFromDb()
            let filteredList = []
            list?.forEach(item => {
                filteredList.push(item?.tag)
            })

            setSearchhistory(filteredList)
        }
        handleList()
    }, [input])

    // fetch taglist
    const [tagList, setTagList] = useState([])
    useEffect(() => {
        const fetchTagList = async () => {
            try {
                axios.get('/blog/get-taglist')
                    .then(res => {
                        setTagList(res?.data?.data)
                    })
            } catch (error) {
                // console.log(error);
            }
        }
        fetchTagList()
    }, [input])

    // fetch username list
    const [userNameList, setUserNameList] = useState([])
    useEffect(() => {
        const fetchUserNameList = async () => {
            try {
                await axios.get('/user/get-usernamelist')
                    .then((res) => {
                        setUserNameList(res?.data?.data)
                    })
            } catch (error) {
                // console.log(error);

            }
        }
        fetchUserNameList()
    }, [input])


    // Create search suggestion results
    const [suggestionList, setSuggestionList] = useState(null)
    useEffect(() => {
        const handleSuggestionlist = async () => {
            let totalList = [...searchHistory, ...userNameList, ...tagList];

            // Filters list with same items
            let filteredList = [...new Set(totalList)]

            // creates a list of index 
            let indexList = []
            let i = 0
            for (let item of filteredList) {
                item = item.toLowerCase()
                input = input.trim().toLowerCase()
                if (item.includes(input)) {
                    // prevents undefined
                    const itemIndex = i
                    indexList.push({ tagIndex: itemIndex, serachIndex: item.indexOf(input) })
                }
                i += 1
            }

            // sorts the index list for search suggestion
            indexList.sort((a, b) => a.serachIndex - b.serachIndex)
            let sortedTaglist = []
            for (let i of indexList) {
                sortedTaglist.push(filteredList[i.tagIndex])
            }

            setSuggestionList(sortedTaglist);

            indexList = []
            sortedTaglist = []
            totalList = []
            filteredList = []
        }
        if (input) {
            handleSuggestionlist()
        } else {
            setSuggestionList([])
        }

    }, [input, tagList, searchHistory, userNameList])


    // handles search history show
    const [showSearchHistory, setShowSearchhistory] = useState(true)
    useEffect(() => {
        if (searchHistory?.length > 0 && (!suggestionList || suggestionList?.length === 0) && !input) {
            setShowSearchhistory(true)
        } else {
            setShowSearchhistory(false)
        }
    }, [searchHistory, suggestionList])

    // cleares search history
    const searchClearHandler = async () => {
        await clearListFromDb()
        setSearchhistory([])
    }

    // get recommended search list
    const [recomList, setRecomList] = useState(null)
    useEffect(() => {
        const fetchRecomList = async () => {
            await axios.get("/blog/recom-search")
                .then(res => {
                    setRecomList(res?.data?.data?.recomList);
                })
                .catch(err => {
                    // console.log(err)
                })
        }

        fetchRecomList()
    }, []);

    return (
        open && <div className={`if-search-box-container if-fadein-anim ${close ? 'if-fadeout-anim' : ''}`}>
            <div className='if-search-box if-scrollbar-thin' ref={boxRef} onClick={e => e.stopPropagation()} >
                <div className='mb-2'>
                    {(!suggestionList || suggestionList?.length === 0) &&
                        <SearchLine text={input} writeButton={false} onWrite={e => onWrite(e)} onSearch={() => onSearch()} />
                    }
                    {
                        suggestionList?.map((item, index) => {
                            return index < 10 && <SearchLine text={item} key={index} onWrite={e => onWrite(e)} onSearch={() => onSearch()} />
                        })
                    }
                </div>

                {showSearchHistory &&
                    <div className='mb-2'>
                        <h6>Previous Searches</h6>
                        <ul className='p-0'>
                            {
                                searchHistory?.map((item, index) => {
                                    return index < 5 && <SearchLine text={item} key={index} history onWrite={(e) => onWrite(e)} onSearch={() => onSearch()} />

                                })
                            }
                        </ul>
                        <div className='d-flex justify-content-center mt-2'>
                            <button className="if-btn if-font-s" onClick={() => searchClearHandler()}>Clear all searches</button>
                        </div>
                    </div>
                }
                {recomList &&
                    <div>
                        <h6 className='mb-3'>Recomended Searches</h6>
                        <ul className='p-0 if-recom-search-container'>
                            {
                                recomList?.map((item, index) => {
                                    return index < 5 && <Link className='if-url-normal' to={`/search?q=${decodeURI(item)}`} onClick={() => onClose()} key={index}><li className='if-recom-search-line'>{item}</li></Link>
                                })
                            }

                        </ul>
                    </div>}

            </div>
        </div>
    )
}


const SearchLine = ({ writeButton = true, text, history = false, onWrite, onSearch }) => {
    // get search history from indexedDB
    const [searchHistory, setSearchhistory] = useState([])
    useEffect(() => {
        const handleList = async () => {
            const list = await getListFromDb()
            let filteredList = []
            list?.forEach(item => {
                filteredList.push(item?.tag)
            })
            setSearchhistory(filteredList)
        }
        handleList()
    }, [])


    // handles write btn
    const handleWrite = (e) => {
        e?.stopPropagation()
        onWrite(text)
    }

    // handle search
    const navigate = useNavigate()
    const searchHandler = async (item) => {
        const handleAddHistory = async () => {
            if (!searchHistory?.includes(item)) {

                // creates a list of objects
                let tagObjList = []
                for (let i of [item, ...searchHistory]) {
                    tagObjList.push({ tag: i })
                }

                try {
                    await clearListFromDb()
                    await addListToDb(tagObjList)
                } catch (error) {
                    // console.log(error);

                }
            }
        }
        handleAddHistory()
        handleWrite()
        onSearch()
        navigate(`/search?q=${encodeURI(text)}`)

    }

    return (
        text && <div className='if-search-line' onClick={() => searchHandler(text)}>
            <div>{history ?
                <i className="ri-history-line"></i> :
                <i className="ri-search-2-line"></i>
            }</div>
            <div className='if-text-ellipsis' >{text}</div>
            {writeButton && <div className='justify-self-end fs-5' onClick={handleWrite}><i className="ri-arrow-left-up-line"></i></div>}
        </div>
    )
}
