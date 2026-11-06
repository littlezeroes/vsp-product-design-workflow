"""VinClub prism glass: Cycles / Metal, black world, closed bevelled volume.
blender --factory-startup -b -P scripts/brand-splash/render-prismatic-glass.py -- still
"""
import bpy, bmesh, math, json, sys, pathlib
from mathutils import Vector
ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/vinclub-prismatic-glass'
args = sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else ['still']
mode = args[0]
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene; scene.render.engine='CYCLES'
prefs=bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type='METAL';prefs.get_devices()
for device in prefs.devices: device.use=device.type=='METAL'
scene.cycles.device='GPU';scene.cycles.samples=96 if mode=='still' else 48
scene.cycles.use_denoising=True;scene.cycles.max_bounces=16
scene.cycles.transmission_bounces=12;scene.cycles.glossy_bounces=8
scene.cycles.diffuse_bounces=2;scene.cycles.sample_clamp_indirect=10
scene.render.resolution_x=640;scene.render.resolution_y=640;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGB'
scene.render.film_transparent=False
scene.view_settings.view_transform='AgX'
scene.view_settings.look='AgX - Medium High Contrast'
world=bpy.data.worlds.new('Black studio');world.use_nodes=True
world.node_tree.nodes['Background'].inputs[0].default_value=(0,0,0,1)
world.node_tree.nodes['Background'].inputs[1].default_value=0
scene.world=world
meshdata=json.loads((OUT/'logo-mesh.json').read_text())
v=meshdata['vertices'];idx=meshdata['indices']
mesh=bpy.data.meshes.new('VinClub closed glass volume')
mesh.from_pydata([v[i:i+3] for i in range(0,len(v),3)],[],[idx[i:i+3] for i in range(0,len(idx),3)])
bm=bmesh.new();bm.from_mesh(mesh)
bmesh.ops.dissolve_limit(bm,angle_limit=.001,verts=list(bm.verts),edges=list(bm.edges))
bm.to_mesh(mesh);bm.free();mesh.validate();mesh.update()
logo=bpy.data.objects.new('VinClub prismatic glass',mesh);scene.collection.objects.link(logo)
bpy.context.view_layer.objects.active=logo;logo.select_set(True)
bevel=logo.modifiers.new('Clamped optical edge','BEVEL');bevel.width=.045;bevel.segments=8;bevel.limit_method='ANGLE';bevel.use_clamp_overlap=True
bpy.ops.object.modifier_apply(modifier=bevel.name)
holes=meshdata.get('holes',[])
if holes:
 cutters=bpy.data.collections.new('Perforation tools');scene.collection.children.link(cutters)
 for hole in holes:
  bpy.ops.mesh.primitive_cylinder_add(vertices=32,radius=hole['radius'],depth=2,location=hole['position'])
  obj=bpy.context.object
  for collection in list(obj.users_collection):collection.objects.unlink(obj)
  cutters.objects.link(obj)
 bpy.context.view_layer.objects.active=logo;logo.select_set(True)
 boolean=logo.modifiers.new('Original logo perforations','BOOLEAN');boolean.operation='DIFFERENCE';boolean.operand_type='COLLECTION';boolean.collection=cutters;boolean.solver='EXACT'
 bpy.ops.object.modifier_apply(modifier=boolean.name)
 for obj in list(cutters.objects):bpy.data.objects.remove(obj,do_unlink=True)
 bpy.data.collections.remove(cutters)
# Repair vector-derived touching surfaces into a single closed optical volume.
bpy.context.view_layer.objects.active=logo
remesh=logo.modifiers.new('Closed optical volume','REMESH');remesh.mode='VOXEL';remesh.voxel_size=.004;remesh.use_smooth_shade=True
bpy.ops.object.modifier_apply(modifier=remesh.name)
smooth=logo.modifiers.new('Polished optical surface','SMOOTH');smooth.factor=.5;smooth.iterations=3
bpy.ops.object.modifier_apply(modifier=smooth.name)
for polygon in logo.data.polygons: polygon.use_smooth=True
check=bmesh.new();check.from_mesh(logo.data)
invalid=sum(not edge.is_manifold for edge in check.edges)
print('OPTICAL_VOLUME_NON_MANIFOLD_EDGES',invalid,flush=True)
check.free()
if invalid: raise RuntimeError('Optical glass volume must be manifold')
mat=bpy.data.materials.new('Clear champagne crystal');mat.use_nodes=True
nodes=mat.node_tree.nodes;nodes.clear();links=mat.node_tree.links
output=nodes.new('ShaderNodeOutputMaterial')
glass=nodes.new('ShaderNodeBsdfGlass');glass.name='Clear champagne optical glass'
glass.distribution='GGX';glass.inputs['Color'].default_value=(1,.99,.96,1)
glass.inputs['Roughness'].default_value=.016;glass.inputs['IOR'].default_value=1.52
links.new(glass.outputs[0],output.inputs['Surface'])
logo.data.materials.append(mat)
for bead in meshdata.get('beads',[]):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=48,ring_count=24,radius=bead['radius'],location=(bead['position'][0],bead['position'][1],.32+bead['radius']))
 obj=bpy.context.object;obj.name='Optical glass bead';obj.parent=logo;obj.data.materials.append(mat)
 for p in obj.data.polygons:p.use_smooth=True


def panel(name,location,width,height,strength,color=(1,.91,.74)):
 bpy.ops.mesh.primitive_plane_add(size=1,location=location);obj=bpy.context.object;obj.name=name
 obj.scale=(width,height,1);obj.rotation_euler=(Vector((0,0,0))-obj.location).to_track_quat('Z','Y').to_euler()
 obj.visible_camera=False
 material=bpy.data.materials.new(name+' emission');material.use_nodes=True
 n=material.node_tree.nodes;n.clear();em=n.new('ShaderNodeEmission');em.inputs[0].default_value=(*color,1);em.inputs[1].default_value=strength
 o=n.new('ShaderNodeOutputMaterial');material.node_tree.links.new(em.outputs[0],o.inputs[0]);obj.data.materials.append(material)
 return obj
panel('Left strip',(-3.2,.4,2.5),.65,7,8)
panel('Right strip',(3.1,0,2.2),.4,7,10)
panel('Upper ribbon',(-.4,3.7,2.5),5,.5,5)
panel('Rear left',(-2.8,.1,-2.4),.5,7,25)
panel('Rear right',(3,-.5,-2),.6,6,30)
panel('Low glint',(.4,-3.5,1.8),3,.3,9)
# Spectral lighting cards: color lives in the reflected studio, never painted on the logo.
for name,loc in [('Spectrum left',(-3.1,.1,2.7)),('Spectrum right',(3,-.1,1.7))]:
 obj=panel(name,loc,.7,7,40)
 nt=obj.data.materials[0].node_tree;n=nt.nodes;em=next(v for v in n if v.type=='EMISSION')
 tex=n.new('ShaderNodeTexCoord');sep=n.new('ShaderNodeSeparateXYZ');nt.links.new(tex.outputs['UV'],sep.inputs[0])
 ramp=n.new('ShaderNodeValToRGB');nt.links.new(sep.outputs['Y'],ramp.inputs[0])
 spectrum=[(1,.32,.06,1),(1,.55,.16,1),(1,.82,.48,1),(1,.97,.83,1),(1,.8,.45,1),(1,.47,.1,1),(1,.68,.26,1)]
 ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1]);ramp.color_ramp.elements[0].color=spectrum[0]
 for i,c in enumerate(spectrum[1:],1):ramp.color_ramp.elements.new(i/6).color=c
 nt.links.new(ramp.outputs[0],em.inputs[0])

panel('Warm champagne transmission fill',(0,0,-4),8,8,.3,(.075,.048,.016))
camdata=bpy.data.cameras.new('Portrait camera');cam=bpy.data.objects.new('Portrait camera',camdata);scene.collection.objects.link(cam)
cam.location=(0,0,8);cam.rotation_euler=(Vector((0,0,0))-cam.location).to_track_quat('-Z','Y').to_euler();camdata.type='ORTHO';camdata.ortho_scale=4.5;scene.camera=cam
logo.rotation_euler=(math.radians(10),math.radians(-12),math.radians(-7))
scene.render.filepath=str(OUT/'prism-gold-solid-study.png')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'vinclub-prismatic-gold-solid.blend'))
bpy.ops.render.render(write_still=True)
