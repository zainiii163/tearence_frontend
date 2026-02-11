import React, { useState, useEffect } from "react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createClassified } from "../../slice/ClassifiedSlice";
import toast from "react-hot-toast";
import Subscription from "../Subscription";
import {
  FaUpload,
  FaLink,
  FaHeading,
  FaDollarSign,
  FaMapMarkerAlt,
  FaTag,
  FaImage,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { getCategoriesList } from "../../slice/CategorySlice";

function PostClassified() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [screen, setScreen] = useState("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);

  const initialFormState = {
    title: "",
    description: "",
    price: "",
    category_id: "",
    location: "",
    contact_info: "",
    is_negotiable: false,
    condition: "new", // new, used, refurbished
    images: [],
  };

  const [formState, setFormState] = useState(initialFormState);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await dispatch(getCategoriesList({ is_parent: "yes" }));
      if (result.payload?.data?.items) {
        setCategories(result.payload.data.items);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...formState.images, ...files];
    const newPreviews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setFormState({
      ...formState,
      images: newImages,
    });
  };

  const removeImage = (index) => {
    const newImages = formState.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setFormState({
      ...formState,
      images: newImages,
    });
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formState.title.trim()) {
      toast.error("Please enter a title");
      setIsSubmitting(false);
      return;
    }
    if (!formState.description.trim()) {
      toast.error("Please enter a description");
      setIsSubmitting(false);
      return;
    }
    if (!formState.category_id) {
      toast.error("Please select a category");
      setIsSubmitting(false);
      return;
    }
    if (!formState.price) {
      toast.error("Please enter a price");
      setIsSubmitting(false);
      return;
    }
    if (formState.images.length === 0) {
      toast.error("Please upload at least one image");
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      setScreen("pricing");
      setIsSubmitting(false);
    }, 100);
  };

  const onSubmit = async (item) => {
    try {
      const formData = new FormData();
      
      // Add form fields
      Object.keys(formState).forEach((key) => {
        if (key === "images") {
          formState.images.forEach((image) => {
            formData.append("images[]", image);
          });
        } else {
          formData.append(key, formState[key]);
        }
      });

      // Add package information
      formData.append("package", JSON.stringify(item));
      formData.append("package_id", item.package_id);

      await dispatch(createClassified(formData)).unwrap();
      toast.success("Your classified ad has been created successfully!");
      navigate("/my-classifieds-ads");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create classified ad. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {screen === "form" && (
        <>
          <div className="min-h-screen pt-28 pb-8">
            <div className="container mx-auto px-4">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Create Classified Ad
                </h1>
                <p className="text-muted-foreground">
                  Post your classified ad to reach thousands of potential buyers
                </p>
              </div>

              {/* Form Container */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-card border rounded-lg shadow-sm p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Title Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <FaHeading className="h-4 w-4 text-primary" />
                        Ad Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formState.title}
                        placeholder="Enter a descriptive title for your ad"
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formState.description}
                        placeholder="Provide detailed information about what you're selling or offering..."
                        onChange={handleInputChange}
                        rows={4}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Category Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                          <FaTag className="h-4 w-4 text-primary" />
                          Category *
                        </label>
                        <select
                          name="category_id"
                          value={formState.category_id}
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.category_id} value={category.category_id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Price Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                          <FaDollarSign className="h-4 w-4 text-primary" />
                          Price *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formState.price}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        />
                      </div>
                    </div>

                    {/* Location Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <FaMapMarkerAlt className="h-4 w-4 text-primary" />
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formState.location}
                        placeholder="City, State/Province"
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>

                    {/* Condition Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Condition
                      </label>
                      <select
                        name="condition"
                        value={formState.condition}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="new">New</option>
                        <option value="used">Used</option>
                        <option value="refurbished">Refurbished</option>
                      </select>
                    </div>

                    {/* Negotiable Field */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="is_negotiable"
                        id="is_negotiable"
                        checked={formState.is_negotiable}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border border-input text-primary focus:ring-2 focus:ring-ring"
                      />
                      <label htmlFor="is_negotiable" className="text-sm font-medium text-foreground">
                        Price is negotiable
                      </label>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Contact Information
                      </label>
                      <input
                        type="text"
                        name="contact_info"
                        value={formState.contact_info}
                        placeholder="Email or phone number for interested buyers"
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <FaImage className="h-4 w-4 text-primary" />
                        Images * (Max 5)
                      </label>
                      <div className="border-2 border-dashed border-input rounded-md p-6 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          name="images"
                          onChange={handleImageUpload}
                          accept="image/*"
                          multiple
                          className="hidden"
                          id="classified-upload"
                          disabled={formState.images.length >= 5}
                        />
                        <label
                          htmlFor="classified-upload"
                          className={`cursor-pointer block ${formState.images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <FaUpload className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, GIF up to 10MB each (Max 5 images)
                            </p>
                          </div>
                        </label>
                      </div>
                      
                      {/* Image Preview */}
                      {imagePreviews.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Image Preview:
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-md border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FaTrash className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground h-10 px-6 text-sm font-medium transition-colors"
                      >
                        <BsFillArrowLeftCircleFill />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Processing..." : "Continue to Pricing"}
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Help Text */}
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>
                    After submitting your classified ad details, you'll be able to choose a pricing plan
                    to make your ad visible to our audience.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}

      {screen === "pricing" && (
        <Subscription
          data={formState}
          postType="classified"
          onBack={() => setScreen("form")}
          onSubmit={(item) => {
            onSubmit(item);
          }}
        />
      )}
    </div>
  );
}

export default PostClassified;
