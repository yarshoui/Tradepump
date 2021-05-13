import { action, decorate, observable } from 'mobx';
import { apiErrorGuard, fetchData } from 'src/utils/apiUtils';

export interface UserModel {
  user_id: number;
  user_name: string;
}

export const userGuard = (model: any): model is UserModel => 
  model &&
  model.user_id > 0;

export class UserStore {
  initializing: boolean;
  errorMessage?: string;
  user?: UserModel;

  constructor() {
    this.initializing = true;
    this.checkAuth();
  }

  async checkAuth() {
    const data = await fetchData<UserModel>('/api/v1/user/login');

    this.initializing = false;
    if (userGuard(data)) {
      this.user = data;
    }
  }

  async signIn(login: string, password: string) {
    this.initializing = true;
    try {
      const data = await fetchData<UserModel>('/api/v1/user/login', {
        method: 'POST',
        body: JSON.stringify({ login, password }),
      });

      this.initializing = false;
      if (apiErrorGuard(data)) {
        this.errorMessage = data.error;
      } else {
        this.user = data;
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
    await fetchData('/api/v1/user/logout');
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
