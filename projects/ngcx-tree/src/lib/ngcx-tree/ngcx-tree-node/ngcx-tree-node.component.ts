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
import { NgcxTreeConfig, NgcxTreeNodeWrapper } from '../ngcx-tree-models';

import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'ngcx-tree-node',
    templateUrl: './ngcx-tree-node.component.html',
    styleUrls: ['./ngcx-tree-node.component.scss'],
    imports: [CdkTreeModule, NgTemplateOutlet, NgIf]
})
export class NgcxTreeNodeComponent implements OnInit, OnDestroy {
  @Input() nodeWrapper!: NgcxTreeNodeWrapper<any>;
  @Input() treeControl!: NestedTreeControl<NgcxTreeNodeWrapper<any>, string>;
  @Input() treeConfig?: NgcxTreeConfig<any>;
  @Input() isSelected = false;

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
