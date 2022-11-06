import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PageLoadingComponent} from "../components/page-loading/page-loading.component";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzMessageModule} from "ng-zorro-antd/message";

const MODULES = [
  FormsModule,
  ReactiveFormsModule,
  NzSpinModule,
  NzMessageModule
]

const COMPONENTS = [
  PageLoadingComponent
]

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    ...MODULES,
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS
  ]
})
export class SharedModule {
}
