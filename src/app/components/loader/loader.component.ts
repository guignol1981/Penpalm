import {Component, Input, OnInit} from '@angular/core';

export enum ELoader {
  Wheel,
  Dots
}

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() load = false;
  @Input() type = ELoader.Wheel;
  eLoader = ELoader;

  constructor() { }

  ngOnInit() {
  }

}
