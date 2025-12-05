import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChartLineUp, HardDrives, ArrowRight, Coffee, FileText, Handshake } from 'phosphor-react';
import './ForForetag.css';

const ForForetag = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const elementsToAnimate = document.querySelectorAll('[data-animate]');
    elementsToAnimate.forEach((el) => observer.observe(el));

    return () => elementsToAnimate.forEach((el) => observer.unobserve(el));
  }, []);

  const handleCategoryToggle = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const categories = [
    {
      id: 'hardware',
      icon: HardDrives,
      title: 'Akut Hjälp & Hårdvaruhantering',
      subtitle: 'En trygg grund för er dagliga drift.',
      services: [
        { title: 'Prioriterad Reparationsservice', desc: 'Garanterade servicetider som minimerar era driftstopp.' },
        { title: 'Zero-Stress Onboarding', desc: 'Vi levererar en fullt arbetsredo dator till er nyanställda.' },
        { title: 'Secure Offboarding Protocol', desc: 'Säkerhetskopiering och certifierad radering när en anställd slutar.' },
        { title: 'Hantering av Låneenheter', desc: 'Håll produktiviteten uppe med en ersättningsenhet under servicetiden.' },
        { title: 'Oberoende Inköpsrådgivning', desc: 'Vi hjälper er att hitta rätt teknik till rätt pris och undvika dyra felköp.' }
      ]
    },
    {
      id: 'security',
      icon: ShieldCheck,
      title: 'Säkerhet & Datahantering',
      subtitle: 'Skydda er viktigaste tillgång – er information.',
      services: [
        { title: 'Certifierad Dataradering', desc: 'Radera känslig data enligt militär standard med ett juridiskt gångbart certifikat.' },
        { title: 'Avancerad Dataåterställning', desc: 'Vår digitala räddningstjänst för förlorad eller raderad affärskritisk data.' },
        { title: 'Centraliserad Säkerhetshantering', desc: 'Vi ser till att alla era enheter har ett uppdaterat skydd mot virus och skadlig kod.' },
        { title: 'Proaktiv Systemövervakning (SLA)', desc: 'Vi upptäcker och löser problem innan de påverkar er verksamhet.' }
      ]
    },
    {
      id: 'growth',
      icon: ChartLineUp,
      title: 'Digital Synlighet & Tillväxt',
      subtitle: 'Verktygen som hjälper er att växa och synas i Kalmar.',
      services: [
        { title: 'Strategisk Hemsida & Närvaro', desc: 'Vi bygger er digitala butik och ser till att lokala kunder hittar den via Google.' },
        { title: 'Professionellt Marknadsmaterial', desc: 'Från digitala annonser till tryckta broschyrer – vi skapar material som speglar er kvalitet.' },
        { title: 'Strategisk IT-Rådgivning', desc: 'Låt oss tillsammans skapa en färdplan för hur teknik kan driva er affär framåt.' }
      ]
    }
  ];

  return (
    <div className="for-foretag-page">
      {/* ===== SEKTION 1: HERO ===== */}
      <section className="foretag-hero">
        <div className="foretag-hero-bg"></div>
        <div className="foretag-hero-overlay"></div>
        <div className="container hero-content" data-animate>
          <h1>Tekniken som möjliggör er framgång</h1>
          <p>
            Din teknik ska arbeta för dig, inte mot dig. Från små företag till större organisationer – vi är er dedikerade IT-partner som ser till att era system alltid fungerar.
          </p>
          <div className="hero-buttons">
            <Link to="/kontakt" className="cta-button">Boka konsultation</Link>
            <a href="#foretagslosningar" className="cta-button tertiary">Utforska lösningar</a>
          </div>
        </div>
      </section>

      {/* ===== SEKTION 2: PARTNER-LÖFTE ===== */}
      <section className="content-section partner-section">
        <div className="container">
          <h2 data-animate>Från reaktiv brandsläckning till proaktiv trygghet</h2>
          <div className="partner-grid">
            <div className="partner-column" data-animate>
              <h3>Traditionell IT-support</h3>
              <p className="column-title">Reaktivt</p>
              <p>Väntar på att problem uppstår. Fokuserar på att laga det som är trasigt. En kostnad när olyckan är framme.</p>
            </div>
            <div className="partner-column proactive" data-animate>
              <h3>Teknikhuset som Partner</h3>
              <p className="column-title">Proaktivt</p>
              <p>Förebygger problem innan de sker. Fokuserar på att optimera er verksamhet. En investering i er produktivitet och sinnesro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEKTION 3: TJÄNSTE-DASHBOARD ===== */}
      <section id="foretagslosningar" className="content-section solutions-dashboard">
        <div className="container">
          <h2 data-animate>Ett komplett ekosystem av tjänster för ert företag</h2>
          <p className="section-intro" data-animate>
            Hovra eller klicka för att utforska våra lösningar inom varje område.
          </p>
          <div className="solutions-grid">
            {categories.map((category, idx) => {
              const IconComponent = category.icon;
              const isExpanded = expandedCategory === category.id;
              return (
                <div
                  key={category.id}
                  className={`solution-category ${isExpanded ? 'expanded' : ''}`}
                  data-animate
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <div className="category-header">
                    <IconComponent size={40} weight="duotone" />
                    <h3>{category.title}</h3>
                    <p>{category.subtitle}</p>
                  </div>
                  <div className="service-cards-container">
                    {category.services.map((service, sIdx) => (
                      <div key={sIdx} className="service-card">
                        <div>
                          <h4>{service.title}</h4>
                          <p>{service.desc}</p>
                        </div>
                        <ArrowRight size={20} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SEKTION 4: USP / BEVIS ===== */}
      <section className="content-section usp-section dark-section">
        <div className="container small-container">
          <h2 data-animate>Byggt av oss, för oss. Nu för er.</h2>
          <p data-animate>
            Vi tror på att visa, inte bara berätta. Den premiumkänsla du upplever på denna hemsida, designen i vår fysiska butik och det marknadsmaterial vi använder – allt är skapat internt av samma team som nu erbjuder sin expertis till er. Vi är inte en byrå som säljer en teori; vi är företagare som har byggt ett varumärke från grunden. Låt oss hjälpa er att göra detsamma.
          </p>
          <Link to="/kontakt" className="cta-button" data-animate>Se vårt arbete</Link>
        </div>
      </section>

      {/* ===== SEKTION 5: PROCESS / TIMELINE ===== */}
      <section className="content-section timeline-section">
        <div className="container small-container">
          <h2 data-animate>En enkel väg till ett tryggare partnerskap</h2>
          <div className="timeline">
            <div className="timeline-step" data-animate>
              <div className="timeline-icon"><Coffee size={32} weight="duotone" /></div>
              <h3>1. Kostnadsfri Konsultation</h3>
              <p>Allt börjar med ett förutsättningslöst möte där vi lyssnar på era behov och utmaningar. Vi bjuder på kaffet.</p>
            </div>
            <div className="timeline-connector" data-animate></div>
            <div className="timeline-step" data-animate>
              <div className="timeline-icon"><FileText size={32} weight="duotone" /></div>
              <h3>2. Skräddarsydd Offert</h3>
              <p>Baserat på vårt samtal tar vi fram ett tydligt och transparent förslag på lösningar som passar just er verksamhet och budget.</p>
            </div>
            <div className="timeline-connector" data-animate></div>
            <div className="timeline-step" data-animate>
              <div className="timeline-icon"><Handshake size={32} weight="duotone" /></div>
              <h3>3. Partnerskap & Löpande Support</h3>
              <p>När ni är nöjda inleder vi vårt partnerskap. Vi blir er dedikerade kontaktpunkt för all er teknik och finns här för att proaktivt stötta er tillväxt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEKTION 6: FINAL CTA ===== */}
      <section className="content-section final-cta-section">
        <div className="container small-container">
          <h2 data-animate>Redo att byta tekniskt strul mot strategisk trygghet?</h2>
          <p data-animate>
            Låt oss visa er hur ett partnerskap med Teknikhuset kan frigöra tid, öka er produktivitet och ge er den sinnesro som krävs för att fokusera på er kärnverksamhet. Boka ett kostnadsfritt och förutsättningslöst möte idag.
          </p>
          <Link to="/kontakt" className="cta-button secondary" data-animate>Boka konsultation</Link>
        </div>
      </section>
    </div>
  );
};

export default ForForetag;