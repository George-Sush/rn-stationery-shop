import { Alert, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';

export default function LogoutButton() {
  const { signOut } = useAuth();

  const handlePress = () => {
    Alert.alert('Выйти из аккаунта?', 'Для новых заказов потребуется повторный вход.', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: () => void signOut() },
    ]);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.wrap}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Выйти из аккаунта"
    >
      <Ionicons name="log-out-outline" size={22} color="#b65c48" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 8 },
});
