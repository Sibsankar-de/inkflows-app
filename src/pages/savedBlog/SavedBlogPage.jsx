import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { BlogItemVertical } from '../../components/Blogitems/BlogItemVertical'
import './savedBlogPage.style.css'
import axios from '../../configs/axios-configs'
import { formatDate } from '../../utils/functions/convertIsoDateString'
import { useNavigate } from 'react-router-dom'

export const SavedBlogPage = () => {
    const sliderOptions = {
        slidesPerView: 4,
        modules: [Navigation]
    }

    const navigate = useNavigate()

    // Fetch saved blog list
    const [blogList, setBlogList] = useState(null)
    useEffect(() => {
        const fetchList = async () => {
            try {
                await axios.get('/blog/savedblog-list')
                    .then((res) => {
                        setBlogList(res?.data?.data)
                    })
            } catch (error) {
                console.log(error);
            }
        }
        fetchList()
    }, [])

    return (
        <div className='container'>
            <div className='mb-5'>
                <h4>
                    Saved Blogs
                </h4>
            </div>
            <div className='if-saved-blog-content-container'>
                {
                    blogList?.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <div className='mb-3'>
                                    <h6>{formatDate(item?.date)}</h6>
                                </div>
                                <div className='if-saved-blog-page-slider'>
                                    <Swiper  {...sliderOptions} navigation>
                                        {
                                            item?.blogs?.map((blog, index2) => {
                                                return (
                                                    blog &&
                                                    <SwiperSlide key={index2}>
                                                        <BlogItemVertical data={blog} />
                                                    </SwiperSlide>
                                                )
                                            })
                                        }

                                    </Swiper>
                                </div>
                            </React.Fragment>
                        )
                    })
                }
                {
                    blogList?.length === 0 &&
                    <div>
                        <div className='mb-3'>You have not saved any blogs yet!</div>
                        <button className="if-btn if-nav-btn rounded-5 px-3" onClick={() => navigate('/home')}>
                            <span><i class="ri-home-2-line fs-5 if-col-blue"></i></span>
                            <span>Go to Home</span>
                        </button>
                    </div>
                }

            </div>
        </div>
    )
}
