"use client";

import { useState, useRef } from "react";
import styles from "./register.module.css";
import Link from "next/link";
import { UserPlus, CaretLeft, CloudArrowUp, WhatsappLogo, LinkedinLogo, InstagramLogo, X } from "@phosphor-icons/react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
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
                  <input type="text" id="name" placeholder="Como você é conhecido" required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="category">Categoria / Nicho</label>
                  <select id="category" required>
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
              ></textarea>
              <span className={styles.inputHint}>Máximo 500 caracteres.</span>
            </div>
            </section>
            
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Contatos e Redes</h2>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="whatsapp"><WhatsappLogo size={18} weight="fill" /> WhatsApp</label>
                  <input type="text" id="whatsapp" placeholder="(00) 00000-0000" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="linkedin"><LinkedinLogo size={18} weight="fill" /> LinkedIn (URL)</label>
                  <input type="url" id="linkedin" placeholder="https://linkedin.com/in/..." />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="instagram"><InstagramLogo size={18} weight="fill" /> Instagram (@)</label>
                  <input type="text" id="instagram" placeholder="@seuusuario" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">E-mail Público</label>
                  <input type="email" id="email" placeholder="contato@exemplo.com" />
                </div>
              </div>
            </section>
            
            <div className={styles.formFooter}>
              <p>Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.</p>
              <button type="submit" className={styles.submitButton}>
                <UserPlus size={22} weight="bold" />
                Criar Perfil Profissional
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
