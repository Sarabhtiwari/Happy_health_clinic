import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Visit Our <span className="text-blue-600">Clinic</span>
          </h1>
          <p className="text-xl text-gray-500 font-light">
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
            <div className="glass p-10 h-full rounded-[2.5rem] border border-gray-100 bg-white shadow-sm flex flex-col justify-between">
              <div className="space-y-10">
                {/* Clinic Location */}
                <div className="flex gap-5">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl h-fit">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="28" width="28">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-xl font-serif">Main Clinic</h4>
                    <p className="text-gray-500 text-lg leading-relaxed">
                      123 Medical Boulevard, Health City<br/>
                      Kathmandu, Nepal
                    </p>
                  </div>
                </div>

                {/* Working Hours (Your Code Integrated) */}
                <div className="flex gap-5">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl h-fit">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="24" width="24">
                      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-xl font-serif">Working Hours</h4>
                    <p className="text-gray-500 text-lg whitespace-pre-line leading-relaxed italic">
                      Mon - Sat: 8:00 AM - 8:00 PM{"\n"}
                      Sunday: Emergency Only
                    </p>
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="flex gap-5">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl h-fit">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="28" width="28">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-xl font-serif">Phone & Email</h4>
                    <p className="text-blue-600 text-lg font-semibold">9841329402</p>
                    <p className="text-gray-500">contact@happyhealthclinic.com</p>
                  </div>
                </div>
              </div>

              {/* Bottom Support Text */}
              <div className="mt-10 p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">
                <p className="text-gray-400 text-sm">
                  Facing a clinical emergency? <br />
                  Call our 24/7 helpline for immediate assistance.
                </p>
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT SIDE: INTERACTIVE MAP --- */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative h-[600px] lg:h-auto min-h-[500px]"
          >
            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.31625951334!2d85.2911132!3d27.7089559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu!5e0!3m2!1sen!2snp!4v1711111111111" 
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