import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderModalComponent } from './uploader-modal.component';

describe('UploaderModalComponent', () => {
  let component: UploaderModalComponent;
  let fixture: ComponentFixture<UploaderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploaderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
