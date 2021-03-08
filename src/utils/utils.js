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

export const getUrlParamsStringFromFilter = (filter) =>  {
  if (!filter)
    return ''
  let paramsString = '?'
  if (filter.filterStartDate) {
    if (paramsString.length > 1)
      paramsString += '&'
    let filterStartDateTime = new Date(filter.filterStartDate)
		filterStartDateTime.setHours(0,0,0,0)
    paramsString += `startDateTime=${filterStartDateTime.toISOString()}`
  }
  if (filter.filterEndDate) {
    if (paramsString.length > 1)
      paramsString += '&'
    let filterEndDateTime = new Date(filter.filterEndDate)
		filterEndDateTime.setHours(23,59,59,999)
    paramsString += `endDateTime=${filterEndDateTime.toISOString()}`
  }
  if (filter.filterLine) {
    if (paramsString.length > 1)
      paramsString += '&'
    paramsString += `line=${encodeURIComponent(filter.filterLine)}`
  }
  if (filter.filterStyle) {
    if (paramsString.length > 1)
      paramsString += '&'
    paramsString += `style=${encodeURIComponent(filter.filterStyle)}`
  }
  if (filter.filterOrder) {
    if (paramsString.length > 1)
      paramsString += '&'
    paramsString += `order=${encodeURIComponent(filter.filterOrder)}`
  }
  if (filter.affectMetricsByTime) {
    if (paramsString.length > 1)
      paramsString += '&'
    paramsString += `affectMetricsByTime=${encodeURIComponent(filter.affectMetricsByTime)}`
  }
  return encodeURI(paramsString)
}