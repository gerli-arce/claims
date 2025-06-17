import AppLayout from "@/Layouts/AppLayout"
import ClaimForm from "@/Components/ClaimForm"
import StatsCard from "@/Components/StatsCard"
import ClaimsTable from "@/Components/ClaimsTable"
import Alert from "@/Components/Alert"
import type { PageProps, Branch, Claim, Stats } from "@/types"

interface ClaimsIndexProps extends PageProps {
  branches: Branch[]
  claims: Claim[]
  stats: Stats
}

export default function Index({ branches, claims, stats, flash }: ClaimsIndexProps) {
  return (
    <AppLayout title="Libro de Reclamaciones">
      <div className="container py-4">
        {/* Header */}
        <div className="header-container mb-4">
          <div className="header-content">
            <h1 className="display-5 fw-bold mb-3">Libro de Reclamaciones</h1>
            <p className="lead mb-1">Registra tu reclamo o sugerencia y te responderemos a la brevedad</p>
            <div className="mt-3 zones-container">
              {branches.map((branch) => (
                <span
                  key={branch.id}
                  className="zones-badge"
                  style={branch.color ? { backgroundColor: branch.color } : undefined}
                >
                  {branch.correlative}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Flash Messages */}
        {flash.success && <Alert type="success" message={flash.success} />}
        {flash.error && <Alert type="error" message={flash.error} />}

        <div className="row">
          {/* Form Column */}
          <div className="col-lg-8 mb-4">
            <ClaimForm branches={branches} />
          </div>

          {/* Stats Column */}
          <div className="col-lg-4 mb-4">
            <StatsCard stats={stats} />
          </div>
        </div>

        {/* Claims Table */}
        <ClaimsTable claims={claims} />
      </div>
    </AppLayout>
  )
}
