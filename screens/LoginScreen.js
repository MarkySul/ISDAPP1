import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

export default function LoginScreen({ navigation }) {
  const [farmId, setFarmId]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    if (!farmId.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your Farm ID and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // navigation.replace('MainTabs'); // uncomment when MainTabs is ready
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Text style={styles.logoIcon}>🐟</Text>
            </View>
            <Text style={styles.appName}>IsdaApp</Text>
            <Text style={styles.appTagline}>IoT Water Quality Monitoring System</Text>
            <Text style={styles.appSub}>Multi-Parameter • Near Real-Time • SMS Alerts</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardSub}>Enter your farm credentials to continue</Text>

            {/* Farm ID */}
            <Text style={styles.label}>Farm ID / Username</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. pond_farm_01"
              placeholderTextColor={COLORS.textMuted}
              value={farmId}
              onChangeText={setFarmId}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.passRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.showHideBtn}
                onPress={() => setShowPass(!showPass)}
              >
                <Text style={styles.showHideTxt}>
                  {showPass ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.loginBtnTxt}>Sign In</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotTxt}>Forgot password? Contact your admin</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Badges */}
          <View style={styles.footer}>
            <View style={styles.footerBadge}>
              <Text style={styles.footerBadgeTxt}>WiFi</Text>
            </View>
            <View style={styles.footerBadge}>
              <Text style={styles.footerBadgeTxt}>SMS</Text>
            </View>
            <View style={styles.footerBadge}>
              <Text style={styles.footerBadgeTxt}>6 Sensors</Text>
            </View>
          </View>

          <Text style={styles.footerNote}>
            IsdaApp — Capstone Project{'\n'}Northern Mindanao Aquaculture Monitoring
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.primary },
  kav:    { flex: 1 },
  scroll: { flexGrow: 1, backgroundColor: COLORS.primary },
  header: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
  },
  logoBox: {
    width: 72,
    height: 72,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoIcon:   { fontSize: 36 },
  appName:    { fontSize: 28, fontWeight: '700', color: COLORS.white, letterSpacing: 1 },
  appTagline: { fontSize: 13, color: COLORS.textInfo, marginTop: 4, textAlign: 'center' },
  appSub:     { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, textAlign: 'center' },
  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    flex: 1,
    minHeight: 420,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  cardSub:   { fontSize: 13, color: COLORS.textSecondary, marginBottom: 24 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
    marginBottom: 16,
  },
  passRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  showHideBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.primarySurface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  showHideTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginBtnTxt: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  forgotBtn: { alignItems: 'center' },
  forgotTxt: { fontSize: 13, color: COLORS.primary },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  footerBadge: {
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  footerBadgeTxt: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  footerNote: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: COLORS.white,
    lineHeight: 18,
  },
});