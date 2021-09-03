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
        <title>{`${project.name} by ${project.name} - AB.Exchange`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box pos="relative" overflow="hidden" mt={16}>
        <Flex
          justifyContent="space-between"
          maxW="7xl"
          mx="auto"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Box
            pos="relative"
            pb={{ base: 8, sm: 16, md: 20, lg: 28, xl: 32 }}
            maxW={{ lg: "2xl" }}
            w={{ lg: "full" }}
            zIndex={1}
            border="solid 1px transparent"
          >
            <Box
              mx="auto"
              maxW={{ base: "7xl" }}
              px={{ base: 4, sm: 6, lg: 8 }}
              mt={{ base: 6, sm: 8, md: 12, lg: 15, xl: 18 }}
            >
              <Box
                w="full"
                textAlign={{ sm: "center", lg: "left" }}
                justifyContent="center"
                alignItems="center"
              >
                <chakra.h1
                  fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
                  letterSpacing="tight"
                  lineHeight="short"
                  fontWeight="extrabold"
                  color={useColorModeValue("gray.900", "white")}
                >
                  <chakra.span display={{ base: "block", xl: "inline" }}>
                    {`${project.name}`}
                  </chakra.span>
                </chakra.h1>
                <chakra.h3
                  fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                  letterSpacing="tight"
                  lineHeight="short"
                  fontWeight="extrabold"
                  color={useColorModeValue("gray.900", "white")}
                >
                  {`by ${project.artistName}`}
                </chakra.h3>
                <chakra.p
                  mt={{ base: 3, sm: 5, md: 5 }}
                  fontSize={{ sm: "md", md: "lg" }}
                  maxW={{ sm: "xl" }}
                  mx={{ sm: "auto", lg: 0 }}
                  color="gray.500"
                >
                  {project.description}
                </chakra.p>
              </Box>
              <Flex
                mt={4}
                w="full"
                flexDirection={{ base: "column", sm: "row" }}
                textAlign={{ sm: "center", lg: "left" }}
                justifyContent="center"
                alignItems="center"
              >
                <Stat>
                  <StatLabel>Curation Status</StatLabel>
                  <StatNumber>
                    {project.curationStatus
                      ? project.curationStatus
                      : "Factory"}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Minted Works</StatLabel>
                  <StatNumber>{project.invocations}</StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>Dynamic Work</StatLabel>
                  <StatNumber>{project.dynamic ? "Yes" : "No"}</StatNumber>
                </Stat>
              </Flex>
            </Box>
          </Box>

          <Block id={project.tokens[0].tokenId} dynamic={project.dynamic} />
        </Flex>
      </Box>

      <Center flexDirection="column" mt={5}>
        <Box p={4} width={["90%"]} maxW="7xl" justifyContent="flex-start">
          <Heading>Artworks</Heading>
          <Grid
            py="4"
            templateColumns="repeat(auto-fill, 280px)"
            gap={5}
            justifyContent="space-around"
          >
            {project.tokens.map((token, i) => (
              <Block key={i} id={token.tokenId} dynamic={false} />
            ))}
          </Grid>
        </Box>
      </Center>
    </Page>
  )
}

export async function getServerSideProps(context) {
  const { projectId } = context.params
  const { projects } = await getSingleProject(projectId)
  return {
    props: { project: projects[0] } // will be passed to the page component as props
  }
}
