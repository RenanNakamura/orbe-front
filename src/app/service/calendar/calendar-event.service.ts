import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateEventCalendar, EventModel, UpdateEventCalendar } from "src/app/model/calendar/Calendar";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
export class CalendarEventService {
  
    private _api = "/api/v1/events"
  
    constructor(private readonly _http: HttpClient) { }
  
    create(newEvent: CreateEventCalendar): Observable<CreateEventCalendar> {
      return this._http.post<CreateEventCalendar>(`${environment.calendar}${this._api}`, newEvent);
    }

    delete(eventId: string) {
      return this._http.delete(`${environment.calendar}${this._api}/${eventId}`);
    }
    
    update(eventId:string, event: UpdateEventCalendar) {
        return this._http.patch(`${environment.calendar}${this._api}/${eventId}`, event);
    }
     
    list(calendarId: string): Observable<EventModel[]> {
      return this._http.get<EventModel[]>(`${environment.calendar}${this._api}/${calendarId}`);
    }
}