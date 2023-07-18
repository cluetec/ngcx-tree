import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TreeNodeWrapper } from '../../ngcx-tree-models';

import {
  faBook,
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ngcx-tree-node',
  templateUrl: './ngcx-tree-node.component.html',
  styleUrls: ['./ngcx-tree-node.component.scss'],
  standalone: true,
  imports: [CdkTreeModule, FontAwesomeModule, CommonModule],
})
export class NgcxTreeNodeComponent implements OnInit {
  @Input() nodeWrapper!: TreeNodeWrapper;
  @Input() treeControl!: NestedTreeControl<TreeNodeWrapper>;
  @Input() treeNodeContentComponent?: Type<any>;

  @ViewChild('ref', { read: ViewContainerRef, static: true })
  vcRef?: ViewContainerRef;

  faBook = faBook;
  faChevronDown = faChevronDown;
  faChevronRight = faChevronRight;

  ngOnInit() {
    if (this.vcRef && this.treeNodeContentComponent) {
      const nodeComponent = this.vcRef.createComponent(
        this.treeNodeContentComponent
      );
      nodeComponent.instance.nodeWrapper = this.nodeWrapper;
    }
  }
}
