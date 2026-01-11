'use client';

import Modal from "./Modal";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import useLoginModal from "@/app/hooks/useLoginModal";
import CustomButton from "../forms/CustomButton";
import apiService from "@/app/services/apiService";
import { handleLogin } from "@/app/lib/actions";

const LoginModal = () => {
    const router = useRouter()
    // repurpose this modal to act as a vendor signup modal
    // keep using the login modal hook so existing callers still open this modal
    const loginModal = useLoginModal();
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const submitVendorSignup = async () => {
        const formData = {
            email: email,
            password1: password1,
            password2: password2,
            is_vendor: true,
            company_name: companyName,
            business_type: businessType,
            registration_number: registrationNumber
        }

        const response = await apiService.postWithoutToken('/api/auth/register/', JSON.stringify(formData))

        if (response.access) {
            handleLogin(response.user.pk, response.access, response.refresh);

            loginModal.close();

            router.push('/')
        } else {
            const tmpErrors: string[] = Object.values(response).map((error: any) => {
                return error;
            })

            setErrors(tmpErrors);
        }
    }

    const content = (
        <>
            <form 
                action={submitVendorSignup}
                className="space-y-4"
            >
                <input onChange={(e) => setEmail(e.target.value)} placeholder="Your e-mail address" type="email" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />

                <input onChange={(e) => setPassword1(e.target.value)} placeholder="Your password" type="password" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />

                <input onChange={(e) => setPassword2(e.target.value)} placeholder="Repeat password" type="password" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />

                <input onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" type="text" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />

                <input onChange={(e) => setBusinessType(e.target.value)} placeholder="Business type" type="text" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />

                <input onChange={(e) => setRegistrationNumber(e.target.value)} placeholder="Registration number" type="text" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />
            
                {errors.map((error, index) => {
                    return (
                        <div 
                            key={`error_${index}`}
                            className="p-5 bg-airbnb text-white rounded-xl opacity-80"
                        >
                            {error}
                        </div>
                    )
                })}

                <CustomButton
                    label="Sign up as Vendor"
                    onClick={submitVendorSignup}
                />
            </form>
        </>
    )

    return (
        <Modal
            isOpen={loginModal.isOpen}
            close={loginModal.close}
            label="Sign up as Vendor"
            content={content}
        />
    )
}

export default LoginModal;