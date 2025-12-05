// src/pages/Vardering.jsx

import React from 'react';
import { PiggyBank, Leaf, Shield, HandCoins, Store, ClipboardCheck } from 'lucide-react';
import { ValuationTool } from '../components/vardering/ValuationTool';
import FaqItem from '../components/FaqItem';
import './Vardering.css';

const Vardering = () => {
  // Data för FAQ, oförändrad
  const faqs = [
    {
      question: 'Vad behöver jag ta med mig?',
      answer: 'Ta med själva enheten och giltig legitimation. Om du har kvar originallåda och laddare kan det ibland höja värdet något, men det är inget krav.'
    },
    {
      question: 'Måste jag radera min data själv?',
      answer: 'Vi rekommenderar att du säkerhetskopierar det du vill spara, men du behöver inte radera enheten. Vi utför en certifierad dataradering som en del av vår process för att garantera din integritet.'
    },
    {
      question: 'Vad händer om jag inte accepterar ert slutgiltiga erbjudande?',
      answer: 'Inga problem alls. Vår värdering och inspektion är helt kostnadsfri och utan förpliktelser. Du kan självklart välja att tacka nej och ta med dig din enhet hem igen.'
    },
    {
      question: 'Kan jag byta in min enhet mot en annan produkt?',
      answer: 'Absolut! Värdet på din gamla enhet kan användas som rabatt vid köp av en ny eller rekonditionerad enhet från vårt sortiment, eller för att betala för en reparation. Fråga oss i butiken så hjälper vi dig.'
    }
  ];

  return (
    <>
      {/* Section 1: Hero (New Dark Version) */}
      <section id="vardering-hero">
        <div className="container hero-content">
          <h1>Förvandla din gamla teknik till <span className="highlight">något nytt.</span></h1>
          <p>
            Låt inte din gamla mobil eller dator samla damm. Ge den ett nytt liv hos oss och få betalt direkt. Det är ett smart val för både din plånbok och för vår planet.
          </p>
          <a href="#valuation-tool" className="cta-button primary">Värdera min enhet nu</a>
        </div>
      </section>

      {/* Section 2: Reasons to sell (Refined) */}
      <section className="content-section">
        <div className="container">
          <div className="section-header">
            <h2>Ett smartare val. Tre goda anledningar.</h2>
          </div>
          <div className="reasons-grid">
            <div className="reason-card">
              <div className="reason-icon"><PiggyBank size={32} strokeWidth={2} /></div>
              <h3>Få Rättvist Betalt</h3>
              <p>Få ett konkurrenskraftigt pris för din gamla enhet. Använd pengarna till vad du vill, eller byt upp dig till en nyare modell direkt i butiken.</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon"><Leaf size={32} strokeWidth={2} /></div>
              <h3>Minska Elektronikskrotet</h3>
              <p>Varje enhet som återanvänds är en vinst för miljön. Du bidrar aktivt till en cirkulär ekonomi och en mer hållbar framtid.</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon"><Shield size={32} strokeWidth={2} /></div>
              <h3>Garanterat Säker Hantering</h3>
              <p>Vi tar din integritet på största allvar. All personlig data raderas säkert enligt militär standard innan enheten får ett nytt liv.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive Valuation Tool (Refined) */}
      <section id="valuation-tool" className="content-section light-bg-section scroll-target">
        <div className="container">
          {/* NY STRUKTUR: Rubriken är nu INUTI wrappern för en kompaktare layout */}
          <div className="valuation-tool-wrapper">
            <div className="section-header" style={{ marginBottom: '40px' }}>
              <h2>Se vad din enhet är värd</h2>
              <p>Få en kostnadsfri prisuppskattning online på under en minut. Inga förpliktelser.</p>
            </div>
            <ValuationTool />
          </div>
        </div>
      </section>

      {/* Section 4: How it works (Refined Timeline) */}
      <section className="content-section">
        <div className="container">
           <div className="section-header">
            <h2>Från enhet till pengar – på några minuter.</h2>
           </div>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-icon">1</div>
              <div className="timeline-content">
                <h3>Värdera Online (Valfritt)</h3>
                <p>Få en snabb prisuppskattning här på hemsidan så vet du ungefär vad du kan förvänta dig. Du kan också komma in direkt utan föranmälan.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">2</div>
              <div className="timeline-content">
                <h3>Besök Oss i Kalmar</h3>
                <p>Kom in med din enhet till vår butik. En av våra tekniker gör en professionell och transparent inspektion medan du väntar.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">3</div>
              <div className="timeline-content">
                <h3>Få Betalt Direkt</h3>
                <p>När du accepterat vårt slutgiltiga erbjudande raderar vi din data säkert och betalar ut pengarna direkt via Swish. Hela processen är oftast klar på 10-15 minuter.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: FAQ (Refined) */}
      <section id="faq" className="content-section light-bg-section scroll-target">
        <div className="container small-container">
          <div className="section-header">
            <h2>Bra att veta inför ditt besök</h2>
          </div>
           <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Vardering;