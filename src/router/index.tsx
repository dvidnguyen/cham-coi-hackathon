import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Home } from "@/pages/Home";
import { Gallery } from "@/pages/Gallery";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Benefits } from "@/pages/Benefits";
import { FamilyRegister } from "@/pages/FamilyRegister";
import { Heritage } from "@/pages/Heritage";
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
      { path: "phuc-loi", element: <Benefits /> },
      { path: "dang-ky-gia-dinh", element: <FamilyRegister /> },
      { path: "tri-thuc", element: <Heritage /> },
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
