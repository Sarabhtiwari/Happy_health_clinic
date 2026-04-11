import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './NavBar';

const Services = () => {
  const servicesList = [
    {
      title: "Laser Hair Removal",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800",
      desc: "Achieve long-lasting smoothness with our advanced laser hair removal technology. Safe and effective for all skin tones with precision targeting of hair follicles.",
      details: "We use diode and Nd:YAG laser systems to target melanin in hair follicles with minimal discomfort. Multiple sessions are recommended for optimal permanent reduction results.",
      highlights: ["Full Body Treatment", "Facial Hair Removal", "Underarm & Bikini", "Permanent Reduction"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      ),
    },
    {
      title: "Laser Skin Rejuvenation & Brightening",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800",
      desc: "Restore your skin's youthful radiance with targeted laser rejuvenation. Our treatments stimulate collagen production and even out skin tone for a visibly brighter complexion.",
      details: "Fractional laser and IPL (Intense Pulsed Light) therapies work together to address dullness, uneven tone, and early signs of aging for a refreshed glow.",
      highlights: ["Skin Brightening", "Even Skin Tone", "Collagen Stimulation", "Anti-Aging"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ),
    },
    {
      title: "Scar Revision Surgery",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800",
      desc: "Minimise the appearance of scars from surgery, injury, or acne with our advanced revision techniques. Our specialists assess each scar type to recommend the most effective approach.",
      details: "Procedures include subcision, punch excision, and CO2 fractional laser resurfacing tailored to hypertrophic, atrophic, or keloid scars for maximum improvement.",
      highlights: ["Acne Scar Revision", "Surgical Scar Treatment", "Keloid Management", "Fractional Resurfacing"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      title: "Warts & Moles Removal",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
      desc: "Safe, precise removal of benign skin growths using clinically proven techniques. All removed lesions undergo pathological evaluation when clinically indicated.",
      details: "Cryotherapy, electrocautery, and laser ablation are used based on lesion type and location. Procedures are minimally invasive with quick healing and minimal scarring.",
      highlights: ["Wart Removal", "Mole Excision", "Skin Tag Removal", "Lesion Analysis"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "Chemical Peeling",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
      desc: "Professionally administered chemical peels to exfoliate, resurface, and renew your skin. Customised peel depth based on skin type and treatment goals.",
      details: "We offer superficial (Glycolic, Lactic), medium (TCA), and deep peels for targeted treatment of acne, pigmentation, fine lines, and uneven texture.",
      highlights: ["Glycolic Acid Peels", "TCA Peels", "Pigmentation Peels", "Acne Peels"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 12s1.5 2 4 2 4-2 4-2" />
        </svg>
      ),
    },
    {
      title: "Jet Peel / Hydrafacial / Skin Polishing",
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=800",
      desc: "Refreshing, non-invasive facial treatments that deeply cleanse, hydrate, and resurface the skin. Ideal for a radiant glow with zero downtime.",
      details: "Jet Peel uses pressurised saline infusion for lymphatic drainage and serum delivery. HydraFacial combines cleansing, exfoliation, and antioxidant infusion in one session.",
      highlights: ["Deep Hydration", "Pore Cleansing", "Skin Polishing", "Glow Boost"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
        </svg>
      ),
    },
    {
      title: "Microneedling / Derma Roller Therapy",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800",
      desc: "Stimulate your skin's natural healing process with controlled micro-injuries that trigger collagen and elastin production for firmer, smoother skin.",
      details: "Medical-grade microneedling with growth factor serums and PRP enhances penetration and results. Effective for scars, enlarged pores, fine lines, and stretch marks.",
      highlights: ["Collagen Induction", "Scar Treatment", "Pore Reduction", "PRP Combination"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 5v14M5 12h14" />
        </svg>
      ),
    },
    {
      title: "Pigmentation & Melasma Treatment",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800",
      desc: "Targeted treatment protocols for stubborn pigmentation, dark spots, and melasma. We combine topical, procedural, and laser therapies for comprehensive correction.",
      details: "Customised regimens using tranexamic acid, kojic acid combinations, Q-switched lasers, and chemical peels deliver superior outcomes compared to single-modality treatment.",
      highlights: ["Melasma Treatment", "Dark Spot Correction", "Post-Acne Marks", "Sun Damage"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" />
        </svg>
      ),
    },
    {
      title: "Acne / Acne Scar Treatment",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
      desc: "Comprehensive acne management from active breakouts to residual scarring. Our dermatologists diagnose root causes and design personalised treatment plans.",
      details: "Treatment includes oral/topical medications, comedone extraction, blue-light therapy, and fractional lasers. Hormonal and dietary factors are addressed for long-term control.",
      highlights: ["Active Acne Control", "Hormonal Acne", "Comedone Extraction", "Scar Reduction"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" /><path d="M12 8V16M8 12H16" />
        </svg>
      ),
    },
    {
      title: "Dark Circle & Under-Eye Treatment",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
      desc: "Revitalise the delicate under-eye area with targeted treatments for dark circles, puffiness, and hollowness. Restore a refreshed, well-rested appearance.",
      details: "We use a multimodal approach: topical brightening agents, tear trough fillers for volume loss, laser for pigmentation, and carboxytherapy for microcirculation improvement.",
      highlights: ["Tear Trough Fillers", "Carboxytherapy", "Laser Brightening", "Puffiness Reduction"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      title: "Skin Whitening / Brightening",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800",
      desc: "Achieve a luminous, even-toned complexion with our medically supervised skin brightening programs. Safe, effective, and tailored to your individual skin type.",
      details: "Protocols include glutathione IV therapy, vitamin C infusions, brightening chemical peels, and prescription-grade topical formulations to safely lighten and unify skin tone.",
      highlights: ["Glutathione Therapy", "Vitamin C Infusion", "Brightening Peels", "Even Skin Tone"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      title: "Anti-Aging Treatment, Botox & Fillers",
      image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=800",
      desc: "Turn back the clock with our expert anti-aging treatments. From wrinkle relaxers to volumising fillers, we craft natural-looking rejuvenation personalised to your anatomy.",
      details: "Botulinum toxin precisely relaxes dynamic wrinkles while hyaluronic acid fillers restore volume and contour. All procedures are performed by certified aesthetic dermatologists.",
      highlights: ["Botox for Wrinkles", "Dermal Fillers", "Lip Enhancement", "Jawline Contouring"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M4.5 16.5C4.5 16.5 6 15 9 15C12 15 13.5 16.5 13.5 16.5V19.5C13.5 19.5 12 21 9 21C6 21 4.5 19.5 4.5 19.5V16.5Z" /><path d="M9 15V3M9 3L12 6M9 3L6 6" />
        </svg>
      ),
    },
    {
      title: "Stretch Marks Reduction",
      image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=800",
      desc: "Minimise the appearance of stretch marks caused by pregnancy, weight changes, or growth spurts. Our treatments improve texture and blend stretch marks with surrounding skin.",
      details: "Combination therapy with microneedling, radiofrequency, and fractional CO2 laser rebuilds collagen in atrophic stretch mark tissue for visible improvement over multiple sessions.",
      highlights: ["Microneedling RF", "Fractional Laser", "Post-Pregnancy Care", "Body Contouring"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      ),
    },
    {
      title: "Skin Test / Skin Analysis",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=800",
      desc: "Understand your skin at a deeper level with our advanced diagnostic analysis. Our Skin Analyzer provides a comprehensive assessment to guide your personalised skincare journey.",
      details: "The VISIA Skin Analyzer captures UV, cross-polarised, and standard images to map pores, pigmentation, wrinkles, texture, and redness with precise quantitative scoring.",
      highlights: ["VISIA Analysis", "Skin Type Mapping", "Pore Assessment", "Personalised Reports"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
        </svg>
      ),
    },
    {
      title: "Skin Care Counseling",
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800",
      desc: "Expert guidance to build an effective, evidence-based skincare routine tailored to your unique skin type, concerns, and lifestyle. Navigate the world of skincare with confidence.",
      details: "Our dermatologists analyse your current regimen, identify harmful or incompatible ingredients, and prescribe a morning/night routine using clinically validated products.",
      highlights: ["Routine Building", "Ingredient Analysis", "Product Recommendations", "Lifestyle Advice"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      title: "Hair Loss & Hair Regeneration Therapy",
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
      desc: "Clinically proven therapies to address all forms of hair loss. We diagnose the underlying cause and implement evidence-based regeneration protocols to restore hair density.",
      details: "Treatment pathways include mesotherapy, low-level laser therapy (LLLT), topical minoxidil, oral finasteride, and nutritional supplementation plans targeting root causes.",
      highlights: ["Mesotherapy", "LLLT Therapy", "Minoxidil Programs", "Nutritional Support"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21" /><path d="M12 3V21M17 5L17 19M7 5L7 19" />
        </svg>
      ),
    },
    {
      title: "PRP (Platelet-Rich Plasma) Therapy",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
      desc: "Harness your body's own healing power with Platelet-Rich Plasma therapy. PRP accelerates tissue regeneration for hair restoration, skin rejuvenation, and wound healing.",
      details: "Blood is drawn, centrifuged to concentrate growth factors, and re-injected into the target area. PRP is highly effective for androgenetic alopecia and skin quality improvement.",
      highlights: ["Hair PRP", "Facial PRP", "Scalp Injections", "Growth Factor Boost"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
        </svg>
      ),
    },
    {
      title: "GFC (Growth Factor Concentrate) Hair Treatment",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
      desc: "An advanced evolution of PRP, GFC delivers a higher concentration of pure growth factors directly to hair follicles for superior regeneration results with fewer sessions.",
      details: "The GFC preparation method eliminates red blood cells and white blood cells, yielding a purer growth factor concentrate that maximises follicular stimulation and new hair growth.",
      highlights: ["High Growth Factor Concentration", "Fewer Sessions", "Enhanced PRP", "Follicle Regeneration"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 22V12m0 0V2m0 10H2m10 0h10" />
        </svg>
      ),
    },
    {
      title: "Hair Transplantation",
      image: "https://images.unsplash.com/photo-1606206591513-adbfadd9a314?auto=format&fit=crop&q=80&w=800",
      desc: "Permanent hair restoration through state-of-the-art follicular unit transplantation. Our surgeons ensure natural hairline design and maximum graft survival for life-changing results.",
      details: "We offer FUE (Follicular Unit Extraction) with minimal scarring and rapid recovery. A detailed pre-operative scalp analysis determines donor availability and graft count for optimal density.",
      highlights: ["FUE Technique", "Hairline Design", "High Graft Survival", "Natural Results"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 3C7.02944 3 3 7.02944 3 12s4.02944 9 9 9 9-4.02944 9-9S16.9706 3 12 3zM12 8v8M8 12h8" />
        </svg>
      ),
    },
    {
      title: "Dandruff & Scalp Treatment",
      image: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&q=80&w=800",
      desc: "Resolve persistent dandruff, scalp seborrhoea, and flaking with targeted medical and procedural interventions. Restore a healthy, balanced scalp environment.",
      details: "Treatment includes antifungal shampoos, medicated scalp serums, and scalp scaling procedures. Seborrhoeic dermatitis affecting the face and body is treated concurrently.",
      highlights: ["Antifungal Treatment", "Scalp Scaling", "Seborrhoeic Dermatitis", "Scalp Microbiome Care"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9 17v-2l-2-2 2-2V9" /><path d="M15 17v-2l2-2-2-2V9" />
        </svg>
      ),
    },
    {
      title: "Alopecia Management",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800",
      desc: "Specialised diagnosis and management of all types of alopecia including androgenetic, areata, and scarring alopecia. Early intervention preserves follicles and maximises regrowth.",
      details: "Management involves intralesional corticosteroid injections for areata, immunosuppressants for extensive cases, and LLLT combined with topical treatments for androgenetic patterns.",
      highlights: ["Alopecia Areata", "Androgenetic Alopecia", "Scarring Alopecia", "Intralesional Injections"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      title: "Circumcision",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800",
      desc: "Safe, sterile circumcision performed by experienced dermatosurgeons in a clinical setting. Procedures follow strict aseptic protocols for optimal healing and minimal complications.",
      details: "We offer conventional surgical and advanced laser circumcision. Pre-operative counselling, local anaesthesia, and detailed aftercare instructions ensure a comfortable and safe procedure.",
      highlights: ["Laser Circumcision", "Surgical Circumcision", "Local Anaesthesia", "Aftercare Support"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: "STD / STI Diagnosis & Treatment",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
      desc: "Confidential, compassionate diagnosis and treatment for sexually transmitted infections. We provide a safe, non-judgmental environment with complete patient privacy.",
      details: "Comprehensive screening for a full panel of STIs including HIV, syphilis, herpes, HPV, gonorrhoea, and chlamydia, with rapid results and discreet treatment protocols.",
      highlights: ["Confidential Screening", "Full STI Panel", "Rapid Diagnostics", "Discreet Treatment"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      ),
    },
    {
      title: "Fungal & Bacterial Skin Infection Treatment",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=800",
      desc: "Accurate diagnosis and effective treatment of fungal and bacterial skin infections. Our dermatologists identify causative organisms to prescribe targeted, evidence-based therapy.",
      details: "From tinea versicolor and ringworm to cellulitis and impetigo, we use microscopy, culture, and clinical assessment to deliver oral and topical antimicrobial regimens.",
      highlights: ["Tinea / Ringworm", "Cellulitis Treatment", "Impetigo Care", "Antifungal Therapy"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM9 9l6 6M15 9l-6 6" />
        </svg>
      ),
    },
    {
      title: "Allergy & Itching Management",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800",
      desc: "Identify and manage skin allergies, contact dermatitis, and chronic itching conditions. We investigate triggers and provide lasting relief through targeted medical management.",
      details: "Patch testing identifies contact allergens. Chronic urticaria and pruritus are managed with antihistamines, biologics, and lifestyle modifications for sustained symptom control.",
      highlights: ["Patch Testing", "Contact Dermatitis", "Urticaria Management", "Chronic Itch Relief"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
        </svg>
      ),
    },
    {
      title: "Psoriasis / Eczema Management",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
      desc: "Long-term clinical management of chronic inflammatory skin diseases. Our specialist team creates personalised treatment plans to achieve and maintain remission.",
      details: "Management includes topical corticosteroids, calcineurin inhibitors, phototherapy (NB-UVB), and biological agents for moderate-to-severe cases, with regular monitoring.",
      highlights: ["NB-UVB Phototherapy", "Biological Therapy", "Topical Management", "Flare Prevention"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
        </svg>
      ),
    },
    {
      title: "Nail & Foot Infection Treatment",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
      desc: "Effective treatment for nail fungus, ingrown toenails, and foot skin infections. Restore healthy nails and comfortable feet with our specialised podological dermatology care.",
      details: "Onychomycosis is treated with topical lacquers and systemic antifungals confirmed by nail clipping culture. Ingrown nails are managed with nail avulsion or laser-assisted procedures.",
      highlights: ["Nail Fungus (Onychomycosis)", "Ingrown Toenail", "Foot Dermatitis", "Antifungal Lacquers"],
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 5v6l4 2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Our Complete <br />
            <span className="text-blue-600">Clinical Services</span>
          </h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed">
            27 specialised treatments delivered by certified dermatologists at Happy Health Clinic.
            Every procedure is backed by clinical research and tailored to your individual needs.
          </p>
        </motion.div>

        {/* --- FULL INFO CARDS --- */}
        <div className="flex flex-col gap-16">
          {servicesList.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-500`}
            >
              {/* SERVICE NUMBER BADGE */}
              <div className="absolute -mt-4 -ml-4 hidden lg:flex items-center justify-center w-10 h-10 bg-blue-600 text-white text-xs font-black rounded-full shadow-md">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* IMAGE SECTION */}
              <div className="w-full lg:w-1/2 overflow-hidden rounded-[2rem] h-[350px] shadow-inner border border-gray-50">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* CONTENT SECTION */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    {service.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Service {String(index + 1).padStart(2, '0')}</span>
                    <h2 className="text-3xl font-serif font-bold text-gray-900">{service.title}</h2>
                  </div>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed italic border-l-4 border-blue-100 pl-4">
                  {service.desc}
                </p>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-blue-600">Full Clinical Details</h4>
                  <p className="text-gray-500 leading-relaxed">
                    {service.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <h4 className="text-xs font-black uppercase text-gray-300 mb-4 tracking-tighter">Key Procedures Available</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                    {service.highlights.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-700 font-medium bg-gray-50/50 p-2 rounded-lg">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <p className="text-gray-400 text-xs font-medium max-w-lg mx-auto">
            © 2026 Happy Health Clinic | Specialized Dermatology & Aesthetic Medicine.
            All clinical data provided for patient educational purposes.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Services;
