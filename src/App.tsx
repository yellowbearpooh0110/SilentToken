import React from "react"
import { Route, Routes, Navigate } from "react-router-dom"

import { BaccaratPage } from "./pages/Baccarat"
import AppStakers from "./AppStakers"

import { routes } from "./utils/routes"

function App() {
  return (
    <>
      <Routes>
        {/** Stakers section routes */}
        <Route path="/*" element={<AppStakers />}>
          <Route path={routes.Baccarat} element={<BaccaratPage />} />
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </>
  )
}

export default App
