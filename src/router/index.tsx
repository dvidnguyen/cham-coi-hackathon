import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      // Feature routes will be added here as children of MainLayout.
    ],
  },
  {
    path: "*",
    element: <MainLayout />,
    children: [{ path: "*", element: <NotFound /> }],
  },
];

export const router = createBrowserRouter(routes);
