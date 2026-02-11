import React, { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import {
  FaIndustry,
  FaShoppingBag,
  FaBuysellads,
  FaFighterJet,
  FaCreditCard,
  FaBalanceScale,
  FaCalendar,
  FaBuilding,
  FaBus,
  FaLaptop,
  FaTags,
} from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import "../input.css";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate()
  const categoryAdsData = useSelector((store) => store.categories.categoryList);
  const categoryAds = categoryAdsData?.data || [];

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCategorySelected] = useState({
    text: 'All categories',
    value: '',
  });
 

  const [showModal, setShowModal] = useState(false);
  const [isOpenCategorySearch, setIsOpenCategorySearch] = useState(false);




  const handleSearch = (e) =>{
    e.preventDefault()
    // dispatch(getGlobalSearch({ searchData: { keyword: searchKeyword } }));
    navigate(`/search-results/${searchKeyword}`)
  }

  const getIcon = (iconname) => {
    switch (iconname) {
      case 'fa-industry':
        return <FaIndustry />
      case 'fa-credit-card':
        return <FaCreditCard />
      case 'fa-fighter-jet':
        return <FaFighterJet />
      case 'fa-shopping-bag':
        return <FaShoppingBag />
      case 'fa-balance-scale':
        return <FaBalanceScale />
      case 'fa-calendar':
        return <FaCalendar />
      case 'fa-building':
        return <FaBuilding />
      case 'fa-bus':
        return <FaBus />
      case 'fa-laptop':
        return <FaLaptop />
      case 'fa-tags':
        return <FaTags />
      default:
        return <FaBuysellads />
    }
  }
  return (
    <div className="w-full fixed z-20  bg-white shadow shadow-slate-300">
      <div className="flex justify-between h-20 w-11/12 m-auto items-center">
        <div className="flex gap-4 items-center">
          <Link to="/">
            <img src="/img/wwaLogo.png" alt="logo" className="w-48 sm:w-56" />
          </Link>
        </div>
        <div className="flex relative transition ease-in-out duration-1000">
          <a
            className=" lg:flex items-center gap-2 ml-2 text-md text-white font-semibold rounded-full lg:rounded-2xl lg:px-7 px-4 py-2 bg-[#234676] hover:bg-slate-500 transition duration-300 md:px-2 md:py-1"
            href="/"
          >
            <IoIosCloseCircle /> <span className="hidden lg:flex  ">Back to home</span>
          </a>

          {/* <img src="/images/user.png" alt="user" className="w-8 bg-white rounded-2xl"  /> */}
        </div>
      </div>
      <div className="w-10/12 text-lg mx-auto pb-5 relative sm:hidden md:flex lg:hidden ">
        <form className="w-full" onSubmit={ handleSearch }>
          <div className="flex">
            <div className="relative flex-shrink-0 z-10 inline-flex">
              <div className="flex">
                <button 
                  id="dropdown-button" 
                  data-dropdown-toggle="dropdown" 
                  className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100" 
                  type="button"
                  onClick={() => setIsOpenCategorySearch(!isOpenCategorySearch)}
                >
                  {searchCategorySelected.text}
                  <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="relative w-full">
              <input 
                type="search" 
                id="search-dropdown" 
                className="block p-2.5 w-full sm:w-60 md:w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Search..." 
                required 
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                <BiSearch className="text-xl" />
              </button>
            </div>
          </div>
        </form>
      </div>
      {showModal && (
        <div className="w-full absolute top-0 h-screen bg-[rgba(0,0,0,0.6)] overflow-auto">
          <span
            className="absolute right-5 top-16 text-3xl text-white cursor-pointer"
            onClick={() => setShowModal(false)}
          >
            <MdCancel />
          </span>
          <div className="bg-white w-10/12 relative top-24 m-auto flex flex-wrap gap-2 justify-between lg:justify-normal rounded p-5">
            {/* <div className="bg-red-300 w-5/6 relative top-24 m-auto grid justify-between grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-5"> */}
            {categoryAds.items?.map((item, index) => (
              <Link
                key={item.category_id}
                to={`/post/${item.slug}/${item.category_id}`}
                onClick={() => setShowModal(false)}
              >
                <div
                  key={index}
                  className="sm:w-[280px] lg:w-[265px] xl:w-[245px] relative flex rounded justify-center items-center mb-5"
                >
                  {/* {item.images?.length > 0 ? (
                    <img
                      src={item.Image}
                      alt="Category"
                      className="brightness-50 contrast-100 rounded "
                    />
                  ) : (
                    <img
                      src="/img/NoImage1.png"
                      alt="Default"
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                  <p className="absolute text-black  font-bold text-xl ">
                    {item.name}
                  </p> */}
                  <div className="flex w-full items-center p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-slate-50">
                    <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">
                      {getIcon(item.icon)}
                    </div>
                    <div>
                    <p className="mb-2 text-xl font-medium text-gray-600">
                      {item.name}
					          </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
