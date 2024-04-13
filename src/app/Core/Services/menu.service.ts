import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public activeItem: any;
  public isUserLoggedIn:any;

  constructor() { }

  public menuModel(userRole:any="") : any[]{
    this.isUserLoggedIn=localStorage.getItem("accessToken");

    if(userRole == "Driver"){
      if(this.isUserLoggedIn != null){
        return [
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            routerLink: '/main/authentication/login',
            command: (event: any) => this.logout()
          }
        ]
      }else{
        return [
          {
            label: 'Login',
            icon: 'pi pi-sign-out',
            routerLink: '/main/authentication/login',
          }
        ];
      }
    }else{
      if(this.isUserLoggedIn != null){
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
                label: 'Plans',
                icon: 'pi pi-fw pi-book',
                routerLink: '/main/user-management/plan',
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
            command: (event: any) => this.logout()
          }
        ];
      }else{
        return [
          {
            label: 'Login',
            icon: 'pi pi-sign-out',
            routerLink: '/main/authentication/login',
          }
        ];
      }
    }
  }

  private logout(){
    localStorage.clear();
  }
}
