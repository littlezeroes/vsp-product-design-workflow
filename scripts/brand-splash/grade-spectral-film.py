"""Separate emerald crown reflections from violet/rose wing reflections.
Video color grade only: preserve neutral glass, gold metal and every original pixel position.
Run with Blender's bundled Python/numpy; no render is performed.
"""
import pathlib,subprocess,numpy as np
ROOT=pathlib.Path(__file__).resolve().parents[2]
PUBLIC=ROOT/'public/brand-splash/prismatic-glass'
FRAMES=ROOT/'output/vinclub-prismatic-glass/frames-spectral-v1'

def grade(raw):
 a=np.frombuffer(raw,dtype=np.uint8).reshape((1440,1440,3)).astype(np.float32)/255
 r,g,b=a[:,:,0],a[:,:,1],a[:,:,2]
 v=a.max(axis=2);low=a.min(axis=2);delta=v-low
 sat=delta/np.maximum(v,1e-6);safe=np.maximum(delta,1e-6)
 hue=np.where(v==r,((g-b)/safe)%6,np.where(v==g,(b-r)/safe+2,(r-g)/safe+4))/6
 y=np.arange(a.shape[0],dtype=np.float32)[:,None]/a.shape[0]
 # Restrict to already colored violet highlights at the top of the optical volume.
 mask=np.clip((.39-y)/.07,0,1)*(hue>.58)*(sat>.25)
 hue=(hue-.5*mask)%1;sat=np.minimum(.95,sat*(1+.16*mask))
 c=v*sat;x=c*(1-np.abs((hue*6)%2-1));m=v-c;sector=np.floor(hue*6).astype(np.int8)%6;z=np.zeros_like(c)
 out=np.stack([np.choose(sector,[c,x,z,z,x,c]),np.choose(sector,[x,c,c,x,z,z]),np.choose(sector,[z,z,x,c,c,x])],axis=2)
 return np.uint8(np.clip((out+m[:,:,None])*255+.5,0,255))

decoder=subprocess.Popen(['ffmpeg','-v','error','-i',str(PUBLIC/'intro-spectral-v1.mp4'),'-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
encoder=subprocess.Popen(['ffmpeg','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','1440x1440','-framerate','30','-i','-','-an','-c:v','libx264','-preset','medium','-crf','14','-profile:v','high','-level:v','4.1','-pix_fmt','yuv420p','-movflags','+faststart',str(PUBLIC/'intro-spectral-v2.mp4')],stdin=subprocess.PIPE)
for frame in range(1,73):
 raw=decoder.stdout.read(1440*1440*3)
 if len(raw)!=1440*1440*3:raise RuntimeError('Incomplete source video frame')
 encoder.stdin.write(grade(raw).tobytes())
encoder.stdin.close()
if encoder.wait():raise RuntimeError('Spectral video encoding failed')
decoder.stdout.close();decoder.wait()
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(PUBLIC/'poster-spectral-v1.png'),'-f','rawvideo','-pix_fmt','rgb24','-'])
subprocess.run(['ffmpeg','-y','-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size','1440x1440','-i','-','-frames:v','1',str(PUBLIC/'poster-spectral-v2.png')],input=grade(raw).tobytes(),check=True)
print('SPECTRAL_GRADE_COMPLETE',flush=True)
