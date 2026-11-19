import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextField, { TextFieldProps } from './TextField';

type PasswordInputProps = Omit<TextFieldProps, 'secureTextEntry' | 'rightAccessory'>;

// Поле пароля с кнопкой показать/скрыть
export default function PasswordInput(props: PasswordInputProps) {
  const [isHidden, setIsHidden] = useState(true);

  const toggle = (
    <Pressable
      onPress={() => setIsHidden((prev) => !prev)}
      hitSlop={10}
      style={styles.toggle}
      accessibilityRole="button"
      accessibilityLabel={isHidden ? 'Показать пароль' : 'Скрыть пароль'}
    >
      <Ionicons name={isHidden ? 'eye-off-outline' : 'eye-outline'} size={22} color="#5d6f64" />
    </Pressable>
  );

  return (
    <TextField
      {...props}
      secureTextEntry={isHidden}
      autoCapitalize="none"
      autoCorrect={false}
      textContentType="password"
      autoComplete="password"
      rightAccessory={toggle}
    />
  );
}

const styles = StyleSheet.create({
  toggle: { paddingLeft: 8 },
});
