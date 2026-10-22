import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  signal,
  effect,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, take } from 'rxjs';

@Component({
  selector: 'app-mysignal',
  standalone: true,
  imports: [],
  templateUrl: './mysignal.component.html',
  styleUrl: './mysignal.component.css',
})
export class MysignalComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  clickCount = signal(0); //a signal represents state; it does not preserve every event that changed the state.
  clickCount$ = toObservable(this.clickCount);
  interval$ = interval(1000).pipe(take(50));
  intervalSignal = toSignal(this.interval$); // it will clean up obervable interval$

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

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  onClick() {
    //count is the current signal value
    this.clickCount.update((prevCount) => prevCount + 1);
  }
}
