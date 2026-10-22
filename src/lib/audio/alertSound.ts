/**
 * Generador de alertas sonoras operativas usando Web Audio API pura.
 * No requiere archivos externos .mp3 ni dependencias pesadas.
 */

class SoundAlertManager {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {
        // Ignorar si aún no hay interacción de usuario
      });
    }

    return this.audioCtx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Emite un beep discreto de dos tonos para alerta de vencimiento (15 min).
   */
  public playWarningBeep(): void {
    if (this.isMuted) return;

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Primer tono (880 Hz - La5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.16);

      // Segundo tono (1174 Hz - Re6)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1174, now + 0.18);

      gain2.gain.setValueAtTime(0.001, now + 0.18);
      gain2.gain.linearRampToValueAtTime(0.15, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.18);
      osc2.stop(now + 0.42);
    } catch {
      // Fallback silencioso si el navegador bloquea la reproducción automática
    }
  }
}

export const alertSound = new SoundAlertManager();
