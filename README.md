
<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>VEER AI</title>
<style>
body{margin:0;background:#0b1020;color:#f4f7ff;font-family:Arial,sans-serif}
header{padding:18px;background:#151d33}
h1{margin:0;color:#65e4ff}
#chat{height:70vh;overflow:auto;padding:12px}
.msg{padding:12px;margin:10px 0;border-radius:12px;white-space:pre-wrap;overflow-wrap:anywhere}
.bot{background:#1b2944}
.user{background:#145d78;margin-left:15%}
form{position:fixed;bottom:0;left:0;right:0;padding:12px;background:#151d33;display:flex;gap:8px}
input{flex:1;min-width:0;padding:12px;border-radius:10px}
button{padding:12px;background:#65e4ff;border:0;border-radius:10px}
</style>
</head>
<body>
<header><h1>VEER AI</h1><p>तुम्हारा हिंदी AI सहायक</p></header>
<div id="chat">
<div class="msg bot">नमस्ते! मैं VEER AI हूँ। मुझे कुछ पूछकर देखो।</div>
</div>
<form id="form">
<input id="message" placeholder="यहाँ संदेश लिखो..." autocomplete="off">
<button type="submit">भेजो</button>
</form>
<script>
const chat=document.getElementById('chat');
const input=document.getElementById('message');

function add(text,cls){
 const el=document.createElement('div');
 el.className='msg '+cls;
 el.textContent=text;
 chat.appendChild(el);
 chat.scrollTop=chat.scrollHeight;
 return el;
}

document.getElementById('form').addEventListener('submit',async e=>{
 e.preventDefault();
 const text=input.value.trim();
 if(!text)return;
 add(text,'user');
 input.value='';
 const pending=add('VEER AI जवाब सोच रहा है…','bot');
 try{
  const response = await fetch('https://veer-ai-assistant.vickyjaryal006.workers.dev', {
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({message:text})
  });
  const data=await response.json();
  if(!response.ok)throw new Error();
  pending.textContent=data.reply||data.response||'जवाब नहीं मिला।';
 }catch(error){
  pending.textContent='AI सेवा अभी तैयार नहीं है। Cloudflare Worker और AI binding जाँचनी होगी।';
 }
});
</script>
</body>
</html>

