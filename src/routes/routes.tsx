import React, { ReactElement, useContext } from 'react';
import {
  Switch, Route, Redirect, RouteProps,
} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LoginPage } from '../pages/login';
import { DashboardPage } from '../pages/dashboard';

interface CustomRouteType extends RouteProps {
  isPrivate: boolean,
}

const CustomRoute: React.FC<CustomRouteType> = ({ isPrivate, ...rest }) => {
  const { loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return <h1>Carregando...</h1>;
  }

  if (isPrivate && !isAuthenticated) {
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
      <CustomRoute isPrivate exact path="/dashboard" component={DashboardPage} />
      {/* <Route path="/login" component={LoginPage} /> 404 - TODO */}
    </Switch>
  );
}
