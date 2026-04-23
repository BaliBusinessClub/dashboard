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
        region: "Indonesia",
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
        region: "Indonesia",
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
        region: "Bali",
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
        region: "Bali",
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
        region: "Indonesia",
        title: "Fiscal support is being used to sustain tourism demand",
        teaser: "Travel affordability remains a live policy lever for keeping visitor numbers resilient.",
        content:
          "ANTARA reported that Indonesia is using fiscal tools, including support around airfare-related costs, to help sustain tourism. This matters because the government is clearly treating travel affordability as something that can materially influence tourism demand.\n\nFor Bali-facing businesses, policy support does not remove volatility, but it does signal that demand-side resilience is a national concern. If affordability remains a policy priority, businesses may find more stability in visitor flow than they would in a fully hands-off environment, particularly during periods of broader travel cost pressure.",
        source: "ANTARA News",
        date: "April 17, 2026",
        url: "https://en.antaranews.com/news/412684/govt-provides-up-to-down-fiscal-incentives-to-sustain-tourism"
      }
    ]
  },
  {
    title: "Infrastructure",
    icon: MessagesSquare,
    articles: [
      {
        id: "news-infrastructure-1",
        title: "Government pushes water taxi and pier development to support Bali tourism",
        teaser: "Transport connectivity is becoming a more visible part of Baliâ€™s long-term visitor experience and location logic.",
        content:
          "ANTARA reported that the Transportation Ministry is accelerating work on water taxi and pier development in Bali. While these projects take time to materialize, they matter because they can gradually reshape how visitors move across the island and how congestion-heavy corridors are perceived.\n\nFor investors, developers, and hospitality operators, connectivity has strategic value. Improved movement between air, land, and sea transport can shift where demand strengthens next, particularly in areas that become easier to reach or better integrated into tourist itineraries.",
        source: "ANTARA News",
        date: "April 10, 2026",
        url: "https://en.antaranews.com/amp/news/411837/govt-pushes-water-taxi-pier-development-to-support-balis-tourism"
      },
      {
        id: "news-infrastructure-2",
        title: "Ticket discounts help cushion Baliâ€™s tourism low season",
        teaser: "Transport pricing support is feeding directly into retail optimism and travel resilience in Bali.",
        content:
          "ANTARA reported that Bank Indonesiaâ€™s Bali office sees transportation ticket discounts as a meaningful buffer during Baliâ€™s low season. The signal here is bigger than airfare: mobility cost is a real lever for keeping travel demand active, especially in softer seasonal periods.\n\nFor business owners, that matters because lower friction on travel can support occupancy, footfall, and consumer spending in periods that would otherwise be more vulnerable. It is another reminder that tourism performance is tied not just to destination appeal, but also to how affordable and easy Bali is to access.",
        source: "ANTARA News",
        date: "March 14, 2026",
        url: "https://en.antaranews.com/news/408422/homepage-v2.html"
      }
    ]
  },
  {
    title: "Policy",
    icon: MessagesSquare,
    articles: [
      {
        id: "news-policy-1",
        region: "Indonesia",
        title: "Indonesia shifts tourism focus to Asia and Oceania amid Middle East tensions",
        teaser: "Source-market strategy is changing, which may alter the visitor mix many Bali businesses depend on.",
        content:
          "ANTARA reported that Indonesia is refocusing tourism promotion toward Asia and Oceania as geopolitical tensions disrupt longer-haul travel patterns. For Bali businesses, this could influence the composition of visitors more than total demand alone.\n\nA stronger emphasis on shorter-haul markets may change booking windows, price sensitivity, length of stay, and the kinds of products that perform best. Operators who understand changing traveler profiles will likely adapt faster than those relying on one familiar international audience.",
        source: "ANTARA News",
        date: "April 17, 2026",
        url: "https://en.antaranews.com/news/412669/homepage-v2.html"
      },
      {
        id: "news-policy-2",
        region: "Bali",
        title: "Bali tightens security after violent crimes linked to international groups",
        teaser: "Security and compliance are increasingly part of the operational context for tourism-facing businesses.",
        content:
          "The Jakarta Post reported that Bali has tightened security measures after a series of violent crimes linked to international groups. Patrols have been increased in core tourism areas, and accommodation providers face stronger expectations around guest reporting and foreigner oversight.\n\nFor BBC members, this is a practical operating issue as much as a public-safety story. Compliance, reporting systems, and risk protocols are becoming more important for accommodation businesses and service operators, especially those dealing with international guests at scale.",
        source: "The Jakarta Post",
        date: "April 15, 2026",
        url: "https://www.thejakartapost.com/indonesia/2026/04/15/bali-tightens-security-after-violent-crimes-linked-to-international-groups.html"
      },
      {
        id: "news-policy-3",
        region: "Indonesia",
        title: "New circular sets safety protocols for the 2026 Eid holiday season",
        teaser: "Government is leaning into destination readiness, service standards, and safety discipline before major travel peaks.",
        content:
          "ANTARA reported that the Tourism Ministry has issued a new circular covering safety and service expectations for the 2026 Eid holiday period. The focus includes readiness, cleanliness, health, and environmental standards across tourism destinations.\n\nThe underlying signal is that destination management and risk readiness are staying high on the policy agenda. Businesses that can demonstrate strong operating standards are likely to be better positioned as public-sector expectations keep rising.",
        source: "ANTARA News",
        date: "March 15, 2026",
        url: "https://en.antaranews.com/amp/news/408550/new-circular-sets-safety-protocols-for-2026-eid-holiday-season"
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
    title: "From marketing to brokering and development: Inside GEONETâ€™s Real Estate Machine",
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
    title: "The Kedungu Fundâ€™s $10M Milestone: A Look Ahead",
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
    offer: "10% off podcast studio online booking with code BBCMEMBER",
    button: "BOOK ONLINE",
    url: "https://voxpopbali.com/",
    logo: "/partners/voxpop-studio-white.png"
  },
  {
    name: "Legal Legends Indonesia",
    offer: "5% on visa, KITAS, and PT PMA creation",
    button: "CONTACT",
    url: "https://legallegendsindonesia.com/contact-us/",
    logo: "/partners/legal-legends-indonesia-white.png"
  },
  {
    name: "Bali Accounting Legends",
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
    date: "April 24, 2026 · 10:00 AM",
    location: "Jalan Cemara, Denpasar Selatan",
    description: "A full-day workshop focused on construction and engineering arbitration with BIAMC speakers and networking.",
    signupUrl: "https://www.eventbrite.com/e/workshop-construction-engineering-arbitration-1-tickets-1986393521495",
    source: "Eventbrite",
    status: "approved"
  },
  {
    id: "event-awakened-dreamers",
    title: "Awakened Dreamers - Bohemian Blossom at The Jungle Club",
    category: "Music & Culture",
    date: "April 25, 2026 · 5:00 PM",
    location: "The Jungle Club Ubud",
    description: "Season opening live set with Pippi Ciez and a Bali community crowd gathering at The Jungle Club.",
    signupUrl: "https://www.eventbrite.com/e/awakened-dreamers-bohemian-blossom-pippi-ciez-live-at-the-jungle-club-tickets-1985884964387?aff=erelexpmlt",
    source: "Eventbrite",
    status: "approved"
  },
  {
    id: "event-bali-nourish-retreat",
    title: "Bali Nourish Retreat",
    category: "Wellness & Sport",
    date: "May 10, 2026 · 12:00 PM",
    location: "Jalan Hanoman 2, Ubud",
    description: "A women's retreat in Ubud focused on holistic health, self-care, and reconnection in a guided Bali setting.",
    signupUrl: "https://allevents.in/ubud/bali-nourish-retreat/200029729622711",
    source: "AllEvents",
    status: "approved"
  },
  {
    id: "event-avec-2026",
    title: "AVEC 2026 Conference",
    category: "Networking",
    date: "May 11, 2026 · 7:00 AM",
    location: "Kerobokan Kaja, Kuta Utara",
    description: "A global vocational education conference with sessions, partner networking, and evening events across Bali.",
    signupUrl: "https://allevents.in/kuta/avec-2026-conference/200029648147958",
    source: "AllEvents",
    status: "approved"
  },
  {
    id: "event-magic-dirt",
    title: "Magic Dirt Live in Bali",
    category: "Music & Culture",
    date: "June 1, 2026 · 5:00 PM",
    location: "InterContinental Bali Resort, Kabupaten Badung",
    description: "A live music night in Bali featuring Magic Dirt at InterContinental Bali Resort.",
    signupUrl: "https://allevents.in/kabupaten-badung/magic-dirt-in-kabupaten-badung/3300028418919246",
    source: "AllEvents",
    status: "approved"
  },
  {
    id: "event-bali-mountain-retreat",
    title: "Bali Mountain Retreat",
    category: "Wellness & Sport",
    date: "June 12, 2026 · 10:30 AM",
    location: "Alam Shanti, Ubud",
    description: "A week-long Bali retreat blending yoga, celebration, and restorative time near the mountains of Tabanan.",
    signupUrl: "https://allevents.in/ubud/bali-mountain-retreat/200029724598824",
    source: "AllEvents",
    status: "approved"
  },
  {
    id: "event-jungle-body-retreat",
    title: "The Jungle Body Retreat Bali",
    category: "Wellness & Sport",
    date: "June 18, 2026 · 5:00 PM",
    location: "InterContinental Bali Sanur Resort",
    description: "A four-day retreat with workouts, self-development workshops, and a strong community energy in Sanur.",
    signupUrl: "https://allevents.in/sanur/the-jungle-body-retreat-bali-june-18-21-2026/200028582279026",
    source: "AllEvents",
    status: "approved"
  },
  {
    id: "event-kali-in-bali",
    title: "Kali in Bali 2026",
    category: "Wellness & Sport",
    date: "June 22, 2026 · 8:00 AM",
    location: "Candidasa, Karangasem",
    description: "A multi-day Filipino martial arts camp in Bali that combines technical training with a destination experience.",
    signupUrl: "https://allevents.in/klungkung/kali-in-bali-2026/200028622761353",
    source: "AllEvents",
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
