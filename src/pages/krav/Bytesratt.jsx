import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'phosphor-react';
import './Policy.css';

const Bytesratt = () => {
  return (
    <>
      <Helmet>
        <title>Bytesrätt & Öppet Köp | Teknikhuset Kalmar</title>
      </Helmet>
      <div className="policy-container">
        <div className="policy-content">
          <Link to="/trygghet" className="back-btn-icon-only" aria-label="Tillbaka">
              <ArrowLeft size={24} weight="bold" />
            </Link>
          
          <h1>Bytesrätt & Trygga Köp</h1>
          
          <p className="intro">Vi vill att du ska hitta det perfekta tillbehöret för just dig och din teknik. Skulle du komma hem och känna att valet inte blev helt rätt, är det vår ambition att göra det enkelt att hitta ett bättre alternativ. Därför erbjuder vi 14 dagars bytesrätt på vårt noga utvalda sortiment.</p>

          <div className="highlight-box">
            <h3>För Nya Tillbehör & Produkter</h3>
            <p>Du har 14 dagars bytesrätt från inköpsdatum. För att vi ska kunna erbjuda en produkt i absolut nyskick till nästa kund, är vår enda förutsättning att varan returneras helt oanvänd, komplett och i sin oskadade, obrutna originalförpackning.</p>
            <p>Ta med produkten och ditt kvitto till butiken, så hjälper vi dig att byta till en annan produkt. Skulle du inte hitta ett passande alternativ direkt, utfärdar vi ett tillgodokvitto som du kan använda i lugn och ro vid ett senare tillfälle.</p>
          </div>

          <h2>För Andrahandsenheter</h2>
          <p>Varje andrahandsenhet vi säljer har genomgått en rigorös certifieringsprocess för att garantera dess kvalitet och funktion. Eftersom dessa enheter är unika tillämpas särskilda villkor. Bytesrätt gäller inte för andrahandsenheter. Däremot skyddas ditt köp av vår dedikerade 30-dagars funktionsgaranti, vilket du kan läsa mer om under <Link to="/krav/reklamation" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 600 }}>Reklamation & Rättigheter</Link>.</p>
        </div>
      </div>
    </>
  );
};

export default Bytesratt;