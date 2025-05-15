
import { useState, useEffect } from "react";

// Dados de exemplo para simular uma API
const clientesMock = [
  { 
    id: "1", 
    nome: "Empresa ABC", 
    documento: "12.345.678/0001-90", 
    telefone: "(11) 3456-7890", 
    email: "contato@empresaabc.com", 
    cidade: "São Paulo", 
    ultimaCompra: "10/05/2025",
    totalCompras: "R$ 12.350,00"
  },
  { 
    id: "2", 
    nome: "João Silva", 
    documento: "123.456.789-00", 
    telefone: "(11) 98765-4321", 
    email: "joao.silva@email.com", 
    cidade: "Rio de Janeiro", 
    ultimaCompra: "05/05/2025",
    totalCompras: "R$ 3.680,00"
  },
  { 
    id: "3", 
    nome: "Comércio XYZ", 
    documento: "98.765.432/0001-10", 
    telefone: "(21) 3456-7890", 
    email: "vendas@xyz.com", 
    cidade: "Curitiba", 
    ultimaCompra: "02/05/2025",
    totalCompras: "R$ 8.750,00"
  },
  { 
    id: "4", 
    nome: "Maria Costa", 
    documento: "987.654.321-00", 
    telefone: "(31) 98765-4321", 
    email: "maria.costa@email.com", 
    cidade: "Belo Horizonte", 
    ultimaCompra: "25/04/2025",
    totalCompras: "R$ 1.920,00"
  },
  { 
    id: "5", 
    nome: "Distribuidora FastSell", 
    documento: "45.678.901/0001-23", 
    telefone: "(51) 3456-7890", 
    email: "comercial@fastsell.com", 
    cidade: "Porto Alegre", 
    ultimaCompra: "20/04/2025",
    totalCompras: "R$ 25.430,00"
  }
];

export function useClientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simula uma chamada à API
    const fetchClientes = async () => {
      setIsLoading(true);
      try {
        // Simulando uma requisição assíncrona
        await new Promise((resolve) => setTimeout(resolve, 500));
        setClientes(clientesMock);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar dados de clientes");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientes();
  }, []);

  return { clientes, isLoading, error };
}
