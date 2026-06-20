import { StatusBar } from 'expo-status-bar';
import {
  Activity,
  BatteryFull,
  BellRing,
  Droplets,
  HeartPulse,
  Minus,
  RefreshCw,
  ShieldAlert,
  Smartphone,
  TrendingDown,
  TrendingUp,
  Watch,
  Wifi,
} from 'lucide-react-native';
import { useMemo, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { useHealthSnapshot } from './src/hooks/useHealthSnapshot';
import type { AlertItem, HealthSnapshot, RiskLevel, TrendDirection } from './src/types/health';

type Mode = 'phone' | 'watch';

const riskMeta: Record<RiskLevel, { label: string; background: string; border: string; foreground: string }> = {
  normal: {
    label: 'Normal',
    background: '#E9F8EF',
    border: '#7ED29A',
    foreground: '#176B3A',
  },
  attention: {
    label: 'Atencao',
    background: '#FFF4D8',
    border: '#F1B946',
    foreground: '#805300',
  },
  critical: {
    label: 'Critico',
    background: '#FFE9E4',
    border: '#F26B57',
    foreground: '#A92816',
  },
};

const pad = (value: number) => String(value).padStart(2, '0');

const formatTime = (isoDate: string) => {
  const date = new Date(isoDate);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const TrendGlyph = ({ color, size = 22, trend }: { color: string; size?: number; trend: TrendDirection }) => {
  if (trend === 'rising') {
    return <TrendingUp color={color} size={size} strokeWidth={2.4} />;
  }

  if (trend === 'falling') {
    return <TrendingDown color={color} size={size} strokeWidth={2.4} />;
  }

  return <Minus color={color} size={size} strokeWidth={2.4} />;
};

const trendCopy: Record<TrendDirection, string> = {
  rising: 'subindo',
  falling: 'caindo',
  stable: 'estavel',
};

const ModeSwitch = ({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) => (
  <View style={styles.modeSwitch}>
    <ModeButton
      active={mode === 'phone'}
      icon={<Smartphone color={mode === 'phone' ? '#09110D' : '#D7E4DC'} size={18} />}
      label="App"
      onPress={() => onChange('phone')}
    />
    <ModeButton
      active={mode === 'watch'}
      icon={<Watch color={mode === 'watch' ? '#09110D' : '#D7E4DC'} size={18} />}
      label="Relogio"
      onPress={() => onChange('watch')}
    />
  </View>
);

const ModeButton = ({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
    onPress={onPress}
    style={({ pressed }) => [styles.modeButton, active && styles.modeButtonActive, pressed && styles.pressed]}
  >
    {icon}
    <Text style={[styles.modeButtonText, active && styles.modeButtonTextActive]}>{label}</Text>
  </Pressable>
);

const RiskBadge = ({ risk }: { risk: RiskLevel }) => {
  const meta = riskMeta[risk];

  return (
    <View style={[styles.riskBadge, { backgroundColor: meta.background, borderColor: meta.border }]}>
      <Text style={[styles.riskBadgeText, { color: meta.foreground }]}>{meta.label}</Text>
    </View>
  );
};

const MetricCard = ({
  icon,
  label,
  risk,
  unit,
  value,
}: {
  icon: ReactNode;
  label: string;
  risk: RiskLevel;
  unit: string;
  value: number;
}) => {
  const meta = riskMeta[risk];

  return (
    <View style={[styles.metricCard, { borderColor: meta.border }]}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: meta.background }]}>{icon}</View>
        <Text style={[styles.metricStatus, { color: meta.foreground }]}>{meta.label}</Text>
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricUnit}>{unit}</Text>
      </View>
    </View>
  );
};

const LoadingState = () => (
  <View style={styles.statePanel}>
    <ActivityIndicator color="#82E6A5" size="large" />
    <Text style={styles.stateTitle}>Carregando mock API</Text>
  </View>
);

const ErrorState = ({ message, reload }: { message: string; reload: () => void }) => (
  <View style={styles.statePanel}>
    <ShieldAlert color="#F26B57" size={34} strokeWidth={2.3} />
    <Text style={styles.stateTitle}>{message}</Text>
    <Pressable accessibilityRole="button" onPress={reload} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
      <RefreshCw color="#09110D" size={18} />
      <Text style={styles.primaryButtonText}>Tentar de novo</Text>
    </Pressable>
  </View>
);

const AlertRow = ({ alert }: { alert: AlertItem }) => {
  const meta = riskMeta[alert.risk];

  return (
    <View style={[styles.alertRow, { borderColor: meta.border }]}>
      <View style={[styles.alertIcon, { backgroundColor: meta.background }]}>
        <BellRing color={meta.foreground} size={19} strokeWidth={2.4} />
      </View>
      <View style={styles.alertCopy}>
        <Text style={styles.alertTitle}>{alert.title}</Text>
        <Text style={styles.alertDetail}>{alert.detail}</Text>
      </View>
    </View>
  );
};

const WatchFace = ({
  data,
  loading,
  reload,
  size = 226,
}: {
  data: HealthSnapshot | null;
  loading: boolean;
  reload: () => void;
  size?: number;
}) => {
  const risk = data?.glucose.risk ?? 'normal';
  const meta = riskMeta[risk];

  return (
    <View style={[styles.watchShell, { height: size, width: size, borderColor: meta.border }]}>
      {loading && !data ? (
        <ActivityIndicator color="#82E6A5" />
      ) : (
        <>
          <View style={styles.watchTopRow}>
            <View style={styles.watchSignal}>
              <Wifi color="#D7E4DC" size={13} strokeWidth={2.5} />
              <Text style={styles.watchSignalText}>live</Text>
            </View>
            <View style={styles.watchSignal}>
              <BatteryFull color="#D7E4DC" size={14} strokeWidth={2.5} />
              <Text style={styles.watchSignalText}>{data?.device.battery ?? 0}%</Text>
            </View>
          </View>

          <Text style={styles.watchLabel}>glicose</Text>
          <View style={styles.watchValueRow}>
            <Text style={[styles.watchValue, { color: meta.foreground }]}>{data?.glucose.value ?? '--'}</Text>
            <Text style={styles.watchUnit}>mg/dL</Text>
          </View>
          <View style={styles.watchTrend}>
            <TrendGlyph color={meta.foreground} size={18} trend={data?.glucose.trend ?? 'stable'} />
            <Text style={[styles.watchTrendText, { color: meta.foreground }]}>
              {trendCopy[data?.glucose.trend ?? 'stable']}
            </Text>
          </View>

          <View style={styles.watchVitals}>
            <View style={styles.watchVitalItem}>
              <HeartPulse color="#82E6A5" size={15} />
              <Text style={styles.watchVitalText}>{data?.vitals.heartRate.value ?? '--'}</Text>
            </View>
            <View style={styles.watchVitalItem}>
              <Droplets color="#8FC9FF" size={15} />
              <Text style={styles.watchVitalText}>{data?.vitals.oxygen.value ?? '--'}%</Text>
            </View>
          </View>

          <Text numberOfLines={1} style={styles.watchAlert}>
            {data?.alerts[0]?.title ?? 'Sem alerta'}
          </Text>

          <Pressable
            accessibilityLabel="Atualizar leitura"
            accessibilityRole="button"
            hitSlop={10}
            onPress={reload}
            style={({ pressed }) => [styles.watchRefresh, pressed && styles.pressed]}
          >
            <RefreshCw color="#D7E4DC" size={16} strokeWidth={2.4} />
          </Pressable>
        </>
      )}
    </View>
  );
};

const PhoneExperience = ({
  data,
  error,
  loading,
  refreshing,
  reload,
}: {
  data: HealthSnapshot | null;
  error: string | null;
  loading: boolean;
  refreshing: boolean;
  reload: () => void;
}) => {
  if (loading && !data) {
    return <LoadingState />;
  }

  if (error && !data) {
    return <ErrorState message={error} reload={reload} />;
  }

  if (!data) {
    return <ErrorState message="Sem dados da mock API" reload={reload} />;
  }

  const glucoseMeta = riskMeta[data.glucose.risk];
  const syncTime = formatTime(data.device.lastSyncAt);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl onRefresh={reload} refreshing={refreshing} tintColor="#82E6A5" />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Hackatao Care</Text>
          <Text style={styles.title}>{data.patient.displayName}</Text>
        </View>
        <View style={styles.connectionPill}>
          <Wifi color="#82E6A5" size={15} strokeWidth={2.5} />
          <Text style={styles.connectionText}>Mock API</Text>
        </View>
      </View>

      <View style={[styles.heroPanel, { borderColor: glucoseMeta.border }]}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.sectionEyebrow}>Glicose agora</Text>
            <Text style={styles.lastSync}>Sync {syncTime}</Text>
          </View>
          <RiskBadge risk={data.glucose.risk} />
        </View>

        <View style={styles.glucoseRow}>
          <Text style={[styles.glucoseValue, { color: glucoseMeta.foreground }]}>{data.glucose.value}</Text>
          <Text style={styles.glucoseUnit}>{data.glucose.unit}</Text>
        </View>

        <View style={styles.trendRow}>
          <TrendGlyph color={glucoseMeta.foreground} trend={data.glucose.trend} />
          <Text style={[styles.trendText, { color: glucoseMeta.foreground }]}>
            {trendCopy[data.glucose.trend]} {Math.abs(data.glucose.delta)} mg/dL
          </Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard
          icon={<HeartPulse color="#176B3A" size={22} strokeWidth={2.3} />}
          label={data.vitals.heartRate.label}
          risk={data.vitals.heartRate.risk}
          unit={data.vitals.heartRate.unit}
          value={data.vitals.heartRate.value}
        />
        <MetricCard
          icon={<Droplets color="#215E9D" size={22} strokeWidth={2.3} />}
          label={data.vitals.oxygen.label}
          risk={data.vitals.oxygen.risk}
          unit={data.vitals.oxygen.unit}
          value={data.vitals.oxygen.value}
        />
        <MetricCard
          icon={<Activity color="#805300" size={22} strokeWidth={2.3} />}
          label={data.vitals.hrv.label}
          risk={data.vitals.hrv.risk}
          unit={data.vitals.hrv.unit}
          value={data.vitals.hrv.value}
        />
        <MetricCard
          icon={<BatteryFull color="#176B3A" size={22} strokeWidth={2.3} />}
          label="Bateria"
          risk={data.device.battery < 25 ? 'attention' : 'normal'}
          unit="%"
          value={data.device.battery}
        />
      </View>

      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Alertas</Text>
          <Pressable accessibilityRole="button" onPress={reload} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <RefreshCw color="#D7E4DC" size={18} strokeWidth={2.4} />
          </Pressable>
        </View>
        {data.alerts.map((alert) => (
          <AlertRow alert={alert} key={alert.id} />
        ))}
      </View>

      <View style={styles.watchPreviewBlock}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Relogio</Text>
          <Text style={styles.deviceText}>{data.device.name}</Text>
        </View>
        <View style={styles.watchPreviewInner}>
          <WatchFace data={data} loading={loading} reload={reload} size={214} />
        </View>
      </View>

      <Text style={styles.disclaimer}>Demo: nao usar para decisao medica.</Text>
    </ScrollView>
  );
};

const WatchExperience = ({
  data,
  loading,
  reload,
  size,
}: {
  data: HealthSnapshot | null;
  loading: boolean;
  reload: () => void;
  size: number;
}) => (
  <View style={styles.watchExperience}>
    <WatchFace data={data} loading={loading} reload={reload} size={size} />
  </View>
);

export default function App() {
  const [selectedMode, setSelectedMode] = useState<Mode>('phone');
  const { data, error, loading, refreshing, reload } = useHealthSnapshot();
  const { height, width } = useWindowDimensions();
  const autoWatch = width <= 320 || height <= 360;
  const mode = autoWatch ? 'watch' : selectedMode;
  const watchSize = useMemo(() => Math.max(190, Math.min(width - 28, height - 78, 236)), [height, width]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.appShell}>
        {!autoWatch && <ModeSwitch mode={mode} onChange={setSelectedMode} />}
        {mode === 'watch' ? (
          <WatchExperience data={data} loading={loading} reload={reload} size={watchSize} />
        ) : (
          <PhoneExperience data={data} error={error} loading={loading} refreshing={refreshing} reload={reload} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#09110D',
  },
  appShell: {
    flex: 1,
    backgroundColor: '#09110D',
  },
  modeSwitch: {
    alignSelf: 'center',
    backgroundColor: '#16211B',
    borderColor: '#26382E',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    marginTop: 12,
    padding: 4,
  },
  modeButton: {
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 7,
    minHeight: 38,
    minWidth: 112,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  modeButtonActive: {
    backgroundColor: '#82E6A5',
  },
  modeButtonText: {
    color: '#D7E4DC',
    fontSize: 14,
    fontWeight: '700',
  },
  modeButtonTextActive: {
    color: '#09110D',
  },
  pressed: {
    opacity: 0.74,
  },
  scrollContent: {
    gap: 16,
    padding: 18,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kicker: {
    color: '#82E6A5',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#F5FFF8',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  connectionPill: {
    alignItems: 'center',
    backgroundColor: '#16211B',
    borderColor: '#26382E',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 10,
  },
  connectionText: {
    color: '#D7E4DC',
    fontSize: 12,
    fontWeight: '800',
  },
  heroPanel: {
    backgroundColor: '#F7FBF8',
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
  },
  heroTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionEyebrow: {
    color: '#4A5E51',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  lastSync: {
    color: '#66786C',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },
  riskBadge: {
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  riskBadgeText: {
    fontSize: 13,
    fontWeight: '900',
  },
  glucoseRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  glucoseValue: {
    fontSize: 74,
    fontWeight: '900',
    lineHeight: 80,
  },
  glucoseUnit: {
    color: '#4A5E51',
    fontSize: 18,
    fontWeight: '800',
    paddingBottom: 12,
  },
  trendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  trendText: {
    fontSize: 15,
    fontWeight: '800',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#F7FBF8',
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: 136,
    minWidth: 150,
    padding: 14,
  },
  metricHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  metricStatus: {
    fontSize: 12,
    fontWeight: '900',
  },
  metricLabel: {
    color: '#4A5E51',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 16,
  },
  metricValueRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  metricValue: {
    color: '#09110D',
    fontSize: 33,
    fontWeight: '900',
  },
  metricUnit: {
    color: '#66786C',
    fontSize: 14,
    fontWeight: '800',
    paddingBottom: 5,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#F5FFF8',
    fontSize: 19,
    fontWeight: '900',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#16211B',
    borderColor: '#26382E',
    borderRadius: 8,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 42,
  },
  alertRow: {
    alignItems: 'center',
    backgroundColor: '#F7FBF8',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 78,
    padding: 12,
  },
  alertIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  alertCopy: {
    flex: 1,
    gap: 3,
  },
  alertTitle: {
    color: '#09110D',
    fontSize: 15,
    fontWeight: '900',
  },
  alertDetail: {
    color: '#4A5E51',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  watchPreviewBlock: {
    gap: 12,
  },
  deviceText: {
    color: '#A7B8AE',
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  watchPreviewInner: {
    alignItems: 'center',
    backgroundColor: '#121B16',
    borderColor: '#26382E',
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
  },
  disclaimer: {
    color: '#8FA398',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  statePanel: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  },
  stateTitle: {
    color: '#F5FFF8',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#82E6A5',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: '#09110D',
    fontSize: 15,
    fontWeight: '900',
  },
  watchExperience: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 12,
  },
  watchShell: {
    alignItems: 'center',
    backgroundColor: '#F7FBF8',
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 14,
    position: 'relative',
  },
  watchTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 14,
    position: 'absolute',
    right: 14,
    top: 12,
  },
  watchSignal: {
    alignItems: 'center',
    backgroundColor: '#16211B',
    borderRadius: 7,
    flexDirection: 'row',
    gap: 4,
    minHeight: 24,
    paddingHorizontal: 7,
  },
  watchSignalText: {
    color: '#D7E4DC',
    fontSize: 10,
    fontWeight: '900',
  },
  watchLabel: {
    color: '#4A5E51',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 14,
    textTransform: 'uppercase',
  },
  watchValueRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 5,
    marginTop: 2,
  },
  watchValue: {
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 56,
  },
  watchUnit: {
    color: '#4A5E51',
    fontSize: 12,
    fontWeight: '900',
    paddingBottom: 8,
  },
  watchTrend: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 5,
  },
  watchTrendText: {
    fontSize: 12,
    fontWeight: '900',
  },
  watchVitals: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 11,
  },
  watchVitalItem: {
    alignItems: 'center',
    backgroundColor: '#16211B',
    borderRadius: 7,
    flexDirection: 'row',
    gap: 4,
    minHeight: 28,
    paddingHorizontal: 9,
  },
  watchVitalText: {
    color: '#F5FFF8',
    fontSize: 12,
    fontWeight: '900',
  },
  watchAlert: {
    color: '#4A5E51',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 10,
    maxWidth: '86%',
    textAlign: 'center',
  },
  watchRefresh: {
    alignItems: 'center',
    backgroundColor: '#16211B',
    borderRadius: 8,
    bottom: 10,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    width: 30,
  },
});
