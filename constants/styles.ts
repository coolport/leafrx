import { StyleSheet } from 'react-native';
import { ThemeColors } from './theme';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screen: {
      flex: 1,
    },
    
    // Header
    header: {
      paddingBottom: 24,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      // Shadows for depth
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 10,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
      paddingHorizontal: 24,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: '#fff',
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: 15,
      color: 'rgba(255,255,255,0.85)',
      fontWeight: '500',
    },
    bellBtn: {
      backgroundColor: 'rgba(255,255,255,0.25)',
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    healthOverview: {
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: 20,
      borderRadius: 24,
      marginHorizontal: 24,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    },
    healthOverviewTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    healthLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: '#fff',
    },
    healthScore: {
      fontSize: 32,
      fontWeight: '800',
      color: '#fff',
    },
    healthBadges: {
      flexDirection: 'row',
      gap: 12,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#fff',
    },
  
    // Sections
    section: {
      paddingHorizontal: 24,
      paddingVertical: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: -0.3,
    },
    viewAll: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
  
    // Quick Actions
    quickActions: {
      flexDirection: 'row',
      gap: 16,
    },
    actionBtn: {
      flex: 1,
      paddingVertical: 24,
      paddingHorizontal: 16,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    actionBtnText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#fff',
    },
    actionIconBg: {
      width: 54,
      height: 54,
      backgroundColor: 'rgba(255,255,255,0.25)',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
    },
  
    // Plant Cards
    plantCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    plantIcon: {
      width: 60,
      height: 60,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    plantInfo: {
      flex: 1,
    },
    plantName: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    plantMeta: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    lastCheckedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    plantHealth: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 56,
      height: 56,
    },
    healthScoreText: {
      fontSize: 16,
      fontWeight: '800',
    },
    lastChecked: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.textMuted,
    },
  
    // Recent Scans
    scanDate: {
      fontSize: 12,
      color: colors.textMuted,
    },

    // Recent Scans (New Card Style)
    recentScanCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    recentScanIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    recentScanInfo: {
        flex: 1,
    },
    recentScanPlantName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 2,
    },
    recentScanDisease: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    recentScanDate: {
        fontSize: 13,
        color: colors.textMuted,
        fontWeight: '500',
    },
  
    // Page Header
    pageHeader: {
      backgroundColor: colors.card,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    pageTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    pageSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  
    // Chips Container
    chipsScroll: {
        paddingBottom: 8,
    },
    filterPill: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      backgroundColor: colors.border,
      borderRadius: 20,
      marginRight: 8,
    },
    filterPillActive: {
      backgroundColor: colors.primary,
    },
    filterPillText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    filterPillTextActive: {
      color: '#fff',
    },
  
    // Progress Bar
    progressBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      marginTop: 8,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
    },
    plantCardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    plantCardFooterText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  
    // Detail Header
    detailHeader: {
      backgroundColor: colors.primary,
      padding: 24,
    },
    backBtn: {
      fontSize: 16,
      color: '#fff',
    },
    detailTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    detailIcon: {
      width: 64,
      height: 64,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 4,
    },
    detailMeta: {
      fontSize: 14,
      color: '#dcfce7',
    },
    detailScore: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#fff',
    },
    detailLabel: {
      fontSize: 14,
      color: '#dcfce7',
    },
  
    // Chart
    chartContainer: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    chartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    chartSelect: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    chartSelectText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    chart: {
      height: 200,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 16,
    },

    barContainer: {
      flex: 1,
      alignItems: 'center',
      gap: 8,
    },
    bar: {
      width: '100%',
      backgroundColor: colors.primary,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
    barLabel: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  
    // Stats Grid
    statsGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
  
    // Timeline
    timeline: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
    },
    timelineItem: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    timelineDotContainer: {
      alignItems: 'center',
    },
    timelineDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    timelineLine: {
      width: 2,
      flex: 1,
      backgroundColor: colors.border,
      marginTop: 4,
    },
    timelineContent: {
      flex: 1,
      paddingBottom: 16,
    },
    timelineHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    timelineDate: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
    timelineTime: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    timelineCard: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
    },
    timelineCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    timelineCardLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    timelineCardScore: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    timelineCardNote: {
      fontSize: 14,
      color: colors.text,
    },
  
    // Severity Badge
    severityBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    severityText: {
      fontSize: 12,
    },
  
    // Navigation
    navBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      flexDirection: 'row',
      paddingVertical: 8,
      paddingBottom: 20,
    },
    navBtn: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
    },
    navText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    navTextActive: {
      color: colors.primary,
    },

    // Settings
    settingsSection: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
    },
    settingsRowNotLast: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingsRowInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    settingsIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsLabel: {
      fontSize: 16,
      color: colors.text,
    },
    settingsDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },

    // Buttons
    btnPrimary: {
      height: 56,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    btnPrimaryText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#fff',
    },
    btnSecondary: {
      height: 56,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    btnSecondaryText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    
    // Modal & Bottom Sheet
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.modalBackground,
      padding: 20,
    },
    bottomSheetContent: {
      backgroundColor: colors.card,
      borderRadius: 32,
      width: '100%',
      maxHeight: '90%',
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
      overflow: 'hidden',
    },
    bottomSheetHandle: {
      width: 40,
      height: 5,
      backgroundColor: colors.border,
      borderRadius: 3,
      alignSelf: 'center',
      marginVertical: 12,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
    },
    modalButton: {
      height: 52,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    modalButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#fff',
    },

    // Camera / Viewfinder Area
    cameraArea: {
      backgroundColor: colors.background,
      borderRadius: 20,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    scannerFrame: {
      position: 'absolute',
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 24,
      borderStyle: 'dashed',
      opacity: 0.5,
    },
    scanningLine: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 3,
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
    
    // Labels & Common
    label: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipSelected: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.primary,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    chipText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    chipTextSelected: {
      fontSize: 14,
      fontWeight: '700',
      color: '#fff',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 32,
      padding: 24,
      width: '100%',
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
    },
  });
