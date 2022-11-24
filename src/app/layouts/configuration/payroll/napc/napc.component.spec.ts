import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NapcComponent } from './napc.component';

describe('NapcComponent', () => {
  let component: NapcComponent;
  let fixture: ComponentFixture<NapcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NapcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NapcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
