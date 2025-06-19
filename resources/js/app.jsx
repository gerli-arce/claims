import { createRoot } from "react-dom/client"
import LibroReclamaciones from "./Components/LibroReclamaciones"
import "./bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

const container = document.getElementById("app")
const root = createRoot(container)

root.render(<LibroReclamaciones />)
