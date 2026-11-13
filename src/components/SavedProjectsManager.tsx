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
  ParticipantState,
  HistoryWonRecord
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
  X,
  Download,
  Crown,
  Users
} from 'lucide-react';
import { generateProjectPDF } from '../utils/pdfGenerator';
import glamourHeroBackdrop from '../assets/images/glamour_history_hero_backdrop_1794565838319.jpg';
import goldCoinsStackImg from '../assets/images/gold_coins_stack_icon_1794565838068.jpg';

interface SavedProjectsProps {
  userProjects: ProjectData[];
  historyWonLog: HistoryWonRecord[];
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
  const [projectToDelete, setProjectToDelete] = useState<ProjectData | null>(null);
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

  // Calculate funded projects metrics
  const fundedProjectsList = userProjects.filter(p => {
    const fundingWon = getProjectFundingWon(p.id, p.title);
    return fundingWon > 0;
  });
  const totalFundedProjectsCount = fundedProjectsList.length;
  const fullyFundedProjectsCount = userProjects.filter(p => {
    const fundingWon = getProjectFundingWon(p.id, p.title);
    return fundingWon >= p.budget && p.budget > 0;
  }).length;
  const totalFundingWonAll = userProjects.reduce((acc, p) => acc + getProjectFundingWon(p.id, p.title), 0);

  // Controls for Slider de Proyectos Financiados
  const [sliderIndex, setSliderIndex] = useState<number>(0);
  const [sliderFilterMode, setSliderFilterMode] = useState<'funded_only' | 'all'>('funded_only');
  const displayFundedProjects = sliderFilterMode === 'funded_only' ? fundedProjectsList : userProjects;

  React.useEffect(() => {
    if (sliderIndex >= displayFundedProjects.length && displayFundedProjects.length > 0) {
      setSliderIndex(0);
    }
  }, [displayFundedProjects.length, sliderIndex]);

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
      sessionsList: { 
        id: string; 
        title: string; 
        date: string; 
        prize: number;
        votesReceived: number;
        coWinnersCount: number;
        coWinnersNames: string[];
        totalWinnersCount: number;
      }[];
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
        votesReceived: log.votesReceived ?? 7,
        coWinnersCount: log.coWinnersCount ?? 0,
        coWinnersNames: log.coWinnersNames || [],
        totalWinnersCount: log.totalWinnersCount ?? ((log.coWinnersCount ?? 0) + 1),
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
    if (editFundingGoal <= 0) {
      alert('⚠️ El objetivo de recaudación debe ser mayor a 0€.');
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

  const handleCoverImageUpload = (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen seleccionada supera los 10MB. Por favor selecciona una imagen más ligera.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64 && onUpdateProjects) {
        const updated = userProjects.map(p => {
          if (p.id === projectId) {
            const currentImages = p.images ? [...p.images] : [];
            return {
              ...p,
              images: [base64, ...currentImages.filter(img => img !== base64)]
            };
          }
          return p;
        });
        onUpdateProjects(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadProjectPDF = (proj: ProjectData) => {
    generateProjectPDF({
      project: {
        title: proj.title,
        category: proj.category,
        budget: proj.budget,
        fundingGoal: proj.fundingGoal,
        descriptionShort: proj.descriptionShort,
        descriptionLong: proj.descriptionLong,
        objective: proj.objective,
        fundUsage: proj.fundUsage,
        timeline: proj.timeline,
        team: proj.team,
        contactEmail: proj.contactEmail,
        contactPhone: proj.contactPhone,
      },
      authorName: userProfile?.name || proj.team?.[0]?.name || 'Ernesto V. S.'
    });
  };

  const handleDeleteProject = (projectId: string) => {
    const projToDelete = userProjects.find(p => p.id === projectId);
    if (!projToDelete) return;
    setProjectToDelete(projToDelete);
  };

  const confirmExecuteDelete = () => {
    if (!projectToDelete) return;
    const targetId = projectToDelete.id;
    const targetTitle = projectToDelete.title;

    if (!onUpdateProjects) {
      alert('Error: No se pudo actualizar el portafolio.');
      setProjectToDelete(null);
      return;
    }

    const nextProjects = userProjects.filter(p => p.id !== targetId);
    onUpdateProjects(nextProjects);

    // If currently editing, exit edit mode
    setIsEditing(false);

    // Update selectedProjectId
    if (nextProjects.length > 0) {
      const currentIndex = userProjects.findIndex(p => p.id === targetId);
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      setSelectedProjectId(nextProjects[nextIndex].id);
    } else {
      setSelectedProjectId('');
    }

    // Also update selectedProjectIds
    setSelectedProjectIds(prev => prev.filter(id => id !== targetId));

    setProjectToDelete(null);
    setToastNotification({
      message: `🗑️ El proyecto "${targetTitle}" ha sido eliminado correctamente.`
    });
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
    <div className="space-y-6 animate-fade-in text-left bg-gradient-to-br from-[#FFFDFC] via-[#FFF9FA] to-[#FFF0F4] p-5 sm:p-8 rounded-3xl border-2 border-pink-200/90 shadow-sm">
      
      {/* 👑 LUXURY HAUTE COUTURE HERO BANNER (MATCHING PANEL_DE_FINANZAS_Y_MODA_ELEGANTE_AD48950A.PNG) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFFDFC] via-[#FFF5F7] to-[#FFEBF2] border-2 border-pink-200/90 shadow-sm p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="z-10 max-w-xl space-y-4 text-left">
          <div className="flex items-center gap-3.5">
            {/* Brilliant Pink Diamond (without background layer) */}
            <img
              src="/assets/aistudio/pink_diamond_brilliant.png"
              alt="Diamante Proyectos Guardados"
              className="w-14 h-auto sm:w-16 object-contain shrink-0 filter drop-shadow-[0_4px_10px_rgba(244,63,94,0.32)] select-none"
              referrerPolicy="no-referrer"
            />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight leading-none">
              Proyectos<br className="hidden sm:inline" /> Guardados
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-lg">
            Aquí residen tus proyectos de moda registrados en la plataforma. Configura tu portafolio, haz un seguimiento rápido de tus victorias oficiales e invierte de forma directa en cualquiera de nuestras mesas activas.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigateToTab('create_project')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#e11d48] to-[#be185d] hover:from-[#be185d] hover:to-[#9f1239] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-900/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Proyecto</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Hero Fashion Model Photo - Clean Model Portrait Without Background Text */}
        <div className="relative md:w-1/2 lg:w-7/12 h-52 sm:h-64 md:h-72 w-full overflow-hidden rounded-2xl flex items-center justify-end">
          <img
            src="/assets/aistudio/hero_model_clean.png"
            alt="Haute Couture Fashion Model"
            className="w-full h-full object-cover object-right rounded-2xl shadow-sm filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDFC] via-transparent to-transparent md:block hidden pointer-events-none w-1/4" />
        </div>
      </div>

      {/* 3 STAT KPI CARDS (MATCHING CAPTURE WITH LUXURY PINK CIRCLES & GOLD DIAMONDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-pink-200/90 shadow-xs flex items-center justify-between relative group hover:shadow-md transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-500 shrink-0 shadow-inner">
              <Folder className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-sans">Proyectos Registrados</span>
              <strong className="text-2xl font-serif font-black text-slate-900">{userProjects.length}</strong>
            </div>
          </div>
          <span className="text-amber-500/70 text-xs self-end mb-1 select-none">💎</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-pink-200/90 shadow-xs flex items-center justify-between relative group hover:shadow-md transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-pink-50 border border-pink-200/60 flex items-center justify-center text-pink-600 shrink-0 shadow-inner">
              <Award className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-sans">Mesas Ganadas (80%)</span>
              <strong className="text-2xl font-serif font-black text-slate-900">{historyWonLog.length}</strong>
            </div>
          </div>
          <span className="text-amber-500/70 text-xs self-end mb-1 select-none">💎</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-pink-200/90 shadow-xs flex items-center justify-between relative group hover:shadow-md transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0 shadow-inner">
              <Coins className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-sans">Fondo Acumulado Ganado</span>
              <strong className="text-2xl font-serif font-black text-slate-900 font-mono">{totalPrizeWon.toFixed(2)}€</strong>
            </div>
          </div>
          <span className="text-amber-500/70 text-xs self-end mb-1 select-none">💎</span>
        </div>
      </div>

      <div className="w-full space-y-6">
        
        {/* SECTION A: DETAILED PROJECTS SAVED */}
          <div className="bg-white rounded-3xl border-2 border-pink-200/90 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 flex items-center gap-3">
                <Folder className="w-6 h-6 text-rose-500" />
                <span>Portafolio de Proyectos Guardados</span>
              </h3>
              <span className="text-[11px] font-mono font-bold bg-pink-50 border border-pink-200/80 px-3 py-1 rounded-full text-pink-700 self-start sm:self-auto flex items-center gap-1.5 shadow-2xs">
                <span>🔒</span> Guardado en Local & SEPA
              </span>
            </div>

            {/* Golden ornament divider */}
            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-amber-200/70"></div>
              <span className="absolute px-3 bg-white text-amber-500 text-xs select-none">💎</span>
            </div>

            {userProjects.length === 0 ? (
              <div className="border-2 border-dashed border-pink-200 rounded-2xl p-8 text-center space-y-3 bg-[#FFFDFE]">
                <Folder className="w-10 h-10 text-rose-300 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700">Ningún proyecto guardado aún</p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Antes de poder competir o gestionar tus finanzas en las mesas de inversión, debes dar de alta tu marca.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToTab('create_project')}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-full text-[11px] font-bold tracking-wide shadow-sm"
                >
                  Registrar mi primer proyecto ahora
                </button>
              </div>
            ) : (
              <div className="space-y-6 font-sans text-slate-800">
                {/* Visual Project Selection Deck */}
                <div className="space-y-3 relative p-4 sm:p-5 rounded-2xl bg-[#FFF9FA] border-2 border-pink-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider font-sans flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
                      SELECCIONA UN PROYECTO PARA INSPECCIONAR:
                    </span>
                    {/* Slider Navigation Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={scrollLeft}
                        className="w-8 h-8 rounded-full bg-white hover:bg-pink-50 border border-pink-250 text-slate-700 transition cursor-pointer active:scale-95 shadow-3xs flex items-center justify-center"
                        title="Deslizar a la izquierda"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={scrollRight}
                        className="w-8 h-8 rounded-full bg-white hover:bg-pink-50 border border-pink-250 text-slate-700 transition cursor-pointer active:scale-95 shadow-3xs flex items-center justify-center"
                        title="Deslizar a la derecha"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto pb-3 pt-1 gap-4 scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent scroll-smooth"
                  >
                    {userProjects.map((p, idx) => {
                      const isSelected = p.id === selectedProjectId;
                      const fundingWon = getProjectFundingWon(p.id, p.title);
                      const progressPercent = Math.min(100, (fundingWon / p.budget) * 100);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedProjectId(p.id);
                            setIsEditing(false);
                          }}
                          className={`portfolio-project-card project-card-btn tab-trigger text-left p-4 rounded-2xl border-2 transition-all duration-300 min-w-[230px] max-w-[260px] flex-1 cursor-pointer relative group bg-white ${
                            isSelected
                              ? 'border-pink-400 shadow-md shadow-pink-200/50 ring-2 ring-pink-200'
                              : 'border-pink-200/80 hover:border-pink-300 shadow-xs hover:shadow-sm'
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-2.5 right-2.5 bg-rose-500 text-white rounded-full p-1 shadow-sm flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                          <span className={`text-[9px] uppercase font-extrabold tracking-wider font-mono block mb-1.5 ${
                            isSelected ? 'text-rose-700' : 'text-slate-500'
                          }`}>
                            {p.category || 'Categoría'}
                          </span>
                          <strong className={`block text-xs sm:text-sm font-serif font-black leading-snug truncate ${
                            isSelected ? 'text-slate-900' : 'text-slate-800 group-hover:text-rose-950 transition-colors'
                          }`}>
                            {p.title || 'Proyecto Sin Título'}
                          </strong>
                          
                          <div className="mt-3.5 space-y-1.5">
                            <div className="flex justify-between items-center text-[9px]">
                              <span className={isSelected ? 'text-rose-700 font-bold' : 'text-slate-500 font-medium'}>Financiación:</span>
                              <span className={`font-black font-mono ${isSelected ? 'text-rose-950' : 'text-slate-700'}`}>
                                {progressPercent.toFixed(0)}%
                              </span>
                            </div>
                            <div className={`w-full h-2 rounded-full overflow-hidden ${isSelected ? 'bg-rose-50 border border-rose-200 shadow-inner' : 'bg-slate-100 border border-slate-200'}`}>
                              <div
                                className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r from-rose-500 to-pink-500`}
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
                        <div className="space-y-1 sm:col-span-2">
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
                        {editTeam.map((member, idx) => {
                          const lower = (member.name || '').toLowerCase();
                          const isErn = lower.includes('ernesto');
                          const isAdr = lower.includes('adriana');
                          const avatarUrl = member.avatar || (
                            isErn
                              ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
                              : isAdr
                                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                                : undefined
                          );
                          const displayName = isErn ? 'Ernesto V. S.' : member.name;

                          return (
                            <div key={`edit-team-${idx}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex justify-between items-start gap-2.5">
                              <div className="flex items-start gap-2.5">
                                {avatarUrl ? (
                                  <img
                                    src={avatarUrl}
                                    alt={displayName}
                                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                                    {displayName.slice(0, 2).toUpperCase()}
                                  </div>
                                )}
                                <div className="text-left space-y-0.5">
                                  <p className="font-bold text-slate-800">{displayName} <span className="font-medium text-slate-400 font-mono text-[9px]">({member.role})</span></p>
                                  <p className="text-[10px] text-slate-500 leading-tight">{member.experience}</p>
                                  {member.bio && <p className="text-[9px] bg-white p-1 rounded border leading-relaxed text-slate-500">{member.bio}</p>}
                                </div>
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
                          );
                        })}
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
                        className="rounded-3xl border-2 border-pink-200/90 bg-white overflow-hidden shadow-sm shadow-pink-100/50 animate-fade-in text-left block relative"
                      >
                        {/* HERO COVER BANNER */}
                        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-900 group">
                          {/* BUTTON WITH CAMERA TO CHANGE COVER IMAGE */}
                          <label
                            htmlFor={`cover-upload-${project.id}`}
                            className="absolute top-4 right-4 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/85 hover:bg-black text-white border border-white/20 backdrop-blur-md text-xs font-semibold shadow-lg cursor-pointer transition-all active:scale-95 hover:scale-105"
                            title="Cambiar imagen de portada"
                          >
                            <Camera className="w-4 h-4 text-white" />
                            <span className="text-[11px] font-medium tracking-wide">Cambiar Portada ✏️</span>
                            <input
                              id={`cover-upload-${project.id}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleCoverImageUpload(project.id, e)}
                            />
                          </label>

                          <img 
                            src={coverUrl || '/assets/aistudio/hero_model_clean.png'} 
                            alt={project.title} 
                            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700" 
                          />
                          {/* Subtle bottom gradient only behind text to preserve total clarity across the image */}
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                          {/* OVERLAY HEADER CONTENT */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end text-white pointer-events-none">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 bg-black/60 backdrop-blur-md text-white rounded-md border border-white/20 shadow-sm">
                                {project.category}
                              </span>
                            </div>
                            
                            <h4 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
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

                          {/* PREMIUM FINANCIALS ACUMULADOS PROGRESS CARD (MARCO ROSA PERLA) */}
                          <div className="p-5 bg-gradient-to-br from-white via-pink-50/15 to-rose-50/20 rounded-2xl border-2 border-pink-200/90 space-y-3.5 shadow-xs shadow-pink-100/30">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="text-[9px] uppercase font-mono font-bold text-pink-700 block tracking-wider">Financiación Acumulada Consensuada:</span>
                                <strong className="text-lg sm:text-xl font-bold text-slate-800 font-mono tracking-tight block mt-0.5">
                                  {fundingWon.toFixed(2)}€ <span className="text-xs font-normal text-slate-400">de {project.budget}€</span>
                                </strong>
                              </div>
                              <div className="text-left sm:text-right">
                                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block tracking-wider">Progreso de la Meta:</span>
                                <span className="text-sm font-extrabold text-pink-600 block mt-0.5 font-mono">{progressPercent.toFixed(1)}%</span>
                              </div>
                            </div>

                            {/* PROGRESS TRACK */}
                            <div className="relative w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ease-out ${
                                  isFullyFunded 
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                                    : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600'
                                }`} 
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-slate-450 border-t border-pink-100 pt-2.5">
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5 text-pink-500" />
                                <span>Meta de Presupuesto Rápido</span>
                              </span>
                              {isFullyFunded ? (
                                <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>¡Límite de Financiación Completado!</span>
                                </span>
                              ) : (
                                <span className="font-semibold text-slate-600">
                                  Faltan <strong className="text-pink-600 font-mono">{(project.budget - fundingWon).toFixed(2)}€</strong> para su tope
                                </span>
                              )}
                            </div>
                          </div>

                          {/* CORE SPECS GRID (MARCOS ROSA PERLA) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-4 bg-white rounded-xl border-2 border-pink-200/90 shadow-xs flex items-start gap-3">
                              <div className="p-2 bg-pink-50 rounded-lg text-pink-600 shrink-0 border border-pink-100">
                                <Coins className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Presupuesto Ref.</span>
                                <strong className="text-sm font-bold text-slate-800 font-mono block mt-0.5">{project.budget}€</strong>
                              </div>
                            </div>

                            <div className="p-4 bg-white rounded-xl border-2 border-pink-200/90 shadow-xs flex items-start gap-3">
                              <div className="p-2 bg-rose-50 rounded-lg text-rose-600 shrink-0 border border-rose-100">
                                <Award className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Objetivo Recaudación</span>
                                <strong className="text-sm font-bold text-pink-600 font-mono block mt-0.5">{project.fundingGoal || 'N/D'}€</strong>
                              </div>
                            </div>

                            <div className="p-4 bg-white rounded-xl border-2 border-pink-200/90 shadow-xs flex items-start gap-3 sm:col-span-2 lg:col-span-1">
                              <div className="p-2 bg-amber-50 rounded-lg text-amber-600 shrink-0 border border-amber-100">
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

                          {/* OBJECTIVE AND TIMELINE BENTO (MARCOS ROSA PERLA) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {project.objective && (
                              <div className="p-4 bg-white rounded-xl border-2 border-pink-200/90 text-left relative flex flex-col justify-between shadow-xs">
                                <span className="text-[9px] uppercase font-mono font-extrabold text-pink-700 tracking-wider block mb-1">🎯 Objetivo de la Propuesta</span>
                                <p className="text-xs text-slate-650 leading-relaxed italic font-medium pl-3 border-l-2 border-pink-400">
                                  "{project.objective}"
                                </p>
                              </div>
                            )}

                            {project.timeline && (
                              <div className="p-4 bg-white rounded-xl border-2 border-pink-200/90 text-left relative flex flex-col justify-between shadow-xs">
                                <span className="text-[9px] uppercase font-mono font-extrabold text-pink-700 tracking-wider block mb-1">📅 Cronograma de Lanzamiento</span>
                                <p className="text-xs text-slate-700 leading-normal font-semibold flex items-center gap-1.5 mt-1">
                                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shrink-0" />
                                  <span>{project.timeline}</span>
                                </p>
                              </div>
                            )}
                          </div>

                          {/* CONTACT DETAILS BOX (MARCO ROSA PERLA) */}
                          {(project.contactEmail || project.contactPhone) && (
                            <div className="p-4 bg-white rounded-xl border-2 border-pink-200/90 flex flex-wrap gap-4 text-xs font-sans text-slate-600 items-center shadow-xs">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Contacto Oficial:</span>
                              {project.contactEmail && (
                                <a href={`mailto:${project.contactEmail}`} className="flex items-center gap-1.5 text-pink-650 hover:underline font-medium">
                                  <Mail className="w-3.5 h-3.5 text-pink-500" />
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

                          {/* DOCUMENTACIÓN REGISTRADA (MARCO ROSA PERLA) */}
                          {project.documentationName && (
                            <div className="p-3.5 bg-white border-2 border-pink-200/90 rounded-xl flex flex-col gap-3 text-xs font-sans shadow-xs">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 shrink-0 border border-pink-100">
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
                                  className="w-full text-center py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold rounded-xl transition text-[10px] shadow-3xs cursor-pointer block"
                                >
                                  Descargar Dossier
                                </a>
                              )}
                            </div>
                          )}

                          {/* DETALLE: PRESUPUESTO DESGLOSADO (MARCO ROSA PERLA) */}
                          {selectedProjectId === project.id && project.budgetBreakdown && (
                            <div className="p-4 bg-white border-2 border-pink-200/90 rounded-xl space-y-2 text-left shadow-xs">
                              <span className="text-[10px] uppercase tracking-wider font-extrabold text-pink-700 font-mono block">Partidas Presupuestarias Registradas:</span>
                              <div className="divide-y divide-pink-100 bg-white rounded-xl border-2 border-pink-200/90 overflow-hidden font-mono text-[11px] shadow-3xs">
                                {project.budgetBreakdown.split('\n').filter(line => line.trim()).map((item, id) => {
                                  const parts = item.split(':');
                                  const name = parts[0]?.trim() || '';
                                  const value = parts[1]?.trim() || '';
                                  return (
                                    <div key={id} className="p-2.5 px-4 flex justify-between items-center text-slate-650 hover:bg-pink-50/20 transition">
                                      <span className="truncate flex-1 font-sans font-medium text-slate-700">{name}</span>
                                      <span className="font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded border border-pink-200/60">{value}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* MULTIMEDIA INTERACTIVA GALLERY (MARCOS ROSA PERLA) */}
                          {selectedProjectId === project.id && ((project.images && project.images.length > 0) || (project.videos && project.videos.length > 0)) && (
                            <div className="space-y-2.5 text-left">
                              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">Galería, Diseños & Multimedia:</span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {project.images?.map((imgUrl, i) => (
                                  <div 
                                    key={`gallery-img-${i}`} 
                                    onMouseEnter={() => setHoveredMedia({ url: imgUrl, type: 'image' })}
                                    onMouseLeave={() => setHoveredMedia(null)}
                                    className="relative h-20 sm:h-24 rounded-xl overflow-hidden border-2 border-pink-200/90 hover:border-pink-400 hover:shadow-md shrink-0 transition-all duration-300 hover:scale-[1.04] cursor-zoom-in group shadow-xs"
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
                                    className="relative h-20 sm:h-24 rounded-xl overflow-hidden border-2 border-pink-200/90 bg-slate-950 hover:border-pink-400 hover:shadow-md flex flex-col items-center justify-center p-2 text-center text-[10px] text-white font-sans transition-all duration-300 hover:scale-[1.04] cursor-zoom-in group shadow-xs"
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

                          {/* TEAM SECTION DISPLAY RICH (MARCOS ROSA PERLA) */}
                          {project.team && project.team.length > 0 && (
                            <div className="space-y-3 pt-2 text-left">
                              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">
                                Perfiles de Miembros del Equipo:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {project.team.map((member, i) => {
                                  const lowerName = (member.name || '').toLowerCase();
                                  const isErnesto = lowerName.includes('ernesto');
                                  const isAdriana = lowerName.includes('adriana');

                                  const memberAvatar = member.avatar || (
                                    isErnesto
                                      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
                                      : isAdriana
                                        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
                                        : undefined
                                  );

                                  const displayName = isErnesto ? 'Ernesto V. S.' : member.name;

                                  // Generate nice initials for avatar fallback
                                  const initials = displayName ? displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : 'M';
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
                                    <div key={i} className="p-4 bg-white border-2 border-pink-200/90 rounded-2xl flex items-start gap-3.5 hover:bg-pink-50/20 hover:border-pink-300 transition-all duration-300 shadow-xs">
                                      {memberAvatar ? (
                                        <div className="relative shrink-0">
                                          <img
                                            src={memberAvatar}
                                            alt={displayName}
                                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-pink-200 shadow-xs ring-1 ring-pink-100"
                                            referrerPolicy="no-referrer"
                                          />
                                        </div>
                                      ) : (
                                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs border shrink-0 ${avatarColor}`}>
                                          {initials}
                                        </div>
                                      )}
                                      <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex flex-wrap items-center justify-between gap-1">
                                          <span className="font-bold text-slate-800 text-xs truncate max-w-[130px]" title={displayName}>{displayName}</span>
                                          <span className="text-[8px] bg-pink-50 text-pink-700 font-bold px-2 py-0.5 rounded border border-pink-200">{member.role}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium leading-normal">{member.experience}</p>
                                        {member.bio && (
                                          <p className="text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-pink-200/80 leading-relaxed font-sans mt-1.5">
                                            {member.bio}
                                          </p>
                                        )}
                                        {member.profileLink && (
                                          <a href={member.profileLink} target="_blank" rel="noreferrer" className="text-[9px] text-pink-600 hover:underline flex items-center gap-1 font-bold mt-1.5">
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
                                type="button"
                                onClick={() => handleDownloadProjectPDF(project)}
                                style={{
                                  backgroundColor: '#fce7f3',
                                  backgroundImage: 'linear-gradient(135deg, #fff1f5 0%, #fce7f3 50%, #fbcfe8 100%)',
                                  borderColor: '#f472b6',
                                  color: '#831843'
                                }}
                                className="pearl-pink-btn custom-bg flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition active:scale-95 cursor-pointer font-sans shadow-3xs"
                                title="Descargar este proyecto en formato .pdf"
                              >
                                <Download className="w-3.5 h-3.5 text-pink-700" />
                                <span>Descargar PDF</span>
                              </button>

                              <button
                                type="button"
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
          <div className="bg-white rounded-2xl border-2 border-pink-200/90 p-6 shadow-xs space-y-4 animate-fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-600 animate-pulse" />
                <span>Proyectos Activos en Sesión (Participación y Pago Disparado)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Propuestas de moda que han abonado su cuota de custodia y se encuentran compitiendo activamente en las mesas de inversión.
              </p>
            </div>

            {activeSessionProjectsList.length === 0 ? (
              <div className="border-2 border-dashed border-pink-200 rounded-xl p-6 text-center text-xs text-slate-450 bg-pink-50/15">
                <p className="font-medium text-slate-600">No hay proyectos postulando en sesiones activas de tu perfil</p>
                <p className="text-[10px] text-slate-450 mt-1 max-w-md mx-auto">
                  Selecciona uno de tus proyectos en el carrusel de arriba y regístralo en cualquiera de las mesas disponibles en el panel derecho para disparar la cuota e iniciar la ronda.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-pink-100 rounded-xl border-2 border-pink-200/90 overflow-hidden bg-white">
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

          {/* SECTION B: WINNINGS HISTORY log (Luxury Pink Glamour Design matching Panel de Inversión con Glamour Rosa) */}
          <div className="rounded-[28px] overflow-hidden border border-[#f2c1d1] shadow-[0_18px_45px_rgba(176,14,79,0.16)] bg-[#ffeef5] transition-all">
            {/* TOP HERO BANNER: Deep Burgundy-Magenta Velvet + Model Portrait + Serif Title + Pearl KPI Badges */}
            <div className="relative overflow-hidden bg-[#5e062c] min-h-[195px] sm:min-h-[215px] flex flex-col justify-center">
              {/* Background Model & Runway Photo */}
              <img
                src={glamourHeroBackdrop}
                alt="Pasarela Glamour de Inversión"
                className="absolute inset-0 w-full h-full object-cover object-left select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />
              {/* Scrim for high-contrast serif legibility across center & right */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(64,4,30,0.12) 0%, rgba(88,6,40,0.72) 34%, rgba(122,10,59,0.88) 65%, rgba(145,14,72,0.84) 100%)'
                }}
              />

              {/* Hero Content Grid */}
              <div className="relative z-10 px-5 sm:px-8 pt-6 pb-10 sm:pb-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-5">
                {/* Left spacer over model portrait on desktop */}
                <div className="hidden lg:block lg:col-span-3" />

                {/* Center Editorial Serif Title & Subtitle */}
                <div className="lg:col-span-5 text-center space-y-2.5 pl-24 sm:pl-36 lg:pl-0">
                  <div className="flex justify-center">
                    <Crown className="w-5 h-5 text-amber-300 drop-shadow-[0_2px_6px_rgba(251,191,36,0.45)]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl xl:text-[28px] font-serif font-bold text-white leading-tight tracking-tight text-balance drop-shadow-sm">
                    Historial de Rondas de Inversión Ganadas
                  </h3>
                  <div className="flex items-center justify-center gap-2 py-0.5">
                    <span className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300/80" />
                    <span className="w-1.5 h-1.5 rotate-45 bg-amber-300/90" />
                    <span className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300/80" />
                  </div>
                  <p className="text-[11px] sm:text-xs text-rose-100/95 italic max-w-sm mx-auto leading-relaxed">
                    Registro exclusivo de tus éxitos comerciales. No se muestran proyectos que participaron pero no ganaron.
                  </p>
                </div>

                {/* Right KPI Capsule Cluster */}
                {historyWonLog.length > 0 && (
                  <div className="lg:col-span-4 flex flex-wrap lg:flex-col items-center lg:items-end justify-center gap-2.5">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-gradient-to-r from-[#fffafc] to-[#ffeaf2] border border-[#f5c7d9] rounded-full text-xs font-bold text-[#5c0b2e] shadow-md min-w-[185px]">
                      <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-serif text-[13px]">{historyWonLog.length} {historyWonLog.length === 1 ? 'Victoria' : 'Victorias'}</span>
                    </div>
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-gradient-to-r from-[#fffafc] to-[#ffeaf2] border border-[#f5c7d9] rounded-full text-xs font-bold text-[#5c0b2e] shadow-md min-w-[185px]">
                      <Folder className="w-4 h-4 text-[#8c1646] shrink-0" />
                      <span className="font-serif text-[13px]">{projectWinningsSummary.length} {projectWinningsSummary.length === 1 ? 'Proyecto Ganador' : 'Proyectos Ganadores'}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#fffafc] to-[#ffeaf2] border border-[#f5c7d9] rounded-full text-xs font-extrabold text-[#047857] font-mono tabular-nums shadow-md min-w-[185px]">
                      <img
                        src={goldCoinsStackImg}
                        alt="Monedas de oro"
                        className="w-5 h-5 object-contain mix-blend-multiply shrink-0"
                      />
                      <span>+{historyWonLog.reduce((acc, curr) => acc + curr.prize, 0).toFixed(2)}€ Acumulados</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Left Pink Diamond Accent on Wave Edge */}
              <img
                src="/assets/aistudio/pink_diamond_brilliant.png"
                alt="Diamante rosa"
                className="w-20 sm:w-28 h-auto object-contain absolute -bottom-2 left-2 sm:left-4 z-20 drop-shadow-[0_6px_14px_rgba(216,27,96,0.45)] pointer-events-none select-none"
                referrerPolicy="no-referrer"
              />

              {/* Curved Blush-Silk Bottom Wave Transition */}
              <svg
                viewBox="0 0 1440 64"
                preserveAspectRatio="none"
                className="w-full h-7 sm:h-9 block absolute bottom-0 inset-x-0 z-10 pointer-events-none"
              >
                <path
                  d="M0,26 C340,68 720,0 1440,36 L1440,64 L0,64 Z"
                  fill="#ffeef5"
                />
                <path
                  d="M0,26 C340,68 720,0 1440,36"
                  fill="none"
                  stroke="#f4d08c"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* SILK ROSE BODY AREA */}
            <div
              className="relative px-4 sm:px-7 pt-3 pb-7 space-y-5"
              style={{
                background: 'linear-gradient(180deg, #ffeef5 0%, #ffd8e8 50%, #ffc4dd 100%)'
              }}
            >
              {/* Subtle Right Silk Diamond Ornament */}
              <img
                src="/assets/aistudio/pink_diamond_brilliant.png"
                alt=""
                aria-hidden="true"
                className="hidden md:block w-16 h-auto object-contain absolute top-6 right-5 z-0 opacity-90 drop-shadow-[0_4px_10px_rgba(190,24,93,0.28)] pointer-events-none select-none rotate-[8deg]"
                referrerPolicy="no-referrer"
              />

              {/* BARRA DE HERRAMIENTAS, BÚSQUEDA Y FILTRADO */}
              {historyWonLog.length > 0 && (
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Rounded White Search Input */}
                  <div className="relative flex-1 max-w-md min-w-[220px]">
                    <Search className="w-4 h-4 text-[#9d174d] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={historySearchQuery}
                      onChange={(e) => setHistorySearchQuery(e.target.value)}
                      placeholder="Buscar por proyecto, sesión..."
                      className="w-full pl-10.5 pr-9 py-2.5 text-xs italic bg-white/95 border border-[#f5c0d4] rounded-full text-[#3b0a22] placeholder-[#9d174d]/60 shadow-sm focus:outline-hidden focus:border-[#d81b60] focus:bg-white transition"
                    />
                    {historySearchQuery && (
                      <button
                        type="button"
                        onClick={() => setHistorySearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9d174d]/70 hover:text-[#9d174d] p-0.5 rounded-full cursor-pointer"
                        title="Borrar búsqueda"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Right Stacked/Aligned Filter Controls */}
                  <div className="flex flex-wrap items-center gap-2.5 lg:pr-16">
                    {/* Selector de Proyecto */}
                    <select
                      value={historySelectedProjectFilter}
                      onChange={(e) => setHistorySelectedProjectFilter(e.target.value)}
                      className="text-xs bg-white/95 border border-[#e86da0] text-[#4c0524] rounded-full px-4 py-2 font-semibold focus:outline-hidden focus:border-[#be185d] cursor-pointer shadow-sm max-w-[240px] truncate"
                    >
                      <option value="all">Todos los proyectos ({projectWinningsSummary.length})</option>
                      {projectWinningsSummary.map(p => (
                        <option key={p.projectId} value={p.projectId}>
                          {p.projectTitle} ({p.winCount} {p.winCount === 1 ? 'victoria' : 'victorias'} · +{p.totalPrize.toFixed(2)}€)
                        </option>
                      ))}
                    </select>

                    {/* Toggle de Modo de Vista */}
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setHistoryViewMode('by_project')}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition cursor-pointer whitespace-nowrap shrink-0 ${
                          historyViewMode === 'by_project'
                            ? 'bg-gradient-to-r from-[#d81b60] to-[#ad1457] text-white border-[#9c0d49] shadow-md'
                            : 'bg-white/90 text-[#4c0524] border-[#f3bfd4] hover:bg-white'
                        }`}
                        title="Vista agrupada por proyecto"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Por Proyecto</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setHistoryViewMode('table')}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition cursor-pointer whitespace-nowrap shrink-0 ${
                          historyViewMode === 'table'
                            ? 'bg-gradient-to-r from-[#d81b60] to-[#ad1457] text-white border-[#9c0d49] shadow-md'
                            : 'bg-white/90 text-[#4c0524] border-[#f3bfd4] hover:bg-white'
                        }`}
                        title="Vista de lista cronológica"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Todas las Rondas</span>
                      </button>
                    </div>

                    {/* Botones de Expandir / Contraer todos (solo visible en modo by_project con múltiples proyectos) */}
                    {historyViewMode === 'by_project' && filteredProjectSummaries.length > 1 && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <button
                          type="button"
                          onClick={() => expandAllProjects(filteredProjectSummaries.map(p => p.projectId))}
                          className="px-3 py-1.5 bg-white/90 hover:bg-white border border-[#f3bfd4] rounded-xl text-[#4c0524] font-semibold cursor-pointer transition shadow-2xs"
                        >
                          Expandir
                        </button>
                        <button
                          type="button"
                          onClick={() => collapseAllProjects(filteredProjectSummaries.map(p => p.projectId))}
                          className="px-3 py-1.5 bg-white/90 hover:bg-white border border-[#f3bfd4] rounded-xl text-[#4c0524] font-semibold cursor-pointer transition shadow-2xs"
                        >
                          Contraer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VISTA 1: AGRUPADA POR PROYECTO (Luxury Card with Gold Metallic Hairline Border) */}
              {historyWonLog.length > 0 && historyViewMode === 'by_project' && (
                <div className="relative z-10 space-y-4">
                  {filteredProjectSummaries.length === 0 ? (
                    <div className="bg-white/95 border-[1.5px] border-[#e6be78]/85 rounded-[22px] p-8 text-center text-xs text-slate-600 shadow-md">
                      No se encontraron proyectos con victorias que coincidan con los filtros seleccionados.
                      <button
                        type="button"
                        onClick={() => { setHistorySearchQuery(''); setHistorySelectedProjectFilter('all'); }}
                        className="block mx-auto mt-2.5 text-[#c2185b] font-bold hover:underline cursor-pointer"
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
                          className="bg-white/98 rounded-[22px] border-[1.5px] border-[#e6be78]/90 shadow-[0_14px_34px_rgba(176,14,79,0.12)] overflow-hidden transition-all"
                        >
                          {/* Cabecera del Proyecto */}
                          <div
                            onClick={() => toggleProjectAccordion(pSummary.projectId)}
                            className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#fff9fb] transition-colors select-none"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-13 h-13 rounded-full bg-gradient-to-br from-[#fffaf0] via-[#fef2d0] to-[#fae1a4] border-2 border-[#e2b85f] flex items-center justify-center shrink-0 shadow-sm">
                                <Trophy className="w-6 h-6 text-[#d97706]" />
                              </div>
                              <div className="min-w-0 space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#e11d74] to-[#be185d] text-white px-3.5 py-1 rounded-full shadow-2xs">
                                    {pSummary.projectCategory || 'Proyecto de Moda'}
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 bg-[#e8faf1] text-[#047857] text-[11px] font-bold px-3 py-0.5 rounded-full border border-[#a7f3d0]">
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>Ha ganado {pSummary.winCount} {pSummary.winCount === 1 ? 'vez' : 'veces'}</span>
                                  </span>
                                </div>
                                <h4 className="font-serif font-bold text-slate-900 text-lg sm:text-xl leading-tight truncate" title={pSummary.projectTitle}>
                                  {pSummary.projectTitle}
                                </h4>
                              </div>
                            </div>

                            {/* Métricas y Control de Apertura */}
                            <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-pink-100">
                              <div className="text-left md:text-right">
                                <span className="text-[10px] text-[#d81b60] font-bold uppercase tracking-wider block">Sesiones ganadas</span>
                                <span className="text-sm font-bold text-slate-800 inline-flex items-center gap-1.5 mt-0.5">
                                  <Layers className="w-3.5 h-3.5 text-[#8c1646]" />
                                  <span>{pSummary.sessionsList.length} {pSummary.sessionsList.length === 1 ? 'sesión' : 'sesiones'}</span>
                                </span>
                              </div>

                              <div className="hidden sm:block h-9 w-px bg-pink-100" />

                              <div className="text-right">
                                <span className="text-[10px] text-[#d81b60] font-bold uppercase tracking-wider block">Total hasta la fecha</span>
                                <span className="text-lg sm:text-xl font-black text-[#047857] font-mono tabular-nums block mt-0.5">
                                  +{pSummary.totalPrize.toFixed(2)}€
                                </span>
                              </div>

                              <div className="pl-1">
                                <div className={`w-9 h-9 rounded-xl bg-[#fff0f6] border border-[#f5c2d7] text-[#be185d] flex items-center justify-center transition-transform duration-200 shadow-2xs ${isOpen ? 'rotate-180 bg-[#ffe4ef]' : ''}`}>
                                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Desglose de Sesiones */}
                          {isOpen && (
                            <div className="border-t border-[#f8d7e5] bg-white px-5 sm:px-6 pb-5 sm:pb-6 pt-4 space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-xs sm:text-[13px] font-bold text-slate-900 flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-[#d81b60]" />
                                  <span>Sesiones y Rondas en las que ha ganado ({pSummary.sessionsList.length}):</span>
                                </span>
                              </div>

                              <div className="overflow-x-auto rounded-2xl border border-[#f5c8db] bg-white shadow-2xs">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="bg-gradient-to-r from-[#ffe6f0] via-[#ffdce9] to-[#ffe6f0] text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wide text-[#c2185b] border-b border-[#f5c8db]">
                                      <th className="p-3">Sesión / Ronda</th>
                                      <th className="p-3">Fecha de Consumación</th>
                                      <th className="p-3 text-center">Estado</th>
                                      <th className="p-3 text-center">Votos Obtenidos</th>
                                      <th className="p-3 text-center">Otros Ganadores Contigo</th>
                                      <th className="p-3 text-right">Premio (80%)</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-pink-100 text-xs">
                                    {pSummary.sessionsList.map((sess, idx) => (
                                      <tr key={sess.id + '-' + idx} className="hover:bg-[#fff9fb] transition-colors">
                                        <td className="p-3.5 font-bold text-slate-900">
                                          <div className="flex items-center gap-2.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                                            <span>{sess.title}</span>
                                          </div>
                                        </td>
                                        <td className="p-3.5 text-slate-600 whitespace-nowrap font-medium">
                                          {new Date(sess.date).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </td>
                                        <td className="p-3.5 text-center whitespace-nowrap">
                                          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-[#047857] bg-[#edfcf4] px-3 py-1 rounded-lg border border-[#86efac]">
                                            <Check className="w-3 h-3 stroke-[2.5]" />
                                            <span>GANADOR</span>
                                          </span>
                                        </td>
                                        <td className="p-3.5 text-center whitespace-nowrap">
                                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#4c1d95] bg-[#f7f4ff] border border-[#ddd6fe] px-2.5 py-1 rounded-lg font-mono tabular-nums">
                                            <span>🗳️</span>
                                            <span>{sess.votesReceived ?? 7} {sess.votesReceived === 1 ? 'voto' : 'votos'}</span>
                                          </span>
                                        </td>
                                        <td className="p-3.5 text-center whitespace-nowrap">
                                          {(sess.coWinnersCount ?? 0) > 0 ? (
                                            <span
                                              className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-3 py-1 rounded-lg"
                                              title={sess.coWinnersNames && sess.coWinnersNames.length > 0 ? `Co-ganadores: ${sess.coWinnersNames.join(', ')}` : undefined}
                                            >
                                              <span>👥</span>
                                              <span>{sess.coWinnersCount} {sess.coWinnersCount === 1 ? 'persona más' : 'personas más'} ({(sess.coWinnersCount || 0) + 1} total)</span>
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-[#047857] bg-[#edfcf4] border border-[#a7f3d0] px-3 py-1 rounded-lg">
                                              <span>🥇</span>
                                              <span>Ganador único</span>
                                            </span>
                                          )}
                                        </td>
                                        <td className="p-3.5 text-right font-extrabold text-[#047857] font-mono tabular-nums text-xs sm:text-sm whitespace-nowrap">
                                          +{sess.prize.toFixed(2)}€
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Resumen del proyecto al pie */}
                              <div className="rounded-2xl bg-gradient-to-r from-[#fff3f8] via-[#ffeef5] to-[#ffe7f0] border border-[#f5c2d7] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1.5 text-xs text-slate-700">
                                  <div>
                                    Este proyecto ha obtenido <strong className="text-slate-900">{pSummary.winCount} {pSummary.winCount === 1 ? 'victoria oficial' : 'victorias oficiales'}</strong> en <strong className="text-slate-900">{pSummary.sessionsList.length} {pSummary.sessionsList.length === 1 ? 'sesión' : 'sesiones'}</strong> de inversión.
                                  </div>
                                  <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <span className="inline-flex items-center gap-1.5">
                                      <TrendingUp className="w-3.5 h-3.5 text-[#8c1646]" />
                                      <span>Votos conseguidos: <strong className="text-slate-900 tabular-nums">{pSummary.sessionsList.map(s => s.votesReceived ?? 7).join(', ')} votos</strong></span>
                                    </span>
                                    <span aria-hidden="true">·</span>
                                    <span className="inline-flex items-center gap-1.5">
                                      <Users className="w-3.5 h-3.5 text-[#8c1646]" />
                                      <span>
                                        Co-ganadores: <strong className="text-slate-900">
                                          {pSummary.sessionsList.some(s => (s.coWinnersCount ?? 0) > 0)
                                            ? `${pSummary.sessionsList.reduce((acc, s) => acc + (s.coWinnersCount ?? 0), 0)} persona(s) adicional(es) en empate`
                                            : '0 (victoria exclusiva sin otros ganadores)'}
                                        </strong>
                                      </span>
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 sm:border-l sm:border-[#e6be78]/60 sm:pl-5 shrink-0">
                                  <div className="text-left sm:text-right">
                                    <span className="text-[11px] font-bold text-slate-800 block">Total acumulado:</span>
                                    <span className="text-xl sm:text-2xl font-black text-[#047857] font-mono tabular-nums leading-none">
                                      +{pSummary.totalPrize.toFixed(2)}€
                                    </span>
                                  </div>
                                  <img
                                    src={goldCoinsStackImg}
                                    alt="Monedas acumuladas"
                                    className="w-11 h-11 object-contain mix-blend-multiply shrink-0"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* VISTA 2: CRONOLÓGICA GENERAL */}
              {historyWonLog.length > 0 && historyViewMode === 'table' && (
                <div className="relative z-10 overflow-x-auto rounded-[22px] border-[1.5px] border-[#e6be78]/90 bg-white/98 shadow-[0_14px_34px_rgba(176,14,79,0.12)]">
                  {filteredHistoryWonLog.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-600">
                      No hay rondas que coincidan con la búsqueda.
                      <button
                        type="button"
                        onClick={() => { setHistorySearchQuery(''); setHistorySelectedProjectFilter('all'); }}
                        className="block mx-auto mt-2.5 text-[#c2185b] font-bold hover:underline cursor-pointer"
                      >
                        Restablecer filtros
                      </button>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#ffe6f0] via-[#ffdce9] to-[#ffe6f0] text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wide text-[#c2185b] border-b border-[#f5c8db]">
                          <th className="p-3.5">Código / Ronda</th>
                          <th className="p-3.5">Proyecto Ganador</th>
                          <th className="p-3.5">Categoría</th>
                          <th className="p-3.5">Estado</th>
                          <th className="p-3.5">Votos Obtenidos</th>
                          <th className="p-3.5">Otros Ganadores Contigo</th>
                          <th className="p-3.5">Fecha de Consumación</th>
                          <th className="p-3.5 text-right">Premio (80%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-pink-100 text-xs">
                        {filteredHistoryWonLog.map((log) => {
                          const projSummary = projectWinningsSummary.find(p => p.projectId === log.projectId || p.projectTitle === log.projectName)
                            || projectWinningsSummary[0];
                          const projectName = log.projectName || projSummary?.projectTitle || userProjects[0]?.title || 'Eco-Fashion Runway';
                          const category = projSummary?.projectCategory || 'Moda';

                          return (
                            <tr key={log.id} className="hover:bg-[#fff9fb] transition-colors">
                              <td className="p-3.5 font-bold text-slate-900">
                                {log.title}
                              </td>
                              <td className="p-3.5">
                                <span className="font-serif font-bold text-slate-900 block text-xs sm:text-sm">
                                  {projectName}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  Proyecto titular
                                </span>
                              </td>
                              <td className="p-3.5">
                                <span className="text-[9.5px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#e11d74] to-[#be185d] text-white px-2.5 py-0.5 rounded-full inline-block">
                                  {category}
                                </span>
                              </td>
                              <td className="p-3.5 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#047857] bg-[#edfcf4] px-2.5 py-1 rounded-lg border border-[#86efac]">
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                  <span>GANADOR</span>
                                </span>
                              </td>
                              <td className="p-3.5 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#4c1d95] bg-[#f7f4ff] border border-[#ddd6fe] px-2.5 py-1 rounded-lg font-mono tabular-nums">
                                  🗳️ {log.votesReceived ?? 7} {log.votesReceived === 1 ? 'voto' : 'votos'}
                                </span>
                              </td>
                              <td className="p-3.5 whitespace-nowrap">
                                {(log.coWinnersCount ?? 0) > 0 ? (
                                  <span
                                    className="inline-flex items-center gap-1 text-[10.5px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg"
                                    title={log.coWinnersNames && log.coWinnersNames.length > 0 ? `Co-ganadores: ${log.coWinnersNames.join(', ')}` : undefined}
                                  >
                                    👥 {log.coWinnersCount} {log.coWinnersCount === 1 ? 'persona más' : 'personas más'} ({(log.coWinnersCount || 0) + 1} total)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#047857] bg-[#edfcf4] border border-[#a7f3d0] px-2.5 py-1 rounded-lg">
                                    🥇 Ganador único
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 text-slate-600 whitespace-nowrap">
                                {new Date(log.date).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="p-3.5 text-right font-extrabold text-[#047857] font-mono tabular-nums text-xs sm:text-sm whitespace-nowrap">
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
                <div className="relative z-10 border-[1.5px] border-dashed border-[#e6be78] rounded-[22px] p-8 text-center text-xs text-slate-600 bg-white/95 shadow-sm">
                  <Award className="w-9 h-9 text-[#d81b60]/50 mx-auto mb-2.5" />
                  Aún no has ganado un premio oficial de ronda de inversión. Participa en las sesiones de inversión rápida para competir con tu proyecto y calificar en las elecciones automatizadas.
                </div>
              )}
            </div>

            {/* BOTTOM LUXURY SILK RIBBON FOOTER */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#830b47] via-[#b81260] to-[#7a093b] border-t border-[#e6be78]/70 py-3.5 px-6 flex items-center justify-center">
              <img
                src="/assets/aistudio/pink_diamond_brilliant.png"
                alt=""
                aria-hidden="true"
                className="w-14 h-auto object-contain absolute -bottom-2 -left-1 opacity-85 -rotate-12 pointer-events-none select-none"
                referrerPolicy="no-referrer"
              />
              <img
                src="/assets/aistudio/pink_diamond_brilliant.png"
                alt=""
                aria-hidden="true"
                className="w-14 h-auto object-contain absolute -bottom-2 -right-1 opacity-85 rotate-12 pointer-events-none select-none"
                referrerPolicy="no-referrer"
              />
              <div className="relative z-10 flex flex-col items-center gap-1 text-center">
                <Crown className="w-4 h-4 text-amber-300" />
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-100/95">
                  Fashion · Finance · Success
                </span>
              </div>
            </div>
          </div>

          {/* TOTAL DE PROYECTOS FINANCIADOS (Debajo del recuadro de historial y rondas ganadas) */}
          <div className="bg-gradient-to-br from-white via-sky-50/30 to-sky-100/40 rounded-2xl border border-sky-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-150 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm shadow-sky-200">
                  <Trophy className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Total de Proyectos Financiados
                    </h4>
                    <span className="text-[11px] font-mono font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200">
                      {totalFundedProjectsCount} de {userProjects.length} {userProjects.length === 1 ? 'proyecto' : 'proyectos'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Resumen consolidado de propuestas con financiamiento asegurado en rondas de votación
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-white border border-sky-200 rounded-xl px-4 py-2 text-right shadow-3xs">
                  <span className="text-[9px] uppercase font-bold text-sky-700 block font-mono">Capital Total Financiado</span>
                  <strong className="text-sm sm:text-base font-black text-emerald-600 font-mono">
                    +{totalFundingWonAll.toFixed(2)}€
                  </strong>
                </div>
              </div>
            </div>

            {/* CONTROLES Y FILTROS DEL SLIDER */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSliderFilterMode('funded_only');
                    setSliderIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    sliderFilterMode === 'funded_only'
                      ? 'bg-white text-sky-800 shadow-3xs border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Solo Financiados ({totalFundedProjectsCount})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSliderFilterMode('all');
                    setSliderIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    sliderFilterMode === 'all'
                      ? 'bg-white text-sky-800 shadow-3xs border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos en Slider ({userProjects.length})
                </button>
              </div>

              {displayFundedProjects.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {sliderIndex + 1} / {displayFundedProjects.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSliderIndex(prev => (prev > 0 ? prev - 1 : displayFundedProjects.length - 1))}
                      className="p-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg shadow-3xs transition active:scale-95 cursor-pointer"
                      title="Proyecto anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSliderIndex(prev => (prev < displayFundedProjects.length - 1 ? prev + 1 : 0))}
                      className="p-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg shadow-3xs transition active:scale-95 cursor-pointer"
                      title="Siguiente proyecto"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SLIDER DE PROYECTOS FINANCIADOS */}
            {displayFundedProjects.length === 0 ? (
              <div className="text-center p-8 bg-white/80 rounded-2xl border border-dashed border-sky-200 text-xs text-slate-500 space-y-3">
                <p className="max-w-md mx-auto">
                  Aún no dispones de proyectos con financiación asegurada en sesiones de inversión. Compite en las sesiones para acumular el 80% de cada bote.
                </p>
                {userProjects.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSliderFilterMode('all');
                      setSliderIndex(0);
                    }}
                    className="px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl font-bold transition shadow-3xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-600" />
                    <span>Ver tus proyectos en el slider ({userProjects.length})</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait">
                  {(() => {
                    const proj = displayFundedProjects[sliderIndex] || displayFundedProjects[0];
                    if (!proj) return null;

                    const fundingWon = getProjectFundingWon(proj.id, proj.title);
                    const percent = Math.min(100, (fundingWon / proj.budget) * 100);
                    const isFunded = fundingWon > 0;
                    const isComplete = fundingWon >= proj.budget && proj.budget > 0;
                    const winsCount = historyWonLog.filter(l => l.projectId === proj.id || l.projectName === proj.title).length;
                    const coverImage = proj.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';

                    return (
                      <motion.div
                        key={proj.id + '-' + sliderIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="bg-white rounded-2xl border border-sky-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 gap-0"
                      >
                        {/* SLIDER IMAGE SECTION */}
                        <div className="relative md:col-span-5 h-56 md:h-auto min-h-[220px] bg-slate-900 overflow-hidden group">
                          <img
                            src={coverImage}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2">
                            <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 bg-black/40 backdrop-blur-md text-white rounded-md border border-white/10 font-mono">
                              {proj.category || 'Proyecto'}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-sm font-mono flex items-center gap-1 ${
                              isComplete 
                                ? 'bg-emerald-500 text-white border-emerald-400' 
                                : isFunded 
                                  ? 'bg-sky-500 text-white border-sky-400'
                                  : 'bg-slate-800/80 text-slate-300 border-white/20'
                            }`}>
                              {isComplete ? '🎉 100% Financiado' : isFunded ? `${percent.toFixed(0)}% Financiado` : 'En captación'}
                            </span>
                          </div>

                          {/* Bottom image overlay */}
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-1">
                              <Trophy className="w-3.5 h-3.5" />
                              <span>{winsCount} {winsCount === 1 ? 'Victoria en ronda' : 'Victorias en rondas'}</span>
                            </div>
                            <h4 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-1">
                              {proj.title}
                            </h4>
                          </div>
                        </div>

                        {/* SLIDER CONTENT / DETAILS SECTION */}
                        <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded font-mono inline-block mb-1">
                                  {proj.category}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                  {proj.title}
                                </h3>
                              </div>
                              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                                ID: {proj.id.slice(0, 8)}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {proj.descriptionShort || proj.descriptionLong || 'Propuesta de moda y financiamiento para rondas de inversión en pasarela.'}
                            </p>

                            {/* FINANCIAL BREAKDOWN CARDS */}
                            <div className="grid grid-cols-3 gap-2 pt-1">
                              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5">
                                <span className="text-[9px] uppercase font-bold text-emerald-800 block font-mono">Financiado</span>
                                <strong className="text-xs sm:text-sm font-black text-emerald-700 font-mono block truncate">
                                  +{fundingWon.toFixed(2)}€
                                </strong>
                              </div>
                              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                                <span className="text-[9px] uppercase font-bold text-slate-600 block font-mono">Presupuesto</span>
                                <strong className="text-xs sm:text-sm font-black text-slate-800 font-mono block truncate">
                                  {proj.budget.toFixed(2)}€
                                </strong>
                              </div>
                              <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-2.5">
                                <span className="text-[9px] uppercase font-bold text-sky-800 block font-mono">Restante</span>
                                <strong className="text-xs sm:text-sm font-black text-sky-700 font-mono block truncate">
                                  {Math.max(0, proj.budget - fundingWon).toFixed(2)}€
                                </strong>
                              </div>
                            </div>

                            {/* PROGRESS BAR */}
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-slate-500 font-medium">Progreso de Financiación</span>
                                <span className="font-extrabold text-sky-900">{percent.toFixed(1)}%</span>
                              </div>
                              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200/70">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isComplete 
                                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                                      : 'bg-gradient-to-r from-sky-500 to-indigo-500'
                                  }`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* SLIDER CARD ACTIONS */}
                          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProjectId(proj.id);
                                  if (!selectedProjectIds.includes(proj.id)) {
                                    setSelectedProjectIds([proj.id]);
                                  }
                                  window.scrollTo({ top: 400, behavior: 'smooth' });
                                }}
                                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-3xs"
                              >
                                <Eye className="w-3.5 h-3.5 text-sky-300" />
                                <span>Inspeccionar</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadProjectPDF(proj)}
                                style={{
                                  backgroundColor: '#fce7f3',
                                  backgroundImage: 'linear-gradient(135deg, #fff1f5 0%, #fce7f3 50%, #fbcfe8 100%)',
                                  borderColor: '#f472b6',
                                  color: '#831843'
                                }}
                                className="pearl-pink-btn custom-bg px-3.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-3xs"
                                title="Descargar dossier del proyecto en PDF"
                              >
                                <Download className="w-3.5 h-3.5 text-pink-700" />
                                <span>Descargar PDF</span>
                              </button>
                            </div>

                            <span className="text-[10px] font-medium text-slate-400">
                              Usa las flechas o puntos
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                {/* OVERLAY SLIDER ARROWS */}
                {displayFundedProjects.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setSliderIndex(prev => (prev > 0 ? prev - 1 : displayFundedProjects.length - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-md flex items-center justify-center transition active:scale-95 cursor-pointer z-10"
                      title="Anterior"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSliderIndex(prev => (prev < displayFundedProjects.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-md flex items-center justify-center transition active:scale-95 cursor-pointer z-10"
                      title="Siguiente"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-700" />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* PAGINATION DOTS INDICATOR */}
            {displayFundedProjects.length > 1 && (
              <div className="flex items-center justify-center gap-2 pt-1">
                {displayFundedProjects.map((p, idx) => (
                  <button
                    key={p.id + '-' + idx}
                    type="button"
                    onClick={() => setSliderIndex(idx)}
                    className={`transition-all rounded-full cursor-pointer ${
                      sliderIndex === idx 
                        ? 'w-7 h-2.5 bg-sky-600 shadow-xs' 
                        : 'w-2.5 h-2.5 bg-sky-200 hover:bg-sky-300'
                    }`}
                    title={`Ir al proyecto ${idx + 1}: ${p.title}`}
                  />
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 bg-white/90 p-3 rounded-xl border border-sky-150 gap-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>Total de proyectos financiados: <strong>{totalFundedProjectsCount} de {userProjects.length}</strong></span>
              </span>
              {fullyFundedProjectsCount > 0 && (
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                  🎉 {fullyFundedProjectsCount} {fullyFundedProjectsCount === 1 ? 'proyecto con 100% de presupuesto completado' : 'proyectos con 100% de presupuesto completados'}
                </span>
              )}
            </div>
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

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR PROYECTO */}
      {projectToDelete && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-150 space-y-4 animate-scale-up text-left">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0 shadow-3xs">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  ¿Eliminar este proyecto?
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Esta acción es definitiva y no se puede deshacer.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-rose-50/60 rounded-xl p-3.5 border border-rose-100 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  {projectToDelete.category || 'Proyecto'}
                </span>
                <span className="font-bold text-slate-800 truncate">
                  {projectToDelete.title}
                </span>
              </div>
              {hasEnteredAnySession(projectToDelete.id) ? (
                <p className="text-[11px] text-amber-800 leading-relaxed font-sans bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  ⚠️ <strong>Aviso:</strong> Este proyecto ya ha participado o está participando en mesas de inversión. Se conservará en el historial de las mesas pero desaparecerá de tu portafolio personal.
                </p>
              ) : (
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  Se eliminarán todos los datos, multimedia asociada, presupuestos y perfiles de staff vinculados a este registro.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmExecuteDelete}
                className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sí, Eliminar Proyecto</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
