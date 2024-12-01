import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'lemf',
    loadChildren: () => import('lemf/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'lea',
    loadChildren: () => import('lea/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    component: NxWelcomeComponent,
  },
];
