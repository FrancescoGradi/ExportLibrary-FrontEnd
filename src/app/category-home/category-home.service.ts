import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// This is ok if we estabilish that there are only this forms, but it's not scalable at all.
export interface Form {
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  address: string;
}

@Injectable()
export class CategoryHome {
  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get('http://localhost:8080/ExportLibrary-BackEnd-1.0-SNAPSHOT/exportendpoint/categories');
  }

}
