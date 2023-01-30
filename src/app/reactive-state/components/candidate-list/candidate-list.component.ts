import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {CandidatesService} from "../../services/candidates.service";
import {Candidate} from "../../models/candidate.model";
import {FormBuilder, FormControl} from "@angular/forms";
import {CandidateSearchTypeEnum} from "../../enums/candidate-search-type.enum";
import {map, startWith} from "rxjs/operators";
import {combineLatest} from "rxjs";

@Component({
  selector: 'jooc-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // OnPush change detection
})
export class CandidateListComponent implements OnInit {

  loading$!: Observable<boolean>;
  candidates$!: Observable<Candidate[]>;

  // search form controls
  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: ({ value: CandidateSearchTypeEnum, label: string; })[];

  constructor(private candidatesService: CandidatesService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.initObservables();
    this.candidatesService.getCandidatesFromServer();
  }

  private initObservables() {
    this.loading$ = this.candidatesService.loading$;
    // normal implementation
    // this.candidates$ = this.candidatesService.candidates$;

    // init observables => candidates with search function
    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map(value => value.toLowerCase())
    );
    const searchType$: Observable<CandidateSearchTypeEnum> = this.searchTypeCtrl.valueChanges.pipe(
      startWith(this.searchTypeCtrl.value)
    );
    // combineLatest takes an array of observables, it waits for each observable to emit at least once
    // then => it emits the last values of all
    // example of result => ['', 'lastName', [ array of all candidates ] ]
    this.candidates$ = combineLatest([
        search$,
        searchType$,
        this.candidatesService.candidates$
      ]
    ).pipe(
      map(([search, searchType, candidates]) => candidates.filter(candidate => candidate[searchType]
        .toLowerCase()
        .includes(search as string))
      )
    );
  }

  private initSearchForm() {
    this.searchCtrl = this.formBuilder.control('');
    this.searchTypeCtrl = this.formBuilder.control(CandidateSearchTypeEnum.LASTNAME);
    this.searchTypeOptions = [
      {value: CandidateSearchTypeEnum.LASTNAME, label: 'Last Name'},
      {value: CandidateSearchTypeEnum.FIRSTNAME, label: 'First name'},
      {value: CandidateSearchTypeEnum.COMPANY, label: 'Company'}
    ];
  }

}
