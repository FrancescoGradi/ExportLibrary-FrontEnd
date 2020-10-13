import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category-home',
  templateUrl: './category-home.component.html',
  styleUrls: ['./category-home.component.css'],
})
// Following https://angular.io/guide/http
export class CategoryHomeComponent implements OnInit {

  public categories: any;

  constructor(public router: Router, private http: HttpClient) { }

  getCategories(): void {
    this.http.get('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/categories').toPromise().then(data => {
      this.categories = data;
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  goToCatPage(category): void {
    // TO-DO trovare una soluzione migliore per distinguere i due diversi tipi di form, per docx e xlsx.
    if (category == 'Salari Ospedale') {
      this.router.navigate(['table-template'], {state: {category}}).then();
    } else {
      this.router.navigate(['form-template'], {state: {category}}).then();

    }
  }

}
