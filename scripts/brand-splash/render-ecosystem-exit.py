"""500ms accelerating camera exit; centered 144-degree shutter for motion blur."""
import bpy, pathlib, subprocess
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'output/vinclub-prismatic-glass'
PUBLIC=ROOT/'public/brand-splash/prismatic-glass'
s=bpy.context.scene;s.frame_set(72)
camera=s.camera
# Use a perspective dolly: camera translation produces actual path-traced blur.
camera.animation_data_clear();camera.data.animation_data_clear()
camera.data.type='PERSP';camera.data.lens=300;camera.data.sensor_width=36
camera.data.dof.use_dof=False
distance=4.5*300/36
for frame in range(73,89):
 t=(frame-73)/15
 # A short readable onset, followed by acceleration into the iris cut.
 e=t*t*t
 camera.location=(.6*e,-1.05*e,distance/(1+4.5*e))
 camera.keyframe_insert('location',frame=frame)
for curve in camera.animation_data.action.fcurves if hasattr(camera.animation_data.action,'fcurves') else []:
 for key in curve.keyframe_points:key.interpolation='LINEAR'
s.render.use_motion_blur=True;s.render.motion_blur_shutter=.4
s.cycles.samples=96;s.cycles.adaptive_threshold=.025
s.render.resolution_x=s.render.resolution_y=1440
s.frame_start=73;s.frame_end=88
frames=OUT/'frames-ecosystem-out-v1';frames.mkdir(exist_ok=True)
s.render.filepath=str(frames/'frame_')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'vinclub-ecosystem-exit-v1.blend'))
bpy.ops.render.render(animation=True)
subprocess.run(['ffmpeg','-y','-framerate','30','-start_number','73','-i',str(frames/'frame_%04d.png'),'-an','-c:v','libx264','-preset','slow','-crf','14','-profile:v','high','-level:v','4.1','-pix_fmt','yuv420p','-movflags','+faststart',str(PUBLIC/'out-ecosystem-v1.mp4')],check=True)
