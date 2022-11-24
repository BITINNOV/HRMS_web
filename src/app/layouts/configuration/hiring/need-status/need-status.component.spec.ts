import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NeedStatusComponent} from './need-status.component';

describe('NeedStatusComponent', () => {
  let component: NeedStatusComponent;
  let fixture: ComponentFixture<NeedStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NeedStatusComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
