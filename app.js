let port, reader, writer, inputDone, outputDone;

const $ = (s)=>document.querySelector(s);
const ui = {
  connect: $('#btnConnect'),
  close:   $('#btnClose'),
  on:      $('#btnOn'),
  off:     $('#btnOff'),
  toggle:  $('#btnToggle'),
  baud:    $('#baud'),
  status:  $('#status'),
  log:     $('#log'),
};

ui.connect.addEventListener('click', connect);
ui.close.addEventListener('click', closePort);
ui.on.addEventListener('click', () => sendLine('ON'));
ui.off.addEventListener('click', () => sendLine('OFF'));
ui.toggle.addEventListener('click', () => sendLine('TOGGLE'));

function log(msg){ ui.log.textContent += msg + '\n'; ui.log.scrollTop = ui.log.scrollHeight; }
function setUI(connected){
  ui.connect.disabled = connected;
  ui.close.disabled   = !connected;
  ui.on.disabled = ui.off.disabled = ui.toggle.disabled = !connected;
}

async function connect(){
  if (!('serial' in navigator)) { alert('Tu navegador no soporta Web Serial'); return; }
  try{
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: Number(ui.baud.value) });
    ui.status.textContent = 'Conectado';
    setUI(true);

    // Escritura
    const enc = new TextEncoderStream();
    outputDone = enc.readable.pipeTo(port.writable);
    writer = enc.writable.getWriter();

    // Lectura (muestra "READY", "OK:ON", etc.)
    const dec = new TextDecoderStream();
    inputDone = port.readable.pipeTo(dec.writable);
    reader = dec.readable.getReader();
    readLoop();
  }catch(e){
    console.error(e);
    ui.status.textContent = 'Error al conectar';
  }
}

async function readLoop(){
  try{
    while (true){
      const {value, done} = await reader.read();
      if (done) break;
      if (value) log(value.replace(/\r/g,''));
    }
  }catch(e){ /* ignore */ }
}

async function sendLine(text){
  if (!writer) return;
  await writer.write(text + '\n');
}

async function closePort(){
  try{
    await reader?.cancel(); await inputDone;
  }catch(e){}
  try{
    await writer?.close(); await outputDone;
  }catch(e){}
  try{
    // baja señales para evitar resets en algunos conversores
    await port?.setSignals?.({ dataTerminalReady:false, requestToSend:false });
  }catch(e){}
  try{ await port?.close(); }catch(e){}
  port = reader = writer = inputDone = outputDone = null;
  ui.status.textContent = 'Puerto cerrado';
  setUI(false);
}

// cierre automático si se desconecta el dispositivo
navigator.serial?.addEventListener('disconnect', (e)=>{ if (port && e.target===port) closePort(); });
