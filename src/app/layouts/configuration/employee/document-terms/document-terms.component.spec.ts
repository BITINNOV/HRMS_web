import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTermsComponent } from './document-terms.component';

describe('DocumentTermsComponent', () => {
  let component: DocumentTermsComponent;
  let fixture: ComponentFixture<DocumentTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentTermsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
