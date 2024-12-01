import { Route } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';
import { ListLeaComponent } from './list-lea/list-lea.component';
import { EditLeaComponent } from './edit-lea/edit-lea.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: ListLeaComponent },
      {
        path: 'edit/:id',
        component: EditLeaComponent,
      },
    ],
  },
];
