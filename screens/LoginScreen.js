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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import api from '../services/api';

export default function LoginScreen({ navigation }) {
  const [farmId, setFarmId]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!farmId.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your Farm ID and password.');
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting to connect to API...');

      const data = await api.login(farmId.trim(), password.trim());
      console.log('API Response:', JSON.stringify(data));

      if (data.token) {
        await AsyncStorage.setItem('TOKEN', data.token);
        await AsyncStorage.setItem('USER', JSON.stringify(data.user));
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Login error:', err.message);
      Alert.alert('Connection Error', `Could not reach server: ${err.message}`);
    } finally {
      setLoading(false);
    }
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
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardSub}>Enter your farm credentials to continue</Text>

            <Text style={styles.label}>Farm ID / Username</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. pond_farm_01"
              placeholderTextColor={COLORS.textMuted}
              value={farmId}
              onChangeText={setFarmId}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity style={styles.showHideBtn} onPress={() => setShowPass(!showPass)}>
                <Text style={styles.showHideTxt}>{showPass ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.loginBtnTxt}>Sign In</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('Forgot')}>
              <Text style={styles.forgotTxt}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUpBtn} onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpBtnTxt}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: COLORS.primary },
  kav:      { flex: 1 },
  scroll:   { flexGrow: 1 },
  header: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
    backgroundColor: COLORS.primary,
  },
  logoBox: {
    width: 72, height: 72,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoIcon: { fontSize: 36 },
  appName:  { fontSize: 28, fontWeight: '700', color: COLORS.white },
  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    flex: 1,
  },
  cardTitle: { fontSize: 22, fontWeight: '700' },
  cardSub:   { fontSize: 13, marginBottom: 20 },
  label:     { fontSize: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  passRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  showHideBtn: { marginLeft: 10 },
  showHideTxt: { color: COLORS.primary },
  loginBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginBtnTxt:  { color: '#fff', fontWeight: 'bold' },
  forgotBtn:    { alignItems: 'center', marginBottom: 10 },
  forgotTxt:    { color: COLORS.primary },
  signUpBtn: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  signUpBtnTxt: { color: COLORS.primary },
});