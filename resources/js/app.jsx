import { createRoot } from "react-dom/client"
import LibroReclamaciones from "./Components/LibroReclamaciones"
import "./bootstrap"

const container = document.getElementById("app")
const root = createRoot(container)

root.render(<LibroReclamaciones />)
