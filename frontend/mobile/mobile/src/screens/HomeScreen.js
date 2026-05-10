import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getDashboard, getCategories, getProducts } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dash, cats, prods] = await Promise.all([
        getDashboard(),
        getCategories(),
        getProducts()
      ]);
      setStats(dash.data.kpis);
      setCategories(cats.data.categories);
      setProducts(prods.data.products);
    } catch (err) {
      console.log('Error cargando datos');
    }
  };

  if (!stats) return <View style={styles.container}><Text>Cargando...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Hola, {global.user?.name || 'Vendedor'}</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalProducts}</Text>
          <Text style={styles.statLabel}>Productos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.ordersToday}</Text>
          <Text style={styles.statLabel}>Ordenes Hoy</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{(stats.totalRevenue || 0).toFixed(0)}</Text>
          <Text style={styles.statLabel}>Ingresos</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Categorias</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
        {categories.map(cat => (
          <TouchableOpacity key={cat.id} style={styles.categoryChip}>
            <Text style={styles.categoryText}>{cat.displayName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Productos Recientes</Text>
      {products.slice(0, 5).map(p => (
        <View key={p.id} style={styles.productCard}>
          <Text style={styles.productName}>{p.name}</Text>
          <Text style={styles.productPrice}>${p.price}</Text>
          <Text style={styles.productCategory}>{p.category?.displayName}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
        <Text style={styles.logoutText}>Cerrar Sesion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 15 },
  greeting: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1f2937' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, flex: 1, marginHorizontal: 4, alignItems: 'center', elevation: 2 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#4f46e5' },
  statLabel: { fontSize: 11, color: '#6b7280', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, marginTop: 5 },
  categoriesRow: { marginBottom: 20 },
  categoryChip: { backgroundColor: '#eef2ff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  categoryText: { color: '#4f46e5', fontWeight: '500' },
  productCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 8, elevation: 1 },
  productName: { fontSize: 16, fontWeight: '600' },
  productPrice: { fontSize: 18, fontWeight: 'bold', color: '#059669', marginTop: 4 },
  productCategory: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  logoutButton: { marginTop: 30, marginBottom: 50, padding: 15, backgroundColor: '#ef4444', borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: '600' }
});
