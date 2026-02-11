import {
  Dialog,
} from "@headlessui/react";

import { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { deleteAds, updateAds } from "../slice/ListSlice";
import Slider from "react-slick";
import { getCurrency } from "../slice/CategorySlice";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ReactQuillWrapper from "./ReactQuillWrapper";
import "react-quill/dist/quill.snow.css";

function ListingFormPopup({ isOpen, setIsOpen, data, onRefresh }) {
  const dispatch = useDispatch();

  const catMasterData = useSelector((store) => store.categories.currency);
  const CatMaster = catMasterData?.data || [];

  const [preview, setPreview] = useState(null);
  const [isSliderReady, setIsSliderReady] = useState(false);
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    images: "",
  });
  const [errors, setErrors] = useState({
    title: "",
  });
  useEffect(() => {
    dispatch(getCurrency());
  }, [dispatch]);
  useEffect(() => {
    if (data) {
      const newData = { ...data };
      setFormData(newData);
    }

    return () => {};
  }, [data]);
  useEffect(() => {
    if (isOpen) {
      setPreview(null);
      setIsSliderReady(false);
      // Add slight delay to ensure modal has opened before rendering slider
      setTimeout(() => {
        setIsSliderReady(true);
        window.dispatchEvent(new Event("resize")); // Trigger resize event to fix slick issues
      }, 100); // Delay of 100ms
    }
  }, [isOpen]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const fileArray = Array.from(files); // Convert FileList to an array
      const previews = [];

      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result); // Store each image preview in array

          // After all files have been processed, update the state
          if (previews.length === fileArray.length) {
            setPreview(previews); // Update preview state with all images
            setFormData({ ...formData, images: previews }); // Save images to formData
            setImages([...previews]);
          }
        };
        reader.readAsDataURL(file); // Read the file
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleChangeEditor = (value) => {
    if (formData.listing_id) {
      setFormData({ ...formData, description: value });
    }
  };
  const validateForm = () => {
    let valid = true;
    const newErrors = { title: "", url_link: "" };

    if (!formData.title) {
      newErrors.title = "Title is required";
      valid = false;
    }
    // if (!formData.image_url) {
    //   newErrors.image_url = "Image is required";
    //   valid = false;
    // }

    setErrors(newErrors);
    return valid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      let newFormData = { ...formData };
      if (images.length === 0) {
        delete newFormData.images;
      } else {
        // Ensure images is sent as flat array of base64 strings for backend processing
        newFormData.images = Array.isArray(images) ? images.flat() : images;
      }
      try {
        await dispatch(
          updateAds({ adsId: formData.listing_id, formData: newFormData })
        ).unwrap();
        setIsOpen(false);
        onRefresh();
        setImages([]);
        toast.success("Data has been updated");
      } catch (error) {
        toast.error(error?.message || error);
      }
    }
  };
  const onDelete = async () => {
    try {
      await dispatch(deleteAds(formData.listing_id)).unwrap();
      setIsOpen(false);
      onRefresh();
      toast.success("Data has been deleted");
    } catch (error) {
      toast.error(error?.message || error);
    }
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        onClose={() => setIsOpen(false)}
        className="z-[9999] fixed inset-0 overflow-y-auto"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <div className="relative max-w-full max-h-full flex flex-col md:flex-row gap-5 rounded-lg space-y-2 bg-white p-5 overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2"
            >
              <IoIosCloseCircle color="black" size={30} />
            </button>
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    disabled
                    name="cateogory"
                    value={formData?.category?.name}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>
                <div className="w-full gap-8 flex justify-between">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Currency
                    </label>
                    <div className="w-full">
                      <select
                        name="currency_id"
                        value={formData.currency_id}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option className="text-slate-600">
                          Select Currency
                        </option>
                        {CatMaster.items &&
                          CatMaster.items.map((currency, i) => {
                            return (
                              <option key={i} value={currency.currency_id}>
                                {currency.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <div>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter Your Pricing Amount"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <ReactQuillWrapper
                    value={formData.description}
                    onChange={handleChangeEditor}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image
                  </label>
                  <input
                    type="file"
                    name="images"
                    multiple
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div className="max-w-[700px] mt-5 mb-10">
                    {preview !== null ? (
                      <Slider {...settings}>
                        {preview?.map((src, index) => (
                          <div key={index}>
                            <img src={src} alt={`Slide ${index}`} />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <>
                        {isSliderReady && data?.images?.length > 0 && (
                          <Slider {...settings}>
                            {data.images.map((src, index) => (
                              <div key={index}>
                                <img
                                  src={src.image_path}
                                  alt={`Slide ${index}`}
                                />
                              </div>
                            ))}
                          </Slider>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-10">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="w-full mb-10 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
export default ListingFormPopup;
