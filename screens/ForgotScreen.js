import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  ScrollView,
} from 'react-native';

export default function ForgotScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = [useRef(), useRef(), useRef(), useRef()];
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const transitionToStep2 = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setStep(2);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      shake();
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      shake();
      return;
    }
    setLoading(true);
    // TODO: Replace with your actual API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    startResendTimer();
    transitionToStep2();
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    const code = otp.join('');
    if (code.length < 4) {
      setError('Please enter the 4-digit code.');
      shake();
      return;
    }
    setLoading(true);
    // TODO: Replace with your actual API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    navigation.navigate('ChangePassword', { email: email.trim() });
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '']);
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    startResendTimer();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (step === 2 ? setStep(1) : navigation.navigate('Login'))}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>{step === 2 ? 'Back' : 'Login'}</Text>
        </TouchableOpacity>

        {/* Step indicator */}
        <View style={styles.stepRow}>
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={[styles.stepLine, step === 2 && styles.stepLineActive]} />
          <View style={[styles.stepDot, step === 2 && styles.stepDotActive]} />
        </View>

        <Animated.View
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateX: shakeAnim }] },
          ]}
        >
          {/* Icon */}
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>{step === 1 ? '🔐' : '📩'}</Text>
          </View>

          <Text style={styles.title}>
            {step === 1 ? 'Forgot Password?' : 'Check Your Email'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? "No worries! Enter your email and we'll send you a reset code."
              : `We sent a 4-digit code to\n${email}`}
          </Text>

          {/* ── Step 1 ── */}
          {step === 1 && (
            <>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={v => { setEmail(v); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="send"
                onSubmitEditing={handleSendOtp}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={handleSendOtp}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.primaryBtnText}>Send Reset Code</Text>}
              </TouchableOpacity>
            </>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <>
              <TouchableOpacity
                style={styles.stepBackBtn}
                onPress={() => setStep(1)}
                activeOpacity={0.7}
              >
                <Text style={styles.stepBackText}>← Back</Text>
              </TouchableOpacity>
              <View style={styles.otpRow}>
                {otp.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={otpRefs[i]}
                    style={[styles.otpBox, digit && styles.otpBoxFilled]}
                    value={digit}
                    onChangeText={v => handleOtpChange(v, i)}
                    onKeyPress={e => handleOtpKeyPress(e, i)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    returnKeyType="next"
                  />
                ))}
              </View>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={handleVerifyOtp}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.primaryBtnText}>Verify & Continue</Text>}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.resendBtn, resendTimer > 0 && styles.resendBtnDisabled]}
                onPress={handleResend}
                disabled={resendTimer > 0}
                activeOpacity={0.7}
              >
                <Text style={[styles.resendText, resendTimer > 0 && styles.resendTextDisabled]}>
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Didn't receive it? Resend"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>

        {/* Footer */}
        <TouchableOpacity style={styles.footerRow} onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const ACCENT = '#4F6EF7';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F6EF7',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontSize: 20,
    color: "#FFFFFF",
    marginRight: 6,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: ACCENT,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 28,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  stepDotActive: {
    backgroundColor: "#FFFFFF",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepLine: {
    width: 48,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 6,
  },
  stepLineActive: {
    backgroundColor: "#FFFFFF",
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 36,
    shadowColor: '#4F6EF7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 8,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 28,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1E293B',
    marginBottom: 8,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,                // ✅ removed gap (not supported in older RN)
  },
  otpBox: {
    width: 58,
    height: 64,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginHorizontal: 6,            // ✅ spacing between OTP boxes
  },
  otpBoxFilled: {
    borderColor: ACCENT,
    backgroundColor: '#EEF2FF',
  },
  error: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnDisabled: {
    backgroundColor: '#A5B4FC',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  stepBackBtn: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  stepBackText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F6EF7',
  },
  resendBtn: {
    marginTop: 18,
    alignItems: 'center',
  },
  resendBtnDisabled: {
    opacity: 0.6,
  },
  resendText: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: '#94A3B8',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  footerLink: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});