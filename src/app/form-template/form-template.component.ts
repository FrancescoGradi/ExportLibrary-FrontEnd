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
    group['list'] = this.formBuilder.array([this.createListFormGroup()])
    this.formGroup = new FormGroup(group);

    console.log(this.formGroup);
  }

  ngOnInit(): void {}

  private createListFormGroup(): FormGroup {
    return new FormGroup({
      'itemContent': new FormControl(''),
      'itemLabel': new FormControl('List element')
    })
  }

  public addItemFormGroup() {
    const items = this.formGroup.get('list') as FormArray
    items.push(this.createListFormGroup())
  }

  public removeOrClearList(i: number) {
    const items = this.formGroup.get('list') as FormArray
    if (items.length > 1) {
      items.removeAt(i)
    } else {
      items.reset()
    }
  }

  backHome(): void {
    this.router.navigate(['category-home']);
  }

  exportToBackend(): void {
    this.fields.forEach(field=>{
      field.value = this.formGroup.value[field.label];
    });
    console.log(this.formGroup);
    console.log(this.fields);
    console.log("http.post...");
  }

}
