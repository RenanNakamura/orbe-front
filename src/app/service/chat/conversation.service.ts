import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Conversation, MessageType, SenderType} from "../../model/chat/conversation";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  list(): Observable<Conversation[]> {
    return of([
      {
        "id": "f99b32c1-c6e5-4b1b-a0a4-6fac48bf3190",
        "customerId": "645321ec-1a07-49f8-85b9-35e5a0979677",
        "name": "Milena Carvalho",
        "messages": [
          {
            "id": "40db5cc6-d5b7-4cd6-844f-f0254ce617e9",
            "senderId": "eed0a70a-bf29-47a7-a641-473ba5051e0a",
            "senderType": SenderType.AGENT,
            "content": {
              "to": "5544997464359",
              "type": MessageType.DOCUMENT,
              "text": {
                "body": "Bom dia! Tudo bem?"
              }
            },
            "createdAt": "2025-11-10T19:50:53.868782-03:00"
          }
        ]
      },
      {
        "id": "10cd56fd-4da2-41ca-894c-a2b3ec180d0f",
        "customerId": "3265351f-1262-47fb-873c-c86b19c1951d",
        "name": "Renato Nakamura",
        "messages": [
          {
            "id": "8e75cfef-0255-4a77-b6c9-c229644c3a68",
            "senderId": "eed0a70a-bf29-47a7-a641-473ba5051e0a",
            "senderType": SenderType.AGENT,
            "content": {
              "to": "5544999487919",
              "type": MessageType.IMAGE,
              "text": {
                "body": "Como você está?"
              }
            },
            "createdAt": "2025-11-10T16:21:22.37546-03:00"
          },
          {
            "id": "fa168653-a430-4b7d-bf11-5523ccde95de",
            "senderId": "eed0a70a-bf29-47a7-a641-473ba5051e0a",
            "senderType": SenderType.AGENT,
            "content": {
              "to": "5544999487919",
              "type": MessageType.DOCUMENT,
              "text": {
                "body": "Como você está?"
              }
            },
            "createdAt": "2025-10-31T16:18:44.395201-03:00"
          }
        ]
      },
      {
        "id": "f99b32c1-c6e5-4b1b-a0a4-6fac48bf3190",
        "customerId": "645321ec-1a07-49f8-85b9-35e5a0979677",
        "name": "Renan Nakamura",
        "messages": [
          {
            "id": "40db5cc6-d5b7-4cd6-844f-f0254ce617e9",
            "senderId": "eed0a70a-bf29-47a7-a641-473ba5051e0a",
            "senderType": SenderType.AGENT,
            "content": {
              "to": "5544997464359",
              "type": MessageType.VIDEO,
              "text": {
                "body": "Bom dia! Tudo bem?"
              }
            },
            "createdAt": "2025-11-09T17:16:53.868782-03:00"
          }
        ]
      },
      {
        "id": "f99b32c1-c6e5-4b1b-a0a4-6fac48bf3190",
        "customerId": "645321ec-1a07-49f8-85b9-35e5a0979677",
        "name": "Seiji Nakamura",
        "messages": [
          {
            "id": "40db5cc6-d5b7-4cd6-844f-f0254ce617e9",
            "senderId": "eed0a70a-bf29-47a7-a641-473ba5051e0a",
            "senderType": SenderType.AGENT,
            "content": {
              "to": "5544997464359",
              "type": MessageType.TEXT,
              "text": {
                "body": "Bom dia! Tudo bem?"
              }
            },
            "createdAt": "2025-11-09T22:50:53.868782-03:00"
          }
        ]
      },
      {
        "id": "f99b32c1-c6e5-4b1b-a0a4-6fac48bf3190",
        "customerId": "645321ec-1a07-49f8-85b9-35e5a0979677",
        "name": "Willy Nakamura",
        "messages": [
          {
            "id": "40db5cc6-d5b7-4cd6-844f-f0254ce617e9",
            "senderId": "eed0a70a-bf29-47a7-a641-473ba5051e0a",
            "senderType": SenderType.AGENT,
            "content": {
              "to": "5544997464359",
              "type": MessageType.TEXT,
              "text": {
                "body": "Bora!"
              }
            },
            "createdAt": "2025-11-01T17:16:53.868782-03:00"
          }
        ]
      }
    ]);
  }

}
