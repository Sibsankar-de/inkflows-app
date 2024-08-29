import React, { useEffect, useState } from 'react'
import { BlogItemHorizontal } from '../../components/Blogitems/BlogItemHorizontal'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from '../../configs/axios-configs'

export const SearchPage = () => {

    const navigate = useNavigate()
    // get search params
    const [searchParams] = useSearchParams()
    const query = decodeURI(searchParams.get("q"))

    // Search result from query
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [searchResult, setSearchResult] = useState(null)
    useEffect(() => {
        const fetchResult = async () => {
            try {
                setProgress(0)
                setLoading(true)
                axios.get(`/blog/search`, {
                    params: {
                        searchQuery: query
                    },
                    onDownloadProgress: (progressEvent) => {
                        const { loaded, total } = progressEvent;
                        const percentage = Math.floor((loaded / total) * 100);
                        setProgress(percentage);

                    }
                })
                    .then(res => {
                        setSearchResult(res?.data?.data)
                    })
                    .catch(err => { })
                    .finally(() => setProgress(false))
            } catch (error) {
                // console.log(error);

            }
        }
        fetchResult()
    }, [query])

    // reflect for null
    useEffect(() => {
        query === 'null' && navigate("*")
    }, [query])

    // handle page title
    useEffect(() => {
        document.title = searchResult ? `(${searchResult?.length || 'No'}) results on - ${query}` : "Searching"
    }, [searchResult])



    return (
        <div className='container'>
            {progress && <div className='if-progress-bar' style={{ width: `${progress}%` }}></div>}
            <div>
                <h6>{searchResult?.length || 'No'} result found on your search - {query}</h6>
            </div>
            <div className='if-search-result-content-box'>
                {
                    searchResult?.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                {item?.type === "user" && <ProfileSearchItem data={item?.content} />}
                                {item?.type === "blog" && <BlogSearchItem data={item?.content} />}
                            </React.Fragment>
                        )
                    })
                }
            </div>
        </div>
    )
}

const ProfileSearchItem = ({ data }) => {
    const userUrl = `/profile/${data?.userName}`
    return (
        <div className='if-profile-search-item'>
            <div className='if-profile-search-item-img-box'>
                <Link to={userUrl} className='if-url-normal'><img src={data?.avatar || require("../../assets/img/profile-img.png")} alt="" className='if-border-round' /></Link>
            </div>
            <div>
                <div className='if-profile-user-name-para'><Link to={userUrl} className='if-url-normal'>{data?.fullName}</Link></div>
                <div className='mb-2'>{data?.userName}</div>
                <div className='if-col-fade'>
                    <span>{data?.followersCount} followers</span>
                </div>
            </div>
        </div>
    )
}

const BlogSearchItem = ({ data }) => {
    return (
        <BlogItemHorizontal data={data} />
    )
}
