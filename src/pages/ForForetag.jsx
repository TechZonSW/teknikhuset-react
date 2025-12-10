import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChartLineUp, HardDrives, Coffee, FileText, Handshake, ArrowRight } from 'phosphor-react';
import './ForForetag.css';

const ForForetag = () => {
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

  const offers = [
    {
      id: 'hardware',
      icon: HardDrives,
      title: 'Hårdvara & Drift',
      desc: 'Vi säkerställer att ni har rätt verktyg för jobbet. Från inköp och installation av datorer och telefoner till hantering av låneenheter vid service. Vi minimerar era driftstopp.',
    },
    {
      id: 'security',
      icon: ShieldCheck,
      title: 'Säkerhet & Data',
      desc: 'Skydda er viktigaste tillgång. Vi erbjuder certifierad dataradering, säkerhetskopiering och proaktivt skydd mot digitala hot. Trygghet för både er och era kunder.',
    },
    {
      id: 'growth',
      icon: ChartLineUp,
      title: 'Strategi & Synlighet',
      desc: 'Låt tekniken driva affären framåt. Vi hjälper er med digital närvaro, strategisk IT-rådgivning och marknadsmaterial som speglar er kvalitet.',
    }
  ];

  // Denna länk skickar användaren direkt till bokningen med "IT-Konsultation för Företag" förvalt
  const consultationLink = "/boka?autoSelect=konsultation_foretag";

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
            {/* UPPDATERAD LÄNK HÄR */}
            <Link to={consultationLink} className="cta-button">Boka konsultation</Link>
            <a href="#erbjudande" className="cta-button tertiary">Se vårt erbjudande</a>
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

      {/* ===== SEKTION 3: FÖRENKLAT ERBJUDANDE ===== */}
      <section id="erbjudande" className="content-section offer-overview-section">
        <div className="container">
          <h2 data-animate>Helhetslösningar för moderna företag</h2>
          <p className="section-intro" data-animate>
            Vi erbjuder ett brett spektrum av tjänster för att stötta er verksamhet. Nedan ser ni våra huvudområden, men vi vet att varje företag är unikt. Kontakta oss så skräddarsyr vi en lösning exakt efter era behov.
          </p>
          
          <div className="offer-grid">
            {offers.map((offer) => {
              const IconComponent = offer.icon;
              return (
                <div key={offer.id} className="offer-card" data-animate>
                  <div className="offer-icon-wrapper">
                    <IconComponent size={48} weight="duotone" />
                  </div>
                  <h3>{offer.title}</h3>
                  <p>{offer.desc}</p>
                  <div className="card-divider"></div>
                  {/* UPPDATERAD LÄNK HÄR OCKSÅ FÖR ATT MINSKA FRIKTION */}
                  <Link to={consultationLink} className="offer-link">
                    Diskutera lösning <ArrowRight size={18} />
                  </Link>
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
          {/* UPPDATERAD LÄNK HÄR */}
          <Link to={consultationLink} className="cta-button secondary" data-animate>Boka konsultation</Link>
        </div>
      </section>
    </div>
  );
};

export default ForForetag;