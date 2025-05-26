import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-policy',
  imports: [NavbarComponent,CommonModule,NgSelectModule, FormsModule],
  templateUrl: './view-policy.component.html',
  styleUrl: './view-policy.component.scss'
})

export class ViewPolicyComponent {
  cities = [
    { id: 'sf', name: 'San Francisco' },
    { id: 'ny', name: 'New York' },
    { id: 'se', name: 'Seattle' },
    { id: 'la', name: 'Los Angeles' },
    { id: 'ch', name: 'Chicago' }
  ];

  selectedCity: any;
}

