import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/app-store';
import { formatNumber } from '@/utils/formatting';
import { BarChartComponent, ChartExportWrapper } from '@/components/charts';
import { 
  Building2, 
  Database,
  GitBranch,
  Users,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
  Server,
  Brain,
  Tag
} from 'lucide-react';
import type { DataDomain } from '@/types/data-mesh';

const productTypeIcons = {
  dataset: Database,
  api: Server,
  dashboard: LayoutDashboard,
  'ml-model': Brain,
};

const statusIcons = {
  active: CheckCircle,
  deprecated: AlertCircle,
  experimental: AlertCircle,
};

const statusColors = {
  active: 'text-green-500',
  deprecated: 'text-red-500',
  experimental: 'text-yellow-500',
};

export const DataMeshView = () => {
  const { dataDomains, dataMeshGovernance, domainRelationships } = useAppStore();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const selectedDomainData = useMemo(() => 
    selectedDomain ? dataDomains.find(d => d.id === selectedDomain) : null,
  [selectedDomain, dataDomains]);

  const selectedProductData = useMemo(() => {
    if (!selectedDomainData || !selectedProduct) return null;
    return selectedDomainData.dataProducts.find(p => p.id === selectedProduct);
  }, [selectedDomainData, selectedProduct]);

  const governanceData = useMemo(() => [
    { name: 'Documentation', value: dataMeshGovernance.standards.documentation },
    { name: 'Data Quality', value: dataMeshGovernance.standards.dataQuality },
    { name: 'Metadata', value: dataMeshGovernance.standards.metadata },
    { name: 'Access Control', value: dataMeshGovernance.standards.accessControl },
  ], [dataMeshGovernance]);

  const domainMetricsData = useMemo(() => 
    dataDomains.map(d => ({
      name: d.name.split(' ')[0],
      value: d.datasets + d.pipelines + d.consumers,
    })),
  [dataDomains]);

  const relatedDomains = useMemo(() => {
    if (!selectedDomain) return [];
    return domainRelationships.filter(
      r => r.source === selectedDomain || r.target === selectedDomain
    );
  }, [selectedDomain, domainRelationships]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Mesh</h1>
        <p className="text-muted-foreground">
          Domain-oriented decentralized data ownership and architecture
        </p>
      </div>

      {/* Governance Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Federated Governance</CardTitle>
              <CardDescription>Data mesh standards and compliance</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Total Domains</p>
                <p className="text-3xl font-bold">{dataMeshGovernance.domains}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Data Products</p>
                <p className="text-3xl font-bold">{dataMeshGovernance.dataProducts}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Total Datasets</p>
                <p className="text-3xl font-bold">{formatNumber(dataMeshGovernance.totalDatasets)}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Governance</p>
                <p className="text-3xl font-bold">
                  {dataMeshGovernance.federatedGovernance ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Standards Compliance</p>
              <div className="space-y-3">
                {governanceData.map(item => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{item.name}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Metrics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Metrics</CardTitle>
          <CardDescription>Datasets, pipelines, and consumers by domain</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartExportWrapper filename="domain-metrics">
            <BarChartComponent data={domainMetricsData} />
          </ChartExportWrapper>
        </CardContent>
      </Card>

      {/* Domain Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dataDomains.map(domain => (
          <DomainCard 
            key={domain.id} 
            domain={domain} 
            isSelected={selectedDomain === domain.id}
            onClick={() => {
              setSelectedDomain(selectedDomain === domain.id ? null : domain.id);
              setSelectedProduct(null);
            }}
          />
        ))}
      </div>

      {/* Domain Details */}
      {selectedDomainData && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="h-12 w-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: selectedDomainData.color }}
                >
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>{selectedDomainData.name}</CardTitle>
                  <CardDescription>{selectedDomainData.description}</CardDescription>
                </div>
              </div>
              <Badge className={statusColors[selectedDomainData.status]}>
                {selectedDomainData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Domain Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Datasets</p>
                  <p className="text-xl font-bold">{selectedDomainData.datasets}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Pipelines</p>
                  <p className="text-xl font-bold">{selectedDomainData.pipelines}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Consumers</p>
                  <p className="text-xl font-bold">{selectedDomainData.consumers}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Storage</p>
                  <p className="text-xl font-bold">{selectedDomainData.metrics.totalStorageGB} GB</p>
                </div>
              </div>

              {/* Governance */}
              <div>
                <p className="text-sm font-medium mb-2">Governance</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-lg border">
                    <p className="text-muted-foreground">Data Quality</p>
                    <p className="font-bold">{selectedDomainData.governance.dataQualityScore}%</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-muted-foreground">Documentation</p>
                    <p className="font-bold">{selectedDomainData.governance.documentationCoverage}%</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-muted-foreground">Compliance</p>
                    <p className="font-bold capitalize">{selectedDomainData.governance.complianceStatus}</p>
                  </div>
                </div>
              </div>

              {/* Data Products */}
              <div>
                <p className="text-sm font-medium mb-2">Data Products ({selectedDomainData.dataProducts.length})</p>
                <div className="space-y-2">
                  {selectedDomainData.dataProducts.map(product => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                        ${selectedProduct === product.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {(() => {
                          const Icon = productTypeIcons[product.type];
                          return <Icon className="h-4 w-4 text-muted-foreground" />;
                        })()}
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">{product.type}</Badge>
                        <Badge className={statusColors[product.status]}>{product.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relationships */}
              {relatedDomains.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Domain Relationships</p>
                  <div className="space-y-2">
                    {relatedDomains.map((rel, idx) => {
                      const isSource = rel.source === selectedDomain;
                      const otherDomain = dataDomains.find(d => d.id === (isSource ? rel.target : rel.source));
                      if (!otherDomain) return null;
                      
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg border">
                          <div className="flex items-center gap-2">
                            <ArrowRight className={`h-4 w-4 ${isSource ? '' : 'rotate-180'}`} />
                            <span className="text-sm">{otherDomain.name}</span>
                            <Badge variant="outline" className="text-xs">{rel.relationship}</Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">{rel.dataVolumeGB} GB</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Product Details */}
      {selectedProductData && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = productTypeIcons[selectedProductData.type];
                  return (
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  );
                })()}
                <div>
                  <CardTitle>{selectedProductData.name}</CardTitle>
                  <CardDescription>{selectedProductData.description}</CardDescription>
                </div>
              </div>
              <Badge className={statusColors[selectedProductData.status]}>
                {selectedProductData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* SLA */}
              <div>
                <p className="text-sm font-medium mb-2">Service Level Agreement</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Availability</p>
                    <p className="font-bold">{selectedProductData.sla.availability}%</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Freshness</p>
                    <p className="font-bold">{selectedProductData.sla.freshness}</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Support</p>
                    <p className="font-bold">{selectedProductData.sla.support}</p>
                  </div>
                </div>
              </div>

              {/* Consumers */}
              <div>
                <p className="text-sm font-medium mb-2">Consumers ({selectedProductData.consumers.length})</p>
                <div className="space-y-2">
                  {selectedProductData.consumers.map(consumer => (
                    <div key={consumer.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{consumer.name}</span>
                        <Badge variant="outline" className="text-xs">{consumer.team}</Badge>
                        <Badge variant="secondary" className="text-xs">{consumer.type}</Badge>
                      </div>
                      <div className="text-right text-sm">
                        <p>{formatNumber(consumer.usage.queriesPerDay)} queries/day</p>
                        <p className="text-muted-foreground">{consumer.usage.dataVolumeGB} GB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-sm font-medium mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProductData.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Domain Card Component
const DomainCard = ({ 
  domain, 
  isSelected, 
  onClick 
}: { 
  domain: DataDomain; 
  isSelected: boolean;
  onClick: () => void;
}) => {
  const StatusIcon = statusIcons[domain.status];
  
  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg border cursor-pointer transition-all
        ${isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted'}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className="h-10 w-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: domain.color }}
        >
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <StatusIcon className={`h-4 w-4 ${statusColors[domain.status]}`} />
      </div>
      
      <h3 className="font-bold mb-1">{domain.name}</h3>
      <p className="text-xs text-muted-foreground mb-3">{domain.ownerTeam}</p>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center p-2 rounded bg-muted">
          <Database className="h-3 w-3 mx-auto mb-1" />
          <span className="font-medium">{domain.datasets}</span>
        </div>
        <div className="text-center p-2 rounded bg-muted">
          <GitBranch className="h-3 w-3 mx-auto mb-1" />
          <span className="font-medium">{domain.pipelines}</span>
        </div>
        <div className="text-center p-2 rounded bg-muted">
          <Users className="h-3 w-3 mx-auto mb-1" />
          <span className="font-medium">{domain.consumers}</span>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Quality: {domain.governance.dataQualityScore}%</span>
        <span className="text-muted-foreground">{domain.metrics.totalStorageGB} GB</span>
      </div>
    </div>
  );
};
