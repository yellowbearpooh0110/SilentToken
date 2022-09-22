import * as React from "react"
import { Outlet } from "react-router-dom"
import { Header, NavigationLink } from "./components/Header"
import { routes } from "./utils/routes"

import styles from "./App.module.scss"

const AppStakers = () => {
  const navigationLinks: NavigationLink[] = [
    {
      title: "Main",
      route: routes.Main,
    },
  ]

  return (
    <div className="text-white bg-black bg-[linear-gradient(-45deg,_#010008,_#070526,_#3d3982,_#11054d)] animate-[gradientBG_15s_ease_infinite] bg-[length:400%_400%]">
      <div className="w-[100vw] h-[100vh] overflow-auto flex flex-col items-center content-center">
        <Header navigationLinks={navigationLinks} />
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppStakers
