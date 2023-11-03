import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'simplystudy-ui';
  private languageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('en');


  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'pl']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    this.changeLanguage((browserLang && browserLang.match(/en|pl/)) ? browserLang : 'pl');
  }

  changeLanguage(language: string) {
    this.translate.use(language);
    this.languageSubject.next(language);
  }

  getcurrentLanguage(): Observable<string> {
    return this.languageSubject.asObservable();
  }

  getAllLanguages() {
    return this.translate.getLangs();
  }
}
