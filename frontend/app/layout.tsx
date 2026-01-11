import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import { Footer } from "./components/footer/Footer";
import LoginModal from "./components/modals/LoginModal";
import SearchModal from "./components/modals/SearchModal";
import SignupModal from "./components/modals/SignupModal";
import AddPropertyModal from "./components/modals/AddPropertyModal";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "adhreline",
  description: "adhreline",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Navbar />
        
        <div className="pt-32">
          {children}
        </div>

        <LoginModal />
        <SearchModal />
        <SignupModal />
        <AddPropertyModal />
        <Footer/>
      </body>
    </html>
  );
}
