'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, LayerGroup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaHospital, FaSchool, FaWater, FaChartBar, FaChartPie, FaExpand, FaCompress, FaStreetView, FaSatelliteDish } from 'react-icons/fa';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon, Map as LeafletMap, CircleMarker as LeafletCircleMarker } from 'leaflet';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface InfrastructureData {
  id: number;
  name: string;
  type: 'hospital' | 'school';
  latitude: number;
  longitude: number;
  data: {
    capacity: string | number;
    yearBuilt: number | 'unknown';
    condition: 'Good' | 'Fair' | 'Poor';
  };
}

const infrastructureData: InfrastructureData[] = [
  { id: 1, name: "General Hospital", type: "hospital", latitude: 4.9555422048709925, longitude: 8.335341621499179, data: { capacity: "unknown", yearBuilt: 'unknown', condition: 'Good' } },
  { id: 2, name: "University of Calabar Teaching Hospital", type: "hospital", latitude: 4.956397302856487, longitude: 8.34976117622124, data: { capacity: "unknown", yearBuilt: 1979, condition: 'Good' } },
  { id: 3, name: "Nigerian Navy Reference Hospital Calabar", type: "hospital", latitude: 5.002602244866328, longitude: 8.333290913547776, data: { capacity: "unknown", yearBuilt: 1982, condition: 'Good' } },
  { id: 4, name: "Arubah Specialist Hospital and Diagnostics", type: "hospital", latitude: 4.983107103280756, longitude: 8.343333103443495, data: { capacity: "unknown", yearBuilt: 2019, condition: 'Good' } },
  { id: 5, name: "Calabar Preparatory International School", type: "school", latitude: 4.954901863249359, longitude: 8.337468672558513, data: { capacity: "unknown", yearBuilt: 1963, condition: 'Good' } },
  { id: 6, name: "UNICAL International Demonstration Secondary School", type: "school", latitude: 4.95644104031808, longitude: 8.34622340221119, data: { capacity: "unknown", yearBuilt: 1995, condition: 'Good' } },
  { id: 7, name: "Holy Child Secondary School", type: "school", latitude: 4.959348364996844, longitude: 8.329057265637312, data: { capacity: "unknown", yearBuilt: 1953, condition: 'Good' } },
  { id: 8, name: "Aunty Margaret International School", type: "school", latitude: 4.9730297209096905, longitude: 8.338326979387206, data: { capacity: "unknown", yearBuilt: 1972, condition: 'Good' } },
  { id: 9, name: "University of Cross River", type: "school", latitude: 4.9292303588989625, longitude: 8.329933524016974, data: { capacity: "unknown", yearBuilt: 2002, condition: 'Fair' } },
  { id: 10, name: "University of Calabar", type: "school", latitude: 4.952776839979816, longitude: 8.33992759941126, data: { capacity: "unknown", yearBuilt: 1975, condition: 'Good' } },
];

const Map: React.FC = () => {
  const [selected, setSelected] = useState<InfrastructureData | null>(null);
  const [filteredData, setFilteredData] = useState(infrastructureData);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isBarChart, setIsBarChart] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite'>('street');
  const mapRef = useRef<LeafletMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const mapStyles: React.CSSProperties = {
    height: isFullScreen ? "100vh" : "100%",
    width: "100%",
    borderRadius: isFullScreen ? "0" : "15px",
    boxShadow: isFullScreen ? "none" : "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const getIcon = (type: string, color: string) => {
    let icon;
    switch (type) {
      case 'hospital':
        icon = <FaHospital className={`shadow-md rounded-full text-4xl text-slate-900 p-2 bg-white text-${color}`} />;
        break;
      case 'school':
        icon = <FaSchool className={`shadow-md rounded-full text-4xl text-slate-900 p-2 bg-white text-${color}`} />;
        break;
      default:
        icon = <FaHospital className={`shadow-md rounded-full text-4xl text-slate-900 p-2 bg-white text-${color}`} />;
    }
    return renderToStaticMarkup(icon);
  };

  const customMarkerIcon = (type: string) => divIcon({
    html: getIcon(type, type === 'hospital' ? '#3498db' : type === 'school' ? '#1abc9c' : '#2ecc71'),
    iconSize: [25, 41],
    iconAnchor: [18, 18],
    popupAnchor: [1, -34],
    className: `custom-marker-icon ${type}`,
  });

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.fitBounds([[4.9292303588989625, 8.329057265637312], [5.002602244866328, 8.34976117622124]]);
    }
  }, []);

  useEffect(() => {
    setFilteredData(
      infrastructureData.filter(item => 
        activeFilters.length === 0 || activeFilters.includes(item.type)
      )
    );
  }, [activeFilters]);

  const handleFilter = (type: string) => {
    setActiveFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const barData = {
    labels: ['Hospitals', 'Schools'],
    datasets: [{
      label: 'Number of Infrastructure',
      data: [
        filteredData.filter(item => item.type === 'hospital').length,
        filteredData.filter(item => item.type === 'school').length,
      ],
      backgroundColor: ['#3498db', '#1abc9c'],
    }],
  };

  const pieData = {
    labels: ['Good Condition', 'Fair Condition', 'Poor Condition'],
    datasets: [{
      data: [
        filteredData.filter(item => item.data.condition === 'Good').length,
        filteredData.filter(item => item.data.condition === 'Fair').length,
        filteredData.filter(item => item.data.condition === 'Poor').length,
      ],
      backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'],
    }],
  };

  const toggleChart = () => setIsBarChart(prev => !prev);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (mapContainerRef.current?.requestFullscreen) {
        mapContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  const toggleMapLayer = () => {
    setMapLayer(prev => prev === 'street' ? 'satellite' : 'street');
  };

  return (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50' : 'md:flex justify-between p-8 space-y-4 md:space-y-0 md:space-x-4'}`}>
      <div ref={mapContainerRef} className={`${isFullScreen ? 'w-full h-full' : 'flex-1 h-[50vh] md:h-[70vh]'} relative`}>
        <MapContainer 
          center={[4.9730297209096905, 8.338326979387206]} 
          zoom={13} 
          style={mapStyles} 
          ref={mapRef}
        >
          {mapLayer === 'street' ? (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          ) : (
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          )}
          <LayersControl position="bottomright">
            <LayersControl.Overlay checked name="Hospitals">
              <LayerGroup>
                {filteredData.filter(item => item.type === 'hospital').map(item => (
                  <React.Fragment key={item.id}>
                    <Marker 
                      position={[item.latitude, item.longitude]}
                      icon={customMarkerIcon(item.type)}
                      eventHandlers={{
                        click: () => setSelected(item),
                      }}
                    >
                      <Popup>
                        <div className="text-sm space-y-2">
                          <h2 className="text-lg font-bold">{item.name}</h2>
                          <p><span className="font-semibold">Type:</span> Hospital</p>
                          <p><span className="font-semibold">Capacity:</span> {item.data.capacity}</p>
                          <p><span className="font-semibold">Year Built:</span> {item.data.yearBuilt}</p>
                          <p><span className="font-semibold">Condition:</span> {item.data.condition}</p>
                        </div>
                      </Popup>
                    </Marker>
                    <CircleMarker
                      center={[item.latitude, item.longitude]}
                      radius={40}
                      color={item.data.condition === 'Good' ? '#2ecc71' : item.data.condition === 'Fair' ? '#f1c40f' : '#e74c3c'}
                      fillOpacity={0.3}
                    />
                  </React.Fragment>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Schools">
              <LayerGroup>
                {filteredData.filter(item => item.type === 'school').map(item => (
                  <React.Fragment key={item.id}>
                    <Marker 
                      position={[item.latitude, item.longitude]}
                      icon={customMarkerIcon(item.type)}
                      eventHandlers={{
                        click: () => setSelected(item),
                      }}
                    >
                      <Popup>
                        <div className="text-sm space-y-2">
                          <h2 className="text-lg font-bold">{item.name}</h2>
                          <p><span className="font-semibold">Type:</span> School</p>
                          <p><span className="font-semibold">Capacity:</span> {item.data.capacity}</p>
                          <p><span className="font-semibold">Year Built:</span> {item.data.yearBuilt}</p>
                          <p><span className="font-semibold">Condition:</span> {item.data.condition}</p>
                        </div>
                      </Popup>
                    </Marker>
                    <CircleMarker
                      center={[item.latitude, item.longitude]}
                      radius={40}
                      color={item.data.condition === 'Good' ? '#2ecc71' : item.data.condition === 'Fair' ? '#f1c40f' : '#e74c3c'}
                      fillOpacity={0.3}
                    />
                  </React.Fragment>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
            {/* <LayersControl.Overlay checked name="Utilities">
              <LayerGroup>
                {filteredData.filter(item => item.type === 'utility').map(item => (
                  <React.Fragment key={item.id}>
                    <Marker 
                      position={[item.latitude, item.longitude]}
                      icon={customMarkerIcon(item.type)}
                      eventHandlers={{
                        click: () => setSelected(item),
                      }}
                    >
                      <Popup>
                        <div className="text-sm space-y-2">
                          <h2 className="text-lg font-bold">{item.name}</h2>
                          <p><span className="font-semibold">Type:</span> Utility</p>
                          <p><span className="font-semibold">Year Built:</span> {item.data.yearBuilt}</p>
                          <p><span className="font-semibold">Condition:</span> {item.data.condition}</p>
                        </div>
                      </Popup>
                    </Marker>
                    <CircleMarker
                      center={[item.latitude, item.longitude]}
                      radius={20}
                      color={item.data.condition === 'Good' ? '#2ecc71' : item.data.condition === 'Fair' ? '#f1c40f' : '#e74c3c'}
                      fillOpacity={0.3}
                    />
                  </React.Fragment>
                ))}
              </LayerGroup>
            </LayersControl.Overlay> */}
          </LayersControl>
        </MapContainer>
        <button 
          className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-md z-[1000]"
          onClick={toggleFullScreen}
        >
          {isFullScreen ? <FaCompress /> : <FaExpand />}
        </button>
        <button 
          className="absolute text-xl bottom-4 left-4 bg-white p-2 rounded-md shadow-md z-[1000]"
          onClick={toggleMapLayer}
        >
          {mapLayer === 'street' ? <FaStreetView /> : <FaSatelliteDish />}
        </button>
        <div className="absolute top-3 left-12 text-center bg-white px-4 py-2 rounded-md shadow-md z-[1000] flex items-center space-x-2">
          <div className="text-blue-500 font-bold">
            {filteredData.length}
          </div>
          <span className="text-sm">Locations</span>
        </div>
      </div>

      {!isFullScreen && (
        <div className="flex-1 space-y-4">
          <div className="p-4 bg-white shadow-lg rounded-lg h-[80%]">
            <h3 className="font-semibold text-xl mb-4 text-center">
              {isBarChart ? 'Infrastructure Distribution' : 'Infrastructure Condition'}
            </h3>
            {isBarChart ? (
              <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false }}}} />
            ) : (
             <div className="h-[80%] text-center flex justify-center">
               <Pie 
                data={pieData} 
                options={{ 
                  responsive: true, 
                  plugins: { 
                    legend: { 
                      display: true, 
                      position: 'top' as const
                    }
                  }
                }} 
              />
             </div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              onClick={toggleChart}
            >
              {isBarChart ? <FaChartPie /> : <FaChartBar />}
              <span>{isBarChart ? 'Switch to Condition Chart' : 'Switch to Distribution Chart'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;