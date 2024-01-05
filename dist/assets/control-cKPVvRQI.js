import"./modulepreload-polyfill-9p4a8sJU.js";document.addEventListener("DOMContentLoaded",()=>{d()});function d(){const o=document.getElementById("linkDetailsContent"),a=document.getElementById("linkAnalyticsChart"),t=m(),n=Object.keys(t),s=Object.values(t).map(e=>e.count),i=Object.values(t).map(e=>e.performance),c=n.map((e,l)=>({label:e,clickCount:s[l],performance:i[l]})).sort((e,l)=>l.clickCount-e.clickCount),u=c.slice(0,10),k={labels:u.map(e=>y(e.label)),datasets:[{label:"Click Counts",data:u.map(e=>e.clickCount),backgroundColor:"rgba(75, 192, 192, 0.2)",borderColor:"rgba(75, 192, 192, 1)",borderWidth:1,yAxisID:"primaryY"}]},p={responsive:!0,maintainAspectRatio:!1,scales:{x:{beginAtZero:!0},primaryY:{type:"linear",position:"left",beginAtZero:!0}},plugins:{legend:{position:"false"},tooltip:{mode:"index",intersect:!1,callbacks:{label:function(e){e.dataset.label;const l=e.parsed.y||0,b=c[e.dataIndex].label,r=t[b]||{};r.performance&&Math.round(r.performance)+"";const E=r.lastAccessTime?new Date(r.lastAccessTime).toLocaleDateString():"N/A";return[`Opened: ${l} times`,`Last Access: ${E}`]}}}}},f=a.getContext("2d");new Chart(f,{type:"bar",data:k,options:p}),document.getElementById("deleteButton").addEventListener("click",()=>{window.confirm("Are you sure you want to delete all link usage data?")&&(localStorage.removeItem("linkUsageData"),o.innerHTML="",d())});function m(){return JSON.parse(localStorage.getItem("linkUsageData"))||{}}function y(e){return(t[e]||{}).title||e}window.deleteLink=function(e){const l=m();delete l[e],D(l),o.innerHTML="",d()};function D(e){localStorage.setItem("linkUsageData",JSON.stringify(e))}}document.addEventListener("DOMContentLoaded",()=>{B(),document.getElementById("toggleDeleteButton").addEventListener("click",L)});function h(o){const a=document.createElement("div");a.className="link-container";const t=document.createElement("button");t.textContent=o.title;const n=document.createElement("button");return n.className="delete-button",t.disabled=!0,n.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>',n.addEventListener("click",()=>{const i=(JSON.parse(localStorage.getItem("links"))||[]).filter(c=>!(c.title===o.title&&c.url===o.url));localStorage.setItem("links",JSON.stringify(i)),a.remove()}),a.appendChild(t),a.appendChild(n),a}function B(){const o=document.getElementById("linksContainer");let a=JSON.parse(localStorage.getItem("links"))||[];a.sort((t,n)=>t.title.localeCompare(n.title)),a.forEach(t=>{const n=h(t);o.appendChild(n)})}function L(){document.querySelectorAll(".delete-button").forEach(a=>{a.classList.toggle("hidden-button")})}function C(){document.getElementById("backupRestoreDialog").showModal()}function v(){document.getElementById("backupRestoreDialog").close()}document.addEventListener("DOMContentLoaded",()=>{document.getElementById("backupRestoreButton").addEventListener("click",C),document.getElementById("downloadDataButton").addEventListener("click",g),document.getElementById("restoreDataButton").addEventListener("click",I)});function I(){const o=document.createElement("input");o.type="file",o.accept=".json",o.onchange=a=>{const t=a.target.files[0];if(t){const n=new FileReader;n.onload=s=>{const i=JSON.parse(s.target.result);for(const c in i)i.hasOwnProperty(c)&&localStorage.setItem(c,i[c]);loadData(),v()},n.readAsText(t)}},o.click()}document.getElementById("downloadDataButton").addEventListener("click",g);function g(){const o={...localStorage},a=JSON.stringify(o,null,2),t=new Blob([a],{type:"application/json"}),n=document.createElement("a");n.href=URL.createObjectURL(t),n.download="localStorageData.json",n.click()}document.getElementById("homeButton").addEventListener("click",()=>{window.location.href="/index.html"});lucide.createIcons();
