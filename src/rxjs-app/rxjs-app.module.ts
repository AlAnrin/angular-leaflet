import { NgModule } from '@angular/core';
import { RxjsAppComponent } from './rxjs-app/rxjs-app.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [RxjsAppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  bootstrap: [RxjsAppComponent]
})
export class RxjsAppModule { }
