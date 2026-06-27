import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Home } from "@/pages/Home";
import { Gallery } from "@/pages/Gallery";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
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
      { path: "gallery", element: <Gallery /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
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
