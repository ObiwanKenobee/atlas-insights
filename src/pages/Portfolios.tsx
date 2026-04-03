import { usePortfolios } from "@/hooks/use-atlas-queries";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageSkeleton } from "@/components/layout/LoadingSkeletons";
import { formatCurrency } from "@/lib/formatters";
import { useNavigate } from "react-router-dom";
import { Briefcase, ArrowRight } from "lucide-react";

export default function PortfoliosPage() {
  const { data: portfolios, isLoading } = usePortfolios();
  const navigate = useNavigate();

  if (isLoading) return <AppLayout><PageSkeleton /></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <SectionHeader title="Portfolios" subtitle="Managed portfolio overview and risk analysis" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {portfolios?.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-colors cursor-pointer group"
              onClick={() => navigate(`/portfolios/${p.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">{p.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{p.strategyType}</p>
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">AuM</span>
                  <p className="font-mono font-medium text-foreground">{formatCurrency(p.aum)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Benchmark</span>
                  <p className="text-foreground">{p.benchmark}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground line-clamp-2">{p.vulnerabilitySummary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
