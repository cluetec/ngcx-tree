import { Component } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
    selector: 'ngx-tree-root',
    template: `
    <p>
      ngx-tree works!
    </p>
  `,
    styles: [],
    standalone: true,
    imports: [CdkDrag]
})
export class NgxTreeComponent {

}
