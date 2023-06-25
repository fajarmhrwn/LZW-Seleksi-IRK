import {createBrowserRouter} from "react-router-dom";

import Input from "./pages/dashboard";
import Login from "./pages/login";
import History from "./pages/history";

const Router = createBrowserRouter([
    {path: "/history", element: <History />},
    {path: "/login", element: <Login />},
    {path: "/dashboard", element: <Input />},
    {path: "/", element: <Input />},
]);

export default Router;