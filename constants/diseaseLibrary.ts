export type Severity = "low" | "moderate" | "high" | "critical";

export interface DiseaseGuide {
  id: string;
  display_name: string;
  plant: string;
  plant_emoji: string;
  severity: Severity;
  tagline: string;
  thumbnail: any;
  overview: string;
  scientific_name?: string;
  pathogen_type: string;
  pathogen_detail: string;
  affected_parts: string[];
  symptoms: { early: string[]; advanced: string[]; distinguishing: string };
  conditions: {
    temperature: string;
    humidity: string;
    season: string;
    spread_method: string;
  };
  economic_impact: string;
  look_alikes: string[];
  treatment: {
    immediate: string[];
    chemical: { product: string; rate: string; frequency: string }[];
    organic: string[];
    cultural: string[];
  };
  prevention: string[];
  monitoring_tips: string[];
  recovery_timeline: string;
  fun_fact: string;
}

// ─── THUMBNAILS ───────────────────────────────────────────────────────────────
const banana_cordana_thumbnail = require("../assets/library/banana_cordana.jpg");
const banana_healthy_thumbnail = require("../assets/library/banana_healthy.jpg");
const banana_panama_thumbnail = require("../assets/library/banana_panama.jpg");
const banana_sigatoka_thumbnail = require("../assets/library/banana_sigatoka.jpg");
const calamansi_blackspot_thumbnail = require("../assets/library/calamansi_blackspot.jpg");
const calamansi_canker_thumbnail = require("../assets/library/calamansi_canker.jpg");
const calamansi_greening_thumbnail = require("../assets/library/calamansi_greening.jpg");
const calamansi_healthy_thumbnail = require("../assets/library/calamansi_healthy.jpg");
const guava_anthracnose_thumbnail = require("../assets/library/guava_anthracnose.jpg");
const guava_healthy_thumbnail = require("../assets/library/guava_healthy.jpg");
const guava_blight_thumbnail = require("../assets/library/guava_healthy.jpg");
const guava_rust_thumbnail = require("../assets/library/guava_rust.jpg");
const mango_anthracnose_thumbnail = require("../assets/library/mango_anthracnose.jpg");
const mango_healthy_thumbnail = require("../assets/library/mango_healthy.jpg");
const mango_pmildew_thumbnail = require("../assets/library/mango_pmildew.jpg");
const mango_sootymould_thumbnail = require("../assets/library/mango_sootymould.jpg");

export const DISEASE_LIBRARY: DiseaseGuide[] = [
  // ─── MANGO ───────────────────────────────────────────────────────────────

  {
    id: "mango_anthracnose",
    display_name: "Anthracnose",
    plant: "Mango",
    plant_emoji: "🥭",
    severity: "high",
    thumbnail: mango_anthracnose_thumbnail,
    tagline: "The #1 post-harvest threat to mango worldwide",
    overview:
      "Anthracnose is the most economically damaging disease of mango, caused by Colletotrichum gloeosporioides. It affects virtually every above-ground part of the tree and is particularly devastating during humid, rainy seasons. The fungus can remain latent on developing fruit — showing no symptoms until near ripening — making it a severe post-harvest problem. In the Philippines, losses can reach 30–80% of the harvest in badly managed orchards.",
    scientific_name: "Colletotrichum gloeosporioides",
    pathogen_type: "Fungal",
    pathogen_detail:
      "Ascomycete fungus; produces abundant conidia in acervuli (salmon-pink spore masses visible under moist conditions). Overwinters in infected plant debris and mummified fruit. Has a wide host range but mango strains are particularly aggressive.",
    affected_parts: ["Leaves", "Panicles (flower clusters)", "Young shoots", "Fruit (pre & post-harvest)"],
    symptoms: {
      early: [
        "Small, irregular dark-brown to black spots on young leaves",
        "Water-soaked lesions on flower panicles — they appear greasy or translucent",
        "Tiny black specks on young fruit surface",
        "Tip burn and blight on emerging shoots, turning brown from the tip downward",
      ],
      advanced: [
        "Lesions coalesce into large necrotic areas covering entire leaf sections",
        'Flower blight leading to complete panicle death — known as "blossom blight"',
        "Fruit develop sunken, dark, circular rot spots that expand rapidly at room temperature",
        "Post-harvest: rot spreads from skin breaks within 2–3 days under ambient conditions",
        "Characteristic salmon-pink spore masses (acervuli) appear on lesion surfaces during high humidity",
      ],
      distinguishing:
        "The salmon/orange spore masses visible on lesions during wet weather are the definitive identifier. On fruit, the rot is always dark, sunken, and has a sharply defined margin — unlike bacterial black spot which causes star-shaped, raised cracks.",
    },
    conditions: {
      temperature: "25–30°C optimal for infection and spore germination",
      humidity: "Requires free moisture; >90% RH accelerates sporulation dramatically",
      season: "Most severe during flowering and fruiting coinciding with rainy season (June–October in PH)",
      spread_method: "Rain splash, wind, contaminated pruning tools, infected seedlings, insect feeding wounds",
    },
    economic_impact:
      "Annual losses in SE Asia estimated at $100M+. Reduces marketable yield by 30–80% in unmanaged orchards. Major barrier to fresh mango export due to quarantine requirements around post-harvest rot.",
    look_alikes: [
      "Bacterial black spot (angular, water-soaked margins; star cracks on fruit)",
      "Mango scab (corky, raised lesions)",
      "Sooty mold (superficial black coating; wipes off easily)",
    ],
    treatment: {
      immediate: [
        "Remove and bag all visibly infected fruit, panicles, and leaves immediately",
        "Do NOT compost infected material — burn or bury deep (>50cm)",
        "Prune dead wood and open the canopy to improve air circulation",
        "Apply copper-based fungicide as emergency protective spray within 24 hours",
      ],
      chemical: [
        {
          product: "Mancozeb 80% WP",
          rate: "2–2.5 g/L water",
          frequency: "Every 7–10 days during flowering and fruiting",
        },
        {
          product: "Carbendazim 50% WP",
          rate: "1 g/L water",
          frequency: "Every 10–14 days; rotate with mancozeb to prevent resistance",
        },
        {
          product: "Azoxystrobin 25% SC",
          rate: "1 mL/L water",
          frequency: "Every 14 days; max 3 applications per season",
        },
        {
          product: "Copper hydroxide 77% WP",
          rate: "2–3 g/L water",
          frequency: "Protective spray before rain events",
        },
      ],
      organic: [
        "Trichoderma harzianum-based biocontrol (Tricho-T) applied at 5 g/L every 10 days",
        "Neem oil (2%) spray every 7 days during susceptible stages",
        "Baking soda (sodium bicarbonate) 5 g/L as suppressive spray on early lesions",
        "Hot water treatment for harvested fruit: 52°C for 5 minutes before storage",
      ],
      cultural: [
        "Collect and destroy all fallen fruit and leaves weekly without exception",
        "Prune to maintain open canopy — reduce humidity inside the tree crown",
        "Avoid overhead irrigation during flowering and fruiting stages",
        "Harvest at correct maturity index (skin begins to turn yellow at apex)",
        "Use wax coating post-harvest to slow rot progression during transport",
      ],
    },
    prevention: [
      "Begin protective fungicide sprays at panicle emergence, BEFORE the rainy season starts",
      "Apply copper spray 2 weeks before expected flowering as prophylactic measure",
      "Plant moderately resistant varieties where available (Keitt, Tommy Atkins)",
      "Maintain orchard sanitation — remove mummified fruit year-round",
      "Space trees adequately (8×8m minimum) to allow adequate air movement between crowns",
      "Install windbreaks to reduce rain-splash dispersal of conidia between trees",
    ],
    monitoring_tips: [
      "Scout panicles weekly from bud break through petal fall — these are highest-risk periods",
      "Check 5 random trees per block; inspect 3 panicles and 10 leaves per tree per visit",
      "Use a disease incidence threshold of >5% affected panicles to trigger spray program",
      "Monitor weather forecasts closely — spray preventively BEFORE rain events, not after",
      "Check stored/harvested fruit daily in the first 3 days post-harvest for early rot signs",
    ],
    recovery_timeline:
      "3–4 weeks for foliar recovery with consistent treatment. Post-harvest fruit cannot be recovered once rot initiates.",
    fun_fact:
      "The fungus can remain completely invisible (latent) inside immature mango fruit for weeks, only erupting as visible rot when the fruit ripens and its natural chemical defenses (phenolics) drop below a threshold level.",
  },

  {
    id: "mango_powdery_mildew",
    display_name: "Powdery Mildew",
    plant: "Mango",
    plant_emoji: "🥭",
    severity: "high",
    thumbnail: mango_pmildew_thumbnail,
    tagline: "White powder that destroys flowering and wipes out fruit set",
    overview:
      "Mango powdery mildew, caused by Oidium mangiferae, is one of the most widespread and damaging diseases of mango during the flowering period. Unlike most fungal diseases that require wet conditions, powdery mildew thrives in dry weather with high relative humidity — making it particularly problematic during the Philippine dry season flowering period (November–February). A single severe outbreak during panicle emergence can reduce fruit set by 70–90%, essentially wiping out an entire harvest season.",
    scientific_name: "Oidium mangiferae",
    pathogen_type: "Fungal",
    pathogen_detail:
      "Obligate ectoparasite — the fungus lives entirely on the surface of plant tissue, sending haustoria (feeding organs) through the epidermis. Produces enormous quantities of dry conidia that are dispersed by wind. Unlike other fungi, does NOT need free water for spore germination — dry conditions actually favor it.",
    affected_parts: [
      "Panicles (flower clusters) — most critical",
      "Young leaves and shoots",
      "Developing fruit (early stage)",
    ],
    symptoms: {
      early: [
        "White, powdery, dusty coating appearing first on the underside of young leaves",
        "Panicles develop white powdery covering on flowers and flower stalks",
        'Affected flowers appear "frosted" or dusted with white flour',
        "Young fruit develop white powdery patches on the skin",
      ],
      advanced: [
        "Entire panicles covered in dense white mycelium and spores",
        "Affected flowers fail to set fruit — mass flower abortion follows infection",
        "Young fruit (marble-sized) turn black and drop prematurely",
        "Leaves curl and distort under heavy infection",
        "In severe outbreaks: entire tree canopy coated in white powdery growth",
      ],
      distinguishing:
        "The white powdery coating is so characteristic that it is virtually impossible to confuse with other diseases. The key distinguishing fact: it appears in DRY weather — if rain is occurring, suspect anthracnose instead. Rubbing the coating reveals green tissue underneath (not necrotic).",
    },
    conditions: {
      temperature: "10–31°C with optimum at 22–25°C; cool nights and warm days are ideal",
      humidity: ">70% relative humidity required but free water actually INHIBITS germination",
      season: "Dry season flowering (November–February); worst when cool nights follow warm days",
      spread_method: "Wind dispersal of dry conidia over long distances; no water required for spread",
    },
    economic_impact:
      "Can reduce fruit set by 70–90% in a single outbreak. In bad powdery mildew years, entire orchards produce minimal commercial fruit. Philippine mango farmers lose tens of millions of pesos annually during heavy outbreak years.",
    look_alikes: [
      "Sooty mold (black, not white; secondary to insect infestation)",
      "Spray deposit residues from previous fungicide applications",
      "Normal wax bloom on leaves",
    ],
    treatment: {
      immediate: [
        "Begin spray program immediately at first sign of white powder — do not wait",
        "Spray in the early morning or late afternoon — avoid midday heat which reduces efficacy",
        "Ensure complete coverage of all panicles, both upper and lower surfaces",
        "Continue spraying every 7 days as long as flowering continues",
      ],
      chemical: [
        {
          product: "Wettable sulfur 80% WP",
          rate: "2–3 g/L water",
          frequency: "Every 7 days during flowering; most cost-effective option",
        },
        {
          product: "Trifloxystrobin 50% WG",
          rate: "0.2 g/L water",
          frequency: "Every 14 days; excellent systemic activity",
        },
        {
          product: "Hexaconazole 5% SC",
          rate: "1.5 mL/L water",
          frequency: "Every 10–14 days; rotate with non-DMI fungicides",
        },
        {
          product: "Myclobutanil 12.5% WP",
          rate: "1 g/L water",
          frequency: "Every 14 days; good systemic activity",
        },
      ],
      organic: [
        "Potassium bicarbonate (5 g/L) — disrupts fungal cell walls; apply every 5–7 days",
        "Neem oil (2%) — inhibits spore germination; apply early morning",
        "Garlic extract spray (5%) — natural antifungal sulfur compounds",
        "Milk solution (1 part fresh milk: 9 parts water) — proteins create antifungal environment",
      ],
      cultural: [
        "Avoid high-nitrogen fertilization close to flowering — lush new growth is more susceptible",
        "Prune excess vegetative growth to improve air circulation through canopy",
        "Time irrigation to avoid evening watering that raises humidity during cooler nights",
      ],
    },
    prevention: [
      "Begin preventive sulfur spray at first sign of panicle emergence — do not wait for visible disease",
      "Apply sulfur at panicle emergence, full flower, and pea-sized fruit stages at minimum",
      "Avoid over-fertilizing with nitrogen before the flowering period",
      "Maintain open canopy structure through annual post-harvest pruning",
      "Plant in sites with good air movement — avoid low-lying areas where cool air pools at night",
    ],
    monitoring_tips: [
      "Scout daily from panicle emergence through petal fall — this 3–4 week window is critical",
      "Use a magnifying glass to detect early white mycelium on panicle surfaces before it spreads",
      "Monitor weather forecasts for cool nights (< 22°C) following warm days — ideal disease conditions",
      "Count percentage of panicles affected to assess if spray program is adequate",
    ],
    recovery_timeline:
      "With aggressive sulfur spraying: 5–7 days to stop new spread. Fruit set on already-infected panicles cannot be recovered. New panicles emerging after control will be disease-free.",
    fun_fact:
      "Powdery mildew fungi are the only plant pathogens that actually evolved to prefer dry conditions — a complete reversal of almost all other fungal plant diseases. They likely evolved this adaptation to colonize plant surfaces during dry periods when competing microorganisms are suppressed.",
  },

  {
    id: "mango_sooty_mould",
    display_name: "Sooty Mould",
    plant: "Mango",
    plant_emoji: "🥭",
    severity: "moderate",
    thumbnail: mango_sootymould_thumbnail,
    tagline: "Black soot that blocks light and signals an insect infestation",
    overview:
      "Sooty mould on mango is not a primary pathogen but a secondary fungal growth caused by several genera — primarily Capnodium, Meliola, and Fumago species — that colonize the honeydew secreted by sap-sucking insects such as mango hoppers (Idioscopus nitidulus), mealybugs, scale insects, and aphids. The black coating physically blocks sunlight from reaching leaf surfaces, reducing photosynthesis and overall tree vigor. Managing sooty mould requires controlling the insect infestation that provides the honeydew substrate.",
    scientific_name: "Capnodium mangiferae / Meliola mangiferae",
    pathogen_type: "Fungal (secondary)",
    pathogen_detail:
      "Multiple fungal species colonize insect honeydew secreted onto leaf and fruit surfaces. The fungi are not parasitic — they do not penetrate plant tissue. They simply grow on the sugar-rich honeydew as a food source. Controlling insects removes the honeydew, eliminating the fungal substrate.",
    affected_parts: ["Leaf surfaces (upper)", "Fruit surface", "Young stems and shoots"],
    symptoms: {
      early: [
        "Shiny, sticky coating on leaves — this is fresh honeydew before fungal colonization",
        "Patches of dark grey to black powdery coating appearing on leaf upper surfaces",
        "Ants actively running up and down tree trunk and branches (tending honeydew-producing insects)",
        "Visible insect colonies (mealybugs, scale, hoppers) on shoots, undersides of leaves, or panicles",
      ],
      advanced: [
        "Dense black sooty coating covering large portions of leaf upper surfaces and fruit",
        'Leaves appear "painted black"; rubbing with a damp cloth removes the coating — tissue beneath is green (key differentiator)',
        "Reduced leaf gloss and yellow pallor of canopy due to shading and reduced photosynthesis",
        "Fruit covered in black coating — loses market value even if flesh is unaffected",
        "Heavy infestations lead to premature leaf drop and reduced fruit set in following season",
      ],
      distinguishing:
        "The sooty coating WIPES OFF easily with a wet cloth, revealing healthy green tissue beneath. This is the definitive distinguishing feature from true leaf diseases. Presence of visible insect colonies or ants confirms the secondary nature of the mould.",
    },
    conditions: {
      temperature: "24–32°C; fungal growth accelerates in warm, humid conditions",
      humidity: "High humidity (>80% RH) accelerates both insect populations and fungal colonization of honeydew",
      season: "Peaks during dry-to-wet transition and during flowering (mango hopper season)",
      spread_method: "Fungal spores spread by wind and rain; insect infestation is the primary driver",
    },
    economic_impact:
      "Reduces photosynthesis by 30–50% in heavily coated trees. Fruit coated with sooty mould is unmarketable without costly washing. Mango hopper infestations causing sooty mould can reduce fruit set by 20–40%.",
    look_alikes: [
      "Powdery mildew (WHITE coating, not black; cannot be wiped off)",
      "Anthracnose on leaves (dark spots but not coating; tissue is necrotic not wiping-off)",
      "Normal leaf dust or smoke deposit (uniform, no insect association)",
    ],
    treatment: {
      immediate: [
        "Identify and treat the insect infestation FIRST — sooty mould cannot be controlled without removing the insect source",
        "Spray with a strong jet of water to physically dislodge insects and wash away honeydew",
        "Apply insecticide targeting the specific insect pest (hopper, mealybug, scale) immediately",
        "Remove heavily coated branches where insect infestation is concentrated",
      ],
      chemical: [
        {
          product: "Imidacloprid 200 SC (for hoppers/aphids)",
          rate: "0.5 mL/L water",
          frequency: "Single application at infestation onset; repeat after 21 days if needed",
        },
        {
          product: "Profenofos 50% EC (for mealybugs/scale)",
          rate: "2 mL/L water",
          frequency: "Every 14 days until infestation controlled",
        },
        {
          product: "Mineral oil 97% EC (suffocant + mould removal)",
          rate: "10–20 mL/L water",
          frequency: "Every 14 days; physically smothers insects and dissolves honeydew film",
        },
      ],
      organic: [
        "Neem oil (2%) + soap solution: spray weekly to control insects and dissolve honeydew",
        "Starch solution (2%) spray: physically entraps insects and coats sooty mould for removal",
        "Release natural predators: Cryptolaemus montrouzieri beetles for mealybug control",
        "Sticky bands on trunk to trap ants — prevents ants from protecting honeydew-producing insects from natural enemies",
      ],
      cultural: [
        "Prune to improve canopy airflow — dense canopies favour insect build-up and mould growth",
        "Remove ants from trees using sticky trunk bands — ants protect scale and mealybugs from natural predators",
        "Reduce excessive nitrogen fertilization — lush soft growth attracts sap-sucking insects",
        "Wash fruit with dilute soap solution before packing if surface mould is present",
      ],
    },
    prevention: [
      "Monitor for mango hoppers beginning at bud swell and apply insecticide at first detection",
      "Prune annually after harvest to reduce canopy density that harbors insect colonies",
      "Install ant barriers on tree trunks as a permanent practice during fruit development",
      "Apply preventive insecticide at panicle emergence — this is peak mango hopper season",
      "Encourage natural enemies: avoid broad-spectrum insecticides that kill beneficial predators",
    ],
    monitoring_tips: [
      "Check leaf undersides weekly for early mealybug or scale colonies — they are easier to control when small",
      "Monitor ant activity on trunks — increasing ant traffic indicates honeydew-producing insects above",
      "Sample 5 panicles per tree at bud emergence for mango hopper egg masses and nymphs",
      "If >25% of leaves show honeydew or sooty mould, insect infestation has reached economic threshold",
    ],
    recovery_timeline:
      "Once insects are controlled, new leaves will be clean. Existing sooty mould fades and flakes off over 4–8 weeks as leaves age and are washed by rain. Fruit surface mould can be washed before sale.",
    fun_fact:
      "The ants farming mealybugs on mango trees are engaging in one of the oldest mutualistic relationships in insects — ants protect mealybugs from predators in exchange for honeydew, a behavior documented for over 50 million years in the fossil record.",
  },

  {
    id: "mango_healthy",
    display_name: "Healthy Mango",
    plant: "Mango",
    plant_emoji: "🥭",
    severity: "low",
    thumbnail: mango_healthy_thumbnail,
    tagline: "What peak mango health looks like",
    overview:
      "A healthy mango tree is a powerhouse of tropical productivity. Understanding what normal, thriving mango foliage looks like is as important as recognizing disease — misidentifying normal growth stages leads to unnecessary pesticide applications. Healthy mango trees in the Philippines can produce 200–400 kg of fruit per season per mature tree and live productively for 40–100 years with proper care. The Carabao mango — the Philippine national fruit — is internationally recognized as the sweetest variety in the world.",
    pathogen_type: "None",
    pathogen_detail:
      "No pathogen. This entry describes normal, disease-free mango physiology and what healthy tissue looks like at each growth stage.",
    affected_parts: [],
    symptoms: {
      early: [
        "New flushes emerge copper-red to bronze in color — this is completely NORMAL (not disease)",
        "Young leaves are soft, pendulous, and reddish before hardening to dark green over 2–3 weeks",
        "Panicles emerge creamy-white to light green with hundreds of tiny flowers",
        "Fruit set: tiny green fruit 1–2cm, most will naturally drop (normal physiological thinning)",
      ],
      advanced: [
        "Mature leaves: deep glossy green, firm, flat, with a prominent pale midrib",
        "Fruit development proceeds: green → yellow-green → yellow/orange at maturity (variety-dependent)",
        "Bark: gray-brown, slightly rough, no gum exudate or discoloration",
        "Root zone: moist but not waterlogged; healthy feeder roots are cream-white",
      ],
      distinguishing:
        "Healthy copper-red new growth is commonly mistaken for disease by new growers. Key indicators of health: color is uniform across ALL new leaves simultaneously, leaves are firm (not water-soaked), and no spots, lesions, or irregular discolorations are present.",
    },
    conditions: {
      temperature: "Optimal: 24–30°C. Tolerates 10–46°C but productivity drops at extremes",
      humidity: "Prefers dry conditions during flowering (reduces anthracnose); accepts high humidity otherwise",
      season: "Flowering induced by cool dry weather (Nov–Feb in PH); fruit matures 3–5 months after flowering",
      spread_method: "N/A",
    },
    economic_impact:
      "Philippine mango (Mangifera indica var. Carabao) is the national fruit and a top agricultural export earning $50–80M USD annually. A single well-managed mature tree (20+ years) can produce 400+ kg of premium fruit annually.",
    look_alikes: [
      "Red/bronze new growth (NORMAL) often mistaken for disease",
      "Natural physiological fruit drop (normal) vs. fungal-induced fruit drop",
    ],
    treatment: {
      immediate: ["No treatment needed — maintain current practices and document as baseline reference"],
      chemical: [],
      organic: [
        "Foliar spray of seaweed extract (2%) monthly to maintain micronutrient balance",
        "Compost tea (1:10 dilution) as soil drench quarterly to support soil biology",
      ],
      cultural: [
        "Fertilize 3× per year: after harvest, before flowering induction, during fruit development",
        "Recommended NPK: 100-50-100 g/tree/year for young trees; scale up with age",
        "Maintain 50–100cm organic mulch ring to conserve moisture and suppress weeds",
        "Light post-harvest pruning to remove crossing branches and open canopy",
        "Water consistently during fruit development — irregular watering causes fruit splitting",
      ],
    },
    prevention: [
      "Maintain soil pH 5.5–7.0 for optimal nutrient uptake",
      "Apply preventive copper + mancozeb spray at panicle emergence each season without fail",
      "Annual soil testing to adjust fertilization program based on actual soil nutrient status",
      "Control mango pulp weevil, mango leafhopper, and thrips — they create wounds that invite pathogens",
    ],
    monitoring_tips: [
      "Scout weekly during flowering and fruit set — these 6–8 weeks are the most critical annual period",
      "Photograph healthy leaves and fruit at each growth stage to build your own reference library",
      "Track harvest weight per tree each season to detect early productivity decline before visual symptoms appear",
    ],
    recovery_timeline: "N/A — tree is healthy. Focus entirely on maintaining current conditions.",
    fun_fact:
      "The Carabao mango is scientifically certified as the sweetest mango variety in the world by the Guinness Book of World Records, with brix (sugar content) levels reaching 22–24% — higher than any other known variety on the planet.",
  },

  // ─── BANANA ──────────────────────────────────────────────────────────────

  {
    id: "banana_cordana",
    display_name: "Cordana Leaf Spot",
    plant: "Banana",
    plant_emoji: "🍌",
    severity: "moderate",
    thumbnail: banana_cordana_thumbnail,
    tagline: "Oval brown spots that reduce leaf area and photosynthesis",
    overview:
      "Cordana leaf spot, caused by Cordana musae (teleomorph: Pleospora musarum), is a common secondary fungal disease of banana found widely in the Philippines and across tropical Asia. While rarely causing the catastrophic yield losses associated with Black Sigatoka, Cordana significantly reduces functional leaf area through large necrotic lesions, lowering photosynthesis and bunch fill. It frequently co-occurs with Sigatoka diseases, and in nurseries and young plantations it can cause severe defoliation of seedlings and tissue-culture plantlets.",
    scientific_name: "Cordana musae",
    pathogen_type: "Fungal",
    pathogen_detail:
      "Hyphomycete fungus that infects banana leaf tissue through direct penetration, particularly at points of physical damage. Produces large, simple conidia dispersed by rain splash and wind. The fungus readily colonizes senescing or already-diseased tissue, making it a common secondary invader on leaves already weakened by Sigatoka.",
    affected_parts: ["Mature and older leaves (primarily)", "Occasionally sheaths and pseudostem outer layers"],
    symptoms: {
      early: [
        "Small pale yellow to light brown oval spots (5–10mm) on mature leaf blade",
        "Spots enlarge rapidly with a pale tan/gray center and a yellow border",
        "Lesions tend to form on older leaves first, progressing to younger leaves under heavy pressure",
        "Irregular water-soaked halo may be visible around fresh lesions",
      ],
      advanced: [
        "Lesions expand to large ovals (2–5cm), tan/gray center with a distinct dark brown border and yellow halo",
        "Multiple lesions coalesce, killing large contiguous sections of leaf blade",
        "Severely affected leaves die prematurely, reducing the functional leaf count below productive threshold",
        "Conidiophores visible as a grayish-white fuzzy growth on lesion surface under high humidity",
        "In nurseries: seedlings and TC plantlets can be completely defoliated",
      ],
      distinguishing:
        'Cordana lesions are distinctly oval with a characteristic pale gray/tan center, dark brown margin, and yellow outer halo — a "target spot" appearance. Black Sigatoka lesions are more elongated (streak-to-spindle shaped) and follow a precise 6-stage progression. Cordana lesions are generally larger and more irregular in shape.',
    },
    conditions: {
      temperature: "24–28°C optimal for conidial germination and infection",
      humidity: "Requires prolonged leaf wetness (>4 hours); most severe in rainy season",
      season: "Rainy season (June–November); worst in shaded, poorly ventilated plantations",
      spread_method: "Rain splash of conidia; wind dispersal; contact with infected leaf material",
    },
    economic_impact:
      "Primarily a secondary disease but causes significant yield losses in poorly managed plantations through premature leaf death. In nurseries, can kill seedling batches entirely. Estimated 10–25% yield reduction when combined with Sigatoka in untreated fields.",
    look_alikes: [
      "Black Sigatoka (elongated streaks/spindle lesions; strict 6-stage sequence)",
      "Helminthosporium leaf spot (diamond-shaped lesions, darker brown)",
      "Physical leaf damage / wind tattering (irregular tears, no halos)",
    ],
    treatment: {
      immediate: [
        "Remove and destroy all severely affected leaves (>50% lesion coverage)",
        "Apply fungicide immediately if disease is spreading to young leaves",
        "Improve plantation drainage and reduce irrigation-induced leaf wetness",
      ],
      chemical: [
        {
          product: "Mancozeb 80% WP",
          rate: "2.5 g/L water",
          frequency: "Every 14 days during rainy season",
        },
        {
          product: "Chlorothalonil 75% WP",
          rate: "2 g/L water",
          frequency: "Every 14 days; good contact activity",
        },
        {
          product: "Propiconazole 25% EC",
          rate: "1 mL/L water",
          frequency: "Every 21 days; systemic; rotate with mancozeb",
        },
      ],
      organic: [
        "Trichoderma asperellum foliar spray weekly as biological competitive exclusion",
        "Potassium bicarbonate (5 g/L) spray to raise leaf surface pH",
        "Mineral oil (2%) spray to reduce spore adhesion on leaf surface",
      ],
      cultural: [
        "Regular deleafing: remove all leaves with >25% lesion coverage on a fixed schedule",
        "Widen plant spacing to improve airflow and reduce canopy humidity",
        "Avoid overhead irrigation — drip irrigation significantly reduces leaf wetness duration",
        "Remove and destroy all fallen infected leaves from the plantation floor weekly",
      ],
    },
    prevention: [
      "Maintain adequate potassium fertilization — K-deficient plants show dramatically increased susceptibility",
      "Implement a fixed deleafing calendar tied to your planting cycle",
      "Use drip irrigation instead of overhead sprinklers to minimize leaf wetness",
      "Ensure adequate spacing (2.5×2.5m minimum) for airflow between plants",
      "Apply preventive fungicide at the start of rainy season before symptoms appear",
    ],
    monitoring_tips: [
      "Count functional green leaves above the bunch at flowering — fewer than 8 indicates significant disease pressure",
      "Assess 10 random plants per hectare; record the percentage of leaf area affected on the 3rd and 4th functional leaf",
      "Compare YSL (youngest spotted leaf position) against your Sigatoka scouting data to differentiate diseases",
    ],
    recovery_timeline:
      "Once lesions form, affected leaf tissue cannot recover. New leaves emerging with consistent fungicide protection will be clean. Plantation-level disease reduction: 4–8 weeks of consistent program.",
    fun_fact:
      "Cordana musae was originally described from banana specimens collected in Jamaica in 1880, making it one of the earliest documented banana fungal pathogens — predating the discovery of both Panama disease and Sigatoka by several decades.",
  },

  {
    id: "banana_sigatoka",
    display_name: "Black Sigatoka",
    plant: "Banana",
    plant_emoji: "🍌",
    severity: "critical",
    thumbnail: banana_sigatoka_thumbnail,
    tagline: "The most destructive banana foliar disease on Earth",
    overview:
      "Black Sigatoka (Mycosphaerella fijiensis) is considered the single most damaging banana disease in the world, costing the global industry over $400 million annually in fungicide applications alone. It reduces photosynthetic capacity by destroying leaf tissue, resulting in early fruit ripening, reduced bunch weight (up to 50% loss), and in severe cases, complete crop failure. The disease emerged in Fiji in 1963 and has since spread to all major banana-producing regions including the Philippines, where it has largely replaced the less aggressive Yellow Sigatoka.",
    scientific_name: "Mycosphaerella fijiensis",
    pathogen_type: "Fungal",
    pathogen_detail:
      "Ascomycete fungus producing two spore types: ascospores (sexual, airborne — primary long-distance spread up to 40km) and conidia (asexual, splash-dispersed — local farm-level spread). The fungus has documented resistance to multiple fungicide classes including benzimidazoles and some triazoles, making it one of the most challenging agricultural pathogens to manage chemically.",
    affected_parts: [
      "All leaves; youngest leaves most susceptible",
      "Reduces fruit fill and bunch weight indirectly through photosynthesis loss",
    ],
    symptoms: {
      early: [
        "Pale yellow streaks (2–3mm) running parallel to leaf veins on the UNDERSIDE of young leaves — Stage 1",
        "Streaks visible on leaf undersurface before upper surface symptoms appear",
        "Stage 2: streaks on upper surface, still yellow-brown",
        "Stage 3: spots with water-soaked appearance, yellow halo developing",
      ],
      advanced: [
        "Stage 4–5: spots enlarge (up to 2cm) with dark brown/black center and prominent yellow halo on upper surface",
        "Stage 6: lesions mature to brown-gray center, dark border, fading yellow halo",
        'Lesions coalesce; large sections of leaves die turning brown — "scorched" appearance',
        "Premature bunch ripening 2–4 weeks early, resulting in significantly lower bunch weight",
        "In catastrophic infections: only the innermost cigar leaf remains functional and green",
      ],
      distinguishing:
        "The 6-stage lesion progression sequence is diagnostic and unique. Yellow Sigatoka (M. musicola) progresses more slowly with yellow-centered lesions. Nutrient deficiency causes uniform interveinal yellowing without the progressive spot-to-streak sequence.",
    },
    conditions: {
      temperature: "25–28°C optimal; spore germination requires free water on leaf surfaces",
      humidity: "Requires >6 hours of leaf wetness for infection; >95% RH dramatically accelerates disease",
      season: "Year-round in PH; worst during rainy season (July–November)",
      spread_method: "Ascospores spread by wind up to 40km (long-distance); conidia by rain splash locally",
    },
    economic_impact:
      "Reduces bunch weight 35–50% in untreated plantations. Global management cost: $400M+/year in fungicides. Primary reason Cavendish production requires 10–50 aerial fungicide applications annually in commercial operations.",
    look_alikes: [
      "Yellow Sigatoka (similar but slower, yellower lesions, less aggressive)",
      "Cordana leaf spot (oval target-spot lesions, not elongated streaks)",
      "Potassium deficiency (yellowing starting at leaf margins, no spots)",
    ],
    treatment: {
      immediate: [
        "Remove and destroy (burn or bury deep) all severely infected leaves immediately",
        '"Leaf surgery": cut off the diseased distal portion of partly affected leaves using a clean knife',
        "Improve drainage — waterlogged soils raise canopy humidity and accelerate spread",
        "Begin fungicide program immediately if >50% of leaf area on any leaf is affected",
      ],
      chemical: [
        {
          product: "Propiconazole 25% EC (DMI fungicide)",
          rate: "1 mL/L water",
          frequency: "Every 21 days; MUST rotate with non-DMI fungicide to prevent resistance",
        },
        {
          product: "Mancozeb 80% WP (protectant)",
          rate: "2.5 g/L water",
          frequency: "Every 14 days as protectant during high-risk periods",
        },
        {
          product: "Azoxystrobin 25% SC (strobilurin)",
          rate: "1 mL/L water",
          frequency: "Max 2 applications per season; strictly rotate to prevent resistance",
        },
        {
          product: "Chlorothalonil 75% WP",
          rate: "2 g/L water",
          frequency: "Every 14 days; excellent rotation partner for DMI fungicides",
        },
      ],
      organic: [
        "Mineral oil spray (2%) — coats leaf surface, disrupts spore germination physically",
        "Potassium bicarbonate (5 g/L) — raises leaf surface pH, inhibitory to fungal growth",
        "Trichoderma asperellum foliar application — competitive biological exclusion on leaf surface",
        "Silicon-based fertilizers — strengthen leaf cuticle, reducing fungal penetration depth",
      ],
      cultural: [
        "Deleafing: remove all leaves rated Stage 4+ on a fixed schedule (every 2–3 weeks)",
        "Desuckering to maintain single or double stem system — reduces humidity within the mat",
        "Wider plant spacing (3×3m minimum) to ensure airflow between plants",
        "Avoid all overhead irrigation — drip irrigation significantly reduces leaf wetness duration",
        "Plant resistant varieties: FHIA hybrids, Cardaba have significantly better resistance",
      ],
    },
    prevention: [
      "Establish a formal deleafing calendar and stick to it — skipping even one cycle allows disease to build up",
      "Monitor using Stover/Gauhl leaf disease scoring system (0–6 scale) to guide spray decisions",
      "Begin fungicide program at first appearance of Stage 2 lesions — never wait until damage is severe",
      "Rotate fungicide classes strictly following recommended schedules — resistance can develop within one season",
      "Maintain adequate potassium nutrition — K-deficient plants are significantly more susceptible",
      "Train farm workers to identify Stage 1–2 lesions — early detection is the key to management",
    ],
    monitoring_tips: [
      'Use the "youngest spotted leaf" (YSL) number as your weekly management indicator',
      "YSL of leaf 4 or higher = disease well-controlled; continue current program",
      "YSL of leaf 2–3 = disease pressure increasing; intensify spray frequency",
      "YSL of leaf 1 = critical; spray immediately and increase frequency",
      "Sample 10 plants per hectare; record the leaf number of the youngest leaf showing Stage 3+ lesion",
    ],
    recovery_timeline:
      "Individual leaves: cannot recover once lesions are Stage 4+. New healthy leaves emerge in 4–6 weeks if disease is brought under control. Full plantation recovery with consistent management: 2–3 months.",
    fun_fact:
      "To control Black Sigatoka, large commercial Cavendish banana plantations in Central America spray fungicide up to 50 times per year from low-flying aircraft — making banana one of the most intensively fungicide-treated crops in the world.",
  },

  {
    id: "banana_panama",
    display_name: "Panama Disease (TR4)",
    plant: "Banana",
    plant_emoji: "🍌",
    severity: "critical",
    thumbnail: banana_panama_thumbnail,
    tagline: "The soilborne killer threatening the global banana supply",
    overview:
      "Tropical Race 4 (TR4) of Fusarium oxysporum f. sp. cubense is arguably the most feared plant disease in agriculture today. A soil-borne vascular wilt pathogen, TR4 infects banana plants through their roots and colonizes the xylem (water-conducting tissue), causing wilting and death. There is no effective chemical treatment. TR4 has already devastated Cavendish banana plantations across Asia, the Middle East, and Australia and was confirmed in the Americas and Africa in the 2010s–2020s, threatening the global banana trade.",
    scientific_name: "Fusarium oxysporum f. sp. cubense Tropical Race 4 (TR4)",
    pathogen_type: "Fungal (soilborne)",
    pathogen_detail:
      "Soilborne ascomycete producing three spore types: macroconidia, microconidia, and chlamydospores (the resting spores that persist in soil for 30+ years). Once established in a field, the soil remains permanently infested. TR4 specifically attacks Cavendish bananas — the variety making up 99% of global exports.",
    affected_parts: [
      "Root system (entry point)",
      "Vascular (xylem) tissue throughout pseudostem",
      "Entire plant above ground as disease progresses",
    ],
    symptoms: {
      early: [
        "Older outer leaves turn yellow starting at the margins, progressing inward",
        "Yellowing typically starts on one or two leaves at a time, not the whole plant",
        "Affected leaves collapse at the petiole (junction with pseudostem) and hang down",
        "External pseudostem appears normal in very early infection",
      ],
      advanced: [
        "Progressive yellowing and collapse of all outer leaves toward the center",
        "Pseudostem splits longitudinally as internal tissue dies and dries out",
        "Cross-section of pseudostem reveals characteristic reddish-brown to dark discoloration of vascular tissue",
        'Plant eventually collapses with all leaves hanging down in the classic "wilting banana" appearance',
        "Corm (underground base): red-brown internal discoloration when cut",
        "Entire mat dies; suckers may initially appear healthy then die within weeks",
      ],
      distinguishing:
        "The definitive diagnosis is the cross-section of the pseudostem showing a continuous ring or sectoral pattern of reddish-brown vascular discoloration. This internal staining distinguishes Fusarium wilt from drought (no staining) and from other leaf yellowing causes (no pseudostem staining).",
    },
    conditions: {
      temperature: "24–34°C optimal for TR4; thrives in tropical soil temperatures",
      humidity: "Moist, waterlogged soils dramatically increase infection rate",
      season: "Year-round; often triggers during dry-wet transitions when plant roots are stressed",
      spread_method: "Infected soil movement on equipment, vehicles, footwear, water flow; infected planting material",
    },
    economic_impact:
      "Has devastated entire Cavendish export industries across Asia. Estimated $150–400M in losses in Taiwan alone. With no cure and permanent soil infestation, infected farms face permanent loss of banana production unless switching to resistant varieties.",
    look_alikes: [
      "Moko disease (bacterial; affects vascular tissue differently)",
      "Blood disease (bacterial; found in specific SE Asia regions)",
      "Drought stress (no internal vascular staining)",
    ],
    treatment: {
      immediate: [
        "THERE IS NO CURE — focus on containment of spread",
        "Immediately quarantine the affected area — prevent all soil movement out of infected zone",
        "Inject infected pseudostems with herbicide to kill plants in place (avoids soil disturbance from uprooting)",
        "Do NOT uproot plants — this disturbs soil and spreads spores further",
        "Report confirmed or suspected TR4 to DA-BAFPS immediately — it is a notifiable disease",
        "Stop all movement of equipment, people, and plant material out of the infected area",
      ],
      chemical: [
        {
          product: "Phosphonate-based systemic (suppressive only)",
          rate: "5 mL/L via trunk injection",
          frequency: "Monthly — does not cure but may slow spread in neighboring plants",
        },
        {
          product: "Soil fumigation (methyl bromide — restricted use)",
          rate: "Per licensed applicator only",
          frequency: "Pre-planting only; requires DA permit; reduces but does not eliminate soil inoculum",
        },
      ],
      organic: [
        "Trichoderma-enriched soil amendment around borders of affected area (suppressive, preventive only)",
        "Beneficial bacteria (Bacillus subtilis, Pseudomonas fluorescens) as soil drenches around perimeter of clean areas",
        "Organic matter additions to improve soil microbiome diversity around clean borders",
      ],
      cultural: [
        "Establish strict hygiene protocols: dedicated footwear, tools, and vehicles for each field block",
        "Install footbaths with 5% formalin or 2% bleach at all farm entrances",
        "Consider switching to TR4-resistant varieties: FHIA-01, FHIA-02, Cavendish-like TR4-resistant hybrids under development",
        "Fallowing with non-host crops (sweet potato, cassava, vegetables) for 5–10 years",
      ],
    },
    prevention: [
      "This is EXCLUSIVELY a prevention disease — once in your soil, no remediation is effective",
      "Never introduce planting material from unknown or potentially infected sources — demand certified TR4-free tissue culture material",
      "Establish strict farm biosecurity: visitors must use clean footwear and hands before entering any banana block",
      "Know your neighbors: if neighboring farms have Fusarium wilt issues, establish barrier drainage to prevent waterborne spread",
      "Stay informed: register with DA monitoring programs to receive early warning alerts about TR4 detection in your province",
    ],
    monitoring_tips: [
      "Walk every block weekly during the wet season — look for any single plant showing unexplained leaf yellowing starting on outer leaves",
      "Immediately cut pseudostem of any suspicious plant and examine cross-section for vascular discoloration",
      "Submit samples to BIOTECH-UPLB or DA laboratory for PCR confirmation before any action",
      "Map all suspect plants with GPS coordinates for tracking spread pattern",
    ],
    recovery_timeline:
      "Zero recovery. Infected plants die. Infected soil remains infested permanently. Alternative crops must be considered for infested areas.",
    fun_fact:
      "The Gros Michel banana — the variety that dominated global exports until the 1950s — was wiped out by an earlier Fusarium race (Race 1). The Cavendish replaced it, and now TR4 is threatening Cavendish the same way Race 1 threatened Gros Michel.",
  },

  {
    id: "banana_healthy",
    display_name: "Healthy Banana",
    plant: "Banana",
    plant_emoji: "🍌",
    severity: "low",
    thumbnail: banana_healthy_thumbnail,
    tagline: "Vigorous and productive",
    overview:
      "Banana (Musa spp.) is one of the most productive tropical crops — a single healthy mat can produce year-round harvests indefinitely through its ratoon sucker system. The Philippine banana industry is a cornerstone of agriculture, with the country being one of the world's top 5 banana exporters. Healthy Cavendish plantations in Davao yield 30–50 tonnes per hectare annually under optimal management.",
    pathogen_type: "None",
    pathogen_detail: "No pathogen. This describes optimal physiological condition in banana.",
    affected_parts: [],
    symptoms: {
      early: [
        'New leaves unfurl tightly from the pseudostem center as bright green "cigar" rolls',
        "Leaves are bright, uniform mid-green with no spots, streaks, or irregular margins",
        "Pseudostem is firm, upright, and tightly wrapped with overlapping leaf sheaths",
        "Roots: cream-white to light tan when healthy; no dark discoloration",
      ],
      advanced: [
        "Full functional canopy: 8–12 large leaves (Cavendish) supporting fruit development",
        "Bunch emergence at 9–12 months after planting with clear pedicel emergence",
        "Bunch develops with 6–12 hands each containing 14–20 well-formed fingers",
        "Healthy fruit: angular cross-section, firm, bright green (harvest-ready), no external damage",
        "Sucker emergence: 2–4 healthy ratoon suckers developing from base at different stages",
      ],
      distinguishing:
        "Uniformly green leaves with no spots or streaks, firm and upright pseudostem with no yellowing at the base, and normally angular fruit with complete fill. New leaf emergence every 7–10 days in optimal growing conditions indicates excellent health.",
    },
    conditions: {
      temperature: "Optimal: 26–30°C; growth stops below 16°C and above 38°C",
      humidity: "Optimal: 75–85% RH; tolerates higher humidity but raises disease risk",
      season: "Year-round production in PH with proper variety and management",
      spread_method: "N/A",
    },
    economic_impact:
      "Philippine banana exports (primarily Cavendish from Mindanao) earn $800M–$1B USD annually. A healthy managed hectare produces 30–50 tonnes of export-grade Cavendish.",
    look_alikes: [
      "Normal lower leaf senescence (yellowing naturally as leaves age — completely normal)",
      "Wind damage (leaf tearing/tattering — mechanical, not disease)",
    ],
    treatment: {
      immediate: ["No treatment — maintain preventive program and document current status"],
      chemical: [],
      organic: [
        "Monthly foliar calcium-boron spray to maintain fruit quality and reduce internal browning",
        "Quarterly vermicompost application at 5 kg/plant during active growth periods",
      ],
      cultural: [
        "Follow 1-2-3 sucker management: retain mother plant, primary follower, secondary follower only",
        'Bag fruit bunches with blue polyethylene bags at "bell stage" — prevents pests and improves grade',
        "Prop heavy bunches to prevent pseudostem toppling once weight exceeds 20 kg",
        "Fertilize every 2 months: 200-80-300 g NPK per Cavendish plant",
        "Remove any leaves with >25% disease damage immediately upon detection",
        "Maintain irrigation at 25–30mm water equivalent per week during dry periods",
      ],
    },
    prevention: [
      "Apply preventive Sigatoka management program from the time of planting",
      "Test and manage soil pH to 6.0–7.0 for optimal nutrient uptake",
      "Control banana weevil borer (Cosmopolites sordidus) with pheromone traps + targeted treatment",
      "Establish strict farm biosecurity against TR4 as a permanent practice",
    ],
    monitoring_tips: [
      "Track days to flowering and bunch emergence as productivity indicators",
      "Count functional green leaves above the bunch at flowering — fewer than 8 indicates stress or disease pressure",
      "Weigh a sample of bunches (10% of plants) at harvest to track productivity trends over time",
      "Use YSL (youngest spotted leaf) monitoring weekly to track Black Sigatoka disease pressure",
    ],
    recovery_timeline: "N/A — plant is healthy.",
    fun_fact:
      "A banana 'tree' is botanically the world's largest herbaceous plant — the 'trunk' (pseudostem) is made entirely of tightly rolled leaf bases with no woody tissue at all.",
  },

  // ─── GUAVA ───────────────────────────────────────────────────────────────

  {
    id: "guava_anthracnose",
    display_name: "Guava Anthracnose",
    plant: "Guava",
    plant_emoji: "🍈",
    severity: "moderate",
    thumbnail: guava_anthracnose_thumbnail,
    tagline: "Post-harvest rot that strikes ripening fruit rapidly",
    overview:
      "Guava anthracnose, caused primarily by Colletotrichum psidii and related Colletotrichum species, is a significant post-harvest disease of guava that also causes leaf spots and shoot blights on the tree. The disease is most economically damaging as a post-harvest rot — guava fruit are highly perishable, and anthracnose can cause 30–60% post-harvest losses within 3–5 days of harvest under ambient tropical temperatures.",
    scientific_name: "Colletotrichum psidii",
    pathogen_type: "Fungal",
    pathogen_detail:
      "Ascomycete fungus closely related to the mango anthracnose pathogen but adapted to guava. Produces acervuli with characteristic salmon-colored spore masses under moist conditions. Utilizes quiescent (latent) infection — fruit may be infected while green and show no symptoms until ripening triggers lesion development.",
    affected_parts: ["Fruit (primary economic impact)", "Young leaves and shoots", "Bark of young stems"],
    symptoms: {
      early: [
        "Small, circular, brown spots (3–5mm) on green fruit surface — may be missed",
        "Dark brown spots on young leaves with yellow chlorotic halo",
        "Tip blight on young, actively growing shoots",
        "Lesions on leaves may have characteristic salmon-pink spore masses in humid weather",
      ],
      advanced: [
        "Fruit spots enlarge rapidly as fruit ripens — lesions can cover entire fruit within 2–3 days",
        "Infected fruit tissue sinks and turns dark brown/black with soft, watery interior",
        "Salmon-pink spore masses appear in concentric rings on fruit lesions under high humidity",
        "Severe leaf spotting with large necrotic areas and premature leaf drop",
        "Young shoot blight — shoot tips die, affecting new growth flush",
      ],
      distinguishing:
        "On fruit, the characteristic concentric rings of salmon-pink spore masses on dark sunken lesions are diagnostic for Colletotrichum. Distinguishable from fruit fly damage (which penetrates deeper with visible larvae) and from physical damage (no sporulation).",
    },
    conditions: {
      temperature: "25–30°C optimal; disease accelerates dramatically at ripening-stage temperatures",
      humidity: "Free moisture required for spore germination; >85% RH accelerates sporulation",
      season: "Year-round but most damaging during rainy season and the post-harvest period",
      spread_method: "Rain splash, insect movement, contaminated harvest equipment and storage containers",
    },
    economic_impact:
      "Causes 30–60% post-harvest losses under ambient tropical storage. Significantly limits shelf life and transport range. A major barrier to guava export and refrigerated distribution.",
    look_alikes: [
      "Fruit fly damage (puncture wounds with larvae inside)",
      "Physical bruising damage (no sporulation)",
      "Phytophthora fruit rot (watery rot from stem end, different pathogen)",
    ],
    treatment: {
      immediate: [
        "Harvest fruit at the correct maturity stage — do not allow over-ripening on the tree",
        "Handle fruit gently to avoid creating bruises and skin breaks that invite infection",
        "Apply pre-harvest fungicide 2–3 days before harvesting",
        "Dip or spray harvested fruit with approved post-harvest fungicide immediately after harvest",
      ],
      chemical: [
        {
          product: "Thiabendazole 45% SC (post-harvest)",
          rate: "0.5 mL/L dip for 2 minutes",
          frequency: "Single post-harvest treatment before storage or transport",
        },
        {
          product: "Carbendazim 50% WP (pre-harvest)",
          rate: "1 g/L water",
          frequency: "Every 14 days; stop 7 days before harvest (check PHI)",
        },
        {
          product: "Mancozeb 80% WP (pre-harvest)",
          rate: "2 g/L water",
          frequency: "Every 10–14 days on trees; stop 5 days before harvest",
        },
      ],
      organic: [
        "Hot water treatment: dip fruit in 46–48°C water for 10 minutes post-harvest",
        "Chitosan coating (1.5–2%) on harvested fruit — extends shelf life and suppresses anthracnose",
        "Wax coating with carnauba wax post-harvest — physical barrier reducing humidity at fruit surface",
        "Sodium bicarbonate dip (5 g/L) for 5 minutes post-harvest",
      ],
      cultural: [
        "Harvest early in the morning when temperatures are coolest",
        "Avoid field heat buildup — move harvested fruit into shade immediately",
        "Use plastic field crates lined with soft material — avoid bruising during collection",
        "Store fruit in cool, dry conditions if refrigeration is available (8–10°C)",
        "Remove all dropped and infected fruit from the orchard floor weekly",
      ],
    },
    prevention: [
      "Begin protective fungicide program at fruit set stage (small green fruit)",
      "Maintain good orchard sanitation — remove all mummified and fallen fruit consistently",
      "Practice fruit bagging with paper bags at small fruit stage for premium markets",
      "Ensure adequate calcium nutrition — calcium strengthens fruit skin and reduces post-harvest rot susceptibility",
      "Prune to maintain open canopy and reduce fruit-to-fruit contact within clusters",
    ],
    monitoring_tips: [
      "Inspect random fruit samples weekly from small green stage to pre-harvest",
      "After each rain event, check young leaves and shoot tips for new lesions",
      "Inspect post-harvest fruit 24 and 48 hours after harvest to assess effectiveness of post-harvest treatment",
    ],
    recovery_timeline:
      "On-tree foliar and shoot infections: 2–3 weeks of treatment. Post-harvest fruit: cannot be recovered once rot initiates — prevention before harvest is the only solution.",
    fun_fact:
      "Guava fruit has one of the highest Vitamin C contents of any common fruit — 228 mg per 100g, which is 4 times higher than a standard orange. Anthracnose-infected guava loses this nutritional value rapidly as the rot degrades the fruit's antioxidant compounds.",
  },
  {
    id: "guava_blight",
    display_name: "Guava Bacterial Leaf Blight",
    plant: "Guava",
    plant_emoji: "🍈",
    severity: "moderate",
    thumbnail: guava_blight_thumbnail,
    tagline: "Water-soaked lesions that spread fast in warm, wet weather",
    overview:
    "Guava bacterial leaf blight, caused by Erwinia psidii (and in some regions Pseudomonas syringae pv. psidii), is a significant foliar and shoot disease of guava in tropical and subtropical production areas. The disease thrives during warm, rainy periods and can cause rapid defoliation, shoot dieback, and in severe cases, decline of young trees. While less economically damaging than post-harvest diseases, heavy outbreaks reduce photosynthetic capacity, weaken trees, and can compromise fruit set in the following flush.",
    scientific_name: "Erwinia psidii",
    pathogen_type: "Bacterial",
    pathogen_detail:
    "Gram-negative bacterium that enters leaf tissue through natural openings (stomata, hydathodes) and wounds. Spreads systemically within young shoots during active growth flushes. Survives in infected plant debris and on the surface of symptomless host tissue between flushes. Does not form persistent spores — populations decline rapidly in dry conditions.",
    affected_parts: ["Leaves (primary)", "Young shoots and stem tips", "Petioles", "Occasionally young fruit skin"],
    symptoms: {
      early: [
        "Small, water-soaked, irregular spots on leaf margins and tips — appear translucent when held to light",
        "Spots turn pale yellow-green within 2–3 days of infection",
        "Lesions surrounded by a diffuse yellow halo, particularly visible on young expanding leaves",
        "Infected shoot tips may appear wilted or water-soaked before visible necrosis develops",
      ],
      advanced: [
        "Lesions turn brown to dark brown with irregular, angular margins often bounded by leaf veins",
        "Large necrotic patches coalesce across entire leaf blade, leading to premature leaf drop",
        "Shoot tip blight — terminal 5–10 cm of young shoots turn brown and collapse, giving a shepherd's crook appearance",
        "Bacterial exudate (sticky, yellowish ooze) may be visible on lesion surfaces under high humidity in the early morning",
        "Severely affected trees show scorched, tattered canopy with multiple dead shoot tips across the entire crown",
      ],
      distinguishing:
      "Angular lesions bounded by leaf veins and the presence of bacterial ooze on lesion surfaces are key bacterial indicators. Distinguishable from fungal blights by the absence of visible spore masses or fruiting bodies. Lesion margins remain water-soaked longer than typical fungal lesions, which tend to dry out and form concentric rings.",
    },
    conditions: {
      temperature: "25–32°C optimal; disease activity slows below 20°C and above 35°C",
      humidity: "Free moisture on leaf surfaces required for infection; >80% RH sustains epidemic spread",
      season: "Most severe during active growth flushes coinciding with rainy season; can recur with each new flush",
      spread_method: "Rain splash, windblown water, contaminated pruning tools, insect feeding wounds",
    },
    economic_impact:
    "Repeated severe outbreaks cause progressive tree weakening, reduced fruit set, and increased susceptibility to secondary pathogens. Particularly damaging in nurseries and on young orchard trees where canopy development is critical.",
    look_alikes: [
      "Guava anthracnose (fungal — produces salmon-pink spore masses, more circular lesions)",
      "Guava rust (fungal — produces powdery orange-yellow pustules on leaf undersides)",
      "Pesticide phytotoxicity (irregular marginal burn without ooze or progressive spread)",
      "Nutrient deficiency scorch (interveinal or tip burn without water-soaked margins)",
    ],
    treatment: {
      immediate: [
        "Prune and remove all visibly blighted shoots at least 10–15 cm below the last visible lesion",
        "Disinfect pruning tools between cuts with 70% ethanol or 10% bleach solution",
        "Apply copper-based bactericide immediately after pruning to protect fresh wounds and surrounding tissue",
        "Avoid overhead irrigation and activities that splash water during active outbreak",
      ],
      chemical: [
        {
          product: "Copper hydroxide 77% WP",
        rate: "2–3 g/L water",
        frequency: "Every 7–10 days during rainy season or active growth flush; reduce to every 14–21 days in dry season",
      },
      {
        product: "Copper oxychloride 50% WP",
        rate: "2.5 g/L water",
        frequency: "Every 10–14 days; apply before expected rain events for best protection",
      },
      {
        product: "Streptomycin sulfate 20% SP (where registered)",
        rate: "0.5–1 g/L water",
        frequency: "Every 7 days during severe outbreak; alternate with copper to reduce resistance risk",
      },
    ],
    organic: [
      "Copper-based Bordeaux mixture (1:1:100 — copper sulfate:lime:water) as a traditional bactericide",
      "Neem oil extract spray (5 mL/L) — reduces bacterial surface populations and suppresses secondary fungal infection",
      "Bacillus subtilis-based biocontrol products — apply preventively at flush emergence",
      "Avoid excess nitrogen fertilization — lush, soft growth flushes are most susceptible",
    ],
    cultural: [
      "Time heavy pruning to avoid coinciding with the onset of the rainy season",
      "Improve canopy airflow by thinning dense interior branches to reduce leaf wetness duration",
      "Avoid working in the orchard when foliage is wet — disease spreads readily on hands and clothing",
      "Dispose of pruned blighted material away from the orchard — do not compost infected shoots",
      "Use drip irrigation instead of overhead sprinklers to keep foliage dry",
    ],
  },
  prevention: [
    "Begin protective copper sprays at the first signs of new flush emergence, before lesions appear",
    "Maintain balanced fertilization — avoid excess nitrogen that promotes overly succulent, disease-prone growth",
    "Source nursery planting material only from certified, disease-free sources",
    "Establish windbreaks around orchards to reduce wind-driven rain splash between trees",
    "Monitor weather forecasts and apply bactericides preventively ahead of prolonged wet periods",
  ],
  monitoring_tips: [
    "Scout the orchard at every new flush emergence — young expanding leaves are the most vulnerable stage",
    "After rain events exceeding 20mm, inspect shoot tips and young leaves within 48–72 hours for early water-soaked lesions",
    "Mark and track 10–15 sentinel trees across the orchard to detect outbreak hotspots early",
  ],
  recovery_timeline:
    "With aggressive pruning and bactericide application, new growth flush can emerge symptom-free within 3–4 weeks. Full canopy recovery in moderately affected trees typically takes 6–8 weeks across two to three new growth flushes.",
  fun_fact:
    "Guava is one of the most copper-tolerant fruit trees in tropical horticulture — a trait that makes repeated copper bactericide applications more practical on guava than on many other crops, where copper phytotoxicity at effective rates would be a limiting factor.",
},


  {
    id: "guava_rust",
    display_name: "Guava Rust",
    plant: "Guava",
    plant_emoji: "🍈",
    severity: "high",
    thumbnail: guava_rust_thumbnail,
    tagline: "Powdery orange pustules that defoliate and stunt young trees",
    overview:
      "Guava rust, caused by Puccinia psidii (also known as eucalyptus rust or Myrtle rust), is an emerging and highly aggressive fungal disease affecting guava and other Myrtaceae family plants. Originally from South America, it has spread to Australia, Pacific islands, Africa, and Asia. In the Philippines, it poses a significant and growing threat to both commercial guava production and native Myrtaceae species. The rust spreads rapidly on new growth and can cause complete defoliation of young trees, severely stunting their development.",
    scientific_name: "Puccinia psidii",
    pathogen_type: "Fungal (rust)",
    pathogen_detail:
      "Basidiomycete rust fungus; an obligate biotrophic parasite that cannot survive without a living host. Produces bright yellow-orange urediniospores in pustules (uredinia) that are highly visible and easily dispersed by wind. One of the few rust fungi with an extremely broad host range within the Myrtaceae family — infecting over 400 species.",
    affected_parts: [
      "Young expanding leaves (primary target)",
      "Young shoots and growing tips",
      "Flower buds and young fruit",
      "Petioles and young stems",
    ],
    symptoms: {
      early: [
        "Tiny pale yellow spots (1–2mm) on the upper surface of very young, expanding leaves",
        "Corresponding small raised yellow pustules on the underside of affected leaves",
        "Affected young tissue appears slightly distorted or water-soaked around pustules",
        "Yellow powdery spore masses visible on shoot tips when young growth is emerging",
      ],
      advanced: [
        "Pustules enlarge and rupture releasing masses of bright orange-yellow powder (urediniospores)",
        "Heavily infected young leaves become distorted, curl, and die prematurely",
        'Complete necrosis of infected shoot tips — "dieback" of all actively expanding growth',
        "Premature leaf drop leading to partial or complete defoliation of young trees",
        "Young fruit develop orange pustules and may abort or become misshapen",
        "Repeated defoliation severely stunts growth of young trees and delays production",
      ],
      distinguishing:
        "The bright orange-yellow powdery pustules on young tissue are absolutely distinctive for rust disease. No other common guava disease produces this orange powder. The disease only attacks very young, actively expanding tissue — mature leaves are highly resistant. Mass bright-orange spore release when pustules are disturbed is pathognomonic.",
    },
    conditions: {
      temperature: "15–25°C optimal; cooler than most other tropical plant diseases",
      humidity: "Requires free moisture and >12 hours of leaf wetness for spore germination and infection",
      season: "Rainy season; particularly severe during periods of frequent new flush combined with cool wet weather",
      spread_method: "Wind-dispersed urediniospores travel long distances; rain splash for local spread",
    },
    economic_impact:
      "Can cause complete defoliation of young trees, delaying first fruiting by 1–2 years. On bearing trees, repeated defoliation reduces yield by 30–50%. A significant threat to agroforestry systems using Myrtaceae species as shade trees.",
    look_alikes: [
      "Algal leaf spot (green not orange; very different texture)",
      "Spray residue from sulfur fungicides (yellow but no pustule structure)",
      "Normal new leaf reddening (uniform color change, no pustules or powder)",
    ],
    treatment: {
      immediate: [
        "Remove and destroy all infected plant parts — bag and burn, do not compost",
        "Apply systemic fungicide immediately at first sign of orange pustules",
        "Protect all new flush growth with fungicide before it expands",
        "Avoid overhead irrigation which prolongs leaf wetness and spore dispersal",
      ],
      chemical: [
        {
          product: "Triadimefon 25% WP (triazole)",
          rate: "1 g/L water",
          frequency: "Every 10–14 days; excellent systemic activity against rust fungi",
        },
        {
          product: "Azoxystrobin 25% SC (strobilurin)",
          rate: "1 mL/L water",
          frequency: "Every 14 days; protectant and curative; rotate with triazoles",
        },
        {
          product: "Mancozeb 80% WP (protectant)",
          rate: "2.5 g/L water",
          frequency: "Every 7–10 days during active flush stage as protective cover",
        },
        {
          product: "Copper oxychloride 50% WP",
          rate: "2.5 g/L water",
          frequency: "Every 10–14 days; general protectant at flush emergence",
        },
      ],
      organic: [
        "Sulfur dust or wettable sulfur (3 g/L) — particularly effective against rust fungi when applied preventively",
        "Neem oil (2%) at flush emergence — inhibits spore germination on young tissue",
        "Potassium bicarbonate (5 g/L) — disrupts fungal cell wall formation",
        "Trichoderma harzianum foliar spray as biological competitive exclusion",
      ],
      cultural: [
        "Time pruning to manage flush emergence away from cool wet periods",
        "Improve air circulation through canopy thinning to reduce leaf wetness duration",
        "Synchronize flush emergence across the orchard to allow single coordinated spray events",
        "Remove heavily infected trees in nurseries immediately to protect healthy stock",
      ],
    },
    prevention: [
      "Apply protective fungicide at the first sign of new flush emergence — new growth is the only entry point",
      "Inspect nursery stock carefully before purchase — rust spreads readily through infected planting material",
      "Avoid creating conditions of prolonged leaf wetness: drip irrigation, good drainage, canopy thinning",
      "Monitor neighboring farms and report first detections to DA — area-wide spread is rapid with wind-dispersed spores",
      "Maintain strong tree nutrition — well-nourished trees produce stronger cell walls less susceptible to rust penetration",
    ],
    monitoring_tips: [
      "Inspect all new flush every 3–5 days — infection and visible symptom development occur within 7–10 days of spore landing",
      "Check the underside of very young leaves first — uredinia appear on the underside before the upper surface",
      "During cool wet spells, increase monitoring frequency to every 2 days on young trees",
      "Track flush cycles: scout most intensively during the week after major flush emergence events",
    ],
    recovery_timeline:
      "Infected young tissue cannot recover. New flush protected by fungicide program will be clean. Defoliated trees regenerate new canopy within 4–8 weeks if disease is controlled. Young tree growth delay: potentially 3–6 months for severely defoliated plants.",
    fun_fact:
      "Puccinia psidii (guava rust) is considered one of the most significant biosecurity threats to Australia's native ecosystems, where it threatens over 400 native Myrtaceae species including iconic eucalyptus trees. In 2010 it was detected in Australia and triggered a national biosecurity emergency response.",
  },

  {
    id: "guava_healthy",
    display_name: "Healthy Guava",
    plant: "Guava",
    plant_emoji: "🍈",
    severity: "low",
    thumbnail: guava_healthy_thumbnail,
    tagline: "Hardy, productive, and rich in Vitamin C",
    overview:
      "Guava (Psidium guajava) is one of the hardiest tropical fruit trees, tolerating poor soils, drought, and periods of neglect far better than most other fruit crops. A healthy guava tree in the Philippines yields 80–150 kg of fruit per year and begins bearing as early as 2–3 years from planting. The Philippine pink guava is prized for its exceptional Vitamin C content (228 mg/100g — 4× that of orange), distinctive flavor, and versatility in both fresh and processed product markets.",
    pathogen_type: "None",
    pathogen_detail: "No pathogen. This describes optimal physiological condition in guava.",
    affected_parts: [],
    symptoms: {
      early: [
        "New growth: bright lime-green tender leaves, slightly reddish at growing tips — NORMAL",
        "Stems are distinctly four-angled (square cross-section) in young growth — a key identifier of healthy guava",
        "Bark: smooth, thin, naturally peeling in papery multi-colored flakes — this is NORMAL and healthy",
        "Flowers: small white 4-petaled flowers with prominent white stamens cluster, highly fragrant",
      ],
      advanced: [
        "Mature leaves: leathery, firm, dark green with distinctive parallel leaf venation",
        "Fruit: round to pear-shaped, 5–12cm diameter depending on variety; skin turns yellow-green when ripe",
        "Flesh: white to pink (variety-dependent); firm near skin, soft at center when ripe",
        "Root system: fibrous, extensive, surface-spreading; tolerant of limited root volume",
      ],
      distinguishing:
        "The characteristic four-angled (square) young stems and the naturally multi-colored peeling bark (green, tan, gray patches) are unique to guava and must not be mistaken for disease. The peeling bark is the tree's normal bark renewal process.",
    },
    conditions: {
      temperature: "Tolerates 10–45°C; optimal range 23–28°C",
      humidity: "Highly adaptable to both humid tropical and semi-arid conditions",
      season: "Year-round fruiting in PH; major season August–November, minor season February–April",
      spread_method: "N/A",
    },
    economic_impact:
      "Philippine guava industry produces 35,000+ tonnes annually with growing demand for value-added products (juice concentrate, jelly, wine, dried guava, and nutraceuticals) from the high antioxidant content.",
    look_alikes: [
      "Naturally peeling bark (normal) vs. canker disease (sunken, oozing lesions)",
      "Normal multi-colored bark (normal) vs. Fusarium infection (starts with wilting, not bark appearance)",
    ],
    treatment: {
      immediate: ["No treatment needed — document current condition as healthy baseline"],
      chemical: [],
      organic: [
        "Compost application at 5–10 kg/tree twice yearly to maintain soil fertility",
        "Foliar micronutrient spray (Zinc, Boron, Manganese) every quarter",
      ],
      cultural: [
        "Prune to open vase shape with 3–4 scaffold branches and open center for airflow",
        "Fertilize 3–4 times per year: 100-50-100 g NPK per year of tree age per application",
        "Bag developing fruit with paper or plastic bags to prevent guava fruit fly and improve skin appearance",
        "Thin crowded fruit clusters to 1–2 fruit per cluster to improve size and quality",
        "Maintain clean orchard floor — collect and remove all fallen fruit weekly without exception",
      ],
    },
    prevention: [
      "Apply Trichoderma as standard soil treatment at planting to establish biological protection against Fusarium wilt",
      "Monitor weekly for guava fruit fly (Bactrocera correcta) using cue-lure traps — major quality pest",
      "Apply preventive copper spray once per season during the wet period for general disease suppression",
      "Avoid root injury during any cultivation — use shallow cultivation maximum 5cm around trees",
    ],
    monitoring_tips: [
      "Check new growth weekly — sudden tip wilting warrants immediate investigation for Fusarium entry",
      "Monitor fruit set and track the natural drop rate as a productivity health indicator",
      "Watch for asymmetric yellowing patterns — starts at base in Fusarium wilt vs. tip yellowing in drought stress",
    ],
    recovery_timeline: "N/A — plant is healthy.",
    fun_fact:
      "Guava leaves contain powerful antibacterial compounds including quercetin and guajavarin that are used in traditional Philippine medicine to treat wounds, diarrhea, and toothache. Modern pharmacological research has confirmed significant antimicrobial activity against Staphylococcus aureus and E. coli.",
  },

  // ─── CALAMANSI ───────────────────────────────────────────────────────────

  {
    id: "calamansi_blackspot",
    display_name: "Citrus Black Spot",
    plant: "Calamansi",
    plant_emoji: "🍊",
    severity: "moderate",
    thumbnail: calamansi_blackspot_thumbnail,
    tagline: "Fruit-blemishing fungal spots that destroy market value",
    overview:
      "Citrus black spot (CBS), caused by Phyllosticta citricarpa, is a fungal disease that primarily attacks maturing citrus fruit, producing distinctive black spots and blemishes that make fruit commercially unmarketable. While the disease rarely causes significant tree damage, it is a major economic concern due to its impact on fruit appearance and quality. CBS is a quarantine pest in several countries including the USA and Europe, severely restricting export of Philippine calamansi to these markets. It thrives in warm, humid conditions during the fruit development period.",
    scientific_name: "Phyllosticta citricarpa",
    pathogen_type: "Fungal",
    pathogen_detail:
      "Ascomycete fungus that infects fruit through the skin (pericarp) and can remain quiescent (latent) for months before symptoms appear as fruit matures. Produces pycnidia (flask-shaped fruiting bodies) in lesion centers visible as small black dots. Spores are dispersed by rain splash from infected fallen fruit and dead leaves.",
    affected_parts: ["Fruit surface (primary)", "Mature leaves (secondary, minor)", "Occasionally twigs"],
    symptoms: {
      early: [
        "Small, slightly sunken spots with red-brown centers on green maturing fruit",
        'Spots surrounded by a yellow halo on green fruit — "freckle spot" early form',
        'Lesions may appear as raised, corky tan spots without clear margins — "false melanose" early form',
        "Symptoms often invisible on green fruit; become apparent as fruit approaches maturity",
      ],
      advanced: [
        "Hard spot: sunken, circular, tan/gray center with dark brown to black margin and yellow halo — the classic CBS lesion",
        "Virulent spot: large (1–3cm) irregular tan/brown lesions with no clear margin; entire fruit may appear blighted",
        "Freckle spot: small, numerous raised brown spots coalescing to give fruit a speckled appearance",
        "Cracked spot: sunken lesions that crack and expose tissue; pathway for secondary rot organisms",
        "Multiple lesion types may appear on a single fruit simultaneously",
        "Severely affected fruit drops prematurely",
      ],
      distinguishing:
        'The four distinct lesion types (hard spot, virulent spot, freckle spot, cracked spot) are all caused by the same pathogen and may co-occur on one fruit. The sunken center with dark margin and yellow halo on "hard spot" lesions is the most recognizable. Distinguished from citrus canker (raised corky lesions with oily margins) and from melanose (tiny raised dots without the defined halo).',
    },
    conditions: {
      temperature: "20–28°C optimal; infection requires warm temperatures during fruit development",
      humidity: "Rain splash required for spore dispersal; >3 hours leaf/fruit wetness needed for infection",
      season: "Most critical during the 4–6 month fruit development period; worst in wet seasons",
      spread_method: "Rain splash from infected fallen fruit and dead leaves; wind-driven rain events",
    },
    economic_impact:
      "Quarantine pest status in USA and EU effectively bars Philippine calamansi exports to these markets. On domestic market, heavily spotted fruit sells at 40–60% discount. Post-harvest losses from secondary rots entering through cracked spots can reach 20–30%.",
    look_alikes: [
      "Citrus canker (raised corky lesions with oily water-soaked margins; affects leaves too)",
      "Melanose (tiny uniform raised dots; no yellow halo; all uniform size)",
      "Physical insect damage (puncture wounds without halo pattern)",
      "Greasy spot (yellow-brown blotches on leaves; no defined lesion structure on fruit)",
    ],
    treatment: {
      immediate: [
        "Remove and destroy all infected fallen fruit from the orchard floor — these are the primary spore source",
        "Apply fungicide immediately at first sign of spots appearing on fruit",
        "Do NOT leave infected fruit on the ground — collect and bury or burn daily during wet periods",
        "Reduce canopy density through pruning to decrease humidity and leaf wetness duration",
      ],
      chemical: [
        {
          product: "Copper hydroxide 77% WP",
          rate: "2.5 g/L water",
          frequency: "Every 14 days during fruit development; primary protectant",
        },
        {
          product: "Carbendazim 50% WP",
          rate: "1 g/L water",
          frequency: "Every 14 days; systemic activity against Phyllosticta",
        },
        {
          product: "Azoxystrobin 25% SC",
          rate: "1 mL/L water",
          frequency: "Every 21 days; rotate with copper-based products",
        },
        {
          product: "Mancozeb 80% WP",
          rate: "2 g/L water",
          frequency: "Every 10–14 days; protective coverage during rainy periods",
        },
      ],
      organic: [
        "Bordeaux mixture (1:1:100) as copper-based protectant during fruit development",
        "Neem oil (2%) every 7–10 days as suppressive spray on developing fruit",
        "Biocontrol: Bacillus subtilis foliar spray weekly during wet season as preventive measure",
      ],
      cultural: [
        "Collect all fallen fruit and leaves weekly without exception — ground debris is the primary inoculum source",
        "Prune to maintain open canopy and reduce fruit-to-fruit contact",
        "Avoid overhead irrigation during fruit development — drip irrigation eliminates splash dispersal",
        "Wax-coat harvested fruit to reduce post-harvest losses from secondary infection through cracks",
        "Harvest at appropriate maturity before symptoms intensify at full ripeness",
      ],
    },
    prevention: [
      "Begin copper spray program from petal fall (fruitlet stage) and continue throughout fruit development",
      "Maintain aggressive orchard floor sanitation — fallen fruit and leaves year-round",
      "Prune annually after harvest to open canopy and reduce humidity",
      "Plant windbreaks to reduce rain-splash dispersal between trees during wet season",
      "Use copper + oil sprays during first 2 months of fruit development — most critical protection window",
    ],
    monitoring_tips: [
      "Inspect 20 random fruit per tree monthly from fruit set through pre-harvest",
      "Check fallen fruit as a disease severity indicator — high fallen fruit infection = high on-tree risk",
      "Record the percentage of fruit with lesions to track whether spray program is adequate",
      "Increase inspection frequency during and after prolonged wet weather periods",
    ],
    recovery_timeline:
      "Existing lesions on fruit are permanent and cannot be reversed. New fruit protected by timely fungicide program from petal fall will have significantly fewer blemishes. Full tree management results visible in following season.",
    fun_fact:
      "Citrus black spot was first described from South Africa in 1895 and spread globally through infected planting material during the 20th century. Its current quarantine pest status in over 30 countries makes it one of the most economically impactful citrus pathogens from a trade restriction perspective, even though the disease itself does not threaten tree survival.",
  },

  {
    id: "calamansi_greening",
    display_name: "Citrus Greening (HLB)",
    plant: "Calamansi",
    plant_emoji: "🍊",
    severity: "critical",
    thumbnail: calamansi_greening_thumbnail,
    tagline: "The incurable disease destroying citrus worldwide",
    overview:
      'Citrus Greening, known as Huanglongbing (HLB) — "yellow dragon disease" in Chinese — is considered the most devastating citrus disease in the world. Caused by Candidatus Liberibacter asiaticus (CLas) and transmitted exclusively by the Asian citrus psyllid, HLB has no cure. Once infected, a tree will decline and die within 5–10 years. HLB has devastated the Florida citrus industry (90% production loss since 2005) and is spreading throughout SE Asia. The Philippine calamansi industry faces growing threat as psyllid populations expand.',
    scientific_name: "Candidatus Liberibacter asiaticus (CLas)",
    pathogen_type: "Bacterial (phloem-limited)",
    pathogen_detail:
      "Gram-negative, phloem-limited bacterium — lives only in the plant's phloem (sugar-conducting vessels). Cannot be cultured on artificial media, making research extremely difficult. Transmitted exclusively by the Asian citrus psyllid (Diaphorina citri) — no other transmission route.",
    affected_parts: [
      "Phloem tissue (systemic throughout entire plant)",
      "Leaves",
      "Fruit",
      "Root system (progressive deterioration)",
    ],
    symptoms: {
      early: [
        '"Blotchy mottle" on leaves: ASYMMETRIC yellow-green mottling that does NOT follow vein patterns',
        'One or a few branches showing yellow leaves while the rest of the tree remains green ("sectorial yellowing")',
        "Twig dieback on affected branches",
        "Reduced and stunted new flush emergence",
      ],
      advanced: [
        'Leaves: small, upright posture (not hanging normally), with characteristic "rabbit ear" appearance',
        'Fruit: small, lopsided, remaining green at the stylar (bottom) end while rest colors — the "green island" symptom',
        "Fruit: intensely bitter, with aborted seeds — commercially worthless",
        "Progressive season-by-season decline: fewer flushes, smaller canopy, lower yield",
        "Advanced root system deterioration with feeder root dieback",
        "Tree death within 5–10 years of initial infection",
      ],
      distinguishing:
        "The ASYMMETRIC blotchy leaf mottling is the key diagnostic feature — nutrient deficiencies create SYMMETRIC mirror-image yellowing, while HLB creates random, asymmetric patches crossing veins freely. The lopsided green-bottomed fruit symptom is pathognomonic and confirms HLB definitively.",
    },
    conditions: {
      temperature: "CLas optimal: 27–30°C; psyllid vector optimal: 25–28°C",
      humidity: "Vector (psyllid) populations peak during new flush emergence periods regardless of humidity",
      season: "Year-round transmission wherever psyllid is established",
      spread_method:
        "EXCLUSIVELY by Asian citrus psyllid (Diaphorina citri) feeding; also via infected budwood/grafting",
    },
    economic_impact:
      "Florida citrus industry lost $8 billion and 70% of production since HLB arrival in 2005. In the Philippines, threatens the ₱2 billion calamansi industry. No commercial variety is immune.",
    look_alikes: [
      "Zinc deficiency (symmetric, uniform interveinal yellowing)",
      "Magnesium deficiency (symmetric interveinal yellowing of older leaves)",
      "Citrus tristeza virus (no fruit greening symptom)",
    ],
    treatment: {
      immediate: [
        "THERE IS NO CURE — all management focuses on slowing decline and protecting uninfected trees",
        "Confirm diagnosis with PCR test at DA-BAI laboratory before removing any trees",
        "Remove confirmed infected trees promptly to reduce persistent psyllid inoculum source",
        "Immediately begin INTENSIVE psyllid control on ALL remaining trees in the vicinity",
        "Notify neighboring farms — HLB management requires synchronized area-wide action to be effective",
      ],
      chemical: [
        {
          product: "Imidacloprid 200 SC (psyllid control)",
          rate: "0.5 mL/L foliar OR 5 mL/10L soil drench",
          frequency: "Foliar every 21 days targeting new flush; soil drench every 3 months",
        },
        {
          product: "Thiamethoxam 25% WG (psyllid control)",
          rate: "0.5 g/L water",
          frequency: "Every 14–21 days; strictly rotate with imidacloprid to prevent resistance",
        },
        {
          product: "Oxytetracycline (antibiotic trunk injection — suppressive)",
          rate: "Per label; trunk injection",
          frequency: "Every 6 months; delays decline by 2–3 years but does not cure",
        },
      ],
      organic: [
        "Release Tamarixia radiata — natural parasitoid wasp that parasitizes Asian citrus psyllid nymphs",
        "Kaolin clay spray (5%) — physical barrier reducing psyllid feeding and egg-laying on new flush",
        "Neem oil (2%) targeting actively expanding new flush growth when psyllids are present",
      ],
      cultural: [
        "Synchronize new flush emergence within your orchard through uniform pruning — spray all at once at flush emergence",
        "Remove infected trees promptly — each infected tree is a permanent, year-round inoculum source for psyllids",
        "Verify all purchased planting material with PCR test before introducing to any block",
      ],
    },
    prevention: [
      "Source ALL planting material from certified, screen-house-grown, PCR-tested HLB-free nurseries",
      "Install yellow sticky traps (1 per 20 trees) now — detect psyllid before it spreads through your orchard",
      "Begin systemic insecticide program immediately at first psyllid detection — never wait for infestation",
      "Participate in area-wide coordinated management programs — isolated farm control is insufficient",
      "Coordinate with neighboring farmers — psyllids travel between farms",
    ],
    monitoring_tips: [
      "Check yellow sticky traps weekly and record psyllid counts to track population trends",
      "Inspect all new flush growth every 5–7 days for psyllid presence (2–3mm brown insects, white waxy tubes)",
      "Map all symptomatic trees with dates of first observation to track spread direction and rate",
      "Submit leaf samples (10g minimum, refrigerated) to DA-BAI for PCR confirmation when HLB is suspected",
    ],
    recovery_timeline:
      "No recovery. Infected trees decline progressively over 5–10 years. Antibiotic trunk injections extend productive life 2–3 years but are not economically viable for smallholders.",
    fun_fact:
      "Candidatus Liberibacter asiaticus has never been successfully grown in laboratory culture despite decades of intensive research — making it one of the only major global agricultural pathogens that remains 'unculturable.'",
  },

  {
    id: "calamansi_canker",
    display_name: "Citrus Canker",
    plant: "Calamansi",
    plant_emoji: "🍊",
    severity: "high",
    thumbnail: calamansi_canker_thumbnail,
    tagline: "Wind-spread bacteria that scar every part of the tree",
    overview:
      "Citrus canker, caused by Xanthomonas citri subsp. citri, is a highly contagious bacterial disease affecting all citrus including calamansi. It produces raised, corky lesions on leaves, stems, and fruit that are surrounded by distinctive oily water-soaked margins and yellow halos. While rarely killing trees, citrus canker causes significant defoliation, fruit blemishing, and in severe cases, fruit drop. It is a quarantine disease in many countries, severely restricting calamansi export.",
    scientific_name: "Xanthomonas citri subsp. citri",
    pathogen_type: "Bacterial",
    pathogen_detail:
      "Gram-negative rod-shaped bacterium entering plant tissue through stomata and wounds. Infects both young and mature tissues. Produces distinctive raised corky eruptions due to hypertrophy of infected cells.",
    affected_parts: ["Leaves (both surfaces)", "Young stems and twigs", "Fruit surface", "Petioles"],
    symptoms: {
      early: [
        "Tiny, water-soaked, translucent spots (1–2mm) on undersurface of young leaves",
        "Spots develop raised, crater-like appearance on both leaf surfaces within 7–10 days",
        "Yellow (chlorotic) halo surrounding lesions on leaves is very distinctive",
        "Similar raised lesions appear on young stems and petioles",
      ],
      advanced: [
        'Lesions become raised, corky, tan/brown with rough, cracked surface — the namesake "canker" appearance',
        "Yellow halo around lesions becomes prominent and distinctive",
        "Fruit: corky raised lesions with oily water-soaked margin and yellow halo — permanent fruit blemish",
        "Severe leaf drop following heavy infection, reducing canopy and productivity",
        "Twig dieback in heavily infected trees under sustained pressure",
        "During typhoons: rapid expansion with fresh lesions appearing on every leaf simultaneously",
      ],
      distinguishing:
        "The raised, corky texture of citrus canker lesions with oily water-soaked margins and prominent yellow halos distinguishes it from HLB (systemic, no raised lesions), melanose (smaller, rough-textured spots without halo), and CBS (sunken spots without oily margins). Lesions look similar on both leaf surfaces.",
    },
    conditions: {
      temperature: "25–35°C optimal; warm, wet, windy conditions are ideal for rapid spread",
      humidity: "Wind-driven rain essential for bacterial dispersal into leaf stomata",
      season: "Worst during and after typhoon season (July–October); spreads explosively during typhoon events",
      spread_method:
        "Wind-driven rain splash; contaminated pruning tools; infected planting material; citrus leafminer tunnels",
    },
    economic_impact:
      "Quarantine pest in Japan, USA, and other major importers — creates serious export restrictions. Reduces marketable fruit by 30–50% through blemishing. Repeated defoliation reduces long-term tree productivity significantly.",
    look_alikes: [
      "CBS / Citrus black spot (sunken spots without oily margins)",
      "Melanose (tiny uniform dots; no oily margin or prominent halo)",
      "Wind damage (mechanical scarring without yellow halo)",
    ],
    treatment: {
      immediate: [
        "Prune all heavily infected shoots 10–15cm below lowest lesion into clean wood",
        "Sterilize pruning tools between every cut with 70% isopropyl alcohol",
        "Apply copper bactericide spray to entire tree immediately after pruning",
        "Remove and burn all pruned material on the same day",
      ],
      chemical: [
        {
          product: "Copper hydroxide 77% WP",
          rate: "2.5–3 g/L water",
          frequency: "Every 10–14 days; apply before predicted rain/wind events",
        },
        {
          product: "Copper oxychloride 50% WP",
          rate: "2.5 g/L water",
          frequency: "Every 10 days during wet season and after typhoon events",
        },
        {
          product: "Streptomycin sulfate (where registered)",
          rate: "0.5 g/L water",
          frequency: "Maximum 2× per season; strict rotation to prevent antibiotic resistance",
        },
      ],
      organic: [
        "Copper-soap (copper octanoate) sprays as lower-residue bactericidal option",
        "Bacillus subtilis PGPR spray weekly as preventive biological bactericide",
        "Lime sulfur spray (3%) — alkaline pH inhibitory to bacterial survival on leaf surface",
      ],
      cultural: [
        "Install windbreaks on all windward sides of the orchard — wind spread is the primary driver",
        "Control citrus leafminer (Phyllocnistis citrella) aggressively — leafminer tunnels are primary entry wounds for canker bacteria",
        "Synchronize new flush emergence through uniform pruning and spray all at flush emergence",
        "Reduce overhead irrigation — drip irrigation eliminates the water film that enables bacterial splash spread",
      ],
    },
    prevention: [
      "Establish windbreaks before establishing any new calamansi orchard",
      "Control citrus leafminer as the highest priority pest — its feeding scars are the primary entry points for canker",
      "Apply copper preventively at flush emergence every season without exception",
      "Post-typhoon spray: apply copper bactericide within 24–48 hours after every major wind-rain event",
      "Screen or quarantine all new plants for 6 months before introducing to main orchard",
    ],
    monitoring_tips: [
      "Scout all new flush growth weekly — young leaves are most susceptible during expansion",
      "Inspect immediately after typhoons or heavy rain-wind events — new lesions appear within 7 days",
      "Check under-leaf surfaces first — water-soaked spots appear there before top surface",
      "Monitor leafminer activity using pheromone traps as a proxy for canker infection risk",
    ],
    recovery_timeline:
      "Existing lesions on leaves and fruit are permanent. New growth after adequate copper protection will be clean. Full canopy recovery: 2–4 months with consistent copper program and leafminer control.",
    fun_fact:
      "The 2005–2006 citrus canker eradication campaign in Florida involved destroying over 8 million residential citrus trees at a cost of $1 billion — only for the eradication to ultimately fail when Tropical Storm Fay in 2008 spread the bacteria too widely.",
  },

  {
    id: "calamansi_healthy",
    display_name: "Healthy Calamansi",
    plant: "Calamansi",
    plant_emoji: "🍊",
    severity: "low",
    thumbnail: calamansi_healthy_thumbnail,
    tagline: "The Philippine kitchen essential",
    overview:
      "Calamansi (Citrofortunella microcarpa) is the most important citrus in the Philippines — a cultural icon used in virtually every Filipino kitchen, in traditional medicine, and increasingly in cosmetics and beverages. A healthy, well-managed calamansi tree bears fruit year-round, with peak production October–February. Healthy trees live 15–20+ years and produce 500–1,000+ fruit per tree annually.",
    pathogen_type: "None",
    pathogen_detail: "No pathogen. This describes optimal physiological condition in calamansi.",
    affected_parts: [],
    symptoms: {
      early: [
        "New growth: reddish-bronze emerging leaves that quickly transition to bright green — NORMAL for citrus",
        "Leaves: small (5–8cm), glossy, dark green with characteristic winged petiole on either side of the leaf stem",
        "Stems: armed with spines at leaf axils; smooth green bark on actively growing young branches",
        "Flowers: small (1cm), pure white, strongly fragrant — 4–5 petals; appear throughout the year",
      ],
      advanced: [
        "Fruit: small (2.5–3.5cm diameter), round; green skin at immature stage turning orange-yellow when ripe",
        "Ripe fruit: deep orange skin; intensely sour-sweet juice inside with numerous seeds",
        "Healthy fruit: perfectly round, symmetric, smooth skin with no blemishes or green areas when fully ripe",
        "Root system: fibrous, well-distributed, cream-white colored feeder roots near soil surface",
        "Canopy: dense, rounded form, 2–4m height at productive maturity",
      ],
      distinguishing:
        "Healthy calamansi has perfectly SYMMETRIC leaf coloring. Any yellowing follows uniform vein patterns (suggesting nutrient issues) rather than random blotchy patches (which strongly suggests HLB). The winged petiole is a morphological identifier unique to calamansi among Philippine citrus.",
    },
    conditions: {
      temperature: "Optimal: 25–30°C; frost-sensitive below 5°C; adapted to full tropical conditions",
      humidity: "Tolerates high Philippine humidity; avoid persistent waterlogging at root zone",
      season: "Year-round fruiting; heavy commercial crop October–February; minor crop March–May",
      spread_method: "N/A",
    },
    economic_impact:
      "Philippine calamansi production exceeds 100,000 tonnes annually with a farmgate value of ₱2+ billion. Used in juice concentrate, personal care products, traditional herbal medicine, condiments, and marinades.",
    look_alikes: [
      "HLB infection (asymmetric mottling vs. healthy uniform green)",
      "Normal immature green fruit vs. HLB-infected green fruit that does not fully color",
    ],
    treatment: {
      immediate: ["No treatment — maintain preventive program and record as healthy baseline"],
      chemical: [],
      organic: [
        "Quarterly foliar calcium-zinc spray to maintain leaf quality and consistent fruit set",
        "Monthly vermicompost tea soil drench during active growth periods",
      ],
      cultural: [
        "Prune lightly after each peak harvest season to shape tree and stimulate new vegetative flush",
        "Fertilize 4× per year using 100-50-100 g NPK per year of tree age per application",
        "Maintain 50cm organic mulch ring — keep mulch 10cm away from trunk to prevent collar rot",
        "Apply foliar micronutrients (Zn, Fe, Mn, B) every quarter to prevent common deficiencies",
        "Lime soil if pH drops below 5.5 — calamansi requires pH 6.0–7.0 for optimal nutrient availability",
      ],
    },
    prevention: [
      "Install yellow sticky psyllid traps immediately — early detection is the only HLB defense",
      "Begin imidacloprid soil drench at first psyllid detection on traps",
      "Source replacement trees ONLY from certified, screened, HLB-tested nurseries — no exceptions",
      "Apply preventive copper + oil spray each season for general fungal/bacterial suppression",
      "Control citrus leafminer (Phyllocnistis citrella) aggressively — feeding tunnels invite canker bacteria",
    ],
    monitoring_tips: [
      "Weekly inspection of all new flush for psyllid presence — white waxy tubes, small brown insects at 45° angle",
      "Monthly fruit count per branch as a productivity trend indicator",
      "Quarterly soil pH testing — calamansi is highly sensitive to pH outside optimal range",
      "Immediately recheck any asymmetric leaf yellowing at 2 weeks and 4 weeks — HLB symptoms are progressive",
    ],
    recovery_timeline: "N/A — tree is healthy.",
    fun_fact:
      "Calamansi is botanically a hybrid between kumquat (Fortunella japonica) and mandarin orange (Citrus reticulata), which explains its small size (kumquat heritage) combined with its juicy interior and sour-sweet flavor profile (mandarin heritage).",
  },
];

export const getDiseaseById = (id: string): DiseaseGuide | undefined => DISEASE_LIBRARY.find((d) => d.id === id);

const normalizeLibraryKey = (value?: string): string =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export const resolveDiseaseLibraryId = ({
  explicitId,
  plantType,
  diseaseName,
}: {
  explicitId?: string;
  plantType?: string;
  diseaseName?: string;
}): string | null => {
  const normalizedToId = new Map(
    DISEASE_LIBRARY.map((entry) => [normalizeLibraryKey(entry.id), entry.id] as const)
  );

  const resolveCandidate = (candidate?: string): string | null => {
    const normalized = normalizeLibraryKey(candidate);
    if (!normalized) return null;
    return normalizedToId.get(normalized) ?? null;
  };

  const explicitMatch = resolveCandidate(explicitId);
  if (explicitMatch) return explicitMatch;

  const plant = normalizeLibraryKey(plantType);
  let disease = normalizeLibraryKey(diseaseName);
  if (plant && disease.startsWith(`${plant}_`)) {
    disease = disease.slice(plant.length + 1);
  }

  const directCandidates = [
    plant && disease ? `${plant}_${disease}` : "",
    plant && disease ? `${plant}_${disease.replace(/_disease$/, "")}` : "",
    plant && disease ? `${plant}_${disease.replace(/_spot$/, "spot")}` : "",
    plant && disease ? `${plant}_${disease.replace(/_mold$/, "_mould")}` : "",
    disease,
  ];

  for (const candidate of directCandidates) {
    const resolved = resolveCandidate(candidate);
    if (resolved) return resolved;
  }

  if (!disease) return null;

  const diseaseNoUnderscore = disease.replace(/_/g, "");
  const fallbackPool = DISEASE_LIBRARY.filter((entry) => {
    if (!plant) return true;
    return entry.id.startsWith(`${plant}_`);
  });

  for (const entry of fallbackPool) {
    const entryId = normalizeLibraryKey(entry.id);
    const entryDisplay = normalizeLibraryKey(entry.display_name);
    const entryIdNoUnderscore = entryId.replace(/_/g, "");

    if (
      entryId.includes(disease) ||
      disease.includes(entryId) ||
      entryDisplay.includes(disease) ||
      disease.includes(entryDisplay) ||
      entryIdNoUnderscore.includes(diseaseNoUnderscore)
    ) {
      return entry.id;
    }
  }

  return null;
};

export const getSeverityColor = (severity: Severity): string => {
  switch (severity) {
    case "low":
      return "#10b981";
    case "moderate":
      return "#f59e0b";
    case "high":
      return "#f97316";
    case "critical":
      return "#ef4444";
  }
};

export const getSeverityLabel = (severity: Severity): string => {
  switch (severity) {
    case "low":
      return "Low Risk";
    case "moderate":
      return "Moderate";
    case "high":
      return "High Risk";
    case "critical":
      return "Critical";
    default:
      return "Moderate";
  }
};

export const getPlantColor = (plant: string): string => {
  switch (plant.toLowerCase()) {
    case "mango":
      return "#f59e0b";
    case "banana":
      return "#eab308";
    case "guava":
      return "#10b981";
    case "calamansi":
      return "#f97316";
    default:
      return "#10b981";
  }
};
