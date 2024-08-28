import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import { BlogPage } from '../pages/Blogpage/BlogPage'

import { ErrorPage } from '../pages/errorpage/ErrorPage'
import { Home } from '../pages/home/Home'
import { DraftedBlogSection, Profile, UploadSection } from '../pages/profile/Profile'
import { SearchBarPage } from '../pages/Searchpage/SearchBarPage'
import { PrivateRouter } from './Private.routes'
import { SearchPage } from '../pages/Searchpage/SearchPage'
import { TermsAndCondsPage } from '../pages/PolicyPages/TermsAndCondsPage'
import { PrivacyTermsPage } from '../pages/PolicyPages/PrivacyTermsPage'


export const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<PrivateRouter element={<Home />} />} />
            <Route path='/home' element={<Home />} />

            {window.innerWidth <= 480 && <Route path='/search-bar' element={<SearchBarPage />} />}
            <Route path='/search' element={<SearchPage />} />

            <Route path='/profile/:param' element={<Profile />}>
                <Route path='/profile/:param' element={<Navigate to={'uploads'} />} />
                <Route path='uploads' element={<UploadSection />} />
                <Route path='drafts' element={<DraftedBlogSection />} />
            </Route>
            <Route path='blog/:blogId' element={<BlogPage />} />

            <Route path='/terms-conditions' element={<TermsAndCondsPage />} />
            <Route path='/privacy-terms' element={<PrivacyTermsPage />} />

            {/* Error page routes  */}
            <Route path='*' element={<ErrorPage />} />
        </Routes>
    )
}