import { Component, OnInit } from '@angular/core';
import { NgcxTreeComponent } from '../ngcx-tree/ngcx-tree.component';
import { TREE_DATA } from './mock-tree-nodes';

@Component({
  selector: 'ngcx-tree-test',
  templateUrl: './ngcx-tree-test.component.html',
  styleUrls: ['./ngcx-tree-test.component.scss'],
  standalone: true,
  imports: [NgcxTreeComponent],
})
export class NgcxTreeTestComponent implements OnInit {
  nodes = TREE_DATA;

  constructor() {}

  ngOnInit() {}
}
