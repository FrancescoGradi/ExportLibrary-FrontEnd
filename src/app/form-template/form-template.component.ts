import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-template',
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.css']
})

export class FormTemplateComponent implements OnInit {

  public formGroup: FormGroup;
  public category: string;
  public fields: any;

  constructor(public router: Router, private formBuilder: FormBuilder) {
    this.category = this.router.getCurrentNavigation().extras.state.category;

    console.log("http.get...");

    this.fields = [{ 'type': "textBox", "label": "firstname", "value": null},
      { 'type': "textBox", "label": "lastname", "value": null},
      { 'type': "date", "label": "dateofBirth", "value": null},
      { 'type': "textBox", "label": "address", "value": null}];

    let group={}
    this.fields.forEach(field=>{
      group[field.label] = new FormControl(null);
    });
    group['list'] = this.formBuilder.array([])
    this.formGroup = new FormGroup(group);
  }

  ngOnInit(): void {}

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
    this.fields.push({'type': 'list', 'label': 'list', 'value': this.formGroup.value['list']});
    console.log(this.fields);
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
