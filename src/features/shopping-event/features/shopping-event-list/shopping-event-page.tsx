import { ShoppingEventList } from './components/shopping-event-list';

export const ShoppingEventPage = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>Calendar</CommandItem>
                <CommandItem>Search Emoji</CommandItem>
                <CommandItem>Calculator</CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem>Profile</CommandItem>
                <CommandItem>Billing</CommandItem>
                <CommandItem>Settings</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover> */}
      <ShoppingEventList />
    </div>
  );
};
