import { useNavigate } from '@tanstack/react-router';
import { GroupOnboardingSideForm } from './group-onboarding-sheet';
import { Button } from '@/components';
import { Page } from '@/components/layout/page-layout';
import { useListGroupsQuery } from '@/features/group/infrastructure';

export const GroupOnboarding = () => {
  const navigate = useNavigate();
  const { data: groups } = useListGroupsQuery();
  const hasGroups = groups && groups.length > 0;
  const createGroup = (
    <GroupOnboardingSideForm.Sheet
      trigger={<Button>Criar um grupo</Button>}
      context={{
        title: 'Criar um grupo',
        description: 'Crie um novo grupo para interagir com o sistema',
      }}
    >
      <GroupOnboardingSideForm.CreateForm />
    </GroupOnboardingSideForm.Sheet>
  );

  const joinGroup = (
    <GroupOnboardingSideForm.Sheet
      trigger={<Button>Entrar em um grupo</Button>}
      context={{
        title: 'Entrar em um grupo',
        description: 'Entre em um grupo existente para interagir com o sistema',
      }}
    >
      <GroupOnboardingSideForm.JoinForm />
    </GroupOnboardingSideForm.Sheet>
  );

  return (
    <Page>
      <Page.Content>
        <div className="flex flex-col items-center justify-center w-full gap-4 pt-8">
          <div className="flex flex-col gap-8 w-[400px] border p-4 rounded-lg">
            <h1 className="text-sm">
              Para interagir com o sistema, você precisa criar ou entrar em um
              grupo
            </h1>
            <div className="flex flex-col gap-4">
              {createGroup}
              {joinGroup}

              {hasGroups && (
                <Button
                  variant="ghost"
                  onClick={() => navigate({ to: '/dashboard' })}
                >
                  Voltar para o Grupo Ativo
                </Button>
              )}
            </div>
          </div>
        </div>
      </Page.Content>
    </Page>
  );
};
