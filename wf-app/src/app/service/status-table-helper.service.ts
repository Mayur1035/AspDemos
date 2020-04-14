import { Injectable } from '@angular/core';
import { WorkSummaryService } from './work-summary.service';

@Injectable({
  providedIn: 'root'
})
export class StatusTableHelperService {
  
  
  constructor(private workSummarySvc : WorkSummaryService) { }

  populateDisplayedColumns(result: any): string[] {

    //let displayColumns: string[] = ['start-button'];
    let displayColumns = new Array<any>();
    let columnArray = result.d[0];
    //let columnArray = result[0];
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
        dataArray[i].canEdit= tempVal;
        let statusId = dataArray[i].Status;
        dataArray[i].Status = this.getStatusName(allStatus, statusId);
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

}
