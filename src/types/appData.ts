export type AppUser = {
  firstName: string;
  name: string;
  plan: string;
  avatarUrl: string;
};

export type MeasurementMetric = {
  label: string;
  unit: string;
  value: number;
};

export type DashboardMeasurement = {
  time: string;
  status: string;
  metrics: MeasurementMetric[];
};

export type QuickAction = {
  id: string;
  label: string;
  tone: 'primary' | 'primaryContainer';
  icon: 'plan' | 'finance' | 'family' | 'exam';
};

export type RecentHistoryItem = {
  id: string;
  date: string;
  time: string;
  title: string;
  detail: string;
  dotTone: 'secondary' | 'primary' | 'tertiary' | 'outline';
  facility?: string;
  imageUrl?: string;
  tag?: string;
};

export type FamilyDependent = {
  id: string;
  name: string;
  avatarUrl?: string;
  status: 'attention' | 'normal';
  statusLabel: string;
};

export type FamilySummary = {
  id: string;
  icon: 'group' | 'shield';
  label: string;
  value: string;
  tone: 'secondary' | 'tertiary';
};

export type HistoryMetric = {
  label: string;
  value: string;
};

export type HistoryCard = {
  id: string;
  icon: 'heart' | 'document' | 'vaccine' | 'medical';
  title: string;
  trailing: string;
  subtitle?: string;
  status?: string;
  metrics?: HistoryMetric[];
  tone: 'secondary' | 'tertiary' | 'primary' | 'surface';
};

export type HistoryGroup = {
  id: string;
  date: string;
  dotTone: 'secondary' | 'outline';
  cards: HistoryCard[];
};

export type HistoryInsight = {
  id: string;
  icon: 'trend' | 'metrics';
  label: string;
  value: string;
  tone: 'secondary' | 'tertiary';
};

export type AppData = {
  user: AppUser;
  dashboard: {
    measurement: DashboardMeasurement;
    quickActions: QuickAction[];
    recentHistory: RecentHistoryItem[];
  };
  family: {
    primaryMember: {
      name: string;
      avatarUrl: string;
      plan: string;
      lastMeasurement: string;
      metrics: MeasurementMetric[];
    };
    dependents: FamilyDependent[];
    summary: FamilySummary[];
  };
  history: {
    filters: string[];
    groups: HistoryGroup[];
    insights: HistoryInsight[];
  };
  profile: {
    careTeam: string;
    nextExam: string;
  };
};
