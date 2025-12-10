import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'phosphor-react';
import './Policy.css';

const Reklamation = () => {
  return (
    <>
      <Helmet>
        <title>Reklamation & Rättigheter | Teknikhuset Kalmar</title>
      </Helmet>
      <div className="policy-container">
        <div className="policy-content">
          <Link to="/trygghet" className="back-btn-icon-only" aria-label="Tillbaka">
              <ArrowLeft size={24} weight="bold" />
            </Link>
          
          <h1>Reklamation & Dina Rättigheter</h1>
          
          <p className="intro">Vår ambition är att varje produkt och tjänst från Teknikhuset ska överträffa dina förväntningar. Skulle något mot förmodan inte leva upp till den standard vi utlovar, har vi en tydlig och rättvis process för att hantera det.</p>

          <div className="highlight-box">
            <h3>Garanti på Andrahandsenheter</h3>
            <p>Som ett led i vårt hållbarhetslöfte står vi stolt bakom de enheter vi ger ett nytt liv. Varje certifierad andrahandsenhet du köper hos oss kommer med en <strong>30-dagars funktionsgaranti</strong>. Garantin täcker hårdvarufel som inte beror på yttre åverkan. Den omfattar inte batteriets normala förslitning, kosmetiskt slitage eller skador som uppstått efter köpet (såsom tapp- eller fuktskador).</p>
          </div>

          <h2>Vår Process för en Rättvis Lösning</h2>
          <p>Oavsett om det gäller en garanti på en andrahandsenhet eller en reklamation på en annan produkt eller tjänst, är vår process densamma:</p>
          
          <ul>
            <li><strong>En Öppen Dialog:</strong> Besök oss i butiken med produkten och ditt kvitto. En personlig dialog är det bästa sättet för oss att förstå din situation och hitta en väg framåt.</li>
            <li><strong>Systematisk Hantering:</strong> Vi skapar ett formellt serviceärende för all dokumentation. Detta garanterar en systematisk och spårbar hantering där inga detaljer faller mellan stolarna.</li>
            <li><strong>Utredning & Transparent Återkoppling:</strong> Vi genomför en noggrann utredning och återkommer till dig med en tydlig förklaring och ett förslag på lösning.</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Reklamation;