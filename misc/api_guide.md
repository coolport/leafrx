# RiceRx API — Integration Reference

**Base URL:** `https://tth-production.up.railway.app`

---

## POST `/api/analyze` — Main endpoint

**Request:** `multipart/form-data`
- `image` (file, required) — jpg/jpeg/png, max 10MB
- `plant_type` (string, optional) — `"mango"` | `"banana"` | `"guava"` | `"calamansi"`

**Success Response:**
```json
{
  "success": true,
  "image_id": "img_1740000000_4521",
  "timestamp": "2026-02-22T14:30:00.123456",
  "processing_time_seconds": 8.42,

  "overall_health_score": 75,
  "status": "warning",
  "leaves_detected": 4,
  "leaves_analyzed": 3,
  "healthy_leaves": 2,
  "diseased_leaves": 1,

  "primary_disease": "mango_anthracnose",
  "disease_distribution": {
    "mango_healthy": 2,
    "mango_anthracnose": 1
  },

  "predictions": [
    {
      "leaf_id": 0,
      "bbox": [120, 45, 380, 290],
      "detection_confidence": 0.91,
      "plant_type": "mango",
      "disease": "anthracnose",
      "disease_confidence": 0.87,
      "severity": "moderate",
      "health_score": 13,
      "recommendations": [
        "Apply copper-based fungicide",
        "Remove affected leaves immediately",
        "Improve air circulation around plants",
        "Avoid overhead watering"
      ],
      "verification_warning": null
    },
    {
      "leaf_id": 1,
      "bbox": [400, 60, 650, 310],
      "detection_confidence": 0.88,
      "plant_type": "mango",
      "disease": "healthy",
      "disease_confidence": 0.94,
      "severity": "none",
      "health_score": 94,
      "recommendations": [
        "Continue regular monitoring",
        "Maintain current care routine",
        "Keep soil moisture consistent"
      ],
      "verification_warning": null
    }
  ]
}
```

**Key field notes:**

- `overall_health_score` — `0–100`, percentage of healthy leaves. Drive your health bar/ring UI from this.
- `status` — `"healthy"` (≥80%), `"warning"` (60–79%), `"diseased"` (<60%). Drive color coding from this.
- `primary_disease` — format is always `"planttype_disease"` e.g. `"mango_anthracnose"`. Strip the plant prefix to display just the disease name.
- `disease_distribution` — keys are `"planttype_disease"` strings, values are leaf counts.
- `predictions[].severity` — `"none"` | `"early"` | `"moderate"` | `"severe"`
- `predictions[].health_score` — per-leaf score. For healthy leaves this is high (≈confidence×100); for diseased leaves this is low (≈(1−confidence)×100).
- `predictions[].verification_warning` — `null` normally. Non-null string if the model detected a different plant than the user selected, e.g. `"Detected banana leaf, but you selected mango"`.
- `leaves_detected` vs `leaves_analyzed` — detected is raw YOLO count, analyzed is after filtering out crops that were too small. These can differ.

**Failure Response:**
```json
{
  "success": false,
  "error": "No leaves detected in image",
  "suggestion": "Try taking a closer photo of the leaves"
}
```

Always check `success: false` before reading other fields. `suggestion` is only present on certain errors (no leaves detected, no leaves analyzable).

---

## GET `/api/health`

```json
{
  "status": "ok",
  "message": "Leaf Disease Detection API is running",
  "version": "1.0.0",
  "timestamp": "2026-02-22T14:30:00.123456",
  "models_loaded": true,
  "num_classes": 15,
  "validation_accuracy": 0.9711
}
```

Use this on app launch to check if the server is up before letting users scan.

---

## GET `/api/plant-types`

```json
{
  "plant_types": ["mango", "banana", "guava", "calamansi"],
  "count": 4
}
```

---

## GET `/api/diseases`

```json
{
  "count": 15,
  "diseases": [
    {
      "id": "mango_anthracnose",
      "plant": "mango",
      "disease": "anthracnose",
      "display_name": "Anthracnose"
    }
  ]
}
```

---

## GET `/api/disease/:id`

e.g. `/api/disease/mango_anthracnose`

```json
{
  "id": "mango_anthracnose",
  "plant": "mango",
  "disease": "anthracnose",
  "display_name": "Anthracnose",
  "description": "Information about anthracnose in mango trees.",
  "recommendations": [
    "Apply copper-based fungicide",
    "Remove affected leaves immediately",
    "Improve air circulation around plants",
    "Avoid overhead watering"
  ]
}
```

404 if disease ID doesn't exist:
```json
{ "success": false, "error": "Disease \"mango_xyz\" not found" }
```

---

## Important behaviors the LLM should know

**First request is slow.** MobileNetV2 lazy-loads on the first scan per server worker — expect 20–60s. Subsequent requests are 5–15s. Show a loading state with a note like "First scan may take longer…"

**`plant_type` is optional but recommended.** When provided, the model only considers diseases for that plant type. When omitted, it picks the highest-confidence disease across all plants. If the app knows the tree's plant type, always send it.

**`disease_distribution` keys and `primary_disease` use `"planttype_disease"` format.** Always split on the first `_` to separate plant from disease for display. E.g. `"mango_anthracnose".split('_', 1)` → `["mango", "anthracnose"]`.

**`success: false` can come from the API logic itself (not just HTTP errors).** The response can be HTTP 200 with `success: false` (e.g. no leaves detected). Always read the `success` field, don't rely solely on HTTP status code.
