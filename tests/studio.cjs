const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const prefix = '/applied-ai/';
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(prefix)) { res.writeHead(404).end(); return; }
  const file = path.resolve(root, pathname.slice(prefix.length) || 'index.html');
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  let target = file;
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', target.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain');
  res.end(fs.readFileSync(target));
});
async function download(page, locator) {
  const pending = page.waitForEvent('download');
  await locator.click();
  const item = await pending;
  assert.equal(await item.failure(), null);
  return fs.readFileSync(await item.path(), 'utf8');
}
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}${prefix}`;
  const browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
  try {
    for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
      const context = await browser.newContext({viewport,acceptDownloads:true, permissions:['clipboard-read','clipboard-write']});
      const page = await context.newPage();
      const errors = [], external = [];
      page.on('pageerror', e => errors.push(e.message));
      await context.route('**/*', route => {
        if (!route.request().url().startsWith(base)) { if(!/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(route.request().url())) external.push(route.request().url()); return route.abort(); }
        return route.continue();
      });
      page.on('dialog', dialog => dialog.accept());
      await page.goto(base+'lab/');
      await page.getByRole('link',{name:'Open Studio',exact:false}).click();
      await page.waitForURL('**/studio/Index.html');
      await page.locator('#level').selectOption('Builder');
      await page.getByRole('button',{name:'Start the game',exact:false}).click();
      const sel = name => page.locator(`#stageForm [name="${name}"]`);
      const choose = (name, index=1) => sel(name).selectOption({index});
      await page.getByRole('button',{name:'Review Decision Trace',exact:false}).click();
      assert.equal(await page.locator('#checkpoint button').count(),0,'Required fields prevent advancement');
      const csv = await download(page,page.getByRole('button',{name:'Budget.csv',exact:false}));
      assert.match(csv,/"Programs","Personnel","35000"/);
      const ledger = await download(page,page.getByRole('button',{name:'Ledger.csv',exact:false}));
      assert.match(ledger,/INV-2063/);
      await choose('firstAction');
      await page.reload();
      await page.getByRole('button',{name:'Start the game',exact:false}).click();
      assert.equal(await sel('firstAction').inputValue(),'Check source-to-department mappings','Unfinished draft survives reload');
      assert.equal(await page.locator('#view-game .tag').first().textContent(),'Builder level');
      for (let stage=0; stage<5; stage++) {
        if (stage===0) { await choose('firstAction'); await choose('success'); }
        if (stage===1) { await choose('architecture'); for (const name of ['reconcile','mapping','approval']) await sel(name).check(); }
        if (stage===2) { for (const [name,value] of Object.entries({actual:112700,variance:700,program:47700})) await sel(name).fill(String(value)); }
        if (stage===3) { await choose('duplicate'); await sel('revisedActual').fill('113300'); await choose('fallback'); }
        if (stage===4) { await choose('evidence'); await choose('review'); await sel('briefing').fill('Reconciled source totals; finance reviews before publication.'); await page.locator('.communication-practice summary').click(); await sel('audienceBrief').fill('The workflow reconciles deterministic calculations and flags exceptions for review.'); }
        for (const name of ['rationale','outcome','assistance']) await choose(name);
        if (stage===0) {
          await page.getByRole('button',{name:'Copy Discover prompt',exact:true}).click();
          assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Reporting Rescue/);
        }
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Stage ${stage+1} fits viewport`);
        await page.getByRole('button',{name:'Review Decision Trace',exact:false}).click();
        await page.getByRole('button',{name:stage===4?'Confirm and finish':'Confirm and continue',exact:false}).click();
      }
      assert.match(await page.locator('.scorebig').textContent(),/^100\s*\/ 100$/);
      assert.equal(await page.locator('#view-results input[type="checkbox"]').count(),0,'No reporting controls');
      const receipt = JSON.parse(await download(page,page.getByRole('button',{name:'Download receipt (.json)',exact:true}).first()));
      assert.equal(receipt.score,100); assert.equal(receipt.decisions.length,5);
      const backup = await download(page,page.getByRole('button',{name:'Download complete progress backup',exact:true}));
      await page.reload();
      await page.locator('#nav-results').click();
      assert.match(await page.locator('.scorebig').textContent(),/^100\s*\/ 100$/,'Completion survives reload');
      await page.locator('#nav-home').click();
      await page.getByRole('button',{name:'Restore a backup',exact:true}).click({trial:true});
      const fresh = await browser.newContext({viewport,acceptDownloads:true});
      const recovered = await fresh.newPage();
      recovered.on('dialog',d=>d.accept());
      await recovered.goto(base+'lab/studio/Index.html');
      const fileChooser = recovered.waitForEvent('filechooser');
      await recovered.getByRole('button',{name:'Restore a backup',exact:true}).click();
      await (await fileChooser).setFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(backup)});
      await recovered.locator('#view-results:not(.hidden)').waitFor();
      assert.match(await recovered.locator('.scorebig').textContent(),/^100\s*\/ 100$/,'File restore recovers completed result in a fresh browser');
      await recovered.getByRole('button',{name:'New attempt',exact:true}).click();
      await recovered.getByRole('button',{name:'Exit to dashboard',exact:true}).click();
      assert.equal(await recovered.locator('#view-home .result-metric').filter({hasText:'Completed'}).getByRole('button',{name:'Open',exact:true}).count(),1,'Previous completed attempt remains in history');
      await fresh.close();
      await page.locator('#nav-admin').click();
      await page.getByRole('button',{name:'My saved attempts',exact:true}).click();
      assert.match(await page.locator('#view-admin').textContent(),/Personal activity on this device only/);
      await page.locator('#nav-home').click();
      await page.locator('.game-card').filter({hasText:'The Document Detective'}).getByRole('button').click();
      await page.waitForURL('**/Projects.html?game=G02');
      await page.locator('#answer').fill('Use current authorized policy documents and cite sources.');
      await page.getByRole('button',{name:'Studio overview / Game 1',exact:true}).click();
      await page.waitForURL('**/studio/Index.html');
      assert.deepEqual(errors,[]); assert.deepEqual(external,[],'No external requests');
      console.log(`PASS ${viewport.width}x${viewport.height}: five-stage 100/100, required fields, draft/reload, CSVs, prompt clipboard, receipt, backup file restore, attempt history, local analytics, project navigation, no reporting/external requests or page errors`);
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
