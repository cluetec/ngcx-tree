import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

export class NgcxTreeDataSource<T> extends DataSource<T> {
  data$: BehaviorSubject<T[]>;

  constructor(data: T[]) {
    super();
    this.data$ = new BehaviorSubject(data);
  }

  connect(): Observable<readonly T[]> {
    return this.data$.asObservable();
  }
  disconnect(): void {}

  update(data: T[]) {
    this.data$.next([...data]);
  }
}
