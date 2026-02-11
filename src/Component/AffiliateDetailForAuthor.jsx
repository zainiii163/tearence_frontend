import {
  Dialog,
} from "@headlessui/react";

import { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { deleteAffiliate, updateAffiliate } from "../slice/AffiliateSLice";

function AffiliateDetailForAuthor({ isOpen, setIsOpen, data, onRefresh }) {
  const dispatch = useDispatch();
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    link: "",
    image_url: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    link: "",
    image_url: "",
  });
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
    }

    return () => {};
  }, [isOpen]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_url") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData({ ...formData, image_url: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const validateForm = () => {
    let valid = true;
    const newErrors = { title: "", url_link: "", image_url: "" };

    if (!formData.title) {
      newErrors.title = "Title is required";
      valid = false;
    }
    if (!formData.link) {
      newErrors.link = "URL Link is required";
      valid = false;
    }
    if (!formData.image_url) {
      newErrors.image_url = "Image is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        let payload = formData;
        if (preview === null) {
          delete payload.image_url;
        }
        await dispatch(
          updateAffiliate({ Id: formData.id, formData: payload })
        ).unwrap();
        setIsOpen(false);
        onRefresh();
        toast.success("Data has been updated");
      } catch (error) {
        toast.error(error?.message || error);
      }
    }
  };
  const onDelete = async () => {
    try {
      await dispatch(deleteAffiliate(formData.id)).unwrap();
      setIsOpen(false);
      onRefresh();
      toast.success("Data has been deleted");
    } catch (error) {
      toast.error(error?.message || error);
    }
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
          <div className="relative max-w-full max-h-full flex flex-col md:flex-row gap-5 rounded-lg space-y-2 bg-white p-5">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2"
            >
              <IoIosCloseCircle color="black" size={30} />
            </button>
            {preview !== null ? (
              <a href={data.link} target="blank">
                <img src={preview} alt={data.title} className="max-h-[500px]" />
              </a>
            ) : (
              <a href={data.link} target="blank">
                <img
                  src={data.image_url}
                  alt={data.title}
                  className="max-h-[500px]"
                />
              </a>
            )}

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
                    <p className="text-purple-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    URL Link
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.link && (
                    <p className="text-purple-500 text-xs mt-1">{errors.link}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image
                  </label>
                  <input
                    type="file"
                    name="image_url"
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.image_url && (
                    <p className="text-purple-500 text-xs mt-1">
                      {errors.image_url}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
export default AffiliateDetailForAuthor;
