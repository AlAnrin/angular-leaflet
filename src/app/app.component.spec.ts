import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {DialogComponent} from './dialog/dialog/dialog.component';
import {MapComponent} from './map/map.component';
import {ListComponent} from './list/list.component';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let fixture: any;
  let app: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        DialogComponent,
        MapComponent,
        ListComponent,
        AppComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('hidden group works', () => {
    fixture.detectChanges();
    let titles = fixture.debugElement.queryAll(By.css('.title'));
    expect(titles.length).toBe(app.groups.map(x => x.array.length)
      .reduce((acc, item) => acc + item));

    const hiddenButtons = fixture.debugElement.queryAll(By.css('.hidden-list-icon'));
    hiddenButtons[0].nativeElement.click();
    fixture.detectChanges();
    titles = fixture.debugElement.queryAll(By.css('.title'));
    expect(titles.length).toBe(app.groups.map((x, index) => index != 0 ? x.array.length : 0)
      .reduce((acc, item) => acc + item));
  });

  it('select marker', () => {
    fixture.detectChanges();
    const titles = fixture.debugElement.queryAll(By.css('.title'));
    titles[0].nativeElement.click();
    fixture.detectChanges();
    expect(titles[0].classes.active).toBe(true);
  });
});
