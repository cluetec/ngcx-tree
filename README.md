# ngcx-tree

A reusable tree component for Angular based on the CDK Tree and the CDK Drag n
Drop features.

Status is beta - feedback welcome :)

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Model](#model)
  - [`NgcxTreeConfig`](#ngcxtreeconfig)
  - [`NgcxTreeNode`](#ngcxtreenode)
  - [`NgcxTreeNodeWrapper<T>`](#ngcxtreenodewrappert)
  - [`NgcxTreeNodeMovedEvent`](#ngcxtreenodemovedevent)
  - [`NgcxCustomComponent<T>`](#ngcxcustomcomponentt)
    - [Input](#input)
    - [Output](#output)
- [TreeControl - Api](#treecontrol---api)
  - [`treeControl`](#treecontrol)
  - [Additional Helper Methods](#additional-helper-methods)
    - [`selectNodeById`](#selectnodebyid)
    - [`findNodeById`](#findnodebyid)
- [Styling](#styling)
  - [Common styling](#common-styling)
    - [Dotted tree lines](#dotted-tree-lines)
    - [Selection highlighting](#selection-highlighting)
    - [Icon color](#icon-color)
  - [Font Awesome](#font-awesome)
  - [Selection](#selection)
- [Simple sample](#simple-sample)
- [Contributions](#contributions)
  - [Samples in Storybook](#samples-in-storybook)
- [License](#license)

## Getting Started

First you need to add the library as a dependency to your npm/yarn project.

For npm:

```shell
npm install @cluetec/ngcx-tree --save
```

For yarn:

```shell
yarn add @cluetec/ngcx-tree
```

After you included the library to your dependency you can now make use of it. Since it is standalone, you can either add it directly to
another standalone component or import it into your existing `NgModule`.

Standalone:

```ts
import { NgcxTreeComponent } from '@cluetec/ngcx-tree';

@Component({
  standalone: true,
  imports: [NgcxTreeComponent],
})
```

Existing `NgModule`:

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

## Prerequisites

You need at least **Angular 16** to use this library.

## Inputs

| Property |                Type                 | required |                             Description                             |
| -------- | ----------------------------------- | -------- | ------------------------------------------------------------------- |
| `nodes`  | [`NgcxTreeNode[]`](#ngcxtreenode)   | no       | list of nodes to show in the tree                                   |
| `config` | [`NgcxTreeConfig`](#ngcxtreeconfig) | no       | used to render the node when no custom template or component is set |

## Outputs

|   Property    |                 event content type                  |                                        Description                                        |
| ------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `nodeMoved`   | [`NgcxTreeNodeMovedEvent`](#ngcxtreenodemovedevent) | fired when a node is moved                                                                |
| `customEvent` | any                                                 | may be fired by your own custom component                                                 |
| `clickEvent`  | [`NgcxTreeNodeWrapper`](#ngcxtreenodewrappert)       | fired when node is clicked                                                                |
| `selectEvent` | [`NgcxTreeNodeWrapper`](#ngcxtreenodewrappert)       | fired when node is selected or un-selected. Clicking a selected node un-selects the node. |

## Model

### `NgcxTreeConfig`

The component includes a model called `NgcxTreeConfig` with some basic optional
settings:

- `allowDrag` method that decides if a node can be dragged:
  `(node: NgcxTreeNodeWrapper<T>) => boolean` - all nodes are draggable by
  default
- `allowDrop` method that decides if node can be dropped into another node
  `(node: NgcxTreeNodeWrapper<T>, intoNode?: NgcxTreeNodeWrapper<T>) => boolean` -
  every node may be draggable everywhere by default
- `allowSelection` method that decides if node can be selected
  `(node: NgcxTreeNodeWrapper<T>) => boolean` - nodes are not selectable by
  default
- `treeNodeContentTemplate` Angular TemplateRef that will be used to render a
  node
- `let-nodeWrapper="nodeWrapper"` may be used to access the node
  wrapper to render the node
- `treeNodeContentComponent` Angular Component that will be used to render a
  node. (use `treeNodeContentComponent` or `treeNodeContentTemplate`, but not
  both). see [`NgcxCustomComponent<T>`](#ngcxcustomcomponentt)

### `NgcxTreeNode`

If no data is passed to the component, it will simply display some mock data.
Data is provided to the tree in the following format:

|  Property  |       Type        | required |                                                                 Description                                                                  |
| ---------- | ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`       | `string`          | yes      | necessary unique id of the node                                                                                                              |
| `title`    | `string`          | no       | used to render the node when no custom template or component is set                                                                          |
| `faIcon`   | `string`          | no       | font awesome icon used to render the node when no custom template or component is set. You must include font awesome on your own if you want |
| `children` | `NgcxTreeNode[]` | no       | children of the node                                                                                                                         |

### `NgcxTreeNodeWrapper<T>`

Generic `T` is the same as the elements of the input `nodes`.

| Property       | Type                                  | Description                                                                                  |
| -------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `id`           | `string`                              | same as NgcxTreeNode.id                                                                      |
| `data`         | `T`                                   | data of the input nodes `nodes`                                                              |
| `depth`        | `number`                              | depth in the tree starting with 0                                                            |
| `index`        | `number`                              | index of the node in it's parent                                                             |
| `isSelectable` | `boolean`                             | if the node is selectable. Depending on the `config.allowSelection` method. (default: false) |
| `isFirstChild` | `boolean`                             | is first node from the same parent                                                           |
| `isLastChild`  | `boolean`                             | is last node from the same parent                                                            |
| `children`     | `NgcxTreeNodeWrapper<T>[]`            | list of children wrappers around the original nodes                                          |
| `parent`       | `NgcxTreeNodeWrapper<T> \| undefined` | parent node                                                                                  |
| `next`         | `NgcxTreeNodeWrapper<T> \| undefined` | node after this node in same parent, if one exists.                                          |
| `previous`     | `NgcxTreeNodeWrapper<T> \| undefined` | node before this node in same parent, if one exists.                                         |

### `NgcxTreeNodeMovedEvent`

| Property     | Type                                  | Description                        |
| ------------ | ------------------------------------- | ---------------------------------- |
| `node`       | `NgcxTreeNodeWrapper<T>`              | the moved node                     |
| `parent`     | `NgcxTreeNodeWrapper<T> \| undefined` | moved into this parent node        |
| `afterNode`  | `NgcxTreeNodeWrapper<T> \| undefined` | moved to position after this node  |
| `beforeNode` | `NgcxTreeNodeWrapper<T> \| undefined` | moved to position before this node |

### `NgcxCustomComponent<T>`

Your component can implement this interface and can be set as
`Type<NgcxCustomComponent<T>>` in the `config.treeNodeContentComponent` input.

#### Input

`nodeWrapper`: the input to render the node. Type: [`NgcxTreeNodeWrapper<T>`](#ngcxtreenodewrappert)

#### Output

`customEvent`: `EventEmitter<any>` can be used to trigger the output

## TreeControl - Api

Access api like this

```ts
import { ViewChild, Component} from '@angular/core';
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
```

### `treeControl`

The `treeControl` extends the `treeControl` from Angular CDK
(`NestedTreeControl<NgcxTreeNodeWrapper<T>, string>`) and can mainly be used to
expand and collapse nodes.

### Additional Helper Methods

#### `selectNodeById`

Can be called to select a node by id. The `selectEvent` event is fired afterwards.

#### `findNodeById`

Can be used to get the `NgcxTreeNodeWrapper<T>` for an id. Returns `undefined`
if no node is available for the id.

## Styling

`styles.scss` and `styles.css` contains all the parts described below in one file:

```scss
@import 'node_modules/@cluetec/ngcx-tree/styles/styles';
```

### Common styling

You should set the `width` of `cdk-drop-list` to `100%`, otherwise the node content
may be in the wrong place:

```css
.ngcx-tree .cdk-drop-list {
  width: 100%;
}
```

Or include this:

```scss
@import 'node_modules/@cluetec/ngcx-tree/styles/ngcx-common';
```

#### Dotted tree lines

Import or copy the scss to show tree lines:

```scss
@import 'node_modules/@cluetec/ngcx-tree/styles/ngcx-doted-tree-line';
```

#### Selection highlighting

Import or copy the scss to show some selection styling:

```scss
@import 'node_modules/@cluetec/ngcx-tree/styles/ngcx-selection';
```

#### Icon color

Import or copy the scss to set the color of the node icon:

```scss
@import 'node_modules/@cluetec/ngcx-tree/styles/ngcx-icon-color';
```

### Font Awesome

Font Awesome is not referenced included here. To display icons for the nodes
you have to include font-awesome yourself and may use the `node.faIcon` property
to set the icon.

Include like this:
[projects/ngcx-tree/stories/styles/styles.scss](projects/ngcx-tree/stories/styles/styles.scss)

### Selection

To style the selected node you can follow this approach:

```css
.tree-node-content-container.selected .tree-node-content {
  background-color: #555;
  padding-left: 5px;
}
```

To style the hover effect on selectable node you can do it like this:

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

## Simple sample

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

## Contributions

Contributions and improvement suggestions are always welcome!

### Samples in Storybook

You can run Storybook and see the samples there.

1. `npm run build`
2. `npm run storybook`

## License

The project is licensed under the ["MIT"](./LICENSE) license.
