/**
 * MACODEL SERVICES sarlu - Site Web Interactif et Fluide
 * Logique JavaScript de l'application
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. En-tête dynamique au défilement (Navbar Scroll Effect)
  const navbar = document.querySelector('.navbar-custom');
  
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Appel initial au cas où la page charge après un défilement
  
  // 2. Déclenchement des animations au défilement (Scroll Animations)
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animationObserver.unobserve(entry.target); // On arrête d'observer une fois animé
      }
    });
  }, {
    threshold: 0.15, // L'élément doit être visible à 15% pour s'animer
    rootMargin: '0px 0px -50px 0px'
  });
  
  animateElements.forEach(element => {
    animationObserver.observe(element);
  });
  
  // 3. Animation des compteurs numériques (Stats counter animation)
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // Durée de l'animation en ms
    const stepTime = Math.max(Math.floor(duration / target), 15);
    let current = 0;
    
    // Déterminer l'incrément
    const increment = Math.ceil(target / (duration / stepTime));
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString('fr-FR') + (element.getAttribute('data-suffix') || '');
        clearInterval(timer);
      } else {
        element.textContent = current.toLocaleString('fr-FR') + (element.getAttribute('data-suffix') || '');
      }
    }, stepTime);
  };
  
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(num => animateCounter(num));
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    statsObserver.observe(statsSection);
  }
  
  // 4. Calculateur d'Impact Écologique
  const wasteTypeSelect = document.getElementById('waste-type');
  const wasteWeightInput = document.getElementById('waste-weight');
  const wasteWeightValue = document.getElementById('waste-weight-val');
  
  const resultCo2 = document.getElementById('result-co2');
  const resultResource = document.getElementById('result-resource');
  const resultResourceLabel = document.getElementById('result-resource-label');
  const resultEnergy = document.getElementById('result-energy');
  const resultEnergyLabel = document.getElementById('result-energy-label');
  
  // Facteurs d'impact par tonne de déchets
  const impactFactors = {
    cardboard: {
      co2: 900,               // kg CO2 évités
      resourceVal: 17,        // Arbres sauvés
      resourceLabel: { fr: "Arbres Sauvés", en: "Trees Saved" },
      energyVal: 26000,       // Litres d'eau sauvés
      energyLabel: { fr: "Litres d'Eau Économisés", en: "Liters of Water Saved" }
    },
    plastic: {
      co2: 1600,
      resourceVal: 650,       // kg de pétrole brut économisé
      resourceLabel: { fr: "kg de Pétrole Économisé", en: "kg of Crude Oil Saved" },
      energyVal: 5700,        // kWh d'électricité économisée
      energyLabel: { fr: "kWh d'Énergie Économisés", en: "kWh of Energy Saved" }
    },
    glass: {
      co2: 350,
      resourceVal: 1200,      // kg de sable siliceux préservé
      resourceLabel: { fr: "kg de Sable Préservé", en: "kg of Siliceous Sand Saved" },
      energyVal: 500,         // kWh d'électricité
      energyLabel: { fr: "kWh d'Énergie Économisés", en: "kWh of Energy Saved" }
    },
    organic: {
      co2: 300,
      resourceVal: 400,       // kg de compost fertile produit
      resourceLabel: { fr: "kg de Compost Produit", en: "kg of Compost Produced" },
      energyVal: 80,          // kg d'engrais chimiques évités
      energyLabel: { fr: "kg d'Engrais Évités", en: "kg of Chemical Fertilizers Avoided" }
    },
    metal: {
      co2: 9000,              // Énorme économie pour l'alu
      resourceVal: 1500,      // kg de minerai de fer/bauxite préservé
      resourceLabel: { fr: "kg de Minerai Préservé", en: "kg of Ore Preserved" },
      energyVal: 14000,       // kWh d'électricité économisée
      energyLabel: { fr: "kWh d'Énergie Économisés", en: "kWh of Energy Saved" }
    }
  };
  
  const calculateImpact = () => {
    const type = wasteTypeSelect.value;
    const weight = parseFloat(wasteWeightInput.value);
    
    // Mettre à jour l'affichage de la valeur du slider
    wasteWeightValue.textContent = weight;
    
    const factors = impactFactors[type];
    if (!factors) return;
    
    // Calculs (poids en tonnes * facteur par tonne)
    const co2Saved = Math.round(weight * factors.co2);
    const resourceSaved = Math.round(weight * factors.resourceVal);
    const energySaved = Math.round(weight * factors.energyVal);
    
    const currentLang = localStorage.getItem('lang') || 'fr';
    
    // Mettre à jour le DOM avec animation fluide
    animateValue(resultCo2, parseFloat(resultCo2.textContent.replace(/\s/g, '')) || 0, co2Saved, " kg");
    animateValue(resultResource, parseFloat(resultResource.textContent.replace(/\s/g, '')) || 0, resourceSaved, "");
    animateValue(resultEnergy, parseFloat(resultEnergy.textContent.replace(/\s/g, '')) || 0, energySaved, "");
    
    resultResourceLabel.textContent = factors.resourceLabel[currentLang];
    resultEnergyLabel.textContent = factors.energyLabel[currentLang];
  };
  
  // Fonction utilitaire pour animer les changements de valeurs dans le calculateur
  const animateValue = (element, start, end, suffix) => {
    if (start === end) {
      element.textContent = end.toLocaleString('fr-FR') + suffix;
      return;
    }
    const duration = 400; // Courte animation fluide de 400ms
    const startTime = performance.now();
    
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Fonction d'assouplissement (Ease Out Quad)
      const ease = progress * (2 - progress);
      const current = Math.round(start + (end - start) * ease);
      
      element.textContent = current.toLocaleString('fr-FR') + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  };
  
  if (wasteTypeSelect && wasteWeightInput) {
    wasteTypeSelect.addEventListener('change', calculateImpact);
    wasteWeightInput.addEventListener('input', calculateImpact);
    // Calcul initial
    calculateImpact();
  }
  
  // 5. Validation et Soumission Dynamique du Formulaire de Contact
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulation d'une requête AJAX avec retour visuel fluide
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      const currentLang = localStorage.getItem('lang') || 'fr';
      
      const textSending = translations[currentLang]["form-sending"] || "Envoi en cours...";
      const textSent = translations[currentLang]["form-sent"] || "Envoyé avec succès !";
      const textSuccessTitle = translations[currentLang]["form-success-title"] || "Demande reçue !";
      const textSuccessDesc = translations[currentLang]["form-success-desc"] || "Notre équipe commerciale vous recontactera sous 24h ouvrées.";
      
      // Animation du bouton en état de chargement
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        ${textSending}
      `;
      
      setTimeout(() => {
        // Rétablir le bouton
        submitBtn.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${textSent}`;
        submitBtn.classList.remove('btn-primary-custom');
        submitBtn.classList.add('btn-success');
        
        // Afficher l'alerte de succès personnalisée
        const alertBox = document.createElement('div');
        alertBox.className = 'alert alert-success alert-dismissible fade show mt-4 border-0 shadow-sm animate-on-scroll animated';
        alertBox.style.borderRadius = '12px';
        alertBox.innerHTML = `
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-check-circle-fill fs-5"></i>
            <div>
              <strong>${textSuccessTitle}</strong> ${textSuccessDesc}
            </div>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        contactForm.appendChild(alertBox);
        
        // Réinitialiser le formulaire
        contactForm.reset();
        
        // Remettre le bouton à son état d'origine après 4 secondes
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          submitBtn.classList.remove('btn-success');
          submitBtn.classList.add('btn-primary-custom');
        }, 4000);
        
      }, 1500);
    });
  }

  // 6. Gestion du Mode Sombre (Dark Mode)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  const enableDarkMode = () => {
    document.body.setAttribute('data-theme', 'dark');
    themeIcon.classList.remove('bi-moon-fill');
    themeIcon.classList.add('bi-sun-fill');
    localStorage.setItem('theme', 'dark');
  };
  
  const disableDarkMode = () => {
    document.body.removeAttribute('data-theme');
    themeIcon.classList.remove('bi-sun-fill');
    themeIcon.classList.add('bi-moon-fill');
    localStorage.setItem('theme', 'light');
  };
  
  // Vérification initiale du thème stocké
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = localStorage.getItem('theme');
      if (currentTheme === 'dark') {
        disableDarkMode();
      } else {
        enableDarkMode();
      }
    });
  }
  
  // 7. Initialisation de la Carte Leaflet (Green Map) à Kara
  const mapElement = document.getElementById('map');
  if (mapElement) {
    // Coordonnées de Kara, Togo : [9.5492, 1.1915]
    const map = L.map('map', {
      scrollWheelZoom: false // Désactiver le zoom au scroll pour une meilleure navigation sur la page
    }).setView([9.5492, 1.1915], 13.5);
    
    // Ajout de la couche OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Définir des icônes de marqueurs vertes émeraude personnalisées
    const greenIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #059669; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
    
    // Marqueurs des points d'intérêts / collecte
    const locations = [
      {
        coords: [9.5492, 1.1915],
        title: "Siège de MACODEL SERVICES",
        desc: "Tchitchinouda, près de l'Hôtel Memphis. Bureaux et centre de tri principal."
      },
      {
        coords: [9.5484, 1.1852],
        title: "Point de Tri - Grand Marché",
        desc: "Bacs de collecte de plastique et de cartons à destination des commerçants."
      },
      {
        coords: [9.5605, 1.1990],
        title: "Dépôt Écologique - Lama",
        desc: "Conteneurs de tri pour plastiques en libre accès pour le quartier Lama."
      },
      {
        coords: [9.5395, 1.1812],
        title: "Point de Collecte - Dongoyo",
        desc: "Centre d'apport volontaire géré en partenariat local."
      }
    ];
    
    locations.forEach(loc => {
      L.marker(loc.coords, { icon: greenIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Inter', sans-serif; font-size: 0.9rem;">
            <strong style="color: #059669; font-family: 'Outfit', sans-serif; font-size: 0.95rem;">${loc.title}</strong>
            <p style="margin: 0.3rem 0 0 0; color: #334155; line-height: 1.4;">${loc.desc}</p>
          </div>
        `);
    });
  }

  // 8. Dictionnaire de Traduction (FR / EN)
  const translations = {
    fr: {
      "nav-home": "Accueil",
      "nav-services": "Nos Services",
      "nav-impact": "Calculateur d'Impact",
      "nav-about": "À Propos",
      "nav-testimonials": "Témoignages",
      "nav-contact": "Contact",
      "hero-tag": "L'économie circulaire en action",
      "hero-title": "Transformez vos déchets en <span class=\"text-primary-custom\">ressources</span> d'avenir.",
      "hero-subtitle": "MACODEL SERVICES sarlu accompagne les entreprises dans leur transition écologique avec des solutions fluides de collecte, de tri intelligent et de valorisation matière. Simplifiez votre gestion des déchets tout en maximisant votre impact positif.",
      "hero-cta-calc": "Estimer mon impact",
      "hero-cta-solutions": "Découvrir nos solutions",
      "services-tag": "Expertises RSE & Logistique",
      "services-title": "Des solutions sur mesure pour chaque flux de déchets",
      "services-desc": "Nous intégrons la simplicité opérationnelle au cœur de votre gestion environnementale, en assurant une traçabilité totale et le respect des normes les plus strictes.",
      "service-1-title": "Collecte Intelligente & Tri",
      "service-1-desc": "Planification optimisée des tournées, mise à disposition de contenants connectés adaptés à vos volumes, et tri sélectif certifié directement à la source.",
      "service-2-title": "Valorisation Matière & Remploi",
      "service-2-desc": "Transformation maximale de vos déchets en matières premières secondaires de haute qualité. Réinsertion dans le cycle industriel local (économie circulaire).",
      "service-3-title": "Conseil RSE & Rapports Réglementaires",
      "service-3-desc": "Accompagnement dans votre conformité réglementaire (décret 5 flux/7 flux), audits de tri, reporting environnemental mensuel et clés de performance clés (KPI).",
      "service-more": "En savoir plus",
      "val-tag": "Économie Circulaire Locale",
      "val-title": "Le parcours de vos déchets à Kara",
      "val-desc": "Découvrez comment vos déchets triés sont transformés localement en opportunités économiques et environnementales au sein de notre communauté.",
      "val-1-title": "Collecte de proximité",
      "val-1-desc": "Nos équipes interviennent dans plusieurs quartiers de Kara (Tchitchinouda, Lama, Dongoyo, Grand Marché...) pour collecter vos cartons, plastiques et métaux directement sur votre site.",
      "val-2-title": "Tri & Compactage",
      "val-2-desc": "Les déchets sont acheminés vers notre centre de tri à Tchitchinouda, où ils sont soigneusement triés par type de plastique (PET, PEHD) ou papier, puis compactés en balles prêtes pour la valorisation.",
      "val-3-title": "Transformation Artisanale",
      "val-3-desc": "En partenariat avec des artisans et des initiatives togolaises, le plastique broyé est chauffé et moulé pour fabriquer des pavés écologiques extrêmement résistants, idéaux pour les aménagements de chaussées.",
      "val-4-title": "Remploi local & Impact",
      "val-4-desc": "Ces pavés et matières premières secondaires sont réinjectés dans des projets d'aménagement urbain ou le bâtiment à Kara, complétant ainsi la boucle vertueuse de l'économie circulaire.",
      "calc-tag": "Calculateur d'Impact",
      "calc-title": "Mesurez la valeur de votre geste écologique",
      "calc-desc": "Sélectionnez la nature de vos flux de déchets et ajustez la quantité estimée pour visualiser instantanément les bénéfices environnementaux de leur valorisation par MACODEL SERVICES sarlu.",
      "calc-type-label": "Type de déchet",
      "calc-weight-label": "Quantité mensuelle",
      "calc-results-title": "Bénéfices Environnementaux Estimés",
      "calc-co2-label": "Émissions de CO₂ Évitées",
      "opt-cardboard": "Papier / Carton",
      "opt-plastic": "Plastiques & Polymères",
      "opt-glass": "Verre / Silicates",
      "opt-organic": "Déchets Organiques (Compost)",
      "opt-metal": "Métaux (Aluminium, Acier)",
      "stat-1-label": "Valorisation",
      "stat-1-desc": "Taux moyen de valorisation matière",
      "stat-2-label": "Tonnes triées",
      "stat-2-desc": "Valorisation annuelle globale",
      "stat-3-label": "Entreprises",
      "stat-3-desc": "Partenaires engagés avec nous",
      "stat-4-label": "Réactivité",
      "stat-4-desc": "Assistance et logistique continues",
      "about-tag": "Qui sommes-nous ?",
      "about-title": "Un partenaire engagé pour votre stratégie environnementale",
      "about-desc": "Fondée avec la conviction que chaque déchet cache une valeur inestimable, MACODEL SERVICES sarlu aide les industries, commerces et administrations à structurer des processus de valorisation viables et performants. Basée à Tchitchinouda, à proximité de l'Hôtel Memphis, l'entreprise intervient principalement dans plusieurs quartiers de la ville de Kara et de ses environs.",
      "about-f1-title": "Audits techniques sur site",
      "about-f1-desc": "Nous analysons vos flux sur place pour optimiser le tri dès l'origine.",
      "about-f2-title": "Plateforme client dématérialisée",
      "about-f2-desc": "Accédez en 1 clic à vos factures, bordereaux de suivi des déchets (BSD) et indicateurs RSE.",
      "about-f3-title": "Tarification transparente & optimisée",
      "about-f3-desc": "Un modèle basé sur la revente de vos matières premières secondaires triées pour faire baisser votre facture de collecte.",
      "about-card-1": "Zéro Déchet",
      "about-card-1-desc": "Objectif enfouissement minimal",
      "about-card-2": "Traçabilité",
      "about-card-2-desc": "Certificats de recyclage officiels",
      "about-card-3": "Proximité",
      "about-card-3-desc": "Réseau de valorisation local",
      "about-card-4": "Réactivité",
      "about-card-4-desc": "Interventions rapides sous 24h",
      "gallery-tag": "Galerie Photo",
      "gallery-title": "Nos réalisations en images",
      "gallery-desc": "Découvrez nos infrastructures de tri, nos conteneurs de tri sélectif et l'équipe de MACODEL SERVICES engagée à Kara.",
      "gallery-c1": "Infrastructures",
      "gallery-c1-title": "Notre Centre de Tri",
      "gallery-c2": "Solutions bureau",
      "gallery-c2-title": "Bacs Éco-conçus",
      "gallery-c3": "Valorisation",
      "gallery-c3-title": "Pavés Écologiques",
      "gallery-c4": "Notre Force",
      "gallery-c4-title": "Équipe de Terrain",
      "test-tag": "Avis Partenaires",
      "test-title": "Ce que nos clients disent de nous",
      "test-1": "\"MACODEL SERVICES sarlu a totalement transformé notre logistique de tri. Nos équipes en usine disposent de bacs adaptés et le système de collecte à la demande fonctionne de manière fluide. Les rapports mensuels sont parfaits pour notre bilan RSE.\"",
      "test-2": "\"Le respect des normes de traçabilité est primordial pour nous. Grâce à la plateforme client de MACODEL SERVICES sarlu, tous nos bordereaux de suivi sont centralisés. L'intégration de leur calculateur sur notre communication a ravi nos investisseurs.\"",
      "test-3": "\"Une écoute client exceptionnelle et une tarification très juste. Nos coûts de traitement des déchets ont baissé de 18% en valorisant activement nos surplus de cartons d'emballage. Je recommande vivement !\"",
      "map-tag": "Points de Collecte",
      "map-title": "Notre Réseau Vert à Kara",
      "map-desc": "Retrouvez notre siège et nos principaux bacs de tri et dépôts écologiques déployés pour faciliter le tri sélectif.",
      "contact-tag": "Contactez-nous",
      "contact-title": "Prêt à valoriser vos déchets ?",
      "contact-desc": "Demandez un diagnostic gratuit de vos flux de déchets ou un devis personnalisé pour vos collectes régulières. Nos consultants RSE vous répondent sous 24 heures.",
      "contact-info-1": "Siège Social",
      "contact-info-2": "Téléphone",
      "contact-info-2-desc": "92 10 38 63 (Lundi au Vendredi, 8h - 18h)",
      "form-title": "Demande de Diagnostic & Devis",
      "form-name": "Nom Complet",
      "form-name-ph": "Jean Dupont",
      "form-company": "Entreprise",
      "form-company-ph": "Ex: SAS Logistique",
      "form-email": "Adresse E-mail",
      "form-email-ph": "nom@entreprise.com",
      "form-phone": "Téléphone",
      "form-phone-ph": "06 12 34 56 78",
      "form-message": "Votre Besoin (Types de déchets, volume estimé...)",
      "form-message-ph": "Décrivez succinctement votre besoin ou vos flux...",
      "form-submit": "Envoyer la demande",
      "form-sending": "Envoi en cours...",
      "form-sent": "Envoyé avec succès !",
      "form-success-title": "Demande reçue !",
      "form-success-desc": "Notre équipe commerciale vous recontactera sous 24h ouvrées.",
      "footer-desc": "MACODEL SERVICES sarlu simplifie la transition vers l'économie circulaire pour les organisations responsables. Ensemble, donnons une seconde vie à vos ressources.",
      "footer-t1": "Solutions",
      "footer-t2": "Ressources",
      "footer-t3": "Contact rapide",
      "footer-l1": "Collecte de Déchets",
      "footer-l2": "Tri & Tri intelligent",
      "footer-l3": "Valorisation Matière",
      "footer-l4": "Audit RSE",
      "footer-copy": "&copy; 2026 MACODEL SERVICES sarlu. Tous droits réservés."
    },
    en: {
      "nav-home": "Home",
      "nav-services": "Our Services",
      "nav-impact": "Impact Calculator",
      "nav-about": "About Us",
      "nav-testimonials": "Testimonials",
      "nav-contact": "Contact",
      "hero-tag": "Circular economy in action",
      "hero-title": "Transform your waste into <span class=\"text-primary-custom\">resources</span> for the future.",
      "hero-subtitle": "MACODEL SERVICES sarlu supports companies in their ecological transition with fluid collection, smart sorting and materials recovery solutions. Simplify your waste management while maximizing your positive impact.",
      "hero-cta-calc": "Estimate my impact",
      "hero-cta-solutions": "Discover our solutions",
      "services-tag": "CSR & Logistics Expertise",
      "services-title": "Tailored solutions for every waste stream",
      "services-desc": "We integrate operational simplicity at the heart of your environmental management, ensuring total traceability and compliance with the strictest standards.",
      "service-1-title": "Smart Collection & Sorting",
      "service-1-desc": "Optimized route planning, availability of connected containers adapted to your volumes, and certified sorting directly at the source.",
      "service-2-title": "Materials Recovery & Reuse",
      "service-2-desc": "Maximum transformation of your waste into high quality secondary raw materials. Reinsertion into the local industrial cycle (circular economy).",
      "service-3-title": "CSR Consulting & Regulatory Reports",
      "service-3-desc": "Assistance in your regulatory compliance, sorting audits, monthly environmental reporting and key performance indicators (KPI).",
      "service-more": "Read more",
      "val-tag": "Local Circular Economy",
      "val-title": "The journey of your waste in Kara",
      "val-desc": "Discover how your sorted waste is transformed locally into economic and environmental opportunities within our community.",
      "val-1-title": "Proximity Collection",
      "val-1-desc": "Our teams operate in several neighborhoods of Kara (Tchitchinouda, Lama, Dongoyo, Grand Market...) to collect your cardboards, plastics and metals directly on your site.",
      "val-2-title": "Sorting & Compacting",
      "val-2-desc": "Waste is transported to our sorting center in Tchitchinouda, where it is carefully sorted by plastic type (PET, HDPE) or paper, then compacted into bales ready for recycling.",
      "val-3-title": "Artisanal Transformation",
      "val-3-desc": "In partnership with Togolese artisans and initiatives, crushed plastic is heated and molded to manufacture extremely durable ecological paving stones, ideal for roads paving.",
      "val-4-title": "Local Reuse & Impact",
      "val-4-desc": "These paving stones and secondary raw materials are reinjected into urban development or building projects in Kara, completing the virtuous loop of the circular economy.",
      "calc-tag": "Impact Calculator",
      "calc-title": "Measure the value of your ecological action",
      "calc-desc": "Select the nature of your waste streams and adjust the estimated quantity to instantly view the environmental benefits of their recovery by MACODEL SERVICES sarlu.",
      "calc-type-label": "Waste type",
      "calc-weight-label": "Monthly quantity",
      "calc-results-title": "Estimated Environmental Benefits",
      "calc-co2-label": "Avoided CO₂ Emissions",
      "opt-cardboard": "Paper / Cardboard",
      "opt-plastic": "Plastics & Polymers",
      "opt-glass": "Glass / Silicates",
      "opt-organic": "Organic Waste (Compost)",
      "opt-metal": "Metals (Aluminium, Steel)",
      "stat-1-label": "Recovery",
      "stat-1-desc": "Average materials recovery rate",
      "stat-2-label": "Tons sorted",
      "stat-2-desc": "Global annual materials recovery",
      "stat-3-label": "Companies",
      "stat-3-desc": "Partner companies committed with us",
      "stat-4-label": "Responsiveness",
      "stat-4-desc": "Continuous assistance and logistics",
      "about-tag": "Who are we?",
      "about-title": "A committed partner for your environmental strategy",
      "about-desc": "Founded on the belief that every waste hides an invaluable value, MACODEL SERVICES sarlu helps industries, shops and administrations structure viable and efficient recovery processes. Based in Tchitchinouda, near the Memphis Hotel, the company operates mainly in several neighborhoods of the city of Kara and its surroundings.",
      "about-f1-title": "On-site technical audits",
      "about-f1-desc": "We analyze your flows on-site to optimize sorting at the source.",
      "about-f2-title": "Dematerialized customer platform",
      "about-f2-desc": "Access your invoices, waste tracking forms (BSD) and CSR indicators in 1 click.",
      "about-f3-title": "Transparent & optimized pricing",
      "about-f3-desc": "A model based on reselling your sorted secondary raw materials to lower your collection bill.",
      "about-card-1": "Zero Waste",
      "about-card-1-desc": "Minimal landfill objective",
      "about-card-2": "Traceability",
      "about-card-2-desc": "Official recycling certificates",
      "about-card-3": "Proximity",
      "about-card-3-desc": "Local recovery network",
      "about-card-4": "Responsiveness",
      "about-card-4-desc": "Fast interventions under 24h",
      "gallery-tag": "Photo Gallery",
      "gallery-title": "Our achievements in pictures",
      "gallery-desc": "Discover our sorting facilities, our selective sorting containers and the MACODEL SERVICES team committed in Kara.",
      "gallery-c1": "Facilities",
      "gallery-c1-title": "Our Sorting Center",
      "gallery-c2": "Office solutions",
      "gallery-c2-title": "Eco-designed Bins",
      "gallery-c3": "Recovery",
      "gallery-c3-title": "Ecological Pavers",
      "gallery-c4": "Our Strength",
      "gallery-c4-title": "Field Team",
      "test-tag": "Partners Feedback",
      "test-title": "What our clients say about us",
      "test-1": "\"MACODEL SERVICES sarlu has completely transformed our sorting logistics. Our factory teams have adapted bins and the on-demand collection system runs smoothly. Monthly reports are perfect for our CSR balance sheet.\"",
      "test-2": "\"Compliance with traceability standards is essential for us. Thanks to the customer platform of MACODEL SERVICES sarlu, all our tracking documents are centralized. The integration of their calculator in our communications delighted our investors.\"",
      "test-3": "\"Outstanding customer service and very fair pricing. Our waste treatment costs dropped by 18% by actively recovering our cardboard packaging surpluses. Highly recommended!\"",
      "map-tag": "Collection Points",
      "map-title": "Our Green Network in Kara",
      "map-desc": "Find our headquarters and our main sorting bins and eco-deposits deployed to facilitate selective sorting.",
      "contact-tag": "Contact Us",
      "contact-title": "Ready to recover your waste?",
      "contact-desc": "Request a free diagnosis of your waste streams or a personalized quote for your regular collections. Our CSR consultants answer you within 24 hours.",
      "contact-info-1": "Headquarters",
      "contact-info-2": "Phone",
      "contact-info-2-desc": "92 10 38 63 (Monday to Friday, 8am - 6pm)",
      "form-title": "Request for Diagnosis & Quote",
      "form-name": "Full Name",
      "form-name-ph": "John Doe",
      "form-company": "Company",
      "form-company-ph": "e.g. Logistics Ltd",
      "form-email": "E-mail Address",
      "form-email-ph": "name@company.com",
      "form-phone": "Phone Number",
      "form-phone-ph": "+228 92 10 38 63",
      "form-message": "Your Need (Types of waste, estimated volume...)",
      "form-message-ph": "Briefly describe your needs or waste streams...",
      "form-submit": "Send request",
      "form-sending": "Sending...",
      "form-sent": "Sent successfully!",
      "form-success-title": "Request received!",
      "form-success-desc": "Our sales team will get back to you within 24 business hours.",
      "footer-desc": "MACODEL SERVICES sarlu simplifies the transition to a circular economy for responsible organizations. Together, let's give a second life to your resources.",
      "footer-t1": "Solutions",
      "footer-t2": "Resources",
      "footer-t3": "Quick Contact",
      "footer-l1": "Waste Collection",
      "footer-l2": "Sorting & Smart sorting",
      "footer-l3": "Materials Recovery",
      "footer-l4": "CSR Audit",
      "footer-copy": "&copy; 2026 MACODEL SERVICES sarlu. All rights reserved."
    }
  };

  // 9. Gestion de la Traduction Multilingue (FR / EN)
  const langFrBtn = document.getElementById('lang-fr');
  const langEnBtn = document.getElementById('lang-en');
  
  const updateLanguage = (lang) => {
    // 1. Mettre à jour l'attribut lang de la page
    document.documentElement.setAttribute('lang', lang);
    
    // 2. Parcourir et traduire tous les éléments data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        if (translations[lang][key].includes('<span') || translations[lang][key].includes('<strong') || translations[lang][key].includes('"')) {
          element.innerHTML = translations[lang][key];
        } else {
          element.textContent = translations[lang][key];
        }
      }
    });
    
    // 3. Traduire les placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        element.setAttribute('placeholder', translations[lang][key]);
      }
    });
    
    // 4. Mettre à jour les boutons actifs
    if (lang === 'fr') {
      langFrBtn?.classList.add('active');
      langEnBtn?.classList.remove('active');
    } else {
      langFrBtn?.classList.remove('active');
      langEnBtn?.classList.add('active');
    }
    
    // 5. Enregistrer le choix dans localStorage
    localStorage.setItem('lang', lang);
    
    // 6. Recalculer l'impact pour rafraîchir les étiquettes et unités du calculateur
    if (typeof calculateImpact === 'function') {
      calculateImpact();
    }
  };
  
  // Événements clic sur les boutons de langue
  langFrBtn?.addEventListener('click', () => updateLanguage('fr'));
  langEnBtn?.addEventListener('click', () => updateLanguage('en'));
  
  // Initialisation de la langue par défaut au chargement
  const defaultLang = localStorage.getItem('lang') || 'fr';
  updateLanguage(defaultLang);

  // 10. Lightbox pour la Galerie Réalisations
  const galleryCards = document.querySelectorAll('.gallery-card');
  
  if (galleryCards.length > 0) {
    // Créer dynamiquement le conteneur du lightbox s'il n'existe pas
    let lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'gallery-lightbox';
      lightbox.className = 'gallery-lightbox';
      lightbox.innerHTML = `
        <button class="lightbox-close-btn" aria-label="Fermer"><i class="bi bi-x"></i></button>
        <div class="lightbox-content-wrapper">
          <img class="lightbox-img" src="" alt="Aperçu">
          <div class="lightbox-caption">
            <div class="lightbox-category"></div>
            <h4 class="lightbox-title"></h4>
          </div>
        </div>
      `;
      document.body.appendChild(lightbox);
    }
    
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCategory = lightbox.querySelector('.lightbox-category');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const closeBtn = lightbox.querySelector('.lightbox-close-btn');
    
    const openLightbox = (card) => {
      const img = card.querySelector('img');
      const category = card.querySelector('.gallery-category');
      const title = card.querySelector('.gallery-title');
      
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || "";
        
        // Copier le contenu textuel s'il est présent
        lightboxCategory.textContent = category ? category.textContent : "";
        lightboxTitle.textContent = title ? title.textContent : "";
        
        // Activer la lightbox
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
      }
    };
    
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.classList.remove('lightbox-open');
      // Effacer l'image après la transition pour éviter un flash visuel au prochain clic
      setTimeout(() => {
        if (!lightbox.classList.contains('active')) {
          lightboxImg.src = "";
        }
      }, 350);
    };
    
    galleryCards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => openLightbox(card));
    });
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Fermeture avec la touche Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
});

