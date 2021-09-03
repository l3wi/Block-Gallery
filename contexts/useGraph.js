import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect
} from "react"

// Create Context
export const UseGraphContext = createContext()

export const GraphProvider = (props) => {
  const [projects, setProjects] = useState([])

  const fetchAllProjects = async () => {}

  // Once loaded, initalise the provider
  useEffect(() => {
    // const initalLoad = async () => {
    //   const data = await fetchAllProjects()
    //   setProjects(data)
    // }
    // initalLoad()
  }, [])

  const tools = useMemo(() => ({ client, fetchAllProjects }), [client])

  // pass the value in provider and return
  return (
    <UseGraphContext.Provider
      value={{
        tools
      }}
    >
      {props.children}
    </UseGraphContext.Provider>
  )
}

export function useGraph() {
  const graphContext = useContext(UseGraphContext)
  if (graphContext === null) {
    throw new Error(
      "useGraph() can only be used inside of <UseToolsProvider />, " +
        "please declare it at a higher level."
    )
  }
  const { tools } = graphContext

  return useMemo(() => ({ ...tools }), [tools])
}

export default useGraph
