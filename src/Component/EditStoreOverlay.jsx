import React, { useState, useEffect, useRef } from "react";
import { updateStore, createStore } from "../slice/StoreSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

function EditStoreOverlay({ onClose, data }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    store_id: "",
    store_name: "",
    store_address: "",
    store_logo: "",
    store_banner: "",
    company_name: "",
    company_no: "",
    vat: "",
    status: "",
  });

  useEffect(() => {
    if (data) {
      const newData = { ...data };
      setFormData(newData);
    }
    return () => {};
  }, [data]);

  const handleSave = async () => {
    try {
      if (formData.store_id) {
        await dispatch(
          updateStore({ store_id: formData.store_id, payload: formData })
        ).unwrap();
      } else {
        await dispatch(createStore(formData)).unwrap();
      }

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
      setFormData({ ...formData, store_logo: reader.result });
    };
    reader.readAsDataURL(file);
  };
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  return (
    <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md">
        <h2 className="text-2xl font-bold mb-4">
          {data?.store_id ? "Edit" : "Create"} Store Details
        </h2>
        <form>
          {/* Input fields for editing */}
          {/* Example: */}
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Logo
              </label>
              <div
                className="overflow-hidden cursor-pointer h-full"
                onClick={handleImageClick}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="User Avatar"
                    className="w-20 h-20 xl::w-32 xl:h-32 object-contain cursor-pointer"
                  />
                ) : (
                  <div className="rounded-md h-full flex justify-center items-center border-[1px] border-slate-400 border-dashed">
                    <span>Upload Logo Here</span>
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Store Name
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.store_name}
                onChange={(e) => {
                  setFormData({ ...formData, store_name: e.target.value });
                }}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Store Address
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.store_address}
                onChange={(e) => {
                  setFormData({ ...formData, store_address: e.target.value });
                }}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.company_name}
                onChange={(e) => {
                  setFormData({ ...formData, company_name: e.target.value });
                }}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Company No.
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.company_no}
                onChange={(e) => {
                  setFormData({ ...formData, company_no: e.target.value });
                }}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                VAT
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.vat}
                onChange={(e) => {
                  setFormData({ ...formData, vat: e.target.value });
                }}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div> */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={(e) => {
                  setFormData({ ...formData, status: e.target.value });
                }}
                className="mt-1 p-2 w-full border rounded-md"
              >
                <option value="active">Active</option>
                <option value="inactive">Disable</option>
              </select>
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
