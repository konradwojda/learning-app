import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResourcesComponent } from './search-resources.component';

describe('SearchResourcesComponent', () => {
  let component: SearchResourcesComponent;
  let fixture: ComponentFixture<SearchResourcesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResourcesComponent]
    });
    fixture = TestBed.createComponent(SearchResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
