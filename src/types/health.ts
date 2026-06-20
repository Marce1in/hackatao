export type TrendDirection = 'rising' | 'falling' | 'stable';

export type RiskLevel = 'normal' | 'attention' | 'critical';

export type GlucoseReading = {
  value: number;
  unit: 'mg/dL';
  trend: TrendDirection;
  delta: number;
  sampledAt: string;
  risk: RiskLevel;
};

export type VitalReading = {
  label: string;
  value: number;
  unit: string;
  risk: RiskLevel;
};

export type AlertItem = {
  id: string;
  title: string;
  detail: string;
  risk: RiskLevel;
};

export type WearableDevice = {
  name: string;
  battery: number;
  connected: boolean;
  lastSyncAt: string;
};

export type HealthSnapshot = {
  patient: {
    id: string;
    displayName: string;
  };
  glucose: GlucoseReading;
  vitals: {
    heartRate: VitalReading;
    oxygen: VitalReading;
    hrv: VitalReading;
  };
  device: WearableDevice;
  alerts: AlertItem[];
};
