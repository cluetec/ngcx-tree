import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TreeConfig, TreeNodeWrapper } from '../ngcx-tree-models';

import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ngcx-tree-node',
  templateUrl: './ngcx-tree-node.component.html',
  styleUrls: ['./ngcx-tree-node.component.scss'],
  standalone: true,
  imports: [CdkTreeModule, NgTemplateOutlet, NgIf],
})
export class NgcxTreeNodeComponent implements OnInit, OnDestroy {
  @Input() nodeWrapper!: TreeNodeWrapper;
  @Input() treeControl!: NestedTreeControl<TreeNodeWrapper>;
  @Input() treeConfig?: TreeConfig;

  @Output() customEvent = new EventEmitter<any>();
  @Output() clickEvent = new EventEmitter<void>();

  @ViewChild('ref', { read: ViewContainerRef, static: true })
  vcRef?: ViewContainerRef;

  ngUnsubscribe = new Subject();

  ngOnInit() {
    if (this.vcRef && this.treeConfig?.treeNodeContentComponent) {
      const nodeComponent = this.vcRef.createComponent(
        this.treeConfig.treeNodeContentComponent
      );
      nodeComponent.instance.nodeWrapper = this.nodeWrapper;

      nodeComponent.instance.customEvent
        ?.pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((value: any) => this.customEvent.emit(value));
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }
}
