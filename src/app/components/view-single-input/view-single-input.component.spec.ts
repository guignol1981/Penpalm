import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSingleInputComponent } from './view-single-input.component';

describe('ViewSingleInputComponent', () => {
  let component: ViewSingleInputComponent;
  let fixture: ComponentFixture<ViewSingleInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSingleInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSingleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
