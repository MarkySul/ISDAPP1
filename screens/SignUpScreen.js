import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const STEPS = ['Account', 'Farm Info', 'Pond Setup'];

// ─── Reusable Components ─────────────────────────────────────────────────────

function FieldLabel({ text }) {
  return <Text style={styles.label}>{text}</Text>;
}

function Field({ label, placeholder, value, onChange, keyboardType, autoCapitalize, suffix }) {
  return (
    <View style={styles.fieldGroup}>
      <FieldLabel text={label} />
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            suffix ? { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 } : null,
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'none'}
          autoCorrect={false}
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

function PasswordField({ label, placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.fieldGroup}>
      <FieldLabel text={label} />
      <View style={styles.passRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChange}
          secureTextEntry={!show}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.showHideBtn} onPress={() => setShow(!show)}>
          <Text style={styles.showHideTxt}>{show ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SelectOption({ label, options, selected, onSelect }) {
  return (
    <View style={styles.fieldGroup}>
      <FieldLabel text={label} />
      <View style={styles.optionGrid}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.optionBtn, selected === opt && styles.optionBtnActive]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.75}
          >
            <Text style={[styles.optionTxt, selected === opt && styles.optionTxtActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function SectionDivider({ title }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{title}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function SignUpScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1 — Account
  const [username, setUsername]               = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2 — Farm Info
  const [farmerName, setFarmerName]           = useState('');
  const [contactNumber, setContactNumber]     = useState('');
  const [farmName, setFarmName]               = useState('');
  const [farmLocation, setFarmLocation]       = useState('');
  const [barangay, setBarangay]               = useState('');
  const [municipality, setMunicipality]       = useState('');
  const [province, setProvince]               = useState('');
  const [yearsOfFarming, setYearsOfFarming]   = useState('');

  // Step 3 — Pond Setup
  const [numberOfPonds, setNumberOfPonds]       = useState('');
  const [pondArea, setPondArea]                 = useState('');
  const [stockingDensity, setStockingDensity]   = useState('');
  const [tilapiaSpecies, setTilapiaSpecies]     = useState('');
  const [farmingSystem, setFarmingSystem]       = useState('');
  const [waterSource, setWaterSource]           = useState('');
  const [monitoringMethod, setMonitoringMethod] = useState('');

  // ── Validation ─────────────────────────────────────────────────────────────
  const validateStep = () => {
    const emailRegex = /\S+@\S+\.\S+/;

    if (step === 0) {
      if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        Alert.alert('Missing Fields', 'Please fill in all account fields.');
        return false;
      }
      if (!emailRegex.test(email.trim())) {
        Alert.alert('Invalid Email', 'Enter a valid email address.');
        return false;
      }
      if (password.length < 6) {
        Alert.alert('Weak Password', 'Password must be at least 6 characters.');
        return false;
      }
      if (password !== confirmPassword) {
        Alert.alert('Password Mismatch', 'Passwords do not match.');
        return false;
      }
    }

    if (step === 1) {
      if (!farmerName.trim() || !farmName.trim() || !farmLocation.trim()) {
        Alert.alert('Missing Fields', 'Please fill in your name, farm name, and location.');
        return false;
      }
    }

    // Step 3 has no hard required fields — select options are optional
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  // ── Save & Sign Up ─────────────────────────────────────────────────────────
  const handleSignUp = async () => {
  console.log('handleSignUp triggered');
  try {
    setLoading(true);
    console.log('before AsyncStorage');

      const userData = {
        username: username.trim(),
        password: password.trim(), // <--- CRITICAL FIX: Save the password!
        email: email.trim(),
        name: farmerName.trim(),
        contactNumber: contactNumber.trim(),
        farmName: farmName.trim(),
        location: [farmLocation, barangay, municipality, province].filter(Boolean).join(', '),
        barangay,
        municipality,
        province,
        yearsOfFarming,
        numberOfPonds,
        pondArea,
        stockingDensity,
        tilapiaSpecies,
        farmingSystem,
        waterSource,
        monitoringMethod,
        joined: new Date().toISOString(),
        devicesOnline: 0,
        totalAlerts: 0,
        cropMonitored: 'Tilapia',
      };

      await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));

      setLoading(false);

      Alert.alert(
        'Account Created!',
        'Welcome to IsdaApp. Your farm profile is ready.',
        [
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to save user data. Please try again.');
      console.error('SignUp error:', error);
    }
  };

  // ── Step Indicator ─────────────────────────────────────────────────────────
  const StepIndicator = () => (
    <View style={styles.stepRow}>
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, i <= step && styles.stepCircleActive]}>
              <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>
                {i < step ? '✓' : i + 1}
              </Text>
            </View>
            <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{s}</Text>
          </View>
          {i < STEPS.length - 1 && (
            <View style={[styles.stepConnector, i < step && styles.stepConnectorActive]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  // ── Step 1: Account ────────────────────────────────────────────────────────
  const renderStep0 = () => (
    <>
      <Text style={styles.stepTitle}>Account Details</Text>
      <Text style={styles.stepSub}>This will be used to log in to IsdaApp</Text>
      <Field label="Username / Farm ID" placeholder="e.g. pond_farm_01" value={username} onChange={setUsername} />
      <Field label="Email Address" placeholder="farmer@example.com" value={email} onChange={setEmail} keyboardType="email-address" />
      <PasswordField label="Password" placeholder="At least 6 characters" value={password} onChange={setPassword} />
      <PasswordField label="Confirm Password" placeholder="Repeat your password" value={confirmPassword} onChange={setConfirmPassword} />
    </>
  );

  // ── Step 2: Farm Info ──────────────────────────────────────────────────────
  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Farm Information</Text>
      <Text style={styles.stepSub}>Tell us about yourself and your farm</Text>

      <SectionDivider title="Farmer Details" />
      <Field label="Full Name" placeholder="e.g. Juan dela Cruz" value={farmerName} onChange={setFarmerName} autoCapitalize="words" />
      <Field label="Contact Number" placeholder="09XXXXXXXXX" value={contactNumber} onChange={setContactNumber} keyboardType="phone-pad" />

      <SectionDivider title="Farm Details" />
      <Field label="Farm Name" placeholder="e.g. Dela Cruz Tilapia Farm" value={farmName} onChange={setFarmName} autoCapitalize="words" />
      <Field label="Street / Sitio / Address" placeholder="e.g. Sitio Mabini" value={farmLocation} onChange={setFarmLocation} autoCapitalize="words" />
      <Field label="Barangay" placeholder="e.g. Barangay Bonbon" value={barangay} onChange={setBarangay} autoCapitalize="words" />
      <Field label="Municipality / City" placeholder="e.g. Cagayan de Oro" value={municipality} onChange={setMunicipality} autoCapitalize="words" />
      <Field label="Province" placeholder="e.g. Misamis Oriental" value={province} onChange={setProvince} autoCapitalize="words" />
      <Field label="Years of Tilapia Farming" placeholder="e.g. 5" value={yearsOfFarming} onChange={setYearsOfFarming} keyboardType="numeric" />
    </>
  );

  // ── Step 3: Pond Setup ─────────────────────────────────────────────────────
  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>Pond Setup</Text>
      <Text style={styles.stepSub}>Help IsdaApp calibrate alerts for your pond</Text>

      <Field label="Number of Ponds" placeholder="e.g. 3" value={numberOfPonds} onChange={setNumberOfPonds} keyboardType="numeric" />
      <Field label="Total Pond Area" placeholder="e.g. 500" value={pondArea} onChange={setPondArea} keyboardType="numeric" suffix="m²" />
      <Field label="Stocking Density" placeholder="e.g. 3" value={stockingDensity} onChange={setStockingDensity} keyboardType="numeric" suffix="fish/m²" />

      <SelectOption
        label="Tilapia Species"
        options={['Nile Tilapia', 'Red Tilapia', 'Gift Strain', 'Mixed']}
        selected={tilapiaSpecies}
        onSelect={setTilapiaSpecies}
      />
      <SelectOption
        label="Farming System"
        options={['Earthen Pond', 'Concrete Pond', 'Cage Culture', 'RAS']}
        selected={farmingSystem}
        onSelect={setFarmingSystem}
      />
      <SelectOption
        label="Water Source"
        options={['River', 'Rainwater', 'Well / Groundwater', 'Municipal']}
        selected={waterSource}
        onSelect={setWaterSource}
      />
      <SelectOption
        label="Current Monitoring Method"
        options={['Manual Testing', 'Basic Sensors', 'None', 'Other']}
        selected={monitoringMethod}
        onSelect={setMonitoringMethod}
      />
    </>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>🐟</Text>
          </View>
          <Text style={styles.appName}>IsdaApp</Text>
          <Text style={styles.appTagline}>IoT Water Quality Monitoring System</Text>
        </View>

        {/* White Card */}
        <View style={styles.card}>
          <StepIndicator />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formBody}>
              {step === 0 && renderStep0()}
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.btnRow}>
              {step > 0 && (
                <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
                  <Text style={styles.backBtnTxt}>← Back</Text>
                </TouchableOpacity>
              )}

              {step < 2 ? (
                <TouchableOpacity
                  style={[styles.nextBtn, step === 0 && { flex: 1 }]}
                  onPress={handleNext}
                  activeOpacity={0.85}
                >
                  <Text style={styles.nextBtnTxt}>Next →</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.nextBtn, loading && { opacity: 0.7 }]}
                  onPress={handleSignUp}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.nextBtnTxt}>Create Account ✓</Text>
                  }
                </TouchableOpacity>
              )}
            </View>

            {step === 0 && (
              <TouchableOpacity
                style={styles.signinLink}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.signinTxt}>Already have an account? Sign In</Text>
              </TouchableOpacity>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },

  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: COLORS.primary,
  },
  logoBox: {
    width: 56, height: 56,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoIcon:   { fontSize: 28 },
  appName:    { fontSize: 22, fontWeight: '700', color: COLORS.white, letterSpacing: 1 },
  appTagline: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2, textAlign: 'center' },

  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
  },
  scrollContent: { paddingBottom: 20 },
  formBody:      { paddingHorizontal: 24 },

  // Step indicator
  stepRow:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, marginBottom: 20 },
  stepItem:            { alignItems: 'center', gap: 4 },
  stepCircle:          { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E0DED8', alignItems: 'center', justifyContent: 'center' },
  stepCircleActive:    { backgroundColor: COLORS.primary },
  stepNum:             { fontSize: 12, fontWeight: '700', color: '#888780' },
  stepNumActive:       { color: COLORS.white },
  stepLabel:           { fontSize: 10, color: '#888780', fontWeight: '500', marginTop: 2 },
  stepLabelActive:     { color: COLORS.primary, fontWeight: '700' },
  stepConnector:       { flex: 1, height: 2, backgroundColor: '#E0DED8', marginHorizontal: 6, marginBottom: 14 },
  stepConnectorActive: { backgroundColor: COLORS.primary },

  stepTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  stepSub:   { fontSize: 13, color: COLORS.textSecondary, marginBottom: 20 },

  // Fields
  fieldGroup: { marginBottom: 14 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
  },
  suffix: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  passRow:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  showHideBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  showHideTxt: { fontSize: 12, fontWeight: '600', color: COLORS.primary },

  // Select options
  optionGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn:       { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.background },
  optionBtnActive: { borderColor: COLORS.primary, backgroundColor: '#E1F5EE' },
  optionTxt:       { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  optionTxtActive: { color: COLORS.primary, fontWeight: '700' },

  // Section divider
  dividerRow:  { flexDirection: 'row', alignItems: 'center', marginVertical: 10, gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Buttons
  btnRow:     { flexDirection: 'row', gap: 10, paddingHorizontal: 24, marginTop: 24 },
  backBtn:    { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.background },
  backBtnTxt: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  nextBtn:    { flex: 2, paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: COLORS.primary },
  nextBtnTxt: { fontSize: 15, fontWeight: '700', color: COLORS.white, letterSpacing: 0.3 },

  signinLink: { alignItems: 'center', marginTop: 16 },
  signinTxt:  { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
});