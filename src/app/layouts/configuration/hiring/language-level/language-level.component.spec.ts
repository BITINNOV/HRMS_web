import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LanguageLevelComponent} from './language-level.component';

describe('LanguageLevelComponent', () => {
  let component: LanguageLevelComponent;
  let fixture: ComponentFixture<LanguageLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LanguageLevelComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
