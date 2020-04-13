import { Injectable } from '@angular/core';
import { WorkSummaryService } from './work-summary.service';

@Injectable({
  providedIn: 'root'
})
export class StatusTableHelperService {
  
  
  constructor(private workSummarySvc : WorkSummaryService) { }

  populateDisplayedColumns(result: any): string[] {

    let displayColumns: string[] = ['start-button'];
    let columnArray = result.d[0];
    //let columnArray = result[0];
    if(columnArray){
      console.log("columnArray ",columnArray);
      for(let i =0 ; i < columnArray.length;i++){
        displayColumns.push(columnArray[i].mapColumnName);
      }
    }
    return displayColumns;
  }

  populateData(result : any): any[] {
    let data = new Array<any>();
    let dataArray= JSON.parse(result.d[1]);
    //let dataArray= result[1];
    if(dataArray){
      console.log("dataArray ",dataArray);
      let tempVal : boolean = false;
      for(let i =0 ; i < dataArray.length;i++){
        dataArray[i].editable= tempVal;
        data.push(dataArray[i]);
      }
    }
    return data;
  }

  populateAllStatus(result: any): any[] {
    let allStatus= new Array<any>();
    let statusArray= result.d[2];
    //let statusArray= result[2];
    if(statusArray){
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
      if(Status === allStatus[i].StatusName){
        statusId = allStatus[i].StatusID;
        break;
      }
    }
    return statusId;
  }


  populateProcessList(result: any): any[] {
    let resultArray= result.d[0];
    let processList= new Array<any>();
    for(let i =0 ; i < resultArray.length;i++){
        processList.push(result[i]);
    }
    return processList;
  }

  populateActivityList(result: any): any[] {
    let listItems= new Array<any>();
    for(let i =0 ; i < result.length;i++){
      listItems.push(result[i]);
    }
    return listItems;
  }

}
