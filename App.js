import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";

export default function App() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://economia.awesomeapi.com.br/json/all");
      const data = Object.values(response.data);
      // Filtra apenas as principais moedas
      const filtered = data.filter(item => ["USD", "EUR", "GBP", "JPY"].includes(item.code));
      setCurrencies(filtered);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const totalBalance = currencies.reduce(
    (sum, item) => sum + parseFloat(item.bid),
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wallet</Text>
      <Text style={styles.balanceLabel}>Current balance</Text>
      <Text style={styles.balance}>$ {totalBalance.toFixed(2)}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.active]}>
          <Text style={styles.buttonTextActive}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sell</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={currencies}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.symbol}>
              <Text style={styles.symbolText}>{item.code}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.currency}>{item.name}</Text>
              <Text style={styles.value}>{item.codein} {parseFloat(item.bid).toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F4FB",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 10,
  },
  balanceLabel: {
    color: "#7E7E7E",
    fontSize: 14,
  },
  balance: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E1E1E",
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "#EAE7F8",
    marginHorizontal: 5,
  },
  active: {
    backgroundColor: "#7C3AED",
  },
  buttonTextActive: {
    color: "#FFF",
    fontWeight: "600",
  },
  buttonText: {
    color: "#7C3AED",
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  symbol: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },
  symbolText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  info: {
    marginLeft: 15,
  },
  currency: {
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    color: "#7E7E7E",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
