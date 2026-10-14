import manifest from "@/public/images/manifest.json";

export type ImageAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

function image(file: string, alt: string): ImageAsset {
  const entry = manifest.find((item) => item.file === file);
  if (!entry) throw new Error(`Missing from public/images/manifest.json: ${file}`);
  return { src: `/images/${file}`, width: entry.width, height: entry.height, alt };
}

export const brand = {
  name: "MNV Associates",
  tagline: "unlock your growth",
  logo: image("logo.webp", "MNV Associates"),
  logoWhite: image("logo-white.webp", "MNV Associates"),
  logoFooter: image("logo-footer-white.webp", "MNV Associates"),
};

export const meta = {
  title: "MNV Associates | Tax, Advisory and Business Process Solutions in Dubai",
  description:
    "Tax, advisory and business process solutions for startups, SMEs and multinational corporations across the UAE. unlock your growth with MNV Associates.",
  ogImage: image("og-image.jpg", "MNV Associates, unlock your growth"),
};

export const skipLink = "Skip to main content";

export const nav = {
  menuLabel: "Main",
  logoLabel: "MNV Associates, back to top",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  viewAllServices: "View all services",
  items: [
    { label: "Services", href: "#services", hasMenu: true },
    { label: "Why MNV", href: "#why-mnv", hasMenu: false },
    { label: "Insights", href: "#insights", hasMenu: false },
    { label: "Contact", href: "#contact", hasMenu: false },
  ],
  cta: { label: "Start a conversation", href: "#contact" },
};

export const hero = {
  tagline: brand.tagline,
  heading: "Tax, advisory and business process solutions for growing UAE businesses",
  text: "We are a prominent firm in the UAE, offering extensive expertise in Advisory and Tax services. Our team of professionals deeply understands your financial goals, ensuring that every decision made leads to your desired success.",
  primaryCta: { label: "Start a conversation", href: "#contact" },
  secondaryCta: { label: "Explore services", href: "#services" },
  image: image("hero-682.webp", "Glass office tower seen from below against a pale sky"),
  imageSmall: image("hero-400.webp", "Glass office tower seen from below against a pale sky"),
  avif: { large: image("hero-682.avif", ""), small: image("hero-400.avif", "") },
  bg: {
    avif: [image("herobg-1000.avif", ""), image("herobg-1600.avif", "")],
    webp: [image("herobg-1000.webp", ""), image("herobg-1600.webp", "")],
  },
  scrollCue: "Scroll to explore",
};

export type Service = { id: string; name: string; description: string };
export type Pillar = {
  id: string;
  name: string;
  line: string;
  services: Service[];
  also: string[];
};

export const services = {
  heading: "How can we assist you?",
  headingLines: ["How can we", "assist you?"],
  discover: "Discover how we can help",
  intro:
    "Our main expertise lies in optimising processes and streamlining financial operations within organisations. We offer comprehensive assistance to SMEs, startups and multinational corporations.",
  tabsLabel: "Service areas",
  alsoLabel: "Also",
  pillars: [
    {
      id: "taxation",
      name: "Taxation",
      line: "The finest solutions for transacting with tax authorities; reduce, save and conform like never before.",
      services: [
        {
          id: "corporate-tax",
          name: "Corporate Tax",
          description:
            "Navigate UAE corporate tax with confidence. Expert CT registration, QFZP analysis, tax group advisory, and FTA compliance.",
        },
        {
          id: "vat",
          name: "VAT",
          description:
            "Expert VAT consultants in Dubai offering VAT registration, compliance, return filing, and FTA audit support. Recover more and risk less.",
        },
        {
          id: "transfer-pricing",
          name: "Transfer Pricing",
          description:
            "Price related-party transactions at arm's length with a defensible, OECD-compliant framework. Our specialists cover risk assessment, policy design, documentation and FTA audit support.",
        },
      ],
      also: ["Excise Tax", "International Tax"],
    },
    {
      id: "advisory",
      name: "Advisory",
      line: "Informed decision making through strategic insights, expert guidance and thorough due diligence.",
      services: [
        {
          id: "business-setup",
          name: "Business Setup",
          description:
            "End-to-end company incorporation across mainland and free zone jurisdictions, from choosing the right legal structure to trade license applications and shareholder agreements.",
        },
        {
          id: "compliance",
          name: "Compliance",
          description:
            "Ongoing support after setup, including license and establishment card renewals, labour and visa processing, and corporate compliance such as UBO declarations.",
        },
        {
          id: "business-advisory",
          name: "Business Advisory",
          description:
            "We invest the time to understand your business, your stakeholders and your ambitions, then build recommendations around those realities. Every major decision is backed by precise expertise and commercial insight.",
        },
      ],
      also: ["Bank Advisory", "Mergers & Acquisitions", "IFRS Advisory"],
    },
    {
      id: "business-process-solutions",
      name: "Business Process Solutions",
      line: "Optimise efficiency and streamline operations to drive growth and attain the desired organisational structure.",
      services: [
        {
          id: "accounting",
          name: "Accounting",
          description:
            "Outsourced accounting and bookkeeping across the UAE by a team of Chartered Accountants, with real-time financial visibility, monthly management accounts and IFRS-compliant financial statements.",
        },
        {
          id: "cfo-advisory",
          name: "CFO Advisory",
          description:
            "Part-time or project-based senior finance leadership for startups, high-growth SMEs, family businesses and multinational subsidiaries, from financial planning to fundraising readiness, without the overhead of a permanent hire.",
        },
        {
          id: "hr-advisory",
          name: "HR Advisory",
          description:
            "Specialist guidance to build an HR function fully aligned with UAE employment law, covering MOHRE, DIFC and ADGM requirements, employment contracts, HR policies and Emiratisation.",
        },
      ],
      also: ["Payroll Management", "Secondment", "ERP Implementation"],
    },
  ] satisfies Pillar[],
};

export const whoWeHelp = {
  heading: "Who we work with",
  headingLines: ["Who we", "work with"],
  line: "From startups and SMEs to multinational corporations, with an industry network and venture capital connections that add value beyond the numbers.",
  audiences: [
    {
      id: "startups",
      label: "Startups",
      serviceIds: ["business-setup", "accounting", "cfo-advisory"],
    },
    {
      id: "smes",
      label: "SMEs",
      serviceIds: ["vat", "corporate-tax", "hr-advisory"],
    },
    {
      id: "multinationals",
      label: "Multinational corporations",
      serviceIds: ["transfer-pricing", "compliance", "business-advisory"],
    },
  ],
};

export const whyMnv = {
  heading: "We grow as you grow",
  headingLines: ["We grow", "as you grow"],
  stats: [
    { value: "100+", label: "clients served" },
    { value: "10+", label: "years of experience" },
  ],
  credentials:
    "Chartered Accountants, tax professionals and financial advisors working as one partner-led team.",
  differentiators: [
    {
      title: "Unmatched expertise",
      text: "You can focus more on the core activities as we help you save valuable time handling the financial front of your business.",
    },
    {
      title: "Client first approach",
      text: "We design customised strategies that drive tangible results through transparent communication, proactive collaboration and unwavering dedication.",
    },
    {
      title: "Transformative solutions",
      text: "We leverage advanced accounting software, analytics tools and automation solutions to deliver timely, accurate and insightful guidance for enhanced decision-making.",
    },
  ],
  circle: {
    intro: "The CIRCLE is how we work.",
    values: [
      {
        letter: "C",
        name: "Collaboration",
        text: "Collaborative teamwork is at the heart of our approach. By working closely with our clients and within our team, we harness diverse perspectives to deliver tailored solutions that address unique challenges.",
      },
      {
        letter: "I",
        name: "Integrity",
        text: "We uphold honesty, transparency and ethical conduct in all our interactions, maintaining confidentiality and adhering to the highest professional standards.",
      },
      {
        letter: "R",
        name: "Responsibility",
        text: "We are dedicated to fulfilling our commitments, meeting deadlines and delivering on our promises.",
      },
      {
        letter: "C",
        name: "Credibility",
        text: "Our track record shows our expertise, reliability and consistent delivery of quality services. We strive to be a partner clients can rely on for accurate advice and effective solutions.",
      },
      {
        letter: "L",
        name: "Leadership",
        text: "Through continuous learning, innovative thinking and visionary guidance, we aim to set new benchmarks and inspire confidence in our clients and partners.",
      },
      {
        letter: "E",
        name: "Excellence",
        text: "From the quality of our work to the calibre of our team, we are committed to surpassing expectations and achieving outstanding results.",
      },
    ],
  },
  partners: [
    {
      name: "Vinay Venkat",
      role: "Managing Partner",
      photo: image("partner-vinay-venkat-320.webp", ""),
    },
    {
      name: "Mohammed Noaman Khan",
      role: "Senior Partner",
      photo: image("partner-mohammed-noaman-khan-320.webp", ""),
    },
  ],
};

export const insights = {
  heading: "Latest insights",
  headingLines: ["Latest", "insights"],
  intro: "Stay informed about the news, updates and events that matter to your business.",
  modal: { close: "Close" },
  items: [
    {
      id: "financial-setup",
      title: "Why Dubai start-ups need professional financial setup from day one",
      date: "02 Jan 2026",
      isoDate: "2026-01-02",
      categories: ["Advisory", "Business Process Solutions"],
      readTime: "10 min read",
      summary:
        "If you've thought this as a Dubai startup founder, you're not alone. With limited budgets and countless priorities competing for attention, many entrepreneurs convince themselves that accounting is something they can manage independently during the early stages. After all, how hard can it be to track a few transactions in Excel?",
      image: image(
        "insight-financial-setup-800.webp",
        "Laptop showing financial dashboards in front of the Dubai skyline at dusk",
      ),
      imageSmall: image(
        "insight-financial-setup-400.webp",
        "Laptop showing financial dashboards in front of the Dubai skyline at dusk",
      ),
    },
    {
      id: "cfo-services",
      title: "Why CFO services in Dubai are in high demand among startups and SMEs",
      date: "31 Dec 2025",
      isoDate: "2025-12-31",
      categories: ["Advisory", "Business Process Solutions"],
      readTime: "7 min read",
      summary:
        "Dubai's startup ecosystem is experiencing unprecedented growth, with the city attracting over 7,100 new millionaires in 2025 and emerging as one of the world's premier wealth hubs. Yet behind every successful venture lies a truth many founders learn the hard way: financial leadership isn't optional, it's existential. As startups navigate investor demands, regulatory complexity, and scaling challenges, CFO services Dubai has become not just valuable, but essential.",
      image: image(
        "insight-cfo-services-800.webp",
        "Empty boardroom with a wall screen of financial charts",
      ),
      imageSmall: image(
        "insight-cfo-services-400.webp",
        "Empty boardroom with a wall screen of financial charts",
      ),
    },
    {
      id: "compliance-roadmap",
      title: "Financial compliance roadmap: your first 90 days after Dubai business setup",
      date: "25 Dec 2025",
      isoDate: "2025-12-25",
      categories: ["Advisory", "Business Process Solutions", "Taxation"],
      readTime: "11 min read",
      summary:
        "The first 90 days after business setup represent a critical window where proper financial and compliance infrastructure must be established. Miss key deadlines, skip essential registrations, or neglect accounting fundamentals, and you risk penalties, operational disruptions, and complications that can persist for years. Understanding what needs to happen during this crucial period, and in what sequence, can mean the difference between smooth operations and costly mistakes.",
      image: image(
        "insight-compliance-roadmap-800.webp",
        "Close-up of a stopwatch resting on a notepad",
      ),
      imageSmall: image(
        "insight-compliance-roadmap-400.webp",
        "Close-up of a stopwatch resting on a notepad",
      ),
    },
  ],
};

export const testimonials = {
  heading: "Partnering to deliver exceptional outcomes",
  headingLines: ["Partnering to deliver", "exceptional outcomes"],
  initialCount: 3,
  showMore: "Show more",
  showLess: "Show less",
  items: [
    {
      quote:
        "Partnering with MNV has been a game-changer for my business. Their expertise in accounting and tax planning not only saved us money but also provided us with invaluable guidance for growth. The team's approach and commitment are truly commendable.",
      name: "Abdalla Al Mulla",
      role: "CEO",
      company: "Behind The Cup (BTC) Group",
    },
    {
      quote:
        "From tax preparation to financial planning, the team at MNV Associates provided tailored solutions that aligned with our goals and priorities. Their professionalism and genuine care for clients' successes makes them my go-to resource for all financial assistance.",
      name: "Rushin Patel",
      role: "Group Finance Director",
      company: "Fundamental Hospitality DIFC",
    },
    {
      quote:
        "I have been working with MNV Associates for several years now, and I couldn't be happier with their tax services. The team is highly professional and knowledgeable, and they have consistently provided me with accurate tax advice and support.",
      name: "Janet Fernandes",
      role: "Finance & Administration Manager",
      company: "IHC Holland LLC",
    },
    {
      quote:
        "I highly recommend MNV Associates to anyone in need of accounting and tax services. Their expertise, attention to detail and dedication to client satisfaction make them a leading business in the UAE.",
      name: "Tumar Boranbayeva",
      role: "Owner",
      company: "BTT Rent A Car",
    },
    {
      quote:
        "I recommend MNV Associates to anyone seeking taxation and financial services. Their commitment to client satisfaction makes them a trusted and reliable partner.",
      name: "Sheikh Ali bin Taleb Al Qasimi",
      role: "CEO",
      company: "Rak Petroleum",
    },
    {
      quote:
        "MNV Associates have extensively helped us simplify our payroll management and HR processes. Their expertise and guidance have not only simplified our operations but have also allowed us to optimise our productivity.",
      name: "Aravindaksha K. Menon",
      role: "CEO",
      company: "Trion Surfactants & Trent International",
    },
  ],
};

export const contact = {
  heading: "Let's find a solution that fits your needs",
  headingLines: ["Let's find a solution", "that fits your needs"],
  line: "Get in touch today and find a solution that's right for you.",
  form: {
    fields: {
      name: "Full name",
      email: "Work email",
      phone: "Phone",
      service: "Service you need",
      message: "Message",
    },
    optional: "(optional)",
    messageMax: 1000,
    notSure: "Not sure yet",
    submit: "Send message",
    sending: "Sending",
    success: "Thanks, your message has been sent. Our team will reply within one working day.",
    submitError:
      "Sorry, we could not send your message. Please try again, or call us on +971 56 375 0931.",
    errors: {
      name: "Enter your full name",
      email: "Enter an email address like name@company.com",
      phone: "Enter a phone number using digits, spaces and + only, like +971 50 123 4567",
    },
  },
  office: {
    address: "Office 706, Sobha Ivory II, Business Bay, Dubai, United Arab Emirates",
    phones: [
      { label: "+971 56 375 0931", href: "tel:+971563750931" },
      { label: "+971 4 576 7094", href: "tel:+97145767094" },
    ],
    email: { label: "info@mnvassociates.com", href: "mailto:info@mnvassociates.com" },
    whatsapp: { label: "WhatsApp", href: "https://wa.me/971563750931" },
    hours: "Monday to Friday, 9:00 to 18:00",
  },
};

export const footer = {
  tagline: brand.tagline,
  columns: {
    services: "Services",
    company: "Company",
    contact: "Contact",
    social: "Social",
  },
  companyLinks: [
    { label: "Why MNV", href: "#why-mnv" },
    { label: "Insights", href: "#insights" },
    { label: "Contact", href: "#contact" },
  ],
  newTab: "opens in a new tab",
  social: [
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/mnv-associates" },
    { id: "facebook", label: "Facebook", href: "https://www.facebook.com/mnvassociates/" },
    { id: "x", label: "X", href: "https://twitter.com/mnvassociates" },
    {
      id: "youtube",
      label: "YouTube",
      href: "https://www.youtube.com/channel/UC1aCGWdyUzk0WnB8oAMmcqA/featured",
    },
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/mnvassociates/" },
  ],
  legal: "© 2026 MNV Associates. All rights reserved.",
};

export const clients = {
  label: "Trusted by businesses across the UAE",
  names: [
    "Behind The Cup Group",
    "Fundamental Hospitality DIFC",
    "IHC Holland",
    "BTT Rent A Car",
    "Rak Petroleum",
    "Trion Surfactants",
  ],
};

export const floating = {
  whatsapp: "WhatsApp",
  chat: "Start a conversation",
};
