import React, { useState, useEffect, useRef } from "react";
import {
  updateBusinessStore,
  createBusinessStore,
  getBusinessStore,
} from "../slice/StoreSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

function EditStoreOverlay({ onClose, data }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: "",
    business_company_registration: "",
    business_owner: "",
    business_name: "",
    business_company_name: "",
    business_company_no: "",
    personal_email: "",
    business_email: "",
    business_website: "",
    business_logo: "",
    business_address: "",
    personal_phone_number: "",
    business_phone_number: "",
    customer_id: "",
    status: "",
  });

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      const newData = { ...data };
      setFormData(newData);
    }
    return () => {};
  }, [data]);

  const handleSave = async () => {
    try {
      const requiredFields = [
        { key: "business_name", label: "Business name" },
        { key: "business_owner", label: "Name of director" },
        { key: "business_company_no", label: "Company number" },
        { key: "business_email", label: "Business email" },
      ];

      const missingField = requiredFields.find(
        ({ key }) => !formData[key] || !String(formData[key]).trim()
      );

      if (missingField) {
        toast.error(`${missingField.label} is required.`);
        return;
      }

      const payload = {
        ...formData,
        business_company_name: formData.business_name,
      };

      if (formData.id) {
        await dispatch(
          updateBusinessStore({
            business_id: formData.id,
            payload,
          })
        ).unwrap();
      } else {
        await dispatch(createBusinessStore(payload)).unwrap();
      }
      toast.success("Data has been saved");
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fileSelectedHandler = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData({ ...formData, business_logo: reader.result });
    };
    reader.readAsDataURL(file);
  };
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md mx-5">
        <h2 className="text-2xl font-bold mb-4">
          {data?.store_id ? "Edit" : "Upgrade"} Business Details
        </h2>
        <form className="">
          <div className="h-[250px] xl:h-[450px] overflow-auto">
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="mb-4">
                <label className="text-[#234777] font-semibold" htmlFor="">
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
                      className="w-36 h-36 object-contain cursor-pointer"
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
              <div className="col-span-1">
                <label className="block mb-2 text-[#234777] text-sm xl:text-base font-semibold">
                  Business name
                  <input
                    type="text"
                    name="business_name"
                    required
                    placeholder="Business name"
                    className="text-sm xl:text-base font-semibold text-xs xl:text-base mt-1 p-2 py-2 w-full border rounded-lg border-slate-300 outline-blue-500"
                    value={formData.business_name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        business_name: e.target.value,
                        business_company_name: e.target.value,
                      });
                    }}
                  />
                </label>
                <label className="block mb-2 text-[#234777] text-sm xl:text-base font-semibold">
                  Business Email
                  <input
                    type="email"
                    name="business_email"
                    required
                    placeholder="Business Email"
                    className="text-sm xl:text-base font-semibold w-full mt-1 p-2 py-2 border rounded-lg border-slate-300 outline-blue-500"
                    value={formData.business_email}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        business_email: e.target.value,
                      });
                    }}
                  />
                </label>
                <label className="block mb-2 text-[#234777] text-sm xl:text-base font-semibold">
                  Company Registration
                  <input
                    type="text"
                    name="business_company_registration"
                    placeholder="Company Registration"
                    className="text-sm xl:text-base font-semibold mt-1 p-2 py-2 w-full border rounded-lg border-slate-300 outline-blue-500"
                    value={formData.business_company_registration}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        business_company_registration: e.target.value,
                      });
                    }}
                  />
                </label>
                <label className="block mb-2 text-[#234777] text-sm xl:text-base font-semibold">
                  Name of Director
                  <input
                    type="text"
                    name="business_name_of_director"
                    required
                    placeholder="Name of Director"
                    className="text-sm xl:text-base font-semibold mt-1 p-2 py-2 w-full border rounded-lg border-slate-300 outline-blue-500"
                    value={formData.business_owner}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        business_owner: e.target.value,
                      });
                    }}
                  />
                </label>
              </div>
              <div className="col-span-1">
                <label className="block mb-2 text-[#234777] text-sm xl:text-base font-semibold">
                  Company No
                  <input
                    type="text"
                    name="companyNo"
                    required
                    placeholder="Company No"
                    className="text-sm xl:text-base font-semibold w-full mt-1 p-2 py-2 border rounded-lg border-slate-300 outline-blue-500"
                    value={formData.business_company_no}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        business_company_no: e.target.value,
                      });
                    }}
                  />
                </label>
                <label className="block mb-2 text-[#234777] text-sm xl:text-base font-semibold">
                  Personal Email
                  <input
                    type="email"
                    name="personal_email"
                    placeholder="Personal Email"
                    className="text-sm xl:text-base font-semibold w-full mt-1 p-2 py-2 border rounded-lg border-slate-300 outline-blue-500"
                    value={formData.personal_email}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        personal_email: e.target.value,
                      });
                    }}
                  />
                </label>
              </div>

              <label className="block mb-2 text-[#234777] text-sm xl:text-base font-semibold">
                Personal Phone No.
                <input
                  type="text"
                  name="personal_phone_number"
                  placeholder="Personal No"
                  className="text-sm xl:text-base font-semibold w-full mt-1 p-2 py-2 border rounded-lg border-slate-300 outline-blue-500"
                  value={formData.personal_phone_number}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      personal_phone_number: e.target.value,
                    });
                  }}
                />
              </label>
              <label className="block mb-2 text-[#234777] text-sm xl:text-base font-semibold">
                Business Phone No.
                <input
                  type="text"
                  name="business_phone_number"
                  placeholder="Business No"
                  className="text-sm xl:text-base font-semibold w-full mt-1 p-2 py-2 border rounded-lg border-slate-300 outline-blue-500"
                  value={formData.business_phone_number}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      business_phone_number: e.target.value,
                    });
                  }}
                />
              </label>
              <label className="block mb-2 text-[#234777] text-sm xl:text-base font-semibold">
                Website
                <input
                  type="text"
                  name="business_website"
                  placeholder="Website"
                  className="text-sm xl:text-base font-semibold w-full mt-1 p-2 py-2 border rounded-lg border-slate-300 outline-blue-500"
                  value={formData.business_website}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      business_website: e.target.value,
                    });
                  }}
                />
              </label>
              <label className="block mb-2 text-[#234777] font-semibold col-span-2">
                Address
                <textarea
                  type="text"
                  name="business_address"
                  rows="4"
                  placeholder="Address"
                  className="text-sm xl:text-base font-semibold w-full mt-1 p-2 py-2 border rounded-lg border-slate-300 outline-blue-500"
                  value={formData.business_address}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      business_address: e.target.value,
                    });
                  }}
                />
              </label>
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
