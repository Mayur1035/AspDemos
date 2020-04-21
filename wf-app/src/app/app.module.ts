import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StatusTableComponent } from './components/status-table/status-table.component';
import { HeaderComponent } from './components/header/header.component';
import { StatusTableDialogComponent } from './components/status-table-dialog/status-table-dialog.component';
import { WorkSummaryService } from './service/work-summary.service';
import { StatusTableHelperService } from './service/status-table-helper.service';

@NgModule({
  declarations: [
    AppComponent,
    StatusTableComponent,
    HeaderComponent,
    StatusTableDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatDividerModule,
    MatListModule
  ],
  providers: [WorkSummaryService, StatusTableHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
