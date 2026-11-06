"""Add a restrained rose/mint/amber glint while turning; preserve the approved neutral end pose.
Load vinclub-clear-rim-v1-animation.blend. Pass -- preview for a quick material check.
"""
import bpy,math,pathlib,shutil,subprocess,sys
from mathutils import Vector
ROOT=pathlib.Path(__file__).resolve().parents[2];OUT=ROOT/'output/vinclub-prismatic-glass';PUBLIC=ROOT/'public/brand-splash/prismatic-glass'
preview='--' in sys.argv and sys.argv[sys.argv.index('--')+1]=='preview'
s=bpy.context.scene
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='METAL'
s.cycles.device='GPU';s.render.use_persistent_data=True
lights=[]
for name,position,color,peak in [
 ('Rose edge',(-2.4,.4,2.6),(1,.27,.4),3.0),
 ('Mint edge',(2.6,.8,2.1),(.3,1,.7),2.8),
 ('Amber glint',(-.2,3.1,-1.8),(1,.65,.3),3.2),
]:
 bpy.ops.mesh.primitive_plane_add(size=1,location=position);obj=bpy.context.object;obj.name=name;obj.scale=(.22,4,1)
 obj.rotation_euler=(Vector((0,0,0))-obj.location).to_track_quat('Z','Y').to_euler();obj.visible_camera=False
 m=bpy.data.materials.new(name+' additive light');m.use_nodes=True;n=m.node_tree.nodes;n.clear();link=m.node_tree.links
 emission=n.new('ShaderNodeEmission');emission.inputs[0].default_value=(*color,1)
 transparent=n.new('ShaderNodeBsdfTransparent');add=n.new('ShaderNodeAddShader');output=n.new('ShaderNodeOutputMaterial')
 link.new(emission.outputs[0],add.inputs[0]);link.new(transparent.outputs[0],add.inputs[1]);link.new(add.outputs[0],output.inputs[0]);obj.data.materials.append(m)
 lights.append((obj,emission,Vector(position),peak))
for frame in range(1,73):
 p=(frame-1)/71
 strength=math.sin(math.pi*min(1,p/.74))**2 if frame<54 else 0
 for i,(obj,emission,position,peak) in enumerate(lights):
  emission.inputs[1].default_value=strength*peak;emission.inputs[1].keyframe_insert('default_value',frame=frame)
  obj.location=position+Vector((math.sin(p*math.pi)*.22,math.sin(p*math.pi+i)*.2,0));obj.keyframe_insert('location',frame=frame)
if preview:
 s.frame_set(27);s.cycles.samples=96;s.render.resolution_x=s.render.resolution_y=768;s.render.filepath=str(OUT/'turn-glints-preview.png');bpy.ops.render.render(write_still=True)
else:
 frames=OUT/'frames-turn-glints-v2';frames.mkdir(exist_ok=True)
 for source in (OUT/'frames-clear-rim-v1').glob('frame_*.png'):shutil.copy2(source,frames/source.name)
 s.cycles.samples=96;s.cycles.adaptive_threshold=.02;s.render.resolution_x=s.render.resolution_y=1440
 s.frame_start=1;s.frame_end=54;s.render.filepath=str(frames/'frame_')
 bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'vinclub-turn-glints-v2.blend'));bpy.ops.render.render(animation=True)
 subprocess.run(['ffmpeg','-y','-framerate','30','-i',str(frames/'frame_%04d.png'),'-an','-c:v','libx264','-preset','slow','-crf','14','-profile:v','high','-level:v','4.1','-refs','4','-pix_fmt','yuv420p','-movflags','+faststart',str(PUBLIC/'intro-turn-glints-v2.mp4')],check=True)
