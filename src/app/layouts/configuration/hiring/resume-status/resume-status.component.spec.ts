import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResumeStatusComponent} from './resume-status.component';

describe('ResumeStatusComponent', () => {
  let component: ResumeStatusComponent;
  let fixture: ComponentFixture<ResumeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumeStatusComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
