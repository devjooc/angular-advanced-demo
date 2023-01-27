import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CandidatesService} from "../../services/candidates.service";
import {Observable} from "rxjs";
import {Candidate} from "../../models/candidate.model";
import {switchMap} from "rxjs/operators";
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

  onHire() {

  }

  onRefuse() {

  }

  onGoBack() {
    this.router.navigateByUrl('/reactive-state/candidates');
  }
}
