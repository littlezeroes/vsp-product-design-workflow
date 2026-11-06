const { chromium } = require('@playwright/test');
const fs = require('node:fs');
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = '1';

(async () => {
  const output = 'output/vinclub-web'; fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const reports = [];
  try {
    if(process.argv.includes('--map-intro-only')){
      const results=[];
      for(const theme of ['light','dark']){
        const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
        await page.goto('http://localhost:3000/vinclub-dualsurface/ui',{waitUntil:'domcontentloaded'});
        await page.waitForTimeout(700);await page.evaluate(t=>{localStorage.setItem('theme',t);document.documentElement.classList.toggle('dark',t==='dark');},theme);
        await page.locator('.ds-spaces').getByRole('button',{name:'VinClub',exact:true}).click();
        await page.locator('.ds-bottom').getByRole('button',{name:'Trải nghiệm',exact:true}).click();
        await page.waitForFunction(()=>{const v=document.querySelector('.mini-city-intro');return v&&v.currentTime>0&&!v.paused;},{},{timeout:15000});
        const source=await page.locator('.mini-city-intro').getAttribute('src');if(!source.includes(theme))throw Error('Wrong intro theme');
        await page.screenshot({path:`${output}/intro-${theme}-playing.png`,timeout:5000});
        await page.waitForFunction(()=>!document.querySelector('.mini-city-intro')&&document.querySelector('.dx-map .mini-city-host')?.dataset.renderer==='blender-webgl',{},{timeout:30000});
        await page.screenshot({path:`${output}/intro-${theme}-handoff.png`,timeout:5000});
        await page.getByRole('button',{name:'Khám phá Vincom',exact:true}).click();
        await page.waitForFunction(()=>document.querySelector('.dx-map .mini-city-host')?.dataset.cameraFocus==='vincom');
        if(errors.length)throw Error(errors.join('; '));results.push({theme,videoPlayed:true,handoff:true,interactiveMap:true,errors});console.log(JSON.stringify(results.at(-1)));await page.close();
      }
      const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await reduced.goto('http://localhost:3000/vinclub-dualsurface/ui');await reduced.locator('.ds-spaces').getByRole('button',{name:'VinClub',exact:true}).click();await reduced.locator('.ds-bottom').getByRole('button',{name:'Trải nghiệm',exact:true}).click();await reduced.waitForFunction(()=>document.querySelector('.dx-map .mini-city-host')?.dataset.renderer==='blender-webgl');await reduced.waitForTimeout(800);if(await reduced.locator('.mini-city-intro').count())throw Error('Reduced motion still showing intro');await reduced.close();results.push({reducedMotion:true});fs.writeFileSync(`${output}/intro-report.json`,JSON.stringify(results,null,2));return;
    }
    if(process.argv.includes('--experiences-only')){
      const results=[];
      for(const theme of ['light','dark']){
        const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
        try{
          await page.goto('http://localhost:3000/vinclub-dualsurface/ui',{waitUntil:'domcontentloaded'});await page.evaluate(t=>document.documentElement.classList.toggle('dark',t==='dark'),theme);
          await page.locator('.ds-spaces').getByRole('button',{name:'VinClub',exact:true}).click();await page.locator('.ds-bottom').getByRole('button',{name:'Trải nghiệm',exact:true}).click();
          const root=page.locator('.dx-root');await root.waitFor();if(await page.locator('.ds-dark-header').count())throw Error('Experience page still has the top header');
          await page.waitForFunction(()=>!document.querySelector('.mini-city-intro')&&document.querySelector('.dx-map .mini-city-host')?.dataset.renderer==='blender-webgl',{},{timeout:30000});
          await page.waitForTimeout(800);const canvas=await root.locator('canvas').boundingBox();if(canvas.y!==0||canvas.height<840)throw Error('Experience map does not fill viewport '+JSON.stringify(canvas));
          const sheet=await root.locator('.dx-sheet').boundingBox();if(Math.abs(sheet.x)>1||Math.abs(sheet.width-canvas.width)>1||sheet.y<300||sheet.y>600)throw Error('Experience sheet is not floating over map');
          await page.screenshot({path:`${output}/experience-${theme}-map-entry.png`,timeout:5000});
          const categories=root.getByRole('navigation',{name:'Loại trải nghiệm'});
          for(const [category,id] of [['Đi chợ','winmart'],['Chăm sóc','vinmec'],['Mua sắm','vincom']]){
            const categoryButton=categories.getByRole('button',{name:category,exact:true});await categoryButton.evaluate(e=>e.scrollIntoView({block:'nearest',inline:'center'}));await categoryButton.click();await page.waitForTimeout(500);const pins=await root.locator('.mini-city-pin').evaluateAll(es=>es.filter(e=>getComputedStyle(e).visibility!=='hidden').map(e=>e.dataset.placeId));if(!pins.length||pins.some(p=>id==='vincom'?!p.startsWith(id):p!==id))throw Error('Category map pins mismatch '+JSON.stringify({category,pins}));if(await root.locator('.ds-experience-option').count()!==1)throw Error('Category results mismatch '+category);
          }
          await categories.getByRole('button',{name:'Tất cả',exact:true}).evaluate(e=>e.scrollIntoView({block:'nearest',inline:'center'}));await categories.getByRole('button',{name:'Tất cả',exact:true}).click();await page.waitForTimeout(1300);await root.getByRole('button',{name:'Khám phá Vincom',exact:true}).click();await page.waitForFunction(()=>{const p=Number(document.querySelector('.dx-map .mini-city-host')?.dataset.rotationProgress);return p>0&&p<1;});await page.waitForTimeout(1250);await root.getByRole('heading',{name:'Một ngày ở Vincom',exact:true}).waitFor();
          await root.getByRole('button',{name:'Mở rộng trải nghiệm',exact:true}).click();
          for(const [id,name] of [['may','Mây Studio'],['lumi','Lumi Beauty'],['pulse','Pulse Lab']]){const entry=root.getByRole('button',{name:`Vào store 3D ${name}`,exact:true});await entry.evaluate(e=>e.scrollIntoView({block:'center'}));await entry.click();const shopping=page.getByRole('dialog',{name:'Mua sắm tại Vincom',exact:true});await shopping.locator(`.mini-city-host[data-asset="store-${id}"][data-renderer="blender-webgl"]`).waitFor({timeout:30000});await page.screenshot({path:`${output}/experience-${theme}-store-${id}.png`,timeout:5000});await shopping.getByRole('button',{name:'Đóng mua sắm',exact:true}).click();}
          await root.getByRole('button',{name:'Xem showroom 3D',exact:true}).click();const shop=page.getByRole('dialog',{name:'Mua sắm tại Vincom',exact:true});await shop.locator('.mini-city-host[data-asset="mall"][data-renderer="blender-webgl"]').waitFor({timeout:30000});await shop.locator('.sj-store').filter({hasText:'Mây Studio'}).click();await shop.locator('.sj-products .sj-product').first().getByRole('button',{name:'Xem sản phẩm',exact:true}).click();await shop.locator('.mini-city-host[data-asset="product-sneakers"][data-renderer="blender-webgl"]').waitFor({timeout:30000});await shop.getByRole('button',{name:/Thêm vào giỏ/}).click();await shop.getByRole('button',{name:'Tiếp tục đặt hàng',exact:true}).click();await shop.getByLabel('Người nhận',{exact:true}).fill('Minh Anh');await shop.getByLabel('Số điện thoại',{exact:true}).fill('0901234567');await shop.getByLabel('Địa chỉ giao hàng',{exact:true}).fill('12 Sao Biển, Vinhomes Ocean Park, Hà Nội');await shop.getByRole('button',{name:'Chọn thanh toán',exact:true}).click();if(theme==='light'){await shop.getByRole('button',{name:/Ví trả sau Hạn mức/}).click();await shop.getByRole('button',{name:'6 kỳ',exact:true}).click();}await shop.getByRole('button',{name:'Kiểm tra đơn hàng',exact:true}).click();await shop.getByRole('button',{name:'Xác nhận đặt hàng demo',exact:true}).click();for(let i=0;i<3;i++){const next=shop.getByRole('button',{name:'Tiếp tục hành trình demo',exact:true});if(await next.isVisible())await next.click();}await page.locator('.sj-view-delivered').waitFor({timeout:15000});await page.screenshot({path:`${output}/experience-${theme}-shopping-delivered.png`,timeout:5000});await shop.getByRole('button',{name:'Đóng mua sắm',exact:true}).click();
          await (await root.getAttribute('data-sheet')==='full'?root.getByRole('button',{name:'Quay lại khám phá bản đồ',exact:true}):root.getByRole('button',{name:'Về toàn cảnh trải nghiệm',exact:true})).click();await categories.getByRole('button',{name:'Sự kiện',exact:true}).evaluate(e=>e.scrollIntoView({block:'nearest',inline:'center'}));await categories.getByRole('button',{name:'Sự kiện',exact:true}).click();await page.waitForTimeout(1300);await root.getByRole('button',{name:'Mở Sự kiện trên bản đồ 3D',exact:true}).click();await page.waitForTimeout(1300);await root.getByRole('heading',{name:'Ngày hội tại Ocean Park',exact:true}).waitFor();
          await page.screenshot({path:`${output}/experience-${theme}-map-detail.png`,timeout:5000});
          await root.getByRole('button',{name:'Đặt vé sự kiện',exact:true}).click();const booking=page.getByRole('dialog');await booking.waitFor();const date=booking.getByLabel('Ngày tham dự');await date.fill(await date.getAttribute('min'));await booking.getByRole('button',{name:'18:30',exact:true}).click();await booking.getByRole('button',{name:/Premium ·/}).click();await booking.getByLabel('Số vé').fill('0');if(!await booking.getByRole('button',{name:'Tiếp tục thanh toán',exact:true}).isDisabled())throw Error('Invalid ticket quantity accepted');await booking.getByLabel('Số vé').fill('2');await booking.getByRole('button',{name:'Tiếp tục thanh toán',exact:true}).click();if(!await booking.getByText('560.000đ',{exact:true}).count())throw Error('Ticket total mismatch');await booking.getByRole('button',{name:'Xác nhận thanh toán demo',exact:true}).click();await booking.getByRole('heading',{name:'Đặt vé thành công',exact:true}).waitFor();const ticketCode=await booking.locator('[data-ticket-code]').textContent();await page.screenshot({path:`${output}/experience-${theme}-ticket-receipt.png`,timeout:5000});await booking.getByRole('button',{name:'Hoàn tất',exact:true}).click();
          if(!await root.locator('#dx-trips').getByText('Ngày hội tại Ocean Park',{exact:true}).count())throw Error('Booked trip was not retained');
          await page.locator('.ds-bottom').getByRole('button',{name:'Trang chủ',exact:true}).click();if(await page.locator('.ds-dark-header').count()!==1)throw Error('Home header not restored');await page.locator('.ds-bottom').getByRole('button',{name:'Trải nghiệm',exact:true}).click();await page.getByRole('button',{name:'Xem chuyến đi đã lên lịch',exact:true}).click();await page.locator('#dx-trips').getByText('Ngày hội tại Ocean Park',{exact:true}).waitFor();
          const savedTicket=page.locator('#dx-trips').getByRole('button',{name:'Xem vé',exact:true});await savedTicket.evaluate(e=>e.scrollIntoView({block:'center'}));await savedTicket.click();if(await page.getByRole('dialog').locator('[data-ticket-code]').textContent()!==ticketCode)throw Error('Saved ticket code changed');await page.getByRole('dialog').getByRole('button',{name:'Hoàn tất',exact:true}).click();
          const liveRoot=page.locator('.dx-root');await (await liveRoot.getAttribute('data-sheet')==='full'?liveRoot.getByRole('button',{name:'Quay lại khám phá bản đồ',exact:true}):liveRoot.getByRole('button',{name:'Về toàn cảnh trải nghiệm',exact:true})).click();await liveRoot.getByRole('button',{name:'Khám phá Vincom',exact:true}).click();await page.waitForTimeout(1300);await liveRoot.getByRole('button',{name:'Mua online',exact:true}).click();const catalog=page.getByRole('dialog',{name:'Mua sắm tại Vincom',exact:true});await catalog.getByRole('heading',{name:'Chọn không gian của bạn',exact:true}).waitFor();if(await catalog.locator('canvas').count())throw Error('Online catalog unnecessarily opened 3D');await catalog.locator('.sj-store').filter({hasText:'Mây Studio'}).click();await catalog.getByRole('button',{name:'Xem nội thất 3D',exact:true}).waitFor();if(await catalog.locator('canvas').count())throw Error('Store catalog unnecessarily opened 3D');await catalog.getByRole('button',{name:'Đóng mua sắm',exact:true}).click();await (await liveRoot.getAttribute('data-sheet')==='full'?liveRoot.getByRole('button',{name:'Quay lại khám phá bản đồ',exact:true}):liveRoot.getByRole('button',{name:'Về toàn cảnh trải nghiệm',exact:true})).click();await liveRoot.getByRole('navigation',{name:'Loại trải nghiệm'}).getByRole('button',{name:'Đi chợ',exact:true}).click();await liveRoot.locator('.ds-experience-option').click();const market=page.getByRole('dialog',{name:'Mua sắm tại WinMart',exact:true});await market.getByRole('heading',{name:'Chuẩn bị bữa ăn. Mua sắm mỗi ngày.',exact:true}).waitFor();if(await market.locator('canvas').count())throw Error('WinMart mounted a 3D scene');await page.waitForTimeout(800);const marketTop=await market.locator('.sj-scroll').evaluate(e=>parseFloat(getComputedStyle(e).top));if(Math.abs(marketTop-110)>1)throw Error('WinMart catalog is not a full page '+marketTop);await page.screenshot({path:`${output}/experience-${theme}-winmart-store.png`,timeout:5000});await market.locator('.sj-product').first().getByRole('button',{name:'Xem sản phẩm',exact:true}).click();if(await market.locator('canvas').count())throw Error('WinMart product mounted 3D');await market.getByRole('button',{name:/Thêm vào giỏ/}).click();await market.getByRole('heading',{name:'Những món bạn đã chọn',exact:true}).waitFor();if(!await market.getByText('59.000đ',{exact:true}).count())throw Error('WinMart cart missing correct product price');await market.getByRole('button',{name:'Đóng mua sắm',exact:true}).click();
          if(errors.length)throw Error(errors.join('; '));const result={theme,headerRemoved:true,fullscreenMap:true,fullWidthSheet:true,entranceAnimation:true,exploreAnimation:true,categoryFilters:true,tagClick:true,mall3D:true,stores3D:3,optional3D:true,onlineCatalog2D:true,winmart2D:true,winmartCart:true,product3D:true,checkout:true,payment:theme==='light'?'BNPL 6 kỳ':'Tiền ví',GreenSMDelivery:true,ticketBooking:true,ticketOptions:true,ticketReceipt:true,ticketReopened:true,tabNavigation:true,errors};results.push(result);console.log(JSON.stringify(result));
        }catch(e){results.push({theme,failed:e.message,errors});console.log(JSON.stringify(results.at(-1)));await page.screenshot({path:`${output}/experience-${theme}-failure.png`,timeout:5000}).catch(()=>{});}await page.close();
      }
      fs.writeFileSync(`${output}/experiences-report.json`,JSON.stringify(results,null,2));if(results.some(r=>r.failed))process.exitCode=1;return;
    }
    if(process.argv.includes('--detail-city-only')||process.argv.includes('--palette-only')||process.argv.includes('--map-explorer-only')) {
      const detailReports=[];
      for(const name of ['daily','dualsurface'].filter(n=>!process.argv.includes('--dualsurface-only')||n==='dualsurface'))for(const theme of ['light','dark']){
        const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
        try{
          await page.goto(`http://localhost:3000/vinclub-${name}/ui`,{waitUntil:'domcontentloaded'});
          await page.evaluate(t=>document.documentElement.classList.toggle('dark',t==='dark'),theme);
          if(name==='daily'){
            await page.getByRole('navigation',{name:'Điều hướng chính'}).getByRole('button',{name:'Thanh toán',exact:true}).click();
            await page.getByRole('button',{name:'Mở Mua sắm',exact:true}).click();
          }else if(await page.getByRole('button',{name:'Mở bản đồ toàn màn hình',exact:true}).count())await page.getByRole('button',{name:'Mở bản đồ toàn màn hình',exact:true}).first().click();else{await page.getByRole('navigation',{name:'Không gian VinClub'}).getByRole('button',{name:'VinClub',exact:true}).click();await page.getByRole('button',{name:'Mua sắm',exact:true}).first().click();}
          const journey=page.getByRole('dialog',{name:'Mua sắm tại Vincom',exact:true});const breadcrumb=journey.getByRole('navigation',{name:'Vị trí trong hành trình'});
          if(process.argv.includes('--map-explorer-only')){await page.waitForFunction(()=>{const e=document.querySelector('.cx-map .mini-city-host');const p=Number(e?.dataset.entranceProgress);return e?.dataset.renderer==='blender-webgl'&&p>0&&p<1;},{},{timeout:30000});await page.waitForFunction(()=>document.querySelector('.cx-map .mini-city-host')?.dataset.entranceProgress==='1.000');await page.screenshot({path:`${output}/${name}-${theme}-map-entry.png`,timeout:5000});}
          await breadcrumb.getByRole('button',{name:'Thành phố',exact:true}).click();
          const host=journey.locator('.sj-scene .mini-city-host');await host.locator('canvas').waitFor();
          await page.waitForFunction(()=>document.querySelector('.sj-scene .mini-city-host')?.dataset.renderer==='blender-webgl'&&Math.abs(JSON.parse(document.querySelector('.sj-scene .mini-city-host').dataset.cameraTarget||'[0,0,0]')[1]-.6)<.0001);await page.waitForTimeout(1450);
          const overview=await host.evaluate(e=>({target:e.dataset.cameraTarget,position:e.dataset.cameraPosition}));
          if(process.argv.includes('--map-explorer-only')){
            const canvas=await host.locator('canvas').boundingBox();if(canvas.y>1||canvas.height<840)throw Error('Map canvas is not fullscreen '+JSON.stringify(canvas));
            const root=journey;const sheet=await root.locator('.cx-sheet').boundingBox();const footer=await root.locator('.cx-bottom').boundingBox();if(Math.abs(sheet.x)>1||Math.abs(sheet.width-canvas.width)>1||sheet.y<canvas.y||sheet.y>canvas.height*.7||footer.y<sheet.y||footer.y+footer.height>sheet.y+sheet.height+1)throw Error('Sheet does not float over the map with an internal footer');
            for(const [label,category,ids] of [['Mua sắm','vincom',['vincom','vincom-center','vincom-plaza']],['Đi chợ','winmart',['winmart']],['Chăm sóc','vinmec',['vinmec']],['Sự kiện','events',['events']]]){await root.getByRole('navigation',{name:'Danh mục khám phá'}).getByRole('button',{name:label,exact:true}).click();await page.waitForTimeout(400);if(await root.getAttribute('data-category')!==category)throw Error('Category did not change '+category);const pins=await root.locator('.mini-city-pin').evaluateAll(es=>es.filter(e=>getComputedStyle(e).visibility!=='hidden').map(e=>e.dataset.placeId));if(!pins.length||pins.some(id=>!ids.includes(id)))throw Error('Unrelated map tags remain after filtering '+JSON.stringify({category,pins}));const cards=await root.locator('.cx-result-list .cx-result').count();if(cards!==ids.length)throw Error('Sheet result count mismatch '+category+' '+cards);}
            await root.getByRole('navigation',{name:'Danh mục khám phá'}).getByRole('button',{name:'Tất cả',exact:true}).click();await breadcrumb.getByRole('button',{name:'Thành phố',exact:true}).click();await page.waitForTimeout(1200);await root.getByRole('button',{name:'Khám phá Vincom',exact:true}).click();await page.waitForFunction(()=>{const p=Number(document.querySelector('.cx-map .mini-city-host')?.dataset.rotationProgress);return p>0&&p<1;});await page.waitForTimeout(1250);if(await host.getAttribute('data-camera-focus')!=='vincom')throw Error('Explore CTA did not focus Vincom');await page.screenshot({path:`${output}/${name}-${theme}-map-explore.png`,timeout:5000});await breadcrumb.getByRole('button',{name:'Thành phố',exact:true}).click();await page.waitForTimeout(1200);
            await root.getByRole('button',{name:'Mở rộng sheet',exact:true}).click();await page.waitForTimeout(600);if(await root.getAttribute('data-sheet')!=='half')throw Error('Sheet did not open halfway');
            const grabber=root.locator('.cx-grabber');const g=await grabber.boundingBox();await page.mouse.move(g.x+g.width/2,g.y+g.height/2);await page.mouse.down();await page.mouse.move(g.x+g.width/2,g.y-130,{steps:10});await page.mouse.up();await page.waitForTimeout(600);if(await root.getAttribute('data-sheet')!=='full')throw Error('Sheet drag did not expand');
            await root.getByRole('textbox',{name:'Tìm địa điểm hoặc nhu cầu'}).fill('Vinmec');await root.locator('.cx-result-list').getByRole('button',{name:/Vinmec/}).click();await page.waitForFunction(()=>{const p=Number(document.querySelector('.cx-map .mini-city-host')?.dataset.rotationProgress);return p>0&&p<1;},{},{timeout:5000});
            const moving=await host.evaluate(e=>({progress:Number(e.dataset.rotationProgress),position:e.dataset.cameraPosition}));if(!(moving.progress>0&&moving.progress<1))throw Error('Click animation is not visibly in progress '+JSON.stringify(moving));await page.waitForTimeout(1250);
            await root.getByRole('button',{name:'Lưu điểm đến',exact:true}).click();await root.getByRole('button',{name:'Xoay lại điểm đến',exact:true}).click();await page.waitForFunction(()=>{const progress=Number(document.querySelector('.sj-scene .mini-city-host')?.dataset.rotationProgress);return progress>0&&progress<1;},{},{timeout:5000});const replay=await host.getAttribute('data-rotation-progress');if(!(Number(replay)>0&&Number(replay)<1))throw Error('Rotation replay did not animate');await page.waitForTimeout(1250);
            await page.screenshot({path:`${output}/${name}-${theme}-fullscreen-map.png`,timeout:5000});
            await breadcrumb.getByRole('button',{name:'Thành phố',exact:true}).click();await page.waitForTimeout(1450);await root.getByRole('button',{name:'Mở rộng sheet',exact:true}).click();await root.getByRole('button',{name:'Xem lịch trình',exact:true}).click();await root.locator('.cx-itinerary').getByRole('button',{name:/Vincom/}).click();await page.waitForTimeout(1450);await root.getByRole('button',{name:'Xem store · mua online',exact:true}).click();await journey.getByRole('heading',{name:'Chọn không gian của bạn',exact:true}).waitFor({timeout:10000});
            if(errors.length)throw Error(errors.join('; '));const result={name,theme,fullscreen:true,floatingSheet:true,entranceAnimation:true,exploreAnimation:true,categoryFiltering:true,mapTags:true,sheetDrag:true,search:true,clickAnimation:true,replayAnimation:true,savedPlace:true,itinerary:true,storeEntry:true,errors};detailReports.push(result);console.log(JSON.stringify(result));await page.close();continue;
          }
          if(process.argv.includes('--palette-only')){await page.screenshot({path:`${output}/${name}-${theme}-vivid-palette.png`,timeout:5000});if(errors.length)throw Error(errors.join('; '));const result={name,theme,rendered:true,errors};detailReports.push(result);console.log(JSON.stringify(result));await page.close();continue;}
          await journey.locator('.sj-landmark-rail').getByRole('button',{name:'WinMart',exact:true}).click();
          await page.waitForTimeout(1450);
          const detail=await host.evaluate(e=>({target:e.dataset.cameraTarget,position:e.dataset.cameraPosition,stage:e.dataset.viewStage,fixed:e.dataset.fixedView}));
          if(detail.stage!=='detail'||detail.fixed!=='false'||detail.position===overview.position)throw Error('Landmark selection did not animate to detail');
          const box=await host.locator('canvas').boundingBox();await page.mouse.move(box.x+box.width*.4,box.y+box.height*.4);await page.mouse.down();await page.mouse.move(box.x+box.width*.65,box.y+box.height*.4,{steps:12});await page.mouse.up();await page.waitForTimeout(500);
          const rotated=await host.getAttribute('data-camera-position');if(rotated===detail.position)throw Error('Detail drag does not rotate');
          await page.screenshot({path:`${output}/${name}-${theme}-map-detail.png`,timeout:5000});
          await breadcrumb.getByRole('button',{name:'Thành phố',exact:true}).click();await page.waitForTimeout(1450);
          const reset=await host.evaluate(e=>({target:e.dataset.cameraTarget,position:e.dataset.cameraPosition,stage:e.dataset.viewStage,fixed:e.dataset.fixedView}));
          const near=(a,b)=>JSON.parse(a).every((v,i)=>Math.abs(v-JSON.parse(b)[i])<.0001);
          if(reset.stage!=='city'||reset.fixed!=='true'||!near(reset.position,overview.position)||!near(reset.target,overview.target))throw Error('Overview did not restore '+JSON.stringify({overview,reset}));
          await journey.locator('.sj-landmark-rail').getByRole('button',{name:'Vincom',exact:true}).click();await page.waitForTimeout(1450);
          await journey.getByRole('button',{name:/Xem store/}).click();await journey.getByRole('heading',{name:'Chọn không gian của bạn',exact:true}).waitFor({timeout:10000});
          if(errors.length)throw Error(errors.join('; '));const result={name,theme,detailAnimation:true,dragRotate:true,overviewRestored:true,storeEntry:true,errors};detailReports.push(result);console.log(JSON.stringify(result));
        }catch(e){detailReports.push({name,theme,failed:e.message,errors,hosts:await page.locator('.sj-scene .mini-city-host').evaluateAll(es=>es.map(e=>({...e.dataset}))).catch(()=>[])});console.log(JSON.stringify(detailReports.at(-1)));}
        await page.close();
      }
      fs.writeFileSync(`${output}/${process.argv.includes("--palette-only")?"palette-report":process.argv.includes("--map-explorer-only")?"map-explorer-report":"detail-city-report"}.json`,JSON.stringify(detailReports,null,2));if(detailReports.some(r=>r.failed))process.exitCode=1;return;
    }
    if(process.argv.includes('--fixed-city-only')) {
      const finalReports=[];
      const sameCamera=(a,b)=>["cameraPosition","cameraTarget"].every(key=>{const before=JSON.parse(a[key]||"[]"),after=JSON.parse(b[key]||"[]");return before.length===3&&after.length===3&&before.every((value,index)=>Math.abs(value-after[index])<1e-6);});
      for(const name of ['daily','dualsurface'])for(const mode of ['light','dark']){
        const page=await browser.newPage({viewport:{width:390,height:844}});
        const errors=[];page.on('pageerror',error=>errors.push(error.message));
        try{
          await page.goto(`http://localhost:3000/vinclub-${name}/ui`,{waitUntil:'domcontentloaded'});
          await page.evaluate(mode=>document.documentElement.classList.toggle('dark',mode==='dark'),mode);
          if(!page.url().includes(`/vinclub-${name}/ui`))throw Error(`Unexpected route ${page.url()}`);
          if(name==='daily'){
            await page.getByRole('navigation',{name:'Điều hướng chính'}).getByRole('button',{name:'Thanh toán',exact:true}).click();
            await page.getByRole('button',{name:'Mở Mua sắm',exact:true}).click();
            await page.getByRole('navigation',{name:'Vị trí trong hành trình'}).getByRole('button',{name:'Thành phố',exact:true}).click();
          }else await page.getByRole('button',{name:'Mở bản đồ toàn màn hình',exact:true}).first().click();
          const journey=page.getByRole('dialog',{name:'Mua sắm tại Vincom',exact:true});
          const city=journey.locator('.mini-city[data-map-mode="city"]');
          const host=city.locator('[data-renderer="blender-webgl"]');await host.waitFor({timeout:30000});
          for(const label of ['Trái đất đến thành phố','Phóng to bản đồ 3D','Thu nhỏ bản đồ 3D','Góc nhìn đường phố'])if(await city.getByRole('button',{name:label,exact:true}).count())throw Error(`Fixed city still exposes ${label}`);
          await journey.locator(".mini-city-host[data-camera-position][data-camera-target]").waitFor({timeout:30000});
          await page.waitForFunction(()=>{const target=document.querySelector(".sj-scene .mini-city-host")?.dataset.cameraTarget;return target&&Math.abs(JSON.parse(target)[1]-.6)<1e-6;});
          await page.waitForTimeout(700);
          const before=await host.evaluate(el=>({cameraPosition:el.dataset.cameraPosition,cameraTarget:el.dataset.cameraTarget}));
          const box=await host.locator('canvas').boundingBox();
          await page.mouse.move(box.x+box.width*.4,box.y+box.height*.7);await page.mouse.down();await page.mouse.move(box.x+box.width*.6,box.y+box.height*.6,{steps:12});await page.mouse.up();
          await page.waitForTimeout(700);
          const after=await host.evaluate(el=>({cameraPosition:el.dataset.cameraPosition,cameraTarget:el.dataset.cameraTarget}));
          if(!sameCamera(before,after))throw Error(`Fixed-view city moved on drag: ${JSON.stringify({before,after})}`);
          await page.mouse.wheel(0,-300);
          await page.waitForTimeout(300);
          const afterWheel=await host.evaluate(el=>({cameraPosition:el.dataset.cameraPosition,cameraTarget:el.dataset.cameraTarget}));
          if(!sameCamera(before,afterWheel))throw Error('Fixed-view city moved on wheel');
          await page.screenshot({path:`${output}/${name}-${mode}-fixed-city.png`});
          let physicalModelClick;
          if(name==='daily'&&mode==='light'){
            const canvas=host.locator('canvas');const bounds=await canvas.boundingBox();
            physicalModelClick=false;
            scan:for(let fy=.18;fy<.9;fy+=.08)for(let fx=.1;fx<.92;fx+=.08){
              const x=bounds.x+bounds.width*fx,y=bounds.y+bounds.height*fy;
              const onCanvas=await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.tagName==='CANVAS',{x,y});
              if(!onCanvas)continue;await page.mouse.move(x,y);
              if(await canvas.evaluate(el=>el.style.cursor)==='pointer'){
                await page.mouse.click(x,y);await page.waitForTimeout(100);
                if(await page.locator('.sj-view-landmark').count()||!(await page.locator('.sj-city-explore').count())){physicalModelClick=true;break scan;}
              }
            }
            if(!physicalModelClick)throw Error('No actionable physical POI found on fixed city mesh');
            await page.waitForTimeout(500);await page.screenshot({path:`${output}/daily-light-physical-city-click.png`});
            await journey.getByRole('navigation',{name:'Vị trí trong hành trình'}).getByRole('button',{name:'Thành phố',exact:true}).click();
          }
          await journey.locator('.sj-landmark-rail').getByRole('button',{name:'WinMart',exact:true}).click();
          await page.locator('.sj-view-landmark').waitFor();
          await page.waitForTimeout(700);
          const afterSelection=await host.evaluate(el=>({cameraPosition:el.dataset.cameraPosition,cameraTarget:el.dataset.cameraTarget}));
          if(!sameCamera(before,afterSelection))throw Error(`Fixed-view city moved on landmark selection: ${JSON.stringify({before,afterSelection})}`);
          await page.screenshot({path:`${output}/${name}-${mode}-fixed-city-landmark.png`});
          await journey.getByRole('button',{name:'Lưu danh sách mua sắm',exact:true}).click();
          await journey.getByRole('navigation',{name:'Vị trí trong hành trình'}).getByRole('button',{name:'Thành phố',exact:true}).click();
          await journey.locator('.sj-landmark-rail').getByRole('button',{name:'Vincom',exact:true}).click();
          await journey.getByRole('button',{name:'Xem store',exact:false}).click();
          await journey.getByRole('button',{name:'Mây Studio',exact:false}).last().click();
          await journey.locator('[data-asset="store-may"][data-renderer="blender-webgl"]').waitFor({timeout:30000});
          finalReports.push({name,mode,route:page.url(),fixedCity:true,noEarth:true,noZoom:true,dragDoesNotMove:true,wheelDoesNotMove:true,landmarkDoesNotMove:true,physicalModelClick,landmarkAction:true,storeEntry:true,errors});
        }catch(error){finalReports.push({name,mode,failed:error.message,errors});await page.screenshot({path:`${output}/${name}-${mode}-fixed-city-failure.png`,timeout:10000}).catch(()=>{});}
        console.log(JSON.stringify(finalReports.at(-1)));
        fs.writeFileSync(`${output}/fixed-city-report.json`,JSON.stringify(finalReports,null,2));
        await page.close();
      }
      fs.writeFileSync(`${output}/fixed-city-report.json`,JSON.stringify(finalReports,null,2));
      if(finalReports.some(report=>report.failed||report.errors.length))process.exitCode=1;return;
    }
    if(process.argv.includes('--products-only')) {
      const page=await browser.newPage({viewport:{width:390,height:844}});
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      await page.goto('http://localhost:3000/vinclub-daily/ui',{waitUntil:'networkidle'});
      await page.getByRole('navigation',{name:'Điều hướng chính'}).getByRole('button',{name:'Thanh toán',exact:true}).click();
      await page.getByRole('button',{name:'Mở Mua sắm',exact:true}).click();
      const journey=page.getByRole('dialog',{name:'Mua sắm tại Vincom',exact:true});
      await journey.getByRole('button',{name:'Xem store',exact:false}).click();
      for(const store of [{name:'Lumi Beauty',asset:'serum'},{name:'Pulse Lab',asset:'headphones'}]) {
        if(store.asset==='headphones') {
          await journey.getByRole('navigation',{name:'Vị trí trong hành trình'}).getByRole('button',{name:'Lumi Beauty',exact:true}).click();
          await journey.locator('.sj-showroom-switcher').getByRole('button',{name:'Pulse Lab',exact:true}).click();
        } else await journey.getByRole('button',{name:'Lumi Beauty',exact:false}).last().click();
        await journey.getByRole('button',{name:'Xem sản phẩm',exact:false}).first().click();
        const host=journey.locator(`[data-renderer="blender-webgl"][data-asset="product-${store.asset}"]`);
        await host.waitFor({timeout:30000});
        const bounds=await host.locator('canvas').boundingBox();
        await page.mouse.move(bounds.x+bounds.width*.4,bounds.y+bounds.height*.65);await page.mouse.down();
        await page.mouse.move(bounds.x+bounds.width*.65,bounds.y+bounds.height*.6,{steps:12});await page.mouse.up();
        await journey.getByRole('button',{name:'Khám phá cấu tạo',exact:true}).click();
        await host.locator('xpath=self::*[@data-product-exploded="true"]').waitFor();
        await page.waitForTimeout(900);
        await page.screenshot({path:`${output}/daily-final-${store.asset}-exploded.png`});
        await journey.getByRole('button',{name:'Lắp lại',exact:true}).click();
        await host.locator('xpath=self::*[@data-product-exploded="false"]').waitFor();
      }
      const report={products:['serum','headphones'],actualBlenderGLB:true,rotation:true,explodedToggle:true,errors};
      fs.writeFileSync(`${output}/products-report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));await page.close();return;
    }
    if(process.argv.includes('--repeat-only')) {
      const page=await browser.newPage({viewport:{width:390,height:844}});
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      await page.goto('http://localhost:3000/vinclub-atlas/ui',{waitUntil:'networkidle'});
      await page.evaluate(()=>sessionStorage.setItem('vinclub-shopping-demo-order-v1',JSON.stringify({id:'VC-DEMO-RESTORED',lines:[{productId:'cloud',size:'36',color:'Trắng ngà',quantity:1}],address:{recipient:'Minh Anh',phone:'0901234567',address:'Số 24 Sao Biển, Vinhomes Ocean Park, Hà Nội'},source:'wallet',months:0,subtotal:1290000,shipping:25000,fee:0,total:1315000,progress:100,status:'delivered'})));
      await page.getByRole('button',{name:'Khám phá Vincom Ocean Park',exact:true}).click();
      const journey=page.getByRole('dialog',{name:'Mua sắm tại Vincom',exact:true});
      await page.locator('.sj-view-delivered').waitFor();
      await journey.getByRole('button',{name:'Tiếp tục mua sắm',exact:true}).click();
      await page.locator('.sj-view-mall').waitFor();
      if(await page.evaluate(()=>sessionStorage.getItem('vinclub-shopping-demo-order-v1'))!==null)throw Error('Previous delivered session was not cleared');
      if(!(await journey.getByRole('button',{name:'Xem giỏ hàng',exact:false}).isDisabled()))throw Error('New shopping cart was not empty');
      await journey.getByRole('button',{name:'Mây Studio',exact:false}).last().click();
      await journey.getByRole('button',{name:'Xem sản phẩm',exact:false}).first().click();
      await journey.getByRole('button',{name:'Thêm vào giỏ',exact:false}).click();
      await journey.getByRole('button',{name:'Tiếp tục đặt hàng',exact:true}).click();
      await journey.getByLabel('Người nhận',{exact:true}).fill('Minh Anh');
      await journey.getByLabel('Số điện thoại',{exact:true}).fill('0901234567');
      await journey.getByLabel('Địa chỉ giao hàng',{exact:true}).fill('Số 24 Sao Biển, Vinhomes Ocean Park, Hà Nội');
      await journey.getByRole('button',{name:'Chọn thanh toán',exact:true}).click();
      await journey.getByRole('button',{name:'Kiểm tra đơn hàng',exact:true}).click();
      await journey.getByRole('button',{name:'Xác nhận đặt hàng demo',exact:true}).click();
      await page.locator('.sj-view-tracking').waitFor();
      const saved=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('vinclub-shopping-demo-order-v1')));
      if(saved.id==='VC-DEMO-RESTORED'||saved.status!=='shipping'||saved.lines.length!==1)throw Error('New order did not replace restored delivered order');
      const report={name:'atlas',mode:'light',restoredDeliveredFixture:true,sessionCleared:true,cartCleared:true,secondOrderConfirmed:true,errors};
      await page.screenshot({path:`${output}/atlas-repeat-purchase.png`});
      fs.writeFileSync(`${output}/repeat-report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));await page.close();return;
    }
    if(process.argv.includes('--snapshot-only')) {
      const page=await browser.newPage({viewport:{width:390,height:844}});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://localhost:3000/vinclub-atlas/ui',{waitUntil:'networkidle'});
      await page.evaluate(()=>document.documentElement.classList.remove('dark'));
      await page.screenshot({path:`${output}/atlas-final-home-light.png`});
      const preview=page.locator('main .mini-city');await preview.scrollIntoViewIfNeeded();
      await preview.locator('[data-renderer="blender-webgl"]').waitFor({timeout:30000});
      await preview.getByRole('button',{name:'Đặt lại góc nhìn',exact:true}).click();
      await page.waitForTimeout(1000);
      await page.screenshot({path:`${output}/atlas-final-preview-light.png`});
      await page.getByRole('button',{name:'Mở bản đồ toàn màn hình',exact:true}).first().click();
      const journey=page.getByRole('dialog',{name:'Mua sắm tại Vincom',exact:true});
      await journey.locator('[data-renderer="blender-webgl"][data-view-stage="city"]').waitFor({timeout:30000});
      await journey.locator('[data-earth-texture="nasa-blue-marble"]').waitFor({timeout:30000});
      await journey.getByRole('button',{name:'Trái đất đến thành phố',exact:true}).click();
      await journey.locator('[data-view-stage="earth"]').waitFor();
      await page.waitForTimeout(180);
      await page.screenshot({path:`${output}/atlas-final-earth-nasa-light.png`});
      await journey.locator('[data-view-stage="city"]').waitFor({timeout:30000});
      await journey.getByRole('button',{name:'Đặt lại góc nhìn',exact:true}).click();
      await page.waitForTimeout(1000);
      await page.screenshot({path:`${output}/atlas-final-city-light.png`});
      const telemetry=await journey.locator('.mini-city-host').evaluate(el=>({...el.dataset}));
      await journey.getByRole('navigation',{name:'Vị trí trong hành trình'}).getByRole('button',{name:'Vincom',exact:true}).click();
      await page.waitForTimeout(1000);
      await page.screenshot({path:`${output}/atlas-final-vincom-light.png`});
      await journey.getByRole('button',{name:'Xem store',exact:false}).click();
      await journey.getByRole('button',{name:'Mây Studio',exact:false}).last().click();
      await journey.locator('[data-renderer="blender-webgl"][data-asset="store-may"]').waitFor({timeout:30000});
      await page.waitForTimeout(800);await page.screenshot({path:`${output}/atlas-final-store-light.png`});
      await journey.getByRole('button',{name:'Xem sản phẩm',exact:false}).first().click();
      await journey.locator('[data-renderer="blender-webgl"][data-asset="product-sneakers"]').waitFor({timeout:30000});
      await page.waitForTimeout(800);await page.screenshot({path:`${output}/atlas-final-product-light.png`});
      fs.writeFileSync(`${output}/snapshot-report.json`,JSON.stringify({telemetry,errors},null,2));
      await page.setViewportSize({width:1100,height:1150});
      await page.goto('http://localhost:3000/vinclub-atlas',{waitUntil:'networkidle'});
      const frame=page.frameLocator('iframe');
      await frame.locator('main .mini-city [data-renderer="blender-webgl"]').waitFor({timeout:30000});
      await frame.locator('main .mini-city').scrollIntoViewIfNeeded();
      await page.screenshot({path:`${output}/atlas-final-iphone-light.png`,fullPage:true});
      const iframe=page.frames().find(f=>f.url().endsWith('/ui'));
      const before=await iframe.evaluate(()=>performance.timeOrigin);
      await page.getByRole('button',{name:'Giao diện tối',exact:true}).click();
      await frame.locator('html.dark').waitFor();
      await page.waitForTimeout(700);
      const after=await iframe.evaluate(()=>performance.timeOrigin);
      if(before!==after)throw Error('Theme toggle reloaded iframe');
      await page.screenshot({path:`${output}/atlas-final-iphone-dark.png`,fullPage:true});
      fs.writeFileSync(`${output}/snapshot-report.json`,JSON.stringify({telemetry,liveThemeToggle:true,iframeReloaded:false,errors},null,2));
      console.log(JSON.stringify({snapshotOnly:true,telemetry,liveThemeToggle:true,iframeReloaded:false,errors}));await page.close();return;
    }
    if (process.argv.includes('--city-only')) {
      const option=process.argv.find(arg=>arg.startsWith('--option='))?.split('=')[1];
      const theme=process.argv.find(arg=>arg.startsWith('--theme='))?.split('=')[1];
      for (const name of ['atlas','daily','dualsurface'].filter(name=>!option||option===name)) {
       for(const mode of ['light','dark'].filter(mode=>!theme||theme===mode)) {
        const page = await browser.newPage({viewport:{width:390,height:844}});
        const errors=[]; page.on('pageerror',e=>errors.push(e.message));
        try {
          await page.goto(`http://localhost:3000/vinclub-${name}/ui`,{waitUntil:'networkidle'});
          await page.evaluate(mode=>document.documentElement.classList.toggle('dark',mode==='dark'),mode);
          await page.screenshot({path:`${output}/${name}-${mode}-premium-home.png`});
          const map=page.locator('main .mini-city').first();
          await map.scrollIntoViewIfNeeded();
          await map.locator('[data-renderer="blender-webgl"]').waitFor({timeout:30000});
          await map.locator('[data-camera-kind="perspective"]').waitFor();
          await map.locator('[data-view-stage="city"]').waitFor({timeout:30000});
          await map.getByRole('button',{name:'Phóng to bản đồ 3D',exact:true}).click();
          await map.getByRole('button',{name:'Thu nhỏ bản đồ 3D',exact:true}).click();
          const canvas=map.locator('canvas'); const box=await canvas.boundingBox();
          if(!box) throw Error('Missing city WebGL canvas');
          await page.mouse.move(box.x+box.width*.38,box.y+box.height*.65);
          await page.mouse.down(); await page.mouse.move(box.x+box.width*.68,box.y+box.height*.65,{steps:12}); await page.mouse.up();
          await map.getByRole('button',{name:'Đặt lại góc nhìn',exact:true}).click();
          await page.waitForTimeout(700);
          await page.screenshot({path:`${output}/${name}-${mode}-city-webgl.png`});
          await page.getByRole('button',{name:'Mở bản đồ toàn màn hình',exact:true}).first().click();
          await page.locator('.sj-city-explore').waitFor();
          await page.getByRole('button',{name:'Đóng mua sắm',exact:true}).click();
          await page.getByRole('button',{name:'Khám phá Vincom Ocean Park',exact:true}).click();
          const journey=page.getByRole('dialog',{name:'Mua sắm tại Vincom',exact:true});
          await journey.locator('[data-map-mode="city"]').waitFor();
          await journey.locator('[data-renderer="blender-webgl"]').waitFor({timeout:30000});
          const fullCity=journey.locator('.mini-city');
          await fullCity.locator('[data-view-stage="city"]').waitFor({timeout:30000});
          await fullCity.getByRole('button',{name:'Trái đất đến thành phố',exact:true}).click();
          await fullCity.locator('[data-view-stage="earth"]').waitFor();
          await page.waitForTimeout(450);
          const labelsOpacity=await fullCity.locator('.mini-city-labels').evaluate(el=>getComputedStyle(el).opacity);
          const earthLabelsHidden=Number(labelsOpacity)<=0.05;
          if(!earthLabelsHidden)console.log(JSON.stringify({name,mode,earthLabelsOpacity:labelsOpacity,...await fullCity.evaluate(el=>({stage:el.querySelector(".mini-city-host")?.dataset.viewStage,selectorMatches:el.matches(':has(.mini-city-host[data-view-stage="earth"]),:has(.mini-city-host[data-view-stage="flying"])'),classes:el.className,labelClasses:el.querySelector(".mini-city-labels")?.className,labelStyle:el.querySelector(".mini-city-labels")?.getAttribute("style")}))}));
          await page.screenshot({path:`${output}/${name}-${mode}-earth.png`});
          await fullCity.locator('[data-view-stage="flying"]').waitFor();
          await page.screenshot({path:`${output}/${name}-${mode}-earth-fly.png`});
          await fullCity.locator('[data-view-stage="city"]').waitFor({timeout:30000});

          await page.waitForTimeout(700);
          await page.screenshot({path:`${output}/${name}-${mode}-city-arrival.png`});
          await journey.getByRole('button',{name:'Mở kiến trúc',exact:true}).click();
          await journey.locator('[data-building-open="true"]').waitFor();
          await page.waitForTimeout(700);
          await page.screenshot({path:`${output}/${name}-${mode}-architecture-open.png`});
          await journey.getByRole('button',{name:'Đóng kiến trúc',exact:true}).click();
          await journey.locator('[data-building-open="false"]').waitFor();
          await journey.getByRole('button',{name:'Xem toàn thành phố',exact:true}).click();
          await page.waitForTimeout(700);
          await page.screenshot({path:`${output}/${name}-${mode}-city-expanded.png`});
          await journey.getByRole('button',{name:'Góc nhìn đường phố',exact:true}).click();
          await journey.locator('[data-view-angle="street"]').waitFor();
          await page.waitForTimeout(900);
          await page.screenshot({path:`${output}/${name}-${mode}-city-street.png`});
          await journey.getByRole('button',{name:'Đặt lại góc nhìn',exact:true}).click();
          await page.waitForTimeout(700);
          await journey.locator('[data-view-stage="city"]').waitFor({timeout:30000});
          for(const landmark of [{label:'WinMart',action:'Lưu danh sách mua sắm'},{label:'Vinmec',action:'Ghi nhận yêu cầu demo'},{label:'Sự kiện',action:'Lưu sự kiện'}]) {
            const pin=journey.getByRole('button',{name:`Mở ${landmark.label} trên bản đồ 3D`,exact:true});
            const pinBox=await pin.count()?await pin.boundingBox({timeout:1000}).catch(()=>null):null;
            if(pinBox&&pinBox.x>=0&&pinBox.x+pinBox.width<=390&&pinBox.y>=0&&pinBox.y+pinBox.height<=844)await pin.click();
            else await journey.locator('.sj-landmark-rail').getByRole('button',{name:landmark.label,exact:true}).click();
            await page.locator('.sj-view-landmark').waitFor();
            await journey.getByRole('button',{name:landmark.action,exact:true}).click();
            await journey.getByText('Đã lưu:',{exact:false}).waitFor();
            await page.waitForTimeout(700);
            await page.screenshot({path:`${output}/${name}-${mode}-landmark-${landmark.label==='WinMart'?'winmart':landmark.label==='Vinmec'?'vinmec':'events'}.png`});
            await journey.getByRole('button',{name:'Quay lại bước trước',exact:true}).click();
            await page.locator('.sj-view-arrival').waitFor();
          }
          await journey.getByRole('button',{name:'Quay lại Vincom',exact:true}).first().click();
          await journey.getByRole('button',{name:'Xem store',exact:false}).click();
          await journey.getByRole('button',{name:'Tầng 2 · Technology',exact:true}).click();
          await journey.locator('[data-store-level="2"]').waitFor();
          await journey.getByRole('button',{name:'Tầng 1 · Lifestyle',exact:true}).click();
          await journey.locator('[data-store-level="1"]').waitFor();
          await journey.getByRole('button',{name:'Mây Studio',exact:false}).last().click();
          await journey.locator('[data-asset="store-may"][data-renderer="blender-webgl"]').waitFor({timeout:30000});
          await page.waitForTimeout(700);
          await page.screenshot({path:`${output}/${name}-${mode}-premium-store.png`});
          await journey.getByRole('button',{name:'Xem sản phẩm',exact:false}).first().click();
          await journey.locator('[data-renderer="blender-webgl"][data-asset="product-sneakers"]').waitFor({timeout:30000});
          await page.waitForTimeout(700);
          await page.screenshot({path:`${output}/${name}-${mode}-product-3d.png`});
          await journey.getByRole('navigation',{name:'Vị trí trong hành trình'}).getByRole('button',{name:'Mây Studio',exact:true}).click();
          await page.locator('.sj-view-store').waitFor();
          await journey.getByRole('button',{name:'Xem sản phẩm',exact:false}).first().click();
          await journey.locator('[data-asset="product-sneakers"][data-renderer="blender-webgl"]').waitFor({timeout:30000});
          await journey.getByRole('button',{name:'Xám sương',exact:true}).click();
          await journey.locator('[data-product-color="Xám sương"]').waitFor();
          await journey.getByRole('button',{name:'Khám phá cấu tạo',exact:true}).click();
          await journey.locator('[data-product-exploded="true"]').waitFor();
          await page.waitForTimeout(900);
          await page.screenshot({path:`${output}/${name}-${mode}-product-exploded.png`});
          await journey.getByRole('button',{name:'Lắp lại',exact:true}).click();
          await journey.locator('[data-product-exploded="false"]').waitFor();
          await journey.getByRole('button',{name:'Thêm vào giỏ',exact:false}).click();
          await journey.getByRole('button',{name:'Tiếp tục đặt hàng',exact:true}).click();
          await journey.getByLabel('Người nhận',{exact:true}).fill('Minh Anh');
          await journey.getByLabel('Số điện thoại',{exact:true}).fill('0901234567');
          await journey.getByLabel('Địa chỉ giao hàng',{exact:true}).fill('Số 24 Sao Biển, Vinhomes Ocean Park, Hà Nội');
          await journey.getByRole('button',{name:'Chọn thanh toán',exact:true}).click();
          await journey.getByRole('button',{name:'Ví trả sau',exact:false}).click();
          await journey.getByRole('button',{name:'6 kỳ',exact:true}).click();
          await journey.getByRole('button',{name:'Kiểm tra đơn hàng',exact:true}).click();
          await page.waitForTimeout(700);
          await page.screenshot({path:`${output}/${name}-${mode}-checkout-bnpl.png`});
          await journey.getByRole('button',{name:'Xác nhận đặt hàng demo',exact:true}).click();
          await journey.locator('.sj-tracking-stages').waitFor();
          await page.waitForTimeout(700);
          await page.screenshot({path:`${output}/${name}-${mode}-greensm-tracking.png`});
          for(let i=0;i<3;i++) {
            const advance=journey.getByRole('button',{name:'Tiếp tục hành trình demo',exact:true});
            if(await advance.count()) await advance.click();
          }
          await journey.getByRole('button',{name:'Về VinClub',exact:true}).waitFor();
          await page.waitForTimeout(700);
          await page.screenshot({path:`${output}/${name}-${mode}-greensm-delivered.png`});
          await journey.getByRole('button',{name:'Về VinClub',exact:true}).click();
          if(await page.locator('main[inert]').count())throw Error('Underlying screen remains inert');
          const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
          const missing=await page.locator('img').evaluateAll(images=>images.filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src));
          reports.push({name,mode,cityWebGL:true,fullMapEntry:true,earthLabelsHidden,breadcrumbs:true,architectureOpen:true,storeLevels:true,productColor:true,productExploded:true,perspective:true,earthFly:true,landmarks:["WinMart","Vinmec","Sự kiện"],zoomAndDrag:true,streetView:true,arrival:true,store3D:true,product3D:true,cart:true,bnpl6:true,greenSMDelivered:true,overflow,missing,errors});
        } catch(error) { reports.push({name,mode,failed:error.message,errors}); await page.screenshot({path:`${output}/${name}-${mode}-city-failure.png`}); }
        console.log(JSON.stringify(reports.at(-1))); await page.close();
       }
      }
      let complete=reports;
      if(option||theme){try{const prior=JSON.parse(fs.readFileSync(`${output}/city-report.json`,"utf8"));complete=[...prior.filter(old=>!reports.some(next=>old.name===next.name&&old.mode===next.mode)),...reports];}catch{ /* First targeted run. */ }}
      fs.writeFileSync(`${output}/city-report.json`,JSON.stringify(complete,null,2));
      if(reports.some(r=>r.failed||r.overflow||r.errors.length||r.missing?.length))process.exitCode=1;
      return;
    }
    for (const name of ['atlas','daily','dualsurface']) {
      for (const width of [1440,390]) {
        const page = await browser.newPage({ viewport: {width, height:900} });
        const errors = []; page.on('pageerror', e => errors.push(e.message));
        await page.goto(`http://localhost:3000/vinclub-${name}/ui`, {waitUntil:'networkidle'});
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({path:`${output}/${name}-${width}.png`,fullPage:true});
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        const missing = await page.locator('img').evaluateAll(imgs => imgs.filter(i=>i.complete && !i.naturalWidth).map(i=>i.src));
        reports.push({name,width,overflow,missing,errors});
        console.log(JSON.stringify(reports.at(-1)));
        await page.close();
      }
    }
    const page = await browser.newPage({viewport:{width:390,height:844}});
    const flowErrors=[]; page.on('pageerror',e=>flowErrors.push(e.message));
    await page.goto('http://localhost:3000/vinclub-atlas/ui',{waitUntil:'networkidle'});
    await page.getByRole('button',{name:'Mở mini app Vinschool',exact:true}).click();
    await page.getByRole('dialog').getByText('Học phí tháng 10',{exact:true}).waitFor();
    await page.getByRole('button',{name:'Xác nhận yêu cầu',exact:false}).click();
    await page.getByRole('dialog').getByText('Đã lưu yêu cầu',{exact:true}).waitFor();
    await page.keyboard.press('Escape');
    if(await page.getByRole('dialog').count())throw Error('Atlas modal did not close');
    await page.goto('http://localhost:3000/vinclub-daily/ui',{waitUntil:'networkidle'});
    await page.getByLabel('Yêu cầu trợ lý').fill('Đóng học phí');
    await page.getByRole('button',{name:'Gửi yêu cầu',exact:true}).click();
    await page.locator('.daily-answer').waitFor();
    await page.getByRole('button',{name:'Mở Học phí',exact:true}).click();
    await page.getByRole('button',{name:'Tiếp tục',exact:true}).click();
    await page.getByRole('button',{name:'Xem trạng thái lỗi',exact:true}).click();
    await page.getByRole('button',{name:'Thử lại',exact:true}).click();
    await page.getByRole('button',{name:'Tiếp tục',exact:true}).click();
    await page.getByRole('button',{name:'Xác nhận demo',exact:true}).click();
    await page.getByRole('dialog').getByText('Sẵn sàng cho điều tốt đẹp.',{exact:true}).waitFor();
    await page.keyboard.press('Escape');
    await page.goto('http://localhost:3000/vinclub-dualsurface/ui',{waitUntil:'networkidle'});
    await page.getByRole('navigation',{name:'Không gian VinClub'}).getByRole('button',{name:'Khám phá',exact:true}).click();
    await page.locator('.ds-offer').getByRole('button',{name:'Khám phá',exact:false}).click();
    await page.getByRole('dialog').getByRole('button',{name:'Đổi quyền lợi',exact:true}).click();
    await page.getByRole('dialog').getByRole('button',{name:'Xác nhận đổi điểm demo',exact:true}).click();
    await page.getByRole('dialog').getByText('Đặc quyền đã sẵn sàng.',{exact:true}).waitFor();
    await page.keyboard.press('Escape');
    await page.getByRole('navigation',{name:'Không gian VinClub'}).getByRole('button',{name:'VinClub',exact:true}).click();
    await page.locator('.ds-hero-points').getByText('220.000',{exact:false}).waitFor();
    await page.locator('.ds-hero-card').click();
    await page.getByRole('button',{name:'Chạm & xoay thẻ 3D',exact:true}).click();
    await page.locator('.vc-membership-stage canvas').waitFor();
    await page.screenshot({path:`${output}/membership-3d.png`});
    await page.getByRole('button',{name:'Xem animation',exact:true}).click();
    await page.getByRole('button',{name:'Phát animation',exact:true}).click();
    await page.waitForFunction(()=>{const v=document.querySelector('.vc-membership-stage video');return v && v.currentTime>0;});
    await page.keyboard.press('Escape');
    await page.getByRole('navigation',{name:'Không gian VinClub'}).getByRole('button',{name:'Thanh toán',exact:true}).click();
    await page.getByRole('button',{name:'Ẩn số dư',exact:true}).click();
    await page.getByRole('button',{name:'Hiện số dư',exact:true}).waitFor();
    await page.getByRole('button',{name:'Khám phá',exact:true}).first().click();
    await page.locator('.ds-offer').waitFor();
    await page.emulateMedia({reducedMotion:'reduce'});
    for(const name of ['atlas','daily','dualsurface']){
      await page.goto(`http://localhost:3000/vinclub-${name}/ui`,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.documentElement.classList.add('dark'));
      await page.screenshot({path:`${output}/${name}-dark.png`,fullPage:true});
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
      if(overflow)throw Error(`${name} dark layout overflow`);
    }
    reports.push({flows:['Atlas tuition request','Daily AI and payment error/retry/success','Dualsurface redeem and point deduction','Blender GLB renderer','Cropped studio MP4 playback','Wallet privacy and spaces','Dark mode and reduced motion'],errors:flowErrors});
    await page.emulateMedia({reducedMotion:'no-preference'});
    for(const name of ['atlas','daily','dualsurface']){
      await page.setViewportSize({width:1100,height:1150});
      await page.goto(`http://localhost:3000/vinclub-${name}`,{waitUntil:'networkidle'});
      const frame=page.frameLocator('iframe');
      await frame.locator('main').waitFor();
      await page.screenshot({path:`${output}/${name}-iphone.png`,fullPage:true});
      const iframe=page.frames().find(f=>f.url().endsWith('/ui'));
      const video=await iframe.evaluate(()=>{const v=document.querySelector('video');return {source:v?.currentSrc,width:v?.videoWidth,height:v?.videoHeight};});
      if(video.width!==616||video.height!==386)throw Error(`${name} incorrect video crop: ${JSON.stringify(video)}`);
      const dock=await frame.locator(name==='atlas'?'.atlas-dock':name==='daily'?'.daily-bottom':'.ds-bottom').boundingBox();
      if(!dock)throw Error(`${name} missing dock`);
      await page.getByRole('button',{name:'Giao diện tối',exact:true}).click();
      await frame.locator('html.dark').waitFor();
      await page.setViewportSize({width:390,height:1050});
      await page.screenshot({path:`${output}/${name}-iphone-mobile.png`,fullPage:true});
      if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error(`${name} frame overflows mobile`);
      reports.push({name,iphoneFrame:true,videoCrop:video,mobileOverflow:false,errors:[]});
    }
    await page.close();
    fs.writeFileSync(`${output}/report.json`,JSON.stringify(reports,null,2));
    if (reports.some(r=>r.overflow||r.errors.length||r.missing?.length)) process.exitCode=1;
  } finally { await browser.close(); }
})();
