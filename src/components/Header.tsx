import React from 'react';
import { NavLink } from 'react-router-dom';
import 'src/css/index.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
import { Clock } from 'src/components/logic/Clock';
import { UserStore } from 'src/logic/userStore';
import { observer } from 'mobx-react';
// import { startTourAgain } from 'src/components/intro/config';

const groupMenus: Record<string, string[][]> = {
  Administrators: [
    ['/users', 'Users'],
  ],
};

interface Props {
  store: UserStore;
}

class HeaderComp extends React.PureComponent<Props> {
  logout = (e: React.MouseEvent) => {
    e.preventDefault();
    this.props.store.logout();
  };

  renderRoleMenu() {
    const { user } = this.props.store;

    if (user === undefined) return null;
    const menus = user.user_groups.flatMap(item => groupMenus[item]);

    return menus.map(([link, label]) => (
      <NavLink key={link} to={link}>
        {label}
      </NavLink>
    ));
  }

  renderUserMenu() {
    return (<>
      <li>
        {this.renderRoleMenu()}
        <NavLink to="/logout" onClick={this.logout}>
          Logout
        </NavLink>
      </li>
    </>);
  }

  renderAuthMenu() {
    if (this.props.store.user) {
      return this.renderUserMenu();
    }

    return (<>
      <li>
        <NavLink to="/sign-up">
          Sign-Up
        </NavLink>
      </li>
      <li>
        <NavLink to="/sign-in">
          Sign-In
        </NavLink>
      </li>
    </>);
  }

  render() {
    return (
      <div>
        <ul className="nav">
        {/* <li>
            <a className="active" href="/">
              Orders Monitor
            </a>
          </li>
          <li>
            <a className="disabled" href="/#dumpLink">
              Market Monitor
            </a>
          </li>
          <li>
            <a className="disabled" href="/history">
              Trade History
            </a>
          </li>
          <li>
            <a className="disabled" href="/#dumpLink">
              Market Statistics
            </a>
          </li> */}



          <li>
            <NavLink to="/monitor">
              Orders Monitor
            </NavLink>
          </li>
          <li>
            <NavLink to="/about">
              About
            </NavLink>
          </li>
          {this.renderAuthMenu()}
            {/* <li>
            <NavLink className="nonActive" to="/monitor" onClick={() => startTourAgain()}>
              Intro tour
            </NavLink>
          </li> */}
          {/* <li>
            <NavLink className="disabled" to="/statistics">
              Market Statistics
            </NavLink>
          </li>  */}

          <li>
            <span className="clock">
              Time:{' '}
              <span id="datetime">
                <Clock />
              </span>
            </span>
          </li>
        </ul>
      </div>
    );
  }
}

export const Header = observer(HeaderComp);
