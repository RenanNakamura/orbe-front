import {Component, OnInit} from '@angular/core';
import {scaleFadeIn400ms} from '@vex/animations/scale-fade-in.animation';

@Component({
  selector: 'vex-conversation-empty',
  templateUrl: './conversation-empty.component.html',
  styleUrls: ['./conversation-empty.component.scss'],
  animations: [scaleFadeIn400ms],
})
export class ConversationEmptyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
