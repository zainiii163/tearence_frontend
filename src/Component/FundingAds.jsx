import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { BsFacebook, BsShareFill } from "react-icons/bs";
import { FaTelegram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { getCampaign } from "../slice/FundingSlice";
import { useDispatch, useSelector } from "react-redux";

const FundingCard = () => {
  const dispatch = useDispatch();
  const campaignList = useSelector((store) => store?.fund?.campaign);
  const campaignListData = campaignList?.data || [];

  const [investmentAmount, setInvestmentAmount] = useState(0);


  // console.log('--->>>',campaignListData)

  const itemsPerPage = 10;
  const totalDataCount = campaignList?.total || 0;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalDataCount / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const maxLength = 100;
  const truncateDescription = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const [paymentOverlay , setPaymentOverlay] = useState(false);
  const [shareOverlay, setShareOverlay] = useState(false);
  const handleShareButton = () => {
    setShareOverlay(true);
  };
  const closeShareOverlay = () => {
    setShareOverlay(false);
  };

  const handlePayentButton = () => {
    // createDonation({
    //   customer_id: 1,
    //   campaign_id: 1, 
    //   amount: donationAmount,
    // }).then((response) => {
    //   console.log("Donation created:", response);
    // });

    setPaymentOverlay(true);
  };


  useEffect(() => {
    dispatch(
      getCampaign(
        {
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      }
      )
    );
  }, [dispatch, currentPage]);

  return (
    <div className="w-full flex flex-col items-center pt-36 lg:pt-24">
      <div className="w-11/12">
        <div className="h-[25vh] border-2 bg-cover bg-center" style={{backgroundImage:`url(/img/business-funding-bg.jpg)`}}>
            <div className="w-full h-full bg-black bg-opacity-60 text-center flex flex-col justify-around p-2">
                <div className=" text-white font-bold text-5xl lg:text-6xl">BUSINESS FUNDING</div>
                <div className="text-white">Investment Opportunities & Partnerships</div>
                <div className="text-white text-lg lg:text-2xl">"Fuel Your Business Growth"</div>
                <div><Link to={'/create-funding'}><button className="text-lg font-semibold px-6 py-2 bg-green-200 border border-green-600 text-green-600 rounded-xl">Seek Investment</button></Link></div>
            </div>
        </div>
        <div className="pt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {campaignListData?.items?.map((item, index) => (
          <div key={index} className="max-w-md mx-auto mb-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-md">
                <img
                  src={item?.thumbnail}
                  alt={"business-funding-image"}  
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{item?.title}</h2>
                  <p className="text-gray-600">
                    {truncateDescription(item.description, maxLength)}
                  </p>
                  <div className="mt-4">
                    <div className="mb-2">
                      <p className="font-semibold text-gray-700 mb-2">
                        Investment Required: ${item?.collected} / $
                        {item.target}
                      </p>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-500 bg-green-200">
                              Funding Progress
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-green-600">
                              {(
                                (item?.collected / item.target) *
                                100
                              ).toFixed(2)}
                              %
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                          <div
                            style={{
                              width: `${(
                                (item?.collected / item.target) *
                                100
                              ).toFixed(2)}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="text-gray-700 mr-2">Recent Investors:</span>
                      <ul className="flex">
                      {item?.donors}
                      </ul>
                    </div>
                    <div className="flex justify-between">
                   
                      <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full mr-2" onClick={handlePayentButton} >
                        Invest Now
                      </button>
                      <button onClick={handleShareButton}>
                        <BsShareFill className="text-gray-600"/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {shareOverlay && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            {/* <div className='w-72 h-60 md:w-1/2 lg:w-2/6 lg:h-1/2 bg-white flex justify-center rounded shadow-lg relative'> */}
            <div className="w-96 h-44 bg-white">
              <div className=" p-5">
                <div className="flex items-center justify-between">
                  <div className=" text-xl font-medium">Share</div>
                  <div>
                    <button><ImCross onClick={() => setShareOverlay(false)} /></button>
                  </div>
                </div>
                <div className="border-1 py-2">
                  <hr></hr>
                </div>
                <div className="flex justify-around gap-4 py-2">
                  <div className="flex flex-col items-center">
                    <div>
                      <button className="rounded-full py-4 px-4 bg-[#3B5998] text-lg text-white">
                        <BsFacebook style={{ fontSize: "25px" }} />
                      </button>
                    </div>
                    <div>Facebook</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <button className="rounded-full py-4 px-4 bg-[#00ACEE] text-lg text-white">
                      <FaTwitter style={{ fontSize: "25px" }} />
                    </button>
                    <div>Twitter</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <button className="rounded-full py-4 px-4 bg-[#0E76A8] text-lg text-white">
                      <FaTelegram style={{ fontSize: "25px" }} />
                    </button>
                    <div>Telegram</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div>
                      <button className="rounded-full py-4 px-4 bg-[#43BF51] text-lg text-white">
                        <FaWhatsapp style={{ fontSize: "25px" }} />
                      </button>
                    </div>
                    <div>Whatsapp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

{paymentOverlay && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 h-44 bg-white">
            <div className=" p-5">
              <div className="flex items-center justify-between">
                <div className=" text-xl font-medium">Payment</div>
                <div>
                  <button onClick={() => setPaymentOverlay(false)}>
                    <ImCross />
                  </button>
                </div>
              </div>
              <div className="border-1 py-2">
                <hr></hr>
              </div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-gray-600">Investment Amount:</label>
                <input
                  type="number"
                  className="border border-gray-300 p-2 rounded"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
              </div>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full"
                onClick={handlePayentButton}
              >
                Confirm Investment
              </button>
            </div>
          </div>
        </div>
      )}

        

        <div className="w-full mt-2 text-lg">
          Showing{" "}
          <strong>
            {" "}
            {startIndex + 1}-{Math.min(endIndex, totalDataCount)}{" "}
          </strong>{" "}
          of <strong>{totalDataCount}</strong> result.
        </div>

        {/* pagination button */}
        <div className="flex justify-center py-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full mr-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <MdNavigateBefore />
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= totalDataCount}
          >
            <MdNavigateNext />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundingCard;
