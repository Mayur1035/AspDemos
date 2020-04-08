import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { StatusTableDialogComponent } from '../status-table-dialog/status-table-dialog.component';
import { ProcessElement } from 'src/app/models/process-element';

@Component({
  selector: 'app-status-table',
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.css']
})
export class StatusTableComponent implements OnInit {

  selected = 'option2';
  editable:boolean=false;
  displayedColumns: string[] = ['start-button','status','processKeyNumber', 'alphaNumeric10', 'alphaNumeric33', 'alphaNumeric57', 'volumeCount', 'comments'];
  dataSource = new MatTableDataSource<ProcessElement>(ELEMENT_DATA);


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor() {}
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog(element : ProcessElement): void {
    console.log(element.status);
    element.editable= true;
  }

  onStatusChange(element : ProcessElement): void {
    console.log('Status changed...');
    console.log(element.status);
    element.editable= false;
  }
}



const ELEMENT_DATA: ProcessElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', status:'Completed', processKeyNumber:10,alphaNumeric10:'test',alphaNumeric33:'test',alphaNumeric57:'test', volumeCount: 2, comments:'test check', editable:false },
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', status:'Completed', processKeyNumber:10,alphaNumeric10:'test',alphaNumeric33:'test',alphaNumeric57:'test', volumeCount: 2, comments:'test check',editable:false },
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', status:'Completed', processKeyNumber:10,alphaNumeric10:'test',alphaNumeric33:'test',alphaNumeric57:'test', volumeCount: 2, comments:'test check',editable:false },
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', status:'WIP', processKeyNumber:10,alphaNumeric10:'test',alphaNumeric33:'test',alphaNumeric57:'test', volumeCount: 2, comments:'test check',editable:false },
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', status:'Completed', processKeyNumber:10,alphaNumeric10:'test',alphaNumeric33:'test',alphaNumeric57:'test', volumeCount: 2, comments:'test check',editable:false },
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', status:'Completed', processKeyNumber:10,alphaNumeric10:'test',alphaNumeric33:'test',alphaNumeric57:'test', volumeCount: 2, comments:'test check',editable:false },
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', status:'Completed', processKeyNumber:10,alphaNumeric10:'test',alphaNumeric33:'test',alphaNumeric57:'test', volumeCount: 2, comments:'test check',editable:false },
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', status:'Completed', processKeyNumber:10,alphaNumeric10:'test',alphaNumeric33:'test',alphaNumeric57:'test', volumeCount: 2, comments:'test check',editable:false },
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', status:'Completed', processKeyNumber:10,alphaNumeric10:'test',alphaNumeric33:'test',alphaNumeric57:'test', volumeCount: 2, comments:'test check',editable:false },
  
];
