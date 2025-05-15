
import { useState } from "react";
import { FileDown, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { ActionButton } from "@/components/ActionButton";
import { FornecedorForm } from "@/components/fornecedores/FornecedorForm";
import { useToast } from "@/hooks/use-toast";
import { useFornecedores } from "@/hooks/use-fornecedores";
import { FornecedorPerformance } from "@/components/fornecedores/FornecedorPerformance";

export default function Fornecedores() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFornecedor, setSelectedFornecedor] = useState<any>(null);
  const { toast } = useToast();
  const { fornecedores, isLoading, error } = useFornecedores();

  const handleOpenForm = (fornecedor = null) => {
    setSelectedFornecedor(fornecedor);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedFornecedor(null);
    setIsFormOpen(false);
  };

  const handleOpenPerformance = (fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setIsPerformanceOpen(true);
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados estão sendo preparados para exportação.",
    });
    // Implementação real de exportação seria adicionada aqui
  };

  const filteredFornecedores = fornecedores?.filter(
    (fornecedor) =>
      fornecedor.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cnpj?.includes(searchTerm) ||
      fornecedor.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const fornecedorColumns = [
    { accessor: "nome", header: "Nome" },
    { accessor: "cnpj", header: "CNPJ" },
    { accessor: "contato", header: "Contato" },
    { accessor: "telefone", header: "Telefone" },
    { accessor: "email", header: "Email" },
    { accessor: "tempoMedioEntrega", header: "Tempo Médio Entrega (dias)" },
    { 
      accessor: (f) => f.desempenho + "%", 
      header: "Desempenho",
      cell: (fornecedor) => (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              fornecedor.desempenho > 80 ? "bg-green-500" : 
              fornecedor.desempenho > 60 ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ width: `${fornecedor.desempenho}%` }}
          ></div>
        </div>
      )
    },
  ];

  const fornecedorActions = [
    {
      label: "Editar",
      onClick: (fornecedor) => handleOpenForm(fornecedor),
    },
    {
      label: "Ver desempenho",
      onClick: (fornecedor) => handleOpenPerformance(fornecedor),
    },
    {
      label: "Excluir",
      onClick: (fornecedor) => {
        toast({
          title: "Confirmar exclusão",
          description: `Deseja realmente excluir o fornecedor ${fornecedor.nome}?`,
          variant: "destructive",
        });
      },
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-500">Erro ao carregar dados: {error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-3xl font-bold">Fornecedores</h1>
        <div className="flex flex-wrap gap-2">
          <ActionButton startIcon={<PlusCircle />} onClick={() => handleOpenForm()}>
            Novo Fornecedor
          </ActionButton>
          <ActionButton variant="outline" startIcon={<FileDown />} onClick={handleExportData}>
            Exportar
          </ActionButton>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listagem de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CNPJ, categoria..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DataTable
            data={filteredFornecedores}
            columns={fornecedorColumns}
            actions={fornecedorActions}
            isLoading={isLoading}
            onRowClick={(fornecedor) => handleOpenForm(fornecedor)}
          />
        </CardContent>
      </Card>

      {isFormOpen && (
        <FornecedorForm
          fornecedor={selectedFornecedor}
          isOpen={isFormOpen}
          onClose={handleCloseForm}
        />
      )}

      {isPerformanceOpen && (
        <FornecedorPerformance
          fornecedor={selectedFornecedor}
          isOpen={isPerformanceOpen}
          onClose={() => setIsPerformanceOpen(false)}
        />
      )}
    </div>
  );
}
