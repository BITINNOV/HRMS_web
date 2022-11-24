import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PublicationLineStatusComponent} from './publication-line-status.component';

describe('PublicationLineStatusComponent', () => {
  let component: PublicationLineStatusComponent;
  let fixture: ComponentFixture<PublicationLineStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicationLineStatusComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationLineStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
