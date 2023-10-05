import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  NgcxTreeComponent,
  NgcxTreeConfig,
  NgcxTreeNode,
  NgcxTreeNodeMovedEvent,
  NgcxTreeNodeWrapper,
} from 'ngcx-tree';

@Component({
  selector: 'app-NgcxTreeNgTemplateSample',
  templateUrl: './NgcxTreeNgTemplateSample.component.html',
  standalone: true,
  imports: [NgcxTreeComponent],
})
export class NgcxTreeNgTemplateSampleComponent implements OnInit {
  @Input() nodes?: NgcxTreeNode[];
  @Input() config?: NgcxTreeConfig<any>;

  @Output() nodeMoved = new EventEmitter<NgcxTreeNodeMovedEvent<any>>();
  @Output() customEvent = new EventEmitter<any>();
  @Output() clickEvent = new EventEmitter<NgcxTreeNodeWrapper<any>>();
  @Output() selectEvent = new EventEmitter<NgcxTreeNodeWrapper<any>>();

  @ViewChild('treeNodeTemplate', { static: true })
  treeNodeTemplate?: TemplateRef<any>;

  ngOnInit() {
    this.config = {
      ...(this.config ?? {}),
      treeNodeContentTemplate: this.treeNodeTemplate,
    };
  }
  sampleClicked(nodeWrapper: NgcxTreeNodeWrapper<NgcxTreeNode>) {
    this.customEvent.emit('sample button clicked ' + nodeWrapper?.id);
  }
}