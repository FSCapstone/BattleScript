import React, { Component, Fragment, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home';
import Chat from './components/Chat';
/**
 * COMPONENT
 */

const Routes = () => {
  return (
    <div>
      <Switch>
        <Route path="/home" component={Home} />
        {/* <Redirect to="/home" /> */}
        <Route path="/chat" component={Chat} />
      </Switch>
    </div>
  );
};

export default Routes;
