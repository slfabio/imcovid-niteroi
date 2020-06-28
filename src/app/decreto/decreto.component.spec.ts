import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecretoComponent } from './decreto.component';

describe('DecretoComponent', () => {
  let component: DecretoComponent;
  let fixture: ComponentFixture<DecretoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecretoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecretoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
