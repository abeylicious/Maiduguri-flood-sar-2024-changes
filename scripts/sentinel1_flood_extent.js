// SENTINEL-1 SAR FLOOD MAPPING: MAIDUGURI SEPT 2024

// Mapped out region of Interest (Maiduguri Metropolis, Alau Dam, and Jere Bowl)
var maiduguri_roi = ee.Geometry.Polygon([
  [[13.00, 11.65],
   [13.35, 11.65],
   [13.35, 11.95],
   [13.00, 11.95]]
]);

Map.centerObject(maiduguri_roi, 11);
Map.setOptions('HYBRID');

//Loaded Sentinel-1 GRD IW Collection
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filterBounds(maiduguri_roi);

// Pre-Flood Baseline (July - August 2024)
var preFlood = s1.filterDate('2024-07-01', '2024-08-25')
  .select('VV')
  .median()
  .clip(maiduguri_roi);

// Post-Flood Window (September 5 - September 25, 2024)
var postFlood = s1.filterDate('2024-09-05', '2024-09-25')
  .select('VV')
  .median()
  .clip(maiduguri_roi);

// Water Classification (Binary Images: 1 = Water, 0 = Dry)
// CRITICAL FIX: Do not selfMask() here, so the 0s remain for the .not() logic!
var water_pre = preFlood.lt(-16);
var water_post = postFlood.lt(-16);

// Isolated Newly Inundated Flood Zones
var floodExtent = water_post.and(water_pre.not()).selfMask();

// Mask pre-flood water for visualization
var water_pre_visual = water_pre.selfMask();

// Add Layers to the Map
Map.addLayer(preFlood, {min: -25, max: 0}, 'Pre-Flood Radar (Grayscale)', false);
Map.addLayer(postFlood, {min: -25, max: 0}, 'Post-Flood Radar (Grayscale)', false);
Map.addLayer(water_pre_visual, {palette: ['0000FF']}, 'Permanent Water Bodies (Alau Dam/River)');
Map.addLayer(floodExtent, {palette: ['FF0000']}, 'Newly Inundated Flood Extent (Sept 2024)');

// Calculated Flooded Surface Area
var floodArea_m2 = floodExtent.multiply(ee.Image.pixelArea())
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: maiduguri_roi,
    scale: 10,
    maxPixels: 1e13
  }).get('VV');

var floodArea_km2 = ee.Number(floodArea_m2).divide(1e6);

print('=== MAIDUGURI SEPT 2024 FLOOD EXTENT METRICS ===');
print('Total Inundated Urban & Wetland Area (km²):', floodArea_km2);
