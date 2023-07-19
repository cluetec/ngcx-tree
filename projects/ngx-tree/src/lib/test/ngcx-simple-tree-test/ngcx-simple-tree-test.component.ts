import { Component } from '@angular/core';
import { NgcxTreeComponent } from '../../ngcx-tree/ngcx-tree.component';
import { TREE_DATA } from '../ngcx-tree-test/mock-tree-nodes';

@Component({
  selector: 'app-ngcx-simple-tree-test',
  templateUrl: './ngcx-simple-tree-test.component.html',
  standalone: true,
  imports: [NgcxTreeComponent],
})
export class NgcxSimpleTreeTestComponent {
  nodes = TREE_DATA;
}
