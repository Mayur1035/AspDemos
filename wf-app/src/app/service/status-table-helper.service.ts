import { Injectable } from '@angular/core';
import { WorkSummaryService } from './work-summary.service';
import { WorkItemRequest } from '../models/work-item-request';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class StatusTableHelperService {
    
  constructor(private workSummarySvc : WorkSummaryService) { }

  populateDisplayedColumns(columnArray: any): string[] {
    let displayColumns = new Array<any>();
    if(columnArray){
      console.log("columnArray ",columnArray);
      for(let i =0 ; i < columnArray.length;i++){
        if(!columnArray[i].hidden){
          displayColumns.push(columnArray[i].name);
        }
      }
    }
    return displayColumns;
  }

  populateData(result : any, allStatus: any[]): any[] {
    let data = new Array<any>();
    let dataArray= JSON.parse(result.d[1]);
    //let dataArray= result[1];
    if(dataArray){
      console.log("dataArray ",dataArray);
      let tempVal : boolean = false;
      for(let i =0 ; i < dataArray.length;i++){
        if(dataArray[i].IsTimerRunning == "1"){
          tempVal = true;
        }else{
          tempVal = false;
        }
        dataArray[i].canEdit= tempVal;
        let statusId = dataArray[i].Status;
        dataArray[i].Status = this.getStatusName(allStatus, statusId);
        dataArray[i].tempStatus = dataArray[i].Status;
        data.push(dataArray[i]);
      }
    }
    return data;
  }

  populateAllStatus(result: any): any[] {
    let allStatus= new Array<any>();
    let statusArray= result.d[2];
    //let statusArray= result[2];
    if(statusArray.length > 0){
      console.log("statusArray ",statusArray);
      for(let i =0 ; i < statusArray.length;i++){
        allStatus.push(statusArray[i]);
      }
    }
    return allStatus;
  }

  getStatusId(Status: string, allStatus: any[]): string {
    let statusId = '';
    for(let i = 0 ; i< allStatus.length;i++){
      if(Status == allStatus[i].StatusName){
        statusId = allStatus[i].StatusID;
        break;
      }
    }
    return statusId;
  }

  getStatusName(allStatus: any[], StatusId: string): string {
    let statusName = '';
    for(let i = 0 ; i< allStatus.length;i++){
      if(StatusId == allStatus[i].StatusID){
        statusName = allStatus[i].StatusName;
        break;
      }
    }
    return statusName;
  }


  populateProcessList(result: any): any[] {
    let resultArray= result.d[0];
    console.log("populateProcessList resultArray...",resultArray)
    let processList= new Array<any>();
    for(let i =0 ; i < resultArray.length;i++){
        processList.push(resultArray[i]);
    }
    return processList;
  }

  populateActivityList(result: any): any[] {
    let resultArray= result.d[0];
    console.log("populateActivityList resultArray...",resultArray)
    let listItems= new Array<any>();
    for(let i =0 ; i < resultArray.length;i++){
      listItems.push(resultArray[i]);
    }
    return listItems;
  }

  getValidateAllDataVal(result: any): boolean {
    let validateAllData : boolean = false;
    let resultType = result.d;
    if(resultType && 
      (resultType.MoveToNextActorQueue || resultType.IsMoveToNextActorQueueNoSampleQC 
        || resultType.IsFinalStatus)){
        validateAllData = true;
        console.log("getValidateAllDataVal resultType", resultType);
      }
    return validateAllData;
  }

  getValidationMsg(result: any, element: any, columnArray: any[]): string[] {
    let validateAllData : boolean = this.getValidateAllDataVal(result);
    let allValidationsMsgs = new Array<string>();
    console.log("getValidationMsg validateAllData", validateAllData);
    for(let i =0 ; i < columnArray.length;i++){
      let validationMsg : string = null;
      let column = columnArray[i];
      let columnName = column.name;
      if( columnName != 'Action' && columnName != 'Status' && !column.hidden ){
        let elementVal = element[columnName];
        validationMsg = this.getValidated(elementVal , column.validationType , validateAllData, columnName);
        if(validationMsg){
          console.log("getValidationMsg validationMsg ",validationMsg);
          allValidationsMsgs.push(validationMsg);
        }
      }
    }
    return allValidationsMsgs;
  }

  getValidated(elementVal: any, validationType: any, allMandatory: boolean, columnName: string): string {
    let validationMsg : string = null;
    console.log("getValidated elementVal", elementVal);
    console.log("getValidated validationType", validationType);
    console.log("getValidated allMandatory", allMandatory);
    console.log("getValidated columnName", columnName);
    if(!elementVal && allMandatory){
      console.log("getValidated Mandatory checking.....");
      validationMsg = 'Please provide value of '+columnName;
    }
    if(!validationMsg && elementVal){
      console.log("getValidated Optional checking..... for ", elementVal);
      if(validationType === 'date' && this.validateDate(elementVal)){
        validationMsg = 'Please enter valid date in mm/dd/yyyy format in '+columnName;
      }else if(validationType === 'number' && !this.validateNumber(elementVal)){
        validationMsg = 'Please enter integer value '+columnName;
      }else if(columnName === 'Comments' && elementVal.length > 200){
        validationMsg = 'Comments should be less than 200 characters'
      }
    }
    return validationMsg;
  }

  validateNumber(elementVal: any): boolean {
    try{
      let reg = new RegExp('^[0-9]+$');
      let val : boolean = reg.test(elementVal);
      console.log("validateNumber val",val);
      console.log("validateNumber elementVal",elementVal);
      return val;
    }catch(e){
      return false;
    }
  }

  validateDate(elementVal: any): boolean {
    if(!moment(elementVal, 'MM/DD/YYYY', true).isValid()){
      return true;
    }
    return false;
  }

  generateXMLString(element: any, workItemRequest : WorkItemRequest, columnArray: any[] ): string {
    let xmlString : string = null;
    console.log("generateXMLString element", element);
    xmlString = "<items><item StatusID= '"+workItemRequest.statusId+"' ";
    for(let i =0 ; i < columnArray.length;i++){
      let column = columnArray[i];
      let columnName = column.name;
      let columnOriginalName = column.originalColumnName;
      if(columnName != 'Action' && columnName != 'Status' && columnOriginalName){
        xmlString = xmlString + columnOriginalName +"='"+element[columnName]+"' ";
      }
    }
    xmlString = xmlString + " /></items>";
    return xmlString;
  }

}
