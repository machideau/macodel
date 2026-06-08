# MACODEL SERVICES sarlu - Gestion, Tri & Valorisation Durable des Déchets

Site vitrine moderne, fluide, interactif et responsive pour **MACODEL SERVICES sarlu**, une entreprise spécialisée dans la gestion, le tri et la valorisation durable des déchets pour entreprises, basée à Tchitchinouda, Kara, Togo.

---

## 🚀 Fonctionnalités Clés

1. **Calculateur d'Impact Écologique** :
   - Évaluez en temps réel les bénéfices environnementaux (CO₂ évité, pétrole économisé, litres d'eau sauvés) selon le type de déchet (Plastique, Carton, Verre, Organique, Métal) et le volume mensuel estimé.
2. **Système Multilingue Natif (FR / EN)** :
   - Commutateur linguistique (`FR | EN`) dans la barre de navigation.
   - Système de traduction côté client ultra-rapide via un dictionnaire de traduction local, sans appels API externes. Les placeholders de formulaires et les alertes dynamiques sont également localisés.
3. **Mode Sombre (Dark Mode) Intelligent** :
   - Basculez entre le thème clair et le thème sombre en un clic.
   - Design adapté (glassmorphisme, contrastes équilibrés) avec persistance du choix de l'utilisateur grâce au `localStorage`.
4. **Visionneuse Photo (Lightbox)** :
   - Cliquez sur n'importe quelle image de la section **Nos Réalisations** pour l'ouvrir en plein écran avec un effet de flou d'arrière-plan haut de gamme (`backdrop-filter`).
   - Fermeture par clic sur le bouton `X`, clic à l'extérieur de l'image ou appui sur la touche `Échap`.
5. **Carte Interactive (Green Map)** :
   - Intégration de Leaflet.js centré sur Kara pour localiser le siège social de l'entreprise (Tchitchinouda) et les points clés de collecte et de tri sélectif déployés dans la ville.
6. **Valorisation Locale (Économie Circulaire)** :
   - Frise chronologique interactive décrivant le parcours circulaire des déchets collectés à Kara jusqu'à leur transformation en pavés écologiques durables.
7. **Formulaire de Contact Réactif** :
   - Formulaire de demande de diagnostic et de devis avec retours visuels animés (chargement, validation réussie) s'adaptant à la langue de l'utilisateur.

---

## 🛠️ Technologies Utilisées

- **Structure** : HTML5 sémantique avec balises meta SEO optimisées.
- **Stylisation** : Vanilla CSS & Bootstrap 5 (via CDN).
- **Logique & Animations** : Vanilla JavaScript (ES6+), Intersection Observer API pour les animations au défilement.
- **Cartographie** : Leaflet.js (CSS & JS via CDN).
- **Icônes** : Bootstrap Icons.
- **Typographies** : Google Fonts (Outfit & Inter).

---

## 💻 Installation Locale

Pour faire fonctionner le site localement sur votre machine :

1. Clonez ce dépôt GitHub :
   ```bash
   git clone https://github.com/machideau/macodel.git
   ```
2. Ouvrez le dossier du projet :
   ```bash
   cd dechets
   ```
3. Lancez le fichier `index.html` directement dans votre navigateur web préféré, ou utilisez une extension de serveur local (comme *Live Server* dans VS Code) pour de meilleures performances de rafraîchissement en temps réel.

---

## 📦 Déploiement

Le site est hébergé en production sur **Vercel** et configuré avec un déploiement continu lié à ce dépôt GitHub.

À chaque fois que vous poussez des commits vers la branche `main`, le site est automatiquement reconstruit et mis en ligne :
```bash
git add .
git commit -m "Description de vos modifications"
git push origin main
```

---

## 📞 Contact Officiel

- **Téléphone** : 92 10 38 63 (Lundi au Vendredi, 8h - 18h)
- **E-mail** : servicesmacodel@gmail.com
- **Siège Social** : Tchitchinouda, près de l'Hôtel Memphis, Kara, Togo
