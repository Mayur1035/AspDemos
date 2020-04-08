import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProcessElement } from 'src/app/models/process-element';
@Component({
  selector: 'app-status-table-dialog',
  templateUrl: './status-table-dialog.component.html',
  styleUrls: ['./status-table-dialog.component.css']
})
export class StatusTableDialogComponent implements OnInit {

  selected = 'option2';
  constructor(
    public dialogRef: MatDialogRef<StatusTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProcessElement) {
      console.log(data);
      this.selected = data.status;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
