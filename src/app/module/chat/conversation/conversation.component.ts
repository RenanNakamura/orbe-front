import {AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {FormControl, FormGroup} from '@angular/forms';
import {stagger20ms} from '@vex/animations/stagger.animation';
import {VexScrollbarComponent} from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import {ChatService} from "../../../service/chat/chat.service";
import {ConversationCache} from "../../../service/chat/conversation.cache";
import {ActivatedRoute} from "@angular/router";
import {ConversationService} from "../../../service/chat/conversation.service";
import {Conversation, Message, SenderType} from "../../../model/chat/conversation";
import {BehaviorSubject, finalize, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'vex-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms, stagger20ms],
})
export class ConversationComponent implements OnInit, AfterViewChecked, OnDestroy {

  conversation?: Conversation;
  
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();
  
  loadingMessages$ = new BehaviorSubject<boolean>(false);
  hasMoreMessages$ = new BehaviorSubject<boolean>(true);
  
  get messages() {
    return this.messagesSubject.value;
  }
  
  private scrollToBottom$ = new BehaviorSubject<boolean>(false);
  private shouldScrollToBottom = false;
  private destroy$ = new Subject<void>();
  private isLoadingOlderMessages = false;

  form = new FormGroup({
    message: new FormControl<string>('', {
      nonNullable: true
    })
  });

  @ViewChild(VexScrollbarComponent)
  scrollbar?: VexScrollbarComponent;

  @ViewChild('messagesContainer', { static: false })
  messagesContainer?: ElementRef<HTMLDivElement>;

  private previousScrollHeight = 0;
  private previousScrollTop = 0;

  readonly SenderType = SenderType;

  constructor(
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _chatService: ChatService,
    private _conversationService: ConversationService,
    private _conversationCache: ConversationCache,
  ) {
  }

  ngOnInit() {
    this._route
      .paramMap
      .subscribe(params => {
        const id = params.get('conversationId');

        if (!id) return;

        const cached = this._conversationCache.get(id);

        if (cached) {
          this.conversation = cached;
          this.loadInitialMessages(id);
        } else {
          this._conversationService
            .findById(id)
            .subscribe(c => {
              this.conversation = c;
              this._conversationCache.set(c);
              this.loadInitialMessages(id);
            });
        }
      });

    this.scrollToBottom$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.shouldScrollToBottom) {
          setTimeout(() => this.scrollToBottom(), 100);
          this.shouldScrollToBottom = false;
        }
      });
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
    
    // Setup scroll listener após view init
    if (this.messagesContainer?.nativeElement && !this.messagesContainer.nativeElement.hasAttribute('data-scroll-listener')) {
      this.setupScrollListener();
      this.messagesContainer.nativeElement.setAttribute('data-scroll-listener', 'true');
    }
  }

  private setupScrollListener() {
    if (!this.messagesContainer?.nativeElement) return;

    // SimpleBar cria um elemento específico para scroll
    const scrollElement = this.messagesContainer.nativeElement.querySelector('.simplebar-content-wrapper') 
      || this.messagesContainer.nativeElement;

    scrollElement.addEventListener('scroll', () => {
      this.onScroll(scrollElement as HTMLElement);
    });
  }

  private onScroll(scrollElement?: HTMLElement) {
    const element = scrollElement || this.messagesContainer?.nativeElement?.querySelector('.simplebar-content-wrapper') as HTMLElement
      || this.messagesContainer?.nativeElement;

    if (!element) return;

    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    // Detecta scroll para cima (próximo ao topo)
    // Considera carregar quando está a menos de 200px do topo
    if (scrollTop < 200 && !this.isLoadingOlderMessages && this.hasMoreMessages$.value) {
      this.onScrollUp();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDrawer() {
    this._chatService.drawerOpen.next(true);
    this._cd.markForCheck();
  }

  closeDrawer() {
    this._chatService.drawerOpen.next(false);
    this._cd.markForCheck();
  }

  onScrollUp() {
    if (this.isLoadingOlderMessages || !this.hasMoreMessages$.value || !this.conversation?.id) {
      return;
    }

    const messages = this.messagesSubject.value;
    if (messages.length === 0) {
      return;
    }

    // Pega a mensagem mais antiga (primeira do array)
    const oldestMessage = messages[0];
    const cursor = oldestMessage.createdAt;

    this.loadOlderMessages(this.conversation.id, cursor);
  }

  isCustomerMessage(senderType: SenderType): boolean {
    return senderType === SenderType.CUSTOMER;
  }

  isBotMessage(senderType: SenderType): boolean {
    return senderType === SenderType.BOT;
  }

  isAgentMessage(senderType: SenderType): boolean {
    return senderType === SenderType.AGENT;
  }

  getMessageText(message: Message): string {
    return message.content?.text?.body || '';
  }

  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }

  private loadInitialMessages(conversationId: string) {
    if (!conversationId) return;

    this.loadingMessages$.next(true);

    // Primeiro carrega a conversa para pegar as últimas 20 mensagens
    this._conversationService
      .findById(conversationId)
      .pipe(
        finalize(() => {
          this.loadingMessages$.next(false);
          this._cd.markForCheck();
        })
      )
      .subscribe({
        next: (conversation) => {
          const initialMessages = conversation.messages || [];
          
          // Ordena mensagens por data (mais antiga primeiro)
          const sortedMessages = [...initialMessages].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          this.messagesSubject.next(sortedMessages);
          this.hasMoreMessages$.next(initialMessages.length === 20); // Assume que há mais se retornou 20
          
          // Scroll para o final após carregar mensagens iniciais
          this.shouldScrollToBottom = true;
          this.scrollToBottom$.next(true);
        },
        error: (err) => {
          console.error('Error loading initial messages:', err);
        }
      });
  }

  private loadOlderMessages(conversationId: string, cursor: string) {
    if (this.isLoadingOlderMessages || !this.hasMoreMessages$.value) {
      return;
    }

    // Salva estado do scroll antes de carregar
    const scrollElement = this.getScrollElement();
    if (scrollElement) {
      this.previousScrollHeight = scrollElement.scrollHeight;
      this.previousScrollTop = scrollElement.scrollTop;
    }

    this.isLoadingOlderMessages = true;
    this.loadingMessages$.next(true);

    this._conversationService
      .getMessages(conversationId, cursor, 20)
      .pipe(
        finalize(() => {
          this.isLoadingOlderMessages = false;
          this.loadingMessages$.next(false);
          this._cd.markForCheck();
        })
      )
      .subscribe({
        next: (newMessages) => {
          if (newMessages.length === 0) {
            this.hasMoreMessages$.next(false);
            return;
          }

          // Ordena novas mensagens por data
          const sortedNewMessages = [...newMessages].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          // Adiciona no início do array (mensagens mais antigas)
          const currentMessages = this.messagesSubject.value;
          const merged = [...sortedNewMessages, ...currentMessages];

          this.messagesSubject.next(merged);
          
          // Se retornou menos de 20, não há mais mensagens
          if (newMessages.length < 20) {
            this.hasMoreMessages$.next(false);
          }

          // Mantém a posição do scroll após carregar mensagens antigas
          this.preserveScrollPosition();
        },
        error: (err) => {
          console.error('Error loading older messages:', err);
          this.hasMoreMessages$.next(false);
        }
      });
  }

  private getScrollElement(): HTMLElement | null {
    if (!this.messagesContainer?.nativeElement) return null;

    // Tenta encontrar o elemento do SimpleBar primeiro
    const simpleBarElement = this.messagesContainer.nativeElement.querySelector('.simplebar-content-wrapper') as HTMLElement;
    return simpleBarElement || this.messagesContainer.nativeElement;
  }

  private scrollToBottom() {
    const scrollElement = this.getScrollElement();
    if (scrollElement) {
      // Usa requestAnimationFrame para garantir que o DOM foi atualizado
      requestAnimationFrame(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      });
    }
  }

  private preserveScrollPosition() {
    // Preserva a posição do scroll após adicionar mensagens antigas
    setTimeout(() => {
      const scrollElement = this.getScrollElement();
      if (!scrollElement) return;

      const currentScrollHeight = scrollElement.scrollHeight;
      const scrollDifference = currentScrollHeight - this.previousScrollHeight;

      // Ajusta o scroll para manter a posição relativa
      if (scrollDifference > 0) {
        scrollElement.scrollTop = this.previousScrollTop + scrollDifference;
      }

      this.previousScrollHeight = currentScrollHeight;
      this.previousScrollTop = scrollElement.scrollTop;
    }, 0);
  }
}
