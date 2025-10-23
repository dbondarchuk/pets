import { KBarShortcut, NavItem } from '@/types';
import { Cat, HeartPlus } from 'lucide-react';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'pets',
    url: '/dashboard/pets',
    icon: <Cat />,
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  }
];

export const kBarShortcuts: KBarShortcut[] = [
  {
    url: '/dashboard/pets/new',
    name: 'create_new_pet_title',
    shortcut: ['p', 'n'],
    section: 'pets',
    subtitle: 'create_new_pet_subtitle',
    icon: <HeartPlus />
  }
];
