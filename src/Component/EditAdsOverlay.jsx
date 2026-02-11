import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CategoryTreeChild, getCurrency } from "../slice/CategorySlice";
import { updateAds } from "../slice/ListSlice";
import toast from "react-hot-toast";
import { FaImage, FaTag, FaDollarSign, FaTimes, FaCheck } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import ReactQuillWrapper from "./ReactQuillWrapper";
import "react-quill/dist/quill.snow.css";
import "./EditAdsOverlay.css";

function EditAdsOverlay({ onClose, data }) {
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({
    title: "",
    images: [],
    video: null,
    category: "",
    currency: "Select Currency",
    price: "",
    description: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const [originalImages, setOriginalImages] = useState([]); // Keep track of original images
  const [activeInput, setActiveInput] = useState(null);

  const categoryAdsData = useSelector((store) => store.categories.catTreeChild);
  const SubCatPost = categoryAdsData?.data || [];

  const catMasterData = useSelector((store) => store.categories.currency);
  const CatMaster = catMasterData?.data || [];

  useEffect(() => {
    if (data) {
      const initialData = { ...data };
      
      // Handle different image formats
      let processedImages = [];
      let originalImageUrls = [];
      
      if (initialData.images && Array.isArray(initialData.images)) {
        processedImages = initialData.images.map(img => {
          if (typeof img === 'object' && img.image_path) {
            // Backend image object - use the image_path URL
            originalImageUrls.push(img.image_path);
            return img.image_path;
          } else if (typeof img === 'string') {
            // Already a string (base64 or URL)
            if (img.startsWith('http') || img.startsWith('/')) {
              originalImageUrls.push(img);
            }
            return img;
          }
          return img;
        });
      } else if (initialData.images && !Array.isArray(initialData.images)) {
        // Single image - convert to array
        if (typeof initialData.images === 'object' && initialData.images.image_path) {
          processedImages = [initialData.images.image_path];
          originalImageUrls = [initialData.images.image_path];
        } else {
          processedImages = [initialData.images];
          if (initialData.images.startsWith('http') || initialData.images.startsWith('/')) {
            originalImageUrls = [initialData.images];
          }
        }
      } else {
        // No images
        processedImages = [];
      }
      
      initialData.images = processedImages;
      setOriginalImages(originalImageUrls);
      setFormState(initialData);
      dispatch(CategoryTreeChild({ id: data.category_id }));
    }
  }, [data]);
  const handleInputFocus = (inputName) => {
    setActiveInput(inputName);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && name === "images") {
      handleFileChange(e);
    } else if (type === "file") {
      setFormState({
        ...formState,
        [name]: files[0],
      });
    } else {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files) {
      // Validate file types and sizes
      const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`);
          return false;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast.error(`${file.name} is too large. Maximum size is 10MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const promises = validFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      });

      Promise.all(promises)
        .then((base64Strings) => {
          const currentImages = formState.images || [];
          const newImages = [...currentImages, ...base64Strings];
          setFormState({ ...formState, images: newImages });
          toast.success(`${validFiles.length} image(s) uploaded successfully`);
        })
        .catch((error) => {
          console.error("Error converting files:", error);
          toast.error("Error uploading images");
        });
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      const fakeEvent = {
        target: { files: files }
      };
      handleFileChange(fakeEvent);
    }
  };

  useEffect(() => {
    dispatch(getCurrency());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formState.title === "" ||
      formState.category === "" ||
      formState.currency === "Select Currency" ||
      formState.price === "" ||
      formState.description === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (formState.video && formState.images && formState.images.length > 0) {
      alert("Please select either images or a video, not both.");
      return;
    }
    // Allow update without images if there are existing images
    if ((!formState.images || formState.images.length === 0) && originalImages.length === 0) {
      alert("Please select at least one image.");
      return;
    }
    if (parseFloat(formState.price) < 0) {
      alert("Price cannot be negative.");
      return;
    }
    try {
      // Prepare form data with proper image format
      const submitData = { ...formState };
      
      // Send the desired final state of images
      // The backend will handle extracting new uploads and preserving existing ones
      if (submitData.images && Array.isArray(submitData.images)) {
        // Send all current images (mix of existing URLs and new base64)
        // Backend will process accordingly
        submitData.images = submitData.images.flat();
      } else {
        // No images selected - explicitly send empty array to clear all images
        submitData.images = [];
      }
      
      console.log('Submitting data:', submitData);
      console.log('Total images being sent:', submitData.images?.length || 0);
      
      await dispatch(
        updateAds({ adsId: formState.listing_id, formData: submitData })
      ).unwrap();
      toast.success("Ad has been updated successfully");
      onClose();
    } catch (error) {
      toast.error(error?.message || error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Edit Ad Details</h2>
            <p className="text-sm text-muted-foreground">{data?.category?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <MdOutlineClose className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <form className="p-6 space-y-8" onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaTag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                  <p className="text-sm text-muted-foreground">Update your ad details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Ad Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formState.title}
                    placeholder="Enter a descriptive title for your ad"
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Sub Category *</label>
                  <select
                    name="category"
                    value={formState.category}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select Sub Category</option>
                    {SubCatPost.items &&
                      SubCatPost.items[0]?.childs?.map((subCat, i) => {
                        return (
                          <option key={i} value={subCat.name}>
                            {subCat.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
            </div>
            {/* Images Section */}
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaImage className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Images</h3>
                  <p className="text-sm text-muted-foreground">Upload high-quality images</p>
                </div>
              </div>

              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : 'border-input hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FaImage className={`h-8 w-8 mx-auto mb-2 transition-colors ${
                  dragActive ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  name="images"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload-edit"
                />
                <label
                  htmlFor="image-upload-edit"
                  className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dragActive ? 'Drop images here' : 'Click to upload images or drag and drop'}
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF up to 10MB each
                </p>
                {formState.images && formState.images.length > 0 && (
                  <p className="text-xs text-primary mt-1 font-medium">
                    {formState.images.length} image(s) selected
                  </p>
                )}
              </div>
              
              {/* Image Preview Section */}
              {formState.images && formState.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-foreground mb-2">
                    Selected Images ({formState.images.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formState.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-input"
                          onError={(e) => {
                            e.target.src = "/img/no-image.png";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formState.images.filter((_, i) => i !== index);
                            setFormState({...formState, images: newImages});
                          }}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        {/* Show indicator for existing vs new images */}
                        <div className="absolute top-2 left-2">
                          {originalImages.includes(image) ? (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Existing
                            </span>
                          ) : (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Video Section */}
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Video (Optional)</label>
                <input
                  type="file"
                  name="video"
                  onChange={handleChange}
                  accept="video/*"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <p className="text-xs text-muted-foreground">Upload a video file (optional, instead of images)</p>
              </div>
            </div>
            {/* Pricing Section */}
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaDollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Pricing</h3>
                  <p className="text-sm text-muted-foreground">Set your price and currency</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Currency *</label>
                  <select
                    name="currency"
                    value={formState.currency}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select Currency</option>
                    {CatMaster.items &&
                      CatMaster.items.map((currency, i) => {
                        return (
                          <option key={i} value={currency.name}>
                            {currency.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Price *</label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formState.price}
                    onChange={handleChange}
                    placeholder="Enter price amount"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  />
                </div>
              </div>
            </div>
            {/* Description Section */}
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description *</label>
                <ReactQuillWrapper
                  value={formState.description}
                  onChange={(value) => {
                    setFormState({
                      ...formState,
                      description: value,
                    });
                  }}
                  modules={EditAdsOverlay.modules}
                  formats={EditAdsOverlay.formats}
                  className="react-quill-editor"
                  placeholder="Describe your product or service..."
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-card flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <FaTimes className="mr-2 h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            form="edit-form"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <FaCheck className="mr-2 h-4 w-4" />
            Update Ad
          </button>
        </div>
      </div>
    </div>
  );
}
EditAdsOverlay.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
};

// Quill formats to control which formats are allowed in the editor
EditAdsOverlay.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];
export default EditAdsOverlay;
