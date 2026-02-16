import { FamilyOnboardingSideForm } from './family-onboarding-sheet';
import { Button } from '@/components';
import { Page } from '@/components/layout/page-layout';

export const FamilyOnboarding = () => {
  const createFamily = (
    <FamilyOnboardingSideForm.Sheet
      trigger={<Button>Criar uma família</Button>}
      context={{
        title: 'Criar uma família',
        description: 'Crie uma nova família para interagir com o sistema',
      }}
    >
      <FamilyOnboardingSideForm.CreateForm />
    </FamilyOnboardingSideForm.Sheet>
  );

  const joinFamily = (
    <FamilyOnboardingSideForm.Sheet
      trigger={<Button>Entrar em uma família</Button>}
      context={{
        title: 'Entrar em uma família',
        description:
          'Entre em uma família existente para interagir com o sistema',
      }}
    >
      <FamilyOnboardingSideForm.JoinForm />
    </FamilyOnboardingSideForm.Sheet>
  );

  return (
    <Page>
      <Page.Content>
        <div className="flex flex-col items-center justify-center w-full gap-4 pt-8">
          <div className="flex flex-col gap-8 w-[400px] border p-4 rounded-lg">
            <h1 className="text-sm">
              Para interagir com o sistema, você precisa criar ou entrar em uma
              família
            </h1>
            <div className="flex flex-col gap-4">
              {createFamily}
              {joinFamily}
            </div>
          </div>
        </div>
      </Page.Content>
    </Page>
  );
};
