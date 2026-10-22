import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  OnDestroy,
  signal,
  effect,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, take, map } from 'rxjs';
import { ObservableComponent } from './observable/observable.component';
import { MysignalComponent } from './mysignal/mysignal.component';
import { CustomObservableComponent } from './custom-observable/custom-observable.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [ObservableComponent, MysignalComponent, CustomObservableComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  clickCount = signal(0);

  constructor() {
    effect(() => {
      console.log(`clicked button ${this.clickCount()} times`);
    });
  }

  ngOnInit() {
    // Without cleanup, an interval() subscription can continue running after its component is gone, potentially wasting resources and retaining references to the component.
    const sub = interval(1000)
      .pipe(
        take(5),
        map((val) => val * 2),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({ next: (val) => console.log(val) });

    //This registers a callback with Angular.
    // It does not execute unsubscribe() immediately.
    // Think of it as telling Angular:
    // When this component is destroyed, execute this function.
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  onClick() {
    //count is the current signal value
    this.clickCount.update((prevCount) => prevCount + 1);
  }

  ngOnDestroy() {}
}
