import Image from "next/image";
import Link from "next/link";
import SearchFilters from "./SearchFilters";
import UserNav from "./UserNav";
import { getUserId } from "@/app/lib/actions";
import AddPropertyButton from './AddPropertyButton';
import MobileSearchButton from './MobileSearchButton';

const NavbarServer = async () => {
  const userId = await getUserId();
  console.log("userId:", userId);

  return (
    <nav className="w-full fixed top-0 left-0 py-6 bg-white z-10">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="space-x-6">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="DjangoBnb logo"
                width={180}
                height={38}
              />
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex space-x-6">
            <SearchFilters />
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile/Tablet Search Button */}
            <div className="lg:hidden">
              <MobileSearchButton />
            </div>
            
            <div className="">
            <AddPropertyButton userId={userId}/>
            </div>
            <UserNav userId={userId} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarServer;
