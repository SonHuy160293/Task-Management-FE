import {
  LayoutDashboard,
  Building2,
  UsersRound,
  ShieldCheck,
  SlidersHorizontal,
  BookOpen,
} from 'lucide-react';

export const navigation = [
  {
    to: '/',
    label: 'Overview',
    icon: LayoutDashboard,
    description: 'Your workspace starting point',
  },
  {
    to: '/organizations',
    label: 'Organizations',
    icon: Building2,
    description: 'Organization integration and availability',
  },
  {
    to: '/teams',
    label: 'Teams',
    icon: UsersRound,
    description: 'Team integration and availability',
  },
  {
    to: '/identity',
    label: 'Identity & access',
    icon: ShieldCheck,
    description: 'Account and security capabilities',
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: SlidersHorizontal,
    description: 'Connection configuration',
  },
  {
    to: '/guide',
    label: 'Getting started',
    icon: BookOpen,
    description: 'Learn your DevFlow workspace',
  },
];
