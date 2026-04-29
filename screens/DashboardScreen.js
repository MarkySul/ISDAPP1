import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { COLORS, STATUS_COLORS } from '../constants/colors';

export default function DashboardScreen() {
  // Define thresholds for two-tier warning system
  const THRESHOLDS = {
    ph: {
      optimal: { min: 6.5, max: 8.5 },
      warning: { min: 6.0, max: 9.0 },
      critical: { min: 5.5, max: 9.5 }
    },
    turbidity: {
      optimal: { min: 0, max: 5 },
      warning: { min: 0, max: 10 },
      critical: { min: 0, max: 25 }
    },
    dissolvedOxygen: {
      optimal: { min: 5, max: 12 },
      warning: { min: 3, max: 15 },
      critical: { min: 2, max: 20 }
    },
    tds: {
      optimal: { min: 0, max: 300 },
      warning: { min: 0, max: 500 },
      critical: { min: 0, max: 1000 }
    },
    conductivity: {
      optimal: { min: 100, max: 800 },
      warning: { min: 50, max: 1200 },
      critical: { min: 25, max: 2000 }
    },
    temperature: {
      optimal: { min: 25, max: 30 },
      warning: { min: 22, max: 32 },
      critical: { min: 20, max: 35 }
    }
  };

  // Function to determine status based on two-tier warning logic
  const getSensorStatus = (sensorName, value) => {
    const threshold = THRESHOLDS[sensorName.toLowerCase().replace(' ', '')];
    if (!threshold) return 'normal';

    // Check critical first (most severe)
    if (value < threshold.critical.min || value > threshold.critical.max) {
      return 'critical';
    }
    // Check warning (moderate)
    else if (value < threshold.warning.min || value > threshold.warning.max) {
      return 'warning';
    }
    // Otherwise normal (optimal)
    else {
      return 'normal';
    }
  };

  const [sensors, setSensors] = useState([
    { id: 1, name: 'pH', value: 7.2, unit: '', status: 'normal' },
    { id: 2, name: 'Turbidity', value: 2.5, unit: 'NTU', status: 'normal' },
    { id: 3, name: 'Dissolved Oxygen', value: 8.4, unit: 'mg/L', status: 'normal' },
    { id: 4, name: 'TDS', value: 450, unit: 'ppm', status: 'warning' },
    { id: 5, name: 'Electrical Conductivity', value: 680, unit: 'µS/cm', status: 'normal' },
    { id: 6, name: 'Temperature', value: 28.5, unit: '°C', status: 'warning' },
  ]);

  // Simulate live data updates with status calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev =>
        prev.map(sensor => {
          const newValue = parseFloat((sensor.value + (Math.random() - 0.5) * 0.2).toFixed(2));
          const newStatus = getSensorStatus(sensor.name, newValue);
          return {
            ...sensor,
            value: newValue,
            status: newStatus
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Dashboard</Text>
        <Text style={styles.headerSubtitle}>Water Quality Monitoring</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Overall Status */}
        <View style={[styles.statusCard, (() => {
          const criticalCount = sensors.filter(s => s.status === 'critical').length;
          const warningCount = sensors.filter(s => s.status === 'warning').length;

          if (criticalCount > 0) {
            return { borderLeftColor: COLORS.critical };
          } else if (warningCount > 0) {
            return { borderLeftColor: COLORS.warning };
          } else {
            return { borderLeftColor: COLORS.normal };
          }
        })()]}>
          <View style={styles.statusIndicator}>
            <Text style={[styles.statusDot, (() => {
              const criticalCount = sensors.filter(s => s.status === 'critical').length;
              const warningCount = sensors.filter(s => s.status === 'warning').length;

              if (criticalCount > 0) {
                return { color: COLORS.critical };
              } else if (warningCount > 0) {
                return { color: COLORS.warning };
              } else {
                return { color: COLORS.normal };
              }
            })()]}>●</Text>
          </View>
          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>System Status</Text>
            <Text style={styles.statusValue}>
              {(() => {
                const criticalCount = sensors.filter(s => s.status === 'critical').length;
                const warningCount = sensors.filter(s => s.status === 'warning').length;

                if (criticalCount > 0) {
                  return `${criticalCount} Critical Alert${criticalCount > 1 ? 's' : ''}`;
                } else if (warningCount > 0) {
                  return `${warningCount} Warning${warningCount > 1 ? 's' : ''}`;
                } else {
                  return 'All Parameters Normal';
                }
              })()}
            </Text>
          </View>
        </View>

        {/* Sensors Grid */}
        <View style={styles.sensorsGrid}>
          {sensors.map(sensor => (
            <View key={sensor.id} style={styles.sensorCard}>
              <Text style={styles.sensorName}>{sensor.name}</Text>
              <View style={styles.sensorValueContainer}>
                <Text style={styles.sensorValue}>{sensor.value}</Text>
                <Text style={styles.sensorUnit}>{sensor.unit}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[sensor.status].bg }]}>
                <Text style={[styles.statusBadgeText, { color: STATUS_COLORS[sensor.status].text }]}>
                  {sensor.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Last Update Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Last Update</Text>
          <Text style={styles.infoValue}>Just now</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textInfo,
    marginTop: 4,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  statusIndicator: {
    marginRight: 12,
  },
  statusDot: {
    fontSize: 24,
    color: COLORS.normal,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginTop: 4,
  },
  sensorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sensorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
  },
  sensorName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sensorValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sensorValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sensorUnit: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 4,
    marginBottom: 4,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  infoTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: 4,
  },
});
