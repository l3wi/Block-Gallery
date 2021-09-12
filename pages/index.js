import React, { useEffect, useState } from "react"
import { Flex, Grid, Tag, TagLabel } from "@chakra-ui/react"
import { Box, Heading, Text, Center, Link } from "@chakra-ui/layout"

import Head from "next/head"
import Page from "../components/Page"
import Project from "../components/Project"
import Hero from "../components/Hero"
import { useWeb3 } from "../contexts/useWeb3"

import { useRouter } from "next/router"
import { comma } from "../utils/helpers"

import { projectsInfo } from "../utils/rarity"

// import useSWR from "swr"
// import fetch from "isomorphic-fetch"
// const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Home({ projects, ids }) {
  const router = useRouter()

  const [list, setList] = useState(ids)
  const [filter, setFilter] = useState(["curated"])
  const [order, setOrder] = useState(true)

  const filterIds = (data) =>
    Object.values(data)
      .map((proj) => proj.id)
      .sort((a, b) => (order ? a + b : a - b))
      .filter((id) => filter.indexOf(data[id].curation) != -1)

  const toggleOrder = (newOrder) => {
    setOrder(newOrder)
  }
  const toggleFilter = (newFilter) => {
    let modBuff = [].concat(filter)
    const foundIndex = modBuff.findIndex(
      (currFilter) => currFilter === newFilter
    )

    setFilter(
      foundIndex === -1
        ? [...modBuff, newFilter]
        : modBuff.filter((e) => e !== newFilter)
    )
  }

  useEffect(() => {
    setList(filterIds(projects))
  }, [order, filter])

  return (
    <Page>
      <Head>
        <title>Block Gallery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <Center flexDirection="column" mt={5}>
        <Box p={4} width={["90%"]} maxW="7xl">
          <Flex justifyContent="space-between" alignItems="baseline">
            <Heading>Projects</Heading>
            <Box>
              <Tag
                mx={1}
                size={"md"}
                borderRadius="full"
                variant={order ? "solid" : "subtle"}
                colorScheme="pink"
                cursor="pointer"
                onClick={() => toggleOrder(!order)}
              >
                <TagLabel>{order ? "LATEST" : "OLDEST"}</TagLabel>
              </Tag>
              <Box
                as="span"
                borderLeft="2px solid rgba(255,255,255,0.5)"
                mx={2}
              />
              <Tag
                mx={1}
                size={"md"}
                borderRadius="full"
                variant={filter.indexOf("curated") != -1 ? "solid" : "subtle"}
                colorScheme="cyan"
                cursor="pointer"
                onClick={() => toggleFilter("curated")}
              >
                <TagLabel>CURATED</TagLabel>
              </Tag>
              <Tag
                mx={1}
                size={"md"}
                borderRadius="full"
                variant={filter.indexOf("factory") != -1 ? "solid" : "subtle"}
                colorScheme="cyan"
                cursor="pointer"
                onClick={() => toggleFilter("factory")}
              >
                <TagLabel>FACTORY</TagLabel>
              </Tag>
              <Tag
                mx={1}
                size={"md"}
                borderRadius="full"
                variant={
                  filter.indexOf("playground") != -1 ? "solid" : "subtle"
                }
                colorScheme="cyan"
                cursor="pointer"
                onClick={() => toggleFilter("playground")}
              >
                <TagLabel>PLAYGROUND</TagLabel>
              </Tag>
            </Box>
          </Flex>

          <Grid
            py="4"
            templateColumns="repeat(auto-fill, 280px)"
            gap={5}
            justifyContent="space-between"
          >
            {list
              ? list.map((id, i) => (
                  <a
                    key={i}
                    onClick={() => router.push(`/project/${projects[id].id}`)}
                  >
                    <Project {...projects[id]} />
                  </a>
                ))
              : Array(20)
                  .fill("c")
                  .map((id, i) => <Project key={i} />)}
          </Grid>
        </Box>
      </Center>
    </Page>
  )
}

export async function getStaticProps(context) {
  const { projects, ids } = projectsInfo()
  return {
    props: { projects, ids } // will be passed to the page component as props
  }
}
