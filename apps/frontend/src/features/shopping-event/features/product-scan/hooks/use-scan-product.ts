import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { httpClient } from '@/config/clients/http-client';

export interface ScanResult {
  matchType: 'LOCAL' | 'EXTERNAL' | 'VARIABLE_WEIGHT' | 'NOT_FOUND';
  product?: {
    id?: string;
    name: string;
    brand?: string;
    imageUrl?: string;
  };
  variableWeight?: {
    totalPrice?: number;
    weightInGrams?: number;
  };
  requiresPriceConfirmation: boolean;
}

export const useScanProduct = () => {
  const [scannedProduct, setScannedProduct] = useState<
    ScanResult['product'] | null
  >(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const scanMutation = useMutation({
    mutationFn: async (barcode: string) => {
      const response = await httpClient.get(`/products/scan/${barcode}`);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.matchType !== 'NOT_FOUND') {
        setScannedProduct(data.product || data.variableWeight);
        setIsDrawerOpen(true);
      } else {
        // Handle not found (will be Story 2)
        console.log('Product not found');
      }
    },
  });

  return {
    scan: scanMutation.mutate,
    isScanning: scanMutation.isPending,
    scannedProduct,
    setScannedProduct,
    isDrawerOpen,
    setIsDrawerOpen,

    closeDrawer: () => setIsDrawerOpen(false),
  };
};
