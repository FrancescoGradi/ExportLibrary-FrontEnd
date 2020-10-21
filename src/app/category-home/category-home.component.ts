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

  public getCategories(): void {
    this.http.get('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/categories').toPromise().then(data => {
      this.categories = data;
    });
  }

  public ngOnInit(): void {
    this.getCategories();
  }

  public goToCatPage(category): void {

    this.http.get('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/templates/'.concat(category)).toPromise().then(data => {
      const extension = data[0].substr(data[0].length - 4);
      if (extension == "docx") {
        this.router.navigate(['form-template'], {state: {category}}).then();
      } else if (extension == "xlsx") {
        this.router.navigate(['table-template'], {state: {category}}).then();
      } else {
        throw new Error("File extension not accepted.");
      }
    });

  }

}
