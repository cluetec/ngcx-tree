import {
  CdkDrag,
  CdkDragRelease,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import {
  CdkTreeModule,
  NestedTreeControl,
  NestedTreeControlOptions,
} from '@angular/cdk/tree';
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
export class NgcxTreeComponent<T extends NgcxTreeNode>
  implements OnChanges, OnInit
{
  @Input() nodes?: NgcxTreeNode[];
  @Input() config?: NgcxTreeConfig<T>;

  @Output() nodeMoved = new EventEmitter<NgcxTreeNodeMovedEvent<T>>();
  @Output() customEvent = new EventEmitter<T>();
  @Output() clickEvent = new EventEmitter<NgcxTreeNodeWrapper<T>>();
  @Output() selectEvent = new EventEmitter<NgcxTreeNodeWrapper<T>>();

  /**
   * Api for finding and selecting node. Extends from the CDK treeControl for expanding/collapsing the tree
   */
  public readonly treeControl: NgcxTreeControl<T> = new NgcxTreeControl<T>(
    this,
    (node) => node.children,
    {
      trackBy: (node: NgcxTreeNodeWrapper<T>) => node.id,
    }
  );

  dataSource: NgcxTreeDataSource<NgcxTreeNodeWrapper<T>> =
    new NgcxTreeDataSource<NgcxTreeNodeWrapper<T>>([]);

  protected dragging?: NgcxTreeNodeWrapper<T>;

  protected selectedNode?: NgcxTreeNodeWrapper<T>;

  protected readonly DropType = DropType;

  protected readonly disable = () => false;

  private canceledByEsc?: boolean;

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
        setTimeout(() => this.treeControl.selectNodeById(selectedNodeId));
      }
    }
  }

  private updateTree() {
    const wrapperNodes = this.createWrapperNodes(this.nodes ?? []);
    this.dataSource = new NgcxTreeDataSource(wrapperNodes);
    this.treeControl.dataNodes = this.dataSource.data$.value;
  }

  private createWrapperNodes(
    nodes: NgcxTreeNode[],
    parent?: NgcxTreeNodeWrapper<T>,
    depth: number = 0
  ): NgcxTreeNodeWrapper<T>[] {
    const childCount = nodes.length;
    const wrapperNodes = nodes.map((node, idx) => {
      const nodeWrapper: NgcxTreeNodeWrapper<T> = {
        id: node.id,
        data: <T>node,
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

  protected allowDrop(
    dropNode: NgcxTreeNodeWrapper<T>,
    dropType: DropType
  ): boolean {
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
  protected sortPredicate(): (
    index: number,
    drag: CdkDrag,
    drop: CdkDropList
  ) => boolean {
    return (
      index: number,
      _drag: CdkDrag<NgcxTreeNodeWrapper<T>>,
      drop: CdkDropList<NgcxTreeNodeWrapper<T>>
    ) => {
      return index == 0 || !this.treeControl.isExpanded(drop.data);
    };
  }

  protected disableDrag(node: NgcxTreeNodeWrapper<T>) {
    return this.config?.allowDrag ? !this.config.allowDrag(node) : false;
  }

  protected keyDownArrowUp(event: Event) {
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
  }

  protected keyDownArrowDown(event: Event) {
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
  }

  protected keyDownArrowLeft(event: Event) {
    if (this.selectedNode) {
      if (this.treeControl.isExpanded(this.selectedNode)) {
        this.treeControl.collapse(this.selectedNode);
      } else if (this.selectedNode?.parent) {
        this.selectNode(this.selectedNode.parent);
      }
    } else {
      const nodes = this.dataSource.data$.value;
      if (nodes.length > 0) {
        this.selectNode(nodes[0]);
      }
    }
    event.preventDefault();
  }

  protected keyDownArrowRight(event: Event) {
    if (this.selectedNode && this.selectedNode.children.length > 0) {
      this.selectNode(this.selectedNode.children[0]);
    } else if (!this.selectedNode) {
      const nodes = this.dataSource.data$.value;
      if (nodes.length > 0) {
        this.selectNode(nodes[0]);
      }
    }
    event.preventDefault();
  }

  @HostListener('window:keydown.escape')
  protected keyEscapeWhileDragging() {
    if (this.dragging) {
      this.canceledByEsc = true;
      document.dispatchEvent(new Event('mouseup'));
    }
  }

  protected handleDragRelease(event: CdkDragRelease<NgcxTreeNodeWrapper<T>>) {
    this.dragging = undefined;
    const movedNode = event.source.data;
    const dropZoneId = (<any>event.event.target).id;
    if (!dropZoneId) {
      // no valid drop zone
      return;
    }

    const dropZoneInfo = new DropZoneInfo(dropZoneId);
    const toNode = this.treeControl.findNodeById(dropZoneInfo.nodeId);
    if (!toNode) {
      console.error(`node with id '${dropZoneInfo.nodeId}' could not be found`);
      return;
    }

    // dropType undefined can happen if dropped directly without moving
    if (this.canceledByEsc || dropZoneInfo.dropType === undefined) {
      this.canceledByEsc = false;
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
    insertIntoNode: NgcxTreeNodeWrapper<T> | undefined,
    insertIntoList: NgcxTreeNodeWrapper<T>[]
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
    movedNode: NgcxTreeNodeWrapper<T>
  ): number {
    const removeFromList = movedNode.parent?.data.children ?? this.nodes!;
    const removeIndex = removeFromList.findIndex(
      (child: any) => child.id === movedNode.id
    );
    removeFromList.splice(removeIndex, 1);
    return removeIndex;
  }

  nodeClicked(nodeWrapper: NgcxTreeNodeWrapper<T>) {
    this.clickEvent.emit(nodeWrapper);
    if (nodeWrapper.isSelectable) {
      this.selectedNode =
        nodeWrapper.id === this.selectedNode?.id ? undefined : nodeWrapper;
      this.selectEvent.emit(this.selectedNode);
    }
  }

  selectNode(nodeWrapper: NgcxTreeNodeWrapper<T> | undefined) {
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

export class NgcxTreeControl<T extends NgcxTreeNode> extends NestedTreeControl<
  NgcxTreeNodeWrapper<T>,
  string
> {
  constructor(
    private treeComponent: NgcxTreeComponent<T>,
    getChildren: (dataNode: NgcxTreeNodeWrapper<T>) => NgcxTreeNodeWrapper<T>[],
    options?: NestedTreeControlOptions<NgcxTreeNodeWrapper<T>, string>
  ) {
    super(getChildren, options);
  }

  /**
   * select a node by id. the selectEvent is fired afterwards.
   */
  selectNodeById(id: string) {
    this.treeComponent.selectNode(this.findNodeById(id));
  }

  /**
   * find a node by id.
   */
  findNodeById(id: string): NgcxTreeNodeWrapper<T> | undefined {
    return this.findNodeByIdInNodes(
      this.treeComponent.dataSource.data$.value,
      id
    );
  }

  private findNodeByIdInNodes(
    nodes: NgcxTreeNodeWrapper<T>[],
    id: string
  ): NgcxTreeNodeWrapper<T> | undefined {
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
    this.dropType = <DropType>id.substring(pos + 1);
  }
}
