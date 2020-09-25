import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-home',
  templateUrl: './category-home.component.html',
  styleUrls: ['./category-home.component.css']
})
export class CategoryHomeComponent implements OnInit {

  public categories: string[] = [];

  constructor(public router: Router) {

    console.log("http get categories...")

    this.categories = ["Curriculum", "Graphs", "Report", "Brochure"];

    console.log("this.http.post(this.url, jsonToExport).toPromise().then(data => {\n" +
      "      console.log(data);\n" +
      "    });");

  }

  ngOnInit(): void {
  }

  goToCatPage(category): void {

    console.log(category);
    this.router.navigate(['form-template'], {state: {category: category}}).then();
  }

}
