import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCountry, getCurrency, getZone } from "../slice/CategorySlice";
import { getUserDetails, updateUserDetails } from "../slice/AuthSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AutocompleteDropdown from "./AutoCompleteDropdown";

const GeneralInformation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector((store) => store.auth?.userDetail?.data || {});
  const catCurrency = useSelector((store) => store.categories.currency);
  const catCountry = useSelector((store) => store.categories.country);
  const catZone = useSelector((store) => store.categories.zone);
  const auth = useSelector((store) => store.auth);

  // console.log("-->>>",userDetails)

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: "",
    first_name: "",
    last_name: "",
    phone: "",
    gender: "",
    currency_id: "",
    birthday: "",
    country_id: "",
    zone_id: "",
    city: "",
    zip: "",
    address_street: "",
    address_house: "",
    email: "",
  });
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "country_id") {
      await dispatch(getZone({ country_id: value })).unwrap();
    }
  };
  const handleSelect = (selectedItem) => {
    console.log("Selected item:", selectedItem);
    setFormData({ ...formData, zone_id: selectedItem.zone_id });
  };

  const dropdownOptions = {
    gender: [
      {
        text: "Male",
        value: "M",
      },
      {
        text: "Female",
        value: "L",
      },
    ],
  };

  useEffect(() => {
    dispatch(getUserDetails());
    dispatch(getCurrency());
    dispatch(getCountry());
    dispatch(getZone());
  }, [dispatch]);
  useEffect(() => {
    if (userDetails) {
      setFormData({
        first_name: userDetails.first_name || "",
        last_name: userDetails.last_name || "",
        phone: userDetails.phone || "",
        gender: userDetails.gender || "M",
        currency_id: userDetails.currency?.currency_id || 1,
        birthday: userDetails.birthday || "",
        country_id: userDetails.location?.country_id || 0,
        zone_id: userDetails.location?.zone_id || 0,
        city: userDetails.location?.city || "",
        zip: userDetails.location?.zip || "",
        address_street: userDetails.address_street || "",
        address_house: userDetails.address_house || "",
        email: userDetails.email || "",
      });
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (
      auth?.authError?.includes("Unauthenticated") ||
      auth?.authError?.message?.includes("Unauthenticated")
    ) {
      navigate("/");
    }

    return () => {};
  }, [auth]);
  const onSubmit = async () => {
    console.log(formData);
    try {
      await dispatch(
        updateUserDetails({
          id: userDetails.customer_id,
          payload: {
            ...formData,
            country_id: parseInt(formData.country_id),
            currency_id: parseInt(formData.currency_id),
            zip: parseInt(formData.zip),
          },
        })
      ).unwrap();
      toast.success("Data has been updated");
      dispatch(getUserDetails());
      setIsEditing(false);
    } catch (error) {
      setIsEditing(false);

      toast.error(error?.message || error);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">General Information</h2>
        <div>
          {isEditing ? (
            <button
              onClick={onSubmit}
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 text-sm font-medium transition-colors"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 text-sm font-medium transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            ) : (
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                <p className="text-foreground">{userDetails?.first_name || 'Not provided'}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            ) : (
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                <p className="text-foreground">{userDetails?.last_name || 'Not provided'}</p>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Phone Number</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            ) : (
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                <p className="text-foreground">{userDetails?.phone || 'Not provided'}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Gender</label>
            {isEditing ? (
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {dropdownOptions.gender.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                <p className="text-foreground">{userDetails?.gender === 'M' ? 'Male' : userDetails?.gender === 'L' ? 'Female' : 'Not provided'}</p>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Currency</label>
            {isEditing ? (
              <select
                name="currency_id"
                value={formData.currency_id}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {catCurrency?.data?.items &&
                  catCurrency?.data?.items.map((currency, i) => {
                    return (
                      <option key={i} value={currency.currency_id}>
                        {currency.name}
                      </option>
                    );
                  })}
              </select>
            ) : (
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                <p className="text-foreground">{userDetails?.currency?.name || 'Not provided'}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            ) : (
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                <p className="text-foreground">{userDetails?.birthday || 'Not provided'}</p>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Country</label>
            {isEditing ? (
              <select
                name="country_id"
                value={formData.country_id}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {catCountry?.data?.items &&
                  catCountry?.data?.items.map((country, i) => {
                    return (
                      <option key={i} value={country.country_id}>
                        {country.name}
                      </option>
                    );
                  })}
              </select>
            ) : (
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                <p className="text-foreground">{userDetails?.location?.country_name || 'Not provided'}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Zone</label>
            {isEditing ? (
              <AutocompleteDropdown
                data={catZone?.data?.items}
                selected={formData.zone_id}
                onSelect={handleSelect}
                displayKey={"name"}
              />
            ) : (
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                <p className="text-foreground">{userDetails?.location?.zone_name || 'Not provided'}</p>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">City</label>
            {isEditing ? (
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            ) : (
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                <p className="text-foreground">{userDetails?.location?.city || 'Not provided'}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">ZIP Code</label>
            {isEditing ? (
              <input
                type="number"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            ) : (
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                <p className="text-foreground">{userDetails?.location?.zip || 'Not provided'}</p>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Street Address</label>
            {isEditing ? (
              <input
                type="text"
                name="address_street"
                value={formData.address_street}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            ) : (
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                <p className="text-foreground">{userDetails?.address_street || 'Not provided'}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">House Number</label>
            {isEditing ? (
              <input
                type="text"
                name="address_house"
                value={formData.address_house}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            ) : (
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                <p className="text-foreground">{userDetails?.address_house || 'Not provided'}</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default GeneralInformation;
