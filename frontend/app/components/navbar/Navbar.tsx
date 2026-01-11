import Image from "next/image";
import Link from "next/link";
import SearchFilters from "./SearchFilters";
import UserNav from "./UserNav";
import AddPropertyButton from './AddPropertyButton';
import MobileSearchButton from './MobileSearchButton';


const Navbar = async () => {
  const userId = "1";

  return (
    <nav className="w-full fixed top-0 left-0 py-6 bg-white z-10">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="space-x-6">
            <Link href="/">
              {/* Responsive logo - smaller on mobile, full size on desktop */}
              <Image
                src="/Untitled-2.png"
                alt="DjangoBnb logo"
                width={180}
                height={38}
                className="w-[120px] h-auto sm:w-[140px] md:w-[160px] lg:w-[180px]"
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
            
            {/* Desktop Only - List Activities Button */}
            <div className="hidden lg:block">
              <AddPropertyButton userId={userId}/>
            </div>
            <UserNav userId={userId} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
