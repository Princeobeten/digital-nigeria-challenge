'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaChartBar, FaChartPie } from 'react-icons/fa';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon, Map as LeafletMap } from 'leaflet';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ChildbirthData {
  percentage: number;
  ageRange: string;
}

interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  year: number;
}

interface Data {
  location: LocationData;
  childbirth_data: {
    skilled_attendant: ChildbirthData;
    low_birth_weight_infants: ChildbirthData;
    adequately_fed_infants: ChildbirthData;
  };
}

const Map: React.FC = () => {
  const [selected, setSelected] = useState<Data | null>(null);
  const [isChartEmpty, setIsChartEmpty] = useState<boolean>(true);
  const [isBarChart, setIsBarChart] = useState<boolean>(true);
  const mapRef = useRef<LeafletMap | null>(null);

  const data: Data = {
    location: {
      name: "Cross River State",
      latitude: 5.8702,
      longitude: 8.5988,
      year: 2007
    },
    childbirth_data: {
      skilled_attendant: { percentage: 34.6, ageRange: "15-49 year" },
      low_birth_weight_infants: { percentage: 11.7, ageRange: "0-2 year" },
      adequately_fed_infants: { percentage: 29.5, ageRange: "0-11 month" }
    }
  };

  const mapStyles: React.CSSProperties = {
    height: "100%",
    width: "100%",
    borderRadius: "15px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const position: [number, number] = [data.location.latitude, data.location.longitude];

  const iconMarkup = renderToStaticMarkup(<FaMapMarkerAlt style={{ color: '#e74c3c', fontSize: '2rem', background: 'none' }} />);
  const customMarkerIcon = divIcon({
    html: iconMarkup,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: 'custom-marker-icon'
  });

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.fitBounds([[5.4, 8.2], [6.8, 9.3]]);
    }
  }, []);

  const barData = {
    labels: ['Skilled Attendant', 'Adequately Fed Infants', 'Low Birth Weight'],
    datasets: [
      {
        label: 'Percentage (%)',
        data: isChartEmpty
          ? [0, 0, 0]
          : [
              data.childbirth_data.skilled_attendant.percentage,
              data.childbirth_data.adequately_fed_infants.percentage,
              data.childbirth_data.low_birth_weight_infants.percentage,
            ],
        backgroundColor: ['#3498db', '#1abc9c', '#e74c3c'],
      },
    ],
  };

  const pieData = {
    labels: ['Skilled Attendant', 'Adequately Fed Infants', 'Low Birth Weight'],
    datasets: [
      {
        data: isChartEmpty
          ? [0, 0, 0]
          : [
              data.childbirth_data.skilled_attendant.percentage,
              data.childbirth_data.adequately_fed_infants.percentage,
              data.childbirth_data.low_birth_weight_infants.percentage,
            ],
        backgroundColor: ['#3498db', '#1abc9c', '#e74c3c'],
      },
    ],
  };

  const handleMarkerClick = () => {
    setSelected(data);
    setIsChartEmpty(false);
  };

  const handleMarkerUnclick = () => {
    setSelected(null);
    setIsChartEmpty(true);
  };

  const toggleChart = () => {
    setIsBarChart((prev) => !prev);
  };

  return (
    <div className="md:flex justify-between p-8 space-y-4 md:space-y-0 md:space-x-4">
      <div className="flex-1 h-[50vh] md:h-[70vh]">
      <MapContainer 
  center={position} 
  zoom={8} 
  style={mapStyles} 
  ref={mapRef}
  whenReady={(map) => {
    map.target.fitBounds([[5.4, 8.2], [6.8, 9.3]]);
  }}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  />
  <CircleMarker 
    center={position}
    radius={50}
    pathOptions={{
      fillColor: '#3498db',
      fillOpacity: 0.2,
      color: '#2980b9',
      weight: 2
    }}
  />
  <Marker 
    position={position}
    icon={customMarkerIcon}
    eventHandlers={{
      click: handleMarkerClick, 
      popupclose: handleMarkerUnclick
    }}
  >
    {selected && (
      <Popup
        eventHandlers={{
          popupclose: handleMarkerUnclick,
        }}
      >
        <div className="text-sm space-y-6">
          <h2 className="text-lg font-bold">{selected.location.name} - {selected.location.year}</h2>
          <p><span className="font-semibold">Skilled Attendant (Age {selected.childbirth_data.skilled_attendant.ageRange}):</span> {selected.childbirth_data.skilled_attendant.percentage}%</p>
          <p><span className="font-semibold">Adequately Fed Infants (Age {selected.childbirth_data.adequately_fed_infants.ageRange}):</span> {selected.childbirth_data.adequately_fed_infants.percentage}%</p>
          <p><span className="font-semibold">Low Birth Weight Infants (Age {selected.childbirth_data.low_birth_weight_infants.ageRange}):</span> {selected.childbirth_data.low_birth_weight_infants.percentage}%</p>
        </div>
      </Popup>
    )}
  </Marker>
</MapContainer>

      </div>

      <div className="flex-1 space-y-4">
        <div className="p-4 bg-white shadow-lg rounded-lg h-[80%]">
          <h3 className="font-semibold text-xl mb-4 text-center">
            {isBarChart ? 'Bar Chart Representation' : 'Pie Chart Representation'}
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

        <div className="flex justify-center mt-10">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            onClick={toggleChart}
          >
            {isBarChart ? <FaChartPie /> : <FaChartBar />}
            <span>{isBarChart ? 'Switch to Pie Chart' : 'Switch to Bar Chart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Map;