import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JsonObject } from '@angular/compiler-cli/ngcc/src/packages/entry_point';
import { DownloaderService } from '../downloader/downloader.service';

// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx' ;
import {stringify} from 'querystring';

@Component({
  selector: 'app-form-template',
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.css']
})

export class FormTemplateComponent implements OnInit {

  public formGroup: FormGroup;
  public category: string;
  public selectedTemplate: string;
  public templates: any;
  public fields: any;
  public doc: any;
  public toBeZipped: boolean;
  public imagePath;
  public imgURL: any;
  public message: string;

  constructor(public router: Router, private formBuilder: FormBuilder, public http: HttpClient,
              public downloaderService: DownloaderService) {
    this.category = this.router.getCurrentNavigation().extras.state.category;
    this.formGroup = new FormGroup({});
    this.doc = new Uint8Array();
    this.toBeZipped = false;

    this.http.get('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/form/'.concat(this.category)).toPromise().then(data => {
      this.fields = data;

      let group={}
      this.fields.forEach(field=>{
        if (field.label == 'list')
          group[field.label] = this.formBuilder.array([])
        else
          group[field.label] = new FormControl();
      });
      this.formGroup = new FormGroup(group);

    });

    this.http.get('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/templates/'.concat(this.category)).toPromise().then(data => {
      this.templates = data;
    })

  }

  ngOnInit(): void { }

  public addItemFormGroup() {
    const items = this.formGroup.get('list') as FormArray
    items.push(new FormGroup({'item': new FormControl('')}));
  }

  public removeOrClearList(i: number) {
    const items = this.formGroup.get('list') as FormArray
    if (items.length > 0) {
      items.removeAt(i);
    } else {
      items.reset();
    }
  }

  public getControls() {
    return (this.formGroup.controls['list'] as FormArray).controls;
  }

  public backHome(): void {
    this.router.navigate(['category-home']).then();
  }

  public exportToBackend(): void {
    this.fields.forEach(field=>{
      field.value = this.formGroup.value[field.label];
      if (field.label == 'image') {
        field.value = this.imgURL;
      }
    });

    let result = {metadata: this.selectedTemplate, data: this.fields, zip: this.toBeZipped};

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

  preview(files): void {
    if (files.length === 0)
      return;

    let msgType = files[0].type;
    if (msgType.match(/image\/*/) == null) {
      this.message = "Only images are accepted.";
      return;
    }

    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  zipFile(): void {
    this.toBeZipped = !this.toBeZipped;
  }

}
