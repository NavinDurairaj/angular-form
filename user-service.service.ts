import { Injectable } from '@angular/core';
import { User } from './model/user';

@Injectable({
    providedIn: 'root'
})
export class UserServiceService {

    constructor() { }

   addUser(user: User) {
      let users: any[] = [];
      localStorage.setItem('Users', JSON.stringify(users));
    }
}