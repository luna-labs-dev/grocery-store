import { useEffect, useState } from 'react';
import { useScanProduct } from '@/infrastructure/api/cart';
import type { ScanProduct200 } from '@/infrastructure/api/types';

export const useScanProductHook = () => {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [scannedProduct, setScannedProduct] = useState<
    ScanProduct200['product'] | ScanProduct200['variableWeight'] | null
  >(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data, isFetching } = useScanProduct(barcode || '');

  useEffect(() => {
    if (data) {
      if (data.matchType !== 'NOT_FOUND') {
        setScannedProduct(data.product || data.variableWeight);
        setIsDrawerOpen(true);
      } else {
        console.log('Product not found');
      }
      setBarcode(null); // Reset after scan
    }
  }, [data]);

  return {
    scan: (code: string) => {
      setBarcode(code);
    },
    isScanning: isFetching,
    scannedProduct,
    setScannedProduct,
    isDrawerOpen,
    setIsDrawerOpen,
    closeDrawer: () => setIsDrawerOpen(false),
  };
};
