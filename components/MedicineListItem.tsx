import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Medicine } from '../types/medicine';
import { useCartStore } from '../stores/cartStore';
import { medicineImages } from '../assets/medicineImages';

interface Props {
  medicine: Medicine;
  onPress: () => void;
}

export default function MedicineListItem({ medicine, onPress }: Props) {
  const add = useCartStore((s) => s.add);
  const unavailable = medicine.stock === 0 || medicine.requiresPrescription;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image
        source={medicineImages[medicine.imageFile]}
        style={styles.image}
        onError={({ nativeEvent }) =>
          console.error(`Failed to load image for ${medicine.name}: ${nativeEvent.error}`)
        }
      />
      <View style={styles.info}>
        <Text style={styles.category}>{medicine.category}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {medicine.name}
        </Text>
        <Text style={styles.details}>{medicine.form} · {medicine.dosage}</Text>
        <Text style={styles.manufacturer}>{medicine.manufacturer}</Text>
        <Text style={styles.price}>{medicine.price} ₽</Text>
      </View>

      <Pressable
        style={[styles.addBtn, unavailable && styles.disabledBtn]}
        disabled={unavailable}
        accessibilityLabel={
          medicine.requiresPrescription
            ? 'Отпускается по рецепту'
            : medicine.stock === 0
              ? 'Нет в наличии'
              : 'Добавить в корзину'
        }
        onPress={(e) => {
          e.stopPropagation();
          add(medicine);
        }}
      >
        <Text style={[styles.addBtnText, unavailable && styles.disabledBtnText]}>
          {medicine.stock === 0 ? '−' : medicine.requiresPrescription ? 'Rx' : '+'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 7,
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  image: { width: 88, height: 104, borderRadius: 13, backgroundColor: '#edf2ec' },
  info: { flex: 1, marginLeft: 12 },
  category: { fontSize: 10, color: '#5d806b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: 15, fontWeight: '700', marginVertical: 4, color: '#20372b' },
  details: { fontSize: 11, color: '#52665a', marginBottom: 2 },
  manufacturer: { fontSize: 11, color: '#89968e' },
  price: { fontSize: 17, fontWeight: '800', color: '#236b48', marginTop: 7 },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 13,
    backgroundColor: '#236b48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: { backgroundColor: '#e7ece8' },
  disabledBtnText: { color: '#748279', fontSize: 13 },
  addBtnText: { color: '#fff', fontSize: 20, lineHeight: 24, fontWeight: '700' },
});