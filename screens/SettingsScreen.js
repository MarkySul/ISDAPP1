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
  Alert,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function SettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState({
    alerts: true,
    warnings: true,
    maintenance: false,
    updates: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    autoRefresh: true,
    darkMode: false,
    soundAlerts: true,
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Navigate back to login screen
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSystemSetting = (key) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const SettingItem = ({ title, subtitle, rightComponent, onPress }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your preferences</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <SettingSection title="Account">
          <SettingItem
            title="Farm Profile"
            subtitle="Manage farm information"
            rightComponent={<Text style={styles.arrow}>›</Text>}
            onPress={() => Alert.alert('Coming Soon', 'Farm profile settings will be available soon.')}
          />
          <SettingItem
            title="Change Password"
            subtitle="Update your login credentials"
            rightComponent={<Text style={styles.arrow}>›</Text>}
            onPress={() => Alert.alert('Coming Soon', 'Password change feature will be available soon.')}
          />
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection title="Notifications">
          <SettingItem
            title="Alert Notifications"
            subtitle="Critical parameter alerts"
            rightComponent={
              <Switch
                value={notifications.alerts}
                onValueChange={() => toggleNotification('alerts')}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={notifications.alerts ? COLORS.white : COLORS.textMuted}
              />
            }
          />
          <SettingItem
            title="Warning Notifications"
            subtitle="Parameter threshold warnings"
            rightComponent={
              <Switch
                value={notifications.warnings}
                onValueChange={() => toggleNotification('warnings')}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={notifications.warnings ? COLORS.white : COLORS.textMuted}
              />
            }
          />
          <SettingItem
            title="Maintenance Alerts"
            subtitle="System maintenance notifications"
            rightComponent={
              <Switch
                value={notifications.maintenance}
                onValueChange={() => toggleNotification('maintenance')}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={notifications.maintenance ? COLORS.white : COLORS.textMuted}
              />
            }
          />
          <SettingItem
            title="Update Notifications"
            subtitle="App and system updates"
            rightComponent={
              <Switch
                value={notifications.updates}
                onValueChange={() => toggleNotification('updates')}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={notifications.updates ? COLORS.white : COLORS.textMuted}
              />
            }
          />
        </SettingSection>

        {/* System Section */}
        <SettingSection title="System">
          <SettingItem
            title="Auto Refresh"
            subtitle="Automatically refresh sensor data"
            rightComponent={
              <Switch
                value={systemSettings.autoRefresh}
                onValueChange={() => toggleSystemSetting('autoRefresh')}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={systemSettings.autoRefresh ? COLORS.white : COLORS.textMuted}
              />
            }
          />
          <SettingItem
            title="Sound Alerts"
            subtitle="Play sound for critical alerts"
            rightComponent={
              <Switch
                value={systemSettings.soundAlerts}
                onValueChange={() => toggleSystemSetting('soundAlerts')}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={systemSettings.soundAlerts ? COLORS.white : COLORS.textMuted}
              />
            }
          />
          <SettingItem
            title="Data Export"
            subtitle="Export sensor data and reports"
            rightComponent={<Text style={styles.arrow}>›</Text>}
            onPress={() => Alert.alert('Coming Soon', 'Data export feature will be available soon.')}
          />
          <SettingItem
            title="System Info"
            subtitle="Version and system information"
            rightComponent={<Text style={styles.arrow}>›</Text>}
            onPress={() => Alert.alert('System Info', 'IsdaApp v1.0.0\nWater Quality Monitoring System\nNorthern Mindanao Aquaculture')}
          />
        </SettingSection>

        {/* Support Section */}
        <SettingSection title="Support">
          <SettingItem
            title="Help & Support"
            subtitle="Get help and contact support"
            rightComponent={<Text style={styles.arrow}>›</Text>}
            onPress={() => Alert.alert('Support', 'For technical support, contact your system administrator or email support@isdapp.com')}
          />
          <SettingItem
            title="About"
            subtitle="App information and credits"
            rightComponent={<Text style={styles.arrow}>›</Text>}
            onPress={() => Alert.alert('About IsdaApp', 'IoT Water Quality Monitoring System\nCapstone Project\nNorthern Mindanao Aquaculture Monitoring')}
          />
        </SettingSection>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  arrow: {
    fontSize: 20,
    color: COLORS.textMuted,
    fontWeight: '300',
  },
  logoutSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: COLORS.critical,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
