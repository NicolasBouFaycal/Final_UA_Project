import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  activeItem: any;

  constructor() { }

  public menuModel() : any[]{
    return [
      {
        label: 'User Manager',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-fw pi-user-edit',
            routerLink:"/main/user-management/edit-profile",
            command: (e: { item: any; }) => this.activeItem = e.item,
          },
          {
            label: 'Payment',
            icon: 'pi pi-fw pi-dollar',
            routerLink: '/main/user-management/payment',
            command: (e: { item: any; }) => this.activeItem = e.item,

          },
          {
            label: 'Change Your Password',
            icon: 'pi pi-fw pi-file-edit',
            routerLink: '/main/user-management/edit-password',
            command: (e: { item: any; }) => this.activeItem = e.item,
          },
        ],
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        routerLink: '/main/authentication/login',
        command: (e: { item: any; }) => this.activeItem = e.item,
      }
    ];
  }
}
