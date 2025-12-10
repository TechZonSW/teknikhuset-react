import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'phosphor-react';
import './Policy.css';

const Garanti = () => {
  return (
    <>
      <Helmet>
        <title>Servicegaranti | Teknikhuset Kalmar</title>
      </Helmet>
      
        <div className="policy-container">
          <div className="policy-content">
            <Link to="/trygghet" className="back-btn-icon-only" aria-label="Tillbaka">
              <ArrowLeft size={24} weight="bold" />
            </Link>
            
            <h1>Vår Servicegaranti på Reparationer</h1>
            
            <p className="intro">Vi står bakom varje reparation vi utför. Vår grundfilosofi bygger på kompromisslös kvalitet, från de premiumdelar vi använder till den expertis våra certifierade tekniker besitter. Därför omfattas alla våra reparationer av en <strong>3-månaders servicegaranti</strong>.</p>

            <div className="highlight-box">
              <h3>Vad innebär garantin för dig?</h3>
              <p>Vår servicegaranti är ditt skydd mot eventuella funktionsfel som kan härledas till själva reparationen. Den täcker både det arbete vi har utfört och den specifika reservdel vi har installerat. Om ett sådant fel skulle uppstå inom tre månader, åtgärdar vi det utan kostnad.</p>
            </div>

            <h2>När gäller inte garantin?</h2>
            <p>För att garantin ska gälla förutsätter det att felet inte har orsakats av en ny yttre skada eller felaktig hantering efter att enheten lämnat vår verkstad. Garantin täcker därmed inte:</p>
            <ul>
              <li>Tappskador, sprickor eller tryckskador.</li>
              <li>Fuktskador.</li>
              <li>Skador orsakade av mjukvarufel eller obehöriga ingrepp.</li>
              <li>Fel på andra komponenter än de som omfattades av den ursprungliga reparationen.</li>
            </ul>

            <h2>Hur fungerar det i praktiken?</h2>
            <p>Om du upplever ett problem med din enhet efter en reparation hos oss, är du välkommen in.</p>
            <ol>
              <li><strong>Professionell Bedömning:</strong> Vår tekniker gör en noggrann undersökning för att fastställa orsaken till felet.</li>
              <li><strong>Transparent Process:</strong> Vi skapar ett serviceärende för att dokumentera och hantera ditt fall på ett systematiskt och spårbart sätt.</li>
              <li><strong>Tydliga Besked:</strong> Du får ett klart och ärligt besked baserat på vår tekniska analys.</li>
            </ol>
            <p>Vårt mål är alltid att hitta en rättvis och bra lösning som du kan känna dig trygg med.</p>
          </div>
        </div>
    </>
  );
};

export default Garanti;