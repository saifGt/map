import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailmapComponent } from './detailmap.component';

describe('DetailmapComponent', () => {
  let component: DetailmapComponent;
  let fixture: ComponentFixture<DetailmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailmapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
