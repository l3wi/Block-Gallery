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
  Tag,
  TagLabel,
  TagCloseButton,
  Select,
  CloseButton
} from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/color-mode"

import Head from "next/head"
import Page from "../../components/Page"
import Block from "../../components/Block"
import { useRouter } from "next/router"
import { generateTokenId, projectInfo, projectsInfo } from "../../utils/rarity"

import useSWR from "swr"
import fetch from "isomorphic-fetch"
const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Project({ project }) {
  const router = useRouter()

  const initalTokens = project.ranking
    ? project.ranking.slice(0, 50)
    : Array(50)
        .fill("x")
        .map((_, i) => generateTokenId(project.id, i))

  const [order, setOrder] = useState("ids")
  const [filter, setFilter] = useState({})
  const [list, setList] = useState(initalTokens)

  useEffect(() => {
    console.log("Rerendering")
    let filteredTokens = {}
    let featureArrays = []
    //Create array of token ids
    Object.entries(filter).map((obj) => {
      if (obj[1] === "") return
      featureArrays.push(project.traits[obj[0]][obj[1]])
    })

    // Escape to first 50 if
    if (featureArrays.length === 0) {
      if (order === "rank") {
        return setList([...project.ranking.slice(0, 50)])
      } else {
        return setList(
          Array(50)
            .fill("x")
            .map((_, i) => generateTokenId(project.id, i))
        )
      }
    }

    // Count the occurances of the token id
    featureArrays.map((tokens, i) => {
      if (i === 0) {
        // Push the first set into the array
        tokens.map((id) => (filteredTokens[id] = 0))
      } else {
        // Add to the counter if id exists
        tokens.map((id) => {
          if (filteredTokens.hasOwnProperty(id)) {
            filteredTokens[id]++
          }
        })
      }
    })
    console.log(filteredTokens)
    // filter out tokens whos counter doesn't match the filter length
    const finalList = Object.entries(filteredTokens)
      .filter((obj) => {
        return obj[1] === featureArrays.length - 1
      })
      .map((obj) => obj[0])

    if (order === "rank") {
      return setList(
        finalList.sort(
          (a, b) => project.ranking.indexOf(a) - project.ranking.indexOf(b)
        )
      )
    } else {
      return setList(finalList)
    }
  }, [filter, order])

  const resetFilter = () => setFilter({})

  const updateFilter = (id, trait) => {
    console.log(id, trait)
    let modFilter = { ...filter }
    modFilter[id] = trait
    setFilter(modFilter)
  }
  console.log(project.aspectRatio)
  return (
    <Page>
      <Head>
        <title>
          {project.name && `${project.name} by ${project.artistName} - `}
          {`AB.Exchange`}
        </title>
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
                    {project.curation &&
                      project.curation.capitalizeFirstLetter()}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Minted Works</StatLabel>
                  <StatNumber>{project.invocations}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>License</StatLabel>
                  <StatNumber>{project.license}</StatNumber>
                </Stat>
              </Flex>
            </Box>
          </Box>
          <Flex flexGrow={1} justifyContent="center" alignItems="center">
            {project.id && (
              <Block
                id={generateTokenId(project.id, 1)}
                dynamic={project.dynamic}
                ratio={project.aspectRatio}
              />
            )}
          </Flex>
        </Flex>
      </Box>

      <Center flexDirection="column" mt={5}>
        <Box p={4} width={["90%"]} maxW="7xl" justifyContent="flex-start">
          <Heading>Tokens</Heading>

          <Flex
            justifyContent="flex-start"
            alignItems="baseline"
            flexWrap="wrap"
          >
            <Select
              w="fit-content"
              size="sm"
              // placeholder={"ORDER"}
              mx={0.5}
              my={1}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value={"id"}>ORDER BY ID</option>
              <option value={"rank"}>ORDER BY RANK</option>
            </Select>
            {project.traits &&
              Object.values(project.traits).map((trait, i) => {
                const traits = Object.entries(trait)

                let key = false
                if (traits[0][0].split(": ")[1]) {
                  key = ": "
                } else if (traits[0][0].split(":")[1]) {
                  key = ":"
                }
                const title = key ? traits[0][0].split(key)[0] : "unnamed"
                return (
                  <Select
                    key={title + i}
                    w="fit-content"
                    size="sm"
                    placeholder={title.toUpperCase()}
                    mx={0.5}
                    my={1}
                    value={filter[i] ? filter[i] : ""}
                    onChange={(e) => updateFilter(i, e.target.value)}
                  >
                    {traits.map((item, id) => {
                      const value = key ? item[0].split(key)[1] : item[0]
                      return (
                        <option
                          key={title + key + value}
                          value={title + key + value}
                        >
                          {value}
                        </option>
                      )
                    })}
                  </Select>
                )
              })}
            {project.traits && <CloseButton onClick={() => resetFilter()} />}
            {!project.traits && <Box>{`Couldn't find traits`}</Box>}
          </Flex>
          <Grid
            py="4"
            templateColumns="repeat(auto-fill, 280px)"
            gap={5}
            justifyContent="space-between"
          >
            {list.slice(0, 50).map((id, i) => (
              <a key={i} onClick={() => router.push(`/token/${id}`)}>
                <Block
                  id={id}
                  rank={
                    project.ranking ? project.ranking.indexOf(id) + 1 : null
                  }
                  dynamic={false}
                  ratio={project.aspectRatio}
                  invocations={project.invocations}
                  info
                />
              </a>
            ))}
          </Grid>
        </Box>
      </Center>
    </Page>
  )
}

export async function getStaticProps(context) {
  const { id } = context.params
  const project = projectInfo(id)

  return {
    props: { project } // will be passed to the page component as props
  }
}

export async function getStaticPaths() {
  const { ids } = projectsInfo()
  const projectList = ids.map((id) => {
    return { params: { id: id.toString() } }
  })

  return {
    paths: projectList,
    fallback: false
  }
}
