import asyncio,edge_tts,pathlib,subprocess,json
root=pathlib.Path(__file__).parent;out=root/'voice';out.mkdir(exist_ok=True)
lines=[l.split('|',1) for l in (root/'vo.txt').read_text().strip().splitlines()]
async def main():
  res={}
  for k,t in lines:
    mp3=out/f'{k}.mp3'
    await edge_tts.Communicate(t,'vi-VN-HoaiMyNeural',rate='+6%',pitch='-2Hz').save(str(mp3))
    wav=out/f'{k}.wav'
    # trim leading/trailing silence, 48k mono
    subprocess.run(['ffmpeg','-y','-v','error','-i',str(mp3),'-af','silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse','-ar','48000','-ac','1',str(wav)],check=True)
    d=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(wav)],capture_output=True,text=True).stdout)
    res[k]={'text':t,'dur':round(d,3)};print(k,round(d,2),t)
  (root/'vo.json').write_text(json.dumps(res,ensure_ascii=False,indent=1))
asyncio.run(main())
