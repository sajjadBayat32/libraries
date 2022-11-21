import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PageLoadingComponent} from "../components/page-loading/page-loading.component";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzMessageModule} from "ng-zorro-antd/message";
import {ImageSourceDirective} from "@libraries/shared/directives/image-source.directive";
import {PageComingSoonComponent} from "@libraries/shared/components/page-coming-soon/page-coming-soon.component";
import {PageNotFoundComponent} from "@libraries/shared/components/page-not-found/page-not-found.component";
import {OutsideClickDirective} from "@libraries/shared/directives/outside-click.directive";

const MODULES = [
  FormsModule,
  ReactiveFormsModule,
  NzSpinModule,
  NzMessageModule
]

const COMPONENTS = [
  PageComingSoonComponent,
  PageLoadingComponent,
  PageNotFoundComponent
]

const Directives = [
  ImageSourceDirective,
  OutsideClickDirective
]

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...Directives
  ],
  imports: [
    CommonModule,
    ...MODULES,
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
    ...Directives
  ]
})
export class SharedModule {
}
