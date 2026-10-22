import data from '../mocks/db.json';
import { medicineImages } from '../assets/medicineImages';
import type { Medicine, MedicineImageFile } from '../types/medicine';

const DELAY_MS = 600;

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

function isMedicineImageFile(fileName: string): fileName is MedicineImageFile {
  return Object.prototype.hasOwnProperty.call(medicineImages, fileName);
}

const medicines: Medicine[] = data.medicines.map((medicine) => {
  const imageFile = medicine.imageFile;
  if (!isMedicineImageFile(imageFile)) {
    throw new Error(`Unknown local medicine image: ${imageFile}`);
  }
  return { ...medicine, imageFile };
});

export async function fetchMedicines(): Promise<Medicine[]> {
  await delay(DELAY_MS);
  return medicines;
}

export async function fetchMedicineById(id: string): Promise<Medicine | undefined> {
  await delay(DELAY_MS);
  return medicines.find((medicine) => medicine.id === id);
}
