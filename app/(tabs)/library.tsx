import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, View, Text, TextInput, StatusBar, TouchableOpacity, Image, Dimensions, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { usePlantStore } from "../../store/usePlantStore";
import {
  DISEASE_LIBRARY,
  DiseaseGuide,
  getSeverityColor,
  getSeverityLabel,
  getPlantColor,
} from "../../constants/diseaseLibrary";

const { width: SW, height: SH } = Dimensions.get("window");
const CARD_W = (SW - 48 - 12) / 2;
const PLANT_FILTERS = ["All", "Mango", "Banana", "Guava", "Calamansi"];

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = createStyles(colors);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected] = useState<DiseaseGuide | null>(null);
  const [detailTab, setDetailTab] = useState<"overview" | "symptoms" | "treatment" | "prevention">("overview");

  const pendingLibraryId = usePlantStore((s) => s.pendingLibraryId);
  const setPendingLibraryId = usePlantStore((s) => s.setPendingLibraryId);

  // Fires every time this tab comes into focus — works even when screen stays mounted in background
  useFocusEffect(
    useCallback(() => {
      if (pendingLibraryId) {
        const disease = DISEASE_LIBRARY.find((d) => d.id === pendingLibraryId);
        if (disease) {
          openDetail(disease);
        }
        setPendingLibraryId(null); // clear after consuming
      }
    }, [pendingLibraryId])
  );

  const filtered = DISEASE_LIBRARY.filter((d) => {
    const matchesFilter = activeFilter === "All" || d.plant.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      d.display_name.toLowerCase().includes(search.toLowerCase()) ||
      d.plant.toLowerCase().includes(search.toLowerCase()) ||
      d.tagline.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openDetail = (d: DiseaseGuide) => {
    setSelected(d);
    setDetailTab("overview");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.screen}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <LinearGradient
          colors={colors.headerGradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.header,
            {
              paddingTop: insets.top + 16,
              paddingBottom: 32,
              marginBottom: 24,
            },
          ]}
        >
          <View style={{ paddingHorizontal: 24 }}>
            <Text style={styles.headerTitle}>Disease Library</Text>
            <Text style={styles.headerSubtitle}>16 entries · Mango, Banana, Guava, Calamansi</Text>
          </View>
        </LinearGradient>

        <View style={[styles.section, { marginTop: -20 }]}>
          {/* ── Search + Filter card ── */}
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 24,
              padding: 20,
              shadowColor: colors.cardShadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 4,
              marginBottom: 20,
            }}
          >
            {/* Search bar */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.background,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 16,
              }}
            >
              <Feather name="search" size={20} color={colors.textMuted} />
              <TextInput
                placeholder="Search diseases, plants..."
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.text,
                  fontWeight: "500",
                  marginLeft: 12,
                }}
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Feather name="x" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {PLANT_FILTERS.map((f) => {
                const active = activeFilter === f;
                const color = f === "All" ? colors.primary : getPlantColor(f);
                return (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setActiveFilter(f)}
                    activeOpacity={0.7}
                    style={[
                      {
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 12,
                        backgroundColor: active ? color : colors.background,
                        borderWidth: 1,
                        borderColor: colors.border,
                      },
                      active && {
                        shadowColor: color,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 4,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: active ? "#fff" : colors.textSecondary,
                      }}
                    >
                      {f.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Result count */}
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              color: colors.textMuted,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"} found
          </Text>

          {/* Disease cards grid */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {filtered.map((disease) => (
              <View key={disease.id}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => openDetail(disease)}
                  style={{
                    width: CARD_W,
                    backgroundColor: colors.card,
                    borderRadius: 20,
                    overflow: "hidden",
                    elevation: 4,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <View style={{ height: 120, position: "relative" }}>
                    <Image source={disease.thumbnail} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.55)"]}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 60,
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        bottom: 8,
                        left: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        backgroundColor: "rgba(0,0,0,0.45)",
                        paddingHorizontal: 7,
                        paddingVertical: 3,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ fontSize: 10 }}>{disease.plant_emoji}</Text>
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: "700",
                        }}
                      >
                        {disease.plant}
                      </Text>
                    </View>
                  </View>
                  <View style={{ padding: 12 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "800",
                        color: colors.text,
                        marginBottom: 4,
                      }}
                      numberOfLines={1}
                    >
                      {disease.display_name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: colors.textSecondary,
                        fontWeight: "500",
                        lineHeight: 15,
                      }}
                      numberOfLines={2}
                    >
                      {disease.tagline}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 10,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "700",
                          color: getSeverityColor(disease.severity),
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {disease.pathogen_type}
                      </Text>
                      <Feather name="chevron-right" size={13} color={colors.textMuted} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        {selected && (
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: colors.modalBackground,
            }}
          >
            <View
              style={{
                backgroundColor: colors.card,
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                height: SH - insets.top - 20,
                overflow: "hidden",
              }}
            >
              {/* Hero */}
              <View style={{ height: 190, position: "relative", flexShrink: 0 }}>
                <Image source={selected.thumbnail} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.75)"]}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 100,
                  }}
                />
                <TouchableOpacity
                  onPress={() => setSelected(null)}
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    backgroundColor: "rgba(0,0,0,0.45)",
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="x" size={18} color="#fff" />
                </TouchableOpacity>
                <View
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: 20,
                    right: 80,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>{selected.plant_emoji}</Text>
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: 11,
                        fontWeight: "700",
                        letterSpacing: 0.5,
                      }}
                    >
                      {selected.plant.toUpperCase()}
                    </Text>
                    <View
                      style={{
                        backgroundColor: getSeverityColor(selected.severity),
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 9,
                          fontWeight: "800",
                          letterSpacing: 0.5,
                        }}
                      >
                        {getSeverityLabel(selected.severity).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: "#fff", fontSize: 22, fontWeight: "900" }}>{selected.display_name}</Text>
                </View>
              </View>

              {/* Tabs */}
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: colors.background,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                  flexShrink: 0,
                }}
              >
                {(["overview", "symptoms", "treatment", "prevention"] as const).map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setDetailTab(tab)}
                    style={{
                      flex: 1,
                      paddingVertical: 13,
                      alignItems: "center",
                      borderBottomWidth: 2.5,
                      borderBottomColor: detailTab === tab ? getPlantColor(selected.plant) : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "800",
                        color: detailTab === tab ? getPlantColor(selected.plant) : colors.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {tab === "overview"
                        ? "Info"
                        : tab === "symptoms"
                          ? "Signs"
                          : tab === "treatment"
                            ? "Treat"
                            : "Prevent"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  padding: 20,
                  paddingBottom: insets.bottom + 32,
                }}
              >
                {detailTab === "overview" && (
                  <View style={{ gap: 16 }}>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      {[
                        {
                          icon: "alert-triangle",
                          label: "Severity",
                          value: getSeverityLabel(selected.severity),
                          color: getSeverityColor(selected.severity),
                        },
                        {
                          icon: "zap",
                          label: "Pathogen",
                          value: selected.pathogen_type,
                          color: getPlantColor(selected.plant),
                        },
                      ].map((stat) => (
                        <View
                          key={stat.label}
                          style={{
                            flex: 1,
                            backgroundColor: colors.background,
                            borderRadius: 14,
                            padding: 12,
                            borderWidth: 1,
                            borderColor: colors.border,
                          }}
                        >
                          <Feather name={stat.icon as any} size={14} color={stat.color} />
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "700",
                              color: colors.textMuted,
                              marginTop: 6,
                              letterSpacing: 0.5,
                              textTransform: "uppercase",
                            }}
                          >
                            {stat.label}
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: "800",
                              color: colors.text,
                              marginTop: 2,
                            }}
                          >
                            {stat.value}
                          </Text>
                        </View>
                      ))}
                    </View>
                    {selected.scientific_name && (
                      <InfoCard
                        label="Scientific Name"
                        color={getPlantColor(selected.plant)}
                        icon="book-open"
                        colors={colors}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontStyle: "italic",
                            color: colors.textSecondary,
                            fontWeight: "500",
                          }}
                        >
                          {selected.scientific_name}
                        </Text>
                      </InfoCard>
                    )}
                    <InfoCard label="Overview" color={getPlantColor(selected.plant)} icon="info" colors={colors}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                          lineHeight: 22,
                        }}
                      >
                        {selected.overview}
                      </Text>
                    </InfoCard>
                    <InfoCard label="Pathogen Detail" color={getPlantColor(selected.plant)} icon="cpu" colors={colors}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                          lineHeight: 22,
                        }}
                      >
                        {selected.pathogen_detail}
                      </Text>
                    </InfoCard>
                    {selected.affected_parts.length > 0 && (
                      <InfoCard
                        label="Affected Parts"
                        color={getPlantColor(selected.plant)}
                        icon="target"
                        colors={colors}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 6,
                          }}
                        >
                          {selected.affected_parts.map((p, i) => (
                            <View
                              key={i}
                              style={{
                                backgroundColor: getPlantColor(selected.plant) + "15",
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                borderRadius: 10,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: "700",
                                  color: getPlantColor(selected.plant),
                                }}
                              >
                                {p}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </InfoCard>
                    )}
                    <InfoCard
                      label="Conditions Favoring Disease"
                      color={getPlantColor(selected.plant)}
                      icon="cloud-rain"
                      colors={colors}
                    >
                      {[
                        {
                          k: "Temperature",
                          v: selected.conditions.temperature,
                        },
                        { k: "Humidity", v: selected.conditions.humidity },
                        { k: "Season", v: selected.conditions.season },
                        { k: "Spread", v: selected.conditions.spread_method },
                      ].map((row, i) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: "row",
                            marginBottom: 8,
                            gap: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "800",
                              color: colors.textMuted,
                              width: 90,
                            }}
                          >
                            {row.k}:
                          </Text>
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 13,
                              color: colors.textSecondary,
                              lineHeight: 18,
                            }}
                          >
                            {row.v}
                          </Text>
                        </View>
                      ))}
                    </InfoCard>
                    <InfoCard label="Economic Impact" color={colors.danger} icon="trending-down" colors={colors}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                          lineHeight: 22,
                        }}
                      >
                        {selected.economic_impact}
                      </Text>
                    </InfoCard>
                    {selected.look_alikes.length > 0 && (
                      <InfoCard label="Could Be Confused With" color={colors.warning} icon="eye" colors={colors}>
                        {selected.look_alikes.map((item, i) => (
                          <BulletRow key={i} text={item} color={colors.warning} colors={colors} />
                        ))}
                      </InfoCard>
                    )}
                    <InfoCard
                      label="Recovery Timeline"
                      color={getPlantColor(selected.plant)}
                      icon="clock"
                      colors={colors}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                          lineHeight: 22,
                        }}
                      >
                        {selected.recovery_timeline}
                      </Text>
                    </InfoCard>
                    <InfoCard label="Did You Know?" color="#8b5cf6" icon="star" colors={colors}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                          lineHeight: 22,
                          fontStyle: "italic",
                        }}
                      >
                        {selected.fun_fact}
                      </Text>
                    </InfoCard>
                  </View>
                )}
                {detailTab === "symptoms" && (
                  <View style={{ gap: 16 }}>
                    <InfoCard label="Early Warning Signs" color={colors.warning} icon="alert-circle" colors={colors}>
                      {selected.symptoms.early.map((s, i) => (
                        <BulletRow key={i} text={s} color={colors.warning} colors={colors} />
                      ))}
                    </InfoCard>
                    <InfoCard
                      label="Advanced / Severe Symptoms"
                      color={colors.danger}
                      icon="alert-triangle"
                      colors={colors}
                    >
                      {selected.symptoms.advanced.map((s, i) => (
                        <BulletRow key={i} text={s} color={colors.danger} colors={colors} />
                      ))}
                    </InfoCard>
                    <InfoCard
                      label="How to Distinguish from Look-alikes"
                      color={getPlantColor(selected.plant)}
                      icon="crosshair"
                      colors={colors}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                          lineHeight: 22,
                        }}
                      >
                        {selected.symptoms.distinguishing}
                      </Text>
                    </InfoCard>
                  </View>
                )}
                {detailTab === "treatment" && (
                  <View style={{ gap: 16 }}>
                    <InfoCard label="Immediate Actions" color={colors.danger} icon="zap" colors={colors}>
                      {selected.treatment.immediate.map((a, i) => (
                        <BulletRow key={i} text={a} color={colors.danger} colors={colors} icon="chevron-right" />
                      ))}
                    </InfoCard>
                    {selected.treatment.chemical.length > 0 && (
                      <InfoCard label="Chemical Controls" color={colors.secondary} icon="droplet" colors={colors}>
                        {selected.treatment.chemical.map((c, i) => (
                          <View
                            key={i}
                            style={{
                              backgroundColor: colors.background,
                              borderRadius: 14,
                              padding: 12,
                              marginBottom: 10,
                              borderLeftWidth: 3,
                              borderLeftColor: colors.secondary,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: "800",
                                color: colors.text,
                                marginBottom: 4,
                              }}
                            >
                              {c.product}
                            </Text>
                            <View
                              style={{
                                backgroundColor: `${colors.secondary}33`,
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                borderRadius: 8,
                                alignSelf: "flex-start",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 11,
                                  fontWeight: "700",
                                  color: colors.secondary,
                                }}
                              >
                                Rate: {c.rate}
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: 12,
                                color: colors.textSecondary,
                                marginTop: 6,
                                lineHeight: 17,
                              }}
                            >
                              ⏱ {c.frequency}
                            </Text>
                          </View>
                        ))}
                      </InfoCard>
                    )}
                    {selected.treatment.organic.length > 0 && (
                      <InfoCard label="Organic / Biological Options" color={colors.success} icon="wind" colors={colors}>
                        {selected.treatment.organic.map((o, i) => (
                          <BulletRow key={i} text={o} color={colors.success} colors={colors} />
                        ))}
                      </InfoCard>
                    )}
                    {selected.treatment.cultural.length > 0 && (
                      <InfoCard label="Cultural Practices" color="#8b5cf6" icon="tool" colors={colors}>
                        {selected.treatment.cultural.map((c, i) => (
                          <BulletRow key={i} text={c} color="#8b5cf6" colors={colors} />
                        ))}
                      </InfoCard>
                    )}
                  </View>
                )}
                {detailTab === "prevention" && (
                  <View style={{ gap: 16 }}>
                    <InfoCard
                      label="Prevention Strategies"
                      color={getPlantColor(selected.plant)}
                      icon="shield"
                      colors={colors}
                    >
                      {selected.prevention.map((p, i) => (
                        <BulletRow key={i} text={p} color={getPlantColor(selected.plant)} colors={colors} />
                      ))}
                    </InfoCard>
                    <InfoCard label="Monitoring Tips" color={colors.secondary} icon="activity" colors={colors}>
                      {selected.monitoring_tips.map((m, i) => (
                        <BulletRow key={i} text={m} color={colors.secondary} colors={colors} />
                      ))}
                    </InfoCard>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

function InfoCard({
  label,
  color,
  icon,
  children,
  colors,
}: {
  label: string;
  color: string;
  icon: string;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
          marginBottom: 12,
        }}
      >
        <View style={{ backgroundColor: color + "18", padding: 6, borderRadius: 9 }}>
          <Feather name={icon as any} size={13} color={color} />
        </View>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "800",
            color: colors.textMuted,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
      </View>
      {children}
    </View>
  );
}

function BulletRow({
  text,
  color,
  colors,
  icon = "check",
}: {
  text: string;
  color: string;
  colors: any;
  icon?: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        marginBottom: 8,
      }}
    >
      <View
        style={{
          backgroundColor: color + "18",
          padding: 4,
          borderRadius: 7,
          marginTop: 1,
        }}
      >
        <Feather name={icon as any} size={11} color={color} />
      </View>
      <Text
        style={{
          flex: 1,
          fontSize: 13,
          color: colors.textSecondary,
          lineHeight: 19,
          fontWeight: "500",
        }}
      >
        {text}
      </Text>
    </View>
  );
}
