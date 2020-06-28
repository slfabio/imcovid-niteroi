import { Component, Input } from '@angular/core';

@Component({
  selector: 'decreto',
  templateUrl: './decreto.component.html',
  styleUrls: ['./decreto.component.scss']
})
export class DecretoComponent {

  @Input() exibeDecreto: boolean;

}
