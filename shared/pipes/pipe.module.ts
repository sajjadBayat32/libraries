import {NgModule} from '@angular/core';
import {JalaliPipe} from "./jalali.pipe";
import {TimePipe} from "./time.pipe";
import {FilterPipe} from "./filter.pipe";
import {TomanPipe} from "./toman.pipe";

const PIPES = [
  JalaliPipe,
  TimePipe,
  FilterPipe,
  TomanPipe
]

@NgModule({
  declarations: [
    ...PIPES
  ],
  exports: [
    ...PIPES
  ]
})
export class PipeModule {
}
