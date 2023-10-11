import type { Meta, StoryObj } from '@storybook/angular';
import { NgcxTreeNgTemplateSampleComponent } from './NgcxTreeNgTemplateSample/ngcx-tree-ng-template-sample.component';
import { TREE_DATA } from './mock-tree-nodes';

const meta: Meta<NgcxTreeNgTemplateSampleComponent> = {
  title: 'Example/NgTemplateSample',
  component: NgcxTreeNgTemplateSampleComponent,
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
type Story = StoryObj<NgcxTreeNgTemplateSampleComponent>;

export const Default: Story = {
  args: { nodes: TREE_DATA },
};
