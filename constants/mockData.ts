export const myPlants = [
  {
    id: 1,
    name: "Mango Tree #1",
    type: "Mango",
    health: 85,
    lastChecked: "2 days ago",
    status: "healthy",
    entries: 15,
    healthTrend: [70, 75, 80, 82, 85, 83, 85],
  },
  {
    id: 2,
    name: "Banana Grove A",
    type: "Banana",
    health: 62,
    lastChecked: "1 day ago",
    status: "warning",
    entries: 8,
    healthTrend: [60, 65, 62, 68, 65, 63, 62],
  },
  {
    id: 3,
    name: "Guava Tree #2",
    type: "Guava",
    health: 45,
    lastChecked: "3 hours ago",
    status: "critical",
    entries: 12,
    healthTrend: [50, 48, 45, 47, 43, 40, 45],
  },
];

export const recentScans = [
  {
    id: 1,
    plant: "Mango Tree #1",
    disease: "Healthy",
    severity: "None",
    date: "2 days ago",
    color: "#22c55e",
  },
  {
    id: 2,
    plant: "Banana Grove A",
    disease: "Early Leaf Spot",
    severity: "Moderate",
    date: "1 day ago",
    color: "#eab308",
  },
  {
    id: 3,
    plant: "Guava Tree #2",
    disease: "Anthracnose",
    severity: "Severe",
    date: "3 hours ago",
    color: "#ef4444",
  },
];

export const timelineData = [
  {
    date: "Today",
    time: "2:30 PM",
    health: 62,
    status: "warning",
    note: "Early leaf spot detected",
  },
  {
    date: "Yesterday",
    time: "10:15 AM",
    health: 65,
    status: "warning",
    note: "Slight yellowing observed",
  },
  {
    date: "3 days ago",
    time: "3:45 PM",
    health: 70,
    status: "healthy",
    note: "Healthy growth, no issues",
  },
];

export const chartData = [45, 52, 58, 62, 59, 65, 85]; // Kept as a standalone for potential default/other uses
export const chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const diseases = [
  {
    name: "Anthracnose",
    affected: "Mango, Guava",
    severity: "High",
    color: "#fee2e2",
    textColor: "#991b1b",
    description:
      "Anthracnose is a group of fungal diseases that affects a variety of plants, particularly in warm, humid climates. It causes dark, sunken lesions on leaves, stems, flowers, and fruits.",
    symptoms: [
      "Dark, sunken lesions with raised borders on leaves, often starting at the tips or margins.",
      "Leaf blight and defoliation, especially during severe infections.",
      "Cankers on stems and twigs.",
      "Rotting on fruits, often appearing as black, circular spots that enlarge and become sunken.",
    ],
    treatment: [
      "Prune and destroy infected plant parts to reduce inoculum.",
      "Improve air circulation through proper pruning and spacing.",
      "Apply fungicides (e.g., copper-based or mancozeb) according to label instructions, especially during wet periods.",
      "Use resistant varieties if available.",
    ],
  },
  {
    name: "Bacterial Leaf Spot",
    affected: "Banana, Peppers, Tomatoes",
    severity: "Medium",
    color: "#fef3c7",
    textColor: "#854d0e",
    description:
      "Bacterial leaf spot is a common disease affecting many plants, caused by various species of bacteria. It leads to small, water-soaked spots on leaves that turn dark brown or black.",
    symptoms: [
      "Small, irregular, water-soaked spots on leaves that enlarge and become dark brown or black.",
      "Spots often have a yellow halo.",
      "Leaves may turn yellow and drop prematurely.",
      "Lesions can also appear on stems and fruits.",
    ],
    treatment: [
      "Remove and destroy infected plant debris.",
      "Avoid overhead irrigation; water at the base of plants.",
      "Ensure good air circulation.",
      "Apply copper-based bactericides preventatively, especially in warm, wet conditions.",
    ],
  },
  {
    name: "Powdery Mildew",
    affected: "Multiple species (e.g., Mango, Grapes, Cucurbits)",
    severity: "Low",
    color: "#dcfce7",
    textColor: "#166534",
    description:
      "Powdery mildew is a fungal disease that affects a wide range of plants. It is easily recognized by the white, powdery spots that appear on the leaves and stems.",
    symptoms: [
      "White, powdery patches on the surface of leaves, stems, and sometimes flowers and fruits.",
      "Affected leaves may turn yellow, brown, or purplish and can become distorted.",
      "Reduced photosynthesis and vigor of the plant.",
    ],
    treatment: [
      "Improve air circulation around plants.",
      "Apply fungicides specifically labeled for powdery mildew (e.g., neem oil, sulfur, potassium bicarbonate).",
      "Remove and destroy heavily infected plant parts.",
      "Plant resistant varieties.",
    ],
  },
  {
    name: "Citrus Canker",
    affected: "Citrus trees",
    severity: "High",
    color: "#fee2e2",
    textColor: "#991b1b",
    description:
      "Citrus canker is a highly contagious bacterial disease that affects citrus trees, causing lesions on leaves, stems, and fruit. It is a serious threat to citrus production worldwide.",
    symptoms: [
      "Small, round, raised spots on leaves, stems, and fruit, often surrounded by a yellow halo.",
      "Lesions become corky or scab-like over time.",
      "Severe infections can cause premature leaf and fruit drop.",
    ],
    treatment: [
      "Strict quarantine and eradication measures in affected areas.",
      "Prune and destroy infected branches.",
      "Apply copper-containing bactericides (preventatively) in endemic areas.",
      "Use resistant citrus varieties where available.",
    ],
  },
  {
    name: "Mango Malformation",
    affected: "Mango",
    severity: "Medium",
    color: "#fef3c7",
    textColor: "#854d0e",
    description:
      "Mango malformation is a serious disease that affects mango trees, characterized by the abnormal development of vegetative or floral tissues.",
    symptoms: [
      'Vegetative malformation: Swelling and shortening of vegetative shoots, resulting in small, crowded leaves forming a "bunchy top" appearance.',
      "Floral malformation: Transformation of floral panicles into green, sterile, massed structures that fail to set fruit.",
    ],
    treatment: [
      "Prune and destroy malformed parts as soon as they appear.",
      "Apply fungicides (e.g., carbendazim) to reduce disease incidence.",
      "Use disease-free planting material.",
      "Plant resistant varieties.",
    ],
  },
  {
    name: "Banana Bunchy Top",
    affected: "Banana, Plantain",
    severity: "High",
    color: "#fee2e2",
    textColor: "#991b1b",
    description:
      "Banana bunchy top is a viral disease that causes severe stunting and reduces fruit yield in banana plants. It is transmitted by aphids.",
    symptoms: [
      "Dark green streaks on leaves and petioles.",
      'Leaves become stunted, upright, and brittle, giving a "bunchy" appearance at the top of the plant.',
      "Infected plants rarely produce fruit, and any fruit produced is small and distorted.",
    ],
    treatment: [
      "Eradicate infected plants (uprooting and destroying).",
      "Control aphid vectors using insecticides.",
      "Use virus-free planting material.",
      "Implement strict quarantine measures.",
    ],
  },
];
