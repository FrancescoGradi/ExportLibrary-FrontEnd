import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryHomeComponent } from './category-home/category-home.component';
import { FormTemplateComponent } from './form-template/form-template.component';

const routes: Routes = [
  { path: 'category-home', component: CategoryHomeComponent},
  { path: 'form-template', component: FormTemplateComponent},
  { path: '', redirectTo: 'category-home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
