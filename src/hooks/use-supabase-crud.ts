
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Hook genérico para operações CRUD
export const useSupabaseCrud = <T extends Record<string, any>>(tableName: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Registra ação no log
  const logAction = async (acao: string, tabela: string, registroId?: string, detalhes?: any) => {
    try {
      if (!user) return;
      
      await supabase.from('logs').insert({
        usuario_id: user.id,
        acao,
        tabela,
        registro_id: registroId,
        detalhes
      });
    } catch (error) {
      console.error('Erro ao registrar log:', error);
    }
  };

  // Buscar todos os registros
  const getAll = async (options?: {
    page?: number;
    pageSize?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    filters?: Record<string, any>;
  }): Promise<{ data: T[] | null; count: number | null }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const {
        page = 1,
        pageSize = 100,
        orderBy = 'created_at',
        orderDirection = 'desc',
        filters = {}
      } = options || {};

      let query = supabase
        .from(tableName)
        .select('*', { count: 'exact' });

      // Aplicar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'string' && value.includes('%')) {
            query = query.ilike(key, value);
          } else {
            query = query.eq(key, value);
          }
        }
      });

      // Ordenação e paginação
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .order(orderBy, { ascending: orderDirection === 'asc' })
        .range(from, to);

      if (error) throw error;

      await logAction('consulta', tableName);

      return { data: data as T[], count };
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erro ao buscar dados",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, count: null };
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar um registro por ID
  const getById = async (id: string): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      await logAction('visualizar', tableName, id);

      return data as T;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erro ao buscar registro",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Criar novo registro
  const create = async (record: Partial<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Se a tabela tiver um campo usuario_id, adicione automaticamente
      const recordWithUser = user?.id && !('usuario_id' in record) && 
        ['compras', 'vendas', 'movimentacoes_estoque', 'configuracoes'].includes(tableName)
        ? { ...record, usuario_id: user.id }
        : record;

      const { data, error } = await supabase
        .from(tableName)
        .insert(recordWithUser)
        .select()
        .single();

      if (error) throw error;

      await logAction('inserir', tableName, data.id, recordWithUser);

      toast({
        title: "Registro criado com sucesso",
        description: "O registro foi adicionado ao sistema."
      });

      return data as T;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erro ao criar registro",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar registro existente
  const update = async (id: string, record: Partial<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(record)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await logAction('atualizar', tableName, id, record);

      toast({
        title: "Registro atualizado com sucesso",
        description: "As alterações foram salvas."
      });

      return data as T;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erro ao atualizar registro",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir registro
  const remove = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      await logAction('excluir', tableName, id);

      toast({
        title: "Registro excluído com sucesso",
        description: "O item foi removido do sistema."
      });

      return true;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erro ao excluir registro",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getAll,
    getById,
    create,
    update,
    remove
  };
};

// Hooks específicos para cada tabela
export const useGrupos = () => useSupabaseCrud('grupos');
export const useSubgrupos = () => useSupabaseCrud('subgrupos');
export const useSubSubgrupos = () => useSupabaseCrud('sub_subgrupos');
export const useProdutos = () => useSupabaseCrud('produtos');
export const useClientes = () => useSupabaseCrud('clientes');
export const useFornecedores = () => useSupabaseCrud('fornecedores');
export const useCompras = () => useSupabaseCrud('compras');
export const useComprasItens = () => useSupabaseCrud('compras_itens');
export const useVendas = () => useSupabaseCrud('vendas');
export const useVendasItens = () => useSupabaseCrud('vendas_itens');
export const useMovimentacoesEstoque = () => useSupabaseCrud('movimentacoes_estoque');
export const useConfiguracoes = () => useSupabaseCrud('configuracoes');
