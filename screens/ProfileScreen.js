import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { COLORS } from '../constants/colors';

// ── User data (replace with real auth/context later) ─────────────────────────
const USER = {
  name: 'Abe Reyes',
  role: 'Farm Manager',
  email: 'abe.reyes@farmshield.ph',
  location: 'Cagayan de Oro, Philippines',
  joined: 'January 2024',
  devicesOnline: 4,
  totalAlerts: 12,
  cropMonitored: 'Rice · Cacao · Banana',
};

// ── Reusable row components ───────────────────────────────────────────────────
function SectionHeader({ title }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={styles.rowBody}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

function ActionRow({ icon, label, onPress, danger }) {
  return (
    <TouchableOpacity style={styles.actionRow} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={[styles.actionLabel, danger && { color: '#E74C3C' }]}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function ToggleRow({ icon, label, value, onValueChange }) {
  return (
    <View style={styles.actionRow}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={[styles.actionLabel, { flex: 1 }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D5DB', true: COLORS.primary + '88' }}
        thumbColor={value ? COLORS.primary : '#9CA3AF'}
      />
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [liveSync, setLiveSync] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>
                {USER.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
          </View>
          <Text style={styles.userName}>{USER.name}</Text>
          <View style={styles.rolePill}>
            <Text style={styles.roleText}>{USER.role}</Text>
          </View>
          <Text style={styles.userEmail}>{USER.email}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{USER.devicesOnline}</Text>
            <Text style={styles.statLabel}>Devices{'\n'}Online</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{USER.totalAlerts}</Text>
            <Text style={styles.statLabel}>Alerts{'\n'}This Month</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Crops{'\n'}Monitored</Text>
          </View>
        </View>

        {/* Account Info */}
        <SectionHeader title="ACCOUNT INFO" />
        <View style={styles.card}>
          <InfoRow icon="📍" label="Location" value={USER.location} />
          <View style={styles.divider} />
          <InfoRow icon="🌾" label="Crops" value={USER.cropMonitored} />
          <View style={styles.divider} />
          <InfoRow icon="📅" label="Member Since" value={USER.joined} />
        </View>

        {/* Preferences */}
        <SectionHeader title="PREFERENCES" />
        <View style={styles.card}>
          <ToggleRow
            icon="🔔"
            label="Push Notifications"
            value={notifications}
            onValueChange={setNotifications}
          />
          <View style={styles.divider} />
          <ToggleRow
            icon="🔄"
            label="Live Data Sync"
            value={liveSync}
            onValueChange={setLiveSync}
          />
        </View>

        {/* Settings */}
        <SectionHeader title="SETTINGS" />
        <View style={styles.card}>
          <ActionRow
            icon="✏️"
            label="Edit Profile"
            onPress={() => Alert.alert('Edit Profile', 'Coming soon!')}
          />
          <View style={styles.divider} />
          <ActionRow
            icon="🔒"
            label="Change Password"
            onPress={() => Alert.alert('Change Password', 'Coming soon!')}
          />
          <View style={styles.divider} />
          <ActionRow
            icon="📡"
            label="Manage Devices"
            onPress={() => Alert.alert('Manage Devices', 'Coming soon!')}
          />
          <View style={styles.divider} />
          <ActionRow
            icon="❓"
            label="Help & Support"
            onPress={() => Alert.alert('Help & Support', 'Coming soon!')}
          />
        </View>

        {/* Version */}
        <Text style={styles.version}>FarmShield AI · v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F7' },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 24, color: '#fff', lineHeight: 28, marginTop: -2 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },

  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Avatar section
  avatarSection: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingBottom: 28,
    paddingTop: 8,
  },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#1B5FA8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 26, fontWeight: '700', color: '#fff' },
  userName: { fontSize: 20, fontWeight: '700', color: '#fff' },
  rolePill: {
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  roleText: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  userEmail: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 6 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 8,
  },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: { width: 1, backgroundColor: '#EEF2F7', marginVertical: 4 },

  // Section headers
  sectionHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1.2,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 52 },

  // Info row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowIcon: { fontSize: 18, width: 32, textAlign: 'center' },
  rowBody: { marginLeft: 4, flex: 1 },
  rowLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
  rowValue: { fontSize: 13, color: '#1A2B45', fontWeight: '600', marginTop: 2 },

  // Action row
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  actionLabel: { flex: 1, fontSize: 14, color: '#1A2B45', fontWeight: '500', marginLeft: 4 },
  chevron: { fontSize: 20, color: '#D1D5DB', marginTop: -1 },

  // Version
  version: {
    textAlign: 'center',
    fontSize: 11,
    color: '#B0BAC6',
    marginTop: 24,
    letterSpacing: 0.5,
  },
});