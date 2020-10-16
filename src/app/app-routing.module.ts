import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryHomeComponent } from './category-home/category-home.component';
import { FormTemplateComponent } from './form-template/form-template.component';
import { TableTemplateComponent } from './table-template/table-template.component';

const routes: Routes = [
  { path: 'category-home', component: CategoryHomeComponent},
  { path: 'form-template', component: FormTemplateComponent},
  { path: 'table-template', component: TableTemplateComponent},
  { path: '', redirectTo: 'category-home', pathMatch: 'full'},
];

// @ts-ignore
@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
