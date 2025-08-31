import React, { useState, useEffect, useRef } from 'react'
import { Building, Info, Map, Eye, EyeOff } from 'lucide-react'

const CourtsLanka = () => {
    const navigate = (path) => {
        console.log('Navigate to:', path)
        alert(`Would navigate to: ${path}`)
    }

    const mapRef = useRef(null)
    const [map, setMap] = useState(null)
    const [featureLayer, setFeatureLayer] = useState(null)
    const [labelMarkers, setLabelMarkers] = useState([])
    const [courtsLayer, setCourtsLayer] = useState(null)
    const [mapError, setMapError] = useState(false)
    const [nearestLawyer, setNearestLawyer] = useState(null)

    // DSD Boundaries controls
    const [boundariesVisible, setBoundariesVisible] = useState(true)
    const [labelsVisible, setLabelsVisible] = useState(true)

    // Court filter state
    const [courtFilters, setCourtFilters] = useState({
        'Supreme Court': true,
        'Court of Appeal': true,
        'High Court': true,
        'District Court': true,
        'Magistrate\'s Court': true,
        'Primary Court': true,
        'Labour Tribunal': true,
        'Family Court': true
    })

    // Court data
    const courtsData = [
        // Higher Courts
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
            coordinates: [79.86172, 6.93507],
            address: 'Court of Appeal Complex, Hulftsdorp, Colombo 12',
            phone: '+94 11 2323789',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'Intermediate appellate court handling appeals from lower courts.'
        },
        {
            id: 3,
            name: 'High Court Balapitiya',
            type: 'High Court',
            location: 'Balapitiya',
            coordinates: [80.03946, 6.25676],
            address: 'High Court, Balapitiya',
            phone: '+94 34 2295123',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'High Court with jurisdiction over serious criminal and civil matters.'
        },
        // District Courts
        {
            id: 4,
            name: 'Colombo District Court',
            type: 'District Court',
            location: 'Hulftsdorp, Colombo',
            coordinates: [79.86150, 6.93615],
            address: 'District Court Complex, Hulftsdorp, Colombo 12',
            phone: '+94 11 2323654',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'District court handling civil matters and appeals from lower courts.'
        },
        {
            id: 5,
            name: 'Kandy District Court',
            type: 'District Court',
            location: 'Kandy',
            coordinates: [80.61062, 7.27261],
            address: 'District Court, Kandy',
            phone: '+94 81 2222345',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'District court serving the Central Province region.'
        },
        {
            id: 6,
            name: 'Galle District Court',
            type: 'District Court',
            location: 'Galle',
            coordinates: [80.22098, 6.05352],
            address: 'District Court, Galle',
            phone: '+94 91 2234567',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'District court serving the Southern Province region.'
        },
        {
            id: 7,
            name: 'Jaffna District Court',
            type: 'District Court',
            location: 'Jaffna',
            coordinates: [80.01337, 9.66058],
            address: 'District Court, Jaffna',
            phone: '+94 21 2222456',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'District court serving the Northern Province region.'
        },
        {
            id: 8,
            name: 'Anuradhapura District Court',
            type: 'District Court',
            location: 'Anuradhapura',
            coordinates: [80.41083, 8.33500],
            address: 'District Court, Anuradhapura',
            phone: '+94 25 2222789',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'District court serving the North Central Province region.'
        },
        {
            id: 9,
            name: 'Kilinochchi District Court',
            type: 'District Court',
            location: 'Kilinochchi',
            coordinates: [80.40888, 9.38705],
            address: 'District Court, Kilinochchi',
            phone: '+94 21 2287456',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'District court serving the Kilinochchi region.'
        },
        {
            id: 10,
            name: 'Moratuwa District Court',
            type: 'District Court',
            location: 'Rawathawatta West, Moratuwa',
            coordinates: [79.88549, 6.78849],
            address: 'District Court, Rawathawatta West, Moratuwa',
            phone: '+94 11 2647123',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'District court serving the Moratuwa region.'
        },
        {
            id: 11,
            name: 'Matara District Court',
            type: 'District Court',
            location: 'Matara',
            coordinates: [80.53500, 5.94800],
            address: 'District Court, Matara',
            phone: '+94 41 2222345',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'District court serving the Matara region.'
        },
        {
            id: 12,
            name: 'Kurunegala District Court',
            type: 'District Court',
            location: 'Kurunegala',
            coordinates: [80.36496, 7.48644],
            address: 'District Court, Kurunegala',
            phone: '+94 37 2222456',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'District court serving the North Western Province region.'
        },
        {
            id: 13,
            name: 'Kotte District Court',
            type: 'District Court',
            location: 'Sri Jayawardenepura Kotte',
            coordinates: [79.90248, 6.89407],
            address: 'District Court, Sri Jayawardenepura Kotte',
            phone: '+94 11 2889567',
            workingHours: '8:30 AM - 4:30 PM',
            description: 'District court serving the administrative capital region.'
        }
    ]

    // Dummy lawyer data
    const lawyersData = [
        {
            _id: 'lawyer1',
            name: 'Mr. Rohan Perera',
            speciality: 'Criminal Law',
            district: 'Colombo',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
            available: true,
            coordinates: [79.8612, 6.9271]
        },
        {
            _id: 'lawyer2',
            name: 'Ms. Priya Silva',
            speciality: 'Civil Law',
            district: 'Kandy',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b9c5d14b?w=300&h=300&fit=crop&crop=face',
            available: true,
            coordinates: [80.6341, 7.2966]
        },
        {
            _id: 'lawyer3',
            name: 'Mr. Kasun Fernando',
            speciality: 'Family Law',
            district: 'Galle',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
            available: false,
            coordinates: [80.2210, 6.0535]
        }
    ]

    // Load Leaflet CSS
    useEffect(() => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'
        document.head.appendChild(link)

        const esriLeafletCSS = document.createElement('link')
        esriLeafletCSS.rel = 'stylesheet'
        esriLeafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/esri-leaflet/3.0.10/esri-leaflet.css'
        document.head.appendChild(esriLeafletCSS)

        return () => {
            document.head.removeChild(link)
            document.head.removeChild(esriLeafletCSS)
        }
    }, [])

    // Initialize Leaflet Map
    useEffect(() => {
        const initializeMap = async () => {
            try {
                // Load Leaflet and Esri-Leaflet
                const [L, esriLeaflet] = await Promise.all([
                    import('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js').then(() => window.L),
                    import('https://cdnjs.cloudflare.com/ajax/libs/esri-leaflet/3.0.10/esri-leaflet.min.js').then(() => window.L.esri)
                ])

                // Initialize map
                const mapInstance = L.map(mapRef.current).setView([7.8731, 80.7718], 8)

                // Add basemap
                L.esri.basemapLayer('Topographic').addTo(mapInstance)

                setMap(mapInstance)

                // Create DSD boundaries layer
                const dsdLayer = L.esri.featureLayer({
                    url: 'https://services1.arcgis.com/tMAq108b7itjkui5/ArcGIS/rest/services/SL_DSD_codes/FeatureServer/0',
                    style: function (feature) {
                        return {
                            color: '#2c3e50',
                            weight: 1,
                            fillOpacity: 0.7,
                            fillColor: '#74b9ff'
                        }
                    },
                    onEachFeature: function (feature, layer) {
                        // Create popup content for DSD boundaries
                        let popupContent = '<div style="font-family: Arial, sans-serif;"><h4 style="margin: 0 0 10px 0; color: #2c3e50;">SL DSD codes</h4>'

                        for (let key in feature.properties) {
                            if (feature.properties.hasOwnProperty(key) && feature.properties[key] !== null) {
                                const displayKey = key.replace(/_/g, ' ').toUpperCase()
                                popupContent += `<div style="margin-bottom: 5px;"><strong>${displayKey}:</strong> ${feature.properties[key]}</div>`
                            }
                        }

                        popupContent += '</div>'

                        layer.bindPopup(popupContent, {
                            maxWidth: 300,
                            className: 'custom-popup'
                        })

                        // Add hover effects
                        layer.on('mouseover', function (e) {
                            e.target.setStyle({
                                weight: 2,
                                fillOpacity: 0.9
                            })
                        })

                        layer.on('mouseout', function (e) {
                            e.target.setStyle({
                                weight: 1,
                                fillOpacity: 0.7
                            })
                        })
                    }
                }).addTo(mapInstance)

                setFeatureLayer(dsdLayer)

                // Fit map to layer bounds when loaded
                dsdLayer.on('load', function () {
                    mapInstance.fitBounds(dsdLayer.getBounds())
                    // Create labels after boundaries load
                    createDSDLabels(mapInstance, dsdLayer)
                })

                // Create courts layer
                const courtsLayerGroup = L.layerGroup().addTo(mapInstance)
                setCourtsLayer(courtsLayerGroup)

                // Add court markers
                addCourtMarkers(courtsLayerGroup)

            } catch (error) {
                console.error('Error initializing map:', error)
                setMapError(true)
            }
        }

        if (mapRef.current) {
            initializeMap()
        }

        return () => {
            if (map) {
                map.remove()
            }
        }
    }, [])

    // Create DSD labels
    const createDSDLabels = async (mapInstance, dsdLayer) => {
        try {
            const L = window.L
            const markers = []

            dsdLayer.eachFeature((layer) => {
                const feature = layer.feature
                const labelText = feature.properties.DSD_N || feature.properties.NAME || feature.properties.DSD_NAME || 'Unknown'

                const bounds = layer.getBounds()
                const center = bounds.getCenter()

                const labelMarker = L.marker(center, {
                    icon: L.divIcon({
                        className: 'label-icon',
                        html: `<div style="background: rgba(255,255,255,0.8); padding: 2px 4px; border-radius: 3px; font-size: 10px; font-weight: bold; text-align: center; border: 1px solid #ccc;">${labelText}</div>`,
                        iconSize: [100, 20],
                        iconAnchor: [50, 10]
                    })
                })

                labelMarker.addTo(mapInstance)
                markers.push(labelMarker)
            })

            setLabelMarkers(markers)
        } catch (error) {
            console.error('Error creating labels:', error)
        }
    }

    // Create court icon SVG
    const createCourtIcon = (color) => {
        const svg = `
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V9H22V7L12 2Z" fill="${color}" stroke="white" stroke-width="1"/>
                <path d="M4 9V19H6V9H4Z" fill="${color}" stroke="white" stroke-width="1"/>
                <path d="M8 9V19H10V9H8Z" fill="${color}" stroke="white" stroke-width="1"/>
                <path d="M12 9V19H14V9H12Z" fill="${color}" stroke="white" stroke-width="1"/>
                <path d="M16 9V19H18V9H16Z" fill="${color}" stroke="white" stroke-width="1"/>
                <path d="M20 9V19H22V9H20Z" fill="${color}" stroke="white" stroke-width="1"/>
                <path d="M2 19H22V21H2V19Z" fill="${color}" stroke="white" stroke-width="1"/>
            </svg>
        `
        return 'data:image/svg+xml;base64,' + btoa(svg)
    }

    // Add court markers
    const addCourtMarkers = (layerGroup) => {
        if (!window.L || !layerGroup) return

        const L = window.L
        layerGroup.clearLayers()

        const filteredCourts = courtsData.filter(court => courtFilters[court.type])

        filteredCourts.forEach(court => {
            const nearestLawyer = findNearestLawyer(court)

            const popupContent = `
                <div style="padding: 10px; max-width: 350px; font-family: Arial, sans-serif;">
                    <div style="border-bottom: 2px solid ${getCourtColor(court.type)}; padding-bottom: 10px; margin-bottom: 15px;">
                        <h3 style="margin: 0 0 5px 0; color: #333; font-size: 16px; font-weight: bold;">${court.name}</h3>
                        <span style="background: ${getCourtColor(court.type)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                            ${court.type}
                        </span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <p style="margin: 0 0 8px 0; color: #666; font-size: 13px; line-height: 1.4;">
                            <strong>📍 Address:</strong><br>${court.address}
                        </p>
                        <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">
                            <strong>📞 Phone:</strong> ${court.phone}
                        </p>
                        <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">
                            <strong>🕐 Hours:</strong> ${court.workingHours}
                        </p>
                        <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.4;">
                            <strong>ℹ️ Description:</strong><br>${court.description}
                        </p>
                    </div>
                    
                    ${nearestLawyer ? `
                        <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 15px; border-radius: 12px; color: white; position: relative;">
                            <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #f3f4f6;">⚖️ Nearest Lawyer</h4>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="position: relative;">
                                    <img src="${nearestLawyer.image}" alt="${nearestLawyer.name}" 
                                         style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.2);">
                                    <div style="position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; 
                                               background: ${nearestLawyer.available ? '#10b981' : '#ef4444'}; 
                                               border-radius: 50%; border: 2px solid #1f2937;"></div>
                                </div>
                                <div style="flex: 1;">
                                    <p style="margin: 0 0 3px 0; font-weight: bold; font-size: 13px; color: white;">
                                        ${nearestLawyer.name}
                                    </p>
                                    <p style="margin: 0 0 2px 0; font-size: 12px; color: #d1d5db;">
                                        ${nearestLawyer.speciality}
                                    </p>
                                    <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                                        ${nearestLawyer.district}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `

            const marker = L.marker([court.coordinates[1], court.coordinates[0]], {
                icon: L.icon({
                    iconUrl: createCourtIcon(getCourtColor(court.type)),
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                })
            }).bindPopup(popupContent, {
                maxWidth: 400,
                className: 'court-popup'
            })

            layerGroup.addLayer(marker)
        })
    }

    // Find nearest lawyer to selected court
    const findNearestLawyer = (court) => {
        if (!court) return null

        let nearestLawyer = null
        let minDistance = Infinity

        lawyersData.forEach(lawyer => {
            const distance = Math.sqrt(
                Math.pow(lawyer.coordinates[0] - court.coordinates[0], 2) +
                Math.pow(lawyer.coordinates[1] - court.coordinates[1], 2)
            )
            if (distance < minDistance) {
                minDistance = distance
                nearestLawyer = lawyer
            }
        })

        return nearestLawyer
    }

    // Get color based on court type
    const getCourtColor = (type) => {
        const colors = {
            'Supreme Court': '#8B0000',
            'Court of Appeal': '#B22222',
            'High Court': '#DC143C',
            'District Court': '#FF4500',
            'Magistrate\'s Court': '#FF6347',
            'Primary Court': '#FF7F50',
            'Labour Tribunal': '#4682B4',
            'Family Court': '#9370DB'
        }
        return colors[type] || '#666666'
    }

    // Handle filter changes
    const handleFilterChange = (courtType) => {
        const newFilters = {
            ...courtFilters,
            [courtType]: !courtFilters[courtType]
        }
        setCourtFilters(newFilters)

        // Update court markers
        if (courtsLayer) {
            addCourtMarkers(courtsLayer)
        }
    }

    // Handle DSD boundaries toggle
    const toggleBoundaries = () => {
        if (!map || !featureLayer) return

        if (boundariesVisible) {
            map.removeLayer(featureLayer)
        } else {
            map.addLayer(featureLayer)
        }
        setBoundariesVisible(!boundariesVisible)
    }

    // Handle DSD labels toggle
    const toggleLabels = () => {
        if (!map) return

        if (labelsVisible) {
            labelMarkers.forEach(marker => {
                map.removeLayer(marker)
            })
        } else {
            labelMarkers.forEach(marker => {
                map.addLayer(marker)
            })
        }
        setLabelsVisible(!labelsVisible)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Courts Lanka</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Interactive map of Sri Lankan courts with DSD administrative boundaries. Click on court markers or boundaries to view detailed information.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* DSD Boundaries Controls */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                                <Map className="w-5 h-5" />
                                DSD Boundaries
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={toggleBoundaries}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${boundariesVisible
                                        ? 'bg-blue-50 border-2 border-blue-200 text-blue-800'
                                        : 'bg-gray-50 border-2 border-gray-200 text-gray-600'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {boundariesVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        Show Boundaries
                                    </span>
                                </button>
                                <button
                                    onClick={toggleLabels}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${labelsVisible
                                        ? 'bg-blue-50 border-2 border-blue-200 text-blue-800'
                                        : 'bg-gray-50 border-2 border-gray-200 text-gray-600'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {labelsVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        Show Labels
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Court Type Filters */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                                <Building className="w-5 h-5" />
                                Court Types
                            </h3>
                            <div className="space-y-3">
                                {Object.keys(courtFilters).map(courtType => (
                                    <label key={courtType} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={courtFilters[courtType]}
                                            onChange={() => handleFilterChange(courtType)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                        <span
                                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                            style={{ backgroundColor: getCourtColor(courtType) }}
                                        />
                                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                            {courtType}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {mapError ? (
                                <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                                    <div className="text-center">
                                        <p className="text-gray-500 mb-2">Unable to load map</p>
                                        <p className="text-sm text-gray-400">Please check your internet connection</p>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    ref={mapRef}
                                    className="w-full h-96 lg:h-[600px]"
                                    style={{ minHeight: '700px' }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <Info className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="text-blue-900 font-medium mb-1">Map Features</h4>
                            <ul className="text-blue-700 text-sm space-y-1">
                                <li>• Click on court markers to view detailed information and nearest lawyers</li>
                                <li>• Click on DSD boundaries to view administrative division details</li>
                                <li>• Toggle DSD boundaries and labels using the sidebar controls</li>
                                <li>• Filter court types using the checkboxes</li>
                                <li>• Hover over boundaries for visual feedback</li>
                                <li>• Zoom and pan to explore different regions of Sri Lanka</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourtsLanka