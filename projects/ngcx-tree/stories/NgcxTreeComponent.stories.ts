import type { Meta, StoryObj } from '@storybook/angular';
import {
  NgcxTreeNode,
  NgcxTreeNodeWrapper,
} from '../src/lib/ngcx-tree/ngcx-tree-models';
import { NgcxTreeComponent } from '../src/lib/ngcx-tree/ngcx-tree.component';
import { NgcxSampleTreeNodeContentComponent } from './custom-tree-node-content.component';
import { TREE_DATA, TREE_DATA_WITH_ICONS } from './mock-tree-nodes';

const meta: Meta<NgcxTreeComponent<NgcxTreeNode>> = {
  title: 'Example/NgcxTreeComponent',
  component: NgcxTreeComponent,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/angular/configure/story-layout
    layout: 'fullscreen',
  },
  argTypes: {
    clickEvent: { action: 'clickEvent' },
    selectEvent: { action: 'selectEvent' },
    nodeMoved: { action: 'nodeMoved' },
    customEvent: { action: 'customEvent' },
  },
};
export default meta;
type Story = StoryObj<NgcxTreeComponent<NgcxTreeNode>>;

export const Default: Story = {
  args: { nodes: TREE_DATA },
};

export const Icons: Story = {
  args: {
    nodes: TREE_DATA_WITH_ICONS,
  },
};

export const Selection: Story = {
  args: {
    nodes: TREE_DATA,
    config: {
      allowSelection: (_node: NgcxTreeNodeWrapper<NgcxTreeNode>): boolean => {
        return true;
      },
    },
  },
};

export const CustomComponent: Story = {
  args: {
    nodes: TREE_DATA,
    config: {
      treeNodeContentComponent: NgcxSampleTreeNodeContentComponent,
    },
  },
};

export const MaxThreeLayersAndMoveLeafsOnly: Story = {
  args: {
    nodes: TREE_DATA,
    config: {
      allowDrop: (
        _node: NgcxTreeNodeWrapper<NgcxTreeNode>,
        intoNode?: NgcxTreeNodeWrapper<NgcxTreeNode>
      ): boolean => {
        return !intoNode || intoNode.depth + 1 < 3;
      },
      allowDrag: (node: NgcxTreeNodeWrapper<NgcxTreeNode>): boolean => {
        return !node.children || node.children.length === 0;
      },
    },
  },
};

export const MaxTwoLayersWithReason: Story = {
  args: {
    nodes: TREE_DATA,
    config: {
      preventDropReason: (
        _node: NgcxTreeNodeWrapper<NgcxTreeNode>,
        intoNode?: NgcxTreeNodeWrapper<NgcxTreeNode>
      ): string | undefined => {
        return !intoNode || intoNode.depth + 1 < 2
          ? undefined
          : 'Only two layers are allowed';
      },
    },
  },
};
