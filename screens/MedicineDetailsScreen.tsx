import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchMedicineById } from '../api/mockMedicinesAPI';
import { Medicine } from '../types/medicine';
import { RootStackParamList } from '../types/navigation';
import MedicineDetailsCard from '../components/MedicineDetailsCard';
import EmptyState from '../components/EmptyState';
import { useCartStore } from '../stores/cartStore';

type RouteT = RouteProp<RootStackParamList, 'MedicineDetails'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'MedicineDetails'>;

export default function MedicineDetailsScreen() {
  const { params } = useRoute<RouteT>();
  const navigation = useNavigation<Nav>();
  const add = useCartStore((s) => s.add);

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const result = await fetchMedicineById(params.medicineId);
        if (alive) setMedicine(result ?? null);
      } catch {
        if (alive) setError('Не удалось загрузить информацию о лекарстве');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [params.medicineId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#236b48" />
      </View>
    );
  }

  if (error) {
    return <EmptyState title="Ошибка" subtitle={error} />;
  }

  if (!medicine) {
    return <EmptyState title="Лекарство не найдено" />;
  }

  const unavailable = medicine.stock === 0 || medicine.requiresPrescription;

  return (
    <View style={styles.container}>
      <MedicineDetailsCard medicine={medicine} />
      <View style={styles.footer}>
        <Pressable
          disabled={unavailable}
          style={[styles.buyBtn, unavailable && styles.disabledBtn]}
          onPress={() => {
            add(medicine);
            navigation.navigate('Cart');
          }}
        >
          <Text style={styles.buyBtnText}>
            {medicine.requiresPrescription
              ? 'Отпускается по рецепту'
              : medicine.stock === 0
                ? 'Нет в наличии'
                : 'Добавить в корзину'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f8f5' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#edf1ed', backgroundColor: '#fff' },
  buyBtn: {
    backgroundColor: '#236b48',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  disabledBtn: { backgroundColor: '#a9b6ac' },
  buyBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});