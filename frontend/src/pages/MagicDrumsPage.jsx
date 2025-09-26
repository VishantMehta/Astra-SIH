import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Music } from "lucide-react";

// --- Configuration Constants from the Backend Handbook ---
const DRUM_ZONES = {
    crash: { x1: 0.7, y1: 0.1, x2: 0.9, y2: 0.4, color: 'rgba(0, 255, 0, 0.5)', lastHit: 0 },
    hi_hat: { x1: 0.1, y1: 0.1, x2: 0.3, y2: 0.4, color: 'rgba(255, 0, 0, 0.5)', lastHit: 0 },
    'kick-drum': { x1: 0.1, y1: 0.6, x2: 0.3, y2: 0.9, color: 'rgba(0, 0, 255, 0.5)', lastHit: 0 },
    'snare-drum': { x1: 0.7, y1: 0.6, x2: 0.9, y2: 0.9, color: 'rgba(255, 255, 0, 0.5)', lastHit: 0 }
};

const HIT_COOLDOWN = 1500; // 1.5 seconds in milliseconds
const WEBCAM_WIDTH = 640;
const WEBCAM_HEIGHT = 480;
const LANDMARKS_TO_CHECK = [8, 12]; // Index Finger Tip, Middle Finger Tip

const MagicDrumsPage = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const mlSocketRef = useRef(null);
    const backendSocketRef = useRef(null);

    const [sequence, setSequence] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [handLandmarks, setHandLandmarks] = useState(null);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [error, setError] = useState('');

    const audioRefs = useRef({});
    useEffect(() => {
        Object.keys(DRUM_ZONES).forEach(name => {
            audioRefs.current[name] = new Audio(`/sounds/${name}.mp3`);
        });
        audioRefs.current['success'] = new Audio('/sounds/success.mp3');
        audioRefs.current['failure'] = new Audio('/sounds/failure.mp3');
    }, []);

    const generateNewSequence = useCallback(() => {
        const drums = Object.keys(DRUM_ZONES);
        const shuffled = [...drums].sort(() => 0.5 - Math.random());
        setSequence(shuffled);
        setCurrentStep(0);
    }, []);

    useEffect(() => {
        generateNewSequence();
        return () => {
            mlSocketRef.current?.close();
            backendSocketRef.current?.close();
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [generateNewSequence]);

    const gameLoop = useCallback(() => {
        if (!isGameStarted || !videoRef.current || !canvasRef.current || videoRef.current.paused || videoRef.current.ended) {
            requestAnimationFrame(gameLoop);
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;

        canvas.width = WEBCAM_WIDTH;
        canvas.height = WEBCAM_HEIGHT;

        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);

        if (mlSocketRef.current?.readyState === WebSocket.OPEN) {
            canvas.toBlob((blob) => {
                if (blob) mlSocketRef.current.send(blob);
            }, 'image/jpeg');
        }

        const drumToHit = sequence[currentStep];
        Object.entries(DRUM_ZONES).forEach(([name, data]) => {
            const { x1, y1, x2, y2, color } = data;
            const startX = x1 * canvas.width;
            const startY = y1 * canvas.height;
            const width = (x2 - x1) * canvas.width;
            const height = (y2 - y1) * canvas.height;

            ctx.strokeStyle = color.replace('0.5', '1');
            ctx.lineWidth = 4;
            ctx.strokeRect(startX, startY, width, height);

            if (name === drumToHit) {
                ctx.fillStyle = color;
                ctx.fillRect(startX, startY, width, height);
                ctx.fillStyle = "white";
                ctx.font = "bold 24px Arial";
                ctx.fillText("HIT THIS!", startX + 10, startY + 30);
            }

            ctx.fillStyle = color.replace('0.5', '1');
            ctx.font = "18px Arial";
            ctx.fillText(name.replace('-', ' '), startX + 5, startY - 10);
        });

        if (handLandmarks) {
            ctx.fillStyle = 'aqua';
            handLandmarks.forEach(landmark => {
                ctx.beginPath();
                ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 5, 0, 2 * Math.PI);
                ctx.fill();
            });
        }

        if (handLandmarks && sequence.length > 0) {
            const currentTime = Date.now();
            LANDMARKS_TO_CHECK.forEach(lmIndex => {
                if (!handLandmarks[lmIndex]) return;
                const landmark = handLandmarks[lmIndex];
                Object.entries(DRUM_ZONES).forEach(([name, data]) => {
                    const { x1, y1, x2, y2 } = data;
                    if (landmark.x > x1 && landmark.x < x2 && landmark.y > y1 && landmark.y < y2) {
                        if (currentTime - data.lastHit > HIT_COOLDOWN) {
                            data.lastHit = currentTime;
                            if (name === drumToHit) {
                                audioRefs.current[name]?.play();
                                audioRefs.current['success']?.play();
                                const nextStep = currentStep + 1;
                                if (nextStep >= sequence.length) {
                                    generateNewSequence();
                                } else {
                                    setCurrentStep(nextStep);
                                }
                            } else {
                                audioRefs.current['failure']?.play();
                                setCurrentStep(0);
                            }
                        }
                    }
                });
            });
        }

        requestAnimationFrame(gameLoop);
    }, [handLandmarks, currentStep, sequence, generateNewSequence, isGameStarted]);

    useEffect(() => {
        const animationFrameId = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [gameLoop]);

    const handleRequestCamera = async () => {
        setError('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: WEBCAM_WIDTH, height: WEBCAM_HEIGHT } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (err) {
            console.error("Error accessing webcam:", err);
            setError('Could not access webcam. Please check permissions and try again.');
        }
    };

    const handleVideoReady = () => {
        console.log("Video stream is ready. Connecting to services...");

        let authToken = null;
        try {
            const authStorage = localStorage.getItem("auth-storage");
            if (authStorage) {
                const authState = JSON.parse(authStorage);
                authToken = authState?.state?.token;
            }
        } catch (e) {
            console.error("Could not parse auth token from localStorage", e);
        }

        if (!authToken) {
            const errorMsg = "Authentication token not found. Please log in first.";
            console.error(errorMsg);
            setError(errorMsg);
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            return;
        }

        mlSocketRef.current = new WebSocket("ws://localhost:8001/ws/track");
        mlSocketRef.current.onopen = () => console.log("Connected to ML Service.");
        mlSocketRef.current.onerror = (err) => console.error("ML Socket Error:", err);

        backendSocketRef.current = new WebSocket(`ws://localhost:8000/api/v1/ws/sensory-gym?token=${authToken}`);
        backendSocketRef.current.onopen = () => console.log("Connected to Main Backend Relay.");
        backendSocketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setHandLandmarks(data.landmarks && data.landmarks.length > 0 ? data.landmarks : null);
        };
        backendSocketRef.current.onerror = (err) => console.error("Backend Socket Error:", err);

        setIsGameStarted(true);
    };


    return (
        <div className="container py-12 flex flex-col items-center">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Magic Drums</CardTitle>
                    <CardDescription>Follow the highlighted sequence and hit the virtual drums with your hand!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full aspect-[4/3] bg-secondary rounded-lg overflow-hidden">
                        <video
                            ref={videoRef}
                            onCanPlay={handleVideoReady}
                            style={{ display: 'none' }}
                            playsInline
                        />
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                        {!isGameStarted && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/90 p-4 text-center">
                                {error ? (
                                    <p className="text-red-500">{error}</p>
                                ) : (
                                    <>
                                        <Button size="lg" onClick={handleRequestCamera}>
                                            <Music className="mr-2 h-5 w-5" /> Start Drum Session
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-2">Allow camera access when prompted.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MagicDrumsPage;