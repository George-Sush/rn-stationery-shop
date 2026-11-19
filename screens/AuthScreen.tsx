import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, ResponseType, useAuthRequest } from 'expo-auth-session';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { useAuth } from '../auth/AuthContext';
import { DEMO_LOGIN, InvalidCredentialsError, loginWithPassword } from '../auth/fakeAuth';
import TextField from '../components/TextField';
import PasswordInput from '../components/PasswordInput';

// Закрывает окно браузера после авторизации
WebBrowser.maybeCompleteAuthSession();

const GITHUB_DISCOVERY = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

const GITHUB_CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID ?? '';

export default function AuthScreen() {
  // Запрет скриншотов на этом экране
  usePreventScreenCapture();

  const { signIn } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ['read:user', 'user:email'],
      redirectUri: makeRedirectUri({ scheme: 'medicineshop', path: 'auth' }),
      responseType: ResponseType.Code,
    },
    GITHUB_DISCOVERY,
  );

  useEffect(() => {
    if (response?.type === 'success') {
      // Сохраняем code от GitHub как токен (учебное упрощение)
      void signIn(response.params.code);
    } else if (response?.type === 'error') {
      Alert.alert('Ошибка входа через GitHub', response.error?.message ?? 'Неизвестная ошибка');
    }
  }, [response, signIn]);

  const canSubmit = login.trim().length > 0 && password.length > 0 && !isSubmitting;
  const isGithubReady = Boolean(request) && GITHUB_CLIENT_ID.length > 0;

  const handlePasswordLogin = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const token = await loginWithPassword({ login, password });
      await signIn(token);
    } catch (error: unknown) {
      const message =
        error instanceof InvalidCredentialsError ? error.message : 'Не удалось войти, попробуйте ещё раз';
      Alert.alert('Ошибка', message);
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>💊</Text>
        <Text style={styles.title}>Аптека рядом</Text>
        <Text style={styles.subtitle}>Войдите, чтобы продолжить</Text>
      </View>

      <TextField
        placeholder="Логин"
        value={login}
        onChangeText={setLogin}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="username"
        autoComplete="username"
        returnKeyType="next"
      />
      <PasswordInput
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        returnKeyType="done"
        onSubmitEditing={handlePasswordLogin}
      />
      <Text style={styles.hint}>Демо-доступ: {DEMO_LOGIN} / password</Text>

      <Pressable
        style={[styles.button, styles.primary, !canSubmit && styles.disabled]}
        disabled={!canSubmit}
        onPress={handlePasswordLogin}
        accessibilityRole="button"
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Войти</Text>
        )}
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>или</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable
        style={[styles.button, styles.github, !isGithubReady && styles.disabled]}
        disabled={!isGithubReady}
        onPress={() => void promptAsync()}
        accessibilityRole="button"
      >
        <Ionicons name="logo-github" size={20} color="#fff" />
        <Text style={styles.buttonText}>Войти через GitHub</Text>
      </Pressable>
      {!GITHUB_CLIENT_ID && (
        <Text style={styles.warning}>Укажите EXPO_PUBLIC_GITHUB_CLIENT_ID в .env</Text>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f6f8f5' },
  header: { alignItems: 'center', marginBottom: 28 },
  logo: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#20372b' },
  subtitle: { fontSize: 15, color: '#5d6f64', marginTop: 6 },
  hint: { fontSize: 13, color: '#8a978f', marginBottom: 16, marginLeft: 4 },
  button: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: '#236b48' },
  github: { backgroundColor: '#24292e' },
  disabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#dfe7e1' },
  dividerText: { marginHorizontal: 12, color: '#8a978f' },
  warning: { fontSize: 12, color: '#b65c48', textAlign: 'center', marginTop: 8 },
});
