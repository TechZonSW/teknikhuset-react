const Home = () => {
  return (
    <>
      {/* ===== HERO-SEKTION ===== */}
      <section id="hero">
        <video playsInline autoPlay muted loop id="hero-video">
          <source src="/bilder/Animation-start.mp4" type="video/mp4" />
          Din webbläsare stöder inte video-taggen.
        </video>
        <div className="container hero-content">
          <h1>Upptäck en smartare vardag</h1>
          <p>Upplev noggrant utvald teknik, personlig service och sömlösa reparationer – både online och i butik. Med rum för lugn, omtanke och val som känns rätt.</p>
          <div className="hero-buttons">
            <a href="e-butik.html" className="cta-button tertiary">Utforska e-Butiken</a>
            <a href="reparation.html" className="cta-button tertiary">Våra Reparationer</a>
            <a href="felsokning.html" className="cta-button tertiary">Gratis Felsökning</a>
          </div>
        </div>
      </section>

      {/* ===== KÄRNERBJUDANDE-SEKTION ===== */}
      <section id="core-focus" className="content-section light-bg-section">
        {/* ... Klistra in resten av sektionerna från din main-tagg här ... */}
      </section>

      {/* ... Fortsätt med de andra sektionerna ... */}

      <section id="trade-in" className="content-section">
        <div className="container small-container">
          <h2>Byt in. Byt upp.</h2>
          <p>Har du en gammal enhet som samlar damm? Byt in den hos oss! Få ett bra pris för den som du kan använda till en nyare modell eller en reparation. Bra för både plånboken och planeten.</p>
          <a href="vardering.html" className="cta-button secondary">Få en värdering</a>
        </div>
      </section>
    </>
  );
};

export default Home;