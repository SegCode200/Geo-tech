import { useState } from 'react';
import receivepayment from "../assets/Certificate of Occupancy.jpg"
import fastprocessing from "../assets/Fast document processing.jpg"
import security from "../assets/Document security protection.jpg"
import easyapplication from "../assets/Online form submission1.jpg"
import makepayment from "../assets/A secure online payment illustration.jpg"
import happy from '../assets/Happy business professional portrait.jpg';
import  hero from "../assets/professional real estate signing.jpg"
import account from "../assets/A person signing up online.jpg"
import payment from "../assets/Online form submission.jpg"
// import { FaUserPlus, FaFileUpload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-20 text-center">
        <h1 className="text-5xl font-bold">Get Your Certificate of Occupancy Online</h1>
        <p className="mt-4 text-lg">Fast, Secure, and Hassle-Free Land Registration</p>
        <button onClick={() => navigate('/auth')}  className="mt-6 px-6 py-3 bg-yellow-400 text-blue-900 font-bold rounded-lg hover:bg-yellow-500">
          Apply Now
        </button>
        <img 
          src={hero}
          alt="Hero Image" 
          className="mt-6 mx-auto w-4/5 rounded-lg shadow-lg"
        />
      </header>

      {/* Features Section */}
      <section className="py-16 px-8 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">Why Choose Us?</h2>
        <p className="mt-2 text-gray-600">We provide a seamless, secure, and efficient way to obtain your Certificate of Occupancy.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <FeatureCard title="Fast Processing" description="Get your C of O approved in record time." image={fastprocessing} />
          <FeatureCard title="Secure Platform" description="Your documents are safe with our encryption." image={security} />
          <FeatureCard title="Easy Application" description="Simple steps to apply online from anywhere." image={easyapplication} />
        </div>
      </section>

      {/* Steps to Apply */}
      <section className="py-16 bg-blue-50 px-8 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">How It Works</h2>
        <p className="mt-2 text-gray-600">Follow these simple steps to get your Certificate of Occupancy with ease.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          <StepCard number="1" title="Create an Account" image={account} />
          <StepCard number="2" title="Upload Your Documents" image={payment} />
          <StepCard number="3" title="Make Payment" image={makepayment} />
          <StepCard number="4" title="Receive Your C of O" image={receivepayment} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-8 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">What Our Users Say</h2>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <TestimonialCard name="Jane Doe" feedback="This platform made it so easy for me to get my C of O without stress!" image={happy} />
          <TestimonialCard name="John Smith" feedback="I got my certificate faster than I expected. Highly recommended!" image={happy} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p>&copy; 2025 C of O Portal. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, image }:any) {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <img src={image} alt={title} className="w-full h-40 object-cover rounded-lg mb-4" />
      <h3 className="text-xl font-semibold text-blue-600">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ number, title, image, icon }:any) {
  return (
    <div className="bg-white p-6 shadow-md rounded-lg w-60 text-center">
      {icon ? (
        <motion.div 
          className="mb-4" 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        >
          {icon}
        </motion.div>
      ) : (
        <img src={image} alt={title} className="w-full h-32 object-cover rounded-lg mb-4" />
      )}
      <div className="text-4xl font-bold text-blue-600">{number}</div>
      <h3 className="text-xl font-semibold mt-2 text-gray-800">{title}</h3>
    </div>
  );
}

function TestimonialCard({ name, feedback, image }:any) {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
      <img src={image} alt={name} className="w-20 h-20 rounded-full mx-auto mb-4" />
      <p className="text-gray-600 italic">"{feedback}"</p>
      <h4 className="mt-4 font-semibold text-blue-600">- {name}</h4>
    </div>
  );
}
