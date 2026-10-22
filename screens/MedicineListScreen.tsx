import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchMedicines } from '../api/mockMedicinesAPI';
import { Medicine } from '../types/medicine';
import { RootStackParamList } from '../types/navigation';
import MedicineListItem from '../components/MedicineListItem';
import EmptyState from '../components/EmptyState';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MedicineList'>;

export default function MedicineListScreen() {
  const navigation = useNavigation<Nav>();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const categories = ['Все', ...new Set(medicines.map((medicine) => medicine.category))];
  const visibleMedicines = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ru');
    return medicines.filter((medicine) => {
      const matchesCategory =
        selectedCategory === 'Все' || medicine.category === selectedCategory;
      const searchableText =
        `${medicine.name} ${medicine.manufacturer} ${medicine.category}`.toLocaleLowerCase('ru');
      return matchesCategory && searchableText.includes(normalizedQuery);
    });
  }, [medicines, query, selectedCategory]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchMedicines();
        if (alive) setMedicines(data);
      } catch {
        if (alive) setError('Не удалось загрузить каталог лекарств');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#236b48" />
        <Text style={styles.hint}>Загружаем каталог…</Text>
      </View>
    );
  }

  if (error) {
    return <EmptyState title="Ошибка" subtitle={error} />;
  }

  if (medicines.length === 0) {
    return <EmptyState title="Каталог пуст" />;
  }

  return (
    <FlatList
      style={styles.screen}
      data={visibleMedicines}
      keyExtractor={(medicine) => medicine.id}
      contentContainerStyle={styles.list}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.headerContent}>
          <View style={styles.intro}>
            <Text style={styles.eyebrow}>ЗАБОТА РЯДОМ</Text>
            <Text style={styles.heading}>Аптека{'\n'}для вашего здоровья</Text>
            <Text style={styles.introText}>Лекарства для повседневной заботы о себе</Text>
          </View>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Название или производитель"
              placeholderTextColor="#92a097"
              style={styles.searchInput}
              returnKeyType="search"
              accessibilityLabel="Поиск лекарств"
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {categories.map((category) => {
              const selected = category === selectedCategory;
              return (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                >
                  <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.catalogHeading}>
            <Text style={styles.sectionTitle}>Каталог</Text>
            <Text style={styles.resultCount}>{visibleMedicines.length} позиций</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <EmptyState title="Ничего не найдено" subtitle="Измените запрос или выберите другую категорию" />
      }
      renderItem={({ item }) => (
        <MedicineListItem
          medicine={item}
          onPress={() =>
            navigation.navigate('MedicineDetails', { medicineId: item.id })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f8f5' },
  list: { paddingBottom: 20 },
  headerContent: { paddingBottom: 8 },
  intro: {
    backgroundColor: '#e8f0e8',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  eyebrow: { color: '#527a5e', fontWeight: '800', fontSize: 10, letterSpacing: 1.8, marginBottom: 8 },
  heading: { color: '#20372b', fontSize: 30, lineHeight: 35, fontWeight: '800' },
  introText: { color: '#63746a', fontSize: 13, marginTop: 8 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 18,
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  searchIcon: { color: '#668271', fontSize: 25, marginRight: 8 },
  searchInput: { flex: 1, color: '#20372b', fontSize: 14 },
  categoryRow: { paddingHorizontal: 16, paddingVertical: 16, gap: 8 },
  categoryChip: { borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14, backgroundColor: '#eaf0ea' },
  categoryChipSelected: { backgroundColor: '#236b48' },
  categoryText: { color: '#52665a', fontSize: 12, fontWeight: '600' },
  categoryTextSelected: { color: '#fff' },
  catalogHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 4 },
  sectionTitle: { color: '#20372b', fontSize: 20, fontWeight: '800' },
  resultCount: { color: '#89968e', fontSize: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f8f5' },
  hint: { marginTop: 8, color: '#668271' },
});