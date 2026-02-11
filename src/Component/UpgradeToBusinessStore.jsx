import { useState, useEffect, useRef } from "react";
import {
  updateBusinessStore,
  createBusinessStore,
  getBusinessStore,
} from "../slice/StoreSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getUserDetails } from "../slice/AuthSlice";

function UpgradeToStore() {
  const dispatch = useDispatch();
  const userDetails = useSelector((store) => store.auth?.userDetail?.data || {});

  const businessStore = useSelector((store) => store.store.businessStore);

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
    description: "",
  });
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const init = async () => {
    if (userDetails) {
      dispatch(
        getBusinessStore({
          customer_id: userDetails.customer_id,
        })
      );
    } else {
      await dispatch(getUserDetails())
        .unwrap()
        .then((r) => {
          dispatch(
            getBusinessStore({
              customer_id: r.data.customer_id,
            })
          );
        });
    }
  };
  useEffect(() => {
    init();
  }, [dispatch]);
  useEffect(() => {
    if (businessStore.data) {
      setFormData(businessStore.data);
    }
  }, [businessStore]);

  const fileSelectedHandler = (event) => {
    const file = event.target.files[0];

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
  const onSubmit = async () => {
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
      init();
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Upgrade To Business</h2>
        <p className="text-sm text-muted-foreground">
          Upgrade your account to a business profile and create your own professional business page with enhanced features.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-6">
          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Business Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={(e) => {
                setFormData({ ...formData, status: e.target.value });
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <p className="text-xs text-muted-foreground">Set your business status to active to make it visible to customers.</p>
          </div>

          {/* Business Logo and Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Business Logo</h3>
              <div
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                onClick={handleImageClick}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Business Logo"
                    className="w-32 h-32 object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-foreground">Upload Business Logo</p>
                    <p className="text-xs text-muted-foreground mt-1">Click to select an image</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={fileSelectedHandler}
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Business Name</label>
                <input
                  type="text"
                  name="business_name"
                  required
                  placeholder="Enter business name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.business_name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      business_name: e.target.value,
                      business_company_name: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company Registration</label>
                <input
                  type="text"
                  name="business_company_registration"
                  placeholder="Enter company registration number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.business_company_registration}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      business_company_registration: e.target.value,
                    });
                  }}
                />
              </div>

            </div>
          </div>
          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Company Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name of Director</label>
                <input
                  type="text"
                  name="business_name_of_director"
                  required
                  placeholder="Enter director's name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.business_owner}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      business_owner: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company Number</label>
                <input
                  type="text"
                  name="companyNo"
                  required
                  placeholder="Enter company number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.business_company_no}
                  onChange={(e) => {
                    setFormData({ ...formData, business_company_no: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Personal Email</label>
                <input
                  type="email"
                  name="personal_email"
                  placeholder="Enter personal email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.personal_email}
                  onChange={(e) => {
                    setFormData({ ...formData, personal_email: e.target.value });
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Business Email</label>
                <input
                  type="email"
                  name="business_email"
                  required
                  placeholder="Enter business email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.business_email}
                  onChange={(e) => {
                    setFormData({ ...formData, business_email: e.target.value });
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Personal Phone</label>
                <input
                  type="text"
                  name="personal_phone_number"
                  placeholder="Enter personal phone number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.personal_phone_number}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      personal_phone_number: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Business Phone</label>
                <input
                  type="text"
                  name="business_phone_number"
                  placeholder="Enter business phone number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.business_phone_number}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      business_phone_number: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Website</label>
              <input
                type="url"
                name="business_website"
                placeholder="Enter business website URL"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.business_website}
                onChange={(e) => {
                  setFormData({ ...formData, business_website: e.target.value });
                }}
              />
            </div>

             <div className="space-y-2">
               <label className="text-sm font-medium text-foreground">Business Address</label>
               <textarea
                 name="business_address"
                 placeholder="Enter complete business address"
                 rows={3}
                 className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                 value={formData.business_address}
                 onChange={(e) => {
                   setFormData({ ...formData, business_address: e.target.value });
                 }}
               />
             </div>

             {/* Description Field */}
             <div className="space-y-2">
               <label className="text-sm font-medium text-foreground">Business Description</label>
               <textarea
                 name="description"
                 placeholder="Describe your business, services, and what makes you unique..."
                 rows={4}
                 className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                 value={formData.description}
                 onChange={(e) => {
                   setFormData({ ...formData, description: e.target.value });
                 }}
               />
               <p className="text-xs text-muted-foreground">
                 Provide a detailed description of your business to attract customers and partners.
               </p>
             </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onSubmit}
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpgradeToStore;
