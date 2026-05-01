import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';

/* ───────── Components ───────── */

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
    <TouchableOpacity style={styles.actionRow} onPress={onPress}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={[styles.actionLabel, danger && { color: '#E74C3C' }]}>
        {label}
      </Text>
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
        trackColor={{ false: '#D1D5DB', true: (COLORS.primary || '#2e7d32') + '88' }}
        thumbColor={value ? COLORS.primary || '#2e7d32' : '#9CA3AF'}
      />
    </View>
  );
}

/* ───────── Main Screen ───────── */

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [liveSync, setLiveSync] = useState(true);

  // Load user from storage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await AsyncStorage.getItem('USER_DATA');
        if (data) {
          setUser(JSON.parse(data));
        }
      } catch (e) {
        console.log(e);
      }
    };

    loadUser();
  }, []);

  // Loading state
  if (!user) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {user.name?.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.devicesOnline || 0}</Text>
            <Text style={styles.statLabel}>Devices</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.totalAlerts || 0}</Text>
            <Text style={styles.statLabel}>Alerts</Text>
          </View>
        </View>

        {/* Info */}
        <SectionHeader title="ACCOUNT INFO" />
        <View style={styles.card}>
          <InfoRow icon="📍" label="Location" value={user.location} />
          <InfoRow icon="🌾" label="Crops" value={user.cropMonitored} />
          <InfoRow icon="📅" label="Joined" value={user.joined} />
        </View>

        {/* Preferences */}
        <SectionHeader title="PREFERENCES" />
        <View style={styles.card}>
          <ToggleRow
            icon="🔔"
            label="Notifications"
            value={notifications}
            onValueChange={setNotifications}
          />
          <ToggleRow
            icon="🔄"
            label="Live Sync"
            value={liveSync}
            onValueChange={setLiveSync}
          />
        </View>

        {/* Settings */}
        <SectionHeader title="SETTINGS" />
        <View style={styles.card}>
          <ActionRow icon="✏️" label="Edit Profile" onPress={() => Alert.alert('Coming soon')} />
          <ActionRow icon="🔒" label="Change Password" onPress={() => Alert.alert('Coming soon')} />
          <ActionRow icon="📡" label="Devices" onPress={() => Alert.alert('Coming soon')} />
          <ActionRow icon="❓" label="Help" onPress={() => Alert.alert('Coming soon')} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ───────── Styles ───────── */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F7' },

  header: {
    backgroundColor: COLORS.primary || '#2e7d32',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },

  headerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: { color: '#fff', fontSize: 22 },

  scrollContent: { paddingBottom: 40 },

  avatarSection: {
    backgroundColor: COLORS.primary || '#2e7d32',
    alignItems: 'center',
    padding: 20,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1B5FA8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarInitial: { color: '#fff', fontSize: 22 },

  userName: { color: '#fff', fontSize: 18, marginTop: 8 },

  userEmail: { color: '#ddd', fontSize: 12 },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 16,
  },

  statCard: { alignItems: 'center' },

  statValue: { fontSize: 20, color: COLORS.primary || '#2e7d32' },

  statLabel: { fontSize: 12 },

  sectionHeader: {
    marginTop: 16,
    marginLeft: 16,
    fontSize: 12,
    color: '#888',
  },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 10,
    padding: 10,
  },

  infoRow: { flexDirection: 'row', padding: 8 },

  rowIcon: { width: 30 },

  rowBody: { flex: 1 },

  rowLabel: { fontSize: 11 },

  rowValue: { fontSize: 13 },

  actionRow: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },

  actionLabel: { flex: 1 },

  chevron: { fontSize: 18, color: '#ccc' },
});