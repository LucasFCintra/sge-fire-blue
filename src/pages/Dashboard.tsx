import { Package, DollarSign, ShoppingCart, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, MoveRight, Clock, Truck, CircleDot } from "lucide-react";
import StatusCard from "@/components/StatusCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { useState, useEffect } from "react";

// Dados fictícios para os gráficos
const productionData = [
  { name: "Seg", producao: 120 },
  { name: "Ter", producao: 140 },
  { name: "Qua", producao: 100 },
  { name: "Qui", producao: 180 },
  { name: "Sex", producao: 150 },
  { name: "Sab", producao: 90 },
  { name: "Dom", producao: 70 },
];

const productData = [
  { name: "Item A", quantidade: 40 },
  { name: "Item B", quantidade: 30 },
  { name: "Item C", quantidade: 20 },
  { name: "Item D", quantidade: 27 },
  { name: "Item E", quantidade: 18 },
];

const lowStockItems = [
  { id: 1, name: "Produto A", current: 5, min: 10 },
  { id: 2, name: "Produto B", current: 3, min: 15 },
  { id: 3, name: "Produto C", current: 8, min: 20 },
];

// Componente de contador animado
function AnimatedCounter({ endValue, duration = 1500 }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        const newCount = Math.floor((progress / duration) * endValue);
        setCount(newCount);
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [endValue, duration]);
  
  return <span className="text-2xl font-bold">{count}</span>;
}

export default function Dashboard() {
  // Dados para o rastreamento geral
  const aguardandoRetirada = 24;
  const emProducao = 48;
  const recebidos = 35;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Produtos em Estoque"
          value={1234}
          description="Produtos disponíveis no estoque"
          icon={<Package className="h-4 w-4" />}
          trend={{ value: 12, positive: true }}
          animated={true}
        />
        <StatusCard
          title="Saídas de Matéria Prima"
          value={584}
          description="+20% em relação ao mês anterior"
          icon={<ArrowUpFromLine className="h-4 w-4" />}
          trend={{ value: 20, positive: false }}
          animated={true}
        />
        <StatusCard
          title="Entrada de Produto"
          value={356}
          description="Produtos recebidos no mês"
          icon={<ArrowDownToLine className="h-4 w-4" />}
          trend={{ value: 15, positive: true }}
          animated={true}
        />
        <StatusCard
          title="Itens Baixo Estoque"
          value={15}
          description="Itens abaixo do nível mínimo"
          icon={<AlertTriangle className="h-4 w-4" />}
          className="border-red-200 bg-red-50"
          animated={true}
        />
      </div>
      
      {/* Card de Rastreamento Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Rastreamento Geral</CardTitle>
          <CardDescription>
            Fluxo de trabalho e situação atual dos itens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between py-4">
            <div className="flex flex-col items-center p-4 rounded-lg bg-amber-50 border border-amber-200 mb-4 md:mb-0 w-full md:w-1/4">
              <Clock className="h-10 w-10 text-amber-500 mb-2" />
              <AnimatedCounter endValue={aguardandoRetirada} />
              <span className="text-sm font-bold text-gray-600">Aguardando Retirada</span>
            </div>
            
            <div className="hidden md:flex items-center justify-center w-1/6">
              <MoveRight className="h-10 w-10 text-gray-800 font-bold stroke-2" />
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50 border border-blue-200 mb-4 md:mb-0 w-full md:w-1/4">
              <CircleDot className="h-10 w-10 text-blue-500 mb-2" />
              <AnimatedCounter endValue={emProducao} />
              <span className="text-sm font-bold text-gray-600">Em Produção</span>
            </div>
            
            <div className="hidden md:flex items-center justify-center w-1/6">
              <MoveRight className="h-10 w-10 text-gray-800 font-bold stroke-2" />
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-green-50 border border-green-200 w-full md:w-1/4">
              <Truck className="h-10 w-10 text-green-500 mb-2" />
              <AnimatedCounter endValue={recebidos} />
              <span className="text-sm font-bold text-gray-600">Itens Recebidos</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Produção por Período</CardTitle>
            <CardDescription>
              Volume de produção nos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={productionData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorProducao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1177ee" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1177ee" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="producao"
                  stroke="#1177ee"
                  fillOpacity={1}
                  fill="url(#colorProducao)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Produtos por Volume</CardTitle>
            <CardDescription>
              Produtos com maior quantidade em estoque
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantidade" fill="#0a4f99" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Alerta de Estoque Baixo</CardTitle>
          <CardDescription>
            Produtos que necessitam reposição urgente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mínimo Recomendado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.current} unidades
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.min} unidades
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Crítico
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
