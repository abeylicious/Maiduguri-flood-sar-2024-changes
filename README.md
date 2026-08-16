# Satellite Radar (SAR) Flood Extent Mapping: Maiduguri 2024

[![Google Earth Engine](https://img.shields.io/badge/Google%20Earth%20Engine-API-blue)](https://earthengine.google.com/)
[![Sentinel-1 SAR](https://img.shields.io/badge/Satellite-Sentinel--1%20SAR-brightgreen)](https://sentinels.copernicus.eu/web/sentinel/missions/sentinelabey-1)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview
This repository contains a cloud-proof Synthetic Aperture Radar (SAR) change-detection pipeline implemented in **Google Earth Engine (GEE)** to quantify the flood inundation caused by the **Alau Dam collapse in Maiduguri, Borno State, Nigeria (September 2024)**.

Because standard optical sensors (e.g., Sentinel-2, Landsat) were obstructed by heavy monsoonal cloud cover during the event, **Sentinel-1 C-band Synthetic Aperture Radar (GRD, VV Polarization)** was utilized to penetrate clouds and map open surface water extent.

---

## Key Results & Metrics
* **Pre-Flood Baseline:** July 1 – August 25, 2024
* **Post-Flood Assessment Window:** September 5 – September 25, 2024
* **Optimal Backscatter Threshold:** `-16 dB` (VV Polarization)
* **Calculated Surface Inundation Area:** **~20 km²** within the metropolitan ROI

---

## Methodology & Workflow

1. **ROI Definition:** Maiduguri Metropolis, Alau Dam reservoir, Ngadda River channel, and the downstream Jere Bowl.
2. **SAR Filtering:** Sentinel-1 IW (Interferometric Wide Swath) mode in `VV` polarization.
3. **Temporal Compositing:** Median reductions for baseline and immediate post-breach periods to minimize radar speckle.
4. **Thresholding & Masking:** Backscatter threshold applied at `-16 dB` to segment calm surface water.
5. **Change Detection:** Spatial logic isolating newly inundated pixels while excluding permanent water bodies:
   $$\text{Flood Extent} = \text{Water}_{\text{Sept}} \land \neg \text{Water}_{\text{August}}$$
6. **Area Reduction:** Spatial aggregation using `ee.Reducer.sum()` at 10 m native pixel resolution.

---

## Threshold Calibration & Sensitivity Analysis

A sensitivity comparison was conducted to eliminate dry soil/sand false positives in semi-arid terrain:

| Threshold | Calculated Inundated Area | Observation |
| :--- | :--- | :--- |
| **`-14 dB`** | ~34 km² | High noise/speckle; false positives over dry roads, runways, and bare ground. |
| **`-16 dB`** | **~20 km² (Selected)** | Clean spatial delineation following the Ngadda River hydrological corridor and Jere Bowl agricultural floodplains. |

---

## Visualizations
### 1. Sentinel-1 Radar Backscatter (Grayscale dB)
<table>
  <tr>
    <th width="50%" align="center">Pre-Flood Baseline (Aug 2024)</th>
    <th width="50%" align="center">Post-Dam Burst (Sept 2024)</th>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="assets/Pre_Flood%20Radar%20image.png" width="100%" alt="Pre-Flood Radar">
    </td>
    <td width="50%" align="center">
      <img src="assets/Post_Flood%20Radar%20image.png" width="100%" alt="Post-Flood Radar">
    </td>
  </tr>
</table>
### 2. Water Classification & Flood Inundation Extent (-16 dB)
| Permanent Water Baseline (Alau Dam & River) | Newly Inundated Flood Zone (Sept 2024) |
| :---: | :---: |
| <img src="assets/Normal%20waters_16.png" width="100%"> | <img src="assets/Inundated%20areas_16.png" width="100%"> |

## How to Run the Script

1. Open the [Google Earth Engine Code Editor](https://code.earthengine.google.com/045778a3ff4739ddbd4e60e27e30d729).
2. Copy and paste the script from `scripts/sentinel1_flood_extent.js`.
3. Click **Run** to visualize the layers and view the calculated metrics in the Console.

---

## Author
* **Abiodun Adeola Iyanda** – Data & Geospatial Analyst
