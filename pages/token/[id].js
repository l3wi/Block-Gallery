import React, { useEffect, useState } from "react"
import {
  Grid,
  Box,
  Heading,
  chakra,
  Center,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup
} from "@chakra-ui/react"
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode"

import Head from "next/head"
import Page from "../../components/Page"
import Block from "../../components/Block"
import { useRouter } from "next/router"

import { getSingleProject } from "../../utils/graph"

export default function Home({ project }) {
  console.log(project)
  return (
    <Page>
      <Head>
        <title>Ab Ex</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </Page>
  )
}
