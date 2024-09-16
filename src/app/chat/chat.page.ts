import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token/token.service';
import { AuthService } from '../services/auth/auth.service';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { ChatContactService } from '../services/chat-services/chat-contact.service';
import { ChatService } from '../services/chat-services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  isExpanded1: boolean = false;
  isExpanded2: boolean = false;
  userImg: any;
  userId: any;
  userData: any[] = [];
  id: any;
  instructors:any[] = [];
  isShowSearch:boolean = false;
  searchedInstructors:any[] = [];
  autoInstructorsList:any[] = [];
  showUserList:boolean = false;
  isArray:boolean = false;
  allunreadMessagesCount:number = 0;
  allMessages = [];
  // allMessages: any[] = [];
  allMessagesb: any[] = [];
  conversationTimmer:any;
  userDataProfile:any;
  constructor(
    private router: Router, 
    private tokenService: TokenService, 
    private authService: AuthService,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private chatContactService: ChatContactService,
    private chatService:ChatService
  ) { }

  ngOnInit() {
    this.chatContactService.getInstructors(this.id, this.id).subscribe(res => {
      console.log('API Response:', res);
    });

    this.getUserProfile();
  }

  ionViewDidEnter() {
    this.userId = localStorage.getItem('username')
    this.conversationTimmer = null
    console.log('userID',this.userId)
    this.authService.getUserInfo(this.userId).subscribe({
      next: (data) => {
        console.log(data);
        this.userData = data

        for (let i = 0; i < data.length; i++) {
          this.id = this.userData[i].id
          this.userImg = this.userData[i].profileimageurl
        }
        console.log(this.id);
        this.getInstructors();
        this.onSearch();
        
        // this.tokenService.saveUser(this.userData);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  async autoSearchInstructors() {
  // try {
  //   const res = await this.chatContactService.getSearchInstructors(this.id).toPromise();
  //   console.log(Array.isArray(res['0']))
  //   let contacts:any = []
  //   this.isArray = Array.isArray(res['0'])
  //   contacts = this.isArray ? res['0'] : [res['0']]
  //   // const contacts = []
  //   console.log('contacts',contacts)
  //   if(this.isArray) {
  //     this.autoInstructorsList = contacts
  //   } else {
  //     const instructorPromises = contacts.flatMap(async (instructor: any) => {
  //       const res = await this.authService.getUserInfo(instructor.username).toPromise();
  //       return res[0];
  //     });
  //     this.autoInstructorsList = await Promise.all(instructorPromises);
  //     console.log('autoInstructorsList', this.autoInstructorsList);
  //   }
    
  // } catch(err) {
  //   console.log(err);
  // }
}

async getInstructors() {
  try {
    const res = await this.chatContactService.getInstructors(this.id,this.id).toPromise();
    res.messages = res.messages.map((res: any) => {
      return {
        ...res,
        uid: res.useridfrom
      }
    })
    console.log('instructor res 1', res);
    const res2 = await this.chatContactService.getInstructors(this.id,0).toPromise();
    res2.messages = res2.messages.map((res: any) => {
      return {
        ...res,
        uid: res.useridto
      }
    })
    console.log('getInstructors2',res2)
    if(res?.errorcode) {
      console.log('errorcode',res)
      return 
    }

    this.allMessages = res.messages.concat(res2.messages)
    this.allMessagesb = res.messages.concat(res2.messages)
    console.log('both allMessages',this.allMessages)
    
    console.log('count',this.updateUnreadCount(res.messages))
    res.messages = this.updateUnreadCount(res.messages)
    let tempInstructors:any = res.messages.map((ins:any)=>{
      return {
        id: ins.useridfrom,
        unreadcount: ins.unreadcount,
        timecreated: ins.timecreated,
        messageId: ins.id
      }
    })
    console.log('tempInstructors',tempInstructors)


    res2.messages = this.updateUnreadCount(res2.messages,true)
    let tempInstructors2:any = res2.messages.map((ins:any)=>{
      return {
        id: ins.useridto,
        unreadcount: ins.unreadcount,
        timecreated: ins.timecreated,
        messageId: ins.id
      }
    })

    let finalInstructor = [];
    finalInstructor = tempInstructors.concat(tempInstructors2)
    console.log('finalInstructor',finalInstructor)

    finalInstructor = finalInstructor.sort((a:any, b:any) => {
      if (a.timecreated > b.timecreated) {
          return -1; // a comes before b
      } else if (a.timecreated < b.timecreated) {
          return 1; // b comes before a
      } else {
          return 0; // leave them unchanged
      }
    });

    finalInstructor = finalInstructor.filter((obj:any, index:any, self:any) => 
      index === self.findIndex((t:any) => (
          t.id === obj.id
      ))
    )

    console.log('instructors', finalInstructor);
    const instructorPromises = finalInstructor.flatMap(async (instructor: any) => {
        const res = await this.chatContactService.getChatMemberInfo(instructor.id).toPromise();
        console.log('res', res);
        if(res?.errorcode) {
          this.presentToast(res?.errorcode,'danger')
        }
        return res[0];
    });


    // const instructorPromises = finalInstructor.flatMap(async (instructor: any) => {
    //   try {
    //     const res = await this.chatContactService.getChatMemberInfo(instructor.id).toPromise();
    //     if (res?.errorcode) {
    //       // Handle the specific error code or message
    //       console.error('API Error:', res.errorcode);
    //       this.presentToast(`Error: ${res.errorcode}`, 'danger');
    //     }
    //     return res[0]; // Ensure this matches the response structure
    //   } catch (error) {
    //     console.error('Request failed:', error);
    //     this.presentToast('Request failed. Please try again later.', 'danger');
    //   }
    // });

    

    this.instructors = await Promise.all(instructorPromises);
    this.instructors = this.instructors.filter((el:any) => el !== undefined)
    this.allunreadMessagesCount = 0
    for (let index = 0; index < finalInstructor.length; index++) {
      const instructor = finalInstructor[index];
      let findIndex = this.instructors.findIndex((el:any) => el.id === instructor.id)
      if(instructor.id) {
        this.instructors[findIndex]['unreadcount'] = instructor.unreadcount || 0
        this.instructors[findIndex]['messageId'] = instructor.messageId
      }
      if(instructor.unreadcount) {
        this.getCountOfAllUnreadMessages(instructor.unreadcount)
      }
    }
    console.log('final',this.instructors)
    if(!this.conversationTimmer) {
      console.log('timmer start',this.getTimmer())
      // this.conversationTimmer =  setInterval(() => {
      //   this.getInstructors();
      // }, this.getTimmer());
    }
    
  } catch(err) {
    console.log(err);
  }
}

getUserProfile() {
  this.userId = JSON.parse(localStorage.getItem('username') as string);
  this.authService.getUserInfo(this.userId).subscribe({
    next: (data) => {
      console.log(data,"userDataProfile");
      this.userDataProfile = data

      for (let i = 0; i < data.length; i++) {
        this.id = this.userDataProfile[i].id
        this.userImg = this.userDataProfile[i].profileimageurl
      }
      

      this.tokenService.saveUser(this.userDataProfile);
    },
    error: (error) => {
      console.error('Login failed:', error);
    },
  });
}

getTimmer() {
  if(this.allMessages.length <= 50) {
    return 5000
  } else if(this.allMessages.length > 51 && this.allMessages.length <= 500) {
    return 10000
  } else {
    return 30000
  } 
}

// updateUnreadCount(chatList:any,isUseUserIdTo?:boolean) {
//   let unreadCounts:any = {}; // Object to store unread counts for each user
  
//   if(!isUseUserIdTo) {
//     chatList.forEach((chat:any) => {
//       if (unreadCounts[chat.useridfrom]) {
//         if(chat.timeread == null) {
//           unreadCounts[chat.useridfrom]++;
//         }
//       } else {
//         if(chat.timeread == null) {
//           unreadCounts[chat.useridfrom] = 1;
//         }
//       }
//   });
//   } else {
//     chatList.forEach((chat:any) => {
//       if (unreadCounts[chat.useridto]) {
//         if(chat.timeread == null) {
//           unreadCounts[chat.useridto]++;
//         }
//       } else {
//         if(chat.timeread == null) {
//           unreadCounts[chat.useridto] = 1;
//         }
//       }
//   });
//   }

//   // Update the unreadcount property in the chatList array
//   chatList.forEach((chat:any) => {
//       chat.unreadcount = unreadCounts[chat.useridfrom];
//   });

//   return chatList;
// }


updateUnreadCount(chatList: any[], isUseUserIdTo?: boolean) {
  let unreadCounts: any = {}; // Object to store unread counts for each user

  chatList.forEach((chat: any) => {
    const userId = isUseUserIdTo ? chat.useridto : chat.useridfrom;
    if (unreadCounts[userId]) {
      if (chat.timeread == null) {
        unreadCounts[userId]++;
      }
    } else {
      if (chat.timeread == null) {
        unreadCounts[userId] = 1;
      }
    }
    console.log('Unread Counts:', unreadCounts); // Log unread counts
  });

  chatList.forEach((chat: any) => {
    chat.unreadcount = unreadCounts[chat.useridfrom] || 0; // Ensure default value if undefined
    console.log('Updated Chat:', chat); // Log each updated chat item
  });

  return chatList;
}


  toggleAccordion(value: any) {
    if (value === 1) {
      this.isExpanded1 = !this.isExpanded1;
    }
    if (value === 2) {
      this.isExpanded2 = !this.isExpanded2;
    }
  }

  // onContact(userId:number) {
  //   const unreadMessages = this.getUserUnreadMessages(userId)
  //   console.log('unreadMessages',unreadMessages)
  //   this.markAllMessagesAsRead(unreadMessages)
  //   this.router.navigate(['chat-screen',userId]);
  // }

  onContact(userId:number) {
    const unreadMessages = this.getUserUnreadMessages(userId)
    console.log('unreadMessages',unreadMessages)
    this.markAllMessagesAsRead(unreadMessages)
    this.router.navigate(['chat-screen',userId]);
  }

  onProfile() {
    this.menuCtrl.open('chatProfile');
  }

  onGrades() {
    this.router.navigate(['grades']);
  }
  onBadges() {
    this.router.navigate(['badges']);
  }
  onPreferences() {
    this.router.navigate(['preferences']);
  }

  async openCapacitorSite() {
    await Browser.open({ url: 'https://gurukul.skfin.in' });
  }

  onClose() {    
    this.menuCtrl.close('chatProfile');
  }

  async onLogout() {
    const loading = await this.loadingController.create({
      // message: 'Loading...',
      duration: 2000
    });
    await loading.present();
    this.tokenService.logOut();
    this.presentToast('Logged Out successfully', 'success');
    this.router.navigate(['login']).then(() => {
      setTimeout(() => {
        location.reload();
      }, 1000);
    });
    await loading.dismiss();
  }

  async presentToast(message: any, color: any) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color,
    });

    toast.present();
  }

  async onSearch() {
    // const searchTerm = event.target.value.toLowerCase();
    // this.searchedInstructors = []
    // this.searchedInstructors = this.autoInstructorsList.filter(ins =>
    //   this.isArray ? ins.firstname.toLowerCase().includes(searchTerm) || ins.lastname.toLowerCase().includes(searchTerm) : ins.fullname.toLowerCase().includes(searchTerm)
    // );
    // console.log('searchedInstructors',this.searchedInstructors)




    // const searchTerm = event.target.value.toLowerCase();
    const searchTerm = "";
    // if(!searchTerm) {
    //   this.autoInstructorsList = []
    //   this.searchedInstructors = []
    //   return
    // }
    try {
    const res = await this.chatContactService.getSearchInstructors(this.id,searchTerm).toPromise();
    console.log(Array.isArray(res['0']))
    let contacts:any = []
    this.isArray = Array.isArray(res['0'])
    contacts = this.isArray ? res['0'] : [res['0']]
    // const contacts = []
    console.log('contacts',contacts)
    if(this.isArray) {
      this.autoInstructorsList = contacts
    } else {
      const instructorPromises = contacts.flatMap(async (instructor: any) => {
        const res = await this.authService.getUserInfo(instructor.username).toPromise();
        return res[0];
      });
      this.autoInstructorsList = await Promise.all(instructorPromises);
      console.log('autoInstructorsList', this.autoInstructorsList);
    }
    this.onSearchFocus()
    
  } catch(err) {
    console.log(err);
  }
  }

  toggleSearch() {
    this.isShowSearch = !this.isShowSearch
  }

  onSearchFocus() {
    this.showUserList = true
    this.searchedInstructors = this.autoInstructorsList.filter(ins =>
      this.isArray ? ins.firstname.toLowerCase().includes('') || ins.lastname.toLowerCase().includes('') : ins.fullname.toLowerCase().includes('')
    );
    console.log("this.searchedInstructors", this.searchedInstructors);
  }

  onInputValue(event: any) {
    const searchResult: any = event.target.value.toLowerCase();
    this.searchedInstructors = this.autoInstructorsList.filter(ins =>
      ins.firstname.toLowerCase().includes(searchResult) || ins.lastname.toLowerCase().includes(searchResult)
    );
  }

  onSearchBlur(event:any) {
    setTimeout(() => {
    this.showUserList = false
    this.autoInstructorsList = []
    this.searchedInstructors = []
    event.target.value = ""
    }, 500);
  }

  getCountOfAllUnreadMessages(count:number) {
    this.allunreadMessagesCount = this.allunreadMessagesCount + count
  }

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

  getUserUnreadMessages(userId:any) {
    return this.allMessages.filter((msg:any)=> (msg.uid == userId && msg.timeread == null));
  }

  ionViewWillLeave() {
    this.allunreadMessagesCount = 0
    if(this.conversationTimmer) {
      clearInterval(this.conversationTimmer)
    }
  }
  
}
