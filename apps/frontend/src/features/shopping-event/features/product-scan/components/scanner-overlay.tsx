import { useZxing } from 'react-zxing';

interface ScannerOverlayProps {
  onScan: (barcode: string) => void;
  isPaused?: boolean;
}

export const ScannerOverlay = ({
  onScan,
  isPaused = false,
}: ScannerOverlayProps) => {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onScan(result.getText());
    },
    paused: isPaused,
  });

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border-2 border-primary/20">
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

      {isPaused && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
          <p className="text-white font-medium">Scanner Paused</p>
        </div>
      )}
    </div>
  );
};
