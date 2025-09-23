import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card } from '@/components/ui/Card';

//mock data with coordinates for the hackathon
const ngos = [
    { id: 1, name: 'Hope Autism Foundation', location: 'Chandigarh', position: [30.7333, 76.7794], description: 'Early intervention programs.' },
    { id: 4, name: 'Awaaz Foundation', location: 'Chandigarh', position: [30.7415, 76.7681], description: 'Community-based support.' },
    { id: 8, name: 'Manav Seva Kendra', location: 'Panchkula', position: [30.6942, 76.8606], description: 'Inclusive learning and care.' },
];

const NgoMapView = () => {
    //Default center to Chandigarh
    const mapCenter = [30.7333, 76.7794];

    return (
        <Card className="overflow-hidden">
            <div style={{ height: '600px', width: '100%' }}>
                <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {ngos.map(ngo => (
                        <Marker key={ngo.id} position={ngo.position}>
                            <Popup>
                                <div className="font-sans">
                                    <h4 className="font-bold">{ngo.name}</h4>
                                    <p>{ngo.description}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </Card>
    );
};

export default NgoMapView;