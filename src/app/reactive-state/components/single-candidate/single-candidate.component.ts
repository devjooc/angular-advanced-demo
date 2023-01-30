import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CandidatesService} from "../../services/candidates.service";
import {Observable} from "rxjs";
import {Candidate} from "../../models/candidate.model";
import {switchMap, take, tap} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'jooc-single-candidate',
  templateUrl: './single-candidate.component.html',
  styleUrls: ['./single-candidate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleCandidateComponent implements OnInit {

  loading$!: Observable<boolean>;
  candidate$!: Observable<Candidate>;

  constructor(private candidatesService: CandidatesService,
              private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.initObservables();
    this.candidate$ = this.route.params.pipe(
      switchMap(params => this.candidatesService.getCandidateById(+params['id']))
    );
  }

  private initObservables() {
    this.loading$ = this.candidatesService.loading$;
  }

  /**
   * on click hire
   */
  onHire() {
    // we need the id => so we get it from the observable
    this.candidate$.pipe(
      take(1), // execute only once
      tap(candidate => {
        this.candidatesService.hireCandidate(candidate.id); // update & redirect
        this.onGoBack();
      })
    ).subscribe();
  }

  /**
   * on click refuse
   */
  onRefuse() {
    // we need the id => so we get it from the observable
    this.candidate$.pipe(
      take(1), // execute only once
      tap(candidate => {
        this.candidatesService.refuseCandidate(candidate.id); // delete & redirect
        this.onGoBack();
      })
    ).subscribe();
  }

  onGoBack() {
    this.router.navigateByUrl('/reactive-state/candidates');
  }
}
