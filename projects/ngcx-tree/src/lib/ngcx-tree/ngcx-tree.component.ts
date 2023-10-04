import {
  CdkDrag,
  CdkDragRelease,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgcxTreeDataSource } from './ngcx-tree-data.source';
import {
  NgcxTreeApi,
  NgcxTreeConfig,
  NgcxTreeNode,
  NgcxTreeNodeMovedEvent,
  NgcxTreeNodeWrapper,
} from './ngcx-tree-models';
import { NgcxTreeNodeComponent } from './ngcx-tree-node/ngcx-tree-node.component';
import { isParentOf } from './ngcx-tree-utils';

@Component({
  selector: 'ngcx-tree',
  templateUrl: 'ngcx-tree.component.html',
  styleUrls: ['ngcx-tree.component.scss'],
  standalone: true,
  imports: [CdkTreeModule, DragDropModule, NgcxTreeNodeComponent, NgIf],
})
export class NgcxTreeComponent implements OnChanges, OnInit {
  @Input() nodes?: NgcxTreeNode[];
  @Input() config?: NgcxTreeConfig<any>;

  @Output() nodeMoved = new EventEmitter<NgcxTreeNodeMovedEvent<any>>();
  @Output() customEvent = new EventEmitter<any>();
  @Output() clickEvent = new EventEmitter<NgcxTreeNodeWrapper<any>>();
  @Output() selectEvent = new EventEmitter<NgcxTreeNodeWrapper<any>>();

  public readonly api: NgcxTreeApi<any> = new NgcxTreeControl(this);

  dataSource: NgcxTreeDataSource<NgcxTreeNodeWrapper<any>> =
    new NgcxTreeDataSource<NgcxTreeNodeWrapper<any>>([]);
  treeControl: NestedTreeControl<NgcxTreeNodeWrapper<any>, string> =
    new NestedTreeControl<NgcxTreeNodeWrapper<any>, string>(
      (node) => node.children,
      {
        trackBy: (node: NgcxTreeNodeWrapper<any>) => node.id,
      }
    );
  dragging?: NgcxTreeNodeWrapper<any>;

  selectedNode?: NgcxTreeNodeWrapper<any>;

  DropType = DropType;

  disable = () => false;

  private canceledByEsq?: boolean;

  ngOnInit(): void {
    this.updateTree();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nodes']) {
      if (this.treeControl) {
        // initialized already
        this.updateTree();
      }
      if (this.selectedNode) {
        const selectedNodeId = this.selectedNode.id;
        setTimeout(() => this.api.selectNodeById(selectedNodeId));
      }
    }
  }

  updateTree() {
    const wrapperNodes = this.createWrapperNodes(this.nodes ?? []);
    this.dataSource = new NgcxTreeDataSource(wrapperNodes);
    this.treeControl.dataNodes = this.dataSource.data$.value;
  }

  createWrapperNodes(
    nodes: NgcxTreeNode[],
    parent?: NgcxTreeNodeWrapper<any>,
    depth: number = 0
  ): NgcxTreeNodeWrapper<any>[] {
    const childCount = nodes.length;
    const wrapperNodes = nodes.map((node, idx) => {
      const nodeWrapper: NgcxTreeNodeWrapper<any> = {
        id: node.id,
        data: node,
        isFirstChild: idx === 0,
        isLastChild: idx === childCount - 1,
        index: idx,
        parent: parent,
        depth: depth,
        children: [],
      };
      nodeWrapper.children = node.children
        ? this.createWrapperNodes(node.children, nodeWrapper, depth + 1)
        : [];

      return nodeWrapper;
    });
    wrapperNodes.forEach((wrapperNode) => {
      if (!wrapperNode.isLastChild) {
        wrapperNode.next = wrapperNodes[wrapperNode.index + 1];
      }
      if (!wrapperNode.isFirstChild) {
        wrapperNode.previous = wrapperNodes[wrapperNode.index - 1];
      }
      if (this.config?.allowSelection?.(wrapperNode)) {
        wrapperNode.isSelectable = true;
      }
    });
    return wrapperNodes;
  }

  hasChild = (_: number, node: NgcxTreeNodeWrapper<any>) =>
    node.children.length > 0;

  allowDrop(dropNode: NgcxTreeNodeWrapper<any>, dropType: DropType): boolean {
    if (
      !this.dragging ||
      this.dragging.id === dropNode.id ||
      isParentOf(this.dragging, dropNode)
    ) {
      return false;
    }
    if (
      dropType == DropType.DROP_INTO &&
      dropNode.id === this.dragging.parent?.id
    ) {
      return false;
    }
    if (
      dropType == DropType.DROP_AFTER &&
      dropNode.next?.id === this.dragging.id
    ) {
      return false;
    }
    if (
      dropType == DropType.DROP_BEFORE &&
      dropNode.previous?.id === this.dragging.id
    ) {
      return false;
    }

    const intoNode =
      dropType == DropType.DROP_INTO ? dropNode : dropNode.parent;
    if (this.config?.allowDrop) {
      return this.config.allowDrop(this.dragging, intoNode);
    }
    return true;
  }

  // prevent drop directly after a node on same level, that is expanded
  sortPredicate(): (
    index: number,
    drag: CdkDrag,
    drop: CdkDropList
  ) => boolean {
    return (
      index: number,
      _drag: CdkDrag<NgcxTreeNodeWrapper<any>>,
      drop: CdkDropList<NgcxTreeNodeWrapper<any>>
    ) => {
      return index == 0 || !this.treeControl.isExpanded(drop.data);
    };
  }

  disableDrag(node: NgcxTreeNodeWrapper<any>) {
    return this.config?.allowDrag ? !this.config.allowDrag(node) : false;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        this.canceledByEsq = true;
        document.dispatchEvent(new Event('mouseup'));
        break;
      case 'ArrowUp':
        if (this.selectedNode) {
          if (!this.selectedNode.isFirstChild) {
            this.selectNode(this.selectedNode.previous);
          } else if (this.selectedNode.parent) {
            this.selectNode(this.selectedNode.parent);
          }
        } else {
          const nodes = this.dataSource.data$.value;
          if (nodes.length > 0) {
            this.selectNode(nodes[nodes.length - 1]);
          }
        }
        event.preventDefault();
        break;
      case 'ArrowDown':
        if (this.selectedNode) {
          if (!this.selectedNode.isLastChild) {
            this.selectNode(this.selectedNode.next);
          } else if (this.selectedNode.parent?.next) {
            this.selectNode(this.selectedNode.parent.next);
          }
        } else {
          const nodes = this.dataSource.data$.value;
          if (nodes.length > 0) {
            this.selectNode(nodes[0]);
          }
        }
        event.preventDefault();
        break;

      case 'ArrowRight':
        if (this.selectedNode && this.selectedNode.children.length > 0) {
          this.selectNode(this.selectedNode.children[0]);
        } else if (!this.selectedNode) {
          const nodes = this.dataSource.data$.value;
          if (nodes.length > 0) {
            this.selectNode(nodes[0]);
          }
        }
        event.preventDefault();
        break;

      case 'ArrowLeft':
        if (this.selectedNode?.parent) {
          this.selectNode(this.selectedNode.parent);
        } else if (!this.selectedNode) {
          const nodes = this.dataSource.data$.value;
          if (nodes.length > 0) {
            this.selectNode(nodes[0]);
          }
        }
        event.preventDefault();
        break;

      default:
        break;
    }
  }

  handleDragRelease(event: CdkDragRelease<NgcxTreeNodeWrapper<any>>) {
    const movedNode = event.source.data;
    const dropZoneId = (<any>event.event.target).id;
    if (!dropZoneId) {
      // no valid drop zone
      return;
    }

    const dropZoneInfo = new DropZoneInfo(dropZoneId);
    const toNode = this.api.findNodeById(dropZoneInfo.nodeId);
    if (!toNode) {
      console.error(`node with id '${dropZoneInfo.nodeId}' could not be found`);
      return;
    }

    // dropType undefined can happen if dropped directly without moving
    if (this.canceledByEsq || dropZoneInfo.dropType === undefined) {
      this.canceledByEsq = false;
      return;
    }

    const insertIntoNode =
      dropZoneInfo.dropType === DropType.DROP_INTO ? toNode : toNode.parent;
    const wrapperList = insertIntoNode?.children ?? this.dataSource.data$.value;
    const addAtNodeIdx = this.findAddIndex(
      dropZoneInfo,
      insertIntoNode,
      wrapperList
    );

    const removedFromIdx = this.removeElementFromPreviousPosition(movedNode);
    // add element to new Position, subtract one if inserted in same list after the remove position
    (insertIntoNode?.data.children ?? this.nodes!).splice(
      movedNode.parent?.id === insertIntoNode?.id &&
        removedFromIdx < addAtNodeIdx
        ? addAtNodeIdx - 1
        : addAtNodeIdx,
      0,
      movedNode.data
    );

    const afterNodeIdx = addAtNodeIdx - 1;
    const afterNode =
      afterNodeIdx > -1 && wrapperList.length > afterNodeIdx
        ? wrapperList[afterNodeIdx]
        : undefined;

    const beforeNode =
      addAtNodeIdx > -1 && wrapperList.length > addAtNodeIdx
        ? wrapperList[addAtNodeIdx]
        : undefined;
    this.nodeMoved.emit({
      node: movedNode,
      parent:
        dropZoneInfo.dropType === DropType.DROP_INTO ? toNode : toNode.parent,
      afterNode: afterNode,
      beforeNode: beforeNode,
    });
    this.dataSource = new NgcxTreeDataSource(
      this.createWrapperNodes(this.nodes!)
    );
    this.treeControl.dataNodes = this.dataSource.data$.value;
  }

  private findAddIndex(
    dropZoneInfo: DropZoneInfo,
    insertIntoNode: NgcxTreeNodeWrapper<any> | undefined,
    insertIntoList: NgcxTreeNodeWrapper<any>[]
  ) {
    if (
      insertIntoNode &&
      dropZoneInfo.dropType === DropType.DROP_INTO &&
      !insertIntoNode.data.children
    ) {
      insertIntoNode.data.children = [];
    }
    let addAtNodeIdx = 0;
    if (
      dropZoneInfo.dropType === DropType.DROP_AFTER ||
      dropZoneInfo.dropType === DropType.DROP_BEFORE
    ) {
      addAtNodeIdx = insertIntoList.findIndex(
        (child) => child.id === dropZoneInfo.nodeId
      );
      if (dropZoneInfo.dropType === DropType.DROP_AFTER) {
        addAtNodeIdx++;
      }
    }
    return addAtNodeIdx;
  }

  private removeElementFromPreviousPosition(
    movedNode: NgcxTreeNodeWrapper<any>
  ): number {
    const removeFromList = movedNode.parent?.data.children ?? this.nodes!;
    const removeIndex = removeFromList.findIndex(
      (child: any) => child.id === movedNode.id
    );
    removeFromList.splice(removeIndex, 1);
    return removeIndex;
  }

  nodeClicked(nodeWrapper: NgcxTreeNodeWrapper<any>) {
    this.clickEvent.emit(nodeWrapper);
    if (nodeWrapper.isSelectable) {
      this.selectedNode =
        nodeWrapper.id === this.selectedNode?.id ? undefined : nodeWrapper;
      this.selectEvent.emit(this.selectedNode);
    }
  }

  selectNode(nodeWrapper: NgcxTreeNodeWrapper<any> | undefined) {
    if (!nodeWrapper || nodeWrapper.isSelectable) {
      this.selectedNode = nodeWrapper;
      let expandNode = this.selectedNode?.parent;
      while (expandNode) {
        this.treeControl.expand(expandNode);
        expandNode = expandNode.parent;
      }
      this.selectEvent.emit(this.selectedNode);
    }
  }
}

enum DropType {
  DROP_AFTER = 'DROP_AFTER',
  DROP_BEFORE = 'DROP_BEFORE',
  DROP_INTO = 'DROP_INTO',
}

export class NgcxTreeControl implements NgcxTreeApi<any> {
  constructor(private treeComponent: NgcxTreeComponent) {}

  get treeControl(): NestedTreeControl<NgcxTreeNodeWrapper<any>, string> {
    return this.treeComponent.treeControl;
  }

  selectNodeById(id: string) {
    this.treeComponent.selectNode(this.findNodeById(id));
  }

  findNodeById(id: string): NgcxTreeNodeWrapper<any> | undefined {
    return this.findNodeByIdInNodes(
      this.treeComponent.dataSource.data$.value,
      id
    );
  }

  private findNodeByIdInNodes(
    nodes: NgcxTreeNodeWrapper<any>[],
    id: string
  ): NgcxTreeNodeWrapper<any> | undefined {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children?.length > 0) {
        const foundNode = this.findNodeByIdInNodes(node.children, id);
        if (foundNode) {
          return foundNode;
        }
      }
    }

    return undefined;
  }
}

class DropZoneInfo {
  dropType: DropType;
  nodeId: string;

  constructor(id: string) {
    const pos = id.indexOf('_');
    this.nodeId = id.substring(0, pos);
    this.dropType = <any>id.substring(pos + 1);
  }
}
