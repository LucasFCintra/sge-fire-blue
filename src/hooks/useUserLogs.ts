
import { supabase } from "@/integrations/supabase/client";

export const useUserLogs = () => {
  const registerUserAction = async (acao: string, userId?: string) => {
    try {
      console.log('Registrando ação:', acao, 'para usuário:', userId);
      const { error } = await supabase.from('logs').insert({
        usuario_id: userId,
        acao,
        ip: 'cliente-web'
      });

      if (error) {
        console.error('Erro ao registrar ação:', error);
      }
    } catch (error) {
      console.error('Erro ao registrar ação:', error);
    }
  };

  return { registerUserAction };
};
