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
  '¿preparado para transformar tus': ['Ready to transform your', 'Prêt à transformer vos', 'Bereit für den Wandel Ihrer'],
  'aspiraciones?': ['aspirations?', 'aspirations ?', 'Ambitionen?'],
  'conviértete en parte de nuestra exclusiva comunidad y descubre un mundo de oportunidades en': [
    'Become part of our exclusive community and discover a world of opportunities in',
    'Rejoignez notre communauté exclusive et découvrez un monde d’opportunités dans',
    'Werden Sie Teil unserer exklusiven Community und entdecken Sie unzählige Chancen in',
  ],
  'moda, finanzas y estilo de vida.': ['fashion, finance and lifestyle.', 'la mode, la finance et le style de vie.', 'Mode, Finanzen und Lifestyle.'],
  'regístrate y empieza': ['Sign Up & Start', 'Inscrivez-vous et commencez', 'Registrieren & Starten'],
  'ya tengo cuenta': ['I Have an Account', 'J’ai déjà un compte', 'Ich habe ein Konto'],
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
  'espacio de trabajo:': ['Workspace:', 'Espace de travail :', 'Arbeitsbereich:'],
  'españa / remoto': ['Spain / Remote', 'Espagne / À distance', 'Spanien / Remote'],
  'sígueme en instagram:': ['Follow me on Instagram:', 'Suivez-moi sur Instagram :', 'Folge mir auf Instagram:'],
  'sígueme en tiktok:': ['Follow me on TikTok:', 'Suivez-moi sur TikTok :', 'Folge mir auf TikTok:'],
  'sígueme en x / twitter:': ['Follow me on X / Twitter:', 'Suivez-moi sur X / Twitter :', 'Folge mir auf X / Twitter:'],
  'sponsoring:': ['Sponsoring:', 'Parrainage :', 'Sponsoring:'],
  'comisión 10% activa': ['Commission 10% active', 'Commission de 10 % active', '10 % Provision aktiv'],
  'creatividad que genera valor': ['Creativity That Creates Value', 'Une créativité qui génère de la valeur', 'Kreativität, die Wert schafft'],
  'moda': ['Fashion', 'Mode', 'Mode'],
  'finanzas': ['Finance', 'Finances', 'Finanzen'],
  'oportunidades globales': ['Global Opportunities', 'Opportunités Mondiales', 'Globale Chancen'],
  'mi balance': ['My Balance', 'Mon Solde', 'Mein Guthaben'],
  'inversión total': ['Total Invested', 'Investissement Total', 'Gesamtinvestition'],
  'ganancias totales': ['Total Earnings', 'Gains Totaux', 'Gesamteinnahmen'],
  'comisiones recibidas': ['Commissions Received', 'Commissions Reçues', 'Erhaltene Provisionen'],
  'seguidos': ['Following', 'Abonnements', 'Gefolgt'],
  'ver todos →': ['View All →', 'Voir tout →', 'Alle ansehen →'],
  'ver todos': ['View All', 'Voir tout', 'Alle ansehen'],
  'ver todos los amigos sincronizados': ['View all synced friends', 'Voir tous les amis synchronisés', 'Alle synchronisierten Freunde ansehen'],
  'ver todos los seguidores': ['View all followers', 'Voir tous les abonnés', 'Alle Follower ansehen'],
  'ver todos los perfiles seguidos': ['View all followed profiles', 'Voir tous les profils suivis', 'Alle gefolgten Profile ansehen'],
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
  'quieres que impulsemos tus proyectos,': [
    'Want us to boost your projects,',
    'Vous voulez que nous propulsions vos projets,',
    'Möchtest du, dass wir deine Projekte voranbringen,',
  ],
  'súbelos y participa en nuestras': [
    'upload them and join our',
    'téléchargez-les et participez à nos',
    'lade sie hoch und nimm teil an unseren',
  ],
  'rondas de financiación.': ['Funding Rounds.', 'Tours de financement.', 'Finanzierungsrunden.'],
  'rondas de financiación': ['Funding Rounds', 'Tours de financement', 'Finanzierungsrunden'],
  'únete a nuestras rondas de financiación con tu proyecto y conseguirás los fondos que deseas.': [
    'Join our Funding Rounds with your project and get the funding you want.',
    'Rejoignez nos tours de financement avec votre projet et obtenez les fonds souhaités.',
    'Nimm mit deinem Projekt an unseren Finanzierungsrunden teil und sichere dir die gewünschte Förderung.',
  ],
  'tu talento, nuestra plataforma, un gran futuro juntos': [
    'Your talent, our platform, a great future together',
    'Votre talent, notre plateforme, un grand avenir ensemble',
    'Dein Talent, unsere Plattform, eine großartige gemeinsame Zukunft',
  ],
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

  // The First 100 / Los Primeros 100
  'conviértete en modelo fundadora': ['Become a Founding Model', 'Devenir Mannequin Fondatrice', 'Gründungsmodel werden'],
  'paquete fundadores': ['Founders Package', 'Pack Fondateurs', 'Gründer-Paket'],
  '100 plazas': ['100 Spots', '100 Places', '100 Plätze'],
  '90 días': ['90 Days', '90 Jours', '90 Tage'],
  'mi área de fundadores': ['My Founders Area', 'Mon Espace Fondateurs', 'Mein Gründer-Bereich'],
  'administración': ['Admin', 'Admin', 'Admin'],
  'los primeros 100': ['The First 100', 'Les 100 Premiers', 'Die Ersten 100'],
  'los 100 fundadores — lanzamiento internacional': ["The Founders' 100 — International Launch", 'Les 100 Fondateurs — Lancement International', 'Die 100 Gründer — Internationaler Launch'],
  'sé una de las primeras 100. asegura tu posición. haz tu debut en el escenario global.': [
    'Be one of the first 100. Own your position. Make your debut on the global stage.',
    'Soyez parmi les 100 premières. Sécurisez votre place. Faites vos débuts sur la scène mondiale.',
    'Sei eine der ersten 100. Sichere dir deine Position. Gib dein Debüt auf der Weltbühne.'
  ],
  'programa internacional exclusivo para los primeros 100 modelos en incorporarse a fashion finances mediante la precompra oficial de un paquete fundadores. el lanzamiento internacional tendrá lugar 90 días después de la apertura del programa.': [
    'Exclusive international program for the first 100 models joining Fashion Finances through official pre-purchase of a Founders Package. The international launch takes place 90 days after the program opens.',
    'Programme international exclusif pour les 100 premiers mannequins rejoignant Fashion Finances via la préachat officiel d’un Pack Fondateurs. Le lancement international aura lieu 90 jours après l’ouverture du programme.',
    'Exklusives internationales Programm für die ersten 100 Models, die Fashion Finances über den offiziellen Vorabkauf eines Gründer-Pakets beitreten. Der internationale Launch erfolgt 90 Tage nach Programmstart.'
  ],
  'explorar posiciones 001–100': ['Explore Positions 001–100', 'Explorer les Positions 001–100', 'Positionen 001–100 entdecken'],
  'confirmados': ['Confirmed', 'Confirmés', 'Bestätigt'],
  'lanzamiento': ['Launch', 'Lancement', 'Launch'],
  'precompra': ['Pre-Order', 'Préachat', 'Vorabkauf'],
  'edición internacional': ['International Edition', 'Édition Internationale', 'Internationale Ausgabe'],
  'cuenta atrás debut global': ['Global Debut Countdown', 'Compte à Rebours Début Mondial', 'Countdown Weltdebüt'],
  'el mundo es ahora tu pasarela.': ['The world is now your runway.', 'Le monde est désormais votre podium.', 'Die Welt ist jetzt dein Laufsteg.'],
  'lanzamiento internacional activo · programa los primeros 100': ['International launch live · The First 100 Program', 'Lancement international actif · Programme Les 100 Premiers', 'Internationaler Launch aktiv · Programm Die Ersten 100'],
  'lanzamiento internacional en curso hacia el debut global': ['International launch underway toward the global debut', 'Lancement international en cours vers le début mondial', 'Internationaler Launch auf dem Weg zum Weltdebüt'],
  'días': ['DAYS', 'JOURS', 'TAGE'],
  'horas': ['HOURS', 'HEURES', 'STUNDEN'],
  'minutos': ['MINUTES', 'MINUTES', 'MINUTEN'],
  'segundos': ['SECONDS', 'SECONDES', 'SEKUNDEN'],
  'membresía fundacional exclusiva': ['Exclusive Founding Membership', 'Adhésion Fondatrice Exclusive', 'Exklusive Gründungsmitgliedschaft'],
  'precompra · acceso a una de las 100 plazas': ['Pre-Order · Access to one of 100 spots', 'Préachat · Accès à l’une des 100 places', 'Vorabkauf · Zugang zu einem von 100 Plätzen'],
  'la confirmación de tu número oficial entre 001 y 100 queda vinculada de forma única e inmutable a tu cuenta tras la confirmación real del pago.': [
    'Confirmation of your official number between 001 and 100 is uniquely and immutably linked to your account upon real payment verification.',
    'La confirmation de votre numéro officiel entre 001 et 100 est liée de façon unique et immuable à votre compte après confirmation réelle du paiement.',
    'Die Bestätigung deiner offiziellen Nummer zwischen 001 und 100 wird nach echter Zahlungsbestätigung eindeutig und unveränderlich mit deinem Konto verknüpft.'
  ],
  'autorizo mostrar mi nombre profesional y fotografía en la galería pública y mapa de posiciones de modelos fundadoras.': [
    'I authorize displaying my professional name and photo in the public Founding Models gallery and positions map.',
    'J’autorise l’affichage de mon nom professionnel et de ma photo dans la galerie publique et la carte des positions des Mannequins Fondatrices.',
    'Ich erlaube die Anzeige meines Berufsnamens und Fotos in der öffentlichen Galerie und Positionskarte der Gründungsmodels.'
  ],
  'el programa los primeros 100 ha alcanzado su cierre oficial.': [
    'The First 100 program has officially closed.',
    'Le programme Les 100 Premiers a atteint sa clôture officielle.',
    'Das Programm Die Ersten 100 wurde offiziell geschlossen.'
  ],
  'ir a mi área de fundadores': ['Go to My Founders Area', 'Aller à Mon Espace Fondateurs', 'Zu Meinem Gründer-Bereich'],
  'estado: reservada (pendiente de pago)': ['STATUS: RESERVED (PENDING PAYMENT)', 'STATUT : RÉSERVÉE (EN ATTENTE DE PAIEMENT)', 'STATUS: RESERVIERT (ZAHLUNG AUSSTEHEND)'],
  'tu plaza está retenida temporalmente hasta el': ['Your spot is temporarily held until', 'Votre place est temporairement retenue jusqu’au', 'Dein Platz ist vorübergehend reserviert bis'],
  'completa el pago en stripe checkout para confirmar tu posición.': [
    'Complete payment in Stripe Checkout to confirm your position.',
    'Complétez le paiement sur Stripe Checkout pour confirmer votre position.',
    'Schließe die Zahlung in Stripe Checkout ab, um deine Position zu bestätigen.'
  ],
  'a la espera de verificación real del proveedor de pagos (pasarela stripe no configurada en este entorno; nunca se emite confirmación simulada).': [
    'Awaiting real payment provider verification (Stripe gateway not configured in this environment; simulated confirmations are never issued).',
    'En attente de vérification réelle du prestataire de paiement (passerelle Stripe non configurée ; aucune confirmation simulée n’est émise).',
    'Warten auf echte Zahlungsbestätigung (Stripe-Gateway hier nicht konfiguriert; simulierte Bestätigungen werden nie ausgestellt).'
  ],
  'conectando...': ['Connecting...', 'Connexion...', 'Verbinde...'],
  'reanudar pago': ['Resume Payment', 'Reprendre le paiement', 'Zahlung fortsetzen'],
  'liberando...': ['Releasing...', 'Libération...', 'Gebe frei...'],
  'liberar reserva': ['Release Hold', 'Libérer la réservation', 'Reservierung freigeben'],
  'procesando reserva...': ['Processing Reservation...', 'Traitement de la réservation...', 'Reservierung wird verarbeitet...'],
  'reservar tu posición de fundador': ['Reserve Your Founders Position', 'Réserver Votre Position de Fondateur', 'Gründer-Position reservieren'],
  '¿ya tienes cuenta?': ['Already have an account?', 'Vous avez déjà un compte ?', 'Hast du bereits ein Konto?'],
  'inicia sesión aquí': ['Sign in here', 'Connectez-vous ici', 'Hier anmelden'],
  'prestaciones del programa': ['Program Benefits', 'Avantages du Programme', 'Programm-Leistungen'],
  '12 beneficios exclusivos': ['12 Exclusive Benefits', '12 Avantages Exclusifs', '12 Exklusive Vorteile'],
  'número de fundador asignado del 001 al 100.': ['Assigned founder number from 001 to 100.', 'Numéro de fondateur attribué de 001 à 100.', 'Zugewiesene Gründernummer von 001 bis 100.'],
  'perfil profesional destacado.': ['Featured professional profile.', 'Profil professionnel mis en avant.', 'Hervorgehobenes Berufsprofil.'],
  'acceso anticipado a determinadas herramientas de la plataforma.': ['Early access to selected platform tools.', 'Accès anticipé à certains outils de la plateforme.', 'Vorabzugang zu ausgewählten Plattform-Tools.'],
  'preparación del perfil para el lanzamiento internacional.': ['Profile preparation for the international launch.', 'Préparation du profil pour le lancement international.', 'Profilvorbereitung für den internationalen Launch.'],
  'acceso a las actividades de lanzamiento para los miembros fundadores.': ['Access to launch activities for founding members.', 'Accès aux activités de lancement pour les membres fondateurs.', 'Zugang zu Launch-Aktivitäten für Gründungsmitglieder.'],
  'identificación especial como modelo fundadora.': ['Special identification as a Founding Model.', 'Identification spéciale en tant que Mannequin Fondatrice.', 'Besondere Kennzeichnung als Gründungsmodel.'],
  'insignia permanente de miembro fundador.': ['Permanent founding member badge.', 'Badge permanent de membre fondateur.', 'Dauerhaftes Gründungsmitglieds-Abzeichen.'],
  'acceso anticipado a determinadas funcionalidades.': ['Early access to selected features.', 'Accès anticipé à certaines fonctionnalités.', 'Vorabzugang zu ausgewählten Funktionen.'],
  'ventajas especiales en casting live.': ['Special advantages in Casting Live.', 'Avantages spéciaux sur Casting Live.', 'Besondere Vorteile bei Casting Live.'],
  'acceso vip a eventos internacionales seleccionados.': ['VIP access to selected international events.', 'Accès VIP à des événements internationaux sélectionnés.', 'VIP-Zugang zu ausgewählten internationalen Events.'],
  'créditos promocionales o beneficios de uso, conforme a las condiciones del programa.': [
    'Promotional credits or usage benefits subject to program terms.',
    'Crédits promotionnels ou avantages d’utilisation selon les conditions du programme.',
    'Aktionsguthaben oder Nutzungsvorteile gemäß den Programmbedingungen.'
  ],
  'reconocimiento dentro de la comunidad internacional de fashion finances.': [
    'Recognition within the international Fashion Finances community.',
    'Reconnaissance au sein de la communauté internationale Fashion Finances.',
    'Anerkennung in der internationalen Fashion-Finances-Community.'
  ],
  'insignia permanente vinculada a cuenta': ['Permanent account-linked badge', 'Badge permanent lié au compte', 'Dauerhaft kontoverknüpftes Abzeichen'],
  'modelo fundadora · 001–100': ['FOUNDING MODEL · 001–100', 'MANNEQUIN FONDATRICE · 001–100', 'GRÜNDUNGSMODEL · 001–100'],
  'modelo fundador': ['FOUNDING MODEL', 'MANNEQUIN FONDATEUR', 'GRÜNDUNGSMODEL'],
  'posición oficial': ['Official Position', 'Position Officielle', 'Offizielle Position'],
  'registro oficial de posiciones': ['Official Position Registry', 'Registre Officiel des Positions', 'Offizielles Positionsregister'],
  'solo 100 posiciones de fundadores': ['Only 100 Founding Positions', 'Seulement 100 Positions Fondateurs', 'Nur 100 Gründer-Positionen'],
  'cada plaza del 001 al 100 solo pasa a estado confirmado tras verificación real del pago. las plazas en estado reservada mantienen una retención temporal sin contar como vendidas.': [
    'Each spot from 001 to 100 only becomes confirmed after real payment verification. Spots in RESERVED status hold temporarily without counting as sold.',
    'Chaque place de 001 à 100 n’est confirmée qu’après vérification réelle du paiement. Les places RÉSERVÉES restent en attente temporaire sans être comptées comme vendues.',
    'Jeder Platz von 001 bis 100 wird erst nach echter Zahlungsprüfung bestätigt. RESERVIERTE Plätze gelten vorübergehend gehalten und nicht als verkauft.'
  ],
  'modelos fundadoras confirmadas': ['Confirmed Founding Models', 'Mannequins Fondatrices Confirmées', 'Bestätigte Gründungsmodels'],
  'modelos fundadoras:': ['FOUNDING MODELS:', 'MANNEQUINS FONDATRICES :', 'GRÜNDUNGSMODELS:'],
  'disponible': ['AVAILABLE', 'DISPONIBLE', 'VERFÜGBAR'],
  'reservada': ['RESERVED', 'RÉSERVÉE', 'RESERVIERT'],
  'confirmada': ['CONFIRMED', 'CONFIRMÉE', 'BESTÄTIGT'],
  'fundadora': ['FOUNDER', 'FONDATRICE', 'GRÜNDERIN'],
  'reservada (pendiente de pago)': ['RESERVED (Pending Payment)', 'RÉSERVÉE (En attente de paiement)', 'RESERVIERT (Zahlung ausstehend)'],
  'sincronizando posiciones oficiales...': ['Synchronizing official positions...', 'Synchronisation des positions officielles...', 'Offizielle Positionen werden synchronisiert...'],
  'galería de miembros fundadores': ['Founding Members Gallery', 'Galerie des Membres Fondateurs', 'Galerie der Gründungsmitglieder'],
  'programa de preparación internacional': ['International Preparation Program', 'Programme de Préparation Internationale', 'Internationales Vorbereitungsprogramm'],
  'tu camino comienza aquí — 90 días': ['Your Journey Starts Here — 90 Days', 'Votre Parcours Commence Ici — 90 Jours', 'Deine Reise Beginnt Hier — 90 Tage'],
  'apertura:': ['Opening:', 'Ouverture :', 'Eröffnung:'],
  'lanzamiento internacional:': ['International Launch:', 'Lancement international :', 'Internationaler Launch:'],
  'días de preparación': ['Days of Preparation', 'Jours de Préparation', 'Vorbereitungstage'],
  '100 fundadores': ['100 Founders', '100 Fondateurs', '100 Gründer'],
  'miembros fundadores': ['Founding Members', 'Membres Fondateurs', 'Gründungsmitglieder'],
  'posiciones exclusivas': ['Exclusive Positions', 'Positions Exclusives', 'Exklusive Positionen'],
  'preparación para la pasarela global': ['Global Runway Preparation', 'Préparation au Podium Mondial', 'Globale Laufsteg-Vorbereitung'],
  'fase 01 — construye tu perfil (días 1–30)': ['Stage 01 — Build Your Profile (Days 1–30)', 'Étape 01 — Construisez Votre Profil (Jours 1–30)', 'Phase 01 — Profil aufbauen (Tage 1–30)'],
  'fase 02 — construye tu presencia (días 31–60)': ['Stage 02 — Build Your Presence (Days 31–60)', 'Étape 02 — Construisez Votre Présence (Jours 31–60)', 'Phase 02 — Präsenz aufbauen (Tage 31–60)'],
  'fase 03 — prepárate para el lanzamiento (días 61–90)': ['Stage 03 — Get Ready for Launch (Days 61–90)', 'Étape 03 — Préparez-vous au Lancement (Jours 61–90)', 'Phase 03 — Bereit für den Launch (Tage 61–90)'],
  'estructuración de portafolio internacional, biografía editorial, verificación de identidad y vinculación de canales oficiales.': [
    'International portfolio structuring, editorial bio, identity verification, and linking of official channels.',
    'Structuration du portfolio international, biographie éditoriale, vérification d’identité et liaison des canaux officiels.',
    'Aufbau des internationalen Portfolios, redaktionelle Biografie, Identitätsprüfung und Verknüpfung offizieller Kanäle.'
  ],
  'publicación de material audiovisual para casting live, activación de presencia destacada y preparación de proyectos.': [
    'Publishing audiovisual material for Casting Live, activating featured presence, and preparing projects.',
    'Publication de contenu audiovisuel pour Casting Live, activation de la mise en avant et préparation de projets.',
    'Veröffentlichung von Videomaterial für Casting Live, Aktivierung der Hervorhebung und Projektvorbereitung.'
  ],
  'acceso anticipado a herramientas del lanzamiento, validación vip para actividades de fundadores y debut internacional.': [
    'Early access to launch tools, VIP validation for founder activities, and international debut.',
    'Accès anticipé aux outils de lancement, validation VIP pour les activités des fondateurs et début international.',
    'Vorabzugang zu Launch-Tools, VIP-Freischaltung für Gründer-Aktivitäten und internationales Debüt.'
  ],
  'área privada de preparación': ['Private Preparation Area', 'Espace Privé de Préparation', 'Privater Vorbereitungsbereich'],
  'accede a tu área privada de preparación internacional': ['Access your private international preparation area', 'Accédez à votre espace privé de préparation internationale', 'Greife auf deinen privaten Vorbereitungsbereich zu'],
  'inicia sesión o registra tu cuenta en fashion finances para consultar el porcentaje real de preparación de tu perfil y tu plaza oficial.': [
    'Sign in or register your Fashion Finances account to check your real profile readiness percentage and official position.',
    'Connectez-vous ou créez votre compte Fashion Finances pour consulter le pourcentage réel de préparation de votre profil et votre place officielle.',
    'Melde dich an oder registriere dein Fashion-Finances-Konto, um deinen Profilfortschritt und deinen offiziellen Platz einzusehen.'
  ],
  'crear cuenta': ['Create Account', 'Créer un compte', 'Konto erstellen'],
  'sin plaza asignada aún · puedes completar tareas previas desde aquí': [
    'No position assigned yet · You can complete preparation tasks here',
    'Aucune place attribuée pour l’instant · Vous pouvez compléter les tâches préparatoires ici',
    'Noch kein Platz zugewiesen · Vorbereitungsaufgaben können hier erledigt werden'
  ],
  'nº fundador': ['Founder No.', 'N° Fondateur', 'Gründer-Nr.'],
  'incorporación': ['Joined', 'Adhésion', 'Beitritt'],
  'días restantes': ['Days Remaining', 'Jours Restants', 'Verbleibende Tage'],
  'fotografía principal editorial cargada en el perfil': ['Main editorial photo uploaded to profile', 'Photo éditoriale principale ajoutée au profil', 'Editorial-Hauptfoto im Profil hochgeladen'],
  'biografía profesional y presentación internacional (mín. 20 caracteres)': ['Professional bio and international introduction (min. 20 chars)', 'Biographie professionnelle et présentation internationale (min. 20 car.)', 'Berufliche Biografie & internationale Vorstellung (min. 20 Zeichen)'],
  'redes sociales oficiales vinculadas (instagram, tiktok o x)': ['Official social accounts linked (Instagram, TikTok, or X)', 'Réseaux sociaux officiels liés (Instagram, TikTok ou X)', 'Offizielle Social-Media-Konten verknüpft (Instagram, TikTok oder X)'],
  'ciudad base o agencia de representación registrada': ['Home city or modeling agency registered', 'Ville de base ou agence de représentation enregistrée', 'Basisstadt oder Modelagentur eingetragen'],
  'galería fotográfica editorial activa en perfil': ['Active editorial photo gallery on profile', 'Galerie photo éditoriale active sur le profil', 'Aktive Editorial-Fotogalerie im Profil'],
  'reel o vídeo de pasarela publicado para casting live': ['Runway reel or video published for Casting Live', 'Reel ou vidéo de défilé publié pour Casting Live', 'Laufsteg-Reel oder Video für Casting Live veröffentlicht'],
  'proyecto de moda o publicación oficial activa en el muro': ['Fashion project or official post active on wall', 'Projet de mode ou publication officielle actif sur le mur', 'Modeprojekt oder offizieller Beitrag an der Pinnwand aktiv'],
  'identidad de perfil verificada en fashion finances': ['Profile identity verified on Fashion Finances', 'Identité du profil vérifiée sur Fashion Finances', 'Profilidentität auf Fashion Finances verifiziert'],
  'completar biografía': ['Complete bio', 'Compléter la bio', 'Biografie ausfüllen'],
  'vincular redes': ['Link socials', 'Lier les réseaux', 'Netzwerke verknüpfen'],
  'actualizar ubicación': ['Update location', 'Mettre à jour le lieu', 'Standort aktualisieren'],
  'subir fotografías': ['Upload photos', 'Importer des photos', 'Fotos hochladen'],
  'ir a casting live': ['Go to Casting Live', 'Aller sur Casting Live', 'Zu Casting Live'],
  'crear proyecto': ['Create project', 'Créer un projet', 'Projekt erstellen'],
  'verificar perfil': ['Verify profile', 'Vérifier le profil', 'Profil verifizieren'],
  'editar mi perfil': ['Edit My Profile', 'Modifier mon profil', 'Mein Profil bearbeiten'],
  'ver ranking oficial': ['View Official Ranking', 'Voir le classement officiel', 'Offizielles Ranking ansehen'],
  'administración del programa': ['Program Administration', 'Administration du Programme', 'Programm-Verwaltung'],
  'gestión ejecutiva — los primeros 100': ['Executive Management — The First 100', 'Gestion Exécutive — Les 100 Premiers', 'Executive-Verwaltung — Die Ersten 100'],
  'actualizar datos': ['Refresh Data', 'Actualiser les données', 'Daten aktualisieren'],
  'confirmadas': ['Confirmed', 'Confirmées', 'Bestätigt'],
  'en espera (reservada)': ['On Hold (Reserved)', 'En attente (Réservée)', 'Zurückgestellt (Reserviert)'],
  'ingresos confirmados': ['Confirmed Revenue', 'Revenus Confirmés', 'Bestätigte Einnahmen'],
  'conversión reservas': ['Reservation Conversion', 'Conversion Réservations', 'Reservierungs-Konversion'],
  'configuración de apertura, lanzamiento y cierre': ['Opening, Launch & Closure Settings', 'Configuration Ouverture, Lancement et Clôture', 'Start-, Launch- und Abschluss-Einstellungen'],
  'fecha de apertura': ['Opening Date', "Date d'ouverture", 'Startdatum'],
  'fecha de lanzamiento internacional': ['International Launch Date', 'Date de lancement international', 'Internationales Launch-Datum'],
  'estado del programa': ['Program Status', 'Statut du programme', 'Programmstatus'],
  'cerrar programa manualmente': ['Close program manually', 'Clôturer le programme manuellement', 'Programm manuell schließen'],
  'motivo de cierre opcional (si se cierra manualmente)...': ['Optional closure reason (if closed manually)...', 'Motif de clôture facultatif (si clôturé manuellement)...', 'Optionaler Schließungsgrund (bei manueller Schließung)...'],
  'guardar configuración': ['Save Settings', 'Enregistrer la configuration', 'Einstellungen speichern'],
  'guardando...': ['Saving...', 'Enregistrement...', 'Speichern...'],
  'posiciones ocupadas o en reserva': ['Occupied or Reserved Positions', 'Positions Occupées ou Réservées', 'Belegte oder reservierte Positionen'],
  'plaza': ['Spot', 'Place', 'Platz'],
  'progreso': ['Progress', 'Progression', 'Fortschritt'],
  'acciones': ['Actions', 'Actions', 'Aktionen'],
  'activar insignia': ['Activate badge', 'Activer le badge', 'Abzeichen aktivieren'],
  'suspender insignia': ['Suspend badge', 'Suspendre le badge', 'Abzeichen aussetzen'],
  'devolver & liberar': ['Refund & Release', 'Rembourser et libérer', 'Erstatten & freigeben'],
  'cancelar & liberar': ['Cancel & Release', 'Annuler et libérer', 'Stornieren & freigeben'],
  'aún no hay reservas ni compras confirmadas.': ['No reservations or confirmed purchases yet.', 'Aucune réservation ni achat confirmé pour le moment.', 'Noch keine Reservierungen oder bestätigten Käufe.'],
  'incidencias de pago y registro': ['Payment & Registration Incidents', 'Incidents de Paiement et Inscription', 'Zahlungs- und Registrierungsvorfälle'],
  'sin incidencias registradas.': ['No incidents recorded.', 'Aucun incident enregistré.', 'Keine Vorfälle verzeichnet.'],
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
  {
    regex: /^Todas \((\d+)\)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `All (${m[1]})`;
      if (lang === 'fr') return `Toutes (${m[1]})`;
      return `Alle (${m[1]})`;
    },
  },
  {
    regex: /^Disponibles \((\d+)\)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Available (${m[1]})`;
      if (lang === 'fr') return `Disponibles (${m[1]})`;
      return `Verfügbar (${m[1]})`;
    },
  },
  {
    regex: /^Reservadas \((\d+)\)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Reserved (${m[1]})`;
      if (lang === 'fr') return `Réservées (${m[1]})`;
      return `Reserviert (${m[1]})`;
    },
  },
  {
    regex: /^Confirmadas \((\d+)\)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Confirmed (${m[1]})`;
      if (lang === 'fr') return `Confirmées (${m[1]})`;
      return `Bestätigt (${m[1]})`;
    },
  },
  {
    regex: /^(\d+)\s+perfiles públicos$/i,
    translate: (m, lang) => {
      const n = Number(m[1]);
      if (lang === 'en') return `${n} public ${n === 1 ? 'profile' : 'profiles'}`;
      if (lang === 'fr') return `${n} ${n === 1 ? 'profil public' : 'profils publics'}`;
      return `${n} ${n === 1 ? 'öffentliches Profil' : 'öffentliche Profile'}`;
    },
  },
  {
    regex: /^ETAPA ACTUAL:\s*FASE\s*(\d+)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `CURRENT STAGE: STAGE ${m[1]}`;
      if (lang === 'fr') return `ÉTAPE ACTUELLE : PHASE ${m[1]}`;
      return `AKTUELLE PHASE: PHASE ${m[1]}`;
    },
  },
  {
    regex: /^(\d+)\s+DÍAS RESTANTES$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `${m[1]} DAYS REMAINING`;
      if (lang === 'fr') return `${m[1]} JOURS RESTANTS`;
      return `${m[1]} TAGE VERBLEIBEND`;
    },
  },
  {
    regex: /^COMPLETADO DEL PERFIL:\s*(\d+)%$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `PROFILE COMPLETION: ${m[1]}%`;
      if (lang === 'fr') return `PROGRESSION DU PROFIL : ${m[1]} %`;
      return `PROFILFORTSCHRITT: ${m[1]} %`;
    },
  },
  {
    regex: /^(\d+)\s+DE\s+(\d+)\s+TAREAS COMPLETADAS$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `${m[1]} OF ${m[2]} TASKS COMPLETED`;
      if (lang === 'fr') return `${m[1]} SUR ${m[2]} TÂCHES TERMINÉES`;
      return `${m[1]} VON ${m[2]} AUFGABEN ERLEDIGT`;
    },
  },
  {
    regex: /^Número oficial no editable asignado:\s*#(\d+)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Official non-editable number assigned: #${m[1]}`;
      if (lang === 'fr') return `Numéro officiel non modifiable attribué : #${m[1]}`;
      return `Offizielle unveränderliche Nummer zugewiesen: #${m[1]}`;
    },
  },
  {
    regex: /^RESERVA #(\d+) PENDIENTE DE CONFIRMACIÓN DE PAGO$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `HOLD #${m[1]} PENDING PAYMENT CONFIRMATION`;
      if (lang === 'fr') return `RÉSERVATION #${m[1]} EN ATTENTE DE CONFIRMATION DE PAIEMENT`;
      return `RESERVIERUNG #${m[1]} WARTET AUF ZAHLUNGSBESTÄTIGUNG`;
    },
  },
  {
    regex: /^Posición #(.+?) en estado RESERVADA$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Position #${m[1]} in RESERVED status`;
      if (lang === 'fr') return `Position #${m[1]} au statut RÉSERVÉE`;
      return `Position #${m[1]} im Status RESERVIERT`;
    },
  },
  {
    regex: /^Reserva #(.+?) liberada$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Reservation #${m[1]} released`;
      if (lang === 'fr') return `Réservation #${m[1]} libérée`;
      return `Reservierung #${m[1]} freigegeben`;
    },
  },
  {
    regex: /^Posición #(.+?) liberada$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Position #${m[1]} released`;
      if (lang === 'fr') return `Position #${m[1]} libérée`;
      return `Position #${m[1]} freigegeben`;
    },
  },
  {
    regex: /^Miembro Fundador Oficial #(\d+) · Los Primeros 100$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `Official Founding Member #${m[1]} · The First 100`;
      if (lang === 'fr') return `Membre Fondateur Officiel #${m[1]} · Les 100 Premiers`;
      return `Offizielles Gründungsmitglied #${m[1]} · Die Ersten 100`;
    },
  },
  {
    regex: /^FASHION FINANCES · MODELO FUNDADOR · LOS PRIMEROS 100 \(#(\d+)\)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `FASHION FINANCES · FOUNDING MODEL · THE FIRST 100 (#${m[1]})`;
      if (lang === 'fr') return `FASHION FINANCES · MANNEQUIN FONDATEUR · LES 100 PREMIERS (#${m[1]})`;
      return `FASHION FINANCES · GRÜNDUNGSMODEL · DIE ERSTEN 100 (#${m[1]})`;
    },
  },
  {
    regex: /^#(\d+)\s*·\s*Disponible$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `#${m[1]} · Available`;
      if (lang === 'fr') return `#${m[1]} · Disponible`;
      return `#${m[1]} · Verfügbar`;
    },
  },
  {
    regex: /^#(\d+)\s*·\s*Reservada temporalmente \(pendiente de pago\)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `#${m[1]} · Temporarily reserved (pending payment)`;
      if (lang === 'fr') return `#${m[1]} · Réservée temporairement (en attente de paiement)`;
      return `#${m[1]} · Vorübergehend reserviert (Zahlung ausstehend)`;
    },
  },
  {
    regex: /^#(\d+)\s*·\s*Modelo Fundadora Confirmada \(Privada\)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `#${m[1]} · Confirmed Founding Model (Private)`;
      if (lang === 'fr') return `#${m[1]} · Mannequin Fondatrice Confirmée (Privée)`;
      return `#${m[1]} · Bestätigtes Gründungsmodel (Privat)`;
    },
  },
  {
    regex: /^#(\d+)\s*·\s*(.+?)\s*\(Confirmada\)$/i,
    translate: (m, lang) => {
      if (lang === 'en') return `#${m[1]} · ${m[2]} (Confirmed)`;
      if (lang === 'fr') return `#${m[1]} · ${m[2]} (Confirmée)`;
      return `#${m[1]} · ${m[2]} (Bestätigt)`;
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
