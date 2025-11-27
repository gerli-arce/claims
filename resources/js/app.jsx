import { createRoot } from "react-dom/client"
import LibroReclamaciones from "./Components/LibroReclamaciones"
import "./bootstrap"
import "../css/app.css"
import "./styles/main.css"

// Cuando la URL tenga un parámetro "data" en base64 lo decodificamos y lo guardamos en localStorage
try {
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get("data")
  if (encoded) {
    const jsonString = atob(encoded)
    const jsonData = JSON.parse(jsonString)
    localStorage.setItem("data", JSON.stringify(jsonData))
    console.log("Data parameter decoded and stored in localStorage:", jsonData)
  }
} catch (err) {
  console.error("Error parsing data parameter", err)
}

const container = document.getElementById("app")
const root = createRoot(container)

root.render(<LibroReclamaciones />)
