import { Icon } from '@iconify/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components';
import { Page } from '@/components/layout/page-layout';
import { useJoinGroupMutation } from '@/features/group/infrastructure';
import { useHaptics } from '@/hooks/use-haptics';

interface JoinSearch {
  code?: string;
}

export const Route = createFileRoute('/_protected/join')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): JoinSearch => {
    return {
      code: search.code as string,
    };
  },
});

function RouteComponent() {
  const { code } = Route.useSearch();
  const navigate = useNavigate();
  const haptics = useHaptics();
  const { mutate: joinGroup, isPending } = useJoinGroupMutation();

  const handleJoin = () => {
    if (!code) {
      toast.error('Código de convite inválido');
      return;
    }
    haptics.medium();
    joinGroup(
      { data: { inviteCode: code } },
      {
        onSuccess: () => {
          haptics.success();
          toast.success('Você entrou no grupo com sucesso!');
          navigate({ to: '/dashboard' });
        },
        onError: () => {
          haptics.error();
        },
      },
    );
  };

  if (!code) {
    return (
      <Page>
        <Page.Content className="flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <CardTitle>Link Inválido</CardTitle>
              <CardDescription>
                O código de convite não foi encontrado na URL. Verifique o link
                e tente novamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate({ to: '/dashboard' })}>
                Voltar ao Início
              </Button>
            </CardContent>
          </Card>
        </Page.Content>
      </Page>
    );
  }

  return (
    <Page>
      <Page.Content className="flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Icon icon="ph:users-three-fill" className="size-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Você foi convidado!
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Você recebeu um convite para participar de um grupo em Groceryfy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-accent/50 rounded-xl border border-dashed">
              <span className="text-xs font-bold text-muted-foreground uppercase opacity-80">
                Código do Convite
              </span>
              <p className="text-3xl font-black tracking-widest text-primary font-mono mt-1">
                {code}
              </p>
            </div>

            <div className="flex gap-4 w-full pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate({ to: '/dashboard' })}
                disabled={isPending}
              >
                Recusar
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleJoin}
                disabled={isPending}
              >
                {isPending ? (
                  <Icon
                    icon="line-md:loading-twotone-loop"
                    className="size-5"
                  />
                ) : (
                  <Icon icon="ph:check-bold" className="size-5" />
                )}
                Entrar no Grupo
              </Button>
            </div>
          </CardContent>
        </Card>
      </Page.Content>
    </Page>
  );
}
