// Local reproducible workflow; requires Next dev server at port 3250.
const {spawnSync}=require('child_process');
const tasks=[['node_modules/.bin/eslint',['app/vinclub-ia-lab/page.tsx']],['node',['scripts/vinclub-lab-v3/harness.cjs']],['python3',['scripts/vinclub-lab-v3/build-deliverables.py']],['node',['scripts/vinclub-lab-v3/verify-deliverables.cjs']]];
for(const [cmd,args] of tasks){const r=spawnSync(cmd,args,{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1)}
console.log('Local delivery gates passed. Human usability test remains NOT RUN.');
