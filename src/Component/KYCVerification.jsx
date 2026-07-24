import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getUserDetails, updateUserDetails } from "../slice/AuthSlice";

function KYCVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, userDetail } = useSelector((state) => state.auth);
  
  const [kycData, setKycData] = useState({
    id_document_type: "",
    id_document_number: "",
    address_proof: "",
    phone_number: "",
    date_of_birth: "",
    nationality: "",
    occupation: "",
  });

  const [documentFiles, setDocumentFiles] = useState({
    id_document: null,
    address_proof_document: null,
    photo_with_id: null,
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKycData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, and PDF files are allowed");
        return;
      }
      setDocumentFiles(prev => ({ ...prev, [name]: file }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!kycData.id_document_type) newErrors.id_document_type = "Document type is required";
    if (!kycData.id_document_number) newErrors.id_document_number = "Document number is required";
    if (!kycData.phone_number) newErrors.phone_number = "Phone number is required";
    if (!kycData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
    if (!kycData.nationality) newErrors.nationality = "Nationality is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!documentFiles.id_document) newErrors.id_document = "ID document is required";
    if (!documentFiles.photo_with_id) newErrors.photo_with_id = "Photo with ID is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    try {
      const formData = new FormData();
      
      // Add KYC data
      Object.keys(kycData).forEach(key => {
        formData.append(key, kycData[key]);
      });
      
      // Add files
      Object.keys(documentFiles).forEach(key => {
        if (documentFiles[key]) {
          formData.append(key, documentFiles[key]);
        }
      });
      
      // Add KYC status
      formData.append('kyc_status', 'pending');
      formData.append('kyc_submitted_at', new Date().toISOString());

      await dispatch(updateUserDetails({ id: userDetail?.data?.customer_id, payload: formData })).unwrap();
      
      toast.success("KYC documents submitted successfully! Your account is now under review.");
      navigate("/dashboard");
      
    } catch (error) {
      toast.error(error.message || "Failed to submit KYC documents");
    }
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  // Check if KYC is already completed or pending
  if (userDetail?.data?.kyc_status === 'approved') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">KYC Verified</h2>
            <p className="text-muted-foreground mb-6">Your identity has been verified. You now have full access to the platform.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (userDetail?.data?.kyc_status === 'pending') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">KYC Under Review</h2>
            <p className="text-muted-foreground mb-6">Your KYC documents are being reviewed. This typically takes 1-2 business days.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  1
                </div>
                <span className="ml-2">Personal Information</span>
              </div>
              <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  2
                </div>
                <span className="ml-2">Document Upload</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${step === 1 ? 50 : 100}%` }}
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-foreground mb-6">KYC Verification</h1>
            <p className="text-muted-foreground mb-6">
              Complete your identity verification to access all features of the platform.
            </p>

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ID Document Type *
                  </label>
                  <select
                    name="id_document_type"
                    value={kycData.id_document_type}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.id_document_type ? 'border-destructive' : 'border-input'
                    }`}
                  >
                    <option value="">Select document type</option>
                    <option value="passport">Passport</option>
                    <option value="national_id">National ID Card</option>
                    <option value="driver_license">Driver's License</option>
                    <option value="residence_permit">Residence Permit</option>
                  </select>
                  {errors.id_document_type && (
                    <p className="text-destructive text-sm mt-1">{errors.id_document_type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Document Number *
                  </label>
                  <input
                    type="text"
                    name="id_document_number"
                    value={kycData.id_document_number}
                    onChange={handleInputChange}
                    placeholder="Enter your document number"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.id_document_number ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.id_document_number && (
                    <p className="text-destructive text-sm mt-1">{errors.id_document_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={kycData.phone_number}
                    onChange={handleInputChange}
                    placeholder="+1234567890"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.phone_number ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.phone_number && (
                    <p className="text-destructive text-sm mt-1">{errors.phone_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={kycData.date_of_birth}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.date_of_birth ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.date_of_birth && (
                    <p className="text-destructive text-sm mt-1">{errors.date_of_birth}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={kycData.nationality}
                    onChange={handleInputChange}
                    placeholder="Enter your nationality"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.nationality ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.nationality && (
                    <p className="text-destructive text-sm mt-1">{errors.nationality}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={kycData.occupation}
                    onChange={handleInputChange}
                    placeholder="Enter your occupation"
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ID Document (Front) *
                  </label>
                  <input
                    type="file"
                    name="id_document"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.id_document ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.id_document && (
                    <p className="text-destructive text-sm mt-1">{errors.id_document}</p>
                  )}
                  <p className="text-muted-foreground text-sm mt-1">
                    Upload a clear photo or PDF of your ID document (max 5MB)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Photo with ID Document *
                  </label>
                  <input
                    type="file"
                    name="photo_with_id"
                    onChange={handleFileChange}
                    accept="image/*"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.photo_with_id ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.photo_with_id && (
                    <p className="text-destructive text-sm mt-1">{errors.photo_with_id}</p>
                  )}
                  <p className="text-muted-foreground text-sm mt-1">
                    Upload a selfie holding your ID document (max 5MB)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address Proof Document
                  </label>
                  <input
                    type="file"
                    name="address_proof_document"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-muted-foreground text-sm mt-1">
                    Utility bill, bank statement, or rental agreement (max 5MB)
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Important Notes:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• All documents must be clear and readable</li>
                    <li>• Documents must be valid and not expired</li>
                    <li>• Information must match your personal details</li>
                    <li>• Review process typically takes 1-2 business days</li>
                  </ul>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-muted text-muted-foreground hover:bg-muted/80 px-6 py-2 rounded-md"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit KYC"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KYCVerification;
