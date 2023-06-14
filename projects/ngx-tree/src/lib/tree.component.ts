import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTreeModule, FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { Observable, of } from 'rxjs';
import { TreeConfig, TreeFlatNode, TreeNode } from './util/models';

@Component({
  selector: 'ngx-tree',
  templateUrl: './tree.component.html',
  standalone: true,
  imports: [CdkTreeModule, DragDropModule],
})
export class NgxTreeComponent {
  @Input() nodes = signal<TreeNode[]>([]);
  effect() {
    this.rebuildTreeForData(this.nodes);
  }

  @Input() treeConfig: TreeConfig = {
    nodePadding: 40,
    expandDelay: 1000,
    allowDepthChange: false,
    enableDragging: true,
  };

  @Output() attemptedDepthChange = new EventEmitter<boolean>();

  public treeControl;
  private treeFlattener;

  public dataSource: MatTreeFlatDataSource<TreeNode, TreeFlatNode>;
  public expansionModel = new SelectionModel<string>(true);
  public dragging = signal<boolean>(false);
  private expandTimeout: any;

  constructor() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this._getLevel,
      this._isExpandable,
      this._getChildren
    );

    this.treeControl = new FlatTreeControl<TreeFlatNode>(
      this._getLevel,
      this._isExpandable
    );

    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
  }

  transformer = (node: TreeNode, level: number): TreeFlatNode => {
    return {
      id: node.id,
      title: node.title,
      description: node.description,
      expandable: !!node.children,
      level,
    };
  };

  private _getLevel = (node: TreeFlatNode) => node.level;
  private _isExpandable = (node: TreeFlatNode) => node.expandable;
  private _getChildren = (node: TreeNode): Observable<TreeNode[]> =>
    of(node.children);
  hasChild = (_: number, _nodeData: TreeFlatNode) => _nodeData.expandable;

  validateDepthChange(event: any): void {
    this.treeConfig.allowDepthChange = !event.checked;
  }

  visibleNodes(): TreeNode[] {
    const result: TreeNode[] = [];

    function addExpandedChildren(node: TreeNode, expanded: string[]) {
      result.push(node);
      if (expanded.includes(node.id)) {
        node.children.forEach((child) => addExpandedChildren(child, expanded));
      }
    }

    this.dataSource.data.forEach((node: TreeNode) => {
      addExpandedChildren(node, this.expansionModel.selected);
    });

    return result;
  }

  handleDrop(event: CdkDragDrop<string[]>) {
    if (!event.isPointerOverContainer) return;

    const visibleNodes = this.visibleNodes();
    const changedData = JSON.parse(JSON.stringify(this.dataSource.data));

    function findNodeSiblings(arr: Array<any>, id: string): Array<any> {
      let result: any[] = [];
      let subResult: any[] = [];

      arr.forEach((item) => {
        if (item.id === id) {
          result = arr;
        } else if (item.children) {
          subResult = findNodeSiblings(item.children, id);
          if (subResult) result = subResult;
        }
      });
      return result;
    }

    const nodeAtDest = visibleNodes[event.currentIndex];
    const newSiblings = findNodeSiblings(changedData, nodeAtDest.id);
    if (!newSiblings) return;
    const insertIndex = newSiblings.findIndex((s) => s.id === nodeAtDest.id);

    const node = event.item.data;
    const siblings = findNodeSiblings(changedData, node.id);
    const siblingIndex = siblings.findIndex((n) => n.id === node.id);
    const nodeToInsert: TreeNode = siblings.splice(siblingIndex, 1)[0];
    if (nodeAtDest.id === nodeToInsert.id) return;

    const nodeAtDestFlatNode = this.treeControl.dataNodes.find(
      (n: { id: string }) => nodeAtDest.id === n.id
    );
    if (
      this.treeConfig.allowDepthChange &&
      nodeAtDestFlatNode!.level !== node.level
    ) {
      this.attemptedDepthChange.emit(true);
      return;
    }

    newSiblings.splice(insertIndex, 0, nodeToInsert);
    this.rebuildTreeForData(changedData);
  }

  dragHover(node: TreeFlatNode) {
    if (this.dragging()) {
      clearTimeout(this.expandTimeout);
      this.expandTimeout = setTimeout(() => {
        this.treeControl.expand(node);
      }, this.treeConfig.expandDelay);
    }
  }

  dragHoverEnd() {
    if (this.dragging()) {
      clearTimeout(this.expandTimeout);
    }
  }

  rebuildTreeForData(data: any) {
    this.dataSource.data = data;
    this.expansionModel.selected.forEach((id: any) => {
      const node = this.treeControl.dataNodes.find(
        (n: { id: any }) => n.id === id
      );
      if (node) this.treeControl.expand(node);
    });
  }
}
