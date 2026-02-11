import { useState, useEffect } from "react";
import { createStore, updateStore, getStore } from "../slice/StoreSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

function UpgradeToStore() {
  const dispatch = useDispatch();
  const storeDetail = useSelector((store) => store.store.storeDetail);

  const [formData, setFormData] = useState({
    store_id: "",
    store_name: "",
    company_name: "",
    company_no: "",
    vat: "",
    status: "active",
    description: "",
  });

  const init = () => {
    dispatch(
      getStore({
        customer_id: "",
      })
    );
  };
  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    if (storeDetail.data) {
      setFormData(storeDetail.data);
    }
  }, [storeDetail]);

  const onSubmit = async () => {
    try {
      if (formData.store_id) {
        await dispatch(
          updateStore({ store_id: formData.store_id, payload: formData })
        ).unwrap();
      } else {
        await dispatch(createStore(formData)).unwrap();
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
        <h2 className="text-2xl font-semibold text-foreground mb-2">Upgrade To Store</h2>
        <p className="text-sm text-muted-foreground">
          Upgrade your account to a store and have your own dedicated store page to showcase your products and services.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-6">
          {/* Store Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Store Name</label>
            <input
              type="text"
              name="store_name"
              required
              placeholder="Enter your store name"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.store_name}
              onChange={(e) => {
                setFormData({ ...formData, store_name: e.target.value });
              }}
            />
            <p className="text-xs text-muted-foreground">This name appears publicly on your store page.</p>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Store Status</label>
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
            <p className="text-xs text-muted-foreground">Set your store status to active to make it visible to customers.</p>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Company Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  placeholder="Enter company name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.company_name}
                  onChange={(e) => {
                    setFormData({ ...formData, company_name: e.target.value });
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company Number</label>
                <input
                  type="text"
                  name="companyNo"
                  required
                  placeholder="Enter company registration number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.company_no}
                  onChange={(e) => {
                    setFormData({ ...formData, company_no: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">VAT Number</label>
              <input
                type="text"
                name="vat"
                required
                placeholder="Enter VAT registration number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.vat}
                onChange={(e) => {
                  setFormData({ ...formData, vat: e.target.value });
                }}
              />
               <p className="text-xs text-muted-foreground">Enter your VAT registration number if applicable.</p>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Store Description</label>
              <textarea
                name="description"
                placeholder="Describe your store, products, and services..."
                rows={4}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                }}
              />
              <p className="text-xs text-muted-foreground">
                Provide a detailed description of your store to attract customers.
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
