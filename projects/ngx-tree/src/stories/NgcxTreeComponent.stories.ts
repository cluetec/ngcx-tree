import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgcxTreeComponent } from '../lib/ngcx-tree/ngcx-tree.component';
import {
  TREE_CHILDREN,
  TREE_DATA,
  TREE_DATA_WITHOUT_CHILDREN,
} from '../lib/test/mock-tree-nodes';
import { NgcxSampleTreeNodeContentComponent } from './custom-tree-node-content.component';

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
};

export default meta;
type Story = StoryObj<NgcxTreeComponent>;

export const Default: Story = {
  args: { nodes: TREE_DATA },
};

export const LazyChildLoading: Story = {
  args: {
    nodes: TREE_DATA_WITHOUT_CHILDREN,
    config: {
      loadChildren: (parent) => {
        console.log('loading children of:', parent.node.title);
        return TREE_CHILDREN[parent.node.title!] ?? [];
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
