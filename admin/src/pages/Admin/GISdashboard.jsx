import React, { useState, useEffect, useRef, useContext } from 'react';
import { Building, Info, Map, Eye, EyeOff, MapPin, User, Navigation, BarChart3, Users, Gavel, TrendingUp, Clock, Star, Calendar, Phone, Mail, Filter, Search, Activity, Target, Award, BookOpen } from 'lucide-react';
import { AdminContext } from '../../context/AdminContext';

const GISdashboard = () => {
    const { lawyers, users } = useContext(AdminContext);

    const mapRef = useRef(null);
    const [activeTab, setActiveTab] = useState('lawyers');
    const [map, setMap] = useState(null);
    const [featureLayer, setFeatureLayer] = useState(null);
    const [provincialLayer, setProvincialLayer] = useState(null);
    const [districtLayer, setDistrictLayer] = useState(null);
    const [courtsLayer, setCourtsLayer] = useState(null);
    const [lawyersLayer, setLawyersLayer] = useState(null);
    const [mapError, setMapError] = useState(false);
    const [isMapLoading, setIsMapLoading] = useState(true);
    const [selectedLayer, setSelectedLayer] = useState('dsd');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedLawyers, setSelectedLawyers] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [labelMarkers, setLabelMarkers] = useState([]);
    const [labelsVisible, setLabelsVisible] = useState(true);
    const [lawyersVisible, setLawyersVisible] = useState(true);
    const [boundariesVisible, setBoundariesVisible] = useState(true);

    // Get unique specialties from lawyers data
    const specialties = lawyers ? [...new Set(lawyers.map(lawyer => lawyer.speciality))].filter(Boolean) : [];

    // Get district statistics
    const getDistrictStats = () => {
        if (!lawyers) return {};

        const districtStats = {};
        lawyers.forEach(lawyer => {
            if (lawyer.district) {
                if (!districtStats[lawyer.district]) {
                    districtStats[lawyer.district] = {
                        total: 0,
                        available: 0,
                        specialties: new Set()
                    };
                }
                districtStats[lawyer.district].total++;
                if (lawyer.available) districtStats[lawyer.district].available++;
                districtStats[lawyer.district].specialties.add(lawyer.speciality);
            }
        });

        // Convert Set to number for display
        Object.keys(districtStats).forEach(district => {
            districtStats[district].specialtiesCount = districtStats[district].specialties.size;
        });

        return districtStats;
    };

    const districtStats = getDistrictStats();

    // Filter lawyers based on search and specialty
    const filteredLawyers = lawyers ? lawyers.filter(lawyer => {
        const matchesSearch = !searchQuery ||
            (lawyer.name && lawyer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (lawyer.district && lawyer.district.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesSpecialty = !selectedSpecialty || lawyer.speciality === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
    }) : [];

    // Court data
    const courtsData = [
        {
            id: 1,
            name: 'Supreme Court',
            type: 'Supreme Court',
            location: 'Hulftsdorp, Colombo',
            coordinates: [79.86102, 6.93542],
            address: 'Supreme Court Complex, Hulftsdorp, Colombo 12',
            phone: '+94 11 2323456',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'The highest court in Sri Lanka, handling constitutional matters and final appeals.'
        },
        {
            id: 2,
            name: 'Court of Appeal',
            type: 'Court of Appeal',
            location: 'Hulftsdorp, Colombo',
            coordinates: [79.86152, 6.93492],
            address: 'Court of Appeal Complex, Hulftsdorp, Colombo 12',
            phone: '+94 11 2323457',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'Handles appeals from lower courts and judicial review matters.'
        }
    ];

    // Load Leaflet CSS
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
        };
    }, []);

    // Initialize map
    useEffect(() => {
        const initializeMap = async () => {
            try {
                setIsMapLoading(true);

                const [L, esriLeaflet] = await Promise.all([
                    import('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js').then(() => window.L),
                    import('https://cdnjs.cloudflare.com/ajax/libs/esri-leaflet/3.0.10/esri-leaflet.min.js').then(() => window.L.esri)
                ]);

                const mapInstance = L.map(mapRef.current).setView([7.8731, 80.7718], 8);
                L.esri.basemapLayer('Streets').addTo(mapInstance);
                setMap(mapInstance);

                // Create layers based on selected layer type
                await createLayers(mapInstance, L);

                setIsMapLoading(false);
            } catch (error) {
                console.error('Error initializing map:', error);
                setMapError(true);
                setIsMapLoading(false);
            }
        };

        if (mapRef.current && !map) {
            initializeMap();
        }

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, []);

    // Create DSD labels
    const createDSDLabels = (mapInstance, layer) => {
        const L = window.L;
        if (!L || !layer) return;

        const newLabelMarkers = [];

        layer.eachFeature((featureLayer) => {
            const feature = featureLayer.feature;
            const labelText = feature.properties.DSD_N || feature.properties.NAME || feature.properties.DSD_NAME || 'Unknown';

            const bounds = featureLayer.getBounds();
            const center = bounds.getCenter();

            const labelMarker = L.marker(center, {
                icon: L.divIcon({
                    className: 'label-icon',
                    html: `<div style="background: rgba(255,255,255,0.8); padding: 2px 4px; border-radius: 3px; font-size: 10px; font-weight: bold; text-align: center; border: 1px solid #ccc;">${labelText}</div>`,
                    iconSize: [100, 20],
                    iconAnchor: [50, 10]
                })
            });

            labelMarker.addTo(mapInstance);
            newLabelMarkers.push(labelMarker);
        });

        setLabelMarkers(newLabelMarkers);
    };

    // Create map layers
    const createLayers = async (mapInstance, L) => {
        // Clear existing layers
        if (featureLayer) mapInstance.removeLayer(featureLayer);
        if (provincialLayer) mapInstance.removeLayer(provincialLayer);
        if (districtLayer) mapInstance.removeLayer(districtLayer);

        // Clear existing labels
        labelMarkers.forEach(marker => {
            if (mapInstance.hasLayer(marker)) {
                mapInstance.removeLayer(marker);
            }
        });
        setLabelMarkers([]);

        let layer;
        if (selectedLayer === 'dsd') {
            layer = L.esri.featureLayer({
                url: 'https://services1.arcgis.com/tMAq108b7itjkui5/ArcGIS/rest/services/SL_DSD_codes/FeatureServer/0',
                style: function (feature) {
                    return {
                        color: '#2c3e50',
                        weight: 1,
                        fillOpacity: 0.7,
                        fillColor: '#74b9ff'
                    };
                },
                onEachFeature: function (feature, layer) {
                    const dsdName = feature.properties.DSD_N || feature.properties.NAME || 'Unknown';
                    const lawyersInArea = lawyers ? lawyers.filter(lawyer =>
                        lawyer.district && lawyer.district.toLowerCase().includes(dsdName.toLowerCase())
                    ).length : 0;

                    let popupContent = '<div style="font-family: Arial, sans-serif;"><h4 style="margin: 0 0 10px 0; color: #2c3e50;">DSD Information</h4>';

                    for (let key in feature.properties) {
                        if (feature.properties.hasOwnProperty(key) && feature.properties[key] !== null) {
                            const displayKey = key.replace(/_/g, ' ').toUpperCase();
                            popupContent += `<div style="margin-bottom: 5px;"><strong>${displayKey}:</strong> ${feature.properties[key]}</div>`;
                        }
                    }

                    popupContent += `<div style="margin-bottom: 5px;"><strong>LAWYERS IN AREA:</strong> ${lawyersInArea}</div>`;
                    popupContent += '</div>';

                    layer.bindPopup(popupContent, {
                        maxWidth: 300,
                        className: 'custom-popup'
                    });

                    layer.on('mouseover', function (e) {
                        e.target.setStyle({
                            weight: 2,
                            fillOpacity: 0.9
                        });
                    });

                    layer.on('mouseout', function (e) {
                        e.target.setStyle({
                            weight: 1,
                            fillOpacity: 0.7
                        });
                    });

                    layer.on('click', () => {
                        const areaLawyers = lawyers ? lawyers.filter(lawyer =>
                            lawyer.district && lawyer.district.toLowerCase().includes(dsdName.toLowerCase())
                        ) : [];
                        setSelectedLawyers(areaLawyers);
                    });
                }
            }).addTo(mapInstance);

            // Add event listener for when layer is loaded to create labels
            layer.on('load', function () {
                mapInstance.fitBounds(layer.getBounds());
                createDSDLabels(mapInstance, layer);
            });

            setFeatureLayer(layer);

        } else if (selectedLayer === 'provincial') {
            layer = L.esri.featureLayer({
                url: 'https://services1.arcgis.com/tMAq108b7itjkui5/ArcGIS/rest/services/SL_Province/FeatureServer/0',
                style: () => ({
                    color: '#e74c3c',
                    weight: 2,
                    fillOpacity: 0.6,
                    fillColor: '#e74c3c'
                }),
                onEachFeature: (feature, layer) => {
                    const provinceName = feature.properties.PROVINCE || feature.properties.NAME || 'Unknown';
                    const lawyersInProvince = lawyers ? lawyers.filter(lawyer =>
                        lawyer.district && getProvinceForDistrict(lawyer.district) === provinceName
                    ).length : 0;

                    layer.bindPopup(`
                        <div style="font-family: Arial, sans-serif;">
                            <h4 style="margin: 0 0 10px 0; color: #e74c3c;">${provinceName} Province</h4>
                            <p><strong>Lawyers:</strong> ${lawyersInProvince}</p>
                            <p><strong>Districts covered:</strong> ${getDistrictsInProvince(provinceName).join(', ')}</p>
                        </div>
                    `);

                    layer.on('click', () => {
                        const provinceLawyers = lawyers ? lawyers.filter(lawyer =>
                            lawyer.district && getProvinceForDistrict(lawyer.district) === provinceName
                        ) : [];
                        setSelectedLawyers(provinceLawyers);
                    });
                }
            }).addTo(mapInstance);
            setProvincialLayer(layer);

        } else if (selectedLayer === 'district') {
            layer = L.esri.featureLayer({
                url: 'https://services1.arcgis.com/tMAq108b7itjkui5/ArcGIS/rest/services/SL_District/FeatureServer/0',
                style: () => ({
                    color: '#27ae60',
                    weight: 1.5,
                    fillOpacity: 0.6,
                    fillColor: '#27ae60'
                }),
                onEachFeature: (feature, layer) => {
                    const districtName = feature.properties.DISTRICT || feature.properties.NAME || 'Unknown';
                    const lawyersInDistrict = lawyers ? lawyers.filter(lawyer =>
                        lawyer.district && lawyer.district.toLowerCase() === districtName.toLowerCase()
                    ).length : 0;

                    layer.bindPopup(`
                        <div style="font-family: Arial, sans-serif;">
                            <h4 style="margin: 0 0 10px 0; color: #27ae60;">${districtName} District</h4>
                            <p><strong>Lawyers:</strong> ${lawyersInDistrict}</p>
                            <p><strong>Available:</strong> ${lawyers ? lawyers.filter(l =>
                        l.district && l.district.toLowerCase() === districtName.toLowerCase() && l.available
                    ).length : 0}</p>
                        </div>
                    `);

                    layer.on('click', () => {
                        const districtLawyers = lawyers ? lawyers.filter(lawyer =>
                            lawyer.district && lawyer.district.toLowerCase() === districtName.toLowerCase()
                        ) : [];
                        setSelectedLawyers(districtLawyers);
                    });
                }
            }).addTo(mapInstance);
            setDistrictLayer(layer);
        }

        // Add lawyer markers
        if (lawyers && lawyers.length > 0) {
            addLawyersToMap(mapInstance, L);
        }
    };

    // Add lawyers to map
    const addLawyersToMap = (mapInstance, L) => {
        if (lawyersLayer) {
            mapInstance.removeLayer(lawyersLayer);
        }

        if (!lawyersVisible) return;

        const lawyerLayerGroup = L.layerGroup().addTo(mapInstance);
        setLawyersLayer(lawyerLayerGroup);

        filteredLawyers.forEach((lawyer) => {
            if (lawyer.latitude && lawyer.longitude) {
                const lawyerIcon = L.divIcon({
                    className: 'lawyer-marker-icon',
                    html: `
                        <div style="
                            width: 16px;
                            height: 16px;
                            background: #e27728;
                            border: 3px solid white;
                            border-radius: 50%;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                        "></div>
                    `,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                });

                const popupContent = `
                    <div style="padding: 10px; max-width: 300px; font-family: Arial, sans-serif;">
                        <div style="text-align: center; margin-bottom: 10px;">
                            <img src="${lawyer.image}" alt="${lawyer.name}"
                                 style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #e27728;">
                        </div>
                        <h4 style="margin: 0 0 8px 0; color: #333; text-align: center;">${lawyer.name}</h4>
                        <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;">
                            <strong>Specialty:</strong> ${lawyer.speciality}
                        </p>
                        <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;">
                            <strong>District:</strong> ${lawyer.district}
                        </p>
                        <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;">
                            <strong>Experience:</strong> ${lawyer.experience} years
                        </p>
                        <div style="text-align: center;">
                            <span style="
                                background: ${lawyer.available ? '#10b981' : '#ef4444'};
                                color: white;
                                padding: 4px 8px;
                                border-radius: 12px;
                                font-size: 11px;
                                font-weight: bold;
                            ">
                                ${lawyer.available ? 'Available' : 'Busy'}
                            </span>
                        </div>
                    </div>
                `;

                const marker = L.marker([parseFloat(lawyer.latitude), parseFloat(lawyer.longitude)], {
                    icon: lawyerIcon
                }).bindPopup(popupContent, {
                    maxWidth: 320,
                    className: 'lawyer-popup'
                });

                lawyerLayerGroup.addLayer(marker);
            }
        });
    };

    // Helper functions for province mapping
    const getProvinceForDistrict = (district) => {
        const provinceMapping = {
            'Colombo': 'Western',
            'Gampaha': 'Western',
            'Kalutara': 'Western',
            'Kandy': 'Central',
            'Matale': 'Central',
            'Nuwara Eliya': 'Central',
            'Galle': 'Southern',
            'Matara': 'Southern',
            'Hambantota': 'Southern',
            'Jaffna': 'Northern',
            'Kilinochchi': 'Northern',
            'Mannar': 'Northern',
            'Mullaitivu': 'Northern',
            'Vavuniya': 'Northern',
            'Batticaloa': 'Eastern',
            'Ampara': 'Eastern',
            'Trincomalee': 'Eastern',
            'Kurunegala': 'North Western',
            'Puttalam': 'North Western',
            'Anuradhapura': 'North Central',
            'Polonnaruwa': 'North Central',
            'Badulla': 'Uva',
            'Monaragala': 'Uva',
            'Ratnapura': 'Sabaragamuwa',
            'Kegalle': 'Sabaragamuwa'
        };
        return provinceMapping[district] || 'Unknown';
    };

    const getDistrictsInProvince = (province) => {
        const districtsByProvince = {
            'Western': ['Colombo', 'Gampaha', 'Kalutara'],
            'Central': ['Kandy', 'Matale', 'Nuwara Eliya'],
            'Southern': ['Galle', 'Matara', 'Hambantota'],
            'Northern': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
            'Eastern': ['Batticaloa', 'Ampara', 'Trincomalee'],
            'North Western': ['Kurunegala', 'Puttalam'],
            'North Central': ['Anuradhapura', 'Polonnaruwa'],
            'Uva': ['Badulla', 'Monaragala'],
            'Sabaragamuwa': ['Ratnapura', 'Kegalle']
        };
        return districtsByProvince[province] || [];
    };

    // Handle boundaries toggle
    const toggleBoundaries = () => {
        if (!map) return;

        if (boundariesVisible) {
            if (featureLayer) map.removeLayer(featureLayer);
            if (provincialLayer) map.removeLayer(provincialLayer);
            if (districtLayer) map.removeLayer(districtLayer);
            // Hide labels when boundaries are hidden
            labelMarkers.forEach(marker => {
                if (map.hasLayer(marker)) {
                    map.removeLayer(marker);
                }
            });
        } else {
            if (selectedLayer === 'dsd' && featureLayer) map.addLayer(featureLayer);
            if (selectedLayer === 'provincial' && provincialLayer) map.addLayer(provincialLayer);
            if (selectedLayer === 'district' && districtLayer) map.addLayer(districtLayer);
            // Show labels when boundaries are shown
            if (labelsVisible) {
                labelMarkers.forEach(marker => {
                    if (!map.hasLayer(marker)) {
                        map.addLayer(marker);
                    }
                });
            }
        }
        setBoundariesVisible(!boundariesVisible);
    };

    // Handle labels toggle
    const toggleLabels = () => {
        if (!map || !boundariesVisible) return;

        if (labelsVisible) {
            labelMarkers.forEach(marker => {
                if (map.hasLayer(marker)) {
                    map.removeLayer(marker);
                }
            });
        } else {
            labelMarkers.forEach(marker => {
                if (!map.hasLayer(marker)) {
                    map.addLayer(marker);
                }
            });
        }
        setLabelsVisible(!labelsVisible);
    };

    // Handle lawyers visibility toggle
    const toggleLawyers = () => {
        setLawyersVisible(!lawyersVisible);

        if (map && window.L) {
            if (lawyersVisible) {
                if (lawyersLayer) {
                    map.removeLayer(lawyersLayer);
                }
            } else {
                addLawyersToMap(map, window.L);
            }
        }
    };

    // Update layers when selection changes
    useEffect(() => {
        if (map) {
            const L = window.L;
            if (L) {
                createLayers(map, L);
            }
        }
    }, [selectedLayer, lawyers, filteredLawyers]);

    return (
        <div className='m-5 max-h-[90vh] overflow-y-scroll'>
            {/* Header with tab switch */}
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-lg font-medium'>Legal Analytics Dashboard</h1>
                <div className='flex gap-2'>
                    <button
                        onClick={() => setActiveTab('lawyers')}
                        className={`px-4 py-1 rounded-full border ${activeTab === 'lawyers' ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}
                    >
                        Lawyers
                    </button>
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`px-4 py-1 rounded-full border ${activeTab === 'clients' ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}
                    >
                        Clients
                    </button>
                </div>
            </div>

            {/* Lawyers Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Lawyers</p>
                            <p className="text-2xl font-bold text-gray-900">{lawyers ? lawyers.length : 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Gavel className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Available Now</p>
                            <p className="text-2xl font-bold text-green-600">
                                {lawyers ? lawyers.filter(l => l.available).length : 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Activity className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Specialties</p>
                            <p className="text-2xl font-bold text-purple-600">{specialties.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Districts Covered</p>
                            <p className="text-2xl font-bold text-orange-600">
                                {Object.keys(districtStats).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Map Section */}
                <div className="lg:w-2/3">
                    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-indigo-200">
                        <div className="bg-gray-900 text-white p-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-medium flex items-center gap-2">
                                    <Map className="w-5 h-5" />
                                    Legal Services Map
                                </h2>
                                <div className="flex gap-2">
                                    <select
                                        value={selectedLayer}
                                        onChange={(e) => setSelectedLayer(e.target.value)}
                                        className="px-3 py-1 text-sm bg-gray-700 text-white rounded border border-gray-600"
                                    >
                                        <option value="dsd">DSD Boundaries</option>
                                        <option value="district">District Map</option>
                                        <option value="provincial">Provincial Map</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-[500px] lg:h-[600px]">
                            {isMapLoading && (
                                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600 font-medium">Loading Map...</p>
                                    </div>
                                </div>
                            )}

                            {mapError ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <div className="text-center">
                                        <p className="text-gray-500 mb-2">Unable to load map</p>
                                        <p className="text-sm text-gray-400">Please check your internet connection</p>
                                    </div>
                                </div>
                            ) : (
                                <div ref={mapRef} className="w-full h-full" />
                            )}
                        </div>

                        <div className="bg-gray-50 p-4 border-t">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Showing {filteredLawyers.length} lawyers</span>
                                <span>Click on regions to view lawyers in that area</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:w-1/3 space-y-4">
                    {/* Map Controls */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-200">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <Map className="w-5 h-5" />
                            Map Controls
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={toggleBoundaries}
                                className={`w-full flex items-center justify-between p-3 rounded transition-colors ${boundariesVisible
                                    ? 'bg-blue-50 border-2 border-blue-200 text-blue-800'
                                    : 'bg-gray-50 border-2 border-gray-200 text-gray-600'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    {boundariesVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    DSD Boundaries
                                </span>
                            </button>

                            <button
                                onClick={toggleLabels}
                                className={`w-full flex items-center justify-between p-3 rounded transition-colors ${labelsVisible && boundariesVisible
                                    ? 'bg-blue-50 border-2 border-blue-200 text-blue-800'
                                    : 'bg-gray-50 border-2 border-gray-200 text-gray-600'
                                    }`}
                                disabled={!boundariesVisible}
                            >
                                <span className="flex items-center gap-2">
                                    {labelsVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    DSD Labels
                                </span>
                            </button>

                            <button
                                onClick={toggleLawyers}
                                className={`w-full flex items-center justify-between p-3 rounded transition-colors ${lawyersVisible
                                    ? 'bg-orange-50 border-2 border-orange-200 text-orange-800'
                                    : 'bg-gray-50 border-2 border-gray-200 text-gray-600'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    {lawyersVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    Lawyers
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-200">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filters
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Search Lawyers
                                </label>
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Name or district..."
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Specialty
                                </label>
                                <select
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    <option value="">All Specialties</option>
                                    {specialties.map((spec) => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* District Statistics */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-200">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            District Analysis
                        </h3>

                        <div className="max-h-48 overflow-y-auto space-y-2">
                            {Object.entries(districtStats).map(([district, stats]) => (
                                <div key={district} className="flex justify-between items-center p-2 bg-indigo-50 rounded">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{district}</p>
                                        <p className="text-xs text-gray-600">
                                            {stats.available}/{stats.total} available
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">{stats.total}</p>
                                        <p className="text-xs text-gray-600">
                                            {stats.specialtiesCount} specialties
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected Area Lawyers */}
                    {selectedLawyers.length > 0 && (
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-200">
                            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Lawyers in Selected Area ({selectedLawyers.length})
                            </h3>

                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {selectedLawyers.slice(0, 5).map((lawyer) => (
                                    <div key={lawyer._id} className="bg-indigo-50 rounded p-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={lawyer.image}
                                                alt={lawyer.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <h6 className="text-sm font-medium text-gray-900">{lawyer.name}</h6>
                                                <p className="text-xs text-gray-600">{lawyer.speciality}</p>
                                                <p className="text-xs text-gray-500">{lawyer.district} • {lawyer.experience} yrs</p>
                                            </div>
                                            <div className={`w-3 h-3 ${lawyer.available ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                                        </div>
                                    </div>
                                ))}
                                {selectedLawyers.length > 5 && (
                                    <p className="text-sm text-gray-500 text-center">
                                        +{selectedLawyers.length - 5} more lawyers
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GISdashboard;