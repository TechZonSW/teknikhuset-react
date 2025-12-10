import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'phosphor-react';
import './Policy.css';

const MedlemskapPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Medlemskap & Villkor | Teknikhuset Kalmar</title>
        <meta name="description" content="Läs våra medlemskapsvillkor, datahantering och hur vi hanterar dina personuppgifter." />
      </Helmet>
      <div className="policy-container">
        <div className="policy-content">
          <Link to="/trygghet" className="back-btn-icon-only" aria-label="Tillbaka">
            <ArrowLeft size={24} weight="bold" />
          </Link>
          
          <h1>Medlemskap & Villkor</h1>
          
          <p className="intro">
            Vi är stolta över transparensen kring våra medlemskapsvillkor och hur vi hanterar din information. 
            Din sekretess och trygghet är vår högsta prioritet.
          </p>

          <h2>Medlemskapsavtalet</h2>
          <p>
            När du registrerar dig som medlem hos Teknikhuset accepterar du dessa villkor. Medlemskapet är ett avtal mellan dig och Teknikhuset Kalmar och reglerar dina rättigheter och åtaganden som medlem.
          </p>

          <div className="highlight-box">
            <h3>Viktiga punkter</h3>
            <p>
              <strong>Ingen bindningstid:</strong> Du kan avsluta ditt medlemskap när som helst utan att behöva ange någon anledning. 
              Om du är månadsmedlem kan du säga upp ditt medlemskap med omedelbar verkan. 
              Om du är årsmedlem får du användning under hela året du betalat för.
            </p>
            <p>
              <strong>Betalning:</strong> Betalning av medlemsavgiften sker i butiken eller via autogiro/faktura enligt det du valt. 
              Vi kommer att bekräfta betalningsmetod med dig innan något debiteras.
            </p>
          </div>

          <h2>Din personlig information</h2>
          <p>
            Vi samlar in och lagrar följande information från dig vid registrering:
          </p>
          <ul>
            <li>Namn</li>
            <li>Personnummer</li>
            <li>E-postadress</li>
            <li>Telefonnummer</li>
            <li>Familjemedlemmars namn och personnummer (om familjemedlemskap)</li>
          </ul>

          <h2>Hur vi hanterar din data</h2>
          <p>
            Vi lagrar dina personuppgifter i ett säkert med strikt åtkomstbegränsning. 
            Endast våra auktoriserade medarbetare har åtkomst för att hantera medlemskapsärenden.
          </p>

          <div className="highlight-box">
            <h3>Lagring & Radering</h3>
            <p>
              <strong>Lagringslängd:</strong> Vi behåller dina uppgifter så länge du är aktiv medlem. 
              Efter att du avslutar ditt medlemskap lagrar vi dina uppgifter i 7 år för bokförings- och skattemässiga ändamål, 
              som krävs enligt svensk lag.
            </p>
            <p>
              <strong>Efter 7 år:</strong> Dina personuppgifter raderas permanent från våra system.
            </p>
            <p>
              <strong>Din rätt:</strong> Du kan när som helst begära att vi raderar eller korrigerar dina uppgifter. 
              Kontakta oss på <a href="mailto:team@teknikhusetkalmar.se">team@teknikhusetkalmar.se</a>.
            </p>
          </div>

          <h2>GDPR & Din Sekretess</h2>
          <p>
            Vi följer EU:s dataskyddsförordning (GDPR) strikt. Du har rätt att:
          </p>
          <ul>
            <li><strong>Få tillgång:</strong> Begära att se alla personuppgifter vi har lagrat om dig</li>
            <li><strong>Korrigera:</strong> Uppdatera eller korrigera felaktig information</li>
            <li><strong>Radera:</strong> Begära radering av dina uppgifter (med vissa begränsningar enligt lag)</li>
            <li><strong>Portabilitet:</strong> Få dina uppgifter i strukturerad, maskinläsbar form</li>
            <li><strong>Invända:</strong> Motsätta dig viss bearbetning av dina uppgifter</li>
          </ul>

          <p>
            För att utöva dessa rättigheter, kontakta oss via <a href="mailto:team@teknikhusetkalmar.se">team@teknikhusetkalmar.se </a> 
            eller ring oss på  <a href="tel:0761723014">076-172 30 14</a>.
          </p>

          <h2>Kommunikation & Marknadsföring</h2>
          <p>
            Vi använder din e-postadress för:
          </p>
          <ul>
            <li>Medlemskapsbekräftelser och viktiga uppdateringar</li>
            <li>Servicepåminnelser och erbjudanden specifika för ditt medlemskap</li>
            <li>Nyhetsbrev om nya tjänster (endast om du gett ditt samtycke)</li>
          </ul>

          <p>
            Du kan när som helst avsluta mottagandet av marknadsföringsmaterial genom att klicka på avslutningslänken i e-posten 
            eller genom att kontakta oss direkt.
          </p>

          <h2>Ändringar av Villkoren</h2>
          <p>
            Vi förbehåller oss rätten att uppdatera dessa villkor när som helst. 
            Vi kommer att meddela dig om väsentliga ändringar via e-post. 
            Ditt fortsatta medlemskap efter en ändring innebär att du accepterar de nya villkoren.
          </p>

          <div className="highlight-box">
            <h3>Frågor eller Klagomål?</h3>
            <p>
              Kontakta oss direkt på <a href="mailto:team@teknikhusetkalmar.se">team@teknikhusetkalmar.se </a> 
              eller <a href="tel:0761723014">076-172 30 14 </a> 
              och vi löser det tillsammans.
            </p>
          </div>

          <div className="policy-footer">
            <p>
              <small>Senast uppdaterad: {new Date().getFullYear()}</small>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedlemskapPolicy;