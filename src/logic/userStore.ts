import { action, decorate, observable } from 'mobx';

export interface UserModel {
  id: number;
  name: string;
}

export class UserStore {
  initializing: boolean;
  errorMessage?: string;
  user?: UserModel;

  constructor() {
    this.initializing = true;
    this.checkAuth();
  }

  async checkAuth() {
    const data = await fetch('/api/v1/user/login', { credentials: 'include' }).then(res => res.json());

    this.initializing = false;
    if (data.id) {
      this.user = data as UserModel;
    }
  }

  async signIn(login: string, password: string) {
    this.initializing = true;
    try {
      const data = await fetch('/api/v1/user/login', {
        method: 'POST',
        body: JSON.stringify({ login, password }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json; encoding=utf-8',
        },
      }).then(res => res.json());

      this.initializing = false;
      if (data.error) {
        this.errorMessage = data.error;
      } else {
        this.user = data as UserModel;
        this.errorMessage = undefined;
      }
    } catch (err) {
      this.initializing = false;
      this.errorMessage = err.message;
    }
  }

  async logout() {
    this.user = undefined;
    this.errorMessage = undefined;
    await fetch('/api/v1/user/logout');
  }
}

decorate(UserStore, {
  user: observable,
  initializing: observable,
  errorMessage: observable,
  signIn: action,
  logout: action,
});

export const userStore = new UserStore();
