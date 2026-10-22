import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  signal,
  effect,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, Observable, take } from 'rxjs';
@Component({
  selector: 'app-custom-observable',
  standalone: true,
  imports: [],
  templateUrl: './custom-observable.component.html',
  styleUrl: './custom-observable.component.css',
})
export class CustomObservableComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  clickCount = signal(0); //a signal represents state; it does not preserve every event that changed the state.
  clickCount$ = toObservable(this.clickCount);
  interval$ = interval(1000).pipe(take(50));
  intervalSignal = toSignal(this.interval$); // it will clean up obervable interval$

  customInterval$ = new Observable((subscriber) => {
    let counter = 0;
    const intervalId = setInterval(() => {
      if (counter >= 10) {
        subscriber.complete();
      }

      subscriber.next(++counter);
    }, 1000);

    // teardown function.
    return () => {
      clearInterval(intervalId);
    };
  });

  constructor() {
    // we dont need observable, use effect is good enough
    effect(() => {
      console.log(`effect clicked button ${this.clickCount()} times.`);
    });
  }
  ngOnInit() {
    const sub = this.clickCount$.subscribe({
      next: (val) =>
        console.log(`observable clicked button ${this.clickCount()} times.`),
    });

    const sub2 = this.customInterval$.subscribe({
      next: (val) => console.log(`custom observalbe ${val}`),
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
      sub2.unsubscribe();
    });
  }

  onClick() {
    //count is the current signal value
    this.clickCount.update((prevCount) => prevCount + 1);
  }
}
