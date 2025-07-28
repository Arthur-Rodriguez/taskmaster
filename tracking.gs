const SPREADSHEET_ID ="1ud7ExVS8mOF8E6j6IdJ97rDyYMjTs8zI4RCBvlKPWog";
  
  function obtenerHoja () {
    const ss =SpreadsheetApp.openById('1ud7ExVS8mOF8E6j6IdJ97rDyYMjTs8zI4RCBvlKPWog')
    const hoja = ss.getSheetByName('InOps');
    return hoja;}

 function doGet() {
    var output = HtmlService.createTemplateFromFile("page");
        return output.evaluate()
        .setTitle("TaskMaster - InOps").
        setFaviconUrl('https://cdn-1.webcatalog.io/catalog/nuinvest/nuinvest-icon.png');
  }


function obtenerImagenBase64() {
  const fileId = '1NkK76Pt_qarRFL4iKIc0HQpo330O3yjW'; // tu ID
  const file = DriveApp.getFileById(fileId);
  const blob = file.getBlob();
  const mimeType = blob.getContentType(); // por ejemplo, image/png
  const base64Data = Utilities.base64Encode(blob.getBytes());
  return `data:${mimeType};base64,${base64Data}`;
}

  function obtenerUsuarioActual() {
      const email = Session.getActiveUser().getEmail();
      return email || "Anónimo";
    }

  function iniciarCronometro() {
    const cache = CacheService.getUserCache();
    const inicio = new Date();
    cache.put("inicioCronometro", inicio.toISOString(), 7200); // guarda por 1 hora
    return "Job iniciado - " + inicio.toLocaleString();
    }
  
  function detenerCronometroConDatos(uuid, squad, tipoJob) {
  const cache = CacheService.getUserCache();
  const inicioStr = cache.get("inicioCronometro");

  if (!inicioStr) return "No se encontró un cronómetro activo.";

  const inicio = new Date(inicioStr);
  const fin = new Date();
  const duracion = (fin - inicio) / 1000;
  const usuario = Session.getActiveUser().getEmail() || "Anónimo";

  const hoja = SpreadsheetApp.openById('1ud7ExVS8mOF8E6j6IdJ97rDyYMjTs8zI4RCBvlKPWog').getSheetByName("InOps");
  hoja.appendRow([
    usuario,
    uuid,
    squad,
    tipoJob,
    Utilities.formatDate(inicio, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
    Utilities.formatDate(fin, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
    duracion
  ]);

  cache.remove("inicioCronometro");
  return `Job registrado Exitosamente - Time Spent: ${duracion.toFixed(2)} segundos.`;}

 function obtenerRegistros() {
  const hoja = obtenerHoja();
  return hoja.getDataRange().getValues();}

  function obtenerInicioActivo() {
    const cache = CacheService.getUserCache();
    const inicioStr = cache.get("inicioCronometro");
    return inicioStr ? new Date(inicioStr).getTime() : null;}

 function include(filename) {
 return HtmlService.createHtmlOutputFromFile(filename).getContent();}
