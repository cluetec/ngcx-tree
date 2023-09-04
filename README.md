# @cluetec/ngcx-tree

A reusable tree component for Angular based on the CDK Tree and the CDK Drag n
Drop features.

<br><br> Status is beta - feedback welcome :)

## Getting Started

1. Install the library: <br>`npm install @cluetec/ngcx-tree` <br>

2. Import the component. Since it is standalone, either add it directly to
   another standlone component or import it into your existing `NgModule`:

```
import { NgcxTreeComponent } from '@cluetec/ngcx-tree';

@Component({
  standalone: true,
  imports: [NgcxTreeComponent],
})
```

```
import { NgcxTreeComponent } from '@cluetec/ngcx-tree';

@NgModule({
  declarations: [AppComponent],
  imports: [NgcxTreeComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

<br><br>

## Config

The component includes a model called `TreeConfig` with some basic settings.

- `allowDrag` method that decides if a node can be dragged:
  `(node: NgcxTreeNodeWrapper<T>) => boolean` - all nodes are draggable by
  default<br><br>
- `allowDrop` method that decides if node can be dropped into another node
  `(node: NgcxTreeNodeWrapper<T>, intoNode?: NgcxTreeNodeWrapper<T>) => boolean ` -
  every node may be draggable everywhere by default<br><br>
- `treeNodeContentTemplate` Angular TemplateRef that will be used to render a
  node<br><br>
- `treeNodeContentComponent` Angular Component that will be used to render a
  node. (use `treeNodeContentComponent` or `treeNodeContentTemplate`, but not
  both)

<br><br>

## Data

If no data is passed to the component, it will simply display some mock data.
Data is provided to the tree in the following format:

| Property | Type       | required              | Description                                                                                                                                 |
| -------- | ---------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| id       | string     | yes                   | necessary unique id of the node                                                                                                             |
| title    | string     | no                    | used to render the node when no custom template or component is set                                                                         |
| faIcon   | string     | no                    | font awesome icon used to render the node when no custom template or component is set. You must include fontawesome on your own if you want |
| children | TreeNode[] | yes, but can be empty | childrn of the node                                                                                                                         |

<br><br>

## Contributions

Contributions and improvement suggestions are always welcome!

## Samples

for samples see the storybook stories. run `npm run storybook` to see the
samples.
