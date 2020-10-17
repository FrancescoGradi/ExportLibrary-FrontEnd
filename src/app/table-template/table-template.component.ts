import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {JsonObject} from '@angular/compiler-cli/ngcc/src/packages/entry_point';

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
  public doc: any;

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

    let result = {metadata: this.selectedTemplate, data: this.tableForm.value.rows};

    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, UPDATE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With'
      })
    };

    this.http.post<JsonObject>('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/form/'.concat(this.category).concat('/export'),
      result, httpOptions).toPromise()
      .then(data => {
        this.doc = data.response;
        console.log(this.doc);
        this.downloadFile();
      });

  }

  public downloadFile() {
    const blob = this.b64toBlob(this.doc, 'application/octet-stream');
    const url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = this.selectedTemplate;
    anchor.href = url;
    anchor.click();
  }

  public b64toBlob(b64Data, contentType, sliceSize=512) {

    const byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  public backHome(): void {
    this.router.navigate(['category-home']).then();
  }

}
