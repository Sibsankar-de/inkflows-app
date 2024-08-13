import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchBox } from '../../components/SearchBox/SearchBox'
import "./searchPage.style.css"

export const SearchBarPage = () => {
    const navigate = useNavigate()
    return (
        <div className='if-searchbar-page'>
            <div className='if-searchbar-page-searchbar-box mb-3'>
                <div><button className="if-btn if-nav-btn" onClick={() => navigate(-1)}><i class="ri-arrow-left-line fs-5"></i></button></div>
                <div>
                    <div className='if-searchbar-page-search-box'>
                        <span className='if-search-logo-box'><i className='ri-search-2-line'></i></span>
                        <input type="text" placeholder='search blogs' className='if-search-bar' />
                    </div>
                </div>
            </div>

            <div>
                <SearchBox openState={true} onClose={() => { }} />
            </div>

        </div>
    )
}
