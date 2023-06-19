import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NgxTreeComponent } from 'ngx-tree';
import { NgcxTreeComponent } from '../lib/ngcx-tree/ngcx-tree.component';

const meta: Meta<NgxTreeComponent> = {
  title: 'Example/NgxTreeComponent',
  component: NgxTreeComponent,
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
type Story = StoryObj<NgxTreeComponent>;

export const DefaultView: Story = {};
