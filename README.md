# @cluetec/ngcx-tree

A reusable tree component for Angular based on the CDK Tree and the CDK Drag n
Drop features.

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

- `nodePadding` (default: 40, in px): The amount of left padding on each nested
  node (the data is displayed as a flat tree).<br><br>
- `expandDelay` (default: 1000, in ms): time before a given node expands<br><br>
- `allowDepthChange` (default: false, boolean): whether a user can change the
  depth of a given tree node, i.e. move between levels 1 and 2 instead of only
  within the same level.<br><br>
- `enableDragging` (default: true, boolean): whether a user is allowed to drag
  and change node positions. Enabled by default, but the tree can be used as a
  static display of data instead.

<br>
If the user attempts to change the depth of a node, a attemptedDepthChange event is emitted as a boolean.

<br><br>

## Data

If no data is passed to the component, it will simply display some mock data.
Data is provided to the tree in the following format:

| Property    | Type       | required              |
| ----------- | ---------- | --------------------- |
| id          | string     | yes                   |
| title       | string     | yes                   |
| description | string     | no                    |
| children    | TreeNode[] | yes, but can be empty |

<br><br>

## Contributions

Contributions and improvement suggestions are always welcome!
