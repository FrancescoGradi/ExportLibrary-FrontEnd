import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-table-template',
  templateUrl: './table-template.component.html',
  styleUrls: ['./table-template.component.css']
})
export class TableTemplateComponent implements OnInit {

  public formGroup: FormGroup;
  public tableForm: any;
  public category: string;
  public selectedTemplate: string;
  public templates: any;
  public fields: any;

  constructor(public router: Router, private formBuilder: FormBuilder, public http: HttpClient) {
    this.category = this.router.getCurrentNavigation().extras.state.category;
    this.formGroup = new FormGroup({});

    this.http.get('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/form/'.concat(this.category)).toPromise().then(data => {

      this.fields = data;

      this.tableForm = this.formBuilder.group({
        rows: this.formBuilder.array([this.createRowFormGroup()])
      });
    });

    this.http.get('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/templates/'.concat(this.category)).toPromise().then(data => {
      this.templates = data;
    })
  }

  ngOnInit(): void {
  }

  private createRowFormGroup(): FormGroup {
    let group={}
    this.fields.forEach(field=>{
      group[field.label] = new FormControl();
    });
    return new FormGroup(group);
  }

  public addRowFormGroup() {
    const rows = this.tableForm.get('rows') as FormArray
    rows.push(this.createRowFormGroup());
  }

  public removeRow(i: number) {
    const rows = this.tableForm.get('rows') as FormArray
    if (rows.length > 0) {
      rows.removeAt(i);
    } else {
      rows.reset();
    }
  }

  public getControls() {
    return (this.tableForm.controls['rows'] as FormArray).controls;
  }

  public exportToBackend(): void {
    console.log(this.tableForm);
  }

  public backHome(): void {
    this.router.navigate(['category-home']).then();
  }

}
