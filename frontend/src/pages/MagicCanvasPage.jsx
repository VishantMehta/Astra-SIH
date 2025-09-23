import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Label } from "@/components/ui/Label";
import { Trash2 } from "lucide-react";

const SMOOTHING_ALPHA = 0.35;
const PARTICLE_LIFETIME = 600;
const PARTICLE_FREQ = 2;
const DRAW_GESTURE_HYSTERESIS_MS = 80;

function isIndexOnly(landmarks) {
    if (!landmarks || landmarks.length < 21) return false;
    const tips = [8, 12, 16, 20];
    const pips = [6, 10, 14, 18];
    const states = tips.map((t, i) => landmarks[t].y < landmarks[pips[i]].y);
    return states[0] && !states[1] && !states[2] && !states[3];
}

const TraceShapes = {
    star: { points: [{ x: 0.5, y: 0.12 }, { x: 0.62, y: 0.42 }, { x: 0.95, y: 0.42 }, { x: 0.69, y: 0.62 }, { x: 0.8, y: 0.92 }, { x: 0.5, y: 0.75 }, { x: 0.2, y: 0.92 }, { x: 0.31, y: 0.62 }, { x: 0.05, y: 0.42 }, { x: 0.38, y: 0.42 }] }
};
const ConnectDotsTemplates = {
    easy: [{ x: 0.25, y: 0.3 }, { x: 0.5, y: 0.6 }, { x: 0.75, y: 0.3 }]
};


const MagicCanvasPage = () => {
    const webcamRef = useRef(null);
    const overlayRef = useRef(null);
    const drawingRef = useRef(null);
    const [handLandmarker, setHandLandmarker] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [loadingModel, setLoadingModel] = useState(true);
    const [drawingColor, setDrawingColor] = useState("#3b82f6");
    const [brushSize, setBrushSize] = useState(10);
    const [mode, setMode] = useState("free");
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const smoothed = useRef({ x: null, y: null });
    const prevPoint = useRef({ x: null, y: null });
    const particles = useRef([]);
    const lastDrawToggleAt = useRef(0);
    const isDrawingRef = useRef(false);
    const audioCtxRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const fileset = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
                const landmarker = await HandLandmarker.createFromOptions(fileset, {
                    baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task", delegate: "GPU" },
                    runningMode: "VIDEO", numHands: 1
                });
                if (!cancelled) { setHandLandmarker(landmarker); }
            } catch (err) { console.error("Failed to load HandLandmarker:", err); }
            finally { if (!cancelled) setLoadingModel(false); }
        };
        load();
        return () => { cancelled = true; };
    }, []);
    const ensureAudio = () => { if (!audioCtxRef.current) { try { const C = window.AudioContext || window.webkitAudioContext; audioCtxRef.current = new C(); } catch (e) { console.warn("AudioContext not available", e); } } };
    const enableCam = useCallback(() => { if (handLandmarker) { setIsCameraReady(true); ensureAudio(); } else { console.warn("Model not ready"); } }, [handLandmarker]);
    const playSparkle = () => { const ctx = audioCtxRef.current; if (!ctx) return; const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = "sine"; o.frequency.setValueAtTime(880 + Math.random() * 200, ctx.currentTime); g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.2); };
    const smoothPoint = (x, y) => { if (smoothed.current.x === null) { smoothed.current = { x, y }; } else { smoothed.current.x = SMOOTHING_ALPHA * x + (1 - SMOOTHING_ALPHA) * smoothed.current.x; smoothed.current.y = SMOOTHING_ALPHA * y + (1 - SMOOTHING_ALPHA) * smoothed.current.y; } return smoothed.current; };
    const spawnParticles = (x, y, color, amount = 2) => { const now = performance.now(); for (let i = 0; i < amount; i++) { particles.current.push({ x: x + (Math.random() - 0.5) * 12, y: y + (Math.random() - 0.5) * 12, created: now, life: PARTICLE_LIFETIME, size: Math.random() * 6 + 2, color }); } };
    const drawStrokeTo = (x, y, color, size) => { const ctx = drawingRef.current?.getContext("2d"); if (!ctx) return; ctx.strokeStyle = color; ctx.lineWidth = size; ctx.lineCap = "round"; ctx.lineJoin = "round"; const px = prevPoint.current.x; if (px === null) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y); ctx.stroke(); } else { const dx = x - px; const dy = y - prevPoint.current.y; const dist = Math.hypot(dx, dy); const steps = Math.max(1, Math.min(8, Math.floor(dist / (size * 0.5)))); for (let i = 1; i <= steps; i++) { const ix = px + (dx * i) / steps; const iy = prevPoint.current.y + (dy * i) / steps; ctx.beginPath(); ctx.moveTo(prevPoint.current.x, prevPoint.current.y); ctx.lineTo(ix, iy); ctx.stroke(); prevPoint.current = { x: ix, y: iy }; } } };
    const resetCanvas = () => { if (drawingRef.current) { const ctx = drawingRef.current.getContext("2d"); ctx.clearRect(0, 0, drawingRef.current.width, drawingRef.current.height); } particles.current = []; smoothed.current = { x: null, y: null }; prevPoint.current = { x: null, y: null }; setScore(0); setCompleted(false); };
    const drawModeGuides = () => { const overlay = overlayRef.current; if (!overlay) return; const ctx = overlay.getContext("2d"); ctx.save(); ctx.clearRect(0, 0, overlay.width, overlay.height); const w = overlay.width; const h = overlay.height; if (mode === "trace") { const shape = TraceShapes.star; ctx.globalAlpha = 0.9; ctx.lineWidth = 4; ctx.strokeStyle = "#ffffff22"; ctx.beginPath(); shape.points.forEach((p, i) => { const px = p.x * w; const py = p.y * h; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }); ctx.closePath(); ctx.stroke(); for (const p of shape.points) { ctx.beginPath(); ctx.fillStyle = "#ffffff44"; ctx.arc(p.x * w, p.y * h, 8, 0, Math.PI * 2); ctx.fill(); } } else if (mode === "connect") { const dots = ConnectDotsTemplates.easy; ctx.globalAlpha = 0.95; dots.forEach((d, i) => { ctx.beginPath(); ctx.fillStyle = "#ffffff33"; ctx.arc(d.x * w, d.y * h, 14, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = "16px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(i + 1), d.x * w, d.y * h); }); } ctx.restore(); };
    useEffect(() => { let rafId; const loop = async () => { try { if (!webcamRef.current?.video || !overlayRef.current || !drawingRef.current) { rafId = requestAnimationFrame(loop); return; } const video = webcamRef.current.video; if (overlayRef.current.width !== video.videoWidth || overlayRef.current.height !== video.videoHeight) { overlayRef.current.width = video.videoWidth || 640; overlayRef.current.height = video.videoHeight || 480; drawingRef.current.width = overlayRef.current.width; drawingRef.current.height = overlayRef.current.height; } const overlayCtx = overlayRef.current.getContext("2d"); const now = performance.now(); overlayCtx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height); drawModeGuides(); if (!handLandmarker) { rafId = requestAnimationFrame(loop); return; } let detections; try { detections = await handLandmarker.detectForVideo(video, performance.now()); } catch (err) { console.warn("detectForVideo failed:", err); } const landmarks = detections?.landmarks?.[0]; const gestureActive = isIndexOnly(landmarks); if (gestureActive) { lastDrawToggleAt.current = now; } const shouldDraw = gestureActive; if (landmarks && shouldDraw) { const tip = landmarks[8]; const x = (1 - tip.x) * overlayRef.current.width; const y = tip.y * overlayRef.current.height; const s = smoothPoint(x, y); if (!isDrawingRef.current) { isDrawingRef.current = true; playSparkle(); } drawStrokeTo(s.x, s.y, drawingColor, brushSize); spawnParticles(s.x, s.y, drawingColor, PARTICLE_FREQ); if (mode === "trace") { const shape = TraceShapes.star.points; for (let i = 0; i < shape.length; i++) { const p = shape[i]; const px = p.x * overlayRef.current.width; const py = p.y * overlayRef.current.height; const d = Math.hypot(s.x - px, s.y - py); if (d < Math.max(20, brushSize * 1.6)) { setScore((prev) => Math.min(prev + 1, 9999)); } } } else if (mode === "connect") { const dots = ConnectDotsTemplates.easy; for (let i = 0; i < dots.length; i++) { const d = dots[i]; const px = d.x * overlayRef.current.width; const py = d.y * overlayRef.current.height; const dist = Math.hypot(s.x - px, s.y - py); if (dist < 28) { setScore((prev) => Math.min(prev + 1, 9999)); } } } } else { if (isDrawingRef.current) { isDrawingRef.current = false; prevPoint.current = { x: null, y: null }; if (smoothed.current.x !== null) spawnParticles(smoothed.current.x, smoothed.current.y, drawingColor, 8); } } const now2 = performance.now(); const out = []; const ctx = overlayCtx; for (const p of particles.current) { const age = now2 - p.created; if (age > p.life) continue; const t = 1 - age / p.life; ctx.beginPath(); ctx.globalAlpha = Math.max(0.02, t); ctx.fillStyle = p.color; ctx.arc(p.x, p.y, p.size * (0.9 + (1 - t)), 0, Math.PI * 2); ctx.fill(); out.push(p); } particles.current = out; ctx.globalAlpha = 1; if (mode === "trace" && score > 150 && !completed) { setCompleted(true); } if (mode === "connect" && score > 80 && !completed) { setCompleted(true); } } catch (err) { console.error("Loop error:", err); } rafId = requestAnimationFrame(loop); }; if (isCameraReady && handLandmarker) { rafId = requestAnimationFrame(loop); } return () => cancelAnimationFrame(rafId); }, [isCameraReady, handLandmarker, drawingColor, brushSize, mode, score, completed]);
    const handleClear = () => { resetCanvas(); };
    const onUserMedia = () => { const v = webcamRef.current?.video; if (!v) return; const w = v.videoWidth || 640; const h = v.videoHeight || 480; if (overlayRef.current && drawingRef.current) { overlayRef.current.width = w; overlayRef.current.height = h; drawingRef.current.width = w; drawingRef.current.height = h; } };

    return (
        <div className="container py-12 flex flex-col items-center">
            <Card className="w-full max-w-5xl">
                <CardHeader>
                    <CardTitle>Magic Canvas</CardTitle>
                    <CardDescription>Use your index finger in the air as a magic paintbrush. Switch modes below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full aspect-video bg-secondary rounded-lg overflow-hidden">
                        <Webcam ref={webcamRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" mirrored audio={false} videoConstraints={{ facingMode: "user", width: 1280, height: 720 }} onUserMedia={onUserMedia} />
                        <canvas ref={drawingRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none" />
                        <canvas ref={overlayRef} className="absolute inset-0 w-full h-full z-20 pointer-events-none" />
                        {!isCameraReady && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/90 p-4 text-center">
                                {loadingModel ? (<p>Loading AI Model...</p>) : (
                                    <>
                                        <Button size="lg" onClick={enableCam}>Activate Magic Canvas</Button>
                                        <p className="text-xs text-muted-foreground mt-2">Allow camera access and place your hand in view.</p>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        {/* Mode Select */}
                        <div className="flex items-center gap-2">
                            <Label htmlFor="mode-select" className="flex-shrink-0">Mode:</Label>
                            <Select value={mode} onValueChange={(value) => { resetCanvas(); setMode(value); }}>
                                <SelectTrigger id="mode-select">
                                    <SelectValue placeholder="Select a mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="free">Free Draw</SelectItem>
                                    <SelectItem value="trace">Trace Shape</SelectItem>
                                    <SelectItem value="connect">Connect Dots</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Color Picker */}
                        <div className="flex items-center justify-center gap-2">
                            <Label>Color:</Label>
                            {['#3b82f6', '#22c55e', '#f97316', '#ec4899', '#f5f5f5'].map(c => (
                                <button key={c} onClick={() => setDrawingColor(c)} className={`w-7 h-7 rounded-full border-2 transition-all ${drawingColor === c ? 'ring-2 ring-offset-2 ring-primary' : 'border-background'}`} style={{ backgroundColor: c }} />
                            ))}
                        </div>
                        {/* Brush Slider */}
                        <div className="flex items-center gap-2">
                            <Label htmlFor="brush-size" className="flex-shrink-0">Brush:</Label>
                            <Slider id="brush-size" value={[brushSize]} onValueChange={([val]) => setBrushSize(val)} min={4} max={40} step={1} />
                            <span className="text-sm font-medium w-8 text-center">{brushSize}</span>
                        </div>
                    </div>
                    <div className="w-full flex justify-between items-center border-t pt-4 mt-2">
                        <div className="text-sm font-medium">Score: <strong className="text-primary">{score}</strong></div>
                        <div className="text-sm font-medium">{completed ? <span className="text-green-500">Completed!</span> : <span>Keep drawing...</span>}</div>
                        <Button variant="outline" size="sm" onClick={handleClear}>
                            <Trash2 className="mr-2 h-4 w-4" /> Clear Canvas
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default MagicCanvasPage;