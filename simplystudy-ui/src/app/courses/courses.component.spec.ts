import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesComponent } from './courses.component';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { of } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

describe('CoursesComponent', () => {
    let component: CoursesComponent;
    let fixture: ComponentFixture<CoursesComponent>;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoursesComponent, HttpClientTestingModule, MatSnackBarModule, TranslateModule.forRoot()],
            declarations: [ConfirmationDialogComponent],
            providers: [
                provideHttpClientTesting(),
                TranslateService,
            ]
        });
        fixture = TestBed.createComponent(CoursesComponent);
        component = fixture.componentInstance;
        httpTestingController = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call api on init', () => {
        const req = httpTestingController.expectOne('/api/courses/?username=');
        expect(req.request.method).toEqual('GET');
        httpTestingController.verify();
    });

    it('#deleteCourse should call api', () => {
        spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<ConfirmationDialogComponent>);
        component.deleteCourse(1);
        const req = httpTestingController.expectOne('/api/courses/1/');
        expect(req.request.method).toEqual('DELETE');
    });

    it('#createCourse should call api', () => {
        spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of({}) } as MatDialogRef<any>);
        component.createCourse();
        const req = httpTestingController.expectOne('/api/courses/');
        expect(req.request.method).toEqual('POST');
    });

    it('#editCourse should call api', () => {
        spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of({ id: 1, name: 'test', description: 'test', university: 'test'}) } as MatDialogRef<any>);
        component.editCourse({ id: 1, name: 'test', description: 'test', university: 'test'});
        const req = httpTestingController.expectOne('/api/courses/1/');
        expect(req.request.method).toEqual('PUT');
    });

});
