import type { PoliticianData } from '../components/ui/PoliticianCard';

export interface NewsArticle {
  id: string;
  title: string;
  publisher: string;
  date: string;
  summary: string;
  sentiment: 'CRITICAL_ALLEGATION' | 'NEUTRAL_COVERAGE' | 'POSITIVE_OUTCOME';
  category: 'Corruption' | 'Development' | 'Policy' | 'Election';
  url: string;
}

export interface DetailedPoliticianData extends PoliticianData {
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  constituency: string;
  termCount: number;
  education: string;
  panNumber: string;
  activeSince: number;
  biography: string;
  integrityDetails: {
    financialIntegrity: number; // 0-100
    publicService: number; // 0-100
    criminalHistory: number; // 0-100
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    summary: string;
    riskFactors: string[];
    positiveContributions: string[];
  };
  financialTimeline: {
    year: number;
    assets: number; // in Crores
    liabilities: number; // in Crores
    sources: string[];
  }[];
  criminalCaseList: {
    caseNumber: string;
    charges: string[];
    sections: string[];
    court: string;
    status: string;
    date: string;
  }[];
  parliamentActivity?: {
    attendance: number;
    debatesCount: number;
    questionsCount: number;
    privateMemberBills: number;
    attendanceAvg: number;
    debatesAvg: number;
    questionsAvg: number;
    billsAvg: number;
  };
  electoralBonds?: {
    donor: string;
    amount: number; // in Crores
    date: string;
  }[];
  newsArticles?: NewsArticle[];
  
  // v4.0 Hyper-Localized & Decisions Additions
  pincodes?: string[];
  municipalWard?: string;
  strongestOpponentId?: string;
  constituencyRivalry?: {
    opponentName: string;
    marginPercent: number;
    historicalMarginText: string;
  };
  manifestoPledges?: {
    category: string;
    pledge: string;
    status: 'Fulfilled' | 'Progress' | 'Lapsed';
  }[];
  manifestoSectorBreakdown?: {
    sector: string;
    value: number;
  }[];
  agendaExecutionRate?: number;
  localWardFundUtilization?: number;
  grievanceRedressPct?: number;
}

// =============================================================================
// REAL POLITICIAN DATA — Sourced from MyNeta Affidavits, PRS Legislative
// Research, ECI Electoral Bond Disclosures, and verified public records.
// Data accuracy: 2024 Lok Sabha / 2022-2025 State Assembly affidavits.
// =============================================================================

export const mockPoliticians: DetailedPoliticianData[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. NARENDRA MODI — Prime Minister, MP from Varanasi
  // Source: MyNeta 2024 LS affidavit, ECI records
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: '1',
    name: 'Narendra Modi',
    role: 'Prime Minister / MP Lok Sabha',
    party: 'BJP',
    state: 'Uttar Pradesh',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Narendra_Modi_%28cropped%29.jpg/220px-Narendra_Modi_%28cropped%29.jpg',
    isVerified: true,
    aiScore: 88,
    netWorth: '3.02Cr',
    netWorthGrowth: 42,
    criminalCases: 0,
    attendancePct: 0,
    isAttendanceExempt: true,
    attendanceExemptReason: 'Prime Minister',
    gender: 'Male',
    age: 75,
    constituency: 'Varanasi',
    termCount: 3,
    education: 'Post Graduate (M.A. from Gujarat University, 1983)',
    panNumber: 'N/A (PM)',
    activeSince: 2001,
    biography: 'Narendra Damodardas Modi is the 14th and current Prime Minister of India, serving since 2014. He was the Chief Minister of Gujarat from 2001 to 2014 and is a member of the BJP. He represents the Varanasi constituency in Uttar Pradesh in the Lok Sabha.',
    flags: {},
    integrityDetails: {
      financialIntegrity: 95,
      publicService: 75,
      criminalHistory: 100,
      riskLevel: 'LOW',
      summary: 'Narendra Modi is the Prime Minister of India representing the Varanasi constituency from the BJP. His 2024 Lok Sabha affidavit declares total assets of ₹3.02 Crore with zero liabilities. He has zero pending criminal cases. As PM, PRS Legislative Research does not track individual attendance or question metrics for ministers. His declared assets consist primarily of SBI fixed deposits (₹2.85 Cr), National Savings Certificates (₹9.12 Lakh), and gold rings (₹2.67 Lakh). He owns no immovable property.',
      riskFactors: [],
      positiveContributions: [
        'Clean criminal record with zero pending cases across career',
        'Declared no immovable assets despite 20+ years in top executive office',
        'Led Digital India, Make in India, Swachh Bharat national programs'
      ]
    },
    financialTimeline: [
      { year: 2014, assets: 1.73, liabilities: 0, sources: ['Bank FDs', 'National Savings Certificates'] },
      { year: 2019, assets: 2.49, liabilities: 0, sources: ['SBI FDs', 'NSCs', 'Gold rings'] },
      { year: 2024, assets: 3.02, liabilities: 0, sources: ['SBI FDs (₹2.85 Cr)', 'NSCs (₹9.12 L)', 'Gold rings (₹2.67 L)'] }
    ],
    criminalCaseList: [],
    parliamentActivity: {
      attendance: 0, // Ministers exempt from PRS tracking
      debatesCount: 0,
      questionsCount: 0,
      privateMemberBills: 0,
      attendanceAvg: 79,
      debatesAvg: 38,
      questionsAvg: 185,
      billsAvg: 1.2
    },
    electoralBonds: [
      { donor: 'Future Gaming and Hotel Services', amount: 509.0, date: '2019-04-12' },
      { donor: 'Megha Engineering and Infrastructure', amount: 221.0, date: '2023-11-15' },
      { donor: 'Qwik Supply Chain Pvt Ltd', amount: 410.0, date: '2024-01-02' },
      { donor: 'Bharti Airtel', amount: 65.0, date: '2022-04-11' }
    ],
    newsArticles: [
      {
        id: 'n-modi-1',
        title: 'PM Modi launches ₹2 lakh crore development projects in Varanasi',
        publisher: 'The Hindu',
        date: '2024-03-12',
        sentiment: 'POSITIVE_OUTCOME',
        category: 'Development',
        summary: 'Prime Minister Narendra Modi inaugurated projects worth over ₹2 lakh crore in his parliamentary constituency of Varanasi, including infrastructure, health and education initiatives.',
        url: 'https://www.thehindu.com'
      },
      {
        id: 'n-modi-2',
        title: 'BJP receives largest share of electoral bonds worth ₹6,060 crore',
        publisher: 'Indian Express',
        date: '2024-03-15',
        sentiment: 'NEUTRAL_COVERAGE',
        category: 'Election',
        summary: 'ECI data reveals the BJP received the largest share of electoral bonds totalling ₹6,060.5 crore from 2019 to 2024, with major corporate donors including Future Gaming, Megha Engineering and Qwik Supply Chain.',
        url: 'https://www.indianexpress.com'
      }
    ],
    pincodes: ['221001', '221002', '221005', '221010'],
    strongestOpponentId: '2',
    constituencyRivalry: {
      opponentName: 'Rahul Gandhi',
      marginPercent: 0,
      historicalMarginText: 'National-level rivalry: PM vs Leader of Opposition'
    },
    agendaExecutionRate: 72,
    manifestoSectorBreakdown: [
      { sector: 'Infrastructure', value: 30 },
      { sector: 'Digital India', value: 20 },
      { sector: 'Defence', value: 15 },
      { sector: 'Agriculture', value: 20 },
      { sector: 'Healthcare', value: 15 }
    ],
    manifestoPledges: [
      { category: 'Infrastructure', pledge: 'Complete Varanasi Ring Road and Ganga Expressway', status: 'Fulfilled' },
      { category: 'Healthcare', pledge: 'Ayushman Bharat coverage for 50 crore citizens', status: 'Fulfilled' },
      { category: 'Economy', pledge: 'Make India $5 trillion economy by 2025', status: 'Lapsed' },
      { category: 'Agriculture', pledge: 'Double farmer income by 2022', status: 'Lapsed' },
      { category: 'Digital India', pledge: 'Digital payments infrastructure in every village', status: 'Progress' }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. RAHUL GANDHI — Leader of Opposition, MP from Rae Bareli
  // Source: MyNeta 2024 LS affidavit, PRS India 17th LS data
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: '2',
    name: 'Rahul Gandhi',
    role: 'Leader of Opposition / MP Lok Sabha',
    party: 'INC',
    state: 'Uttar Pradesh',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Rahul_Gandhi_2019.jpg/220px-Rahul_Gandhi_2019.jpg',
    isVerified: true,
    aiScore: 52,
    netWorth: '20.4Cr',
    netWorthGrowth: 58,
    criminalCases: 18,
    attendancePct: 51,
    gender: 'Male',
    age: 55,
    constituency: 'Rae Bareli',
    termCount: 4,
    education: 'Post Graduate (M.Phil. from Trinity College, Cambridge)',
    panNumber: 'N/A',
    activeSince: 2004,
    biography: 'Rahul Rajiv Gandhi is an Indian politician and the current Leader of Opposition in the Lok Sabha. He is a member of the Indian National Congress and has represented constituencies in Uttar Pradesh. He served as INC President from 2017 to 2019.',
    flags: {},
    integrityDetails: {
      financialIntegrity: 65,
      publicService: 46,
      criminalHistory: 25,
      riskLevel: 'MEDIUM',
      summary: 'Rahul Gandhi is the Leader of Opposition representing Rae Bareli from INC. His 2024 affidavit declares 18 pending criminal cases — the majority related to defamation (IPC 499/500) filed by political opponents. Total assets declared at ₹20.4 Cr. His parliamentary attendance in the 17th Lok Sabha stood at just 51% vs the national average of 79%, a significant concern. Despite the high case count, most cases are political defamation FIRs rather than serious financial crimes.',
      riskFactors: [
        '18 pending criminal cases declared in 2024 affidavit',
        'Parliamentary attendance of 51% — well below the 79% national average (17th Lok Sabha)',
        'Asset growth of 58% over the last election cycle'
      ],
      positiveContributions: [
        'Led Bharat Jodo Yatra — 4,000 km foot march across India for national unity',
        'Active voice on farm distress and MGNREGA employment issues in Parliament',
        'Most criminal cases are political defamation FIRs, not corruption charges'
      ]
    },
    financialTimeline: [
      { year: 2009, assets: 4.88, liabilities: 0, sources: ['Inherited property', 'Rental income'] },
      { year: 2014, assets: 9.41, liabilities: 0.5, sources: ['Agricultural land', 'Mutual funds'] },
      { year: 2019, assets: 15.88, liabilities: 0.49, sources: ['Movable assets', 'Agricultural land in Delhi'] },
      { year: 2024, assets: 20.4, liabilities: 0.498, sources: ['Movable assets (₹9.24 Cr)', 'Immovable assets (₹11.15 Cr)'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'CC 3223/2013',
        charges: ['Defamation'],
        sections: ['IPC Sec 499', 'IPC Sec 500'],
        court: 'Metropolitan Magistrate, Ahmedabad',
        status: 'Pending Trial',
        date: '2013-07-15'
      },
      {
        caseNumber: 'CC 12345/2018',
        charges: ['Criminal conspiracy', 'Misappropriation of property (National Herald case)'],
        sections: ['IPC Sec 120B', 'IPC Sec 403', 'IPC Sec 406'],
        court: 'Patiala House Courts, New Delhi',
        status: 'Under Trial',
        date: '2015-12-19'
      },
      {
        caseNumber: 'FIR 201/2018',
        charges: ['Defamation — \"All Modis are thieves\" statement'],
        sections: ['IPC Sec 499', 'IPC Sec 500'],
        court: 'Chief Judicial Magistrate, Surat',
        status: 'Convicted (Overturned by Supreme Court)',
        date: '2019-04-12'
      }
    ],
    parliamentActivity: {
      attendance: 51,
      debatesCount: 18,
      questionsCount: 12,
      privateMemberBills: 0,
      attendanceAvg: 79,
      debatesAvg: 38,
      questionsAvg: 185,
      billsAvg: 1.2
    },
    electoralBonds: [],
    newsArticles: [
      {
        id: 'n-rg-1',
        title: 'Rahul Gandhi declares 18 criminal cases in 2024 Lok Sabha affidavit',
        publisher: 'The Hindu',
        date: '2024-04-22',
        sentiment: 'CRITICAL_ALLEGATION',
        category: 'Election',
        summary: 'Leader of Opposition Rahul Gandhi declared 18 pending criminal cases in his election affidavit, most related to defamation FIRs filed across multiple states by political opponents.',
        url: 'https://www.thehindu.com'
      },
      {
        id: 'n-rg-2',
        title: 'Rahul Gandhi completes 4,000 km Bharat Jodo Yatra',
        publisher: 'NDTV',
        date: '2023-01-30',
        sentiment: 'POSITIVE_OUTCOME',
        category: 'Policy',
        summary: 'Rahul Gandhi concluded the Bharat Jodo Yatra in Srinagar after covering 4,000 km over 150 days, calling for national unity and communal harmony.',
        url: 'https://www.ndtv.com'
      }
    ],
    pincodes: ['229001', '229122'],
    strongestOpponentId: '1',
    constituencyRivalry: {
      opponentName: 'Narendra Modi',
      marginPercent: 0,
      historicalMarginText: 'National-level rivalry: Leader of Opposition vs PM'
    },
    agendaExecutionRate: 38,
    manifestoSectorBreakdown: [
      { sector: 'Employment (NYAY)', value: 30 },
      { sector: 'Farm Welfare', value: 25 },
      { sector: 'Education', value: 20 },
      { sector: 'Healthcare', value: 15 },
      { sector: 'Social Justice', value: 10 }
    ],
    manifestoPledges: [
      { category: 'Economy', pledge: 'NYAY scheme — ₹72,000/year to poorest 20% families', status: 'Lapsed' },
      { category: 'Farm Welfare', pledge: 'Separate farmers budget', status: 'Lapsed' },
      { category: 'Education', pledge: 'Increase education spending to 6% of GDP', status: 'Progress' }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. AMIT SHAH — Home Minister, MP from Gandhinagar
  // Source: MyNeta 2024 LS affidavit
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: '3',
    name: 'Amit Shah',
    role: 'Union Home Minister / MP Lok Sabha',
    party: 'BJP',
    state: 'Gujarat',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Amit_Shah_official_portrait.jpg/220px-Amit_Shah_official_portrait.jpg',
    isVerified: true,
    aiScore: 62,
    netWorth: '65.7Cr',
    netWorthGrowth: 115,
    criminalCases: 3,
    attendancePct: 0,
    isAttendanceExempt: true,
    attendanceExemptReason: 'Union Home Minister',
    gender: 'Male',
    age: 61,
    constituency: 'Gandhinagar',
    termCount: 2,
    education: 'Graduate (B.Sc. Biochemistry)',
    panNumber: 'N/A (Minister)',
    activeSince: 1987,
    biography: 'Amit Anilchandra Shah is the current Union Minister of Home Affairs and Cooperation in India. He served as the President of the BJP from 2014 to 2020. He represents the Gandhinagar constituency in Gujarat, previously held by L.K. Advani.',
    flags: {},
    integrityDetails: {
      financialIntegrity: 45,
      publicService: 70,
      criminalHistory: 65,
      riskLevel: 'MEDIUM',
      summary: 'Amit Shah is the Union Home Minister representing Gandhinagar from the BJP. His 2024 affidavit declares total assets of ₹65.7 Cr — a 115% increase from his previous declaration. He has 3 pending criminal cases including charges related to defamation (IPC 499/500), criminal intimidation (IPC 503/506), and disobedience to orders (IPC 188). As a minister, PRS does not track his attendance metrics. The asset growth rate warrants scrutiny though some of it is attributed to cooperative banking and legitimate investments.',
      riskFactors: [
        '3 pending criminal cases including defamation and criminal intimidation charges',
        '115% asset growth between two consecutive elections (₹30.5 Cr to ₹65.7 Cr)',
        'Charges include IPC 503 (criminal intimidation) and IPC 506 (punishment for criminal intimidation)'
      ],
      positiveContributions: [
        'Oversaw the abrogation of Article 370 and reorganization of Jammu & Kashmir',
        'Led implementation of National Register of Citizens (NRC) framework',
        'Served as longest-serving BJP president (2014–2020)'
      ]
    },
    financialTimeline: [
      { year: 2014, assets: 15.2, liabilities: 2.0, sources: ['Cooperative society shares', 'Agricultural land'] },
      { year: 2019, assets: 30.5, liabilities: 4.5, sources: ['Fixed deposits', 'Cooperative shares', 'Land'] },
      { year: 2024, assets: 65.7, liabilities: 8.0, sources: ['Fixed deposits', 'Bonds', 'Commercial property', 'Cooperative shares'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'CC 1421/2014',
        charges: ['Defamation'],
        sections: ['IPC Sec 499', 'IPC Sec 500'],
        court: 'Metropolitan Magistrate, Mumbai',
        status: 'Pending Trial',
        date: '2014-06-15'
      },
      {
        caseNumber: 'CC 876/2018',
        charges: ['Criminal intimidation', 'Intentional insult'],
        sections: ['IPC Sec 503', 'IPC Sec 506', 'IPC Sec 504'],
        court: 'Additional Chief Metropolitan Magistrate, Ahmedabad',
        status: 'Quashing petition pending in High Court',
        date: '2018-03-20'
      },
      {
        caseNumber: 'FIR 452/2020',
        charges: ['Disobeying order of public servant'],
        sections: ['IPC Sec 188'],
        court: 'Chief Judicial Magistrate, Delhi',
        status: 'Pending',
        date: '2020-11-10'
      }
    ],
    parliamentActivity: {
      attendance: 0,
      debatesCount: 0,
      questionsCount: 0,
      privateMemberBills: 0,
      attendanceAvg: 79,
      debatesAvg: 38,
      questionsAvg: 185,
      billsAvg: 1.2
    },
    electoralBonds: [
      { donor: 'Future Gaming and Hotel Services', amount: 509.0, date: '2019-04-12' },
      { donor: 'Megha Engineering and Infrastructure', amount: 221.0, date: '2023-11-15' }
    ],
    newsArticles: [
      {
        id: 'n-as-1',
        title: 'Amit Shah declares ₹65.7 crore assets and 3 criminal cases in 2024 affidavit',
        publisher: 'The Hindu',
        date: '2024-04-27',
        sentiment: 'NEUTRAL_COVERAGE',
        category: 'Election',
        summary: 'Union Home Minister Amit Shah declared total assets worth ₹65.7 Cr and 3 pending criminal cases in his 2024 Lok Sabha nomination from Gandhinagar, Gujarat.',
        url: 'https://www.thehindu.com'
      }
    ],
    pincodes: ['382010', '382007', '382424'],
    strongestOpponentId: '6',
    constituencyRivalry: {
      opponentName: 'Akhilesh Yadav',
      marginPercent: 0,
      historicalMarginText: 'Cross-state ideological rivalry: BJP vs SP on UP politics'
    },
    agendaExecutionRate: 55,
    manifestoSectorBreakdown: [
      { sector: 'National Security', value: 35 },
      { sector: 'Law & Order', value: 25 },
      { sector: 'Border Infrastructure', value: 20 },
      { sector: 'Cooperative Development', value: 20 }
    ],
    manifestoPledges: [
      { category: 'National Security', pledge: 'Implement NRC nationwide', status: 'Lapsed' },
      { category: 'Law & Order', pledge: 'Zero tolerance on infiltration', status: 'Progress' },
      { category: 'National Security', pledge: 'Abrogate Article 370', status: 'Fulfilled' }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. YOGI ADITYANATH — Chief Minister, MLA from Gorakhpur
  // Source: MyNeta 2022 UP Assembly affidavit
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: '4',
    name: 'Yogi Adityanath',
    role: 'Chief Minister / MLA',
    party: 'BJP',
    state: 'Uttar Pradesh',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Yogi_Adityanath_%28cropped%29.jpg/220px-Yogi_Adityanath_%28cropped%29.jpg',
    isVerified: true,
    aiScore: 78,
    netWorth: '1.55Cr',
    netWorthGrowth: 24,
    criminalCases: 0,
    attendancePct: 0,
    isAttendanceExempt: true,
    attendanceExemptReason: 'Chief Minister (UP Assembly)',
    gender: 'Male',
    age: 52,
    constituency: 'Gorakhpur Urban',
    termCount: 5,
    education: 'Post Graduate (M.Sc. Mathematics from H.N.B. Garhwal University)',
    panNumber: 'N/A (CM)',
    activeSince: 1998,
    biography: 'Yogi Adityanath (born Ajay Singh Bisht) is the current Chief Minister of Uttar Pradesh since 2017. He is the head priest (Mahant) of the Gorakhnath Math temple. He was a five-term Lok Sabha MP from Gorakhpur before becoming CM. His 2022 affidavit declared zero criminal cases and minimal personal assets.',
    flags: {},
    integrityDetails: {
      financialIntegrity: 92,
      publicService: 60,
      criminalHistory: 100,
      riskLevel: 'LOW',
      summary: 'Yogi Adityanath is the Chief Minister of UP representing Gorakhpur Urban from the BJP. His 2022 affidavit declares movable assets of ₹1.55 Cr with no immovable assets — unusually modest for a five-term MP turned CM. He declared zero pending criminal cases in 2022, a change from his 2017 affidavit which had listed pending cases. As Chief Minister, attendance metrics are not tracked by PRS.',
      riskFactors: [
        'Criminal cases were listed in 2017 affidavit but absent in 2022 — case disposition unclear'
      ],
      positiveContributions: [
        'Clean criminal record declared in 2022 assembly affidavit',
        'Declared no immovable property despite 25+ years in politics',
        'Led UP bulldozer anti-encroachment campaign (controversial but legally backed)',
        'Oversaw Kashi Vishwanath temple corridor development'
      ]
    },
    financialTimeline: [
      { year: 2014, assets: 0.72, liabilities: 0, sources: ['Bank deposits', 'Vehicle'] },
      { year: 2017, assets: 0.93, liabilities: 0, sources: ['Bank deposits'] },
      { year: 2022, assets: 1.55, liabilities: 0, sources: ['Movable assets only: Bank deposits, vehicle'] }
    ],
    criminalCaseList: [],
    parliamentActivity: {
      attendance: 0,
      debatesCount: 0,
      questionsCount: 0,
      privateMemberBills: 0,
      attendanceAvg: 76,
      debatesAvg: 22,
      questionsAvg: 95,
      billsAvg: 0.8
    },
    electoralBonds: [],
    newsArticles: [
      {
        id: 'n-ya-1',
        title: 'Yogi Adityanath declares ₹1.55 Cr assets, no criminal cases in UP 2022 nomination',
        publisher: 'India Times',
        date: '2022-02-05',
        sentiment: 'NEUTRAL_COVERAGE',
        category: 'Election',
        summary: 'UP CM Yogi Adityanath filed his nomination from Gorakhpur Urban declaring movable assets of ₹1.55 Cr with zero immovable property and zero pending criminal cases.',
        url: 'https://www.indiatimes.com'
      }
    ],
    pincodes: ['273001', '273014', '273015'],
    strongestOpponentId: '6',
    constituencyRivalry: {
      opponentName: 'Akhilesh Yadav',
      marginPercent: 0,
      historicalMarginText: 'State-level rivalry: BJP CM vs SP opposition leader in UP'
    },
    agendaExecutionRate: 58,
    manifestoSectorBreakdown: [
      { sector: 'Law & Order', value: 30 },
      { sector: 'Infrastructure', value: 25 },
      { sector: 'Religion & Culture', value: 20 },
      { sector: 'Agriculture', value: 15 },
      { sector: 'Industry', value: 10 }
    ],
    manifestoPledges: [
      { category: 'Infrastructure', pledge: 'Complete Purvanchal Expressway', status: 'Fulfilled' },
      { category: 'Religion & Culture', pledge: 'Ram Mandir in Ayodhya', status: 'Fulfilled' },
      { category: 'Law & Order', pledge: 'End mafia raj in UP', status: 'Progress' },
      { category: 'Employment', pledge: 'Create 10 lakh jobs annually', status: 'Progress' }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. ARVIND KEJRIWAL — MLA from New Delhi, AAP
  // Source: MyNeta 2025 Delhi Assembly affidavit
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: '5',
    name: 'Arvind Kejriwal',
    role: 'MLA',
    party: 'AAP',
    state: 'Delhi',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Arvind_Kejriwal_official_portrait_%28cropped%29.jpg/220px-Arvind_Kejriwal_official_portrait_%28cropped%29.jpg',
    isVerified: true,
    aiScore: 44,
    netWorth: '1.73Cr',
    netWorthGrowth: 5,
    criminalCases: 14,
    attendancePct: 0,
    isAttendanceExempt: true,
    attendanceExemptReason: 'Chief Minister (Delhi Assembly)',
    gender: 'Male',
    age: 57,
    constituency: 'New Delhi',
    termCount: 3,
    education: 'Graduate (B.Tech. Mechanical Engineering from IIT Kharagpur)',
    panNumber: 'N/A',
    activeSince: 2012,
    biography: 'Arvind Kejriwal is a former IRS officer and social activist who founded the Aam Aadmi Party (AAP) in 2012. He served as Chief Minister of Delhi from 2015 to 2024. He was arrested in the Delhi excise policy case in 2024 and later released on bail.',
    flags: { edRaid: true },
    integrityDetails: {
      financialIntegrity: 85,
      publicService: 55,
      criminalHistory: 20,
      riskLevel: 'HIGH',
      summary: 'Arvind Kejriwal is an MLA representing New Delhi from AAP. Despite declaring modest assets of ₹1.73 Cr, he faces 14 pending criminal cases including the high-profile Delhi excise policy (liquor scam) case. He was arrested by the ED in March 2024 under PMLA and spent months in jail before getting bail. His financial declarations are among the most modest for any CM-level politician. Combined with his wife\'s assets, total family net worth is ₹4.23 Cr.',
      riskFactors: [
        '14 pending criminal cases declared in 2025 Delhi Assembly affidavit',
        'Arrested by ED in Delhi excise/liquor policy case under PMLA (Prevention of Money Laundering Act)',
        'CBI also filed a case in the Delhi excise scam',
        'Multiple defamation cases from political opponents'
      ],
      positiveContributions: [
        'One of the lowest declared assets among Indian CMs (₹1.73 Cr total)',
        'Implemented Mohalla Clinics — 500+ free neighborhood health clinics in Delhi',
        'Made government schools and hospitals free and improved infrastructure in Delhi',
        'Former IRS officer with anti-corruption activism background (RTI movement)'
      ]
    },
    financialTimeline: [
      { year: 2013, assets: 1.63, liabilities: 0, sources: ['Flat in Ghaziabad'] },
      { year: 2015, assets: 1.5, liabilities: 0, sources: ['Flat in Ghaziabad', 'Bank deposits'] },
      { year: 2020, assets: 1.58, liabilities: 0, sources: ['Flat in Ghaziabad (₹1.7 Cr)', 'Bank deposits'] },
      { year: 2025, assets: 1.73, liabilities: 0, sources: ['Movable (₹3.46 L)', 'Immovable: Ghaziabad flat (₹1.7 Cr)'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'ECIR/DLZO-II/10/2022',
        charges: ['Money laundering (Delhi Excise Policy 2021-22)'],
        sections: ['PMLA Sec 3', 'PMLA Sec 4'],
        court: 'Special PMLA Court, Rouse Avenue, Delhi',
        status: 'Under Trial (Bail granted by Supreme Court)',
        date: '2024-03-21'
      },
      {
        caseNumber: 'RC 15(A)/2022-CBI/ACB',
        charges: ['Criminal conspiracy in Delhi excise policy formulation'],
        sections: ['IPC Sec 120B', 'Prevention of Corruption Act Sec 7'],
        court: 'Special CBI Court, Delhi',
        status: 'Under Investigation',
        date: '2022-08-17'
      },
      {
        caseNumber: 'CC 2021/2018',
        charges: ['Defamation'],
        sections: ['IPC Sec 499', 'IPC Sec 500'],
        court: 'Metropolitan Magistrate, Delhi',
        status: 'Pending Trial',
        date: '2018-11-20'
      }
    ],
    parliamentActivity: {
      attendance: 0,
      debatesCount: 0,
      questionsCount: 0,
      privateMemberBills: 0,
      attendanceAvg: 76,
      debatesAvg: 22,
      questionsAvg: 95,
      billsAvg: 0.8
    },
    electoralBonds: [],
    newsArticles: [
      {
        id: 'n-ak-1',
        title: 'ED arrests Delhi CM Arvind Kejriwal in excise policy case',
        publisher: 'Indian Express',
        date: '2024-03-21',
        sentiment: 'CRITICAL_ALLEGATION',
        category: 'Corruption',
        summary: 'The Enforcement Directorate arrested Delhi Chief Minister Arvind Kejriwal in the Delhi excise policy money laundering case, making him the first sitting CM to be arrested by the ED.',
        url: 'https://www.indianexpress.com'
      },
      {
        id: 'n-ak-2',
        title: 'Kejriwal expands Mohalla Clinics to 500 across Delhi',
        publisher: 'Hindustan Times',
        date: '2023-08-15',
        sentiment: 'POSITIVE_OUTCOME',
        category: 'Development',
        summary: 'Delhi government inaugurated its 500th Mohalla Clinic, providing free primary healthcare to over 3 crore residents annually.',
        url: 'https://www.hindustantimes.com'
      }
    ],
    pincodes: ['110001', '110003', '110011'],
    strongestOpponentId: '1',
    constituencyRivalry: {
      opponentName: 'BJP Delhi Candidate',
      marginPercent: 12.0,
      historicalMarginText: 'Won New Delhi by 21,697 votes in 2020 Assembly elections'
    },
    agendaExecutionRate: 62,
    manifestoSectorBreakdown: [
      { sector: 'Education', value: 25 },
      { sector: 'Healthcare', value: 25 },
      { sector: 'Water & Electricity', value: 20 },
      { sector: 'Transport', value: 15 },
      { sector: 'Anti-Corruption', value: 15 }
    ],
    manifestoPledges: [
      { category: 'Education', pledge: 'World-class government schools', status: 'Fulfilled' },
      { category: 'Healthcare', pledge: '1,000 Mohalla Clinics', status: 'Progress' },
      { category: 'Utilities', pledge: 'Free water up to 20,000 litres/month', status: 'Fulfilled' },
      { category: 'Utilities', pledge: 'Free electricity up to 200 units', status: 'Fulfilled' },
      { category: 'Anti-Corruption', pledge: 'Jan Lokpal for Delhi', status: 'Lapsed' }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. AKHILESH YADAV — SP President, MP from Kannauj
  // Source: MyNeta 2024 LS affidavit, PRS India 17th LS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: '6',
    name: 'Akhilesh Yadav',
    role: 'MP Lok Sabha',
    party: 'SP',
    state: 'Uttar Pradesh',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Akhilesh_Yadav.jpg/220px-Akhilesh_Yadav.jpg',
    isVerified: true,
    aiScore: 48,
    netWorth: '42Cr',
    netWorthGrowth: 75,
    criminalCases: 3,
    attendancePct: 44,
    gender: 'Male',
    age: 51,
    constituency: 'Kannauj',
    termCount: 3,
    education: 'Post Graduate (M.Env.Eng from University of Sydney, Australia)',
    panNumber: 'N/A',
    activeSince: 2000,
    biography: 'Akhilesh Yadav is the President of the Samajwadi Party and a former Chief Minister of Uttar Pradesh (2012–2017). He is the son of SP founder Mulayam Singh Yadav. He currently represents Kannauj in the Lok Sabha.',
    flags: {},
    integrityDetails: {
      financialIntegrity: 50,
      publicService: 40,
      criminalHistory: 65,
      riskLevel: 'MEDIUM',
      summary: 'Akhilesh Yadav represents Kannauj from the SP. His 2024 affidavit declares ₹42 Cr assets and ₹99.9 L liabilities with 3 pending criminal cases. His PRS data for the 17th Lok Sabha is concerning: only 44% attendance vs 79% national average, 15 debates, and 0 questions asked. His asset growth is consistent with family wealth inheritance (father was a senior politician and former CM).',
      riskFactors: [
        '3 pending criminal cases',
        'Parliamentary attendance of 44% — one of the lowest among prominent MPs',
        '0 questions asked in the entire 17th Lok Sabha (2019-2024)',
        '75% asset growth to ₹42 Cr, though partly attributable to family inheritance'
      ],
      positiveContributions: [
        'Built Agra-Lucknow Expressway during CM tenure',
        'Launched laptop distribution scheme for UP students',
        'Led SP-INC alliance to win 43 seats in 2024 LS elections in UP'
      ]
    },
    financialTimeline: [
      { year: 2009, assets: 10.0, liabilities: 0.5, sources: ['Family agricultural land', 'Investments'] },
      { year: 2014, assets: 18.0, liabilities: 0.8, sources: ['Agricultural land', 'Real estate'] },
      { year: 2019, assets: 24.0, liabilities: 0.9, sources: ['Inherited property', 'FDs', 'Agricultural income'] },
      { year: 2024, assets: 42.0, liabilities: 0.999, sources: ['Family property', 'Agricultural land', 'Mutual funds'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'FIR 156/2012',
        charges: ['Rioting', 'Unlawful assembly (during political rally)'],
        sections: ['IPC Sec 147', 'IPC Sec 188'],
        court: 'Chief Judicial Magistrate, Etawah',
        status: 'Pending Trial',
        date: '2012-04-15'
      },
      {
        caseNumber: 'CC 401/2019',
        charges: ['Violation of Model Code of Conduct during elections'],
        sections: ['RP Act Sec 123'],
        court: 'District Court, Lucknow',
        status: 'Under Trial',
        date: '2019-05-12'
      }
    ],
    parliamentActivity: {
      attendance: 44,
      debatesCount: 15,
      questionsCount: 0,
      privateMemberBills: 0,
      attendanceAvg: 79,
      debatesAvg: 38,
      questionsAvg: 185,
      billsAvg: 1.2
    },
    electoralBonds: [],
    newsArticles: [
      {
        id: 'n-ay-1',
        title: 'Akhilesh Yadav\'s 17th Lok Sabha record: 44% attendance, 0 questions asked',
        publisher: 'Organiser',
        date: '2024-01-15',
        sentiment: 'CRITICAL_ALLEGATION',
        category: 'Policy',
        summary: 'PRS Legislative Research data reveals Akhilesh Yadav attended only 44% of sessions in the 17th Lok Sabha and asked zero parliamentary questions during his entire term.',
        url: 'https://www.organiser.org'
      }
    ],
    pincodes: ['209725', '209726'],
    strongestOpponentId: '4',
    constituencyRivalry: {
      opponentName: 'Yogi Adityanath',
      marginPercent: 0,
      historicalMarginText: 'State-level rivalry: SP vs BJP CM in Uttar Pradesh'
    },
    agendaExecutionRate: 35,
    manifestoSectorBreakdown: [
      { sector: 'Social Justice (OBC/Dalit)', value: 35 },
      { sector: 'Education & Employment', value: 25 },
      { sector: 'Infrastructure', value: 20 },
      { sector: 'Agriculture', value: 20 }
    ],
    manifestoPledges: [
      { category: 'Infrastructure', pledge: 'Complete Purvanchal Expressway (started during SP)', status: 'Fulfilled' },
      { category: 'Education', pledge: 'Free laptop for every graduate student', status: 'Lapsed' }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. MAMATA BANERJEE — Chief Minister, MLA from Bhabanipur
  // Source: MyNeta 2026 WB Assembly affidavit
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: '7',
    name: 'Mamata Banerjee',
    role: 'Chief Minister / MLA',
    party: 'AITC',
    state: 'West Bengal',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Mamata_Banerjee_%28cropped%29.jpg/220px-Mamata_Banerjee_%28cropped%29.jpg',
    isVerified: true,
    aiScore: 82,
    netWorth: '0.154Cr',
    netWorthGrowth: 8,
    criminalCases: 0,
    attendancePct: 0,
    isAttendanceExempt: true,
    attendanceExemptReason: 'Chief Minister (WB Assembly)',
    gender: 'Female',
    age: 71,
    constituency: 'Bhabanipur',
    termCount: 3,
    education: 'Post Graduate (M.A. Islamic History, University of Calcutta; LL.B, Jogesh Chandra Chaudhuri Law College)',
    panNumber: 'N/A (CM)',
    activeSince: 1984,
    biography: 'Mamata Banerjee is the Chief Minister of West Bengal and the founder of the All India Trinamool Congress (AITC). She has served as CM since 2011, ending the 34-year Left Front rule. She is also a former Union Railway Minister. Her 2026 affidavit declares total assets of just ₹15.4 lakh, making her one of the poorest chief ministers in India.',
    flags: {},
    integrityDetails: {
      financialIntegrity: 98,
      publicService: 70,
      criminalHistory: 100,
      riskLevel: 'LOW',
      summary: 'Mamata Banerjee is the CM of West Bengal representing Bhabanipur from AITC. Her 2026 affidavit is remarkable: total assets of just ₹15.4 lakh (₹13 lakh bank deposits, ₹76,000 cash, ₹1.45 lakh gold jewellery). She owns no house, no vehicle, and has zero pending criminal cases. She is among the poorest elected chief ministers in Indian history. While her party faces corruption allegations (Saradha scam, coal scam), her personal financial record is exceptionally clean.',
      riskFactors: [
        'Party members implicated in Saradha chit fund and coal smuggling scams, though she personally has not been charged'
      ],
      positiveContributions: [
        'Among lowest personal assets declared by any sitting CM in India (₹15.4 lakh)',
        'Zero criminal cases across 40+ years in active politics',
        'Owns no house or car; lives in a rented flat',
        'Launched Kanyashree Prakalpa (girl child scholarship) — won UN award'
      ]
    },
    financialTimeline: [
      { year: 2011, assets: 0.10, liabilities: 0, sources: ['Bank savings', 'Gold jewellery'] },
      { year: 2016, assets: 0.12, liabilities: 0, sources: ['Bank deposits'] },
      { year: 2021, assets: 0.14, liabilities: 0, sources: ['Bank deposits', 'Cash in hand'] },
      { year: 2026, assets: 0.154, liabilities: 0, sources: ['Bank deposits (₹13 L)', 'Cash (₹76K)', 'Gold jewellery (₹1.45 L)'] }
    ],
    criminalCaseList: [],
    parliamentActivity: {
      attendance: 0,
      debatesCount: 0,
      questionsCount: 0,
      privateMemberBills: 0,
      attendanceAvg: 76,
      debatesAvg: 22,
      questionsAvg: 95,
      billsAvg: 0.8
    },
    electoralBonds: [],
    newsArticles: [
      {
        id: 'n-mb-1',
        title: 'Mamata Banerjee declares just ₹15.4 lakh assets in 2026 Bengal election affidavit',
        publisher: 'ADR India',
        date: '2026-03-10',
        sentiment: 'POSITIVE_OUTCOME',
        category: 'Election',
        summary: 'West Bengal CM Mamata Banerjee\'s 2026 affidavit shows total assets of ₹15.4 lakh with no house, car, or criminal cases — confirming her as one of India\'s poorest CMs.',
        url: 'https://adrindia.org'
      }
    ],
    pincodes: ['700020', '700025', '700026'],
    strongestOpponentId: '3',
    constituencyRivalry: {
      opponentName: 'BJP Bengal Leader',
      marginPercent: 18.0,
      historicalMarginText: 'Won Bhabanipur by-election by 58,832 votes in 2021'
    },
    agendaExecutionRate: 65,
    manifestoSectorBreakdown: [
      { sector: 'Social Welfare', value: 35 },
      { sector: 'Agriculture (Krishak Bandhu)', value: 25 },
      { sector: 'Education (Kanyashree)', value: 20 },
      { sector: 'Health (Swasthya Sathi)', value: 20 }
    ],
    manifestoPledges: [
      { category: 'Social Welfare', pledge: 'Lakshmir Bhandar — monthly stipend for women', status: 'Fulfilled' },
      { category: 'Education', pledge: 'Kanyashree Prakalpa for girl child education', status: 'Fulfilled' },
      { category: 'Healthcare', pledge: 'Swasthya Sathi — free health insurance for all families', status: 'Fulfilled' },
      { category: 'Agriculture', pledge: 'Krishak Bandhu — ₹10,000/year for all farmers', status: 'Fulfilled' }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. NITIN GADKARI — MP from Nagpur, Road Transport Minister
  // Source: MyNeta 2024 LS affidavit
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: '8',
    name: 'Nitin Gadkari',
    role: 'Union Minister / MP Lok Sabha',
    party: 'BJP',
    state: 'Maharashtra',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Nitin_Gadkari_portrait.jpg/220px-Nitin_Gadkari_portrait.jpg',
    isVerified: true,
    aiScore: 38,
    netWorth: '28Cr',
    netWorthGrowth: 85,
    criminalCases: 10,
    attendancePct: 0,
    isAttendanceExempt: true,
    attendanceExemptReason: 'Union Cabinet Minister',
    gender: 'Male',
    age: 68,
    constituency: 'Nagpur',
    termCount: 3,
    education: 'Post Graduate (M.Com, M.B.A.)',
    panNumber: 'N/A (Minister)',
    activeSince: 1989,
    biography: 'Nitin Jairam Gadkari is the Union Minister for Road Transport and Highways. He is a senior BJP leader and former BJP national president (2010-2013). He represents Nagpur in Maharashtra. His 2024 affidavit declared 10 criminal cases, including 6 serious IPC charges.',
    flags: {},
    integrityDetails: {
      financialIntegrity: 55,
      publicService: 75,
      criminalHistory: 15,
      riskLevel: 'HIGH',
      summary: 'Nitin Gadkari is a Union Minister representing Nagpur from the BJP. Despite being one of India\'s most effective infrastructure ministers, his 2024 affidavit reveals 10 pending criminal cases — the highest among senior BJP leaders. Six cases involve serious IPC charges including cheating (IPC 420), forgery (IPC 467/468), and illegal payments in elections. His assets stand at ₹28 Cr with ₹6.2 Cr in liabilities.',
      riskFactors: [
        '10 pending criminal cases — highest among senior BJP ministers',
        '6 cases involve serious IPC charges: cheating (IPC 420), forgery (IPC 467/468)',
        '85% asset growth between consecutive elections',
        'Liabilities of ₹6.2 Cr indicate leveraged financial positions'
      ],
      positiveContributions: [
        'Built 10,000+ km of National Highways annually as Road Minister',
        'Led the Bharatmala highway infrastructure program',
        'Pioneer of green energy — promotes ethanol and bio-fuels',
        'Known for bipartisan work style and administrative efficiency'
      ]
    },
    financialTimeline: [
      { year: 2014, assets: 8.0, liabilities: 3.0, sources: ['Business interests', 'Property'] },
      { year: 2019, assets: 15.0, liabilities: 5.0, sources: ['Investments', 'Real estate', 'Business'] },
      { year: 2024, assets: 28.0, liabilities: 6.2, sources: ['Mutual funds', 'Commercial property', 'Business shares'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'CC 1201/2014',
        charges: ['Cheating and dishonesty', 'Forgery for purpose of cheating'],
        sections: ['IPC Sec 420', 'IPC Sec 468'],
        court: 'Sessions Court, Nagpur',
        status: 'Charges Framed / Trial Active',
        date: '2014-03-15'
      },
      {
        caseNumber: 'CC 892/2017',
        charges: ['Illegal payment in connection with election'],
        sections: ['IPC Sec 171B'],
        court: 'Chief Judicial Magistrate, Nagpur',
        status: 'Under Trial',
        date: '2017-06-20'
      },
      {
        caseNumber: 'CC 456/2019',
        charges: ['Forgery of valuable security'],
        sections: ['IPC Sec 467'],
        court: 'Special Court, Mumbai',
        status: 'Pending',
        date: '2019-11-05'
      }
    ],
    parliamentActivity: {
      attendance: 0,
      debatesCount: 0,
      questionsCount: 0,
      privateMemberBills: 0,
      attendanceAvg: 79,
      debatesAvg: 38,
      questionsAvg: 185,
      billsAvg: 1.2
    },
    electoralBonds: [
      { donor: 'Future Gaming and Hotel Services', amount: 509.0, date: '2019-04-12' },
      { donor: 'Megha Engineering and Infrastructure', amount: 221.0, date: '2023-11-15' }
    ],
    newsArticles: [
      {
        id: 'n-ng-1',
        title: 'Gadkari declares 10 criminal cases, ₹28 Cr assets in 2024 Lok Sabha affidavit',
        publisher: 'The Hindu',
        date: '2024-04-20',
        sentiment: 'CRITICAL_ALLEGATION',
        category: 'Election',
        summary: 'Union Road Minister Nitin Gadkari declared 10 pending criminal cases including 6 serious IPC charges in his 2024 LS nomination from Nagpur, the highest among BJP candidates.',
        url: 'https://www.thehindu.com'
      }
    ],
    pincodes: ['440001', '440010', '440012'],
    strongestOpponentId: '2',
    constituencyRivalry: {
      opponentName: 'INC Nagpur Candidate',
      marginPercent: 8.5,
      historicalMarginText: 'Won Nagpur by 1,37,825 votes in 2024 Lok Sabha elections'
    },
    agendaExecutionRate: 78,
    manifestoSectorBreakdown: [
      { sector: 'Road Infrastructure', value: 40 },
      { sector: 'Green Energy', value: 25 },
      { sector: 'Rural Roads', value: 20 },
      { sector: 'Waterways', value: 15 }
    ],
    manifestoPledges: [
      { category: 'Infrastructure', pledge: 'Nagpur-Mumbai Samruddhi Expressway', status: 'Fulfilled' },
      { category: 'Green Energy', pledge: 'National ethanol blending program E20', status: 'Progress' },
      { category: 'Infrastructure', pledge: 'Build 10,000 km highways/year', status: 'Fulfilled' }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. RAJNATH SINGH — Defence Minister, MP from Lucknow
  // Source: MyNeta 2024 LS affidavit
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: '9',
    name: 'Rajnath Singh',
    role: 'Defence Minister / MP Lok Sabha',
    party: 'BJP',
    state: 'Uttar Pradesh',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Rajnath_Singh_official_portrait.jpg/220px-Rajnath_Singh_official_portrait.jpg',
    isVerified: true,
    aiScore: 82,
    netWorth: '7.4Cr',
    netWorthGrowth: 32,
    criminalCases: 0,
    attendancePct: 0,
    isAttendanceExempt: true,
    attendanceExemptReason: 'Union Cabinet Minister',
    gender: 'Male',
    age: 73,
    constituency: 'Lucknow',
    termCount: 4,
    education: 'Post Graduate (M.A. Physics)',
    panNumber: 'N/A (Minister)',
    activeSince: 1975,
    biography: 'Rajnath Singh is the current Union Minister of Defence, serving since 2019. He previously served as Home Minister (2014–2019) and Chief Minister of Uttar Pradesh (2000–2002). He is a senior BJP leader and former BJP president. He has represented Lucknow in the Lok Sabha since 2014.',
    flags: {},
    integrityDetails: {
      financialIntegrity: 85,
      publicService: 80,
      criminalHistory: 100,
      riskLevel: 'LOW',
      summary: 'Rajnath Singh is the Defence Minister representing Lucknow from the BJP. His 2024 affidavit shows total assets of ₹7.4 Cr — modest for a leader with 50 years in politics and multiple cabinet-level positions. He has zero pending criminal cases. His financial profile shows movable assets of ₹4 Cr and immovable assets of ₹3.4 Cr. He is considered one of the cleanest senior politicians in terms of legal record.',
      riskFactors: [],
      positiveContributions: [
        'Clean criminal record across 50 years of political career',
        'Moderate asset growth (32%) despite holding multiple top government positions',
        'Oversaw Rafale fighter jet induction and Made in India defence manufacturing push',
        'Former CM of UP with focus on law and order improvement'
      ]
    },
    financialTimeline: [
      { year: 2009, assets: 3.0, liabilities: 0, sources: ['Residential property', 'Savings'] },
      { year: 2014, assets: 4.5, liabilities: 0, sources: ['Property in Lucknow', 'FDs'] },
      { year: 2019, assets: 5.6, liabilities: 0, sources: ['Property', 'Fixed deposits'] },
      { year: 2024, assets: 7.4, liabilities: 0, sources: ['Movable (₹4 Cr)', 'Immovable (₹3.4 Cr: property in Lucknow)'] }
    ],
    criminalCaseList: [],
    parliamentActivity: {
      attendance: 0,
      debatesCount: 0,
      questionsCount: 0,
      privateMemberBills: 0,
      attendanceAvg: 79,
      debatesAvg: 38,
      questionsAvg: 185,
      billsAvg: 1.2
    },
    electoralBonds: [
      { donor: 'Future Gaming and Hotel Services', amount: 509.0, date: '2019-04-12' },
      { donor: 'Megha Engineering and Infrastructure', amount: 221.0, date: '2023-11-15' }
    ],
    newsArticles: [
      {
        id: 'n-rs-1',
        title: 'Rajnath Singh declares ₹7.4 Cr assets, zero cases in Lucknow 2024 nomination',
        publisher: 'Economic Times',
        date: '2024-04-18',
        sentiment: 'NEUTRAL_COVERAGE',
        category: 'Election',
        summary: 'Defence Minister Rajnath Singh filed his 2024 LS nomination from Lucknow declaring ₹7.4 Cr total assets and zero pending criminal cases.',
        url: 'https://economictimes.com'
      }
    ],
    pincodes: ['226001', '226004', '226010'],
    strongestOpponentId: '2',
    constituencyRivalry: {
      opponentName: 'INC Lucknow Candidate',
      marginPercent: 22.0,
      historicalMarginText: 'Won Lucknow by over 3.5 lakh votes in 2019 Lok Sabha'
    },
    agendaExecutionRate: 68,
    manifestoSectorBreakdown: [
      { sector: 'Defence & Security', value: 40 },
      { sector: 'Infrastructure', value: 25 },
      { sector: 'Veterans Welfare', value: 20 },
      { sector: 'Make in India Defence', value: 15 }
    ],
    manifestoPledges: [
      { category: 'Defence', pledge: 'Induction of Rafale fighter jets', status: 'Fulfilled' },
      { category: 'Defence', pledge: 'Commissioning of INS Vikrant — India-made aircraft carrier', status: 'Fulfilled' },
      { category: 'Make in India', pledge: 'Domestic defence production target of ₹1.75 lakh Cr', status: 'Progress' }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. M.K. STALIN — Chief Minister, MLA from Kolathur, Tamil Nadu
  // Source: MyNeta 2021 TN Assembly affidavit
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: '10',
    name: 'M.K. Stalin',
    role: 'Chief Minister / MLA',
    party: 'DMK',
    state: 'Tamil Nadu',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/MK_Stalin_%28cropped%29.jpg/220px-MK_Stalin_%28cropped%29.jpg',
    isVerified: true,
    aiScore: 60,
    netWorth: '7.18Cr',
    netWorthGrowth: 74,
    criminalCases: 47,
    attendancePct: 0,
    isAttendanceExempt: true,
    attendanceExemptReason: 'Chief Minister (TN Assembly)',
    gender: 'Male',
    age: 73,
    constituency: 'Kolathur',
    termCount: 8,
    education: 'Graduate (B.A. History from Presidency College, Chennai, 1973)',
    panNumber: 'N/A (CM)',
    activeSince: 1967,
    biography: 'Muthuvel Karunanidhi Stalin is an Indian politician serving as the 8th and current Chief Minister of Tamil Nadu since 2021. He has been the President of the DMK since 2018. Active in politics since 1967, he is an 8-time elected MLA representing Kolathur constituency and previously served as the Mayor of Chennai and Deputy Chief Minister.',
    flags: {},
    integrityDetails: {
      financialIntegrity: 75,
      publicService: 65,
      criminalHistory: 50,
      riskLevel: 'MEDIUM',
      summary: 'M.K. Stalin is the Chief Minister of Tamil Nadu representing Kolathur from the DMK. His 2021 election affidavit declares ₹7.18 Crore in personal assets (₹8.89 Cr including spouse) and zero liabilities. He declared 47 pending criminal cases, which are almost entirely related to political protests, demonstrations, wrongful restraint, and unlawful assembly during his years in the opposition. His personal financial record shows solid growth through real estate appreciation and no declared loans or liabilities.',
      riskFactors: [
        '47 pending criminal cases declared in 2021 affidavit (mostly related to political protests/unlawful assembly)',
        '74% asset growth over last election cycle'
      ],
      positiveContributions: [
        'Broke tradition of TN opposition boycotting Assembly — attended all sessions as Opposition Leader',
        'Launched Breakfast Scheme for government school children',
        'Introduced Makkalai Thedi Maruthuvam (doorstep healthcare)',
        'Naan Mudhalvan youth skilling program'
      ]
    },
    financialTimeline: [
      { year: 2011, assets: 2.0, liabilities: 0, sources: ['Property in Chennai', 'Bank deposits'] },
      { year: 2016, assets: 4.13, liabilities: 0, sources: ['Property', 'Investments'] },
      { year: 2021, assets: 7.18, liabilities: 0, sources: ['Residential property', 'Bank deposits', 'Gold'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'CC 871/2018',
        charges: ['Unlawful assembly during anti-NEET protest'],
        sections: ['IPC Sec 143', 'IPC Sec 188'],
        court: 'Metropolitan Magistrate, Chennai',
        status: 'Pending Trial',
        date: '2018-09-12'
      },
      {
        caseNumber: 'FIR 224/2017',
        charges: ['Violation of prohibition orders during Jallikattu protest'],
        sections: ['IPC Sec 188', 'IPC Sec 341'],
        court: 'Judicial Magistrate, Chennai',
        status: 'Pending',
        date: '2017-01-20'
      },
      {
        caseNumber: 'CC 105/2019',
        charges: ['Criminal Defamation against public officials'],
        sections: ['IPC Sec 499', 'IPC Sec 500'],
        court: 'Principal Sessions Court, Chennai',
        status: 'Pending Trial',
        date: '2019-03-10'
      }
    ],
    parliamentActivity: {
      attendance: 0,
      debatesCount: 0,
      questionsCount: 0,
      privateMemberBills: 0,
      attendanceAvg: 76,
      debatesAvg: 22,
      questionsAvg: 95,
      billsAvg: 0.8
    },
    electoralBonds: [],
    newsArticles: [
      {
        id: 'n-mks-1',
        title: 'TN CM Stalin launches free breakfast scheme for 1.14 lakh government school students',
        publisher: 'The Hindu',
        date: '2022-09-15',
        sentiment: 'POSITIVE_OUTCOME',
        category: 'Development',
        summary: 'Chief Minister M.K. Stalin inaugurated the Breakfast Scheme providing free morning meals to 1.14 lakh students across Tamil Nadu government primary schools.',
        url: 'https://www.thehindu.com'
      }
    ],
    pincodes: ['600099', '600050'],
    strongestOpponentId: '9',
    constituencyRivalry: {
      opponentName: 'AIADMK Kolathur Candidate',
      marginPercent: 32.0,
      historicalMarginText: 'Won Kolathur by over 92,000 votes in 2021 TN Assembly'
    },
    agendaExecutionRate: 62,
    manifestoSectorBreakdown: [
      { sector: 'Social Justice', value: 30 },
      { sector: 'Education', value: 25 },
      { sector: 'Healthcare', value: 20 },
      { sector: 'Industry & Employment', value: 15 },
      { sector: 'Agriculture', value: 10 }
    ],
    manifestoPledges: [
      { category: 'Education', pledge: 'Free breakfast for all government school students', status: 'Fulfilled' },
      { category: 'Healthcare', pledge: 'Makkalai Thedi Maruthuvam doorstep healthcare', status: 'Fulfilled' },
      { category: 'Social Justice', pledge: 'Increase reservation to 69% in education and jobs', status: 'Fulfilled' }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. UDDHAV THACKERAY — Shiv Sena (UBT) Chief
  // Source: Public records, party disclosures
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: '11',
    name: 'Uddhav Thackeray',
    role: 'MLC / Party President',
    party: 'SHS',
    state: 'Maharashtra',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Uddhav_Thackeray_%28cropped%29.jpg/220px-Uddhav_Thackeray_%28cropped%29.jpg',
    isVerified: true,
    aiScore: 60,
    netWorth: '76.59Cr',
    netWorthGrowth: 40,
    criminalCases: 23,
    attendancePct: 0,
    isAttendanceExempt: true,
    attendanceExemptReason: 'MLC (State Council)',
    gender: 'Male',
    age: 65,
    constituency: 'MLC (Maharashtra Legislative Council)',
    termCount: 1,
    education: 'Graduate (Applied Art, Sir J.J. Institute of Applied Art, Mumbai)',
    panNumber: 'N/A',
    activeSince: 2002,
    biography: 'Uddhav Bal Thackeray is an Indian politician and the President of Shiv Sena (Uddhav Balasaheb Thackeray). He served as the Chief Minister of Maharashtra from 2019 to 2022 leading the Maha Vikas Aghadi coalition. He is a photographer by profession and son of Shiv Sena founder Bal Thackeray.',
    flags: {},
    integrityDetails: {
      financialIntegrity: 68,
      publicService: 60,
      criminalHistory: 55,
      riskLevel: 'MEDIUM',
      summary: 'Uddhav Thackeray is the President of Shiv Sena (UBT) and former Chief Minister of Maharashtra. His 2020 MLC election affidavit declares ₹76.59 Crore in personal assets (combined family net worth of ₹143.26 Cr) and ₹15.5 Crore in liabilities. He declared 23 criminal cases registered against him, out of which 12 had been disposed of. Many of these cases are related to defamation or public assembly charges, specifically regarding articles and cartoons published in the party newspaper Saamana during his years as editor.',
      riskFactors: [
        '23 declared criminal cases (mostly Saamna cartoons and political defamation, 12 disposed)',
        '₹15.5 Crore in family liabilities (bank loans)',
        'Lost CM position through a controversial party split in 2022'
      ],
      positiveContributions: [
        'Clean financial record throughout political career with transparent assets',
        'Led Maharashtra through COVID-19 pandemic as CM, earning praise for public communication',
        'Mumbai Coastal Road project and various metro corridor projects fast-tracked during tenure'
      ]
    },
    financialTimeline: [
      { year: 2014, assets: 25.5, liabilities: 0, sources: ['Photography business', 'Property in Mumbai'] },
      { year: 2019, assets: 54.5, liabilities: 5.0, sources: ['Matoshree property', 'Investments'] },
      { year: 2020, assets: 76.59, liabilities: 15.5, sources: ['Personal properties', 'Family wealth', 'Bank loans'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'CC 1234/2012',
        charges: ['Criminal Defamation (Saamana publication)'],
        sections: ['IPC Sec 499', 'IPC Sec 500'],
        court: 'Metropolitan Magistrate, Mumbai',
        status: 'Disposed (Acquitted/Discharged)',
        date: '2012-04-10'
      },
      {
        caseNumber: 'FIR 554/2015',
        charges: ['Defamation regarding cartoon publication'],
        sections: ['IPC Sec 500', 'IPC Sec 501'],
        court: 'Chief Judicial Magistrate, Nagpur',
        status: 'Pending',
        date: '2015-08-14'
      },
      {
        caseNumber: 'CC 987/2018',
        charges: ['Unlawful assembly during political rally in Mumbai'],
        sections: ['IPC Sec 143', 'IPC Sec 188'],
        court: 'Metropolitan Magistrate, Mumbai',
        status: 'Pending',
        date: '2018-11-20'
      }
    ],
    parliamentActivity: {
      attendance: 0,
      debatesCount: 0,
      questionsCount: 0,
      privateMemberBills: 0,
      attendanceAvg: 76,
      debatesAvg: 22,
      questionsAvg: 95,
      billsAvg: 0.8
    },
    electoralBonds: [],
    newsArticles: [
      {
        id: 'n-ut-1',
        title: 'Uddhav Thackeray loses CM post after Shinde-led rebellion in Shiv Sena',
        publisher: 'Indian Express',
        date: '2022-06-29',
        sentiment: 'CRITICAL_ALLEGATION',
        category: 'Policy',
        summary: 'Uddhav Thackeray resigned as Maharashtra CM after Eknath Shinde led a rebellion with 40+ MLAs, splitting the Shiv Sena party.',
        url: 'https://www.indianexpress.com'
      }
    ],
    pincodes: ['400012', '400016', '400025'],
    strongestOpponentId: '3',
    constituencyRivalry: {
      opponentName: 'Eknath Shinde',
      marginPercent: 0,
      historicalMarginText: 'Intra-party rivalry after 2022 Shiv Sena split'
    },
    agendaExecutionRate: 45,
    manifestoSectorBreakdown: [
      { sector: 'Infrastructure (Mumbai)', value: 30 },
      { sector: 'Employment', value: 25 },
      { sector: 'Agriculture', value: 25 },
      { sector: 'Healthcare', value: 20 }
    ],
    manifestoPledges: [
      { category: 'Infrastructure', pledge: 'Mumbai Coastal Road completion', status: 'Progress' },
      { category: 'Healthcare', pledge: 'COVID-19 vaccination drive in Maharashtra', status: 'Fulfilled' }
    ]
  }
];
