import type { Clinic } from "@/types";

/**
 * Mock Educational Clinic Partners — TEMPORARY. Replaced by the CMS.
 *
 * These are invented organisations. Do not ship placeholder clinic details to
 * production: naming a real clinic without a signed partnership, or attaching
 * invented details to a real name, is a legal problem as well as an editorial
 * one.
 *
 * Note there is no rating, ranking or review field anywhere in this file, and
 * none should be added. Partners are presented, never recommended.
 *
 * Pages must never import this file — go through lib/repositories/clinics.
 */

const img = (alt: string) => ({ src: "", alt });

export const clinics: Clinic[] = [
  {
    id: "cli-001",
    slug: "harbourside-fertility-centre",
    name: "Harbourside Fertility Centre",
    isEducationalPartner: true,
    logo: img("Harbourside Fertility Centre logo"),
    coverImage: img("A bright, modern clinic reception with timber finishes."),
    intro:
      "A Sydney-based centre that shares educational material openly and runs regular public information evenings.",
    country: "Australia",
    countryCode: "AU",
    city: "Sydney",
    treatments: ["ivf", "icsi", "fertility-preservation", "egg-freezing"],
    specialties: ["Fertility preservation", "Recurrent implantation failure"],
    languages: ["English", "Mandarin", "Greek"],
    services: [
      "Initial consultation",
      "Ovulation tracking",
      "IVF and ICSI cycles",
      "Egg and embryo freezing",
      "Counselling",
    ],
    team: [
      { name: "Dr Eleanor Whitfield", role: "Medical Director" },
      { name: "Dr Marcus Tan", role: "Fertility Specialist" },
      { name: "Sana Bhatt", role: "Lead Embryologist" },
    ],
    partnerBenefits: [
      {
        title: "Open education evenings",
        description:
          "Monthly public sessions covering treatment basics, open to anyone regardless of whether they are a patient.",
      },
      {
        title: "Plain-language cost breakdowns",
        description:
          "Written estimates that itemise medication, storage and additional procedures separately.",
      },
    ],
    website: "https://example.com/harbourside",
    contactEmail: "hello@example.com",
    tags: ["ivf", "fertility-preservation"],
    isFeatured: true,
    joinedAt: "2026-06-10",
  },
  {
    id: "cli-002",
    slug: "southern-cross-reproductive-health",
    name: "Southern Cross Reproductive Health",
    isEducationalPartner: true,
    logo: img("Southern Cross Reproductive Health logo"),
    coverImage: img("A calm consulting room with natural light."),
    intro:
      "A Perth clinic with a longstanding focus on patient education and shared decision-making.",
    country: "Australia",
    countryCode: "AU",
    city: "Perth",
    treatments: ["ivf", "iui", "icsi", "egg-freezing"],
    specialties: ["PCOS", "Ovulation induction"],
    languages: ["English", "Italian"],
    services: [
      "Fertility assessment",
      "Ovulation induction",
      "IUI",
      "IVF and ICSI cycles",
      "Dietitian support",
    ],
    team: [
      { name: "Dr Rosalind Meyer", role: "Clinical Lead" },
      { name: "Dr Andrew Fenwick", role: "Reproductive Endocrinologist" },
    ],
    partnerBenefits: [
      {
        title: "Written summaries after every appointment",
        description:
          "Patients receive a plain-English written summary of what was discussed and decided.",
      },
    ],
    website: "https://example.com/southern-cross",
    tags: ["pcos", "iui", "ivf"],
    joinedAt: "2026-05-22",
  },
  {
    id: "cli-003",
    slug: "thames-reproductive-medicine",
    name: "Thames Reproductive Medicine",
    isEducationalPartner: true,
    logo: img("Thames Reproductive Medicine logo"),
    coverImage: img("A contemporary clinic waiting area with soft seating."),
    intro:
      "A London practice that publishes its educational library publicly and contributes to community webinars.",
    country: "United Kingdom",
    countryCode: "GB",
    city: "London",
    treatments: ["ivf", "icsi", "egg-donation", "recurrent-miscarriage"],
    specialties: ["Recurrent miscarriage", "Immunology"],
    languages: ["English", "French", "Polish"],
    services: [
      "Recurrent miscarriage investigation",
      "IVF and ICSI cycles",
      "Donor egg programme",
      "Counselling",
    ],
    team: [
      { name: "Dr Priya Anand", role: "Consultant" },
      { name: "Dr Oliver Beaumont", role: "Consultant" },
      { name: "Grace Adeyemi", role: "Patient Support Lead" },
    ],
    partnerBenefits: [
      {
        title: "Public education library",
        description:
          "Their patient-facing explainers are free to read without registration.",
      },
      {
        title: "Second-opinion appointments",
        description:
          "Available to people being treated elsewhere who want another perspective.",
      },
    ],
    website: "https://example.com/thames",
    tags: ["ivf", "pregnancy-loss", "donor-conception"],
    isFeatured: true,
    joinedAt: "2026-05-15",
  },
  {
    id: "cli-004",
    slug: "northern-quarter-fertility",
    name: "Northern Quarter Fertility",
    isEducationalPartner: true,
    logo: img("Northern Quarter Fertility logo"),
    coverImage: img("A clinic corridor with plants and warm lighting."),
    intro:
      "A Manchester clinic with a dedicated male fertility service and an active education programme.",
    country: "United Kingdom",
    countryCode: "GB",
    city: "Manchester",
    treatments: ["ivf", "icsi", "iui"],
    specialties: ["Male factor", "Andrology"],
    languages: ["English", "Urdu"],
    services: [
      "Semen analysis",
      "Andrology consultation",
      "IUI",
      "IVF and ICSI cycles",
    ],
    team: [
      { name: "Dr Nathan Coulthard", role: "Andrologist" },
      { name: "Dr Yusra Iqbal", role: "Fertility Specialist" },
    ],
    partnerBenefits: [
      {
        title: "Male fertility drop-in clinic",
        description:
          "A low-barrier route to a first semen analysis without a full referral.",
      },
    ],
    website: "https://example.com/northern-quarter",
    tags: ["male-fertility", "ivf"],
    joinedAt: "2026-05-02",
  },
  {
    id: "cli-005",
    slug: "front-range-fertility-institute",
    name: "Front Range Fertility Institute",
    isEducationalPartner: true,
    logo: img("Front Range Fertility Institute logo"),
    coverImage: img("A glass-fronted clinic building at dusk."),
    intro:
      "A Colorado institute that shares its patient education material with the wider community.",
    country: "United States",
    countryCode: "US",
    city: "Denver",
    treatments: ["ivf", "icsi", "genetic-testing", "pgt-a", "egg-freezing"],
    specialties: ["Genetic testing", "Fertility preservation"],
    languages: ["English", "Spanish"],
    services: [
      "Genetic counselling",
      "PGT-A testing",
      "IVF and ICSI cycles",
      "Egg freezing",
    ],
    team: [
      { name: "Dr Claire Sorensen", role: "Reproductive Endocrinologist" },
      { name: "Dr Miguel Ferreira", role: "Genetic Counsellor" },
    ],
    partnerBenefits: [
      {
        title: "Genetic counselling explainers",
        description:
          "Openly published material on what genetic testing can and cannot tell you.",
      },
    ],
    website: "https://example.com/front-range",
    tags: ["ivf", "fertility-preservation"],
    joinedAt: "2026-04-28",
  },
  {
    id: "cli-006",
    slug: "pacific-coast-fertility",
    name: "Pacific Coast Fertility",
    isEducationalPartner: true,
    logo: img("Pacific Coast Fertility logo"),
    coverImage: img("A light-filled clinic atrium with seating."),
    intro:
      "A Los Angeles practice with an established LGBTQ+ family-building programme.",
    country: "United States",
    countryCode: "US",
    city: "Los Angeles",
    treatments: [
      "ivf",
      "icsi",
      "iui",
      "sperm-donation",
      "egg-donation",
      "lgbtq-family-building",
    ],
    specialties: ["LGBTQ+ family building", "Donor programmes"],
    languages: ["English", "Spanish", "Korean"],
    services: [
      "Reciprocal IVF",
      "Donor sperm and egg programmes",
      "IUI",
      "Counselling",
    ],
    team: [
      { name: "Dr Rachel Kimura", role: "Medical Director" },
      { name: "Dr Elias Moreno", role: "Fertility Specialist" },
    ],
    partnerBenefits: [
      {
        title: "Inclusive intake process",
        description:
          "Forms and consultations designed for all family structures rather than adapted from a default.",
      },
    ],
    website: "https://example.com/pacific-coast",
    tags: ["lgbtq", "donor-conception", "ivf"],
    isFeatured: true,
    joinedAt: "2026-04-14",
  },
  {
    id: "cli-007",
    slug: "maple-grove-reproductive-care",
    name: "Maple Grove Reproductive Care",
    isEducationalPartner: true,
    logo: img("Maple Grove Reproductive Care logo"),
    coverImage: img("A quiet clinic reception with warm wood tones."),
    intro:
      "A Toronto clinic contributing regularly to community education sessions.",
    country: "Canada",
    countryCode: "CA",
    city: "Toronto",
    treatments: ["ivf", "icsi", "egg-freezing", "fertility-preservation"],
    specialties: ["Fertility preservation", "Oncofertility"],
    languages: ["English", "French", "Tagalog"],
    services: [
      "Oncofertility referrals",
      "Egg and embryo freezing",
      "IVF and ICSI cycles",
    ],
    team: [
      { name: "Dr Josephine Traoré", role: "Clinical Director" },
      { name: "Dr Liam O'Donnell", role: "Fertility Specialist" },
    ],
    partnerBenefits: [
      {
        title: "Urgent preservation pathway",
        description:
          "A fast-track route for people needing preservation before cancer treatment.",
      },
    ],
    website: "https://example.com/maple-grove",
    tags: ["fertility-preservation", "ivf"],
    joinedAt: "2026-04-03",
  },
  {
    id: "cli-008",
    slug: "west-coast-family-fertility",
    name: "West Coast Family Fertility",
    isEducationalPartner: true,
    logo: img("West Coast Family Fertility logo"),
    coverImage: img("A modern clinic exterior surrounded by trees."),
    intro:
      "A Vancouver practice known for its plain-language patient materials.",
    country: "Canada",
    countryCode: "CA",
    city: "Vancouver",
    treatments: ["ivf", "iui", "egg-freezing", "pgt-a"],
    specialties: ["PCOS", "Ovulation induction"],
    languages: ["English", "Mandarin", "Punjabi"],
    services: ["Fertility assessment", "Ovulation induction", "IUI", "IVF"],
    team: [{ name: "Dr Hana Kobayashi", role: "Fertility Specialist" }],
    partnerBenefits: [
      {
        title: "Translated patient materials",
        description:
          "Core explainers available in Mandarin and Punjabi as well as English.",
      },
    ],
    website: "https://example.com/west-coast",
    tags: ["pcos", "ivf"],
    joinedAt: "2026-03-20",
  },
  {
    id: "cli-009",
    slug: "instituto-mediterraneo-de-fertilidad",
    name: "Instituto Mediterráneo de Fertilidad",
    isEducationalPartner: true,
    logo: img("Instituto Mediterráneo de Fertilidad logo"),
    coverImage: img("A sunlit clinic courtyard with white walls."),
    intro:
      "A Barcelona institute with an established donor programme and multilingual patient support.",
    country: "Spain",
    countryCode: "ES",
    city: "Barcelona",
    treatments: ["ivf", "icsi", "egg-donation", "embryo-donation"],
    specialties: ["Donor egg programme", "International patients"],
    languages: ["Spanish", "Catalan", "English", "German"],
    services: [
      "Donor egg programme",
      "IVF and ICSI cycles",
      "International patient coordination",
    ],
    team: [
      { name: "Dra Núria Bosch", role: "Medical Director" },
      { name: "Dr Pau Serrano", role: "Fertility Specialist" },
    ],
    partnerBenefits: [
      {
        title: "Remote monitoring coordination",
        description:
          "Works with local clinics so international patients can reduce the number of trips required.",
      },
    ],
    website: "https://example.com/mediterraneo",
    tags: ["donor-conception", "international-ivf", "ivf"],
    joinedAt: "2026-03-08",
  },
  {
    id: "cli-010",
    slug: "aegean-reproductive-centre",
    name: "Aegean Reproductive Centre",
    isEducationalPartner: true,
    logo: img("Aegean Reproductive Centre logo"),
    coverImage: img("A bright clinic interior with sea views."),
    intro:
      "An Athens centre supporting international patients with coordinated remote monitoring.",
    country: "Greece",
    countryCode: "GR",
    city: "Athens",
    treatments: ["ivf", "icsi", "egg-donation", "genetic-testing"],
    specialties: ["International patients", "Donor programmes"],
    languages: ["Greek", "English", "German"],
    services: [
      "Donor egg programme",
      "IVF and ICSI cycles",
      "Travel coordination",
    ],
    team: [{ name: "Dr Nikos Papadopoulos", role: "Medical Director" }],
    partnerBenefits: [
      {
        title: "Itemised written quotes",
        description:
          "Costs broken down before commitment, including medication and storage.",
      },
    ],
    website: "https://example.com/aegean",
    tags: ["international-ivf", "donor-conception", "ivf"],
    joinedAt: "2026-02-26",
  },
  {
    id: "cli-011",
    slug: "gulf-reproductive-institute",
    name: "Gulf Reproductive Institute",
    isEducationalPartner: true,
    logo: img("Gulf Reproductive Institute logo"),
    coverImage: img("A contemporary clinic lobby with marble finishes."),
    intro:
      "A Dubai institute contributing to regional fertility education initiatives.",
    country: "United Arab Emirates",
    countryCode: "AE",
    city: "Dubai",
    treatments: ["ivf", "icsi", "iui", "fertility-preservation"],
    specialties: ["Fertility preservation", "Male factor"],
    languages: ["Arabic", "English", "Hindi"],
    services: [
      "Fertility assessment",
      "IUI",
      "IVF and ICSI cycles",
      "Andrology",
    ],
    team: [
      { name: "Dr Layla Haddad", role: "Consultant" },
      { name: "Dr Omar Rashid", role: "Andrologist" },
    ],
    partnerBenefits: [
      {
        title: "Arabic-language education series",
        description:
          "Regional explainers produced in Arabic rather than translated late.",
      },
    ],
    website: "https://example.com/gulf",
    tags: ["ivf", "male-fertility", "fertility-preservation"],
    joinedAt: "2026-02-12",
  },
  {
    id: "cli-012",
    slug: "deccan-fertility-institute",
    name: "Deccan Fertility Institute",
    isEducationalPartner: true,
    logo: img("Deccan Fertility Institute logo"),
    coverImage: img("A welcoming clinic entrance with garden planting."),
    intro:
      "A Mumbai institute running a longstanding free community education programme.",
    country: "India",
    countryCode: "IN",
    city: "Mumbai",
    treatments: ["ivf", "icsi", "iui", "surrogacy", "egg-donation"],
    specialties: ["Donor programmes", "Community education"],
    languages: ["Hindi", "English", "Marathi", "Gujarati"],
    services: [
      "Fertility assessment",
      "IUI",
      "IVF and ICSI cycles",
      "Donor programmes",
    ],
    team: [
      { name: "Dr Ananya Desai", role: "Medical Director" },
      { name: "Dr Vikram Joshi", role: "Fertility Specialist" },
    ],
    partnerBenefits: [
      {
        title: "Free community education sessions",
        description:
          "Regular sessions in Hindi, Marathi and English, open to all.",
      },
    ],
    website: "https://example.com/deccan",
    tags: ["ivf", "donor-conception", "international-ivf"],
    joinedAt: "2026-01-30",
  },
];
