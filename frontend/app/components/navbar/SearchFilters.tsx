"use client";
import { FaCaretDown } from "react-icons/fa";
import { HiMagnifyingGlass } from "react-icons/hi2";
import useSearchModal from "@/app/hooks/useSearchModal";

const SearchFilters = () => {
  const searchModal = useSearchModal();

  return (
    <div
    //   onClick={() => searchModal.open("location")}
      className="h-[48px] lg:h-[64] flex flex-row items-center justify-between border rounded-full"
    >
      <div className="hidden lg:block">
        <div className="text-gray-500 flex flex-row items-center justify-between">
          <div className="cursor-pointer h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100">
            <div className="flex flex-row">
              <p className="text-sm">Place</p>
              <FaCaretDown className="mt-0.5" />
            </div>
          </div>

          <div className="cursor-pointer h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100">
            <div className="flex flex-row">
              <p className="text-sm">Activities</p>
              <FaCaretDown className="mt-0.5" />
            </div>
          </div>

          <div className="cursor-pointer h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100">
            <div className="flex flex-row">
              <p className="text-sm">Date and Time</p>
              <FaCaretDown className="mt-0.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="cursor-pointer h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full bg-airbnb hover:bg-airbnb-dark">
        <div className="flex flex-row gap-2 cursor-pointer text-white">
          <HiMagnifyingGlass className="mt-1" />
          <p className="">Search</p>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
