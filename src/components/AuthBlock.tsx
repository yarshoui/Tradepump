import React from 'react';
import { observer } from 'mobx-react';
import { UserStore } from 'src/logic/userStore';

interface Props {
  store: UserStore;
}

class AuthBlockComp extends React.PureComponent<Props> {

  onLogout = () => {
    this.props.store.logout();
  };

  onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as typeof event.target & {
      login: HTMLInputElement,
      password: HTMLInputElement,
    };
    const login = target.login.value;
    const password = target.password.value;

    this.props.store.signIn(login, password);
  };
  

  render() {
    const { store } = this.props;

    if (store.initializing) {
      return <div>Loading...</div>;
    }
    if (!store.user) {
      return (
        <form className="login-form" onSubmit={this.onSubmit}>
          <label htmlFor="login">
            Login:
            <input type="text" name="login" />
          </label>
          <label htmlFor="password">
            Password:
            <input type="password" name="password" />
          </label>
          <button type="submit">Login</button>
        </form>
      );
    }

    return (
      <div>
        <span>Welcome {store.user?.name}</span>{' '}
        <button onClick={this.onLogout}>Logout</button>
      </div>
    );
  }
}

export const AuthBlock = observer(AuthBlockComp);
