import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/components';
import { Page } from '@/components/layout/page-layout';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { env } from '@/config';
import { useBreadCrumbs } from '@/hooks';
import { useHaptics } from '@/hooks/use-haptics';
import { signOut, useSession } from '@/infrastructure/auth/auth-client';
export function ProfilePage() {
  const { data: session } = useSession();
  const { addBreadcrumbs } = useBreadCrumbs();
  const haptics = useHaptics();
  const { data: activeSessions, refetch: refetchSessions } = useQuery({
    queryKey: ['active-device-sessions'],
    queryFn: async () => {
      // Better-Auth clients don't expose listSessions natively as a wrapper
      // so we use standard fetch against our Fastify proxy definition
      const res = await fetch(`${env.auth.url}/list-sessions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // auth client passes cookies automatically based on 'credentials: include'
        },
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch sessions');
      }
      return (await res.json()) || [];
    },
  });
  const user = session?.user;

  useEffect(() => {
    addBreadcrumbs(
      [
        {
          label: 'Perfil',
          to: '/profile',
        },
      ],
      {
        title: 'Meu Perfil',
        subTitle: 'Gerencie suas informações de conta',
      },
    );
  }, [addBreadcrumbs]);

  const handleSignOut = async () => {
    haptics.medium();
    await signOut();
  };

  if (!user) return null;

  const joinDate = new Date(user.createdAt);

  return (
    <Page>
      <Page.Content className="p-4 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-4">
          {/* Hero Profile Card */}
          <Card className="overflow-hidden border-none shadow-xl bg-linear-to-b from-background to-accent/20 p-6 rounded-xl">
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <Avatar className="size-24 md:size-32 border-4 border-background shadow-lg">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="text-3xl md:text-4xl bg-primary text-primary-foreground font-bold">
                    {user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center md:text-left">
                  <CardTitle className="text-2xl md:text-4xl font-bold">
                    {user.name}
                  </CardTitle>
                  <CardDescription className="text-base md:text-lg">
                    {user.email}
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-3 md:ml-auto">
                <Badge
                  variant={user.emailVerified ? 'default' : 'secondary'}
                  className="gap-1 md:px-3 md:py-1 text-sm whitespace-nowrap"
                >
                  {user.emailVerified ? (
                    <Icon icon="mingcute:check-circle-fill" />
                  ) : (
                    <Icon icon="mingcute:time-line" />
                  )}
                  {user.emailVerified
                    ? 'E-mail Verificado'
                    : 'Aguardando Verificação'}
                </Badge>

                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/30 px-3 py-1.5 rounded-full whitespace-nowrap">
                  <Icon
                    icon="mingcute:calendar-line"
                    className="size-3.5 text-primary"
                  />
                  <span>
                    Membro desde{' '}
                    {format(joinDate, "MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Secondary Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
            <Card className="border-none shadow-lg rounded-xl bg-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon
                    icon="mingcute:shield-check-line"
                    className="text-primary"
                  />
                  Segurança da Conta
                </CardTitle>
                <CardDescription>
                  Proteja sua conta e visualize suas sessões ativas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border bg-accent/5">
                  <div className="flex gap-4 items-center">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon
                        icon="mingcute:google-fill"
                        className="size-5 text-primary"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Método de Login</p>
                      <p className="text-xs text-muted-foreground uppercase opacity-80 font-mono">
                        Google OAuth
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase tracking-wider"
                  >
                    Conectado
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border bg-accent/5">
                  <div className="flex gap-4 items-center">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon
                        icon="mingcute:device-line"
                        className="size-5 text-primary"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Sessão Atual</p>
                      <p className="text-xs text-muted-foreground">
                        Este dispositivo
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    Ativa
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg rounded-xl bg-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon
                    icon="mingcute:settings-2-line"
                    className="text-primary"
                  />
                  Preferências (Em breve)
                </CardTitle>
                <CardDescription>
                  Personalize sua experiência no Grocery Store.
                </CardDescription>
              </CardHeader>
              <CardContent className="opacity-50 grayscale pointer-events-none">
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Notificações por E-mail
                    </p>
                    <div className="w-10 h-6 rounded-full bg-muted shadow-inner" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Tema Escuro Automático
                    </p>
                    <div className="w-10 h-6 rounded-full bg-muted shadow-inner" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-accent bg-card rounded-xl border-dashed">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon icon="mingcute:key-2-line" className="text-primary" />
                  Sessões Ativas
                </CardTitle>
                <CardDescription>
                  Gerencie os locais e dispositivos onde você está conectado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeSessions?.map((s: any) => {
                  const isCurrentSession = s.id === session?.session?.id;
                  let uaObj = s.userAgent
                    ? s.userAgent
                    : 'Dispositivo Desconhecido';
                  if (uaObj.length > 35) {
                    uaObj = uaObj.substring(0, 35) + '...';
                  }

                  return (
                    <div
                      key={s.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border bg-accent/5 gap-4"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon
                            icon={
                              s.userAgent?.includes('Mobile') ||
                              s.userAgent?.includes('Mobi')
                                ? 'mingcute:smartphone-line'
                                : 'mingcute:computer-line'
                            }
                            className="size-5 text-primary"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-medium text-sm flex gap-2 items-center flex-wrap">
                            <span className="truncate">{uaObj}</span>
                            {isCurrentSession && (
                              <Badge
                                variant="outline"
                                className="text-[10px] uppercase tracking-wider shrink-0 bg-primary/10"
                              >
                                Atual
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1 flex-wrap">
                            <span>{s.ipAddress || 'IP Oculto'}</span>
                            <span>•</span>
                            <span>
                              Logado em{' '}
                              {s.createdAt
                                ? format(new Date(s.createdAt), 'dd/MM/yyyy', {
                                    locale: ptBR,
                                  })
                                : 'Data Desconhecida'}
                            </span>
                          </p>
                        </div>
                      </div>

                      {isCurrentSession ? (
                        <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase tracking-wider md:justify-end shrink-0">
                          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                          Ativa
                        </div>
                      ) : (
                        <div className="flex md:justify-end shrink-0">
                          <ConfirmDialog
                            title="Revogar Sessão"
                            description="Deseja desconectar este dispositivo remotamente?"
                            confirmText="Revogar"
                            variant="destructive"
                            onConfirm={async () => {
                              haptics.medium();
                              await fetch(`${env.auth.url}/revoke-session`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                                body: JSON.stringify({ token: s.token }),
                              });
                              refetchSessions();
                            }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 w-full md:w-auto"
                            >
                              <Icon
                                icon="mingcute:delete-2-line"
                                className="mr-2 md:mr-0 size-4"
                              />
                              <span className="md:hidden">Revogar Acesso</span>
                            </Button>
                          </ConfirmDialog>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="pt-4 mt-4 border-t w-full flex justify-end">
                  <ConfirmDialog
                    title="Encerrar Sessão Atual"
                    description="Deseja realmente sair deste dispositivo agora?"
                    confirmText="Sair"
                    onConfirm={handleSignOut}
                  >
                    <Button
                      variant="outline"
                      className="w-full md:w-fit h-11 px-6 text-sm font-semibold hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 active:scale-[0.98] transition-all"
                    >
                      <Icon icon="mingcute:exit-line" className="mr-2 size-4" />
                      Sair da Sessão Atual
                    </Button>
                  </ConfirmDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Page.Content>
      <Page.Footer className="p-4 bg-background/80 backdrop-blur-sm">
        <p className="text-[10px] text-muted-foreground text-center">
          Grocery Store © {new Date().getFullYear()} • Todos os direitos
          reservados
        </p>
      </Page.Footer>
    </Page>
  );
}
