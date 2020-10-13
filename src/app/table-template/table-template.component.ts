import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-table-template',
  templateUrl: './table-template.component.html',
  styleUrls: ['./table-template.component.css']
})
export class TableTemplateComponent implements OnInit {

  public formGroup: FormGroup;
  public category: string;
  public selectedTemplate: string;
  public templates: any;
  public fields: any;

  constructor(public router: Router, private formBuilder: FormBuilder, public http: HttpClient) {
    this.category = this.router.getCurrentNavigation().extras.state.category;
    this.formGroup = new FormGroup({});
    console.log(this.category);

    this.http.get('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/form/'.concat(this.category)).toPromise().then(data => {
      this.fields = data;

      console.log(this.fields);

      let group={}
      this.fields.forEach(field=>{
        console.log(field.label);
        if (field.label == 'list')
          group[field.label] = this.formBuilder.array([])
        else
          group[field.label] = new FormControl();
      });
      this.formGroup = new FormGroup(group);

      console.log(this.formGroup);
    });

    this.http.get('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/templates/'.concat(this.category)).toPromise().then(data => {
      this.templates = data;
      console.log(this.templates);
    })
  }

  ngOnInit(): void {
  }

}
