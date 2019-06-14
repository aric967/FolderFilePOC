import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ContextMenuComponent } from 'ngx-contextmenu';
import * as _ from 'lodash';
import * as Uppy from '@uppy/core';
import * as Dashboard from '@uppy/dashboard';
import * as GoogleDrive from '@uppy/google-drive';
import * as Dropbox from '@uppy/dropbox';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit  {
  title = 'app';
  fileList = [];
  showList = [];
  selectedFolderList = [];
  folders1 = [];
  uniqueId = 0;
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
    // this.showList = this.folders;
  }

  ngAfterViewInit() {
    const uppy = Uppy({
      debug: true,
      autoProceed: false,
      /* restrictions: {
        maxFileSize: 1000000,
        maxNumberOfFiles: 3,
        minNumberOfFiles: 2,
        allowedFileTypes: ['image/*', 'video/*']
      } */
    })
      .use(Dashboard, {
        trigger: '#uppyModalOpener',
        // inline: true,
        // target: '.DashboardContainer',
        // replaceTargetContent: true,
        // showProgressDetails: true,
        // note: 'Images and video only, 2–3 files, up to 1 MB',
        height: 470,
        metaFields: [
          { id: 'name', name: 'Name', placeholder: 'file name' },
          { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' }
        ],
        browserBackButtonClose: true
      })
      .use(GoogleDrive, { target: Dashboard, companionUrl: 'http://localhost:8080' })
      .use(Dropbox, { target: Dashboard, companionUrl: 'http://localhost:8080' });

    uppy.on('complete', result => {
      console.log('successful files:', result.successful);
      console.log('failed files:', result.failed);
    });
  }

  selectDirectory(file) {
    if (file.type === 'folder') {
      if (this.selectedFolderList.indexOf(file.name) === -1) {
        this.selectedFolderList.push(file.name);
      }
      this.showList = file.files;
    }
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
          this.showList.push({ name: event.dataTransfer.files[i].name, type: 'file', id: this.uniqueId++ });
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
  backToPrev() {
    this.selectedFolderList = [];
    this.showList = this.folders1;
  }

  addFolder() {
    const id = this.uniqueId++;
    this.folders1.push({ name: 'new folder' + id, type: 'folder', id, files: [] });
    this.showList = this.folders1;
  }
}
/* var dirReader= event.dataTransfer.items[0].webkitGetAsEntry().createReader()
    dirReader.readEntries(function(entries) {
      for (var i=0; i<entries.length; i++) {
        console.log(entries)
      }
    });
 */
