import { Icon } from '@iconify/react';
import { useClipboard } from '@mantine/hooks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { RemoveFamilyMemberAlertDialog } from './remove-family-member-alert-dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components';
import { getInitials, unsecuredCopyToClipboard } from '@/domain';
import { useGetFamilyQuery } from '@/features/family/infrastructure';

export const FamilyDetails = () => {
  const { data, isLoading } = useGetFamilyQuery();

  const { copy } = useClipboard({
    timeout: 1000,
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!data) {
    return <div>Família não encontrada</div>;
  }

  // const { userId } = useAuth();
  // const loggedOwner = data.owner.externalId === userId;

  return (
    <div className="w-full pt-4">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="">
          <CardHeader>
            <CardTitle>{data.name}</CardTitle>
            <CardDescription>{data.description} teste</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col w-full gap-8">
            <div className="flex items-start gap-2">
              {/* <Icon icon="mingcute:calendar-2-line" /> */}
              <div className="flex flex-col gap-0">
                <span className="text-xs font-bold">criado em</span>
                <p className="text-sm">
                  {format(data.createdAt, 'EEEEEE - dd/MM/yyyy HH:mm:ss ', {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              {/* <Icon icon="octicon:code-of-conduct-24" /> */}

              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold">codigo de convite</span>
                <div className="flex gap-2 p-2 border rounded-lg w-fit">
                  <span className="tracking-wider">{data.inviteCode}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-6 h-6"
                      onClick={async () => {
                        if (window.isSecureContext) {
                          copy(data.inviteCode);
                        } else {
                          unsecuredCopyToClipboard(data.inviteCode);
                        }

                        toast(
                          'Código de convite copiado para a área de transferência',
                          {
                            position: 'top-center',
                            invert: true,
                          },
                        );
                      }}
                    >
                      <Icon icon="gravity-ui:copy" />
                    </Button>

                    {/* <Button size="icon" variant="outline" className="w-6 h-6">
                  <Icon icon="material-symbols:refresh" />
                </Button> */}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              <div className="flex items-start gap-4">Membros</div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              {data.members?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center space-x-4 min-w-[20rem] justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={member.picture} />
                        <AvatarFallback>
                          {getInitials({
                            fullName: member.name,
                            initialsLength: 2,
                            upperCase: true,
                          })}
                        </AvatarFallback>
                      </Avatar>
                      {member.id === data.owner.id && (
                        <div className="absolute p-1 border border-yellow-300 rounded-full shadow-md -top-3 -right-3">
                          <Icon
                            icon="ph:crown"
                            fontSize=".7rem"
                            className="text-yellow-300"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {member.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  {/* Family owner validation goes here */}
                  {member.id !== data.owner.id && (
                    <RemoveFamilyMemberAlertDialog memberId={member.id} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
