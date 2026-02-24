import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    screen: {
      flex: 1,
    },
    
    // Header
    header: {
      backgroundColor: '#22c55e',
      padding: 24,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    headerSubtitle: {
      fontSize: 14,
      color: '#dcfce7',
    },
    bellBtn: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    healthOverview: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: 16,
      borderRadius: 16,
      marginTop: 16,
    },
    healthOverviewTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    healthLabel: {
      fontSize: 14,
      color: '#dcfce7',
    },
    healthScore: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
    },
    healthBadges: {
      flexDirection: 'row',
      gap: 12,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    badgeText: {
      fontSize: 12,
      color: '#fff',
    },
  
    // Sections
    section: {
      padding: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1f2937',
    },
    viewAll: {
      fontSize: 14,
      color: '#22c55e',
    },
  
    // Quick Actions
    quickActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    actionBtn: {
      flex: 1,
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
      gap: 8,
    },
    actionBtnText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#fff',
    },
  
    // Plant Cards
    plantCard: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    plantIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    plantInfo: {
      flex: 1,
    },
    plantName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: 4,
    },
    plantMeta: {
      fontSize: 14,
      color: '#6b7280',
    },
    plantHealth: {
      alignItems: 'flex-end',
    },
    healthScoreText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    lastChecked: {
      fontSize: 12,
      color: '#9ca3af',
    },
  
    // Recent Scans
    scanItem: {
      backgroundColor: '#f9fafb',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    scanLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    scanPlant: {
      fontSize: 14,
      fontWeight: '500',
      color: '#1f2937',
    },
    scanDisease: {
      fontSize: 12,
      color: '#6b7280',
    },
    scanDate: {
      fontSize: 12,
      color: '#9ca3af',
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
      backgroundColor: '#f3f4f6',
      borderWidth: 2,
      borderColor: '#d1d5db',
      borderStyle: 'dashed',
      borderRadius: 16,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 16,
    },
    cameraText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#4b5563',
      marginTop: 16,
      marginBottom: 8,
    },
    cameraHint: {
      fontSize: 14,
      color: '#6b7280',
      textAlign: 'center',
      paddingHorizontal: 32,
    },
  
    // Buttons
    btnPrimary: {
      backgroundColor: '#22c55e',
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 12,
    },
    btnPrimaryText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#fff',
    },
    btnSecondary: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#e5e7eb',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 24,
    },
    btnSecondaryText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#374151',
    },
    addBtn: {
      backgroundColor: '#22c55e',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    addBtnText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#fff',
    },
  
    // Info Box
    infoBox: {
      backgroundColor: '#dbeafe',
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      gap: 12,
    },
    infoTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: 4,
    },
    infoText: {
      fontSize: 14,
      color: '#1e40af',
      marginTop: 4,
    },
  
    // Search
    searchContainer: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    searchInput: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    searchInputText: {
      flex: 1,
      fontSize: 16,
      color: '#374151',
    },
    filterPills: {
      flexDirection: 'row',
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
  
  