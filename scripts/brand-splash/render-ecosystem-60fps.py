"""Render the official-app ecosystem scene at native half-frame poses, 60 fps.
Reuses the editable Cycles geometry/materials; does not interpolate video frames.
"""
import bpy, pathlib, subprocess, json, time
ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/vinclub-prismatic-glass'
PUBLIC = ROOT / 'public/brand-splash/prismatic-glass'
started = time.monotonic()
for part, scene_name, first, count in [
    ('intro', 'vinclub-ecosystem-v1.blend', 1, 144),
    ('out', 'vinclub-ecosystem-exit-v1.blend', 73, 32),
]:
    bpy.ops.wm.open_mainfile(filepath=str(OUT / scene_name))
    scene = bpy.context.scene
    scene.render.resolution_x = scene.render.resolution_y = 768
    scene.render.resolution_percentage = 100
    scene.cycles.samples = 32
    scene.cycles.use_denoising = True
    scene.cycles.adaptive_threshold = .04
    scene.render.use_persistent_data = True
    scene.render.use_motion_blur = True
    scene.render.motion_blur_shutter = .2
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'METAL'
    prefs.get_devices()
    for device in prefs.devices:
        device.use = device.type == 'METAL'
    scene.cycles.device = 'GPU'
    frames = OUT / f'frames-ecosystem-{part}-60fps-v2'
    frames.mkdir(exist_ok=True)
    for index in range(count):
        pose = first + index / 2
        scene.frame_set(int(pose), subframe=pose % 1)
        target = frames / f'{index:04d}.png'
        if not target.exists():
            scene.render.filepath = str(target)
            bpy.ops.render.render(write_still=True)
        print(f'ECOSYSTEM {part} {index + 1}/{count} elapsed={time.monotonic()-started:.0f}s', flush=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '60', '-i', str(frames / '%04d.png'), '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(PUBLIC / f'{part}-ecosystem-60fps-v2.mp4')], check=True)
    if part == 'intro':
        scene.frame_set(72)
        scene.render.filepath = str(PUBLIC / 'poster-ecosystem-60fps-v2.png')
        bpy.ops.render.render(write_still=True)
(PUBLIC / 'ecosystem-60fps-v2.json').write_text(json.dumps({'fps':60, 'nativeFrames':True, 'size':768, 'apps':['VinFast','Vinhomes Resident','MyVinmec','MyVinpearl','VinWonders','Green SM'], 'sources':'/brand-splash/ecosystem-apps/sources.json'}, indent=2))
