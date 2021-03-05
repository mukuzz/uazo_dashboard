 import Cookies from "js-cookie";
 import { Route, Redirect } from "react-router-dom";
 import { LoggedInUserContext } from "../context";

export const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
      error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

export const authHeader = () => {
  return new Headers({
    'Authorization': `Token ${Cookies.get('token')}`
  })
}

export const formatDate = (date) => {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

export const PrivateRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        <LoggedInUserContext.Consumer>
          {({loggedIn}) => (
            loggedIn ? (
              children
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: location }
                }}
              />
            )
          )}
        </LoggedInUserContext.Consumer>
      }
    />
  );
}

export const isUserLoggedIn = () => {
  if (Cookies.get('token'))
    return true
  else
   return false
}