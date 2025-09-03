"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Fade, Flex, Line, ToggleButton } from "@once-ui-system/core";
import { routes, display, person, about, projects, blog, gallery } from "@/resources";

import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.scss";


export const Header = () => {
  const pathname = usePathname() ?? "";

  return (
    <>
      <Fade hide="s" fillWidth position="fixed" height="80" zIndex={9} />
      <Fade show="s" fillWidth position="fixed" bottom="0" to="top" height="80" zIndex={9} />
      <Flex
        fitHeight
        position="unset"
        className={styles.position}
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
      >
        <Flex paddingLeft="24" fillWidth vertical="center" textVariant="body-default-s">
          {display.location && <Flex s={{ hide: true }} >{person.location}</Flex>}
        </Flex>
        <Flex fillWidth fillHeight horizontal="center">
          <Flex
            background="page"
            border="neutral-alpha-weak"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
            zIndex={1}
          >
            <Flex gap="4" vertical="center" textVariant="body-default-s" suppressHydrationWarning>
              {routes["/"] && (
                <ToggleButton prefixIcon="home" href="/" selected={pathname === "/"} />
              )}
              <Line background="neutral-alpha-medium" vert maxHeight="24" />
              {routes["/about"] && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="person"
                    href="/about"
                    label={about.label}
                    selected={pathname === "/about"}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="person"
                    href="/about"
                    selected={pathname === "/about"}
                  />
                </>
              )}
              {routes["/projects"] && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="projects"
                    href="/projects"
                    label={projects.label}
                    selected={pathname === "/projects"}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="projects"
                    href="/projects"
                    selected={pathname === "/projects"}
                  />
                </>
              )}
              {routes["/blog"] && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="blog"
                    href="/blog"
                    label={blog.label}
                    selected={pathname === "/blog"}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="blog"
                    href="/blog"
                    selected={pathname === "/blog"}
                  />
                </>
              )}
              {routes["/gallery"] && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="gallery"
                    href="/gallery"
                    label={gallery.label}
                    selected={pathname.startsWith("/gallery")}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="gallery"
                    href="/gallery"
                    selected={pathname.startsWith("/gallery")}
                  />
                </>
              )}
              {display.themeSwitcher && (
                <>
                  <Line background="neutral-alpha-medium" vert maxHeight="24" />
                  <ThemeToggle />
                </>
              )}
            </Flex>
          </Flex>
        </Flex>

        <Flex fillWidth horizontal="end" vertical="center">
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="8"
            className="s-flex-hide"
          >
            <a href="https://www.linkedin.com/in/divya-dhiman/" target="_blank" rel="noopener noreferrer">LinkedIn</a>/<a href="https://github.com/divyadhimaan" target="_blank" rel="noopener noreferrer">GitHub</a>
          </Flex>
        </Flex>

      </Flex>
    </>
  );
};
