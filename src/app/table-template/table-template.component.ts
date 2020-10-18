import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {JsonObject} from '@angular/compiler-cli/ngcc/src/packages/entry_point';
import { DownloaderService } from '../downloader/downloader.service';

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
  public toBeZipped: boolean;

  constructor(public router: Router, private formBuilder: FormBuilder, public http: HttpClient,
              public downloaderService: DownloaderService) {
    this.category = this.router.getCurrentNavigation().extras.state.category;
    this.formGroup = new FormGroup({});
    this.toBeZipped = false;

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

    let result = {metadata: this.selectedTemplate, data: this.tableForm.value.rows, zip: this.toBeZipped};

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
        this.downloaderService.downloadFile(this.doc, this.selectedTemplate, this.toBeZipped);
      });

  }

  public backHome(): void {
    this.router.navigate(['category-home']).then();
  }

  zipFile(): void {
    this.toBeZipped = !this.toBeZipped;
  }

}
