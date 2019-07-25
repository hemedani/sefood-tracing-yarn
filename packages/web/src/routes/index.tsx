import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { RegisterConnector } from "../modules/register/RegisterConnector";

export const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/register" component={RegisterConnector} />
    </Switch>
  </BrowserRouter>
);
