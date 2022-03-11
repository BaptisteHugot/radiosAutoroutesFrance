/**
* Fichier générant la carte qui sera affichée montrant les radios autoroutières et affichant, pour chacune d'entre elles, un lecteur radio et le flux Twitter associés
*/

// Initialisation des variables
var latitude = 46.49389;
var longitude = 2.602778;
var map = null;
var GeoSearchControl = window.GeoSearch.GeoSearchControl;
var OpenStreetMapProvider = window.GeoSearch.OpenStreetMapProvider;
var geojsonLayer;
var info;

/**
* Fonction définissant la couleur qui est affectée en fonction d'une radio particulière
* @param Le nom de la radio concernée
*/
function getColor(name) {
  return name == "SANEF_OUEST" ? '#800000' :
  name == "SANEF_EST" ? '#808000' :
  name == "SANEF_NORD" ? '#469990' :
  name == "EIFFAGE_CENTRE_EST" ? '#000075' :
  name == "EIFFAGE_RHONE_ALPES" ? '#E6194B' :
  name == "RADIO_ATLANDES" ? '#fc4e2a' :
  name == "VINCI_SUDOUEST" ? '#b15928' :
  name == "VINCI_STRASBOURG" ? '#FF1493' :
  name == "VINCI_COTEDAZUR" ? '#911EB4' :
  name == "VINCI_GRANDOUEST" ? '#808080' :
  name == "VINCI_OUESTCENTRE" ? '#F58231' :
  name == "VINCI_ALPESPROVENCE" ? '#4363D8' :
  name == "VINCI_LANGUEDOCROUSSILLON" ? '#000000' :
  name == "VINCI_AUVERGNERHONEMEDITERRANE" ? '#007500' :
  '';
}

/**
* Fonction définissant l'URL à utiliser en fonction de la radio choisie
* @param Le nom de la radio concernée
*/
function getUrl(name) {
  return name == "SANEF_OUEST" ? 'http://sanef.ice.infomaniak.ch/sanef1077-ouest.mp3' :
  name == "SANEF_EST" ? 'http://sanef.ice.infomaniak.ch/sanef1077-est.mp3' :
  name == "SANEF_NORD" ? 'http://sanef.ice.infomaniak.ch/sanef1077-nord.mp3' :
  name == "EIFFAGE_CENTRE_EST" ? "http://media.autorouteinfo.fr:8000/direct_nord.mp3" :
  name == "EIFFAGE_RHONE_ALPES" ? 'http://media.autorouteinfo.fr:8000/direct_sud.mp3' :
  name == "RADIO_ATLANDES" ? 'http://str0.creacast.com/radio_atlandes_autoroute' :
  name == "VINCI_SUDOUEST" ? 'http://str0.creacast.com/radio_vinci_autoroutes_3' :
  name == "VINCI_COTEDAZUR" ? 'http://str0.creacast.com/radio_vinci_autoroutes_7' :
  name == "VINCI_GRANDOUEST" ? 'http://str0.creacast.com/radio_vinci_autoroutes_2' :
  name == "VINCI_OUESTCENTRE" ? 'http://str0.creacast.com/radio_vinci_autoroutes_1' :
  name == "VINCI_ALPESPROVENCE" ? 'http://str0.creacast.com/radio_vinci_autoroutes_6' :
  name == "VINCI_LANGUEDOCROUSSILLON" ? 'http://str0.creacast.com/radio_vinci_autoroutes_4' :
  name == "VINCI_AUVERGNERHONEMEDITERRANE" ? 'http://str0.creacast.com/radio_vinci_autoroutes_5' :
  name == "VINCI_STRASBOURG" ? '' : // Manque lien vers la radio + Shapefile Datagouv pas à jour
  name == "GASCOGNE_FM" ? '' : // Manque lien vers la radio
  name == "NORMANDIE_TRAFIC" ? '': // Manque lien vers la radio
  '';
}

/**
 * Fonction définissant l'URL à utiliser pour l'affichage du flux Twitter
 * @param Le nom de la radio concernée
 */
 function getUrlTwitter(name){
  return name == "SANEF_OUEST" ? 'sanef_1077' :
  name == "SANEF_EST" ? 'sanef_1077' :
  name == "SANEF_NORD" ? 'sanef_1077' :
  name == "EIFFAGE_CENTRE_EST" ? "autorouteinfo" :
  name == "EIFFAGE_RHONE_ALPES" ? 'autorouteinfo' :
  name == "RADIO_ATLANDES" ? 'a63_landes' :
  name == "VINCI_SUDOUEST" ? 'Radio1077' :
  name == "VINCI_COTEDAZUR" ? 'Radio1077' :
  name == "VINCI_GRANDOUEST" ? 'Radio1077' :
  name == "VINCI_OUESTCENTRE" ? 'Radio1077' :
  name == "VINCI_ALPESPROVENCE" ? 'Radio1077' :
  name == "VINCI_LANGUEDOCROUSSILLON" ? 'Radio1077' :
  name == "VINCI_AUVERGNERHONEMEDITERRANE" ? 'Radio1077' :
  name == "VINCI_STRASBOURG" ? '' :
  name == "GASCOGNE_FM" ? '' :
  name == "NORMANDIE_TRAFIC" ? '':
  '';
 }

/**
* Fonction définissant le nom qui sera affiché lors du choix d'une radio particulière
* @param Le nom de la radio concernée
*/
function getName(name){
  return name == "SANEF_OUEST" ? 'SANEF Ouest' :
  name == "SANEF_EST" ? 'SANEF Est' :
  name == "SANEF_NORD" ? 'SANEF Nord' :
  name == "EIFFAGE_CENTRE_EST" ? "Eiffage Centre-Est" :
  name == "EIFFAGE_RHONE_ALPES" ? 'Eiffage Rhône-Alpes' :
  name == "RADIO_ATLANDES" ? 'Radio Atlandes' :
  name == "VINCI_SUDOUEST" ? 'Vinci Sud-Ouest' :
  name == "VINCI_COTEDAZUR" ? 'Vinci Côte d\'Azur' :
  name == "VINCI_GRANDOUEST" ? 'Vinci Grand Ouest' :
  name == "VINCI_OUESTCENTRE" ? 'Vinci Ouest Centre' :
  name == "VINCI_ALPESPROVENCE" ? 'Vinci Alpes-Provence' :
  name == "VINCI_LANGUEDOCROUSSILLON" ? 'Vinci Languedoc-Roussillon' :
  name == "VINCI_AUVERGNERHONEMEDITERRANE" ? 'Vinci Auvergne-Rhône-Méditerranée' :
  name == "VINCI_STRASBOURG" ? 'Vinci Strasbourg' :
  name == "GASCOGNE_FM" ? 'Gascogne FM' :
  name == "NORMANDIE_TRAFIC" ? 'Normandie Trafic':
  '';
}

/**
* Fonction qui définit le style qui sera affiché en fonction d'une donnée particulière
* @param Le fichier GeoJson en entrée
*/
function style(feature) {
  return {
    fillColor: getColor(feature.properties.name),
    weight: 3,
    opacity: 1,
    color: getColor(feature.properties.name),
    //dashArray: '3',
    fillOpacity: 0.7
  };
}

/*
* Foncion qui définit un listener pour lorsque la souris est sur une des couches
* @param Évènement
*/
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

/*
* Fonction qui définit ce qui se passe lorsque la souris quitte une des couches
* @param Évènement
*/
function resetHighlight(e) {
  geojsonLayer.resetStyle(e.target);
}

/*
* Fonction qui va permettre de zoomer sur l'élément lorsqu'un clic est détecté sur ce dernier
* @param Évènement
*/
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

/**
* Fonction qui permet d'effectuer des actions lorsqu'un utilisateur clique sur la carte
*/
function onClick(e){
  var layer = e.target;
  document.getElementById("nomRadio").innerHTML = getName(layer.feature.properties.name); // On affiche le nom de la radio
  document.getElementById("fluxTwitter").innerHTML = ""; // Nécessaire lors d'un changement de radio

  // On ajoute le flux radio et on le lance
  var audio = document.getElementById("audio");
  audio.setAttribute('src', getUrl(layer.feature.properties.name)); // On modifie la source de la radio
  audio.load();
  audio.play();

  // On ajoute le flux Twitter et on l'affiche
  var urlTwitter = getUrlTwitter(layer.feature.properties.name);  
  twttr.widgets.createTimeline(
  {
    sourceType: "profile",
    screenName: urlTwitter, // On modifie le compte à afficher
  },
  document.getElementById("fluxTwitter")
);

}

/**
* Fonction qui ajoute les listeners pour chaque couche de la carte
* @param Fonctionnalités
* @param Couches
*/
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: onClick
  });
}

/**
* Fonction d'initialisation de la carte
*/
function initMap() {
  // Créer l'objet "map" et l'insèrer dans l'élément HTML qui a l'ID "map"
  map = L.map('map', {
    fullscreenControl: {
      pseudoFullscreen: false // if true, fullscreen to page width and height
    }
  }).setView([latitude, longitude], 6);
  // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
  var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    minZoom: 1,
    maxZoom: 20
  });

  // On créé une URL dynamique au lieu de l'URL statique par défaut
  var hash = new L.Hash(map);

  // On lit les données contenues dans le fichier geojson
  geojsonLayer = new L.GeoJSON.AJAX("./Donnees/data_radio_autoroute.json", {
    style: style,
    onEachFeature: onEachFeature
  });

  // On définit la légende de la carte
  var legend = L.control({
    position: 'bottomright'
  });

  // On gère la géolocalisation de l'utilisateur
  var location = L.control.locate({
    position: 'topleft',
    setView: 'untilPanOrZoom',
    flyTo: false,
    cacheLocation: true,
    drawMarker: true,
    drawCircle: false,
    showPopup: false,
    keepCurrentZoomLevel: true
  });

  // On définit le fournisseur sur lequel on va s'appuyer pour effectuer les recherches d'adresse
  var provider = new OpenStreetMapProvider({
    params: {
      countrycodes: 'fr'
    }, // On restreint uniquement les recherches pour la France
  });

  // On définit le module de recherche
  var searchControl = new GeoSearchControl({
    provider: provider,
    showMarker: true,
    showPopup: false,
    marker: {
      icon: new L.Icon.Default,
      draggable: false,
      interactive: false
    },
    maxMarkers: 1,
    retainZoomLevel: true,
    animateZoom: true,
    autoClose: true,
    searchLabel: "Entrez l'adresse",
    keepResult: true
  });

    // On ajoute toutes les couches à la carte
    osmLayer.addTo(map);
    geojsonLayer.addTo(map);
    map.addControl(searchControl);
    location.addTo(map);
  }

  /**
  * Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
  */
  window.onload = function() {
    initMap();
  };
