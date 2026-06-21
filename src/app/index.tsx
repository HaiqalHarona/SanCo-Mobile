import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const router = useRouter();
  const theme = useTheme();
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);

  const handleAuth = () => {
    // Navigate to the chats screen as a skeleton bypass
    router.replace('/chats');
  };

  const isDark = scheme === 'dark';

  // Rich themed colors
  const primaryColor = '#6366F1'; // Indigo
  const primaryLight = '#818CF8';
  const cardBg = isDark ? 'rgba(25, 25, 35, 0.75)' : 'rgba(255, 255, 255, 0.85)';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
  const inputBg = isDark ? 'rgba(20, 20, 28, 0.6)' : 'rgba(240, 241, 245, 0.8)';
  const placeholderColor = isDark ? '#60646C' : '#9CA3AF';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Premium background decorative shapes */}
      <View style={[styles.bgBlob1, { backgroundColor: isDark ? '#3B0066' : '#E8D5FF' }]} />
      <View style={[styles.bgBlob2, { backgroundColor: isDark ? '#003366' : '#D0E1FF' }]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingTop: Math.max(insets.top, Spacing.four), paddingBottom: Math.max(insets.bottom, Spacing.four) }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header/Logo Section */}
          <View style={styles.headerSection}>
            <View style={[styles.logoContainer, { backgroundColor: primaryColor }]}>
              <SymbolView
                name="bubble.left.and.bubble.right.fill"
                tintColor="#FFFFFF"
                size={36}
                style={styles.logoIcon}
              />
            </View>
            <Text style={[styles.appName, { color: theme.text }]}>SanCo</Text>
            <Text style={[styles.appTagline, { color: theme.textSecondary }]}>
              {isLogin ? 'Welcome back! You have been missed.' : 'Connect with friends across the globe.'}
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Text>

            {/* Name Input (Register Only) */}
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Name</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { backgroundColor: inputBg },
                    nameFocused && { borderColor: primaryColor, borderWidth: 1 }
                  ]}
                >
                  <SymbolView name="person" tintColor={nameFocused ? primaryColor : placeholderColor} size={18} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Enter your name"
                    placeholderTextColor={placeholderColor}
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email Address</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: inputBg },
                  emailFocused && { borderColor: primaryColor, borderWidth: 1 }
                ]}
              >
                <SymbolView name="envelope" tintColor={emailFocused ? primaryColor : placeholderColor} size={18} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="name@example.com"
                  placeholderTextColor={placeholderColor}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordLabelRow}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Password</Text>
                {isLogin && (
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={[styles.forgotText, { color: primaryColor }]}>Forgot?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: inputBg },
                  passwordFocused && { borderColor: primaryColor, borderWidth: 1 }
                ]}
              >
                <SymbolView name="lock" tintColor={passwordFocused ? primaryColor : placeholderColor} size={18} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={placeholderColor}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  activeOpacity={0.7}
                >
                  <SymbolView
                    name={showPassword ? 'eye.slash' : 'eye'}
                    tintColor={theme.textSecondary}
                    size={18}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: primaryColor }]}
              onPress={handleAuth}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: cardBorder }]} />
              <Text style={[styles.dividerText, { color: theme.textSecondary }]}>or continue with</Text>
              <View style={[styles.dividerLine, { backgroundColor: cardBorder }]} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: inputBg, borderColor: cardBorder }]}
                activeOpacity={0.7}
              >
                <SymbolView name="g.circle.fill" tintColor={theme.text} size={22} />
                <Text style={[styles.socialButtonText, { color: theme.text }]}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: inputBg, borderColor: cardBorder }]}
                activeOpacity={0.7}
              >
                <SymbolView name="apple.logo" tintColor={theme.text} size={20} />
                <Text style={[styles.socialButtonText, { color: theme.text }]}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Toggle Screen Footer */}
          <View style={styles.footerRow}>
            <Text style={{ color: theme.textSecondary }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} activeOpacity={0.7}>
              <Text style={[styles.toggleActionText, { color: primaryColor }]}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  bgBlob1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -50,
    right: -50,
    opacity: 0.45,
  },
  bgBlob2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    bottom: -50,
    left: -50,
    opacity: 0.45,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing.five,
    width: '100%',
    maxWidth: 400,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: Spacing.three,
  },
  logoIcon: {
    // Styles for custom symbols if needed
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: Spacing.one,
  },
  appTagline: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: Spacing.three,
    lineHeight: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 30,
    padding: Spacing.four,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: Spacing.four,
  },
  inputContainer: {
    marginBottom: Spacing.three,
    width: '100%',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'between',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    height: 52,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: Spacing.two,
    fontSize: 15,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: Spacing.one,
  },
  submitButton: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.three,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.four,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    marginHorizontal: Spacing.three,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: Spacing.two,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: Spacing.four,
    justifyContent: 'center',
  },
  toggleActionText: {
    fontWeight: '700',
  },
});
