
import { BsFacebook, BsLinkedin, BsTwitter, BsYoutube } from 'react-icons/bs';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            {/* <img src="/logo.png" alt="Estatein Logo" className="h-8 w-auto" /> Replace with your logo */}
            <span className="text-xl font-bold">GeoTech</span>
            
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-[#45A9EA] hover:text-[#3B94DC]">
              Home
            </a>
            <a href="#" className="text-[#45A9EA] hover:text-[#3B94DC]">
              About Us
            </a>
            <a href="#" className="text-[#45A9EA] hover:text-[#3B94DC]">
              Properties
            </a>
            <a href="#" className="text-[#45A9EA] hover:text-[#3B94DC]">
              Services
            </a>
            <a href="#" className="text-[#45A9EA] hover:text-[#3B94DC]">
              Contact Us
            </a>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <a href="#" className="text-[#45A9EA] hover:text-[#3B94DC]">
            <BsFacebook size={24} />
          </a>
          <a href="#" className="text-[#45A9EA] hover:text-[#3B94DC]">
            <BsLinkedin size={24} />
          </a>
          <a href="#" className="text-[#45A9EA] hover:text-[#3B94DC]">
            <BsTwitter size={24} />
          </a>
          <a href="#" className="text-[#45A9EA] hover:text-[#3B94DC]">
            <BsYoutube size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;