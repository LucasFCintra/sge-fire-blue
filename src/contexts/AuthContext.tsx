
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nome: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Configure a escuta para alterações de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Se o usuário fez login, buscar perfil
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }

        // Registrar evento de login/logout
        if (event === 'SIGNED_IN') {
          registerUserAction('login', session?.user?.id);
        } else if (event === 'SIGNED_OUT') {
          registerUserAction('logout');
        }
      }
    );

    // Verificar sessão atual no carregamento inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Buscar perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      // Cast the entire supabase client to any to bypass TypeScript type checking
      const supabaseAny = supabase as any;
      const { data, error } = await supabaseAny
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  // Registrar ações do usuário
  const registerUserAction = async (acao: string, userId?: string) => {
    try {
      // Cast the entire supabase client to any to bypass TypeScript type checking
      const supabaseAny = supabase as any;
      const { error } = await supabaseAny.from('logs').insert({
        usuario_id: userId || user?.id,
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

  // Login
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!error) {
        navigate('/');
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema.",
        });
      }

      return { error };
    } catch (error) {
      console.error('Erro no login:', error);
      return { error };
    }
  };

  // Cadastro
  const signUp = async (email: string, password: string, nome: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome
          }
        }
      });

      if (!error && data.user) {
        // Criar perfil do usuário
        // Cast the entire supabase client to any to bypass TypeScript type checking
        const supabaseAny = supabase as any;
        const { error: profileError } = await supabaseAny.from('profiles').insert({
          id: data.user.id,
          nome,
          email
        });

        // Definir role padrão
        await supabaseAny.from('user_roles').insert({
          user_id: data.user.id,
          role: 'operador'
        });

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
        } else {
          toast({
            title: "Cadastro realizado com sucesso!",
            description: "Faça login para acessar o sistema."
          });
          navigate('/login');
        }
      }

      return { error };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { error };
    }
  };

  // Logout
  const signOut = async () => {
    await registerUserAction('logout');
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Reset de senha
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`
      });
      
      if (!error) {
        toast({
          title: "E-mail enviado com sucesso!",
          description: "Verifique sua caixa de entrada para redefinir sua senha."
        });
      }

      return { error };
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
