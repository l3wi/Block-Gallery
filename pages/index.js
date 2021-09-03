import React, { useEffect, useState } from "react"
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Divider,
  Flex,
  Grid,
  GridItem
} from "@chakra-ui/react"
import { Box, Heading, Text, Center, Link } from "@chakra-ui/layout"
import { Alert } from "@chakra-ui/alert"
import { Button, IconButton } from "@chakra-ui/button"
import { useColorModeValue } from "@chakra-ui/color-mode"

import Head from "next/head"
import Page from "../components/Page"
import Project from "../components/Project"
import Hero from "../components/Hero"
import { useWeb3 } from "../contexts/useWeb3"

import { useRouter } from "next/router"
import { comma } from "../utils/helpers"
import { getLatestProjects } from "../utils/graph"

export default function Home({ projects }) {
  const router = useRouter()

  return (
    <Page>
      <Head>
        <title>Art Blocks Exchange</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <Center flexDirection="column" mt={5}>
        <Box p={4} width={["90%"]} maxW="7xl">
          <Heading>Collections</Heading>
          <Grid
            py="4"
            templateColumns="repeat(auto-fill, 280px)"
            gap={5}
            justifyContent="space-around"
          >
            {projects.map((project, i) => (
              <a
                key={i}
                onClick={() => router.push(`project/${project.projectId}`)}
              >
                <Project {...project} />
              </a>
            ))}
          </Grid>
        </Box>
      </Center>
    </Page>
  )
}

export async function getServerSideProps(context) {
  const { projects } = await getLatestProjects()

  return {
    props: { projects } // will be passed to the page component as props
  }
}
