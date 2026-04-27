import {
  BookOpen,
  Building2,
  ChartColumn,
  CalendarRange,
  Heart,
  MessagesSquare,
  Newspaper,
  Podcast
} from "lucide-react";

export const dashboardShortcuts = [
  {
    id: "market",
    title: "Market Insights",
    description: "Track the REID-backed data, filters, and market signals shaping Bali real estate right now.",
    icon: ChartColumn
  },
  {
    id: "news",
    title: "News",
    description: "Read the latest business, tourism, infrastructure, and policy updates relevant to Bali.",
    icon: Newspaper
  },
  {
    id: "podcasts",
    title: "Podcasts",
    description: "Browse every Bali Business Club episode by theme and jump straight to the full conversation.",
    icon: Podcast
  },
  {
    id: "resources",
    title: "Ressources",
    description: "Access the full BBC ebook library and curated reports in one downloadable archive.",
    icon: BookOpen
  },
  {
    id: "partners",
    title: "Partners",
    description: "See current member offers and apply to become a Bali Business Club partner.",
    icon: Building2
  },
  {
    id: "events",
    title: "Events",
    description: "See what is happening in Bali now and discover the best events to join next.",
    icon: CalendarRange
  }
] as const;

export const marketReports = [
  {
    report: "2025 Annual",
    source: "REID Bali Real Estate Market Annual Report 2025",
    metrics: [
      {
        id: "contract-type",
        title: "Supply by contract type",
        highlight: "80.6% leasehold",
        values: [80.6, 19.4],
        labels: ["Leasehold", "Freehold"],
        unit: "percent",
        context:
          "Leasehold remained the dominant transaction structure in 2025, reinforcing how foreign-buyer access and local market practice continue to shape supply.",
        source: "REID Bali Real Estate Market Annual Report 2025"
      },
      {
        id: "regional-supply",
        title: "Supply by region",
        highlight: "34.9% North Badung",
        values: [34.9, 21.6, 17.2, 8.8, 7.1, 6.8, 3.6],
        labels: ["North Badung", "South Badung", "Mengwi", "Gianyar", "Central Badung", "Tabanan", "Denpasar"],
        unit: "percent",
        context:
          "North Badung still holds the deepest supply pool, but the report points to South Badung as the clearer growth corridor as inventory rotates toward newer demand pockets.",
        source: "REID Bali Real Estate Market Annual Report 2025"
      },
      {
        id: "sales-bedroom",
        title: "Sales volume by bedroom",
        highlight: "31.9% two-bedroom sales",
        values: [20.8, 31.9, 26.4, 13.2, 6.2, 1.5],
        labels: ["1 Bed", "2 Bed", "3 Bed", "4 Bed", "5 Bed", "6 Bed"],
        unit: "percent",
        context:
          "Two-bedroom properties led 2025 sales activity, while one- and two-bedroom formats together made up 53% of all transactions, confirming the market's move toward compact stock.",
        source: "REID Bali Real Estate Market Annual Report 2025"
      },
      {
        id: "rental-region",
        title: "Rental supply by region",
        highlight: "46.9% North Badung",
        values: [46.9, 17, 12.2, 10.8, 6.2, 4.1, 2.7],
        labels: ["North Badung", "South Badung", "Gianyar", "Central Badung", "Denpasar", "Mengwi", "Tabanan"],
        unit: "percent",
        context:
          "Rental stock remains heavily concentrated in North Badung, with South Badung and Gianyar making up the strongest secondary clusters for short-stay supply.",
        source: "REID Bali Real Estate Market Annual Report 2025"
      },
      {
        id: "price-per-sqm",
        title: "Average price per sqm",
        highlight: "$3,400 apartments",
        values: [2210, 3400],
        labels: ["Villa", "Apartment"],
        unit: "currency",
        context:
          "REID's 2025 report shows villa pricing per square metre holding firm while apartment pricing sits materially higher, even as vertical formats face more competition.",
        source: "REID Bali Real Estate Market Annual Report 2025"
      }
    ]
  },
  {
    report: "2024 Annual",
    source: "REID 2024 Annual Market Report",
    metrics: [
      {
        id: "contract-type",
        title: "Contract type share",
        highlight: "77.7% leasehold",
        values: [77.7, 22.3],
        labels: ["Leasehold", "Freehold"],
        unit: "percent",
        context:
          "Across 2024, leasehold expanded from 72.9% in 2023 to 77.7%, showing a continued market preference for leasehold product.",
        source: "REID 2024 Annual Market Report"
      },
      {
        id: "off-plan-share",
        title: "Off-plan share by segment",
        highlight: "36% overall off-plan",
        values: [36, 30, 50],
        labels: ["Overall", "Villas", "Apartments"],
        unit: "percent",
        context:
          "Supply in 2024 carried a meaningful off-plan component, with apartments remaining the more development-heavy segment and villas staying comparatively stable.",
        source: "REID 2024 Annual Market Report"
      },
      {
        id: "sales-shift",
        title: "Sales shift by bedroom",
        highlight: "+37% one-bedroom sales",
        values: [37, 12, -16],
        labels: ["1 Bed", "2 Bed", "3 Bed"],
        unit: "change",
        context:
          "Demand in 2024 shifted decisively toward smaller assets: one-bedroom sales rose 37%, two-bedroom sales rose 12%, and three-bedroom sales fell 16%.",
        source: "REID 2024 Annual Market Report"
      },
      {
        id: "pricing-change",
        title: "Price change by market",
        highlight: "+13% freehold",
        values: [4.9, 3, 13],
        labels: ["Market", "Leasehold", "Freehold"],
        unit: "change",
        context:
          "Overall market pricing rose 4.9% in 2024, with freehold clearly outperforming leasehold on annual price growth.",
        source: "REID 2024 Annual Market Report"
      },
      {
        id: "rental-performance",
        title: "Rental performance change",
        highlight: "+60% managed daily rates",
        values: [-4.5, 6, 60],
        labels: ["Overall occupancy", "Managed occupancy", "Managed daily rates"],
        unit: "change",
        context:
          "The broader rental market softened in 2024, but professionally managed properties materially outperformed on both occupancy and daily rates.",
        source: "REID 2024 Annual Market Report"
      }
    ]
  }
] as const;

export const marketStatCards = [
  {
    title: "12,300",
    detail: "Available properties tracked in REID's 2025 annual market report.",
    source: "REID Bali Real Estate Market Annual Report 2025"
  },
  {
    title: "4,800",
    detail: "Total 2025 sales volume, with transactions easing 5% year on year.",
    source: "REID Bali Real Estate Market Annual Report 2025"
  },
  {
    title: "80.6%",
    detail: "2025 leasehold share of total supply by contract type.",
    source: "REID Bali Real Estate Market Annual Report 2025"
  },
  {
    title: "53%",
    detail: "Share of 2025 transactions coming from one- and two-bedroom assets.",
    source: "REID Bali Real Estate Market Annual Report 2025"
  },
  {
    title: "83%",
    detail: "Average floor space ratio in 2025, up 3% year on year.",
    source: "REID Bali Real Estate Market Annual Report 2025"
  },
  {
    title: "-4.5%",
    detail: "Relative decline in 2024 short-term rental occupancy across the wider market.",
    source: "REID 2024 Annual Market Report"
  }
] as const;

export const reidReports = [
  {
    id: "reid-2023-market-report",
    title: "2023 Market Report",
    source: "REID",
    url: "/resources/reid/2023-market-report.pdf"
  },
  {
    id: "reid-2024-h1-report",
    title: "2024 H1 Report",
    source: "REID",
    url: "/resources/reid/2024-h1-report.pdf"
  },
  {
    id: "reid-2024-market-report",
    title: "2024 Market Report",
    source: "REID",
    url: "/resources/reid/2024-market-report.pdf"
  },
  {
    id: "reid-2025-annual-report",
    title: "Bali Real Estate Market Annual Report 2025",
    source: "REID",
    url: "/resources/reid/bali-real-estate-market-annual-report-2025.pdf"
  },
  {
    id: "reid-q1-2025-market-report",
    title: "Q1 2025 Market Report",
    source: "REID",
    url: "/resources/reid/q1-2025-market-report.pdf"
  },
  {
    id: "reid-q2-2025-market-report",
    title: "Q2 2025 Market Report",
    source: "REID",
    url: "/resources/reid/q2-2025-market-report.pdf"
  },
  {
    id: "reid-q3-2025-market-report",
    title: "Q3 2025 Market Report",
    source: "REID",
    url: "/resources/reid/q3-2025-market-report.pdf"
  }
] as const;

export const newsSections = [
  {
    title: "Business",
    icon: Building2,
    articles: [
      {
        id: "news-business-1",
        region: "Indonesia",
        title: "Finance Minister projects RI's economy to grow 5.7 percent in Q2 2026",
        teaser: "The macro backdrop is still supportive for founders and investors watching demand, spending, and confidence.",
        content:
          "ANTARA reported that Finance Minister Sri Mulyani projected Indonesia's economy could grow 5.7 percent in the second quarter of 2026. For Bali businesses, that matters because national momentum still shapes credit conditions, consumer confidence, and the broader investment appetite behind tourism, property, and lifestyle spending.\n\nThe key takeaway is that Bali may keep benefiting from a domestic economy that is still expanding even while global conditions remain noisy. Members should read this as a signal that demand resilience is still present, but execution quality and market positioning will decide who captures it.",
        source: "ANTARA News",
        date: "April 24, 2026",
        url: "https://en.antaranews.com/business"
      },
      {
        id: "news-business-2",
        region: "Indonesia",
        title: "Indonesia sees Q1 growth at or above 5.5 percent: minister",
        teaser: "The government is still presenting a strong first-quarter growth picture despite a mixed global environment.",
        content:
          "ANTARA reported that Indonesia expected first-quarter economic growth to land at or above 5.5 percent. That sets a useful context for BBC members because it suggests domestic spending and business confidence are holding up better than many investors feared at the start of the year.\n\nFor Bali, strong national growth can support occupancy, discretionary spending, and real estate absorption. It does not guarantee performance in every submarket, but it does keep the broader demand environment constructive.",
        source: "ANTARA News",
        date: "April 23, 2026",
        url: "https://en.antaranews.com/business"
      },
      {
        id: "news-business-3",
        region: "Indonesia",
        title: "RI's green energy projects attractive for foreign investors: minister",
        teaser: "Capital allocation is still looking for Indonesia opportunities, especially where long-term themes are clear.",
        content:
          "ANTARA reported that the government sees Indonesia's green energy projects as highly attractive to foreign investors. While this is not Bali-specific, it matters to BBC members because it signals continued external appetite for Indonesian projects that connect to long-term growth, sustainability, and infrastructure themes.\n\nFor founders, developers, and operators, this is also a reminder that international capital is still looking for well-structured narratives. The clearer the thesis and execution path, the easier it becomes to stand out.",
        source: "ANTARA News",
        date: "April 23, 2026",
        url: "https://en.antaranews.com/business"
      },
      {
        id: "news-business-4",
        region: "Indonesia",
        title: "Indonesia's investment grade remains secure: Deputy Finance Minister",
        teaser: "The sovereign-risk conversation still matters for how foreign capital prices Indonesia and Bali opportunities.",
        content:
          "ANTARA reported that Indonesia's investment grade remains secure, according to the Deputy Finance Minister. For Bali-facing investors and operators, that matters because country risk perception influences debt costs, investor confidence, and how easily international capital keeps flowing into the market.\n\nThis is not a day-to-day operating story, but it is an important background signal. Stable sovereign credibility helps maintain confidence in longer-duration projects, especially in real estate and hospitality.",
        source: "ANTARA News",
        date: "April 23, 2026",
        url: "https://en.antaranews.com/business"
      },
      {
        id: "news-business-5",
        region: "Indonesia",
        title: "Indonesia optimistic about achieving Rp497 T investment in Q1 2026",
        teaser: "The investment board is still signaling strong deployment momentum across the country.",
        content:
          "ANTARA reported that Indonesia remained optimistic about reaching Rp497 trillion in realized investment during the first quarter of 2026. The significance for BBC members is that capital formation is still moving, which tends to support business expansion, services demand, and project activity across sectors linked to Bali.\n\nFor investors and operators, strong national investment momentum is a useful confidence signal. It suggests that well-positioned projects can still attract attention even in a more selective environment.",
        source: "ANTARA News",
        date: "April 13, 2026",
        url: "https://en.antaranews.com/business"
      }
    ]
  },
  {
    title: "Tourism",
    icon: Newspaper,
    articles: [
      {
        id: "news-tourism-1",
        region: "Indonesia",
        title: "Ministry, Jasaraharja Putera strengthen tourism risk governance",
        teaser: "Risk management is becoming part of how the sector protects demand, credibility, and operational continuity.",
        content:
          "ANTARA reported that the Tourism Ministry and Jasaraharja Putera were strengthening tourism risk governance. For Bali businesses, this matters because insurance, safety planning, and destination readiness are no longer side issues; they are increasingly part of the sector's operating standard.\n\nMembers should read this as a signal that better risk processes are becoming a competitive advantage. Operators that manage guest safety and continuity well are likely to be more resilient and more attractive to partners.",
        source: "ANTARA News",
        date: "April 22, 2026",
        url: "https://en.antaranews.com"
      },
      {
        id: "news-tourism-2",
        region: "Indonesia",
        title: "Gov't provides up-to-down fiscal incentives to sustain tourism",
        teaser: "Travel affordability remains an active policy lever for keeping tourism demand resilient.",
        content:
          "ANTARA reported that the government was using fiscal incentives to help sustain tourism activity. For Bali-facing businesses, that matters because lower travel friction can support occupancy, restaurant traffic, retail spending, and overall visitor movement during softer periods.\n\nThe bigger signal is that tourism remains a strategic sector worth actively supporting. That gives operators a little more confidence when planning around demand volatility.",
        source: "ANTARA News",
        date: "April 17, 2026",
        url: "https://en.antaranews.com/news/412684/govt-provides-up-to-down-fiscal-incentives-to-sustain-tourism"
      },
      {
        id: "news-tourism-3",
        region: "Indonesia",
        title: "Indonesia shifts tourism focus to Asia and Oceania amid Middle East tensions",
        teaser: "Source-market strategy is changing, which may alter traveler mix and booking patterns.",
        content:
          "ANTARA reported that Indonesia was refocusing tourism promotion toward Asia and Oceania as tensions in the Middle East disrupted longer-haul patterns. For Bali businesses, that shift matters because different source markets often bring different booking windows, spending profiles, and stay durations.\n\nThe practical takeaway is simple: members should keep watching not just total demand, but demand composition. The traveler mix can change business performance faster than the headline arrival number alone.",
        source: "ANTARA News",
        date: "April 17, 2026",
        url: "https://en.antaranews.com/news/412669/homepage-v2.html"
      },
      {
        id: "news-tourism-4",
        region: "Bali",
        title: "Tourism Ministry moves to bolster Bali's accommodation governance",
        teaser: "Compliance, licensing, and standards are becoming more central to Bali's tourism environment.",
        content:
          "ANTARA reported that the Tourism Ministry was working to strengthen accommodation governance in Bali through better coordination and clearer regulatory discipline. For villa operators, hotel groups, and managers, this matters because operating quality and compliance increasingly shape long-term trust in the market.\n\nFor BBC members, the takeaway is that stronger governance can reward structured operators and create more friction for weak or non-compliant competition. That is worth tracking closely.",
        source: "ANTARA News",
        date: "April 11, 2026",
        url: "https://en.antaranews.com/amp/news/411959/tourism-ministry-moves-to-bolster-balis-accommodation-governance"
      },
      {
        id: "news-tourism-5",
        region: "Indonesia",
        title: "Indonesia focuses on wellness tourism to boost arrivals: Ministry",
        teaser: "Higher-quality visitor segments remain part of the national tourism growth strategy.",
        content:
          "ANTARA reported that Indonesia was leaning further into wellness tourism as a way to increase arrivals, raise spending quality, and widen job creation. For Bali, that matters because the island already has strong product-market fit for wellness-led travel.\n\nFor founders and operators, this is a useful signal that premium and experience-led positioning may keep gaining relevance. Businesses aligned with longer-stay, wellness, and lifestyle demand could benefit.",
        source: "ANTARA News",
        date: "April 11, 2026",
        url: "https://en.antaranews.com"
      }
    ]
  },
  {
    title: "Infrastructure",
    icon: MessagesSquare,
    articles: [
      {
        id: "news-infrastructure-1",
        region: "Indonesia",
        title: "Indonesia to spend Rp1,200 trillion on massive rail expansion to 2045",
        teaser: "Long-run transport investment keeps signaling how seriously the country is treating connectivity capacity.",
        content:
          "Reuters reported that Indonesia planned a huge long-term rail expansion program through 2045. While this is national rather than Bali-specific, it matters because transport ambition shapes investor confidence in logistics, regional access, and long-horizon economic development.\n\nMembers should see this as another sign that connectivity remains central to Indonesia's growth agenda. Infrastructure scale often influences where future commercial value pools emerge.",
        source: "Reuters",
        date: "April 23, 2026",
        url: "https://www.reuters.com/world/asia-pacific/indonesia-spend-rp1200-trillion-massive-rail-expansion-2045-2026-04-23/"
      },
      {
        id: "news-infrastructure-2",
        region: "Indonesia",
        title: "Indonesia's BRIN develops railway technologies to boost transport",
        teaser: "Domestic technology capability is increasingly part of the infrastructure story, not just construction spend.",
        content:
          "ANTARA reported that BRIN was developing railway technologies to support Indonesia's transport ambitions. That matters because infrastructure competitiveness is not only about budget size; it is also about technology, execution speed, and local capability.\n\nFor BBC members, this is another signal that infrastructure is becoming more sophisticated and system-led. Better delivery capacity can create stronger second-order effects across logistics, tourism, and real estate.",
        source: "ANTARA News",
        date: "April 23, 2026",
        url: "https://en.antaranews.com"
      },
      {
        id: "news-infrastructure-3",
        region: "Indonesia",
        title: "Indonesia plans national satellite consortium to cut foreign dependence",
        teaser: "Digital infrastructure resilience is moving higher on the strategic agenda.",
        content:
          "Reuters reported that Indonesia planned a national satellite consortium to reduce foreign dependence. For members building tech, operations, hospitality systems, or data-heavy businesses, digital infrastructure resilience matters more than it used to.\n\nThe practical takeaway is that infrastructure is no longer only roads and ports. Connectivity, redundancy, and communications capacity increasingly matter for how businesses operate and scale.",
        source: "Reuters",
        date: "April 23, 2026",
        url: "https://www.reuters.com/world/asia-pacific/indonesia-plans-national-satellite-consortium-cut-foreign-dependence-2026-04-23/"
      },
      {
        id: "news-infrastructure-4",
        region: "Indonesia",
        title: "Govt outlines strategy to expand digital infrastructure",
        teaser: "Digital build-out remains a live priority, and it affects how modern businesses reach customers and run operations.",
        content:
          "ANTARA reported that the government had outlined a strategy to widen Indonesia's digital infrastructure. For Bali founders and operators, that is relevant because better digital systems improve payments, marketing reach, data operations, and customer experience.\n\nThis is especially important for businesses serving mobile, international, or digitally native audiences. Better infrastructure can expand what is commercially possible.",
        source: "ANTARA News",
        date: "April 9, 2026",
        url: "https://en.antaranews.com"
      },
      {
        id: "news-infrastructure-5",
        region: "Bali",
        title: "Government pushes water taxi and pier development to support Bali tourism",
        teaser: "Transport connectivity remains a long-term factor behind which Bali areas gain or lose momentum.",
        content:
          "ANTARA reported that the Transportation Ministry was pushing water taxi and pier development to support Bali tourism. For the island, better sea connectivity could gradually ease movement friction, improve itinerary flow, and influence which areas become more attractive over time.\n\nFor investors, developers, and hospitality operators, this is exactly the kind of infrastructure signal that can change future location logic well before every project is finished.",
        source: "ANTARA News",
        date: "April 10, 2026",
        url: "https://en.antaranews.com/news/411837/govt-pushes-water-taxi-pier-development-to-support-balis-tourism"
      }
    ]
  },
  {
    title: "Policy",
    icon: MessagesSquare,
    articles: [
      {
        id: "news-policy-1",
        region: "Bali",
        title: "US praises Indonesian Immigration for arrest of murder suspect in Bali",
        teaser: "International cooperation and enforcement quality are staying visible in Bali's operating environment.",
        content:
          "ANTARA reported that the United States praised Indonesian Immigration after the arrest of a murder suspect in Bali. For BBC members, the significance is less about the individual case and more about the signal that cross-border enforcement capability is being watched closely.\n\nSecurity, compliance, and international cooperation all influence confidence in the Bali operating environment. That matters for tourism-facing businesses and internationally mobile communities alike.",
        source: "ANTARA News",
        date: "April 24, 2026",
        url: "https://en.antaranews.com"
      },
      {
        id: "news-policy-2",
        region: "Bali",
        title: "Ngurah Rai Immigration detains 10 foreigners in enforcement operation",
        teaser: "Oversight of foreigner compliance is staying active in Bali's main gateway market.",
        content:
          "ANTARA reported that Ngurah Rai Immigration detained 10 foreigners during an enforcement operation. For BBC members, this reinforces how visible compliance and immigration discipline remain in Bali.\n\nFor accommodation providers, agencies, and service operators, better reporting systems and cleaner documentation practices are becoming even more important to day-to-day operations.",
        source: "ANTARA News",
        date: "April 14, 2026",
        url: "https://en.antaranews.com"
      },
      {
        id: "news-policy-3",
        region: "Bali",
        title: "Bali police foil cocaine smuggling attempt linked to int'l network",
        teaser: "Policing and cross-border enforcement continue to shape the island's risk backdrop.",
        content:
          "ANTARA reported that Bali police had foiled a cocaine smuggling attempt tied to an international network. For the business community, stories like this matter because they reinforce why monitoring, security, and compliance standards remain central to Bali's international reputation.\n\nThe broader implication is that risk management is not theoretical. It remains part of the operating context for businesses serving global guests and foreign residents.",
        source: "ANTARA News",
        date: "April 14, 2026",
        url: "https://en.antaranews.com"
      },
      {
        id: "news-policy-4",
        region: "Bali",
        title: "Bali police foil ecstasy distribution attempt in South Kuta",
        teaser: "Local enforcement remains active in key tourism corridors around the island.",
        content:
          "ANTARA reported that police had disrupted an ecstasy distribution attempt in South Kuta. For BBC members, the story underlines that high-traffic tourism zones remain under close operational scrutiny.\n\nThe policy signal is that safety, monitoring, and compliance pressure are unlikely to fade. Businesses with strong operating discipline will be better positioned when enforcement attention increases.",
        source: "ANTARA News",
        date: "April 15, 2026",
        url: "https://en.antaranews.com"
      },
      {
        id: "news-policy-5",
        region: "Bali",
        title: "Bali tightens security after violent crimes linked to international groups",
        teaser: "Security and compliance are increasingly part of the operational context for tourism-facing businesses.",
        content:
          "The Jakarta Post reported that Bali had tightened security after violent crimes linked to international groups. Patrols increased in tourism zones and there were stronger expectations around reporting and oversight.\n\nFor BBC members, this is a practical operating issue as much as a public-safety story. Risk protocols, guest reporting, and internal controls are becoming more important for tourism-facing businesses.",
        source: "The Jakarta Post",
        date: "April 15, 2026",
        url: "https://www.thejakartapost.com/indonesia/2026/04/15/bali-tightens-security-after-violent-crimes-linked-to-international-groups.html"
      }
    ]
  }
] as const;

export const podcastTopics = ["All", "Property", "Investment", "Business", "Marketing"] as const;

export const podcastFeed = [
  {
    id: "x5iGqCEj1og",
    title: "Dubai vs Bali Property: Returns, Risks, and the truth",
    description: "A current BBC comparison of return profiles, downside risk, and how Dubai and Bali stack up for investors.",
    published: "8 hours ago",
    topic: "Investment",
    url: "https://www.youtube.com/watch?v=x5iGqCEj1og",
    image: "https://i.ytimg.com/vi/x5iGqCEj1og/hqdefault.jpg"
  },
  {
    id: "vyL_5E7htbo",
    title: "Membangun di Bali: Apa yang Perlu Diketahui Setiap Pengembang dan Investor",
    description: "A Bali construction conversation for developers and investors on what matters before you build.",
    published: "2 months ago",
    topic: "Property",
    url: "https://www.youtube.com/watch?v=vyL_5E7htbo",
    image: "https://i.ytimg.com/vi/vyL_5E7htbo/hqdefault.jpg"
  },
  {
    id: "PG2TFBF0uY8",
    title: "Unlocking Winning Talent: Insights from a Top Bali Head Hunter",
    description: "Hiring, leadership, and what strong companies in Bali look for as they scale.",
    published: "2 months ago",
    topic: "Business",
    url: "https://www.youtube.com/watch?v=PG2TFBF0uY8",
    image: "https://i.ytimg.com/vi/PG2TFBF0uY8/hqdefault.jpg"
  },
  {
    id: "Ayb4THzSjE0",
    title: "Bali Real Estate Market in 2026: What the Data Really Shows",
    description: "A data-first BBC episode unpacking what the market numbers really suggest for Bali real estate.",
    published: "3 months ago",
    topic: "Property",
    url: "https://www.youtube.com/watch?v=Ayb4THzSjE0",
    image: "https://i.ytimg.com/vi/Ayb4THzSjE0/hqdefault.jpg"
  },
  {
    id: "LkiYTQ1k0ss",
    title: "From marketing to brokering and development: Inside GEONETÃ¢â‚¬â„¢s Real Estate Machine",
    description: "An inside look at how marketing, brokerage, and development work together inside one Bali real estate platform.",
    published: "3 months ago",
    topic: "Property",
    url: "https://www.youtube.com/watch?v=LkiYTQ1k0ss",
    image: "https://i.ytimg.com/vi/LkiYTQ1k0ss/hqdefault.jpg"
  },
  {
    id: "4jIi_bXuUSU",
    title: "Inside The Kedungu Fund: 2025 Growth, Strategy & Results",
    description: "A fund update focused on growth, thesis validation, and what comes next for Kedungu.",
    published: "5 months ago",
    topic: "Investment",
    url: "https://www.youtube.com/watch?v=4jIi_bXuUSU",
    image: "https://i.ytimg.com/vi/4jIi_bXuUSU/hqdefault.jpg"
  },
  {
    id: "KScozjNYu9Q",
    title: "How Bali Business Founders Can Attract Investors from the Middle East",
    description: "Capital-raising lessons for founders building Bali-facing businesses and investor relationships.",
    published: "6 months ago",
    topic: "Business",
    url: "https://www.youtube.com/watch?v=KScozjNYu9Q",
    image: "https://i.ytimg.com/vi/KScozjNYu9Q/hqdefault.jpg"
  },
  {
    id: "UNaQQiIjoCk",
    title: "Bali Property Made Simple: The 9-Step Process Explained",
    description: "A clear walkthrough of the property acquisition journey from first look to closing.",
    published: "7 months ago",
    topic: "Property",
    url: "https://www.youtube.com/watch?v=UNaQQiIjoCk",
    image: "https://i.ytimg.com/vi/UNaQQiIjoCk/hqdefault.jpg"
  },
  {
    id: "0cMjvf1lb3g",
    title: "How to Sell Out Your Property Development in a Day: The Future of Off-Plan Sales",
    description: "A sales and launch conversation around positioning, demand, and off-plan momentum.",
    published: "8 months ago",
    topic: "Marketing",
    url: "https://www.youtube.com/watch?v=0cMjvf1lb3g",
    image: "https://i.ytimg.com/vi/0cMjvf1lb3g/hqdefault.jpg"
  },
  {
    id: "yxJwNl3n3t4",
    title: "The Kedungu FundÃ¢â‚¬â„¢s $10M Milestone: A Look Ahead",
    description: "A milestone review focused on fund growth, thesis validation, and the next phase.",
    published: "9 months ago",
    topic: "Investment",
    url: "https://www.youtube.com/watch?v=yxJwNl3n3t4",
    image: "https://i.ytimg.com/vi/yxJwNl3n3t4/hqdefault.jpg"
  },
  {
    id: "bfHu20vi2g8",
    title: "Bali Property: Off-Plan Buyer Checklist (Avoid These Common Mistakes)",
    description: "A practical checklist episode for buyers evaluating off-plan opportunities in Bali.",
    published: "11 months ago",
    topic: "Property",
    url: "https://www.youtube.com/watch?v=bfHu20vi2g8",
    image: "https://i.ytimg.com/vi/bfHu20vi2g8/hqdefault.jpg"
  },
  {
    id: "G1lT0E2nSGQ",
    title: "The Secret Growth Formula Content Creators Must Know!",
    description: "A BBC episode on distribution, audience-building, and creator-led business growth.",
    published: "1 year ago",
    topic: "Marketing",
    url: "https://www.youtube.com/watch?v=G1lT0E2nSGQ",
    image: "https://i.ytimg.com/vi/G1lT0E2nSGQ/hqdefault.jpg"
  },
  {
    id: "7bXHvn8Vksw",
    title: "Bali Real Estate: Triple Your Investment In 3 Years!",
    description: "A high-conviction discussion around upside potential, timing, and market selection.",
    published: "1 year ago",
    topic: "Investment",
    url: "https://www.youtube.com/watch?v=7bXHvn8Vksw",
    image: "https://i.ytimg.com/vi/7bXHvn8Vksw/hqdefault.jpg"
  },
  {
    id: "9LNXudhoxO0",
    title: "When Is the BEST Time to Invest in Bali? ROI Cycles Explained!",
    description: "Timing, cycle awareness, and how investors can interpret momentum in Bali.",
    published: "1 year ago",
    topic: "Investment",
    url: "https://www.youtube.com/watch?v=9LNXudhoxO0",
    image: "https://i.ytimg.com/vi/9LNXudhoxO0/hqdefault.jpg"
  },
  {
    id: "fGuiCmtcOKo",
    title: "Short-Term Rentals in Crisis: Why You Should Opt For Long-Term",
    description: "An episode exploring rental strategy choices and how operators should think about demand shifts.",
    published: "1 year ago",
    topic: "Property",
    url: "https://www.youtube.com/watch?v=fGuiCmtcOKo",
    image: "https://i.ytimg.com/vi/fGuiCmtcOKo/hqdefault.jpg"
  },
  {
    id: "SPFp95YSETE",
    title: "Beware! Why We NEVER Invest in Uluwatu!",
    description: "A strong viewpoint on location risk, execution quality, and what to avoid in property investing.",
    published: "1 year ago",
    topic: "Investment",
    url: "https://www.youtube.com/watch?v=SPFp95YSETE",
    image: "https://i.ytimg.com/vi/SPFp95YSETE/hqdefault.jpg"
  },
  {
    id: "jh_Ejqlc40g",
    title: "The Kedungu Fund: All the Answers",
    description: "A detailed Q&A style episode covering the fund's structure, rationale, and opportunity set.",
    published: "1 year ago",
    topic: "Investment",
    url: "https://www.youtube.com/watch?v=jh_Ejqlc40g",
    image: "https://i.ytimg.com/vi/jh_Ejqlc40g/hqdefault.jpg"
  },
  {
    id: "qDP46lfSpaI",
    title: "How To Sell More, Marketing Funnels: How And Why They Work",
    description: "A funnel-focused episode for brands and operators who want clearer conversion systems.",
    published: "1 year ago",
    topic: "Marketing",
    url: "https://www.youtube.com/watch?v=qDP46lfSpaI",
    image: "https://i.ytimg.com/vi/qDP46lfSpaI/hqdefault.jpg"
  },
  {
    id: "CfgZ7lqMhS8",
    title: "Bali Beach Glamping : The Journey to success",
    description: "A founder story about product-market fit, hospitality experience, and operating execution.",
    published: "1 year ago",
    topic: "Business",
    url: "https://www.youtube.com/watch?v=CfgZ7lqMhS8",
    image: "https://i.ytimg.com/vi/CfgZ7lqMhS8/hqdefault.jpg"
  },
  {
    id: "DHIQD-7YkTo",
    title: "Stop! 7 Key Tips to Know Before Buying a Bali Property",
    description: "A practical buyer's guide to avoiding common mistakes before entering the market.",
    published: "1 year ago",
    topic: "Property",
    url: "https://www.youtube.com/watch?v=DHIQD-7YkTo",
    image: "https://i.ytimg.com/vi/DHIQD-7YkTo/hqdefault.jpg"
  },
  {
    id: "oFFzcP9m-14",
    title: "Pioneer Investing: The 3 Golden Rules",
    description: "A BBC framework for identifying emerging opportunities before the crowd arrives.",
    published: "1 year ago",
    topic: "Investment",
    url: "https://www.youtube.com/watch?v=oFFzcP9m-14",
    image: "https://i.ytimg.com/vi/oFFzcP9m-14/hqdefault.jpg"
  },
  {
    id: "A-8XYkc3hCA",
    title: "Bali Leasehold vs. Freehold! The Ultimate Guide to the Hows, Whats and Whys!",
    description: "A core BBC episode covering ownership structures and why they matter so much in Bali.",
    published: "1 year ago",
    topic: "Property",
    url: "https://www.youtube.com/watch?v=A-8XYkc3hCA",
    image: "https://i.ytimg.com/vi/A-8XYkc3hCA/hqdefault.jpg"
  },
  {
    id: "BhrlhfO1hz4",
    title: "A Fashion Success Story: Paul Ropp and Biasa Group",
    description: "A founder-led business story on brand-building, staying power, and regional growth.",
    published: "1 year ago",
    topic: "Business",
    url: "https://www.youtube.com/watch?v=BhrlhfO1hz4",
    image: "https://i.ytimg.com/vi/BhrlhfO1hz4/hqdefault.jpg"
  },
  {
    id: "E1FguH5Op68",
    title: "Killer Tips for Investors: Leasehold Extensions in Bali",
    description: "A focused investor episode on extension mechanics, negotiation risk, and legal diligence.",
    published: "1 year ago",
    topic: "Property",
    url: "https://www.youtube.com/watch?v=E1FguH5Op68",
    image: "https://i.ytimg.com/vi/E1FguH5Op68/hqdefault.jpg"
  },
  {
    id: "aiHuohwGnrU",
    title: "Building in Bali? Top Architect and Project Manager Insights",
    description: "A construction-focused conversation around design, execution, and project delivery realities.",
    published: "1 year ago",
    topic: "Property",
    url: "https://www.youtube.com/watch?v=aiHuohwGnrU",
    image: "https://i.ytimg.com/vi/aiHuohwGnrU/hqdefault.jpg"
  },
  {
    id: "nKp94xADWdM",
    title: "Notary's insights: Bali Real Estate Explained",
    description: "A BBC episode unpacking legal structure, transaction flow, and what notaries see most often in Bali deals.",
    published: "1 year ago",
    topic: "Property",
    url: "https://www.youtube.com/watch?v=nKp94xADWdM",
    image: "https://i.ytimg.com/vi/nKp94xADWdM/hqdefault.jpg"
  },
  {
    id: "_viN8MqKMcQ",
    title: "Real Estate: How to 9x your investment and other Bali property tips",
    description: "A high-upside property episode on strategy, leverage points, and practical Bali investing lessons.",
    published: "1 year ago",
    topic: "Investment",
    url: "https://www.youtube.com/watch?v=_viN8MqKMcQ",
    image: "https://i.ytimg.com/vi/_viN8MqKMcQ/hqdefault.jpg"
  }
] as const;

export const resourceDocuments = [
  {
    id: "ebook-bbc-real-estate-investing-bali",
    section: "Ebooks",
    title: "Comprehensive Guide to Real Estate Investing in Bali",
    source: "Bali Business Club",
    url: "/resources/ebooks/bbc-comprehensive-guide-real-estate-investing-bali.pdf",
    note: "BBC ebook"
  },
  {
    id: "ebook-bbc-why-location-is-everything",
    section: "Ebooks",
    title: "Why Location Is Everything",
    source: "Bali Business Club",
    url: "/resources/ebooks/bbc-ebook-why-location-is-everything.pdf",
    note: "BBC ebook"
  },
  {
    id: "ebook-bbc-dubai-based-entrepreneurs-and-investors",
    section: "Ebooks",
    title: "Dubai-Based Entrepreneurs and Investors",
    source: "Bali Business Club",
    url: "/resources/ebooks/bbc-ebook-dubai-based-entrepreneurs-and-investors.pdf",
    note: "BBC ebook"
  },
  {
    id: "ebook-bbc-escape-to-bali",
    section: "Ebooks",
    title: "Escape to Bali - A Guide to a Better Life",
    source: "Bali Business Club",
    url: "/resources/ebooks/bbc-ebook-escape-to-bali-a-guide-to-a-better-life.pdf",
    note: "BBC ebook"
  },
  {
    id: "report-analytical-review-bali-villas",
    section: "Reports",
    title: "Analytical Review Bali Villas 07 2025",
    source: "Mirra Centre",
    url: "/resources/reports/analytical-review-bali-villas-07-2025.pdf",
    note: "Villa construction market report"
  },
  {
    id: "report-doing-business-indonesia-2025",
    section: "Reports",
    title: "An Introduction to Doing Business in Indonesia 2025",
    source: "Business Guide",
    url: "/resources/reports/introduction-to-doing-business-in-indonesia-2025.pdf",
    note: "Indonesia business guide"
  },
  {
    id: "report-bali-market-report-2025",
    section: "Reports",
    title: "Bali Market Report 2025 - Update February 2026",
    source: "Betterplace",
    url: "/resources/reports/bali-market-report-2025-upd-feb-2026.pdf",
    note: "Bali market overview and outlook"
  },
  {
    id: "report-bali-villa-rental-comparative-analysis",
    section: "Reports",
    title: "Bali Villa Rental Market - Comparative Analysis 01 25",
    source: "Comparative Analysis",
    url: "/resources/reports/bali-villa-rental-market-comparative-analysis-01-25.pdf",
    note: "Villa rental comparison report"
  },
  {
    id: "report-colliers-bali-apartment-h2-2025",
    section: "Reports",
    title: "Colliers Quarterly Bali Apartment H2 2025",
    source: "Colliers",
    url: "/resources/reports/h2-2025-colliers-quarterly-bali-apartment.pdf",
    note: "Apartment market report"
  },
  {
    id: "report-colliers-bali-hotel-h2-2025",
    section: "Reports",
    title: "Colliers Quarterly Bali Hotel H2 2025",
    source: "Colliers",
    url: "/resources/reports/h2-2025-colliers-quarterly-bali-hotel.pdf",
    note: "Hotel market report"
  },
  {
    id: "report-colliers-bali-retail-h2-2025",
    section: "Reports",
    title: "Colliers Quarterly Bali Retail H2 2025",
    source: "Colliers",
    url: "/resources/reports/h2-2025-colliers-quarterly-bali-retail.pdf",
    note: "Retail market report"
  },
  {
    id: "report-bali-hotel-branded-residences-2026",
    section: "Reports",
    title: "Bali Hotel Branded Residences 2026",
    source: "Horwath HTL",
    url: "/resources/reports/bali-hotel-branded-residences-2026.pdf",
    note: "Branded residences report"
  },
  {
    id: "report-colliers-bali-hotel-q3-2025",
    section: "Reports",
    title: "Colliers Quarterly Bali Hotel Q3 2025",
    source: "Colliers",
    url: "/resources/reports/q3-2025-colliers-quarterly-bali-hotel.pdf",
    note: "Hotel quarter report"
  },
  {
    id: "report-the-wealth-report-2025",
    section: "Reports",
    title: "The Wealth Report 2025",
    source: "Knight Frank",
    url: "/resources/reports/the-wealth-report-2025.pdf",
    note: "Global wealth and property trends"
  }
] as const;

export const partnerBenefits = [
  {
    name: "Voxpop Studio",
    category: "Recording Studio",
    offer: "10% off podcast studio online booking with code BBCMEMBER",
    button: "BOOK ONLINE",
    url: "https://voxpopbali.com/",
    logo: "/partners/voxpop-studio-white.png"
  },
  {
    name: "Legal Legends Indonesia",
    category: "Visa Agency",
    offer: "5% discount for an admission, visa, KITAS, and PT PMA creation",
    button: "CONTACT",
    url: "https://legallegendsindonesia.com/contact-us/",
    logo: "/partners/legal-legends-indonesia-white.png"
  },
  {
    name: "Bali Accounting Legends",
    category: "Accounting Agency",
    offer: "5% discount on consulting",
    button: "CONTACT",
    url: "https://wa.me/6281239091087",
    logo: "/partners/bali-accounting-legends-white.png"
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
    id: "fav-oFFzcP9m-14",
    type: "Podcast",
    title: "Bali Leasehold vs. Freehold! The Ultimate Guide to the Hows, Whats and Whys!",
    note: "Saved for ownership structure review.",
    sourceId: "oFFzcP9m-14"
  },
  {
    id: "fav-ebook-bbc-real-estate-investing-bali",
    type: "Ressource",
    title: "Comprehensive Guide to Real Estate Investing in Bali",
    note: "Saved BBC ebook.",
    sourceId: "ebook-bbc-real-estate-investing-bali"
  }
] as const;

export const dashboardUsers = [
  {
    name: "Made Prasetya",
    email: "made@balibusinessclub.com",
    phone: "+62 812 3456 7890",
    membership: "Founding Member",
    joined: "2026-01-12",
    ageRange: "25-34"
  },
  {
    name: "Sarah Collins",
    email: "sarah@balibusinessclub.com",
    phone: "+61 402 118 900",
    membership: "Investor",
    joined: "2026-02-03",
    ageRange: "35-44"
  },
  {
    name: "Julien Moreau",
    email: "julien@balibusinessclub.com",
    phone: "+33 6 12 34 56 78",
    membership: "Operator",
    joined: "2026-02-18",
    ageRange: "35-44"
  }
] as const;

export const adminAnalyticsCards = [
  { value: "31", label: "People online", detail: "Active members in the dashboard right now." },
  { value: "25-34", label: "Top age range", detail: "Largest active audience segment this week." },
  { value: "Market Insights", label: "Most visited page", detail: "Highest traffic destination in the member dashboard." },
  { value: "18 min", label: "Average session", detail: "Average time spent per active member session." },
  { value: "42%", label: "Returning users", detail: "Members who came back more than once this week." },
  { value: "67", label: "Saved items", detail: "Favorites added across articles, podcasts, and resources." }
] as const;

export const adminAnalyticsCharts = {
  pageVisits: [
    { label: "Market", value: 72 },
    { label: "News", value: 58 },
    { label: "Podcasts", value: 41 },
    { label: "Resources", value: 36 },
    { label: "Partners", value: 19 }
  ],
  ageRanges: [
    { label: "18-24", value: 12 },
    { label: "25-34", value: 38 },
    { label: "35-44", value: 29 },
    { label: "45-54", value: 14 },
    { label: "55+", value: 7 }
  ]
} as const;

export const adminMessages = [
  {
    id: "msg-partner-1",
    type: "Partnerships",
    name: "Arkana Villas",
    email: "hello@arkanavillas.com",
    whatsapp: "+62 812 9988 2211",
    subject: "Partner application",
    message: "We would like to offer a preferred management package for BBC members and discuss a formal partner feature.",
    date: "April 20, 2026",
    status: "inbox"
  },
  {
    id: "msg-contact-1",
    type: "Contacting us",
    name: "James Walker",
    email: "james@walkeradvisory.com",
    whatsapp: "+61 401 884 552",
    subject: "Membership question",
    message: "Can someone from the team explain how founder memberships differ from investor memberships?",
    date: "April 19, 2026",
    status: "inbox"
  },
  {
    id: "msg-recommendation-1",
    type: "Recommendations",
    name: "Dina Hartono",
    email: "dina@private.example",
    whatsapp: "+62 811 9000 441",
    subject: "Podcast recommendation",
    message: "A deep dive on villa management performance in Kedungu would be a great future episode topic.",
    date: "April 18, 2026",
    status: "inbox"
  }
] as const;

export const adminSettings = [
  { label: "Hourly news refresh", value: "Active" },
  { label: "Podcast auto-sync", value: "Active" },
  { label: "Email verification required", value: "Active" },
  { label: "Admin code login", value: "Enabled" }
] as const;

export const baliEvents = [
  {
    id: "event-biamc-workshop",
    title: "Workshop Construction & Engineering Arbitration #1",
    category: "Business",
    date: "April 24, 2026 Â· 10:00 AM",
    location: "Jalan Cemara, Denpasar Selatan",
    description: "A full-day workshop focused on construction and engineering arbitration with BIAMC speakers and networking.",
    signupUrl: "https://www.eventbrite.com/e/workshop-construction-engineering-arbitration-1-tickets-1986393521495",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Eventbrite",
    status: "approved"
  },
  {
    id: "event-awakened-dreamers",
    title: "Awakened Dreamers - Bohemian Blossom at The Jungle Club",
    category: "Music & Culture",
    date: "April 25, 2026 Â· 5:00 PM",
    location: "The Jungle Club, Ubud",
    description: "Season opening live set with Pippi Ciez and a Bali community crowd gathering at The Jungle Club.",
    signupUrl: "https://www.eventbrite.com/e/awakened-dreamers-bohemian-blossom-pippi-ciez-live-at-the-jungle-club-tickets-1985884964387?aff=erelexpmlt",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Eventbrite",
    status: "approved"
  },
  {
    id: "event-fht-bali",
    title: "FHT Bali - Food, Hotel & Tourism Bali 2026",
    category: "Networking",
    date: "April 28, 2026 Â· 8:30 AM",
    location: "Bali Nusa Dua Convention Center",
    description: "A large-format hospitality and tourism exhibition bringing together suppliers, operators, and investors.",
    signupUrl: "https://allevents.in/nusa-dua/fht-bali-food-hotel-and-tourism-bali-2026/3700027815332305",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "AllEvents",
    status: "approved"
  },
  {
    id: "event-festival-semarapura",
    title: "Festival Semarapura",
    category: "Music & Culture",
    date: "April 28, 2026 Â· 6:00 PM",
    location: "Klungkung, Bali",
    description: "A regional cultural festival with performances, local food, and community programming in Klungkung.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-bali-spirit-festival",
    title: "BaliSpirit Festival 2026",
    category: "Wellness & Sport",
    date: "May 6, 2026 Â· 9:00 AM",
    location: "Ubud, Bali",
    description: "One of Bali's best-known wellness festivals, blending yoga, movement, music, and conscious community experiences.",
    signupUrl: "https://www.balispiritfestival.com/",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "BaliSpirit Festival",
    status: "approved"
  },
  {
    id: "event-btr-ultra",
    title: "BTR Ultra 2026",
    category: "Wellness & Sport",
    date: "May 9, 2026 Â· 5:30 AM",
    location: "Kintamani, Bali",
    description: "A mountain ultra-running weekend bringing endurance athletes to Bali's volcanic highlands.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-ubud-food-festival",
    title: "Ubud Food Festival 2026",
    category: "Networking",
    date: "May 29, 2026 Â· 10:00 AM",
    location: "Ubud, Bali",
    description: "A culinary festival with chef talks, tastings, and hospitality networking across Ubud.",
    signupUrl: "https://www.ubudfoodfestival.com/",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Ubud Food Festival",
    status: "approved"
  },
  {
    id: "event-bbtf",
    title: "Bali & Beyond Travel Fair 2026",
    category: "Business",
    date: "June 10, 2026 Â· 9:00 AM",
    location: "Nusa Dua, Bali",
    description: "A travel trade event focused on tourism partnerships, regional marketing, and destination business.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-pesta-kesenian-bali",
    title: "Pesta Kesenian Bali 2026",
    category: "Music & Culture",
    date: "June 18, 2026 Â· 7:00 PM",
    location: "Denpasar Art Centre",
    description: "Bali's landmark arts festival featuring performances, exhibitions, and island-wide cultural showcases.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-gianyar-kite-festival",
    title: "Gianyar Kite Festival 2026",
    category: "Music & Culture",
    date: "June 20, 2026 Â· 1:00 PM",
    location: "Gianyar, Bali",
    description: "A classic dry-season Bali event celebrating giant traditional kites, crews, and community spirit.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-balinale",
    title: "Balinale 2026",
    category: "Music & Culture",
    date: "June 24, 2026 Â· 6:30 PM",
    location: "Denpasar, Bali",
    description: "Bali's international film festival with screenings, filmmaker conversations, and creative-industry networking.",
    signupUrl: "https://www.balinale.com/",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Balinale",
    status: "approved"
  },
  {
    id: "event-bali-wellness-expo",
    title: "Bali Wellness and Beauty Expo 2026",
    category: "Business",
    date: "June 26, 2026 Â· 10:00 AM",
    location: "Denpasar, Bali",
    description: "A consumer and trade expo for wellness, beauty, and lifestyle brands operating in Bali.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-ubud-open-studios",
    title: "Ubud Open Studios 2026",
    category: "Music & Culture",
    date: "June 27, 2026 Â· 11:00 AM",
    location: "Ubud, Bali",
    description: "A creative open-house program connecting artists, studios, collectors, and culture-minded visitors.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-tenganan-festival",
    title: "Tenganan Pegringsingan Festival 2026",
    category: "Music & Culture",
    date: "June 27, 2026 Â· 9:30 AM",
    location: "Tenganan Village, Karangasem",
    description: "A village festival spotlighting Bali Aga traditions, weaving heritage, and ritual performances.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-bali-international-choir",
    title: "Bali International Choir Festival 2026",
    category: "Music & Culture",
    date: "July 27, 2026 Â· 5:00 PM",
    location: "Denpasar, Bali",
    description: "An international choir gathering with performances, workshops, and collaborative cultural programming.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-semarak-pandawa",
    title: "Semarak Pandawa Festival 2026",
    category: "Music & Culture",
    date: "July 30, 2026 Â· 4:00 PM",
    location: "Pandawa Beach, Bali",
    description: "A beachfront festival centered on live performances, destination promotion, and local community showcases.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-ubud-village-jazz",
    title: "Ubud Village Jazz Festival 2026",
    category: "Music & Culture",
    date: "August 1, 2026 Â· 6:00 PM",
    location: "Ubud, Bali",
    description: "An annual jazz event that blends high-quality live music with the intimate Ubud arts atmosphere.",
    signupUrl: "https://www.ubudvillagejazzfestival.com/",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Ubud Village Jazz Festival",
    status: "approved"
  },
  {
    id: "event-buleleng-festival",
    title: "Buleleng Festival 2026",
    category: "Music & Culture",
    date: "August 18, 2026 Â· 5:30 PM",
    location: "Singaraja, North Bali",
    description: "A regional showcase for arts, culture, and local enterprise in North Bali.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-tanah-lot-art-food",
    title: "Tanah Lot Art and Food Festival 2026",
    category: "Music & Culture",
    date: "August 26, 2026 Â· 4:00 PM",
    location: "Tanah Lot, Tabanan",
    description: "A destination festival combining culinary stalls, local creators, and performances around Tanah Lot.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-karangasem-festival",
    title: "Karangasem Festival 2026",
    category: "Music & Culture",
    date: "August 27, 2026 Â· 6:00 PM",
    location: "Karangasem, Bali",
    description: "A broad regional festival highlighting Karangasem's culture, music, and creative community.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-maybank-marathon",
    title: "Maybank Marathon Bali 2026",
    category: "Wellness & Sport",
    date: "August 30, 2026 Â· 5:15 AM",
    location: "Gianyar, Bali",
    description: "Bali's marquee road-running event, attracting local and international runners across multiple distances.",
    signupUrl: "https://maybankmarathon.com/",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Maybank Marathon",
    status: "approved"
  },
  {
    id: "event-mekotek-festival",
    title: "Mekotek Festival 2026",
    category: "Music & Culture",
    date: "September 12, 2026 Â· 10:00 AM",
    location: "Munggu, Mengwi",
    description: "A powerful ritual tradition in Bali featuring dramatic community processions and ceremonial bamboo poles.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-penglipuran-festival",
    title: "Penglipuran Village Festival 2026",
    category: "Music & Culture",
    date: "September 18, 2026 Â· 9:00 AM",
    location: "Penglipuran Village, Bangli",
    description: "A village-led festival focused on sustainability, traditional architecture, and local cultural life.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-lovina-festival",
    title: "Lovina Festival 2026",
    category: "Music & Culture",
    date: "October 23, 2026 Â· 5:00 PM",
    location: "Lovina, North Bali",
    description: "A coastal North Bali festival that blends local culture, performances, and tourism activation.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-festival-bali-jani",
    title: "Festival Bali Jani 2026",
    category: "Music & Culture",
    date: "October 24, 2026 Â· 7:00 PM",
    location: "Denpasar, Bali",
    description: "A contemporary arts program dedicated to modern Balinese creativity across disciplines and venues.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-jatiluwih-festival",
    title: "Jatiluwih Festival 2026",
    category: "Music & Culture",
    date: "October 31, 2026 Â· 10:00 AM",
    location: "Jatiluwih, Tabanan",
    description: "A destination festival set around Bali's iconic rice terraces with culture, food, and local experiences.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  },
  {
    id: "event-denpasar-festival",
    title: "Denpasar Festival 2026",
    category: "Music & Culture",
    date: "December 22, 2026 Â· 6:00 PM",
    location: "Denpasar, Bali",
    description: "An end-of-year city festival highlighting food, art, performances, and the creative pulse of Denpasar.",
    signupUrl: "https://bali.live/p/the-bali-authorities-released-the-calendar-of-events-for-2026",
    whatsappUrl: "https://wa.link/zg5xw8",
    source: "Bali.live calendar",
    status: "approved"
  }
] as const;

export const socials = [
  {
    name: "YouTube",
    handle: "@BaliBusinessClub",
    url: "https://youtube.com/@BaliBusinessClub?sub_confirmation=1",
    icon: "youtube"
  },
  {
    name: "Spotify",
    handle: "Bali Business Club",
    url: "https://open.spotify.com/show/3fKJEwQXsQwR7TaFrl1d1b?si=48e00d7b104544e4",
    icon: "spotify"
  },
  {
    name: "Instagram",
    handle: "@bali.business.club",
    url: "https://www.instagram.com/bali.business.club/",
    icon: "instagram"
  },
  {
    name: "Facebook",
    handle: "Balibizclub",
    url: "https://www.facebook.com/Balibizclub/",
    icon: "facebook"
  },
  {
    name: "TikTok",
    handle: "@balibusinessclub",
    url: "https://www.tiktok.com/@balibusinessclub",
    icon: "tiktok"
  }
] as const;

export const instagramPanels = [
  {
    title: "12K followers",
    copy: "Our public Instagram profile currently shows 12K followers and 118 posts. Use it as the quickest way to see the newest BBC content.",
    url: "https://www.instagram.com/bali.business.club/"
  },
  {
    title: "118 posts",
    copy: "Open the BBC Instagram profile to browse the latest reels, podcast clips, and community highlights directly from the source feed.",
    url: "https://www.instagram.com/bali.business.club/"
  },
  {
    title: "Open the live profile",
    copy: "Instagram limits reliable public post extraction here, so this card takes members straight to the live profile where the latest posts always stay current.",
    url: "https://www.instagram.com/bali.business.club/"
  }
] as const;
