import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Components/NavBar'; 

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300">
      <Navbar />

      {/* Main Content with top padding to account for fixed navbar */}
      <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            Visit Our <span className="text-blue-600">Clinic</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-light">
            We are located in the heart of the city, providing easy access to premium dermatological care for all our patients.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* --- LEFT SIDE: CONTACT INFO --- */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="glass p-6 md:p-10 h-full rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 bg-white shadow-sm flex flex-col justify-between overflow-hidden transition-colors duration-300">
              <div className="space-y-8 md:space-y-10">
                
                {/* Clinic Location */}
                <div className="flex gap-4 md:gap-5">
                  <div className="p-3 md:p-4 bg-blue-50 text-blue-600 rounded-2xl h-fit shrink-0 transition-colors duration-300">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="28" width="28">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-lg md:text-xl font-serif">Main Clinic</h4>
                    <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                      Anamnagar, Ghattekulo
                      <br/>
                      Kathmandu, Nepal
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex gap-4 md:gap-5">
                  <div className="p-3 md:p-4 bg-blue-50 text-blue-600 rounded-2xl h-fit shrink-0 transition-colors duration-300">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="24" width="24">
                      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-lg md:text-xl font-serif">Working Hours</h4>
                    <p className="text-gray-500 text-base md:text-lg whitespace-pre-line leading-relaxed italic">
                      Sun - Sat: 8:00 AM - 7:00 PM{"\n"}
                    </p>
                  </div>
                </div>

                {/* Quick Contact & Socials */}
                <div className="flex gap-4 md:gap-5">
                  <div className="p-3 md:p-4 bg-blue-50 text-blue-600 rounded-2xl h-fit shrink-0 transition-colors duration-300">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="28" width="28">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-lg md:text-xl font-serif">Contact & Socials</h4>
                    
                    <div className="flex flex-col gap-1 mb-5">
                      <p className="text-blue-600 text-base md:text-lg font-semibold break-words">Mobile: 9860831099, 9768987950</p>
                      <p className="text-blue-600 text-base md:text-lg font-semibold break-words">Telephone: 01-5913099</p>
                      <p className="text-gray-500 text-sm md:text-base break-all mt-1">happyhealthclinicpvt.ltd@gmail.com</p>
                    </div>

                    {/* Social Media Section with Icons */}
                    <div className="flex flex-col gap-3 pt-5 border-t border-gray-100 transition-colors duration-300">
                      
                      {/* Instagram */}
                      <a href="https://instagram.com/happyhealth.clinic" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-500 hover:text-pink-600 transition-colors group">
                        <div className="p-2 bg-gray-50 group-hover:bg-pink-50 rounded-lg transition-colors">
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="20" width="20">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </div>
                        <span className="text-sm md:text-base break-words">
                          <strong className="text-gray-700 group-hover:text-pink-600 font-medium transition-colors">Instagram:</strong> @happyhealth.clinic
                        </span>
                      </a>

                      {/* TikTok */}
                      <a href="https://tiktok.com/@happyhealthclinic" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-500 hover:text-black transition-colors group">
                        <div className="p-2 bg-gray-50 group-hover:bg-gray-100 rounded-lg transition-colors">
                          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="20" width="20">
                            <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path>
                          </svg>
                        </div>
                        <span className="text-sm md:text-base break-words">
                          <strong className="text-gray-700 group-hover:text-black font-medium transition-colors">TikTok:</strong> @happyhealthclinic
                        </span>
                      </a>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT SIDE: INTERACTIVE MAP --- */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative h-[400px] md:h-[500px] lg:h-auto min-h-[400px] md:min-h-[500px]"
          >
            <div className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl transition-colors duration-300">
              <iframe 
                src="https://maps.google.com/maps?q=Happy+Health+Clinic,+Anamnagar,+Kathmandu&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                title="Happy Health Clinic Map"
              ></iframe>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;