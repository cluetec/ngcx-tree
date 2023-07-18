import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgcxTreeTestComponent } from '../lib/ngcx-tree-test/ngcx-tree-test.component';
import { NgcxTreeComponent } from '../lib/ngcx-tree/ngcx-tree.component';

const meta: Meta<NgcxTreeTestComponent> = {
  title: 'Example/NgcxTreeTestComponent',
  component: NgcxTreeTestComponent,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/angular/configure/story-layout
    layout: 'fullscreen',
  },
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        NgcxTreeTestComponent,
        NgcxTreeComponent,
        CdkTreeModule,
        DragDropModule,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<NgcxTreeTestComponent>;

export const DefaultView: Story = {};
