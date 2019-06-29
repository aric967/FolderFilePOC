import { Component, ViewChild, OnInit, AfterViewInit, Pipe, PipeTransform } from '@angular/core';
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
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  fileList = [];
  showList = [];
  selectedFolderList = [];
  folders1 = [];
  uniqueId = 0;
  folders = [];
  currentId = 0;
  /* folders = [
    {
      name: 'folder1',
      id: '1',
      level: 1,
      type: 'folder',
      childId: ['3', '4']
    },
    {
      name: 'folder2',
      type: 'folder',
      level: 1,
      id: '2',
      childId: ['5']
    },
    {
      name: 'file1',
      type: 'file',
      parentId: 1,
      level: 2,
      id: '3',
    },
    {
      name: 'file12323',
      type: 'file',
      parentId: 1,
      level: 2,
      id: '4',
    },
    {
      name: '323',
      type: 'file',
      level: 2,
      parentId: 2,
      id: '5',
    }
  ]; */
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

  ngOnInit() {
    console.log('B ngOnInit');
    // this.showList = _.filter(this.folders, { level: this.level });
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
        // trigger: '#uppyModalOpener',
        target: '.DashboardContainer',
        inline: true,
        // target: '.DashboardContainer',
        replaceTargetContent: true,
        showProgressDetails: true,
        // note: 'Images and video only, 2–3 files, up to 1 MB',
        height: 470,
        metaFields: [
          { id: 'name', name: 'Name', placeholder: 'file name' },
          { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' }
        ],
        browserBackButtonClose: true
      })
      .use(GoogleDrive, { target: Dashboard, companionUrl: window.location.origin })
      .use(Dropbox, { target: Dashboard, companionUrl: window.location.origin });

    uppy.on('complete', result => {
      console.log('successful files:', result.successful);
      console.log('failed files:', result.failed);
    });
  }

  selectDirectory(file) {
    if (file.type === 'folder') {
      this.selectedFolderList.push(file);
      this.currentId = file.id;
      if (file.childId.length === 0) {
        this.showList = [];
        file.childId = [];
      } else {
        this.showList = [];
        _.map(file.childId, (item) => {
          console.log(item);
          const obj = _.find(this.folders, { id: item });
          console.log(obj);
          this.showList.push(obj);
        });
      }
    }
  }

  recursiveFile(dir, parentId) {
    if (dir.isDirectory) {
      const dirReader = dir.createReader();
      console.log(dirReader);
      this.fileList.push(dir.name);
      dirReader.readEntries((entries) => {
        for (let j = 0; j < entries.length; j++) {
          console.log(entries[j]);
          const directory = entries[j];
          if (!directory.isDirectory) {
            this.fileList.push(directory.name);
            console.log(directory.name, parentId);
            const uniqueIdChild = this.uniqueId++;
            this.folders.push({ name: directory.name, type: 'file', id: uniqueIdChild, parentId: parentId, childId: [] });
            const parentChildId = _.find(this.folders, { id: parentId });
            parentChildId.childId.push(uniqueIdChild);
          } else {
            console.log(directory);
            const uniqueId = this.uniqueId++;
            console.log(directory.name, uniqueId);
            this.folders.push({ name: directory.name, type: 'folder', id: uniqueId, parentId: parentId, childId: [] });
            const folderParentChildId = _.find(this.folders, { id: parentId });
            folderParentChildId.childId.push(uniqueId);
            this.recursiveFile(directory, uniqueId);
          }
        }
      });
    } else {
      console.log(dir);
    }
  }

  onDrop(event) {
    event.preventDefault();
    if (event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        const dir = event.dataTransfer.items[i].webkitGetAsEntry();
        if (dir.isDirectory) {
          const uniqueId = this.uniqueId++;
          console.log(dir.name, uniqueId);
          this.folders.push({ name: dir.name, type: 'folder', id: uniqueId, parentId: this.currentId, childId: [] });
          const folderParentChildId = _.find(this.folders, { id: this.currentId });
          folderParentChildId.childId.push(uniqueId);
          this.recursiveFile(dir, uniqueId);
        } else {
          const file = event.dataTransfer.items[i].getAsFile();
          console.log(file.name);
          // fd.append(file.name, file);
          this.fileList.push(file.name);
          const uniqueId = this.uniqueId++;
          this.folders.push({ name: file.name, type: 'file', id: uniqueId, parentId: this.currentId, childId: [] });
          const parentChildId = _.find(this.folders, { id: this.currentId });
          parentChildId.childId.push(uniqueId);
        }
      }
      setTimeout(() => {
        this.showList = _.filter(this.folders, { parentId: this.currentId });
      }, 2000);
    }
    console.log('end');
  }
  onDrop1(event) {
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
          // this.showList.push({ name: event.dataTransfer.files[i].name, type: 'file', id: this.uniqueId++, parentId: this.currentId });
          this.folders.push({ name: event.dataTransfer.files[i].name, type: 'file', id: this.uniqueId++, parentId: this.currentId });
          this.showList = _.filter(this.folders, { parentId: this.currentId });

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

  backToPrev(index) {
    if (index === undefined) {
      this.showList = _.filter(this.folders, { root: true });
      this.selectedFolderList = [];
      return;
    }
    this.selectedFolderList = _.slice(this.selectedFolderList, 0, index + 1);
    this.currentId = _.last(this.selectedFolderList).id;
    const root = this.selectedFolderList.length === 0;
    if (root) {
      this.showList = _.filter(this.folders, { root: true });
    } else {
      this.showList = _.filter(this.folders, { parentId: this.currentId });
    }
  }

  addFolder() {
    const id = this.uniqueId++;
    const root = this.selectedFolderList.length === 0;
    // tslint:disable-next-line:max-line-length
    this.folders.push(
      {
        name: 'new folder' + id,
        type: 'folder',
        id: id,
        parentId: root ? null : this.currentId,
        childId: [],
        root
      }
    );

    if (!root) {
      const ids = _.find(this.folders, { id: this.currentId });
      ids.childId.push(id);
    }

    if (root) {
      this.showList = _.filter(this.folders, { root: true });
    } else {
      this.showList = _.filter(this.folders, { parentId: this.currentId });
    }
  }
}


/* var dirReader= event.dataTransfer.items[0].webkitGetAsEntry().createReader()
    dirReader.readEntries(function(entries) {
      for (var i=0; i<entries.length; i++) {
        console.log(entries)
      }
    });
 */
@Pipe({ name: 'exponentialStrength' })
export class ExponentialStrengthPipe implements PipeTransform {
  transform(value: number, level?: number): number {
    console.log(value);
    console.log(level);
    return value;
  }
}
