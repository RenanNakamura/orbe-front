import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {WebSocketStatus} from "../service/websocket/websocket-connection";

@Pipe({
  name: 'wsStatusText'
})
export class WebSocketStatusTextPipe implements PipeTransform {

  transform(status: WebSocketStatus | null | undefined): string {
    switch (status) {
      case WebSocketStatus.CONNECTED:
        return 'chat.status.connected';
      case WebSocketStatus.CONNECTING:
        return 'chat.status.connecting';
      case WebSocketStatus.RECONNECTING:
        return 'chat.status.reconnecting';
      case WebSocketStatus.ERROR:
        return 'chat.status.error';
      case WebSocketStatus.DISCONNECTED:
      default:
        return 'chat.status.disconnected';
    }
  }
}

@Pipe({
  name: 'wsStatusColor'
})
export class WebSocketStatusColorPipe implements PipeTransform {

  transform(status: WebSocketStatus | null | undefined): string {
    switch (status) {
      case WebSocketStatus.CONNECTED:
        return 'text-green-600';
      case WebSocketStatus.CONNECTING:
      case WebSocketStatus.RECONNECTING:
        return 'text-yellow-600';
      case WebSocketStatus.ERROR:
      case WebSocketStatus.DISCONNECTED:
      default:
        return 'text-red-600';
    }
  }
}

@NgModule({
  declarations: [WebSocketStatusTextPipe, WebSocketStatusColorPipe],
  exports: [WebSocketStatusTextPipe, WebSocketStatusColorPipe],
})
export class WebSocketStatusPipeModule {
}


