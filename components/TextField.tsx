import { ReactNode } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

export interface TextFieldProps extends TextInputProps {
  rightAccessory?: ReactNode;
}

export default function TextField({ rightAccessory, style, ...inputProps }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#8a978f"
        {...inputProps}
      />
      {rightAccessory}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dfe7e1',
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#20372b',
    paddingVertical: 0,
  },
});
