import { StatusBar } from 'expo-status-bar';
import {
  Activity,
  ArrowLeft,
  Bell,
  BriefcaseMedical,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CirclePlus,
  Clock3,
  CreditCard,
  Download,
  FileText,
  HeartPulse,
  History,
  Home,
  MapPin,
  MessageCircle,
  Receipt,
  Search,
  Send,
  ShieldCheck,
  Stethoscope,
  Syringe,
  TrendingUp,
  UserRound,
  UsersRound,
  Video,
  WalletCards,
} from 'lucide-react-native';
import { type ReactNode, useState } from 'react';
import { ActivityIndicator, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppData } from './src/hooks/useAppData';
import type {
  AppData,
  FamilyDependent,
  FamilySummary,
  HistoryCard,
  HistoryGroup,
  HistoryInsight,
  MeasurementMetric,
  QuickAction,
  RecentHistoryItem,
} from './src/types/appData';

type TabKey = 'dashboard' | 'family' | 'exams' | 'history' | 'profile' | 'finance' | 'online' | 'lucas';

const colors = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceContainerLow: '#F3F4F5',
  surfaceContainer: '#EDEEEF',
  surfaceContainerHigh: '#E7E8E9',
  surfaceContainerHighest: '#E1E3E4',
  onSurface: '#191C1D',
  onSurfaceVariant: '#3E4A41',
  outline: '#6E7A70',
  outlineVariant: '#BDCABE',
  primary: '#006A3F',
  primaryContainer: '#008650',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#F6FFF5',
  secondary: '#496800',
  secondaryContainer: '#C0F063',
  onSecondaryContainer: '#4D6C00',
  tertiary: '#276749',
  tertiaryContainer: '#428160',
  tertiaryFixed: '#AFF1CA',
  onTertiaryFixed: '#002112',
  error: '#BA1A1A',
};

const shadow = {
  shadowColor: '#000000',
  shadowOffset: { height: 4, width: 0 },
  shadowOpacity: 0.05,
  shadowRadius: 20,
  elevation: 2,
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'family', label: 'Família' },
  { key: 'exams', label: 'Exames' },
  { key: 'history', label: 'Histórico' },
  { key: 'profile', label: 'Perfil' },
];

const upcomingAppointments = [
  {
    id: 'routine',
    title: 'Consulta de Rotina',
    subtitle: 'Dr. Alberto Santos (Cardiologista)',
    date: '12 Ago',
    time: '09:30',
    tone: 'primary',
  },
  {
    id: 'blood',
    title: 'Exame de Sangue',
    subtitle: 'Laboratório Vitality - Unidade Centro',
    date: '14 Ago',
    time: '07:45',
    tone: 'secondary',
  },
];

const examQueue = [
  { id: 'hemograma', title: 'Hemograma Completo', place: 'Lab Vitality Centro', status: 'Próximo', time: 'Hoje, 07:45' },
  { id: 'cardio', title: 'Eletrocardiograma', place: 'Clínica Vida', status: 'Confirmado', time: 'Amanhã, 14:00' },
  { id: 'glicose', title: 'Glicemia em jejum', place: 'Lab ABC', status: 'Preparar', time: '22 Jun, 08:20' },
];

const onlineDoctors = [
  { id: 'andre', name: 'Dr. André Santos', crm: 'Clínico Geral • CRM 11223', wait: '2 min', rating: '4.9' },
  { id: 'juliana', name: 'Dra. Juliana Costa', crm: 'Clínico Geral • CRM 44556', wait: '5 min', rating: '4.8' },
  { id: 'felipe', name: 'Dr. Felipe Rocha', crm: 'Clínico Geral • CRM 77889', wait: '8 min', rating: '4.7' },
  { id: 'beatriz', name: 'Dra. Beatriz Santos', crm: 'Pediatra • CRM 12345', wait: '12 min', rating: '4.9' },
];

const financeItems = [
  { id: 'plan', title: 'Plano de Saúde Vitality', due: 'Vence em 2 dias', value: 'R$ 450,20', action: 'Pagar', urgent: true },
  { id: 'labs', title: 'Exames Laboratoriais', due: 'Vence em 15/10', value: 'R$ 125,00', action: 'Agendar', urgent: false },
];

const financeHistory = [
  { id: 'consult', title: 'Consulta Dr. Silva', date: 'Hoje, 09:45', value: '- R$ 180,00' },
  { id: 'blood', title: 'Exame de Sangue', date: 'Ontem, 14:20', value: '- R$ 125,00' },
  { id: 'refund', title: 'Reembolso Consulta', date: '03 Out, 11:15', value: '+ R$ 90,00' },
];

const lucasActivities = [
  { id: 'ped', title: 'Consulta Pediátrica', subtitle: 'Dra. Beatriz Santos • Clínica Vida', date: '12 Ago', icon: 'medical' },
  { id: 'vac', title: 'Vacinação: Reforço Tetravalente', subtitle: 'Unidade Básica de Saúde Central', date: '05 Jul', icon: 'vaccine' },
  { id: 'blood', title: 'Exame de Sangue', subtitle: 'Laboratório Central Vitality', date: '18 Jun', icon: 'document' },
];

const dotColor = {
  outline: colors.outline,
  primary: colors.primary,
  secondary: colors.secondary,
  tertiary: colors.tertiary,
};

const LoadingState = () => (
  <View style={styles.statePanel}>
    <ActivityIndicator color={colors.primary} size="large" />
    <Text style={styles.stateText}>Carregando JSON mock</Text>
  </View>
);

const ErrorState = ({ message, reload }: { message: string; reload: () => void }) => (
  <View style={styles.statePanel}>
    <Text style={styles.stateText}>{message}</Text>
    <Pressable accessibilityRole="button" onPress={reload} style={styles.retryButton}>
      <Text style={styles.retryButtonText}>Tentar de novo</Text>
    </Pressable>
  </View>
);

const Header = ({ data, title }: { data: AppData; title: string }) => (
  <View style={styles.header}>
    <View style={styles.headerIdentity}>
      <Image source={{ uri: data.user.avatarUrl }} style={styles.headerAvatar} />
      <Text numberOfLines={1} style={styles.headerTitle}>
        {title}
      </Text>
    </View>
    <Pressable accessibilityLabel="Notificações" accessibilityRole="button" style={styles.headerIconButton}>
      <Bell color={colors.primary} size={20} strokeWidth={2.2} />
    </Pressable>
  </View>
);

const DetailHeader = ({ data, onBack, title }: { data: AppData; onBack: () => void; title: string }) => (
  <View style={styles.header}>
    <View style={styles.headerIdentity}>
      <Pressable accessibilityLabel="Voltar" accessibilityRole="button" onPress={onBack} style={styles.headerIconButton}>
        <ArrowLeft color={colors.onSurface} size={22} />
      </Pressable>
      <Text numberOfLines={1} style={styles.headerTitle}>
        {title}
      </Text>
    </View>
    <Image source={{ uri: data.user.avatarUrl }} style={styles.headerAvatar} />
  </View>
);

const BottomNav = ({ activeTab, onChange }: { activeTab: TabKey; onChange: (tab: TabKey) => void }) => (
  <View style={styles.bottomNav}>
    {tabs.map((tab) => {
      const active = tab.key === activeTab;

      return (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: active }}
          key={tab.key}
          onPress={() => onChange(tab.key)}
          style={({ pressed }) => [styles.navItem, active && styles.navItemActive, pressed && styles.pressed]}
        >
          {tab.key === 'dashboard' ? <Home color={active ? colors.onSecondaryContainer : colors.onSurfaceVariant} size={20} /> : null}
          {tab.key === 'family' ? <UsersRound color={active ? colors.onSecondaryContainer : colors.onSurfaceVariant} size={20} /> : null}
          {tab.key === 'exams' ? <FileText color={active ? colors.onSecondaryContainer : colors.onSurfaceVariant} size={20} /> : null}
          {tab.key === 'history' ? <History color={active ? colors.onSecondaryContainer : colors.onSurfaceVariant} size={20} /> : null}
          {tab.key === 'profile' ? <UserRound color={active ? colors.onSecondaryContainer : colors.onSurfaceVariant} size={20} /> : null}
          <Text style={[styles.navText, active && styles.navTextActive]}>{tab.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const ScreenShell = ({
  activeTab,
  children,
  data,
  onChangeTab,
  title,
  detail,
}: {
  activeTab: TabKey;
  children: ReactNode;
  data: AppData;
  detail?: { onBack: () => void };
  onChangeTab: (tab: TabKey) => void;
  title: string;
}) => (
  <View style={styles.appShell}>
    {detail ? <DetailHeader data={data} onBack={detail.onBack} title={title} /> : <Header data={data} title={title} />}
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
    <BottomNav activeTab={activeTab} onChange={onChangeTab} />
  </View>
);

const DashboardScreen = ({ data, onChangeTab }: { data: AppData; onChangeTab: (tab: TabKey) => void }) => (
  <>
    <MeasurementBanner measurement={data.dashboard.measurement} />
    <View style={styles.actionGrid}>
      {data.dashboard.quickActions.map((action) => (
        <QuickActionButton
          action={action}
          key={action.id}
          onPress={() => {
            if (action.id === 'family') {
              onChangeTab('family');
            }
            if (action.id === 'finance') {
              onChangeTab('finance');
            }
            if (action.id === 'exam') {
              onChangeTab('exams');
            }
          }}
        />
      ))}
    </View>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Histórico Recente</Text>
      <Pressable accessibilityRole="button" onPress={() => onChangeTab('history')}>
        <Text style={styles.linkText}>Ver tudo</Text>
      </Pressable>
    </View>
    <RecentTimeline items={data.dashboard.recentHistory} />
  </>
);

const MeasurementBanner = ({ measurement }: { measurement: AppData['dashboard']['measurement'] }) => (
  <View style={styles.measurementBanner}>
    <HeartPulse color={colors.onSecondaryContainer} size={118} style={styles.measurementWatermark} strokeWidth={1.4} />
    <View style={styles.measurementTop}>
      <Text style={styles.measurementOverline}>Última Medição</Text>
      <Text style={styles.measurementTime}>{measurement.time}</Text>
    </View>
    <View style={styles.measurementGrid}>
      {measurement.metrics.map((metric) => (
        <MetricReadout key={metric.label} metric={metric} />
      ))}
    </View>
    <View style={styles.statusPill}>
      <View style={styles.statusDot} />
      <Text style={styles.statusText}>{measurement.status}</Text>
    </View>
  </View>
);

const MetricReadout = ({ metric }: { metric: MeasurementMetric }) => (
  <View style={styles.metricReadout}>
    <Text style={styles.metricLabel}>{metric.label}</Text>
    <View style={styles.metricValueRow}>
      <Text style={styles.metricValue}>{metric.value}</Text>
      <Text style={styles.metricUnit}>{metric.unit}</Text>
    </View>
  </View>
);

const QuickActionButton = ({ action, onPress }: { action: QuickAction; onPress: () => void }) => {
  const primary = action.tone === 'primary';
  const iconColor = primary ? colors.onPrimary : colors.onPrimaryContainer;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        { backgroundColor: primary ? colors.primary : colors.primaryContainer },
        pressed && styles.pressed,
      ]}
    >
      {action.icon === 'plan' ? <BriefcaseMedical color={iconColor} size={32} /> : null}
      {action.icon === 'finance' ? <CreditCard color={iconColor} size={32} /> : null}
      {action.icon === 'family' ? <UsersRound color={iconColor} size={32} /> : null}
      {action.icon === 'exam' ? <FileText color={iconColor} size={32} /> : null}
      <Text style={styles.actionLabel}>{action.label}</Text>
    </Pressable>
  );
};

const RecentTimeline = ({ items }: { items: RecentHistoryItem[] }) => (
  <View style={styles.timelineWrap}>
    <View style={styles.timelineLine} />
    {items.map((item) => (
      <View key={item.id} style={styles.timelineItem}>
        <View style={[styles.timelineDot, { backgroundColor: dotColor[item.dotTone] }]} />
        <View style={[styles.timelineCard, item.imageUrl && styles.timelineCardWithImage]}>
          <View style={styles.timelineCardBody}>
            <View style={styles.timelineMetaRow}>
              <Text style={styles.timelineDate}>{item.date}</Text>
              <Text style={styles.timelineTime}>{item.time}</Text>
            </View>
            <View style={styles.timelineDetailRow}>
              {item.facility ? <MapPin color={colors.onSurfaceVariant} size={17} /> : <Stethoscope color={colors.onSurfaceVariant} size={17} />}
              <Text style={styles.timelineDetail}>{item.title}</Text>
            </View>
            {item.tag ? (
              <View style={styles.timelineTagRow}>
                <Text style={styles.timelineTag}>{item.tag}</Text>
                <Text style={styles.timelineFacility}>{item.facility}</Text>
              </View>
            ) : null}
          </View>
          {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.mapImage} /> : null}
        </View>
      </View>
    ))}
  </View>
);

const FamilyScreen = ({ data, onLucas }: { data: AppData; onLucas: () => void }) => (
  <>
    <FamilyPrimaryCard data={data} />
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Dependentes</Text>
      <Pressable accessibilityRole="button" style={styles.addButton}>
        <CirclePlus color={colors.primary} size={16} />
        <Text style={styles.addButtonText}>Adicionar</Text>
      </Pressable>
    </View>
    <View style={styles.listStack}>
      {data.family.dependents.map((dependent) => (
        <DependentRow dependent={dependent} key={dependent.id} onPress={dependent.id === 'lucas' ? onLucas : undefined} />
      ))}
    </View>
    <View style={styles.summaryGrid}>
      {data.family.summary.map((item) => (
        <FamilySummaryCard item={item} key={item.id} />
      ))}
    </View>
  </>
);

const FamilyPrimaryCard = ({ data }: { data: AppData }) => (
  <View style={styles.familyCard}>
    <UsersRound color={colors.onPrimaryContainer} size={116} style={styles.familyWatermark} strokeWidth={1.4} />
    <View style={styles.familyTop}>
      <View style={styles.familyIdentity}>
        <View style={styles.familyAvatarFrame}>
          <Image source={{ uri: data.family.primaryMember.avatarUrl }} style={styles.familyAvatar} />
        </View>
        <View style={styles.familyCopy}>
          <Text style={styles.familyName}>{data.family.primaryMember.name}</Text>
          <Text style={styles.planBadge}>{data.family.primaryMember.plan}</Text>
        </View>
      </View>
      <View style={styles.historyLink}>
        <History color={colors.onPrimaryContainer} size={14} />
        <Text style={styles.historyLinkText}>Histórico</Text>
      </View>
    </View>
    <View style={styles.familyMetrics}>
      {data.family.primaryMember.metrics.map((metric) => (
        <FamilyMetric metric={metric} key={metric.label} />
      ))}
    </View>
    <View style={styles.familyFooter}>
      <View style={styles.lastMeasureRow}>
        <Clock3 color="rgba(255,255,255,0.72)" size={14} />
        <Text style={styles.familyFooterText}>Última medida: {data.family.primaryMember.lastMeasurement}</Text>
      </View>
      <View style={styles.familyMiniAvatars}>
        <View style={styles.familyMiniAvatar} />
        <View style={[styles.familyMiniAvatar, styles.familyMiniAvatarOverlap]} />
      </View>
    </View>
  </View>
);

const FamilyMetric = ({ metric }: { metric: MeasurementMetric }) => (
  <View style={styles.familyMetricCard}>
    <View style={styles.familyMetricTop}>
      {metric.label === 'BPM' ? <HeartPulse color={colors.secondaryContainer} size={18} /> : <Activity color={colors.secondaryContainer} size={18} />}
      <Text style={styles.familyMetricLabel}>{metric.label}</Text>
    </View>
    <View style={styles.familyMetricValueRow}>
      <Text style={styles.familyMetricValue}>{metric.value}</Text>
      <Text style={styles.familyMetricUnit}>{metric.unit}</Text>
    </View>
  </View>
);

const DependentRow = ({ dependent, onPress }: { dependent: FamilyDependent; onPress?: () => void }) => (
  <Pressable accessibilityRole="button" disabled={!onPress} onPress={onPress} style={({ pressed }) => [styles.memberRow, pressed && styles.pressed]}>
    <View style={styles.memberLeft}>
      {dependent.avatarUrl ? (
        <Image source={{ uri: dependent.avatarUrl }} style={styles.memberAvatarImage} />
      ) : (
        <View style={styles.memberAvatarFallback}>
          <UserRound color={colors.onSurfaceVariant} size={26} />
        </View>
      )}
      <View>
        <Text style={styles.memberName}>{dependent.name}</Text>
        <View style={styles.memberStatusRow}>
          <View style={[styles.memberStatusDot, dependent.status === 'attention' && styles.memberStatusDotAttention]} />
          <Text style={styles.memberStatusText}>{dependent.statusLabel}</Text>
        </View>
      </View>
    </View>
    <View style={styles.memberActions}>
      <History color={colors.primaryContainer} size={18} />
      <ChevronRight color={colors.outline} size={20} />
    </View>
  </Pressable>
);

const ExamsScreen = ({ onFinance, onOnline }: { onFinance: () => void; onOnline: () => void }) => (
  <>
    <View style={styles.pageIntro}>
      <Text style={styles.pageTitle}>Exames e Consultas</Text>
      <Text style={styles.pageCopy}>Gerencie sua saúde e agendamentos de forma rápida.</Text>
    </View>
    <View style={styles.serviceGrid}>
      <ServiceCard icon="calendar" label="Agendar Exame" tone="surface" />
      <ServiceCard icon="video" label="Consulta Online" onPress={onOnline} tone="primary" />
      <ServiceCard icon="clock" label="Exames para Fazer" tone="secondary" />
      <ServiceCard icon="medical" label="Médico Familiar" tone="surface" />
    </View>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Próximos Agendamentos</Text>
      <Text style={styles.linkText}>Ver todos</Text>
    </View>
    <View style={styles.listStack}>
      {upcomingAppointments.map((item) => (
        <AppointmentCard item={item} key={item.id} />
      ))}
    </View>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Exames em Tempo Real</Text>
      <Text style={styles.liveBadge}>AO VIVO</Text>
    </View>
    <View style={styles.listStack}>
      {examQueue.map((item) => (
        <ExamQueueRow item={item} key={item.id} />
      ))}
    </View>
    <Pressable accessibilityRole="button" onPress={onFinance} style={({ pressed }) => [styles.checkoutCard, pressed && styles.pressed]}>
      <WalletCards color={colors.onPrimaryContainer} size={34} />
      <View style={styles.checkoutCopy}>
        <Text style={styles.checkoutTitle}>Checkout Rápido</Text>
        <Text style={styles.checkoutText}>Pague exames diretamente pelo app com segurança.</Text>
      </View>
      <ChevronRight color={colors.onPrimaryContainer} size={22} />
    </Pressable>
  </>
);

const ServiceCard = ({
  icon,
  label,
  onPress,
  tone,
}: {
  icon: 'calendar' | 'video' | 'clock' | 'medical';
  label: string;
  onPress?: () => void;
  tone: 'primary' | 'secondary' | 'surface';
}) => {
  const primary = tone === 'primary';
  const secondary = tone === 'secondary';
  const color = primary ? colors.onPrimary : secondary ? colors.onSecondaryContainer : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.serviceCard, primary && styles.serviceCardPrimary, secondary && styles.serviceCardSecondary, pressed && styles.pressed]}
    >
      {icon === 'calendar' ? <CalendarDays color={color} size={28} /> : null}
      {icon === 'video' ? <Video color={color} size={28} /> : null}
      {icon === 'clock' ? <Clock3 color={color} size={28} /> : null}
      {icon === 'medical' ? <Stethoscope color={color} size={28} /> : null}
      <Text style={[styles.serviceLabel, (primary || secondary) && styles.serviceLabelStrong]}>{label}</Text>
    </Pressable>
  );
};

const AppointmentCard = ({ item }: { item: (typeof upcomingAppointments)[number] }) => (
  <View style={styles.appointmentCard}>
    <View style={[styles.appointmentDate, item.tone === 'secondary' && styles.appointmentDateSecondary]}>
      <Text style={styles.appointmentDateText}>{item.date}</Text>
      <Text style={styles.appointmentTimeText}>{item.time}</Text>
    </View>
    <View style={styles.appointmentCopy}>
      <Text style={styles.appointmentTitle}>{item.title}</Text>
      <Text style={styles.appointmentSubtitle}>{item.subtitle}</Text>
    </View>
    <ChevronRight color={colors.outline} size={20} />
  </View>
);

const ExamQueueRow = ({ item }: { item: (typeof examQueue)[number] }) => (
  <View style={styles.examQueueRow}>
    <View style={styles.examQueueIcon}>
      <FileText color={colors.primary} size={22} />
    </View>
    <View style={styles.appointmentCopy}>
      <Text style={styles.appointmentTitle}>{item.title}</Text>
      <Text style={styles.appointmentSubtitle}>{item.place}</Text>
    </View>
    <View style={styles.examQueueMeta}>
      <Text style={styles.examStatus}>{item.status}</Text>
      <Text style={styles.examTime}>{item.time}</Text>
    </View>
  </View>
);

const OnlineScreen = () => (
  <>
    <View style={styles.searchPanel}>
      <Search color={colors.onSurfaceVariant} size={18} />
      <Text style={styles.searchPlaceholder}>Buscar especialidade ou médico</Text>
    </View>
    <ScrollView horizontal contentContainerStyle={styles.filterRow} showsHorizontalScrollIndicator={false}>
      {['Todos', 'Clínico Geral', 'Pediatria', 'Cardio'].map((filter, index) => (
        <View key={filter} style={[styles.filterChip, index === 0 && styles.filterChipActive]}>
          <Text style={[styles.filterChipText, index === 0 && styles.filterChipTextActive]}>{filter}</Text>
        </View>
      ))}
    </ScrollView>
    <View style={styles.onlineHero}>
      <MessageCircle color={colors.onSecondaryContainer} size={32} />
      <View style={styles.checkoutCopy}>
        <Text style={styles.onlineHeroTitle}>Médicos de prontidão</Text>
        <Text style={styles.onlineHeroText}>Atendimento online com clínicos disponíveis agora.</Text>
      </View>
    </View>
    <View style={styles.listStack}>
      {onlineDoctors.map((doctor) => (
        <DoctorCard doctor={doctor} key={doctor.id} />
      ))}
    </View>
  </>
);

const DoctorCard = ({ doctor }: { doctor: (typeof onlineDoctors)[number] }) => (
  <View style={styles.doctorCard}>
    <View style={styles.doctorAvatar}>
      <Stethoscope color={colors.primary} size={26} />
    </View>
    <View style={styles.doctorCopy}>
      <Text style={styles.doctorName}>{doctor.name}</Text>
      <Text style={styles.doctorMeta}>{doctor.crm}</Text>
      <View style={styles.doctorStats}>
        <Text style={styles.doctorStat}>Espera {doctor.wait}</Text>
        <Text style={styles.doctorStat}>Avaliação {doctor.rating}</Text>
      </View>
    </View>
    <Pressable accessibilityRole="button" style={styles.consultButton}>
      <Video color={colors.onPrimary} size={16} />
      <Text style={styles.consultButtonText}>Consultar</Text>
    </Pressable>
  </View>
);

const FinanceScreen = () => (
  <>
    <View style={styles.financeHero}>
      <Text style={styles.financeLabel}>Saldo disponível</Text>
      <Text style={styles.financeValue}>R$ 2.480,00</Text>
      <Text style={styles.financeCopy}>Plano Premium ativo • Próxima cobrança em 2 dias</Text>
    </View>
    <View style={styles.financeActionGrid}>
      <FinanceAction icon="receipt" label="Pagar Fatura" subtitle="Boletos e convênios" />
      <FinanceAction icon="send" label="Transferir" subtitle="Envio rápido PIX" />
      <FinanceAction icon="history" label="Histórico" subtitle="Ver tudo" />
    </View>
    <Text style={styles.sectionTitle}>Pagamentos Pendentes</Text>
    <View style={styles.listStack}>
      {financeItems.map((item) => (
        <FinanceDueCard item={item} key={item.id} />
      ))}
    </View>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Histórico Recente</Text>
      <Text style={styles.linkText}>Completo</Text>
    </View>
    <View style={styles.listStack}>
      {financeHistory.map((item) => (
        <FinanceHistoryRow item={item} key={item.id} />
      ))}
    </View>
  </>
);

const FinanceAction = ({ icon, label, subtitle }: { icon: 'receipt' | 'send' | 'history'; label: string; subtitle: string }) => (
  <View style={styles.financeAction}>
    <View style={styles.financeActionIcon}>
      {icon === 'receipt' ? <Receipt color={colors.primary} size={22} /> : null}
      {icon === 'send' ? <Send color={colors.primary} size={22} /> : null}
      {icon === 'history' ? <History color={colors.primary} size={22} /> : null}
    </View>
    <View>
      <Text style={styles.financeActionLabel}>{label}</Text>
      <Text style={styles.financeActionSubtitle}>{subtitle}</Text>
    </View>
  </View>
);

const FinanceDueCard = ({ item }: { item: (typeof financeItems)[number] }) => (
  <View style={styles.financeDueCard}>
    <View style={styles.financeDueLeft}>
      <Text style={styles.financeDueTitle}>{item.title}</Text>
      <Text style={[styles.financeDueDate, item.urgent && styles.financeDueDateUrgent]}>{item.due}</Text>
    </View>
    <View style={styles.financeDueRight}>
      <Text style={styles.financeDueValue}>{item.value}</Text>
      <Text style={[styles.financeDueAction, !item.urgent && styles.financeDueActionMuted]}>{item.action}</Text>
    </View>
  </View>
);

const FinanceHistoryRow = ({ item }: { item: (typeof financeHistory)[number] }) => (
  <View style={styles.financeHistoryRow}>
    <View style={styles.examQueueIcon}>
      <CreditCard color={colors.primary} size={20} />
    </View>
    <View style={styles.appointmentCopy}>
      <Text style={styles.appointmentTitle}>{item.title}</Text>
      <Text style={styles.appointmentSubtitle}>{item.date}</Text>
    </View>
    <Text style={[styles.financeHistoryValue, item.value.startsWith('+') && styles.financeHistoryValuePositive]}>{item.value}</Text>
  </View>
);

const LucasScreen = ({ data }: { data: AppData }) => {
  const lucas = data.family.dependents.find((dependent) => dependent.id === 'lucas');

  return (
    <>
      <View style={styles.lucasProfileCard}>
        {lucas?.avatarUrl ? <Image source={{ uri: lucas.avatarUrl }} style={styles.lucasAvatar} /> : <View style={styles.lucasAvatar} />}
        <Text style={styles.lucasName}>Lucas Soares</Text>
        <Text style={styles.lucasMeta}>Dependente • 7 anos</Text>
        <View style={styles.lucasMetricGrid}>
          <FamilyMetric metric={{ label: 'BPM', unit: 'bpm', value: 78 }} />
          <FamilyMetric metric={{ label: 'Glicose', unit: 'mg/dL', value: 91 }} />
        </View>
      </View>
      <View style={styles.nextConsultCard}>
        <CalendarClock color={colors.onPrimaryContainer} size={30} />
        <View style={styles.checkoutCopy}>
          <Text style={styles.nextConsultTitle}>Próxima Consulta</Text>
          <Text style={styles.nextConsultText}>Agendada para 12 de Agosto</Text>
        </View>
        <Text style={styles.nextConsultButton}>Detalhes</Text>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Histórico de Atividades</Text>
        <Text style={styles.linkText}>Filtrar</Text>
      </View>
      <View style={styles.listStack}>
        {lucasActivities.map((activity) => (
          <LucasActivity activity={activity} key={activity.id} />
        ))}
      </View>
    </>
  );
};

const LucasActivity = ({ activity }: { activity: (typeof lucasActivities)[number] }) => (
  <View style={styles.historyCard}>
    <View style={styles.historyIconBox}>
      {activity.icon === 'medical' ? <BriefcaseMedical color={colors.primary} size={20} /> : null}
      {activity.icon === 'vaccine' ? <Syringe color={colors.primary} size={20} /> : null}
      {activity.icon === 'document' ? <FileText color={colors.primary} size={20} /> : null}
    </View>
    <View style={styles.historyCardCopy}>
      <Text style={styles.historyCardTitle}>{activity.title}</Text>
      <Text style={styles.historySubtitle}>{activity.subtitle}</Text>
    </View>
    <Text style={styles.historyCardTrailing}>{activity.date}</Text>
  </View>
);

const FamilySummaryCard = ({ item }: { item: FamilySummary }) => {
  const secondary = item.tone === 'secondary';

  return (
    <View style={[styles.summaryCard, secondary ? styles.summaryCardSecondary : styles.summaryCardTertiary]}>
      {item.icon === 'group' ? <UsersRound color={secondary ? colors.secondary : colors.tertiary} size={20} /> : null}
      {item.icon === 'shield' ? <ShieldCheck color={secondary ? colors.secondary : colors.tertiary} size={20} /> : null}
      <Text style={styles.summaryLabel}>{item.label}</Text>
      <Text style={[styles.summaryValue, !secondary && styles.summaryValueTertiary]}>{item.value}</Text>
    </View>
  );
};

const HistoryScreen = ({ data }: { data: AppData }) => (
  <>
    <View style={styles.historyHero}>
      <Text style={styles.historyHeroTitle}>Histórico</Text>
      <Text style={styles.historyHeroCopy}>Acompanhe sua jornada de saúde</Text>
    </View>
    <ScrollView horizontal contentContainerStyle={styles.filterRow} showsHorizontalScrollIndicator={false}>
      {data.history.filters.map((filter, index) => (
        <View key={filter} style={[styles.filterChip, index === 0 && styles.filterChipActive]}>
          <Text style={[styles.filterChipText, index === 0 && styles.filterChipTextActive]}>{filter}</Text>
        </View>
      ))}
    </ScrollView>
    <View style={styles.historyGroups}>
      {data.history.groups.map((group) => (
        <HistoryGroupSection group={group} key={group.id} />
      ))}
    </View>
    <View style={styles.insightGrid}>
      {data.history.insights.map((insight) => (
        <InsightCard insight={insight} key={insight.id} />
      ))}
    </View>
  </>
);

const HistoryGroupSection = ({ group }: { group: HistoryGroup }) => (
  <View style={styles.historyGroup}>
    <View style={styles.historyGroupTitleRow}>
      <View style={[styles.historyGroupDot, { backgroundColor: dotColor[group.dotTone] }]} />
      <Text style={styles.historyGroupTitle}>{group.date}</Text>
    </View>
    <View style={styles.listStack}>
      {group.cards.map((card) => (
        <HistoryEntryCard card={card} key={card.id} />
      ))}
    </View>
  </View>
);

const HistoryEntryCard = ({ card }: { card: HistoryCard }) => (
  <View style={styles.historyCard}>
    <View style={[styles.historyIconBox, historyIconTone(card.tone)]}>
      {card.icon === 'heart' ? <HeartPulse color={historyIconColor(card.tone)} size={20} /> : null}
      {card.icon === 'document' ? <FileText color={historyIconColor(card.tone)} size={20} /> : null}
      {card.icon === 'vaccine' ? <Syringe color={historyIconColor(card.tone)} size={20} /> : null}
      {card.icon === 'medical' ? <BriefcaseMedical color={historyIconColor(card.tone)} size={20} /> : null}
    </View>
    <View style={styles.historyCardCopy}>
      <View style={styles.historyCardTitleRow}>
        <Text numberOfLines={1} style={styles.historyCardTitle}>
          {card.title}
        </Text>
        <Text style={[styles.historyCardTrailing, card.status === 'done' && styles.doneText]}>{card.trailing}</Text>
      </View>
      {card.metrics ? (
        <View style={styles.historyMetricRow}>
          {card.metrics.map((metric) => (
            <View key={metric.label} style={styles.historyMetric}>
              <Text style={styles.historyMetricLabel}>{metric.label}</Text>
              <Text style={styles.historyMetricValue}>{metric.value}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {card.subtitle ? <Text style={styles.historySubtitle}>{card.subtitle}</Text> : null}
    </View>
    {card.icon === 'document' ? <Download color={colors.outline} size={18} /> : null}
    {card.status === 'done' ? <CheckCircle2 color={colors.secondary} size={18} /> : null}
    {card.icon === 'medical' ? <ChevronRight color={colors.outline} size={18} /> : null}
  </View>
);

const historyIconTone = (tone: HistoryCard['tone']) => {
  if (tone === 'secondary') {
    return { backgroundColor: colors.secondaryContainer };
  }

  if (tone === 'tertiary') {
    return { backgroundColor: colors.tertiaryContainer };
  }

  if (tone === 'primary') {
    return { backgroundColor: colors.primaryContainer };
  }

  return { backgroundColor: colors.surfaceContainer };
};

const historyIconColor = (tone: HistoryCard['tone']) => {
  if (tone === 'secondary') {
    return colors.onSecondaryContainer;
  }

  if (tone === 'tertiary' || tone === 'primary') {
    return colors.onPrimaryContainer;
  }

  return colors.onSurfaceVariant;
};

const InsightCard = ({ insight }: { insight: HistoryInsight }) => {
  const secondary = insight.tone === 'secondary';

  return (
    <View style={[styles.insightCard, secondary ? styles.insightSecondary : styles.insightTertiary]}>
      {insight.icon === 'trend' ? (
        <TrendingUp color={secondary ? colors.onSecondaryContainer : colors.onTertiaryFixed} size={22} />
      ) : (
        <Activity color={secondary ? colors.onSecondaryContainer : colors.onTertiaryFixed} size={22} />
      )}
      <View>
        <Text style={[styles.insightLabel, !secondary && styles.insightLabelTertiary]}>{insight.label}</Text>
        <Text style={[styles.insightValue, !secondary && styles.insightValueTertiary]}>{insight.value}</Text>
      </View>
    </View>
  );
};

const ProfileScreen = ({ data }: { data: AppData }) => (
  <>
    <View style={styles.profileCard}>
      <Image source={{ uri: data.user.avatarUrl }} style={styles.profileAvatar} />
      <Text style={styles.profileName}>{data.user.name}</Text>
      <Text style={styles.profilePlan}>{data.user.plan}</Text>
    </View>
    <View style={styles.profileGrid}>
      <ProfileInfo label="Equipe" value={data.profile.careTeam} />
      <ProfileInfo label="Próximo Exame" value={data.profile.nextExam} />
      <ProfileInfo label="Fonte" value="mockAppData.json" />
      <ProfileInfo label="Integração" value="/api/mobile/app-data" />
    </View>
  </>
);

const ProfileInfo = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.profileInfo}>
    <Text style={styles.profileInfoLabel}>{label}</Text>
    <Text style={styles.profileInfoValue}>{value}</Text>
  </View>
);

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const { data, error, loading, reload } = useAppData();

  if (loading && !data) {
    return <LoadingState />;
  }

  if (error && !data) {
    return <ErrorState message={error} reload={reload} />;
  }

  if (!data) {
    return <ErrorState message="Sem dados do JSON mock." reload={reload} />;
  }

  const detailTabs = activeTab === 'online' || activeTab === 'lucas' || activeTab === 'finance';
  const title =
    activeTab === 'family'
      ? 'Minha Família'
      : activeTab === 'exams'
        ? 'Exames'
        : activeTab === 'history'
          ? 'Histórico'
          : activeTab === 'finance'
            ? 'Financeiro'
            : activeTab === 'online'
              ? 'Consulta Online'
              : activeTab === 'lucas'
                ? 'Lucas Soares'
                : `Olá ${data.user.firstName}`;
  const content =
    activeTab === 'family' ? (
      <FamilyScreen data={data} onLucas={() => setActiveTab('lucas')} />
    ) : activeTab === 'exams' ? (
      <ExamsScreen onFinance={() => setActiveTab('finance')} onOnline={() => setActiveTab('online')} />
    ) : activeTab === 'history' ? (
      <HistoryScreen data={data} />
    ) : activeTab === 'finance' ? (
      <FinanceScreen />
    ) : activeTab === 'online' ? (
      <OnlineScreen />
    ) : activeTab === 'lucas' ? (
      <LucasScreen data={data} />
    ) : activeTab === 'profile' ? (
      <ProfileScreen data={data} />
    ) : (
      <DashboardScreen data={data} onChangeTab={setActiveTab} />
    );

  return (
    <ScreenShell
      activeTab={activeTab}
      data={data}
      detail={detailTabs ? { onBack: () => setActiveTab(activeTab === 'lucas' ? 'family' : activeTab === 'online' ? 'exams' : 'dashboard') } : undefined}
      onChangeTab={setActiveTab}
      title={title}
    >
      {content}
    </ScreenShell>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <AppContent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appShell: {
    alignSelf: 'center',
    backgroundColor: colors.background,
    flex: 1,
    maxWidth: 390,
    position: 'relative',
    width: '100%',
  },
  scrollContent: {
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 104,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerIdentity: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    minWidth: 0,
  },
  headerAvatar: {
    borderColor: colors.primaryContainer,
    borderRadius: 20,
    borderWidth: 2,
    height: 40,
    width: 40,
  },
  headerTitle: {
    color: colors.onSurface,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  headerIconButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  measurementBanner: {
    backgroundColor: colors.secondaryContainer,
    borderRadius: 16,
    minHeight: 166,
    overflow: 'hidden',
    padding: 24,
    position: 'relative',
    ...shadow,
  },
  measurementWatermark: {
    opacity: 0.1,
    position: 'absolute',
    right: -22,
    top: -22,
  },
  measurementTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  measurementOverline: {
    color: colors.onSecondaryContainer,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    lineHeight: 16,
    opacity: 0.82,
    textTransform: 'uppercase',
  },
  measurementTime: {
    color: colors.onSecondaryContainer,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  measurementGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  metricReadout: {
    flex: 1,
  },
  metricLabel: {
    color: colors.onSecondaryContainer,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    opacity: 0.82,
    textTransform: 'uppercase',
  },
  metricValueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 4,
  },
  metricValue: {
    color: colors.onSecondaryContainer,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  metricUnit: {
    color: colors.onSecondaryContainer,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  statusPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(77,108,0,0.1)',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusDot: {
    backgroundColor: colors.onSecondaryContainer,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  statusText: {
    color: colors.onSecondaryContainer,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionButton: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 16,
    flexBasis: '47%',
    flexGrow: 1,
    gap: 8,
    justifyContent: 'center',
    minWidth: 140,
    padding: 24,
  },
  actionLabel: {
    color: colors.onPrimaryContainer,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.onSurface,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  linkText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textDecorationLine: 'underline',
  },
  timelineWrap: {
    gap: 24,
    paddingLeft: 32,
    position: 'relative',
  },
  timelineLine: {
    backgroundColor: colors.outlineVariant,
    bottom: 8,
    left: 11,
    opacity: 0.5,
    position: 'absolute',
    top: 8,
    width: 2,
  },
  timelineItem: {
    position: 'relative',
  },
  timelineDot: {
    borderColor: colors.background,
    borderRadius: 7,
    borderWidth: 2,
    height: 14,
    left: -27,
    position: 'absolute',
    top: 6,
    width: 14,
    zIndex: 1,
  },
  timelineCard: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceContainer,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadow,
  },
  timelineCardWithImage: {
    paddingBottom: 0,
  },
  timelineCardBody: {
    gap: 8,
    padding: 16,
  },
  timelineMetaRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineDate: {
    color: colors.onSurface,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  timelineTime: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  timelineDetailRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  timelineDetail: {
    color: colors.onSurfaceVariant,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  timelineTagRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  timelineTag: {
    backgroundColor: colors.secondaryContainer,
    borderRadius: 4,
    color: colors.onSecondaryContainer,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 2,
    textTransform: 'uppercase',
  },
  timelineFacility: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    lineHeight: 16,
  },
  mapImage: {
    height: 128,
    opacity: 0.9,
    width: '100%',
  },
  familyCard: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 24,
    position: 'relative',
    ...shadow,
  },
  familyWatermark: {
    opacity: 0.1,
    position: 'absolute',
    right: -24,
    top: -24,
  },
  familyTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  familyIdentity: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  familyAvatarFrame: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    height: 64,
    padding: 2,
    width: 64,
  },
  familyAvatar: {
    borderRadius: 12,
    flex: 1,
  },
  familyCopy: {
    flex: 1,
    gap: 6,
  },
  familyName: {
    color: colors.onPrimary,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  planBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondaryContainer,
    borderRadius: 999,
    color: colors.onSecondaryContainer,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 2,
    textTransform: 'uppercase',
  },
  historyLink: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    opacity: 0.82,
  },
  historyLinkText: {
    color: colors.onPrimaryContainer,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  familyMetrics: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  familyMetricCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    padding: 16,
  },
  familyMetricTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  familyMetricLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  familyMetricValueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  familyMetricValue: {
    color: colors.onPrimary,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  familyMetricUnit: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  familyFooter: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.1)',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
  },
  lastMeasureRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  familyFooterText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  familyMiniAvatars: {
    flexDirection: 'row',
  },
  familyMiniAvatar: {
    backgroundColor: colors.surfaceContainerHighest,
    borderColor: colors.primaryContainer,
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    width: 24,
  },
  familyMiniAvatarOverlap: {
    marginLeft: -8,
  },
  addButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  listStack: {
    gap: 12,
  },
  memberRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: 'rgba(225,227,228,0.6)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    ...shadow,
  },
  memberLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  memberAvatarImage: {
    borderRadius: 12,
    height: 48,
    width: 48,
  },
  memberAvatarFallback: {
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  memberName: {
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  memberStatusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  memberStatusDot: {
    backgroundColor: colors.secondary,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  memberStatusDotAttention: {
    backgroundColor: colors.error,
  },
  memberStatusText: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  memberActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    minHeight: 104,
    padding: 16,
  },
  summaryCardSecondary: {
    backgroundColor: 'rgba(192,240,99,0.3)',
    borderColor: 'rgba(192,240,99,0.5)',
  },
  summaryCardTertiary: {
    backgroundColor: 'rgba(66,129,96,0.1)',
    borderColor: 'rgba(66,129,96,0.2)',
  },
  summaryLabel: {
    color: colors.onSecondaryContainer,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    marginTop: 8,
  },
  summaryValue: {
    color: colors.onSecondaryContainer,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  summaryValueTertiary: {
    color: colors.tertiary,
  },
  historyHero: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 16,
    height: 128,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    padding: 24,
    ...shadow,
  },
  historyHeroTitle: {
    color: colors.onPrimaryContainer,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  historyHeroCopy: {
    color: colors.onPrimaryContainer,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  filterRow: {
    gap: 8,
    paddingBottom: 2,
  },
  filterChip: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: colors.secondaryContainer,
  },
  filterChipText: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  filterChipTextActive: {
    color: colors.onSecondaryContainer,
  },
  historyGroups: {
    gap: 24,
  },
  historyGroup: {
    gap: 16,
  },
  historyGroupTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  historyGroupDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  historyGroupTitle: {
    color: colors.onSurface,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  historyCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceContainer,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    ...shadow,
  },
  historyIconBox: {
    alignItems: 'center',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  historyCardCopy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  historyCardTitleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  historyCardTitle: {
    color: colors.onSurface,
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  historyCardTrailing: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  doneText: {
    color: colors.secondary,
    fontWeight: '700',
  },
  historyMetricRow: {
    flexDirection: 'row',
    gap: 24,
  },
  historyMetric: {
    gap: 1,
  },
  historyMetricLabel: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.6,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  historyMetricValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  historySubtitle: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
  },
  insightGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  insightCard: {
    borderRadius: 16,
    flex: 1,
    height: 128,
    justifyContent: 'space-between',
    padding: 16,
  },
  insightSecondary: {
    backgroundColor: colors.secondaryContainer,
  },
  insightTertiary: {
    backgroundColor: colors.tertiaryFixed,
  },
  insightLabel: {
    color: colors.onSecondaryContainer,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  insightLabelTertiary: {
    color: colors.onTertiaryFixed,
  },
  insightValue: {
    color: colors.onSecondaryContainer,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  insightValueTertiary: {
    color: colors.onTertiaryFixed,
  },
  pageIntro: {
    gap: 4,
    paddingTop: 4,
  },
  pageTitle: {
    color: colors.onSurface,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  pageCopy: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  serviceCard: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceContainer,
    borderRadius: 16,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    gap: 18,
    minHeight: 132,
    minWidth: 140,
    padding: 20,
    ...shadow,
  },
  serviceCardPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  serviceCardSecondary: {
    backgroundColor: colors.secondaryContainer,
    borderColor: colors.secondaryContainer,
  },
  serviceLabel: {
    color: colors.onSurface,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  serviceLabelStrong: {
    color: colors.onPrimaryContainer,
  },
  appointmentCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceContainer,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    ...shadow,
  },
  appointmentDate: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  appointmentDateSecondary: {
    backgroundColor: colors.secondaryContainer,
  },
  appointmentDateText: {
    color: colors.onPrimaryContainer,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  appointmentTimeText: {
    color: colors.onPrimaryContainer,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
  appointmentCopy: {
    flex: 1,
    minWidth: 0,
  },
  appointmentTitle: {
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  appointmentSubtitle: {
    color: colors.onSurfaceVariant,
    fontSize: 13,
    lineHeight: 18,
  },
  liveBadge: {
    backgroundColor: colors.secondaryContainer,
    borderRadius: 999,
    color: colors.onSecondaryContainer,
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 14,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  examQueueRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceContainer,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    ...shadow,
  },
  examQueueIcon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  examQueueMeta: {
    alignItems: 'flex-end',
    maxWidth: 90,
  },
  examStatus: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  examTime: {
    color: colors.onSurfaceVariant,
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'right',
  },
  checkoutCard: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 14,
    padding: 20,
    ...shadow,
  },
  checkoutCopy: {
    flex: 1,
    minWidth: 0,
  },
  checkoutTitle: {
    color: colors.onPrimary,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  checkoutText: {
    color: colors.onPrimaryContainer,
    fontSize: 14,
    lineHeight: 20,
  },
  searchPanel: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceContainer,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  searchPlaceholder: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
  },
  onlineHero: {
    alignItems: 'center',
    backgroundColor: colors.secondaryContainer,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 16,
    padding: 20,
  },
  onlineHeroTitle: {
    color: colors.onSecondaryContainer,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  onlineHeroText: {
    color: colors.onSecondaryContainer,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.82,
  },
  doctorCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceContainer,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    ...shadow,
  },
  doctorAvatar: {
    alignItems: 'center',
    backgroundColor: colors.tertiaryFixed,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  doctorCopy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  doctorName: {
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  doctorMeta: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    lineHeight: 16,
  },
  doctorStats: {
    flexDirection: 'row',
    gap: 8,
  },
  doctorStat: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
  },
  consultButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    gap: 4,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  consultButtonText: {
    color: colors.onPrimary,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
  },
  financeHero: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    gap: 6,
    padding: 24,
    ...shadow,
  },
  financeLabel: {
    color: colors.onPrimaryContainer,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  financeValue: {
    color: colors.onPrimary,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
  },
  financeCopy: {
    color: colors.onPrimaryContainer,
    fontSize: 13,
    lineHeight: 18,
  },
  financeActionGrid: {
    gap: 12,
  },
  financeAction: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  financeActionIcon: {
    alignItems: 'center',
    backgroundColor: colors.tertiaryFixed,
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  financeActionLabel: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  financeActionSubtitle: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    lineHeight: 16,
  },
  financeDueCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceContainer,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    ...shadow,
  },
  financeDueLeft: {
    flex: 1,
    minWidth: 0,
  },
  financeDueTitle: {
    color: colors.onSurface,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  financeDueDate: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  financeDueDateUrgent: {
    color: colors.error,
  },
  financeDueRight: {
    alignItems: 'flex-end',
  },
  financeDueValue: {
    color: colors.onSurface,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  financeDueAction: {
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 2,
    textTransform: 'uppercase',
  },
  financeDueActionMuted: {
    borderColor: colors.outline,
    color: colors.secondary,
  },
  financeHistoryRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  financeHistoryValue: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  financeHistoryValuePositive: {
    color: colors.primary,
  },
  lucasProfileCard: {
    alignItems: 'center',
    backgroundColor: colors.primaryContainer,
    borderRadius: 18,
    padding: 24,
    ...shadow,
  },
  lucasAvatar: {
    backgroundColor: colors.surfaceContainerHigh,
    borderColor: colors.onPrimaryContainer,
    borderRadius: 42,
    borderWidth: 3,
    height: 84,
    width: 84,
  },
  lucasName: {
    color: colors.onPrimary,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
    marginTop: 12,
  },
  lucasMeta: {
    color: colors.onPrimaryContainer,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  lucasMetricGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  nextConsultCard: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 14,
    padding: 18,
  },
  nextConsultTitle: {
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  nextConsultText: {
    color: colors.onPrimaryContainer,
    fontSize: 13,
    lineHeight: 18,
  },
  nextConsultButton: {
    backgroundColor: colors.onPrimaryContainer,
    borderRadius: 999,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.primaryContainer,
    borderRadius: 16,
    padding: 24,
    ...shadow,
  },
  profileAvatar: {
    borderColor: colors.onPrimaryContainer,
    borderRadius: 40,
    borderWidth: 3,
    height: 80,
    width: 80,
  },
  profileName: {
    color: colors.onPrimary,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    marginTop: 12,
    textAlign: 'center',
  },
  profilePlan: {
    color: colors.secondaryContainer,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  profileInfo: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceContainer,
    borderRadius: 16,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 96,
    padding: 16,
    ...shadow,
  },
  profileInfoLabel: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  profileInfoValue: {
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    marginTop: 8,
  },
  bottomNav: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    bottom: 0,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-around',
    left: 0,
    paddingHorizontal: 8,
    paddingTop: 8,
    position: 'absolute',
    right: 0,
    ...shadow,
  },
  navItem: {
    alignItems: 'center',
    borderRadius: 999,
    gap: 2,
    minHeight: 48,
    minWidth: 64,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  navItemActive: {
    backgroundColor: colors.secondaryContainer,
  },
  navText: {
    color: colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
  },
  navTextActive: {
    color: colors.onSecondaryContainer,
  },
  statePanel: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  },
  stateText: {
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  retryButtonText: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
