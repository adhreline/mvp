'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

import MenuLink from "./MenuLink";
import LogoutButton from "../LogoutButton";
import { RxAvatar } from "react-icons/rx";
import { HiOutlineMenu } from "react-icons/hi";
import useLoginModal from "@/app/hooks/useLoginModal";
import useSignupModal from "@/app/hooks/useSignupModal";

interface UserNavProps {
    userId?: string | null;
}

const UserNav: React.FC<UserNavProps> = ({
    userId
}) => {
    const router = useRouter();
    const loginModal = useLoginModal();
    const signupModal = useSignupModal();
    const [isOpen, setIsOpen] = useState(false)


    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center"
            >
                {/* Show hamburger icon on small screens, profile icon on larger screens */}
                <HiOutlineMenu className="h-10 w-10 lg:hidden"/>
                <RxAvatar className="h-10 w-10 hidden lg:block"/>
            </button>

            {isOpen && (
                <div className="w-[180px] absolute top-[48px] right-0 bg-white border rounded-2xl shadow-md flex flex-col cursor-pointer">
                    {userId ? (
                        <>
                            {/* List Activities - Only visible on mobile */}
                            <MenuLink
                                label='List your Activities'
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push('/onboarding');
                                }}
                                className="lg:hidden"
                            />

                            <MenuLink
                                label='Inbox'
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push('/inbox');
                                }}
                            />

                            <MenuLink
                                label='My properties'
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push('/myproperties');
                                }}
                            />

                            <MenuLink
                                label='My favorites'
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push('/myfavorites');
                                }}
                            />

                            <MenuLink
                                label='My reservations'
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push('/myreservations');
                                }}
                            />

                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            {/* List Activities - Only visible on mobile (for non-logged in users too) */}
                            <MenuLink
                                label='List your Activities'
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push('/onboarding');
                                }}
                                className="lg:hidden"
                            />

                            <MenuLink 
                                label='Log in'
                                onClick={() => {
                                    // setIsOpen(false);
                                    // loginModal.open();
                                }}
                            />

                            <MenuLink 
                                label='Sign up'
                                onClick={() => {
                                    // setIsOpen(false);
                                    // signupModal.open();
                                }}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default UserNav;