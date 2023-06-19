import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgcxTreeComponent } from '../lib/ngcx-tree/ngcx-tree.component';

const meta: Meta<NgcxTreeComponent> = {
  title: 'Example/NgcxTreeComponent',
  component: NgcxTreeComponent,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/angular/configure/story-layout
    layout: 'fullscreen',
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NgcxTreeComponent, CdkTreeModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<NgcxTreeComponent>;

export const DefaultView: Story = {};
