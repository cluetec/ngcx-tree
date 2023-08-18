import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgcxTreeComponent } from '../src/lib/ngcx-tree/ngcx-tree.component';
import { TreeNodeWrapper } from '../src/public-api';
import { NgcxSampleTreeNodeContentComponent } from './custom-tree-node-content.component';
import { TREE_DATA, TREE_DATA_WITH_ICONS } from './mock-tree-nodes';

const meta: Meta<NgcxTreeComponent> = {
  title: 'Example/NgcxTreeComponent',
  component: NgcxTreeComponent,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/angular/configure/story-layout
    layout: 'fullscreen',
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NgcxTreeComponent, CdkTreeModule, DragDropModule],
    }),
  ],
  render: (component: NgcxTreeComponent) => ({
    props: {
      ...component,
      clickEvent: action('clickEvent'),
      customEvent: action('customEvent'),
      nodeMoved: action('nodeMoved'),
    },
  }),
};
export default meta;
type Story = StoryObj<NgcxTreeComponent>;

export const Default: Story = {
  args: { nodes: TREE_DATA },
};

export const MaxThreeLayersAndMoveLeafsOnly: Story = {
  args: {
    nodes: TREE_DATA,
    config: {
      allowDrop: (
        _node: TreeNodeWrapper,
        intoNode?: TreeNodeWrapper
      ): boolean => {
        return !intoNode || intoNode.depth + 1 < 3;
      },
      allowDrag: (node: TreeNodeWrapper): boolean => {
        return !node.children || node.children.length === 0;
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

export const WithIcons: Story = {
  args: {
    nodes: TREE_DATA_WITH_ICONS,
  },
};
