"""Real ecosystem app tiles converge into clear glass with reflected spectral metal.
Load vinclub-clear-rim-v1-animation.blend; -- preview renders the early/mid/end poses.
"""
import bpy, math, pathlib, subprocess, sys
from mathutils import Vector

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/vinclub-prismatic-glass'
PUBLIC = ROOT / 'public/brand-splash/prismatic-glass'
s = bpy.context.scene
prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'METAL'; prefs.get_devices()
for d in prefs.devices: d.use = d.type == 'METAL'
s.cycles.device = 'GPU'; s.cycles.samples = 80; s.cycles.adaptive_threshold = .025
s.render.use_persistent_data = True
s.render.use_motion_blur = True; s.render.motion_blur_shutter = .4
s.render.fps = 30; s.render.resolution_x = s.render.resolution_y = 1440
logo = bpy.data.objects['VinClub prismatic glass']
# Keep white studio cards from clipping the fine metallic reflections.
for obj in bpy.data.objects:
 if obj.type != 'MESH': continue
 for material in obj.data.materials:
  if material and material.use_nodes:
   for node in material.node_tree.nodes:
    if node.type == 'EMISSION': node.inputs[1].default_value *= .65
# Spectrum is carried by the studio reflection strips, not by a surface tint.
spectrum=[(1,.18,.06,1),(1,.66,.1,1),(.2,1,.65,1),(.43,.15,1,1),(1,.15,.35,1),(1,.72,.15,1)]
for name in ['Left strip','Rear right','Low glint']:
 obj=bpy.data.objects.get(name)
 if not obj: continue
 nt=obj.data.materials[0].node_tree;n=nt.nodes
 em=next(v for v in n if v.type=='EMISSION')
 tex=n.new('ShaderNodeTexCoord');sep=n.new('ShaderNodeSeparateXYZ');ramp=n.new('ShaderNodeValToRGB')
 nt.links.new(tex.outputs['UV'],sep.inputs[0]);nt.links.new(sep.outputs['Y' if name!='Low glint' else 'X'],ramp.inputs[0]);nt.links.new(ramp.outputs[0],em.inputs[0])
 ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
 for i,color in enumerate(spectrum):
  element=ramp.color_ramp.elements[0] if i==0 else ramp.color_ramp.elements.new(i/(len(spectrum)-1))
  for frame,mix in [(1,.12),(18,.3),(38,1),(72,1)]:
   element.color=tuple(1+(c-1)*mix for c in color[:3])+(1,);element.keyframe_insert('color',frame=frame)
for obj in list(bpy.data.objects):
 if obj.name.startswith('Intro glass droplet'): bpy.data.objects.remove(obj, do_unlink=True)

def rounded_face(name, half=.24, radius=.065, z=.043):
 vertices = [(0, 0, z)]
 for cx, cy, start in [(half-radius,half-radius,0),(-half+radius,half-radius,90),(-half+radius,-half+radius,180),(half-radius,-half+radius,270)]:
  for i in range(9):
   a=math.radians(start+i*90/8)
   vertices.append((cx+radius*math.cos(a),cy+radius*math.sin(a),z))
 mesh=bpy.data.meshes.new(name)
 mesh.from_pydata(vertices,[],[(0,i,1 if i==len(vertices)-1 else i+1) for i in range(1,len(vertices))]);mesh.update()
 uv=mesh.uv_layers.new()
 for p in mesh.polygons:
  for li in p.loop_indices:
   v=mesh.vertices[mesh.loops[li].vertex_index].co;uv.data[li].uv=(v.x/(2*half)+.5,v.y/(2*half)+.5)
 obj=bpy.data.objects.new(name,mesh);s.collection.objects.link(obj)
 return obj

apps=['vinfast','vinhomes','vinmec','vinpearl','vinwonders','xanhsm']
for i,slug in enumerate(apps):
 root=bpy.data.objects.new('Ecosystem '+slug,None);s.collection.objects.link(root)
 bpy.ops.mesh.primitive_cube_add(size=1)
 body=bpy.context.object;body.name=slug+' polished app tile';body.dimensions=(.49,.49,.075)
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 bevel=body.modifiers.new('Rounded app corners','BEVEL');bevel.width=.065;bevel.segments=6
 body.parent=root
 mat=bpy.data.materials.new(slug+' metal edge');mat.use_nodes=True
 p=mat.node_tree.nodes['Principled BSDF'];p.inputs['Base Color'].default_value=(.4,.35,.26,1);p.inputs['Metallic'].default_value=.9;p.inputs['Roughness'].default_value=.2
 body.data.materials.append(mat)
 face=rounded_face(slug+' official app artwork');face.parent=root
 mat=bpy.data.materials.new(slug+' official artwork');mat.use_nodes=True
 n=mat.node_tree.nodes;p=n['Principled BSDF'];tex=n.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(ROOT/'public/brand-splash/ecosystem-apps'/(slug+'.jpg')))
 p.inputs['Base Color'].default_value=(.015,.015,.015,1)
 mat.node_tree.links.new(tex.outputs['Color'],p.inputs['Emission Color'])
 p.inputs['Emission Strength'].default_value=.8;p.inputs['Roughness'].default_value=.3;p.inputs['Coat Weight'].default_value=.12
 face.data.materials.append(mat)
 for frame in range(1,73):
  # Hold long enough to recognize each app; stagger the inward trajectories.
  t=max(0,min(1,(frame-(15+i*2))/23));e=t*t*(3-2*t)
  angle=math.radians(90+i*60)+(frame-1)*.009
  radius=1.62*(1-e)
  root.location=(math.cos(angle)*radius,math.sin(angle)*radius,.5+.12*math.sin(angle)+.15*e)
  root.rotation_euler=(.12*math.sin(angle),.2*math.cos(angle),-.12*math.sin(angle))
  scale=max(.00001,1-e**3);root.scale=(scale,)*3
  for prop in ['location','rotation_euler','scale']:root.keyframe_insert(prop,frame=frame)

# Narrow studio strips are visible only in reflection/transmission, never as a halo.
for i,(color,location) in enumerate([((.15,1,.65),(-2.5,.6,2.3)),((1,.13,.24),(2.7,-.2,2)),((.62,.18,1),(.8,2.8,1.8)),((1,.7,.16),(-.8,-2.8,2))]):
 bpy.ops.mesh.primitive_plane_add(size=1,location=location);obj=bpy.context.object;obj.name='Ecosystem spectrum reflection '+str(i)
 obj.scale=(.32,3,1);obj.rotation_euler=(-obj.location).to_track_quat('Z','Y').to_euler();obj.visible_camera=False
 mat=bpy.data.materials.new(obj.name);mat.use_nodes=True;n=mat.node_tree.nodes;n.clear();em=n.new('ShaderNodeEmission');em.inputs[0].default_value=(*color,1)
 tr=n.new('ShaderNodeBsdfTransparent');add=n.new('ShaderNodeAddShader');out=n.new('ShaderNodeOutputMaterial');links=mat.node_tree.links
 links.new(em.outputs[0],add.inputs[0]);links.new(tr.outputs[0],add.inputs[1]);links.new(add.outputs[0],out.inputs[0]);obj.data.materials.append(mat)
 for frame,strength in [(1,1),(18,3),(34,18),(48,16),(62,10),(72,10)]:
  em.inputs[1].default_value=strength;em.inputs[1].keyframe_insert('default_value',frame=frame)

if '--' in sys.argv and sys.argv[sys.argv.index('--')+1].startswith('preview'):
 s.cycles.samples=64;s.render.resolution_x=s.render.resolution_y=768
 for frame in ([72] if sys.argv[-1]=='preview-final' else [9,31,72]):
  s.frame_set(frame);s.render.filepath=str(OUT/f'ecosystem-preview-{frame}.png');bpy.ops.render.render(write_still=True)
else:
 frames=OUT/'frames-ecosystem-v1';frames.mkdir(exist_ok=True)
 s.frame_start=1;s.frame_end=72;s.render.filepath=str(frames/'frame_')
 bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'vinclub-ecosystem-v1.blend'))
 bpy.ops.render.render(animation=True)
 s.frame_set(72);s.cycles.samples=160;s.render.filepath=str(PUBLIC/'poster-ecosystem-v1.png');bpy.ops.render.render(write_still=True)
 subprocess.run(['ffmpeg','-y','-framerate','30','-i',str(frames/'frame_%04d.png'),'-an','-c:v','libx264','-preset','slow','-crf','14','-profile:v','high','-level:v','4.1','-pix_fmt','yuv420p','-movflags','+faststart',str(PUBLIC/'intro-ecosystem-v1.mp4')],check=True)
