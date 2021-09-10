import React, { ReactElement, useContext } from 'react';
import {
  Switch, Route, Redirect, RouteProps,
} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LoginPage } from '../pages/login';
import { Loader } from '../components/loader';
import { DashboardPage } from '../pages/dashboard';
import { CustomersPage } from '../pages/customers';
import { NewCustomerPage } from '../pages/new-customer';
import { EditCustomerPage } from '../pages/edit-customer';
import { CustomerPage } from '../pages/customer';
import { JobsPage } from '../pages/jobs';
import { JobPage } from '../pages/job';

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
      <CustomRoute isPrivate={false} path="/login" exact component={LoginPage} />
      <CustomRoute isPrivate path="/dashboard" exact component={DashboardPage} />
      <CustomRoute isPrivate path="/clientes" exact component={CustomersPage} />
      <CustomRoute isPrivate path="/clientes/novo" exact component={NewCustomerPage} />
      <CustomRoute isPrivate path="/clientes/:id/editar" component={EditCustomerPage} />
      <CustomRoute isPrivate path="/clientes/:id" component={CustomerPage} />
      <CustomRoute isPrivate path="/jobs" exact component={JobsPage} />
      {/* <CustomRoute isPrivate path="/jobs/novo" exact component={NewCustomerPage} />
      <CustomRoute isPrivate path="/jobs/:id/editar" component={EditCustomerPage} /> */}
      <CustomRoute isPrivate path="/jobs/:id" component={JobPage} />
      {/* <Route path="/login" component={LoginPage} /> 404 - TODO */}
    </Switch>
  );
}
