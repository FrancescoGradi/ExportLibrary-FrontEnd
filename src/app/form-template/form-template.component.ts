import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(public router: Router, private formBuilder: FormBuilder, public http: HttpClient) {
    this.category = this.router.getCurrentNavigation().extras.state.category;
    this.formGroup = new FormGroup({});

    console.log('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/form/'.concat(this.category));
    this.http.get('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/form/'.concat(this.category)).toPromise().then(data => {
      this.fields = data;

      console.log(this.fields);

      let group={}
      this.fields.forEach(field=>{
        console.log(field.label);
        group[field.label] = new FormControl();
      });
      group['list'] = this.formBuilder.array([])
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
      items.removeAt(i)
    } else {
      items.reset()
    }
  }

  getControls() {
    return (this.formGroup.controls['list'] as FormArray).controls;
  }

  backHome(): void {
    this.router.navigate(['category-home']);
  }

  exportToBackend(): void {
    this.fields.forEach(field=>{
      field.value = this.formGroup.value[field.label];
    });
    this.fields.push({type: 'list', label: 'list', value: this.formGroup.value['list']});
    console.log(this.fields);

    let result = {metadata: this.selectedTemplate, data: this.fields, image: this.imgURL};

    console.log(result);
    console.log("http.post...");

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
