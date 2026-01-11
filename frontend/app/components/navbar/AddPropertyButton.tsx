"use client";
import { useRouter } from "next/navigation";

interface AddPropertyButtonProps {
  userId?: string | null;
}

const AddPropertyButton: React.FC<AddPropertyButtonProps> = ({ userId }) => {
  const router = useRouter();

  const airbnbYourHome = () => {
    if (userId) {
      // navigate to become-vendor page where users can list activities
      router.push('/onboarding');
    } else {
      router.push('/onboarding');
    }
  };

  return (
    <div
      onClick={airbnbYourHome}
      className="flex flex-row gap-1 p-3 cursor-pointer text-sm font-semibold rounded-full bg-airbnb text-white hover:bg-airbnb-dark"
    >
      {/* <IoDiamondOutline className="mt-0.5"/> */}
      <p>List your Activities</p>
    </div>
  );
};

export default AddPropertyButton;
