import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsdependencyComponent } from './formsdependency.component';

describe('FormsdependencyComponent', () => {
  let component: FormsdependencyComponent;
  let fixture: ComponentFixture<FormsdependencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormsdependencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsdependencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
