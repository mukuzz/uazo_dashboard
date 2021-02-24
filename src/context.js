import React from "react";

export const EventSourceContext = React.createContext()

export const LoggedInUserContext = React.createContext({
  user: null,
  setLoggedInUser: null
})