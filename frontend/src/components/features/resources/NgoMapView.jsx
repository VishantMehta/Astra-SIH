import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card } from '@/components/ui/Card';
import apiClient from '@/lib/api';

const NgoMapView = () => {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const mapCenter = [30.7333, 76.7794]; // Default center

    useEffect(() => {
        const fetchNgos = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/resources/ngos');
                setNgos(response.data);
            } catch (error) {
                console.error("Failed to fetch NGOs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNgos();
    }, []);

    return (
        <Card className="overflow-hidden">
            <div style={{ height: '600px', width: '100%' }}>
                {loading ? (
                    <div className="h-full w-full flex items-center justify-center">Loading map data...</div>
                ) : (
                    <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {ngos.map(ngo => (
                            <Marker key={ngo.id} position={[ngo.position.lat, ngo.position.lng]}>
                                <Popup>
                                    <div className="font-sans">
                                        <h4 className="font-bold">{ngo.name}</h4>
                                        <p>{ngo.description}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
        </Card>
    );
};

export default NgoMapView;