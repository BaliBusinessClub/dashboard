import {
  BookOpen,
  Building2,
  ChartColumn,
  Heart,
  Newspaper,
  Podcast
} from "lucide-react";

export const dashboardShortcuts = [
  {
    id: "market",
    title: "Market Insights",
    icon: ChartColumn
  },
  {
    id: "news",
    title: "News",
    icon: Newspaper
  },
  {
    id: "podcasts",
    title: "Podcasts",
    icon: Podcast
  },
  {
    id: "resources",
    title: "Ressources",
    icon: BookOpen
  },
  {
    id: "partners",
    title: "Partners",
    icon: Building2
  },
  {
    id: "favorites",
    title: "Favorites",
    icon: Heart
  }
] as const;

export const marketFilters = ["All", "Buy", "Build", "Sell", "Operate"] as const;

export const insightHighlights = [
  {
    label: "Market read",
    title: "Bali is moving into a more selective phase",
    summary:
      "REID's annual market read points to a shift from broad expansion toward sharper investor discipline, more careful project selection, and higher attention on location quality.",
    source: "REID 2025 Annual Market Report",
    strategies: ["All", "Buy", "Build", "Sell"]
  },
  {
    label: "Supply",
    title: "New launches appear more disciplined than before",
    summary:
      "REID notes supply remains broad, but new project launches are no longer expanding with the same speed, suggesting more caution in the development pipeline.",
    source: "REID 2025 Annual Market Report",
    strategies: ["All", "Build", "Sell"]
  },
  {
    label: "Operations",
    title: "Rental performance still matters to strategy selection",
    summary:
      "Occupancy and ADR signals in the REID reports keep operational performance central to investment decisions, especially for yield-focused buyers and villa operators.",
    source: "REID Q3 2023 Buyers and Operators Reports",
    strategies: ["All", "Buy", "Operate"]
  }
];

export const marketChartSeries = [
  {
    title: "Average Occupancy",
    highlight: "64.9%",
    values: [52, 57, 60, 63, 66, 64.9],
    context: "Q3 2023 Buyers Report market occupancy trend snapshot.",
    strategies: ["All", "Buy", "Operate"]
  },
  {
    title: "Average Daily Rate",
    highlight: "$195",
    values: [168, 175, 182, 191, 198, 195],
    context: "Rate performance signal from REID's Q3 2023 buyer-facing market view.",
    strategies: ["All", "Buy", "Operate"]
  },
  {
    title: "Rental Revenue",
    highlight: "$389M",
    values: [248, 292, 318, 341, 372, 389],
    context: "Total Bali rental revenue noted in the REID Q3 2023 Buyers Report.",
    strategies: ["All", "Buy", "Operate", "Sell"]
  },
  {
    title: "Leasehold Supply Depth",
    highlight: "7,000+",
    values: [5200, 5600, 6100, 6500, 6900, 7000],
    context: "REID overview signal for leasehold inventory scale across Bali.",
    strategies: ["All", "Buy", "Sell"]
  }
];

export const marketStatCards = [
  {
    title: "64.9%",
    detail: "Average market occupancy in Q3 2023",
    source: "REID Q3 2023 Buyers Report"
  },
  {
    title: "$195",
    detail: "Average daily rate in Q3 2023",
    source: "REID Q3 2023 Buyers Report"
  },
  {
    title: "$389M",
    detail: "Total Bali rental revenue in Q3 2023",
    source: "REID Q3 2023 Buyers Report"
  },
  {
    title: "7,000+",
    detail: "Leasehold properties tracked in REID's market overview",
    source: "REID Home Updated"
  },
  {
    title: "3,000+",
    detail: "Freehold properties tracked in REID's market overview",
    source: "REID Home Updated"
  },
  {
    title: "60,000+",
    detail: "Rental properties tracked in REID's market overview",
    source: "REID Home Updated"
  }
];

export const newsSections = [
  {
    title: "Business",
    icon: Building2,
    articles: [
      {
        id: "news-business-1",
        title: "Indonesia leans on ASEAN and domestic demand to protect tourism activity",
        teaser: "A strategy shift toward regional and domestic travelers could reshape how Bali-facing businesses think about demand resilience.",
        content:
          "The Jakarta Post reported that Indonesia is increasing its reliance on ASEAN and domestic travelers as geopolitical disruption affects long-haul routes. For Bali businesses, this matters because visitor composition can change quickly when airline networks face pressure. A stronger ASEAN and domestic mix can alter average spend, booking behavior, seasonality, and what kinds of products or services perform best.\n\nFor investors and operators, the practical takeaway is that demand planning cannot rely only on one international traveler profile. Hospitality, lifestyle, and service businesses should watch how policy, flight connectivity, and source market shifts affect both occupancy and pricing power. This also reinforces the value of adaptive business models that can serve short-term tourists, longer-stay residents, and regional travelers with different budgets and expectations.",
        source: "The Jakarta Post",
        date: "April 15, 2026",
        url: "https://www.thejakartapost.com/business/2026/04/16/indonesia-to-tap-asean-domestic-tourism-amid-iran-war-fallout.html"
      },
      {
        id: "news-business-2",
        title: "Community-based tourism is moving higher on the national agenda",
        teaser: "Policy is signaling a broader tourism model that may reward local partnerships and more distributed value creation.",
        content:
          "The Jakarta Post reported that the Tourism Ministry is pushing community-based tourism higher up its priority list. That signal matters in Bali because it suggests future tourism growth may be evaluated not just by arrival numbers, but also by how value is distributed locally and how regional access improves.\n\nFor business owners, the larger implication is that local collaboration, compliance, and community alignment may become more important strategic assets. Businesses that integrate well with local economies and deliver visible value beyond pure visitor volume may be better placed as policy and investor expectations evolve.",
        source: "The Jakarta Post",
        date: "April 13, 2026",
        url: "https://www.thejakartapost.com/business/2026/04/16/ministry-seeks-to-bolster-community-based-tourism-as-priority-agenda.html"
      },
      {
        id: "news-business-3",
        title: "Mideast route disruption may reduce foreign arrivals and tourism receipts",
        teaser: "Flight disruption is becoming a planning variable that businesses with tourism exposure cannot ignore.",
        content:
          "According to The Jakarta Post, the Tourism Ministry warned that prolonged route disruption linked to the Middle East conflict could reduce foreign visitor numbers and tourism-linked earnings. For Bali operators, that is less about one headline and more about a reminder that exogenous shocks can alter arrival timing, booking patterns, and revenue expectations with very little notice.\n\nThis makes diversification increasingly important. Businesses exposed to inbound travel may need broader market mixes, more flexible pricing, stronger repeat-guest strategies, and better conversion from domestic or regional audiences when international conditions soften.",
        source: "The Jakarta Post",
        date: "April 2, 2026",
        url: "https://www.thejakartapost.com/business/2026/04/02/ri-to-lose-60000-foreign-visitors-to-mideast-crisis-tourism-ministry.html"
      }
    ]
  },
  {
    title: "Tourism",
    icon: Newspaper,
    articles: [
      {
        id: "news-tourism-1",
        title: "Tourism Ministry strengthens Bali accommodation governance",
        teaser: "Compliance, licensing, and operating clarity are becoming more central to Bali's tourism environment.",
        content:
          "ANTARA reported that the Tourism Ministry is working to strengthen Bali's accommodation governance through better coordination, communication, and regulatory clarity. This is meaningful for villa operators, hotel owners, managers, and service providers because enforcement and standards often shape the long-term attractiveness of a market just as much as raw demand does.\n\nA stronger governance environment can produce winners and losers. Businesses that are structured correctly and operate transparently may benefit from a more stable competitive field, while weaker or non-compliant operators may face increasing friction. For BBC members, this is a policy trend worth tracking because it affects operations, risk, and valuation quality.",
        source: "ANTARA News",
        date: "April 11, 2026",
        url: "https://en.antaranews.com/amp/news/411959/tourism-ministry-moves-to-bolster-balis-accommodation-governance"
      },
      {
        id: "news-tourism-2",
        title: "Government pushes water taxi and pier development to support Bali tourism",
        teaser: "Mobility and visitor flow remain long-term factors behind which Bali areas gain or lose momentum.",
        content:
          "ANTARA reported that the Transportation Ministry is supporting water taxi and pier development in Bali as part of a wider effort to improve connectivity and reduce congestion. Although infrastructure projects take time to shape real outcomes, they often influence both tourism convenience and how investors think about future location strength.\n\nFor market watchers, better connectivity can change where attention goes next. Areas that become easier to reach or integrate more smoothly into visitor itineraries often become more attractive not just to tourists, but also to operators, developers, and service businesses positioning for future demand.",
        source: "ANTARA News",
        date: "April 10, 2026",
        url: "https://en.antaranews.com/news/411837/govt-pushes-water-taxi-pier-development-to-support-balis-tourism"
      },
      {
        id: "news-tourism-3",
        title: "Fiscal support is being used to sustain tourism demand",
        teaser: "Travel affordability remains a live policy lever for keeping visitor numbers resilient.",
        content:
          "ANTARA reported that Indonesia is using fiscal tools, including support around airfare-related costs, to help sustain tourism. This matters because the government is clearly treating travel affordability as something that can materially influence tourism demand.\n\nFor Bali-facing businesses, policy support does not remove volatility, but it does signal that demand-side resilience is a national concern. If affordability remains a policy priority, businesses may find more stability in visitor flow than they would in a fully hands-off environment, particularly during periods of broader travel cost pressure.",
        source: "ANTARA News",
        date: "April 17, 2026",
        url: "https://en.antaranews.com/news/412684/govt-provides-up-to-down-fiscal-incentives-to-sustain-tourism"
      }
    ]
  }
] as const;

export const podcastTopics = ["All", "Investment", "Legal", "Strategy"] as const;

export const podcastFeed = [
  {
    id: "pod-1",
    title: "Pioneer Investing: The 3 Golden Rules",
    description: "A BBC conversation around frontier locations, timing, and how early-stage positioning changes returns.",
    published: "Published 2025",
    topic: "Investment",
    url: "https://youtu.be/oFFzcP9m-14",
    image: "https://i.ytimg.com/vi/oFFzcP9m-14/hqdefault.jpg"
  },
  {
    id: "pod-2",
    title: "Leasehold vs Freehold",
    description: "A practical breakdown of ownership structure and why it matters to investors entering Bali.",
    published: "Published 2025",
    topic: "Legal",
    url: "https://youtu.be/A-8XYkc3hCA",
    image: "https://i.ytimg.com/vi/A-8XYkc3hCA/hqdefault.jpg"
  },
  {
    id: "pod-3",
    title: "Lease Extensions in Bali",
    description: "A focused BBC episode on lease extension risk, structure, and investor implications.",
    published: "Published 2025",
    topic: "Legal",
    url: "https://youtu.be/E1FguH5Op68",
    image: "https://i.ytimg.com/vi/E1FguH5Op68/hqdefault.jpg"
  },
  {
    id: "pod-4",
    title: "The Kedungu Fund: All the Answers",
    description: "An episode centered on frontier-location thesis, fund logic, and the next phase of Bali growth.",
    published: "Published 2025",
    topic: "Investment",
    url: "https://youtu.be/jh_Ejqlc40g",
    image: "https://i.ytimg.com/vi/jh_Ejqlc40g/hqdefault.jpg"
  },
  {
    id: "pod-5",
    title: "Bali Real Estate: Triple Your Investment In 3 Years!",
    description: "A strategy-heavy BBC episode on location choice, wave patterns, and ROI logic in Bali.",
    published: "Published March 28, 2025",
    topic: "Strategy",
    url: "https://music.youtube.com/podcast/7bXHvn8Vksw",
    image: "/bali-business-club-logo-white.svg"
  }
] as const;

export const resourceDocuments = [
  {
    id: "res-1",
    title: "BBC Ebook Library",
    source: "BBC Google Drive",
    url: "https://drive.google.com/drive/folders/1lOg3Rvx1YWxAWfQGJ0X1rx0bKu3JxxGk?usp=drive_link",
    note: "Live folder integration still needed to list every individual PDF automatically."
  },
  {
    id: "res-2",
    title: "External Reports Library",
    source: "BBC Curated Reports Folder",
    url: "https://drive.google.com/drive/folders/159gqNAUbLn3F3NgCCL-aa7pb5PzeD83j?usp=drive_link",
    note: "Live folder integration still needed to list every individual report automatically."
  }
] as const;

export const partnerBenefits = [
  {
    name: "Voxpop Studio",
    offer: "10% off podcast studio online booking with code BBCMEMBER",
    button: "BOOK ONLINE",
    url: "https://voxpopbali.com/"
  },
  {
    name: "Legal Legends Indonesia",
    offer: "5% on visa, KITAS, and PT PMA creation",
    button: "CONTACT",
    url: "https://legallegendsindonesia.com/contact-us/"
  },
  {
    name: "Bali Accounting Legends",
    offer: "5% discount on consulting",
    button: "CONTACT",
    url: "https://wa.me/6281239091087"
  }
] as const;

export const initialFavorites = [
  {
    id: "fav-news-business-1",
    type: "News",
    title: "Indonesia leans on ASEAN and domestic demand to protect tourism activity",
    note: "Saved for tourism demand planning.",
    sourceId: "news-business-1"
  },
  {
    id: "fav-pod-2",
    type: "Podcast",
    title: "Leasehold vs Freehold",
    note: "Saved for legal structure review.",
    sourceId: "pod-2"
  },
  {
    id: "fav-res-1",
    type: "Ressource",
    title: "BBC Ebook Library",
    note: "Saved for BBC internal materials.",
    sourceId: "res-1"
  }
] as const;

export const socials = [
  {
    name: "YouTube",
    handle: "@BaliBusinessClub",
    url: "https://youtube.com/@BaliBusinessClub?sub_confirmation=1",
    icon: "YT"
  },
  {
    name: "Spotify",
    handle: "Bali Business Club",
    url: "https://open.spotify.com/show/3fKJEwQXsQwR7TaFrl1d1b?si=48e00d7b104544e4",
    icon: "SP"
  },
  {
    name: "Instagram",
    handle: "@bali.business.club",
    url: "https://www.instagram.com/bali.business.club/",
    icon: "IG"
  },
  {
    name: "Facebook",
    handle: "Balibizclub",
    url: "https://www.facebook.com/Balibizclub/",
    icon: "FB"
  },
  {
    name: "TikTok",
    handle: "@balibusinessclub",
    url: "https://www.tiktok.com/@balibusinessclub",
    icon: "TT"
  }
] as const;

export const instagramPanels = [
  {
    title: "Instagram feed integration pending",
    copy: "The layout is ready, but actual recent posts still need Instagram API or embed wiring.",
    url: "https://www.instagram.com/bali.business.club/"
  },
  {
    title: "Community and episode promo slot",
    copy: "Use this area for live reels, member highlights, and podcast clips once connected.",
    url: "https://www.instagram.com/bali.business.club/"
  },
  {
    title: "BBC visual storytelling slot",
    copy: "This panel is ready for actual post thumbnails from the Instagram account.",
    url: "https://www.instagram.com/bali.business.club/"
  }
] as const;

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
] as const;
