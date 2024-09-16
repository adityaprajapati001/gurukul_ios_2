import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat-services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, IonContent, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.page.html',
  styleUrls: ['./chat-screen.page.scss'],
})
export class ChatScreenPage implements OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  message:string = '';
  @ViewChild('chatWindow', { static: true }) chatWindow!: ElementRef;
  userIdTo:any = null;
  messages:any[] = [];
  useridfrom: any = 0;
  toUserDetails:any;
  @ViewChild(IonContent) content?: IonContent;
  loggedInUserId:any = null;
  loaded:boolean = false;
  isMessageSent:boolean = false;

  constructor(
    private chatService:ChatService,
    private route:ActivatedRoute,
    private authService:AuthService,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    let tempAuthuser:string = localStorage.getItem('auth-user') as string
    this.loggedInUserId = JSON.parse(tempAuthuser)[0].id;
    this.userIdTo = this.route.snapshot.paramMap.get('userId')
    this.loadFirstTimeConversations()
  }

  ngAfterViewChecked() {
    this.scrollToBottom(); // Automatically scroll to bottom after view checked
  } 

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      this.content?.scrollToBottom();
      this.isMessageSent = false;
    } catch(err) { 
      console.log(err)
    }
  }

  async sendMessage(message: any) {
    try {
      console.log("messagemessage 1", message);
      const data: any = {
        id: null,
        text: "<p>" + message + "</p>",
        timecreated: null,
        useridfrom: this.loggedInUserId
      }
      this.messages.push(data);
      if(!this.message) {
        return
      }
      setTimeout(() => this.scrollToBottom(), 0);
      console.log("messagemessage 2",this.message);
      let tempMessage = this.message
      console.log("tempMessage 2",this.message);
      this.message = "";
      this.isMessageSent = true;
      this.chatService.sendMessage(this.toUserDetails.id,encodeURIComponent(tempMessage)).subscribe(res=>{
        this.message = ""
        // this.getConversations()
        // this.scrollToBottom()
      })
    } catch(err) {
      console.log(err)
    }
  }
  
  // async getMessages(event?:any) {
  //   const res:any = await this.getMessagesFrom()
  //   const res2 = await this.getMessagesTo()
  //   const finalListOfmessages = res.concat(res2)
  //   this.messages = finalListOfmessages.sort((a:any, b:any) => {
  //     if (a.timecreated > b.timecreated) {
  //         return -1; // a comes before b
  //     } else if (a.timecreated < b.timecreated) {
  //         return 1; // b comes before a
  //     } else {
  //         return 0; // leave them unchanged
  //     }
  //   });
  //   this.messages = this.messages.reverse()
  //   this.messages.map((message:any)=>{
  //     message.timecreated = new Date(message.timecreated * 1000);
  //   })
  //   this.scrollToBottom()
  //   if(event) {
  //     event.target.complete();
  //   }
  //   console.log('final messages',this.messages)
  // }

  handleRefresh(event:any) {
    this.loadFirstTimeConversations(event)
  }

  // for safe
  // getConversations(event?:any) {
  //   try {
  //     this.chatService.getConversations(this.loggedInUserId,this.userIdTo).subscribe(res=>{
  //       console.log('getConversations',res)
  //       if(res?.message == "Conversation does not exist") {
  //         this.messages = []
  //         this.getToUserDetailsById()
  //         this.loaded = true;
  //         if(event) {
  //           event.target.complete();
  //         }
  //         return
  //       }
  //       this.toUserDetails = res.members[0]
  //       console.log('toUserDetails',this.toUserDetails)
  //       this.messages = res.messages.sort((a:any, b:any) => {
  //         if (a.timecreated > b.timecreated) {
  //             return -1; // a comes before b
  //         } else if (a.timecreated < b.timecreated) {
  //             return 1; // b comes before a
  //         } else {
  //             return 0; // leave them unchanged
  //         }
  //       });
  //       this.messages = this.messages.reverse()
  //       this.messages.map((message:any)=>{
  //         message.timecreated = new Date(message.timecreated * 1000);
  //       })
  //       console.log('messages',this.messages)
  //       this.scrollToBottom()
  //       this.loaded = true;
  //       if(event) {
  //         event.target.complete();
  //       }
  //     })
  //   } catch(err:any) {
  //     console.log(err)
  //   }
  // }

  async getConversations(event?:any) {
    try {
      this.chatService.getConversations(this.loggedInUserId,this.userIdTo).subscribe(
        (res) => {
          console.log("res", res);
          if(res?.message == "Conversation does not exist") {
            this.messages = []
            this.getToUserDetailsById()
            this.loaded = true;
            if(event) {
              event.target.complete();
            }
            return
          }
          this.messages.push(res); // Add new message to the array
          console.log('res',res)
          this.toUserDetails = res.members[0]
        console.log('toUserDetails',this.toUserDetails)
        this.messages = res.messages.sort((a:any, b:any) => {
          if (a.timecreated > b.timecreated) {
              return -1; // a comes before b
          } else if (a.timecreated < b.timecreated) {
              return 1; // b comes before a
          } else {
              return 0; // leave them unchanged
          }
        });
        this.messages = this.messages.reverse()
        this.messages.map((message:any)=>{
          message.timecreated = new Date(message.timecreated * 1000);
        })
        if(this.isMessageSent) {
          this.scrollToBottom()
        }
        this.useridfrom = this.messages[0].useridfrom
        console.log('final messages',this.messages)
        if(res.unreadcount != 0) {
          const unreadMessages = this.messages.slice(-res.unreadcount);
          console.log('unreadMessages',unreadMessages)
          this.markAllMessagesAsRead(unreadMessages)
        }
        this.loaded = true;
    // this.chatService.unsubscribeMessages();
        
        },
        (error) => {
          console.error('Error fetching messages:', error);
        })



      // this.chatService.getConversations(this.loggedInUserId,this.userIdTo).subscribe(res=>{
      //   console.log('getConversations',res)
      //   if(res?.message == "Conversation does not exist") {
      //     this.messages = []
      //     this.getToUserDetailsById()
      //     this.loaded = true;
      //     if(event) {
      //       event.target.complete();
      //     }
      //     return
      //   }
      //   this.toUserDetails = res.members[0]
      //   console.log('toUserDetails',this.toUserDetails)
      //   this.messages = res.messages.sort((a:any, b:any) => {
      //     if (a.timecreated > b.timecreated) {
      //         return -1; // a comes before b
      //     } else if (a.timecreated < b.timecreated) {
      //         return 1; // b comes before a
      //     } else {
      //         return 0; // leave them unchanged
      //     }
      //   });
      //   this.messages = this.messages.reverse()
      //   this.messages.map((message:any)=>{
      //     message.timecreated = new Date(message.timecreated * 1000);
      //   })
      //   console.log('messages',this.messages)
      //   this.scrollToBottom()
      //   this.loaded = true;
      //   if(event) {
      //     event.target.complete();
      //   }
      // })

    } catch(err:any) {
      console.log(err)
    }
  }

  async loadFirstTimeConversations(event?:any) {
    const res:any = await this.chatService.loadFirstTimeConversations(this.loggedInUserId,this.userIdTo)
        console.log("res", res);
        if(res?.message == "Conversation does not exist") {
          this.messages = []
          this.getToUserDetailsById()
          this.getConversations()
          this.loaded = true;
          if(event) {
            event.target.complete();
          }
          return
        }
        this.messages.push(res); // Add new message to the array
        console.log('res',res)
        this.toUserDetails = res.members[0]
        console.log('toUserDetails',this.toUserDetails)
        this.messages = res.messages.sort((a:any, b:any) => {
          if (a.timecreated > b.timecreated) {
              return -1; // a comes before b
          } else if (a.timecreated < b.timecreated) {
              return 1; // b comes before a
          } else {
              return 0; // leave them unchanged
          }
        });
      this.messages = this.messages.reverse()
      this.messages.map((message:any)=>{
        message.timecreated = new Date(message.timecreated * 1000);
      })
      this.loaded = true;
      this.scrollToBottom()
      this.getConversations()
  }

  ionViewWillLeave() {
    this.chatService.unsubscribeMessages();
  }

  async getToUserDetailsById() {
    try {
      const res = await this.authService.getUserInfoByUserId(this.userIdTo).toPromise()
      console.log('to user details',res)
      this.toUserDetails = res[0];
    } catch(err) {
      console.log(err)
    }
  }

  async onDeleteMessage(messageId:any) {
    try {
      const res = await this.chatService.deleteMessage(this.userIdTo,messageId).toPromise();
      console.log('delette chat res',res)
    } catch(err) {
      console.log(err)
    }
  }

  // async markReadAllConversations() {
  //   try {
  //     const res = await this.chatService.markReadAllConversations(this.userIdTo,this.loggedInUserId).toPromise();
  //     console.log('markReadAllConversations',res)
  //   } catch(err) {
  //     console.log(err)
  //   }
  // }
 
  async markAllMessagesAsRead(unreadMessages:any) {
    for (let index = 0; index < unreadMessages.length; index++) {
      const unReadMessage = unreadMessages[index];
      await this.markReadMessage(unReadMessage.id)
    }
  }

  async markReadMessage(messageId:any) {
    try {
      const res = await this.chatService.markReadMessage(messageId).toPromise();
      console.log('mark read',res)
    } catch(err) {
      console.log(err)
    }
  }

  async presentActionSheet(messageId:any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          data: {
            action: 'delete',
          },
          handler: () => {
            console.log('Action 2 clicked',messageId);
            this.onDeleteMessage(messageId)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

  }

}