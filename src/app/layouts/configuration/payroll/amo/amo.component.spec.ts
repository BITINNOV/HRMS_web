import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmoComponent } from './amo.component';

describe('AmoComponent', () => {
  let component: AmoComponent;
  let fixture: ComponentFixture<AmoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
