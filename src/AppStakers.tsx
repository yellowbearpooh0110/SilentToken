import * as React from "react"
import { Outlet } from "react-router-dom"
import { Header, NavigationLink } from "./components/Header"
import { routes } from "./utils/routes"

import styles from "./App.module.scss"

const AppStakers = () => {
  const navigationLinks: NavigationLink[] = [
    {
      title: "BACCARAT",
      route: routes.Baccarat,
    },
  ]

  return (
    <div className={styles.app}>
      <div className={styles.noise} />
      <Header navigationLinks={navigationLinks} />
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AppStakers
