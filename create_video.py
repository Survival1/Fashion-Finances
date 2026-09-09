import os
import math
import struct
import wave
import subprocess

def generate_luxury_audio(filename, duration=31, sample_rate=44100):
    num_samples = int(duration * sample_rate)
    with wave.open(filename, 'w') as wav:
        wav.setnchannels(2) # Stereo
        wav.setsampwidth(2) # 16-bit
        wav.setframerate(sample_rate)

        # Chords (frequencies in Hz): Fm, Db, Ab, Eb
        # Fm: F3 (174.61), Ab3 (207.65), C4 (261.63), Eb4 (311.13)
        # Db: Db3 (138.59), F3 (174.61), Ab3 (207.65), C4 (261.63)
        # Ab: Ab2 (103.83), C3 (130.81), Eb3 (155.56), Ab3 (207.65)
        # Eb: Eb3 (155.56), G3 (196.00), Bb3 (233.08), Eb4 (311.13)
        chord_progression = [
            [174.61, 207.65, 261.63, 311.13, 523.25], # Fm9
            [138.59, 174.61, 207.65, 261.63, 415.30], # Dbmaj7
            [103.83, 155.56, 207.65, 261.63, 311.13], # Ab
            [155.56, 196.00, 233.08, 311.13, 466.16], # Eb
        ]
        chord_len = 3.875 # seconds per chord (8 chords for 31s)

        bpm = 124
        beat_dur = 60.0 / bpm

        frames = bytearray()
        
        # Batch write in chunks of 4096 samples
        chunk_size = 4096
        chunk = []

        for i in range(num_samples):
            t = i / sample_rate
            
            # Master volume envelope (fade in 1.5s, fade out 2.5s)
            env = 1.0
            if t < 1.5:
                env = t / 1.5
            elif t > (duration - 2.5):
                env = max(0.0, (duration - t) / 2.5)

            # Determine active chord
            chord_idx = int((t % (chord_len * 4)) / chord_len)
            current_chord = chord_progression[chord_idx]

            # Warm ambient synth pad (sum of sines with gentle detuning)
            pad_val = 0.0
            for freq in current_chord:
                pad_val += math.sin(2 * math.pi * freq * t) * 0.12
                pad_val += math.sin(2 * math.pi * (freq * 1.002) * t) * 0.08
                # Shimmer harmonic
                pad_val += math.sin(2 * math.pi * (freq * 2.0) * t) * 0.03

            # Soft rhythmic bass pulse on beats
            beat_pos = (t % beat_dur) / beat_dur
            kick = 0.0
            if beat_pos < 0.25 and t >= 2.0:
                kick_env = (1.0 - (beat_pos / 0.25)) ** 2
                kick_freq = 110.0 * (1.0 - (beat_pos / 0.25) * 0.5)
                kick = math.sin(2 * math.pi * kick_freq * t) * 0.35 * kick_env

            # Sparkling diamond arpeggio chime
            arp_step = int(t * 4) % len(current_chord)
            arp_freq = current_chord[arp_step] * 2.0
            arp_pos = (t % 0.25) / 0.25
            arp_env = (1.0 - arp_pos) ** 3
            sparkle = math.sin(2 * math.pi * arp_freq * t) * 0.08 * arp_env

            # Stereo spatial panning
            left_sample = (pad_val * 0.85 + kick + sparkle * 1.1) * env * 0.8
            right_sample = (pad_val * 0.9 + kick + sparkle * 0.9) * env * 0.8

            # Soft clipping / saturation
            left_sample = max(-0.95, min(0.95, left_sample))
            right_sample = max(-0.95, min(0.95, right_sample))

            # Convert to 16-bit integer
            l_int = int(left_sample * 32767.0)
            r_int = int(right_sample * 32767.0)

            chunk.append(l_int)
            chunk.append(r_int)

            if len(chunk) >= chunk_size * 2:
                frames.extend(struct.pack(f'<{len(chunk)}h', *chunk))
                chunk = []

        if chunk:
            frames.extend(struct.pack(f'<{len(chunk)}h', *chunk))

        wav.writeframes(frames)
    print(f"Generated luxury soundtrack: {filename}")

def build_fashion_video():
    img1 = "src/assets/images/fashion_finances_hero_official_video_cover_1788855440382.jpg"
    img2 = "src/assets/images/fashion_finances_runway_scene_1788855724768.jpg"
    img3 = "src/assets/images/fashion_finances_boardroom_scene_1788855755482.jpg"

    os.makedirs("public", exist_ok=True)
    audio_file = "/tmp/luxury_soundtrack.wav"
    generate_luxury_audio(audio_file, duration=31.0)

    # 3 clips of ~11.33 seconds each, crossfading into 31 seconds total
    clip1 = "/tmp/clip1.mp4"
    clip2 = "/tmp/clip2.mp4"
    clip3 = "/tmp/clip3.mp4"

    # Clip 1: Subtle slow cinematic zoom in (11.5s)
    cmd1 = [
        "ffmpeg", "-y", "-loop", "1", "-i", img1,
        "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0005,1.15)':d=288:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25",
        "-t", "11.5", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "ultrafast", clip1
    ]
    print("Encoding clip 1...")
    subprocess.run(cmd1, check=True)

    # Clip 2: Gentle zoom out and pan (11.5s)
    cmd2 = [
        "ffmpeg", "-y", "-loop", "1", "-i", img2,
        "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='if(lte(zoom,1.0),1.15,max(1.001,zoom-0.0005))':d=288:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25",
        "-t", "11.5", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "ultrafast", clip2
    ]
    print("Encoding clip 2...")
    subprocess.run(cmd2, check=True)

    # Clip 3: Slow zoom in on boardroom holographic scene (11s)
    cmd3 = [
        "ffmpeg", "-y", "-loop", "1", "-i", img3,
        "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0005,1.15)':d=275:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25",
        "-t", "11", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "ultrafast", clip3
    ]
    print("Encoding clip 3...")
    subprocess.run(cmd3, check=True)

    # Now concatenate with xfade transition and add the luxury soundtrack
    # Clip 1 offset 0, duration 11.5. xfade with clip 2 at 10.0 (transition 1.5s).
    # Combined duration = 11.5 + 11.5 - 1.5 = 21.5s.
    # Second xfade with clip 3 at 20.0 (transition 1.5s).
    # Final duration = 21.5 + 11.0 - 1.5 = 31.0s!
    output_mp4 = "public/hero_video.mp4"
    filter_complex = (
        "[0:v][1:v]xfade=transition=fade:duration=1.5:offset=10.0[v01];"
        "[v01][2:v]xfade=transition=fade:duration=1.5:offset=20.0[vout]"
    )

    cmd_final = [
        "ffmpeg", "-y",
        "-i", clip1,
        "-i", clip2,
        "-i", clip3,
        "-i", audio_file,
        "-filter_complex", filter_complex,
        "-map", "[vout]",
        "-map", "3:a",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "22",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-t", "31.0",
        "-movflags", "+faststart",
        output_mp4
    ]
    print("Compiling final 31-second presentation video with audio...")
    subprocess.run(cmd_final, check=True)

    # Also copy to dist if dist exists
    if os.path.exists("dist"):
        import shutil
        shutil.copyfile(output_mp4, "dist/hero_video.mp4")

    print(f"Successfully generated {output_mp4} (31s, 1080p, AAC stereo)!")

if __name__ == "__main__":
    build_fashion_video()
