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
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="bg-white p-2 rounded-lg">
        <img src={qrUrl} alt="QR Code de Convite" className="w-40 h-40" />
      </div>
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="text-center w-full">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Código do Grupo
          </span>
          <p className="text-xl font-black tracking-[0.2em] text-primary font-mono mt-0.5">
            {inviteCode}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 font-bold h-10 shadow-xs"
          onClick={copyToClipboard}
        >
          <Icon icon="gravity-ui:copy" className="size-4" />
          Copiar Link de Convite
        </Button>
      </div>
    </div>
  );
};
