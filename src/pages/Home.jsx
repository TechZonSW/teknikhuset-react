import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkle, Leaf, Headphones, Wrench, MagnifyingGlassPlus, Cpu, CloudArrowUp, Storefront, ShieldCheck } from 'phosphor-react';

const Home = () => {
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
      {
        threshold: 0.15, // An element is "visible" when 15% of it is in view
      }
    );

    const elementsToAnimate = document.querySelectorAll('[data-animate]');
    elementsToAnimate.forEach((el) => observer.observe(el));

    // Cleanup observer on component unmount
    return () => elementsToAnimate.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <>
      {/* ===== HERO-SEKTION ===== */}
      <section id="hero">
        <div className="hero-video-container">
          <video playsInline autoPlay muted loop id="hero-video">
            <source src="/bilder/Animation-start.mp4" type="video/mp4" />
            Din webbläsare stöder inte video-taggen.
          </video>
          <div className="hero-overlay"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container hero-content">
          <h1 data-animate>Upptäck en smartare vardag</h1>
          <p data-animate>Upplev noggrant utvald teknik, personlig service och sömlösa reparationer – både online och i butik. Med rum för lugn, omtanke och val som känns rätt.</p>
          <div className="hero-buttons" data-animate>
            <Link to="/kontakt" className="cta-button tertiary">Utforska e-Butiken</Link>
            <Link to="/kontakt" className="cta-button tertiary">Våra Reparationer</Link>
            <Link to="/kontakt" className="cta-button tertiary">Gratis Felsökning</Link>
          </div>
        </div>
      </section>

      {/* ===== HEDONISK KÄRNERBJUDANDE-SEKTION ===== */}
      <section id="core-focus" className="content-section light-bg-section">
        <div className="container small-container">
          <h2 data-animate>Allt du och din teknik förtjänar, för ett enklare liv.</h2>
        </div>
        <div className="container">
          <div className="focus-grid">
            {/* KORT 1: E-BUTIKEN */}
            <div className="focus-card" data-animate>
              <div className="focus-card-content">
                <h2>Din vardag, förhöjd.</h2>
                <p>Utforska allt från de senaste innovationerna till hållbara certifierade alternativ. Komplettera med noga utvalda tillbehör och känn dig trygg med att allt levereras med omsorg och en trygg garanti.</p>
                <ul className="sub-offering-list">
                  <li className="sub-offering-item">
                    <Link to="/kontakt">
                      <Sparkle size={32} weight="duotone" />
                      <div className="sub-offering-text">
                        <h4>Den Senaste Tekniken</h4>
                        <p>För dig som vill ha det bästa, först.</p>
                      </div>
                    </Link>
                  </li>
                  <li className="sub-offering-item">
                    <Link to="/kontakt">
                      <Leaf size={32} weight="duotone" />
                      <div className="sub-offering-text">
                        <h4>Kvalitet som Varar</h4>
                        <p>Ge teknik ett nytt liv – för dig och planeten</p>
                      </div>
                    </Link>
                  </li>
                  <li className="sub-offering-item">
                    <Link to="/kontakt">
                      <Headphones size={32} weight="duotone" />
                      <div className="sub-offering-text">
                        <h4>Personliga Tillval</h4>
                        <p>Ge din teknik stil och ett omsorgsfullt skydd.</p>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="focus-card-footer">
                <Link to="/kontakt" className="cta-button">Kliv in i e-Butiken</Link>
              </div>
            </div>

            {/* KORT 2: REPARATIONER */}
            <div className="focus-card" data-animate>
              <div className="focus-card-content">
                <h2>Din teknik, i trygga händer.</h2>
                <p>När något inte fungerar som det ska, finns våra tekniker här för att hjälpa. Vi återställer din enhet med noggrant utvalda reservdelar av högsta kvalitet, så att du snabbt kan återgå till din vardag.</p>
                <ul className="sub-offering-list">
                  <li className="sub-offering-item">
                    <Link to="/kontakt">
                      <Wrench size={32} weight="duotone" />
                      <div className="sub-offering-text">
                        <h4>Expert-Reparationer</h4>
                        <p>Ny skärm, fräschare batteri till mjuk drift.</p>
                      </div>
                    </Link>
                  </li>
                  <li className="sub-offering-item">
                    <Link to="/kontakt">
                      <MagnifyingGlassPlus size={32} weight="duotone" />
                      <div className="sub-offering-text">
                        <h4>Kostnadsfri felsökning</h4>
                        <p>Vi hittar felet helt gratis!</p>
                      </div>
                    </Link>
                  </li>
                  <li className="sub-offering-item">
                    <Link to="/kontakt">
                      <Cpu size={32} weight="duotone" />
                      <div className="sub-offering-text">
                        <h4>Bygg din dator</h4>
                        <p>Vi monterar din drömdator, för gaming eller kreativitet.</p>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="focus-card-footer">
                <Link to="/kontakt" className="cta-button secondary">Utforska våra reparationer</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VARFÖR OSS-AVSNITT ===== */}
      <section id="our-promise" className="content-section light-bg-section">
        <div className="container">
          <h2 data-animate>Teknik som bara fungerar</h2>
          <div className="feature-list">
            <div className="feature-item" data-animate>
              <CloudArrowUp size={56} weight="duotone" />
              <h3>Sömlös Upplevelse</h3>
              <p>Från första klicket i vår e-butik till personlig hjälp i butiken. Allt ska kännas enkelt och tryggt.</p>
            </div>
            <div className="feature-item" data-animate>
              <Leaf size={56} weight="duotone" />
              <h3>Hållbara Val</h3>
              <p>Genom att erbjuda reparationer och certifierade andrahandsenheter ger vi tekniken ett längre liv.</p>
            </div>
            <div className="feature-item" data-animate>
              <Storefront size={56} weight="duotone" />
              <h3>Lokal Expertis</h3>
              <p>Vi finns här för dig i Kalmar. Få hjälp, ställ frågor och känn dig som hemma hos oss.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRYGGHET-SEKTION ===== */}
      <section id="why-us" className="content-section dark-section">
        <div className="container">
          <h2 data-animate>Trygghet är vår standard</h2>
          <div className="feature-list">
            <div className="feature-item dark-feature" data-animate>
              <ShieldCheck size={56} weight="duotone" />
              <h3>Garanti på allt</h3>
              <p>Vi står bakom vårt arbete. Alla reparationer och produkter kommer med en solid garanti.</p>
            </div>
            <div className="feature-item dark-feature" data-animate>
              <Wrench size={56} weight="duotone" />
              <h3>Certifierade tekniker</h3>
              <p>Våra experter hanterar din enhet med största omsorg och enligt branschens högsta standard.</p>
            </div>
            <div className="feature-item dark-feature" data-animate>
              <Sparkle size={56} weight="duotone" />
              <h3>Premiumdelar</h3>
              <p>Vi använder endast de bästa reservdelarna för ett resultat som känns och fungerar som nytt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INBYTESSEKTION ===== */}
      <section id="trade-in" className="content-section trade-in-section">
        <div className="container small-container">
          <h2 data-animate>Byt in. Byt upp.</h2>
          <p data-animate>Har du en gammal enhet som samlar damm? Byt in den hos oss! Få ett bra pris för den som du kan använda till en nyare modell eller en reparation. Bra för både plånboken och planeten.</p>
          <Link to="/kontakt" className="cta-button secondary" data-animate>Få en värdering</Link>
        </div>
      </section>
    </>
  );
};

export default Home;