import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SubscribeFormRoutingModule} from './subscribe-form-routing.module';
import {ComplexFormComponent} from './components/complex-form/complex-form.component';
import {SharedModule} from "../shared/shared.module";
import {SubscribeService} from "./services/subscribe.service";


@NgModule({
  declarations: [
    ComplexFormComponent
  ],
  imports: [
    CommonModule,
    SubscribeFormRoutingModule,
    SharedModule
  ],
  exports: [
    ComplexFormComponent
  ],
  providers: [
    SubscribeService
  ]
})
export class SubscribeFormModule {
}
