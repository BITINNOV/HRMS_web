import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResumeTypeComponent} from './resume-type.component';

describe('ResumeTypeComponent', () => {
  let component: ResumeTypeComponent;
  let fixture: ComponentFixture<ResumeTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumeTypeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
