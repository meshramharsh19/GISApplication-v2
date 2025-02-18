import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import JSZip from 'jszip';
import proj4 from 'proj4';

import { Margin } from '@mui/icons-material';

// Styles
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    marginTop: '11vh',
  },
  sidebar: {
    width: '300px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    overflowY: 'auto',
    transition: 'transform 0.3s ease',
  },
  sidebarHidden: {
    transform: 'translateX(-100%)',
  },
  map: {
    flex: 1,
  },
  hamburger: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 1000,
    padding: '10px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  fileUpload: {
    marginBottom: '20px',
  },
  layerToggle: {
    marginBottom: '10px',
  },
  fileInput: {
    marginTop: '5px',
    width: '100%',
  },
  checkbox: {
    marginRight: '8px',
  },
  layerLabel: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  }
};

// Setup UTM projections
const setupProjections = () => {
  // Add UTM zone definitions (1-60 for both north and south)
  for (let zone = 1; zone <= 60; zone++) {
    proj4.defs(`UTM${zone}N`, `+proj=utm +zone=${zone} +datum=WGS84 +units=m +no_defs`);
    proj4.defs(`UTM${zone}S`, `+proj=utm +zone=${zone} +south +datum=WGS84 +units=m +no_defs`);
  }
};

setupProjections();

// Helper function to normalize file paths
const normalizePath = (baseDir, relativePath) => {
  if (!relativePath) return '';
  
  // Remove leading slashes and handle backslashes
  relativePath = relativePath.replace(/^[/\\]+/, '').replace(/\\/g, '/');
  
  if (relativePath.startsWith('../')) {
    const baseSegments = baseDir.split('/').filter(Boolean);
    const relativeSegments = relativePath.split('/');
    
    let segments = [...baseSegments];
    for (const segment of relativeSegments) {
      if (segment === '..') {
        segments.pop();
      } else if (segment !== '.') {
        segments.push(segment);
      }
    }
    return segments.join('/');
  }
  
  if (baseDir && !relativePath.includes('/')) {
    return `${baseDir}/${relativePath}`;
  }
  
  return relativePath;
};

// Function to detect coordinate system from KML
const detectCoordinateSystem = (xmlDoc) => {
  // Check for explicit coordinate system definition
  const hint = xmlDoc.querySelector('coordinates')?.getAttribute('coordSystem') ||
               xmlDoc.querySelector('LatLonBox') ? 'EPSG:4326' : null;
  
  if (hint) return hint;
  
  // Try to detect UTM from coordinate values
  const coords = xmlDoc.querySelector('coordinates')?.textContent;
  if (coords) {
    const [x, y] = coords.trim().split(/\s+/)[0].split(',').map(Number);
    if (x > 100000 && y > 100000) {
      // Likely UTM coordinates
      const utmZone = Math.floor((x + 180) / 6) + 1;
      return y > 0 ? `UTM${utmZone}N` : `UTM${utmZone}S`;
    }
  }
  
  return 'EPSG:4326'; // Default to lat/lon
};

// Function to load image from various possible locations in ZIP
const loadImageFromZip = async (zip, imagePath, baseDir = '') => {
  console.log('Loading image:', imagePath, 'from baseDir:', baseDir);
  
  const possiblePaths = [
    imagePath,
    `${baseDir}/${imagePath}`,
    `files/${imagePath}`,
    `images/${imagePath}`,
    imagePath.split('/').pop(),
    `doc.files/${imagePath}`,
    `doc.files/files/${imagePath}`,
  ].map(path => path.replace(/^[/\\]+/, ''));
  
  for (const path of possiblePaths) {
    const imageFile = zip.file(path);
    if (imageFile) {
      try {
        const imageBlob = await imageFile.async('blob');
        return URL.createObjectURL(imageBlob);
      } catch (error) {
        console.warn(`Failed to load image from ${path}:`, error);
      }
    }
  }
  
  console.warn('Image not found in any expected location:', imagePath);
  return null;
};

// Function to load and parse KML files recursively
const loadKmlFiles = async (zip, filePath, baseDir = '', loadedFiles = new Set()) => {
  console.log('Loading KML:', filePath, 'from baseDir:', baseDir);
  
  const normalizedPath = normalizePath(baseDir, filePath);
  
  if (loadedFiles.has(normalizedPath)) {
    return [];
  }
  loadedFiles.add(normalizedPath);

  const kmlFile = zip.file(normalizedPath);
  if (!kmlFile) {
    console.warn('KML file not found:', normalizedPath);
    return [];
  }

  const kmlText = await kmlFile.async('text');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(kmlText, 'application/xml');

  const currentDir = normalizedPath.split('/').slice(0, -1).join('/');

  // Handle NetworkLinks
  const networkLinks = Array.from(
    xmlDoc.getElementsByTagNameNS("http://www.opengis.net/kml/2.2", "NetworkLink") ||
    xmlDoc.getElementsByTagName("NetworkLink")
  );
  
  const linkedKmlPromises = networkLinks.map(async (link) => {
    const href = link.querySelector('href')?.textContent ||
                link.getElementsByTagNameNS("http://www.opengis.net/kml/2.2", "href")[0]?.textContent;
    
    if (href) {
      return loadKmlFiles(zip, href, currentDir, loadedFiles);
    }
    return [];
  });

  const linkedResults = await Promise.all(linkedKmlPromises);
  
  return [{
    kmlText,
    basePath: currentDir,
    coordSystem: detectCoordinateSystem(xmlDoc)
  }].concat(linkedResults.flat());
};

// KmlMap Component
const KmlMap = ({ kmlContent, isActive, zip, baseDir }) => {
  const map = useMap();
  const [overlays, setOverlays] = useState([]);

  const processGroundOverlay = useCallback(async (groundOverlay, baseDir, coordSystem) => {
    const icon = groundOverlay.querySelector('Icon') ||
                groundOverlay.getElementsByTagNameNS("http://www.opengis.net/kml/2.2", "Icon")[0];
    if (!icon) return null;
  
    const href = icon.querySelector('href')?.textContent ||
                icon.getElementsByTagNameNS("http://www.opengis.net/kml/2.2", "href")[0]?.textContent;
    if (!href) return null;
  
    const imageUrl = zip ? await loadImageFromZip(zip, href, baseDir) : href;
    if (!imageUrl) return null;
  
    // Check for LatLonBox
    const latLonBox = groundOverlay.querySelector('LatLonBox') ||
                     groundOverlay.getElementsByTagNameNS("http://www.opengis.net/kml/2.2", "LatLonBox")[0];
    
    // Check for gx:LatLonQuad
    const latLonQuad = groundOverlay.querySelector('gx\\:LatLonQuad') ||
                       groundOverlay.getElementsByTagNameNS("http://www.google.com/kml/ext/2.2", "LatLonQuad")[0];
  
    let bounds;
  
    if (latLonBox) {
      // Handle LatLonBox
      const getCoord = (tag) => {
        const element = latLonBox.querySelector(tag) ||
                       latLonBox.getElementsByTagNameNS("http://www.opengis.net/kml/2.2", tag)[0];
        return parseFloat(element?.textContent);
      };
  
      const north = getCoord("north");
      const south = getCoord("south");
      const east = getCoord("east");
      const west = getCoord("west");
  
      if (isNaN(north) || isNaN(south) || isNaN(east) || isNaN(west)) {
        return null;
      }
  
      if (coordSystem !== 'EPSG:4326') {
        const sw = proj4(coordSystem, 'EPSG:4326', [west, south]);
        const ne = proj4(coordSystem, 'EPSG:4326', [east, north]);
        bounds = L.latLngBounds([sw[1], sw[0]], [ne[1], ne[0]]);
      } else {
        bounds = L.latLngBounds([[south, west], [north, east]]);
      }
    } else if (latLonQuad) {
      // Handle gx:LatLonQuad
      const coordinates = latLonQuad.querySelector('coordinates')?.textContent ||
                         latLonQuad.getElementsByTagNameNS("http://www.opengis.net/kml/2.2", "coordinates")[0]?.textContent;
      
      if (!coordinates) return null;
  
      // Parse coordinates (format: lon,lat,alt lon,lat,alt lon,lat,alt lon,lat,alt)
      const coords = coordinates.trim().split(/\s+/).map(coord => {
        const [lon, lat] = coord.split(',').map(parseFloat);
        return [lat, lon]; // Leaflet uses [lat, lon] format
      });
  
      if (coords.length !== 4) return null;
  
      if (coordSystem !== 'EPSG:4326') {
        // Transform coordinates if not in EPSG:4326
        const transformedCoords = coords.map(([lat, lon]) => {
          const [newLon, newLat] = proj4(coordSystem, 'EPSG:4326', [lon, lat]);
          return [newLat, newLon];
        });
        bounds = L.latLngBounds(transformedCoords);
      } else {
        bounds = L.latLngBounds(coords);
      }
    } else {
      return null;
    }
  
    return { bounds, imageUrl };
  }, [zip]);

  const updateOverlays = useCallback(async () => {
    if (!isActive || !kmlContent || (!zip && !kmlContent.includes('<kml'))) return;

    try {
      let kmlFiles;
      if (zip) {
        kmlFiles = await loadKmlFiles(zip, 'doc.kml', '', new Set());
      } else {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlContent, 'application/xml');
        kmlFiles = [{
          kmlText: kmlContent,
          basePath: '',
          coordSystem: detectCoordinateSystem(xmlDoc)
        }];
      }

      const allOverlayPromises = kmlFiles.flatMap(({ kmlText, basePath, coordSystem }) => {
        const xmlDoc = new DOMParser().parseFromString(kmlText, 'application/xml');
        const groundOverlays = Array.from(
          xmlDoc.getElementsByTagNameNS("http://www.opengis.net/kml/2.2", "GroundOverlay") ||
          xmlDoc.getElementsByTagName("GroundOverlay")
        );
        
        return groundOverlays.map(overlay => processGroundOverlay(overlay, basePath, coordSystem));
      });

      const newOverlays = (await Promise.all(allOverlayPromises))
        .filter(overlay => overlay !== null);

      setOverlays(prev => {
        prev.forEach(overlay => {
          if (overlay.leafletOverlay) {
            map.removeLayer(overlay.leafletOverlay);
          }
          URL.revokeObjectURL(overlay.imageUrl);
        });

        return newOverlays.map(overlay => {
          const leafletOverlay = L.imageOverlay(overlay.imageUrl, overlay.bounds).addTo(map);
          return { ...overlay, leafletOverlay };
        });
      });

      if (newOverlays.length > 0) {
        const allBounds = L.latLngBounds(newOverlays.map(o => o.bounds));
        map.fitBounds(allBounds);
      }

    } catch (error) {
      console.error('Error updating overlays:', error);
    }
  }, [map, kmlContent, isActive, zip, baseDir, processGroundOverlay]);

  useEffect(() => {
    updateOverlays();
    
    return () => {
      setOverlays(prev => {
        prev.forEach(overlay => {
          if (overlay.leafletOverlay) {
            map.removeLayer(overlay.leafletOverlay);
          }
          URL.revokeObjectURL(overlay.imageUrl);
        });
        return [];
      });
    };
  }, [updateOverlays]);

  return null;
};

// Main Map Component
const Map = () => {
  const [layers, setLayers] = useState({
    Orthophotos: { kmlContent: null, isActive: false, zip: null, baseDir: '' },
    DTM: { kmlContent: null, isActive: false, zip: null, baseDir: '' },
    DSM: { kmlContent: null, isActive: false, zip: null, baseDir: '' },
  });
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleFileUpload = async (e, layerName) => {
    const file = e.target.files[0];
    
    if (!file || (!file.name.endsWith('.kmz') && !file.name.endsWith('.kml'))) {
      alert('Please upload a valid KMZ or KML file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (file.name.endsWith('.kmz')) {
          const zip = await JSZip.loadAsync(event.target.result);
          const kmlFiles = await loadKmlFiles(zip, 'doc.kml');
          
          if (kmlFiles.length === 0) {
            throw new Error('No valid KML files found in KMZ');
          }

          setLayers(prev => ({
            ...prev,
            [layerName]: {
              kmlContent: kmlFiles[0].kmlText,
              isActive: true,
              zip: zip,
              baseDir: kmlFiles[0].basePath,
            },
          }));
        } else {
          // Handle direct KML file
          const kmlContent = new TextDecoder().decode(event.target.result);
          setLayers(prev => ({
            ...prev,
            [layerName]: {
              kmlContent: kmlContent,
              isActive: true,
              zip: null,
              baseDir: '',
            },
          }));
        }
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error loading file: ' + error.message);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const toggleLayer = (layerName) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: {
        ...prev[layerName],
        isActive: !prev[layerName].isActive,
      },
    }));
  };


  return (
    <div style={styles.container}>
      <div style={{
        ...styles.sidebar,
        ...(sidebarVisible ? {} : styles.sidebarHidden)
      }}>
        <div style={styles.fileUpload}>
          <h2>File Uploads</h2>
          {Object.keys(layers).map((layerName) => (
            <div key={layerName} style={styles.layerToggle}>
              <label>
                {layerName}:
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, layerName)}
                  accept=".kmz"
                />
              </label>
            </div>
          ))}
        </div>

        <div>
          <h2>Toggle Layers</h2>
          {Object.keys(layers).map((layerName) => (
            <div key={layerName} style={styles.layerToggle}>
              <label>
                <input
                  type="checkbox"
                  checked={layers[layerName].isActive}
                  onChange={() => toggleLayer(layerName)}
                />
                {layerName}
              </label>
            </div>
          ))}
        </div>
      </div>

      <MapContainer
        center={[20.5937, 77.9629]}
        zoom={5}
        minZoom={3}
        maxZoom={19}
        style={styles.map}
      >
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        />
        {Object.entries(layers).map(([layerName, { kmlContent, isActive, zip, baseDir }]) => (
          <KmlMap
            key={layerName}
            kmlContent={kmlContent}
            isActive={isActive}
            zip={zip}
            baseDir={baseDir}
          />
        ))}
      </MapContainer>

    </div>
  );
};

export default Map;