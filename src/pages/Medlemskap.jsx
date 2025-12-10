import React, { useState, useRef, useEffect } from 'react';
// VIKTIGT: Denna rad krävs för att stilen ska laddas!
import './Medlemskap.css'; 
import { Check, Star, Shield, Zap, Crown, Users } from 'lucide-react';

const plans = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Grundtrygghet utan kostnad.',
    baseMonthlyPrice: 0,
    features: [
      'Alltid Gratis Felsökning',
      '10% rabatt på första Reparation/Service/Köp',
      'Digitalt kvittoarkiv',
      'Personlig Support'
    ],
    highlight: false,
    icon: <Shield size={32} />
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Vårt mest populära val.',
    baseMonthlyPrice: 99,
    features: [
      'Allt i Essential ingår',
      'Prioriterad Service (Förtur i kön)',
      '10% rabatt på ALLA reparationer',
      '10% rabatt på ALLA tillbehör',
      'Kalmar Förmånsklubb™ (10% hos partners)',
      'Nytt skärmskydd varje år (Värde 399 kr)',
      'Årlig hälsokontroll av enhet',
      'Gratis dataradering'
    ],
    highlight: true,
    badge: 'Mest Uppskattad',
    icon: <Zap size={32} />
  },
  {
    id: 'elite',
    name: 'Elite',
    tagline: 'Total frihet och maximal service.',
    baseMonthlyPrice: 199,
    features: [
      'Allt i Pro & Essential ingår',
      'Gratis Lånetelefon vid service',
      'Garanterad svarstid (Samma dag)',
      '50% rabatt på batteribyte (1 gång/år)',
      'Årlig fysisk rengöring & sanering',
      'Gratis dataöverföring',
      'VIP-inbjudningar till events',
    ],
    highlight: false,
    icon: <Crown size={32} />
  }
];

// Validering vid inmatning (tillåter siffror, bindestreck, plus och mellanslag)
const validatePhoneInput = (value) => {
  return /^[\d\-\s+()]*$/.test(value);
};

// FIX: Tillåter inmatning av siffror och bindestreck medan man skriver
const validateSSNInput = (value) => {
  return /^[\d\-]*$/.test(value) || value === '';
};

const validateName = (value) => {
  return /^[a-zA-ZåäöÅÄÖ\s\-']*$/.test(value) || value === '';
};

// Validering för e-post vid inmatning (tillåter det mesta tills submit)
const validateEmailInput = (value) => {
  return !/\s/.test(value); // Bara förbjud mellanslag medan man skriver
};

const Medlemskap = () => {
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [isFamily, setIsFamily] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const defaultMember = { name: '', ssn: '', email: '', phone: '' };
  const [mainMember, setMainMember] = useState(defaultMember);
  const [familyMembers, setFamilyMembers] = useState([{ name: '', ssn: '' }]);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  
  const formRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('memberFormData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setMainMember({ ...defaultMember, ...data });
      } catch (e) {
        console.log('Could not load saved data');
      }
    }
  }, []);

  const updateMainMember = (field, value) => {
    if (field === 'phone') {
      if (!validatePhoneInput(value)) return;
    } else if (field === 'ssn') {
      // FIX: Använder den snällare valideringen här
      if (!validateSSNInput(value)) return;
    } else if (field === 'name') {
      if (!validateName(value)) return;
    } else if (field === 'email') {
      if (!validateEmailInput(value)) return;
    }

    const updated = { ...mainMember, [field]: value };
    setMainMember(updated);
    localStorage.setItem('memberFormData', JSON.stringify(updated));
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleFamilyChange = (index, field, value) => {
    if (field === 'ssn') {
      // FIX: Använder den snällare valideringen här också
      if (!validateSSNInput(value)) return;
    } else if (field === 'name') {
      if (!validateName(value)) return;
    }

    const newMembers = [...familyMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFamilyMembers(newMembers);
  };

  const getDisplayMonthlyPrice = (baseMonthly) => {
    if (baseMonthly === 0) return 0;
    let price = baseMonthly;
    if (isFamily) price *= 2;
    if (billingCycle === 'yearly') {
      price = (price * 10) / 12;
    }
    return Math.round(price);
  };

  const getOriginalMonthlyPrice = (baseMonthly) => {
    if (baseMonthly === 0) return 0;
    let price = baseMonthly;
    if (isFamily) price *= 2;
    return price;
  };

  const getYearlyTotal = (baseMonthly) => {
    if (baseMonthly === 0) return 0;
    let price = baseMonthly;
    if (isFamily) price *= 2;
    return price * 10;
  };

  const getYearlySavings = (baseMonthly) => {
    if (baseMonthly === 0) return 0;
    let price = baseMonthly;
    if (isFamily) price *= 2;
    return price * 2;
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleAddFamilyMember = () => {
    if (familyMembers.length < 4) setFamilyMembers([...familyMembers, { name: '', ssn: '' }]);
  };

  const handleRemoveFamilyMember = (index) => {
    const newMembers = [...familyMembers];
    newMembers.splice(index, 1);
    setFamilyMembers(newMembers);
  };

  // Hjälpfunktion för att kolla längden på personnummer (tar bort bindestreck först)
  const isValidSSNLength = (ssn) => {
    const cleanNumber = ssn.replace(/-/g, '');
    return cleanNumber.length === 10 || cleanNumber.length === 12;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!mainMember.name) newErrors.name = 'Namn är obligatoriskt';
    
    // FIX: Strikt kontroll här istället (måste vara 10 eller 12 siffror)
    if (!mainMember.ssn || !isValidSSNLength(mainMember.ssn)) {
      newErrors.ssn = 'Ange 10 eller 12 siffror';
    }

    if (!mainMember.email || !mainMember.email.includes('@')) newErrors.email = 'Ogiltig e-postadress';
    if (!mainMember.phone) newErrors.phone = 'Telefonnummer är obligatoriskt';

    if (isFamily && selectedPlan?.baseMonthlyPrice > 0) {
      familyMembers.forEach((member, idx) => {
        if (member.name && !validateName(member.name)) newErrors[`family_${idx}_name`] = 'Ogiltigt namn';
        
        // FIX: Strikt kontroll för familjemedlemmar också
        if (member.ssn && !isValidSSNLength(member.ssn)) {
          newErrors[`family_${idx}_ssn`] = 'Ange 10 eller 12 siffror';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setStatus('loading');

    const yearlyTotal = getYearlyTotal(selectedPlan.baseMonthlyPrice);
    const monthlyTotal = isFamily ? selectedPlan.baseMonthlyPrice * 2 : selectedPlan.baseMonthlyPrice;
    const finalPriceToBill = billingCycle === 'yearly' ? yearlyTotal : monthlyTotal;
    
    const effectiveIsFamily = isFamily && selectedPlan.baseMonthlyPrice > 0;

    const payload = {
      plan: selectedPlan.name,
      period: billingCycle,
      type: effectiveIsFamily ? 'family' : 'individual',
      price: finalPriceToBill,
      mainMember,
      familyMembers: effectiveIsFamily ? familyMembers.filter(m => m.name) : []
    };

    try {
      const response = await fetch('/.netlify/functions/registerMember', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Kunde inte registrera');
      setStatus('success');
      localStorage.removeItem('memberFormData');
      setMainMember(defaultMember);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="membership-page">
      
      <section className="premium-hero">
        <div className="container">
          <div className="hero-badge">Teknikhuset Members Club™</div>
          <h1>Ett liv utan teknikstress.</h1>
          <p>Tänk dig en vardag där tekniken bara fungerar. Förtur, rabatter och personlig expertis.</p>
        </div>
      </section>

      <section className="pricing-controls">
        <div className="container control-flex">
          <div style={{ flex: 1 }}></div>
          
          <button 
            className={`smart-toggle-right ${billingCycle === 'yearly' ? 'yearly-active' : ''}`}
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          >
            <div className="toggle-switch-container">
              <div className={`toggle-switch ${billingCycle === 'yearly' ? 'on' : 'off'}`}>
                <div className="toggle-slider"></div>
              </div>
            </div>
            <span>
              {billingCycle === 'yearly' ? 'Årsvis' : 'Byt till Årsvis'}
              <span className={`highlight-tag ${billingCycle === 'yearly' ? 'active' : ''}`}>Spara 17%</span>
            </span>
          </button>
        </div>
      </section>

      <section className="cards-section">
        <div className="container">
          <div className="cards-grid">
            {plans.map((plan) => {
              const displayMonthly = getDisplayMonthlyPrice(plan.baseMonthlyPrice);
              const originalMonthly = getOriginalMonthlyPrice(plan.baseMonthlyPrice);
              const yearlyTotal = getYearlyTotal(plan.baseMonthlyPrice);
              const savings = getYearlySavings(plan.baseMonthlyPrice);
              const isFree = plan.baseMonthlyPrice === 0;

              const priceColor = billingCycle === 'yearly' ? '#198754' : '#0a0e27';

              return (
                <div key={plan.id} className={`lunar-card ${plan.highlight ? 'highlighted' : ''} ${selectedPlan?.id === plan.id ? 'selected' : ''}`}>
                  {plan.highlight && <div className="top-badge">{plan.badge}</div>}
                  
                  <div className="card-top">
                    <div className="plan-icon-wrapper">
                      {React.cloneElement(plan.icon, { 
                        color: plan.highlight ? '#d4af37' : '#0a0e27',
                        fill: plan.highlight ? 'rgba(212, 175, 55, 0.2)' : 'rgba(10, 14, 39, 0.1)'
                      })}
                    </div>

                    <h3>{plan.name}</h3>
                    <p className="card-tagline">{plan.tagline}</p>
                    
                    <div className="price-block">
                      {isFree ? (
                        <>
                          <span className="price-number" style={{ color: '#0a0e27' }}>0 kr</span>
                          <span className="price-period">/mån</span>
                        </>
                      ) : (
                        <>
                          <span 
                            className="price-number" 
                            style={{ color: priceColor }}
                          >
                            {displayMonthly} kr
                          </span>
                          <span className="price-period">/mån</span>
                        </>
                      )}
                    </div>

                    <div className="price-subtext-area">
                      {isFree ? (
                        <p className="free-text">Alltid 0 kr</p>
                      ) : (
                        <>
                          {billingCycle === 'yearly' ? (
                            <p className="price-subtext-gray">
                              Betala årsvis ({yearlyTotal} kr) - spara {savings} kr/år.
                            </p>
                          ) : (
                            <p className="price-subtext-upsell">
                              Spara 17% genom att välja årsvis
                            </p>
                          )}

                          {isFamily && (
                            <div className="family-indicator" style={{ marginTop: '5px' }}>
                              <Users size={12} fill="currentColor" />
                              <span>Inkl. 5 personer</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="card-divider"></div>

                  <div className="card-body">
                    <button 
                      className={`select-btn ${plan.highlight ? 'primary-btn' : 'outline-btn'}`}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {selectedPlan?.id === plan.id ? 'Vald' : 'Välj ' + plan.name}
                    </button>

                    <ul className="feature-list">
                      {plan.features.map((feature, i) => (
                        <li key={i}>
                          <div className="icon-box"><Check size={16} className="f-icon" strokeWidth={3} /></div>
                          <span className="feature-text">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="trust-footer">
            <p>Ingen bindningstid. Medlemskapet är aktivt så länge du är medlem och följer våra villkor.</p>
          </div>
        </div>
      </section>

      {/* FAMILJEPAKET UNDER KORTEN */}
      <section className="family-selection-section">
        <div className="container">
          <div className={`family-selection-box ${isFamily ? 'active' : ''} ${selectedPlan?.baseMonthlyPrice === 0 ? 'disabled-option' : ''}`}>
            <div className="selection-left">
              <button 
                className={`family-checkbox ${isFamily ? 'checked' : ''}`}
                onClick={() => {
                  if (selectedPlan?.baseMonthlyPrice === 0) return;
                  setIsFamily(!isFamily);
                }}
                style={{ cursor: selectedPlan?.baseMonthlyPrice === 0 ? 'not-allowed' : 'pointer', opacity: selectedPlan?.baseMonthlyPrice === 0 ? 0.5 : 1 }}
              >
                {isFamily && <Check size={18} strokeWidth={3} />}
              </button>
              <div style={{ opacity: selectedPlan?.baseMonthlyPrice === 0 ? 0.5 : 1 }}>
                <h3>Familjepaket</h3>
                <p>Skydda upp till 5 personer med ett medlemskap <span className="price-note">till pris av 2</span></p>
                {selectedPlan?.baseMonthlyPrice === 0 && <p style={{fontSize: '0.75rem', color: '#999', marginTop: '4px'}}>Ej tillgängligt för Essential</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHECKOUT FORM */}
      {selectedPlan && (
        <section className="checkout-section" ref={formRef}>
          <div className="container small-container">
            <div className="checkout-card">
              <div className="checkout-header">
                <h2>Bli medlem i {selectedPlan.name}</h2>
                <p>Registrera dig nu. Betalning sker i butiken.</p>
              </div>

              {status === 'success' ? (
                <div className="success-view">
                  <div className="success-circle"><Star size={40} fill="currentColor" /></div>
                  <h3>Tack för din registrering!</h3>
                  <p>Du kommer att motta en bekräftelse via e-post inom kort.</p>
                  <button 
                    className="cta-button secondary" 
                    onClick={() => { setSelectedPlan(null); setStatus(null); }}
                  >
                    Stäng
                  </button>
                </div>
              ) : (
                <div className="checkout-form">
                  <div className="form-section">
                    <h3 className="form-section-title">Din information</h3>
                    <div className="form-grid">
                      <div className="input-wrap">
                        <label htmlFor="name">Namn</label>
                        <input 
                          id="name"
                          placeholder="T.ex. Anders Andersson"
                          value={mainMember.name} 
                          onChange={e => updateMainMember('name', e.target.value)}
                          autoComplete="name"
                          className={errors.name ? 'input-error' : ''}
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                      </div>
                      <div className="input-wrap">
                        <label htmlFor="ssn">Personnummer</label>
                        <input 
                          id="ssn"
                          placeholder="YYMMDD-XXXX"
                          value={mainMember.ssn} 
                          onChange={e => updateMainMember('ssn', e.target.value)}
                          autoComplete="off"
                          className={errors.ssn ? 'input-error' : ''}
                        />
                        {errors.ssn && <span className="error-text">{errors.ssn}</span>}
                      </div>
                      <div className="input-wrap">
                        <label htmlFor="email">E-post</label>
                        <input 
                          id="email"
                          placeholder="din@email.com"
                          type="email" 
                          value={mainMember.email} 
                          onChange={e => updateMainMember('email', e.target.value)}
                          autoComplete="email"
                          className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                      </div>
                      <div className="input-wrap">
                        <label htmlFor="phone">Telefon</label>
                        <input 
                          id="phone"
                          placeholder="076-172 30 14"
                          type="tel" 
                          value={mainMember.phone} 
                          onChange={e => updateMainMember('phone', e.target.value)}
                          autoComplete="tel"
                          className={errors.phone ? 'input-error' : ''}
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                      </div>
                    </div>
                  </div>

                  {isFamily && selectedPlan.baseMonthlyPrice > 0 && (
                    <div className="family-section">
                      <div className="family-section-header">
                        <h3 className="form-section-title">Familjemedlemmar</h3>
                        <span className="family-count">{familyMembers.length} person(er)</span>
                      </div>
                      
                      <div className="family-inputs">
                        {familyMembers.map((member, idx) => (
                          <div key={idx} className="family-input-row">
                            <input 
                              placeholder="T.ex. Maria Andersson" 
                              value={member.name} 
                              onChange={(e) => handleFamilyChange(idx, 'name', e.target.value)}
                              autoComplete="off"
                              className={errors[`family_${idx}_name`] ? 'input-error' : ''}
                            />
                            <input 
                              placeholder="YYMMDD-XXXX" 
                              value={member.ssn} 
                              onChange={(e) => handleFamilyChange(idx, 'ssn', e.target.value)}
                              autoComplete="off"
                              className={errors[`family_${idx}_ssn`] ? 'input-error' : ''}
                            />
                            {familyMembers.length > 1 && (
                              <button 
                                type="button" 
                                className="del-btn" 
                                onClick={() => handleRemoveFamilyMember(idx)}
                                aria-label="Ta bort medlem"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {familyMembers.length < 4 && (
                        <button 
                          type="button" 
                          className="add-family-btn"
                          onClick={handleAddFamilyMember}
                        >
                          <span className="plus-icon">+</span> Lägg till medlem
                        </button>
                      )}
                    </div>
                  )}

                  <div className="checkout-footer">
                    <button 
                      onClick={handleSubmit}
                      className="cta-button primary full-width" 
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? 'Registrerar...' : 'Slutför Registrering'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Medlemskap;