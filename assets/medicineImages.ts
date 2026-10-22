import type { ImageSourcePropType } from 'react-native';
import type { MedicineImageFile } from '../types/medicine';

export const medicineImages: Record<MedicineImageFile, ImageSourcePropType> = {
  'medicine-1.jpg': require('./medicines/medicine-1.jpg'),
  'medicine-2.jpg': require('./medicines/medicine-2.jpg'),
  'medicine-3.jpg': require('./medicines/medicine-3.jpg'),
  'medicine-4.jpg': require('./medicines/medicine-4.jpg'),
  'medicine-5.jpg': require('./medicines/medicine-5.jpg'),
  'medicine-6.jpg': require('./medicines/medicine-6.jpg'),
  'medicine-7.jpg': require('./medicines/medicine-7.jpg'),
  'medicine-8.jpg': require('./medicines/medicine-8.jpg'),
  'medicine-9.jpg': require('./medicines/medicine-9.jpg'),
  'medicine-10.jpg': require('./medicines/medicine-10.jpg'),
};
