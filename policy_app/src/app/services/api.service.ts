/*api.service.ts*/

import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://localhost:7225/api/Users';

  constructor( private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData).pipe(catchError(this.handleError));
  }
  login(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, userData);
  }
  checkUsername(userName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/check-username/${userName}`);
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {

      console.error('A network error occurred:', error.error);
    } else {
      
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
