import { CalendarEvent } from 'angular-calendar';

export interface CalendarModel {
    id?: string;
    name: string;
    description: string;
}

export interface CreateEventCalendar {
    calendarId: string;
    start: Date;
    end?: Date;
    title: string;
    allDay?: boolean;
    description: string;
}

export interface UpdateEventCalendar {
    start: Date;
    end?: Date;
    title: string;
    allDay?: boolean;
    description: string;
}

export interface EventModel extends CalendarEvent {
    description: string;
}

export interface DialogData {
    calendarId: string;
    viewDate: Date;
    event: EventModel;
    description: string;
}