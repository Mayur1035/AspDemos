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


  priorityVal:string= '';

  /** Display Columns List */
  displayedColumns: string[] ;
  columnArray: any[];

  /** Grid Data */
  data: any[];

  workItemRequest = null;

  /** ProcessControl Dropdown */
  processList : any[];
  processIdVal : string= '';

  /** ActivityControl Dropdown */
  activityList : any[];
  activityIdVal : string= '';

  /** Status Dropdown */
  allStatus: any[];
  showGrid: boolean = false;
  showErrList: boolean = false;
  showSuccessMsg: boolean = false;
  validationMsgs: string[] = null;

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
    this.showErrList = false;
    this.showSuccessMsg = false;
    
    //if(element.Status == "Select"  || element.Status != ""){
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
          this.generateGrid();
        },
        err => {
          console.log("Issue Occurred while startWorkItem ", err);
        }
      );
    //}

  }

  onStatusChange(element : any): void {
    console.log('Status changed...', element.Status);
    console.log('Status changed...from ', element.tempStatus);
    this.showErrList = false;
    
    let statusId = this.statusHelperSvc.getStatusId(element.Status , this.allStatus);
    console.log('onStatusChange statusId ',statusId);

    this.workItemRequest = new WorkItemRequest();
    this.workItemRequest.statusId = statusId;

    this.workSummarySvc.updateWorkItemStatus(this.workItemRequest).subscribe(
      (result: any) => {
        console.log("updateWorkItemStatus GetStatusDetails result ",result);
        let resultType = result.d;
        this.validationMsgs = this.statusHelperSvc.getValidationMsg(result, element, this.columnArray);
        if(!(this.validationMsgs.length > 0)){
          this.workItemRequest.workitemId = element.WorkItemID;
          let xmlString : string = this.statusHelperSvc.generateXMLString(element, this.workItemRequest, this.columnArray);
          this.workItemRequest.xmlString = xmlString;
          this.saveWorkItems(this.workItemRequest, resultType);
          //element.canEdit= this.saveWorkItems(this.workItemRequest);
        }else{
          console.log("validation failed for validationMsg ", this.validationMsgs);
          this.showErrList = true;
          element.Status = element.tempStatus;
        }
      },
      err => {
        console.log("Issue Occurred while updateWorkItemStatus GetStatusDetails ", err);
      }
    );
  }


  saveWorkItems(workItemRequest: WorkItemRequest, resultType: any): boolean {
    let val : boolean = true;
    console.log("saveWorkItems workItemRequest ", workItemRequest);
    this.workSummarySvc.saveWorkItems(this.workItemRequest).subscribe(
      (result: any) =>{
        console.log("saveWorkItems result ", result);
        this.generateGrid();
        val = false;
        if(resultType && resultType.IsFinalStatus){
            console.log("saveWorkItems resultType", resultType);
            this.showSuccessMsg = true;
          }
      },
      err => {
        console.log("Issue Occurred while saveWorkItems ", err);
      }
    );
    return val;
  }

  createNewElement(): void{
    console.log('Creating new work item... activityIdVal', this.activityIdVal);
    console.log('Creating new work item... processIdVal', this.processIdVal);

    //this.processIdVal = "test";
    //this.activityIdVal= "test";

    this.workItemRequest = new WorkItemRequest();
    this.workItemRequest.processid= this.processIdVal;
    this.workItemRequest.activityId= this.activityIdVal;

    this.workSummarySvc.createBlankWorkItem(this.workItemRequest).subscribe(
        (blankResult: any) =>{
          console.log("createBlankWorkItem result ", blankResult);
          this.generateGrid();
        },
        err => {
          console.log("Issue Occurred while createBlankWorkItem ", err);
        }
      );
  }

  onProcessChange():void{
    console.log('onProcessChange... processIdVal', this.processIdVal);
    this.resetAll();
    
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

      this.workSummarySvc.getPriorityVal(this.processIdVal).subscribe(
        (result: any) => {
          console.log("getPriorityVal result ",result);
          console.log("getPriorityVal priorityVal ",result.d[0]);
          this.priorityVal =  result.d[0];
        },
        err => {
          console.log("Issue Occurred while getPriorityVal ", err);
        }
      );

    }
  }
  resetAll() {
    console.log("RESET Values......")
    this.priorityVal= '';

    /** Display Columns List */
    this.displayedColumns= [];
    this.columnArray= [];

    /** Grid Data */
    this.data= [];

    this.workItemRequest = null;

    /** ActivityControl Dropdown */
    this.activityList= [];
    this.activityIdVal= '';

    /** Status Dropdown */
    this.allStatus= [];

    this.showGrid = false;
    this.showErrList = false;
    this.showSuccessMsg = false;
  }

  onActivityChange():void{
    console.log('onActivityChange... activityIdVal', this.activityIdVal);
    console.log('onActivityChange... processIdVal', this.processIdVal);
    this.generateGrid();
  }

  generateGrid() {
    console.log('generateGrid... activityIdVal', this.activityIdVal);
    console.log('generateGrid... processIdVal', this.processIdVal);

    this.showErrList = false;

    //this.processIdVal = "test";
    //this.activityIdVal= "test";

    this.workItemRequest = new WorkItemRequest();
    this.workItemRequest.processid= this.processIdVal;
    this.workItemRequest.activityId= this.activityIdVal;

    if( this.workItemRequest.processid && this.workItemRequest.activityId){
    this.workSummarySvc.getAssignedTimeTrackerWorkItems(this.workItemRequest).subscribe(
      (result: any) => {
        console.log("generateGrid result ",result);

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

        this.showGrid = true;

        }, err => {
         console.log("Issue Occurred while getAssignedTimeTrackerWorkItems ", err);
        }
      );
    }else{
      console.log("processid  OR  activityId value is not present !");
    }

  }



  /** Placeholder to add Record Activities Related scripts */
  openPopUp(): void {
    console.log("Control inside Record Activities OpenPopUp.....");

  }


}

