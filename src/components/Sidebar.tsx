
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  Warehouse,
  ClipboardList,
  BarChart3,
  Settings,
  Store,
  Users,
  Truck,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  end?: boolean;
}

const NavItem = ({ to, icon: Icon, label, end }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
        )
      }
    >
      <Icon className="flex-shrink-0 h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  );
};

export default function Sidebar({ open, setOpen }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col w-64 bg-sidebar border-r border-gray-200 md:relative transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {open && (
              <h2 className="text-xl font-bold text-sidebar-foreground">
                Inventário
              </h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:flex hidden text-sidebar-foreground"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
              <span className="sr-only">
                {open ? "Fechar menu" : "Abrir menu"}
              </span>
            </Button>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
          <NavItem to="/" icon={BarChart3} label="Dashboard" end />
          <NavItem to="/inventario" icon={Warehouse} label="Inventário" />
          <NavItem to="/produtos" icon={Package} label="Produtos" />
          <NavItem to="/vendas" icon={ShoppingCart} label="Vendas" />
          <NavItem to="/compras" icon={Truck} label="Compras" />
          <NavItem to="/clientes" icon={Users} label="Clientes" />
          <NavItem to="/fornecedores" icon={Store} label="Fornecedores" />
          <NavItem to="/relatorios" icon={FileText} label="Relatórios" />
          <NavItem to="/ordens" icon={ClipboardList} label="Ordens" />
          <NavItem to="/configuracoes" icon={Settings} label="Configurações" />
        </nav>
      </aside>
    </>
  );
}
