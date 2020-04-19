import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { WorkItemRequest } from '../models/work-item-request';
import { Observable } from 'rxjs';

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

  getActivityList(processIdVal : string): Observable<any>{
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let content = {ProcessID: processIdVal};
    return this.http.post<any>(`${this.workItemUrl}GetActivityList`, content, {
      headers: headers} );
    //return this.http.get(`${this.workItemUrl}d`);
  }

  getProcessList(): Observable<any>{
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let content = {};
    return this.http.post<any>(`${this.workItemUrl}GetProcessList` , content, {
      headers: headers});
  }

  saveWorkItems(request: WorkItemRequest) {
    return this.http.post(`${this.workItemUrl}SaveWorkItemDetails`, request );
    //return this.http.get(`${this.workItemUrl}d`);
  }

}
