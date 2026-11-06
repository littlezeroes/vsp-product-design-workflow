"""Render the champagne glass scene into a 2.4s intro and a detailed still.
blender --factory-startup -b output/vinclub-prismatic-glass/vinclub-prismatic-gold-solid.blend -P scripts/brand-splash/render-prismatic-animation.py
"""
import bpy,math,pathlib,subprocess,sys
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'output/vinclub-prismatic-glass'
PUBLIC=ROOT/'public/brand-splash/prismatic-glass'
variant=sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else 'gold-v4'
FRAMES=OUT/('frames-'+variant);FRAMES.mkdir(parents=True,exist_ok=True);PUBLIC.mkdir(parents=True,exist_ok=True)
scene=bpy.context.scene;scene.view_settings.exposure=1.0 if variant.startswith('clear-rim') else 1.35
prefs=bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type='METAL';prefs.get_devices()
for device in prefs.devices: device.use=device.type=='METAL'
scene.cycles.device='GPU';scene.render.use_persistent_data=True
scene.cycles.adaptive_threshold=.02
scene.render.resolution_x=scene.render.resolution_y=1440
scene.render.fps=30;scene.frame_start=1;scene.frame_end=72
scene.cycles.samples=96;scene.cycles.use_denoising=True
scene.render.image_settings.color_mode='RGB';scene.render.image_settings.file_format='PNG'
logo=bpy.data.objects['VinClub prismatic glass']
material=logo.data.materials[0]
droplets=[]
for i in range(7):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=48,ring_count=24,radius=.07+(i%3)*.015)
 obj=bpy.context.object;obj.name='Intro glass droplet';obj.parent=logo;obj.data.materials.append(material)
 for p in obj.data.polygons:p.use_smooth=True
 droplets.append(obj)
for frame in range(1,73):
 p=(frame-1)/71
 t=min(1,p/.88);e=1-(1-t)**3
 logo.rotation_euler=(.12+.06*math.sin(p*math.pi),-1.05*(1-e)+math.radians(-12)*e,math.radians(-7)*e)
 logo.scale=(.88+.12*e,)*3
 logo.keyframe_insert('rotation_euler',frame=frame);logo.keyframe_insert('scale',frame=frame)
 for i,obj in enumerate(droplets):
  a=i/7*math.pi*2+p*.4
  travel=(1-min(1,p/.55))**2
  obj.location=(math.cos(a)*(1+travel*1.5),math.sin(a)*(1+travel*1.4),.4)
  obj.scale=(max(.0001,travel),)*3
  obj.keyframe_insert('location',frame=frame);obj.keyframe_insert('scale',frame=frame)
scene.frame_set(72)
# The poster is the exact final pose of the video, at a higher sample count.
scene.cycles.samples=384;scene.render.resolution_x=scene.render.resolution_y=1536
scene.render.filepath=str(PUBLIC/('poster-'+variant+'.png'));bpy.ops.render.render(write_still=True)
scene.cycles.samples=96;scene.render.resolution_x=scene.render.resolution_y=1440
scene.render.filepath=str(FRAMES/'frame_')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/('vinclub-'+variant+'-animation.blend')))
bpy.ops.render.render(animation=True)

subprocess.run(['ffmpeg', '-y', '-framerate', '30', '-i', str(FRAMES/'frame_%04d.png'), '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-profile:v', 'high', '-level:v', '4.1', '-refs', '4', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(PUBLIC/('intro-'+variant+'.mp4'))], check=True)
