import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

// A simple spinner for loading
const Spinner = () => <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>;

const emotions = {
    happy: { emoji: '😊', label: 'Happy' },
    surprised: { emoji: '😮', label: 'Surprised' },
    neutral: { emoji: '😐', label: 'Neutral' },
};

const EmotionMirrorPage = () => {
    const webcamRef = useRef(null);
    const [faceLandmarker, setFaceLandmarker] = useState(null);
    const [modelLoading, setModelLoading] = useState(true);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [targetEmotion, setTargetEmotion] = useState('happy');
    const [isMatch, setIsMatch] = useState(false);

    // --- 1. Initialize FaceLandmarker Model ---
    useEffect(() => {
        const createFaceLandmarker = async () => {
            try {
                const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
                const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU",
                    },
                    outputFaceBlendshapes: true, // <-- Crucial for emotion detection
                    runningMode: "VIDEO",
                    numFaces: 1,
                });
                setFaceLandmarker(landmarker);
                setModelLoading(false);
                console.log("FaceLandmarker loaded.");
            } catch (error) {
                console.error("Error loading FaceLandmarker:", error);
                setModelLoading(false);
            }
        };
        createFaceLandmarker();
    }, []);

    // --- 2. Real-time Face Detection Loop ---
    useEffect(() => {
        let animationFrameId;
        const predictWebcam = async () => {
            if (webcamRef.current?.video && webcamRef.current.video.readyState === 4 && faceLandmarker && isCameraReady) {
                const video = webcamRef.current.video;
                const detections = faceLandmarker.detectForVideo(video, performance.now());

                if (detections.faceBlendshapes && detections.faceBlendshapes.length > 0) {
                    const blendshapes = detections.faceBlendshapes[0].categories;

                    // --- Simplified Emotion Logic ---
                    const smileScore = blendshapes.find(shape => shape.categoryName === 'mouthSmileLeft')?.score ?? 0 +
                        blendshapes.find(shape => shape.categoryName === 'mouthSmileRight')?.score ?? 0;
                    const surpriseScore = blendshapes.find(shape => shape.categoryName === 'jawOpen')?.score ?? 0;

                    let detectedEmotion = 'neutral';
                    if (smileScore > 0.8) detectedEmotion = 'happy';
                    else if (surpriseScore > 0.6) detectedEmotion = 'surprised';

                    if (detectedEmotion === targetEmotion) {
                        if (!isMatch) setIsMatch(true); // Trigger match only once
                    } else {
                        if (isMatch) setIsMatch(false); // Reset if expression changes
                    }
                }
            }
            animationFrameId = requestAnimationFrame(predictWebcam);
        };

        if (isCameraReady) {
            animationFrameId = requestAnimationFrame(predictWebcam);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [isCameraReady, faceLandmarker, targetEmotion, isMatch]);

    const startCamera = () => setIsCameraReady(true);

    const changeEmotion = (emotion) => {
        setTargetEmotion(emotion);
        setIsMatch(false); // Reset match state when changing emotion
    };

    return (
        <div className="flex flex-col items-center">
            <Card className="w-full max-w-2xl text-center">
                <h1 className="text-3xl font-bold font-heading">Emotion Mirror</h1>
                <p className="text-primary-text/70 mt-2">
                    Try to match the emoji's expression!
                </p>

                <div className="mt-6 flex justify-center gap-4">
                    {Object.keys(emotions).map(key => (
                        <Button
                            key={key}
                            variant={targetEmotion === key ? 'primary' : 'secondary'}
                            onClick={() => changeEmotion(key)}
                        >
                            {emotions[key].label}
                        </Button>
                    ))}
                </div>

                <div className="relative w-full aspect-square max-w-md mx-auto mt-6 bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="absolute top-4 left-4 text-6xl z-20 transition-transform duration-500" style={{ transform: isMatch ? 'scale(1.2)' : 'scale(1)' }}>
                        {emotions[targetEmotion].emoji}
                    </div>

                    <AnimatePresence>
                        {isMatch && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                            >
                                <div className="text-6xl font-bold font-heading text-white bg-accent/80 px-6 py-3 rounded-xl">
                                    MATCH!
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Webcam
                        ref={webcamRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        mirrored={true}
                        audio={false}
                        videoConstraints={{ facingMode: "user" }}
                    />

                    {!isCameraReady && (
                        <div className="absolute inset-0 bg-background/90 z-30 flex flex-col items-center justify-center p-4">
                            {modelLoading ? (
                                <>
                                    <Spinner />
                                    <h2 className="text-xl font-heading mt-4">Loading AI Model...</h2>
                                </>
                            ) : (
                                <Button variant="primary" size="lg" onClick={startCamera}>
                                    Start Mirror
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default EmotionMirrorPage;