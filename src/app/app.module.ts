import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryHomeComponent } from './category-home/category-home.component';
import { FormTemplateComponent } from './form-template/form-template.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatOptionModule, MatPseudoCheckboxModule} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { TableTemplateComponent } from './table-template/table-template.component';


@NgModule({
  declarations: [
    AppComponent,
    CategoryHomeComponent,
    FormTemplateComponent,
    TableTemplateComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatGridListModule,
        MatOptionModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatIconModule,
        HttpClientModule,
        MatPseudoCheckboxModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
