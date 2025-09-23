import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Card from "../components/Card";

/* ---------------------------
   Helper small components
   --------------------------- */
const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);

/* ---------------------------
   Config
   --------------------------- */
const SMOOTHING_ALPHA = 0.35; // EMA alpha for smoothing (0..1) lower = smoother
const PARTICLE_LIFETIME = 600; // ms
const PARTICLE_FREQ = 2; // particles per frame approx
const DRAW_GESTURE_HYSTERESIS_MS = 80; // prevent micro toggles

/* ---------------------------
   Utility: Gesture detection
   - index finger up and other fingers down
   - uses landmarks by y coordinate (smaller y is up)
   --------------------------- */
function isIndexOnly(landmarks) {
    if (!landmarks || landmarks.length < 21) return false;
    // finger tip indices & pip indices for vertical check
    const tips = [8, 12, 16, 20];
    const pips = [6, 10, 14, 18];

    const states = tips.map((t, i) => landmarks[t].y < landmarks[pips[i]].y); // true => extended
    // index extended, others NOT extended
    return states[0] && !states[1] && !states[2] && !states[3];
}

/* ---------------------------
   Shapes for Trace/Connect modes
   --------------------------- */
const TraceShapes = {
    star: {
        // normalized coords [0..1] relative to canvas box center
        points: [
            { x: 0.5, y: 0.12 },
            { x: 0.62, y: 0.42 },
            { x: 0.95, y: 0.42 },
            { x: 0.69, y: 0.62 },
            { x: 0.8, y: 0.92 },
            { x: 0.5, y: 0.75 },
            { x: 0.2, y: 0.92 },
            { x: 0.31, y: 0.62 },
            { x: 0.05, y: 0.42 },
            { x: 0.38, y: 0.42 }
        ]
    }
};

const ConnectDotsTemplates = {
    easy: [
        { x: 0.25, y: 0.3 },
        { x: 0.5, y: 0.6 },
        { x: 0.75, y: 0.3 }
    ]
};

/* ---------------------------
   Main Component
   --------------------------- */
const MagicCanvasPage = () => {
    // refs
    const webcamRef = useRef(null);
    const overlayRef = useRef(null); // for highlights and particles
    const drawingRef = useRef(null); // persistent strokes

    // model + UI state
    const [handLandmarker, setHandLandmarker] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [loadingModel, setLoadingModel] = useState(true);

    // drawing controls
    const [drawingColor, setDrawingColor] = useState("#4A90E2");
    const [brushSize, setBrushSize] = useState(10);

    // mode: 'free' | 'trace' | 'connect'
    const [mode, setMode] = useState("free");

    // trace/connect state
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    // smoothing + particles
    const smoothed = useRef({ x: null, y: null });
    const prevPoint = useRef({ x: null, y: null });
    const particles = useRef([]); // {x,y,created,life,color,size}
    const lastDrawToggleAt = useRef(0);
    const isDrawingRef = useRef(false); // current drawing state

    // audio context for sparkle
    const audioCtxRef = useRef(null);

    // load model
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const fileset = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
                );
                const landmarker = await HandLandmarker.createFromOptions(fileset, {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                });
                if (!cancelled) {
                    setHandLandmarker(landmarker);
                    console.log("✅ HandLandmarker loaded");
                }
            } catch (err) {
                console.error("Failed to load HandLandmarker:", err);
            } finally {
                if (!cancelled) setLoadingModel(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    // start audio context on first interaction (user gesture required by browsers)
    const ensureAudio = () => {
        if (!audioCtxRef.current) {
            try {
                const C = window.AudioContext || window.webkitAudioContext;
                audioCtxRef.current = new C();
            } catch (e) {
                console.warn("AudioContext not available", e);
            }
        }
    };

    // enable camera
    const enableCam = useCallback(() => {
        if (handLandmarker) {
            setIsCameraReady(true);
            ensureAudio();
        } else {
            console.warn("Model not ready");
        }
    }, [handLandmarker]);

    // helper: play sparkle beep when new stroke starts
    const playSparkle = () => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(880 + Math.random() * 200, ctx.currentTime);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.2);
    };

    // Image smoothing (EMA)
    const smoothPoint = (x, y) => {
        if (smoothed.current.x === null) {
            smoothed.current = { x, y };
        } else {
            smoothed.current.x = SMOOTHING_ALPHA * x + (1 - SMOOTHING_ALPHA) * smoothed.current.x;
            smoothed.current.y = SMOOTHING_ALPHA * y + (1 - SMOOTHING_ALPHA) * smoothed.current.y;
        }
        return smoothed.current;
    };

    // Particle creation
    const spawnParticles = (x, y, color, amount = 2) => {
        const now = performance.now();
        for (let i = 0; i < amount; i++) {
            particles.current.push({
                x: x + (Math.random() - 0.5) * 12,
                y: y + (Math.random() - 0.5) * 12,
                created: now,
                life: PARTICLE_LIFETIME,
                size: Math.random() * 6 + 2,
                color
            });
        }
    };

    // helper: draw persistent stroke (line) on drawing canvas with interpolation
    const drawStrokeTo = (x, y, color, size) => {
        const ctx = drawingRef.current?.getContext("2d");
        if (!ctx) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const px = prevPoint.current.x;
        const py = prevPoint.current.y;
        if (px === null) {
            // start dot
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y);
            ctx.stroke();
        } else {
            // interpolate couple of steps to make continuous curve if far apart
            const dx = x - px;
            const dy = y - py;
            const dist = Math.hypot(dx, dy);
            const steps = Math.max(1, Math.min(8, Math.floor(dist / (size * 0.5))));
            for (let i = 1; i <= steps; i++) {
                const ix = px + (dx * i) / steps;
                const iy = py + (dy * i) / steps;
                ctx.beginPath();
                ctx.moveTo(prevPoint.current.x, prevPoint.current.y);
                ctx.lineTo(ix, iy);
                ctx.stroke();
                prevPoint.current = { x: ix, y: iy };
            }
        }
    };

    // reset drawing / trace state
    const resetCanvas = () => {
        if (drawingRef.current) {
            const ctx = drawingRef.current.getContext("2d");
            ctx.clearRect(0, 0, drawingRef.current.width, drawingRef.current.height);
        }
        particles.current = [];
        smoothed.current = { x: null, y: null };
        prevPoint.current = { x: null, y: null };
        setScore(0);
        setCompleted(false);
    };

    // mode helpers: draw ghost shape for trace, draw dots for connect
    const drawModeGuides = () => {
        const overlay = overlayRef.current;
        if (!overlay) return;
        const ctx = overlay.getContext("2d");
        ctx.save();
        ctx.clearRect(0, 0, overlay.width, overlay.height);

        const w = overlay.width;
        const h = overlay.height;

        if (mode === "trace") {
            const shape = TraceShapes.star;
            ctx.globalAlpha = 0.9;
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#ffffff22";
            ctx.beginPath();
            shape.points.forEach((p, i) => {
                const px = p.x * w;
                const py = p.y * h;
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            });
            ctx.closePath();
            ctx.stroke();

            // faint nodes
            for (const p of shape.points) {
                ctx.beginPath();
                ctx.fillStyle = "#ffffff44";
                ctx.arc(p.x * w, p.y * h, 8, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (mode === "connect") {
            const dots = ConnectDotsTemplates.easy;
            ctx.globalAlpha = 0.95;
            dots.forEach((d, i) => {
                ctx.beginPath();
                ctx.fillStyle = "#ffffff33";
                ctx.arc(d.x * w, d.y * h, 14, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#fff";
                ctx.font = "16px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(String(i + 1), d.x * w, d.y * h);
            });
        }
        ctx.restore();
    };

    // Detection & render loop
    useEffect(() => {
        let rafId;
        let lastTime = performance.now();

        const loop = async () => {
            try {
                if (!webcamRef.current?.video || !overlayRef.current || !drawingRef.current) {
                    rafId = requestAnimationFrame(loop);
                    return;
                }
                const video = webcamRef.current.video;
                // ensure canvas sizes match actual video dims
                if (overlayRef.current.width !== video.videoWidth || overlayRef.current.height !== video.videoHeight) {
                    overlayRef.current.width = video.videoWidth || 640;
                    overlayRef.current.height = video.videoHeight || 480;
                    drawingRef.current.width = overlayRef.current.width;
                    drawingRef.current.height = overlayRef.current.height;
                    console.log("📏 resized canvases:", overlayRef.current.width, overlayRef.current.height);
                }

                const overlayCtx = overlayRef.current.getContext("2d");
                const now = performance.now();
                overlayCtx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);

                // draw mode guides first (they use overlay)
                drawModeGuides();

                if (!handLandmarker) {
                    rafId = requestAnimationFrame(loop);
                    return;
                }

                // detect for current video frame; use perf timestamp
                let detections;
                try {
                    detections = await handLandmarker.detectForVideo(video, performance.now());
                } catch (err) {
                    // detection occasionally fails transiently — don't crash
                    console.warn("detectForVideo failed:", err);
                }

                const landmarks = detections?.landmarks?.[0];

                // determine if index-only gesture (drawing)
                const gestureActive = isIndexOnly(landmarks);

                // apply hysteresis to avoid micro toggles
                if (gestureActive) {
                    lastDrawToggleAt.current = now;
                }
                const drawingActive = (now - lastDrawToggleAt.current) < Math.max(1000, DRAW_GESTURE_HYSTERESIS_MS);

                // if gestureActive but we want strict 'index-only', use gestureActive directly
                // We'll treat drawing when gestureActive is true (this keeps it responsive)
                const shouldDraw = gestureActive;

                if (landmarks && shouldDraw) {
                    // compute fingertip coords and convert to canvas space (mirror X)
                    const tip = landmarks[8];
                    const x = (1 - tip.x) * overlayRef.current.width;
                    const y = tip.y * overlayRef.current.height;

                    // smooth
                    const s = smoothPoint(x, y);

                    // start sound on new stroke
                    if (!isDrawingRef.current) {
                        isDrawingRef.current = true;
                        playSparkle();
                    }

                    // draw stroke to persistent canvas
                    drawStrokeTo(s.x, s.y, drawingColor, brushSize);

                    // spawn particles
                    spawnParticles(s.x, s.y, drawingColor, PARTICLE_FREQ);

                    // mark prev for interpolation already updated by drawStrokeTo
                    // update mode-specific scoring/completion
                    if (mode === "trace") {
                        // simple scoring: count unique nearby points visited from the trace shape
                        const shape = TraceShapes.star.points;
                        // if tip within distance of any shape point and not yet counted, increment
                        for (let i = 0; i < shape.length; i++) {
                            const p = shape[i];
                            const px = p.x * overlayRef.current.width;
                            const py = p.y * overlayRef.current.height;
                            const d = Math.hypot(s.x - px, s.y - py);
                            if (d < Math.max(20, brushSize * 1.6)) {
                                // bump score and slightly remove node visually by drawing filled green
                                setScore((prev) => Math.min(prev + 1, 9999));
                            }
                        }
                    } else if (mode === "connect") {
                        const dots = ConnectDotsTemplates.easy;
                        for (let i = 0; i < dots.length; i++) {
                            const d = dots[i];
                            const px = d.x * overlayRef.current.width;
                            const py = d.y * overlayRef.current.height;
                            const dist = Math.hypot(s.x - px, s.y - py);
                            if (dist < 28) {
                                setScore((prev) => Math.min(prev + 1, 9999));
                            }
                        }
                    }
                } else {
                    // not drawing
                    if (isDrawingRef.current) {
                        isDrawingRef.current = false;
                        prevPoint.current = { x: null, y: null };
                        // small particle burst when lift finger
                        if (smoothed.current.x !== null) spawnParticles(smoothed.current.x, smoothed.current.y, drawingColor, 8);
                    }
                }

                // update & render particles on overlay
                const now2 = performance.now();
                const out = [];
                const ctx = overlayCtx;
                for (const p of particles.current) {
                    const age = now2 - p.created;
                    if (age > p.life) continue;
                    const t = 1 - age / p.life;
                    ctx.beginPath();
                    ctx.globalAlpha = Math.max(0.02, t);
                    // glow: outer
                    ctx.fillStyle = p.color;
                    ctx.arc(p.x, p.y, p.size * (0.9 + (1 - t)), 0, Math.PI * 2);
                    ctx.fill();
                    out.push(p);
                }
                particles.current = out;
                ctx.globalAlpha = 1;

                // simple completion condition: if score above threshold
                if (mode === "trace" && score > 150 && !completed) {
                    setCompleted(true);
                }
                if (mode === "connect" && score > 80 && !completed) {
                    setCompleted(true);
                }

            } catch (err) {
                console.error("Loop error:", err);
            }

            rafId = requestAnimationFrame(loop);
        };

        if (isCameraReady && handLandmarker) {
            rafId = requestAnimationFrame(loop);
        }
        return () => cancelAnimationFrame(rafId);
    }, [isCameraReady, handLandmarker, drawingColor, brushSize, mode, score, completed]);

    // clear function
    const handleClear = () => {
        resetCanvas();
    };

    // when webcam starts, set canvases size
    const onUserMedia = () => {
        const v = webcamRef.current?.video;
        if (!v) return;
        const w = v.videoWidth || 640;
        const h = v.videoHeight || 480;
        if (overlayRef.current && drawingRef.current) {
            overlayRef.current.width = w;
            overlayRef.current.height = h;
            drawingRef.current.width = w;
            drawingRef.current.height = h;
            console.log("onUserMedia set canvas size", w, h);
        }
    };

    // small UI
    return (
        <div className="flex flex-col items-center p-4">
            <Card className="w-full max-w-4xl p-0 overflow-hidden">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold">Magic Canvas — Kid Mode</h1>
                    <p className="text-sm text-gray-500 mt-1">Use your index finger as a magic brush. Switch modes below.</p>
                </div>

                <div className="relative w-full h-[480px] bg-black">
                    <Webcam
                        ref={webcamRef}
                        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                        mirrored
                        audio={false}
                        videoConstraints={{ facingMode: "user", width: 640, height: 480 }}
                        onUserMedia={() => onUserMedia()}
                    />

                    <canvas ref={drawingRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none" />
                    <canvas ref={overlayRef} className="absolute inset-0 w-full h-full z-20 pointer-events-none" />

                    {!isCameraReady && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center">
                            {loadingModel ? (
                                <div className="text-white">Loading...</div>
                            ) : (
                                <div className="space-y-3 text-center">
                                    <Button variant="primary" size="lg" onClick={enableCam}>Activate Magic</Button>
                                    <div className="text-xs text-gray-300 mt-2">Allow camera access and position your hand in front of the camera.</div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* controls */}
                <div className="p-4 border-t flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Mode:</label>
                        <select className="px-2 py-1 border rounded" value={mode} onChange={(e) => { resetCanvas(); setMode(e.target.value); }}>
                            <option value="free">Free Draw</option>
                            <option value="trace">Trace Shape</option>
                            <option value="connect">Connect Dots</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm">Color:</label>
                        {['#4A90E2', '#34D399', '#FF8C66', '#FFFFFF', '#1A202C'].map(c => (
                            <button key={c} onClick={() => setDrawingColor(c)} className={`w-7 h-7 rounded-full border ${drawingColor === c ? 'ring-2 ring-offset-1' : ''}`} style={{ backgroundColor: c }} />
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm">Brush:</label>
                        <input type="range" min="4" max="36" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} />
                        <div className="text-sm w-8 text-center">{brushSize}</div>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={handleClear}><ClearIcon /> Clear</Button>
                    </div>
                </div>

                {/* feedback */}
                <div className="p-4 border-t flex items-center justify-between">
                    <div className="text-sm">Score: <strong>{score}</strong></div>
                    <div className="text-sm">{completed ? <span className="text-green-500">Completed!</span> : <span>Keep drawing...</span>}</div>
                </div>
            </Card>
        </div>
    );
};

export default MagicCanvasPage;
