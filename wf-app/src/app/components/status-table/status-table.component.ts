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

  /** Display Columns List */
  displayedColumns: string[] ;

  /** Grid Data */
  data: any[];

  workItemRequest = new WorkItemRequest();

  /** ProcessControl Dropdown */
  processList : any[];
  processIdVal : string="";

  /** ActivityControl Dropdown */
  activityList : any[];
  activityIdVal : string="";

  /** Status Dropdown */
  allStatus: any[];


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(private changeDetectorRefs: ChangeDetectorRef, 
    private workSummarySvc : WorkSummaryService, 
    private statusHelperSvc : StatusTableHelperService) {}

  ngOnInit() {
    this.populateProcessList();
  }

  populateProcessList() {
    this.workSummarySvc.getProcessList().subscribe(
      (result: any) => {
        console.log("populateProcessList result ",result);
        this.processList =  this.statusHelperSvc.populateProcessList(result);
        console.log("Process List: " , this.processList);
      },
      err => {
        console.log("Issue Occurred while populateProcessList ", err);
      }
    );
  }

  openDialog(element : any): void {
    console.log("openDialog for Editing ",element);
    element.canEdit= true;
    
    if(element.Status == "Select"  || element.Status != ""){
    this.workItemRequest = new WorkItemRequest();
    this.workItemRequest.processid= this.processIdVal;
    this.workItemRequest.workitemId=element.WorkItemID;
      if(element.Status == "Select"){
        this.workItemRequest.isforhold = false;
      }else{
        this.workItemRequest.isforhold = true;
      }
      this.workSummarySvc.startWorkItem(this.workItemRequest).subscribe(
        (result: any) => {
          console.log("startWorkItem result ",result);
        },
        err => {
          console.log("Issue Occurred while startWorkItem ", err);
        }
      );
    }

  }

  onStatusChange(element : any): void {
    console.log('Status changed...', element.Status);
    element.canEdit= false;
    let statusId = this.statusHelperSvc.getStatusId(element.Status , this.allStatus);
    console.log('onStatusChange statusId ',statusId);

    this.workItemRequest = new WorkItemRequest();
    this.workItemRequest.statusId = statusId;
    this.workSummarySvc.updateWorkItemStatus(this.workItemRequest).subscribe(
      (result: any) => {
        console.log("updateWorkItemStatus result ",result);
      },
      err => {
        console.log("Issue Occurred while updateWorkItemStatus ", err);
      }
    );

  }

  createNewElement(): void{
    console.log('Creating new work item...')

    //this.processIdVal = "test";
    //this.activityIdVal= "test";

    this.workItemRequest = new WorkItemRequest();
    this.workItemRequest.processid= this.processIdVal;
    this.workItemRequest.activityId= this.activityIdVal;

    if( this.workItemRequest.processid && this.workItemRequest.activityId){
      this.workSummarySvc.createBlankWorkItem(this.workItemRequest).subscribe(
        (blankResult: any) =>{
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

  onProcessChange():void{
    console.log('onProcessChange... processIdVal', this.processIdVal);
    
    if( this.processIdVal){
      this.workSummarySvc.getActivityList(this.processIdVal).subscribe(
        (result: any) => {
          console.log("populateActivityList result ",result);
          this.activityList =  this.statusHelperSvc.populateActivityList(result);
          console.log("Activity List: " , this.activityList);
        },
        err => {
          console.log("Issue Occurred while populateActivityList ", err);
        }
      );
    }
  }

  onActivityChange():void{
    console.log('onActivityChange... activityIdVal', this.activityIdVal);
    console.log('onActivityChange... processIdVal', this.processIdVal);

    //this.processIdVal = "test";
    //this.activityIdVal= "test";

    this.workItemRequest = new WorkItemRequest();
    this.workItemRequest.processid= this.processIdVal;
    this.workItemRequest.activityId= this.activityIdVal;

    if( this.workItemRequest.processid && this.workItemRequest.activityId){
      this.generateGrid(this.workItemRequest);
    }
  }

  generateGrid(request: WorkItemRequest) {
    this.workSummarySvc.getAssignedTimeTrackerWorkItems(request).subscribe(
      (result: any) => {
        console.log("generateGrid result ",result);
        this.priorityVal="call successful !"

        //this.displayedColumns = this.statusHelperSvc.populateDisplayedColumns(result[0]);
        this.displayedColumns = this.statusHelperSvc.populateDisplayedColumns(result);
        console.log("Displayed Columns: " , this.displayedColumns);

        
        //this.allStatus = this.statusHelperSvc.populateAllStatus(result[2]);
        this.allStatus = this.statusHelperSvc.populateAllStatus(result);
        console.log("allStatus : " , this.allStatus);

        //this.data = this.statusHelperSvc.populateData(result[1], this.allStatus);
        this.data = this.statusHelperSvc.populateData(result, this.allStatus);
        console.log("data : " ,this.data);

      },
      err => {
        console.log("Issue Occurred while getAssignedTimeTrackerWorkItems ", err);
        this.priorityVal="Issue Occurred !"
      }
    );
  }


}

