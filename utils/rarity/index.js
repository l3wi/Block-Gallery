const fs = require("fs")
const path = require("path")
import metadata from "./metadata.json"

export const generateTokenId = (projectId, tokenId) => {
  return (
    projectId + "0".repeat(6 - tokenId.toString().length) + tokenId.toString()
  )
}

const projectFromId = (tokenId) => {
  return tokenId.substring(0, tokenId.length() - 6)
}

// Get info about a project
// Full project info & token ranking
export const projectInfo = (id) => {
  let rawdata = fs.readFileSync(
    path.join(process.cwd(), "/rarity/" + id + "-rarity.json")
  )
  return JSON.parse(rawdata)
  // return rarity.find((project) => parseInt(project.id) === parseInt(id))
}

// Get info about a spefic token
// Project, feature ranking & token rank
export const tokenRanking = (tokenId) => {
  const projectId = projectFromId(tokenId)
  let rawdata = fs.readFileSync(
    path.join(process.cwd(), "/rarity/" + id + "-rarity.json")
  )
  let project = JSON.parse(rawdata)
  let rank = project.ranking.indexOf((item) => item.id === tokenId)
  return { rank, project }
}

// Get basic info about all projects
// For use on the homepage
export const projectsInfo = () => {
  let projects = {}
  metadata
    .sort((a, b) => a.id + b.id)
    .map((item, i) => (projects[item.id] = item))
  const ids = metadata.map((proj) => proj.id).sort((a, b) => a + b)
  return { projects, ids }
}
