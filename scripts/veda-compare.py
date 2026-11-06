"""Strict RGB comparison against one explicit, unscaled source-video region.
No image registration, resize, masks, or tolerance. Exit 1 means different pixels.
"""
from PIL import Image, ImageChops
from pathlib import Path
import json, sys, hashlib
root=Path(__file__).resolve().parents[1];out=root/'output/veda'
candidate=Path(sys.argv[1]) if len(sys.argv)>1 else out/'candidate-assembly-panel.png'
source=out/'reference-assembly-full.png'
a=Image.open(source).convert('RGB').crop((12,238,672,610));b=Image.open(candidate).convert('RGB')
if a.size!=b.size: raise SystemExit('Dimension mismatch. Reference and candidate must both be 660 × 372; resizing is forbidden.')
diff=ImageChops.difference(a,b);pixels=list(diff.getdata());changed=sum(any(p) for p in pixels);mae=sum(sum(p) for p in pixels)/(a.width*a.height*3)
prefix=candidate.stem
Image.blend(a,b,.5).save(out/(prefix+'-overlay.png'));diff.save(out/(prefix+'-diff.png'))
report={'sourceVideo':'/Users/huykieu/Desktop/New Folder With Items/Pin on .mp4','sourceFrameSeconds':10.5,'sourceSHA256':hashlib.sha256(source.read_bytes()).hexdigest(),'cropXYWH':[12,238,660,372],'candidate':str(candidate),'dimensions':[660,372],'threshold':0,'masks':[],'pixels':{'total':a.width*a.height,'mismatched':changed},'maeRGB8Bit':mae,'exactMatch':changed==0,'unknowns':['Original mesh assets, lighting rig, animation curves and font files were not supplied.','Source logical CSS viewport and pixel ratio are unknown. Comparison uses extracted physical pixels, one to one.','Source is compressed video; pixel variance remains present in its background.'],'scope':'One assembly frame only. This does not certify other frames, responsive layouts or motion.'}
(out/(prefix+'-comparison.json')).write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2));sys.exit(0 if changed==0 else 1)
