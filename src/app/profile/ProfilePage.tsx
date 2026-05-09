"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./profile.module.css";
import Link from "next/link";
import { 
  CaretLeft, 
  CloudArrowUp, 
  WhatsappLogo, 
  LinkedinLogo, 
  InstagramLogo, 
  Envelope, 
  Globe, 
  FloppyDisk,
  SignOut,
  CheckCircle
} from "@phosphor-icons/react";
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

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    bio: "",
    whatsapp: "",
    linkedin: "",
    instagram: "",
    website: ""
  });

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      
      // Carregar dados da tabela profiles para garantir os dados mais atuais
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const metadata = user.user_metadata;
      
      // Usar dados da tabela profile ou do metadata como fallback
      setFormData({
        name: profile?.full_name || metadata?.full_name || "",
        category: profile?.role_area || metadata?.role_area || "",
        bio: profile?.bio || metadata?.bio || "",
        whatsapp: profile?.whatsapp || metadata?.whatsapp || "",
        linkedin: profile?.linkedin || metadata?.linkedin || "",
        instagram: profile?.instagram || metadata?.instagram || "",
        website: profile?.website || metadata?.website || ""
      });
      
      setPreviewUrl(profile?.avatar_url || metadata?.avatar_url || null);
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
    } finally {
      setLoading(false);
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
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

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file);
        setPreviewUrl(resized);
      } catch (err) {
        console.error("Erro ao processar imagem", err);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Atualizar Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.name,
          avatar_url: previewUrl,
          role_area: formData.category,
          bio: formData.bio,
          whatsapp: formData.whatsapp,
          linkedin: formData.linkedin,
          instagram: formData.instagram,
          website: formData.website
        }
      });

      if (authError) throw authError;

      // 2. Atualizar Tabela Profiles (que é o que a Home exibe)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.name,
          avatar_url: previewUrl,
          role_area: formData.category,
          bio: formData.bio,
          whatsapp: formData.whatsapp,
          linkedin: formData.linkedin,
          instagram: formData.instagram,
          website: formData.website,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar alterações");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <p style={{ color: 'var(--primary)', fontWeight: 600 }}>Carregando seu perfil...</p>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link href="/" className={styles.backButton} style={{ marginBottom: 0 }}>
            <CaretLeft size={20} weight="bold" />
            Voltar para Home
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton} style={{ marginTop: 0 }}>
            <SignOut size={20} weight="bold" />
            Sair da Conta
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.badge}>Gestão do Profissional</div>
            <h1>Meu Perfil</h1>
            <p>Mantenha suas informações atualizadas para atrair mais clientes na comunidade.</p>
          </div>

          {error && (
            <div style={{ color: '#ef4444', background: '#fef2f2', padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid #fee2e2', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ color: '#059669', background: '#ecfdf5', padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid #d1fae5', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <CheckCircle size={24} weight="fill" />
              Perfil atualizado com sucesso!
            </div>
          )}
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Dados Visíveis</h2>
              
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
                  <p>A imagem que aparecerá no diretório.</p>
                  <button 
                    type="button" 
                    className={styles.uploadButton}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Alterar Foto
                  </button>
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
                  placeholder="Conte um pouco sobre sua experiência..." 
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
                  <label htmlFor="website"><Globe size={18} /> Site ou Portfólio</label>
                  <input 
                    type="url" 
                    id="website" 
                    placeholder="https://meusite.com" 
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>
              </div>
            </section>
            
            <div className={styles.formFooter}>
              <button type="submit" className={styles.submitButton} disabled={saving}>
                {saving ? (
                  "Salvando..."
                ) : (
                  <>
                    <FloppyDisk size={22} weight="bold" />
                    Salvar Alterações
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
