import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc', // Softer background
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
      shadowColor: '#000',
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
      fontWeight: '800', // Thicker font
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
      color: '#1e293b',
      letterSpacing: -0.3,
    },
    viewAll: {
      fontSize: 14,
      fontWeight: '600',
      color: '#059669',
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
      // Depth
      shadowColor: '#000',
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
      backgroundColor: '#fff',
      borderRadius: 24,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      // Soft shadow
      shadowColor: '#64748b',
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
      color: '#1e293b',
      marginBottom: 4,
    },
    plantMeta: {
      fontSize: 13,
      fontWeight: '500',
      color: '#64748b',
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
      color: '#94a3b8',
    },
  
    // Recent Scans
    scanDate: {
      fontSize: 12,
      color: '#9ca3af',
    },

    // Recent Scans (New Card Style)
    recentScanCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
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
        color: '#1f2937',
        marginBottom: 2,
    },
    recentScanDisease: {
        fontSize: 13,
        color: '#6b7280',
    },
    recentScanDate: {
        fontSize: 13,
        color: '#9ca3af',
        fontWeight: '500',
    },
  
    // Page Header
    pageHeader: {
      backgroundColor: '#fff',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
    },
    pageTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 4,
    },
    pageSubtitle: {
      fontSize: 14,
      color: '#6b7280',
    },
  
    // Camera Area
    cameraArea: {
      backgroundColor: '#fff',
      borderRadius: 32,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 24,
      overflow: 'hidden',
      // Depth
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 6,
      borderWidth: 1,
      borderColor: '#f1f5f9',
    },
    scannerFrame: {
      position: 'absolute',
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
      borderWidth: 2,
      borderColor: '#10b981',
      borderRadius: 24,
      borderStyle: 'dashed',
    },
    scanningLine: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: '#10b981',
      shadowColor: '#10b981',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
    cameraText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1e293b',
      marginTop: 20,
      marginBottom: 8,
    },
    cameraHint: {
      fontSize: 14,
      color: '#64748b',
      textAlign: 'center',
      paddingHorizontal: 40,
      lineHeight: 20,
    },
    
    // Scan Screen Header
    scanHeader: {
        paddingTop: 16,
        paddingBottom: 24,
        paddingHorizontal: 24,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },

    // Bottom Sheet (Modal Content)
    bottomSheetContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 8,
        paddingBottom: 40,
        width: '100%',
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    bottomSheetHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
        alignSelf: 'center',
        marginVertical: 12,
    },

    // Labels
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Chips Container
    chipsScroll: {
        paddingBottom: 8,
    },
    filterPill: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      backgroundColor: '#f3f4f6',
      borderRadius: 20,
      marginRight: 8,
    },
    filterPillActive: {
      backgroundColor: '#22c55e',
    },
    filterPillText: {
      fontSize: 14,
      color: '#374151',
    },
    filterPillTextActive: {
      color: '#fff',
    },
  
    // Progress Bar
    progressBar: {
      height: 8,
      backgroundColor: '#e5e7eb',
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
      color: '#6b7280',
    },
  
    // Detail Header
    detailHeader: {
      backgroundColor: '#22c55e',
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
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
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
      backgroundColor: '#f9fafb',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    chartSelectText: {
      fontSize: 14,
      color: '#4b5563',
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
      backgroundColor: '#22c55e',
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
    barLabel: {
      fontSize: 12,
      color: '#6b7280',
    },
  
    // Stats Grid
    statsGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1f2937',
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      color: '#6b7280',
      textAlign: 'center',
      marginTop: 4,
    },
  
    // Timeline
    timeline: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
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
      backgroundColor: '#e5e7eb',
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
      color: '#1f2937',
    },
    timelineTime: {
      fontSize: 14,
      color: '#6b7280',
    },
    timelineCard: {
      backgroundColor: '#f9fafb',
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
      color: '#6b7280',
    },
    timelineCardScore: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    timelineCardNote: {
      fontSize: 14,
      color: '#374151',
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
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb',
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
      color: '#6b7280',
      marginTop: 4,
    },
    navTextActive: {
      color: '#22c55e',
    },

    // Settings
    settingsSection: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
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
      borderBottomColor: '#f3f4f6',
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
      color: '#1f2937',
    },
    settingsDescription: {
      fontSize: 12,
      color: '#6b7280',
      marginTop: 2,
    },

    // Modal
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 24,
      width: '90%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 16,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      fontSize: 16,
      color: '#374151',
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 8,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    modalButtonSecondaryText: {
      color: '#374151',
    },
    // Chip
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    chipSelected: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#10b981',
        borderWidth: 1,
        borderColor: '#10b981',
    },
    chipText: {
        color: '#4b5563',
        fontWeight: '500',
    },
    chipTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
  });
  
  