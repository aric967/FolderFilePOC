import { Component, ViewChild, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ContextMenuComponent } from 'ngx-contextmenu';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  fileList = [];
  showList = [];
  folders = [
    {
      name: 'folder1',
      id: '1',
      type: 'folder',
      files: [{
        name: 'micrst.doc',
        type: 'file',
        id: '1a',
      }, {
        name: 'micrst1.pdf',
        type: 'file',
        id: '2a',
      }, {
        name: 'micrsts.doc',
        type: 'file',
        id: '3a',
      }, {
        name: 'micrstsdsdsd.doc',
        type: 'file',
        id: '4a',
      }]
    }, {
      name: 'folder2',
      type: 'folder',
      id: '2',
      files: [{
        name: 'juggish.doc',
        type: 'file',
        id: '1aasd',
      }, {
        name: 'juggishrst1.pdf',
        type: 'file',
        id: '23423a',
      }, {
        name: 'juggisfsdh.doc',
        type: 'file',
        id: '3a43re',
      }, {
        name: 'juggissh.doc',
        type: 'file',
        id: '4adsfsdfsd',
      }]
    }
  ];
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

  ngOnInit() {
    console.log('B ngOnInit');
    this.showList = this.folders;
  }
  selectDirectory(file) {
    this.showList = file.files;
  }
  onDrop(event) {
    event.preventDefault();
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      const fd = new FormData();
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          const file = event.dataTransfer.items[i].getAsFile();
          console.log(file);
          console.log('... file[' + i + '].name = ' + file.name);
          fd.append(file.name, file);
          this.fileList.push(event.dataTransfer.files[i].name);
        }
      }
      console.log(fd);
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
        this.fileList.push(event.dataTransfer.files[i].name);
      }
    }
  }
  dragOver(event) {
    console.log('File(s) in drop zone');
    event.preventDefault();
  }
  onRightClick() {
    console.log('right click event fired');
    event.preventDefault();
  }

  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    // this.contextMenu.menuData = { 'item': item };
    this.contextMenu.openMenu();
  }

  onContextMenuAction1(item: any) {
    alert(`Click on Action 1 for ${item.name}`);
  }

  onContextMenuAction2(item: any) {
    alert(`Click on Action 2 for ${item.name}`);
  }

  showMessage() {

  }
}
