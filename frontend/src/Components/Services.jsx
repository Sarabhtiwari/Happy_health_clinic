import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './NavBar';

const Services = () => {
  const servicesList = [
    {
      title: "Laser Hair Removal",
      image: "https://images.unsplash.com/photo-1700760933574-9f0f4ea9aa3b?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Long-lasting smooth skin using advanced laser technology.",
      details: "Safe for all skin types with precise follicle targeting.",
      highlights: ["Full Body", "Facial Hair", "Underarms", "Permanent Reduction"],
    },
    {
      title: "Laser Skin Rejuvenation & Brightening",
      image: "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=...",
      desc: "Restore glow and youthful skin.",
      details: "Stimulates collagen and improves tone.",
      highlights: ["Brightening", "Anti-aging", "Even Tone", "Glow"],
    },
    {
      title: "Scar Revision Surgery",
      image: "https://plus.unsplash.com/premium_photo-1661726985752-e30a8c8ef196?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Reduce scars effectively.",
      details: "Laser and surgical treatments.",
      highlights: ["Acne Scars", "Keloids", "Surgical", "Resurfacing"],
    },
    {
      title: "Warts & Moles Removal",
      image: "https://images.unsplash.com/photo-1561228987-8e7379dde477?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Safe removal of skin growths.",
      details: "Cryotherapy and laser methods.",
      highlights: ["Warts", "Moles", "Skin Tags", "Analysis"],
    },
    {
      title: "Chemical Peeling",
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800",
      desc: "Exfoliate and renew skin.",
      details: "Treat acne, pigmentation & aging.",
      highlights: ["Glycolic", "TCA", "Acne", "Pigmentation"],
    },
    {
      title: "Jet Peel / Hydrafacial / Skin Polishing",
      image: "https://images.unsplash.com/photo-1647004692483-c5d942fe1137?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Deep cleanse & hydration.",
      details: "Instant glow, no downtime.",
      highlights: ["Hydration", "Glow", "Pores", "Cleaning"],
    },
    {
      title: "Microneedling / Derma Roller Therapy",
      image: "https://images.unsplash.com/photo-1706795034865-9d9c299fe143?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Boost collagen naturally.",
      details: "Effective for scars & pores.",
      highlights: ["Collagen", "Scars", "Pores", "PRP"],
    },
    {
      title: "Pigmentation & Melasma Treatment",
      image: "https://images.unsplash.com/photo-1589221158826-aed6c80c3f15?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Treat pigmentation & dark spots.",
      details: "Laser and topical solutions.",
      highlights: ["Melasma", "Dark Spots", "Sun Damage"],
    },
    {
      title: "Acne / Acne Scar Treatment",
      image: "https://images.unsplash.com/photo-1730288951113-9cc087c14b83?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Complete acne care.",
      details: "Medication & laser therapy.",
      highlights: ["Active Acne", "Hormonal", "Scar Reduction"],
    },
    {
      title: "Dark Circle Treatment",
      image: "https://images.unsplash.com/photo-1713863574444-52e208c4b113?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Brighten under-eye area.",
      details: "Laser & fillers used.",
      highlights: ["Fillers", "Laser", "Puffiness"],
    },
    {
      title: "Skin Whitening / Brightening",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=800",
      desc: "Even-toned glowing skin.",
      details: "Safe brightening treatments.",
      highlights: ["Glow", "Peels", "Vitamin Therapy"],
    },
    {
      title: "Anti-Aging Treatment, Botox & Fillers",
      image: "https://images.unsplash.com/photo-1733685373260-bcd3f81f57c8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Reduce wrinkles & restore volume.",
      details: "Botox and fillers used.",
      highlights: ["Wrinkles", "Fillers", "Jawline"],
    },
    {
      title: "Stretch Marks Reduction",
      image: "https://plus.unsplash.com/premium_photo-1733259735516-5dac5d7c196a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Reduce stretch marks.",
      details: "Laser & microneedling.",
      highlights: ["Laser", "RF", "Post Pregnancy"],
    },
    {
      title: "Skin Analysis",
      image: "https://images.unsplash.com/photo-1689103722266-1f2f837145e7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Advanced skin diagnostics.",
      details: "Detailed skin mapping.",
      highlights: ["Pores", "Wrinkles", "Pigmentation"],
    },
    {
      title: "Skin Care Counseling",
      image: "https://plus.unsplash.com/premium_vector-1721635430853-69c248bf56a4?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Personalised skincare routine.",
      details: "Expert dermatologist advice.",
      highlights: ["Routine", "Products", "Lifestyle"],
    },
    {
      title: "Hair Loss & Regeneration Therapy",
      image: "https://images.unsplash.com/photo-1633179963355-44f57f194d54?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Control hair fall.",
      details: "Medical & laser therapy.",
      highlights: ["Growth", "LLLT", "Nutrition"],
    },
    {
      title: "PRP Therapy",
      image: "https://images.unsplash.com/photo-1725000421356-d69d04370385?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Natural regeneration therapy.",
      details: "Boosts hair & skin.",
      highlights: ["Hair PRP", "Skin PRP"],
    },
    {
      title: "GFC Hair Treatment",
      image: "https://plus.unsplash.com/premium_photo-1702598817726-5502337bf58c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Advanced PRP therapy.",
      details: "High growth factors.",
      highlights: ["Hair Growth", "Advanced PRP"],
    },
    {
      title: "Hair Transplantation",
      image: "https://plus.unsplash.com/premium_photo-1658527022587-07b3d7cd55f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Permanent hair restoration.",
      details: "FUE technique.",
      highlights: ["FUE", "Hairline"],
    },
    {
      title: "Dandruff & Scalp Treatment",
      image: "https://images.unsplash.com/photo-1542648610-1ce8250817e3?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Treat dandruff & scalp issues.",
      details: "Medical scalp care.",
      highlights: ["Antifungal", "Scaling"],
    },
    {
      title: "Alopecia Management",
      image: "https://images.unsplash.com/photo-1643837833100-8b2ebd7127bc?q=80&w=1245&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Treat hair loss conditions.",
      details: "Medical treatments.",
      highlights: ["Areata", "Androgenetic"],
    },
   
    {
      title: "STD / STI Treatment",
      image: "https://images.unsplash.com/photo-1588776813677-77aaf5595b83?auto=format&fit=crop&q=80&w=800",
      desc: "Confidential diagnosis.",
      details: "Complete screening.",
      highlights: ["Testing", "Treatment"],
    },
    {
      title: "Fungal & Bacterial Infection",
      image: "https://plus.unsplash.com/premium_photo-1706557116424-3b920b5bc005?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Treat infections effectively.",
      details: "Targeted medication.",
      highlights: ["Fungal", "Bacterial"],
    },
    {
      title: "Allergy & Itching Management",
      image: "https://images.unsplash.com/photo-1660646463659-df77c1580723?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Relief from allergies.",
      details: "Identify triggers.",
      highlights: ["Patch Test", "Relief"],
    },
    {
      title: "Psoriasis / Eczema",
      image: "https://plus.unsplash.com/premium_photo-1706429468525-2ac4a7e177f5?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Manage chronic skin diseases.",
      details: "Long-term care.",
      highlights: ["Therapy", "Control"],
    },
    {
      title: "Nail & Foot Infection",
      image: "https://plus.unsplash.com/premium_photo-1661763536160-4d8c350b02d0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      desc: "Treat nail infections.",
      details: "Medical care.",
      highlights: ["Fungus", "Ingrown"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20">
      <Navbar />

      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-16">
          Our <span className="text-blue-600">Clinical Services</span>
        </h1>

        <div className="flex flex-col gap-16">
          {servicesList.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row gap-10 bg-white p-8 rounded-3xl shadow"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full lg:w-1/2 h-[300px] object-cover rounded-2xl"
              />

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{service.title}</h2>
                <p>{service.desc}</p>
                <p className="text-gray-500 text-sm">{service.details}</p>

                <div className="grid grid-cols-2 gap-2">
                  {service.highlights.map((item, i) => (
                    <div key={i} className="bg-gray-100 p-2 rounded text-sm">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;