
import { useState } from "react";
import { Package, FileText, Download, Upload, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Dados fictícios para a tabela de inventário
const inventarioData = [
  {
    id: "INV001",
    produto: "Laptop Dell XPS 13",
    sku: "DELL-XPS13",
    categoria: "Eletrônicos",
    quantidade: 25,
    valorUnitario: 8999.90,
    localizacao: "Prateleira A1",
    status: "Em Estoque",
  },
  {
    id: "INV002",
    produto: "Monitor Samsung 24\"",
    sku: "SAM-M24",
    categoria: "Eletrônicos",
    quantidade: 42,
    valorUnitario: 1299.90,
    localizacao: "Prateleira B3",
    status: "Em Estoque",
  },
  {
    id: "INV003",
    produto: "Teclado Mecânico Logitech",
    sku: "LOG-TEC1",
    categoria: "Periféricos",
    quantidade: 15,
    valorUnitario: 499.90,
    localizacao: "Prateleira C2",
    status: "Baixo Estoque",
  },
  {
    id: "INV004",
    produto: "Mouse Sem Fio Microsoft",
    sku: "MS-M100",
    categoria: "Periféricos",
    quantidade: 52,
    valorUnitario: 149.90,
    localizacao: "Prateleira C4",
    status: "Em Estoque",
  },
  {
    id: "INV005",
    produto: "Fone de Ouvido Sony",
    sku: "SONY-FO200",
    categoria: "Áudio",
    quantidade: 0,
    valorUnitario: 599.90,
    localizacao: "Prateleira D1",
    status: "Sem Estoque",
  },
  {
    id: "INV006",
    produto: "Carregador USB-C",
    sku: "CHRG-USBC",
    categoria: "Acessórios",
    quantidade: 8,
    valorUnitario: 89.90,
    localizacao: "Prateleira E2",
    status: "Baixo Estoque",
  },
  {
    id: "INV007",
    produto: "Câmera Canon EOS",
    sku: "CANON-EOS",
    categoria: "Fotografia",
    quantidade: 12,
    valorUnitario: 3999.90,
    localizacao: "Prateleira F1",
    status: "Em Estoque",
  },
];

export default function Inventario() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Colunas para a tabela de inventário
  const columns = [
    { accessor: "id", header: "ID" },
    { accessor: "produto", header: "Produto" },
    { accessor: "sku", header: "SKU" },
    { accessor: "categoria", header: "Categoria" },
    { 
      accessor: "quantidade", 
      header: "Quantidade",
      cell: (row: any) => (
        <span className={row.quantidade === 0 ? "text-red-500 font-medium" : ""}>
          {row.quantidade}
        </span>
      )
    },
    { 
      accessor: "valorUnitario", 
      header: "Valor Unitário",
      cell: (row: any) => (
        <span>R$ {row.valorUnitario.toFixed(2)}</span>
      )
    },
    { accessor: "localizacao", header: "Localização" },
    { 
      accessor: "status", 
      header: "Status",
      cell: (row: any) => {
        let color = "bg-green-100 text-green-800";
        if (row.status === "Baixo Estoque") color = "bg-yellow-100 text-yellow-800";
        if (row.status === "Sem Estoque") color = "bg-red-100 text-red-800";
        
        return (
          <Badge variant="outline" className={`${color}`}>
            {row.status}
          </Badge>
        );
      }
    }
  ];
  
  // Ações para a tabela
  const actions = [
    {
      label: "Visualizar Detalhes",
      onClick: (row: any) => {
        toast({
          title: "Visualizando produto",
          description: `Detalhes do produto: ${row.produto}`,
        });
      },
    },
    {
      label: "Editar",
      onClick: (row: any) => {
        toast({
          title: "Editando produto",
          description: `Editando: ${row.produto}`,
        });
      },
    },
    {
      label: "Ajustar Estoque",
      onClick: (row: any) => {
        toast({
          title: "Ajustando estoque",
          description: `Ajustando estoque de: ${row.produto}`,
        });
      },
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Inventário</h1>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm">
            <Package className="w-4 h-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">136</div>
            <p className="text-sm text-muted-foreground">
              Total de Items
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
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-sm text-muted-foreground">
              Sem Estoque
            </p>
          </CardContent>
        </Card>
      </div>
      
      <DataTable
        data={inventarioData}
        columns={columns}
        actions={actions}
        onRowClick={(row) => {
          toast({
            title: "Selecionado",
            description: `Produto: ${row.produto}`,
          });
        }}
      />
    </div>
  );
}
