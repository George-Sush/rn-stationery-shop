import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Medicine } from '../types/medicine';
import { medicineImages } from '../assets/medicineImages';

export default function MedicineDetailsCard({ medicine }: { medicine: Medicine }) {
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Image
        source={medicineImages[medicine.imageFile]}
        style={styles.image}
        onError={({ nativeEvent }) =>
          console.error(`Failed to load image for ${medicine.name}: ${nativeEvent.error}`)
        }
      />
      <Text style={styles.category}>{medicine.category}</Text>
      <Text style={styles.name}>{medicine.name}</Text>
      <Text style={styles.manufacturer}>{medicine.manufacturer}</Text>
      <View style={styles.infoRow}>
        <View style={styles.infoPill}>
          <Text style={styles.infoLabel}>ФОРМА</Text>
          <Text style={styles.infoValue}>{medicine.form}</Text>
        </View>
        <View style={styles.infoPill}>
          <Text style={styles.infoLabel}>ДОЗИРОВКА</Text>
          <Text style={styles.infoValue}>{medicine.dosage}</Text>
        </View>
      </View>
      <Text style={styles.price}>{medicine.price} ₽</Text>
      <Text style={[styles.stock, medicine.stock === 0 && styles.outOfStock]}>
        {medicine.stock > 0 ? `В наличии: ${medicine.stock} шт.` : 'Временно нет в наличии'}
      </Text>
      <Text style={styles.desc}>{medicine.description}</Text>
      {medicine.requiresPrescription && (
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Отпускается по рецепту</Text>
          <Text style={styles.noticeText}>Для получения препарата потребуется действующий рецепт врача.</Text>
        </View>
      )}
      <Text style={styles.disclaimer}>
        Информация носит справочный характер и не заменяет консультацию специалиста.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, paddingBottom: 32 },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 22,
    backgroundColor: '#edf2ec',
    marginBottom: 22,
  },
  category: { fontSize: 11, color: '#4f7b60', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  name: { fontSize: 27, fontWeight: '800', marginVertical: 5, color: '#20372b' },
  manufacturer: { fontSize: 14, color: '#829087', marginBottom: 18 },
  infoRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  infoPill: { flex: 1, borderRadius: 14, padding: 12, backgroundColor: '#f0f4ef' },
  infoLabel: { color: '#829087', fontSize: 9, fontWeight: '700', letterSpacing: 0.7, marginBottom: 5 },
  infoValue: { color: '#293c30', fontSize: 13, fontWeight: '600' },
  price: { fontSize: 27, fontWeight: '800', color: '#236b48', marginBottom: 4 },
  stock: { fontSize: 13, color: '#4f7b60', marginBottom: 18, fontWeight: '600' },
  outOfStock: { color: '#a45345' },
  desc: { fontSize: 15, lineHeight: 23, color: '#47584d' },
  notice: { marginTop: 18, padding: 14, borderRadius: 14, backgroundColor: '#fff4e2' },
  noticeTitle: { fontSize: 14, fontWeight: '700', color: '#76551f', marginBottom: 4 },
  noticeText: { fontSize: 13, lineHeight: 19, color: '#76551f' },
  disclaimer: { marginTop: 18, fontSize: 11, lineHeight: 16, color: '#929b95' },
});