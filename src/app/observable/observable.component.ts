import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  signal,
  effect,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-observable',
  standalone: true,
  imports: [],
  templateUrl: './observable.component.html',
  styleUrl: './observable.component.css',
})
export class ObservableComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  clickCount = signal(0); //a signal represents state; it does not preserve every event that changed the state.
  clickCount$ = toObservable(this.clickCount);

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
