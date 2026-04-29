import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function AlertsScreen() {
  const [alerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Critical TDS Level',
      message: 'Total Dissolved Solids exceeded hazardous threshold (450 ppm > 500 ppm)',
      timestamp: '2 hours ago',
      parameter: 'TDS',
      value: '450 ppm',
      threshold: '500 ppm (Critical)',
      severity: 'Critical Alert',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Temperature Warning',
      message: 'Water temperature approaching hazardous levels (28.5°C)',
      timestamp: '1 hour ago',
      parameter: 'Temperature',
      value: '28.5°C',
      threshold: '30°C (Warning)',
      severity: 'Warning',
    },
    {
      id: 3,
      type: 'info',
      title: 'System Maintenance',
      message: 'Scheduled sensor calibration completed successfully',
      timestamp: '3 hours ago',
      parameter: 'System',
      value: 'OK',
      threshold: 'N/A',
      severity: 'Information',
    },
    {
      id: 4,
      type: 'normal',
      title: 'pH Level Normal',
      message: 'pH level returned to optimal range (7.2)',
      timestamp: '5 hours ago',
      parameter: 'pH',
      value: '7.2',
      threshold: '6.5-8.5 (Optimal)',
      severity: 'Normal',
    },
    {
      id: 5,
      type: 'warning',
      title: 'Low Dissolved Oxygen',
      message: 'Dissolved oxygen levels below optimal range (4.2 mg/L < 5 mg/L)',
      timestamp: '30 minutes ago',
      parameter: 'Dissolved Oxygen',
      value: '4.2 mg/L',
      threshold: '5 mg/L (Optimal)',
      severity: 'Warning',
    },
  ]);

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return COLORS.warning;
      case 'critical': return COLORS.critical;
      case 'normal': return COLORS.normal;
      default: return COLORS.textInfo;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      case 'normal': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts</Text>
        <Text style={styles.headerSubtitle}>System Notifications</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Active Alerts Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Active Alerts</Text>
          <Text style={styles.summaryText}>
            {(() => {
              const criticalCount = alerts.filter(alert => alert.type === 'critical').length;
              const warningCount = alerts.filter(alert => alert.type === 'warning').length;
              const totalActive = criticalCount + warningCount;

              if (totalActive === 0) {
                return 'No active alerts at the moment';
              } else {
                return `${totalActive} active alert${totalActive > 1 ? 's' : ''} requiring attention (${criticalCount} critical, ${warningCount} warning)`;
              }
            })()}
          </Text>
        </View>

        {/* Alerts List */}
        <View style={styles.alertsList}>
          {alerts.map(alert => (
            <TouchableOpacity key={alert.id} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <View style={styles.alertIconContainer}>
                  <Text style={styles.alertIcon}>{getAlertIcon(alert.type)}</Text>
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <View style={styles.alertMeta}>
                    <Text style={[styles.alertSeverity, { color: getAlertColor(alert.type) }]}>
                      {alert.severity}
                    </Text>
                    <Text style={styles.alertTimestamp}>{alert.timestamp}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.alertMessage}>{alert.message}</Text>

              <View style={styles.alertDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Parameter</Text>
                  <Text style={styles.detailValue}>{alert.parameter}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Current</Text>
                  <Text style={styles.detailValue}>{alert.value}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Threshold</Text>
                  <Text style={styles.detailValue}>{alert.threshold}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Clear All Button */}
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All Alerts</Text>
        </TouchableOpacity>
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
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  alertsList: {
    marginBottom: 24,
  },
  alertCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertIconContainer: {
    marginRight: 12,
  },
  alertIcon: {
    fontSize: 24,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertSeverity: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  alertTimestamp: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  alertMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  alertDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  clearButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
