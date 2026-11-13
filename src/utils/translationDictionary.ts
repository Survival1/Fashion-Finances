export type SupportedLanguage = 'es' | 'en' | 'fr' | 'de';

export interface LanguageOption {
  code: SupportedLanguage;
  shortCode: string;
  label: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', shortCode: 'EN', label: 'Inglés', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', shortCode: 'ES', label: 'Español', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', shortCode: 'FR', label: 'Francés', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', shortCode: 'DE', label: 'Alemán', nativeName: 'Deutsch', flag: '🇩🇪' },
];

type TranslationTuple = [en: string, fr: string, de: string];

/**
 * Normalized (lowercase trimmed) exact UI phrase translations -> [English, French, German]
 */
export const EXACT_PHRASES: Record<string, TranslationTuple> = {
  // Header & Navigation
  'casting live & fashion models': ['Casting Live & Fashion Models', 'Casting Live & Mannequins', 'Casting Live & Fashion-Models'],
  'panel admin': ['Admin Panel', 'Panneau Admin', 'Admin-Panel'],
  'abrir panel de administración integral': ['Open Full Administration Panel', "Ouvrir le panneau d'administration complet", 'Vollständiges Admin-Panel öffnen'],
  'añadir fondos simulados': ['Add simulated funds', 'Ajouter des fonds simulés', 'Simuliertes Guthaben aufladen'],
  'añadir fondos simulación (backoffice)': ['Add Simulated Funds (Backoffice)', 'Ajouter des fonds simulés (Backoffice)', 'Simuliertes Guthaben aufladen (Backoffice)'],
  'abrir centro de notificaciones': ['Open notification center', 'Ouvrir le centre de notifications', 'Benachrichtigungszentrale öffnen'],
  'mi perfil': ['My Profile', 'Mon Profil', 'Mein Profil'],
  'mis finanzas': ['My Finances', 'Mes Finances', 'Meine Finanzen'],
  'rondas': ['Rounds', 'Tours', 'Runden'],
  'sesiones': ['Sessions', 'Séances', 'Sitzungen'],
  'registrar proyecto': ['Register Project', 'Enregistrer un Projet', 'Projekt registrieren'],
  'proyectos guardados': ['Saved Projects', 'Projets Enregistrés', 'Gespeicherte Projekte'],
  'mensajes': ['Messages', 'Messages', 'Nachrichten'],
  'patrocinados': ['Sponsored', 'Sponsorisés', 'Gesponsert'],
  'cerrar sesión': ['Sign Out', 'Déconnexion', 'Abmelden'],
  'nuevo': ['NEW', 'NOUVEAU', 'NEU'],
  'notificaciones': ['Notifications', 'Notifications', 'Benachrichtigungen'],
  'marcar todas como leídas': ['Mark all as read', 'Tout marquer comme lu', 'Alle als gelesen markieren'],
  'leer todas': ['Read all', 'Tout lire', 'Alle lesen'],
  'vaciar todas': ['Clear all', 'Tout effacer', 'Alle löschen'],
  'no hay notificaciones en esta categoría': ['No notifications in this category', 'Aucune notification dans cette catégorie', 'Keine Benachrichtigungen in dieser Kategorie'],
  'cerrar notificaciones': ['Close notifications', 'Fermer les notifications', 'Benachrichtigungen schließen'],
  'eliminar notificación': ['Delete notification', 'Supprimer la notification', 'Benachrichtigung löschen'],
  'aceptar': ['Accept', 'Accepter', 'Akzeptieren'],
  'rechazar': ['Decline', 'Refuser', 'Ablehnen'],
  'enviar mensaje': ['Send Message', 'Envoyer un message', 'Nachricht senden'],
  'ver en mis amigos': ['View in My Friends', 'Voir dans Mes Amis', 'In Meinen Freunden ansehen'],
  'comisiones': ['Commissions', 'Commissions', 'Provisionen'],
  'regalos': ['Gifts', 'Cadeaux', 'Geschenke'],
  'redes': ['Networks', 'Réseaux', 'Netzwerke'],
  'amigos': ['Friends', 'Amis', 'Freunde'],

  // Visitor banner & Auth
  'estás navegando como visitante no registrado.': ['You are browsing as an Unregistered Visitor.', 'Vous naviguez en tant que visiteur non inscrit.', 'Sie surfen als nicht registrierter Besucher.'],
  'registrar cuenta': ['Register Account', 'Créer un compte', 'Konto registrieren'],
  'iniciar sesión': ['Sign In', 'Se connecter', 'Anmelden'],
  'cerrar': ['Close', 'Fermer', 'Schließen'],
  'volver': ['Back', 'Retour', 'Zurück'],
  'volver atrás': ['Go back', 'Retour', 'Zurückgehen'],
  'guardar': ['Save', 'Enregistrer', 'Speichern'],
  'cancelar': ['Cancel', 'Annuler', 'Abbrechen'],
  'confirmar': ['Confirm', 'Confirmer', 'Bestätigen'],
  'continuar': ['Continue', 'Continuer', 'Weiter'],
  'buscar': ['Search', 'Rechercher', 'Suchen'],
  'seleccionar': ['Select', 'Sélectionner', 'Auswählen'],
  'elegir': ['Choose', 'Choisir', 'Wählen'],
  'seleccionado': ['Selected', 'Sélectionné', 'Ausgewählt'],
  'enviar': ['Send', 'Envoyer', 'Senden'],
  'eliminar': ['Delete', 'Supprimer', 'Löschen'],
  'editar': ['Edit', 'Modifier', 'Bearbeiten'],

  // Profile, Follow, Ranking & Models
  'seguir': ['Follow', 'Suivre', 'Folgen'],
  'siguiendo': ['Following', 'Abonné', 'Folge ich'],
  'mensaje': ['Message', 'Message', 'Nachricht'],
  'agregar como amigo': ['Add Friend', 'Ajouter comme ami', 'Als Freund hinzufügen'],
  'solicitud enviada': ['Request Sent', 'Demande envoyée', 'Anfrage gesendet'],
  'cancelar solicitud': ['Cancel Request', 'Annuler la demande', 'Anfrage abbrechen'],
  'patrocinador oficial': ['Official Sponsor', 'Sponsor Officiel', 'Offizieller Sponsor'],
  'elegir como patrocinador': ['Choose as Sponsor', 'Choisir comme sponsor', 'Als Sponsor wählen'],
  'cuentas que sigues': ['Accounts You Follow', 'Comptes que vous suivez', 'Konten, denen du folgst'],
  'desplegar más': ['Show more', 'Afficher plus', 'Mehr anzeigen'],
  'desplegar más usuarios': ['Show more users', 'Afficher plus d’utilisateurs', 'Mehr Nutzer anzeigen'],
  'contraer usuarios': ['Show fewer users', 'Réduire la liste', 'Weniger Nutzer anzeigen'],
  'ranking de modelos': ['Model Ranking', 'Classement des Mannequins', 'Model-Ranking'],
  'top modelos oficiales de pasarela': ['Top official runway models', 'Meilleurs mannequins officiels de défilé', 'Top offizielle Laufsteg-Models'],
  'tu saldo': ['Your Balance', 'Votre Solde', 'Dein Guthaben'],
  'invertido': ['Invested', 'Investi', 'Investiert'],
  'ganancias': ['Earnings', 'Gains', 'Einnahmen'],
  'cambiar imagen de fondo': ['Change Cover Photo', 'Changer l’image de fond', 'Hintergrundbild ändern'],
  'actualizar imagen de perfil': ['Update Profile Photo', 'Mettre à jour la photo de profil', 'Profilbild aktualisieren'],
  'ajustes y privacidad': ['Settings & Privacy', 'Paramètres et confidentialité', 'Einstellungen & Datenschutz'],
  'estado de cuenta': ['Account Status', 'État du compte', 'Kontostatus'],
  'dirección': ['Address', 'Adresse', 'Adresse'],
  'correo electrónico': ['Email Address', 'Adresse e-mail', 'E-Mail-Adresse'],
  'teléfono': ['Phone', 'Téléphone', 'Telefon'],
  'compartir correo electrónico': ['Share email', 'Partager l’e-mail', 'E-Mail teilen'],
  'compartir dirección de contacto': ['Share contact address', 'Partager l’adresse de contact', 'Kontaktadresse teilen'],
  'compartir teléfono de contacto': ['Share contact phone', 'Partager le numéro de téléphone', 'Telefonnummer teilen'],
  'foto anterior': ['Previous photo', 'Photo précédente', 'Vorheriges Foto'],
  'haz clic para siguiente foto': ['Click for next photo', 'Cliquez pour la photo suivante', 'Klicken für nächstes Foto'],

  // DashboardStats (Mis Finanzas / Backoffice)
  'portafolio financiero': ['Financial Portfolio', 'Portefeuille Financier', 'Finanzportfolio'],
  'monitorea tus inversiones, dividendos y comisiones de afiliación.': ['Monitor your investments, dividends, and affiliate commissions.', 'Suivez vos investissements, dividendes et commissions d’affiliation.', 'Überwache deine Investitionen, Dividenden und Affiliate-Provisionen.'],
  'resumen general': ['Overview', 'Vue d’ensemble', 'Übersicht'],
  'gráficos de análisis': ['Analytics Charts', 'Graphiques d’analyse', 'Analyse-Diagramme'],
  'saldo backoffice': ['Backoffice Balance', 'Solde Backoffice', 'Backoffice-Guthaben'],
  'fondo garantizado': ['Guaranteed fund', 'Fonds garanti', 'Garantierter Fonds'],
  'liquidez': ['LIQUIDITY', 'LIQUIDITÉ', 'LIQUIDITÄT'],
  'premios ganados (80%)': ['PRIZES WON (80%)', 'PRIX GAGNÉS (80 %)', 'GEWONNENE PREISE (80 %)'],
  'retorno neto de financiación': ['Net funding return', 'Rendement net du financement', 'Netto-Finanzierungsrendite'],
  'inversión rondas': ['ROUND INVESTMENTS', 'INVESTISSEMENTS TOURS', 'RUNDEN-INVESTITIONEN'],
  'proyectos participados': ['PARTICIPATED PROJECTS', 'PROJETS PARTICIPÉS', 'BETEILIGTE PROJEKTE'],
  'saldo sacado': ['WITHDRAWN BALANCE', 'SOLDE RETIRÉ', 'ABGEHOBENES GUTHABEN'],
  'amigos de confianza': ['TRUSTED FRIENDS', 'AMIS DE CONFIANCE', 'VERTRAUTE FREUNDE'],
  'audiencia afiliada': ['AFFILIATE AUDIENCE', 'AUDIENCE AFFILIÉE', 'AFFILIATE-ZIELGRUPPE'],
  'cuentas seguidas': ['FOLLOWED ACCOUNTS', 'COMPTES SUIVIS', 'GEFOLGTE KONTEN'],
  'métricas sociales': ['SOCIAL METRICS', 'MÉTRIQUES SOCIALES', 'SOZIALE METRIKEN'],
  'últimos movimientos del backoffice': ['LATEST BACKOFFICE TRANSACTIONS', 'DERNIÈRES OPÉRATIONS DU BACKOFFICE', 'LETZTE BACKOFFICE-TRANSAKTIONEN'],
  'registro bancario': ['BANK LEDGER', 'REGISTRE BANCAIRE', 'BANKVERZEICHNIS'],
  'no hay movimientos registrados.': ['No transactions recorded.', 'Aucune opération enregistrée.', 'Keine Transaktionen verzeichnet.'],
  'evolución del saldo y liquidez': ['Balance & Liquidity Evolution', 'Évolution du solde et des liquidités', 'Guthaben- und Liquiditätsentwicklung'],
  'comparativa de ingresos vs egresos': ['Income vs. Expenses Comparison', 'Comparaison revenus vs dépenses', 'Einnahmen vs. Ausgaben'],
  'ingresos totales (depósitos + premios + comisiones)': ['Total Income (Deposits + Prizes + Commissions)', 'Revenus totaux (Dépôts + Prix + Commissions)', 'Gesamteinnahmen (Einzahlungen + Preise + Provisionen)'],
  'egresos totales (inversión rondas + retiros)': ['Total Expenses (Round Investments + Withdrawals)', 'Dépenses totales (Tours + Retraits)', 'Gesamtausgaben (Runden-Investitionen + Abhebungen)'],

  // SavedProjectsManager & Winnings History (z3.png & z4.png)
  'aquí residen tus proyectos de moda registrados en la plataforma. configura tu portafolio, haz un seguimiento rápido de tus victorias oficiales e invierte de forma directa en cualquiera de nuestras mesas activas.': [
    'Here are your fashion projects registered on the platform. Manage your portfolio, track official victories, and invest directly in any active round.',
    'Retrouvez ici vos projets de mode enregistrés sur la plateforme. Gérez votre portefeuille, suivez vos victoires officielles et investissez directement dans nos tables actives.',
    'Hier befinden sich deine auf der Plattform registrierten Modeprojekte. Verwalte dein Portfolio, verfolge offizielle Siege und investiere direkt in aktive Runden.',
  ],
  'proyectos registrados': ['Registered Projects', 'Projets Enregistrés', 'Registrierte Projekte'],
  'mesas ganadas (80%)': ['Tables Won (80%)', 'Tables Gagnées (80 %)', 'Gewonnene Tische (80 %)'],
  'fondo acumulado ganado': ['Accumulated Funds Won', 'Fonds Cumulés Gagnés', 'Gesammelte Gewinne'],
  'portafolio de proyectos guardados': ['Saved Projects Portfolio', 'Portefeuille de Projets Enregistrés', 'Portfolio gespeicherter Projekte'],
  'guardado en local & sepa': ['Saved Locally & SEPA', 'Enregistré Local & SEPA', 'Lokal & SEPA gespeichert'],
  'ningún proyecto guardado aún': ['No saved projects yet', 'Aucun projet enregistré pour l’instant', 'Noch keine gespeicherten Projekte'],
  'selecciona un proyecto para inspeccionar:': ['SELECT A PROJECT TO INSPECT:', 'SÉLECTIONNEZ UN PROJET À INSPECTER :', 'PROJEKT ZUR ANSICHT AUSWÄHLEN:'],
  'historial de rondas de inversión ganadas': ['History of Won Investment Rounds', 'Historique des Tours d’Investissement Gagnés', 'Verlauf gewonnener Investitionsrunden'],
  'registro exclusivo de tus éxitos comerciales. no se muestran proyectos que participaron pero no ganaron.': [
    'Exclusive record of your commercial victories. Projects that participated without winning are not shown.',
    'Registre exclusif de vos succès commerciaux. Les projets ayant participé sans gagner ne sont pas affichés.',
    'Exklusive Übersicht deiner Geschäftserfolge. Projekte ohne Sieg werden hier nicht angezeigt.',
  ],
  'buscar por proyecto, sesión...': ['Search by project, session...', 'Rechercher par projet, séance...', 'Nach Projekt, Sitzung suchen...'],
  'buscar por proyecto, sesión o categoría...': ['Search by project, session, or category...', 'Rechercher par projet, séance ou catégorie...', 'Nach Projekt, Sitzung oder Kategorie suchen...'],
  'por proyecto': ['By Project', 'Par Projet', 'Nach Projekt'],
  'todas las rondas': ['All Rounds', 'Tous les Tours', 'Alle Runden'],
  'expandir': ['Expand', 'Déplier', 'Erweitern'],
  'contraer': ['Collapse', 'Réduire', 'Einklappen'],
  'restablecer filtros': ['Reset filters', 'Réinitialiser les filtres', 'Filter zurücksetzen'],
  'sesiones ganadas': ['Rounds won', 'Séances gagnées', 'Gewonnene Runden'],
  'total hasta la fecha': ['Total to date', 'Total à ce jour', 'Gesamt bisher'],
  'sesión / ronda': ['Session / Round', 'Séance / Tour', 'Sitzung / Runde'],
  'fecha de consumación': ['Completion Date', 'Date de validation', 'Abschlussdatum'],
  'estado': ['Status', 'Statut', 'Status'],
  'votos obtenidos': ['Votes Received', 'Votes Obtenus', 'Erhaltene Stimmen'],
  'otros ganadores contigo': ['Other Co-Winners', 'Autres Co-gagnants', 'Weitere Mitgewinner'],
  'premio (80%)': ['Prize (80%)', 'Prix (80 %)', 'Preis (80 %)'],
  'premio recibido (80%)': ['Prize Received (80%)', 'Prix Reçu (80 %)', 'Erhaltener Preis (80 %)'],
  'ganador': ['WINNER', 'GAGNANT', 'GEWINNER'],
  'ganador único': ['Sole winner', 'Gagnant unique', 'Einzelsieger'],
  'total acumulado:': ['Accumulated total:', 'Total cumulé :', 'Gesamtsumme:'],
  'código / ronda': ['Code / Round', 'Code / Tour', 'Code / Runde'],
  'proyecto ganador': ['Winning Project', 'Projet Gagnant', 'Gewinnerprojekt'],
  'categoría': ['Category', 'Catégorie', 'Kategorie'],
  'proyecto titular': ['Lead project', 'Projet titulaire', 'Hauptprojekt'],
  'sostenibilidad o impacto ambiental': ['Sustainability or Environmental Impact', 'Durabilité ou Impact Environnemental', 'Nachhaltigkeit oder Umweltwirkung'],
  'sostenibilidad e impacto ambiental': ['Sustainability & Environmental Impact', 'Durabilité et Impact Environnemental', 'Nachhaltigkeit & Umweltwirkung'],
  'total de proyectos financiados': ['Total Funded Projects', 'Total des Projets Financés', 'Finanzierte Projekte Gesamt'],
  'resumen consolidado de propuestas con financiamiento asegurado en rondas de votación': [
    'Consolidated summary of proposals with secured funding in voting rounds',
    'Résumé consolidé des propositions ayant obtenu un financement lors des tours de vote',
    'Zusammenfassung aller Vorschläge mit gesicherter Finanzierung in Abstimmungsrunden',
  ],
  'capital total financiado': ['Total Funded Capital', 'Capital Total Financé', 'Gesamtes finanziertes Kapital'],
  'descargar pdf': ['Download PDF', 'Télécharger PDF', 'PDF herunterladen'],
  'cambiar portada': ['Change Cover', 'Changer la couverture', 'Titelbild ändern'],
  'en captación': ['Raising funds', 'En financement', 'In Finanzierung'],
  'fashion · finance · success': ['Fashion · Finance · Success', 'Mode · Finance · Succès', 'Fashion · Finance · Erfolg'],

  // Rounds Simulator, Casting Live & Podium
  'pagar inscripción de propuesta': ['Pay Proposal Entry Fee', 'Payer l’inscription du projet', 'Projekt-Teilnahmegebühr zahlen'],
  'selecciona cuál de tus proyectos vas a inscribir:': ['SELECT WHICH OF YOUR PROJECTS TO ENTER:', 'SÉLECTIONNEZ LE PROJET À INSCRIRE :', 'WÄHLE DEIN ANZUMELDENDES PROJEKT:'],
  'precio de inscripción:': ['Entry fee:', 'Frais d’inscription :', 'Teilnahmegebühr:'],
  'tu saldo disponible:': ['Your available balance:', 'Votre solde disponible :', 'Dein verfügbares Guthaben:'],
  'finalizar': ['FINISH', 'TERMINER', 'BEENDEN'],
  'live': ['LIVE', 'EN DIRECT', 'LIVE'],
  'micro on': ['MIC ON', 'MICRO ON', 'MIKRO AN'],
  'total proyectos': ['TOTAL PROJECTS', 'TOTAL PROJETS', 'ALLE PROJEKTE'],
  'votar proyectos': ['VOTE PROJECTS', 'VOTER LES PROJETS', 'PROJEKTE WÄHLEN'],
  '10 participantes totales': ['10 TOTAL PARTICIPANTS', '10 PARTICIPANTS AU TOTAL', '10 TEILNEHMER GESAMT'],
  '100% votos emitidos': ['100% VOTES CAST', '100 % VOTES EXPRIMÉS', '100 % STIMMEN ABGEGEBEN'],
  'financiación concedida': ['FUNDING AWARDED', 'FINANCEMENT ACCORDÉ', 'FINANZIERUNG BEWILLIGT'],
  'financiación conseguida': ['FUNDING SECURED', 'FINANCEMENT OBTENU', 'ERHALTENE FINANZIERUNG'],
  'capital asignado por selección comunitaria': ['Capital allocated by community selection', 'Capital attribué par sélection communautaire', 'Durch Community-Wahl zugewiesenes Kapital'],
  'empate histórico': ['HISTORIC TIE', 'ÉGALITÉ HISTORIQUE', 'HISTORISCHER GLEICHSTAND'],
  'empate · posición #1': ['TIE · POSITION #1', 'ÉGALITÉ · POSITION #1', 'GLEICHSTAND · PLATZ #1'],
  'posición #1 - seleccionado': ['POSITION #1 - SELECTED', 'POSITION #1 - SÉLECTIONNÉ', 'PLATZ #1 - AUSGEWÄHLT'],
  'cerrar concurso': ['Close Contest', 'Clôturer le concours', 'Wettbewerb schließen'],
  'acelerar con votos ia': ['Fast-Forward Voting', 'Accélérer les votes', 'Abstimmung beschleunigen'],
  'escrutinio descentralizado': ['Decentralized Tally', 'Dépouillement décentralisé', 'Dezentrale Auszählung'],
  'escrutinio': ['TALLYING', 'DÉPOUILLEMENT', 'AUSZÄHLUNG'],
  'custodia segura activa • contratos inteligentes': ['ACTIVE SECURE ESCROW • SMART CONTRACTS', 'SÉQUESTRE SÉCURISÉ ACTIF • CONTRATS INTELLIGENTS', 'AKTIVES TREUHANDKONTO • SMART CONTRACTS'],
  'en espera de 10 miembros': ['Awaiting 10 Members', 'En attente de 10 membres', 'Wartet auf 10 Mitglieder'],
  '9/10 miembros por orden de llegada': ['9/10 Members first-come, first-served', '9/10 Membres par ordre d’arrivée', '9/10 Plätze nach Eingang'],
  'cuenta atrás': ['COUNTDOWN', 'COMPTE À REBOURS', 'COUNTDOWN'],
  '5 min exposición': ['5 min pitch', '5 min de présentation', '5 Min. Präsentation'],
  'voz en directo conectada': ['Live voice connected', 'Voix en direct connectée', 'Live-Stimme verbunden'],
  'exposición de 5 minutos en directo': ['5-minute live presentation', 'Présentation en direct de 5 minutes', '5-minütige Live-Präsentation'],
  'modelo directora': ['LEAD MODEL', 'MANNEQUIN DIRECTRICE', 'LEITENDES MODEL'],
  'inversora principal': ['LEAD INVESTOR', 'INVESTISSEUSE PRINCIPALE', 'HAUPTINVESTORIN'],
  'canales en directo': ['LIVE CHANNELS', 'CHAÎNES EN DIRECT', 'LIVE-KANÄLE'],
  'todos': ['All', 'Tous', 'Alle'],
  'para ti': ['For You', 'Pour toi', 'Für dich'],
  'subir vídeo': ['Upload Video', 'Importer vidéo', 'Video hochladen'],
  'subido desde casting live': ['Uploaded from Casting Live', 'Publié depuis Casting Live', 'Aus Casting Live hochgeladen'],
  'desplaza para ver más ↕': ['Scroll for more ↕', 'Faites défiler pour voir plus ↕', 'Scrollen für mehr ↕'],
  'detener live': ['Stop Live', 'Arrêter le live', 'Live beenden'],
  'toca emojis para añadirlos': ['Tap emojis to add', 'Touchez les émojis pour les ajouter', 'Emojis zum Hinzufügen antippen'],
  'toca para enviar': ['Tap to send', 'Touchez pour envoyer', 'Zum Senden antippen'],
  'enviar emoji:': ['SEND EMOJI:', 'ENVOYER ÉMOJI :', 'EMOJI SENDEN:'],
  'reacciones': ['Reactions', 'Réactions', 'Reaktionen'],
  'responder': ['Reply', 'Répondre', 'Antworten'],
  'compartir': ['Share', 'Partager', 'Teilen'],
  'en vivo': ['LIVE', 'EN DIRECT', 'LIVE'],
  'objetivo:': ['Objective:', 'Objectif :', 'Ziel:'],
  'plan de gasto:': ['Spending Plan:', 'Plan de dépenses :', 'Ausgabenplan:'],
  'presupuesto:': ['Budget:', 'Budget :', 'Budget:'],
  'votos recibidos': ['votes received', 'votes reçus', 'erhaltene Stimmen'],
  'colección de alta costura del proyecto ganador': ['Winning Project Haute Couture Collection', 'Collection Haute Couture du Projet Gagnant', 'Haute-Couture-Kollektion des Siegerprojekts'],
  'galería de alta costura del proyecto financiado': ['FUNDED PROJECT HAUTE COUTURE GALLERY', 'GALERIE HAUTE COUTURE DU PROJET FINANCÉ', 'HAUTE-COUTURE-GALERIE DES FINANZIERTEN PROJEKTS'],
  'galería de alta costura de los proyectos financiados': ['FUNDED PROJECTS HAUTE COUTURE GALLERY', 'GALERIE HAUTE COUTURE DES PROJETS FINANCÉS', 'HAUTE-COUTURE-GALERIE DER FINANZIERTEN PROJEKTE'],
  'carrusel de proyectos financiados (selecciona uno):': ['FUNDED PROJECTS CAROUSEL (SELECT ONE):', 'CARROUSEL DES PROJETS FINANCÉS (SÉLECTIONNEZ) :', 'KARUSSELL FINANZIERTER PROJEKTE (AUSWÄHLEN):'],
  'selecciona para explorar su proyecto': ['SELECT TO EXPLORE THEIR PROJECT', 'SÉLECTIONNEZ POUR EXPLORER LE PROJET', 'ZUM ERKUNDEN DES PROJEKTS AUSWÄHLEN'],
  '6 rondas disponibles': ['6 Available Rounds', '6 Tours Disponibles', '6 Verfügbare Runden'],
  'disparar pago de 10€ y acceder a votaciones': ['Pay 10€ Entry & Enter Voting', 'Payer 10€ et accéder aux votes', '10€ zahlen & zur Abstimmung'],
  'disparar pago de 10.00€ y acceder a votaciones': ['Pay 10.00€ Entry & Enter Voting', 'Payer 10,00€ et accéder aux votes', '10,00€ zahlen & zur Abstimmung'],
  'mis patrocinados': ['My Sponsored Network', 'Mes Sponsorisés', 'Meine Gesponserten'],
  'módulo de patrocinios': ['SPONSORSHIP MODULE', 'MODULE DE PARRAINAGE', 'SPONSORING-MODUL'],
  'no se encontraron patrocinados': ['No sponsored members found', 'Aucun sponsorisé trouvé', 'Keine Gesponserten gefunden'],
  'mostrar código qr': ['SHOW QR CODE', 'AFFICHER CODE QR', 'QR-CODE ANZEIGEN'],
  'compartir en instagram': ['SHARE ON INSTAGRAM', 'PARTAGER SUR INSTAGRAM', 'AUF INSTAGRAM TEILEN'],
  'conversación de canal privado cifrada punto-a-punto': ['End-to-end encrypted private channel chat', 'Conversation privée chiffrée de bout en bout', 'Ende-zu-Ende-verschlüsselter Privatchat'],
  'selecciona o busca un destinatario': ['Select or search a recipient', 'Sélectionnez ou recherchez un destinataire', 'Empfänger auswählen oder suchen'],
  'sin mensajes previos': ['No prior messages', 'Aucun message précédent', 'Keine vorherigen Nachrichten'],
  '¡escríbele un privado!': ['Send a private message!', 'Envoyez un message privé !', 'Schreibe eine Privatnachricht!'],
  '← volver': ['← Back', '← Retour', '← Zurück'],
  '← contactos': ['← Contacts', '← Contacts', '← Kontakte'],

  // LandingPage & Auth Modals
  'investors & models': ['Investors & Models', 'Investisseurs & Mannequins', 'Investoren & Models'],
  'simulador': ['Simulator', 'Simulateur', 'Simulator'],
  'registrarse': ['Sign Up', 'S’inscrire', 'Registrieren'],
  'la fusión definitiva de moda y finanzas colectivas': ['The Ultimate Fusion of Fashion & Collective Finance', 'La fusion ultime de la mode et de la finance collective', 'Die ultimative Fusion aus Mode und Kollektivfinanzierung'],
  'somos una comunidad de modelos unidas para patrocinar las empresas, los inversores y emprendedores de élite.': [
    'We are a community of models united to sponsor elite companies, investors, and entrepreneurs.',
    'Nous sommes une communauté de mannequins unies pour sponsoriser les entreprises, investisseurs et entrepreneurs d’élite.',
    'Wir sind eine Model-Community, die vereint Elite-Unternehmen, Investoren und Gründer sponsert.',
  ],
  'únete a una comunidad global de modelos e inversores, construyendo juntas un futuro más brillante. regístrate ahora y lleva tus sueños al siguiente nivel.': [
    'Join a global community of models and investors building a brighter future together. Sign up now and take your dreams to the next level.',
    'Rejoignez une communauté mondiale de mannequins et d’investisseurs construisant ensemble un avenir brillant. Inscrivez-vous maintenant et passez au niveau supérieur.',
    'Tritt einer globalen Community aus Models und Investoren bei, die gemeinsam eine glänzende Zukunft gestaltet. Jetzt registrieren und Träume aufs nächste Level bringen.',
  ],
  'explora el ranking de moda': ['Explore the Fashion Ranking', 'Explorer le classement mode', 'Mode-Ranking entdecken'],
  'prueba el simulador de perfiles': ['Try the Profile Simulator', 'Tester le simulateur de profils', 'Profil-Simulator testen'],
  'modelos del ranking': ['Ranked Models', 'Mannequins classés', 'Gelistete Models'],
  'inversores activos': ['Active Investors', 'Investisseurs actifs', 'Aktive Investoren'],
  'éxito en campañas': ['Campaign Success', 'Succès des campagnes', 'Kampagnenerfolg'],
  'fondo acumulado': ['Accumulated Fund', 'Fonds cumulé', 'Gesamtfonds'],
  'un ecosistema simbiótico': ['A Symbiotic Ecosystem', 'Un écosystème symbiotique', 'Ein symbiotisches Ökosystem'],
  '¿por qué fashion finances es diferente?': ['Why is Fashion Finances Different?', 'Pourquoi Fashion Finances est-il différent ?', 'Warum ist Fashion Finances anders?'],
  'unimos inversores creativos con personas influyentes del modelaje mediante contratos digitales de apadrinamiento mutuo.': [
    'We connect creative investors with influential modeling talent through digital mutual sponsorship contracts.',
    'Nous unissons des investisseurs créatifs à des personnalités influentes du mannequinat via des contrats numériques de parrainage mutuel.',
    'Wir verbinden kreative Investoren mit einflussreichen Models durch digitale Partnerschaftsverträge.',
  ],
  '1. patrocinio oficial': ['1. Official Sponsorship', '1. Sponsoring Officiel', '1. Offizielles Sponsoring'],
  '2. crowdfunding de propuestas': ['2. Proposal Crowdfunding', '2. Crowdfunding de Projets', '2. Projekt-Crowdfunding'],
  '3. transparencia absoluta': ['3. Total Transparency', '3. Transparence Totale', '3. Absolute Transparenz'],
  'colección top 100 ranking': ['TOP 100 RANKING COLLECTION', 'COLLECTION CLASSEMENT TOP 100', 'TOP 100 RANKING-KOLLEKTION'],
  'top modelos femeninas': ['Top Female Models', 'Top Mannequins Femmes', 'Top Weibliche Models'],
  'top modelos masculinos': ['Top Male Models', 'Top Mannequins Hommes', 'Top Männliche Models'],
  'dinámica de votación global': ['Global Voting Mechanics', 'Mécanique de vote mondiale', 'Globale Abstimmungsdynamik'],
  'consola del diseñador': ['Designer Console', 'Console du Créateur', 'Designer-Konsole'],
  'simulador de roles de usuario': ['User Role Simulator', 'Simulateur de rôles utilisateur', 'Benutzerrollen-Simulator'],
  'simular inversor': ['Simulate Investor', 'Simuler Investisseur', 'Investor simulieren'],
  'simular modelo': ['Simulate Model', 'Simuler Mannequin', 'Model simulieren'],
  'regístrate y empieza': ['Sign Up & Get Started', 'Inscrivez-vous et commencez', 'Registrieren & Loslegen'],
  'ya tengo cuenta': ['I Already Have an Account', 'J’ai déjà un compte', 'Ich habe bereits ein Konto'],
  'desplazar hacia arriba': ['Scroll to top', 'Haut de page', 'Nach oben scrollen'],
  'ir arriba / inicio': ['Go to top / Home', 'Haut de page / Accueil', 'Nach oben / Start'],
  'entrar al panel': ['Enter Dashboard', 'Accéder au tableau de bord', 'Zum Dashboard'],
  '¿olvidaste tu contraseña? solicítala por email': ['Forgot your password? Request it by email', 'Mot de passe oublié ? Demandez-le par e-mail', 'Passwort vergessen? Per E-Mail anfordern'],
  'crear cuenta en': ['Create Account on', 'Créer un compte sur', 'Konto erstellen bei'],
  '1. identidad & perfil': ['1. Identity & Profile', '1. Identité & Profil', '1. Identität & Profil'],
  'nombre': ['First Name', 'Prénom', 'Vorname'],
  'apellidos': ['Last Name', 'Nom', 'Nachname'],
  'usuario': ['Username', 'Nom d’utilisateur', 'Benutzername'],
  'contraseña': ['Password', 'Mot de passe', 'Passwort'],
  'ciudad': ['City', 'Ville', 'Stadt'],
  'código postal': ['Postal Code', 'Code postal', 'Postleitzahl'],
  'país': ['Country', 'Pays', 'Land'],
  'rol de usuario': ['User Role', 'Rôle utilisateur', 'Benutzerrolle'],
  'inversor': ['Investor', 'Investisseur', 'Investor'],
  'modelo': ['Model', 'Mannequin', 'Model'],
  'género': ['Gender', 'Genre', 'Geschlecht'],
  'femenino': ['Female', 'Féminin', 'Weiblich'],
  'masculino': ['Male', 'Masculin', 'Männlich'],

  // Profile, Posts, Ranking & ProjectForm
  'publicaciones': ['Posts', 'Publications', 'Beiträge'],
  'fotos': ['Photos', 'Photos', 'Fotos'],
  'vídeos': ['Videos', 'Vidéos', 'Videos'],
  'presentación': ['Showcase', 'Présentation', 'Präsentation'],
  'tiendas': ['Boutiques', 'Boutiques', 'Boutiquen'],
  'seguidores': ['Followers', 'Abonnés', 'Follower'],
  'me gusta': ['Like', 'J’aime', 'Gefällt mir'],
  'comentar': ['Comment', 'Commenter', 'Kommentieren'],
  'editar perfil': ['Edit Profile', 'Modifier le profil', 'Profil bearbeiten'],
  '¿qué estás pensando?': ["What's on your mind?", 'À quoi pensez-vous ?', 'Was machst du gerade?'],
  'publicar': ['Publish', 'Publier', 'Veröffentlichen'],
  'escribe un comentario...': ['Write a comment...', 'Écrire un commentaire...', 'Kommentar schreiben...'],
  'enviar mensaje privado': ['Send private message', 'Envoyer un message privé', 'Privatnachricht senden'],
  'ranking oficial': ['Official Ranking', 'Classement Officiel', 'Offizielles Ranking'],
  'premios': ['Prizes', 'Prix', 'Preise'],
  'hall of fame': ['Hall of Fame', 'Temple de la Renommée', 'Hall of Fame'],
  'rondas disponibles': ['Available Rounds', 'Tours disponibles', 'Verfügbare Runden'],
  'reglas de participación': ['Participation Rules', 'Règles de participation', 'Teilnahmeregeln'],
  'información básica': ['Basic Info', 'Informations de base', 'Basisinfos'],
  'financiación y presupuesto': ['Funding & Budget', 'Financement et Budget', 'Finanzierung & Budget'],
  'equipo del proyecto': ['Project Team', 'Équipe du projet', 'Projektteam'],
  'publicar proyecto': ['Publish Project', 'Publier le projet', 'Projekt veröffentlichen'],
  'título del proyecto': ['Project Title', 'Titre du projet', 'Projekttitel'],
  'descripción corta': ['Short Description', 'Description courte', 'Kurzbeschreibung'],
  'descripción detallada': ['Detailed Description', 'Description détaillée', 'Ausführliche Beschreibung'],
  'objetivo financiero': ['Funding Goal', 'Objectif financier', 'Finanzierungsziel'],
  'uso de los fondos': ['Use of Funds', 'Utilisation des fonds', 'Mittelverwendung'],
  'cronograma': ['Timeline', 'Calendrier', 'Zeitplan'],
  'subir imágenes': ['Upload Images', 'Importer des images', 'Bilder hochladen'],
  'subir vídeos': ['Upload Videos', 'Importer des vidéos', 'Videos hochladen'],
  'siguiente paso': ['Next Step', 'Étape suivante', 'Nächster Schritt'],
  'paso anterior': ['Previous Step', 'Étape précédente', 'Vorheriger Schritt'],

  // AdminPortal
  'panel de administración': ['Administration Panel', 'Panneau d’administration', 'Administrationsbereich'],
  'volver al panel': ['Back to Dashboard', 'Retour au tableau de bord', 'Zurück zum Dashboard'],
  'usuarios': ['Users', 'Utilisateurs', 'Benutzer'],
  'proyectos': ['Projects', 'Projets', 'Projekte'],
  'modelos': ['Models', 'Mannequins', 'Models'],
  'contenido': ['Content', 'Contenu', 'Inhalte'],
  'configuración': ['Settings', 'Paramètres', 'Einstellungen'],
  'auditoría': ['Audit Log', 'Journal d’audit', 'Prüfprotokoll'],
  'buscar por nombre, @username o email...': ['Search by name, @username, or email...', 'Rechercher par nom, @username ou e-mail...', 'Nach Name, @username oder E-Mail suchen...'],
};

interface PatternRule {
  regex: RegExp;
  translate: (m: RegExpMatchArray, lang: Exclude<SupportedLanguage, 'es'>) => string;
}

const MONTH_MAP: Record<string, TranslationTuple> = {
  ene: ['Jan', 'janv.', 'Jan.'],
  feb: ['Feb', 'févr.', 'Feb.'],
  mar: ['Mar', 'mars', 'März'],
  abr: ['Apr', 'avr.', 'Apr.'],
  may: ['May', 'mai', 'Mai'],
  jun: ['Jun', 'juin', 'Juni'],
  jul: ['Jul', 'juil.', 'Juli'],
  ago: ['Aug', 'août', 'Aug.'],
  sep: ['Sep', 'sept.', 'Sept.'],
  oct: ['Oct', 'oct.', 'Okt.'],
  nov: ['Nov', 'nov.', 'Nov.'],
  dic: ['Dec', 'déc.', 'Dez.'],
};

export const PATTERN_RULES: PatternRule[] = [
  {
    regex: /^(\d+)\s+Victoria(s)?$/i,
    translate: (m, lang) => {
      const n = Number(m[1]);
      if (lang === 'en') return `${n} ${n === 1 ? 'Win' : 'Wins'}`;
      if (lang === 'fr') return `${n} ${n === 1 ? 'Victoire' : 'Victoires'}`;
      return `${n} ${n === 1 ? 'Sieg' : 'Siege'}`;
    },
  },
  {
    regex: /^(\d+)\s+Proyecto(s)?\s+Ganador(es)?$/i,
    translate: (m, lang) => {
      const n = Number(m[1]);
      if (lang === 'en') return `${n} ${n === 1 ? 'Winning Project' : 'Winning Projects'}`;
      if (lang === 'fr') return `${n} ${n === 1 ? 'Projet Gagnant' : 'Projets Gagnants'}`;
      return `${n} ${n === 1 ? 'Siegerprojekt' : 'Siegerprojekte'}`;
    },
  },
  {
    regex: /^([+-]?\d+(?:[.,]\d+)?€)\s+Acumulados$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `${m[1]} Accumulated`;
      if (lang === 'fr') return `${m[1]} Cumulés`;
      return `${m[1]} Angesammelt`;
    },
  },
  {
    regex: /^Ha ganado (\d+)\s+(vez|veces)$/i,
    translate: (m, lang) => {
      const n = Number(m[1]);
      if (lang === 'en') return `Won ${n} ${n === 1 ? 'time' : 'times'}`;
      if (lang === 'fr') return `A gagné ${n} fois`;
      return `${n} Mal gewonnen`;
    },
  },
  {
    regex: /^(\d+)\s+sesi[oó]n(es)?$/i,
    translate: (m, lang) => {
      const n = Number(m[1]);
      if (lang === 'en') return `${n} ${n === 1 ? 'round' : 'rounds'}`;
      if (lang === 'fr') return `${n} ${n === 1 ? 'séance' : 'séances'}`;
      return `${n} ${n === 1 ? 'Runde' : 'Runden'}`;
    },
  },
  {
    regex: /^(\d+)\s+votos?$/i,
    translate: (m, lang) => {
      const n = Number(m[1]);
      if (lang === 'en') return `${n} ${n === 1 ? 'vote' : 'votes'}`;
      if (lang === 'fr') return `${n} ${n === 1 ? 'vote' : 'votes'}`;
      return `${n} ${n === 1 ? 'Stimme' : 'Stimmen'}`;
    },
  },
  {
    regex: /^(\d+)\s+votos recibidos$/i,
    translate: (m, lang) => {
      const n = Number(m[1]);
      if (lang === 'en') return `${n} ${n === 1 ? 'vote' : 'votes'} received`;
      if (lang === 'fr') return `${n} ${n === 1 ? 'vote reçu' : 'votes reçus'}`;
      return `${n} ${n === 1 ? 'Stimme' : 'Stimmen'} erhalten`;
    },
  },
  {
    regex: /^Todos los proyectos \((\d+)\)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `All projects (${m[1]})`;
      if (lang === 'fr') return `Tous les projets (${m[1]})`;
      return `Alle Projekte (${m[1]})`;
    },
  },
  {
    regex: /^Inscribirse en una ronda de \((.+)\)$/i,
    translate: (m, lang) => {
      const fee = m[1].replace(/euros/i, lang === 'en' ? 'euros' : lang === 'fr' ? 'euros' : 'Euro');
      if (lang === 'en') return `Join a round of (${fee})`;
      if (lang === 'fr') return `Participer à un tour de (${fee})`;
      return `An Runde über (${fee}) teilnehmen`;
    },
  },
  {
    regex: /^Estás inscrita como participante \((.+)\)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Enrolled as participant (${m[1]})`;
      if (lang === 'fr') return `Inscrite comme participante (${m[1]})`;
      return `Als Teilnehmerin angemeldet (${m[1]})`;
    },
  },
  {
    regex: /^Disparar Pago de (.+) y Acceder a Votaciones$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Pay ${m[1]} & Enter Voting`;
      if (lang === 'fr') return `Payer ${m[1]} et accéder aux votes`;
      return `${m[1]} zahlen & zur Abstimmung`;
    },
  },
  {
    regex: /^TURNO (\d+) DE (\d+)\s*[•·]\s*EN EXPOSICIÓN$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `TURN ${m[1]} OF ${m[2]} • PRESENTING`;
      if (lang === 'fr') return `TOUR ${m[1]} SUR ${m[2]} • PRÉSENTATION`;
      return `RUNDE ${m[1]} VON ${m[2]} • PRÄSENTATION`;
    },
  },
  {
    regex: /^(\d+(?:[.,]\d+)?€)\s+INSCRIPCIÓN\s*[•·]\s*(\d+)\s+PARTICIPANTES$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `${m[1]} ENTRY • ${m[2]} PARTICIPANTS`;
      if (lang === 'fr') return `${m[1]} INSCRIPTION • ${m[2]} PARTICIPANTS`;
      return `${m[1]} TEILNAHME • ${m[2]} TEILNEHMER`;
    },
  },
  {
    regex: /^Sesiones y Rondas en las que ha ganado \((\d+)\):$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Sessions & Rounds Won (${m[1]}):`;
      if (lang === 'fr') return `Séances et Tours gagnés (${m[1]}) :`;
      return `Gewonnene Sitzungen & Runden (${m[1]}):`;
    },
  },
  {
    regex: /^Votos conseguidos:\s*(.+)$/i,
    translate: (m, lang) => {
      const val = m[1].replace(/votos/gi, lang === 'en' ? 'votes' : lang === 'fr' ? 'votes' : 'Stimmen');
      if (lang === 'en') return `Votes achieved: ${val}`;
      if (lang === 'fr') return `Votes obtenus : ${val}`;
      return `Erreichte Stimmen: ${val}`;
    },
  },
  {
    regex: /^Co-ganadores:\s*(.+)$/i,
    translate: (m, lang) => {
      const rest = m[1].replace(/0 \(victoria exclusiva sin otros ganadores\)/i, () => {
        if (lang === 'en') return '0 (exclusive win with no co-winners)';
        if (lang === 'fr') return '0 (victoire exclusive sans co-gagnants)';
        return '0 (Alleinsieg ohne Mitgewinner)';
      });
      if (lang === 'en') return `Co-winners: ${rest}`;
      if (lang === 'fr') return `Co-gagnants : ${rest}`;
      return `Mitgewinner: ${rest}`;
    },
  },
  {
    regex: /^(\d+)\s+persona(?:s)? más\s+\((\d+)\s+total\)$/i,
    translate: (m, lang) => {
      const n = Number(m[1]);
      if (lang === 'en') return `${n} more ${n === 1 ? 'person' : 'people'} (${m[2]} total)`;
      if (lang === 'fr') return `${n} autre(s) personne(s) (${m[2]} au total)`;
      return `${n} weitere Person(en) (${m[2]} gesamt)`;
    },
  },
  {
    regex: /^Solo Financiados \((\d+)\)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Funded Only (${m[1]})`;
      if (lang === 'fr') return `Financés uniquement (${m[1]})`;
      return `Nur finanzierte (${m[1]})`;
    },
  },
  {
    regex: /^Todos en Slider \((\d+)\)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `All in Slider (${m[1]})`;
      if (lang === 'fr') return `Tous dans le carrousel (${m[1]})`;
      return `Alle im Slider (${m[1]})`;
    },
  },
  {
    regex: /^(\d+) de (\d+) proyectos?$/i,
    translate: (m, lang) => {
      const total = Number(m[2]);
      if (lang === 'en') return `${m[1]} of ${total} ${total === 1 ? 'project' : 'projects'}`;
      if (lang === 'fr') return `${m[1]} sur ${total} ${total === 1 ? 'projet' : 'projets'}`;
      return `${m[1]} von ${total} ${total === 1 ? 'Projekt' : 'Projekten'}`;
    },
  },
  {
    regex: /^(\d+)\s+de\s+(\d+)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `${m[1]} of ${m[2]}`;
      if (lang === 'fr') return `${m[1]} sur ${m[2]}`;
      return `${m[1]} von ${m[2]}`;
    },
  },
  {
    regex: /^(\d{1,2})\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\s+(\d{4})(,\s*\d{1,2}:\d{2})?$/i,
    translate: (m, lang) => {
      const idx = lang === 'en' ? 0 : lang === 'fr' ? 1 : 2;
      const mon = MONTH_MAP[m[2].toLowerCase()]?.[idx] ?? m[2];
      return `${m[1]} ${mon} ${m[3]}${m[4] || ''}`;
    },
  },
  {
    regex: /^Inversi[oó]n\s*-\s*Inscripci[oó]n en ronda (.+)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Investment - Entry in round ${m[1]}`;
      if (lang === 'fr') return `Investissement - Inscription au tour ${m[1]}`;
      return `Investition - Teilnahme an Runde ${m[1]}`;
    },
  },
  {
    regex: /^🏆\s*¡Ganador de (.+?)!\s*\((.+)\)$/i,
    translate: (m, lang) => {
      const detail = m[2].replace(/Ganador único/i, lang === 'en' ? 'Sole winner' : lang === 'fr' ? 'Gagnant unique' : 'Einzelsieger')
        .replace(/Empate de (\d+)/i, (_, n) => (lang === 'en' ? `${n}-way tie` : lang === 'fr' ? `Égalité à ${n}` : `${n}-fach Gleichstand`));
      if (lang === 'en') return `🏆 Winner of ${m[1]}! (${detail})`;
      if (lang === 'fr') return `🏆 Gagnant de ${m[1]} ! (${detail})`;
      return `🏆 Gewinner von ${m[1]}! (${detail})`;
    },
  },
  {
    regex: /^Total acumulado:\s*([+-]?\d+(?:[.,]\d+)?€)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Accumulated total: ${m[1]}`;
      if (lang === 'fr') return `Total cumulé : ${m[1]}`;
      return `Gesamtsumme: ${m[1]}`;
    },
  },
  {
    regex: /^Este proyecto ha obtenido (\d+) victoria(?:s)? oficial(?:es)? en (\d+) sesi[oó]n(?:es)? de inversi[oó]n\.?$/i,
    translate: (m, lang) => {
      const v = Number(m[1]);
      const s = Number(m[2]);
      if (lang === 'en') return `This project has achieved ${v} official ${v === 1 ? 'victory' : 'victories'} across ${s} investment ${s === 1 ? 'round' : 'rounds'}.`;
      if (lang === 'fr') return `Ce projet a remporté ${v} ${v === 1 ? 'victoire officielle' : 'victoires officielles'} sur ${s} ${s === 1 ? 'séance' : 'séances'} d'investissement.`;
      return `Dieses Projekt hat ${v} ${v === 1 ? 'offiziellen Sieg' : 'offizielle Siege'} in ${s} ${s === 1 ? 'Investitionsrunde' : 'Investitionsrunden'} erzielt.`;
    },
  },
  {
    regex: /^(\d+)\s+Modelos\s+Activ(as|os)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `${m[1]} Active Models`;
      if (lang === 'fr') return m[2].toLowerCase() === 'as' ? `${m[1]} Mannequins Actives` : `${m[1]} Mannequins Actifs`;
      return `${m[1]} Aktive Models`;
    },
  },
];

/**
 * Multi-word & word-level Spanish -> [EN, FR, DE] glossary for general fallback translation
 * of dynamic sentences, tooltips, descriptions, and form prompts.
 */
export const PHRASE_REPLACEMENTS: Array<[RegExp, TranslationTuple]> = [
  [/\bde inversión ganadas\b/gi, ['of Won Investments', "d'investissements gagnés", 'gewonnener Investitionen']],
  [/\bde inversión\b/gi, ['of investment', "d'investissement", 'Investitions-']],
  [/\bpor orden de llegada\b/gi, ['first-come, first-served', "par ordre d'arrivée", 'nach Eingangsreihenfolge']],
  [/\bpor proyecto\b/gi, ['by project', 'par projet', 'nach Projekt']],
  [/\btodas las rondas\b/gi, ['all rounds', 'tous les tours', 'alle Runden']],
  [/\bno se muestran\b/gi, ['not shown', 'ne sont pas affichés', 'werden nicht angezeigt']],
  [/\ben directo\b/gi, ['live', 'en direct', 'live']],
  [/\ben vivo\b/gi, ['live', 'en direct', 'live']],
  [/\ben curso\b/gi, ['in progress', 'en cours', 'laufend']],
  [/\bhasta la fecha\b/gi, ['to date', 'à ce jour', 'bisher']],
  [/\bpara ti\b/gi, ['for you', 'pour toi', 'für dich']],
  [/\bsin otros ganadores\b/gi, ['with no co-winners', 'sans autres gagnants', 'ohne weitere Gewinner']],
  [/\bhaz clic\b/gi, ['click', 'cliquez', 'klicke']],
  [/\bañadir fondos\b/gi, ['add funds', 'ajouter des fonds', 'Guthaben aufladen']],
  [/\bcerrar sesión\b/gi, ['sign out', 'se déconnecter', 'abmelden']],
  [/\bproyecto ganador\b/gi, ['winning project', 'projet gagnant', 'Siegerprojekt']],
  [/\bproyectos guardados\b/gi, ['saved projects', 'projets enregistrés', 'gespeicherte Projekte']],
  [/\bmis finanzas\b/gi, ['my finances', 'mes finances', 'meine Finanzen']],
  [/\bmi perfil\b/gi, ['my profile', 'mon profil', 'mein Profil']],
  [/\bpatrocinador oficial\b/gi, ['official sponsor', 'sponsor officiel', 'offizieller Sponsor']],
  [/\balta costura\b/gi, ['haute couture', 'haute couture', 'Haute Couture']],
  [/\bfinanciación\b/gi, ['funding', 'financement', 'Finanzierung']],
  [/\bparticipantes\b/gi, ['participants', 'participants', 'Teilnehmer']],
  [/\bparticipante\b/gi, ['participant', 'participant', 'Teilnehmer']],
  [/\bpatrocinadores\b/gi, ['sponsors', 'sponsors', 'Sponsoren']],
  [/\bpatrocinador\b/gi, ['sponsor', 'sponsor', 'Sponsor']],
  [/\bpatrocinados\b/gi, ['sponsored', 'sponsorisés', 'Gesponserte']],
  [/\binscripción\b/gi, ['registration', 'inscription', 'Anmeldung']],
  [/\bnotificaciones\b/gi, ['notifications', 'notifications', 'Benachrichtigungen']],
  [/\bmovimientos\b/gi, ['transactions', 'opérations', 'Transaktionen']],
  [/\bpresupuesto\b/gi, ['budget', 'budget', 'Budget']],
  [/\bcategoría\b/gi, ['category', 'catégorie', 'Kategorie']],
  [/\bdescripción\b/gi, ['description', 'description', 'Beschreibung']],
  [/\bobjetivo\b/gi, ['objective', 'objectif', 'Ziel']],
  [/\bdisponible\b/gi, ['available', 'disponible', 'verfügbar']],
  [/\bacumulados\b/gi, ['accumulated', 'cumulés', 'angesammelt']],
  [/\bacumulado\b/gi, ['accumulated', 'cumulé', 'angesammelt']],
  [/\bproyectos\b/gi, ['projects', 'projets', 'Projekte']],
  [/\bproyecto\b/gi, ['project', 'projet', 'Projekt']],
  [/\bsesiones\b/gi, ['sessions', 'séances', 'Sitzungen']],
  [/\bsesión\b/gi, ['session', 'séance', 'Sitzung']],
  [/\brondas\b/gi, ['rounds', 'tours', 'Runden']],
  [/\bronda\b/gi, ['round', 'tour', 'Runde']],
  [/\bvictorias\b/gi, ['wins', 'victoires', 'Siege']],
  [/\bvictoria\b/gi, ['win', 'victoire', 'Sieg']],
  [/\bganadores\b/gi, ['winners', 'gagnants', 'Gewinner']],
  [/\bganador\b/gi, ['winner', 'gagnant', 'Gewinner']],
  [/\bvotaciones\b/gi, ['voting', 'votes', 'Abstimmung']],
  [/\bvotos\b/gi, ['votes', 'votes', 'Stimmen']],
  [/\bvoto\b/gi, ['vote', 'vote', 'Stimme']],
  [/\bmodelos\b/gi, ['models', 'mannequins', 'Models']],
  [/\bmodelo\b/gi, ['model', 'mannequin', 'Model']],
  [/\binversores\b/gi, ['investors', 'investisseurs', 'Investoren']],
  [/\binversor\b/gi, ['investor', 'investisseur', 'Investor']],
  [/\bsaldo\b/gi, ['balance', 'solde', 'Guthaben']],
  [/\bpremio\b/gi, ['prize', 'prix', 'Preis']],
  [/\bpremios\b/gi, ['prizes', 'prix', 'Preise']],
  [/\bcomisiones\b/gi, ['commissions', 'commissions', 'Provisionen']],
  [/\bcomisión\b/gi, ['commission', 'commission', 'Provision']],
  [/\bmensajes\b/gi, ['messages', 'messages', 'Nachrichten']],
  [/\bmensaje\b/gi, ['message', 'message', 'Nachricht']],
  [/\bamigos\b/gi, ['friends', 'amis', 'Freunde']],
  [/\bamigo\b/gi, ['friend', 'ami', 'Freund']],
  [/\bbuscar\b/gi, ['search', 'rechercher', 'suchen']],
  [/\bguardar\b/gi, ['save', 'enregistrer', 'speichern']],
  [/\bcancelar\b/gi, ['cancel', 'annuler', 'abbrechen']],
  [/\bcerrar\b/gi, ['close', 'fermer', 'schließen']],
  [/\bvolver\b/gi, ['back', 'retour', 'zurück']],
  [/\benviar\b/gi, ['send', 'envoyer', 'senden']],
  [/\bdescargar\b/gi, ['download', 'télécharger', 'herunterladen']],
  [/\bseleccionar\b/gi, ['select', 'sélectionner', 'auswählen']],
  [/\bselecciona\b/gi, ['select', 'sélectionnez', 'wähle']],
  [/\bregalos\b/gi, ['gifts', 'cadeaux', 'Geschenke']],
  [/\bregalo\b/gi, ['gift', 'cadeau', 'Geschenk']],
  [/\bespectadores\b/gi, ['viewers', 'spectateurs', 'Zuschauer']],
  [/\bfechas\b/gi, ['dates', 'dates', 'Daten']],
  [/\bfecha\b/gi, ['date', 'date', 'Datum']],
  [/\bestado\b/gi, ['status', 'statut', 'Status']],
  [/\btítulo\b/gi, ['title', 'titre', 'Titel']],
  [/\bnombre\b/gi, ['name', 'nom', 'Name']],
  [/\bcorreo electrónico\b/gi, ['email', 'e-mail', 'E-Mail']],
  [/\bcontraseña\b/gi, ['password', 'mot de passe', 'Passwort']],
  [/\btodos\b/gi, ['all', 'tous', 'alle']],
  [/\btodas\b/gi, ['all', 'toutes', 'alle']],
  [/\bnuevo\b/gi, ['new', 'nouveau', 'neu']],
  [/\bnueva\b/gi, ['new', 'nouvelle', 'neue']],
  [/\bactivo\b/gi, ['active', 'actif', 'aktiv']],
  [/\bactiva\b/gi, ['active', 'active', 'aktiv']],
  [/\bganado\b/gi, ['won', 'gagné', 'gewonnen']],
  [/\bganadas\b/gi, ['won', 'gagnées', 'gewonnen']],
  [/\bganados\b/gi, ['won', 'gagnés', 'gewonnen']],
  [/\bfinanciado\b/gi, ['funded', 'financé', 'finanziert']],
  [/\bfinanciados\b/gi, ['funded', 'financés', 'finanziert']],
  [/\bregistrados\b/gi, ['registered', 'enregistrés', 'registriert']],
  [/\bregistrado\b/gi, ['registered', 'enregistré', 'registriert']],
  [/\bverificado\b/gi, ['verified', 'vérifié', 'verifiziert']],
  [/\boficial\b/gi, ['official', 'officiel', 'offiziell']],
  [/\boficiales\b/gi, ['official', 'officiels', 'offiziell']],
];
