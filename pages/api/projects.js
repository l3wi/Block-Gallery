import { projectsInfo } from "../../utils/rarity"
const { projects } = projectsInfo()

const Route = (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=1")
  res.status(200).json(projects)
}
export default Route
