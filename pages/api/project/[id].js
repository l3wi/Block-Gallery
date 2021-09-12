import { projectInfo } from "../../../utils/rarity"

const Route = (req, res) => {
  const { id } = req.query
  const project = projectInfo(id)
  console.log(project.traits)
  res.setHeader("Cache-Control", "s-maxage=1")
  res.status(200).json(project)
}
export default Route
