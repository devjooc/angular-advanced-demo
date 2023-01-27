import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {CandidatesService} from "../../services/candidates.service";
import {Candidate} from "../../models/candidate.model";

@Component({
  selector: 'jooc-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // OnPush change detection
})
export class CandidateListComponent implements OnInit {

  loading$!: Observable<boolean>;
  candidates$!: Observable<Candidate[]>;

  constructor(private candidatesService: CandidatesService) {
  }

  ngOnInit(): void {
    this.initObservables();
    this.candidatesService.getCandidatesFromServer();
  }

  private initObservables() {
    this.loading$ = this.candidatesService.loading$;
    this.candidates$ = this.candidatesService.candidates$;
  }

}
