"""A separately rendered camera push keeps the exit sharp instead of enlarging a texture."""
import bpy,math,pathlib,subprocess,sys
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'output/vinclub-prismatic-glass'
variant=sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else 'gold-v4'
FRAMES=OUT/('frames-out-'+variant);FRAMES.mkdir(parents=True,exist_ok=True)
PUBLIC=ROOT/'public/brand-splash/prismatic-glass'
s=bpy.context.scene
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
for device in prefs.devices:device.use=device.type=='METAL'
s.cycles.device='GPU';s.render.use_persistent_data=True;s.cycles.samples=96;s.cycles.adaptive_threshold=.02
s.render.resolution_x=s.render.resolution_y=1440;s.render.fps=30;s.frame_start=73;s.frame_end=95
camera=s.camera
for frame in range(73,96):
 t=(frame-73)/22;e=t*t*(3-2*t)
 camera.data.ortho_scale=4.5/(1+e*4.5);camera.data.keyframe_insert('ortho_scale',frame=frame)
 camera.location=(.6*e,-1.05*e,8);camera.keyframe_insert('location',frame=frame)
s.render.filepath=str(FRAMES/'frame_')
bpy.ops.render.render(animation=True)
subprocess.run(['ffmpeg','-y','-framerate','30','-start_number','73','-i',str(FRAMES/'frame_%04d.png'),'-an','-c:v','libx264','-preset','slow','-crf','14','-profile:v','high','-level:v','4.1','-refs','4','-pix_fmt','yuv420p','-movflags','+faststart',str(PUBLIC/('out-'+variant+'.mp4'))],check=True)
