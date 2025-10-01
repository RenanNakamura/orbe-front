import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CalendarModel} from 'src/app/model/calendar/Calendar';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    private _api = "/api/v1/calendars"

    constructor(private readonly _http: HttpClient) {
    }

    getCalendarDefault(): Observable<CalendarModel> {
        return this._http.get<CalendarModel>(`${environment.calendar}${this._api}/calendar-default`);
    }

    create(newCalendar: CalendarModel): Observable<CalendarModel> {
        return this._http.post<CalendarModel>(`${environment.calendar}${this._api}`, newCalendar);
    }

}
