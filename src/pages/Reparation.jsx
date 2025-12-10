import React, { useState } from 'react';
import { HashLink } from 'react-router-hash-link'; 
import { ShieldCheck, Zap, Wrench, Plus, Minus } from 'lucide-react';
import PriceCalculator from '../components/priser/PriceCalculator';
import './Reparation.css';
import './Priser.css'; 

const Reparation = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqItems = [
    { q: "Hur lång tid tar en vanlig reparation?", a: "Många av våra vanligaste reparationer, som skärm- och batteribyten, utförs ofta medan du väntar eller inom ett par timmar. För mer komplexa ärenden ger vi dig en tydlig tidsuppskattning efter vår kostnadsfria felsökning." },
    { q: "Behöver jag boka en tid?", a: "Du är alltid välkommen att komma in för drop-in, men för att garantera snabbast möjliga service rekommenderar vi att boka en tid via vår hemsida. Då säkerställer vi att vi har rätt delar hemma för just din modell." },
    { q: "Vad händer med min personliga data?", a: "Din integritet är vår högsta prioritet. Vi rör aldrig din data om det inte är absolut nödvändigt för reparationen (t.ex. vid mjukvaruproblem), och i sådana fall sker det alltid i samråd med dig. Vi rekommenderar dock alltid att du gör en säkerhetskopia innan inlämning." },
    { q: "Vad täcker er garanti?", a: "Vår garanti täcker den funktion vi har reparerat samt den reservdel vi har installerat. Den täcker inte nya skador som tappskador eller fuktskador som uppstår efter reparationen. Fullständiga villkor får du vid inlämning." }
  ];
  
  return (
    <>
      <section id="reparation-hero">
        <div className="hero-video-container">
          {/* Ändrat från video till img */}
          <img 
            className="hero-media-background" 
            src="/bilder/02-Hero-Reparation.png" 
            alt="Expert-reparationer av teknik" 
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content container">
          <h1>Expert-reparationer. Din digitala vardag, återställd.</h1>
          <p>En sprucken skärm, ett trött batteri eller mjukvara som krånglar – vi förstår frustrationen. Våra certifierade tekniker ger din enhet nytt liv med branschens bästa reservdelar och en service du kan lita på. Snabbt, säkert och med garanti.</p>
          <div className="hero-buttons">
            <a href="#pris" className="cta-button">Se Ditt Pris</a>
            <HashLink to="/kontakt#hitta-oss" className="cta-button tertiary">Hitta till Oss</HashLink>
          </div>
          <a href="/spara" className="secondary-link">Redan kund? Spåra din reparation här.</a>
        </div>
      </section>

      <section id="reservdelar" className="content-section light-bg-section">
        <div className="container">
          <div className="small-container"><h2>Reparationer på dina villkor. Alltid med vår garanti.</h2></div>
          <div className="guarantee-grid">
            <div className="guarantee-card"><ShieldCheck size={48} className="guarantee-icon" /><h3>Apple Original & Teknikhuset Premium</h3><p>Du väljer själv. Välj Apple Original-delar för ett resultat identiskt med fabriksnytt, eller våra noggrant testade Premium-delar – ett smartare val som möter extremt höga krav till ett bättre pris.</p></div>
            <div className="guarantee-card"><Zap size={48} className="guarantee-icon" /><h3>Alltid Gratis Felsökning</h3><p>Vi tror på transparens. Därför är vår felsökning alltid kostnadsfri. Våra certifierade tekniker hittar felet och ger dig ett ärligt råd, så att du kan fatta ett informerat beslut utan press.</p></div>
            <div className="guarantee-card"><Wrench size={48} className="guarantee-icon" /><h3>Din Trygghet, Vårt Löfte</h3><p>Vi står bakom varje reparation vi utför. Därför får du alltid en solid garanti på både arbete och reservdelar. Skulle något mot förmodan inte vara perfekt, fixar vi det.</p></div>
          </div>
        </div>
      </section>
      
      <section id="pris" className="content-section">
        <div className="container">
          <div className="small-container"><h2>Vad kostar din reparation?</h2><p className="section-intro-text">Få ett prisförslag direkt. Börja med att välja typ av enhet nedan.</p></div>
          
          {/* === HÄR IMPORTERAS DEN ÅTERANVÄNDBARA KOMPONENTEN === */}
          <PriceCalculator /> 
          
        </div>
      </section>

       <section className="content-section light-bg-section">
        <div className="container small-container">
          <h2>Frågor & Svar</h2>
          <div className="faq-accordion">
            {faqItems.map((item, index) => (
              <div className="faq-item" key={index}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <span>{item.q}</span>
                  {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                </button>
                <div className={`faq-answer ${openFaq === index ? 'open' : ''}`}><p>{item.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container small-container" style={{textAlign: 'center'}}>
          <h2>Låt oss ta en titt.</h2>
          <p className="section-intro-text">Oavsett problem är första steget en kostnadsfri felsökning. Boka en tid online eller kom förbi vår butik i Kalmar, så hjälper vi dig att hitta den bästa lösningen.</p>
          <div className="hero-buttons" style={{marginTop: '30px'}}>
            <HashLink to="/boka" className="cta-button">Boka Servicetid</HashLink>
            <HashLink to="/kontakt#kontakt-formular" className="cta-button secondary">Kontakta Oss</HashLink>
          </div>
        </div>
      </section>
    </>
  );
};

export default Reparation;