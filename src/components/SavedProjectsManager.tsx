/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ProjectData, 
  InvestmentSession, 
  UserSessionProfile, 
  FinancialMovement,
  ParticipantState
} from '../types';
import { 
  Folder, 
  Award, 
  DollarSign, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Check, 
  Calendar, 
  Sparkles,
  Layers,
  Lock,
  History,
  Coins,
  ArrowUpRight,
  TrendingDown,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  UserCheck,
  Clock,
  Trash2,
  UploadCloud,
  Camera,
  Mail,
  Phone,
  Plus,
  FileText,
  Eye,
  Trophy,
  X
} from 'lucide-react';

interface SavedProjectsProps {
  userProjects: ProjectData[];
  historyWonLog: { id: string; title: string; prize: number; date: string; projectId?: string; projectName?: string }[];
  sessions: InvestmentSession[];
  userProfile: UserSessionProfile | null;
  onUpdateSessions: (nextSessions: InvestmentSession[]) => void;
  onUpdateProfile: (nextProfile: UserSessionProfile) => void;
  onAddMovement: (newMov: FinancialMovement) => void;
  onNavigateToTab: (tab: 'home' | 'finance' | 'sessions' | 'create_project' | 'chat' | 'profile' | 'patrocinados' | 'saved_projects' | 'casting_live') => void;
  onUpdateProjects?: (nextProjects: ProjectData[]) => void;
}

export default function SavedProjectsManager({
  userProjects,
  historyWonLog,
  sessions,
  userProfile,
  onUpdateSessions,
  onUpdateProfile,
  onAddMovement,
  onNavigateToTab,
  onUpdateProjects,
}: SavedProjectsProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    userProjects.length > 0 ? userProjects[0].id : ''
  );
  const [hoveredMedia, setHoveredMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(
    userProjects.length > 0 ? [userProjects[0].id] : []
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');

  // Controls for Historial de Rondas de Inversión Ganadas
  const [historyViewMode, setHistoryViewMode] = useState<'by_project' | 'table'>('by_project');
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');
  const [historySelectedProjectFilter, setHistorySelectedProjectFilter] = useState<string>('all');
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  const toggleProjectAccordion = (projectId: string) => {
    setExpandedProjects(prev => {
      const current = prev[projectId] ?? true;
      return { ...prev, [projectId]: !current };
    });
  };

  const expandAllProjects = (allIds: string[]) => {
    const next: Record<string, boolean> = {};
    allIds.forEach(id => { next[id] = true; });
    setExpandedProjects(next);
  };

  const collapseAllProjects = (allIds: string[]) => {
    const next: Record<string, boolean> = {};
    allIds.forEach(id => { next[id] = false; });
    setExpandedProjects(next);
  };
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now');
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [queuedInvestments, setQueuedInvestments] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('fashion_finances_investment_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastNotification, setToastNotification] = useState<{ message: string } | null>(null);

  // Scoped alert override to use custom in-app Toast notifications
  const alert = (message: string) => {
    setToastNotification({ message });
  };

  React.useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // Save changes to localStorage
  React.useEffect(() => {
    localStorage.setItem('fashion_finances_investment_queue', JSON.stringify(queuedInvestments));
  }, [queuedInvestments]);

  // Calculate stats
  const totalPrizeWon = historyWonLog.reduce((acc, log) => acc + log.prize, 0);
  const activeFillingSessions = sessions.filter(s => s.status === 'filling' && ['sess-workers', 'sess-entrepreneurs', 'sess-businessmen', 'sess-topmodels', 'sess-investors', 'sess-millionaires'].includes(s.id));

  // helper to check if project has entered any session or completed
  const getProjectFundingWon = (projectId: string, projectTitle: string) => {
    return historyWonLog
      .filter(log => log.projectId === projectId || log.projectName === projectTitle)
      .reduce((sum, log) => sum + log.prize, 0);
  };

  const hasEnteredAnySession = (projectId: string) => {
    const proj = userProjects.find(p => p.id === projectId);
    const inOngoing = sessions.some(s => s.participants.some(p => p.projectId === projectId));
    const inHistory = historyWonLog.some(log => log.projectId === projectId || (proj && log.projectName === proj.title));
    return inOngoing || inHistory;
  };

  // Find active session projects
  const activeSessionProjectsList = sessions
    .filter(s => s.status === 'filling' || s.status === 'voting')
    .flatMap(s => 
      s.participants
        .filter(p => userProfile && p.userId === userProfile.id)
        .map(p => {
          const proj = userProjects.find(pr => pr.id === p.projectId);
          return {
            project: proj || { title: 'Propuesta de Moda', id: p.projectId, category: 'Moda' },
            sessionTitle: s.title,
            sessionFee: s.entryFee,
            status: s.status,
            poolTotal: s.poolTotal,
            participantCount: s.participants.length
          };
        })
    );

  // Group won history by project to determine:
  // 1. Cuántas veces ha ganado un proyecto
  // 2. En cuántas sesiones y en cuáles
  // 3. Cuánto es el total que ha ganado ese proyecto hasta la fecha
  const projectWinningsSummary = React.useMemo(() => {
    const summaryMap: Record<string, {
      projectId: string;
      projectTitle: string;
      projectCategory?: string;
      winCount: number;
      sessionsList: { id: string; title: string; date: string; prize: number }[];
      totalPrize: number;
    }> = {};

    userProjects.forEach(proj => {
      summaryMap[proj.id] = {
        projectId: proj.id,
        projectTitle: proj.title,
        projectCategory: proj.category,
        winCount: 0,
        sessionsList: [],
        totalPrize: 0,
      };
    });

    historyWonLog.forEach((log) => {
      let targetId = log.projectId;
      if (!targetId && log.projectName) {
        const matched = userProjects.find(p => p.title.trim().toLowerCase() === log.projectName?.trim().toLowerCase());
        if (matched) targetId = matched.id;
      }
      if (!targetId && userProjects.length > 0) {
        targetId = userProjects[0].id;
      }
      const finalId = targetId || 'proj-won-general';

      if (!summaryMap[finalId]) {
        summaryMap[finalId] = {
          projectId: finalId,
          projectTitle: log.projectName || userProjects[0]?.title || 'Eco-Fashion Runway',
          projectCategory: userProjects[0]?.category || 'Moda',
          winCount: 0,
          sessionsList: [],
          totalPrize: 0,
        };
      }

      summaryMap[finalId].winCount += 1;
      summaryMap[finalId].totalPrize += log.prize;
      summaryMap[finalId].sessionsList.push({
        id: log.id,
        title: log.title,
        date: log.date,
        prize: log.prize,
      });
    });

    return Object.values(summaryMap).filter(p => p.winCount > 0);
  }, [historyWonLog, userProjects]);

  // Filter project summaries according to project filter dropdown and search input
  const filteredProjectSummaries = React.useMemo(() => {
    return projectWinningsSummary.filter(pSummary => {
      if (historySelectedProjectFilter !== 'all' && pSummary.projectId !== historySelectedProjectFilter) {
        return false;
      }
      if (historySearchQuery.trim()) {
        const query = historySearchQuery.toLowerCase();
        const matchesTitle = pSummary.projectTitle.toLowerCase().includes(query);
        const matchesCat = (pSummary.projectCategory || '').toLowerCase().includes(query);
        const matchesSession = pSummary.sessionsList.some(s => s.title.toLowerCase().includes(query));
        return matchesTitle || matchesCat || matchesSession;
      }
      return true;
    });
  }, [projectWinningsSummary, historySelectedProjectFilter, historySearchQuery]);

  // Filter raw history log for the chronological table view
  const filteredHistoryWonLog = React.useMemo(() => {
    return historyWonLog.filter(log => {
      const proj = projectWinningsSummary.find(p => p.projectId === log.projectId || p.projectTitle === log.projectName) || projectWinningsSummary[0];
      if (historySelectedProjectFilter !== 'all' && proj?.projectId !== historySelectedProjectFilter) {
        return false;
      }
      if (historySearchQuery.trim()) {
        const query = historySearchQuery.toLowerCase();
        const matchesTitle = log.title.toLowerCase().includes(query);
        const matchesProj = (log.projectName || proj?.projectTitle || '').toLowerCase().includes(query);
        return matchesTitle || matchesProj;
      }
      return true;
    });
  }, [historyWonLog, projectWinningsSummary, historySelectedProjectFilter, historySearchQuery]);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescShort, setEditDescShort] = useState('');
  const [editDescLong, setEditDescLong] = useState('');
  const [editBudget, setEditBudget] = useState(100);
  const [editFundingGoal, setEditFundingGoal] = useState(5000);
  const [editObjective, setEditObjective] = useState('');
  const [editFundUsage, setEditFundUsage] = useState('');
  const [editContactEmail, setEditContactEmail] = useState('');
  const [editContactPhone, setEditContactPhone] = useState('');
  
  // New edit states to fully match Registrar mi proyecto
  const [editTimeline, setEditTimeline] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editVideos, setEditVideos] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  
  // Interactive expense breakdown states
  const [editBudgetItems, setEditBudgetItems] = useState<{ id: string; item: string; amount: number }[]>([]);
  const [newBudgetItem, setNewBudgetItem] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');

  // Simulated documentation upload states
  const [editDocName, setEditDocName] = useState('');
  const [editDocUrl, setEditDocUrl] = useState('');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Team editing states
  const [editTeam, setEditTeam] = useState<any[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberExp, setNewMemberExp] = useState('');
  const [newMemberProfile, setNewMemberProfile] = useState('');
  const [newMemberBio, setNewMemberBio] = useState('');

  // Helpers for editing lists
  const addBudgetItem = () => {
    if (!newBudgetItem || !newBudgetAmount) return;
    const amountVal = Number(newBudgetAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    setEditBudgetItems([...editBudgetItems, {
      id: `bi-edit-${Date.now()}`,
      item: newBudgetItem.trim(),
      amount: amountVal
    }]);
    setNewBudgetItem('');
    setNewBudgetAmount('');
  };

  const removeBudgetItem = (itemId: string) => {
    setEditBudgetItems(editBudgetItems.filter(item => item.id !== itemId));
  };

  const triggerSimulatedDocUpload = (fileName: string) => {
    setIsUploadingDoc(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploadingDoc(false);
          setEditDocName(fileName || 'Documentacion-Adjunta.pdf');
          setEditDocUrl(`https://collectives.network/user-content/${fileName || 'Documentacion-Adjunta.pdf'}`);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const addTeamMember = () => {
    if (!newMemberName || !newMemberRole) return;
    setEditTeam([...editTeam, { 
      name: newMemberName, 
      role: newMemberRole, 
      experience: newMemberExp || 'Experiencia acreditada en el sector.',
      profileLink: newMemberProfile || undefined,
      bio: newMemberBio || undefined
    }]);
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberExp('');
    setNewMemberProfile('');
    setNewMemberBio('');
  };

  const removeTeamMember = (index: number) => {
    if (index === 0) return; // Founder protected
    setEditTeam(editTeam.filter((_, i) => i !== index));
  };

  const startEditing = () => {
    if (!activeProject) return;
    setEditTitle(activeProject.title);
    setEditCategory(activeProject.category || 'Inteligencia artificial y automatización');
    setEditDescShort(activeProject.descriptionShort || '');
    setEditDescLong(activeProject.descriptionLong || '');
    setEditBudget(activeProject.budget || 100);
    setEditFundingGoal(activeProject.fundingGoal || 5000);
    setEditObjective(activeProject.objective || '');
    setEditFundUsage(activeProject.fundUsage || '');
    setEditContactEmail(activeProject.contactEmail || '');
    setEditContactPhone(activeProject.contactPhone || '');
    
    setEditTimeline(activeProject.timeline || '');
    setEditImages(activeProject.images || []);
    setEditVideos(activeProject.videos || []);
    
    // Parse budget breakdown text back into structured items array
    let parsedItems: { id: string; item: string; amount: number }[] = [];
    if (activeProject.budgetBreakdown) {
      parsedItems = activeProject.budgetBreakdown.split('\n').filter(line => line.trim()).map((line, idx) => {
        const parts = line.split(':');
        const itemName = parts[0]?.trim() || '';
        const amountStr = parts[1]?.replace('€', '').trim() || '0';
        return {
          id: `bi-edit-${idx}-${Date.now()}`,
          item: itemName,
          amount: parseFloat(amountStr) || 0
        };
      });
    }
    setEditBudgetItems(parsedItems);
    setEditDocName(activeProject.documentationName || '');
    setEditDocUrl(activeProject.documentationUrl || '');
    setEditTeam(activeProject.team || []);
    
    setIsEditing(true);
  };

  const saveProjectEdit = () => {
    if (!activeProject || !onUpdateProjects) return;
    if (!editTitle.trim()) {
      alert('⚠️ El título del proyecto es obligatorio.');
      return;
    }
    if (editBudget <= 0) {
      alert('⚠️ El presupuesto de referencia debe ser mayor a 0€.');
      return;
    }

    const itemizedText = editBudgetItems.map(item => `${item.item}: ${item.amount}€`).join('\n');

    const updated = userProjects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          title: editTitle.trim(),
          category: editCategory,
          descriptionShort: editDescShort.trim(),
          descriptionLong: editDescLong.trim(),
          budget: Number(editBudget),
          fundingGoal: Number(editFundingGoal),
          objective: editObjective.trim(),
          fundUsage: editFundUsage.trim(),
          contactEmail: editContactEmail.trim(),
          contactPhone: editContactPhone.trim(),
          timeline: editTimeline.trim(),
          images: editImages,
          videos: editVideos,
          budgetBreakdown: itemizedText,
          documentationName: editDocName,
          documentationUrl: editDocUrl,
          team: editTeam
        };
      }
      return p;
    });

    onUpdateProjects(updated);
    setIsEditing(false);
    alert('🎉 ¡Proyecto actualizado correctamente con éxito!');
  };

  const handleDeleteProject = (projectId: string) => {
    const projToDelete = userProjects.find(p => p.id === projectId);
    if (!projToDelete) return;

    const hasEntered = hasEnteredAnySession(projectId);
    let confirmMsg = `¿Estás seguro de que deseas eliminar el proyecto "${projToDelete.title}"? Esta acción no se puede deshacer.`;
    if (hasEntered) {
      confirmMsg = `⚠️ ADVERTENCIA: El proyecto "${projToDelete.title}" ya ha participado o está participando en mesas de inversión. Si lo eliminas, se conservará en el historial de las mesas pero desaparecerá de tu portafolio personal. ¿Deseas continuar con la eliminación?`;
    }

    if (!window.confirm(confirmMsg)) {
      return;
    }

    if (!onUpdateProjects) {
      alert('Error: No se pudo actualizar el portafolio.');
      return;
    }

    const nextProjects = userProjects.filter(p => p.id !== projectId);
    onUpdateProjects(nextProjects);

    // Update selectedProjectId
    if (nextProjects.length > 0) {
      const currentIndex = userProjects.findIndex(p => p.id === projectId);
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      setSelectedProjectId(nextProjects[nextIndex].id);
    } else {
      setSelectedProjectId('');
    }

    alert(`🗑️ El proyecto "${projToDelete.title}" ha sido eliminado correctamente.`);
  };

  // Slider navigation logic
  const activeSlideIndex = Math.max(0, userProjects.findIndex(p => p.id === selectedProjectId));
  const activeProject = userProjects[activeSlideIndex] || userProjects[0];

  const handlePrevProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (userProjects.length <= 1) return;
    const nextIdx = (activeSlideIndex - 1 + userProjects.length) % userProjects.length;
    setSelectedProjectId(userProjects[nextIdx].id);
  };

  const handleNextProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (userProjects.length <= 1) return;
    const nextIdx = (activeSlideIndex + 1) % userProjects.length;
    setSelectedProjectId(userProjects[nextIdx].id);
  };

  // Pre-select first filling session if available
  React.useEffect(() => {
    if (activeFillingSessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(activeFillingSessions[0].id);
    }
  }, [activeFillingSessions, selectedSessionId]);

  // Set default selected project if none is active but there is list
  React.useEffect(() => {
    if (userProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(userProjects[0].id);
    }
  }, [userProjects, selectedProjectId]);

  const executeInvestment = (projIds: string[], sessId: string): { success: boolean; error?: string } => {
    if (!userProfile) return { success: false, error: 'Perfil no iniciado.' };
    if (projIds.length === 0) return { success: false, error: 'Debes seleccionar al menos un proyecto.' };

    const sessObj = sessions.find(s => s.id === sessId);
    if (!sessObj) return { success: false, error: 'Mesa de inversión no encontrada.' };

    const totalCost = sessObj.entryFee * projIds.length;
    if (userProfile.balance < totalCost) {
      return {
        success: false,
        error: `Saldo insuficiente. El coste total es de ${totalCost}€ pero dispones de ${userProfile.balance.toFixed(2)}€.`
      };
    }

    // Verify all projects and check constraints
    const validProjects: ProjectData[] = [];
    for (const pid of projIds) {
      const proj = userProjects.find(p => p.id === pid);
      if (!proj) {
        return { success: false, error: `Proyecto con ID ${pid} no encontrado.` };
      }

      // Check if already fully funded
      const fundingWon = getProjectFundingWon(proj.id, proj.title);
      if (fundingWon >= proj.budget) {
        return { success: false, error: `El proyecto "${proj.title}" ya ha sido financiado al 100% (${fundingWon.toFixed(2)}€ / ${proj.budget}€).` };
      }

      // Check if already in this session
      const alreadyJoined = sessObj.participants.some(p => p.userId === userProfile.id && p.projectId === proj.id);
      if (alreadyJoined) {
        return { success: false, error: `El proyecto "${proj.title}" ya está participando activamente en la mesa "${sessObj.title}".` };
      }

      validProjects.push(proj);
    }

    // Now perform the investments sequentially
    let currentSessions = [...sessions];
    let spentTotal = 0;

    for (const proj of validProjects) {
      const currentSessObj = currentSessions.find(s => s.id === sessId);
      if (!currentSessObj) continue;

      const newParticipant: ParticipantState = {
        userId: userProfile.id,
        name: userProfile.name,
        avatar: userProfile.avatar,
        projectId: proj.id,
        votesReceived: 0,
        hasVoted: false
      };

      spentTotal += currentSessObj.entryFee;

      // Update sessions array
      let isNowFull = false;
      const updatedSessions = currentSessions.map((sess) => {
        if (sess.id === sessId) {
          const updatedParticipants = [...sess.participants, newParticipant];
          isNowFull = updatedParticipants.length >= 10;

          return {
            ...sess,
            participants: updatedParticipants,
            poolTotal: updatedParticipants.length * sess.entryFee,
            status: isNowFull ? 'voting' as const : sess.status,
            timeLeft: isNowFull ? 1200 : sess.timeLeft
          };
        }
        return sess;
      });

      if (isNowFull) {
        const uniqueNewId = `sess-auto-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const sessionCategory = currentSessObj.entryFee === 10
          ? 'Streetwear & Urban'
          : currentSessObj.entryFee === 100
            ? 'Casual & Lifestyle'
            : currentSessObj.entryFee === 1000
              ? 'Glamour'
              : currentSessObj.entryFee === 10000
                ? 'Ronda Elegant & Classic'
                : currentSessObj.entryFee === 100000 || currentSessObj.entryFee === 1000000
                  ? 'High Fashion'
                  : 'High Fashion';

        const newEmptySession: InvestmentSession = {
          id: uniqueNewId,
          title: currentSessObj.entryFee === 10
            ? `Round STREETWEAR & URBAN - R-${Math.floor(Date.now() % 1000)}`
            : currentSessObj.entryFee === 100
              ? `Round CASUAL & LIFESTYLE - R-${Math.floor(Date.now() % 1000)}`
              : currentSessObj.entryFee === 1000
                ? `Ronda Glamour ✨ - R-${Math.floor(Date.now() % 1000)}`
                : currentSessObj.entryFee === 10000
                  ? `Ronda Elegant & Classic 🤍 - R-${Math.floor(Date.now() % 1000)}`
                  : (currentSessObj.entryFee === 100000 || currentSessObj.entryFee === 1000000)
                    ? `Ronda High Fashion 👠 - R-${Math.floor(Date.now() % 1000)}`
                    : `Sesión de Inversión de ${sessionCategory} - R-${Math.floor(Date.now() % 1000)}`,
          entryFee: currentSessObj.entryFee,
          status: 'filling',
          timeLeft: 1200,
          createdAt: new Date().toISOString(),
          poolTotal: 0,
          participants: []
        };
        currentSessions = [...updatedSessions, newEmptySession];
      } else {
        currentSessions = updatedSessions;
      }

      // Add financial movement for each individual project
      onAddMovement({
        id: `mov-join-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        userId: userProfile.id,
        type: 'investment',
        amount: -currentSessObj.entryFee,
        date: new Date().toISOString(),
        description: `Inversión - Entrada multi-proyecto directa desde "Proyectos Guardados"`,
        projectName: proj.title
      });
    }

    // Update overall profile balance
    const nextBalance = userProfile.balance - spentTotal;
    onUpdateProfile({
      ...userProfile,
      balance: nextBalance,
      totalInvested: userProfile.totalInvested + spentTotal
    });

    onUpdateSessions(currentSessions);
    return { success: true };
  };

  // Click Handler for the CTA button (Investment Queue & Scheduler)
  const handleQueueOrJoin = () => {
    if (!userProfile) return;
    if (selectedProjectIds.length === 0) {
      alert('⚠️ Por favor, selecciona al menos uno de tus proyectos guardados.');
      return;
    }
    if (!selectedSessionId) {
      alert('⚠️ Por favor, selecciona una sesión de inversión activa.');
      return;
    }

    const targetSession = sessions.find(s => s.id === selectedSessionId);
    if (!targetSession) {
      alert('⚠️ La sesión elegida no es válida.');
      return;
    }

    if (scheduleType === 'now') {
      const res = executeInvestment(selectedProjectIds, selectedSessionId);
      if (res.success) {
        alert(`🎉 ¡Éxito! Se ha procesado tu inversión multitarea para ${selectedProjectIds.length} proyecto(s) en la mesa "${targetSession.title}".`);
        onNavigateToTab('sessions');
      } else {
        alert(`❌ Error al procesar inversión: ${res.error}`);
      }
    } else {
      // Schedule-based investment
      if (!scheduleDate) {
        alert('⚠️ Por favor, especifica la fecha y hora de la programación.');
        return;
      }

      const parsedDate = new Date(scheduleDate);
      if (parsedDate <= new Date()) {
        alert('⚠️ La fecha de programación de inversión debe ser en el futuro.');
        return;
      }

      const newItems = selectedProjectIds.map((pid, idx) => {
        const proj = userProjects.find(p => p.id === pid);
        const name = proj?.title || 'Proyecto';
        return {
          id: `qinv-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
          projectIds: [pid],
          projectNames: [name],
          sessionId: selectedSessionId,
          sessionTitle: targetSession.title,
          entryFee: targetSession.entryFee,
          totalCost: targetSession.entryFee,
          scheduledAt: parsedDate.toISOString(),
          status: 'queued' as const,
          createdAt: new Date().toISOString()
        };
      });

      setQueuedInvestments([...queuedInvestments, ...newItems]);
      alert(`⏰ ¡Programado con éxito! Se han añadido ${selectedProjectIds.length} inversiones individuales a la cola para el ${parsedDate.toLocaleString('es-ES')}.`);
      setScheduleType('now');
      setScheduleDate('');
    }
  };

  // Timer Effect that ticks to auto-process scheduled items
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let queueChanged = false;

      const updatedQueue = queuedInvestments.map((item) => {
        if (item.status === 'queued' && new Date(item.scheduledAt) <= now) {
          queueChanged = true;
          const result = executeInvestment(item.projectIds, item.sessionId);
          if (result.success) {
            // Success notification
            alert(`🚀 [PLANIFICADOR AUTOMÁTICO]\nSe ha detectado fecha de lanzamiento programada para tu inversión!\n\nSe procesó correctamente la inversión del proyecto(s) "${item.projectNames.join(', ')}" por un coste de ${item.totalCost}€.`);
            return {
              ...item,
              status: 'completed' as const,
              executedAt: new Date().toISOString()
            };
          } else {
            alert(`⚠️ [PLANIFICADOR AUTOMÁTICO] Intento fallido de inversión programada: ${result.error || ''}`);
            return {
              ...item,
              status: 'cancelled' as const,
              errorLog: result.error
            };
          }
        }
        return item;
      });

      if (queueChanged) {
        setQueuedInvestments(updatedQueue);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [queuedInvestments, sessions, userProfile]);

  const selectedProject = userProjects.find(p => p.id === selectedProjectId);
  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  return (
    <div className="space-y-6 animate-fade-in text-left bg-gradient-to-br from-indigo-50/50 via-[#f1f5f9] to-[#e2e8f0]/40 p-6 sm:p-8 rounded-3xl border border-indigo-150/40 shadow-xs">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-650" />
            <span>Proyectos Guardados</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Aquí residen tus proyectos de moda registrados en la plataforma. Configura tu portafolio, haz un seguimiento rápido de tus victorias oficiales e invierte de forma directa en cualquiera de nuestras mesas activas.
          </p>
        </div>

        <button
          onClick={() => onNavigateToTab('create_project')}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all active:scale-95 cursor-pointer self-start lg:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Registrar Proyecto</span>
        </button>
      </div>

      {/* QUICK STATUS BENCHMARK */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Proyectos Registrados</span>
            <strong className="text-lg font-bold text-slate-800">{userProjects.length}</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Mesas Ganadas (80%)</span>
            <strong className="text-lg font-bold text-slate-800">{historyWonLog.length}</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Fondo Acumulado Ganado</span>
            <strong className="text-lg font-bold text-emerald-600 font-mono">{totalPrizeWon.toFixed(2)}€</strong>
          </div>
        </div>
      </div>

      <div className="w-full space-y-6">
        
        {/* SECTION A: DETAILED PROJECTS SAVED */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-3xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Folder className="w-4 h-4 text-indigo-500" />
                <span>Portafolio de Proyectos Guardados</span>
              </h3>
              <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                Guardado en Local & SEPA
              </span>
            </div>

            {userProjects.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3">
                <Folder className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700">Ningún proyecto guardado aún</p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Antes de poder competir o gestionar tus finanzas en las mesas de inversión, debes dar de alta tu marca.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToTab('create_project')}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-semibold tracking-wide"
                >
                  Registrar mi primer proyecto ahora
                </button>
              </div>
            ) : (
              <div className="space-y-6 font-sans text-slate-800">
                {/* Visual Project Selection Deck */}
                <div className="space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                      Selecciona un proyecto para inspeccionar:
                    </span>
                    {/* Slider Navigation Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={scrollLeft}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-500 hover:text-indigo-600 transition cursor-pointer active:scale-95 shadow-3xs"
                        title="Deslizar a la izquierda"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={scrollRight}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-500 hover:text-indigo-600 transition cursor-pointer active:scale-95 shadow-3xs"
                        title="Deslizar a la derecha"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto pb-3 pt-1 gap-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent scroll-smooth"
                  >
                    {userProjects.map((p, idx) => {
                      const isSelected = p.id === selectedProjectId;
                      const fundingWon = getProjectFundingWon(p.id, p.title);
                      const progressPercent = Math.min(100, (fundingWon / p.budget) * 100);
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedProjectId(p.id);
                            setIsEditing(false);
                          }}
                          className={`text-left p-4 rounded-xl border transition-all duration-300 min-w-[210px] max-w-[240px] flex-1 cursor-pointer relative group ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 ring-2 ring-indigo-600 ring-offset-2'
                              : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs'
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-2.5 right-2.5 bg-white text-indigo-600 rounded-full p-0.5">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                          <span className={`text-[9px] uppercase font-bold tracking-wider font-mono block mb-1 ${
                            isSelected ? 'text-indigo-250' : 'text-slate-400'
                          }`}>
                            {p.category || 'Categoría'}
                          </span>
                          <strong className={`block text-xs font-bold leading-tight truncate ${
                            isSelected ? 'text-white' : 'text-slate-800 group-hover:text-indigo-600 transition-colors'
                          }`}>
                            {p.title}
                          </strong>
                          
                          <div className="mt-3.5 space-y-1">
                            <div className="flex justify-between items-center text-[9px]">
                              <span className={isSelected ? 'text-indigo-250' : 'text-slate-400'}>Financiación:</span>
                              <span className={`font-bold font-mono ${isSelected ? 'text-white' : 'text-slate-750'}`}>
                                {progressPercent.toFixed(0)}%
                              </span>
                            </div>
                            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isSelected ? 'bg-indigo-750/50' : 'bg-slate-200'}`}>
                              <div
                                className={`h-full rounded-full ${isSelected ? 'bg-amber-400' : 'bg-indigo-600'}`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isEditing ? (
                  <div className="p-5 sm:p-7 rounded-2xl border border-indigo-200 bg-white text-left shadow-xs animate-fade-in space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>✏️ Modificar Proyecto: {activeProject.title}</span>
                      </h4>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-605 font-bold px-2 py-1 rounded cursor-pointer transition-all"
                      >
                        Cancelar
                      </button>
                    </div>

                    {/* SECTION 1: IDENTIDAD CREATIVA */}
                    <div className="space-y-4">
                      <h5 className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        Identidad Creativa
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Título de la Propuesta *</label>
                          <input 
                            type="text" 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-850 focus:outline-none focus:border-indigo-600 focus:bg-white"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Categoría Comercial *</label>
                          <select 
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-850 focus:outline-none focus:border-indigo-600 focus:bg-white cursor-pointer font-medium"
                          >
                            <option value="Inteligencia artificial y automatización">Inteligencia artificial y automatización</option>
                            <option value="Agricultura y alimentos">Agricultura y alimentos</option>
                            <option value="Realidad virtual y aumentada">Realidad virtual y aumentada</option>
                            <option value="Energía y recursos">Energía y recursos</option>
                            <option value="Transporte y movilidad">Transporte y movilidad</option>
                            <option value="Gaming y e-sports">Gaming y e-sports</option>
                            <option value="Ciberseguridad">Ciberseguridad</option>
                            <option value="Marketplace">Marketplace</option>
                            <option value="Moda y belleza">Moda y belleza</option>
                            <option value="Bienes raíces o proptech">Bienes raíces o proptech</option>
                            <option value="Tecnología y software">Tecnología y software</option>
                            <option value="Salud y biotecnología">Salud y biotecnología</option>
                            <option value="Educación y formación">Educación y formación</option>
                            <option value="Finanzas y fintech">Finanzas y fintech</option>
                            <option value="Sostenibilidad o impacto ambiental">Sostenibilidad o impacto ambiental</option>
                            <option value="Comercio y retail">Comercio y retail</option>
                            <option value="Servicios profesionales">Servicios profesionales</option>
                            <option value="Operaciones o logística">Operaciones o logística</option>
                            <option value="Turismo y viajes">Turismo y viajes</option>
                            <option value="Hostelería y restauración">Hostelería y restauración</option>
                            <option value="Construcción e infraestructura">Construcción e infraestructura</option>
                            <option value="Industria y manufactura">Industria y manufactura</option>
                            <option value="Telecomunicaciones">Telecomunicaciones</option>
                            <option value="Medios de comunicación">Medios de comunicación</option>
                            <option value="Marketing y publicidad">Marketing y publicidad</option>
                            <option value="Recursos humanos y empleo">Recursos humanos y empleo</option>
                            <option value="Legal o legaltech">Legal o legaltech</option>
                            <option value="Seguros o insurtech">Seguros o insurtech</option>
                            <option value="Economía colaborativa">Economía colaborativa</option>
                            <option value="Arte y cultura">Arte y cultura</option>
                            <option value="Música y audio">Música y audio</option>
                            <option value="Deportes y fitness">Deportes y fitness</option>
                            <option value="Mascotas">Mascotas</option>
                            <option value="Hogar y decoración">Hogar y decoración</option>
                            <option value="Electrónica de consumo">Electrónica de consumo</option>
                            <option value="Automoción">Automoción</option>
                            <option value="Aeroespacial y defensa">Aeroespacial y defensa</option>
                            <option value="Blockchain y Web3">Blockchain y Web3</option>
                            <option value="Criptomonedas">Criptomonedas</option>
                            <option value="IoT (Internet de las Cosas)">IoT (Internet de las Cosas)</option>
                            <option value="Robótica">Robótica</option>
                            <option value="Smart Cities">Smart Cities</option>
                            <option value="Gobierno o GovTech">Gobierno o GovTech</option>
                            <option value="ONG e impacto social">ONG e impacto social</option>
                            <option value="Eventos">Eventos</option>
                            <option value="Lujo">Lujo</option>
                            <option value="Infantil y familia">Infantil y familia</option>
                            <option value="Recursos naturales y minería">Recursos naturales y minería</option>
                            <option value="Ciencia e investigación">Ciencia e investigación</option>
                            <option value="Otros">Otros</option>
                          </select>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Descripción Corta *</label>
                          <input 
                            type="text" 
                            value={editDescShort}
                            onChange={(e) => setEditDescShort(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-850 focus:outline-none focus:border-indigo-600 focus:bg-white"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Descripción Detallada (Lanzamiento) *</label>
                          <textarea 
                            rows={3}
                            value={editDescLong}
                            onChange={(e) => setEditDescLong(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-855 focus:outline-none focus:border-indigo-600 focus:bg-white font-sans"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Email Contacto *</label>
                          <input 
                            type="email" 
                            value={editContactEmail}
                            onChange={(e) => setEditContactEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-850 focus:outline-none focus:border-indigo-600 focus:bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Teléfono Contacto *</label>
                          <input 
                            type="text" 
                            value={editContactPhone}
                            onChange={(e) => setEditContactPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-850 focus:outline-none focus:border-indigo-600 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: GALERÍA & MULTIMEDIA */}
                    <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                      <h5 className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 border-b border-slate-200/60 pb-1 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-indigo-500" />
                        Galería de Bocetos, Fotos & Videos
                      </h5>

                      <div className="space-y-3">
                        {/* Live Previews of existing list */}
                        <div className="flex flex-wrap gap-2">
                          {editImages.map((url, index) => (
                            <div key={`edit-img-${index}`} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-3xs">
                              <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setEditImages(editImages.filter((_, i) => i !== index))}
                                className="absolute top-0.5 right-0.5 bg-red-500 hover:bg-red-605 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] shadow-sm cursor-pointer"
                                title="Quitar imagen"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          {editVideos.map((url, index) => (
                            <div key={`edit-vid-${index}`} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-950 flex flex-col items-center justify-center shrink-0 text-[8px] text-white font-mono p-1 text-center">
                              <span className="font-bold">📹 Video</span>
                              <span className="text-[7px] text-slate-450 truncate w-full">{url.split('/').pop()?.substring(0,8)}</span>
                              <button
                                type="button"
                                onClick={() => setEditVideos(editVideos.filter((_, i) => i !== index))}
                                className="absolute top-0.5 right-0.5 bg-red-500 hover:bg-red-655 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] shadow-sm cursor-pointer"
                                title="Quitar video"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Direct input helpers */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex gap-1.5">
                            <input
                              type="url"
                              placeholder="Pegar URL de Imagen (.jpg, .png)"
                              value={newImageUrl || ''}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg w-full px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newImageUrl.trim()) {
                                  setEditImages([...editImages, newImageUrl.trim()]);
                                  setNewImageUrl('');
                                }
                              }}
                              className="bg-slate-900 hover:bg-indigo-650 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer shrink-0"
                            >
                              + Foto
                            </button>
                          </div>

                          <div className="flex gap-1.5">
                            <input
                              type="url"
                              placeholder="Pegar URL de Video (.mp4, .mov)"
                              value={newVideoUrl}
                              onChange={(e) => setNewVideoUrl(e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg w-full px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newVideoUrl.trim()) {
                                  setEditVideos([...editVideos, newVideoUrl.trim()]);
                                  setNewVideoUrl('');
                                }
                              }}
                              className="bg-slate-900 hover:bg-indigo-650 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer shrink-0"
                            >
                              + Video
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[9px] text-slate-400 font-medium">Bocetos simulados rápidos:</span>
                          <button
                            type="button"
                            onClick={() => setEditImages([...editImages, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600'])}
                            className="bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-[9px] px-2 py-0.5 rounded shadow-3xs cursor-pointer"
                          >
                            + Alta Costura Negra
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditImages([...editImages, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600'])}
                            className="bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-[9px] px-2 py-0.5 rounded shadow-3xs cursor-pointer"
                          >
                            + Colección Lino Orgánico
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: ECONOMÍA, CRONOGRAMA & DESGLOSE */}
                    <div className="space-y-4">
                      <h5 className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-indigo-500" />
                        Economía, Cronograma & Desglose de Fondos
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Presupuesto Referencia (€) *</label>
                          <input 
                            type="number" 
                            value={editBudget}
                            onChange={(e) => setEditBudget(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 font-mono font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Objetivo Recaudación (€) *</label>
                          <input 
                            type="number" 
                            value={editFundingGoal}
                            onChange={(e) => setEditFundingGoal(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-indigo-700 focus:outline-none focus:border-indigo-600 font-mono font-bold"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Objetivo Final de Recaudación (Meta de Propuesta) *</label>
                          <textarea 
                            rows={2}
                            value={editObjective}
                            onChange={(e) => setEditObjective(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-850 focus:outline-none focus:border-indigo-600 font-sans"
                            placeholder="Ej. Confeccionar un prototipo comercial a escala real de la colección Eco-Lux para presentarlo en ferias textiles..."
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Uso de los Fondos (Plan de Gasto) *</label>
                          <textarea 
                            rows={2}
                            value={editFundUsage}
                            onChange={(e) => setEditFundUsage(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-850 focus:outline-none focus:border-indigo-600 font-sans"
                            placeholder="Ej. Adquisición de lanas ecológicas, pago certificado de talleres locales, y contratación de fotógrafo comercial."
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Cronograma Breve de Lanzamiento</label>
                          <input 
                            type="text" 
                            value={editTimeline}
                            onChange={(e) => setEditTimeline(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-850 focus:outline-none focus:border-indigo-600"
                            placeholder="Ej. Semana 1: Patronaje y corte. Semana 2: Ensamblado y sesión de fotos oficial."
                          />
                        </div>

                        {/* Interactive Expense Breakdown, matching ProjectForm */}
                        <div className="sm:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                            📝 Desglose de Gastos en Detalle:
                          </span>

                          <div className="space-y-1.5 font-mono text-[11px] max-h-40 overflow-y-auto bg-white p-2.5 rounded-lg border border-slate-200">
                            {editBudgetItems.length === 0 ? (
                              <p className="text-slate-400 italic text-[10px]">Sin desglose aún. Añade partidas presupuestarias abajo:</p>
                            ) : (
                              editBudgetItems.map((item, idx) => (
                                <div key={item.id} className="flex justify-between items-center p-1 border-b border-slate-100 last:border-0">
                                  <span>{item.item}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-indigo-700">{item.amount}€</span>
                                    <button
                                      type="button"
                                      onClick={() => removeBudgetItem(item.id)}
                                      className="text-red-500 hover:text-red-700 font-bold px-1 rounded hover:bg-slate-100 cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="Ej. Compra de Algodón Orgánico"
                              value={newBudgetItem}
                              onChange={(e) => setNewBudgetItem(e.target.value)}
                              className="bg-white border border-slate-250 rounded-lg w-full px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none flex-1"
                            />
                            <div className="relative w-24 shrink-0">
                              <span className="absolute left-2 top-1.5 text-xs text-slate-400 font-mono">€</span>
                              <input
                                type="number"
                                placeholder="Importe"
                                value={newBudgetAmount}
                                onChange={(e) => setNewBudgetAmount(e.target.value)}
                                className="bg-white border border-slate-250 rounded-lg w-full pl-5 pr-1.5 py-1.5 text-xs text-slate-800 focus:outline-none font-mono font-bold"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={addBudgetItem}
                              className="bg-slate-900 hover:bg-indigo-650 text-white px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer"
                            >
                              + Añadir
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: DOCUMENTACIÓN OFICIAL */}
                    <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                      <h5 className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 border-b border-slate-200/60 pb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                        Dossier Técnico / Viabilidad
                      </h5>

                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Adjunta un archivo que describa la estructura económica profunda (PDF corporativo) para la validación ejecutiva.
                      </p>

                      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-4 text-center space-y-3">
                        {isUploadingDoc ? (
                          <div className="space-y-1 py-1">
                            <span className="text-[11px] text-indigo-600 font-bold block animate-pulse">Sincronizando archivo...</span>
                            <div className="w-all bg-slate-150 rounded-full h-1.5 overflow-hidden mx-auto max-w-xs">
                              <div className="bg-indigo-600 h-full" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 items-center justify-center">
                            <button
                              type="button"
                              onClick={() => triggerSimulatedDocUpload('Planes_Comerciales_EcoModa_Revisado.pdf')}
                              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-150 text-[10px] px-3 py-1.5 rounded-lg font-bold transition cursor-pointer shadow-3xs"
                            >
                              📄 Alternativo: Plan de Negocio.pdf
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerSimulatedDocUpload('Dossier_Maquetas_Moda_Gala.pdf')}
                              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-150 text-[10px] px-3 py-1.5 rounded-lg font-bold transition cursor-pointer shadow-3xs"
                            >
                              📄 Alternativo: Dossier Diseñador.pdf
                            </button>
                          </div>
                        )}

                        {editDocName && !isUploadingDoc && (
                          <div className="p-2 bg-emerald-500/5 text-emerald-800 border border-emerald-150 rounded-lg flex items-center justify-between text-[11px] font-sans">
                            <span className="truncate max-w-[200px]">✓ {editDocName}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditDocName('');
                                setEditDocUrl('');
                              }}
                              className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SECTION 5: EQUIPO HUMANO DESDE EL BACKSTAGE */}
                    <div className="space-y-4">
                      <h5 className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                        Equipo del Proyecto *
                      </h5>

                      {/* Display list of active team edit */}
                      <div className="space-y-2">
                        {editTeam.map((member, idx) => (
                          <div key={`edit-team-${idx}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex justify-between items-start">
                            <div className="text-left space-y-0.5">
                              <p className="font-bold text-slate-800">{member.name} <span className="font-medium text-slate-400 font-mono text-[9px]">({member.role})</span></p>
                              <p className="text-[10px] text-slate-500 leading-tight">{member.experience}</p>
                              {member.bio && <p className="text-[9px] bg-white p-1 rounded border leading-relaxed text-slate-500">{member.bio}</p>}
                            </div>
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => removeTeamMember(idx)}
                                className="p-1 text-rose-500 hover:bg-rose-100 rounded cursor-pointer shrink-0"
                                title="Quitar miembro"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Form to add team member in SavedProjects */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-3 text-xs">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">+ Agregar Miembro de Staff</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Nombre Completo"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            className="bg-white border rounded p-1.5 text-xs text-slate-800 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Función o Cargo"
                            value={newMemberRole}
                            onChange={(e) => setNewMemberRole(e.target.value)}
                            className="bg-white border rounded p-1.5 text-xs text-slate-800 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Experiencia"
                            value={newMemberExp}
                            onChange={(e) => setNewMemberExp(e.target.value)}
                            className="bg-white border rounded p-1.5 text-xs text-slate-800 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="url"
                            placeholder="Enlace a Portfolio (e.g., https://instagram.com/perfil)"
                            value={newMemberProfile}
                            onChange={(e) => setNewMemberProfile(e.target.value)}
                            className="bg-white border rounded p-1.5 text-xs text-slate-800 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Biografía breve"
                            value={newMemberBio}
                            onChange={(e) => setNewMemberBio(e.target.value)}
                            className="bg-white border rounded p-1.5 text-xs text-slate-800 focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={addTeamMember}
                          className="w-full py-1.5 bg-slate-900 hover:bg-indigo-650 text-white rounded text-[11px] font-semibold cursor-pointer transition-all"
                        >
                          + Añadir Miembro al Equipo
                        </button>
                      </div>
                    </div>

                    {/* FORM FOOTER BUTTONS */}
                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-slate-250 bg-white hover:bg-slate-50 rounded-xl font-bold text-slate-650 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={saveProjectEdit}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold shadow-3xs cursor-pointer transition-all"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </div>
                ) : (
                  [activeProject].map((project) => {
                    const fundingWon = getProjectFundingWon(project.id, project.title);
                    const isFullyFunded = fundingWon >= project.budget;
                    const progressPercent = Math.min(100, (fundingWon / project.budget) * 100);
                    const enteredSessionFlag = hasEnteredAnySession(project.id);
                    const hasCoverImage = project.images && project.images.length > 0;
                    const coverUrl = hasCoverImage ? project.images[0] : null;

                    return (
                      <div 
                        key={project.id} 
                        className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm animate-fade-in text-left block relative"
                      >
                        {/* HERO COVER BANNER */}
                        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900">
                          {hasCoverImage ? (
                            <>
                              <img 
                                src={coverUrl!} 
                                alt={project.title} 
                                className="w-full h-full object-cover opacity-60 saturate-110 brightness-[0.7] transform hover:scale-105 transition-transform duration-700" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 opacity-95">
                              {/* Abstract visual background pattern */}
                              <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300 via-indigo-500 to-slate-900" />
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-550/10 rounded-full filter blur-3xl pointer-events-none" />
                            </div>
                          )}

                          {/* OVERLAY HEADER CONTENT */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end text-white">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 bg-white/15 backdrop-blur-md text-white rounded-md border border-white/10">
                                {project.category}
                              </span>
                              <span className="text-[9px] font-bold text-indigo-200 bg-indigo-950/60 border border-indigo-800/40 px-2.5 py-1 rounded-md flex items-center gap-1 shadow-3xs">
                                <Check className="w-3 h-3 text-indigo-400" />
                                <span>Seleccionado para invertir</span>
                              </span>
                            </div>
                            
                            <h4 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white leading-tight">
                              {project.title}
                            </h4>
                          </div>
                        </div>

                        {/* PROJECT BODY CONTENT */}
                        <div className="p-6 space-y-6">
                          {/* DESCRIPTION */}
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wider">Presentación de la propuesta:</span>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                              {selectedProjectId === project.id ? project.descriptionLong : project.descriptionShort}
                            </p>
                          </div>

                          {/* PREMIUM FINANCIALS ACUMULADOS PROGRESS CARD */}
                          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 space-y-3.5 shadow-3xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="text-[9px] uppercase font-mono font-bold text-indigo-600 block tracking-wider">Financiación Acumulada Consensuada:</span>
                                <strong className="text-lg sm:text-xl font-bold text-slate-800 font-mono tracking-tight block mt-0.5">
                                  {fundingWon.toFixed(2)}€ <span className="text-xs font-normal text-slate-400">de {project.budget}€</span>
                                </strong>
                              </div>
                              <div className="text-left sm:text-right">
                                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block tracking-wider">Progreso de la Meta:</span>
                                <span className="text-sm font-extrabold text-indigo-600 block mt-0.5 font-mono">{progressPercent.toFixed(1)}%</span>
                              </div>
                            </div>

                            {/* PROGRESS TRACK */}
                            <div className="relative w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ease-out ${
                                  isFullyFunded 
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                                    : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700'
                                }`} 
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-slate-450 border-t border-slate-200/50 pt-2.5">
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Meta de Presupuesto Rápido</span>
                              </span>
                              {isFullyFunded ? (
                                <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>¡Límite de Financiación Completado!</span>
                                </span>
                              ) : (
                                <span className="font-semibold text-slate-600">
                                  Faltan <strong className="text-indigo-600 font-mono">{(project.budget - fundingWon).toFixed(2)}€</strong> para su tope
                                </span>
                              )}
                            </div>
                          </div>

                          {/* CORE SPECS GRID */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-4 bg-white rounded-xl border border-slate-150 shadow-3xs flex items-start gap-3">
                              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                                <Coins className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Presupuesto Ref.</span>
                                <strong className="text-sm font-bold text-slate-800 font-mono block mt-0.5">{project.budget}€</strong>
                              </div>
                            </div>

                            <div className="p-4 bg-white rounded-xl border border-slate-150 shadow-3xs flex items-start gap-3">
                              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
                                <Award className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Objetivo Recaudación</span>
                                <strong className="text-sm font-bold text-indigo-600 font-mono block mt-0.5">{project.fundingGoal || 'N/D'}€</strong>
                              </div>
                            </div>

                            <div className="p-4 bg-white rounded-xl border border-slate-150 shadow-3xs flex items-start gap-3 sm:col-span-2 lg:col-span-1">
                              <div className="p-2 bg-amber-50 rounded-lg text-amber-600 shrink-0">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Uso de Fondos</span>
                                <p className="text-xs font-semibold text-slate-700 truncate block mt-0.5" title={project.fundUsage}>
                                  {project.fundUsage}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* OBJECTIVE AND TIMELINE BENTO */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {project.objective && (
                              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-150 text-left relative flex flex-col justify-between">
                                <span className="text-[9px] uppercase font-mono font-extrabold text-slate-400 tracking-wider block mb-1">🎯 Objetivo de la Propuesta</span>
                                <p className="text-xs text-slate-650 leading-relaxed italic font-medium pl-3 border-l-2 border-indigo-500">
                                  "{project.objective}"
                                </p>
                              </div>
                            )}

                            {project.timeline && (
                              <div className="p-4 bg-indigo-50/10 rounded-xl border border-indigo-100/50 text-left relative flex flex-col justify-between">
                                <span className="text-[9px] uppercase font-mono font-extrabold text-indigo-600 tracking-wider block mb-1">📅 Cronograma de Lanzamiento</span>
                                <p className="text-xs text-slate-700 leading-normal font-semibold flex items-center gap-1.5 mt-1">
                                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                                  <span>{project.timeline}</span>
                                </p>
                              </div>
                            )}
                          </div>

                          {/* CONTACT DETAILS BOX */}
                          {(project.contactEmail || project.contactPhone) && (
                            <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-150 flex flex-wrap gap-4 text-xs font-sans text-slate-600 items-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Contacto Oficial:</span>
                              {project.contactEmail && (
                                <a href={`mailto:${project.contactEmail}`} className="flex items-center gap-1.5 text-indigo-650 hover:underline font-medium">
                                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                                  <span>{project.contactEmail}</span>
                                </a>
                              )}
                              {project.contactPhone && (
                                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{project.contactPhone}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* DOCUMENTACIÓN REGISTRADA */}
                          {project.documentationName && (
                            <div className="p-3.5 bg-indigo-50/40 border border-indigo-150 rounded-xl flex flex-col gap-3 text-xs font-sans shadow-3xs">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100/60 flex items-center justify-center text-indigo-600 shrink-0">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="text-left min-w-0">
                                  <p className="font-bold text-slate-800 leading-snug break-all">{project.documentationName}</p>
                                  <span className="text-[9px] text-slate-450 uppercase font-mono block mt-0.5">Dossier de Viabilidad Oficial</span>
                                </div>
                              </div>
                              {project.documentationUrl && (
                                <a 
                                  href={project.documentationUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-[10px] shadow-3xs cursor-pointer block"
                                >
                                  Descargar Dossier
                                </a>
                              )}
                            </div>
                          )}

                          {/* DETALLE: PRESUPUESTO DESGLOSADO */}
                          {selectedProjectId === project.id && project.budgetBreakdown && (
                            <div className="p-4 bg-slate-50/50 border border-slate-150 rounded-xl space-y-2 text-left">
                              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">Partidas Presupuestarias Registradas:</span>
                              <div className="divide-y divide-slate-100 bg-white rounded-xl border border-slate-150 overflow-hidden font-mono text-[11px] shadow-3xs">
                                {project.budgetBreakdown.split('\n').filter(line => line.trim()).map((item, id) => {
                                  const parts = item.split(':');
                                  const name = parts[0]?.trim() || '';
                                  const value = parts[1]?.trim() || '';
                                  return (
                                    <div key={id} className="p-2.5 px-4 flex justify-between items-center text-slate-650 hover:bg-slate-50/50 transition">
                                      <span className="truncate flex-1 font-sans font-medium text-slate-700">{name}</span>
                                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/40">{value}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* MULTIMEDIA INTERACTIVA GALLERY */}
                          {selectedProjectId === project.id && ((project.images && project.images.length > 0) || (project.videos && project.videos.length > 0)) && (
                            <div className="space-y-2.5 text-left">
                              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">Galería, Diseños & Multimedia:</span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {project.images?.map((imgUrl, i) => (
                                  <div 
                                    key={`gallery-img-${i}`} 
                                    onMouseEnter={() => setHoveredMedia({ url: imgUrl, type: 'image' })}
                                    onMouseLeave={() => setHoveredMedia(null)}
                                    className="relative h-20 sm:h-24 rounded-xl overflow-hidden border border-slate-200 hover:border-indigo-400 hover:shadow-md shrink-0 transition-all duration-300 hover:scale-[1.04] cursor-zoom-in group"
                                  >
                                    <img src={imgUrl} alt="Boceto o Foto" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                                      <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                  </div>
                                ))}
                                {project.videos?.map((vidUrl, i) => (
                                  <div 
                                    key={`gallery-vid-${i}`} 
                                    onMouseEnter={() => setHoveredMedia({ url: vidUrl, type: 'video' })}
                                    onMouseLeave={() => setHoveredMedia(null)}
                                    className="relative h-20 sm:h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 hover:border-indigo-400 hover:shadow-md flex flex-col items-center justify-center p-2 text-center text-[10px] text-white font-sans transition-all duration-300 hover:scale-[1.04] cursor-zoom-in group"
                                  >
                                    <span className="text-lg mb-1 transform group-hover:scale-115 transition duration-300">📹</span>
                                    <span className="truncate w-full text-[9px] font-sans text-slate-300">Video {i + 1}</span>
                                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                                      <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* TEAM SECTION DISPLAY RICH */}
                          {project.team && project.team.length > 0 && (
                            <div className="space-y-3 pt-2 text-left">
                              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">
                                Perfiles de Miembros del Equipo:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {project.team.map((member, i) => {
                                  // Generate nice initials for avatar
                                  const initials = member.name ? member.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : 'M';
                                  // Premium colors for avatars
                                  const colorPalette = [
                                    'bg-indigo-100 text-indigo-700 border-indigo-150',
                                    'bg-emerald-100 text-emerald-700 border-emerald-150',
                                    'bg-amber-100 text-amber-700 border-amber-150',
                                    'bg-rose-100 text-rose-700 border-rose-150',
                                    'bg-violet-100 text-violet-700 border-violet-150'
                                  ];
                                  const avatarColor = colorPalette[i % colorPalette.length];

                                  return (
                                    <div key={i} className="p-4 bg-slate-50/50 border border-slate-150 rounded-2xl flex items-start gap-3 hover:bg-slate-50 hover:border-indigo-200 transition-all duration-300">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border shrink-0 ${avatarColor}`}>
                                        {initials}
                                      </div>
                                      <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex flex-wrap items-center justify-between gap-1">
                                          <span className="font-bold text-slate-800 text-xs truncate max-w-[120px]">{member.name}</span>
                                          <span className="text-[8px] bg-indigo-50/80 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100">{member.role}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium leading-normal">{member.experience}</p>
                                        {member.bio && (
                                          <p className="text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-150 leading-relaxed font-sans mt-1.5">
                                            {member.bio}
                                          </p>
                                        )}
                                        {member.profileLink && (
                                          <a href={member.profileLink} target="_blank" rel="noreferrer" className="text-[9px] text-indigo-600 hover:underline flex items-center gap-1 font-bold mt-1.5">
                                            <span>🔗 Ver Portfolio</span>
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* BOTTOM INTERACTIVE COMPONENT AND EDIT OPTIONS */}
                          <div className="pt-5 border-t border-slate-100 flex flex-wrap gap-3 justify-between items-center text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                              {enteredSessionFlag ? (
                                <div className="flex items-center gap-1.5 text-slate-450 bg-slate-50 px-3 py-2 rounded-xl border border-slate-150 font-sans">
                                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="text-[10px] font-bold">Bloqueado: Ya ha participado en sesión</span>
                                </div>
                              ) : (
                                <button
                                  onClick={startEditing}
                                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 border border-indigo-100 rounded-xl font-bold transition active:scale-95 cursor-pointer font-sans"
                                >
                                  <span>✏️ Modificar Proyecto</span>
                                </button>
                              )}

                              <button
                                onClick={() => onNavigateToTab('create_project')}
                                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition active:scale-95 cursor-pointer font-sans shadow-3xs"
                              >
                                <Eye className="w-3.5 h-3.5 text-indigo-300" />
                                <span>Ver Proyecto</span>
                              </button>

                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-100 rounded-xl font-bold transition active:scale-95 cursor-pointer font-sans"
                                title="Eliminar este proyecto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Eliminar Proyecto</span>
                              </button>
                            </div>

                            {isFullyFunded && (
                              <span className="text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg inline-flex items-center gap-1 shadow-3xs font-sans">
                                🎉 Límite Financiado
                              </span>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* SECTION C: ACTIVE SESSION PROJECTS (Pago ya Disparado / Compitiendo) */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-3xs space-y-4 animate-fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 animate-pulse" />
                <span>Proyectos Activos en Sesión (Participación y Pago Disparado)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Propuestas de moda que han abonado su cuota de custodia y se encuentran compitiendo activamente en las mesas de inversión.
              </p>
            </div>

            {activeSessionProjectsList.length === 0 ? (
              <div className="border border-dashed border-slate-150 rounded-xl p-6 text-center text-xs text-slate-450 bg-slate-50/50">
                <p className="font-medium text-slate-600">No hay proyectos postulando en sesiones activas de tu perfil</p>
                <p className="text-[10px] text-slate-450 mt-1 max-w-md mx-auto">
                  Selecciona uno de tus proyectos en el carrusel de arriba y regístralo en cualquiera de las mesas disponibles en el panel derecho para disparar la cuota e iniciar la ronda.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-150 overflow-hidden bg-white">
                {activeSessionProjectsList.map((item, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800 text-sm">{item.project.title}</span>
                        <span className="text-[9px] uppercase font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                          {item.project.category || 'Moda'}
                        </span>
                      </div>
                      <div className="mt-1.5 space-y-1 text-[11px] text-slate-500 font-sans">
                        <p className="flex items-center gap-1">
                          <span className="text-slate-400 font-medium">Mesa Escogida:</span> 
                          <span className="font-semibold text-slate-700">{item.sessionTitle}</span>
                        </p>
                        <p className="flex items-center gap-1 font-mono text-[10px]">
                          <span>Cuota de entrada pagada:</span> 
                          <strong className="text-indigo-600 font-semibold">{item.sessionFee}€</strong>
                          <span className="text-slate-350">|</span>
                          <span>Bote acumulado actual:</span> 
                          <strong className="text-indigo-600 font-semibold">{item.poolTotal}€</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-slate-400/80">Quórum de Mesa</p>
                        <p className="text-[11px] font-bold text-slate-700 font-mono">{item.participantCount} / 10</p>
                      </div>

                      {item.status === 'voting' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-150 animate-pulse shadow-3xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          <span>EN VOTACIÓN</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-150 shadow-3xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-ping" />
                          <span>COMPLETANDO MESA</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION B: WINNINGS HISTORY log (exclusively won, without participant clutter) */}
          <div 
            style={{ backgroundColor: '#FDF2F5' }}
            className="rounded-2xl border border-pink-200/80 p-6 shadow-3xs space-y-5 transition-all"
          >
            {/* Header with Title and Global KPI Badges */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-pink-200/60 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-600" />
                  <span>Historial de Rondas de Inversión Ganadas</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Registro exclusivo de tus éxitos comerciales. No se muestran proyectos que participaron pero no ganaron.
                </p>
              </div>

              {historyWonLog.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 border border-pink-200 rounded-xl text-xs font-bold text-rose-800 shadow-3xs">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>{historyWonLog.length} {historyWonLog.length === 1 ? 'Victoria' : 'Victorias'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 border border-pink-200 rounded-xl text-xs font-bold text-slate-700 shadow-3xs">
                    <Folder className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{projectWinningsSummary.length} {projectWinningsSummary.length === 1 ? 'Proyecto Ganador' : 'Proyectos Ganadores'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 border border-emerald-200 rounded-xl text-xs font-extrabold text-emerald-700 font-mono shadow-3xs">
                    <span>+{historyWonLog.reduce((acc, curr) => acc + curr.prize, 0).toFixed(2)}€ Acumulados</span>
                  </span>
                </div>
              )}
            </div>

            {/* BARRA DE HERRAMIENTAS, BÚSQUEDA Y FILTRADO (Organización cuando hay muchos proyectos) */}
            {historyWonLog.length > 0 && (
              <div className="bg-white/90 backdrop-blur-xs rounded-xl border border-pink-200/80 p-3 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Buscar por proyecto, sesión o categoría..."
                    className="w-full pl-8.5 pr-8 py-1.5 text-xs bg-slate-50/70 border border-pink-200/80 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-rose-400 focus:bg-white transition"
                  />
                  {historySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setHistorySearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                      title="Borrar búsqueda"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Selector de Proyecto */}
                  <div className="relative">
                    <select
                      value={historySelectedProjectFilter}
                      onChange={(e) => setHistorySelectedProjectFilter(e.target.value)}
                      className="text-xs bg-white border border-pink-200/90 text-slate-700 rounded-lg px-2.5 py-1.5 pr-7 font-medium focus:outline-hidden focus:border-rose-400 cursor-pointer shadow-3xs max-w-[220px] truncate"
                    >
                      <option value="all">Todos los proyectos ({projectWinningsSummary.length})</option>
                      {projectWinningsSummary.map(p => (
                        <option key={p.projectId} value={p.projectId}>
                          {p.projectTitle} ({p.winCount} {p.winCount === 1 ? 'victoria' : 'victorias'} · +{p.totalPrize.toFixed(2)}€)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Toggle de Modo de Vista */}
                  <div className="flex items-center bg-pink-100/70 p-0.5 rounded-lg border border-pink-200">
                    <button
                      type="button"
                      onClick={() => setHistoryViewMode('by_project')}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md transition cursor-pointer ${
                        historyViewMode === 'by_project'
                          ? 'bg-white text-rose-800 shadow-3xs'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                      title="Vista agrupada por proyecto (ideal para organizar muchos proyectos)"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Por Proyecto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryViewMode('table')}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md transition cursor-pointer ${
                        historyViewMode === 'table'
                          ? 'bg-white text-rose-800 shadow-3xs'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                      title="Vista de lista cronológica"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Todas las Rondas</span>
                    </button>
                  </div>

                  {/* Botones de Expandir / Contraer todos (solo visible en modo by_project) */}
                  {historyViewMode === 'by_project' && filteredProjectSummaries.length > 1 && (
                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => expandAllProjects(filteredProjectSummaries.map(p => p.projectId))}
                        className="px-2 py-1 bg-white hover:bg-rose-50 border border-pink-200 rounded-md text-slate-600 font-semibold cursor-pointer transition shadow-3xs"
                      >
                        Expandir
                      </button>
                      <button
                        type="button"
                        onClick={() => collapseAllProjects(filteredProjectSummaries.map(p => p.projectId))}
                        className="px-2 py-1 bg-white hover:bg-rose-50 border border-pink-200 rounded-md text-slate-600 font-semibold cursor-pointer transition shadow-3xs"
                      >
                        Contraer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VISTA 1: AGRUPADA POR PROYECTO (Acordeón Ultra-Cómodo para muchos proyectos) */}
            {historyWonLog.length > 0 && historyViewMode === 'by_project' && (
              <div className="space-y-3">
                {filteredProjectSummaries.length === 0 ? (
                  <div className="bg-white/90 border border-dashed border-pink-200 rounded-xl p-6 text-center text-xs text-slate-500">
                    No se encontraron proyectos con victorias que coincidan con los filtros seleccionados.
                    <button
                      type="button"
                      onClick={() => { setHistorySearchQuery(''); setHistorySelectedProjectFilter('all'); }}
                      className="block mx-auto mt-2 text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Restablecer filtros
                    </button>
                  </div>
                ) : (
                  filteredProjectSummaries.map((pSummary) => {
                    const isOpen = expandedProjects[pSummary.projectId] ?? true;
                    return (
                      <div
                        key={pSummary.projectId}
                        className="bg-white/95 rounded-xl border border-pink-200/90 shadow-3xs overflow-hidden transition-all hover:border-pink-300"
                      >
                        {/* Cabecera del Proyecto (Fila interactiva que resume todo limpiamente) */}
                        <div
                          onClick={() => toggleProjectAccordion(pSummary.projectId)}
                          className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-rose-50/30 transition-colors select-none"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center shrink-0">
                              <Trophy className="w-5 h-5 text-amber-500" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <span className="text-[9.5px] font-extrabold uppercase font-mono bg-pink-100/70 text-rose-700 px-2 py-0.5 rounded border border-pink-200">
                                  {pSummary.projectCategory || 'Proyecto de Moda'}
                                </span>
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10.5px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200">
                                  🏆 Ha ganado {pSummary.winCount} {pSummary.winCount === 1 ? 'vez' : 'veces'}
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-900 text-sm leading-tight truncate" title={pSummary.projectTitle}>
                                {pSummary.projectTitle}
                              </h4>
                            </div>
                          </div>

                          {/* Métricas y Control de Apertura */}
                          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-pink-100">
                            {/* En cuántas sesiones */}
                            <div className="text-left sm:text-right">
                              <span className="text-[10px] text-slate-500 uppercase font-mono block">Sesiones ganadas</span>
                              <span className="text-xs font-bold text-indigo-700 inline-flex items-center gap-1">
                                <Layers className="w-3 h-3 text-indigo-500" />
                                {pSummary.sessionsList.length} {pSummary.sessionsList.length === 1 ? 'sesión' : 'sesiones'}
                              </span>
                            </div>

                            {/* Cuánto es el total ganado a la fecha */}
                            <div className="text-right">
                              <span className="text-[10px] text-slate-500 uppercase font-mono block">Total hasta la fecha</span>
                              <span className="text-sm sm:text-base font-black text-emerald-600 font-mono">
                                +{pSummary.totalPrize.toFixed(2)}€
                              </span>
                            </div>

                            {/* Botón Acordeón */}
                            <div className="pl-1">
                              <div className={`p-1.5 rounded-lg bg-pink-50 border border-pink-200 text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-pink-100 text-rose-800' : ''}`}>
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Desglose de Sesiones (Solo cuando está abierto) */}
                        {isOpen && (
                          <div className="border-t border-pink-100/90 bg-slate-50/50 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                                <span>Sesiones y Rondas en las que ha ganado ({pSummary.sessionsList.length}):</span>
                              </span>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-pink-200/70 bg-white shadow-3xs">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-[#FFF8FA] text-[10px] font-extrabold uppercase text-rose-900/80 font-mono border-b border-pink-200/60">
                                    <th className="p-2.5">Sesión / Ronda</th>
                                    <th className="p-2.5">Fecha de Consumación</th>
                                    <th className="p-2.5">Estado</th>
                                    <th className="p-2.5 text-right">Premio Recibido (80%)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-pink-100/70 text-[11px]">
                                  {pSummary.sessionsList.map((sess, idx) => (
                                    <tr key={sess.id + '-' + idx} className="hover:bg-rose-50/30 transition">
                                      <td className="p-2.5 font-bold text-slate-800 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                        <span>{sess.title}</span>
                                      </td>
                                      <td className="p-2.5 text-slate-500 whitespace-nowrap">
                                        {new Date(sess.date).toLocaleDateString('es-ES', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </td>
                                      <td className="p-2.5">
                                        <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150">
                                          <Check className="w-2.5 h-2.5" />
                                          <span>✓ GANADOR</span>
                                        </span>
                                      </td>
                                      <td className="p-2.5 text-right font-bold text-emerald-600 font-mono text-xs whitespace-nowrap">
                                        +{sess.prize.toFixed(2)}€
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Resumen del proyecto al pie */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-600 bg-pink-50/40 p-2.5 rounded-lg border border-pink-100">
                              <span>
                                Este proyecto ha obtenido <strong>{pSummary.winCount} {pSummary.winCount === 1 ? 'victoria oficial' : 'victorias oficiales'}</strong> en <strong>{pSummary.sessionsList.length} {pSummary.sessionsList.length === 1 ? 'sesión' : 'sesiones'}</strong> de inversión.
                              </span>
                              <span className="font-extrabold text-emerald-700 font-mono text-xs">
                                Total acumulado: +{pSummary.totalPrize.toFixed(2)}€
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* VISTA 2: CRONOLÓGICA GENERAL (Tabla completa sin apreturas) */}
            {historyWonLog.length > 0 && historyViewMode === 'table' && (
              <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white shadow-3xs">
                {filteredHistoryWonLog.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No hay rondas que coincidan con la búsqueda.
                    <button
                      type="button"
                      onClick={() => { setHistorySearchQuery(''); setHistorySelectedProjectFilter('all'); }}
                      className="block mx-auto mt-2 text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Restablecer filtros
                    </button>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FFF5F8] text-[10px] font-extrabold uppercase text-rose-900/80 font-mono border-b border-pink-200/70">
                        <th className="p-3">Código / Ronda</th>
                        <th className="p-3">Proyecto Ganador</th>
                        <th className="p-3">Categoría</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Fecha de Consumación</th>
                        <th className="p-3 text-right">Premio Recibido (80%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-100/70 text-[11px]">
                      {filteredHistoryWonLog.map((log) => {
                        const projSummary = projectWinningsSummary.find(p => p.projectId === log.projectId || p.projectTitle === log.projectName) 
                          || projectWinningsSummary[0];
                        const projectName = log.projectName || projSummary?.projectTitle || userProjects[0]?.title || 'Eco-Fashion Runway';
                        const category = projSummary?.projectCategory || 'Moda';

                        return (
                          <tr key={log.id} className="hover:bg-rose-50/40 transition-colors">
                            <td className="p-3 font-semibold text-slate-800">
                              {log.title}
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-slate-800 block text-xs">
                                {projectName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Proyecto titular
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="text-[9.5px] font-extrabold uppercase font-mono bg-pink-50 text-rose-700 px-2 py-0.5 rounded border border-pink-150 inline-block">
                                {category}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150">
                                <Check className="w-2.5 h-2.5" />
                                <span>✓ GANADOR</span>
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 whitespace-nowrap">
                              {new Date(log.date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="p-3 text-right font-bold text-emerald-600 font-mono text-xs whitespace-nowrap">
                              +{log.prize.toFixed(2)}€
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {historyWonLog.length === 0 && (
              <div className="border border-dashed border-pink-200 rounded-xl p-6 text-center text-xs text-slate-500 bg-white/70">
                <Award className="w-8 h-8 text-rose-300 mx-auto mb-2" />
                Aún no has ganado un premio oficial de ronda de inversión. Participa en las sesiones de inversión rápida para competir con tu proyecto y calificar en las elecciones automatizadas.
              </div>
            )}
          </div>

      </div>

      <AnimatePresence>
        {hoveredMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative bg-transparent p-0 rounded-2xl shadow-2xl border-0 max-w-[280px] sm:max-w-xs max-h-[45vh] flex flex-col items-center justify-center z-10 overflow-hidden pointer-events-none"
            >
              {hoveredMedia.type === 'image' ? (
                <img
                  src={hoveredMedia.url}
                  alt="Vista Previa"
                  className="max-w-full max-h-[40vh] object-contain rounded-2xl shadow-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <video
                  src={hoveredMedia.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-w-full max-h-[40vh] object-contain rounded-2xl shadow-xl"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-indigo-500/30 animate-fade-in flex items-start gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 text-left min-w-0 font-sans">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Planificador de Proyectos</h4>
            <p className="text-xs text-slate-200 font-semibold leading-relaxed mt-0.5 whitespace-pre-line">
              {toastNotification.message}
            </p>
          </div>
          <button 
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-white transition cursor-pointer p-0.5 rounded-lg hover:bg-white/10 bg-transparent border-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
