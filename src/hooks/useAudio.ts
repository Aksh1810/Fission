'use client';

import { useCallback, useRef, useEffect } from 'react';

/**
 * Uses Web Audio API for precise timing and low latency sound effects.
 */
class AudioManager {
    private audioContext: AudioContext | null = null;
    private clickBuffer: AudioBuffer | null = null;
    private explosionBuffer: AudioBuffer | null = null;
    private enabled: boolean = true;

    async initialize() {
        if (this.audioContext) return;

        try {
            this.audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            this.clickBuffer = this.generateClickSound();
            this.explosionBuffer = this.generateExplosionSound();
        } catch (e) {
            console.warn('Audio not available:', e);
        }
    }

    private generateClickSound(): AudioBuffer {
        const sampleRate = this.audioContext!.sampleRate;
        const duration = 0.08;
        const buffer = this.audioContext!.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 40);
            const frequency = 800 - t * 2000;
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
        }

        return buffer;
    }

    private generateExplosionSound(): AudioBuffer {
        const sampleRate = this.audioContext!.sampleRate;
        const duration = 0.25;
        const buffer = this.audioContext!.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 8) * (1 - Math.exp(-t * 100));
            const noise = (Math.random() * 2 - 1);
            const lowFreq = Math.sin(2 * Math.PI * 80 * t);
            const midFreq = Math.sin(2 * Math.PI * 200 * t) * 0.5;
            data[i] = (noise * 0.6 + lowFreq * 0.3 + midFreq * 0.1) * envelope * 0.4;
        }

        return buffer;
    }

    playClick() {
        if (!this.enabled || !this.audioContext || !this.clickBuffer) return;
        this.playBuffer(this.clickBuffer);
    }

    playExplosion() {
        if (!this.enabled || !this.audioContext || !this.explosionBuffer) return;
        this.playBuffer(this.explosionBuffer);
    }

    private playBuffer(buffer: AudioBuffer) {
        if (!this.audioContext) return;

        // Resume context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        gainNode.gain.value = 0.5;

        source.start(0);
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    isEnabled() {
        return this.enabled;
    }
}

let audioManager: AudioManager | null = null;

export function useAudio() {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current && typeof window !== 'undefined') {
            audioManager = new AudioManager();
            initialized.current = true;
        }
    }, []);

    const initAudio = useCallback(async () => {
        if (audioManager) {
            await audioManager.initialize();
        }
    }, []);

    const playClick = useCallback(() => {
        audioManager?.playClick();
    }, []);

    const playExplosion = useCallback(() => {
        audioManager?.playExplosion();
    }, []);

    const toggleSound = useCallback(() => {
        if (audioManager) {
            audioManager.setEnabled(!audioManager.isEnabled());
            return audioManager.isEnabled();
        }
        return true;
    }, []);

    return {
        initAudio,
        playClick,
        playExplosion,
        toggleSound,
    };
}
