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
import DateTimePicker from '@react-native-community/datetimepicker';
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
    soundAlerts: true,
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => navigation.replace('Login') },
    ]);
  };

  const toggleNotification = (key) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleSystemSetting = (key) =>
    setSystemSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const onChangeDate = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
      setDateSelected(true);
    }
  };

  const handleDownloadData = async () => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    Alert.alert('✅ Download', `data for ${formattedDate} has been downloaded.`);
    setDateSelected(false);
  };


  const SectionHeader = ({ icon, title }) => (
    <View style={s.sectionHeader}>
      <Text style={s.sectionIcon}>{icon}</Text>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );

  const Row = ({ icon, title, subtitle, right, onPress, noBorder }) => (
    <TouchableOpacity
      style={[s.row, noBorder && s.rowNoBorder]}
      onPress={onPress}
      activeOpacity={onPress ? 0.65 : 1}
      disabled={!onPress}
    >
      <View style={s.rowIcon}>
        <Text style={s.rowIconText}>{icon}</Text>
      </View>
      <View style={s.rowBody}>
        <Text style={s.rowTitle}>{title}</Text>
        {subtitle ? <Text style={s.rowSub}>{subtitle}</Text> : null}
      </View>
      <View style={s.rowRight}>{right}</View>
    </TouchableOpacity>
  );

  const Card = ({ children }) => <View style={s.card}>{children}</View>;

  const Divider = () => <View style={s.divider} />;

  const ToggleSwitch = ({ value, onValueChange }) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.border, true: COLORS.wave }}
      thumbColor={value ? COLORS.teal : COLORS.textMuted}
      ios_backgroundColor={COLORS.border}
    />
  );

  const Arrow = () => <Text style={s.arrow}>›</Text>;


  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {}
      <View style={s.header}>
        <View style={s.waveDeco1} />
        <View style={s.waveDeco2} />

        <View style={s.headerContent}>
          <View>
            <Text style={s.headerApp}>ISDAPP</Text>
            <Text style={s.headerTitle}>Settings</Text>
            <Text style={s.headerSub}>Manage your preferences</Text>
          </View>
          <View style={s.headerBadge}>
            <Text style={s.headerBadgeIcon}>🐟</Text>
          </View>
        </View>
      </View>

      {}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ACCOUNT */}
        <SectionHeader icon="👤" title="Account" />
        <Card>
          <Row
            icon="🌾"
            title="Farm Profile"
            subtitle="Manage farm information"
            right={<Arrow />}
            onPress={() => navigation.navigate('Profile')}
          />
          <Divider />
          <Row
            icon="🔒"
            title="Change Password"
            subtitle="Update your login credentials"
            right={<Arrow />}
            onPress={() => navigation.getParent()?.navigate('ChangePassword')}
            noBorder
          />
        </Card>

        {/* NOTIFICATIONS */}
        <SectionHeader icon="🔔" title="Notifications" />
        <Card>
          <Row
            icon="🚨"
            title="Alert Notifications"
            subtitle="Critical parameter alerts"
            right={<ToggleSwitch value={notifications.alerts} onValueChange={() => toggleNotification('alerts')} />}
          />
          <Divider />
          <Row
            icon="⚠️"
            title="Warning Notifications"
            subtitle="Parameter threshold warnings"
            right={<ToggleSwitch value={notifications.warnings} onValueChange={() => toggleNotification('warnings')} />}
          />
          <Divider />
          <Row
            icon="🔧"
            title="Maintenance Alerts"
            subtitle="System maintenance notifications"
            right={<ToggleSwitch value={notifications.maintenance} onValueChange={() => toggleNotification('maintenance')} />}
          />
          <Divider />
          <Row
            icon="🔄"
            title="Update Notifications"
            subtitle="App and system updates"
            right={<ToggleSwitch value={notifications.updates} onValueChange={() => toggleNotification('updates')} />}
            noBorder
          />
        </Card>

        {/* SYSTEM */}
        <SectionHeader icon="⚙️" title="System" />
        <Card>
          <Row
            icon="📡"
            title="Auto Refresh"
            subtitle="Automatically refresh sensor data"
            right={<ToggleSwitch value={systemSettings.autoRefresh} onValueChange={() => toggleSystemSetting('autoRefresh')} />}
          />
          <Divider />
          <Row
            icon="🔊"
            title="Sound Alerts"
            subtitle="Play sound for critical alerts"
            right={<ToggleSwitch value={systemSettings.soundAlerts} onValueChange={() => toggleSystemSetting('soundAlerts')} />}
          />
          <Divider />
          
          <View>
            <Row
              icon="⬇️"
              title="Download Data"
              subtitle={dateSelected
                ? `📌 ${selectedDate.toDateString()}`
                : 'Tap 📅 to pick a date'}
              right={
                <TouchableOpacity
                  style={s.calBtn}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={s.calBtnText}>📅</Text>
                </TouchableOpacity>
              }
              noBorder={false}
            />

            {dateSelected && (
              <TouchableOpacity
                style={s.downloadPopBtn}
                onPress={handleDownloadData}
                activeOpacity={0.8}
              >
                <Text style={s.downloadPopIcon}>⬇️</Text>
                <View>
                  <Text style={s.downloadPopLabel}>Download Data</Text>
                  <Text style={s.downloadPopDate}>
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </Text>
                </View>
                <View style={s.downloadPopArrow}>
                  <Text style={s.downloadPopArrowText}>›</Text>
                </View>
              </TouchableOpacity>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>
          <Divider />
          <Row
            icon="ℹ️"
            title="System Info"
            subtitle="v1.0.0 · Water Quality Monitoring"
            right={<Arrow />}
            onPress={() => Alert.alert('System Info', 'IsdaApp v1.0.0\nWater Quality Monitoring System\nNorthern Mindanao Aquaculture')}
            noBorder
          />
        </Card>

        {/* SUPPORT */}
        <SectionHeader icon="💬" title="Support" />
        <Card>
          <Row
            icon="🆘"
            title="Help & Support"
            subtitle="Get help and contact support"
            right={<Arrow />}
            onPress={() => Alert.alert('Support', 'Contact support@isdapp.com')}
          />
          <Divider />
          <Row
            icon="📋"
            title="About ISDAPP"
            subtitle="App information and credits"
            right={<Arrow />}
            onPress={() => Alert.alert('About IsdaApp', 'IoT Water Quality Monitoring System\nCapstone Project')}
            noBorder
          />
        </Card>

        {/* LOGOUT */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={s.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.sky,
  },
  header: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 26,
    overflow: 'hidden',
  },
  waveDeco1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.ocean,
    opacity: 0.35,
    top: -80,
    right: -40,
  },
  waveDeco2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.teal,
    opacity: 0.2,
    top: 10,
    right: 60,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerApp: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.teal,
    letterSpacing: 3,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.60)',
    marginTop: 3,
  },
  headerBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0,191,165,0.18)',
    borderWidth: 1.5,
    borderColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeIcon: {
    fontSize: 26,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  sectionIcon: {
    fontSize: 14,
    marginRight: 7,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 66,
  },
  rowNoBorder: {},
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.seafoam,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  rowIconText: {
    fontSize: 18,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary, // Changed from textMain
  },
  rowSub: {
    fontSize: 12,
    color: COLORS.textSecondary, // Changed from textSub
    marginTop: 2,
  },
  rowRight: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 22,
    color: COLORS.textMuted,
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 67,
  },
  calBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.sky,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calBtnText: {
    fontSize: 18,
  },
  downloadPopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.teal,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 12,
    elevation: 6,
  },
  downloadPopIcon: {
    fontSize: 22,
  },
  downloadPopLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  downloadPopDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 1,
  },
  downloadPopArrow: {
    marginLeft: 'auto',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadPopArrowText: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '600',
    lineHeight: 22,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.critical, // Changed from danger
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 4,
    marginBottom: 4,
    elevation: 5,
    gap: 10,
  },
  logoutIcon: {
    fontSize: 18,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});