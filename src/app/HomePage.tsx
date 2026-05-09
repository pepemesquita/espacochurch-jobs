"use client";

import { useState, useRef } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import {
  WhatsappLogo,
  LinkedinLogo,
  InstagramLogo,
  SignIn,
  Users,
  MagnifyingGlass,
  X,
  Eye,
  Envelope,
  Info,
  ShieldCheck,
  Handshake,
  Lightbulb,
  UserPlus,
  Briefcase,
  CaretDown,
  Tag,
  Globe
} from "@phosphor-icons/react";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Todos",
  "Advocacia", "Arquitetura", "Artesanato", "Assistência Técnica", "Beleza & Estética",
  "Consultoria", "Contabilidade", "Construção", "Design", "Direito", "Educação",
  "Elétrica", "Engenharia", "Eventos", "Fotografia", "Fretes & Mudanças",
  "Gastronomia", "Gestão", "Imóveis", "Informática", "Jardinagem", "Limpeza",
  "Logística", "Manutenção", "Marketing", "Marcenaria", "Mecânica", "Moda",
  "Música", "Nutrição", "Odontologia", "Pintura", "Pet Shop", "Produção",
  "Psicologia", "Recursos Humanos", "Reformas", "Saúde", "Seguros", "Serviços",
  "Tecnologia", "Tradução", "Turismo", "Vendas", "Viagens", "Vídeo"
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const directoryRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      if (data) {
        setProfiles(data);
      }
    } catch (e) {
      console.error('Erro ao buscar perfis:', e);
    } finally {
      setLoading(false);
    }
  }

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAuthAction = (action: string) => {
    if (action === "Login") {
      router.push("/login");
    } else if (action === "Suporte") {
      window.location.href = "mailto:contato@espacochurch.com";
    } else {
      alert(`${action} será implementado em breve!`);
    }
  };

  const filteredProfiles = activeCategory === "Todos"
    ? profiles
    : profiles.filter(p => (p.area || p.role_area) === activeCategory);

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Helper functions for links
  const formatWhatsApp = (phone: string) => {
    if (!phone) return "";
    const cleanNumber = phone.replace(/\D/g, "");
    // Add 55 if it's a BR number without DDI
    const finalNumber = cleanNumber.length <= 11 ? `55${cleanNumber}` : cleanNumber;
    const message = encodeURIComponent("Oi, irmã(o) tudo bem? Vim pelo Espaço Church Jobs e fiquei interessado no seu trabalho.");
    return `https://wa.me/${finalNumber}?text=${message}`;
  };

  const formatInstagram = (handle: string) => {
    if (!handle) return "";
    const cleanHandle = handle.replace("@", "");
    if (handle.startsWith("http")) return handle;
    return `https://instagram.com/${cleanHandle}`;
  };

  const formatLinkedIn = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `https://linkedin.com/in/${url}`;
  };

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>Espaço Church Jobs</div>
        <nav className={styles.nav}>
          <Link href="/login" className={styles.buttonOutline}>
            <SignIn size={20} weight="bold" />
            Entrar
          </Link>
          <Link href="/register" className={styles.buttonPrimary}>
            <UserPlus size={20} weight="bold" />
            Cadastrar Perfil
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Da Comunidade para a Comunidade</div>
          <h1 className={styles.heroTitle}>Encontre Talentos na Nossa Comunidade</h1>
          <p className={styles.heroSubtitle}>
            Conectando profissionais e empreendedores da Espaço Church Pelotas.
            Descubra os serviços oferecidos pelos nossos membros.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.buttonPrimary} onClick={() => scrollTo(directoryRef)}>
              <Users size={22} weight="bold" />
              Ver Profissionais
            </button>
            <Link href="/register" className={styles.buttonOutline}>
              <Briefcase size={22} weight="bold" />
              Anunciar meu Serviço
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre Nós Section */}
      <section ref={aboutRef} className={styles.infoSection}>
        <div className={styles.infoGrid}>
          <div className={styles.infoText}>
            <h2>Sobre o Projeto</h2>
            <p>
              O Espaço Church Jobs nasceu do desejo de fortalecer os laços profissionais dentro da nossa comunidade.
              Acreditamos que ao apoiar os negócios e talentos dos nossos membros, crescemos todos juntos.
            </p>
            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <div className={styles.infoCardIcon}><Handshake size={24} weight="bold" /></div>
                <div className={styles.infoCardText}>
                  <h3>Conexão Direta</h3>
                  <p>Facilitamos o contato entre quem precisa e quem oferece serviços.</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoCardIcon}><ShieldCheck size={24} weight="bold" /></div>
                <div className={styles.infoCardText}>
                  <h3>Confiança</h3>
                  <p>Profissionais que compartilham dos mesmos valores e princípios.</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <img
              src="/semear.jpg"
              alt="Comunidade"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section ref={howRef} className={styles.infoSection} style={{ background: 'var(--secondary)' }}>
        <div className={styles.infoGrid}>
          <div style={{ order: 2 }}>
            <div className={styles.infoText}>
              <h2>Como Funciona</h2>
              <p>
                Navegar pela plataforma é simples e intuitivo. Nosso objetivo é que você encontre
                a solução que precisa em poucos cliques.
              </p>
              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <div className={styles.infoCardIcon}><MagnifyingGlass size={24} weight="bold" /></div>
                  <div className={styles.infoCardText}>
                    <h3>1. Explore as Categorias</h3>
                    <p>Filtre por área de atuação e encontre o profissional ideal.</p>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoCardIcon}><Eye size={24} weight="bold" /></div>
                  <div className={styles.infoCardText}>
                    <h3>2. Analise o Perfil</h3>
                    <p>Veja detalhes, bio e especialidades de cada membro.</p>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoCardIcon}><Lightbulb size={24} weight="bold" /></div>
                  <div className={styles.infoCardText}>
                    <h3>3. Entre em Contato</h3>
                    <p>Fale diretamente via WhatsApp ou E-mail e feche negócio.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ order: 1, borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
              alt="Como funciona"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section ref={directoryRef} className={styles.directorySection}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <MagnifyingGlass size={32} className={styles.sectionIcon} color="var(--primary-light)" />
          <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Encontre Profissionais</h2>
        </div>

        {/* Searchable Dropdown Navigation */}
        <div className={styles.categoriesNav} ref={dropdownRef}>
          <div className={styles.searchDropdown}>
            <button
              className={styles.dropdownTrigger}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className={styles.dropdownTriggerText}>
                <Tag size={20} weight="bold" color="var(--primary-light)" />
                {activeCategory}
              </div>
              <CaretDown
                size={20}
                weight="bold"
                style={{
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </button>

            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownSearch}>
                  <MagnifyingGlass size={18} weight="bold" color="#94a3b8" />
                  <input
                    type="text"
                    placeholder="Pesquisar categoria..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className={styles.dropdownList}>
                  {filteredCategories.map(cat => (
                    <button
                      key={cat}
                      className={`${styles.dropdownItem} ${activeCategory === cat ? styles.dropdownItemActive : ''}`}
                      onClick={() => {
                        setActiveCategory(cat);
                        setIsDropdownOpen(false);
                        setCategorySearch("");
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                  {filteredCategories.length === 0 && (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                      Nenhuma categoria encontrada.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.grid}>
          {filteredProfiles.map(profile => (
            <div key={profile.id} className={styles.card}>
              <img src={profile.avatar_url || 'https://via.placeholder.com/150'} alt={profile.full_name} className={styles.cardAvatar} />
              <h3 className={styles.cardName}>{profile.full_name}</h3>
              <div className={styles.cardArea}>{profile.role_area}</div>
              <p className={styles.cardBio}>{profile.bio}</p>

              <button
                className={styles.buttonDetail}
                onClick={() => setSelectedProfile(profile)}
              >
                <Eye size={18} weight="bold" />
                Ver Perfil
              </button>

              <div className={styles.cardLinks}>
                <a href={formatWhatsApp(profile.whatsapp)} target="_blank" rel="noopener noreferrer" className={styles.linkIcon} title="WhatsApp">
                  <WhatsappLogo size={20} weight="fill" />
                </a>
                <a href={formatLinkedIn(profile.linkedin)} target="_blank" rel="noopener noreferrer" className={styles.linkIcon} title="LinkedIn">
                  <LinkedinLogo size={20} weight="fill" />
                </a>
                <a href={formatInstagram(profile.instagram)} target="_blank" rel="noopener noreferrer" className={styles.linkIcon} title="Instagram">
                  <InstagramLogo size={20} weight="fill" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
            Nenhum profissional encontrado nesta categoria no momento.
          </div>
        )}
      </section>

      {/* Profile Modal */}
      {selectedProfile && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProfile(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedProfile(null)}>
              <X size={24} weight="bold" />
            </button>

            <div className={styles.modalHeader}></div>
            <div className={styles.modalBody}>
              <img src={selectedProfile.avatar_url || 'https://via.placeholder.com/150'} alt={selectedProfile.full_name} className={styles.modalAvatar} />
              <h3 className={styles.modalName}>{selectedProfile.full_name}</h3>
              <span className={styles.modalArea}>{selectedProfile.role_area}</span>
              <p className={styles.modalBio}>{selectedProfile.bio}</p>

              <div className={styles.modalActions}>
                <a
                  href={formatWhatsApp(selectedProfile.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.buttonPrimary}
                >
                  <WhatsappLogo size={22} weight="bold" />
                  WhatsApp
                </a>
                
                {selectedProfile.public_email && (
                  <a 
                    href={`mailto:${selectedProfile.public_email}`}
                    className={styles.buttonOutline}
                    style={{ textTransform: 'lowercase', fontSize: '0.85rem' }}
                    title={selectedProfile.public_email}
                  >
                    <Envelope size={22} weight="bold" />
                    {selectedProfile.public_email}
                  </a>
                )}

                {selectedProfile.website && (
                  <a 
                    href={selectedProfile.website.startsWith('http') ? selectedProfile.website : `https://${selectedProfile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.buttonOutline}
                  >
                    <Globe size={22} weight="bold" />
                    Site / Portfólio
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simple Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo} style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.75rem' }}>
              Espaço Church Jobs
            </div>
            <p className={styles.footerDescription}>
              Uma iniciativa independente para conectar membros da comunidade Espaço Church Pelotas,
              promovendo o crescimento mútuo e a excelência profissional.
            </p>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Plataforma</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLink} onClick={() => scrollTo(aboutRef)}>Sobre o Projeto</li>
              <li className={styles.footerLink} onClick={() => scrollTo(howRef)}>Como Funciona</li>
              <li className={styles.footerLink} onClick={() => handleAuthAction("Privacidade")}>Privacidade</li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Navegação</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLink} onClick={() => scrollTo(directoryRef)}>Ver Profissionais</li>
              <li className={styles.footerLink} onClick={() => handleAuthAction("Login")}>Área do Membro</li>
              <li className={styles.footerLink} onClick={() => handleAuthAction("Suporte")}>Suporte</li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 Espaço Church Jobs. Todos os direitos reservados.</p>
          <p>Desenvolvido com carinho por <a href="https://pepemesquita.github.io/">Pedro Henrique</a></p>
        </div>
      </footer>
    </main>
  );
}
