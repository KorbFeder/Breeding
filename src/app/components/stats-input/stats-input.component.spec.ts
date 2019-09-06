import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsInputComponent } from './stats-input.component';

describe('StatsInputComponent', () => {
  let component: StatsInputComponent;
  let fixture: ComponentFixture<StatsInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
