function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

function toggleDropdown(id) {
    var content = document.getElementById(id);
    var chevron = content.previousElementSibling.querySelector('.chevron');
    if (content.style.display === "none" || content.style.display === "") {
        content.style.display = "block";
        content.style.animation = "slideDown 0.3s forwards";
        chevron.style.transform = "rotate(180deg)";
    } else {
        content.style.animation = "slideUp 0.3s forwards";
        setTimeout(function() {
            content.style.display = "none";
        }, 300);
        chevron.style.transform = "rotate(0deg)";
    }
}

fetch('https://script.google.com/macros/s/AKfycbxOCpq3F-XzzhEkWXY6hpAE480hyY01F3aoxDNP-EEmj3d4OV-rwclu7_QXm7cvvPwX3A/exec')
  .then(response => response.json())
  .then(data => {
    addMarkersToMap(data);
  })
  .catch(error => console.error('Error:', error));

function addMarkersToMap(data) {
  const vectorSource = new ol.source.Vector();

  data.forEach(location => {
    const lat = parseFloat(location.latitude);
    const lon = parseFloat(location.longitude);
    const name = location.name;
    const googleMapsLink = location.address;

    const marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
      name: name,
      googleMapsLink: googleMapsLink
    });

    vectorSource.addFeature(marker);
  });

  const markerVectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: function(feature) {
      return new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scale: 1.5
        }),
        text: new ol.style.Text({
          text: feature.get('name'),
          offsetY: -25, 
          font: 'bold 20px Arial',
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2
          })
        })
      });
    }
  });

  map.addLayer(markerVectorLayer);

  map.on('singleclick', function(evt) {
    map.forEachFeatureAtPixel(evt.pixel, function(feature) {
      const googleMapsLink = feature.get('googleMapsLink');
      if (googleMapsLink) {
        window.open(googleMapsLink, '_blank');
      }
    });
  });
}

const map = new ol.Map({
  target: 'map1',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-92.0198, 30.2241]),
    zoom: 12
  })
});

window.addEventListener('resize', function() {
  map.updateSize();
});
