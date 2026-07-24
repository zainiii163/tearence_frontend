import React, { useState } from "react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createBanner } from "../../slice/BannerSlice";
import Footer from "../Footer";
import toast from "react-hot-toast";
import Subscription from "../Subscription";
import { FaUpload, FaLink, FaHeading } from "react-icons/fa";

function PostBanner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageBase64, setImageBase64] = useState("");
  
  const initialFormState = {
    title: "",
    url_link: "",
    img: null,
    size_img: "",
    author_id: 0,
    user_id: parseInt(localStorage.getItem("customer_id")),
  };

  const [formState, setFormState] = useState(initialFormState);
  const [activeInput, setActiveInput] = useState(null);
  const [screen, setScreen] = useState("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputFocus = (inputName) => {
    setActiveInput(inputName);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
        setFormState({
          ...formState,
          [name]: reader.result,
        });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (formState.title === "" || formState.url_link === "") {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }
    if (formState.img === "") {
      toast.error("Please select an image");
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
      await dispatch(
        createBanner({
          formData: {
            ...formState,
            package: item,
            package_id: item.package_id,
          },
        })
      ).unwrap();
      toast.success("Your banner ad has been created successfully!");
      navigate("/my-banner-ads");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create banner ad. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {screen === "form" && (
        <>
          <div className="min-h-screen pt-28 pb-8">
            <div className="page-container">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Create Banner Ad
                </h1>
                <p className="text-muted-foreground">
                  Create eye-catching banner ads to promote your business
                </p>
              </div>

              {/* Form Container */}
              <div className="max-w-2xl mx-auto">
                <div className="bg-card border rounded-lg shadow-sm p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Title Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <FaHeading className="h-4 w-4 text-primary" />
                        Banner Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formState.title}
                        placeholder="Enter your banner title"
                        onFocus={() => handleInputFocus("title")}
                        onBlur={handleInputBlur}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>

                    {/* URL Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <FaLink className="h-4 w-4 text-primary" />
                        Destination URL *
                      </label>
                      <input
                        type="url"
                        name="url_link"
                        value={formState.url_link}
                        placeholder="https://example.com"
                        onFocus={() => handleInputFocus("url_link")}
                        onBlur={handleInputBlur}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <FaUpload className="h-4 w-4 text-primary" />
                        Banner Image *
                      </label>
                      <div className="border-2 border-dashed border-input rounded-md p-6 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          name="img"
                          onChange={handleChange}
                          accept="image/*"
                          className="hidden"
                          id="banner-upload"
                          required
                        />
                        <label
                          htmlFor="banner-upload"
                          className="cursor-pointer block"
                        >
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <FaUpload className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </label>
                      </div>
                      
                      {/* Image Preview */}
                      {imageBase64 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Preview:
                          </p>
                          <img
                            src={imageBase64}
                            alt="Banner preview"
                            className="max-w-full h-auto max-h-48 rounded-md border"
                          />
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
                    After submitting your banner details, you'll be able to choose a pricing plan
                    to make your banner ad visible to our audience.
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
          postType="banner"
          onBack={() => setScreen("form")}
          onSubmit={(item) => {
            onSubmit(item);
          }}
        />
      )}
    </div>
  );
}

export default PostBanner;