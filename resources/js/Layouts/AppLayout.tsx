import type React from "react"
import { Head } from "@inertiajs/react"

interface AppLayoutProps {
  title?: string
  children: React.ReactNode
}

export default function AppLayout({ title, children }: AppLayoutProps) {
  return (
    <>
       <Head title={title}>
        <link
          rel="icon"
          type="image/png"
          href="http://almacen.fastnetperu.com.pe/img/icon.png"
        />
      </Head>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light sticky-top">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src="http://almacen.fastnetperu.com.pe/img/logo-light.png" alt="FASTNETPERU" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="/">
                  Libro de Reclamaciones
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Contacto
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Ayuda
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-light py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
              <p className="mb-0">&copy; 2023 FASTNETPERU - Internet y TV Cable</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a href="#" className="text-decoration-none text-muted me-3">
                Términos y Condiciones
              </a>
              <a href="#" className="text-decoration-none text-muted">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
