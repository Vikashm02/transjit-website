// Keyword landing pages (English + Hindi). Each page targets specific Google searches.
// Section types: text {h2, paras}, points {h2, items:[[h,p]]}, chips {h2, lead, items}, routes {h2, lead}, office {key}
import { site } from "./content.mjs";

// Main truck routes Jun 2025 – Nov 2026 (from trip records). Used on /routes/ and location pages.
export const routes = [
  { from: ["Nagpur", "नागपुर"], to: ["Baloda Bazar & Rawan, Chhattisgarh", "बलौदाबाज़ार और रावन, छत्तीसगढ़"], plants: "UltraTech Rawan · Ambuja Bhatapara · Shree Cement", mat: ["Shredded RDF", "श्रेडेड RDF"], hub: "cg" },
  { from: ["Nagpur", "नागपुर"], to: ["Semradih, Chhattisgarh", "सेमराडीह, छत्तीसगढ़"], plants: "UltraTech Semradih", mat: ["Shredded RDF", "श्रेडेड RDF"], hub: "cg" },
  { from: ["Nagpur", "नागपुर"], to: ["Jamul, Chhattisgarh", "जामुल, छत्तीसगढ़"], plants: "ACC Jamul", mat: ["RDF", "RDF"], hub: "cg" },
  { from: ["Haldia", "हल्दिया"], to: ["Baloda Bazar, Chhattisgarh", "बलौदाबाज़ार, छत्तीसगढ़"], plants: "UltraTech · Ambuja", mat: ["RDF & industrial waste", "RDF और इंडस्ट्रियल वेस्ट"], hub: "cg" },
  { from: ["Mumbai (Taloja, Kanjurmarg)", "मुंबई (तलोजा, कांजुरमार्ग)"], to: ["Chandrapur (Chanda), Maharashtra", "चंद्रपुर (चांदा), महाराष्ट्र"], plants: "ACC Chanda · Ambuja Chandrapur", mat: ["RDF & municipal waste", "RDF और म्युनिसिपल वेस्ट"], hub: "mh" },
  { from: ["Nagpur", "नागपुर"], to: ["Chandrapur, Maharashtra", "चंद्रपुर, महाराष्ट्र"], plants: "ACC Chanda · Ambuja Chandrapur", mat: ["Unshredded RDF", "अनश्रेडेड RDF"], hub: "mh" },
  { from: ["Pune", "पुणे"], to: ["Chandrapur, Maharashtra", "चंद्रपुर, महाराष्ट्र"], plants: "ACC · Ambuja", mat: ["RDF & plastic waste", "RDF और प्लास्टिक वेस्ट"], hub: "mh" },
  { from: ["Mancherial", "मंचेरियल"], to: ["Chandrapur, Maharashtra", "चंद्रपुर, महाराष्ट्र"], plants: "ACC · Ambuja", mat: ["RDF", "RDF"], hub: "mh" },
  { from: ["Nizamabad", "निज़ामाबाद"], to: ["Chandrapur, Maharashtra", "चंद्रपुर, महाराष्ट्र"], plants: "ACC Chanda", mat: ["Unshredded RDF", "अनश्रेडेड RDF"], hub: "mh" },
  { from: ["Pune", "पुणे"], to: ["Chincholi, Chhatrasala & Malkhed, Kalaburagi", "चिंचोली, छत्रसाला और मलखेड़, कलबुर्गी"], plants: "Chettinad · Kalburgi Cement · UltraTech", mat: ["RDF & plastic waste", "RDF और प्लास्टिक वेस्ट"], hub: "kl" },
  { from: ["Coimbatore", "कोयंबटूर"], to: ["Wadi, Kalaburagi", "वाडी, कलबुर्गी"], plants: "ACC Wadi", mat: ["RDF", "RDF"], hub: "kl" },
  { from: ["Mumbai (Taloja)", "मुंबई (तलोजा)"], to: ["Wadi, Kalaburagi", "वाडी, कलबुर्गी"], plants: "ACC Wadi", mat: ["RDF", "RDF"], hub: "kl" },
  { from: ["Tirupati & Chittoor", "तिरुपति और चित्तूर"], to: ["Kallur, Kalaburagi", "कल्लूर, कलबुर्गी"], plants: "Chettinad Cement", mat: ["RDF", "RDF"], hub: "kl" },
  { from: ["Hyderabad", "हैदराबाद"], to: ["Malkhed & Kodla, Kalaburagi", "मलखेड़ और कोडला, कलबुर्गी"], plants: "UltraTech Malkhed · Shree Cement Kodla", mat: ["Plastic waste & RDF", "प्लास्टिक वेस्ट और RDF"], hub: "kl" },
  { from: ["Bengaluru", "बेंगलुरु"], to: ["Wadi & Kodla, Kalaburagi", "वाडी और कोडला, कलबुर्गी"], plants: "ACC Wadi · Shree Cement Kodla", mat: ["RDF & industrial waste", "RDF और इंडस्ट्रियल वेस्ट"], hub: "kl" },
  { from: ["Tumakuru & Maddur", "तुमकुर और मद्दूर"], to: ["Kodla, Kalaburagi", "कोडला, कलबुर्गी"], plants: "Shree Cement Kodla", mat: ["Plastic waste for co-processing", "को-प्रोसेसिंग के लिए प्लास्टिक वेस्ट"], hub: "kl" },
  { from: ["Mangaluru", "मंगलुरु"], to: ["Malkhed, Sedam & Wadi, Kalaburagi", "मलखेड़, सेडम और वाडी, कलबुर्गी"], plants: "UltraTech · ACC", mat: ["RDF & MLP waste", "RDF और MLP वेस्ट"], hub: "kl" },
  { from: ["Ballari", "बल्लारी"], to: ["Wadi, Kalaburagi", "वाडी, कलबुर्गी"], plants: "ACC Wadi", mat: ["RDF", "RDF"], hub: "kl" },
  { from: ["Kochi", "कोच्चि"], to: ["Wadi, Kalaburagi", "वाडी, कलबुर्गी"], plants: "ACC Wadi", mat: ["RDF", "RDF"], hub: "kl" },
  { from: ["Anantapur", "अनंतपुर"], to: ["Wadi, Kalaburagi", "वाडी, कलबुर्गी"], plants: "ACC Wadi", mat: ["Unshredded RDF", "अनश्रेडेड RDF"], hub: "kl" },
  { from: ["Chennai", "चेन्नई"], to: ["Malkhed, Kalaburagi", "मलखेड़, कलबुर्गी"], plants: "UltraTech Malkhed", mat: ["RDF", "RDF"], hub: "kl" },
  { from: ["Goa (Mormugao)", "गोवा (मोरमुगाओ)"], to: ["Sedam & Wadi, Kalaburagi", "सेडम और वाडी, कलबुर्गी"], plants: "UltraTech Sedam · ACC Wadi", mat: ["MLP & municipal waste", "MLP और म्युनिसिपल वेस्ट"], hub: "kl" },
  { from: ["Tumakuru & Bengaluru", "तुमकुर और बेंगलुरु"], to: ["Belagavi, Karnataka", "बेलगावी, कर्नाटक"], plants: "Dalmia Cement", mat: ["Co-processing material", "को-प्रोसेसिंग मटीरियल"], hub: "ka" },
  { from: ["Bengaluru & Mysuru", "बेंगलुरु और मैसूर"], to: ["Muddapur, Karnataka", "मुद्दापुर, कर्नाटक"], plants: "JK Cement", mat: ["Industrial waste", "इंडस्ट्रियल वेस्ट"], hub: "ka" },
  { from: ["Trichy & Hyderabad", "त्रिची और हैदराबाद"], to: ["Jaggayyapeta, Andhra Pradesh", "जग्गय्यपेट, आंध्र प्रदेश"], plants: "UltraTech", mat: ["RDF", "RDF"], hub: "ap" },
  { from: ["Hyderabad", "हैदराबाद"], to: ["Tadipatri, Andhra Pradesh", "ताडिपत्री, आंध्र प्रदेश"], plants: "UltraTech", mat: ["RDF", "RDF"], hub: "ap" },
  { from: ["Kochi & Tirupati", "कोच्चि और तिरुपति"], to: ["Kadapa, Andhra Pradesh", "कडप्पा, आंध्र प्रदेश"], plants: "Zuari Cement", mat: ["RDF", "RDF"], hub: "ap" },
  { from: ["Nagpur", "नागपुर"], to: ["Damoh, Madhya Pradesh", "दमोह, मध्य प्रदेश"], plants: "Heidelberg Cement", mat: ["Shredded RDF", "श्रेडेड RDF"], hub: "mp" },
  { from: ["Nagpur", "नागपुर"], to: ["Satna, Madhya Pradesh", "सतना, मध्य प्रदेश"], plants: "Birla Corporation", mat: ["RDF", "RDF"], hub: "mp" },
];

export const routeGroups = {
  kl: ["Kalaburagi cement cluster (Karnataka)", "कलबुर्गी सीमेंट क्लस्टर (कर्नाटक)"],
  mh: ["Chandrapur (Maharashtra)", "चंद्रपुर (महाराष्ट्र)"],
  cg: ["Chhattisgarh", "छत्तीसगढ़"],
  ka: ["Rest of Karnataka", "कर्नाटक (अन्य)"],
  ap: ["Andhra Pradesh", "आंध्र प्रदेश"],
  mp: ["Madhya Pradesh", "मध्य प्रदेश"],
};

const trucks = {
  en: ["12-wheeler", "14-wheeler", "16-wheeler", "18-wheeler", "20 ft container", "32 ft container", "40 ft trailer"],
  hi: ["12 पहिया", "14 पहिया", "16 पहिया", "18 पहिया", "20 फ़ीट कंटेनर", "32 फ़ीट कंटेनर", "40 फ़ीट ट्रेलर"],
};


// Leadership team (from the old website's team pages; years updated to 2026, wording rewritten).
export const leaders = [
  {
    id: "founder",
    initials: "SM",
    founder: true,
    name: ["Shyam Kishor Mishra", "श्याम किशोर मिश्रा"],
    role: ["Co-founder", "सह-संस्थापक"],
    bio: [
      "A graduate of Lalit Narayan Mithila University (LNMU) with an MBA, he has spent more than two decades in logistics management. In 2012 he co-founded Trans-Jit Express in Visakhapatnam with C. K. Mishra and S. K. Mishra, starting with a handful of clients. His forward-thinking approach and hands-on experience have helped grow it into a pan-India transporter trusted by India's leading cement companies.",
      "ललित नारायण मिथिला विश्वविद्यालय (LNMU) से स्नातक और MBA, लॉजिस्टिक्स मैनेजमेंट में दो दशक से ज़्यादा का अनुभव। 2012 में सी. के. मिश्रा और एस. के. मिश्रा के साथ मिलकर विशाखापत्तनम में कुछ ग्राहकों से ट्रांस-जीत एक्सप्रेस की शुरुआत की। उनकी दूरदर्शी सोच और ज़मीनी अनुभव ने कंपनी को आज देश की बड़ी सीमेंट कंपनियों का भरोसेमंद, पैन-इंडिया ट्रांसपोर्टर बनाने में अहम भूमिका निभाई है।",
    ],
  },
  {
    id: "ck",
    initials: "CK",
    founder: true,
    name: ["C. K. Mishra", "सी. के. मिश्रा"],
    role: ["Co-founder · Head – North & North-East India", "सह-संस्थापक · हेड – उत्तर और पूर्वोत्तर भारत"],
    bio: [
      "One of the three co-founders of Trans-Jit Express, he leads our work across North and North-East India from the Haridwar office. A Magadh University graduate with more than 25 years in the transport industry. Before joining us he worked with ATO (I) Ltd, Bharatiya Roadlines, Credence Logistics Ltd and Coastliners Pvt Ltd, delivering projects for BHEL, NTPC, ACC, ITC, HCC, Otis, KONE, Kirby Building Systems, Everest Industries, Vijai Electricals and Jyothy Laboratories.",
      "ट्रांस-जीत एक्सप्रेस के तीन सह-संस्थापकों में से एक; हरिद्वार ऑफिस से उत्तर और पूर्वोत्तर भारत का काम संभालते हैं। मगध विश्वविद्यालय से स्नातक, ट्रांसपोर्ट उद्योग में 25 साल से ज़्यादा का अनुभव। इससे पहले वे ATO (I) Ltd, भारतीय रोडलाइंस, क्रेडेंस लॉजिस्टिक्स और कोस्टलाइनर्स प्रा. लि. के साथ रहे और BHEL, NTPC, ACC, ITC, HCC, Otis, KONE, Kirby Building Systems, Everest Industries, Vijai Electricals और Jyothy Laboratories के प्रोजेक्ट सफलतापूर्वक पूरे किए।",
    ],
  },
  {
    id: "sk",
    initials: "SK",
    founder: true,
    name: ["S. K. Mishra", "एस. के. मिश्रा"],
    role: ["Co-founder · Finance & Credit Control", "सह-संस्थापक · फ़ाइनेंस और क्रेडिट कंट्रोल"],
    bio: [
      "One of the three co-founders of Trans-Jit Express, he heads finance and credit control so that operations stay smooth. A commerce graduate, he began his transport career in 1995 with Union Roadways Ltd in Coimbatore — more than 30 years in the industry. Outside work, he is an award-winning volleyball player.",
      "ट्रांस-जीत एक्सप्रेस के तीन सह-संस्थापकों में से एक; फ़ाइनेंस और क्रेडिट कंट्रोल संभालते हैं ताकि काम बिना रुकावट चले। कॉमर्स स्नातक; 1995 में कोयंबटूर में यूनियन रोडवेज़ लि. से ट्रांसपोर्ट करियर की शुरुआत — उद्योग में 30 साल से ज़्यादा का अनुभव। साथ ही वे पुरस्कार विजेता वॉलीबॉल खिलाड़ी हैं।",
    ],
  },
  {
    id: "jsj",
    initials: "JS",
    name: ["J. S. Jha", "जे. एस. झा"],
    role: ["National Head – Customer Relations", "नेशनल हेड – कस्टमर रिलेशंस"],
    bio: [
      "With a double M.A. and more than 25 years in transport management, he looks after our customers day to day — clear communication, quick responses and close follow-up. Over his career he has built lasting relationships with clients such as BHEL, BEML and LG across India.",
      "डबल M.A. और ट्रांसपोर्ट मैनेजमेंट में 25 साल से ज़्यादा का अनुभव; ग्राहकों का रोज़ का काम देखते हैं — साफ़ बातचीत, तुरंत जवाब और लगातार फ़ॉलो-अप। अपने करियर में उन्होंने पूरे भारत में BHEL, BEML और LG जैसे ग्राहकों से लंबे रिश्ते बनाए हैं।",
    ],
  },
  {
    id: "vk",
    initials: "VK",
    name: ["Vikas Kumar", "विकास कुमार"],
    role: ["Head – IT", "हेड – IT"],
    bio: [
      "A graduate of Dayananda Sagar Institutions (DSI), Bengaluru, with more than a decade in the IT industry. He leads our technology from Bengaluru, including the in-house ERP that runs every LR, POD and invoice.",
      "दयानंद सागर इंस्टिट्यूशंस (DSI), बेंगलुरु से स्नातक, IT उद्योग में दस साल से ज़्यादा का अनुभव। बेंगलुरु से हमारी टेक्नोलॉजी संभालते हैं — जिसमें वह इन-हाउस ERP भी है जिसमें हर LR, POD और बिल बनता है।",
    ],
  },
];

export const pages = [
  /* ------------------------------------------------------------------ RDF */
  {
    slug: "rdf-transport",
    en: {
      title: "RDF Transport to Cement Plants | Co-processing Logistics",
      description: "Shredded & unshredded RDF, plastic and MLP waste transport to 20+ cement plants for co-processing. 1,00,000+ tonnes moved since June 2025. Get a quote.",
      crumb: "RDF transport",
      eyebrow: "Service",
      h1: "RDF transport & co-processing logistics for cement plants",
      lead: "Trans-Jit Express moves refuse-derived fuel (RDF) and other alternative fuels and raw materials (AFR) from waste processors to cement kilns across India — on schedule, with digital LRs and daily dispatch reports.",
      sections: [
        { type: "text", h2: "What is RDF transport?", paras: [
          "RDF (refuse-derived fuel) is processed municipal and industrial waste that cement plants burn in their kilns in place of coal. This is called co-processing. Moving RDF is not like moving normal cargo: loads are bulky, plants accept material only in their unloading slots, and every trip needs correct weighbridge and LR paperwork.",
          "That is the work we specialise in. Since June 2025 alone we have delivered more than 1,00,000 tonnes of RDF and co-processing material to over 20 cement plants.",
        ] },
        { type: "chips", h2: "Materials we transport", lead: "All non-hazardous alternative fuels for cement kilns:", items: ["Shredded RDF", "Unshredded RDF", "RDF from municipal solid waste (MSW)", "Plastic waste for co-processing", "MLP (multi-layer plastic) waste", "Rubber scrap", "Industrial non-hazardous waste", "Pre-processed / co-processing material", "Trade rejects & scrap"] },
        { type: "chips", h2: "Truck types for RDF loads", lead: "High-volume trucks matched to the material and the plant's gate rules:", items: trucks.en },
        { type: "points", h2: "Why cement plants and waste processors choose us", items: [
          ["Specialists, not generalists", "RDF and co-processing material is most of what we move, every single day."],
          ["Plant-gate experience", "We know the unloading, weighbridge and documentation rules at ACC, UltraTech, Ambuja, Shree, Chettinad, Dalmia and other plants."],
          ["Large truck network", "1,800+ trucks deployed since June 2025, so we can line up vehicles even on short notice."],
          ["Field team at the source", "Our staff in Nagpur and other sourcing hubs watch loading and keep trucks moving."],
          ["Digital paperwork", "LR, delivery challan, POD and billing in our own ERP, with a daily dispatch report."],
        ] },
        { type: "routes", h2: "Main RDF transport routes", lead: "A few of the lanes we run every week:", limit: 10 },
      ],
      faq: [
        ["Which cement plants do you deliver RDF to?", "We deliver to 20+ plants including ACC Wadi, Chanda and Jamul; UltraTech Rawan, Malkhed, Sedam, Semradih, Jaggayyapeta and Tadipatri; Ambuja Chandrapur and Bhatapara; Shree Cement Kodla; Chettinad Kallur and Chincholi; Dalmia Belagavi; Heidelberg Damoh; and Birla Corporation Satna."],
        ["Do you transport hazardous waste?", "No. We transport non-hazardous alternative fuels and co-processing material such as RDF, plastic and MLP waste, rubber scrap and industrial non-hazardous waste."],
        ["Can you handle daily, fixed-lane RDF dispatches?", "Yes. Most of our work is regular lane contracts where we line up trucks every day to match the plant's schedule."],
        ["How do I get a rate for RDF transport?", "Send your loading point, plant, material and quantity on WhatsApp or call us. We reply with a rate and truck availability."],
      ],
    },
    hi: {
      title: "सीमेंट प्लांट्स के लिए RDF ट्रांसपोर्ट | को-प्रोसेसिंग लॉजिस्टिक्स",
      description: "श्रेडेड और अनश्रेडेड RDF, प्लास्टिक और MLP वेस्ट को 20+ सीमेंट प्लांट्स तक पहुँचाते हैं। जून 2025 से 1,00,000+ टन। रेट के लिए संपर्क करें।",
      crumb: "RDF ट्रांसपोर्ट",
      eyebrow: "सेवा",
      h1: "सीमेंट प्लांट्स के लिए RDF ट्रांसपोर्ट और को-प्रोसेसिंग लॉजिस्टिक्स",
      lead: "ट्रांस-जीत एक्सप्रेस वेस्ट प्रोसेसर्स से RDF (रिफ़्यूज़ डिराइव्ड फ़्यूल) और अन्य वैकल्पिक ईंधन (AFR) उठाकर पूरे भारत के सीमेंट प्लांट्स तक पहुँचाता है — समय पर, डिजिटल LR और रोज़ की डिस्पैच रिपोर्ट के साथ।",
      sections: [
        { type: "text", h2: "RDF ट्रांसपोर्ट क्या है?", paras: [
          "RDF यानी प्रोसेस किया हुआ म्युनिसिपल और इंडस्ट्रियल वेस्ट, जिसे सीमेंट प्लांट कोयले की जगह भट्ठी में जलाते हैं। इसे को-प्रोसेसिंग कहते हैं। RDF ढोना आम माल ढोने जैसा नहीं है: लोड भारी-भरकम होते हैं, प्लांट तय समय पर ही अनलोडिंग लेते हैं, और हर ट्रिप में सही वे-ब्रिज और LR काग़ज़ चाहिए।",
          "यही हमारा स्पेशल काम है। सिर्फ़ जून 2025 से अब तक हमने 20 से ज़्यादा सीमेंट प्लांट्स तक 1,00,000 टन से ज़्यादा RDF और को-प्रोसेसिंग मटीरियल पहुँचाया है।",
        ] },
        { type: "chips", h2: "हम कौन-सा मटीरियल ढोते हैं", lead: "सीमेंट भट्ठियों के लिए सभी नॉन-हैज़र्डस वैकल्पिक ईंधन:", items: ["श्रेडेड RDF", "अनश्रेडेड RDF", "म्युनिसिपल सॉलिड वेस्ट (MSW) से RDF", "को-प्रोसेसिंग के लिए प्लास्टिक वेस्ट", "MLP (मल्टी-लेयर प्लास्टिक) वेस्ट", "रबर स्क्रैप", "इंडस्ट्रियल नॉन-हैज़र्डस वेस्ट", "प्री-प्रोसेस्ड / को-प्रोसेसिंग मटीरियल", "ट्रेड रिजेक्ट और स्क्रैप"] },
        { type: "chips", h2: "RDF लोड के लिए ट्रक", lead: "मटीरियल और प्लांट के नियमों के हिसाब से बड़ी गाड़ियाँ:", items: trucks.hi },
        { type: "points", h2: "सीमेंट प्लांट और वेस्ट प्रोसेसर हमें क्यों चुनते हैं", items: [
          ["इस काम के स्पेशलिस्ट", "हमारा ज़्यादातर काम रोज़ RDF और को-प्रोसेसिंग मटीरियल का ही है।"],
          ["प्लांट गेट का अनुभव", "ACC, UltraTech, Ambuja, Shree, Chettinad, Dalmia जैसे प्लांट्स के अनलोडिंग, वे-ब्रिज और डॉक्यूमेंट नियम हम जानते हैं।"],
          ["बड़ा ट्रक नेटवर्क", "जून 2025 से 1,800+ ट्रक लगाए — कम समय में भी गाड़ियाँ मिल जाती हैं।"],
          ["सोर्स पर फ़ील्ड टीम", "नागपुर जैसे हब पर हमारा स्टाफ़ लोडिंग देखता है और गाड़ियाँ चलती रखता है।"],
          ["डिजिटल काग़ज़ात", "LR, डिलीवरी चालान, POD और बिलिंग हमारे ERP में, रोज़ की डिस्पैच रिपोर्ट के साथ।"],
        ] },
        { type: "routes", h2: "RDF ट्रांसपोर्ट के प्रमुख रूट", lead: "हर हफ़्ते चलने वाले कुछ रूट:", limit: 10 },
      ],
      faq: [
        ["आप किन सीमेंट प्लांट्स तक RDF पहुँचाते हैं?", "20+ प्लांट्स, जैसे ACC वाडी, चांदा और जामुल; UltraTech रावन, मलखेड़, सेडम, सेमराडीह, जग्गय्यपेट और ताडिपत्री; Ambuja चंद्रपुर और भाटापारा; Shree Cement कोडला; Chettinad कल्लूर और चिंचोली; Dalmia बेलगावी; Heidelberg दमोह; और Birla Corporation सतना।"],
        ["क्या आप हैज़र्डस वेस्ट ढोते हैं?", "नहीं। हम सिर्फ़ नॉन-हैज़र्डस वैकल्पिक ईंधन और को-प्रोसेसिंग मटीरियल ढोते हैं — जैसे RDF, प्लास्टिक और MLP वेस्ट, रबर स्क्रैप और इंडस्ट्रियल नॉन-हैज़र्डस वेस्ट।"],
        ["क्या रोज़ाना तय रूट पर RDF डिस्पैच हो सकता है?", "हाँ। हमारा ज़्यादातर काम रेगुलर लेन कॉन्ट्रैक्ट का है, जिसमें प्लांट के शेड्यूल के हिसाब से रोज़ गाड़ियाँ लगती हैं।"],
        ["RDF ट्रांसपोर्ट का रेट कैसे मिलेगा?", "लोडिंग पॉइंट, प्लांट, मटीरियल और मात्रा WhatsApp पर भेजें या कॉल करें। हम रेट और गाड़ी की उपलब्धता बताएँगे।"],
      ],
    },
  },

  /* ------------------------------------------------------------------ ROUTES */
  {
    slug: "routes",
    en: {
      title: "Truck Transport Routes to Cement Plants in India",
      description: "Our regular truck routes: Nagpur to Baloda Bazar, Mumbai to Chandrapur, Pune to Kalaburagi, Coimbatore to Wadi, Hyderabad to Malkhed and more. Full truck loads.",
      crumb: "Routes",
      eyebrow: "Network",
      h1: "Our truck transport routes to cement plants",
      lead: "These are the lanes we ran regularly between June 2025 and November 2026. We also take full truck loads on any other route in India — just ask.",
      sections: [
        { type: "routes", h2: "Routes by destination", lead: "Grouped by the cement plant region we deliver to." },
        { type: "chips", h2: "Truck types on these routes", lead: "", items: trucks.en },
      ],
      faq: [
        ["Do you only run these routes?", "No. These are our regular lanes. We take full truck and part loads anywhere in India."],
        ["Can I book a single truck on one of these routes?", "Yes. Send the loading point, destination, material and date on WhatsApp and we will confirm the rate and truck."],
      ],
    },
    hi: {
      title: "सीमेंट प्लांट्स तक ट्रक ट्रांसपोर्ट रूट | ट्रांस-जीत एक्सप्रेस",
      description: "हमारे नियमित ट्रक रूट: नागपुर से बलौदाबाज़ार, मुंबई से चंद्रपुर, पुणे से कलबुर्गी, कोयंबटूर से वाडी, हैदराबाद से मलखेड़ और कई अन्य। फुल ट्रक लोड।",
      crumb: "रूट",
      eyebrow: "नेटवर्क",
      h1: "सीमेंट प्लांट्स तक हमारे ट्रक ट्रांसपोर्ट रूट",
      lead: "जून 2025 से नवंबर 2026 के बीच इन रूट्स पर हमारी गाड़ियाँ नियमित चलीं। भारत में किसी भी दूसरे रूट पर भी हम फुल ट्रक लोड लेते हैं।",
      sections: [
        { type: "routes", h2: "मंज़िल के हिसाब से रूट", lead: "सीमेंट प्लांट वाले इलाक़ों के हिसाब से।" },
        { type: "chips", h2: "इन रूट्स पर ट्रक", lead: "", items: trucks.hi },
      ],
      faq: [
        ["क्या आप सिर्फ़ इन्हीं रूट्स पर चलते हैं?", "नहीं। ये हमारे नियमित रूट हैं। हम पूरे भारत में फुल ट्रक और पार्ट लोड लेते हैं।"],
        ["क्या इन रूट्स पर एक ट्रक बुक हो सकता है?", "हाँ। लोडिंग पॉइंट, मंज़िल, मटीरियल और तारीख WhatsApp पर भेजें, हम रेट और गाड़ी कन्फ़र्म करेंगे।"],
      ],
    },
  },

  /* ------------------------------------------------------------------ SHAHABAD */
  {
    slug: "transport-company-shahabad-kalaburagi",
    office: "shahabad",
    en: {
      title: "Transport Company in Shahabad, Kalaburagi (Gulbarga)",
      description: "Truck transport from Shahabad, Kalaburagi to ACC Wadi, UltraTech Malkhed & Sedam, Shree Cement Kodla and Chettinad Kallur. RDF & full truck loads.",
      crumb: "Shahabad, Kalaburagi",
      eyebrow: "Branch office · Karnataka",
      h1: "Transport company in Shahabad, Kalaburagi (Gulbarga)",
      lead: "Our Shahabad office sits in the middle of the Kalaburagi cement cluster. Most of our LRs are issued from here, for trucks coming into Wadi, Malkhed, Sedam, Kodla, Kallur, Chincholi and Chhatrasala.",
      sections: [
        { type: "office", key: "shahabad" },
        { type: "chips", h2: "Cement plants we serve near Shahabad", lead: "Daily truck arrivals with RDF and co-processing material:", items: ["ACC Wadi", "ACC Gulbarga", "UltraTech Malkhed", "UltraTech Sedam", "Shree Cement Kodla", "Chettinad Cement Kallur", "Chettinad Cement Chincholi", "Kalburgi Cement Chhatrasala"] },
        { type: "routes", h2: "Truck routes into Kalaburagi", lead: "Lanes we run regularly into the cluster:", hub: "kl" },
        { type: "points", h2: "Services from our Shahabad office", items: [
          ["RDF & co-processing transport", "Shredded and unshredded RDF, plastic, MLP and industrial waste to cement kilns."],
          ["Full truck load (FTL)", "12 to 18-wheelers, containers and trailers for any cargo from Kalaburagi."],
          ["LR, POD and billing", "LR issue, POD collection at plant gates and clean billing."],
        ] },
      ],
      faq: [
        ["Where is the Trans-Jit Express office in Shahabad?", "#10, Sattar Building, Shanthnagar, Bhankur, Shahabad, Kalaburagi (Gulbarga), Karnataka 585228. Open Monday to Saturday, 9:30 am to 6:30 pm."],
        ["Which plants near Kalaburagi do you deliver to?", "ACC Wadi and Gulbarga, UltraTech Malkhed and Sedam, Shree Cement Kodla, Chettinad Kallur and Chincholi, and Kalburgi Cement Chhatrasala."],
        ["How do I contact the Shahabad branch?", "Call +91 99027 15412 or message us on WhatsApp at +91 86309 29899."],
      ],
    },
    hi: {
      title: "शहाबाद, कलबुर्गी (गुलबर्गा) में ट्रांसपोर्ट कंपनी – ट्रांस-जीत",
      description: "ट्रांस-जीत एक्सप्रेस शहाबाद: ACC वाडी, UltraTech मलखेड़ और सेडम, Shree Cement कोडला, Chettinad कल्लूर तक ट्रक ट्रांसपोर्ट। RDF और फुल ट्रक लोड। सोम–शनि 9:30–6:30।",
      crumb: "शहाबाद, कलबुर्गी",
      eyebrow: "ब्रांच ऑफिस · कर्नाटक",
      h1: "शहाबाद, कलबुर्गी (गुलबर्गा) में ट्रांसपोर्ट कंपनी",
      lead: "हमारा शहाबाद ऑफिस कलबुर्गी सीमेंट क्लस्टर के बीच में है। हमारे ज़्यादातर LR यहीं से बनते हैं — वाडी, मलखेड़, सेडम, कोडला, कल्लूर, चिंचोली और छत्रसाला आने वाली गाड़ियों के लिए।",
      sections: [
        { type: "office", key: "shahabad" },
        { type: "chips", h2: "शहाबाद के पास जिन सीमेंट प्लांट्स तक हम पहुँचाते हैं", lead: "RDF और को-प्रोसेसिंग मटीरियल के साथ रोज़ गाड़ियाँ:", items: ["ACC वाडी", "ACC गुलबर्गा", "UltraTech मलखेड़", "UltraTech सेडम", "Shree Cement कोडला", "Chettinad Cement कल्लूर", "Chettinad Cement चिंचोली", "Kalburgi Cement छत्रसाला"] },
        { type: "routes", h2: "कलबुर्गी आने वाले ट्रक रूट", lead: "क्लस्टर तक हमारे नियमित रूट:", hub: "kl" },
        { type: "points", h2: "शहाबाद ऑफिस से हमारी सेवाएँ", items: [
          ["RDF और को-प्रोसेसिंग ट्रांसपोर्ट", "श्रेडेड और अनश्रेडेड RDF, प्लास्टिक, MLP और इंडस्ट्रियल वेस्ट सीमेंट भट्ठी तक।"],
          ["फुल ट्रक लोड (FTL)", "कलबुर्गी से किसी भी माल के लिए 12 से 18 पहिया ट्रक, कंटेनर और ट्रेलर।"],
          ["LR, POD और बिलिंग", "LR बनाना, प्लांट गेट पर POD लेना और साफ़ बिलिंग।"],
        ] },
      ],
      faq: [
        ["शहाबाद में ट्रांस-जीत एक्सप्रेस का ऑफिस कहाँ है?", "#10, सत्तार बिल्डिंग, शांतनगर, भंकुर, शहाबाद, कलबुर्गी (गुलबर्गा), कर्नाटक 585228। सोमवार से शनिवार, सुबह 9:30 से शाम 6:30 तक।"],
        ["कलबुर्गी के पास किन प्लांट्स तक आप पहुँचाते हैं?", "ACC वाडी और गुलबर्गा, UltraTech मलखेड़ और सेडम, Shree Cement कोडला, Chettinad कल्लूर और चिंचोली, और Kalburgi Cement छत्रसाला।"],
        ["शहाबाद ब्रांच से कैसे संपर्क करें?", "+91 99027 15412 पर कॉल करें या +91 86309 29899 पर WhatsApp करें।"],
      ],
    },
  },

  /* ------------------------------------------------------------------ VIZAG */
  {
    slug: "transport-company-visakhapatnam",
    office: "vizag",
    en: {
      title: "Transport Company in Visakhapatnam (Vizag) | Trans-Jit Express",
      description: "Trans-Jit Express registered office in Visakhapatnam. RDF and full truck load transport across Andhra Pradesh and India. Mon–Sat 9:30–6:30. Call +91 86309 29899.",
      crumb: "Visakhapatnam",
      eyebrow: "Registered office · Andhra Pradesh",
      h1: "Transport company in Visakhapatnam (Vizag)",
      lead: "Visakhapatnam is the registered office of Trans-Jit Express. From here we manage full truck loads and RDF transport across Andhra Pradesh and the rest of India.",
      sections: [
        { type: "office", key: "vizag" },
        { type: "routes", h2: "Our routes in Andhra Pradesh", lead: "Regular lanes to cement plants in Andhra Pradesh:", hub: "ap" },
        { type: "points", h2: "Services from Visakhapatnam", items: [
          ["Full truck load (FTL)", "Dedicated trucks from Vizag to any city in India."],
          ["RDF & co-processing transport", "Alternative fuel to UltraTech Jaggayyapeta and Tadipatri, Zuari Kadapa and other plants."],
          ["Account & billing desk", "Registered office for contracts, billing and documentation."],
        ] },
      ],
      faq: [
        ["Where is Trans-Jit Express in Visakhapatnam?", "Plot No. 65, S. R. Gardens, Sativanipalem, STBL Projects Ltd., Sheelanagar, Visakhapatnam 530012, Andhra Pradesh."],
        ["Do you provide trucks from Visakhapatnam to other states?", "Yes. We arrange full truck loads from Visakhapatnam to any city in India."],
      ],
    },
    hi: {
      title: "विशाखापत्तनम (वाइज़ैग) में ट्रांसपोर्ट कंपनी | ट्रांस-जीत एक्सप्रेस",
      description: "ट्रांस-जीत एक्सप्रेस का रजिस्टर्ड ऑफिस विशाखापत्तनम में। आंध्र प्रदेश और पूरे भारत में RDF और फुल ट्रक लोड ट्रांसपोर्ट। सोम–शनि 9:30–6:30।",
      crumb: "विशाखापत्तनम",
      eyebrow: "रजिस्टर्ड ऑफिस · आंध्र प्रदेश",
      h1: "विशाखापत्तनम (वाइज़ैग) में ट्रांसपोर्ट कंपनी",
      lead: "विशाखापत्तनम ट्रांस-जीत एक्सप्रेस का रजिस्टर्ड ऑफिस है। यहाँ से हम आंध्र प्रदेश और पूरे भारत में फुल ट्रक लोड और RDF ट्रांसपोर्ट संभालते हैं।",
      sections: [
        { type: "office", key: "vizag" },
        { type: "routes", h2: "आंध्र प्रदेश में हमारे रूट", lead: "आंध्र प्रदेश के सीमेंट प्लांट्स तक नियमित रूट:", hub: "ap" },
        { type: "points", h2: "विशाखापत्तनम से हमारी सेवाएँ", items: [
          ["फुल ट्रक लोड (FTL)", "वाइज़ैग से भारत के किसी भी शहर तक पूरी गाड़ी।"],
          ["RDF और को-प्रोसेसिंग ट्रांसपोर्ट", "UltraTech जग्गय्यपेट और ताडिपत्री, Zuari कडप्पा और अन्य प्लांट्स तक।"],
          ["अकाउंट और बिलिंग डेस्क", "कॉन्ट्रैक्ट, बिलिंग और डॉक्यूमेंटेशन के लिए रजिस्टर्ड ऑफिस।"],
        ] },
      ],
      faq: [
        ["विशाखापत्तनम में ट्रांस-जीत एक्सप्रेस कहाँ है?", "प्लॉट नं. 65, एस. आर. गार्डन्स, सतिवानीपालेम, STBL प्रोजेक्ट्स लि., शीलानगर, विशाखापत्तनम 530012, आंध्र प्रदेश।"],
        ["क्या विशाखापत्तनम से दूसरे राज्यों के लिए ट्रक मिलते हैं?", "हाँ। विशाखापत्तनम से भारत के किसी भी शहर तक फुल ट्रक लोड की व्यवस्था करते हैं।"],
      ],
    },
  },

  /* ------------------------------------------------------------------ HARIDWAR */
  {
    slug: "transport-company-haridwar",
    office: "haridwar",
    en: {
      title: "Transport Company in Haridwar, Uttarakhand | Trans-Jit Express",
      description: "Trans-Jit Express Haridwar: full truck load and industrial waste transport for Uttarakhand, Delhi NCR and North India. Mon–Sat 9:30–6:30.",
      crumb: "Haridwar",
      eyebrow: "Branch office · Uttarakhand",
      h1: "Transport company in Haridwar, Uttarakhand",
      lead: "Our Haridwar office looks after customers in Uttarakhand and North India, with our field team in Delhi NCR and Rudrapur.",
      sections: [
        { type: "office", key: "haridwar" },
        { type: "points", h2: "Services from Haridwar", items: [
          ["Full truck load (FTL)", "Dedicated trucks from Haridwar, Roorkee, Rudrapur and Delhi NCR to anywhere in India."],
          ["Industrial waste transport", "Non-hazardous industrial waste and co-processing material from factories to cement plants."],
          ["Field team in North India", "Our people in Delhi NCR and Rudrapur meet suppliers and check loading."],
        ] },
        { type: "chips", h2: "Areas we cover from Haridwar", lead: "", items: ["Haridwar", "SIDCUL Haridwar", "Roorkee", "Dehradun", "Rudrapur (Udham Singh Nagar)", "Delhi NCR", "Western Uttar Pradesh"] },
      ],
      faq: [
        ["Where is the Trans-Jit Express office in Haridwar?", "Plot No. 27, Block-E, New Shivalik Nagar, near BSP office, P.O. Jwalapur, Haridwar 249407, Uttarakhand."],
        ["Do you send trucks from Haridwar to South India?", "Yes. We arrange full truck loads from Haridwar and North India to any state, including Karnataka, Maharashtra and Chhattisgarh."],
      ],
    },
    hi: {
      title: "हरिद्वार, उत्तराखंड में ट्रांसपोर्ट कंपनी | ट्रांस-जीत एक्सप्रेस",
      description: "ट्रांस-जीत एक्सप्रेस हरिद्वार ऑफिस: उत्तराखंड, दिल्ली NCR और उत्तर भारत के लिए फुल ट्रक लोड और इंडस्ट्रियल वेस्ट ट्रांसपोर्ट। सोम–शनि 9:30–6:30।",
      crumb: "हरिद्वार",
      eyebrow: "ब्रांच ऑफिस · उत्तराखंड",
      h1: "हरिद्वार, उत्तराखंड में ट्रांसपोर्ट कंपनी",
      lead: "हमारा हरिद्वार ऑफिस उत्तराखंड और उत्तर भारत के ग्राहकों का काम देखता है; दिल्ली NCR और रुद्रपुर में हमारी फ़ील्ड टीम है।",
      sections: [
        { type: "office", key: "haridwar" },
        { type: "points", h2: "हरिद्वार से हमारी सेवाएँ", items: [
          ["फुल ट्रक लोड (FTL)", "हरिद्वार, रुड़की, रुद्रपुर और दिल्ली NCR से भारत में कहीं भी पूरी गाड़ी।"],
          ["इंडस्ट्रियल वेस्ट ट्रांसपोर्ट", "फ़ैक्ट्रियों से सीमेंट प्लांट्स तक नॉन-हैज़र्डस इंडस्ट्रियल वेस्ट और को-प्रोसेसिंग मटीरियल।"],
          ["उत्तर भारत में फ़ील्ड टीम", "दिल्ली NCR और रुद्रपुर में हमारे लोग सप्लायर्स से मिलते हैं और लोडिंग देखते हैं।"],
        ] },
        { type: "chips", h2: "हरिद्वार से हमारे इलाक़े", lead: "", items: ["हरिद्वार", "सिडकुल हरिद्वार", "रुड़की", "देहरादून", "रुद्रपुर (ऊधम सिंह नगर)", "दिल्ली NCR", "पश्चिमी उत्तर प्रदेश"] },
      ],
      faq: [
        ["हरिद्वार में ट्रांस-जीत एक्सप्रेस का ऑफिस कहाँ है?", "प्लॉट नं. 27, ब्लॉक-E, न्यू शिवालिक नगर, BSP ऑफिस के पास, पो. ज्वालापुर, हरिद्वार 249407, उत्तराखंड।"],
        ["क्या हरिद्वार से दक्षिण भारत के लिए ट्रक मिलते हैं?", "हाँ। हरिद्वार और उत्तर भारत से कर्नाटक, महाराष्ट्र, छत्तीसगढ़ समेत किसी भी राज्य तक फुल ट्रक लोड भेजते हैं।"],
      ],
    },
  },
  /* ------------------------------------------------------------------ LEADERSHIP */
  {
    slug: "leadership",
    en: {
      title: "Leadership Team | Trans-Jit Express Transport Company",
      description: "Meet the people behind Trans-Jit Express: co-founders Shyam Kishor Mishra, C. K. Mishra and S. K. Mishra, and a team with decades of transport experience.",
      crumb: "Leadership",
      eyebrow: "About us",
      h1: "Our leadership team",
      lead: "Trans-Jit Express is run by transport people. Our leaders bring decades of hands-on experience from India's road freight industry — and they are personally involved in the work we do for every customer.",
      sections: [{ type: "people" }],
      faq: [
        ["Who founded Trans-Jit Express?", "Trans-Jit Express was co-founded in 2012 in Visakhapatnam by Shyam Kishor Mishra, C. K. Mishra and S. K. Mishra."],
        ["How experienced is the Trans-Jit Express team?", "Our leadership team has more than 100 years of combined experience in transport, logistics, finance and customer service."],
      ],
    },
    hi: {
      title: "लीडरशिप टीम | ट्रांस-जीत एक्सप्रेस ट्रांसपोर्ट कंपनी",
      description: "ट्रांस-जीत एक्सप्रेस की टीम से मिलिए: सह-संस्थापक श्याम किशोर मिश्रा, सी. के. मिश्रा और एस. के. मिश्रा, और ट्रांसपोर्ट में दशकों के अनुभव वाली टीम।",
      crumb: "लीडरशिप",
      eyebrow: "हमारे बारे में",
      h1: "हमारी लीडरशिप टीम",
      lead: "ट्रांस-जीत एक्सप्रेस को ट्रांसपोर्ट से जुड़े लोग ही चलाते हैं। हमारी टीम के पास भारत के रोड फ्रेट उद्योग का दशकों का ज़मीनी अनुभव है — और हर ग्राहक के काम में वे ख़ुद जुड़े रहते हैं।",
      sections: [{ type: "people" }],
      faq: [
        ["ट्रांस-जीत एक्सप्रेस की शुरुआत किसने की?", "ट्रांस-जीत एक्सप्रेस की शुरुआत 2012 में विशाखापत्तनम में श्याम किशोर मिश्रा, सी. के. मिश्रा और एस. के. मिश्रा ने मिलकर की।"],
        ["ट्रांस-जीत एक्सप्रेस की टीम कितनी अनुभवी है?", "हमारी लीडरशिप टीम के पास ट्रांसपोर्ट, लॉजिस्टिक्स, फ़ाइनेंस और कस्टमर सर्विस में कुल मिलाकर 100 साल से ज़्यादा का अनुभव है।"],
      ],
    },
  },
];

export const officeSlug = Object.fromEntries(pages.filter((p) => p.office).map((p) => [p.office, p.slug]));
export { site };
