import React, { useState, useEffect } from 'react';
import { User, Stethoscope, FileText, Pill } from 'lucide-react'; // Using Lucide React for icons

const Main = () => {
  // Placeholder images for the carousel
  const carouselImages = [
    "https://placehold.co/1000x1000/F0F9FF/0C4A6E?text=Happy+Family",
    "https://placehold.co/1000x1000/D1E0FF/0C4A6E?text=Doctor+and+Patient",
    "https://placehold.co/1000x1000/E8D2FF/431478?text=Medical+Records"
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Set up an interval to change the image every 3 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % carouselImages.length
      );
    }, 3000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="min-h-screen font-sans antialiased bg-slate-50 text-gray-800">
      {/* Main hero section with original gradient and removed rounded bottom */}
      <div className="relative overflow-hidden pt-8 pb-32 md:pb-48 shadow-xl">
        {/* Background gradient with original colors */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-100 to-green-100 opacity-80"></div>
        
        {/* New three-layered, smooth wave element at the bottom */}
        <div className="absolute bottom-0 z-10 w-full h-auto">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            {/* Bottom wave layer (white) */}
            <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,144C384,160,480,224,576,224C672,224,768,160,864,138.7C960,117,1056,139,1152,160C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            {/* Middle wave layer (light gray/blue) */}
            <path fill="#f0f9ff" fillOpacity="0.7" d="M0,160L48,170.7C96,181,192,203,288,186.7C384,171,480,117,576,106.7C672,96,768,128,864,138.7C960,149,1056,139,1152,149.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            {/* Top wave layer (transparent, for the final blend) */}
            <path fill="url(#gradient-wave-2)" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,149,576,133.3C672,117,768,117,864,138.7C960,160,1056,203,1152,208C1248,213,1344,181,1392,165.3L1440,149.3L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            
            {/* Define the gradient for the top wave layer */}
            <defs>
              <linearGradient id="gradient-wave-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor:'rgb(147,197,253)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgb(16,185,129)', stopOpacity:1}} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Content container */}
        <div className="relative z-20 container mx-auto px-6">
          {/* Header with logo and user icon */}
          <header className="flex justify-between items-center mb-16 md:mb-24">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1.5-12.5h3c.828 0 1.5.672 1.5 1.5v3c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-3c0-.828.672-1.5 1.5-1.5zm0 9h3c.828 0 1.5.672 1.5 1.5v3c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-3c0-.828.672-1.5 1.5-1.5z"/>
              </svg>
              <span className="font-bold text-xl text-gray-900">Halgouce</span>
            </div>
            <User className="h-6 w-6 text-gray-700 cursor-pointer" />
          </header>

          {/* Hero text and buttons */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-8 md:space-y-0">
            {/* Text content */}
            <div className="max-w-md">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Patient <br/> Hamsgonte
              </h1>
              <div className="mt-8 flex space-x-4">
                <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg transition-transform hover:scale-105">
                  Login
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg transition-transform hover:scale-105">
                  Sign Up
                </button>
              </div>
            </div>

            {/* Placeholder family image */}
            <div className="relative w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden shadow-2xl transition-opacity duration-1000 ease-in-out">
                <img
                  src={carouselImages[currentImageIndex]}
                  alt="A happy family"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {/* Pagination dots (decorative) */}
              <div className="absolute bottom-4 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section below the wave, with a solid background for seamless blending */}
      <div className="container mx-auto px-6 py-12 md:py-16 -mt-24 md:-mt-32 relative z-30 bg-white">
        <h2 className="text-2xl font-bold mb-8 md:mb-12">Patient Hamsgonce</h2>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Find Doctors */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg flex flex-col items-center text-center transition-transform hover:scale-105 cursor-pointer">
            <div className="p-4 md:p-5 bg-green-100 rounded-full mb-4">
              <Stethoscope className="h-8 w-8 text-green-600" />
            </div>
            <p className="font-semibold text-lg">Find Doctors</p>
          </div>

          {/* Card 2: Get Prescriptions */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg flex flex-col items-center text-center transition-transform hover:scale-105 cursor-pointer">
            <div className="p-4 md:p-5 bg-blue-100 rounded-full mb-4">
              <Pill className="h-8 w-8 text-blue-600" />
            </div>
            <p className="font-semibold text-lg">Get Prescriptions</p>
          </div>

          {/* Card 3: View Medical Records */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg flex flex-col items-center text-center transition-transform hover:scale-105 cursor-pointer">
            <div className="p-4 md:p-5 bg-purple-100 rounded-full mb-4">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <p className="font-semibold text-lg">View Medical Records</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Main;