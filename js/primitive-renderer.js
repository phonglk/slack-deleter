'use strict';var htmlRenderInto=function(a,b){'use strict';return document.querySelector(a).innerHTML=b,!0},htmlAppendTo=function(a,b){'use strict';var c=document.querySelector(a);return c.innerHTML+=b,!0},tplHtmlActionButton=function(a){var b=[];return b.push('<div class="row Grid -middle" tabindex="-1" data-service-id="'+a.serviceId+'" data-action-id="'+a.actionId+'" data-url="">'),b.push('    <div class="icon Cell">'),b.push('        <img src="'+a.icon+'" />'),''!==a.iconAux&&b.push('        <img src="'+a.iconAux+'" class="aux" />'),b.push('    </div>'),b.push('    <div class="title Cell">'),b.push('        '+a.title+''),b.push('    </div>'),b.push('    <div class="note Cell '+a.noteClass+'">'),b.push('        '+a.note+''),b.push('    </div>'),b.push('    <div class="year Cell -fill">'),b.push('    </div>'),b.push('    <div class="star Cell">'),(a.premiumBase||a.premiumYear)&&(b.push('        Available in Premium'),b.push('        <img src="./icon/svg/star.svg" />')),b.push('    </div>'),b.push('</div>'),b.join('')};