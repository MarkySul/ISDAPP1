import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import { COLORS } from '../constants/colors';

function PasswordField({ label, value, onChangeText, placeholder }) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(focusAnim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(focusAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  const labelColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.textSecondary, COLORS.primary],
  });

  const bgColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.white, COLORS.primarySurface],
  });

  return (
    <View style={styles.fieldWrapper}>
      <Animated.Text style={[styles.fieldLabel, { color: labelColor }]}>
        {label}
      </Animated.Text>
      <Animated.View style={[styles.inputWrapper, { borderColor, backgroundColor: bgColor }]}>
        <Text style={styles.lockIcon}>🔒</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={!visible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={() => setVisible(v => !v)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.eyeIcon}>{visible ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(buttonScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields to continue.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New password and confirmation do not match.');
      return;
    }
    Alert.alert('Success', 'Your password has been updated.');
    navigation.goBack();
  };

  const passwordStrength = (() => {
    if (!newPassword) return null;
    if (newPassword.length < 6)
      return { label: 'Weak', color: COLORS.critical, width: '25%' };
    if (newPassword.length < 10)
      return { label: 'Fair', color: COLORS.warning, width: '55%' };
    if (/[^a-zA-Z0-9]/.test(newPassword))
      return { label: 'Strong', color: COLORS.teal, width: '100%' };
    return { label: 'Good', color: COLORS.wave, width: '75%' };
  })();

  const passwordsMatch = confirmPassword.length > 0 && confirmPassword === newPassword;
  const passwordsMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header Banner */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.shieldBadge}>
            <Text style={styles.shieldIcon}>🛡️</Text>
          </View>
          <View>
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>Secure your account</Text>
          </View>
        </View>
        <View style={styles.waveDivider} />
      </View>

      {/* Form card */}
      <View style={styles.card}>
        <PasswordField
          label="CURRENT PASSWORD"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Enter current password"
        />

        <PasswordField
          label="NEW PASSWORD"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
        />

        {/* Strength meter */}
        {passwordStrength && (
          <View style={styles.strengthRow}>
            <View style={styles.strengthTrack}>
              <View
                style={[
                  styles.strengthFill,
                  { width: passwordStrength.width, backgroundColor: passwordStrength.color },
                ]}
              />
            </View>
            <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
              {passwordStrength.label}
            </Text>
          </View>
        )}

        <PasswordField
          label="CONFIRM NEW PASSWORD"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter new password"
        />

        {/* Match hint */}
        {(passwordsMatch || passwordsMismatch) && (
          <View
            style={[
              styles.matchBadge,
              {
                backgroundColor: passwordsMatch ? COLORS.normalBg : COLORS.criticalBg,
                borderColor: passwordsMatch ? COLORS.normalBorder : COLORS.criticalBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.matchText,
                { color: passwordsMatch ? COLORS.normal : COLORS.critical },
              ]}
            >
              {passwordsMatch ? '✓  Passwords match' : '✗  Passwords do not match'}
            </Text>
          </View>
        )}

        {/* Save button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 8 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <Text style={styles.buttonText}>Update Password</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Tip */}
      <View style={styles.tipRow}>
        <Text style={styles.tipIcon}>💡</Text>
        <Text style={styles.tipText}>
          Use 10+ characters with symbols for a strong password
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 20,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  backArrow: {
    color: COLORS.textOnPrimary,
    fontSize: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  shieldBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIcon: { fontSize: 26 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textOnPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textInfo,
    marginTop: 2,
  },
  waveDivider: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },

  // Field
  fieldWrapper: { marginBottom: 18 },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  lockIcon: { fontSize: 15, marginRight: 10, opacity: 0.5 },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  eyeIcon: { fontSize: 12, fontWeight: '600', color: COLORS.primary, opacity: 0.8 },

  // Strength
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: -10,
    marginBottom: 18,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  strengthFill: { height: '100%', borderRadius: 4 },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '700',
    width: 46,
    textAlign: 'right',
  },

  // Match badge
  matchBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: -8,
    marginBottom: 16,
  },
  matchText: { fontSize: 12, fontWeight: '600' },

  // Button
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: COLORS.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  buttonArrow: {
    color: COLORS.textOnPrimary,
    fontSize: 18,
    opacity: 0.8,
  },

  // Tip
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    paddingHorizontal: 24,
  },
  tipIcon: { fontSize: 13 },
  tipText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});