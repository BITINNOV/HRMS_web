import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationPlatformComponent } from './publication-platform.component';

describe('PublicationPlatformComponent', () => {
  let component: PublicationPlatformComponent;
  let fixture: ComponentFixture<PublicationPlatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicationPlatformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
