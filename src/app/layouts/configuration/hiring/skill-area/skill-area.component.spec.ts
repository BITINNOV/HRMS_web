import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SkillAreaComponent} from './skill-area.component';

describe('SkillAreaComponent', () => {
  let component: SkillAreaComponent;
  let fixture: ComponentFixture<SkillAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillAreaComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
