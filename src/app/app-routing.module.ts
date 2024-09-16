import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { LoginGuardService } from './services/auth-guard/login-guard/login-guard.service';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate:[LoginGuardService]
  },
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
  //   canActivate: [AuthGuardService] 
  // },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [AuthGuardService] 
  },
  {
    path: 'course-downloads',
    loadChildren: () => import('./course-downloads/course-downloads.module').then( m => m.CourseDownloadsPageModule)
  },
  {
    path: 'cyber-security',
    loadChildren: () => import('./cyber-security/cyber-security.module').then( m => m.CyberSecurityPageModule)
  },
  {
    path: 'course-index',
    loadChildren: () => import('./course-index/course-index.module').then( m => m.CourseIndexPageModule)
  },
  {
    path: 'index-activity',
    loadChildren: () => import('./index-activity/index-activity.module').then( m => m.IndexActivityPageModule)
  },
  {
    path: 'communication',
    loadChildren: () => import('./communication/communication.module').then( m => m.CommunicationPageModule)
  },
  // {
  //   path: 'chat',
  //   loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  // },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  },
  // {
  //   path: 'calendar',
  //   loadChildren: () => import('./calendar/calendar.module').then( m => m.CalendarPageModule)
  // },
  {
    path: 'footer',
    loadChildren: () => import('./footer/footer.module').then( m => m.FooterPageModule)
  },
  // {
  //   path: 'more',
  //   loadChildren: () => import('./more/more.module').then( m => m.MorePageModule)
  // },
  {
    path: 'index-quiz',
    loadChildren: () => import('./index-quiz/index-quiz.module').then( m => m.IndexQuizPageModule)
  },
  {
    path: 'start-quiz',
    loadChildren: () => import('./start-quiz/start-quiz.module').then( m => m.StartQuizPageModule)
  },
  {
    path: 'quiz-content',
    loadChildren: () => import('./quiz-content/quiz-content.module').then( m => m.QuizContentPageModule)
  },
  {
    path: 'quiz-content-update',
    loadChildren: () => import('./quiz-content-update/quiz-content-update.module').then( m => m.QuizContentUpdatePageModule)
  },
  {
    path: 'chat-screen/:userId',
    loadChildren: () => import('./chat-screen/chat-screen.module').then( m => m.ChatScreenPageModule)
  },
  {
    path: 'grades',
    loadChildren: () => import('./grades/grades.module').then( m => m.GradesPageModule)
  },
  {
    path: 'badges',
    loadChildren: () => import('./badges/badges.module').then( m => m.BadgesPageModule)
  },
  {
    path: 'preferences',
    loadChildren: () => import('./preferences/preferences.module').then( m => m.PreferencesPageModule)
  },
  {
    path: 'pref-messages',
    loadChildren: () => import('./pref-messages/pref-messages.module').then( m => m.PrefMessagesPageModule)
  },
  {
    path: 'pref-notifications',
    loadChildren: () => import('./pref-notifications/pref-notifications.module').then( m => m.PrefNotificationsPageModule)
  },
  {
    path: 'forgot-pwd',
    loadChildren: () => import('./forgot-pwd/forgot-pwd.module').then( m => m.ForgotPwdPageModule)
  },
  {
    path: 'attempt-summary',
    loadChildren: () => import('./attempt-summary/attempt-summary.module').then( m => m.AttemptSummaryPageModule)
  },
  {
    path: 'header',
    loadChildren: () => import('./header/header.module').then( m => m.HeaderPageModule)
  },
  {
    path: 'recent-items',
    loadChildren: () => import('./recent-items/recent-items.module').then( m => m.RecentItemsPageModule)
  },
  {
    path: 'iframe-modal',
    loadChildren: () => import('./modal-controller/iframe-modal/iframe-modal.module').then( m => m.IframeModalPageModule)
  },
  {
    path: 'pdf-viewer-modal',
    loadChildren: () => import('./modal-controller/pdf-viewer-modal/pdf-viewer-modal.module').then( m => m.PdfViewerModalPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'accessibility-statement',
    loadChildren: () => import('./accessibility-statement/accessibility-statement.module').then( m => m.AccessibilityStatementPageModule)
  },
  {
    path: 'feedback/:courseId/:instanceId',
    loadChildren: () => import('./feedback/feedback.module').then( m => m.FeedbackPageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'index-activities',
    loadChildren: () => import('./index-activities/index-activities.module').then( m => m.IndexActivitiesPageModule)
  },
  {
    path: 'quiz-content-update',
    loadChildren: () => import('./quiz-content-update/quiz-content-update.module').then( m => m.QuizContentUpdatePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
