import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ContextMenuModule } from 'ngx-contextmenu';
import {MatMenuModule} from '@angular/material/menu';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatMenuModule,
    ContextMenuModule.forRoot({
      autoFocus: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
