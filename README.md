A reusable tree component for Angular based on the CDK Tree and the CDK Drag n
Drop features.

Includes only peer dependencies to angular cdk, no other library included. So
the lib size is pretty small.

# Demo:

[https://cluetec.github.io/ngcx-tree-demo](https://cluetec.github.io/ngcx-tree-demo)

# Feature Overview

- Highly custumizable tree component
  - Configure your Angular Template for node rendering
  - Or configure your own component for node rendering
- Selection state
  - configure which nodes are selectable
- Drag and Drop
  - configure which nodes may be moved
  - configure where a node can be dropped
- Events (always with detailed information about parents, next or prev. nodes):
  - On move
  - On click
  - On select/unselect
  - custom event may be emitted by custom component

Missing features? Let me know :)

# Table of Content

- [Demo:](#demo)
- [Feature Overview](#feature-overview)
- [Table of Content](#table-of-content)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Model](#model)
  - [NgcxTreeConfig](#ngcxtreeconfig)
  - [NgcxTreeNode](#ngcxtreenode)
  - [NgcxTreeNodeWrapper](#ngcxtreenodewrapper)
  - [NgcxTreeNodeMovedEvent](#ngcxtreenodemovedevent)
  - [NgcxCustomComponent](#ngcxcustomcomponent)
    - [Input](#input)
    - [Output](#output)
- [TreeControl - Api](#treecontrol---api)
  - [treeControl](#treecontrol)
  - [Additional Helper methods](#additional-helper-methods)
    - [selectNodeById](#selectnodebyid)
    - [findNodeById](#findnodebyid)
- [Styling](#styling)
  - [Include Styles](#include-styles)
  - [Common styling](#common-styling)
    - [Dotted tree lines](#dotted-tree-lines)
    - [Selection highlighting](#selection-highlighting)
    - [Icon color](#icon-color)
  - [Font Awesome](#font-awesome)
  - [Selection](#selection)
- [Simple Sample](#simple-sample)
- [Contributions](#contributions)
  - [Samples](#samples)

# Getting Started

1. Install the library:

```
npm install @cluetec/ngcx-tree
```

2. Import the component. Since it is standalone, either add it directly to
   another standlone component or import it into your existing `NgModule`:

```ts
import { NgcxTreeComponent } from '@cluetec/ngcx-tree';

@Component({
  standalone: true,
  imports: [NgcxTreeComponent],
})
```

```ts
import { NgcxTreeComponent } from '@cluetec/ngcx-tree';

@NgModule({
  declarations: [AppComponent],
  imports: [NgcxTreeComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```html
<ngcx-tree [nodes]="nodes"></ngcx-tree>
```

# Prerequisites

You need at least angular 16 to use the tree.

<br><br>

# Inputs

| Property | Type                              | required | Description                                                         |
| -------- | --------------------------------- | -------- | ------------------------------------------------------------------- |
| nodes    | [NgcxTreeNode](#NgcxTreeNode)[]   | no       | list of nodes to show in the tree                                   |
| config   | [NgcxTreeConfig](#NgcxTreeConfig) | no       | used to render the node when no custom template or component is set |

# Outputs

| Property    | event content type                                | Description                                                                               |
| ----------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| nodeMoved   | [NgcxTreeNodeMovedEvent](#NgcxTreeNodeMovedEvent) | fired when a node is moved                                                                |
| customEvent | any                                               | may be fired by your own custom component                                                 |
| clickEvent  | [NgcxTreeNodeWrapper](#NgcxTreeNodeWrapper)       | fired when node is clicked                                                                |
| selectEvent | [NgcxTreeNodeWrapper](#NgcxTreeNodeWrapper)       | fired when node is selected or un-selected. Clicking a selected node un-selects the node. |

# Model

## NgcxTreeConfig

The component includes a model called `NgcxTreeConfig` with some basic optional
settings.

- `allowDrag` method that decides if a node can be dragged:
  `(node: NgcxTreeNodeWrapper<T>) => boolean` - all nodes are draggable by
  default<br><br>
- `allowDrop` method that decides if node can be dropped into another node
  `(node: NgcxTreeNodeWrapper<T>, intoNode?: NgcxTreeNodeWrapper<T>) => boolean` -
  every node may be draggable everywhere by default.<br><br>
- `preventDropReason` method that decides if node can be dropped into another
  node
  `(node: NgcxTreeNodeWrapper<T>, intoNode?: NgcxTreeNodeWrapper<T>) => string` -
  every node may be draggable everywhere by default. If a non empty string is
  returned, then the node cannot be dropped and the string will be displayed.
  One of the methods `allowDrop` or `preventDropReason` is sufficient to prevent
  the node to be dropped. <br><br>
- `allowSelection` method that decides if node can be selected
  `(node: NgcxTreeNodeWrapper<T>) => boolean ` - nodes are not selectable by
  default<br><br>
- `treeNodeContentTemplate` Angular TemplateRef that will be used to render a
  node<br><br> `let-nodeWrapper="nodeWrapper"` may be used to access the node
  wrapper to render the node
- `treeNodeContentComponent` Angular Component that will be used to render a
  node. (use `treeNodeContentComponent` or `treeNodeContentTemplate`, but not
  both). see [NgcxCustomComponent<T>](#NgcxCustomComponent)

<br><br>

## NgcxTreeNode

If no data is passed to the component, it will simply display some mock data.
Data is provided to the tree in the following format:

| Property | Type           | required | Description                                                                                                                                 |
| -------- | -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| id       | string         | yes      | necessary unique id of the node                                                                                                             |
| title    | string         | no       | used to render the node when no custom template or component is set                                                                         |
| faIcon   | string         | no       | font awesome icon used to render the node when no custom template or component is set. You must include fontawesome on your own if you want |
| children | NgcxTreeNode[] | no       | children of the node                                                                                                                        |

## NgcxTreeNodeWrapper<T>

Generic T is the same as the elements of the input `nodes`.

| Property     | Type                                | Description                                                                                |
| ------------ | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| id           | string                              | same as NgcxTreeNode.id                                                                    |
| data         | T                                   | data of the input nodes `nodes`                                                            |
| depth        | number                              | depth in the tree starting with 0                                                          |
| index        | number                              | index of the node in it's parent                                                           |
| isSelectable | boolean                             | if the node is selectable. Depending on the config.allowSelection method. (default: false) |
| isFirstChild | boolean                             | is first node from the same parent                                                         |
| isLastChild  | boolean                             | is last node from the same parent                                                          |
| children     | NgcxTreeNodeWrapper<T>[]            | list of children wrappers around the original nodes                                        |
| parent       | NgcxTreeNodeWrapper<T> \| undefined | parent node                                                                                |
| next         | NgcxTreeNodeWrapper<T> \| undefined | node after this node in same parent, if one exists.                                        |
| previous     | NgcxTreeNodeWrapper<T> \| undefined | node before this node in same parent, if one exists.                                       |

## NgcxTreeNodeMovedEvent

| Property   | Type                                | Description                        |
| ---------- | ----------------------------------- | ---------------------------------- |
| node       | NgcxTreeNodeWrapper<T>              | the moved node                     |
| parent     | NgcxTreeNodeWrapper<T> \| undefined | moved into this parent node        |
| afterNode  | NgcxTreeNodeWrapper<T> \| undefined | moved to position after this node  |
| beforeNode | NgcxTreeNodeWrapper<T> \| undefined | moved to position before this node |

## NgcxCustomComponent<T>

Your component can implement this interface and can be set as
`Type<NgcxCustomComponent<T>>` in the config.treeNodeContentComponent input.

### Input

`nodeWrapper` the input to render the node. Type: NgcxTreeNodeWrapper<T>

### Output

`customEvent` `EventEmitter<any>` can be used to trigger the output
'customEvent'

# TreeControl - Api

Access api like this

````ts
import { ViewChild, Component } from '@angular/core';
import { NgcxTreeComponent, NgcxTreeNode } from '@cluetec/ngcx-tree';

@Component({
  selector: 'app-expand-tree-sample',
  template: ```
  <button (click)="expandAll()"></button>
  <ngcx-tree #tree [nodes]="nodes"></ngcx-tree>
  ```,
  standalone: true,
  imports: [NgcxTreeComponent],
})
export class ExpandTreeSampleComponent {
  nodes = [];
  @ViewChild('tree', { static: false })
  ngcxTree: NgcxTreeComponent<NgcxTreeNode>;

  expandAll(): void {
    this.ngcxTree.treeControl.expandAll();
  }
}
````

## treeControl

The treeControl extends the treeControl from Angular CDK
(`NestedTreeControl<NgcxTreeNodeWrapper<T>, string>`) and can mainly be used to
expand and collapse nodes.

## Additional Helper methods

### selectNodeById

Can be called to select a node by id. the selectEvent event is fired afterwards.

### findNodeById

Can be used to get the `NgcxTreeNodeWrapper<T>` for an id. returns `undefined`
if no node is available for the id.

# Styling

## Include Styles

styles.scss and styles.css contains all the parts described below in one file:

```scss
@import 'node_modules/@cluetec/ngcx-tree/styles/styles';
```

## Common styling

you should set the width of cdk-drop-list to 100%, otherwise, the node content
may be on wrong place:

```css
.ngcx-tree .cdk-drop-list {
  width: 100%;
}
```

Or Include this:

```scss
@import 'node_modules/@cluetec/ngcx-tree/styles/ngcx-common';
```

### Dotted tree lines

Import or copy the scss to show tree lines:

```scss
@import 'node_modules/@cluetec/ngcx-tree/styles/ngcx-doted-tree-line';
```

### Selection highlighting

Import or copy the scss to show some selection styling:

```scss
@import 'node_modules/@cluetec/ngcx-tree/styles/ngcx-selection';
```

### Icon color

Import or copy the scss to set the color of the node icon:

```scss
@import 'node_modules/@cluetec/ngcx-tree/styles/ngcx-icon-color';
```

## Font Awesome

Font Awesome is not included here, but to show icons for the nodes you may
include font-awesome on your own and may use the `node.faIcon` property to set
the icon.

Include like this:
[projects/ngcx-tree/stories/styles/styles.scss](projects/ngcx-tree/stories/styles/styles.scss)

## Selection

Selected node can be styled like this:

```css
.tree-node-content-container.selected .tree-node-content {
  background-color: #555;
  padding-left: 5px;
}
```

Hover effect on selectable node:

```css
.ngcx-tree:not(.dragging)
  .tree-node-content-container.is-selectable:hover
  .tree-node-content {
  background-color: #fbfbfb;
}
```

Remove Selection css on dragging element:

```css
.cdk-drag-preview .tree-node-content-container.selected .tree-node-content {
  background-color: inherit;
}
```

# Simple Sample

```ts
import { Component } from '@angular/core';
import { NgcxTreeComponent } from '@cluetec/ngcx-tree';

@Component({
  selector: 'app-simple-tree-sample',
  template: '<ngcx-tree [nodes]="nodes"></ngcx-tree>',
  standalone: true,
  imports: [NgcxTreeComponent],
})
export class SimpleTreeSampleComponent {
  nodes = [
    {
      id: 'fru',
      title: 'Fruit',
      children: [
        {
          id: 'app',
          title: 'Apple',
        },
        {
          id: 'ban',
          title: 'Banana',
        },
      ],
    },
    {
      id: 'fish',
      title: 'Fish',
    },
  ];
}
```

<br><br>

# Contributions

Contributions and improvement suggestions are always welcome!

## Samples

You can run Storybook and see the samples there.

1. `npm run build`
2. `npm run storybook`
