import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActionsComponent } from './view-actions.component';

describe('ViewActionsComponent', () => {
  let component: ViewActionsComponent;
  let fixture: ComponentFixture<ViewActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
