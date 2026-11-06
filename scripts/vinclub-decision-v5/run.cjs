const {spawnSync}=require('child_process');
for(const [cmd,args] of [['node_modules/.bin/eslint',['app/vinclub-decision-v5/page.tsx','app/vinclub-decision-v5/layout.tsx']],['node',['scripts/vinclub-decision-v5/harness.cjs']],['python3',['scripts/vinclub-decision-v5/build.py']],['node',['scripts/vinclub-decision-v5/verify.cjs']]]){const r=spawnSync(cmd,args,{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1)}
console.log('V5 local delivery passed; human UT and production integrations not run.');
