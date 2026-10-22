import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CartLine } from '../types/medicine';
import { useCartStore } from '../stores/cartStore';
import { medicineImages } from '../assets/medicineImages';

export default function CartItem({ line }: { line: CartLine }) {
  const remove = useCartStore((s) => s.remove);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);

  const sum = line.medicine.price * line.quantity;

  return (
    <View style={styles.row}>
      <Image source={medicineImages[line.medicine.imageFile]} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {line.medicine.name}
        </Text>
        <Text style={styles.price}>
          {line.medicine.price} ₽ × {line.quantity} = {sum} ₽
        </Text>

        <View style={styles.controls}>
          <Pressable style={styles.qtyBtn} onPress={() => decrement(line.medicine.id)}>
            <Text style={styles.qtyText}>−</Text>
          </Pressable>
          <Text style={styles.qty}>{line.quantity}</Text>
          <Pressable
            style={[styles.qtyBtn, line.quantity >= line.medicine.stock && styles.disabledBtn]}
            disabled={line.quantity >= line.medicine.stock}
            onPress={() => increment(line.medicine.id)}
          >
            <Text style={styles.qtyText}>+</Text>
          </Pressable>
          <Pressable onPress={() => remove(line.medicine.id)} style={styles.remove}>
            <Text style={styles.removeText}>Удалить</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 18,
  },
  image: { width: 72, height: 82, borderRadius: 12, backgroundColor: '#edf2ec' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  price: { fontSize: 13, color: '#236b48', fontWeight: '600', marginBottom: 8 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#edf3ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: { opacity: 0.4 },
  qtyText: { fontSize: 18, fontWeight: '700', color: '#236b48' },
  qty: { fontSize: 16, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  remove: { marginLeft: 'auto' },
  removeText: { color: '#a45345', fontSize: 13 },
});