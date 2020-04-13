import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkItemRequest } from '../models/work-item-request';

@Injectable({
  providedIn: 'root'
})
export class WorkSummaryService {

  private workItemUrl: string;

  constructor(private http: HttpClient) { 
    this.workItemUrl='CreateWorkItemManually.aspx/';
    //this.workItemUrl='Default.aspx/';
    //this.workItemUrl='http://localhost:3000/';
  }

  createBlankWorkItem(request : WorkItemRequest){
    return this.http.post(`${this.workItemUrl}CreateBlankWorkItem`, request );
    //return this.http.get(`${this.workItemUrl}d`);
  }

  getAssignedTimeTrackerWorkItems(request : WorkItemRequest){
    return this.http.post(`${this.workItemUrl}GetAssignedTimeTrackerWorkItems`, request );
    //return this.http.get(`${this.workItemUrl}d`);
  }

  startWorkItem(request : WorkItemRequest){
    return this.http.post(`${this.workItemUrl}StartWorkItem`, request );
    //return this.http.get(`${this.workItemUrl}d`);
  }

  updateWorkItemStatus(request : WorkItemRequest){
    return this.http.post(`${this.workItemUrl}GetStatusDetails`, request );
    //return this.http.get(`${this.workItemUrl}d`);
  }

  getActivityList(processIdVal : string){
    return this.http.post(`${this.workItemUrl}GetActivityList`, processIdVal );
    //return this.http.get(`${this.workItemUrl}d`);
  }

  getProcessList(){
    return this.http.post(`${this.workItemUrl}GetProcessList1` , "");
    //return this.http.get(`${this.workItemUrl}d`);
  }

}
