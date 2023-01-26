import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ComplexFormValueModel} from "../models/complex-form-value.model";
import {Observable, of} from "rxjs";
import {environment} from "../../../environments/environment";
import {catchError, delay, mapTo} from "rxjs/operators";

@Injectable()
export class SubscribeService {

  constructor(private http: HttpClient) {
  }

  saveUserInfo(formValue: ComplexFormValueModel): Observable<boolean> {
    return this.http.post(`${environment.apiUrl}/users`, formValue).pipe(
      mapTo(true),
      delay(1000),
      catchError(() => of(false).pipe(
        delay(1000)
      ))
    );
  }
}
