
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from "@/components/DataTable";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  PlusCircle, 
  UploadCloud, 
  Download,
  RefreshCcw,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dados fictícios para produtos
const produtosAtivos = [
  {
    id: "P001",
    nome: "Laptop Dell XPS 13",
    sku: "DELL-XPS13",
    categoria: "Eletrônicos",
    preco: 8999.90,
    estoque: 25,
    custo: 7200.00,
    status: "Ativo",
  },
  {
    id: "P002",
    nome: "Monitor Samsung 24\"",
    sku: "SAM-M24",
    categoria: "Eletrônicos",
    preco: 1299.90,
    estoque: 42,
    custo: 950.00,
    status: "Ativo",
  },
  {
    id: "P003",
    nome: "Teclado Mecânico Logitech",
    sku: "LOG-TEC1",
    categoria: "Periféricos",
    preco: 499.90,
    estoque: 15,
    custo: 320.00,
    status: "Ativo",
  },
  {
    id: "P004",
    nome: "Mouse Sem Fio Microsoft",
    sku: "MS-M100",
    categoria: "Periféricos",
    preco: 149.90,
    estoque: 52,
    custo: 90.00,
    status: "Ativo",
  },
  {
    id: "P005",
    nome: "Fone de Ouvido Sony",
    sku: "SONY-FO200",
    categoria: "Áudio",
    preco: 599.90,
    estoque: 0,
    custo: 420.00,
    status: "Sem Estoque",
  },
];

const produtosInativos = [
  {
    id: "P006",
    nome: "Tablet Samsung Tab A",
    sku: "SAM-TAB-A",
    categoria: "Eletrônicos",
    preco: 1499.90,
    estoque: 0,
    custo: 1100.00,
    status: "Descontinuado",
  },
  {
    id: "P007",
    nome: "Webcam Logitech C920",
    sku: "LOG-WC920",
    categoria: "Periféricos",
    preco: 399.90,
    estoque: 0,
    custo: 250.00,
    status: "Inativo",
  },
];

export default function Produtos() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ativos");
  
  // Colunas para a tabela de produtos
  const columns = [
    { accessor: "id", header: "ID" },
    { accessor: "nome", header: "Nome" },
    { accessor: "sku", header: "SKU" },
    { accessor: "categoria", header: "Categoria" },
    {
      accessor: "preco",
      header: "Preço",
      cell: (row: any) => (
        <span>R$ {row.preco.toFixed(2)}</span>
      )
    },
    {
      accessor: "estoque",
      header: "Estoque",
      cell: (row: any) => (
        <span className={row.estoque === 0 ? "text-red-500 font-medium" : ""}>
          {row.estoque}
        </span>
      )
    },
    {
      accessor: "status",
      header: "Status",
      cell: (row: any) => {
        let color = "bg-green-100 text-green-800";
        if (row.status === "Sem Estoque") color = "bg-red-100 text-red-800";
        if (row.status === "Inativo") color = "bg-gray-100 text-gray-800";
        if (row.status === "Descontinuado") color = "bg-orange-100 text-orange-800";
        
        return (
          <Badge variant="outline" className={`${color}`}>
            {row.status}
          </Badge>
        );
      }
    },
    {
      accessor: "margem",
      header: "Margem",
      cell: (row: any) => {
        const margem = ((row.preco - row.custo) / row.preco * 100).toFixed(1);
        let textColor = "text-green-600";
        
        if (parseFloat(margem) < 20) textColor = "text-red-600";
        else if (parseFloat(margem) < 30) textColor = "text-orange-600";
        
        return (
          <span className={`font-medium ${textColor}`}>{margem}%</span>
        );
      }
    },
  ];
  
  // Ações para a tabela
  const actions = [
    {
      label: "Visualizar",
      onClick: (row: any) => {
        toast({
          title: "Visualizando produto",
          description: `Detalhes do produto: ${row.nome}`,
        });
      },
    },
    {
      label: "Editar",
      onClick: (row: any) => {
        toast({
          title: "Editando produto",
          description: `Editando: ${row.nome}`,
        });
      },
    },
    {
      label: "Duplicar",
      onClick: (row: any) => {
        toast({
          title: "Duplicando produto",
          description: `Criando cópia de: ${row.nome}`,
        });
      },
    },
  ];
  
  // Ações adicionais para produtos inativos
  const acoesInativos = [
    ...actions,
    {
      label: "Reativar",
      onClick: (row: any) => {
        toast({
          title: "Reativando produto",
          description: `Reativando: ${row.nome}`,
        });
      },
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCcw className="w-4 h-4 mr-1" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <UploadCloud className="w-4 h-4 mr-1" />
            Importar
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1" />
            Novo Produto
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">154</div>
            <p className="text-sm text-muted-foreground">
              Total de Produtos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">145</div>
            <p className="text-sm text-muted-foreground">
              Produtos Ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">23</div>
            <p className="text-sm text-muted-foreground">
              Baixo Estoque
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">9</div>
            <p className="text-sm text-muted-foreground">
              Produtos Inativos
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="ativos" className="w-full">
        <TabsList>
          <TabsTrigger 
            value="ativos" 
            onClick={() => setActiveTab("ativos")}
          >
            Produtos Ativos
          </TabsTrigger>
          <TabsTrigger 
            value="inativos" 
            onClick={() => setActiveTab("inativos")}
          >
            Produtos Inativos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ativos">
          <Card>
            <CardHeader>
              <CardTitle>Produtos Ativos</CardTitle>
              <CardDescription>
                Gerencie todos os seus produtos ativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={produtosAtivos}
                columns={columns}
                actions={actions}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inativos">
          <Card>
            <CardHeader>
              <CardTitle>Produtos Inativos</CardTitle>
              <CardDescription>
                Produtos que foram descontinuados ou desativados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={produtosInativos}
                columns={columns}
                actions={acoesInativos}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
