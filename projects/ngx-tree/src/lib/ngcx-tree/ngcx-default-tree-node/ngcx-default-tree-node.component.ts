import { Component, Input, OnInit } from '@angular/core';
import { TreeNodeComponent, TreeNodeWrapper } from '../../ngcx-tree-models';

@Component({
  selector: 'ngcx-default-tree-node',
  templateUrl: './ngcx-default-tree-node.component.html',
  styleUrls: ['./ngcx-default-tree-node.component.scss'],
})
export class NgcxDefaultTreeNodeComponent implements OnInit, TreeNodeComponent {
  @Input()
  nodeWrapper?: TreeNodeWrapper;

  constructor() {}

  ngOnInit() {}
}
