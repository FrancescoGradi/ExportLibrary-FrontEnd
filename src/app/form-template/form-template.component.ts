import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-template',
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.css']
})
export class FormTemplateComponent implements OnInit {

  public myFormGroup: FormGroup;
  public category: string;
  public fields: any;

  constructor(public router: Router) {
    this.category = this.router.getCurrentNavigation().extras.state.category;

    console.log("http.get...");

    this.fields = [{ 'type': "textBox", "label": "firstname", "value": null},
      { 'type': "textBox", "label": "lastname", "value": null},
      { 'type': "date", "label": "dateofBirth", "value": null},
      { 'type': "textBox", "label": "address", "value": null}];

    let group={}
    this.fields.forEach(input_template=>{
      group[input_template.label] = new FormControl('');
    })
    this.myFormGroup = new FormGroup(group);

  }

  ngOnInit(): void {
  }

  backHome(): void {
    this.router.navigate(['category-home']);
  }

  exportToBackend(): void {
    console.log("http.post...");
    console.log(this.fields.firstname)
    console.log(this.fields);
    console.log(this.myFormGroup);
  }

}
