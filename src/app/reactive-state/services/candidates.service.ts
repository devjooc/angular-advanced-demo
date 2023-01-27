import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Candidate} from "../models/candidate.model";
import {delay, map, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";

@Injectable()
export class CandidatesService {

  /**
   * here we implement a pattern known as 'subject as a service'
   * we use 'BehaviourSubject'
   * related components that use this pattern should be changed to 'OnPush' detection strategy
   */


  constructor(private http: HttpClient) {
  }

  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _candidates$ = new BehaviorSubject<Candidate[]>([]);
  get candidates$(): Observable<Candidate[]> {
    return this._candidates$.asObservable(); // return as observable
  }

  // counter to not send request to server unless 5 minutes are passed
  private lastCandidatesLoad = 0;

  private setLoadingStatus(loading: boolean): void {
    this._loading$.next(loading);
  }

  /**
   * here we don't return the observable => instead we subscribe and dispatch data through behaviourSubject
   */
  getCandidatesFromServer() {
    if (Date.now() - this.lastCandidatesLoad <= 300000) {
      return;
    }
    this.setLoadingStatus(true);
    this.http.get<Candidate[]>(`${environment.apiUrl}/candidates`).pipe(
      delay(1000),
      tap(candidates => {
        this._candidates$.next(candidates);
        this.setLoadingStatus(false);
        this.lastCandidatesLoad = Date.now();
      })
    ).subscribe();
  }

  getCandidateById(id: number): Observable<Candidate> {
    // if we access a candidate directly (without passing by candidates list)
    // get candidates from server
    if (!this.lastCandidatesLoad) {
      this.getCandidatesFromServer();
    }
    return this.candidates$.pipe(
      map(candidates => candidates.filter(candidate => candidate.id === id)[0])
    );
  }

}
