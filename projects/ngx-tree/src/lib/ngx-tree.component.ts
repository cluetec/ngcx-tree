import { CdkTreeModule } from '@angular/cdk/tree';
import { Component } from '@angular/core';

@Component({
  selector: 'ngx-tree-root',
  template: `
    <cdk-tree>
      <cdk-tree-node>
        <p>Tree node 1</p>
      </cdk-tree-node>
      <cdk-tree-node>
        <p>Tree node 2</p>
      </cdk-tree-node>
    </cdk-tree>
  `,
  styles: [],
  standalone: true,
  imports: [CdkTreeModule],
})
export class NgxTreeComponent {}
