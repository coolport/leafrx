export type Severity = 'low' | 'moderate' | 'high' | 'critical';

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
    symptoms: { early: string[]; advanced: string[]; distinguishing: string; };
    conditions: { temperature: string; humidity: string; season: string; spread_method: string; };
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

const thumbnail = require('../assets/images/library_thumbnail.jpg');

export const DISEASE_LIBRARY: DiseaseGuide[] = [

    // ─── MANGO ───────────────────────────────────────────────────────────────

    {
        id: 'mango_anthracnose',
        display_name: 'Anthracnose',
        plant: 'Mango', plant_emoji: '🥭', severity: 'high', thumbnail,
        tagline: 'The #1 post-harvest threat to mango worldwide',
        overview: 'Anthracnose is the most economically damaging disease of mango, caused by Colletotrichum gloeosporioides. It affects virtually every above-ground part of the tree and is particularly devastating during humid, rainy seasons. The fungus can remain latent on developing fruit — showing no symptoms until near ripening — making it a severe post-harvest problem. In the Philippines, losses can reach 30–80% of the harvest in badly managed orchards.',
        scientific_name: 'Colletotrichum gloeosporioides',
        pathogen_type: 'Fungal',
        pathogen_detail: 'Ascomycete fungus; produces abundant conidia in acervuli (salmon-pink spore masses visible under moist conditions). Overwinters in infected plant debris and mummified fruit. Has a wide host range but mango strains are particularly aggressive.',
        affected_parts: ['Leaves', 'Panicles (flower clusters)', 'Young shoots', 'Fruit (pre & post-harvest)'],
        symptoms: {
            early: [
                'Small, irregular dark-brown to black spots on young leaves',
                'Water-soaked lesions on flower panicles — they appear greasy or translucent',
                'Tiny black specks on young fruit surface',
                'Tip burn and blight on emerging shoots, turning brown from the tip downward',
            ],
            advanced: [
                'Lesions coalesce into large necrotic areas covering entire leaf sections',
                'Flower blight leading to complete panicle death — known as "blossom blight"',
                'Fruit develop sunken, dark, circular rot spots that expand rapidly at room temperature',
                'Post-harvest: rot spreads from skin breaks within 2–3 days under ambient conditions',
                'Characteristic salmon-pink spore masses (acervuli) appear on lesion surfaces during high humidity',
            ],
            distinguishing: 'The salmon/orange spore masses visible on lesions during wet weather are the definitive identifier. On fruit, the rot is always dark, sunken, and has a sharply defined margin — unlike bacterial black spot which causes star-shaped, raised cracks.',
        },
        conditions: {
            temperature: '25–30°C optimal for infection and spore germination',
            humidity: 'Requires free moisture; >90% RH accelerates sporulation dramatically',
            season: 'Most severe during flowering and fruiting coinciding with rainy season (June–October in PH)',
            spread_method: 'Rain splash, wind, contaminated pruning tools, infected seedlings, insect feeding wounds',
        },
        economic_impact: 'Annual losses in SE Asia estimated at $100M+. Reduces marketable yield by 30–80% in unmanaged orchards. Major barrier to fresh mango export due to quarantine requirements around post-harvest rot.',
        look_alikes: ['Bacterial black spot (angular, water-soaked margins; star cracks on fruit)', 'Mango scab (corky, raised lesions)', 'Sooty mold (superficial black coating; wipes off easily)'],
        treatment: {
            immediate: [
                'Remove and bag all visibly infected fruit, panicles, and leaves immediately',
                'Do NOT compost infected material — burn or bury deep (>50cm)',
                'Prune dead wood and open the canopy to improve air circulation',
                'Apply copper-based fungicide as emergency protective spray within 24 hours',
            ],
            chemical: [
                { product: 'Mancozeb 80% WP', rate: '2–2.5 g/L water', frequency: 'Every 7–10 days during flowering and fruiting' },
                { product: 'Carbendazim 50% WP', rate: '1 g/L water', frequency: 'Every 10–14 days; rotate with mancozeb to prevent resistance' },
                { product: 'Azoxystrobin 25% SC', rate: '1 mL/L water', frequency: 'Every 14 days; max 3 applications per season' },
                { product: 'Copper hydroxide 77% WP', rate: '2–3 g/L water', frequency: 'Protective spray before rain events' },
            ],
            organic: [
                'Trichoderma harzianum-based biocontrol (Tricho-T) applied at 5 g/L every 10 days',
                'Neem oil (2%) spray every 7 days during susceptible stages',
                'Baking soda (sodium bicarbonate) 5 g/L as suppressive spray on early lesions',
                'Hot water treatment for harvested fruit: 52°C for 5 minutes before storage',
            ],
            cultural: [
                'Collect and destroy all fallen fruit and leaves weekly without exception',
                'Prune to maintain open canopy — reduce humidity inside the tree crown',
                'Avoid overhead irrigation during flowering and fruiting stages',
                'Harvest at correct maturity index (skin begins to turn yellow at apex)',
                'Use wax coating post-harvest to slow rot progression during transport',
            ],
        },
        prevention: [
            'Begin protective fungicide sprays at panicle emergence, BEFORE the rainy season starts',
            'Apply copper spray 2 weeks before expected flowering as prophylactic measure',
            'Plant moderately resistant varieties where available (Keitt, Tommy Atkins)',
            'Maintain orchard sanitation — remove mummified fruit year-round',
            'Space trees adequately (8×8m minimum) to allow adequate air movement between crowns',
            'Install windbreaks to reduce rain-splash dispersal of conidia between trees',
        ],
        monitoring_tips: [
            'Scout panicles weekly from bud break through petal fall — these are highest-risk periods',
            'Check 5 random trees per block; inspect 3 panicles and 10 leaves per tree per visit',
            'Use a disease incidence threshold of >5% affected panicles to trigger spray program',
            'Monitor weather forecasts closely — spray preventively BEFORE rain events, not after',
            'Check stored/harvested fruit daily in the first 3 days post-harvest for early rot signs',
        ],
        recovery_timeline: '3–4 weeks for foliar recovery with consistent treatment. Post-harvest fruit cannot be recovered once rot initiates.',
        fun_fact: 'The fungus can remain completely invisible (latent) inside immature mango fruit for weeks, only erupting as visible rot when the fruit ripens and its natural chemical defenses (phenolics) drop below a threshold level.',
    },

    {
        id: 'mango_bacterial_black_spot',
        display_name: 'Bacterial Black Spot',
        plant: 'Mango', plant_emoji: '🥭', severity: 'high', thumbnail,
        tagline: 'Wind-driven bacteria that scar fruit and crack stems',
        overview: 'Bacterial black spot, caused by Xanthomonas campestris pv. mangiferaeindicae, is a serious disease in tropical mango-growing regions. Unlike fungal diseases, bacteria enter through natural openings (stomata, lenticels) and wounds caused by wind, insects, or sand abrasion. The disease is notoriously difficult to control once established because bactericides are less effective than fungicides. It is a quarantine pest in some countries, restricting export of Philippine mango to Japan, Korea, and Australia.',
        scientific_name: 'Xanthomonas campestris pv. mangiferaeindicae',
        pathogen_type: 'Bacterial',
        pathogen_detail: 'Gram-negative rod-shaped bacterium. Survives in infected plant tissue and soil debris for months. Spreads via wind-driven rain, infected budwood, and contaminated tools. Produces yellow xanthan gum as a virulence factor that helps it colonize plant tissue.',
        affected_parts: ['Leaves', 'Stems and branches', 'Fruit surface', 'Petioles'],
        symptoms: {
            early: [
                'Small water-soaked spots on leaves, initially yellow-green and translucent',
                'Spots enlarge and turn dark brown/black with yellow halo (water-soaked margin)',
                'Angular lesions strictly limited by leaf veins — a distinctive feature',
                'Raised, dark, star-shaped cracks appearing on young green fruit',
            ],
            advanced: [
                'Leaf lesions become fully necrotic; leaves yellow and drop prematurely causing defoliation',
                'Stem cankers with dark, sunken, cracked bark exuding gummy amber resin',
                'Fruit lesions become raised, corky, star-shaped cracks — commercially worthless',
                'Amber-colored bacterial exudate oozes from cankers in humid conditions',
                'Severe defoliation reduces photosynthetic capacity for entire following season',
            ],
            distinguishing: 'The star-shaped or angular cracks on fruit skin with a raised, corky margin is pathognomonic (unique) for this disease. Leaf lesions are angular (bounded by veins) unlike the round spots of fungal diseases. Physical wind abrasion produces random, non-margined scratches without the water-soaked border.',
        },
        conditions: {
            temperature: '28–35°C optimal; disease severity increases dramatically in hot, windy conditions',
            humidity: 'Wind-driven rain is the primary infection trigger — moisture carries bacteria into stomata',
            season: 'Year-round in PH; peaks during typhoon season (July–October) when wind + rain combine',
            spread_method: 'Wind-driven rain splash; infected budwood; contaminated cutting tools; insect vectors',
        },
        economic_impact: 'Causes severe fruit blemishing reducing export-grade fruit by 40–60%. Tree cankers reduce productive lifespan by years. Quarantine restrictions limit export to major markets including Japan, Korea, and Australia.',
        look_alikes: ['Anthracnose (round, sunken lesions vs. star-shaped raised cracks)', 'Mango scab (scaly, not star-cracked)', 'Physical wind/sand abrasion damage (no bacterial halo)'],
        treatment: {
            immediate: [
                'Prune all cankered branches 15cm below visible infection; sterilize tools between cuts with 70% alcohol',
                'Apply copper bactericide immediately to all pruning wounds and surrounding tissue',
                'Remove severely affected fruit from the tree to reduce inoculum load',
                'Do not prune during or just before rain — open wounds invite immediate re-infection',
            ],
            chemical: [
                { product: 'Copper hydroxide 77% WP', rate: '2.5–3 g/L water', frequency: 'Every 10–14 days; apply before predicted rain/wind events' },
                { product: 'Copper oxychloride 50% WP', rate: '2.5 g/L water', frequency: 'Every 10 days during susceptible periods' },
                { product: 'Streptomycin sulfate (where registered)', rate: '0.5 g/L water', frequency: 'Use sparingly to avoid resistance; max 2× per season' },
            ],
            organic: [
                'Copper-soap (copper octanoate) as a lower-residue bactericidal alternative',
                'Bacillus subtilis-based biopesticides applied weekly as preventive measure',
                'Avoid fermented-material sprays — they can feed bacterial populations',
            ],
            cultural: [
                'Install windbreaks (bamboo, ipil-ipil) on the windward side of orchards',
                'Disinfect all pruning tools with 70% isopropyl or 10% bleach between every tree',
                'Avoid creating wounds during windy periods — schedule pruning for calm, dry weather',
                'Use only certified disease-free budwood for any grafting operations',
                'Reduce canopy humidity through thinning and spacing management',
            ],
        },
        prevention: [
            'Establish windbreaks before planting new orchards — minimum 3 rows of dense trees on windward side',
            'Use certified disease-free planting material from accredited nurseries only',
            'Apply copper sprays preventively at the start of rainy season each year',
            'Never use infected wood for grafting or budding — test source trees before propagation',
            'Avoid planting susceptible varieties (Carabao is highly susceptible; Super Mango has moderate tolerance)',
            'Inspect all new nursery stock for star-cracked lesions before introducing to your orchard',
        ],
        monitoring_tips: [
            'Inspect all trees after every significant wind or rain event — bacteria spread rapidly post-event',
            'Look for fresh water-soaked lesions on new growth first — these indicate active infection',
            'Check stem joints and branch crotches for gummy amber bacterial exudate monthly',
            'Map infected trees to track spread direction — typically downwind from initial source',
        ],
        recovery_timeline: 'Stems and branches: 6–12 months with aggressive pruning and copper treatment. Fruit in current season cannot be de-scarred. Full bacterial suppression may require 1–2 full seasons of consistent management.',
        fun_fact: 'Xanthomonas bacteria produce a yellow pigment called xanthomonadin that protects them from UV radiation — essentially giving them a natural sunscreen enabling survival on exposed plant surfaces between rain events.',
    },

    {
        id: 'mango_dieback',
        display_name: 'Dieback',
        plant: 'Mango', plant_emoji: '🥭', severity: 'critical', thumbnail,
        tagline: 'A slow killer that hollows trees from the inside out',
        overview: 'Mango dieback, caused primarily by Lasiodiplodia theobromae, is one of the most destructive diseases of mango in tropical Asia. The fungus is a wound pathogen — it enters through pruning cuts, insect damage, sunscald, and any bark injury — then colonizes the vascular tissue, blocking water and nutrient flow. Affected branches die back progressively from the tips toward the main trunk. In severe cases, the entire tree may die over 2–3 seasons. It thrives on drought-stressed trees, making proper irrigation critical.',
        scientific_name: 'Lasiodiplodia theobromae',
        pathogen_type: 'Fungal',
        pathogen_detail: 'Coelomycete fungus; a weak pathogen that exploits stressed or wounded trees. Produces pycnidia (flask-shaped fruiting bodies) under bark of dead tissue. Thrives in hot, dry conditions following wounding. Produces melanized, septate conidia. Infects over 500 plant species worldwide.',
        affected_parts: ['Branch tips (primary)', 'Bark and cambium', 'Vascular (xylem) tissue', 'Main trunk in severe cases'],
        symptoms: {
            early: [
                "Young shoot tips wilt suddenly and turn brown — classic 'shepherd's crook' wilting pattern",
                'Leaves on affected shoots turn dull green, then brown, but remain attached (do not abscise)',
                'Dark brown discoloration just under the bark when a small cut is made',
                'Resinous gum oozing from bark cracks near the base of affected branches',
            ],
            advanced: [
                'Progressive dieback extends from branch tips toward main scaffold branches over weeks',
                'Entire branches die; leaves shrivel and hang brown on dead wood for months',
                'Black pycnidia (fruiting bodies) visible as tiny raised black dots on dead bark',
                'Dark vascular streaking clearly visible in cross-section of infected wood',
                'Multiple branches dying simultaneously in severely stressed trees',
                'Abundant hardened, dark resin coating bark surface around infected areas',
            ],
            distinguishing: "Cut a dying branch and examine the cross-section — dark brown/black vascular streaking extending toward the pith is the definitive sign of Lasiodiplodia infection. The 'tip-to-base' progressive pattern distinguishes it from root diseases (which kill bottom-up) and bacterial cankers.",
        },
        conditions: {
            temperature: '28–35°C; disease accelerates dramatically under heat stress conditions',
            humidity: 'Paradoxically thrives during dry conditions — drought-stressed trees are most vulnerable',
            season: 'Worst during and immediately after dry season (March–May in PH); also following typhoon damage',
            spread_method: 'Entry through wounds (pruning, insects, wind damage); spore release during rain events',
        },
        economic_impact: 'Can kill mature bearing trees worth ₱10,000–50,000 each. Orchard-wide outbreaks following drought or typhoon seasons cause catastrophic losses. Replacement trees require 4–6 years to reach bearing age.',
        look_alikes: ['Verticillium wilt (internal streaking similar but more systemic, rare in tropics)', 'Bacterial canker (gummy but with watery bacterial ooze)', 'Normal drought stress wilting (no bark streaking when cut)'],
        treatment: {
            immediate: [
                'Prune all dead and dying branches 30cm BELOW the visible infection line into clean white wood',
                'Immediately paint all cut surfaces with Bordeaux paste or copper fungicide mixed with white latex paint (1:1)',
                'Sterilize pruning saw and loppers with 70% alcohol between every single cut',
                'Collect and burn all pruned material immediately — do not leave on the ground',
                'Water trees deeply and immediately if drought-stressed — removing tree stress is as important as fungicide',
            ],
            chemical: [
                { product: 'Carbendazim 50% WP (wound paste)', rate: 'Mix 10g/100mL water + equal volume white latex paint', frequency: 'Apply to every pruning wound; reapply after each rain event' },
                { product: 'Thiophanate-methyl 70% WP', rate: '1.5 g/L water', frequency: 'Drench soil around base + spray trunk every 14 days during recovery' },
                { product: 'Bordeaux mixture', rate: '1kg copper sulfate + 1kg lime / 100L water', frequency: 'Spray trunk and scaffold branches monthly during recovery period' },
            ],
            organic: [
                'Trichoderma viride paste applied generously to all pruning wounds as biological wound dressing',
                'Neem cake incorporated into soil at 2 kg/tree to suppress soilborne inoculum',
                'Improve soil organic matter with compost to reduce tree moisture stress',
            ],
            cultural: [
                'Prune only during dry weather — never prune when rain is forecast within 48 hours',
                'Always seal pruning wounds within 30 minutes of making the cut — no exceptions',
                'Maintain adequate and consistent fertilization — nutrient-deficient trees are far more susceptible',
                'Apply mulch ring (50–80cm radius, 10cm deep) around tree base to conserve moisture during dry season',
                'Avoid all mechanical damage to bark from farm equipment and cultivation tools',
            ],
        },
        prevention: [
            'Seal every pruning wound immediately — this single practice prevents most infections',
            'Never prune during the rainy season unless removing actively diseased wood',
            'Maintain consistent irrigation throughout the dry season — never allow severe drought stress',
            'Balance fertilization: excess nitrogen with low potassium significantly increases susceptibility',
            'Control bark borers and other wood-boring insects that create primary entry wounds',
            'Choose well-drained planting sites — waterlogged roots cause chronic stress predisposing trees to dieback',
        ],
        monitoring_tips: [
            'Inspect tree canopy monthly for any tip-wilting or branch browning that did not exist previously',
            'Immediately investigate any sudden wilting of branch tips following dry spells or typhoon events',
            'Check all pruning wounds monthly for the first full season after pruning',
            'After typhoons, inspect all broken and damaged branches within 48 hours and seal exposed wood',
        ],
        recovery_timeline: 'Early catch (1–2 branches): 3–6 months with aggressive pruning + wound treatment. If >30% canopy affected: 12–24 months. Full canopy death: tree recovery is usually not feasible.',
        fun_fact: 'Lasiodiplodia theobromae infects over 500 plant species worldwide — it is one of the most broadly host-adapted plant pathogens known to science, exploiting wounded or stressed plants across virtually all tropical agriculture.',
    },

    {
        id: 'mango_powdery_mildew',
        display_name: 'Powdery Mildew',
        plant: 'Mango', plant_emoji: '🥭', severity: 'high', thumbnail,
        tagline: 'White powder that destroys flowering and wipes out fruit set',
        overview: 'Mango powdery mildew, caused by Oidium mangiferae, is one of the most widespread and damaging diseases of mango during the flowering period. Unlike most fungal diseases that require wet conditions, powdery mildew thrives in dry weather with high relative humidity — making it particularly problematic during the Philippine dry season flowering period (November–February). A single severe outbreak during panicle emergence can reduce fruit set by 70–90%, essentially wiping out an entire harvest season.',
        scientific_name: 'Oidium mangiferae',
        pathogen_type: 'Fungal',
        pathogen_detail: 'Obligate ectoparasite — the fungus lives entirely on the surface of plant tissue, sending haustoria (feeding organs) through the epidermis. Produces enormous quantities of dry conidia that are dispersed by wind. Unlike other fungi, does NOT need free water for spore germination — dry conditions actually favor it.',
        affected_parts: ['Panicles (flower clusters) — most critical', 'Young leaves and shoots', 'Developing fruit (early stage)'],
        symptoms: {
            early: [
                'White, powdery, dusty coating appearing first on the underside of young leaves',
                'Panicles develop white powdery covering on flowers and flower stalks',
                'Affected flowers appear "frosted" or dusted with white flour',
                'Young fruit develop white powdery patches on the skin',
            ],
            advanced: [
                'Entire panicles covered in dense white mycelium and spores',
                'Affected flowers fail to set fruit — mass flower abortion follows infection',
                'Young fruit (marble-sized) turn black and drop prematurely',
                'Leaves curl and distort under heavy infection',
                'In severe outbreaks: entire tree canopy coated in white powdery growth',
            ],
            distinguishing: 'The white powdery coating is so characteristic that it is virtually impossible to confuse with other diseases. The key distinguishing fact: it appears in DRY weather — if rain is occurring, suspect anthracnose instead. Rubbing the coating reveals green tissue underneath (not necrotic).',
        },
        conditions: {
            temperature: '10–31°C with optimum at 22–25°C; cool nights and warm days are ideal',
            humidity: '>70% relative humidity required but free water actually INHIBITS germination',
            season: 'Dry season flowering (November–February); worst when cool nights follow warm days',
            spread_method: 'Wind dispersal of dry conidia over long distances; no water required for spread',
        },
        economic_impact: 'Can reduce fruit set by 70–90% in a single outbreak. In bad powdery mildew years, entire orchards produce minimal commercial fruit. Philippine mango farmers lose tens of millions of pesos annually during heavy outbreak years.',
        look_alikes: ['Sooty mold (black, not white; secondary to insect infestation)', 'Spray deposit residues from previous fungicide applications', 'Normal wax bloom on leaves'],
        treatment: {
            immediate: [
                'Begin spray program immediately at first sign of white powder — do not wait',
                'Spray in the early morning or late afternoon — avoid midday heat which reduces efficacy',
                'Ensure complete coverage of all panicles, both upper and lower surfaces',
                'Continue spraying every 7 days as long as flowering continues',
            ],
            chemical: [
                { product: 'Wettable sulfur 80% WP', rate: '2–3 g/L water', frequency: 'Every 7 days during flowering; most cost-effective option' },
                { product: 'Trifloxystrobin 50% WG', rate: '0.2 g/L water', frequency: 'Every 14 days; excellent systemic activity' },
                { product: 'Hexaconazole 5% SC', rate: '1.5 mL/L water', frequency: 'Every 10–14 days; rotate with non-DMI fungicides' },
                { product: 'Myclobutanil 12.5% WP', rate: '1 g/L water', frequency: 'Every 14 days; good systemic activity' },
            ],
            organic: [
                'Potassium bicarbonate (5 g/L) — disrupts fungal cell walls; apply every 5–7 days',
                'Neem oil (2%) — inhibits spore germination; apply early morning',
                'Garlic extract spray (5%) — natural antifungal sulfur compounds',
                'Milk solution (1 part fresh milk: 9 parts water) — proteins create antifungal environment',
            ],
            cultural: [
                'Avoid high-nitrogen fertilization close to flowering — lush new growth is more susceptible',
                'Prune excess vegetative growth to improve air circulation through canopy',
                'Time irrigation to avoid evening watering that raises humidity during cooler nights',
            ],
        },
        prevention: [
            'Begin preventive sulfur spray at first sign of panicle emergence — do not wait for visible disease',
            'Apply sulfur at panicle emergence, full flower, and pea-sized fruit stages at minimum',
            'Avoid over-fertilizing with nitrogen before the flowering period',
            'Maintain open canopy structure through annual post-harvest pruning',
            'Plant in sites with good air movement — avoid low-lying areas where cool air pools at night',
        ],
        monitoring_tips: [
            'Scout daily from panicle emergence through petal fall — this 3–4 week window is critical',
            'Use a magnifying glass to detect early white mycelium on panicle surfaces before it spreads',
            'Monitor weather forecasts for cool nights (< 22°C) following warm days — ideal disease conditions',
            'Count percentage of panicles affected to assess if spray program is adequate',
        ],
        recovery_timeline: 'With aggressive sulfur spraying: 5–7 days to stop new spread. Fruit set on already-infected panicles cannot be recovered. New panicles emerging after control will be disease-free.',
        fun_fact: 'Powdery mildew fungi are the only plant pathogens that actually evolved to prefer dry conditions — a complete reversal of almost all other fungal plant diseases. They likely evolved this adaptation to colonize plant surfaces during dry periods when competing microorganisms are suppressed.',
    },

    {
        id: 'mango_scab',
        display_name: 'Mango Scab',
        plant: 'Mango', plant_emoji: '🥭', severity: 'moderate', thumbnail,
        tagline: 'Corky lesions that scar fruit and stunt young growth',
        overview: 'Mango scab, caused by Elsinoë mangiferae, is a fungal disease that attacks young, rapidly expanding plant tissue — new leaves, young shoots, and developing fruit. The disease is characterized by its distinctive corky, raised, cracked lesions that give affected tissue a rough, "scabby" appearance. While rarely fatal to trees, it significantly reduces fruit quality and marketability. In nurseries and young plantations with frequent new flushes, scab can cause significant defoliation and stunting.',
        scientific_name: 'Elsinoë mangiferae',
        pathogen_type: 'Fungal',
        pathogen_detail: 'Ascomycete fungus in the family Elsinoaceae. Infects only actively expanding tissue — mature leaves and fruit are resistant. Produces ascospores (sexual) and conidia (asexual) for spread. The fungus causes hypertrophy (abnormal cell enlargement) and corky tissue formation as a host response.',
        affected_parts: ['Young expanding leaves', 'Young shoots and stems', 'Developing fruit (small size stages)'],
        symptoms: {
            early: [
                'Small, water-soaked spots on very young leaves appearing within 1–2 weeks of flush emergence',
                'Spots turn olive-brown to gray with raised margins',
                'Lesions on young shoots appear as raised, dark brown spots with cracked centers',
                'Young fruit show raised, rough patches on skin surface',
            ],
            advanced: [
                'Lesions develop into distinctly raised, corky, cracked scabs — the namesake symptom',
                'Leaves distort, curl, and pucker around lesion sites as they expand',
                'Severely infected young leaves may drop, causing episodic defoliation',
                'Fruit scabs enlarge and coalesce, covering large areas of skin surface',
                'Fruit may become misshapen or stunted where multiple lesions restrict growth',
                'Old lesions crack and develop a fissured, bark-like texture',
            ],
            distinguishing: 'The corky, raised, cracked texture of scab lesions is distinct from both anthracnose (sunken, smooth-margined lesions) and bacterial black spot (star-shaped cracks with water-soaked margins). Scab only affects very young, expanding tissue — checking leaf age helps diagnose.',
        },
        conditions: {
            temperature: '20–28°C; relatively cool and wet conditions favor infection',
            humidity: 'Requires prolonged leaf wetness (>4 hours) for infection on young tissue',
            season: 'Rainy season flushes are most affected; worst when new growth coincides with persistent rain',
            spread_method: 'Rain splash of conidia; wind dispersal of ascospores over moderate distances',
        },
        economic_impact: 'Primarily a quality rather than yield issue; reduces export-grade fruit percentage by 20–40% in affected orchards. Particularly problematic for fresh fruit export markets with zero-tolerance for skin blemishes.',
        look_alikes: ['Anthracnose (sunken not raised lesions)', 'Bacterial black spot (star-shaped not corky lesions)', 'Physical insect damage (random, not uniformly elevated)'],
        treatment: {
            immediate: [
                'Apply fungicide immediately at first sign of lesions on new flush',
                'Remove and destroy heavily infected young shoots if outbreak is localized',
                'Improve air circulation through light pruning of crossing branches',
            ],
            chemical: [
                { product: 'Zineb 75% WP', rate: '2.5 g/L water', frequency: 'Every 10–14 days during susceptible flush stages' },
                { product: 'Copper hydroxide 77% WP', rate: '2 g/L water', frequency: 'Every 10–14 days as protectant' },
                { product: 'Thiophanate-methyl 70% WP', rate: '1.5 g/L water', frequency: 'Every 14 days; systemic activity' },
            ],
            organic: [
                'Copper-soap sprays at flush emergence as protective measure',
                'Trichoderma foliar spray weekly during susceptible flush stage',
                'Ensure adequate potassium nutrition — strengthens epidermal cell walls',
            ],
            cultural: [
                'Synchronize new flush emergence within the orchard through coordinated pruning — spray all at once',
                'Avoid excessive irrigation that prolongs leaf wetness duration',
                'Collect and remove fallen infected leaves from the orchard floor',
            ],
        },
        prevention: [
            'Apply protective fungicide at flush emergence before rainy periods',
            'Practice tip pruning at appropriate times to synchronize and manage flush timing',
            'Maintain adequate spacing for good canopy airflow',
            'Remove overwintering inoculum by collecting fallen infected leaves annually',
        ],
        monitoring_tips: [
            'Monitor new flush emergence closely during rainy season',
            'Check the youngest leaves on branch tips for water-soaked spots after each rain event',
            'Assess lesion density per leaf: >5 lesions per leaf warrants immediate spray',
        ],
        recovery_timeline: 'Mature leaves and fruit do not develop new scab lesions. New growth from properly timed fungicide program will be clean. Existing scab lesions are permanent but do not spread to mature tissue.',
        fun_fact: 'Elsinoë species infect over 100 different crop plants globally, from mango to citrus to avocado, but strains are highly host-specific — the mango scab fungus cannot infect citrus or other species despite their close taxonomic relationship.',
    },

    {
        id: 'mango_healthy',
        display_name: 'Healthy Mango',
        plant: 'Mango', plant_emoji: '🥭', severity: 'low', thumbnail,
        tagline: 'What peak mango health looks like',
        overview: 'A healthy mango tree is a powerhouse of tropical productivity. Understanding what normal, thriving mango foliage looks like is as important as recognizing disease — misidentifying normal growth stages leads to unnecessary pesticide applications. Healthy mango trees in the Philippines can produce 200–400 kg of fruit per season per mature tree and live productively for 40–100 years with proper care. The Carabao mango — the Philippine national fruit — is internationally recognized as the sweetest variety in the world.',
        pathogen_type: 'None',
        pathogen_detail: 'No pathogen. This entry describes normal, disease-free mango physiology and what healthy tissue looks like at each growth stage.',
        affected_parts: [],
        symptoms: {
            early: [
                'New flushes emerge copper-red to bronze in color — this is completely NORMAL (not disease)',
                'Young leaves are soft, pendulous, and reddish before hardening to dark green over 2–3 weeks',
                'Panicles emerge creamy-white to light green with hundreds of tiny flowers',
                'Fruit set: tiny green fruit 1–2cm, most will naturally drop (normal physiological thinning)',
            ],
            advanced: [
                'Mature leaves: deep glossy green, firm, flat, with a prominent pale midrib',
                'Fruit development proceeds: green → yellow-green → yellow/orange at maturity (variety-dependent)',
                'Bark: gray-brown, slightly rough, no gum exudate or discoloration',
                'Root zone: moist but not waterlogged; healthy feeder roots are cream-white',
            ],
            distinguishing: 'Healthy copper-red new growth is commonly mistaken for disease by new growers. Key indicators of health: color is uniform across ALL new leaves simultaneously, leaves are firm (not water-soaked), and no spots, lesions, or irregular discolorations are present.',
        },
        conditions: {
            temperature: 'Optimal: 24–30°C. Tolerates 10–46°C but productivity drops at extremes',
            humidity: 'Prefers dry conditions during flowering (reduces anthracnose); accepts high humidity otherwise',
            season: 'Flowering induced by cool dry weather (Nov–Feb in PH); fruit matures 3–5 months after flowering',
            spread_method: 'N/A',
        },
        economic_impact: 'Philippine mango (Mangifera indica var. Carabao) is the national fruit and a top agricultural export earning $50–80M USD annually. A single well-managed mature tree (20+ years) can produce 400+ kg of premium fruit annually.',
        look_alikes: ['Red/bronze new growth (NORMAL) often mistaken for disease', 'Natural physiological fruit drop (normal) vs. fungal-induced fruit drop'],
        treatment: {
            immediate: ['No treatment needed — maintain current practices and document as baseline reference'],
            chemical: [],
            organic: [
                'Foliar spray of seaweed extract (2%) monthly to maintain micronutrient balance',
                'Compost tea (1:10 dilution) as soil drench quarterly to support soil biology',
            ],
            cultural: [
                'Fertilize 3× per year: after harvest, before flowering induction, during fruit development',
                'Recommended NPK: 100-50-100 g/tree/year for young trees; scale up with age',
                'Maintain 50–100cm organic mulch ring to conserve moisture and suppress weeds',
                'Light post-harvest pruning to remove crossing branches and open canopy',
                'Water consistently during fruit development — irregular watering causes fruit splitting',
            ],
        },
        prevention: [
            'Maintain soil pH 5.5–7.0 for optimal nutrient uptake',
            'Apply preventive copper + mancozeb spray at panicle emergence each season without fail',
            'Annual soil testing to adjust fertilization program based on actual soil nutrient status',
            'Control mango pulp weevil, mango leafhopper, and thrips — they create wounds that invite pathogens',
        ],
        monitoring_tips: [
            'Scout weekly during flowering and fruit set — these 6–8 weeks are the most critical annual period',
            'Photograph healthy leaves and fruit at each growth stage to build your own reference library',
            'Track harvest weight per tree each season to detect early productivity decline before visual symptoms appear',
        ],
        recovery_timeline: 'N/A — tree is healthy. Focus entirely on maintaining current conditions.',
        fun_fact: 'The Carabao mango is scientifically certified as the sweetest mango variety in the world by the Guinness Book of World Records, with brix (sugar content) levels reaching 22–24% — higher than any other known variety on the planet.',
    },

    // ─── BANANA ──────────────────────────────────────────────────────────────

    {
        id: 'banana_sigatoka',
        display_name: 'Black Sigatoka',
        plant: 'Banana', plant_emoji: '🍌', severity: 'critical', thumbnail,
        tagline: 'The most destructive banana foliar disease on Earth',
        overview: 'Black Sigatoka (Mycosphaerella fijiensis) is considered the single most damaging banana disease in the world, costing the global industry over $400 million annually in fungicide applications alone. It reduces photosynthetic capacity by destroying leaf tissue, resulting in early fruit ripening, reduced bunch weight (up to 50% loss), and in severe cases, complete crop failure. The disease emerged in Fiji in 1963 and has since spread to all major banana-producing regions including the Philippines, where it has largely replaced the less aggressive Yellow Sigatoka.',
        scientific_name: 'Mycosphaerella fijiensis',
        pathogen_type: 'Fungal',
        pathogen_detail: 'Ascomycete fungus producing two spore types: ascospores (sexual, airborne — primary long-distance spread up to 40km) and conidia (asexual, splash-dispersed — local farm-level spread). The fungus has documented resistance to multiple fungicide classes including benzimidazoles and some triazoles, making it one of the most challenging agricultural pathogens to manage chemically.',
        affected_parts: ['All leaves; youngest leaves most susceptible', 'Reduces fruit fill and bunch weight indirectly through photosynthesis loss'],
        symptoms: {
            early: [
                'Pale yellow streaks (2–3mm) running parallel to leaf veins on the UNDERSIDE of young leaves — Stage 1',
                'Streaks visible on leaf undersurface before upper surface symptoms appear',
                'Stage 2: streaks on upper surface, still yellow-brown',
                'Stage 3: spots with water-soaked appearance, yellow halo developing',
            ],
            advanced: [
                'Stage 4–5: spots enlarge (up to 2cm) with dark brown/black center and prominent yellow halo on upper surface',
                'Stage 6: lesions mature to brown-gray center, dark border, fading yellow halo',
                'Lesions coalesce; large sections of leaves die turning brown — "scorched" appearance',
                'Premature bunch ripening 2–4 weeks early, resulting in significantly lower bunch weight',
                'In catastrophic infections: only the innermost cigar leaf remains functional and green',
            ],
            distinguishing: 'The 6-stage lesion progression sequence is diagnostic and unique. Yellow Sigatoka (M. musicola) progresses more slowly with yellow-centered lesions. Nutrient deficiency causes uniform interveinal yellowing without the progressive spot-to-streak sequence.',
        },
        conditions: {
            temperature: '25–28°C optimal; spore germination requires free water on leaf surfaces',
            humidity: 'Requires >6 hours of leaf wetness for infection; >95% RH dramatically accelerates disease',
            season: 'Year-round in PH; worst during rainy season (July–November)',
            spread_method: 'Ascospores spread by wind up to 40km (long-distance); conidia by rain splash locally',
        },
        economic_impact: 'Reduces bunch weight 35–50% in untreated plantations. Global management cost: $400M+/year in fungicides. Primary reason Cavendish production requires 10–50 aerial fungicide applications annually in commercial operations — one of the most heavily sprayed crops globally.',
        look_alikes: ['Yellow Sigatoka (similar but slower, yellower lesions, less aggressive)', 'Banana freckle (small, uniform spots without streaking stage)', 'Potassium deficiency (yellowing starting at leaf margins, no spots)'],
        treatment: {
            immediate: [
                'Remove and destroy (burn or bury deep) all severely infected leaves immediately',
                '"Leaf surgery": cut off the diseased distal portion of partly affected leaves using a clean knife',
                'Improve drainage — waterlogged soils raise canopy humidity and accelerate spread',
                'Begin fungicide program immediately if >50% of leaf area on any leaf is affected',
            ],
            chemical: [
                { product: 'Propiconazole 25% EC (DMI fungicide)', rate: '1 mL/L water', frequency: 'Every 21 days; MUST rotate with non-DMI fungicide to prevent resistance' },
                { product: 'Mancozeb 80% WP (protectant)', rate: '2.5 g/L water', frequency: 'Every 14 days as protectant during high-risk periods' },
                { product: 'Azoxystrobin 25% SC (strobilurin)', rate: '1 mL/L water', frequency: 'Max 2 applications per season; strictly rotate to prevent resistance' },
                { product: 'Chlorothalonil 75% WP', rate: '2 g/L water', frequency: 'Every 14 days; excellent rotation partner for DMI fungicides' },
            ],
            organic: [
                'Mineral oil spray (2%) — coats leaf surface, disrupts spore germination physically',
                'Potassium bicarbonate (5 g/L) — raises leaf surface pH, inhibitory to fungal growth',
                'Trichoderma asperellum foliar application — competitive biological exclusion on leaf surface',
                'Silicon-based fertilizers — strengthen leaf cuticle, reducing fungal penetration depth',
            ],
            cultural: [
                'Deleafing: remove all leaves rated Stage 4+ on a fixed schedule (every 2–3 weeks)',
                'Desuckering to maintain single or double stem system — reduces humidity within the mat',
                'Wider plant spacing (3×3m minimum) to ensure airflow between plants',
                'Avoid all overhead irrigation — drip irrigation significantly reduces leaf wetness duration',
                'Plant resistant varieties: FHIA hybrids, Cardaba (cooking banana) have significantly better resistance',
            ],
        },
        prevention: [
            'Establish a formal deleafing calendar and stick to it — skipping even one cycle allows disease to build up',
            'Monitor using Stover/Gauhl leaf disease scoring system (0–6 scale) to guide spray decisions',
            'Begin fungicide program at first appearance of Stage 2 lesions — never wait until damage is severe',
            'Rotate fungicide classes strictly following recommended schedules — resistance can develop within one season',
            'Maintain adequate potassium nutrition — K-deficient plants are significantly more susceptible to all leaf diseases',
            'Train farm workers to identify Stage 1–2 lesions — early detection is the key to management',
        ],
        monitoring_tips: [
            'Use the "youngest spotted leaf" (YSL) number as your weekly management indicator',
            'YSL of leaf 4 or higher = disease well-controlled; continue current program',
            'YSL of leaf 2–3 = disease pressure increasing; intensify spray frequency',
            'YSL of leaf 1 = critical; spray immediately and increase frequency',
            'Sample 10 plants per hectare; record the leaf number (counting from the newest unfurled leaf) of the youngest leaf showing Stage 3+ lesion',
        ],
        recovery_timeline: 'Individual leaves: cannot recover once lesions are Stage 4+. New healthy leaves emerge in 4–6 weeks if disease is brought under control. Full plantation recovery with consistent management: 2–3 months.',
        fun_fact: 'To control Black Sigatoka, large commercial Cavendish banana plantations in Central America spray fungicide up to 50 times per year from low-flying aircraft — making banana one of the most intensively fungicide-treated crops in the world.',
    },

    {
        id: 'banana_panama_disease',
        display_name: 'Panama Disease (TR4)',
        plant: 'Banana', plant_emoji: '🍌', severity: 'critical', thumbnail,
        tagline: 'The soilborne killer threatening the global banana supply',
        overview: 'Tropical Race 4 (TR4) of Fusarium oxysporum f. sp. cubense is arguably the most feared plant disease in agriculture today. A soil-borne vascular wilt pathogen, TR4 infects banana plants through their roots and colonizes the xylem (water-conducting tissue), causing wilting and death. There is no effective chemical treatment. TR4 has already devastated Cavendish banana plantations across Asia, the Middle East, and Australia and was confirmed in the Americas and Africa in the 2010s–2020s, threatening the global banana trade. The Philippines, as a major Cavendish exporter, faces severe threat from this pathogen.',
        scientific_name: 'Fusarium oxysporum f. sp. cubense Tropical Race 4 (TR4)',
        pathogen_type: 'Fungal (soilborne)',
        pathogen_detail: 'Soilborne ascomycete producing three spore types: macroconidia, microconidia, and chlamydospores (the resting spores that persist in soil for 30+ years). Once established in a field, the soil remains permanently infested. TR4 specifically attacks Cavendish bananas — the variety making up 99% of global exports.',
        affected_parts: ['Root system (entry point)', 'Vascular (xylem) tissue throughout pseudostem', 'Entire plant above ground as disease progresses'],
        symptoms: {
            early: [
                'Older outer leaves turn yellow starting at the margins, progressing inward',
                'Yellowing typically starts on one or two leaves at a time, not the whole plant',
                'Affected leaves collapse at the petiole (junction with pseudostem) and hang down',
                'External pseudostem appears normal in very early infection',
            ],
            advanced: [
                'Progressive yellowing and collapse of all outer leaves toward the center',
                'Pseudostem splits longitudinally as internal tissue dies and dries out',
                'Cross-section of pseudostem reveals characteristic reddish-brown to dark discoloration of vascular tissue',
                'Plant eventually collapses with all leaves hanging down in the classic "wilting banana" appearance',
                'Corm (underground base): red-brown internal discoloration when cut',
                'Entire mat dies; suckers may initially appear healthy then die within weeks',
            ],
            distinguishing: 'The definitive diagnosis is the cross-section of the pseudostem showing a continuous ring or sectoral pattern of reddish-brown vascular discoloration. This internal staining distinguishes Fusarium wilt from drought (no staining) and from other leaf yellowing causes (no pseudostem staining).',
        },
        conditions: {
            temperature: '24–34°C optimal for TR4; thrives in tropical soil temperatures',
            humidity: 'Moist, waterlogged soils dramatically increase infection rate by facilitating spore movement to roots',
            season: 'Year-round; often triggers during dry-wet transitions when plant roots are stressed',
            spread_method: 'Infected soil movement on equipment, vehicles, footwear, water flow; infected planting material',
        },
        economic_impact: 'Has devastated entire Cavendish export industries across Asia. Estimated $150–400M in losses in Taiwan alone. With no cure and permanent soil infestation, infected farms face permanent loss of banana production unless switching to resistant varieties. Threatens the $25 billion global banana export trade.',
        look_alikes: ['Moko disease (bacterial; affects vascular tissue differently)', 'Blood disease (bacterial; found in specific SE Asia regions)', 'Drought stress (no internal vascular staining)'],
        treatment: {
            immediate: [
                'THERE IS NO CURE — focus on containment of spread',
                'Immediately quarantine the affected area — prevent all soil movement out of infected zone',
                'Inject infected pseudostems with herbicide to kill plants in place (avoids soil disturbance from uprooting)',
                'Do NOT uproot plants — this disturbs soil and spreads spores further',
                'Report confirmed or suspected TR4 to DA-BAFPS (Bureau of Agriculture and Fisheries) immediately — it is a notifiable disease',
                'Stop all movement of equipment, people, and plant material out of the infected area',
            ],
            chemical: [
                { product: 'Phosphonate-based systemic (suppressive only)', rate: '5 mL/L via trunk injection', frequency: 'Monthly — does not cure but may slow spread in neighboring plants' },
                { product: 'Soil fumigation (methyl bromide — restricted use)', rate: 'Per licensed applicator only', frequency: 'Pre-planting only; requires DA permit; reduces but does not eliminate soil inoculum' },
            ],
            organic: [
                'Trichoderma-enriched soil amendment around borders of affected area (suppressive, preventive only)',
                'Beneficial bacteria (Bacillus subtilis, Pseudomonas fluorescens) as soil drenches around perimeter of clean areas',
                'Organic matter additions to improve soil microbiome diversity around clean borders',
            ],
            cultural: [
                'Establish strict hygiene protocols: dedicated footwear, tools, and vehicles for each field block',
                'Install footbaths with 5% formalin or 2% bleach at all farm entrances',
                'Consider switching to TR4-resistant varieties: FHIA-01, FHIA-02, Cavendish-like TR4-resistant hybrids under development',
                'Fallowing with non-host crops (sweet potato, cassava, vegetables) for 5–10 years',
            ],
        },
        prevention: [
            'This is EXCLUSIVELY a prevention disease — once in your soil, no remediation is effective',
            'Never introduce planting material from unknown or potentially infected sources — demand certified TR4-free tissue culture material',
            'Establish strict farm biosecurity: visitors must use clean footwear and hands before entering any banana block',
            'Know your neighbors: if neighboring farms have Fusarium wilt issues, establish barrier drainage to prevent waterborne spread',
            'Stay informed: register with DA monitoring programs to receive early warning alerts about TR4 detection in your province',
            'Consider proactive transition to GCTCV-219 or other TR4-tolerant Cavendish-type varieties now, before infection arrives',
        ],
        monitoring_tips: [
            'Walk every block weekly during the wet season — look for any single plant showing unexplained leaf yellowing starting on outer leaves',
            'Immediately cut pseudostem of any suspicious plant and examine cross-section for vascular discoloration',
            'Submit samples to BIOTECH-UPLB or DA laboratory for PCR confirmation before any action',
            'Map all suspect plants with GPS coordinates for tracking spread pattern',
        ],
        recovery_timeline: 'Zero recovery. Infected plants die. Infected soil remains infested permanently. Alternative crops must be considered for infested areas.',
        fun_fact: 'The Gros Michel banana — the variety that dominated global exports until the 1950s, and which people who ate bananas before 1965 remember — was wiped out by an earlier Fusarium race (Race 1). The Cavendish replaced it, and now TR4 is threatening Cavendish the same way Race 1 threatened Gros Michel.',
    },

    {
        id: 'banana_healthy',
        display_name: 'Healthy Banana',
        plant: 'Banana', plant_emoji: '🍌', severity: 'low', thumbnail,
        tagline: 'Vigorous and productive',
        overview: 'Banana (Musa spp.) is one of the most productive tropical crops — a single healthy mat can produce year-round harvests indefinitely through its ratoon sucker system. The Philippine banana industry is a cornerstone of agriculture, with the country being one of the world\'s top 5 banana exporters. Healthy Cavendish plantations in Davao yield 30–50 tonnes per hectare annually under optimal management. Understanding what a thriving banana plant looks like prevents misdiagnosis and unnecessary applications.',
        pathogen_type: 'None',
        pathogen_detail: 'No pathogen. This describes optimal physiological condition in banana.',
        affected_parts: [],
        symptoms: {
            early: [
                'New leaves unfurl tightly from the pseudostem center as bright green "cigar" rolls',
                'Leaves are bright, uniform mid-green with no spots, streaks, or irregular margins',
                'Pseudostem is firm, upright, and tightly wrapped with overlapping leaf sheaths',
                'Roots: cream-white to light tan when healthy; no dark discoloration',
            ],
            advanced: [
                'Full functional canopy: 8–12 large leaves (Cavendish) supporting fruit development',
                'Bunch emergence at 9–12 months after planting with clear pedicel emergence',
                'Bunch develops with 6–12 hands each containing 14–20 well-formed fingers',
                'Healthy fruit: angular cross-section, firm, bright green (harvest-ready), no external damage',
                'Sucker emergence: 2–4 healthy ratoon suckers developing from base at different stages',
            ],
            distinguishing: 'Uniformly green leaves with no spots or streaks, firm and upright pseudostem with no yellowing at the base, and normally angular fruit with complete fill. New leaf emergence every 7–10 days in optimal growing conditions indicates excellent health.',
        },
        conditions: {
            temperature: 'Optimal: 26–30°C; growth stops below 16°C and above 38°C',
            humidity: 'Optimal: 75–85% RH; tolerates higher humidity but raises disease risk',
            season: 'Year-round production in PH with proper variety and management',
            spread_method: 'N/A',
        },
        economic_impact: 'Philippine banana exports (primarily Cavendish from Mindanao) earn $800M–$1B USD annually. A healthy managed hectare produces 30–50 tonnes of export-grade Cavendish. Lakatan is the premium local market variety commanding ₱40–80/kg.',
        look_alikes: ['Normal lower leaf senescence (yellowing naturally as leaves age — completely normal)', 'Wind damage (leaf tearing/tattering — mechanical, not disease)'],
        treatment: {
            immediate: ['No treatment — maintain preventive program and document current status'],
            chemical: [],
            organic: [
                'Monthly foliar calcium-boron spray to maintain fruit quality and reduce internal browning',
                'Quarterly vermicompost application at 5 kg/plant during active growth periods',
            ],
            cultural: [
                'Follow 1-2-3 sucker management: retain mother plant, primary follower, secondary follower only',
                'Bag fruit bunches with blue polyethylene bags at "bell stage" — prevents pests and improves grade',
                'Prop heavy bunches to prevent pseudostem toppling once weight exceeds 20 kg',
                'Fertilize every 2 months: 200-80-300 g NPK per Cavendish plant',
                'Remove any leaves with >25% disease damage immediately upon detection',
                'Maintain irrigation at 25–30mm water equivalent per week during dry periods',
            ],
        },
        prevention: [
            'Apply preventive Sigatoka management program from the time of planting',
            'Test and manage soil pH to 6.0–7.0 for optimal nutrient uptake',
            'Control banana weevil borer (Cosmopolites sordidus) with pheromone traps + targeted treatment',
            'Establish strict farm biosecurity against TR4 as a permanent practice',
        ],
        monitoring_tips: [
            'Track days to flowering and bunch emergence as productivity indicators',
            'Count functional green leaves above the bunch at flowering — fewer than 8 indicates stress or disease pressure',
            'Weigh a sample of bunches (10% of plants) at harvest to track productivity trends over time',
            'Use YSL (youngest spotted leaf) monitoring weekly to track Black Sigatoka disease pressure',
        ],
        recovery_timeline: 'N/A — plant is healthy.',
        fun_fact: "A banana 'tree' is botanically the world's largest herbaceous plant — the 'trunk' (pseudostem) is made entirely of tightly rolled leaf bases with no woody tissue at all. What we call the 'tree' is essentially a giant wrapped collection of leaf stems.",
    },

    // ─── GUAVA ───────────────────────────────────────────────────────────────

    {
        id: 'guava_wilt',
        display_name: 'Fusarium Wilt',
        plant: 'Guava', plant_emoji: '🍈', severity: 'critical', thumbnail,
        tagline: 'A soil-borne killer with no cure — prevention is everything',
        overview: 'Guava wilt caused by Fusarium oxysporum f. sp. psidii is arguably the most destructive disease of guava worldwide, responsible for the decimation of entire guava-growing regions in India, Bangladesh, and increasingly Southeast Asia. The fungus invades through roots, colonizes the vascular system, and blocks water transport — causing the tree to die of internal "drought" even when soil is moist. There is no effective chemical cure once a tree is systemically infected. The disease can persist in soil for 20–30 years.',
        scientific_name: 'Fusarium oxysporum f. sp. psidii',
        pathogen_type: 'Fungal (soilborne)',
        pathogen_detail: 'Soilborne ascomycete producing chlamydospores — thick-walled resting spores surviving in soil for decades without a host. The fungus is host-specific to guava (forma specialis psidii) and enters through roots, particularly injured feeder roots. Once inside the xylem, it multiplies and physically clogs vessels while producing toxins.',
        affected_parts: ['Root system (primary entry point)', 'Vascular (xylem) tissue throughout', 'Entire above-ground plant as disease advances'],
        symptoms: {
            early: [
                'One or two branches suddenly wilt despite adequate soil moisture — "sectorial wilt"',
                'Wilted leaves turn yellow-green then bronze/brown but remain attached (no leaf drop)',
                'Roots near the soil surface show dark brown discoloration when cut and examined',
                'Faint dark streaking visible in wood just beneath bark of wilting branches',
            ],
            advanced: [
                'Wilt progresses rapidly involving entire sections of the crown over days to weeks',
                'All leaves wilt, brown, and hang on the dead tree for weeks without dropping',
                'Cut main stem cross-section reveals brown/black vascular ring — pathognomonic sign',
                'Root system: extensive dark brown rot; roots pull apart easily when tugged',
                'Tree death within 2–8 weeks in acute cases; slower chronic decline also occurs',
                'Infected soil remains infested for decades — new guava plantings will also die',
            ],
            distinguishing: 'The "vascular ring" in a cross-section cut of the main stem — a complete or partial ring of dark brown/black tissue following the vascular bundle arrangement — is the definitive diagnostic sign. Drought stress shows pale, uniformly dry wood; bacterial diseases show a different discoloration pattern.',
        },
        conditions: {
            temperature: '25–32°C optimal for Fusarium growth in soil and root infection',
            humidity: 'Moist soil conditions paradoxically favor root infection by facilitating spore movement',
            season: 'Strikes any time; often triggered by waterlogging, root injury, or transplant stress',
            spread_method: 'Infected soil movement via tools, water, shoes; infected planting material; root-to-root contact',
        },
        economic_impact: 'Wiped out entire guava-growing regions historically. The Allahabad guava industry in India lost 80% of orchards in the 1970s–80s. In the Philippines, increasing prevalence threatens the guava juice and fresh market industry.',
        look_alikes: ['Phytophthora root rot (causes basal stem rot, not classic vascular ring)', 'Drought stress (wilting but no vascular discoloration in cross-section)', 'Pythium root rot (mainly young seedlings; no above-ground vascular staining)'],
        treatment: {
            immediate: [
                'CRITICAL: Immediately uproot the entire tree including as many roots as possible',
                'DO NOT replant guava in the same spot for at least 5–7 years minimum',
                'Mark the infected area precisely and prevent all soil movement out of that zone',
                'Sterilize all tools used in the infected area with 10% bleach solution before use elsewhere',
                'Solarize the soil: cover infected area with clear plastic for 6–8 weeks during the hot dry season',
            ],
            chemical: [
                { product: 'Carbendazim 50% WP (preventive soil drench only)', rate: '2 g/L water', frequency: 'Monthly drench around healthy neighboring trees — does NOT cure infected trees' },
                { product: 'Thiophanate-methyl 70% WP', rate: '1.5 g/L water', frequency: 'Monthly preventive soil drench around all healthy trees in proximity to affected area' },
                { product: 'Potassium phosphonate (Fosetyl-Al)', rate: '3 mL/L water', frequency: 'Quarterly soil drench to stimulate host immune response in healthy trees' },
            ],
            organic: [
                'Trichoderma harzianum soil incorporation at 5 kg/hectare — biological suppression (preventive only)',
                'Pseudomonas fluorescens soil drench (10 g/L) around all healthy trees in the area',
                'Neem cake incorporation at 200 kg/hectare reduces soil Fusarium populations over time',
                'Biochar incorporation at 2 t/ha improves soil microbiome diversity, naturally suppressing Fusarium',
            ],
            cultural: [
                'Remove infected tree completely and burn everything including roots — never compost any part',
                'Replant with completely non-host crops (papaya, citrus, vegetables) for minimum 5 years',
                'Implement raised beds or deep drainage channels in waterlogged planting sites',
                'Consider permanent switch to wilt-resistant guava varieties if available locally',
            ],
        },
        prevention: [
            'Use only certified disease-free nursery stock — never propagate from an orchard with any wilt history',
            'Incorporate Trichoderma into soil at planting time as a standard non-negotiable practice',
            'NEVER injure roots during inter-row cultivation — use only shallow tillage maximum 5cm depth',
            'Prevent waterlogging: install drainage channels before planting as fundamental orchard design',
            'Quarantine all new plants in an isolated block for one full season before introducing to main orchard',
            'Never share tools between farms without full sterilization procedures',
            'Select raised or gently sloping planting sites — low-lying areas with water pooling are highest risk',
        ],
        monitoring_tips: [
            'Walk the orchard weekly and flag any tree showing single-branch wilt for follow-up',
            'Never wait to see if wilted branches "recover" — investigate by cutting on the same day you observe it',
            'Always cut and examine vascular tissue at the FIRST sign of wilt to confirm diagnosis before any action',
            'Maintain a field map of your orchard to track exact locations with infection history over years',
        ],
        recovery_timeline: 'Once systemically infected: NO RECOVERY POSSIBLE. Tree death within 2–8 weeks in acute cases. Chronic cases may linger 1–2 years but never recover productivity. Soil remains infested for decades.',
        fun_fact: "Fusarium oxysporum has 'formae speciales' — ultra-specialized subpopulations each capable of attacking only one specific host. The guava-killing form (f. sp. psidii) is completely harmless to banana, and the banana-killing form (f. sp. cubense) cannot harm guava — demonstrating extreme host specificity evolved over millennia.",
    },

    {
        id: 'guava_anthracnose',
        display_name: 'Guava Anthracnose',
        plant: 'Guava', plant_emoji: '🍈', severity: 'moderate', thumbnail,
        tagline: 'Post-harvest rot that strikes ripening fruit rapidly',
        overview: 'Guava anthracnose, caused primarily by Colletotrichum psidii and related Colletotrichum species, is a significant post-harvest disease of guava that also causes leaf spots and shoot blights on the tree. The disease is most economically damaging as a post-harvest rot — guava fruit are highly perishable, and anthracnose can cause 30–60% post-harvest losses within 3–5 days of harvest under ambient tropical temperatures. On-tree infection can also cause fruit spots that reduce market quality even before harvest.',
        scientific_name: 'Colletotrichum psidii',
        pathogen_type: 'Fungal',
        pathogen_detail: 'Ascomycete fungus closely related to the mango anthracnose pathogen but adapted to guava. Produces acervuli with characteristic salmon-colored spore masses under moist conditions. Utilizes quiescent (latent) infection — fruit may be infected while green and show no symptoms until ripening triggers lesion development.',
        affected_parts: ['Fruit (primary economic impact)', 'Young leaves and shoots', 'Bark of young stems'],
        symptoms: {
            early: [
                'Small, circular, brown spots (3–5mm) on green fruit surface — may be missed',
                'Dark brown spots on young leaves with yellow chlorotic halo',
                'Tip blight on young, actively growing shoots',
                'Lesions on leaves may have characteristic salmon-pink spore masses in humid weather',
            ],
            advanced: [
                'Fruit spots enlarge rapidly as fruit ripens — lesions can cover entire fruit within 2–3 days',
                'Infected fruit tissue sinks and turns dark brown/black with soft, watery interior',
                'Salmon-pink spore masses appear in concentric rings on fruit lesions under high humidity',
                'Severe leaf spotting with large necrotic areas and premature leaf drop',
                'Young shoot blight — shoot tips die, affecting new growth flush',
            ],
            distinguishing: 'On fruit, the characteristic concentric rings of salmon-pink spore masses on dark sunken lesions are diagnostic for Colletotrichum. Distinguishable from fruit fly damage (which penetrates deeper with visible larvae) and from physical damage (no sporulation).',
        },
        conditions: {
            temperature: '25–30°C optimal; disease accelerates dramatically at ripening-stage temperatures',
            humidity: 'Free moisture required for spore germination; >85% RH accelerates sporulation',
            season: 'Year-round but most damaging during rainy season and the post-harvest period',
            spread_method: 'Rain splash, insect movement, contaminated harvest equipment and storage containers',
        },
        economic_impact: 'Causes 30–60% post-harvest losses under ambient tropical storage. Significantly limits shelf life and transport range. A major barrier to guava export and refrigerated distribution.',
        look_alikes: ['Fruit fly damage (puncture wounds with larvae inside)', 'Physical bruising damage (no sporulation)', 'Phytophthora fruit rot (watery rot from stem end, different pathogen)'],
        treatment: {
            immediate: [
                'Harvest fruit at the correct maturity stage — do not allow over-ripening on the tree',
                'Handle fruit gently to avoid creating bruises and skin breaks that invite infection',
                'Apply pre-harvest fungicide 2–3 days before harvesting',
                'Dip or spray harvested fruit with approved post-harvest fungicide immediately after harvest',
            ],
            chemical: [
                { product: 'Thiabendazole 45% SC (post-harvest)', rate: '0.5 mL/L dip for 2 minutes', frequency: 'Single post-harvest treatment before storage or transport' },
                { product: 'Carbendazim 50% WP (pre-harvest)', rate: '1 g/L water', frequency: 'Every 14 days; stop 7 days before harvest (check PHI)' },
                { product: 'Mancozeb 80% WP (pre-harvest)', rate: '2 g/L water', frequency: 'Every 10–14 days on trees; stop 5 days before harvest' },
            ],
            organic: [
                'Hot water treatment: dip fruit in 46–48°C water for 10 minutes post-harvest',
                'Chitosan coating (1.5–2%) on harvested fruit — extends shelf life and suppresses anthracnose',
                'Wax coating with carnauba wax post-harvest — physical barrier reducing humidity at fruit surface',
                'Sodium bicarbonate dip (5 g/L) for 5 minutes post-harvest',
            ],
            cultural: [
                'Harvest early in the morning when temperatures are coolest',
                'Avoid field heat buildup — move harvested fruit into shade immediately',
                'Use plastic field crates lined with soft material — avoid bruising during collection',
                'Store fruit in cool, dry conditions if refrigeration is available (8–10°C)',
                'Remove all dropped and infected fruit from the orchard floor weekly',
            ],
        },
        prevention: [
            'Begin protective fungicide program at fruit set stage (small green fruit)',
            'Maintain good orchard sanitation — remove all mummified and fallen fruit consistently',
            'Practice fruit bagging with paper bags at small fruit stage for premium markets',
            'Ensure adequate calcium nutrition — calcium strengthens fruit skin and reduces post-harvest rot susceptibility',
            'Prune to maintain open canopy and reduce fruit-to-fruit contact within clusters',
        ],
        monitoring_tips: [
            'Inspect random fruit samples weekly from small green stage to pre-harvest',
            'After each rain event, check young leaves and shoot tips for new lesions',
            'Inspect post-harvest fruit 24 and 48 hours after harvest to assess effectiveness of post-harvest treatment',
        ],
        recovery_timeline: 'On-tree foliar and shoot infections: 2–3 weeks of treatment. Post-harvest fruit: cannot be recovered once rot initiates — prevention before harvest is the only solution.',
        fun_fact: 'Guava fruit has one of the highest Vitamin C contents of any common fruit — 228 mg per 100g, which is 4 times higher than a standard orange. Anthracnose-infected guava loses this nutritional value rapidly as the rot degrades the fruit\'s antioxidant compounds.',
    },

    {
        id: 'guava_healthy',
        display_name: 'Healthy Guava',
        plant: 'Guava', plant_emoji: '🍈', severity: 'low', thumbnail,
        tagline: 'Hardy, productive, and rich in Vitamin C',
        overview: 'Guava (Psidium guajava) is one of the hardiest tropical fruit trees, tolerating poor soils, drought, and periods of neglect far better than most other fruit crops. A healthy guava tree in the Philippines yields 80–150 kg of fruit per year and begins bearing as early as 2–3 years from planting. The Philippine pink guava is prized for its exceptional Vitamin C content (228 mg/100g — 4× that of orange), distinctive flavor, and versatility in both fresh and processed product markets.',
        pathogen_type: 'None',
        pathogen_detail: 'No pathogen. This describes optimal physiological condition in guava.',
        affected_parts: [],
        symptoms: {
            early: [
                'New growth: bright lime-green tender leaves, slightly reddish at growing tips — NORMAL',
                'Stems are distinctly four-angled (square cross-section) in young growth — a key identifier of healthy guava',
                'Bark: smooth, thin, naturally peeling in papery multi-colored flakes — this is NORMAL and healthy',
                'Flowers: small white 4-petaled flowers with prominent white stamens cluster, highly fragrant',
            ],
            advanced: [
                'Mature leaves: leathery, firm, dark green with distinctive parallel leaf venation',
                'Fruit: round to pear-shaped, 5–12cm diameter depending on variety; skin turns yellow-green when ripe',
                'Flesh: white to pink (variety-dependent); firm near skin, soft at center when ripe',
                'Root system: fibrous, extensive, surface-spreading; tolerant of limited root volume',
            ],
            distinguishing: 'The characteristic four-angled (square) young stems and the naturally multi-colored peeling bark (green, tan, gray patches) are unique to guava and must not be mistaken for disease. The peeling bark is the tree\'s normal bark renewal process.',
        },
        conditions: {
            temperature: 'Tolerates 10–45°C; optimal range 23–28°C',
            humidity: 'Highly adaptable to both humid tropical and semi-arid conditions',
            season: 'Year-round fruiting in PH; major season August–November, minor season February–April',
            spread_method: 'N/A',
        },
        economic_impact: 'Philippine guava industry produces 35,000+ tonnes annually with growing demand for value-added products (juice concentrate, jelly, wine, dried guava, and nutraceuticals) from the high antioxidant content.',
        look_alikes: ['Naturally peeling bark (normal) vs. canker disease (sunken, oozing lesions)', 'Normal multi-colored bark (normal) vs. Fusarium infection (starts with wilting, not bark appearance)'],
        treatment: {
            immediate: ['No treatment needed — document current condition as healthy baseline'],
            chemical: [],
            organic: [
                'Compost application at 5–10 kg/tree twice yearly to maintain soil fertility',
                'Foliar micronutrient spray (Zinc, Boron, Manganese) every quarter',
            ],
            cultural: [
                'Prune to open vase shape with 3–4 scaffold branches and open center for airflow',
                'Fertilize 3–4 times per year: 100-50-100 g NPK per year of tree age per application',
                'Bag developing fruit with paper or plastic bags to prevent guava fruit fly and improve skin appearance',
                'Thin crowded fruit clusters to 1–2 fruit per cluster to improve size and quality',
                'Maintain clean orchard floor — collect and remove all fallen fruit weekly without exception',
            ],
        },
        prevention: [
            'Apply Trichoderma as standard soil treatment at planting to establish biological protection against Fusarium wilt',
            'Monitor weekly for guava fruit fly (Bactrocera correcta) using cue-lure traps — major quality pest',
            'Apply preventive copper spray once per season during the wet period for general disease suppression',
            'Avoid root injury during any cultivation — use shallow cultivation maximum 5cm around trees',
        ],
        monitoring_tips: [
            'Check new growth weekly — sudden tip wilting warrants immediate investigation for Fusarium entry',
            'Monitor fruit set and track the natural drop rate as a productivity health indicator',
            'Watch for asymmetric yellowing patterns — starts at base in Fusarium wilt vs. tip yellowing in drought stress',
        ],
        recovery_timeline: 'N/A — plant is healthy.',
        fun_fact: 'Guava leaves contain powerful antibacterial compounds including quercetin and guajavarin that are used in traditional Philippine medicine to treat wounds, diarrhea, and toothache. Modern pharmacological research has confirmed significant antimicrobial activity against Staphylococcus aureus and E. coli.',
    },

    // ─── CALAMANSI ───────────────────────────────────────────────────────────

    {
        id: 'calamansi_greening',
        display_name: 'Citrus Greening (HLB)',
        plant: 'Calamansi', plant_emoji: '🍊', severity: 'critical', thumbnail,
        tagline: 'The incurable disease destroying citrus worldwide',
        overview: 'Citrus Greening, known as Huanglongbing (HLB) — "yellow dragon disease" in Chinese — is considered the most devastating citrus disease in the world. Caused by Candidatus Liberibacter asiaticus (CLas) and transmitted exclusively by the Asian citrus psyllid, HLB has no cure. Once infected, a tree will decline and die within 5–10 years. HLB has devastated the Florida citrus industry (90% production loss since 2005) and is spreading throughout SE Asia. The Philippine calamansi industry faces growing threat as psyllid populations expand.',
        scientific_name: 'Candidatus Liberibacter asiaticus (CLas)',
        pathogen_type: 'Bacterial (phloem-limited)',
        pathogen_detail: 'Gram-negative, phloem-limited bacterium — lives only in the plant\'s phloem (sugar-conducting vessels). Cannot be cultured on artificial media, making research extremely difficult. Transmitted exclusively by the Asian citrus psyllid (Diaphorina citri) — no other transmission route. Cannot spread through soil, water, or direct plant contact.',
        affected_parts: ['Phloem tissue (systemic throughout entire plant)', 'Leaves', 'Fruit', 'Root system (progressive deterioration)'],
        symptoms: {
            early: [
                '"Blotchy mottle" on leaves: ASYMMETRIC yellow-green mottling that does NOT follow vein patterns',
                'One or a few branches showing yellow leaves while the rest of the tree remains green ("sectorial yellowing")',
                'Twig dieback on affected branches',
                'Reduced and stunted new flush emergence',
            ],
            advanced: [
                'Leaves: small, upright posture (not hanging normally), with characteristic "rabbit ear" appearance from misshapen growth',
                'Fruit: small, lopsided (curved differently than normal calamansi), remaining green at the stylar (bottom) end while rest colors — the "green island" symptom',
                'Fruit: intensely bitter, with aborted seeds — commercially worthless',
                'Progressive season-by-season decline: fewer flushes, smaller canopy, lower yield',
                'Advanced root system deterioration with feeder root dieback',
                'Tree death within 5–10 years of initial infection',
            ],
            distinguishing: 'The ASYMMETRIC blotchy leaf mottling is the key diagnostic feature — nutrient deficiencies create SYMMETRIC mirror-image yellowing, while HLB creates random, asymmetric patches crossing veins freely. The lopsided green-bottomed fruit symptom (when present) is pathognomonic and confirms HLB definitively.',
        },
        conditions: {
            temperature: 'CLas optimal: 27–30°C; psyllid vector optimal: 25–28°C',
            humidity: 'Vector (psyllid) populations peak during new flush emergence periods regardless of humidity',
            season: 'Year-round transmission wherever psyllid is established; spread accelerates when new flushes are present',
            spread_method: 'EXCLUSIVELY by Asian citrus psyllid (Diaphorina citri) feeding; also via infected budwood/grafting',
        },
        economic_impact: 'Florida citrus industry lost $8 billion and 70% of production since HLB arrival in 2005. In the Philippines, threatens the ₱2 billion calamansi industry concentrated in Batangas, Nueva Ecija, and Quezon. No commercial variety is immune.',
        look_alikes: ['Zinc deficiency (symmetric, uniform interveinal yellowing)', 'Magnesium deficiency (symmetric interveinal yellowing of older leaves)', 'Citrus tristeza virus (no fruit greening symptom)', 'Natural variegated calamansi varieties (uniform stable pattern, not progressive)'],
        treatment: {
            immediate: [
                'THERE IS NO CURE — all management focuses on slowing decline and protecting uninfected trees',
                'Confirm diagnosis with PCR test at DA-BAI laboratory before removing any trees',
                'Remove confirmed infected trees promptly to reduce persistent psyllid inoculum source',
                'Immediately begin INTENSIVE psyllid control on ALL remaining trees in the vicinity',
                'Notify neighboring farms — HLB management requires synchronized area-wide action to be effective',
            ],
            chemical: [
                { product: 'Imidacloprid 200 SC (psyllid control)', rate: '0.5 mL/L foliar OR 5 mL/10L soil drench', frequency: 'Foliar every 21 days targeting new flush; soil drench every 3 months' },
                { product: 'Thiamethoxam 25% WG (psyllid control)', rate: '0.5 g/L water', frequency: 'Every 14–21 days; strictly rotate with imidacloprid to prevent resistance' },
                { product: 'Oxytetracycline (antibiotic trunk injection — suppressive)', rate: 'Per label; trunk injection', frequency: 'Every 6 months; delays decline by 2–3 years but does not cure' },
            ],
            organic: [
                'Release Tamarixia radiata — natural parasitoid wasp that parasitizes Asian citrus psyllid nymphs',
                'Kaolin clay spray (5%) — physical barrier reducing psyllid feeding and egg-laying on new flush',
                'Neem oil (2%) targeting actively expanding new flush growth when psyllids are present',
                'Reflective silver mulch under trees — confuses psyllids, reducing their landing rate on trees',
            ],
            cultural: [
                'Synchronize new flush emergence within your orchard through uniform pruning — spray all at once at flush emergence',
                'Remove infected trees promptly — each infected tree is a permanent, year-round inoculum source for psyllids',
                'Verify all purchased planting material with PCR test before introducing to any block',
                'Optimize tree nutrition and irrigation on mildly infected trees to extend their productive economic life',
            ],
        },
        prevention: [
            'This is the ONLY effective strategy — prevention through psyllid exclusion, as there is no cure',
            'Source ALL planting material from certified, screen-house-grown, PCR-tested HLB-free nurseries',
            'Install yellow sticky traps (1 per 20 trees) now — detect psyllid before it spreads through your orchard',
            'Begin systemic insecticide program immediately at first psyllid detection — never wait for infestation',
            'Participate in area-wide coordinated management programs — isolated farm control is insufficient',
            'Grow replacement trees in insect-proof screened nurseries before you need them',
            'Coordinate with neighboring farmers — psyllids travel between farms, making unilateral control ineffective',
        ],
        monitoring_tips: [
            'Check yellow sticky traps weekly and record psyllid counts to track population trends',
            'Inspect all new flush growth every 5–7 days for psyllid presence (2–3mm brown insects, white waxy tubes)',
            'Map all symptomatic trees with dates of first observation to track spread direction and rate',
            'Submit leaf samples (10g minimum, refrigerated, not frozen) to DA-BAI for PCR confirmation when HLB is suspected',
            'Count YSL (youngest symptomatic leaf position) to assess whether disease pressure is increasing',
        ],
        recovery_timeline: 'No recovery. Infected trees decline progressively over 5–10 years. Antibiotic trunk injections extend productive life 2–3 years but are not economically viable for smallholders. Replant with new certified material once tree productivity drops below economic threshold.',
        fun_fact: "Candidatus Liberibacter asiaticus has never been successfully grown in laboratory culture despite decades of intensive research — making it one of the only major global agricultural pathogens that remains 'unculturable.' This is why developing a cure has been virtually impossible — you cannot easily study or test treatments against a pathogen you cannot grow in a lab.",
    },

    {
        id: 'calamansi_citrus_canker',
        display_name: 'Citrus Canker',
        plant: 'Calamansi', plant_emoji: '🍊', severity: 'high', thumbnail,
        tagline: 'Wind-spread bacteria that scar every part of the tree',
        overview: 'Citrus canker, caused by Xanthomonas citri subsp. citri, is a highly contagious bacterial disease affecting all citrus including calamansi. It produces raised, corky lesions on leaves, stems, and fruit that are surrounded by distinctive oily water-soaked margins and yellow halos. While rarely killing trees, citrus canker causes significant defoliation, fruit blemishing, and in severe cases, fruit drop. It is a quarantine disease in many countries, severely restricting calamansi export. Citrus canker can spread explosively through an orchard during typhoon events.',
        scientific_name: 'Xanthomonas citri subsp. citri',
        pathogen_type: 'Bacterial',
        pathogen_detail: 'Gram-negative rod-shaped bacterium entering plant tissue through stomata and wounds. Infects both young and mature tissues. Unlike the bacterial black spot of mango, citrus canker produces distinctive raised corky eruptions (not sunken lesions) due to hypertrophy of infected cells.',
        affected_parts: ['Leaves (both surfaces)', 'Young stems and twigs', 'Fruit surface', 'Petioles'],
        symptoms: {
            early: [
                'Tiny, water-soaked, translucent spots (1–2mm) on undersurface of young leaves',
                'Spots develop raised, crater-like appearance on both leaf surfaces within 7–10 days',
                'Yellow (chlorotic) halo surrounding lesions on leaves is very distinctive',
                'Similar raised lesions appear on young stems and petioles',
            ],
            advanced: [
                'Lesions become raised, corky, tan/brown with rough, cracked surface — the namesake "canker" appearance',
                'Yellow halo around lesions becomes prominent and distinctive',
                'Fruit: corky raised lesions with oily water-soaked margin and yellow halo — permanent fruit blemish',
                'Severe leaf drop following heavy infection, reducing canopy and productivity',
                'Twig dieback in heavily infected trees under sustained pressure',
                'During typhoons: rapid expansion with fresh lesions appearing on every leaf simultaneously',
            ],
            distinguishing: 'The raised, corky texture of citrus canker lesions with oily water-soaked margins and prominent yellow halos distinguishes it from HLB (systemic, no raised lesions), melanose (smaller, rough-textured spots without halo), and scab (no water-soaked margins). The lesions look similar on both leaf surfaces, unlike most fungal diseases that differ top vs. bottom.',
        },
        conditions: {
            temperature: '25–35°C optimal; warm, wet, windy conditions are ideal for rapid spread',
            humidity: 'Wind-driven rain essential for bacterial dispersal into leaf stomata',
            season: 'Worst during and after typhoon season (July–October); spreads explosively during typhoon events',
            spread_method: 'Wind-driven rain splash; contaminated pruning tools; infected planting material; insect wounds; citrus leafminer tunnels',
        },
        economic_impact: 'Quarantine pest in Japan, USA, and other major importers — creates serious export restrictions. Reduces marketable fruit by 30–50% through blemishing. Repeated defoliation reduces long-term tree productivity significantly.',
        look_alikes: ['Melanose (small rough spots but no raised corky texture or yellow halo)', 'Citrus scab (irregular raised lesions but no water-soaked margin)', 'Wind damage (mechanical scarring without yellow halo)', 'HLB symptoms (internal systemic; canker affects external tissue)'],
        treatment: {
            immediate: [
                'Prune all heavily infected shoots 10–15cm below lowest lesion into clean wood',
                'Sterilize pruning tools between every cut with 70% isopropyl alcohol',
                'Apply copper bactericide spray to entire tree immediately after pruning',
                'Remove and burn all pruned material on the same day',
                'Inspect and treat all neighboring trees immediately',
            ],
            chemical: [
                { product: 'Copper hydroxide 77% WP', rate: '2.5–3 g/L water', frequency: 'Every 10–14 days; apply before predicted rain/wind events' },
                { product: 'Copper oxychloride 50% WP', rate: '2.5 g/L water', frequency: 'Every 10 days during wet season and after typhoon events' },
                { product: 'Streptomycin sulfate (where registered)', rate: '0.5 g/L water', frequency: 'Maximum 2× per season; strict rotation to prevent antibiotic resistance' },
            ],
            organic: [
                'Copper-soap (copper octanoate) sprays as lower-residue bactericidal option',
                'Bacillus subtilis PGPR spray weekly as preventive biological bactericide',
                'Lime sulfur spray (3%) — alkaline pH inhibitory to bacterial survival on leaf surface',
            ],
            cultural: [
                'Install windbreaks on all windward sides of the orchard — wind spread is the primary driver',
                'Control citrus leafminer (Phyllocnistis citrella) aggressively — leafminer tunnels are primary entry wounds for canker bacteria',
                'Synchronize new flush emergence through uniform pruning and spray all at flush emergence',
                'Reduce overhead irrigation — drip irrigation eliminates the water film that enables bacterial splash spread',
                'Enforce strict tool hygiene across all workers and visitors',
            ],
        },
        prevention: [
            'Establish windbreaks before establishing any new calamansi orchard',
            'Control citrus leafminer as the highest priority pest — its feeding scars are the primary entry points for canker',
            'Apply copper preventively at flush emergence every season without exception',
            'Use certified disease-free budwood for all propagation',
            'Post-typhoon spray: apply copper bactericide within 24–48 hours after every major wind-rain event',
            'Screen or quarantine all new plants for 6 months before introducing to main orchard',
        ],
        monitoring_tips: [
            'Scout all new flush growth weekly — young leaves are most susceptible during expansion',
            'Inspect immediately after typhoons or heavy rain-wind events — new lesions appear within 7 days',
            'Check under-leaf surfaces first — water-soaked spots appear there before top surface',
            'Monitor leafminer activity using pheromone traps as a proxy for canker infection risk',
        ],
        recovery_timeline: 'Existing lesions on leaves and fruit are permanent — they do not heal. New growth after adequate copper protection will be clean. Full canopy recovery: 2–4 months with consistent copper program and leafminer control.',
        fun_fact: 'The 2005–2006 citrus canker eradication campaign in Florida involved destroying over 8 million residential citrus trees at a cost of $1 billion — only for the eradication to ultimately fail when Tropical Storm Fay in 2008 spread the bacteria too widely. This remains one of the costliest failed crop disease eradication efforts in US history.',
    },

    {
        id: 'calamansi_healthy',
        display_name: 'Healthy Calamansi',
        plant: 'Calamansi', plant_emoji: '🍊', severity: 'low', thumbnail,
        tagline: 'The Philippine kitchen essential',
        overview: 'Calamansi (Citrofortunella microcarpa) is the most important citrus in the Philippines — a cultural icon used in virtually every Filipino kitchen, in traditional medicine, and increasingly in cosmetics and beverages. A healthy, well-managed calamansi tree bears fruit year-round, with peak production October–February. Healthy trees live 15–20+ years and produce 500–1,000+ fruit per tree annually. Unlike most citrus, calamansi tolerates a wide range of soil conditions and is among the most resilient citrus varieties in tropical growing conditions.',
        pathogen_type: 'None',
        pathogen_detail: 'No pathogen. This describes optimal physiological condition in calamansi.',
        affected_parts: [],
        symptoms: {
            early: [
                'New growth: reddish-bronze emerging leaves that quickly transition to bright green — NORMAL for citrus',
                'Leaves: small (5–8cm), glossy, dark green with characteristic winged petiole on either side of the leaf stem',
                'Stems: armed with spines at leaf axils; smooth green bark on actively growing young branches',
                'Flowers: small (1cm), pure white, strongly fragrant — 4–5 petals; appear throughout the year',
            ],
            advanced: [
                'Fruit: small (2.5–3.5cm diameter), round; green skin at immature stage turning orange-yellow when ripe',
                'Ripe fruit: deep orange skin; intensely sour-sweet juice inside with numerous seeds',
                'Healthy fruit: perfectly round, symmetric, smooth skin with no blemishes or green areas when fully ripe',
                'Root system: fibrous, well-distributed, cream-white colored feeder roots near soil surface',
                'Canopy: dense, rounded form, 2–4m height at productive maturity',
            ],
            distinguishing: 'Healthy calamansi has perfectly SYMMETRIC leaf coloring. Any yellowing follows uniform vein patterns (suggesting nutrient issues) rather than random blotchy patches (which strongly suggests HLB). The winged petiole (small flat "wings" on each side of the leaf stem just below the blade) is a morphological identifier unique to calamansi among Philippine citrus.',
        },
        conditions: {
            temperature: 'Optimal: 25–30°C; frost-sensitive below 5°C; adapted to full tropical conditions',
            humidity: 'Tolerates high Philippine humidity; avoid persistent waterlogging at root zone',
            season: 'Year-round fruiting; heavy commercial crop October–February; minor crop March–May',
            spread_method: 'N/A',
        },
        economic_impact: 'Philippine calamansi production exceeds 100,000 tonnes annually with a farmgate value of ₱2+ billion. Used in juice concentrate, personal care products (whitening), traditional herbal medicine preparations, condiments, and marinades. Major production centers: Batangas, Nueva Ecija, Quezon Province.',
        look_alikes: ['HLB infection (asymmetric mottling vs. healthy uniform green)', 'Normal immature green fruit (before coloring) vs. HLB-infected green fruit that does not fully color'],
        treatment: {
            immediate: ['No treatment — maintain preventive program and record as healthy baseline'],
            chemical: [],
            organic: [
                'Quarterly foliar calcium-zinc spray to maintain leaf quality and consistent fruit set',
                'Monthly vermicompost tea soil drench during active growth periods',
            ],
            cultural: [
                'Prune lightly after each peak harvest season to shape tree and stimulate new vegetative flush',
                'Fertilize 4× per year using 100-50-100 g NPK per year of tree age per application',
                'Maintain 50cm organic mulch ring — keep mulch 10cm away from trunk to prevent collar rot',
                'Apply foliar micronutrients (Zn, Fe, Mn, B) every quarter to prevent common deficiencies',
                'Lime soil if pH drops below 5.5 — calamansi requires pH 6.0–7.0 for optimal nutrient availability',
                'Thin heavy fruit clusters in peak bearing to improve individual fruit size',
            ],
        },
        prevention: [
            'Install yellow sticky psyllid traps immediately — early detection is the only HLB defense',
            'Begin imidacloprid soil drench at first psyllid detection on traps',
            'Source replacement trees ONLY from certified, screened, HLB-tested nurseries — no exceptions',
            'Apply preventive copper + oil spray each season for general fungal/bacterial suppression',
            'Control citrus leafminer (Phyllocnistis citrella) aggressively — feeding tunnels invite canker bacteria',
            'Maintain a 1-year supply of replacement trees in an insect-proof screened nursery at all times',
        ],
        monitoring_tips: [
            'Weekly inspection of all new flush for psyllid presence — white waxy tubes, small brown insects at 45° angle',
            'Monthly fruit count per branch as a productivity trend indicator',
            'Quarterly soil pH testing — calamansi is highly sensitive to pH outside optimal range',
            'Immediately recheck any asymmetric leaf yellowing at 2 weeks and 4 weeks — HLB symptoms are progressive',
        ],
        recovery_timeline: 'N/A — tree is healthy.',
        fun_fact: "Calamansi is botanically a hybrid between kumquat (Fortunella japonica) and mandarin orange (Citrus reticulata), which explains its small size (kumquat heritage) combined with its juicy interior and sour-sweet flavor profile (mandarin heritage). No other citrus combination produces quite the same distinctive calamansi flavor.",
    },
];

export const getDiseaseById = (id: string): DiseaseGuide | undefined =>
    DISEASE_LIBRARY.find(d => d.id === id);

export const getSeverityColor = (severity: Severity): string => {
    switch (severity) {
        case 'low': return '#10b981';
        case 'moderate': return '#f59e0b';
        case 'high': return '#f97316';
        case 'critical': return '#ef4444';
    }
};

export const getSeverityLabel = (severity: Severity): string => {
    switch (severity) {
        case 'low': return 'Low Risk';
        case 'moderate': return 'Moderate';
        case 'high': return 'High Risk';
        case 'critical': return 'Critical';
    }
};

export const getPlantColor = (plant: string): string => {
    switch (plant.toLowerCase()) {
        case 'mango': return '#f59e0b';
        case 'banana': return '#eab308';
        case 'guava': return '#10b981';
        case 'calamansi': return '#f97316';
        default: return '#10b981';
    }
};
