
import { useState } from "react";
import { BarcodeScannerIcon, FileDown, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { ActionButton } from "@/components/ActionButton";
import { ClienteForm } from "@/components/clientes/ClienteForm";
import { useToast } from "@/hooks/use-toast";
import { useClientes } from "@/hooks/use-clientes";
import { BarcodeScanner } from "@/components/BarcodeScanner";

export default function Clientes() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const { toast } = useToast();
  const { clientes, isLoading, error } = useClientes();

  const handleOpenForm = (cliente = null) => {
    setSelectedCliente(cliente);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedCliente(null);
    setIsFormOpen(false);
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados estão sendo preparados para exportação.",
    });
    // Implementação real de exportação seria adicionada aqui
  };

  const filteredClientes = clientes?.filter(
    (cliente) =>
      cliente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.documento?.includes(searchTerm) ||
      cliente.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const clienteColumns = [
    { accessor: "nome", header: "Nome" },
    { accessor: "documento", header: "CPF/CNPJ" },
    { accessor: "telefone", header: "Telefone" },
    { accessor: "email", header: "Email" },
    { accessor: "cidade", header: "Cidade" },
    { accessor: "ultimaCompra", header: "Última Compra" },
    { accessor: "totalCompras", header: "Total em Compras" },
  ];

  const clienteActions = [
    {
      label: "Editar",
      onClick: (cliente) => handleOpenForm(cliente),
    },
    {
      label: "Ver histórico",
      onClick: (cliente) => {
        toast({
          title: "Histórico do cliente",
          description: `Visualizando histórico de ${cliente.nome}`,
        });
      },
    },
    {
      label: "Excluir",
      onClick: (cliente) => {
        toast({
          title: "Confirmar exclusão",
          description: `Deseja realmente excluir o cliente ${cliente.nome}?`,
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
        <h1 className="text-3xl font-bold">Clientes</h1>
        <div className="flex flex-wrap gap-2">
          <ActionButton startIcon={<PlusCircle />} onClick={() => handleOpenForm()}>
            Novo Cliente
          </ActionButton>
          <ActionButton startIcon={<BarcodeScannerIcon />} onClick={() => setIsScannerOpen(true)}>
            Escanear
          </ActionButton>
          <ActionButton variant="outline" startIcon={<FileDown />} onClick={handleExportData}>
            Exportar
          </ActionButton>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listagem de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CPF/CNPJ, cidade..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DataTable
            data={filteredClientes}
            columns={clienteColumns}
            actions={clienteActions}
            isLoading={isLoading}
            onRowClick={(cliente) => handleOpenForm(cliente)}
          />
        </CardContent>
      </Card>

      {isFormOpen && (
        <ClienteForm
          cliente={selectedCliente}
          isOpen={isFormOpen}
          onClose={handleCloseForm}
        />
      )}

      {isScannerOpen && (
        <BarcodeScanner
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScan={(codigo) => {
            toast({
              title: "Código escaneado",
              description: `Código: ${codigo}`,
            });
            setIsScannerOpen(false);
          }}
        />
      )}
    </div>
  );
}
