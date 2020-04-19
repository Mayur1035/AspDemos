import {Component, OnInit, ViewChild} from '@angular/core';
import { WorkSummaryService } from 'src/app/service/work-summary.service';
import { WorkItemRequest } from 'src/app/models/work-item-request';
import { StatusTableHelperService } from 'src/app/service/status-table-helper.service';

import * as $ from 'jquery' 

@Component({
  selector: 'app-status-table',
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.css']
})
export class StatusTableComponent implements OnInit {

 // $: any;

  priorityVal:string="----";

  /** Display Columns List */
  displayedColumns: string[] ;
  columnArray: any[];

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

  constructor(private workSummarySvc : WorkSummaryService, 
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
        console.log("updateWorkItemStatus GetStatusDetails result ",result);
        let validationMsg = this.statusHelperSvc.getValidationMsg(result, element, this.columnArray);
        if(validationMsg){
          let xmlString = '';
          this.workItemRequest.workitemId = element.WorkItemID;
          this.workItemRequest.xmlString = xmlString;
          this.saveWorkItems(this.workItemRequest);
        }else{
          console.log("validation failed for validationMsg ", validationMsg);
        }
      },
      err => {
        console.log("Issue Occurred while updateWorkItemStatus GetStatusDetails ", err);
      }
    );
  }


  saveWorkItems(workItemRequest: WorkItemRequest): void {
    console.log("saveWorkItems workItemRequest ", workItemRequest);
    this.workSummarySvc.saveWorkItems(this.workItemRequest).subscribe(
      (result: any) =>{
        console.log("saveWorkItems result ", result);
        this.generateGrid(this.workItemRequest);
      },
      err => {
        console.log("Issue Occurred while saveWorkItems ", err);
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
    }else{
      console.log("processid  OR  activityId value is not present !");
    }
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
    }else{
      console.log("processid  OR  activityId value is not present !");
    }
  }

  generateGrid(request: WorkItemRequest) {
    this.workSummarySvc.getAssignedTimeTrackerWorkItems(request).subscribe(
      (result: any) => {
        console.log("generateGrid result ",result);
        this.priorityVal="call successful !"

        this.columnArray = result.d[0];
        //this.columnArray = result[0][0];
        this.displayedColumns = this.statusHelperSvc.populateDisplayedColumns(this.columnArray);
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



  /** Placeholder to add Record Activities Related scripts */
  openPopUp(): void {
    console.log("Control inside Record Activities OpenPopUp.....");
    
   $('#ngRecordActivity').click(function(){ alert('Wass up!'); });

  }


}

