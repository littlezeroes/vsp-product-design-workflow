"""Keep the approved clear-rim geometry, make spectral edge reflections legible.
Load vinclub-clear-rim-v1-animation.blend. -- preview checks material without a film render.
"""
import bpy, pathlib, math, sys, subprocess
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'output/vinclub-prismatic-glass';PUBLIC=ROOT/'public/brand-splash/prismatic-glass'
s=bpy.context.scene
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='METAL'
s.cycles.device='GPU';s.render.use_persistent_data=True;s.cycles.samples=64;s.cycles.adaptive_threshold=.035
s.render.use_motion_blur=False
for obj in list(bpy.data.objects):
 if obj.name.startswith('Intro glass droplet'):bpy.data.objects.remove(obj,do_unlink=True)

# Thin film gives real angle-dependent colors on the metal and optical interface.
metal=bpy.data.materials['Champagne metal bezel'];p=metal.node_tree.nodes['Principled BSDF']
p.inputs['Base Color'].default_value=(.83,.76,.6,1);p.inputs['Roughness'].default_value=.14;p.inputs['Coat Weight'].default_value=.1
p.inputs['Thin Film IOR'].default_value=1.42
nt=metal.node_tree;n=nt.nodes
tex=n.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=.9;tex.inputs['Detail'].default_value=0
scale=n.new('ShaderNodeMath');scale.operation='MULTIPLY_ADD';scale.inputs[1].default_value=420;scale.inputs[2].default_value=180
nt.links.new(tex.outputs['Fac'],scale.inputs[0]);nt.links.new(scale.outputs[0],p.inputs['Thin Film Thickness'])
glass=bpy.data.objects['VinClub prismatic glass'].data.materials[0]
nt=glass.node_tree;n=nt.nodes;original=next(x for x in n if x.type=='BSDF_GLASS');out=next(x for x in n if x.type=='OUTPUT_MATERIAL')
optical=n.new('ShaderNodeBsdfPrincipled');optical.inputs['Base Color'].default_value=(1,1,1,1);optical.inputs['Transmission Weight'].default_value=1;optical.inputs['IOR'].default_value=1.5;optical.inputs['Roughness'].default_value=.012
optical.inputs['Thin Film Thickness'].default_value=420;optical.inputs['Thin Film IOR'].default_value=1.38
mix=n.new('ShaderNodeMixShader');mix.inputs[0].default_value=.5
nt.links.new(original.outputs[0],mix.inputs[1]);nt.links.new(optical.outputs[0],mix.inputs[2]);nt.links.new(mix.outputs[0],out.inputs['Surface'])

colors=[(1,.025,.08,1),(1,.68,.015,1),(.04,1,.38,1),(.36,.045,1,1),(1,.04,.3,1)]
for name in ['Left strip','Right strip','Rear left','Rear right','Upper ribbon','Low glint']:
 obj=bpy.data.objects.get(name)
 if not obj:continue
 nt=obj.data.materials[0].node_tree;n=nt.nodes;em=next(x for x in n if x.type=='EMISSION')
 tex=n.new('ShaderNodeTexCoord');sep=n.new('ShaderNodeSeparateXYZ');ramp=n.new('ShaderNodeValToRGB')
 nt.links.new(tex.outputs['UV'],sep.inputs[0]);nt.links.new(sep.outputs['Y' if name not in ['Low glint','Upper ribbon'] else 'X'],ramp.inputs[0]);nt.links.new(ramp.outputs[0],em.inputs[0])
 ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
 for i,color in enumerate(colors):
  el=ramp.color_ramp.elements[0] if i==0 else ramp.color_ramp.elements.new(i/(len(colors)-1))
  for frame,amount in [(1,.3),(18,.55),(38,1),(72,1)]:
   el.color=tuple(1+(c-1)*amount for c in color[:3])+(1,);el.keyframe_insert('color',frame=frame)
 em.inputs[1].default_value*=.8
s.view_settings.exposure=.6
preview='--' in sys.argv
if preview:
 s.cycles.samples=64;s.render.resolution_x=s.render.resolution_y=768
 for frame in [28,72]:
  s.frame_set(frame);s.render.filepath=str(OUT/f'spectral-preview-{frame}.png');bpy.ops.render.render(write_still=True)
else:
 frames=OUT/'frames-spectral-v1';frames.mkdir(exist_ok=True)
 s.render.resolution_x=s.render.resolution_y=1440;s.frame_start=1;s.frame_end=72;s.render.fps=30;s.render.filepath=str(frames/'frame_')
 bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'vinclub-spectral-v1.blend'));bpy.ops.render.render(animation=True)
 s.frame_set(72);s.cycles.samples=160;s.render.filepath=str(PUBLIC/'poster-spectral-v1.png');bpy.ops.render.render(write_still=True)
 subprocess.run(['ffmpeg','-y','-framerate','30','-i',str(frames/'frame_%04d.png'),'-an','-c:v','libx264','-preset','slow','-crf','14','-profile:v','high','-level:v','4.1','-pix_fmt','yuv420p','-movflags','+faststart',str(PUBLIC/'intro-spectral-v1.mp4')],check=True)
