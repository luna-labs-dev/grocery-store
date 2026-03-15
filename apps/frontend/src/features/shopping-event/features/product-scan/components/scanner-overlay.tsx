import { useZxing } from 'react-zxing';
import { Loading } from '@/components';

interface ScannerOverlayProps {
  onScan: (barcode: string) => void;
  isPaused?: boolean;
  isScanning?: boolean;
}

export const ScannerOverlay = ({
  onScan,
  isPaused = false,
  isScanning = false,
}: ScannerOverlayProps) => {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onScan(result.getText());
    },
    paused: isPaused || isScanning,
  });

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border-2 border-primary/20 shadow-lg">
      <video ref={ref} className="w-full h-full object-cover">
        <track kind="captions" />
      </video>

      {/* Target area guide */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-2/3 h-1/2 border-2 border-white/50 rounded-lg relative">
          {/* Corner markers */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-primary" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-primary" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-primary" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-primary" />
        </div>
      </div>

      {(isPaused || isScanning) && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm gap-2">
          {isScanning ? (
            <Loading text="Identificando produto..." />
          ) : (
            <p className="text-white font-medium">Scanner Pausado</p>
          )}
        </div>
      )}
    </div>
  );
};
