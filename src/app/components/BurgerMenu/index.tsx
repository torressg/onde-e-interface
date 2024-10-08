"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Flex, IconButton, Link } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPathname, setCurrentPathname] = useState("");

  useEffect(() => {
    if (window) setCurrentPathname(window.location.pathname);
  }, []);

  const isActive = (pathname: string) => currentPathname === pathname;

  const toggleMenu = (targetPathname?: any) => {
    if (isActive(targetPathname)) {
      setIsOpen(false);
    }
    setIsOpen(!isOpen);
  };

  return (
    <Box position="relative" zIndex="50">
      <Button
        as={IconButton}
        onClick={toggleMenu}
        icon={<HamburgerIcon boxSize={6} />}
        w="10"
        h="10"
        color="#F8A801"
        bg="#1c1c1c"
        _hover={{ bg: "#F8A801", color: "#1C1C1C" }}
      />

      <Box
        position="fixed"
        top="0"
        left="0"
        w="full"
        h="100vh"
        bg="black"
        transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
        transition="transform 0.3s ease-in-out"
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          h="full"
        >
          <Link
            as={NextLink}
            onClick={() => toggleMenu("/")}
            href="/"
            color={isActive("/") ? "#fff" : "#F8A801"}
            fontSize="2xl"
            fontWeight="semibold"
            p="4"
          >
            Home
          </Link>
          <Link
            as={NextLink}
            onClick={() => toggleMenu("/ambientes")}
            href="/ambientes"
            color={isActive("/ambientes") ? "#fff" : "#F8A801"}
            fontSize="2xl"
            fontWeight="semibold"
            p="4"
          >
            Ambientes
          </Link>
          <Link
            as={NextLink}
            onClick={() => toggleMenu("/contato")}
            href="/contato"
            color={isActive("/contato") ? "#fff" : "#F8A801"}
            fontSize="2xl"
            fontWeight="semibold"
            p="4"
          >
            Suporte ao usuário
          </Link>
          <Link
            as={NextLink}
            onClick={() => toggleMenu("/ajuda")}
            href="/ajuda"
            color={isActive("/ajuda") ? "#fff" : "#F8A801"}
            fontSize="2xl"
            fontWeight="semibold"
            p="4"
          >
            Ajuda de uso
          </Link>
          <Button
            onClick={() => toggleMenu()}
            color="#F8A801"
            fontSize="2xl"
            fontWeight="semibold"
            p="8"
            bg="transparent"
            _hover={{ textDecoration: "underline" }}
            _active={{ background: "transparent" }}
          >
            Fechar
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default BurgerMenu;