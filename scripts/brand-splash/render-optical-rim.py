"""Reference study: a closed dispersive glass volume, a separate polished bezel, 1.5 turns.
Load vinclub-clear-rim-v1-animation.blend. -- preview renders three material poses.
"""
import bpy,math,pathlib,sys,subprocess
ROOT=pathlib.Path(__file__).resolve().parents[2];OUT=ROOT/'output/vinclub-prismatic-glass';PUBLIC=ROOT/'public/brand-splash/prismatic-glass'
s=bpy.context.scene;logo=bpy.data.objects['VinClub prismatic glass']
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='METAL'
s.cycles.device='GPU';s.cycles.samples=96;s.cycles.adaptive_threshold=.025;s.render.use_persistent_data=True
s.render.use_motion_blur=True;s.render.motion_blur_shutter=.25
for obj in list(bpy.data.objects):
 if obj.name.startswith('Intro glass droplet'):bpy.data.objects.remove(obj,do_unlink=True)

# Greater depth is actual geometry. The rim sits at the outer optical faces.
for vertex in logo.data.vertices:vertex.co.z*=1.35
for name,z,radius in [('Front metal bezel',.282,.014),('Rear metal bezel',-.282,.011)]:
 obj=bpy.data.objects[name];obj.data.bevel_depth=radius;obj.data.bevel_resolution=6
 for spline in obj.data.splines:
  for point in spline.points:point.co.z=z

# Wavelength-dependent refraction splits light at edges; the body has no color coating.
glass=logo.data.materials[0];nt=glass.node_tree;n=nt.nodes;n.clear();out=n.new('ShaderNodeOutputMaterial')
lobes=[]
for name,color,ior in [('Long wavelength',(1,0,0,1),1.475),('Middle wavelength',(0,1,0,1),1.50),('Short wavelength',(0,0,1,1),1.53)]:
 node=n.new('ShaderNodeBsdfGlass');node.name=name;node.distribution='GGX';node.inputs['Color'].default_value=color;node.inputs['IOR'].default_value=ior;node.inputs['Roughness'].default_value=.008;lobes.append(node)
add=n.new('ShaderNodeAddShader');add2=n.new('ShaderNodeAddShader');nt.links.new(lobes[0].outputs[0],add.inputs[0]);nt.links.new(lobes[1].outputs[0],add.inputs[1]);nt.links.new(add.outputs[0],add2.inputs[0]);nt.links.new(lobes[2].outputs[0],add2.inputs[1]);nt.links.new(add2.outputs[0],out.inputs['Surface'])
metal=bpy.data.materials['Champagne metal bezel'];p=metal.node_tree.nodes['Principled BSDF']
p.inputs['Base Color'].default_value=(.85,.78,.61,1);p.inputs['Metallic'].default_value=1;p.inputs['Roughness'].default_value=.1;p.inputs['Coat Weight'].default_value=.2
p.inputs['Thin Film Thickness'].default_value=360;p.inputs['Thin Film IOR'].default_value=1.6

# Broad neutral lights describe thickness; smaller colored strips appear in the bezel.
for obj in bpy.data.objects:
 if obj.type!='MESH':continue
 for mat in obj.data.materials:
  if mat and mat.use_nodes:
   for node in mat.node_tree.nodes:
    if node.type=='EMISSION':
     node.inputs[0].default_value=(1,1,1,1)
     if 'transmission fill' in obj.name:node.inputs[0].default_value=(.04,.04,.04,1);node.inputs[1].default_value=.35
for name,color in [('Rear left',(.12,1,.6,1)),('Rear right',(.62,.16,1,1)),('Low glint',(1,.6,.12,1))]:
 obj=bpy.data.objects[name];node=next(x for x in obj.data.materials[0].node_tree.nodes if x.type=='EMISSION');node.inputs[0].default_value=color
s.view_settings.exposure=.5
logo.animation_data_clear()
for frame in range(1,91):
 t=(frame-1)/89;e=t*t*(3-2*t)
 logo.rotation_euler=(.12+.08*math.sin(math.pi*t),math.radians(-552+540*e),math.radians(-7))
 logo.scale=(.97+.03*min(1,t*3),)*3
 logo.keyframe_insert('rotation_euler',frame=frame);logo.keyframe_insert('scale',frame=frame)
s.render.fps=30
if '--' in sys.argv:
 s.cycles.samples=96;s.render.resolution_x=s.render.resolution_y=768
 for frame in [18,48,90]:
  s.frame_set(frame);s.render.filepath=str(OUT/f'optical-rim-preview-{frame}.png');bpy.ops.render.render(write_still=True)
else:
 frames=OUT/'frames-optical-rim-v1';frames.mkdir(exist_ok=True)
 s.cycles.samples=64;s.cycles.adaptive_threshold=.035
 s.render.resolution_x=s.render.resolution_y=1440;s.frame_start=1;s.frame_end=90;s.render.filepath=str(frames/'frame_')
 bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'vinclub-optical-rim-v1.blend'));bpy.ops.render.render(animation=True)
 s.frame_set(90);s.render.use_motion_blur=False;s.cycles.samples=192;s.render.filepath=str(PUBLIC/'poster-optical-rim-v1.png');bpy.ops.render.render(write_still=True)
 subprocess.run(['ffmpeg','-y','-framerate','30','-i',str(frames/'frame_%04d.png'),'-an','-c:v','libx264','-preset','slow','-crf','14','-profile:v','high','-level:v','4.1','-refs','4','-pix_fmt','yuv420p','-movflags','+faststart',str(PUBLIC/'intro-optical-rim-v1.mp4')],check=True)
