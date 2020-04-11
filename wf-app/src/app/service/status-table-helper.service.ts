import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusTableHelperService {
  
  constructor() { }

  populateDisplayedColumns(columnArray: any []): string[] {
    let displayColumns: string[] = ['start-button'];
    console.log("columnArray ",columnArray);
    for(let i =0 ; i < columnArray.length;i++){
      displayColumns.push(columnArray[i].mapColumnName);
    }
    return displayColumns;
  }

  populateData(dataArray: any[]): any[] {
    let data = new Array<any>();
    let tempVal : boolean = false;
    console.log("dataArray ",dataArray);
    for(let i =0 ; i < dataArray.length;i++){
      dataArray[i].editable= tempVal;
      data.push(dataArray[i]);
    }
    return data;
  }

  populateAllStatus(statusArray: any): any[] {
    console.log("statusArray ",statusArray);
    let allStatus= new Array<any>();
    for(let i =0 ; i < statusArray.length;i++){
      allStatus.push(statusArray[i]);
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

}
