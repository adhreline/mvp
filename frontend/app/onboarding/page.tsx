"use client";

import React, { useState, useRef } from "react";
import CustomButton from "@/app/components/forms/CustomButton";
import apiService from "@/app/services/apiService";
import { useRouter } from "next/navigation";
import PendingApprovalPage from "./pending/page";

type NullableFile = File | null;

const BecomeVendorPage: React.FC = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [category, setCategory] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [pendingPage, setPendingPage] = useState<boolean>(false)
  // file uploads
  const [tradeLicenseFile, setTradeLicenseFile] = useState<NullableFile>(null);
  const [nicFile, setNicFile] = useState<NullableFile>(null);
  const [activityDocsFiles, setActivityDocsFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const validateFile = (file: File, label: string): string[] => {
    const errs: string[] = [];
    if (file.size > MAX_FILE_SIZE) errs.push(`${label}: file must be <= 10MB`);
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) errs.push(`${label}: unsupported file type`);
    return errs;
  };

  const validateAndSetFile = (file: NullableFile, setter: (f: NullableFile) => void, label: string) => {
    if (!file) {
      setter(null);
      return;
    }

    const errs = validateFile(file, label);
    if (errs.length) {
      setFileErrors((prev) => [...prev, ...errs]);
      setter(null);
    } else {
      setter(file);
    }
  };

  const validateAndAppendFiles = (files: File[], setter: React.Dispatch<React.SetStateAction<File[]>>, label: string) => {
    if (!files || files.length === 0) return;
    const allErrs: string[] = [];
    const accepted: File[] = [];
    for (const f of files) {
      const errs = validateFile(f, label);
      if (errs.length) allErrs.push(...errs);
      else accepted.push(f);
    }

    if (allErrs.length) {
      setFileErrors((prev) => [...prev, ...allErrs]);
    }

    if (accepted.length) {
      setter((prev) => [...prev, ...accepted]);
    }
  };


  const [dragTrade, setDragTrade] = useState(false);
  const [dragNic, setDragNic] = useState(false);
  const [dragActivity, setDragActivity] = useState(false);
  const activityInputRef = useRef<HTMLInputElement | null>(null);

  const submitVendorSignup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrors([]);
    const validationErrors: string[] = [];
    const vFieldErrors: Record<string, string> = {};

    if (!firstName.trim()) { validationErrors.push('First name is required'); vFieldErrors['fname'] = 'First name is required'; }
    if (!lastName.trim()) { validationErrors.push('Last name is required'); vFieldErrors['lname'] = 'Last name is required'; }
    if (!email.trim()) { validationErrors.push('Email is required'); vFieldErrors['email'] = 'Email is required'; }
    else if (!/^[\w-.]+@[\w-]+\.[A-Za-z]{2,}$/.test(email)) { validationErrors.push('Email is invalid'); vFieldErrors['email'] = 'Email is invalid'; }
    if (!companyName.trim()) { validationErrors.push('Business name is required'); vFieldErrors['bname'] = 'Business name is required'; }
    if (!password1) { validationErrors.push('Password is required'); vFieldErrors['password'] = 'Password is required'; }
    if (password1 && password1.length < 6) { validationErrors.push('Password must be at least 6 characters'); vFieldErrors['password'] = 'Password must be at least 6 characters'; }
    if (password1 !== password2) { validationErrors.push('Passwords do not match'); vFieldErrors['password'] = 'Passwords do not match'; }
    if (!category) { validationErrors.push('Category is required'); vFieldErrors['bcategory'] = 'Category is required'; }
    if (!businessDescription.trim() || businessDescription.trim().length < 20) { validationErrors.push('Business description must be at least 20 characters'); vFieldErrors['bdescription'] = 'Business description must be at least 20 characters'; }
    if (!businessAddress.trim()) { validationErrors.push('Business address is required'); vFieldErrors['baddress'] = 'Business address is required'; }
    if (!businessPhone.trim()) { validationErrors.push('Business phone number is required'); vFieldErrors['bphone_number'] = 'Business phone number is required'; }
    else if (!/^\+?\d{7,15}$/.test(businessPhone.trim())) { validationErrors.push('Business phone number is invalid'); vFieldErrors['bphone_number'] = 'Business phone number is invalid'; }

    if (!tradeLicenseFile) { validationErrors.push('Trade License is required'); vFieldErrors['trade_license_file'] = 'Trade License is required'; }
    if (!nicFile) { validationErrors.push('PAN Card is required'); vFieldErrors['pan_card_file'] = 'PAN Card is required'; }
    if (!activityDocsFiles || activityDocsFiles.length === 0) { validationErrors.push('At least one activity-specific document is required'); vFieldErrors['activity_documents'] = 'At least one activity-specific document is required'; }

    if (validationErrors.length) {
      setErrors(validationErrors);
      setFieldErrors(vFieldErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

  const form = new FormData();
    form.append('email', email.trim());
    form.append('fname', firstName.trim());
    form.append('lname', lastName.trim());
    form.append('bname', companyName.trim());
    form.append('baddress', businessAddress.trim());
    form.append('bphone_number', businessPhone.trim());
    form.append('bcategory', category);
  // form.append('business_type', businessType);
    form.append('bdescription', businessDescription.trim());
    form.append('password', password1);

    // attach files using the field names your backend expects
    if (tradeLicenseFile) form.append('trade_license_file', tradeLicenseFile);
    if (nicFile) form.append('pan_card_file', nicFile);
    if (activityDocsFiles && activityDocsFiles.length) {
      activityDocsFiles.forEach((f) => form.append('activity_documents', f));
    }

    // sample boolean flag included as string (matches your example)
    form.append('trade_license', 'true');

    // Use XMLHttpRequest to get upload progress events
    try {
      setUploading(true);
      setUploadProgress(0);
      setErrors([]);
      setFieldErrors({});

      const apiHost = process.env.NEXT_PUBLIC_API_HOST
      const endpoint = `https://api.adhreline.com/api/vendor/signup`;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const pct = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(pct);
          }
        };

        xhr.onload = () => {
          setUploading(false);
          setUploadProgress(100);
          if (xhr.status === 201) {
            resolve();
            setPendingPage(true)
            return;
          }

          let data: any = null;
          try { data = JSON.parse(xhr.responseText); } catch (e) { /* ignore */ }
          if (data && typeof data === 'object') {
            // Map server-field errors to fieldErrors when possible
            const flatErrors: string[] = [];
            const fieldErrs: Record<string, string> = {};
            for (const [k, v] of Object.entries(data)) {
              if (Array.isArray(v)) {
                fieldErrs[k] = v.join(', ');
              } else if (typeof v === 'string') {
                fieldErrs[k] = v;
              } else {
                flatErrors.push(String(v));
              }
            }
            setFieldErrors(fieldErrs);
            if (flatErrors.length) setErrors(flatErrors);
          } else {
            setErrors([`Request failed with status ${xhr.status}`]);
          }

          // resolve so outer try doesn't treat this as an exception; we've displayed server errors inline
          resolve();
        };

        xhr.onerror = () => {
          setUploading(false);
          setUploadProgress(0);
          reject(new Error('Network error'));
        };

        xhr.send(form);
        console.log(form)
      });
    } catch (err: any) {
      setUploading(false);
      setUploadProgress(0);
      setErrors((prev) => [...prev, String(err.message || err)]);
    }
  };
  if (pendingPage) {
    return <PendingApprovalPage />;
  }

  return (
      <>
      <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 sm:px-6">
      <div className="bg-white p-4 sm:p-8 rounded-xl shadow">
        <h2 className="text-xl sm:text-2xl font-semibold mb-1 text-center">Become a Vendor</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 text-center">Join our network and list your activities. We'll review your submission and get back to you.</p>

        <form onSubmit={submitVendorSignup} className={`space-y-4 sm:space-y-6 relative ${uploading ? 'pointer-events-none opacity-80' : ''}`}>
          {uploading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/60">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-airbnb" />
                <div className="text-sm text-gray-700 mt-2">Uploading... {uploadProgress}%</div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />
              {fieldErrors.fname && <div className="text-xs text-red-500 mt-1">{fieldErrors.fname}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />
              {fieldErrors.lname && <div className="text-xs text-red-500 mt-1">{fieldErrors.lname}</div>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />
            {fieldErrors.email && <div className="text-xs text-red-500 mt-1">{fieldErrors.email}</div>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input 
                  value={password1} 
                  onChange={(e) => setPassword1(e.target.value)} 
                  placeholder="Add a strong Password" 
                  type={showPassword1 ? "text" : "password"} 
                  className="w-full h-[54px] px-4 pr-12 border border-gray-300 rounded-xl" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword1(!showPassword1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword1 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && <div className="text-xs text-red-500 mt-1">{fieldErrors.password}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Repeat Password</label>
              <div className="relative">
                <input 
                  value={password2} 
                  onChange={(e) => setPassword2(e.target.value)} 
                  placeholder="Repeat the password" 
                  type={showPassword2 ? "text" : "password"} 
                  className="w-full h-[54px] px-4 pr-12 border border-gray-300 rounded-xl" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword2 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Business Name</label>
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Adventures" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />
            {fieldErrors.bname && <div className="text-xs text-red-500 mt-1">{fieldErrors.bname}</div>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Business Address</label>
            <input value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="123 Adventure Lane, Trailblazer City" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />
            {fieldErrors.baddress && <div className="text-xs text-red-500 mt-1">{fieldErrors.baddress}</div>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Business Phone Number</label>
            <input value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} placeholder="+911234567809" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />
            {fieldErrors.bphone_number && <div className="text-xs text-red-500 mt-1">{fieldErrors.bphone_number}</div>}
          </div>
          <label className="block text-sm font-medium mb-2">GST Registration Number</label>
          <input placeholder="+911234567809" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
            <div />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-[54px] px-4 border border-gray-300 rounded-xl">
              <option value="">Select a category</option>
              <option value="Bungee Jumping">Bungee Jumping</option>
              {/* <option value="Skiing">Skiing</option> */}
              <option value="Zipline">Zipline</option>
              <option value="Rafting">Rafting</option>
              <option value="SkyDiving">SkyDiving</option>
              <option value="Go Kart">Go Kart</option>
              <option value="Hiking">Hiking</option>
              <option value="Rock Climbing">Rock Climbing</option>
              <option value="ATV Ride">ATV Ride</option>
              <option value="Flyboard">Flyboard</option>
              {/* <option value="Bike Riding">Bike Riding</option> */}
              <option value="JungleSafari">JungleSafari</option>
              {/* <option value="Desert Safari">Desert Safari</option> */}
              <option value="Hot Air Balloon Ride">Hot Air Balloon Ride</option>
              <option value="Paragliding">Paragliding</option>
              <option value="Kayaking">Kayaking</option>
              <option value="Scuba Diving">Scuba Diving</option>
              {/* <option value="Surfing">Surfing</option> */}
            </select>
            {fieldErrors.bcategory && <div className="text-xs text-red-500 mt-1">{fieldErrors.bcategory}</div>}
          </div>



          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-3">Required Documents</h3>

            {fileErrors.length > 0 && (
              <div className="space-y-1 mb-2">
                {fileErrors.map((fe, i) => (
                  <div key={i} className="text-xs text-red-500">{fe}</div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {/* Trade License */}
              <div>
                <div className="mb-2 text-xs text-gray-600">1. Trade License</div>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragTrade(true); }}
                  onDragLeave={() => setDragTrade(false)}
                  onDrop={(e) => { e.preventDefault(); setDragTrade(false); const file = e.dataTransfer.files?.[0]; setFileErrors([]); validateAndSetFile(file ?? null, setTradeLicenseFile, 'Trade License'); }}
                  className={`relative border-dashed rounded-lg p-4 sm:p-6 border ${dragTrade ? 'border-airbnb bg-airbnb/5' : 'border-gray-200 bg-white'} flex flex-col items-center justify-center`}
                >
                  <div className="w-10 h-6 mb-2 border rounded-full bg-gray-50 flex items-center justify-center"> 
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 0 1-1-7.874A5 5 0 0 1 17 7a5 5 0 0 1 .7 9.98"/></svg>
                  </div>
                  {tradeLicenseFile ? (
                    <div className="text-sm text-gray-700 text-center break-all px-2">{tradeLicenseFile.name}</div>
                  ) : (
                    <>
                      <div className="text-sm text-red-500">Upload Trade License</div>
                      <div className="text-xs text-gray-400">or drag and drop</div>
                      <div className="text-xs text-gray-300 mt-2">PDF, DOCX, PNG, JPG up to 10MB</div>
                    </>
                  )}
                  <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" accept="application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => { setFileErrors([]); validateAndSetFile(e.target.files?.[0] ?? null, setTradeLicenseFile, 'Trade License'); }} />
                  {fieldErrors.trade_license_file && <div className="text-xs text-red-500 mt-1">{fieldErrors.trade_license_file}</div>}
                </div>
              </div>

              {/* PAN / NIC */}
              <div>
                <div className="mb-2 text-xs text-gray-600">2. PAN Card</div>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragNic(true); }}
                  onDragLeave={() => setDragNic(false)}
                  onDrop={(e) => { e.preventDefault(); setDragNic(false); const file = e.dataTransfer.files?.[0]; setFileErrors([]); validateAndSetFile(file ?? null, setNicFile, 'PAN Card'); }}
                  className={`relative border-dashed rounded-lg p-4 sm:p-6 border ${dragNic ? 'border-airbnb bg-airbnb/5' : 'border-gray-200 bg-white'} flex flex-col items-center justify-center`}
                >
                  <div className="w-10 h-6 mb-2 border rounded-full bg-gray-50 flex items-center justify-center"> 
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 0 1-1-7.874A5 5 0 0 1 17 7a5 5 0 0 1 .7 9.98"/></svg>
                  </div>
                  {nicFile ? (
                    <div className="text-sm text-gray-700 text-center break-all px-2">{nicFile.name}</div>
                  ) : (
                    <>
                      <div className="text-sm text-red-500">Upload PAN Card</div>
                      <div className="text-xs text-gray-400">or drag and drop</div>
                      <div className="text-xs text-gray-300 mt-2">PDF, DOCX, PNG, JPG up to 10MB</div>
                    </>
                  )}
                  <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" accept="application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => { setFileErrors([]); validateAndSetFile(e.target.files?.[0] ?? null, setNicFile, 'PAN Card'); }} />
                  {fieldErrors.pan_card_file && <div className="text-xs text-red-500 mt-1">{fieldErrors.pan_card_file}</div>}
                </div>
              </div>

              {/* Activity docs */}
              <div>
                <div className="mb-2 text-xs text-gray-600">3. Adventure Tour Operator (ATO) Permit/Inner Line Permit</div>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActivity(true); }}
                  onDragLeave={() => setDragActivity(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActivity(false); const files = Array.from(e.dataTransfer.files ?? []); setFileErrors([]); validateAndAppendFiles(files, setActivityDocsFiles, 'Activity Documents'); }}
                  className={`relative border-dashed rounded-lg p-4 sm:p-6 border ${dragActivity ? 'border-airbnb bg-airbnb/5' : 'border-gray-200 bg-white'} flex flex-col items-center justify-center`}
                >
                  <div className="w-10 h-6 mb-2 border rounded-full bg-gray-50 flex items-center justify-center"> 
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 0 1-1-7.874A5 5 0 0 1 17 7a5 5 0 0 1 .7 9.98"/></svg>
                  </div>
                  {activityDocsFiles.length ? (
                                  <div className="text-sm text-gray-700 relative z-30 w-full px-2">
                                  <ul className="list-disc list-inside space-y-1">
                                    {activityDocsFiles.map((f, idx) => (
                                      <li key={idx} className="flex items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm">
                                        <span className="truncate flex-1">{f.name}</span>
                                        <button
                                          type="button"
                                          onClick={(ev) => {
                                            ev.stopPropagation();
                                            // remove the file at idx
                                            setActivityDocsFiles((prev) => prev.filter((_, i) => i !== idx));
                                          }}
                                          className="text-xs text-red-500 ml-2 sm:ml-4 flex-shrink-0"
                                        >
                                          Remove
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                  ) : (
                    <>
                      <div className="text-sm text-red-500 text-center px-2">Upload Adventure Tour Operator (ATO) Permit/Inner Line Permit</div>
                      <div className="text-xs text-gray-400">or drag and drop</div>
                      <div className="text-xs text-gray-300 mt-2 text-center px-2">Please upload safety certificates, permits, or licenses specific to your activity type</div>
                    </>
                  )}
                  {/* make the real input ignore pointer events so the Remove button can be clicked */}
                  <input ref={activityInputRef} className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" multiple type="file" accept="application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => { setFileErrors([]); const files = Array.from(e.target.files ?? []); validateAndAppendFiles(files, setActivityDocsFiles, 'Activity Documents'); }} />
                  {/* clicking the wrapper will open the file dialog */}
                  <div className="absolute inset-0" onClick={() => activityInputRef.current?.click()} />
                  {fieldErrors.activity_documents && <div className="text-xs text-red-500 mt-1">{fieldErrors.activity_documents}</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Business description</label>
            <textarea value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} placeholder="Tell us about your activities, schedule, audience, and safety notes." className="w-full min-h-[100px] sm:min-h-[120px] px-4 py-3 border border-gray-300 rounded-xl text-sm sm:text-base" />
            {fieldErrors.bdescription && <div className="text-xs text-red-500 mt-1">{fieldErrors.bdescription}</div>}
          </div>

          {/* {errors.length > 0 && (
            <div className="space-y-2">
              {errors.map((error, idx) => (
                <div key={idx} className="p-3 bg-red-500 text-white rounded">{error}</div>
              ))}
            </div>
          )} */}

          {uploading && (
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div style={{ width: `${uploadProgress}%` }} className="h-2 bg-airbnb transition-all" />
              </div>
              <div className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</div>
            </div>
          )}

          <CustomButton label="Submit for Approval" onClick={submitVendorSignup} disabled={uploading} loading={uploading} />
        </form>
        <p className="text-xs sm:text-sm text-gray-400 mt-4 text-center px-2">After submission, your application will be reviewed by our admin team. You'll be notified upon approval.</p>
      </div>
    </div>
  </>

  );
};

export default BecomeVendorPage;
