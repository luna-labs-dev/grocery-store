import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components';
import { getInitials } from '@/domain';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { user } = useUser();
  const { signOut } = useAuth();

  const navigationItems = (
    <div className="px-4">
      <ul className="flex flex-col gap-4">
        <li>
          <Link
            onClick={() => {
              setIsOpen(false);
            }}
            to={'/'}
          >
            Home
          </Link>
        </li>
        <li>
          <Link onClick={() => setIsOpen(false)} to={'/family/onboarding'}>
            Família
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              setIsOpen(false);
            }}
            to={'/market'}
          >
            Mercados
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              setIsOpen(false);
            }}
            to={'/shopping-event'}
          >
            Eventos de compra
          </Link>
        </li>
      </ul>
    </div>
  );

  const newVersion = (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
      <DrawerTrigger>
        <Icon icon="mingcute:menu-line" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Grocery Store</DrawerTitle>
        </DrawerHeader>
        {navigationItems}
        <DrawerFooter className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.imageUrl ?? ''} />
              <AvatarFallback>
                {getInitials({
                  fullName: user?.fullName ?? '',
                  initialsLength: 2,
                  upperCase: true,
                })}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-bold">{user?.fullName}</p>
              <p className="text-xs">{user?.emailAddresses[0].emailAddress}</p>
            </div>
          </div>

          <Button
            variant={'outline'}
            className="flex gap-1"
            onClick={() => {
              signOut();
            }}
          >
            <Icon icon="mingcute:exit-line" />
            Sair
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
  return newVersion;
};
