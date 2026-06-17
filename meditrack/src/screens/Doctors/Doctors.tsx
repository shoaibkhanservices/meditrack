import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowLeft, Navigation, AlertCircle, RefreshCw } from 'lucide-react';
import { getDoctorsApi } from '../../services/api';
import type { ClinicInfo } from '../../services/api';
import './Doctors.css';

export default function Doctors() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetSpecialty = searchParams.get('specialty') || '';

  // Location and clinic states
  const [userLat, setUserLat] = useState<number>(34.0522); // Default LA coords
  const [userLng, setUserLng] = useState<number>(-118.2437);
  const [coordsManualInput, setCoordsManualInput] = useState('');
  const [clinics, setClinics] = useState<ClinicInfo[]>([]);
  
  // UI status states
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // 1. Dynamic script loader for Leaflet Map CDN
  useEffect(() => {
    // Add Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.id = 'leaflet-css';
    document.head.appendChild(link);

    // Add Leaflet JS script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.id = 'leaflet-js';
    script.onload = () => {
      setLeafletReady(true);
    };
    document.body.appendChild(script);

    return () => {
      document.getElementById('leaflet-css')?.remove();
      document.getElementById('leaflet-js')?.remove();
    };
  }, []);

  // 2. Request user location and fetch clinics
  useEffect(() => {
    setLoading(true);
    setLocationError(null);

    const fallbackToIpLocation = async () => {
      try {
        console.log('[Doctors] Attempting IP Geolocation fallback...');
        const ipRes = await fetch('https://ipapi.co/json/');
        if (!ipRes.ok) throw new Error('IP service down');
        const ipData = await ipRes.json();
        if (ipData.latitude && ipData.longitude) {
          const lat = parseFloat(ipData.latitude);
          const lng = parseFloat(ipData.longitude);
          setUserLat(lat);
          setUserLng(lng);
          fetchClinics(lat, lng);
          setLocationError(`GPS denied/timed out. Detected location via IP: ${ipData.city || 'local area'}`);
          return;
        }
      } catch (err) {
        console.warn('IP Geolocation failed:', err);
      }
      // Ultimate fallback to default LA
      setLocationError('Location access denied. Using default coordinates (Los Angeles). Enter location query below to update.');
      fetchClinics(34.0522, -118.2437);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLat(lat);
          setUserLng(lng);
          fetchClinics(lat, lng);
        },
        (error) => {
          console.warn('Geolocation permission denied or timed out:', error);
          fallbackToIpLocation();
        },
        { timeout: 6000, enableHighAccuracy: true }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
      fallbackToIpLocation();
    }
  }, [targetSpecialty]);

  const fetchClinics = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const data = await getDoctorsApi(lat, lng, targetSpecialty);
      setClinics(data);
      if (data.length > 0) {
        setSelectedClinicId(data[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load clinic list:', err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Initialize/update interactive Leaflet Map
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const container = mapContainerRef.current;
    
    // Check if map is already bound to clean up previous map instances
    if ((container as any)._leaflet_id) {
      const mapInstance = (container as any)._mapInstance;
      if (mapInstance) {
        mapInstance.remove();
      }
    }

    // Set map focus
    const map = L.map(container).setView([userLat, userLng], 13);
    (container as any)._mapInstance = map;

    // Load OSM vector layer tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add User location blue dot
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `<div class="user-marker-pulse"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    L.marker([userLat, userLng], { icon: userIcon }).addTo(map).bindPopup('You are here');

    // Add Clinic pins
    clinics.forEach((clinic) => {
      const isSelected = clinic.id === selectedClinicId;
      
      const pinIcon = L.divIcon({
        className: `clinic-location-pin ${isSelected ? 'active' : ''}`,
        html: `<div class="pin-inner"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([clinic.lat, clinic.lng], { icon: pinIcon }).addTo(map);
      marker.bindPopup(`
        <div class="map-popup-card">
          <h4>${clinic.name}</h4>
          <p class="map-popup-spec">${clinic.specialty}</p>
          <p class="map-popup-dist">${clinic.distanceKm} km away</p>
        </div>
      `);

      if (isSelected) {
        marker.openPopup();
        map.panTo([clinic.lat, clinic.lng]);
      }
    });

  }, [leafletReady, clinics, selectedClinicId, userLat, userLng]);

  const handleClinicSelect = (clinic: ClinicInfo) => {
    setSelectedClinicId(clinic.id);
    
    // If map instance is stored, pan to clinic coordinates
    if (leafletReady && mapContainerRef.current) {
      const map = (mapContainerRef.current as any)._mapInstance;
      if (map) {
        map.setView([clinic.lat, clinic.lng], 14, { animate: true });
      }
    }
  };

  const handleCoordsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordsManualInput) return;

    // Parse manual inputs: "lat, lng"
    const parts = coordsManualInput.split(',');
    if (parts.length === 2) {
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());
      if (!isNaN(lat) && !isNaN(lng)) {
        setUserLat(lat);
        setUserLng(lng);
        setLocationError(null);
        fetchClinics(lat, lng);
        return;
      }
    }
    
    // Simple lookup simulation for cities
    alert('Please enter coordinates in "latitude, longitude" format (e.g. 34.052, -118.243).');
  };

  return (
    <div className="doctors-screen">
      {/* Top Header */}
      <header className="doctors-header">
        <button type="button" className="doctors-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="doctors-header-title">
          <h2>Find Care Nearby</h2>
          <p>Triage specialty: {targetSpecialty || 'General Practitioner'}</p>
        </div>
        <div style={{ width: 40 }} /> {/* balance layout flex */}
      </header>

      <div className="doctors-body">
        {/* Sidebar Clinic list */}
        <aside className="doctors-sidebar">
          {locationError && (
            <div className="doctors-alert">
              <AlertCircle size={18} className="doctors-alert-icon" />
              <span>{locationError}</span>
            </div>
          )}

          {/* Coordinate manual search query */}
          <form className="doctors-coord-form" onSubmit={handleCoordsSubmit}>
            <input
              type="text"
              placeholder="Change location (lat, lng)..."
              value={coordsManualInput}
              onChange={(e) => setCoordsManualInput(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          {loading ? (
            <div className="doctors-loading">
              <RefreshCw size={24} className="doctors-loading-spinner" />
              <p>Locating matching healthcare centers...</p>
            </div>
          ) : clinics.length === 0 ? (
            <div className="doctors-empty">
              <AlertCircle size={32} />
              <p>No clinics or specialist centers found nearby within 5 km.</p>
            </div>
          ) : (
            <div className="doctors-list">
              <div className="doctors-list-meta">
                Showing {clinics.length} closest locations
              </div>
              {clinics.map((clinic) => {
                const isSelected = clinic.id === selectedClinicId;
                return (
                  <div
                    key={clinic.id}
                    className={`clinic-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleClinicSelect(clinic)}
                  >
                    <div className="clinic-card-header">
                      <h4>{clinic.name}</h4>
                      <span className="clinic-distance">{clinic.distanceKm} km</span>
                    </div>
                    <p className="clinic-specialty">{clinic.specialty}</p>
                    
                    <div className="clinic-details">
                      <div className="clinic-detail-item">
                        <MapPin size={14} />
                        <span>{clinic.address}</span>
                      </div>
                      
                      <div className="clinic-detail-item">
                        <Clock size={14} />
                        <span>{clinic.hours}</span>
                      </div>

                      {clinic.phone && (
                        <div className="clinic-detail-item">
                          <Phone size={14} />
                          <a href={`tel:${clinic.phone}`} onClick={(e) => e.stopPropagation()}>
                            {clinic.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <div className="clinic-card-actions">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="clinic-action-btn directions-btn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Navigation size={14} />
                          <span>Get Directions</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* Map visual section */}
        <section className="doctors-map-container">
          <div ref={mapContainerRef} className="doctors-map" id="doctors-map" />
        </section>
      </div>
    </div>
  );
}
