import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {CategoryHome, Form} from './category-home.service';
import {JsonArray} from '@angular/compiler-cli/ngcc/src/packages/entry_point';

@Component({
  selector: 'app-category-home',
  templateUrl: './category-home.component.html',
  styleUrls: ['./category-home.component.css'],
  providers: [CategoryHome]
})
// Following https://angular.io/guide/http
export class CategoryHomeComponent implements OnInit {

  public categories: any;

  constructor(public router: Router, private http: HttpClient, private categoryHome: CategoryHome) { }

  getCategories(): void {
    this.categoryHome.getCategories()
      .subscribe((data: Response) => this.categories = { ...data.body });
    console.log(JSON.parse(this.categories));
  }

  ngOnInit(): void {
    this.getCategories();
  }

  goToCatPage(category): void {

    console.log(category);
    this.router.navigate(['form-template'], {state: {category}}).then();
  }

}
