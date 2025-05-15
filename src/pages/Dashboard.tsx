
import { Package, DollarSign, ShoppingCart, AlertTriangle } from "lucide-react";
import StatusCard from "@/components/StatusCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from "recharts";

// Dados fictícios para os gráficos
const salesData = [
  { name: "Jan", vendas: 4000 },
  { name: "Fev", vendas: 3000 },
  { name: "Mar", vendas: 2000 },
  { name: "Abr", vendas: 2780 },
  { name: "Mai", vendas: 1890 },
  { name: "Jun", vendas: 2390 },
  { name: "Jul", vendas: 3490 },
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

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Total de Produtos"
          value="1,234"
          description="Produtos ativos no estoque"
          icon={<Package className="h-4 w-4" />}
          trend={{ value: 12, positive: true }}
        />
        <StatusCard
          title="Vendas do Mês"
          value="R$ 43,594.00"
          description="+20% em relação ao mês anterior"
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: 20, positive: true }}
        />
        <StatusCard
          title="Pedidos Pendentes"
          value="23"
          description="Pedidos aguardando processamento"
          icon={<ShoppingCart className="h-4 w-4" />}
          trend={{ value: 5, positive: false }}
        />
        <StatusCard
          title="Itens Baixo Estoque"
          value="15"
          description="Itens abaixo do nível mínimo"
          icon={<AlertTriangle className="h-4 w-4" />}
          className="border-orange-200 bg-orange-50"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Vendas por Período</CardTitle>
            <CardDescription>
              Volume de vendas nos últimos 7 meses
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="vendas"
                  stroke="#1177ee"
                  fillOpacity={1}
                  fill="url(#colorVendas)"
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
