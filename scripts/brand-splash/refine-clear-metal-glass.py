"""Neutral clear glass and a genuinely separate champagne-metal bezel."""
import bpy,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[2];OUT=ROOT/'output/vinclub-prismatic-glass'
s=bpy.context.scene
logo=bpy.data.objects['VinClub prismatic glass']
glass=logo.data.materials[0]
for node in glass.node_tree.nodes:
 if node.type=='BSDF_GLASS':
  node.inputs['Color'].default_value=(1,1,1,1)
  node.inputs['Roughness'].default_value=.01
  node.inputs['IOR'].default_value=1.5
# Neutral illumination keeps the transparent body untinted.
for obj in list(bpy.data.objects):
 if obj.name.startswith('Spectrum '):bpy.data.objects.remove(obj,do_unlink=True);continue
 if obj.type!='MESH' or not obj.data.materials:continue
 for material in obj.data.materials:
  if not material.use_nodes:continue
  for node in material.node_tree.nodes:
   if node.type=='EMISSION':
    node.inputs[0].default_value=(1,1,1,1)
    if 'transmission fill' in obj.name:node.inputs[0].default_value=(.04,.04,.04,1);node.inputs[1].default_value=.22
metal=bpy.data.materials.new('Champagne metal bezel');metal.use_nodes=True
p=metal.node_tree.nodes['Principled BSDF'];p.inputs['Base Color'].default_value=(.83,.62,.28,1);p.inputs['Metallic'].default_value=1;p.inputs['Roughness'].default_value=.2
p.inputs['Coat Weight'].default_value=.35
points=json.loads((OUT/'metal-outline.json').read_text())
for name,z,radius in [('Front metal bezel',.17,.007),('Rear metal bezel',-.17,.0055)]:
 curve=bpy.data.curves.new(name,'CURVE');curve.dimensions='3D';curve.resolution_u=2;curve.bevel_depth=radius;curve.bevel_resolution=4
 spline=curve.splines.new('POLY');spline.points.add(len(points)-1)
 for point,(x,y) in zip(spline.points,points):point.co=(x,y,z,1)
 spline.use_cyclic_u=True
 obj=bpy.data.objects.new(name,curve);s.collection.objects.link(obj);obj.parent=logo;curve.materials.append(metal)
s.view_settings.exposure=1.0
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='METAL'
s.cycles.device='GPU';s.cycles.samples=128;s.render.resolution_x=s.render.resolution_y=768
s.render.filepath=str(OUT/'clear-metal-study.png')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'vinclub-clear-metal.blend'))
bpy.ops.render.render(write_still=True)
