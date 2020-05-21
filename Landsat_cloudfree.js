var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
                  .filterDate('2013-01-01', '2019-12-31')
                  .filterBounds(ee.Geometry.Rectangle([106.4, 32.3,107.2,33.0]));
print(dataset);
var roi = ee.Geometry.Rectangle([106.4, 32.3,107.2,33.0]);
var clip1= function(image){
  return image.clip(roi);
}
var maskClouds = function(image) {
  var scored = ee.Algorithms.Landsat.simpleCloudScore(image);
  return image.updateMask(scored.select(['cloud']).lt(20));
};

var numTS=332;
var dataset_clip=dataset.map(clip1);
var colorized_img0=ee.Image(dataset_clip_list.get(0))
print(colorized_img0);

//var colorized_scored = ee.Algorithms.Landsat.simpleCloudScore(colorized_img0);
print(colorized_scored);

var addQualityBands = function(image) {
  return maskClouds(image)
    // NDVI
    .addBands(image.normalizedDifference(['B5', 'B4']))
    // time in days
    .addBands(image.metadata('system:time_start'));
};

var collection = dataset.map(addQualityBands);
var collection_list = collection.toList(numTS);

print (collection);

var trueColor432Vis = {
  min: 0.0,
  max: 0.4,
};

Map.setCenter(106.4, 32.3, 8);

for (var i=0; i<12; i++){
  var img = ee.Image(collection_list.get(i));
  var trueColor432 = img.select(['B4', 'B3', 'B2']);
  var id= img.id().getInfo();
  print(id);
  
  Map.addLayer(trueColor432,trueColor432Vis,id);
}



//Map.addLayer(trueColor432, trueColor432Vis, 'True Color (432)');
