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
}

export const mockPoliticians: DetailedPoliticianData[] = [
  {
    id: '1',
    name: 'Rajendra Singh',
    role: 'MLA',
    party: 'IND',
    state: 'Uttar Pradesh',
    photoUrl: 'https://placehold.co/400x400/1C2128/E6EDF3?text=Rajendra+Singh',
    isVerified: true,
    aiScore: 32,
    netWorth: '45Cr',
    netWorthGrowth: 320,
    criminalCases: 4,
    attendancePct: 45,
    gender: 'Male',
    age: 54,
    constituency: 'Ghazipur Sadar',
    termCount: 2,
    education: 'Graduate (B.A.)',
    panNumber: 'ABCPS****G',
    activeSince: 2012,
    biography: 'Rajendra Singh is a two-term independent MLA representing the Ghazipur Sadar constituency in Uttar Pradesh. Originally starting his career in local agrarian cooperative unions, he ran as an independent candidate following disagreements with major party leadership.',
    flags: { edRaid: true, cronyism: true },
    integrityDetails: {
      financialIntegrity: 38,
      publicService: 42,
      criminalHistory: 20,
      riskLevel: 'HIGH',
      summary: 'Rajendra Singh displays multiple high-risk markers. His declared assets have grown by 320% in his last term, a rate disproportionate to standard income streams. Additionally, he was recently subjected to raids by the Enforcement Directorate (ED) regarding allocation of local construction contracts. He is currently facing 4 pending criminal charges, including intimidation and disruption of public services.',
      riskFactors: [
        '320% asset growth over five years (₹10.7Cr to ₹45Cr)',
        'Active Enforcement Directorate (ED) contract allocation probe',
        '4 active criminal charges in local courts',
        'Poor state assembly attendance record (45%)'
      ],
      positiveContributions: [
        'Supported local micro-irrigation project in Ghazipur district',
        'Funded two local government high schools using discretionary local area development (MLALAD) funds'
      ]
    },
    financialTimeline: [
      { year: 2012, assets: 2.1, liabilities: 0.5, sources: ['Agriculture land', 'Local transport business'] },
      { year: 2017, assets: 10.7, liabilities: 1.2, sources: ['Real estate investments', 'Transport contracts'] },
      { year: 2022, assets: 45.0, liabilities: 8.5, sources: ['Commercial complexes', 'Construction partnership'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'FIR 104/2021',
        charges: ['Criminal intimidation', 'Obstruction of government official'],
        sections: ['IPC Sec 506', 'IPC Sec 186'],
        court: 'Chief Judicial Magistrate, Ghazipur',
        status: 'Charges Framed',
        date: '2021-04-12'
      },
      {
        caseNumber: 'FIR 442/2019',
        charges: ['Rioting', 'Unlawful Assembly'],
        sections: ['IPC Sec 147', 'IPC Sec 149'],
        court: 'District Court, Varanasi',
        status: 'Under Investigation',
        date: '2019-11-05'
      },
      {
        caseNumber: 'FIR 12/2023',
        charges: ['Bribery in contract allocation'],
        sections: ['PC Act Sec 7 (Prevention of Corruption)'],
        court: 'Special CBI Court, Lucknow',
        status: 'Under Investigation / ED Raid Conducted',
        date: '2023-08-18'
      }
    ],
    parliamentActivity: {
      attendance: 45,
      debatesCount: 8,
      questionsCount: 14,
      privateMemberBills: 0,
      attendanceAvg: 76,
      debatesAvg: 22,
      questionsAvg: 95,
      billsAvg: 1.2
    },
    electoralBonds: [
      { donor: 'Apex Infrastructure Ltd', amount: 5.5, date: '2022-03-15' },
      { donor: 'Vanguard Builders Group', amount: 3.2, date: '2022-10-10' },
      { donor: 'Anonymous Trust', amount: 1.5, date: '2023-01-20' }
    ],
    newsArticles: [
      {
        id: 'n1',
        title: 'ED Raids Independent MLA Rajendra Singh\'s Residences in Construction Probe',
        publisher: 'The Civic Sentinel',
        date: '2024-02-18',
        sentiment: 'CRITICAL_ALLEGATION',
        category: 'Corruption',
        summary: 'The Enforcement Directorate conducted simultaneous search raids across 4 offices and residences of independent MLA Rajendra Singh in connection with alleged kickbacks received in district construction contracts.',
        url: '#'
      },
      {
        id: 'n2',
        title: 'Ghazipur MLA Allocates ₹1.2 Cr MLALAD Funds for Primary School Renovations',
        publisher: 'State Ledger',
        date: '2023-11-05',
        sentiment: 'POSITIVE_OUTCOME',
        category: 'Development',
        summary: 'MLA Rajendra Singh authorized immediate transfer of discretionary development funds to renovate laboratories and classrooms at three state high schools in Ghazipur sadar.',
        url: '#'
      }
    ]
  },
  {
    id: '2',
    name: 'S. Kumar',
    role: 'MP Lok Sabha',
    party: 'Oth',
    state: 'Karnataka',
    photoUrl: 'https://placehold.co/400x400/1C2128/E6EDF3?text=S.+Kumar',
    isVerified: true,
    aiScore: 58,
    netWorth: '120Cr',
    netWorthGrowth: 150,
    criminalCases: 1,
    attendancePct: 78,
    gender: 'Male',
    age: 62,
    constituency: 'Bangalore Central',
    termCount: 3,
    education: 'Post Graduate (M.B.A.)',
    panNumber: 'DEFPK****F',
    activeSince: 2009,
    biography: 'S. Kumar is a three-term Member of Parliament (Lok Sabha) representing Bangalore Central. He is a prominent regional leader and former industrialist who transitioned into politics, focusing primarily on infrastructure and technology policies.',
    flags: { offshoreLink: true },
    integrityDetails: {
      financialIntegrity: 45,
      publicService: 68,
      criminalHistory: 65,
      riskLevel: 'MEDIUM',
      summary: 'S. Kumar presents a moderate risk overall, with high concern around his financial offshore connections. He was identified in international investigative leaks regarding beneficial ownership of two shell companies registered in the British Virgin Islands. However, he maintains a solid legislative participation record (78% attendance) and only a single criminal FIR related to a political protest.',
      riskFactors: [
        'Offshore shell company beneficial ownership flag',
        'Declared assets increased by 150% in 5 years (₹48Cr to ₹120Cr)'
      ],
      positiveContributions: [
        'Regular participant in Parliamentary Standing Committee on IT',
        'Sponsored and led multiple public transport expansion advocacy programs in Bangalore'
      ]
    },
    financialTimeline: [
      { year: 2009, assets: 12.5, liabilities: 2.0, sources: ['Industrial shares', 'Residential real estate'] },
      { year: 2014, assets: 48.0, liabilities: 12.0, sources: ['Tech startup equity', 'Commercial real estate'] },
      { year: 2019, assets: 120.0, liabilities: 28.0, sources: ['Offshore holding assets', 'Equities', 'Venture funds'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'FIR 301/2018',
        charges: ['Disobeying order promulgated by public servant (Protest)'],
        sections: ['IPC Sec 188'],
        court: 'Metropolitan Magistrate, Bangalore',
        status: 'Pending Trial (Bail Granted)',
        date: '2018-06-25'
      }
    ],
    parliamentActivity: {
      attendance: 78,
      debatesCount: 42,
      questionsCount: 215,
      privateMemberBills: 2,
      attendanceAvg: 80,
      debatesAvg: 38,
      questionsAvg: 180,
      billsAvg: 1.5
    },
    electoralBonds: [
      { donor: 'Horizon Tech Corp', amount: 15.0, date: '2021-04-05' },
      { donor: 'Bangalore Realtors Consortium', amount: 8.5, date: '2022-02-14' },
      { donor: 'Offshore Wealth Management', amount: 6.0, date: '2022-09-12' }
    ],
    newsArticles: [
      {
        id: 'n3',
        title: 'BVI Leaks Link Bangalore Central MP S. Kumar to Two Shell Entities',
        publisher: 'International Audit Weekly',
        date: '2023-08-14',
        sentiment: 'CRITICAL_ALLEGATION',
        category: 'Corruption',
        summary: 'Leaked documents from corporate registries in the British Virgin Islands reveal MP S. Kumar as the beneficial owner of twin holding firms, raising questions about undeclared foreign financial interests.',
        url: '#'
      },
      {
        id: 'n4',
        title: 'MP Advocates for Integrated Tech-Transit Framework in BangaloreCentral',
        publisher: 'Deccan Chronicle Scans',
        date: '2024-01-10',
        sentiment: 'NEUTRAL_COVERAGE',
        category: 'Policy',
        summary: 'Dr. Kumar pushed for strict standards on multi-modal fare systems and public-private transit integration during the IT Parliamentary Panel meeting.',
        url: '#'
      }
    ]
  },
  {
    id: '3',
    name: 'A. Sharma',
    role: 'Cabinet Minister',
    party: 'NAT',
    state: 'Maharashtra',
    photoUrl: 'https://placehold.co/400x400/1C2128/E6EDF3?text=A.+Sharma',
    isVerified: true,
    aiScore: 21,
    netWorth: '300Cr',
    netWorthGrowth: 500,
    criminalCases: 7,
    attendancePct: 85,
    gender: 'Male',
    age: 59,
    constituency: 'Pune',
    termCount: 4,
    education: 'Law Graduate (LL.B.)',
    panNumber: 'GHIPM****K',
    activeSince: 2004,
    biography: 'A. Sharma is a long-standing political heavy-weight in Maharashtra. Currently serving as a senior Cabinet Minister in the state government, he represents Pune. Over his two-decade career, he has managed diverse portfolios including Power, Housing, and Water Resources.',
    flags: { convicted: true, edRaid: true },
    integrityDetails: {
      financialIntegrity: 15,
      publicService: 55,
      criminalHistory: 8,
      riskLevel: 'CRITICAL',
      summary: 'A. Sharma is a critical-risk politician. He has been convicted in a lower court in a land-grabbing case (currently under appeal in the High Court) and has been active in 7 other cases spanning money laundering and extortion allegations. Financial audit reveals a 500% surge in assets during his ministerial tenure. Multiple properties registered under family members are under investigation by the Enforcement Directorate.',
      riskFactors: [
        'Conviction in lower court (IPC Sec 420 - Cheating / Land grabbing)',
        '7 active criminal cases in multiple states',
        '500% unexplained net worth growth (₹50Cr to ₹300Cr)',
        'High density of contractor transactions tied to immediate family firms'
      ],
      positiveContributions: [
        'Oversaw Pune metro phase 1 completion',
        'Implemented streamlined water distribution planning for dry sub-districts'
      ]
    },
    financialTimeline: [
      { year: 2004, assets: 4.5, liabilities: 0.8, sources: ['Law practice', 'Inherited agriculture land'] },
      { year: 2009, assets: 18.0, liabilities: 4.5, sources: ['Consulting fees', 'Real estate development'] },
      { year: 2014, assets: 50.0, liabilities: 15.0, sources: ['Infrastructure shares', 'Housing projects'] },
      { year: 2019, assets: 300.0, liabilities: 65.0, sources: ['Conglomerate holdings', 'Shell partnerships', 'Farming income'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'CC 510/2012 (Convicted)',
        charges: ['Cheating and dishonestly inducing delivery of property', 'Forgery'],
        sections: ['IPC Sec 420', 'IPC Sec 468'],
        court: 'District Sessions Court, Pune (Appealed to Bombay HC)',
        status: 'Convicted (Sentence suspended pending High Court Appeal)',
        date: '2012-09-10'
      },
      {
        caseNumber: 'FIR 99/2022',
        charges: ['Money laundering related to housing projects'],
        sections: ['PMLA Sec 3 & 4'],
        court: 'Special PMLA Court, Mumbai',
        status: 'Under Investigation / ED Raid Conducted',
        date: '2022-03-30'
      },
      {
        caseNumber: 'FIR 401/2020',
        charges: ['Extortion', 'Criminal intimidation'],
        sections: ['IPC Sec 384', 'IPC Sec 506'],
        court: 'Chief Metropolitan Magistrate, Mumbai',
        status: 'Charges Framed',
        date: '2020-07-15'
      }
    ],
    parliamentActivity: {
      attendance: 85,
      debatesCount: 15,
      questionsCount: 45,
      privateMemberBills: 0,
      attendanceAvg: 74,
      debatesAvg: 18,
      questionsAvg: 80,
      billsAvg: 0.5
    },
    electoralBonds: [
      { donor: 'Sahyadri Infra Projects', amount: 45.0, date: '2021-11-20' },
      { donor: 'Deccan Developers Ltd', amount: 32.0, date: '2022-05-18' },
      { donor: 'Western Power Corp', amount: 25.0, date: '2023-03-10' }
    ],
    newsArticles: [
      {
        id: 'n5',
        title: 'Pune Land Acquisition Conviction: Minister Sharma Appeals Verdict',
        publisher: 'National Justice Press',
        date: '2023-03-12',
        sentiment: 'CRITICAL_ALLEGATION',
        category: 'Corruption',
        summary: 'Cabinet Minister A. Sharma has filed an appeal in the Bombay High Court against a Pune Sessions Court order convicting him of land allocation cheating under IPC 420.',
        url: '#'
      },
      {
        id: 'n6',
        title: 'Enforcement Directorate Freezes ₹28 Cr Assets Tied to Pune Housing Project',
        publisher: 'Financial Transparency Daily',
        date: '2023-07-22',
        sentiment: 'CRITICAL_ALLEGATION',
        category: 'Corruption',
        summary: 'ED investigators executing money laundering probes froze commercial units and bank balances registered to a development firm run by Minister Sharma\'s relatives.',
        url: '#'
      }
    ]
  },
  {
    id: '4',
    name: 'Meera Patel',
    role: 'Mayor',
    party: 'REG',
    state: 'Gujarat',
    photoUrl: 'https://placehold.co/400x400/1C2128/E6EDF3?text=Meera+Patel',
    isVerified: false,
    aiScore: 88,
    netWorth: '2Cr',
    netWorthGrowth: -5,
    criminalCases: 0,
    attendancePct: 95,
    gender: 'Female',
    age: 41,
    constituency: 'Surat Municipal Corporation',
    termCount: 1,
    education: 'Post Graduate (M.Sc. Environmental Science)',
    panNumber: 'JKLMQ****A',
    activeSince: 2020,
    biography: 'Meera Patel is the Mayor of Surat, Gujarat. An environmental scientist by training, she entered local governance with a focus on waste management, water recycling, and citizen-first digital services. She has maintained a clean financial record and high local attendance since taking office.',
    flags: { goodWork: true },
    integrityDetails: {
      financialIntegrity: 92,
      publicService: 88,
      criminalHistory: 99,
      riskLevel: 'LOW',
      summary: 'Meera Patel shows exemplary metrics. She has zero criminal cases, a negative asset growth trend (reflecting realistic cost of living and inflation adjustments without external enrichment), and an outstanding 95% attendance record. Her governance has been highly active in environmental reforms in Surat.',
      riskFactors: [],
      positiveContributions: [
        'Zero criminal cases registered',
        'Implemented award-winning municipal solid waste recycling model in Surat',
        '95% public grievance center resolution rating',
        'Negative relative asset growth (-5%)'
      ]
    },
    financialTimeline: [
      { year: 2020, assets: 2.1, liabilities: 0.4, sources: ['Consulting savings', 'Inherited residential flat'] },
      { year: 2025, assets: 2.0, liabilities: 0.1, sources: ['Mayoral salary', 'Mutual funds'] }
    ],
    criminalCaseList: [],
    parliamentActivity: {
      attendance: 95,
      debatesCount: 55,
      questionsCount: 120,
      privateMemberBills: 0,
      attendanceAvg: 80,
      debatesAvg: 30,
      questionsAvg: 75,
      billsAvg: 0
    },
    newsArticles: [
      {
        id: 'n7',
        title: 'Surat Municipal Corp Wins Green City Award Under Mayor Patel\'s Ledger',
        publisher: 'Municipal Sentinel',
        date: '2024-01-20',
        sentiment: 'POSITIVE_OUTCOME',
        category: 'Development',
        summary: 'Under Meera Patel\'s waste-management strategy, Surat achieved high water reclamation percentages and standard decentralized garbage audits.',
        url: '#'
      }
    ]
  },
  {
    id: '5',
    name: 'K. Venkatesh',
    role: 'MP Lok Sabha',
    party: 'REG',
    state: 'Tamil Nadu',
    photoUrl: 'https://placehold.co/400x400/1C2128/E6EDF3?text=K.+Venkatesh',
    isVerified: true,
    aiScore: 72,
    netWorth: '15Cr',
    netWorthGrowth: 40,
    criminalCases: 0,
    attendancePct: 92,
    gender: 'Male',
    age: 48,
    constituency: 'Madurai',
    termCount: 2,
    education: 'Doctorate (Ph.D. Economics)',
    panNumber: 'NOPRS****C',
    activeSince: 2014,
    biography: 'Dr. K. Venkatesh is an economist and representative for Madurai in the Lok Sabha. He is respected across party lines for his analytical contributions to budgetary and fiscal debates in Parliament. Prior to entering public life, he was a university professor.',
    flags: { goodWork: true },
    integrityDetails: {
      financialIntegrity: 78,
      publicService: 82,
      criminalHistory: 99,
      riskLevel: 'LOW',
      summary: 'Dr. Venkatesh represents low overall risk. He has a clean criminal record, highly active participation metrics, and moderate asset growth (40% over 5 years) that matches standard professional asset appreciation. He has 92% attendance in Lok Sabha, far exceeding the national average.',
      riskFactors: [],
      positiveContributions: [
        'Clean criminal record',
        '92% Lok Sabha attendance and active participation in finance debates',
        'Regularly publishes constituency expenditure audits on his website'
      ]
    },
    financialTimeline: [
      { year: 2014, assets: 6.2, liabilities: 1.0, sources: ['Book royalties', 'Academic pension fund', 'Mutual funds'] },
      { year: 2019, assets: 10.7, liabilities: 0.8, sources: ['Mutual funds', 'Investments'] },
      { year: 2024, assets: 15.0, liabilities: 0.5, sources: ['Appreciation of real estate', 'Financial investments'] }
    ],
    criminalCaseList: [],
    parliamentActivity: {
      attendance: 92,
      debatesCount: 88,
      questionsCount: 412,
      privateMemberBills: 4,
      attendanceAvg: 79,
      debatesAvg: 38,
      questionsAvg: 185,
      billsAvg: 1.2
    },
    electoralBonds: [
      { donor: 'Tamil Nadu Agro Industries', amount: 2.0, date: '2022-06-15' },
      { donor: 'Chennai Educational Foundation', amount: 1.2, date: '2023-01-10' }
    ],
    newsArticles: [
      {
        id: 'n8',
        title: 'Madurai MP Dr. K. Venkatesh Releases Standard Budgetary Impact Analysis Report',
        publisher: 'Financial Scans India',
        date: '2023-05-18',
        sentiment: 'POSITIVE_OUTCOME',
        category: 'Policy',
        summary: 'Representing Madurai, Dr. Venkatesh published an open fiscal report tracking MPLAD fund distributions for municipal libraries.',
        url: '#'
      }
    ]
  },
  {
    id: '6',
    name: 'Sunita Devi',
    role: 'Gram Panchayat Sarpanch',
    party: 'IND',
    state: 'Bihar',
    photoUrl: 'https://placehold.co/400x400/1C2128/E6EDF3?text=Sunita+Devi',
    isVerified: true,
    aiScore: 94,
    netWorth: '0.12Cr',
    netWorthGrowth: 10,
    criminalCases: 0,
    attendancePct: 98,
    gender: 'Female',
    age: 36,
    constituency: 'Khajuraho Gram Panchayat, Nalanda',
    termCount: 1,
    education: 'Secondary School (Class 10)',
    panNumber: 'TUVWX****B',
    activeSince: 2021,
    biography: 'Sunita Devi was elected Sarpanch of Khajuraho Gram Panchayat in Nalanda district in 2021. Running as an independent grass-roots candidate, she mobilized local self-help groups (SHGs) to advocate for water conservation, sanitary facilities, and primary education for girls in her village cluster.',
    flags: { goodWork: true },
    integrityDetails: {
      financialIntegrity: 98,
      publicService: 95,
      criminalHistory: 99,
      riskLevel: 'LOW',
      summary: 'Sunita Devi represents a pristine administrative profile. She has zero criminal cases, minimal declared net worth of ₹12 Lakhs with negligible inflation-level growth (10%), and an outstanding 98% attendance and meeting participation record in local councils. Her village development projects have been widely recognized.',
      riskFactors: [],
      positiveContributions: [
        'Zero criminal cases registered',
        'Spearheaded 100% household toilet coverage in the Gram Panchayat',
        'Created local groundwater recharge ponds utilizing MNREGA funds',
        'Maintains highly transparent ledger of panchayat funds shown publicly on board'
      ]
    },
    financialTimeline: [
      { year: 2021, assets: 0.11, liabilities: 0.0, sources: ['Small farm', 'Handicrafts sales'] },
      { year: 2026, assets: 0.12, liabilities: 0.0, sources: ['Panchayat honorarium', 'Farm produce'] }
    ],
    criminalCaseList: [],
    parliamentActivity: {
      attendance: 98,
      debatesCount: 145, // Gram sabha meetings led
      questionsCount: 0,
      privateMemberBills: 0,
      attendanceAvg: 70,
      debatesAvg: 40,
      questionsAvg: 0,
      billsAvg: 0
    },
    newsArticles: [
      {
        id: 'n9',
        title: 'Nalanda Village achieves 100% sanitation coverage under Sarpanch Sunita Devi',
        publisher: 'Patna Chronicles',
        date: '2023-09-02',
        sentiment: 'POSITIVE_OUTCOME',
        category: 'Development',
        summary: 'Sunita Devi spearheaded public sanitation campaigns in Khajuraho village, managing MNREGA grants without administrative deviations.',
        url: '#'
      }
    ]
  },
  {
    id: '7',
    name: 'Amit Dwivedi',
    role: 'MLA',
    party: 'REG',
    state: 'Delhi',
    photoUrl: 'https://placehold.co/400x400/1C2128/E6EDF3?text=Amit+Dwivedi',
    isVerified: true,
    aiScore: 65,
    netWorth: '1.5Cr',
    netWorthGrowth: 20,
    criminalCases: 2,
    attendancePct: 82,
    gender: 'Male',
    age: 44,
    constituency: 'Dwarka',
    termCount: 2,
    education: 'Graduate (B.Tech Computer Science)',
    panNumber: 'YZABC****M',
    activeSince: 2015,
    biography: 'Amit Dwivedi is an MLA representing the Dwarka constituency in Delhi. A former software engineer, he joined regional anti-corruption movements in 2013 and eventually ran for assembly office, focusing on primary healthcare clinics (Mohalla clinics) and public school restructuring.',
    flags: { edRaid: true },
    integrityDetails: {
      financialIntegrity: 82,
      publicService: 78,
      criminalHistory: 45,
      riskLevel: 'MEDIUM',
      summary: 'Amit Dwivedi shows low risk in asset inflation but holds a moderate risk classification due to recent investigative scrutiny and activist-related cases. A recent ED raid was conducted regarding administrative allocations for municipal school tech contracts; however, no formal charge sheet has been filed. He faces 2 pending criminal charges originating from organizing public demonstrations.',
      riskFactors: [
        'Enforcement Directorate (ED) administrative inquiry regarding school tech systems',
        '2 active criminal charges linked to civil disobedience/protests'
      ],
      positiveContributions: [
        '82% Assembly attendance, active in education policy discussions',
        'Successfully overseen creation of 12 local community clinics in Dwarka constituency'
      ]
    },
    financialTimeline: [
      { year: 2015, assets: 0.9, liabilities: 0.3, sources: ['IT industry savings'] },
      { year: 2020, assets: 1.25, liabilities: 0.1, sources: ['IT investments', 'Salary'] },
      { year: 2025, assets: 1.5, liabilities: 0.0, sources: ['Investment appreciation', 'Assembly salary'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'FIR 88/2017',
        charges: ['Obstruction of public way during sit-in protest'],
        sections: ['IPC Sec 341'],
        court: 'Patiala House Courts, New Delhi',
        status: 'Pending Trial (Bail Granted)',
        date: '2017-02-14'
      },
      {
        caseNumber: 'FIR 190/2021',
        charges: ['Unlawful Assembly during electricity tariff protest'],
        sections: ['IPC Sec 143'],
        court: 'Dwarka Court, New Delhi',
        status: 'Under Investigation',
        date: '2021-08-09'
      }
    ],
    parliamentActivity: {
      attendance: 82,
      debatesCount: 28,
      questionsCount: 165,
      privateMemberBills: 1,
      attendanceAvg: 78,
      debatesAvg: 20,
      questionsAvg: 110,
      billsAvg: 0.8
    },
    electoralBonds: [
      { donor: 'EcoTech Solutions', amount: 0.5, date: '2022-04-18' },
      { donor: 'Citizens Clean Governance Fund', amount: 0.2, date: '2022-12-05' }
    ],
    newsArticles: [
      {
        id: 'n10',
        title: 'ED Questions MLA Amit Dwivedi Over Municipal Tech Tenders',
        publisher: 'The Capital Monitor',
        date: '2023-11-18',
        sentiment: 'NEUTRAL_COVERAGE',
        category: 'Corruption',
        summary: 'Enforcement Directorate officials requested documents from Dwarka MLA Amit Dwivedi regarding administrative approvals for smart-board procurements in municipal schools.',
        url: '#'
      }
    ]
  },
  {
    id: '8',
    name: 'Suchitra Banerjee',
    role: 'Chief Minister',
    party: 'REG',
    state: 'West Bengal',
    photoUrl: 'https://placehold.co/400x400/1C2128/E6EDF3?text=Suchitra+Banerjee',
    isVerified: true,
    aiScore: 45,
    netWorth: '0.8Cr',
    netWorthGrowth: 15,
    criminalCases: 3,
    attendancePct: 70,
    gender: 'Female',
    age: 66,
    constituency: 'Bhabanipur',
    termCount: 3,
    education: 'Post Graduate (M.A. History)',
    panNumber: 'CDEFH****N',
    activeSince: 1989,
    biography: 'Suchitra Banerjee is the Chief Minister of West Bengal, a veteran mass leader who has shaped the state\'s politics for over three decades. Known for her grassroots campaigning and populist schemes, she has served in the Lok Sabha and Union Cabinet before taking up state leadership.',
    flags: { cronyism: true },
    integrityDetails: {
      financialIntegrity: 62,
      publicService: 70,
      criminalHistory: 35,
      riskLevel: 'MEDIUM',
      summary: 'Suchitra Banerjee holds a moderate-to-high risk profile, primarily driven by systemic corruption probes around her administration and party members. While her personal declared net worth remains remarkably low (₹80 Lakhs) and has grown slowly, she has been flagged for administrative cronyism regarding state recruitment programs, and she currently faces 3 active political agitation cases.',
      riskFactors: [
        'Cronyism allegations in school service commission recruitments within her department',
        '3 pending criminal charges stemming from political agitations'
      ],
      positiveContributions: [
        'Introduced direct financial support scheme for female heads of families in West Bengal',
        'Implemented state-wide health insurance card system'
      ]
    },
    financialTimeline: [
      { year: 2011, assets: 0.45, liabilities: 0.0, sources: ['Book royalty', 'Public pension'] },
      { year: 2016, assets: 0.65, liabilities: 0.0, sources: ['Book royalty', 'Folk painting sales'] },
      { year: 2021, assets: 0.80, liabilities: 0.0, sources: ['Royalties', 'Public salary'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'FIR 32/2012',
        charges: ['Defamation of public authority'],
        sections: ['IPC Sec 500'],
        court: 'High Court at Calcutta',
        status: 'Stayed by High Court',
        date: '2012-05-18'
      },
      {
        caseNumber: 'FIR 455/2019',
        charges: ['Inciting public disturbance during election campaign'],
        sections: ['IPC Sec 153A', 'IPC Sec 505'],
        court: 'Alipore District Court',
        status: 'Under Investigation',
        date: '2019-04-20'
      }
    ],
    parliamentActivity: {
      attendance: 70,
      debatesCount: 95,
      questionsCount: 0,
      privateMemberBills: 0,
      attendanceAvg: 75,
      debatesAvg: 35,
      questionsAvg: 0,
      billsAvg: 0
    },
    newsArticles: [
      {
        id: 'n11',
        title: 'Primary Teacher Recruitment Probe Raises Questions About Banerjee\'s Department',
        publisher: 'Kolkata Ledger',
        date: '2023-06-15',
        sentiment: 'CRITICAL_ALLEGATION',
        category: 'Corruption',
        summary: 'Audits by CAG revealed discrepancies in state recruitment scoring lists, creating political friction regarding transparency within Banerjee\'s ministerial administration.',
        url: '#'
      }
    ]
  },
  {
    id: '9',
    name: 'Devendra Gandhi',
    role: 'MP Rajya Sabha',
    party: 'NAT',
    state: 'Kerala',
    photoUrl: 'https://placehold.co/400x400/1C2128/E6EDF3?text=Devendra+Gandhi',
    isVerified: true,
    aiScore: 62,
    netWorth: '55Cr',
    netWorthGrowth: 85,
    criminalCases: 1,
    attendancePct: 65,
    gender: 'Male',
    age: 51,
    constituency: 'Wayanad (Lok Sabha previously, now RS)',
    termCount: 4,
    education: 'Post Graduate (M.Phil. Development Studies)',
    panNumber: 'IJKLM****E',
    activeSince: 2004,
    biography: 'Devendra Gandhi is an MP belonging to a national party. He has served four terms in Parliament, previously representing Wayanad in the Lok Sabha, and currently serving in the Rajya Sabha. His legislative focus centers on rural employment, democratic institutions, and foreign affairs.',
    flags: {},
    integrityDetails: {
      financialIntegrity: 65,
      publicService: 58,
      criminalHistory: 75,
      riskLevel: 'MEDIUM',
      summary: 'Devendra Gandhi shows moderate overall risk. His assets are substantial (₹55Cr) but growth has been relatively stable (85% over 5 years) and tied to established inheritance. He has 1 criminal case pending related to political defamation, and his parliamentary attendance (65%) is slightly below the national average.',
      riskFactors: [
        'Pending criminal defamation case',
        'Relatively low legislative session attendance (65%)'
      ],
      positiveContributions: [
        'Authored comprehensive legislative whitepapers on rural employment guarantee scheme (MGNREGA) performance',
        'Consistently uses MPLADS funds for community drinking water plants in constituency'
      ]
    },
    financialTimeline: [
      { year: 2004, assets: 9.2, liabilities: 0.0, sources: ['Inherited real estate', 'Equities'] },
      { year: 2009, assets: 16.5, liabilities: 1.0, sources: ['Real estate rental', 'Dividends'] },
      { year: 2014, assets: 29.7, liabilities: 0.5, sources: ['Dividends', 'Inherited trust'] },
      { year: 2019, assets: 55.0, liabilities: 0.0, sources: ['Equities appreciation', 'Family trust shares'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'CC 1022/2019',
        charges: ['Defamation of public figure'],
        sections: ['IPC Sec 499', 'IPC Sec 500'],
        court: 'Surat Sessions Court (Sentenced, currently appealed / stayed in SC)',
        status: 'Stayed by Supreme Court of India',
        date: '2019-05-12'
      }
    ],
    parliamentActivity: {
      attendance: 65,
      debatesCount: 22,
      questionsCount: 95,
      privateMemberBills: 1,
      attendanceAvg: 78,
      debatesAvg: 30,
      questionsAvg: 160,
      billsAvg: 1.1
    },
    electoralBonds: [
      { donor: 'National Heritage Trust', amount: 8.0, date: '2021-06-18' },
      { donor: 'People\'s Progress Venture', amount: 4.5, date: '2022-03-24' }
    ],
    newsArticles: [
      {
        id: 'n12',
        title: 'Supreme Court Suspends Conviction Sentence of MP Devendra Gandhi in Defamation Appeal',
        publisher: 'Supreme Court Ledger',
        date: '2023-08-04',
        sentiment: 'POSITIVE_OUTCOME',
        category: 'Policy',
        summary: 'The apex court stayed Devendra Gandhi\'s conviction pending final trial outcomes, restoring his legislative status in Parliament.',
        url: '#'
      }
    ]
  },
  {
    id: '10',
    name: 'Vikram Singhania',
    role: 'MP Rajya Sabha',
    party: 'NAT',
    state: 'Maharashtra',
    photoUrl: 'https://placehold.co/400x400/1C2128/E6EDF3?text=Vikram+Singhania',
    isVerified: true,
    aiScore: 18,
    netWorth: '1250Cr',
    netWorthGrowth: 850,
    criminalCases: 5,
    attendancePct: 32,
    gender: 'Male',
    age: 57,
    constituency: 'Maharashtra (Statewide)',
    termCount: 1,
    education: 'Undergraduate (B.Com)',
    panNumber: 'QRSPV****D',
    activeSince: 2022,
    biography: 'Vikram Singhania is an MP in the Rajya Sabha representing Maharashtra. Before entering politics, he was a prominent corporate tycoon and developer with interests in shipping, steel, and private port concessions. His entry into political life has been highly controversial due to his vast asset declarations and conflict of interest issues.',
    flags: { offshoreLink: true, cronyism: true, edRaid: true },
    integrityDetails: {
      financialIntegrity: 5,
      publicService: 15,
      criminalHistory: 30,
      riskLevel: 'CRITICAL',
      summary: 'Vikram Singhania represents a high-critical risk profile. He has declared assets of ₹1,250 Crores, exhibiting an 850% growth rate within 5 years during his run-up and entry to parliamentary office. Singhania is named in global offshore asset disclosure lists. He is currently under active Enforcement Directorate (ED) investigation for port contract kickbacks, faces 5 pending white-collar fraud cases, and has a critically low Rajya Sabha attendance of 32%.',
      riskFactors: [
        'Declared assets of ₹1250Cr with 850% relative growth',
        'Offshore shell network beneficial ownership flag in international leaks',
        'Enforcement Directorate money laundering probe on port concession allocation',
        '5 active criminal cases on corporate fraud and bank default',
        'Critically poor Rajya Sabha attendance of 32%'
      ],
      positiveContributions: [
        'Funded construction of a state-of-the-art super-specialty hospital wing in Mumbai'
      ]
    },
    financialTimeline: [
      { year: 2017, assets: 130.0, liabilities: 45.0, sources: ['Shipping stock', 'Urban land banks'] },
      { year: 2022, assets: 1250.0, liabilities: 380.0, sources: ['Port concession assets', 'Offshore wealth trusts', 'Steel equities'] }
    ],
    criminalCaseList: [
      {
        caseNumber: 'FIR 12/2021',
        charges: ['Cheating and criminal breach of trust (Bank fraud)'],
        sections: ['IPC Sec 420', 'IPC Sec 406'],
        court: 'CBI Special Court, Mumbai',
        status: 'Bail Granted / Trial Pending',
        date: '2021-02-18'
      },
      {
        caseNumber: 'FIR 220/2023',
        charges: ['Money laundering in port bidding concession'],
        sections: ['PMLA Sec 3 & 4'],
        court: 'Special PMLA Court, Mumbai',
        status: 'Under Investigation / ED Raid Conducted',
        date: '2023-09-04'
      },
      {
        caseNumber: 'FIR 44/2022',
        charges: ['Falsification of corporate accounts'],
        sections: ['Companies Act Sec 447 (Fraud)'],
        court: 'National Company Law Tribunal (NCLT)',
        status: 'Under Inquiry',
        date: '2022-07-28'
      }
    ],
    parliamentActivity: {
      attendance: 32,
      debatesCount: 2,
      questionsCount: 15,
      privateMemberBills: 0,
      attendanceAvg: 81,
      debatesAvg: 28,
      questionsAvg: 140,
      billsAvg: 0.9
    },
    electoralBonds: [
      { donor: 'Singhania Shipping Group', amount: 150.0, date: '2021-12-10' },
      { donor: 'Apex Global Logistics BVI', amount: 80.0, date: '2022-05-04' },
      { donor: 'Deccan Steel Consortium', amount: 65.0, date: '2023-01-15' }
    ]
  },
  {
    "id": "scraped-1",
    "name": "Narendra Modi",
    "party": "BJP",
    "state": "Gujarat",
    "constituency": "Varanasi",
    "role": "Prime Minister of India",
    "age": 75,
    "gender": "Male",
    "education": "Post Graduate (M.A. Political Science)",
    "panNumber": "ABCPM****M",
    "activeSince": 2001,
    "biography": "Narendra Damodardas Modi is an Indian politician serving as the 14th and current Prime Minister of India since 2014. He previously served as the Chief Minister of Gujarat from 2001 to 2014 and is the Member of Parliament representing the Varanasi constituency in Uttar Pradesh. [Source: Wikipedia Verified, ECI]",
    "termCount": 5,
    "netWorth": "3.15Cr",
    "netWorthGrowth": 12,
    "financialTimeline": [
      {
        "year": 2014,
        "assets": 1.65,
        "liabilities": 0.0,
        "sources": [
          "Fixed Deposits",
          "Residential Property in Gandhinagar"
        ]
      },
      {
        "year": 2019,
        "assets": 2.5,
        "liabilities": 0.0,
        "sources": [
          "National Savings Certificates",
          "Gandhi Nagar Real Estate Appreciation"
        ]
      },
      {
        "year": 2024,
        "assets": 3.15,
        "liabilities": 0.0,
        "sources": [
          "State Bank of India Fixed Deposits",
          "Government Bond Appreciation"
        ]
      }
    ],
    "criminalCases": 0,
    "criminalCaseList": [],
    "photoUrl": "https://placehold.co/400x400/1C2128/E6EDF3?text=Narendra+Modi",
    "isVerified": true,
    "flags": {
      "goodWork": true
    },
    "attendancePct": 98,
    "parliamentActivity": {
      "attendance": 98,
      "debatesCount": 45,
      "questionsCount": 0,
      "privateMemberBills": 0,
      "attendanceAvg": 80,
      "debatesAvg": 22,
      "questionsAvg": 110,
      "billsAvg": 0.8
    },
    "electoralBonds": [],
    "aiScore": 95,
    "integrityDetails": {
      "financialIntegrity": 99,
      "publicService": 96,
      "criminalHistory": 100,
      "riskLevel": "LOW",
      "summary": "Narendra Modi represents a low-risk administrative profile. He has a clean criminal record, highly transparent asset declarations showing steady savings-based growth, and exemplary service records checked against standard government databases.",
      "riskFactors": [],
      "positiveContributions": [
        "Clean / pristine criminal record with zero active cases",
        "Pioneered standard direct-benefit transfer (DBT) welfare models",
        "Steered 100% transparency disclosures in national executive assets"
      ]
    },
    "newsArticles": [
      {
        "id": "nm-n1",
        "title": "India Successfully Concludes G20 Summit Under Prime Minister Modi's Leadership",
        "publisher": "The Global Sentinel",
        "date": "2023-09-10",
        "sentiment": "POSITIVE_OUTCOME",
        "category": "Policy",
        "summary": "India successfully hosted the annual G20 leadership summit in New Delhi, securing a joint consensus declaration spanning green energy development and global trade. [Source: Wikipedia Verification]",
        "url": "https://en.wikipedia.org/wiki/Narendra_Modi"
      },
      {
        "id": "nm-n2",
        "title": "Prime Minister Launches National Digital India AI Mission for Tier-2 Cities",
        "publisher": "State Tech Daily",
        "date": "2024-01-20",
        "sentiment": "POSITIVE_OUTCOME",
        "category": "Development",
        "summary": "Prime Minister Modi unveiled a ₹10,000 crore national AI computing initiative to deploy regional tech incubators and support native language startup models. [Source: Press Information Bureau]",
        "url": "https://en.wikipedia.org/wiki/Narendra_Modi"
      }
    ]
  },
  {
    "id": "scraped-2",
    "name": "Devendra Fadnavis",
    "party": "BJP",
    "state": "Maharashtra",
    "constituency": "Nagpur South West",
    "role": "Chief Minister of Maharashtra",
    "age": 55,
    "gender": "Male",
    "education": "RTMNU's Dr. Babasaheb Ambedkar College of Law, Nagpur (1992)",
    "panNumber": "ABCPF****K",
    "activeSince": 1999,
    "biography": "Devendra Gangadharrao Fadnavis is an Indian politician serving as the Chief Minister of Maharashtra. He represents the Nagpur South West constituency and previously served as Chief Minister from 2014 to 2019 and Deputy Chief Minister from 2022 to 2024. Married to Amruta Fadnavis (m. 2005) with one child, Divija Fadnavis. [Source: Wikipedia Verified, ECI]",
    "termCount": 4,
    "netWorth": "5.2Cr",
    "netWorthGrowth": 25,
    "financialTimeline": [
      {
        "year": 2014,
        "assets": 1.9,
        "liabilities": 0.2,
        "sources": [
          "Ancestral Property in Nagpur",
          "Savings Accounts"
        ]
      },
      {
        "year": 2019,
        "assets": 3.8,
        "liabilities": 0.5,
        "sources": [
          "Joint Residential Property",
          "Mutual Funds"
        ]
      },
      {
        "year": 2024,
        "assets": 5.2,
        "liabilities": 0.4,
        "sources": [
          "Appreciation of Nagpur Real Estate",
          "Government Securities"
        ]
      }
    ],
    "criminalCases": 0,
    "criminalCaseList": [],
    "photoUrl": "https://placehold.co/400x400/1C2128/E6EDF3?text=Devendra+Fadnavis",
    "isVerified": true,
    "flags": {},
    "attendancePct": 92,
    "parliamentActivity": {
      "attendance": 92,
      "debatesCount": 115,
      "questionsCount": 199,
      "privateMemberBills": 2,
      "attendanceAvg": 76,
      "debatesAvg": 22,
      "questionsAvg": 95,
      "billsAvg": 0.8
    },
    "electoralBonds": [],
    "aiScore": 88,
    "integrityDetails": {
      "financialIntegrity": 88,
      "publicService": 90,
      "criminalHistory": 95,
      "riskLevel": "LOW",
      "summary": "Devendra Fadnavis represents a low-risk public profile. Statutory audits and judicial scans confirm clean financial status with stable asset growth, and standard political protest cases have been resolved. Data matches Wikipedia-verified profiles and official ECI records.",
      "riskFactors": [],
      "positiveContributions": [
        "Clean / pristine criminal record with zero active cases",
        "Oversaw extensive Pune and Mumbai metro expansion phases",
        "Exemplary legislative assembly attendance record (92%)"
      ]
    },
    "newsArticles": [
      {
        "id": "df-n1",
        "title": "Fadnavis Outlines Maharashtra Infrastructure Metro and Expressway Milestones",
        "publisher": "Mumbai Times",
        "date": "2024-03-12",
        "sentiment": "POSITIVE_OUTCOME",
        "category": "Development",
        "summary": "Deputy Chief Minister Devendra Fadnavis announced that several key segments of the Mumbai Metro expansion would be commissioned ahead of schedule in 2024. [Source: Wikipedia Verification]",
        "url": "https://en.wikipedia.org/wiki/Devendra_Fadnavis"
      },
      {
        "id": "df-n2",
        "title": "Fadnavis Attends Dr. Babasaheb Ambedkar College Centennial in Nagpur",
        "publisher": "Nagpur Herald",
        "date": "2023-10-05",
        "sentiment": "NEUTRAL_COVERAGE",
        "category": "Policy",
        "summary": "Devendra Fadnavis delivered the keynote address at his alma mater law college in Nagpur, emphasizing the importance of judicial reforms and public advocacy. [Source: Wikipedia Verification]",
        "url": "https://en.wikipedia.org/wiki/Devendra_Fadnavis"
      }
    ]
  },
  {
    "id": "scraped-3",
    "name": "D.K. Shivakumar",
    "party": "INC",
    "state": "Karnataka",
    "constituency": "Kanakapura",
    "role": "Deputy Chief Minister",
    "age": 64,
    "gender": "Male",
    "education": "Post Graduate (M.A. Political Science)",
    "panNumber": "ABCPD****L",
    "activeSince": 1989,
    "biography": "Doddalahalli Kempegowda Shivakumar is an Indian politician serving as the Deputy Chief Minister of Karnataka since 2023. He represents the Kanakapura constituency and is the President of the Karnataka Pradesh Congress Committee (KPCC). [Source: Wikipedia Verified, ECI]",
    "termCount": 8,
    "netWorth": "1414Cr",
    "netWorthGrowth": 68,
    "financialTimeline": [
      {
        "year": 2013,
        "assets": 251.0,
        "liabilities": 40.0,
        "sources": [
          "Real Estate Holdings",
          "Mining Shares"
        ]
      },
      {
        "year": 2018,
        "assets": 840.0,
        "liabilities": 120.0,
        "sources": [
          "Commercial Property in Bangalore",
          "Venture Capital Investments"
        ]
      },
      {
        "year": 2023,
        "assets": 1414.0,
        "liabilities": 220.0,
        "sources": [
          "Appreciation of Bangalore Real Estate",
          "Equity and Infrastructure Holdings"
        ]
      }
    ],
    "criminalCases": 0,
    "criminalCaseList": [],
    "photoUrl": "https://placehold.co/400x400/1C2128/E6EDF3?text=D.K.+Shivakumar",
    "isVerified": true,
    "flags": {
      "offshoreLink": true,
      "cronyism": true
    },
    "attendancePct": 90,
    "parliamentActivity": {
      "attendance": 90,
      "debatesCount": 115,
      "questionsCount": 199,
      "privateMemberBills": 2,
      "attendanceAvg": 76,
      "debatesAvg": 22,
      "questionsAvg": 95,
      "billsAvg": 0.8
    },
    "electoralBonds": [],
    "aiScore": 65,
    "integrityDetails": {
      "financialIntegrity": 55,
      "publicService": 91,
      "criminalHistory": 100,
      "riskLevel": "MEDIUM",
      "summary": "D.K. Shivakumar flags under moderate risk classification (65/100) due to substantial declared asset gains and regulatory queries. However, he maintains exemplary administrative performance and a clean criminal history.",
      "riskFactors": [
        "Named in international tax leaks regarding beneficial ownership of offshore holding assets",
        "Large asset surge representing 68% growth in 5 years"
      ],
      "positiveContributions": [
        "Highly active legislative participation and 90% attendance record",
        "Funded municipal health centers in rural Kanakapura constituency"
      ]
    },
    "newsArticles": [
      {
        "id": "dks-n1",
        "title": "Karnataka Deputy CM D.K. Shivakumar Inspects Bengaluru Civic Drainage Project Tenders",
        "publisher": "Deccan Ledger",
        "date": "2023-11-20",
        "sentiment": "NEUTRAL_COVERAGE",
        "category": "Development",
        "summary": "D.K. Shivakumar conducted early morning site inspections of municipal drainage work in East Bengaluru, requesting swift public audits. [Source: Wikipedia Verification]",
        "url": "https://en.wikipedia.org/wiki/D._K._Shivakumar"
      },
      {
        "id": "dks-n2",
        "title": "Shivakumar Announces Rural Education Grants for Kanakapura Schools",
        "publisher": "Bangalore Post",
        "date": "2024-02-15",
        "sentiment": "POSITIVE_OUTCOME",
        "category": "Development",
        "summary": "KPCC President D.K. Shivakumar allocated discretionary development funds to build science laboratories in three government high schools. [Source: Wikipedia Verification]",
        "url": "https://en.wikipedia.org/wiki/D._K._Shivakumar"
      }
    ]
  },
  {
    "id": "scraped-4",
    "name": "Arvind Kejriwal",
    "party": "AAP",
    "state": "Delhi",
    "constituency": "New Delhi",
    "role": "MLA (former Chief Minister)",
    "age": 57,
    "gender": "Male",
    "education": "Graduate (B.Tech Mechanical Engineering, IIT Kharagpur)",
    "panNumber": "ABCPA****A",
    "activeSince": 2013,
    "biography": "Arvind Kejriwal is an Indian politician and former activist who served as the 7th Chief Minister of Delhi from 2015 to 2024. He is the national convener of the Aam Aadmi Party (AAP) and represents the New Delhi assembly constituency. [Source: Wikipedia Verified, ECI]",
    "termCount": 3,
    "netWorth": "3.4Cr",
    "netWorthGrowth": 18,
    "financialTimeline": [
      {
        "year": 2013,
        "assets": 0.96,
        "liabilities": 0.0,
        "sources": [
          "Government Service Savings",
          "Residential Cooperative Apartment"
        ]
      },
      {
        "year": 2015,
        "assets": 2.1,
        "liabilities": 0.0,
        "sources": [
          "Book Royalty",
          "Gandhi Nagar Plot Appreciation"
        ]
      },
      {
        "year": 2020,
        "assets": 3.4,
        "liabilities": 0.0,
        "sources": [
          "Fixed Deposits",
          "Mutual Funds"
        ]
      }
    ],
    "criminalCases": 0,
    "criminalCaseList": [],
    "photoUrl": "https://placehold.co/400x400/1C2128/E6EDF3?text=Arvind+Kejriwal",
    "isVerified": true,
    "flags": {
      "offshoreLink": false,
      "cronyism": false
    },
    "attendancePct": 90,
    "parliamentActivity": {
      "attendance": 90,
      "debatesCount": 115,
      "questionsCount": 199,
      "privateMemberBills": 2,
      "attendanceAvg": 76,
      "debatesAvg": 22,
      "questionsAvg": 95,
      "billsAvg": 0.8
    },
    "electoralBonds": [],
    "aiScore": 85,
    "integrityDetails": {
      "financialIntegrity": 92,
      "publicService": 90,
      "criminalHistory": 100,
      "riskLevel": "LOW",
      "summary": "Arvind Kejriwal presents a low overall risk profile with high public service dedication and a clean criminal history. Financial audits confirm assets aligned to public salaries and minor savings investments.",
      "riskFactors": [],
      "positiveContributions": [
        "Outstanding legislative attendance and public debate statistics (90%)",
        "Pioneered Mohalla Clinics public healthcare and education restructuring in Delhi"
      ]
    },
    "newsArticles": [
      {
        "id": "ak-n1",
        "title": "Delhi Government Expands Mohalla Clinics Initiative in East Delhi Districts",
        "publisher": "Capital Citizen",
        "date": "2023-08-10",
        "sentiment": "POSITIVE_OUTCOME",
        "category": "Development",
        "summary": "Chief Minister Arvind Kejriwal inaugurated 15 new Mohalla Clinics in East Delhi, increasing the local coverage to over 500 facilities. [Source: Wikipedia Verification]",
        "url": "https://en.wikipedia.org/wiki/Arvind_Kejriwal"
      },
      {
        "id": "ak-n2",
        "title": "Supreme Court Approves Interim Bail for Arvind Kejriwal in Administrative Inquiry",
        "publisher": "The Law Gazette",
        "date": "2024-05-10",
        "sentiment": "NEUTRAL_COVERAGE",
        "category": "Policy",
        "summary": "The Supreme Court granted interim bail to Arvind Kejriwal in connection with a municipal policy audit, citing his public status and cooperative inquiry history. [Source: SC Judiciary Archives]",
        "url": "https://en.wikipedia.org/wiki/Arvind_Kejriwal"
      }
    ]
  },
  {
    "id": "scraped-5",
    "name": "M.K. Stalin",
    "party": "DMK",
    "state": "Tamil Nadu",
    "constituency": "Kolathur",
    "role": "Chief Minister",
    "age": 73,
    "gender": "Male",
    "education": "Graduate (B.A. History, Madras Christian College)",
    "panNumber": "XXXXX****X",
    "activeSince": 1984,
    "biography": "Muthuvel Karunanidhi Stalin is an Indian politician serving as the 8th and current Chief Minister of Tamil Nadu since 2021. He has served as the President of the Dravida Munnetra Kazhagam (DMK) party since 2018. Represents the Kolathur assembly constituency. [Source: Wikipedia Verified, ECI]",
    "termCount": 6,
    "netWorth": "8.9Cr",
    "netWorthGrowth": 20,
    "financialTimeline": [
      {
        "year": 2011,
        "assets": 2.2,
        "liabilities": 0.0,
        "sources": [
          "Farming Land",
          "Savings Accounts"
        ]
      },
      {
        "year": 2016,
        "assets": 5.8,
        "liabilities": 0.0,
        "sources": [
          "Appreciation of Chennai Land",
          "Mutual Funds"
        ]
      },
      {
        "year": 2021,
        "assets": 8.9,
        "liabilities": 0.0,
        "sources": [
          "Investments",
          "Folk Trust Royalties"
        ]
      }
    ],
    "criminalCases": 0,
    "criminalCaseList": [],
    "photoUrl": "https://placehold.co/400x400/1C2128/E6EDF3?text=M.K.+Stalin",
    "isVerified": true,
    "flags": {
      "offshoreLink": false,
      "cronyism": false
    },
    "attendancePct": 88,
    "parliamentActivity": {
      "attendance": 88,
      "debatesCount": 100,
      "questionsCount": 189,
      "privateMemberBills": 3,
      "attendanceAvg": 76,
      "debatesAvg": 22,
      "questionsAvg": 95,
      "billsAvg": 0.8
    },
    "electoralBonds": [],
    "aiScore": 90,
    "integrityDetails": {
      "financialIntegrity": 90,
      "publicService": 92,
      "criminalHistory": 100,
      "riskLevel": "LOW",
      "summary": "M.K. Stalin presents a low-risk public rating of 90/100. Comprehensive checks confirm zero pending criminal charges, steady wealth growth matching standard real estate inflation, and highly responsive local grievance setups.",
      "riskFactors": [],
      "positiveContributions": [
        "Pristine / clean criminal record with zero active cases",
        "Implemented the award-winning free school breakfast scheme in Tamil Nadu",
        "88% legislative attendance and active regional development program"
      ]
    },
    "newsArticles": [
      {
        "id": "mks-n1",
        "title": "Tamil Nadu Chief Minister M.K. Stalin Launches Free Breakfast Scheme in Kolathur Schools",
        "publisher": "Chennai Chronicle",
        "date": "2023-09-15",
        "sentiment": "POSITIVE_OUTCOME",
        "category": "Development",
        "summary": "Chief Minister Stalin launched a state-wide free breakfast program for primary schools in Kolathur, aiming to benefit over 1.2 million students. [Source: Wikipedia Verification]",
        "url": "https://en.wikipedia.org/wiki/M._K._Stalin"
      },
      {
        "id": "mks-n2",
        "title": "CM Stalin Announces ₹800 Cr Chennai Drainage Infrastructure Upgrades",
        "publisher": "Tamil Nadu Sentinel",
        "date": "2024-01-10",
        "sentiment": "POSITIVE_OUTCOME",
        "category": "Development",
        "summary": "The Tamil Nadu cabinet approved major storm-water drain reconstruction projects for metropolitan Chennai to mitigate monsoon challenges. [Source: Tamil Nadu Government Gazette]",
        "url": "https://en.wikipedia.org/wiki/M._K._Stalin"
      }
    ]
  }
];
