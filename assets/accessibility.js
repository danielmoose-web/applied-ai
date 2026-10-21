
(function(){
 'use strict';
 const header=document.querySelector('header'),main=document.querySelector('main');
 function alignHeader(){if(!header||!main)return;const box=main.getBoundingClientRect(),style=getComputedStyle(main);header.style.setProperty('--content-edge',Math.max(12,box.left+parseFloat(style.paddingLeft||0))+'px');}
 alignHeader();if(main&&window.ResizeObserver)new ResizeObserver(alignHeader).observe(main);window.addEventListener('resize',alignHeader);
 function headerHeight(){document.documentElement.style.setProperty('--site-header-height',(header?header.getBoundingClientRect().height:0)+'px');}
 headerHeight();if(header&&window.ResizeObserver)new ResizeObserver(headerHeight).observe(header);window.addEventListener('resize',headerHeight);
 const visible=el=>!!el&&!!el.getClientRects().length&&!el.closest('.hidden')&&getComputedStyle(el).visibility!=='hidden'&&(!el.closest('details')||el.closest('details').open||el.tagName==='SUMMARY');
 function enhance(){
  document.querySelectorAll('header nav button.current,header nav button.active').forEach(el=>el.setAttribute('aria-current','page'));
  document.querySelectorAll('header nav button:not(.current):not(.active)').forEach(el=>el.removeAttribute('aria-current'));
  document.querySelectorAll('.field').forEach(field=>{const hint=field.querySelector('.hint'),control=field.querySelector('input[id],select[id],textarea[id]');if(!hint||!control)return;hint.id=hint.id||control.id+'-hint';const ids=new Set((control.getAttribute('aria-describedby')||'').split(' ').filter(Boolean));ids.add(hint.id);control.setAttribute('aria-describedby',[...ids].join(' '));});
  document.querySelectorAll('th:not([scope])').forEach(el=>el.setAttribute('scope','col'));
  document.querySelectorAll('.mode-switch button').forEach(el=>el.setAttribute('aria-pressed',String(el.classList.contains('active'))));
 }
 enhance();let enhanceQueued=false;new MutationObserver(()=>{if(enhanceQueued)return;enhanceQueued=true;requestAnimationFrame(()=>{enhanceQueued=false;enhance();});}).observe(document.body,{childList:true,subtree:true});
 let focusQueued=0;
 function focusHeading(selector){
  cancelAnimationFrame(focusQueued);
  focusQueued=requestAnimationFrame(()=>{const root=selector?document.querySelector(selector):main;if(!root)return;const target=[...root.querySelectorAll('h1,h2')].find(visible)||root;target.setAttribute('tabindex','-1');target.setAttribute('data-focus-target','');target.focus({preventScroll:true});target.scrollIntoView({block:'start',behavior:'auto'});enhance();});
 }
 function wrap(name,selector){const original=window[name];if(typeof original!=='function')return;window[name]=function(){const result=original.apply(this,arguments);focusHeading(selector);return result;};}
 ['openModule','beginScenarios','nextScenario','renderHome','showLibrary','showLibraryCategory','renderSummary','showView','showHome','showGame','showResults','showAdmin','goToStage','jumpDemoStage','confirmStage','fillDemoExample','resetGame','openGame','showHub'].forEach(name=>wrap(name));
 wrap('goStage','.layout>section');
 const choose=window.choose;if(typeof choose==='function')window.choose=function(){const result=choose.apply(this,arguments);requestAnimationFrame(()=>{const feedback=document.querySelector('#lab .feedback');if(feedback){feedback.setAttribute('tabindex','-1');feedback.setAttribute('data-focus-target','');feedback.focus({preventScroll:true});feedback.scrollIntoView({block:'nearest',behavior:'auto'});}});return result;};
 document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const id=link.getAttribute('href').slice(1),target=document.getElementById(id);if(!target)return;event.preventDefault();target.setAttribute('tabindex','-1');target.setAttribute('data-focus-target','');target.focus({preventScroll:true});target.scrollIntoView({block:'start',behavior:'auto'});history.replaceState(null,'','#'+id);}));
})();
