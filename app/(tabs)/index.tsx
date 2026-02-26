import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../constants/styles';
import { HealthOverview } from '../../components/leafrx/HealthOverview';
import { QuickActions } from '../../components/leafrx/QuickActions';
import { PlantCard } from '../../components/leafrx/PlantCard';
import { RecentScanItem } from '../../components/leafrx/RecentScanItem';
import { Link } from 'expo-router';
import { usePlantStore } from '../../store/usePlantStore';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { plants, scans } = usePlantStore();

  const { data: apiStatus } = useQuery({
    queryKey: ['api-health'],
    queryFn: () => apiService.getHealth(),
    refetchInterval: 60000, // Check every minute
  });

  const isApiOnline = apiStatus?.status === 'ok';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        style={styles.screen} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <LinearGradient
          colors={['#059669', '#10b981', '#34d399']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>LeafRx</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={styles.headerSubtitle}>Monitor your trees health</Text>
                <View style={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: 3, 
                  backgroundColor: isApiOnline ? '#4ade80' : '#f87171',
                  marginLeft: 8,
                  marginRight: 4
                }} />
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>
                  {isApiOnline ? 'API Online' : 'API Offline'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
              <Feather name="bell" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <HealthOverview />
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
            Quick Actions
          </Text>
          <QuickActions />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Plants</Text>
            {plants.length > 0 && (
              <Link href="/(tabs)/tracking" asChild>
                <TouchableOpacity activeOpacity={0.6}>
                  <Text style={styles.viewAll}>View All →</Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
          
          {plants.length > 0 ? (
            plants.slice(0, 3).map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))
          ) : (
            <View style={{ 
              padding: 32, 
              backgroundColor: '#fff', 
              borderRadius: 24, 
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#f1f5f9',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 2
            }}>
              <Feather name="plus-circle" size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
              <Text style={{ color: '#64748b', fontSize: 15, fontWeight: '500', textAlign: 'center' }}>
                No plants tracked yet. Start by scanning a leaf.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          {scans.length > 0 ? (
            scans.slice(0, 5).map((scan) => (
              <RecentScanItem key={scan.id} scan={scan} />
            ))
          ) : (
            <View style={{ padding: 20, backgroundColor: 'transparent', borderRadius: 12, alignItems: 'center' }}>
              <Text style={{ color: '#94a3b8', fontSize: 14 }}>No scans performed yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
