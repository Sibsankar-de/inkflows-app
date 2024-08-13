import React, { useEffect } from 'react';

import 'remixicon/fonts/remixicon.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import './style/utils.css'
import './style/root.css'
import 'swiper/css';
import 'swiper/css/navigation';


import { AppRouter } from './routes/App.routes';
import { HeaderNav } from './components/Navbar/HeaderNav';
import { Routes, useLocation, Route, Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { PreLoginRouter } from './routes/PreLogin.routes';
import { useContext, useState } from 'react';
import AuthContext from './contexts/AuthContext';
import { PrivateRouter } from './routes/Private.routes';
import { SavedBlogPage } from './pages/savedBlog/SavedBlogPage.jsx'
import { ProfileSettings, SecuritySettings, Settings, ThemeSettings } from './pages/settings/Settings.jsx'
import { LoginBox, RegistrationBox, AuthenticationPage } from './pages/login-pages/AuthenticationPage.jsx';
import { CreateBlogPage } from './pages/createBlog/CreateBlogPage'
import { PreviewPage } from './pages/createBlog/PreviewPage'
import { PublishBlogPage } from './pages/createBlog/PublishBlogPage'

function App() {
  const location = useLocation()
  const notHeader = location.pathname.includes('create/new') || location.pathname.includes('edit') || location.pathname.includes('/auth/')

  // Goto top on change location
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  // Toast theme
  const [toastTheme, setToastTheme] = useState("light")
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light"
    setToastTheme(theme)
  })

  return (
    <>
      {!notHeader && <header>
        <HeaderNav />
      </header>}
      <main>
        <Routes>
          {/* pre login routes  */}
          <Route path='/auth' element={<PreLoginRouter element={<AuthenticationPage />} />}>
            <Route path='login' element={<LoginBox />} />
            <Route path='register' element={<RegistrationBox />} />
          </Route>

          {/* Public routes  */}
          <Route path='/*' element={<AppRouter />} />

          {/* Private routes for Blog create */}
          <Route path='/create/new' element={<PrivateRouter element={<CreateBlogPage />} />} />
          <Route path='/create/preview/:blogId' element={<PrivateRouter element={<PreviewPage />} />} />
          <Route path='/create/publish/:blogId' element={<PrivateRouter element={<PublishBlogPage />} />} />

          {/* Private Routes for settings */}
          <Route path='settings' element={<PrivateRouter element={<Settings />} />}>
            <Route path='/settings' element={<Navigate to={'profile'} />} />
            <Route path='profile' element={<ProfileSettings />} />
            <Route path='themes' element={<ThemeSettings />} />
            <Route path='security' element={<SecuritySettings />} />
          </Route>
          <Route path='saved-blog' element={<PrivateRouter element={<SavedBlogPage />} />} />

        </Routes>
      </main>


      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={toastTheme}
      />
    </>
  );
}

export default App;
