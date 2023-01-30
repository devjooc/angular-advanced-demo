import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Candidate} from "../models/candidate.model";
import {delay, map, switchMap, take, tap} from "rxjs/operators";
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

  /**
   * BehaviourSubject are private with a getter to protect the function 'next'
   */
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
    // if we access a candidate directly (without passing by candidates list) => get candidates from server
    if (!this.lastCandidatesLoad) {
      this.getCandidatesFromServer();
    }
    return this.candidates$.pipe(
      map(candidates => candidates.filter(candidate => candidate.id === id)[0])
    );
  }

  /**
   * pessimist deletion request (wait for request to succeeds) => then update data through BehaviorSubject
   * => all subscribed components to this subject are updated accordingly
   * @param id
   */
  refuseCandidate(id: number): void {
    this.setLoadingStatus(true);
    // first send request
    this.http.delete(`${environment.apiUrl}/candidates/${id}`).pipe(
      delay(2000),
      // switch observable to our behaviour subject (you can use other operators as http request emit only once)
      // mergeMap or concatMap or exhauseMap is fine
      switchMap(() => this.candidates$),
      take(1), // to avoid having infinite loop => only execute once
      map(candidates => candidates.filter(candidate => candidate.id !== id)), // remove candidate
      tap(candidates => { // dispatch data to BehaviourSubject
        this._candidates$.next(candidates);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  /**
   * optimist request (we update data in our application => then send request to server)
   * @param id
   */
  hireCandidate(id: number): void {
    // start to update data in behaviourSubject
    this.candidates$.pipe(
      take(1),
      map(candidates => candidates
        .map(candidate => candidate.id === id ?
          {...candidate, company: 'Snapface Ltd'} :
          candidate
        )
      ),
      // dispatch changes
      tap(updatedCandidates => this._candidates$.next(updatedCandidates)),
      delay(2000),
      // switch observable to http to send request (you can use other operators than switchMap)
      switchMap(updatedCandidates =>
        this.http.patch(`${environment.apiUrl}/candidates/${id}`,
          updatedCandidates.find(candidate => candidate.id === id))
      )
    ).subscribe(); // we subscribe to do all process in here
  }

}
