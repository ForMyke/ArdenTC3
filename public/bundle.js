!function(){"use strict";function e(e){return e.trim().split(/\s+/)}const t=new Set;const r=new Set;let n=0;const s=new Set;const o=[];function a(e,t){return`( ${e} + ${t} )`}function i(e,t,r){r.innerHTML+=`X${t}:<br>`;for(let[t,n]of e.entries())r.innerHTML+=`${t} => ${n}<br>`}const c=new Set,l=new Set;function f(e){return c.has(e)}function u(e){return l.has(e)}function d(e,t){let r=o[e],i=o[t],c=r.get(t);r.delete(t);for(let[e,t]of i.entries())r.has(e)?r.set(e,a(c+t,r.get(e))):r.set(e,c+t);s.has(e)?2===r.size&&r.has(e)&&(r.set(n,r.get(e)+"*"),r.delete(e)):1===r.size&&r.has(e)&&(r.set(n,r.get(e)+"*"),r.delete(e)),o[e]=r}function h(e,t,r){l.add(t);for(let n of Array.from(e.keys()))f(n)||u(n)||(h(o[n],n,r),d(t,n));return e.has(t)&&function(e,t){let r=o[e];if(!r.has(e)||""===r.get(e))return;let s=`(${r.get(e)})*`;if(r.delete(e),0===r.size)r.set(n,s);else for(let e of r.keys())r.set(e,s+r.get(e));o[e]=r,i(o[e],e,t)}(t,r),l.delete(t),e}function p(l,f){const u=l.split("\n").map((e=>e.trim()));let d=1;u.forEach((i=>{if(1===d)e(i).forEach((e=>t.add(e))),f.innerHTML+="Caracteres para las transiciones: "+Array.from(t).join(" ")+"<br>";else if(2===d)!function(t){let s=e(t);s.forEach((e=>{try{let t=parseInt(e.slice(1));r.add(t)}catch(t){console.error(`Error al convertir ${e} a entero: ${t}`)}})),n=s.length}(i),f.innerHTML+="Estados: "+Array.from(r).join(" ")+"<br>";else if(3===d)!function(t){e(t).forEach((e=>{try{let t=parseInt(e.slice(1));s.add(t)}catch(t){console.error(`Error al convertir ${e} a entero: ${t}`)}}))}(i),f.innerHTML+="Estados Finales: "+Array.from(s).join(" ")+"<br>";else{let t=function(t){return e(t).slice(2).filter((e=>"+"!==e&&"/"!==e))}(i),r=function(e){let t=new Map;return e.forEach((e=>{try{let[r,n]=e.split("X");r="/"!==r?r:"λ",n=parseInt(n),t.has(n)?t.set(n,a(t.get(n),r)):t.set(n,r)}catch(t){console.error(`Error al procesar ${e}: ${t}`)}})),t}(t);s.has(d-4)&&r.set(n,"λ"),o.push(r),f.innerHTML+=`Ecuación para X${d-4}:<br>`,f.innerHTML+=Array.from(r.entries()).map((([e,t])=>e!==n?`${t}X${e}`:t)).join(" + ")+"<br><br>"}d++})),c.add(n),h(o[0],0,f),f.innerHTML+="La expresion final es:<br>",i(o[0],0,f)}document.getElementById("fileInput").addEventListener("change",(e=>{const t=e.target.files[0];if(t){const e=new FileReader;e.onload=e=>{const t=e.target.result,r=document.getElementById("output");r.innerHTML="",p(t,r)},e.readAsText(t)}}))}();
