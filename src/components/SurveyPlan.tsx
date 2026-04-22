import React, { useState } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';

interface SurveyPlanProps {
  land: {
    id: string;
    ownerName: string;
    landCode: string;
    coordinates?: number[][];
    latlngCoordinates?: number[][];
    bearings?: { distance: number; bearing: number }[];
    startPoint?: [number, number];
    utmZone?: string;
    areaSqm: number;
    centerLat: number;
    centerLng: number;
    surveyType?: string;
    address?: string;
    surveyPlanNumber?: string;
    surveyDate?: string;
    surveyorName?: string;
    surveyorLicense?: string;
    accuracyLevel?: string;
  };
  onClose: () => void;
}

const SurveyPlan: React.FC<SurveyPlanProps> = ({ land, onClose }) => {
  const [zoom, setZoom] = useState(1);

  const clampZoom = (value: number) => Math.max(0.8, Math.min(value, 3));

  // Get coordinates based on survey type
  const getCoordinates = (): number[][] => {
    if (land.surveyType === "BEARING") {
      return land.latlngCoordinates || [];
    }
    return land.coordinates || [];
  };

  const coordinates = getCoordinates();

  const normalizeCoordinates = (coords: number[][]) => {
    if (!coords?.length) return [];
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      return [...coords, first];
    }
    return coords;
  };

  const transformCoordinates = (coords: number[][], width = 520, height = 340, margin = 70) => {
    const normalized = normalizeCoordinates(coords);
    if (!normalized.length) return [];

    const lats = normalized.map(([lat]) => lat);
    const lngs = normalized.map(([, lng]) => lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = Math.max(maxLat - minLat, 0.0001);
    const lngRange = Math.max(maxLng - minLng, 0.0001);
    const scaleX = (width - margin * 2) / lngRange;
    const scaleY = (height - margin * 2) / latRange;
    const scale = Math.min(scaleX, scaleY);

    return normalized.map(([lat, lng]) => ({
      x: margin + (lng - minLng) * scale,
      y: margin + (maxLat - lat) * scale,
    }));
  };

  const svgPoints = transformCoordinates(coordinates);
  const pathData = svgPoints.length > 0 ? `M ${svgPoints.map((p) => `${p.x},${p.y}`).join(' L ')} Z` : '';

  // Calculate bearings if not provided (for coordinate surveys)
  const getBearings = () => {
    if (land.surveyType === "BEARING" && land.bearings) {
      return land.bearings;
    }
    // Calculate bearings from coordinates
    if (coordinates.length < 2) return [];
    const bearings = [];
    for (let i = 0; i < coordinates.length - 1; i++) {
      const [lat1, lng1] = coordinates[i];
      const [lat2, lng2] = coordinates[i + 1];
      
      const R = 6378137;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      
      const y = Math.sin(dLng) * Math.cos((lat2 * Math.PI) / 180);
      const x = Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
                Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLng);
      const bearing = (Math.atan2(y, x) * 180) / Math.PI;
      const normalizedBearing = (bearing + 360) % 360;
      
      bearings.push({ distance, bearing: normalizedBearing });
    }
    return bearings;
  };

  const bearings = getBearings();

  const downloadPlan = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 820;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NIGERIA SURVEY PLAN', canvas.width / 2, 60);

    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Land Code: ${land.landCode}`, 50, 110);
    ctx.fillText(`Owner: ${land.ownerName}`, 50, 135);
    ctx.fillText(`Area: ${land.areaSqm.toFixed(2)} sqm`, 50, 160);
    if (land.address) ctx.fillText(`Address: ${land.address}`, 50, 185);
    if (land.surveyPlanNumber) ctx.fillText(`Survey Plan #: ${land.surveyPlanNumber}`, 50, 210);
    ctx.fillText(`Survey Type: ${land.surveyType || 'COORDINATE'}`, 50, 235);
    if (land.utmZone) ctx.fillText(`UTM Zone: ${land.utmZone}`, 50, 260);
    if (land.surveyDate) ctx.fillText(`Survey Date: ${new Date(land.surveyDate).toLocaleDateString()}`, 50, 285);
    if (land.surveyorName) ctx.fillText(`Surveyor: ${land.surveyorName}`, 50, 310);
    if (land.surveyorLicense) ctx.fillText(`License: ${land.surveyorLicense}`, 50, 335);
    if (land.accuracyLevel) ctx.fillText(`Accuracy: ${land.accuracyLevel}`, 50, 360);

    const offsetX = 60;
    const offsetY = 340;
    const drawWidth = 880;
    const drawHeight = 420;

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(offsetX, offsetY, drawWidth, drawHeight);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(offsetX, offsetY, drawWidth, drawHeight);

    if (svgPoints.length > 0) {
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(offsetX + svgPoints[0].x * 1.5, offsetY + svgPoints[0].y * 1.3);
      svgPoints.slice(1).forEach((point) => {
        ctx.lineTo(offsetX + point.x * 1.5, offsetY + point.y * 1.3);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = 'rgba(37, 99, 235, 0.12)';
      ctx.fill();

      // Draw traverse lines with arrows for bearing surveys
      if (land.surveyType === "BEARING" && svgPoints.length > 1) {
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 4;
        svgPoints.slice(0, -1).forEach((point, index) => {
          const nextPoint = svgPoints[index + 1];
          const x1 = offsetX + point.x * 1.5;
          const y1 = offsetY + point.y * 1.3;
          const x2 = offsetX + nextPoint.x * 1.5;
          const y2 = offsetY + nextPoint.y * 1.3;
          
          // Draw line
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          
          // Draw arrowhead
          const angle = Math.atan2(y2 - y1, x2 - x1);
          const arrowLength = 15;
          const arrowAngle = Math.PI / 6; // 30 degrees
          
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(x2 - arrowLength * Math.cos(angle - arrowAngle), y2 - arrowLength * Math.sin(angle - arrowAngle));
          ctx.moveTo(x2, y2);
          ctx.lineTo(x2 - arrowLength * Math.cos(angle + arrowAngle), y2 - arrowLength * Math.sin(angle + arrowAngle));
          ctx.stroke();
        });
      }

      svgPoints.forEach((point, index) => {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(offsetX + point.x * 1.5, offsetY + point.y * 1.3, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = '12px Arial';
        ctx.fillText(`${index + 1}`, offsetX + point.x * 1.5 + 12, offsetY + point.y * 1.3 + 5);
      });

      // Add distance and bearing labels on lines
      bearings.forEach((b, i) => {
        if (!svgPoints[i + 1]) return;
        const p1 = svgPoints[i];
        const p2 = svgPoints[i + 1];
        const midX = offsetX + ((p1.x + p2.x) / 2) * 1.5;
        const midY = offsetY + ((p1.y + p2.y) / 2) * 1.3;
        
        ctx.fillStyle = '#0f172a';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${b.distance.toFixed(1)}m / ${b.bearing.toFixed(1)}°`, midX, midY);
      });
    }

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 790);
    ctx.lineTo(180, 790);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = '12px Arial';
    ctx.fillText('Scale 1:1000', 80, 815);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `survey-plan-${land.landCode}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold">Nigeria Survey Plan</h2>
          <p className="text-slate-200 text-sm mt-1">Land Code: {land.landCode} · Owner: {land.ownerName}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadPlan}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
          >
            <FaDownload />
            Download
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-12 h-12 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-2">Parcel Information</h3>
            <p className="text-sm"><span className="font-semibold">Owner:</span> {land.ownerName}</p>
            <p className="text-sm"><span className="font-semibold">Address:</span> {land.address || 'N/A'}</p>
            <p className="text-sm"><span className="font-semibold">Area:</span> {land.areaSqm.toFixed(2)} sqm</p>
            <p className="text-sm"><span className="font-semibold">Center Lat:</span> {land.centerLat.toFixed(6)}</p>
            <p className="text-sm"><span className="font-semibold">Center Lng:</span> {land.centerLng.toFixed(6)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-2">Survey Details</h3>
            <p className="text-sm"><span className="font-semibold">Plan #:</span> {land.surveyPlanNumber || 'N/A'}</p>
            <p className="text-sm"><span className="font-semibold">Type:</span> {land.surveyType || 'COORDINATE'}</p>
            <p className="text-sm"><span className="font-semibold">UTM Zone:</span> {land.utmZone || 'N/A'}</p>
            <p className="text-sm"><span className="font-semibold">Date:</span> {land.surveyDate ? new Date(land.surveyDate).toLocaleDateString() : 'N/A'}</p>
            <p className="text-sm"><span className="font-semibold">Surveyor:</span> {land.surveyorName || 'N/A'}</p>
            <p className="text-sm"><span className="font-semibold">License:</span> {land.surveyorLicense || 'N/A'}</p>
            <p className="text-sm"><span className="font-semibold">Accuracy:</span> {land.accuracyLevel || 'N/A'}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-2">Survey Plan Notes</h3>
            <p className="text-sm leading-6 text-slate-700">This survey plan format mirrors Nigerian conventions: title block, boundary diagram with survey points, scale, north arrow, legend, and surveyor details. The diagram is a plan view of the parcel boundary.</p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl bg-white p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Survey Plan Drawing</h3>
              <p className="text-sm text-slate-500">Zoom and inspect the boundary plot below.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setZoom((prev) => clampZoom(prev - 0.25))} className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200">-</button>
              <button type="button" onClick={() => setZoom((prev) => clampZoom(prev + 0.25))} className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200">+</button>
              <button type="button" onClick={() => setZoom(1)} className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200">Reset</button>
            </div>
          </div>

          <div className="overflow-auto border border-slate-200 rounded-xl bg-slate-50 p-3">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }} className="inline-block">
              <svg width="720" height="520" viewBox="0 0 720 520" className="border border-slate-300 bg-white">
                <rect width="100%" height="100%" fill="#f8fafc" />
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                  </pattern>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                          refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
                  </marker>
                </defs>
                <rect x="40" y="40" width="640" height="420" fill="url(#grid)" stroke="#cbd5e1" strokeWidth="1" />

                {pathData && (
                  <>
                    <path d={pathData} fill="rgba(37, 99, 235, 0.16)" stroke="#2563eb" strokeWidth="3" transform="translate(70, 70)" />
                    {land.surveyType === "BEARING" && svgPoints.length > 1 && (
                      <>
                        {svgPoints.slice(0, -1).map((point, index) => (
                          <line
                            key={`line-${index}`}
                            x1={point.x + 70}
                            y1={point.y + 70}
                            x2={svgPoints[index + 1].x + 70}
                            y2={svgPoints[index + 1].y + 70}
                            stroke="#2563eb"
                            strokeWidth="3"
                            markerEnd="url(#arrowhead)"
                          />
                        ))}
                      </>
                    )}
                    {svgPoints.map((point, index) => (
                      <g key={index}>
                        <circle cx={point.x + 70} cy={point.y + 70} r="5" fill="#dc2626" />
                        <text x={point.x + 84} y={point.y + 86} fontSize="12" fill="#0f172a" fontWeight="bold">{index + 1}</text>
                      </g>
                    ))}
                    {/* Distance and Bearing Labels */}
                    {bearings.map((b, i) => {
                      if (!svgPoints[i + 1]) return null;
                      const p1 = svgPoints[i];
                      const p2 = svgPoints[i + 1];
                      return (
                        <text
                          key={i}
                          x={(p1.x + p2.x) / 2 + 70}
                          y={(p1.y + p2.y) / 2 + 70}
                          fontSize="10"
                          fill="black"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {b.distance.toFixed(1)}m / {b.bearing.toFixed(1)}°
                        </text>
                      );
                    })}
                  </>
                )}

                <g transform="translate(560, 60)">
                  <rect x="0" y="0" width="100" height="100" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
                  <line x1="50" y1="20" x2="50" y2="80" stroke="#0f172a" strokeWidth="2" />
                  <line x1="50" y1="20" x2="42" y2="35" stroke="#0f172a" strokeWidth="2" />
                  <line x1="50" y1="20" x2="58" y2="35" stroke="#0f172a" strokeWidth="2" />
                  <polygon points="50,10 45,25 55,25" fill="#0f172a" />
                  <text x="50" y="95" fontSize="10" fill="#0f172a" textAnchor="middle">NORTH</text>
                </g>

                <g transform="translate(520, 240)">
                  <rect x="0" y="0" width="180" height="90" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
                  <text x="10" y="18" fontSize="12" fontWeight="bold" fill="#0f172a">Legend</text>
                  <circle cx="15" cy="38" r="4" fill="#dc2626" />
                  <text x="30" y="42" fontSize="10" fill="#0f172a">Survey points</text>
                  <line x1="10" y1="58" x2="30" y2="58" stroke="#2563eb" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <text x="35" y="62" fontSize="10" fill="#0f172a">Traverse lines</text>
                </g>

                <line x1="90" y1="470" x2="190" y2="470" stroke="#0f172a" strokeWidth="2" />
                <line x1="90" y1="465" x2="90" y2="475" stroke="#0f172a" strokeWidth="2" />
                <line x1="190" y1="465" x2="190" y2="475" stroke="#0f172a" strokeWidth="2" />
                <text x="90" y="492" fontSize="12" fill="#0f172a">Scale 1:1000</text>
              </svg>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-lg text-slate-900 mb-3">
              {land.surveyType === "BEARING" ? "Bearing Survey Data" : "Coordinate Survey Data"}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 border border-slate-300 text-left text-xs uppercase tracking-wide">Point</th>
                    {land.surveyType === "BEARING" ? (
                      <>
                        <th className="px-4 py-3 border border-slate-300 text-left text-xs uppercase tracking-wide">Distance (m)</th>
                        <th className="px-4 py-3 border border-slate-300 text-left text-xs uppercase tracking-wide">Bearing (°)</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 border border-slate-300 text-left text-xs uppercase tracking-wide">Latitude</th>
                        <th className="px-4 py-3 border border-slate-300 text-left text-xs uppercase tracking-wide">Longitude</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {land.surveyType === "BEARING" && land.bearings ? (
                    land.bearings.map((bearing, index) => (
                      <tr key={index} className="odd:bg-white even:bg-slate-50">
                        <td className="px-4 py-3 border border-slate-300 font-semibold">{index + 1}</td>
                        <td className="px-4 py-3 border border-slate-300 font-mono">{bearing.distance.toFixed(2)}</td>
                        <td className="px-4 py-3 border border-slate-300 font-mono">{bearing.bearing.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    coordinates.map((coord, index) => (
                      <tr key={index} className="odd:bg-white even:bg-slate-50">
                        <td className="px-4 py-3 border border-slate-300 font-semibold">{index + 1}</td>
                        <td className="px-4 py-3 border border-slate-300 font-mono">{coord[0].toFixed(6)}</td>
                        <td className="px-4 py-3 border border-slate-300 font-mono">{coord[1].toFixed(6)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {land.surveyType === "BEARING" && land.startPoint && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Starting Point:</strong> Lat: {land.startPoint[0].toFixed(6)}, Lng: {land.startPoint[1].toFixed(6)}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-lg text-slate-900 mb-3">Survey Plan Description</h3>
            <p className="text-sm leading-6 text-slate-700">
              This survey plan format follows standard Nigerian conventions: a title block, boundary diagram with survey points{land.surveyType === "BEARING" ? " and traverse lines" : ""}, scale, north arrow, legend, and surveyor details. The diagram is a plan view of the parcel boundary.
            </p>
            <p className="text-sm leading-6 text-slate-700 mt-2">
              <strong>Survey Method:</strong> {land.surveyType === "BEARING" 
                ? "Bearing survey using distances and compass bearings from a starting point." 
                : "Coordinate survey using GPS latitude/longitude coordinates."}
            </p>
            {land.surveyType === "BEARING" && (
              <p className="text-sm leading-6 text-slate-700 mt-2">
                <strong>Bearing Convention:</strong> Bearings are measured clockwise from north (0° = North, 90° = East, 180° = South, 270° = West).
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPlan;
