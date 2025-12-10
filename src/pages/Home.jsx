import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Sparkle, Leaf, Headphones, Wrench, MagnifyingGlassPlus, Cpu, CloudArrowUp, Storefront, ShieldCheck } from 'phosphor-react';
import './Home.css';

const slidesData = [
  {
    type: 'video',
    source: '/01-Hem/01-Hero-Video.mp4',
    h1: 'Upptäck en smartare vardag',
    p: 'Upplev noggrant utvald teknik, personlig service och sömlösa reparationer – både online och i butik. Med rum för lugn, omtanke och val som känns rätt.',
    buttons: [
      { text: 'Utforska e-Butiken', path: '/e-butik', class: 'tertiary' },
      { text: 'Våra Reparationer', path: '/reparation', class: 'tertiary' },
      { text: 'Gratis Felsökning', path: '/boka?autoSelect=gratis_felsökning', class: 'tertiary' },
    ],
  },
  {
    type: 'image',
    source: '/01-Hem/02-Hero-Transparens.png',
    h1: 'Radikal transparens',
    p: 'Följ din reparation i realtid med vårt unika live-spårningssystem. Vi tror på full insyn, därför erbjuder vi alltid gratis felsökning innan du fattar ett beslut.',
    buttons: [
      { text: 'Spåra din Reparation', path: '/spara', class: 'tertiary' },
      { text: 'Boka Felsökning', path: '/boka?autoSelect=express_diagnos', class: 'tertiary' },
    ],
  },
  {
    type: 'image',
    source: '/01-Hem/03-Hero-Kvalitet.png',
    h1: 'Kompromisslös kvalitet',
    p: 'Som Apple Independent Repair Provider använder vi originaldelar. Vårt Quality Lab stresstestar varje tillbehör så att du kan känna dig helt trygg.',
    buttons: [
      { text: 'Apple Original-delar', path: '/reparation#reservdelar', class: 'tertiary' },
      { text: 'Se Våra Tillbehör', path: '/e-butik', class: 'tertiary' },
    ],
  },
  {
    type: 'image',
    source: '/01-Hem/04-Hero-Service.png',
    h1: 'Serviceupplevelse i världsklass',
    p: 'Koppla av i vår kundlounge medan vi tar hand om din teknik. Vi är inte bara en butik, vi är en plats för lärande, dialog och personlig service.',
    buttons: [
      { text: 'Besök Oss i Kalmar', path: '/kontakt#hitta-oss', class: 'tertiary' },
      { text: 'Vår Filosofi', path: '/kontakt#filosofi', class: 'tertiary' },
    ],
  },
  {
    type: 'image',
    source: '/01-Hem/5-Hero-Hållbarhet.png',
    h1: 'Hållbarhet som kärnvärde',
    p: 'Vi förlänger livet på den teknik som redan finns. Upptäck våra A-klassade rekonditionerade enheter – ett smartare val för både plånboken och planeten.',
    buttons: [
      { text: 'Köp Rekonditionerat', path: '/e-butik', class: 'tertiary' },
      { text: 'Värdera din Enhet', path: '/vardering#valuation-tool', class: 'tertiary' },
    ],
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const timeoutRef = useRef(null);
  const sliderRef = useRef(null);
  
  const isMobile = windowWidth <= 900;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(
      () => setCurrentSlide((prev) => (prev === slidesData.length - 1 ? 0 : prev + 1)),
      8000
    );

    return () => clearTimeout(timeoutRef.current);
  }, [currentSlide]);

  useEffect(() => {
    if (isMobile && sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: slideWidth * currentSlide,
        behavior: 'smooth'
      });
    }
  }, [currentSlide, isMobile]);
  
  useEffect(() => {
    if (isMobile && sliderRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = parseInt(entry.target.dataset.index, 10);
              setCurrentSlide(index);
            }
          });
        },
        { root: sliderRef.current, threshold: 0.5 }
      );

      const slides = sliderRef.current.querySelectorAll('.slide');
      slides.forEach((slide) => observer.observe(slide));

      return () => slides.forEach((slide) => observer.unobserve(slide));
    }
  }, [isMobile]);

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

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

  return (
    <>
      <section id="hero">
        <div
          ref={sliderRef}
          className="carousel-slider"
          style={!isMobile ? { transform: `translateX(${-currentSlide * 100}%)` } : {}}
        >
          {slidesData.map((slide, index) => (
            <div className="slide" key={index} data-index={index}>
              <div className="hero-video-container">
                {slide.type === 'video' ? (
                  <video playsInline autoPlay muted loop className="hero-media-background">
                    <source src={slide.source} type="video/mp4" />
                    Din webbläsare stöder inte video-taggen.
                  </video>
                ) : (
                  <img src={slide.source} alt="" className="hero-media-background" />
                )}
                <div className="hero-overlay"></div>
                <div className="hero-glow"></div>
              </div>
              <div className="container hero-content">
                <h1 data-animate>{slide.h1}</h1>
                <p data-animate>{slide.p}</p>
                <div className="hero-buttons" data-animate>
                  {slide.buttons.map((button, btnIndex) => (
                    // Byt Link mot HashLink här:
                    <HashLink key={btnIndex} to={button.path} className={`cta-button ${button.class}`}>
                      {button.text}
                    </HashLink>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-dots">
          {slidesData.map((_, index) => (
            <div
              key={index}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>
      </section>
      
      <section id="core-focus" className="content-section light-bg-section">
        <div className="container small-container">
          <h2 data-animate>Allt du och din teknik förtjänar, för ett enklare liv.</h2>
        </div>
        <div className="container">
          <div className="focus-grid">
            <div className="focus-card" data-animate>
              <div className="focus-card-content">
                <h2>Din teknik, i trygga händer.</h2>
                <p>När något inte fungerar som det ska, finns våra tekniker här för att hjälpa. Vi återställer din enhet med noggrant utvalda reservdelar av högsta kvalitet, så att du snabbt kan återgå till din vardag.</p>
                <ul className="sub-offering-list">
                  <li className="sub-offering-item">
                    <Link to="/reparation">
                      <Wrench size={32} weight="duotone" />
                      <div className="sub-offering-text">
                        <h4>Expert-Reparationer</h4>
                        <p>Ny skärm, fräschare batteri till mjuk drift.</p>
                      </div>
                    </Link>
                  </li>
                  <li className="sub-offering-item">
                    {/* KORRIGERAD: Nu med 'ö' i id:t */}
                    <Link to="/boka?autoSelect=gratis_felsökning">
                      <MagnifyingGlassPlus size={32} weight="duotone" />
                      <div className="sub-offering-text">
                        <h4>Kostnadsfri felsökning</h4>
                        <p>Vi hittar felet helt gratis!</p>
                      </div>
                    </Link>
                  </li>
                  <li className="sub-offering-item">
                    <HashLink to="/reparation#reservdelar">
                      <Cpu size={32} weight="duotone" />
                      <div className="sub-offering-text">
                        <h4>Bygg din dator</h4>
                        <p>Vi monterar din drömdator, för gaming eller kreativitet.</p>
                      </div>
                    </HashLink>
                  </li>
                </ul>
              </div>
              <div className="focus-card-footer">
                <Link to="/reparation" className="cta-button secondary">Utforska våra reparationer</Link>
              </div>
            </div>
            <div className="focus-card" data-animate>
              <div className="focus-card-content">
                <h2>Din vardag, förhöjd.</h2>
                <p>Utforska allt från de senaste innovationerna till hållbara certifierade alternativ. Komplettera med noga utvalda tillbehör och känn dig trygg med att allt levereras med omsorg och en trygg garanti.</p>
                <ul className="sub-offering-list">
                  <li className="sub-offering-item">
                    <Link to="/e-butik">
                      <Sparkle size={32} weight="duotone" />
                      <div className="sub-offering-text">
                        <h4>Den Senaste Tekniken</h4>
                        <p>För dig som vill ha det bästa, först.</p>
                      </div>
                    </Link>
                  </li>
                  <li className="sub-offering-item">
                    <Link to="/e-butik">
                      <Leaf size={32} weight="duotone" />
                      <div className="sub-offering-text">
                        <h4>Kvalitet som Varar</h4>
                        <p>Ge teknik ett nytt liv – för dig och planeten</p>
                      </div>
                    </Link>
                  </li>
                  <li className="sub-offering-item">
                    <Link to="/e-butik">
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
                <Link to="/e-butik" className="cta-button">Kliv in i e-Butiken</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
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
              <Wrench size={32} weight="duotone" />
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
      <section id="trade-in" className="content-section trade-in-section">
        <div className="container small-container">
          <h2 data-animate>Byt in. Byt upp.</h2>
          <p data-animate>Har du en gammal enhet som samlar damm? Byt in den hos oss! Få ett bra pris för den som du kan använda till en nyare modell eller en reparation. Bra för både plånboken och planeten.</p>
          <Link to="/vardering" className="cta-button secondary" data-animate>Få en värdering</Link>
        </div>
      </section>
    </>
  );
};

export default Home;