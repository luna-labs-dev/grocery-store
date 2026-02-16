import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';
import { BarChart3, ShieldCheck, Users } from 'lucide-react';
import { Button, GroceryfyLogo } from '@/components';

export const LandingPage = () => {
  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full text-white bg-gray-900 border-b border-gray-800">
        <div className="container flex items-center justify-between h-16">
          <GroceryfyLogo />
          <nav className="hidden gap-6 md:flex">
            <a
              href="#beneficios"
              className="text-sm font-medium hover:text-violet-400"
            >
              Benefícios
            </a>
            <a
              href="#como-funciona"
              className="text-sm font-medium hover:text-violet-400"
            >
              Como Funciona
            </a>
            <a
              href="#comece-hoje-mesmo"
              className="text-sm font-medium hover:text-violet-400"
            >
              Comece hoje mesmo
            </a>
          </nav>
          <div className="flex items-center gap-4">
            {/* <Button variant="outline" size="sm">
              Começar
            </Button> */}

            <SignedOut>
              <SignInButton mode="modal">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                  Experimente agora
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton showName />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-linear-to-b from-gray-900 to-gray-950">
          <div className="container max-w-3xl mx-auto text-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                Controle suas compra de supermercado com facilidadeSignIn
              </h1>
              <p className="text-lg text-gray-400">
                Economize tempo e dinheiro gerenciando suas compra em família de
                forma inteligente e evitando surpresas no caixa.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                  Experimente agora
                </Button>
                <Button variant="outline" size="lg">
                  Saiba mais
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16 bg-gray-950">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-4 text-center">
              <h2 className="text-3xl font-bold text-white">
                Simplifique suas compra de supermercado
              </h2>
              <p className="text-lg text-gray-400">
                O Groceryfy é um aplicativo que ajuda você e sua família a
                controlar as compra de supermercado em tempo real. Acompanhe o
                valor total, evite surpresas no caixa e tenha controle completo
                sobre seus gastos.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="beneficios" className="py-16 bg-gray-900">
          <div className="container">
            <h2 className="mb-12 text-3xl font-bold text-center text-white">
              Benefícios
            </h2>
            <div className="grid max-w-5xl gap-8 mx-auto md:grid-cols-3">
              <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-md">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-violet-900/50">
                  <BarChart3 className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-center text-white">
                  Controle de gastos
                </h3>
                <p className="text-center text-gray-400">
                  Acompanhe em tempo real o valor total da sua compra e evite
                  surpresas desagradáveis no caixa.
                </p>
              </div>
              <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-md">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-violet-900/50">
                  <Users className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-center text-white">
                  compra em família
                </h3>
                <p className="text-center text-gray-400">
                  Crie ou participe de grupos familiares para organizar as
                  compra coletivamente.
                </p>
              </div>
              <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-md">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-violet-900/50">
                  <ShieldCheck className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-center text-white">
                  Prevenção de erros
                </h3>
                <p className="text-center text-gray-400">
                  Evite cobranças indevidas verificando os preços e produtos
                  antes de chegar ao caixa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="como-funciona" className="py-16 bg-gray-950">
          <div className="container">
            <h2 className="mb-12 text-3xl font-bold text-center text-white">
              Como funciona
            </h2>
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center shrink-0 w-8 h-8 font-bold text-white rounded-full bg-violet-600">
                  1
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-semibold text-white">
                    Faça login e crie sua família
                  </h3>
                  <p className="text-gray-400">
                    Crie uma conta, faça login e crie ou entre em uma família
                    existente.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center shrink-0 w-8 h-8 font-bold text-white rounded-full bg-violet-600">
                  2
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-semibold text-white">
                    Adicione supermercados
                  </h3>
                  <p className="text-gray-400">
                    Cadastre os supermercados onde você costuma fazer compra.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center shrink-0 w-8 h-8 font-bold text-white rounded-full bg-violet-600">
                  3
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-semibold text-white">
                    Inicie um evento de compra
                  </h3>
                  <p className="text-gray-400">
                    Comece a adicionar produtos ao seu carrinho e acompanhe o
                    valor total em tempo real.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center shrink-0 w-8 h-8 font-bold text-white rounded-full bg-violet-600">
                  4
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-semibold text-white">
                    Finalize e veja o resumo
                  </h3>
                  <p className="text-gray-400">
                    Ao terminar, veja um resumo detalhado de tudo que foi
                    comprado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promotion Section */}
        <section
          id="comece-hoje-mesmo"
          className="py-16 text-white bg-linear-to-r from-violet-700 to-indigo-800"
        >
          <div className="container space-y-8 text-center">
            <h2 className="text-3xl font-bold">
              Comece a economizar hoje mesmo
            </h2>
            <p className="max-w-2xl mx-auto text-xl">
              Experimente o Groceryfy gratuitamente e transforme a maneira como
              você faz compra no supermercado.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary">
                Experimente agora
              </Button>
              {/* <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-violet-700"
              >
                Ver planos
              </Button> */}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 text-gray-300 bg-gray-900">
        <div className="container text-center">
          <GroceryfyLogo />
          <p className="max-w-md mx-auto mb-8 text-sm">
            Controle suas compra de supermercado de forma inteligente e prática.
          </p>

          {/* <div className="flex justify-center gap-8 mb-8">
            <a href="#" className="transition-colors hover:text-violet-400">
              Recursos
            </a>
            <a href="#" className="transition-colors hover:text-violet-400">
              Preços
            </a>
            <a href="#" className="transition-colors hover:text-violet-400">
              FAQ
            </a>
          </div> */}

          <div className="pt-8 text-sm border-t border-gray-800">
            &copy; {new Date().getFullYear()} GroceryFy. Todos os direitos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
