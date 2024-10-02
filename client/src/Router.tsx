import { Suspense, lazy } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { CircularProgress } from "@mui/material";

const MainPage = lazy(() =>
  import("./pages/main-page/MainPage").catch((err) => {
    console.error(err);
    return { default: CircularProgress };
  })
);

const ContactsPage = lazy(() =>
  import("./pages/contacts-page/ContactsPage").catch((err) => {
    console.error(err);
    return { default: CircularProgress };
  })
);

const ErrorPage = lazy(() =>
  import("./pages/error-page/ErrorPage").catch((err) => {
    console.error(err);
    return { default: CircularProgress };
  })
);

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route
        index
        element={
          <Suspense fallback={<CircularProgress />}>
            <MainPage />
          </Suspense>
        }
      />
      <Route
        path="contacts"
        element={
          <Suspense fallback={<CircularProgress />}>
            <ContactsPage />
          </Suspense>
        }
      />
      <Route
        path="*"
        exact={true}
        element={
          <Suspense fallback={<CircularProgress />}>
            <ErrorPage />
          </Suspense>
        }
      />
    </Route>
  )
);
