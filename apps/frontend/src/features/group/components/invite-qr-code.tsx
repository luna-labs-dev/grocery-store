import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { Button } from '@/components';
import { unsecuredCopyToClipboard } from '@/domain';

interface InviteQRCodeProps {
  joinUrl: string;
  inviteCode: string;
}

export const InviteQRCode = ({ joinUrl, inviteCode }: InviteQRCodeProps) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    joinUrl,
  )}`;

  const copyToClipboard = () => {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(joinUrl);
    } else {
      unsecuredCopyToClipboard(joinUrl);
    }
    toast.success('Link de convite copiado!');
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-xl bg-card">
      <div className="bg-white p-2 rounded-lg">
        <img src={qrUrl} alt="QR Code de Convite" className="w-40 h-40" />
      </div>
      <div className="flex flex-col items-center gap-2 w-full">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Código: {inviteCode}
        </span>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={copyToClipboard}
        >
          <Icon icon="gravity-ui:copy" />
          Copiar Link
        </Button>
      </div>
    </div>
  );
};
