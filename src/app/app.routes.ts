import { Routes } from '@angular/router';
import { MainPage } from './components/main-page/main-page.component';
import { UserPage } from './components/user-page/user-page.component';

export const routes: Routes = [
    {path: "", component: MainPage},
    {path: "user/:id", component: UserPage}
];
