"use client"
import {
  Navbar as NavbarNUI,
  NavbarContent,
  NavbarBrand,
  Button,
} from "@nextui-org/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useState } from "react"

export const Navbar = () => {

  return (
    <NavbarNUI >
      <NavbarContent justify="start">
        <NavbarBrand>
        Blockchain Application
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <ConnectButton.Custom>
          {({ authenticationStatus, mounted, account, openAccountModal }) => (
            <Button
              className="bg-gradient-to-br from-secondary to-primary text-base font-semibold max-sm:min-w-10"
              size="md"
              variant="shadow"
              color="primary"
              onClick={openAccountModal}
              disabled={!mounted || authenticationStatus !== "authenticated"}
            >
              {account?.displayName ?? "Connect Wallet"}
            </Button>
          )}
        </ConnectButton.Custom>
      </NavbarContent>

    </NavbarNUI>
  )
}
