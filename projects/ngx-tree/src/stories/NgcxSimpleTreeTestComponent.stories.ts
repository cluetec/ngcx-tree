import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgcxTreeComponent } from '../lib/ngcx-tree/ngcx-tree.component';
import { NgcxSimpleTreeTestComponent } from '../lib/test/ngcx-simple-tree-test/ngcx-simple-tree-test.component';

const meta: Meta<NgcxSimpleTreeTestComponent> = {
  title: 'Example/NgcxSimpleTreeTestComponent',
  component: NgcxSimpleTreeTestComponent,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/angular/configure/story-layout
    layout: 'fullscreen',
  },
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        NgcxSimpleTreeTestComponent,
        NgcxTreeComponent,
        CdkTreeModule,
        DragDropModule,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<NgcxSimpleTreeTestComponent>;

export const DefaultView: Story = {};
