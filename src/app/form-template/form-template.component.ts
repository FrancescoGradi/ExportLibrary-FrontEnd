import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import {HttpClient, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import {JsonObject} from '@angular/compiler-cli/ngcc/src/packages/entry_point';
import {Observable} from "rxjs";

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

  constructor(public router: Router, private formBuilder: FormBuilder, public http: HttpClient) {
    this.category = this.router.getCurrentNavigation().extras.state.category;
    this.formGroup = new FormGroup({});
    this.doc = new Uint8Array();

    console.log('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/form/'.concat(this.category));
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

  getControls() {
    return (this.formGroup.controls['list'] as FormArray).controls;
  }

  backHome(): void {
    this.router.navigate(['category-home']);
  }

  public getDoc(): Observable<Blob> {
    let uri = 'file:///Users/federico/IdeaProjects/ExportLibrary-BackEnd/';
    return this.http.get(uri, { responseType: 'blob' });
  }

  public downloadDoc(): void {
    this.getDoc()
      .subscribe(x => {
        let newBlob = new Blob([x], { type: 'application/ms-word' });

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }

        const data = window.URL.createObjectURL(newBlob);

        let link = document.createElement('a');
        link.href = data;
        link.download = this.selectedTemplate;
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        // tslint:disable-next-line:only-arrow-functions typedef
        setTimeout(function() {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      });
  }

  exportToBackend(): void {
    this.fields.forEach(field=>{
      field.value = this.formGroup.value[field.label];
      if (field.label == 'image') {
        field.value = this.imgURL;
      }
    });

    let result = {metadata: this.selectedTemplate, data: this.fields};

    console.log(result);
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, UPDATE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With'
      })
    };
    this.http.post<any>('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/form/'
      .concat(this.category).concat('/export'), result,
      httpOptions).toPromise().then(data => {
        this.doc = data.get('response');
    });
    console.log('http.post...');
    console.log(this.doc);
    console.log(typeof(this.doc));

  }

  public imagePath;
  public imgURL: any;
  public message: string;

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
    }
  }
}
