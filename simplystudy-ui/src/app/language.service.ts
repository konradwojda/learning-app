import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
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
