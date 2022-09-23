import React from "react"

import ConnectButton from "../ConnectButton/ConnectButton"
import { Route } from "../../utils/routes"

import styles from "./Header.module.scss"
import { Row } from "../Layout"

export type NavigationLink = {
  title: string
  route: Route
  external?: boolean
}

type HeaderProps = {
  navigationLinks?: NavigationLink[]

  /**
   * If the Header should show nothing but the logo.
   */
  logoOnly?: boolean
}

/**
 * Header component including the navigation and the wallet connection.
 */
export const Header: React.FC<HeaderProps> = ({ navigationLinks = [], logoOnly = false }) => {
  return (
    <div className={styles.container}>
      {/* {!logoOnly && (
        <div className={styles.centerArea}>
          <Row alignment={["center", "center"]}>
            {navigationLinks.map((navLink) => (
              <CustomLink key={navLink.route} to={navLink.route} target={navLink.external ? "_blank" : "_self"}>
                {navLink.title}
                {navLink.external && <FaExternalLinkAlt />}
              </CustomLink>
            ))}
          </Row>
        </div>
      )} */}
      {!logoOnly && (
        <div className={styles.rightArea}>
          <Row alignment="end" grow={0}>
            <button className="bg-[#1976d2] hover:bg-[#1565c0] shadow-[rgb(0_0_0_/_20%)_0px_3px_1px_-2px,_rgb(0_0_0_/_14%)_0px_2px_2px_0px,_rgb(0_0_0_/_12%)_0px_1px_5px_0px] hover:shadow-[rgb(0_0_0_/_20%)_0px_2px_4px_-1px,_rgb(0_0_0_/_14%)_0px_4px_5px_0px,_rgb(0_0_0_/_12%)_0px_1px_10px_0px] text-white mr-[10px] px-[10px] min-w-[120px] rounded-[4px] h-[40px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all font-semibold">
              How to
            </button>
            <ConnectButton />
          </Row>
        </div>
      )}
    </div>
  )
}
