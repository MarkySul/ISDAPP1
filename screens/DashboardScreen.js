import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { COLORS, STATUS_COLORS } from '../constants/colors';

export default function DashboardScreen({ navigation }) {
  const THRESHOLDS = {
    ph: {
      optimal: { min: 6.5, max: 8.5 },
      warning: { min: 6.0, max: 9.0 },
      critical: { min: 5.5, max: 9.5 },
    },
    turbidity: {
      optimal: { min: 0, max: 5 },
      warning: { min: 0, max: 10 },
      critical: { min: 0, max: 25 },
    },
    dissolvedOxygen: {
      optimal: { min: 5, max: 12 },
      warning: { min: 3, max: 15 },
      critical: { min: 2, max: 20 },
    },
    tds: {
      optimal: { min: 0, max: 300 },
      warning: { min: 0, max: 500 },
      critical: { min: 0, max: 1000 },
    },
    conductivity: {
      optimal: { min: 100, max: 800 },
      warning: { min: 50, max: 1200 },
      critical: { min: 25, max: 2000 },
    },
    temperature: {
      optimal: { min: 25, max: 30 },
      warning: { min: 22, max: 32 },
      critical: { min: 20, max: 35 },
    },
  };

  const getSensorStatus = (sensorName, value) => {
    const threshold = THRESHOLDS[sensorName.toLowerCase().replace(' ', '')];
    if (!threshold) return 'normal';
    if (value < threshold.critical.min || value > threshold.critical.max) return 'critical';
    else if (value < threshold.warning.min || value > threshold.warning.max) return 'warning';
    else return 'normal';
  };

  const SENSOR_ICONS = {
    'pH': '⚗',
    'Turbidity': '💧',
    'Dissolved Oxygen': '🫧',
    'TDS': '🔬',
    'Electrical Conductivity': '⚡',
    'Temperature': '🌡',
  };

  const [sensors, setSensors] = useState([
    { id: 1, name: 'pH', value: 7.2, unit: '', status: 'normal' },
    { id: 2, name: 'Turbidity', value: 2.5, unit: 'NTU', status: 'normal' },
    { id: 3, name: 'Dissolved Oxygen', value: 8.4, unit: 'mg/L', status: 'normal' },
    { id: 4, name: 'TDS', value: 450, unit: 'ppm', status: 'warning' },
    { id: 5, name: 'Electrical Conductivity', value: 680, unit: 'µS/cm', status: 'normal' },
    { id: 6, name: 'Temperature', value: 28.5, unit: '°C', status: 'warning' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev =>
        prev.map(sensor => {
          const newValue = parseFloat(
            (sensor.value + (Math.random() - 0.5) * 0.2).toFixed(2)
          );
          const newStatus = getSensorStatus(sensor.name, newValue);
          return { ...sensor, value: newValue, status: newStatus };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const criticalCount = sensors.filter(s => s.status === 'critical').length;
  const warningCount = sensors.filter(s => s.status === 'warning').length;

  const overallStatus =
    criticalCount > 0
      ? { label: `${criticalCount} Critical Alert${criticalCount > 1 ? 's' : ''}`, color: COLORS.critical }
      : warningCount > 0
      ? { label: `${warningCount} Warning${warningCount > 1 ? 's' : ''}`, color: COLORS.warning }
      : { label: 'All Parameters Normal', color: COLORS.normal };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header Banner */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTag}>LIVE DASHBOARD</Text>
            <Text style={styles.headerTitle}>Water Quality</Text>
            <Text style={styles.headerSubtitle}>IoT Sensor Network · Monitoring</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileInitial}>A</Text>
            <View style={styles.profileOnlineDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Status Card */}
        <View style={[styles.statusCard, { borderLeftColor: overallStatus.color }]}>
          <View style={[styles.statusDotCircle, { backgroundColor: overallStatus.color + '22' }]}>
            <View style={[styles.statusDotInner, { backgroundColor: overallStatus.color }]} />
          </View>
          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>SYSTEM STATUS</Text>
            <Text style={[styles.statusValue, { color: overallStatus.color }]}>
              {overallStatus.label}
            </Text>
          </View>
        </View>

        {/* Sensors Grid */}
        <View style={styles.sensorsGrid}>
          {sensors.map(sensor => (
            <View key={sensor.id} style={styles.sensorCard}>
              <View
                style={[
                  styles.sensorAccentBar,
                  { backgroundColor: STATUS_COLORS[sensor.status].text },
                ]}
              />
              <Text style={styles.sensorIcon}>{SENSOR_ICONS[sensor.name] ?? '📡'}</Text>
              <Text style={styles.sensorName}>{sensor.name}</Text>
              <View style={styles.sensorValueRow}>
                <Text style={styles.sensorValue}>{sensor.value}</Text>
                {sensor.unit ? <Text style={styles.sensorUnit}>{sensor.unit}</Text> : null}
              </View>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[sensor.status].bg }]}>
                <Text style={[styles.statusBadgeText, { color: STATUS_COLORS[sensor.status].text }]}>
                  {sensor.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Last Update */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>LAST UPDATE</Text>
          <Text style={styles.infoValue}>Just now</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F7' },

  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTag: {
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 30,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 3,
  },
  profileBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1B5FA8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  profileOnlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ADE80',
    borderWidth: 2,
    borderColor: COLORS.primary,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statusDotCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statusDotInner: { width: 12, height: 12, borderRadius: 6 },
  statusContent: { flex: 1 },
  statusTitle: {
    fontSize: 10,
    color: '#9CA3AF',
    letterSpacing: 1,
    fontWeight: '600',
  },
  statusValue: { fontSize: 15, fontWeight: '700', marginTop: 3 },

  sensorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sensorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    width: '48%',
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sensorAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    opacity: 0.7,
  },
  sensorIcon: { fontSize: 18, marginTop: 6, marginBottom: 6, opacity: 0.5 },
  sensorName: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  sensorValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  sensorValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A2B45',
    letterSpacing: -0.5,
  },
  sensorUnit: { fontSize: 11, color: '#B0BAC6', marginLeft: 3, marginBottom: 4 },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  statusBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  infoLabel: { fontSize: 10, color: '#9CA3AF', letterSpacing: 1.2, fontWeight: '600' },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#1A2B45', marginTop: 4 },
});