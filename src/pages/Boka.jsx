import React, { useState } from 'react';
import { CaretLeft, CaretRight } from 'phosphor-react';
import { Wrench, MagnifyingGlassPlus, Briefcase, UserCircle, Gear } from 'phosphor-react';
import './Boka.css'; 
import BookingWidget from '../components/bokning/BookingWidget';

const serviceCategories = [
  {
    id: 'felsökning',
    groupTitle: 'Felsökning & Diagnos',
    groupDescription: 'Osäker på vad som är fel? Vi hittar problemet snabbt, ger dig ett transparent kostnadsförslag och löser det på plats eller via inlämning.',
    icon: <MagnifyingGlassPlus size={40} weight="duotone" />,
    services: [
      {
        id: 'gratis_felsökning',
        title: 'Gratis Felsökning',
        duration: '15 min',
        description: 'Kostnadsfri diagnos för att identifiera problemet.',
      },
      {
        id: 'express_diagnos',
        title: 'Express Diagnos & Rådgivning',
        duration: '30 min',
        description: 'Grundlig diagnosticering med rekommendation på snabbaste lösning för ditt problem.',
      }
    ]
  },
  {
    id: 'reparation',
    groupTitle: 'Reparation',
    groupDescription: 'Snabba och professionella reparationer. Vi byter komponenter eller löser hårdvaruproblem.',
    icon: <Wrench size={40} weight="duotone" />,
    services: [
      {
        id: 'express_reparation',
        title: 'Expressreparation',
        duration: '1 timme',
        description: 'Snabba byten (skärm, batteri, etc). Oftast klart medan du väntar.',
      },
      {
        id: 'inlamning_reparation',
        title: 'Inlämning (Reparation)',
        duration: 'Varierande',
        description: 'För komplexa hårdvaruproblem som vattenskador. Vi kontaktar dig med uppdateringar.',
      }
    ]
  },
  {
    id: 'mjukvara',
    groupTitle: 'Mjukvaralösningar',
    groupDescription: 'Datöverföringar, system-underhåll, dataåterställning och allt för att din enhet fungerar perfekt.',
    icon: <Gear size={40} weight="duotone" />,
    services: [
      {
        id: 'enkel_mjukvara',
        title: 'Enkel Mjukvara Åtgärd',
        duration: '30 min',
        description: 'Uppdateringar, virusscanning, grundläggande optimering.',
      },
      {
        id: 'avancerad_mjukvara',
        title: 'Avancerad Mjukvara Åtgärd',
        duration: 'Utan tidsgräns',
        description: 'Ominstallation av OS, systemfelsökning, data-återställning. Vi ringer med prisförslag.',
      },
      {
        id: 'dataoverforingökning',
        title: 'Dataöverföring',
        duration: 'Efter behov',
        description: 'Vi överför dina data säkert mellan enheter eller till backup.',
      },
      {
        id: 'dataradering',
        title: 'Dataraderning & Sekretess',
        duration: 'Efter behov',
        description: 'Säker radering av känslig data före försäljning eller kassering.',
      },
      {
        id: 'datastallning',
        title: 'Dataåterställning',
        duration: 'Efter behov',
        description: 'Återhämta borttagna eller förlorade filer från din enhet.',
      }
    ]
  },
  {
    id: 'konsultation',
    groupTitle: 'Konsultation & Setup',
    groupDescription: 'Från utrustningsinstallation till IT-strategi. Vi hjälper både privatpersoner och företag.',
    icon: <UserCircle size={40} weight="duotone" />,
    services: [
      {
        id: 'konsultation_privat',
        title: 'Privat Konsultation',
        duration: '30 min',
        description: 'Hjälp med ny enhet, mjukvara-setup, installation av utrustning och datoruppsättning.',
      },
      {
        id: 'hemma_installation',
        title: 'Installation på Hemmaplan',
        duration: 'Efter behov',
        description: 'Vi installerar och konfigurerar din utrustning hemma hos dig.',
      },
      {
        id: 'konsultation_foretag',
        title: 'IT-Konsultation för Företag',
        duration: 'Efter avtal',
        description: 'Tekniken som möjliggör er framgång. Skräddarsydda IT-lösningar, serviceavtal och enhetsflottor för att din teknik arbetar för dig, inte mot dig.',
      }
    ]
  }
];

const Boka = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedService(null);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setTimeout(() => {
      document.getElementById('booking-widget-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="boka-page">
      <section className="boka-hero">
        <div className="boka-hero__background">
          <img src="/bilder/hem-hero.png" alt="Teknikhuset Kalmar service disk" />
          <div className="boka-hero__overlay"></div>
        </div>
        <div className="boka-hero__content">
          <h1>Boka din servicetid</h1>
          <p>Välj tjänst, datum och tid. Vi finns här när du behöver oss.</p>
        </div>
      </section>

      <div className="boka-page__main-content">
        {/* STEG 1: Välj servicegrupp */}
        <section className="boka-categories">
          <div className="boka-container">
            <h2 className="boka-section-title">1. Välj tjänstekategori</h2>
            <div className="boka-categories__grid">
              {serviceCategories.map((category) => (
                <div 
                  key={category.id} 
                  className={`boka-category-card ${selectedCategory?.id === category.id ? 'is-selected' : ''}`}
                  onClick={() => handleCategorySelect(category)}
                  tabIndex="0"
                  role="button"
                  onKeyDown={(e) => e.key === 'Enter' && handleCategorySelect(category)}
                >
                  <div className="boka-category-card__icon">{category.icon}</div>
                  <h3 className="boka-category-card__title">{category.groupTitle}</h3>
                  <p className="boka-category-card__description">{category.groupDescription}</p>
                  <div className="boka-category-card__action">
                    <span>{selectedCategory?.id === category.id ? 'Vald ✓' : 'Välj'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STEG 2: Välj specifik tjänst */}
        {selectedCategory && (
          <section className="boka-services">
            <div className="boka-container">
              <h2 className="boka-section-title">2. Välj tjänst inom {selectedCategory.groupTitle}</h2>
              <div className="boka-services__grid">
                {selectedCategory.services.map((service) => (
                  <div 
                    key={service.id} 
                    className={`boka-service-card ${selectedService?.id === service.id ? 'is-selected' : ''}`}
                    onClick={() => handleServiceSelect(service)}
                    tabIndex="0"
                    role="button"
                    onKeyDown={(e) => e.key === 'Enter' && handleServiceSelect(service)}
                  >
                    <div className="boka-service-card__header">
                      <h4 className="boka-service-card__title">{service.title}</h4>
                      <span className="boka-service-card__duration">{service.duration}</span>
                    </div>
                    <p className="boka-service-card__description">{service.description}</p>
                    {selectedService?.id === service.id && (
                      <div className="boka-service-card__checkmark">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div id="booking-widget-anchor"></div>

        {/* STEG 3: Välj datum och tid */}
        {selectedService && (
          <section className="boka-widget-section is-visible">
            <div className="boka-container boka-container--narrow">
              <h2 className="boka-section-title">3. Välj datum och tid</h2>
              <BookingWidget 
                service={selectedService} 
                serviceGroup={selectedCategory}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Boka;