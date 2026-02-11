import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { getClassified } from '../slice/ListSlice';

function Classified() {
    const dispatch = useDispatch();
    const ClassifiedAdsData = useSelector((store) => store.ads?.classified?.data);
    useEffect(() => {
        dispatch(getClassified());
    }, [dispatch]);
    return (
        <div className='pt-36 pb-12 lg:pt-24 w-full bg-slate-200  flex justify-center'>
            <div className='w-11/12 flex flex-col gap-5'>
                <div className='text-2xl lg:text-5xl font-bold text-center'>CLASSIFIEDS</div>
                <div className='w-full flex gap-2 h-14 border border-slate-400 shadow-lg bg-white p-2'>
                    <div className='w-2/12'>
                        <select className='w-full bg-blue-100 h-full text-md font-medium'>
                            <option>All Categories</option>
                            <option>Business</option>
                            <option>Services</option>
                            <option>Careers</option>    
                            <option>Education</option>
                        </select>
                    </div>
                    <div className='w-6/12'>
                        <input type='text' className='w-full border h-full p-4' placeholder='Search for...'></input>
                    </div>
                    <div className='w-2/12'>
                        <select className='w-full h-full bg-blue-100 text-md font-medium'>
                            <option>Las Vegas</option>
                            <option>California</option>
                            <option>Georgia</option>
                            <option>New York</option>
                            <option>Chicago</option>
                        </select>
                    </div>
                    <div className='w-2/12'>
                        <button className='w-full h-full bg-[#234777] text-white text-xs lg:text-lg font-semibold'>SEARCH</button>
                    </div>
                </div>
                {ClassifiedAdsData?.items?.length > 0 ? (
                    <div className=' grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        {ClassifiedAdsData?.items?.map((item, index) => (
                            <div className='p-4 bg-white w-full border shadow-lg' key={index}>
                                <div className='py-2 text-xl font-bold text-white bg-black'>{item.name}</div>
                                <div>
                                    {item?.children?.map((item, i) => (
                                        <Link><div className='text-lg font-medium text-[#234777] hover:text-cyan-600' key={i} >{item.name}</div></Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex  flex-col justify-center  lg:min-h-[24vh] md:min-h-[30vh] xl:min-h-[27vh] 2xl:min-h-[34.8vh'>
                    <div className=' text-[#01c6da] border-2 border-[#234777] rounded-md py-10 text-center'> <span className='text-2xl italic'>No results found</span></div>
                  </div>
                )}
            </div>
        </div>
    )
}

export default Classified
