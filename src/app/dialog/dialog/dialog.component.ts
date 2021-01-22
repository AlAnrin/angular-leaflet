import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {DialogService} from '../dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit, OnDestroy {
  @Input() id: string;
  private readonly element: any;

  constructor(private dialogService: DialogService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    document.body.appendChild(this.element);

    // this.element.addEventListener('click', el => {
    //   if (el.target.className === 'app-dialog') {
    //     this.close();
    //   }
    // });

    this.dialogService.add(this);
  }

  ngOnDestroy(): void {
    this.dialogService.remove(this.id);
    this.element.remove();
  }

  open(): void {
    this.element.style.display = 'block';
    document.body.classList.add('app-dialog-open');
  }

  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('app-dialog-open');
  }
}
