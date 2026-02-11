import React, { useState, useEffect, useRef } from "react";
import { updateStore, createStore } from "../slice/StoreSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

function EditStoreOverlay({ onClose, type, imageBanner }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [img, setImg] = useState(null);

  useEffect(() => {
    if (imageBanner) {
      setImg(imageBanner);
    }
    return () => {};
  }, [imageBanner]);

  const handleSave = async () => {
    try {
      // if (formData.store_id) {
      //   await dispatch(
      //     updateStore({ store_id: formData.store_id, payload: formData })
      //   ).unwrap();
      // } else {
      //   await dispatch(createStore(formData)).unwrap();
      // }

      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fileSelectedHandler = (event) => {
    // console.log(event);
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setImg(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white p-8 rounded-md">
        <h2 className="text-2xl font-bold mb-4">Edit Banner Store</h2>
        <form>
          {/* Input fields for editing */}
          {/* Example: */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="mb-4">
              <div
                className="overflow-hidden cursor-pointer h-full"
                onClick={handleImageClick}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="User Avatar"
                    className="w-[500px] h-[200px] object-cover cursor-pointer"
                  />
                ) : (
                  <div className="rounded-md h-[200px] w-[500px] flex justify-center items-center border-[1px] border-slate-400 border-dashed">
                    <span>Upload Banner Here</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={fileSelectedHandler}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStoreOverlay;
