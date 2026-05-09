"use client";

import { useState, useRef } from "react";
import styles from "./register.module.css";
import Link from "next/link";
import { UserPlus, CaretLeft, CloudArrowUp, WhatsappLogo, LinkedinLogo, InstagramLogo, X, Lock, Envelope } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Advocacia", "Arquitetura", "Artesanato", "Assistência Técnica", "Beleza & Estética", 
  "Consultoria", "Contabilidade", "Construção", "Design", "Direito", "Educação", 
  "Elétrica", "Engenharia", "Eventos", "Fotografia", "Fretes & Mudanças", 
  "Gastronomia", "Gestão", "Imóveis", "Informática", "Jardinagem", "Limpeza", 
  "Logística", "Manutenção", "Marketing", "Marcenaria", "Mecânica", "Moda", 
  "Música", "Nutrição", "Odontologia", "Pintura", "Pet Shop", "Produção", 
  "Psicologia", "Recursos Humanos", "Reformas", "Saúde", "Seguros", "Serviços", 
  "Tecnologia", "Tradução", "Turismo", "Vendas", "Viagens", "Vídeo"
].sort();

export default function RegisterPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    bio: "",
    whatsapp: "",
    linkedin: "",
    instagram: "",
    publicEmail: "",
    email: "",
    password: ""
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    // Mask: (00) 00000-0000
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
    } else if (value.length > 0) {
      value = value.replace(/^(\d{0,2}).*/, "($1");
    }
    
    setFormData({ ...formData, whatsapp: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create User in Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            avatar_url: previewUrl
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar usuário");

      // 2. Update Profile with extra info
      // The profile is created automatically by a trigger in DB, 
      // but we need to update the other fields.
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role_area: formData.category,
          bio: formData.bio,
          whatsapp: formData.whatsapp,
          linkedin: formData.linkedin,
          instagram: formData.instagram,
          website: formData.publicEmail // Using website field for public email or similar
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      alert("Cadastro realizado com sucesso! Bem-vindo à nossa comunidade.");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Erro ao realizar cadastro");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/" className={styles.backButton}>
          <CaretLeft size={20} weight="bold" />
          Voltar para Home
        </Link>
        
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.badge}>Novo Profissional</div>
            <h1>Cadastre seu Perfil</h1>
            <p>Faça parte da rede de talentos da nossa comunidade e seja encontrado por quem precisa dos seus serviços.</p>
          </div>

          {error && (
            <div style={{ color: '#ef4444', background: '#fef2f2', padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid #fee2e2' }}>
              {error}
            </div>
          )}
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Informações de Acesso</h2>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email_auth"><Envelope size={18} /> E-mail de Cadastro</label>
                  <input 
                    type="email" 
                    id="email_auth" 
                    placeholder="seu@email.com" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <span className={styles.inputHint}>Será usado para login e gestão do seu perfil.</span>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="password_auth"><Lock size={18} /> Senha</label>
                  <input 
                    type="password" 
                    id="password_auth" 
                    placeholder="Mínimo 6 caracteres" 
                    required 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Informações Básicas</h2>
              <div className={styles.uploadContainer}>
                <div 
                  className={styles.avatarPlaceholder} 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer', overflow: 'hidden' }}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <CloudArrowUp size={32} />
                  )}
                </div>
                <div className={styles.uploadText}>
                  <h3>Foto de Perfil</h3>
                  <p>PNG ou JPG até 5MB. Recomendado 400x400px.</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      type="button" 
                      className={styles.uploadButton}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {previewUrl ? "Alterar Foto" : "Upload"}
                    </button>
                    {previewUrl && (
                      <button 
                        type="button" 
                        className={styles.uploadButton}
                        onClick={removePhoto}
                        style={{ background: '#fee2e2', color: '#ef4444', borderColor: '#fecaca' }}
                      >
                        Remover
                      </button>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                </div>
              </div>
              
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Nome Completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Como você é conhecido" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="category">Categoria / Nicho</label>
                  <select 
                    id="category" 
                    required 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Selecione uma área</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="bio">Bio Profissional</label>
                <textarea 
                  id="bio" 
                  rows={4} 
                  placeholder="Conte um pouco sobre sua experiência e o que você oferece..." 
                  required
                  maxLength={500}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                ></textarea>
                <span className={styles.inputHint}>Máximo 500 caracteres.</span>
              </div>
            </section>
            
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Contatos e Redes</h2>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="whatsapp"><WhatsappLogo size={18} weight="fill" /> WhatsApp</label>
                  <input 
                    type="text" 
                    id="whatsapp" 
                    placeholder="(00) 00000-0000" 
                    value={formData.whatsapp}
                    onChange={handlePhoneChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="linkedin"><LinkedinLogo size={18} weight="fill" /> LinkedIn (URL)</label>
                  <input 
                    type="url" 
                    id="linkedin" 
                    placeholder="https://linkedin.com/in/..." 
                    value={formData.linkedin}
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="instagram"><InstagramLogo size={18} weight="fill" /> Instagram (@)</label>
                  <input 
                    type="text" 
                    id="instagram" 
                    placeholder="@seuusuario" 
                    value={formData.instagram}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">E-mail Público</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="contato@exemplo.com" 
                    value={formData.publicEmail}
                    onChange={(e) => setFormData({...formData, publicEmail: e.target.value})}
                  />
                </div>
              </div>
            </section>
            
            <div className={styles.formFooter}>
              <p>Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.</p>
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? (
                  "Processando..."
                ) : (
                  <>
                    <UserPlus size={22} weight="bold" />
                    Criar Perfil Profissional
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
