import React from "react"
import { Route, Routes, Navigate } from "react-router-dom"

import { MainPage } from "./pages/Main"
import AppStakers from "./AppStakers"

import { routes } from "./utils/routes"

function App() {
  return (
    <>
      <Routes>
        {/** Stakers section routes */}
        <Route path="/*" element={<AppStakers />}>
          <Route path={routes.Main} element={<MainPage />} />
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </>
  )
}

export default App
