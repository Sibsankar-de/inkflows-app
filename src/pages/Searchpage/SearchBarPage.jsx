import React, { useRef, useState, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { SearchBox } from '../../components/SearchBox/SearchBox'
import "./searchPage.style.css"

export const SearchBarPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    //handle input from search
    const [searchInput, setSearchInput] = useState('')

    const searchbarRef = useRef(null)

    // handle input field write
    const handleInputWrite = (text) => {
        setSearchInput(text)
        searchbarRef?.current?.focus()
    }

    // handle after search
    const handleSearch = () => {
        searchbarRef?.current?.blur()

    }

    // set q value on refresh
    const [searchParams] = useSearchParams()
    const query = decodeURI(searchParams.get("q"))
    useEffect(() => {
        if (query !== "null") {
            setSearchInput(query)
        } else {
            setSearchInput('')
        }
    }, [location])

    // handle page title
    useEffect(() => {
        document.title = "Inkflows - Search for creative contents"
    }, [])


    return (
        <div className='if-searchbar-page'>
            <div className='if-searchbar-page-searchbar-box mb-3'>
                <div><button className="if-btn if-nav-btn" onClick={() => navigate(-1)}><i className="ri-arrow-left-line fs-5"></i></button></div>
                <div>
                    <div className='if-searchbar-page-search-box'>
                        <span className='if-search-logo-box'><i className='ri-search-2-line'></i></span>
                        <input type="text" placeholder='search blogs' className='if-search-bar' onChange={(e) => setSearchInput(e.target.value)} value={searchInput} ref={searchbarRef} />
                    </div>
                </div>
            </div>

            <div>
                <SearchBox openState={true} onClose={() => { }} onSearch={handleSearch} onWrite={handleInputWrite} input={searchInput} />
            </div>

        </div>
    )
}
