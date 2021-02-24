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

export const PrivateRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        <LoggedInUserContext.Consumer>
          {({user}) => (
            user ? (
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

export const getUser = () => {
  // TODO
  if (Cookies.get('token'))
    return {}
  else
   return null
}