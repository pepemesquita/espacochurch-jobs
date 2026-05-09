"use client";

import { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { SignIn, CaretLeft, GoogleLogo, FacebookLogo } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
      });
      if (error) throw error;
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.loginContainer}>
        <Link href="/" className={styles.backButton}>
          <CaretLeft size={20} weight="bold" />
          Voltar para Home
        </Link>
        
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.logo}>Espaço Church Jobs</div>
            <h1>Bem-vindo de volta</h1>
            <p>Entre com sua conta para gerenciar seu perfil profissional.</p>
          </div>
          
          {error && <div style={{ color: '#ef4444', background: '#fef2f2', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center', border: '1px solid #fee2e2' }}>{error}</div>}

          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">E-mail</label>
              <input 
                type="email" 
                id="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <div className={styles.formOptions}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>Lembrar-me</span>
              </label>
              <a href="#" className={styles.forgotPassword}>Esqueceu a senha?</a>
            </div>
            
            <button type="submit" className={styles.submitButton} disabled={loading}>
              <SignIn size={20} weight="bold" />
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          
          <div className={styles.divider}>
            <span>ou entre com</span>
          </div>
          
          <div className={styles.socialLogin}>
            <button className={styles.socialButton} onClick={() => handleSocialLogin('google')}>
              <GoogleLogo size={20} weight="bold" />
              Google
            </button>
            <button className={styles.socialButton} onClick={() => handleSocialLogin('facebook')}>
              <FacebookLogo size={20} weight="bold" />
              Facebook
            </button>
          </div>
          
          <div className={styles.loginFooter}>
            Não tem uma conta? <Link href="/register">Cadastre seu perfil</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
