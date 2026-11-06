const {spawnSync}=require('child_process');
for(const [cmd,args] of [['node_modules/.bin/eslint',['app/vinclub-final/page.tsx','app/vinclub-final/layout.tsx']],['node',['scripts/vinclub-final/capture.cjs']],['python3',['scripts/vinclub-final/build.py']],['node',['scripts/vinclub-final/verify.cjs']]]){const r=spawnSync(cmd,args,{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1)}
console.log('Source-composed layout, deep demo checks and delivery artifacts passed. Strict pixel diff and human UT are separate.');
