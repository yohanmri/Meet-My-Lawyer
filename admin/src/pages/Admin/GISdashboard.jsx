import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, AlertCircle, Filter, Users, Scale, TrendingUp, Award, MapPinned, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const GISDashboard = () => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [features, setFeatures] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [showLawyers, setShowLawyers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [filters, setFilters] = useState({
    province: '',
    district: '',
    dsd: ''
  });

  const lawyersPerPage = 5;

  const provinceColors = {
    'Western': { base: '#3b82f6', shades: ['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'] },
    'Central': { base: '#8b5cf6', shades: ['#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9'] },
    'Southern': { base: '#ec4899', shades: ['#f472b6', '#ec4899', '#db2777', '#be185d'] },
    'Northern': { base: '#f97316', shades: ['#fb923c', '#f97316', '#ea580c', '#c2410c'] },
    'Eastern': { base: '#14b8a6', shades: ['#2dd4bf', '#14b8a6', '#0d9488', '#0f766e'] },
    'North Western': { base: '#eab308', shades: ['#facc15', '#eab308', '#ca8a04', '#a16207'] },
    'North Central': { base: '#84cc16', shades: ['#a3e635', '#84cc16', '#65a30d', '#4d7c0f'] },
    'Uva': { base: '#06b6d4', shades: ['#22d3ee', '#06b6d4', '#0891b2', '#0e7490'] },
    'Sabaragamuwa': { base: '#10b981', shades: ['#34d399', '#10b981', '#059669', '#047857'] }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const queryResponse = await fetch(
          'https://services1.arcgis.com/tMAq108b7itjkui5/ArcGIS/rest/services/SL_DSD_codes/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=102100&f=json'
        );
        const data = await queryResponse.json();
        
        if (data.features && data.features.length > 0) {
          setFeatures(data.features);
          
          let minX = Infinity, maxX = -Infinity;
          let minY = Infinity, maxY = -Infinity;
          
          data.features.forEach(feature => {
            if (feature.geometry && feature.geometry.rings) {
              feature.geometry.rings.forEach(ring => {
                ring.forEach(([x, y]) => {
                  minX = Math.min(minX, x);
                  maxX = Math.max(maxX, x);
                  minY = Math.min(minY, y);
                  maxY = Math.max(maxY, y);
                });
              });
            }
          });
          
          setMapBounds({ minX, maxX, minY, maxY });
        }

        try {
          const token = localStorage.getItem('aToken');
          const lawyerResponse = await fetch('http://localhost:4000/api/admin/all-lawyers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'atoken': token
            }
          });
          
          const lawyerData = await lawyerResponse.json();
          if (lawyerData.success && lawyerData.lawyers) {
            setLawyers(lawyerData.lawyers);
          }
        } catch (lawyerError) {
          console.error('Error fetching lawyers:', lawyerError);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load map data: ' + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const projectToSVG = (x, y) => {
    if (!mapBounds) return { x: 0, y: 0 };
    
    const svgWidth = 1000;
    const svgHeight = 1400;
    const padding = 40;
    
    const { minX, maxX, minY, maxY } = mapBounds;
    const dataWidth = maxX - minX;
    const dataHeight = maxY - minY;
    const dataAspectRatio = dataWidth / dataHeight;
    
    const availableWidth = svgWidth - 2 * padding;
    const availableHeight = svgHeight - 2 * padding;
    const availableAspectRatio = availableWidth / availableHeight;
    
    let scale, offsetX, offsetY;
    
    if (dataAspectRatio > availableAspectRatio) {
      scale = availableWidth / dataWidth;
      offsetX = padding;
      offsetY = padding + (availableHeight - dataHeight * scale) / 2;
    } else {
      scale = availableHeight / dataHeight;
      offsetX = padding + (availableWidth - dataWidth * scale) / 2;
      offsetY = padding;
    }
    
    const svgX = (offsetX + (x - minX) * scale) * zoomLevel + panOffset.x;
    const svgY = (svgHeight - (offsetY + (y - minY) * scale)) * zoomLevel + panOffset.y;
    
    return { x: svgX, y: svgY };
  };

  const latLngToSVG = (lat, lng) => {
    const x = lng * 20037508.34 / 180;
    const y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    const mercY = y * 20037508.34 / 180;
    return projectToSVG(x, mercY);
  };

  const generatePath = (rings) => {
    if (!rings || rings.length === 0) return '';
    
    return rings.map(ring => {
      return ring.map(([x, y], idx) => {
        const { x: svgX, y: svgY } = projectToSVG(x, y);
        return `${idx === 0 ? 'M' : 'L'} ${svgX} ${svgY}`;
      }).join(' ') + ' Z';
    }).join(' ');
  };

  const getColorForFeature = (feature) => {
    const attrs = feature.attributes;
    const province = attrs.PROVINCE_N || attrs.PROVINCE || attrs.PRO_NAME || 
                     attrs.Province || attrs.province || attrs.PROV_NAME;
    const dsdCode = attrs.DSD_C || attrs.DSD_CODE || attrs.CODE || 
                    attrs.DSD_N || attrs.DSD_NAME || '';
    
    let provinceScheme = provinceColors['Western'];
    
    if (province) {
      const provinceName = province.toString().trim();
      const matchedProvince = Object.keys(provinceColors).find(key => 
        provinceName.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(provinceName.toLowerCase())
      );
      
      if (matchedProvince) {
        provinceScheme = provinceColors[matchedProvince];
      }
    }
    
    const hash = dsdCode.toString().split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const shadeIndex = Math.abs(hash) % provinceScheme.shades.length;
    return provinceScheme.shades[shadeIndex];
  };

  const getUniqueDistricts = () => {
    const districts = new Set();
    lawyers.forEach(lawyer => {
      if (lawyer.district) districts.add(lawyer.district);
    });
    return Array.from(districts).sort();
  };

  const getUniqueValues = (field) => {
    const values = new Set();
    features.forEach(f => {
      const val = f.attributes[field] || f.attributes[field.toUpperCase()] || 
                  f.attributes[field.toLowerCase()];
      if (val) values.add(val);
    });
    return Array.from(values).sort();
  };

  // Filter lawyers by district
  const filteredLawyers = lawyers.filter(lawyer => {
    if (filters.district && lawyer.district !== filters.district) {
      return false;
    }
    return true;
  });

  // Analytics calculations
  const analytics = {
    totalLawyers: lawyers.length,
    filteredLawyers: filteredLawyers.length,
    averageFees: lawyers.length > 0 ? Math.round(lawyers.reduce((sum, l) => sum + (l.fees || 0), 0) / lawyers.length) : 0,
    topDistrict: lawyers.length > 0 ? Object.entries(
      lawyers.reduce((acc, l) => {
        acc[l.district] = (acc[l.district] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0] : ['N/A', 0],
    specialtyDistribution: lawyers.reduce((acc, l) => {
      acc[l.speciality] = (acc[l.speciality] || 0) + 1;
      return acc;
    }, {}),
    districtDistribution: lawyers.reduce((acc, l) => {
      acc[l.district] = (acc[l.district] || 0) + 1;
      return acc;
    }, {})
  };

  const indexOfLastLawyer = currentPage * lawyersPerPage;
  const indexOfFirstLawyer = indexOfLastLawyer - lawyersPerPage;
  const currentLawyers = filteredLawyers.slice(indexOfFirstLawyer, indexOfLastLawyer);
  const totalPages = Math.ceil(filteredLawyers.length / lawyersPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading GIS Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-800 font-semibold mb-2">Error Loading Map</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-100 flex overflow-hidden">
      <div className="w-[70%] h-full flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-800">SL DSD Codes</h1>
                <p className="text-xs text-gray-500">Sri Lankan Divisional Secretariat Divisions</p>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              {features.length} DSDs | {lawyers.length} Lawyers
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-56 bg-white border-r border-gray-200 p-3 overflow-y-auto flex-shrink-0">
            <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Filter className="w-3 h-3" />
              Filters
            </h3>
            
            <div className="mb-3 p-2 bg-gray-50 rounded">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLawyers}
                  onChange={(e) => setShowLawyers(e.target.checked)}
                  className="w-3 h-3 text-blue-600"
                />
                <Scale className="w-3 h-3 text-gray-600" />
                <span className="text-xs font-medium">Show Lawyers</span>
              </label>
            </div>

            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">District</label>
              <select
                value={filters.district}
                onChange={(e) => setFilters({...filters, district: e.target.value})}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Districts</option>
                {getUniqueDistricts().map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setFilters({ province: '', district: '', dsd: '' })}
              className="w-full px-2 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition mb-3"
            >
              Clear Filters
            </button>

            <div className="border-t pt-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Map Controls</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.2))}
                  className="flex-1 px-2 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded flex items-center justify-center gap-1"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.2))}
                  className="flex-1 px-2 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded flex items-center justify-center gap-1"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <button
                  onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
                  className="flex-1 px-2 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded flex items-center justify-center gap-1"
                  title="Reset View"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden bg-gray-50">
            <svg
              ref={mapRef}
              viewBox="0 0 1000 1400"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              style={{ background: '#f0f4f8' }}
            >
              <rect width="1000" height="1400" fill="#e5e9f0" />
              
              {features.map((feature, idx) => {
                if (!feature.geometry || !feature.geometry.rings) return null;
                
                const path = generatePath(feature.geometry.rings);
                const color = getColorForFeature(feature);
                const isSelected = selectedFeature === idx;
                
                return (
                  <g key={idx}>
                    <path
                      d={path}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                      opacity={isSelected ? "0.9" : "0.75"}
                      className="cursor-pointer transition-all"
                      onClick={() => setSelectedFeature(selectedFeature === idx ? null : idx)}
                    />
                  </g>
                );
              })}

              {showLawyers && filteredLawyers.map((lawyer, idx) => {
                if (!lawyer.latitude || !lawyer.longitude) return null;
                
                const { x, y } = latLngToSVG(lawyer.latitude, lawyer.longitude);
                const isSelected = selectedLawyer?._id === lawyer._id;
                
                return (
                  <g 
                    key={`lawyer-${idx}`} 
                    className="cursor-pointer"
                    onClick={() => setSelectedLawyer(selectedLawyer?._id === lawyer._id ? null : lawyer)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? "10" : "8"}
                      fill={isSelected ? "#b91c1c" : "#dc2626"}
                      stroke="#ffffff"
                      strokeWidth="2"
                      opacity="0.9"
                    />
                    <path
                      d={`M ${x} ${y-14} l -5 -9 h 10 z`}
                      fill={isSelected ? "#b91c1c" : "#dc2626"}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </svg>

            {selectedFeature !== null && features[selectedFeature] && (
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm text-gray-800">DSD Details</h3>
                  <button 
                    onClick={() => setSelectedFeature(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-1 text-xs max-h-48 overflow-y-auto">
                  {Object.entries(features[selectedFeature].attributes).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-2">
                      <span className="text-gray-600 font-medium">{key}:</span>
                      <span className="text-gray-800 break-all">{value !== null ? value.toString() : 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedLawyer && (
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 w-72 z-10">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-sm text-gray-800">Lawyer Details</h3>
                  <button 
                    onClick={() => setSelectedLawyer(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="flex gap-3 mb-3">
                  {selectedLawyer.image ? (
                    <img 
                      src={selectedLawyer.image} 
                      alt={selectedLawyer.name}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-800">{selectedLawyer.name}</p>
                    <p className="text-xs text-gray-600">{selectedLawyer.speciality}</p>
                    <p className="text-xs text-blue-600 font-semibold mt-1">Rs. {selectedLawyer.fees}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">District:</span>
                    <span className="text-gray-800 font-medium">{selectedLawyer.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="text-gray-800 font-medium">{selectedLawyer.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="text-gray-800 font-medium">{selectedLawyer.phone}</span>
                  </div>
                  {selectedLawyer.court1 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Court:</span>
                      <span className="text-gray-800 font-medium">{selectedLawyer.court1}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-[30%] h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics Dashboard
          </h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <p className="text-xl font-bold text-blue-600">{analytics.totalLawyers}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
              <p className="text-xl font-bold text-green-600">{analytics.filteredLawyers}</p>
              <p className="text-xs text-gray-600">Filtered</p>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg">
              <p className="text-lg font-bold text-purple-600">Rs.{analytics.averageFees}</p>
              <p className="text-xs text-gray-600">Avg. Fees</p>
            </div>
            <div className="bg-orange-50 p-2 rounded-lg">
              <p className="text-lg font-bold text-orange-600">{analytics.topDistrict[1]}</p>
              <p className="text-xs text-gray-600 truncate">{analytics.topDistrict[0]}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-2 rounded-lg mb-2">
            <h4 className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Award className="w-3 h-3" />
              Top Specialties
            </h4>
            <div className="space-y-1">
              {Object.entries(analytics.specialtyDistribution)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([specialty, count]) => (
                  <div key={specialty} className="flex justify-between text-xs">
                    <span className="text-gray-600 truncate">{specialty}</span>
                    <span className="text-gray-800 font-semibold">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-gray-50 p-2 rounded-lg">
            <h4 className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <MapPinned className="w-3 h-3" />
              District Distribution
            </h4>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {Object.entries(analytics.districtDistribution)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([district, count]) => (
                  <div key={district} className="flex justify-between text-xs">
                    <span className="text-gray-600 truncate">{district}</span>
                    <span className="text-gray-800 font-semibold">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-xs font-semibold text-gray-700">Lawyers List</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {currentLawyers.length > 0 ? (
              <div className="space-y-2">
                {currentLawyers.map((lawyer) => (
                  <div key={lawyer._id} className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition flex gap-2">
                    {lawyer.image ? (
                      <img 
                        src={lawyer.image} 
                        alt={lawyer.name}
                        className="w-12 h-12 rounded object-cover border border-gray-300 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs text-gray-800 truncate">{lawyer.name}</p>
                      <p className="text-xs text-gray-600 truncate">{lawyer.speciality}</p>
                      <p className="text-xs text-gray-500">{lawyer.district}</p>
                      <p className="text-xs text-blue-600 font-semibold">Rs. {lawyer.fees}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 text-center py-8">No lawyers found</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="px-4 py-2 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GISDashboard;