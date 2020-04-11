import {Component, OnInit, ViewChild, Inject, ChangeDetectorRef} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { WorkSummaryService } from 'src/app/service/work-summary.service';
import { WorkItemRequest } from 'src/app/models/work-item-request';
import { StatusTableHelperService } from 'src/app/service/status-table-helper.service';

@Component({
  selector: 'app-status-table',
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.css']
})
export class StatusTableComponent implements OnInit {

  selected = 'option2';
  priorityVal:string="----";
  editable:boolean=false;
 
  displayedColumns: string[] ;

  data: any[];

  workItemRequest = new WorkItemRequest();

  /** ProcessControl Dropdown */
  process : Array<string> = [];

  /** Status Dropdown */
  allStatus: any[];


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(private changeDetectorRefs: ChangeDetectorRef, 
    private workSummarySvc : WorkSummaryService, 
    private statusHelperSvc : StatusTableHelperService) {}

  ngOnInit() {
  }

  openDialog(element : any): void {
    element.editable= true;
  }

  onStatusChange(element : any): void {
    console.log('Status changed...', element.Status);
    element.editable= false;
    let statusId = this.statusHelperSvc.getStatusId(element.Status , this.allStatus);
    console.log('onStatusChange statusId ',statusId);
  }

  createNewElement(): void{
    console.log('Creating new work item...')
    this.workItemRequest = new WorkItemRequest();
    this.workItemRequest.processid= 'd59f298b-2459-ea11-8193-f40343abc830';
    this.workItemRequest.activityId='8e87c1ff-c662-ea11-8194-f40343abc830';

    if( this.workItemRequest.processid && this.workItemRequest.activityId){
      this.workSummarySvc.createBlankWorkItem(this.workItemRequest).subscribe(
        blankResult =>{
          console.log("createBlankWorkItem result ", blankResult);
          this.generateGrid(this.workItemRequest);
        },
        err => {
          console.log("Issue Occurred while createBlankWorkItem ", err);
          this.priorityVal="Issue Occurred in createBlankWorkItem!"
        }
      );
    }
   /* 
    const newElement : ProcessElement=
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', status:'Completed', processKeyNumber:10,alphaNumeric10:'test',alphaNumeric33:'test',alphaNumeric57:'test', volumeCount: 2, comments:'test check', editable:false };
    this.data.push(newElement);
    console.log(this.data.length)
    this.changeDetectorRefs.detectChanges();*/
  }

  onActivityChange():void{
    console.log('onActivityChange...')
    this.workItemRequest = new WorkItemRequest();
    this.workItemRequest.processid= 'd59f298b-2459-ea11-8193-f40343abc830';
    this.workItemRequest.activityId='8e87c1ff-c662-ea11-8194-f40343abc830';

    if( this.workItemRequest.processid && this.workItemRequest.activityId){
      this.generateGrid(this.workItemRequest);
    }
  }

  generateGrid(request: WorkItemRequest) {
    this.workSummarySvc.getAssignedTimeTrackerWorkItems(request).subscribe(
      result => {
        console.log("generateGrid result ",result);
        this.priorityVal="call successful !"

        console.log("result[0][0] ",result[0][0]);
        console.log("result[0] ",result[0]);
        console.log("result[1][1] ",result[1][1]);
        console.log("result[1] ",result[1]);
        console.log("result[2][2] ",result[2][2]);
        console.log("result[2] ",result[2]);

        //this.displayedColumns = this.statusHelperSvc.populateDisplayedColumns(result[0][0]);
        this.displayedColumns = this.statusHelperSvc.populateDisplayedColumns(result[0]);
        console.log("Displayed Columns: " , this.displayedColumns);

        //this.data = this.statusHelperSvc.populateData(result[1][1]);
        this.data = this.statusHelperSvc.populateData(result[1]);
        console.log("data : " ,this.data);

        //this.allStatus = this.statusHelperSvc.populateAllStatus(result[2][2]);
        this.allStatus = this.statusHelperSvc.populateAllStatus(result[2]);
        console.log("allStatus : " , this.allStatus);

      },
      err => {
        console.log("Issue Occurred while getAssignedTimeTrackerWorkItems ", err);
        this.priorityVal="Issue Occurred !"
      }
    );
  }


}

