import { useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
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
  FaBook,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function ModalCategoryPostAd() {
  const categoryAdsData = useSelector((store) => store.categories.categoryList);
  const categoryAds = categoryAdsData?.data || [];
  const [showModal, setShowModal] = useState(false);

  const ShowModal = () => {
    setShowModal(!showModal);
  };

  const getIcon = (iconname) => {
    switch (iconname) {
      case "fa-industry":
        return <FaIndustry />;
      case "fa-credit-card":
        return <FaCreditCard />;
      case "fa-fighter-jet":
        return <FaFighterJet />;
      case "fa-shopping-bag":
        return <FaShoppingBag />;
      case "fa-balance-scale":
        return <FaBalanceScale />;
      case "fa-calendar":
        return <FaCalendar />;
      case "fa-building":
        return <FaBuilding />;
      case "fa-bus":
        return <FaBus />;
      case "fa-laptop":
        return <FaLaptop />;
      case "fa-tags":
        return <FaTags />;
      case "fa-book":
        return <FaBook />;
      default:
        return <FaBuysellads />;
    }
  };
  return (
    <>
      <button
        className="lg:flex items-center gap-2 mx-2 text-xs g:px-7 px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
        onClick={ShowModal}
      >
        <BsFillPlusCircleFill />{" "}
        <span className="hidden lg:flex  ">POST NEW AD</span>
      </button>
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
    </>
  );
}

export default ModalCategoryPostAd;
