# Figma Design Loop Agent

## Trigger
"design screen", "vẽ figma", "build figma screen"

## Purpose
Build a Figma screen using 100% DS, then QA check, auto-fix, re-check — loop until 0 issues.

## Workflow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  INPUT   │────▶│  BUILD   │────▶│   QA     │────▶│  DONE?   │
│ Screen   │     │ use_figma│     │ DS check │     │ 0 issues │
│ spec     │     │ 100% DS  │     │ inline   │     │          │
└──────────┘     └──────────┘     └──────────┘     └─────┬────┘
                                                         │
                                                    YES ─┤─ NO
                                                    │    │
                                                    ▼    ▼
                                               ✅ PASS  ┌──────────┐
                                                         │ AUTO-FIX │
                                                         │ + re-QA  │
                                                         └────┬─────┘
                                                              │
                                                         loop back ↑
```

## How to use

### Step 1: Define screen spec
```
Screen name: [Screen] Hoá đơn
Header: Large Title "Hoá đơn"
Sections:
  - SectionTitle "Loại dịch vụ"
  - Card with DataRow: Điện/Nước/Internet/Truyền hình
Bottom: Home Indicator
```

### Step 2: Run build + QA in single use_figma call

The script must:
1. Import all DS vars + styles + components
2. Build the screen frame (390×844, clip, vertical auto-layout)
3. Compose using ONLY component instances
4. Run QA check inline (same script)
5. If issues found → auto-fix → re-check
6. Return verdict + composition map

### Step 3: Screenshot verify
After script passes, take screenshot to visually verify.

## DS Component Usage Rules

### Available components
| Component | Source | Text override |
|---|---|---|
| VSP_Header | Library `82bdd0605a6725f57024015096e95b37e3b1bc2c` | ft() → loadFont → characters |
| VSP_Button/Brand | Library `6869c6f4bec418ff7a8d7b7cf9db7b290bad7ce8` | ft() → loadFont → characters |
| VSP_DataRow | Local component set | setProperties({[drKeys["Label"]]: ..., [drKeys["Value"]]: ...}) |
| VSP_SectionTitle | Local component | setProperties({[stKey]: "Title text"}) |
| VSP_Divider | Local component | No text — just fill with --bg/secondary |
| VSP_FixedBottom | Local component | Contains Button instance — override via ft() |

### Composition pattern
```
[Screen] (390×844)
├── VSP_Header instance → hide SearchBar/Description/progressStep
├── VSP_SectionTitle instance → setProperties title
├── Frame "Slot" (px-10)
│   └── Frame "Card" (rounded-16, shadow, px-12 py-4)
│       ├── VSP_DataRow instance → setProperties
│       └── VSP_DataRow instance → setProperties (last: Show Divider=false)
├── VSP_Divider instance
├── (repeat sections...)
├── VSP_FixedBottom instance (ABSOLUTE bottom)
└── Home Indicator Container (ABSOLUTE y=823)
```

### CRITICAL: DataRow in regular frames, NOT Section v2 slots
### CRITICAL: All colors via setBoundVariableForPaint, all text via textStyleId
### CRITICAL: Shadow = {type:"DROP_SHADOW", color:{r:0,g:0,b:0,a:0.08}, offset:{x:0,y:8}, radius:24, spread:0, visible:true, blendMode:"NORMAL"}

## QA Check (inline in build script)
```javascript
var issues=[];
function check(n,path){
  var cur=path+"/"+n.name;
  if(n.type==="INSTANCE"&&n.mainComponent&&n.mainComponent.remote)return;
  if(n.type==="TEXT"){
    if(!n.textStyleId)issues.push("NO_TEXT_STYLE: "+n.characters.substring(0,20));
    if(n.fills&&n.fills.length>0&&!(n.fills[0].boundVariables&&n.fills[0].boundVariables.color))
      issues.push("HARDCODED_TEXT_COLOR: "+n.characters.substring(0,20));
  }
  if(n.type==="FRAME"){
    var skip=["Slot","CTA","Home Indicator","Card","[Screen]"].some(function(s){return n.name.indexOf(s)>=0;});
    if(!skip&&n.fills&&n.fills.length>0&&n.fills[0].type==="SOLID"&&n.fills[0].visible!==false){
      if(!(n.fills[0].boundVariables&&n.fills[0].boundVariables.color))
        issues.push("HARDCODED_FRAME_COLOR: "+cur);
    }
  }
  try{if(n.children)for(var i=0;i<n.children.length;i++)check(n.children[i],cur);}catch(e){}
}
check(scr,"");
// Return: issues.length === 0 ? "✅ PASS" : "❌ FAIL (N issues)"
```

## Auto-fix patterns
| Issue | Fix |
|---|---|
| HARDCODED_TEXT_COLOR | `node.fills = [vP(V.fgP)]` |
| NO_TEXT_STYLE | `node.textStyleId = S.bXS.id` (Body/XS fallback) |
| HARDCODED_FRAME_COLOR | `node.fills = [vP(V.bgSec)]` |

---
Back: [[agents/index|Agents]] · [[knowledge/CLAUDE|Rules]]
