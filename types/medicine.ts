export type MedicineImageFile =
  | 'medicine-1.jpg'
  | 'medicine-2.jpg'
  | 'medicine-3.jpg'
  | 'medicine-4.jpg'
  | 'medicine-5.jpg'
  | 'medicine-6.jpg'
  | 'medicine-7.jpg'
  | 'medicine-8.jpg'
  | 'medicine-9.jpg'
  | 'medicine-10.jpg';

export interface Medicine {
    id: string;
    name: string;
    category: string;
    manufacturer: string;
    price: number;
    stock: number;
    description: string;
    dosage: string;
    form: string;
    requiresPrescription: boolean;
    imageFile: MedicineImageFile;
  }
  
  export interface CartLine {
    medicine: Medicine;
    quantity: number;
  }
