
export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AmazonAccount {
  id: string;
  sellerId: string;
  storeName: string;
  marketplace: string;
  marketplaceCode: string;
  region: string;
  connectedAt: string;
  lastSync: string | null;
  status: 'active' | 'warning' | 'error';
}

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused';
  matchType: 'Exact' | 'Phrase' | 'Broad' | 'Auto';
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  sales: number;
  acos: number;
  roas: number;
  aiHealth: number;
  spendTrend: number[];
}

export interface Keyword {
  keyword: string;
  bid: number;
  position?: number;
  conversions?: number;
  ctr?: number;
  trend?: 'up' | 'down' | 'stable';
  predictedRoas?: number;
  searchVolume?: string;
  competition?: 'Low' | 'Medium' | 'High';
  suggestedBid?: number;
}

export interface Recommendation {
  id: string;
  type: 'bid_adjust' | 'negative_keyword' | 'budget_shift';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  direction: 'up' | 'down' | 'neutral';
  campaign: string;
}

export interface InventoryItem {
  sku: string;
  brand: string;
  itemName: string;
  inStock: number;
  reorderPoint: number;
  estRunout: string;
  status: string;
}

export interface Payout {
  payoutDate: string;
  amount: number;
  status: string;
}

export interface FinanceData {
  totalRevenue: number;
  adSpend: number;
  aggregateCogs: number;
  netProfit: number;
  payouts: Payout[];
}

export interface Brand {
  name: string;
  value: number;
  monthlySales: number;
  healthScore: number;
  growthMetric: number;
}

export interface Activity {
  id: string;
  type: string;
  user: string;
  action: string;
  time: string;
  detail: string;
}

export interface Database {
  users: User[];
  accounts: AmazonAccount[];
  campaigns: Campaign[];
  keywords: {
    top: Keyword[];
    suggested: Keyword[];
  };
  recommendations: Recommendation[];
  inventory: InventoryItem[];
  finance: FinanceData;
  brands: Brand[];
  activity: Activity[];
}

// Types exported for compatibility with dashboard views
// In the database layer, Prisma handles these dynamically.
