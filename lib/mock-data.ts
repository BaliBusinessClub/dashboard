import {
  BookOpen,
  Building2,
  ChartColumn,
  Heart,
  Newspaper,
  Podcast,
  UsersRound
} from "lucide-react";

export const dashboardShortcuts = [
  {
    id: "market",
    title: "MARKET INSIGHTS",
    copy: "Open the REID-powered real estate snapshot and market stats.",
    icon: ChartColumn
  },
  {
    id: "news",
    title: "NEWS",
    copy: "Browse summarized Bali business, tourism, and property headlines.",
    icon: Newspaper
  },
  {
    id: "podcasts",
    title: "PODCASTS",
    copy: "Jump into Bali Business Club episodes from the YouTube channel.",
    icon: Podcast
  },
  {
    id: "resources",
    title: "RESSOURCES",
    copy: "Access ebooks, reports, and external business resources.",
    icon: BookOpen
  },
  {
    id: "partners",
    title: "PARTNERS",
    copy: "See member benefits and partnership opportunities.",
    icon: Building2
  },
  {
    id: "favorites",
    title: "FAVORITES",
    copy: "Revisit the reports, articles, and podcasts you saved.",
    icon: Heart
  },
  {
    id: "connect",
    title: "CONNECT WITH US",
    copy: "Find social channels, WhatsApp, and recommend future topics.",
    icon: UsersRound
  }
] as const;

export const insightHighlights = [
  {
    label: "MARKET READ",
    title: "BALI IS SHIFTING FROM FAST GROWTH TO A MORE DISCIPLINED MARKET",
    summary:
      "REID's 2025 annual summary describes a year of structural consolidation, moderated volumes, and a pivot toward compact, efficient assets.",
    source: "Source: REID 2025 Annual Market Report"
  },
  {
    label: "SUPPLY",
    title: "LISTINGS STAY DEEP, BUT NEW RELEASES LOOK MORE SELECTIVE",
    summary:
      "REID notes supply pipelines narrowed in off-plan inventory, suggesting developers are becoming more selective with launches.",
    source: "Source: REID 2025 Annual Market Report"
  },
  {
    label: "OPERATORS",
    title: "RENTAL PERFORMANCE IS HOLDING, EVEN WITH RATE PRESSURE",
    summary:
      "Q3 2023 reports showed occupancy around 65 percent while ADR remained around the mid-$190 range, signaling resilience in the operator segment.",
    source: "Source: REID Q3 2023 Buyers and Operators Reports"
  }
];

export const marketStatCards = [
  {
    title: "LEASEHOLD MARKET DEPTH",
    figure: "7,000+",
    bar: 74,
    context: "REID's public overview cites more than 7,000 leasehold properties in its market-wide data set."
  },
  {
    title: "FREEHOLD INVENTORY",
    figure: "3,000+",
    bar: 38,
    context: "REID's public overview cites over 3,000 freehold properties in its market-wide data set."
  },
  {
    title: "RENTAL MARKET SCALE",
    figure: "60,000+",
    bar: 92,
    context: "REID's public overview points to over 60,000 rental properties captured across Bali."
  },
  {
    title: "AVERAGE OCCUPANCY",
    figure: "64.9%",
    bar: 65,
    context: "Q3 2023 Buyers Report shows average market occupancy at 64.9 percent."
  }
];

export const newsSections = [
  {
    title: "TOURISM AND POLICY",
    icon: Newspaper,
    articles: [
      {
        id: "news-1",
        title: "Tourism Ministry moves to bolster Bali's accommodation governance",
        teaser: "A stronger compliance and licensing push could reshape the operating environment for accommodation businesses.",
        summary:
          "Indonesia's Tourism Ministry said the accommodation sector is strategic to Bali's economy and is moving to improve communication, coordination, and regulatory certainty for licensed operators. For BBC members, the important signal is that governance and standardization are becoming a bigger part of the business conversation.",
        source: "ANTARA News",
        date: "April 11, 2026",
        url: "https://en.antaranews.com/amp/news/411959/tourism-ministry-moves-to-bolster-balis-accommodation-governance"
      },
      {
        id: "news-2",
        title: "Gov't pushes water taxi and pier development to support Bali tourism",
        teaser: "Transport infrastructure remains part of the long-term story behind visitor flow and regional accessibility.",
        summary:
          "Indonesia's Transportation Ministry said it is pushing water taxis and pier development in Bali to improve connectivity and reduce congestion, with construction planning currently scheduled from August 2026 to July 2027. Better mobility would matter not only for tourism, but also for area-by-area real estate demand and operating logistics.",
        source: "ANTARA News",
        date: "April 10, 2026",
        url: "https://en.antaranews.com/news/411837/govt-pushes-water-taxi-pier-development-to-support-balis-tourism"
      },
      {
        id: "news-3",
        title: "Government provides fiscal incentives to sustain tourism",
        teaser: "The tourism ministry is signaling support measures to cushion the sector against rising travel costs.",
        summary:
          "ANTARA reported that fiscal support, including government-borne VAT on economy tickets and limits on airfare increases, is part of the national strategy to keep tourism resilient. For BBC members, that suggests the state still sees travel affordability as a direct lever for demand stability.",
        source: "ANTARA News",
        date: "April 17, 2026",
        url: "https://en.antaranews.com/news/412684/govt-provides-up-to-down-fiscal-incentives-to-sustain-tourism"
      }
    ]
  },
  {
    title: "BUSINESS ENVIRONMENT",
    icon: Building2,
    articles: [
      {
        id: "news-4",
        title: "Ministry seeks to bolster community-based tourism as priority agenda",
        teaser: "National tourism policy is leaning harder into local participation and more distributed value creation.",
        summary:
          "The Jakarta Post reported that the ministry is prioritizing community-based tourism and expanding international airport availability to improve access. This matters for Bali businesses because it reinforces a broader, more inclusive tourism model rather than a narrow luxury-only growth story.",
        source: "The Jakarta Post",
        date: "April 13, 2026",
        url: "https://www.thejakartapost.com/business/2026/04/16/ministry-seeks-to-bolster-community-based-tourism-as-priority-agenda.html"
      },
      {
        id: "news-5",
        title: "Indonesia to tap ASEAN and domestic tourism amid Iran war fallout",
        teaser: "Tourism strategy is shifting toward regional and domestic demand as global travel routes face disruption.",
        summary:
          "The Jakarta Post reported that Indonesia is emphasizing ASEAN and domestic demand to offset aviation disruption tied to the Middle East conflict. The story is relevant to BBC members because it highlights how external shocks can quickly change demand composition and marketing priorities.",
        source: "The Jakarta Post",
        date: "April 15, 2026",
        url: "https://www.thejakartapost.com/business/2026/04/16/indonesia-to-tap-asean-domestic-tourism-amid-iran-war-fallout.html"
      },
      {
        id: "news-6",
        title: "RI could lose 60,000 foreign visitors due to Mideast crisis, ministry says",
        teaser: "Aviation disruption is already showing up as a real planning variable for the tourism sector.",
        summary:
          "According to The Jakarta Post, the Tourism Ministry warned that international arrivals and foreign exchange earnings could fall because of flight disruptions across major Middle East hubs. BBC members in tourism-sensitive sectors should read this as a reminder to diversify source markets and booking channels.",
        source: "The Jakarta Post",
        date: "April 2, 2026",
        url: "https://www.thejakartapost.com/business/2026/04/02/ri-to-lose-60000-foreign-visitors-to-mideast-crisis-tourism-ministry.html"
      }
    ]
  }
];

export const podcastFeed = [
  {
    title: "Bali Real Estate: Triple Your Investment In 3 Years!",
    description:
      "BBC podcast episode featuring Gawain Blizzard and Omri Ben-Canaan on frontier locations, surf-led growth, and how strategy changes ROI.",
    published: "Published March 28, 2025",
    url: "https://music.youtube.com/podcast/7bXHvn8Vksw"
  },
  {
    title: "YOUTUBE CHANNEL AUTO-SYNC READY",
    description:
      "This slot is prepared for live YouTube feed ingestion so new episodes can appear automatically when published on the BBC channel.",
    published: "Sync placeholder",
    url: "https://www.youtube.com/@BaliBusinessClub"
  }
];

export const resourceFolders = [
  {
    title: "BBC EBOOK LIBRARY",
    copy: "Primary Google Drive folder for Bali Business Club ebooks and PDFs. Hook this to the Google Drive API to list every file title automatically.",
    source: "BBC Google Drive",
    url: "https://drive.google.com/drive/folders/1lOg3Rvx1YWxAWfQGJ0X1rx0bKu3JxxGk?usp=drive_link"
  },
  {
    title: "EXTERNAL REPORTS LIBRARY",
    copy: "Supplemental Google Drive folder for third-party reports worth sharing with members.",
    source: "BBC Curated Reports Folder",
    url: "https://drive.google.com/drive/folders/159gqNAUbLn3F3NgCCL-aa7pb5PzeD83j?usp=drive_link"
  }
];

export const partnerBenefits = [
  {
    name: "VOXPOP STUDIO",
    offer: "10% off podcast studio online booking with code BBCMEMBER",
    button: "BOOK ONLINE",
    url: "https://voxpopbali.com/"
  },
  {
    name: "LEGAL LEGENDS INDONESIA",
    offer: "5% off visa, KITAS, and PT PMA creation services",
    button: "CONTACT",
    url: "https://legallegendsindonesia.com/contact-us/"
  },
  {
    name: "BALI ACCOUNTING LEGENDS",
    offer: "5% discount on consulting",
    button: "CONTACT",
    url: "https://wa.me/6281239091087"
  }
];

export const favorites = [
  {
    type: "REPORT",
    title: "REID 2025 Annual Market Report",
    note: "Saved for long-term supply and pricing trend review.",
    savedAt: "April 20, 2026"
  },
  {
    type: "ARTICLE",
    title: "Tourism Ministry moves to bolster Bali's accommodation governance",
    note: "Saved for policy tracking and operational compliance.",
    savedAt: "April 20, 2026"
  },
  {
    type: "PODCAST",
    title: "Bali Real Estate: Triple Your Investment In 3 Years!",
    note: "Saved for investor strategy ideas.",
    savedAt: "April 20, 2026"
  }
];

export const socials = [
  {
    name: "YOUTUBE",
    handle: "@BaliBusinessClub",
    url: "https://youtube.com/@BaliBusinessClub?sub_confirmation=1"
  },
  {
    name: "SPOTIFY",
    handle: "Bali Business Club",
    url: "https://open.spotify.com/show/3fKJEwQXsQwR7TaFrl1d1b?si=48e00d7b104544e4"
  },
  {
    name: "INSTAGRAM",
    handle: "@bali.business.club",
    url: "https://www.instagram.com/bali.business.club/"
  },
  {
    name: "FACEBOOK",
    handle: "Balibizclub",
    url: "https://www.facebook.com/Balibizclub/"
  },
  {
    name: "TIKTOK",
    handle: "@balibusinessclub",
    url: "https://www.tiktok.com/@balibusinessclub"
  }
];

export const connectPanels = [
  {
    meta: "INSTAGRAM POST",
    title: "MEMBER SPOTLIGHTS AND EVENT CUTS",
    copy: "Use the Instagram feed area for recent clips, quotes, podcast snippets, and community highlights.",
    url: "https://www.instagram.com/bali.business.club/"
  },
  {
    meta: "INSTAGRAM POST",
    title: "PODCAST PROMO REELS",
    copy: "Horizontal carousel layout ready for the most recent posts from the BBC Instagram account.",
    url: "https://www.instagram.com/bali.business.club/"
  },
  {
    meta: "INSTAGRAM POST",
    title: "MARKET UPDATE CAROUSELS",
    copy: "Ideal for swipeable, visual summaries without adding stats to this page itself.",
    url: "https://www.instagram.com/bali.business.club/"
  }
];

export const dashboardUsers = [
  {
    name: "Made Prasetya",
    email: "made@balibusinessclub.com",
    phone: "+62 812 3456 7890",
    membership: "Founding Member",
    joined: "2026-01-12"
  },
  {
    name: "Sarah Collins",
    email: "sarah@balibusinessclub.com",
    phone: "+61 402 118 900",
    membership: "Investor",
    joined: "2026-02-03"
  },
  {
    name: "Julien Moreau",
    email: "julien@balibusinessclub.com",
    phone: "+33 6 12 34 56 78",
    membership: "Operator",
    joined: "2026-02-18"
  }
];
