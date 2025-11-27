import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Clock, Shield, Wifi } from "lucide-react"

interface FooterProps {
  darkMode: boolean
}

export default function Footer({ darkMode }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={`mt-16 border-t transition-colors duration-300 ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
      }`}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  darkMode ? "bg-blue-500/20" : "bg-blue-100"
                }`}
              >
                <Wifi className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>FASTNETPERU</h3>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>TV | Internet | IPTV</p>
              </div>
            </div>
            <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Brindamos servicios de telecomunicaciones de alta calidad para hogares y empresas en todo el Peru.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  darkMode
                    ? "bg-slate-800 text-slate-400 hover:bg-blue-500/20 hover:text-blue-400"
                    : "bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  darkMode
                    ? "bg-slate-800 text-slate-400 hover:bg-pink-500/20 hover:text-pink-400"
                    : "bg-white text-slate-500 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  darkMode
                    ? "bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                    : "bg-white text-slate-500 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Enlaces Rapidos
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Inicio", href: "/" },
                { label: "Planes de Internet", href: "#" },
                { label: "Planes de TV", href: "#" },
                { label: "Cobertura", href: "#" },
                { label: "Libro de Reclamaciones", href: "/" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`text-sm transition-colors ${
                      darkMode ? "text-slate-400 hover:text-blue-400" : "text-slate-600 hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className={`w-4 h-4 mt-0.5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>(01) 234-5678</p>
                  <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>Linea principal</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className={`w-4 h-4 mt-0.5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>
                    info@fastnetperu.com
                  </p>
                  <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>Soporte general</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className={`w-4 h-4 mt-0.5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>Lima, Peru</p>
                  <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>Oficina principal</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours & Support */}
          <div>
            <h4
              className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Horario de Atencion
            </h4>
            <div className={`rounded-xl p-4 ${darkMode ? "bg-slate-800/50" : "bg-white"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Clock className={`w-4 h-4 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                <span className={`text-xs font-medium ${darkMode ? "text-green-400" : "text-green-600"}`}>
                  Disponible ahora
                </span>
              </div>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Lun - Vie</span>
                  <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>
                    8:00 - 20:00
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Sabado</span>
                  <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>
                    9:00 - 14:00
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Domingo</span>
                  <span className={`text-sm font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    Cerrado
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${darkMode ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className={`w-4 h-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
              <p className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                &copy; {currentYear} FASTNETPERU. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className={`text-sm transition-colors ${
                  darkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Terminos y Condiciones
              </a>
              <span className={darkMode ? "text-slate-700" : "text-slate-300"}>|</span>
              <a
                href="#"
                className={`text-sm transition-colors ${
                  darkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Politica de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
