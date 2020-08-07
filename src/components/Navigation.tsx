import { useHistory } from 'react-router-dom';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import Select from '@material-ui/core/Select';

const Navigation = (state: any) => {
  const history = useHistory();
  const dynamicDashboards =
    state.dashboards.length > 0 ? (
      <Select
        native
        inputProps={{
          name: 'age',
          id: 'age-native-simple',
        }}
        onChange={(e) => {
          const navigateTo = e.target.value;
          history.push(`/dashboard/${navigateTo}`, { navigateTo });
        }}
      >
        <option aria-label="None" value="" />
        {state.dashboards.map(({ id, name }: { id: string; name: string }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </Select>
    ) : (
      []
    );

  return (
    <div>
      <Link to="/dashboard">
        <Button color="primary" type="submit" value="login">
          Dashboard
        </Button>
      </Link>
      <Link to="/create-dashboard">
        <Button color="primary" type="submit" value="login">
          Create Dashboard
        </Button>
      </Link>
      {dynamicDashboards}
      <hr />
    </div>
  );
};

export const ConnectedNavigation = connect((state) => state)(Navigation);
