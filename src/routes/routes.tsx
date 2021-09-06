import React, { ReactElement, useContext } from 'react';
import {
  Switch, Route, Redirect, RouteProps,
} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LoginPage } from '../pages/login';
import { Loader } from '../components/loader';
import { DashboardPage } from '../pages/dashboard';
import { CustomersPage } from '../pages/customers';

interface CustomRouteType extends RouteProps {
  isPrivate: boolean,
}

const CustomRoute: React.FC<CustomRouteType> = ({ isPrivate, ...rest }) => {
  const { loading, user } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  if (isPrivate && !user) {
    return <Redirect to="/login" />;
  }
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  return <Route {...rest} />;
};

export default function Routes(): ReactElement {
  return (
    <Switch>
      <CustomRoute isPrivate={false} path="/" exact component={() => <Redirect to="/login" />} />
      <CustomRoute isPrivate={false} exact path="/login" component={LoginPage} />
      <CustomRoute isPrivate path="/dashboard" component={DashboardPage} />
      <CustomRoute isPrivate path="/clientes" component={CustomersPage} />
      {/* <Route path="/login" component={LoginPage} /> 404 - TODO */}
    </Switch>
  );
}
