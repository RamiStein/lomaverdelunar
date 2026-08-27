var ID_EXCEL = '1KavxiW6XNAxGFa7hn2s9Gzj6jkJ-QURcwhVOdGjo_Yc';
var PESTANA_ACTIVA = 'Luna Acuario'; 
var PESTANA_ADMIN = 'Admin'; 

// REEMPLAZAR CON TUS IDs Y CLAVES REALES
var ID_CARPETA_FLYERS = '1imGP2HH71vArJbIGMTnHmwVMxTSvGKMO'; 
var ID_PLANTILLA_SLIDE = '1kC_PyW1xSZAQlOkQ0tKBw4U_D70azrjSFNjYmPY9ISM'; 
var API_KEY_REMOVEBG = 'F92r1dGuUjyU2KFFjuvRr9wU'; 

function doGet(e) {
  var page = (e && e.parameter && e.parameter.page) ? e.parameter.page : 'Index';
  var template;
  
  if (page === 'presupuesto') {
    template = HtmlService.createTemplateFromFile('Presupuesto');
    template.urlApp = ScriptApp.getService().getUrl();
    try {
      var excel = SpreadsheetApp.openById(ID_EXCEL);
      template.presupuestoData = obtenerConfigPresupuesto(excel);
    } catch(e) {
      template.presupuestoData = obtenerConfigPresupuesto(null);
    }
  } else if (page === 'proyecto') {
    template = HtmlService.createTemplateFromFile('Proyecto');
    template.urlApp = ScriptApp.getService().getUrl();
    template.isAdmin = (e && e.parameter && e.parameter.admin === 'true');
    var pId = (e && e.parameter && e.parameter.id) ? parseInt(e.parameter.id) : 0;
    try {
      var excel = SpreadsheetApp.openById(ID_EXCEL);
      var configP = obtenerConfigPresupuesto(excel);
      template.proyecto = configP.opciones[pId] || configP.opciones[0];
    } catch(e) {
      var configP = obtenerConfigPresupuesto(null);
      template.proyecto = configP.opciones[pId] || configP.opciones[0];
    }
  } else if (page === 'contabilidad') {
    template = HtmlService.createTemplateFromFile('Contabilidad');
    template.urlApp = ScriptApp.getService().getUrl();
    try {
      var excel = SpreadsheetApp.openById(ID_EXCEL);
      template.contabilidad = obtenerContabilidad(excel);
    } catch(e) {
      template.contabilidad = { gastos: [], totalGastado: 0 };
    }
  } else if (page === 'directorio') {
    template = HtmlService.createTemplateFromFile('Directorio');
    template.urlApp = ScriptApp.getService().getUrl();
    try {
      var excel = SpreadsheetApp.openById(ID_EXCEL);
      template.directorio = JSON.stringify(obtenerDirectorio(excel));
    } catch(e) {
      template.directorio = "{}";
    }
  } else if (page === 'virtudes' || page === 'mercado') {
    template = HtmlService.createTemplateFromFile('Virtudes');
    template.urlApp = ScriptApp.getService().getUrl();
    try {
      var excel = SpreadsheetApp.openById(ID_EXCEL);
      template.virtudesData = JSON.stringify(obtenerVirtudes(excel));
    } catch(e) {
      template.virtudesData = JSON.stringify(obtenerVirtudes(null));
    }
  } else {
    template = HtmlService.createTemplateFromFile('Index');
    try {
      var excel = SpreadsheetApp.openById(ID_EXCEL);
      var config = obtenerConfiguracion(excel);
      
      template.categorias = config.categorias;
      template.idImagen = config.idImagen;
      template.noticias = JSON.stringify(config.noticias);
      template.quienesSomos = config.quienesSomos;
      template.inscriptos = JSON.stringify(obtenerInscriptos(excel));
      template.urlApp = ScriptApp.getService().getUrl(); 
      template.errorInicial = "";
    } catch (err) {
      template.categorias = ["Feria"]; template.idImagen = ""; template.inscriptos = "{}"; template.noticias = "[]";
      template.quienesSomos = {titulo: "Loma Verde Lunar", texto: ""};
      template.urlApp = ScriptApp.getService().getUrl();
      template.errorInicial = "Error en el sistema: " + err.message;
    }
  }

  return template.evaluate()
      .setTitle('Loma Verde Lunar ♒')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

function garantizarHojaActiva(excel) {
  var hoja = excel.getSheetByName(PESTANA_ACTIVA);
  var headers = ["Fecha", "Nombre del Emprendimiento", "WhatsApp", "Rubro", "Descripción", "Instagram", "Tienda / Web", "Link Maps", "Nombre Personal"];
  
  if (!hoja) {
    hoja = excel.insertSheet(PESTANA_ACTIVA);
    hoja.appendRow(headers);
  } else {
    // Si la pestaña existe, validamos si tiene los encabezados
    var uf = hoja.getLastRow();
    if (uf === 0) {
      hoja.appendRow(headers);
    } else {
      var valA1 = hoja.getRange(1, 1).getValue();
      // Si A1 es una fecha (un registro real guardado) o si no tiene las palabras típicas de título
      if (valA1 instanceof Date || (typeof valA1 === 'string' && valA1.toLowerCase().indexOf('fecha') === -1 && valA1.toLowerCase().indexOf('marca') === -1)) {
        hoja.insertRowBefore(1);
        hoja.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
    }
  }
  return hoja;
}

function garantizarHojaVotos(excel) {
  var hoja = excel.getSheetByName("Votos Presupuesto");
  if (!hoja) {
    hoja = excel.insertSheet("Votos Presupuesto");
    hoja.appendRow(["Fecha", "Nombre y Apellido", "Teléfono", "Partido", "Localidad", "Calles", "Opción Votada", "Justificación"]);
    hoja.getRange("1:1").setFontWeight("bold");
  }
  return hoja;
}

function garantizarHojaVoluntarios(excel) {
  var hoja = excel.getSheetByName("Voluntarios PB");
  if (!hoja) {
    hoja = excel.insertSheet("Voluntarios PB");
    hoja.appendRow(["Fecha", "Nombre y Apellido", "Teléfono / WhatsApp"]);
    hoja.getRange("1:1").setFontWeight("bold");
  }
  return hoja;
}

function garantizarHojaRecaudacion(excel) {
  var hoja = excel.getSheetByName("Recaudacion");
  if (!hoja) {
    hoja = excel.insertSheet("Recaudacion");
    hoja.appendRow(["Nombre de la Luna", "Monto Recaudado"]);
    hoja.getRange("1:1").setFontWeight("bold");
    
    // Default initial data
    var lunas = ["Capricornio", "Acuario", "Piscis", "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario"];
    lunas.forEach(function(l) {
      hoja.appendRow(["Luna en " + l, "Pendiente"]);
    });
  }
  return hoja;
}

function garantizarHojaContabilidad(excel) {
  var hoja = excel.getSheetByName("Contabilidad");
  if (!hoja) {
    hoja = excel.insertSheet("Contabilidad");
    hoja.appendRow(["Fecha", "Detalle del Gasto", "Monto ($)", "Link a Comprobante"]);
    hoja.getRange("1:1").setFontWeight("bold");
  }
  return hoja;
}

function obtenerContabilidad(excel) {
  var datos = { gastos: [], totalGastado: 0 };
  if (!excel) return datos;
  
  var hoja = garantizarHojaContabilidad(excel);
  if (!hoja) return datos;
  
  var ultFila = hoja.getLastRow();
  if (ultFila > 1) {
    var filas = hoja.getRange(2, 1, ultFila - 1, 4).getValues();
    filas.forEach(function(f) {
      if (f[1] && String(f[1]).trim() !== "") {
        var monto = parseFloat(String(f[2]).replace(/[^0-9.-]+/g,"")) || 0;
        datos.gastos.push({
          fecha: f[0] instanceof Date ? f[0].toLocaleDateString('es-AR') : String(f[0]),
          detalle: String(f[1]),
          montoStr: f[2],
          montoNum: monto,
          comprobante: f[3] ? String(f[3]) : ""
        });
        datos.totalGastado += monto;
      }
    });
  }
  return datos;
}

function obtenerConfiguracion(excel) {
  var hojaAdmin = excel.getSheetByName(PESTANA_ADMIN);
  if (!hojaAdmin) throw new Error("No se encuentra la pestaña 'Admin' en el Excel.");
  
  var categorias = hojaAdmin.getRange("A2:A" + hojaAdmin.getLastRow()).getValues().map(function(f){return f[0]}).filter(function(i){return i!==""});
  var fondo = hojaAdmin.getRange("C2").getValue().toString();
  
  var noticias = [];
  var datosN = hojaAdmin.getRange("E2:G" + hojaAdmin.getLastRow()).getValues();
  datosN.forEach(function(n) {
    if (n[0] !== "") noticias.push({ titulo: n[0], texto: n[1], img: n[2] });
  });

  var qS = {
    titulo: hojaAdmin.getRange("H2").getValue().toString() || "Loma Verde Lunar",
    texto: hojaAdmin.getRange("I2").getValue().toString() || "Tejiendo redes comunitarias."
  };

  return { categorias: categorias, idImagen: extraerId(fondo), noticias: noticias, quienesSomos: qS };
}

function obtenerInscriptos(excel) {
  var hoja = garantizarHojaActiva(excel);
  var uF = hoja.getLastRow();
  if (uF < 2) return {}; 
  
  var datos = hoja.getRange(2, 1, uF - 1, 9).getValues(); 
  var lista = {};
  datos.forEach(function(f) {
    var nombre = f[1] ? String(f[1]).trim() : "";
    var cat = f[3] ? String(f[3]).trim() : "";
    
    if (nombre && cat) {
      if (!lista[cat]) lista[cat] = [];
      lista[cat].push({ 
        nombre: nombre, 
        contacto: f[2] ? String(f[2]).trim() : "", 
        desc: f[4] ? String(f[4]).trim() : "", 
        ig: f[5] ? String(f[5]).trim() : "", 
        tienda: f[6] ? String(f[6]).trim() : "", 
        mapa: f[7] ? String(f[7]).trim() : "",
        nombrePersonal: f[8] ? String(f[8]).trim() : ""
      });
    }
  });
  return lista;
}

function extraerId(s) {
  if (!s || s.indexOf('http') === 0) return s;
  if (s.indexOf('id=') > -1) return s.split('id=')[1].split('&')[0];
  if (s.indexOf('/d/') > -1) return s.split('/d/')[1].split('/')[0];
  return s;
}

function guardarPropuesta(f) {
  try {
    var excel = SpreadsheetApp.openById(ID_EXCEL);
    var hoja = garantizarHojaActiva(excel);
    hoja.appendRow([new Date(), f.nombre, f.contacto, f.tipo, f.descripcion, f.instagram, f.tienda, f.mapa, f.nombrePersonal]);

    if (f.imagenBase64 && ID_CARPETA_FLYERS !== 'TU_ID_DE_CARPETA_AQUI' && ID_PLANTILLA_SLIDE !== 'TU_ID_DE_PLANTILLA_AQUI') {
      try {
        var carpeta = DriveApp.getFolderById(ID_CARPETA_FLYERS);
        
        var splitBase = f.imagenBase64.split(',');
        var base64Data = splitBase[1] ? splitBase[1] : splitBase[0];
        var blobOriginal = Utilities.newBlob(Utilities.base64Decode(base64Data), f.imagenMimeType, f.nombre + "_foto_original");
        
        carpeta.createFile(blobOriginal);
        var blobFlyer = blobOriginal; 

        if (API_KEY_REMOVEBG !== 'TU_API_KEY_REMOVEBG_AQUI') {
          try {
            var urlRemove = "https://api.remove.bg/v1.0/removebg";
            var payloadRemove = { "image_file_b64": base64Data, "size": "auto" };
            var optionsRemove = { "method": "post", "headers": { "X-Api-Key": API_KEY_REMOVEBG }, "payload": payloadRemove };
            var responseRemove = UrlFetchApp.fetch(urlRemove, optionsRemove);
            if (responseRemove.getResponseCode() === 200) {
              blobFlyer = responseRemove.getBlob().setName(f.nombre + "_sin_fondo.png");
              carpeta.createFile(blobFlyer);
            }
          } catch (eIA) {
            console.error("Error al remover fondo con IA (se usará original): " + eIA.message);
          }
        }
        
        var plantilla = DriveApp.getFileById(ID_PLANTILLA_SLIDE);
        var copiaSlide = plantilla.makeCopy(f.nombre + " - Flyer Temp", carpeta);
        var presentacion = SlidesApp.openById(copiaSlide.getId());
        var slide = presentacion.getSlides()[0];
        
        presentacion.replaceAllText("{{NOMBRE}}", f.nombre);
        presentacion.replaceAllText("{{RUBRO}}", f.tipo);
        presentacion.replaceAllText("{{DESCRIPCION}}", f.descripcion);
        if(f.instagram) presentacion.replaceAllText("{{INSTAGRAM}}", f.instagram);
        
        // Insertar imagen inteligentemente buscando la etiqueta {{LOGO}}
        var shapes = slide.getShapes();
        var logoInsertado = false;
        
        for (var i = 0; i < shapes.length; i++) {
          var shape = shapes[i];
          if (shape.getText().asString().indexOf("{{LOGO}}") > -1) {
            // Obtener posición y tamaño del recuadro marcador
            var left = shape.getLeft();
            var top = shape.getTop();
            var width = shape.getWidth();
            var height = shape.getHeight();
            
            // Insertar la imagen en esas coordenadas exactas
            var imagenInsertada = slide.insertImage(blobFlyer, left, top, width, height);
            
            // Borrar el cuadro de texto marcador para que no se vea
            shape.remove();
            logoInsertado = true;
            break; // Ya encontramos y reemplazamos el logo
          }
        }
        
        // Fallback: si te olvidaste de poner {{LOGO}}, lo centra por defecto
        if (!logoInsertado) {
          var imagenInsertada = slide.insertImage(blobFlyer);
          var pageWidth = presentacion.getPageWidth();
          var pageHeight = presentacion.getPageHeight();
          imagenInsertada.setLeft((pageWidth/2) - (imagenInsertada.getWidth()/2));
          imagenInsertada.setTop((pageHeight/2) - (imagenInsertada.getHeight()/2));
        }
        
        presentacion.saveAndClose();
        
        var urlExport = "https://docs.google.com/presentation/d/" + copiaSlide.getId() + "/export/png";
        var opcionesFetch = { headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() }, muteHttpExceptions: true };
        Utilities.sleep(2000); 
        
        var response = UrlFetchApp.fetch(urlExport, opcionesFetch);
        if (response.getResponseCode() === 200) {
          var finalImage = response.getBlob().setName(f.nombre + "_Flyer.png");
          carpeta.createFile(finalImage);
        }
        copiaSlide.setTrashed(true);
      } catch (errFlyer) {
        console.error("Error generando flyer: " + errFlyer.message);
        throw new Error("Se guardaron tus datos, pero falló la generación del Flyer: " + errFlyer.message);
      }
    }
    return "¡Guardado con éxito!";
  } catch(e) {
    throw new Error("Error en el sistema: " + e.message);
  }
}

function guardarVoto(datos) {
  try {
    var excel = SpreadsheetApp.openById(ID_EXCEL);
    var hoja = garantizarHojaVotos(excel);
    hoja.appendRow([new Date(), datos.nombre, datos.telefono, datos.partido, datos.localidad, datos.calles, datos.opcion, datos.justificacion]);
    return "¡Voto registrado con éxito!";
  } catch(e) {
    throw new Error("No se pudo registrar el voto: " + e.message);
  }
}

function inscribirVoluntario(datos) {
  try {
    var excel = SpreadsheetApp.openById(ID_EXCEL);
    var hoja = garantizarHojaVoluntarios(excel);
    hoja.appendRow([new Date(), datos.nombre, datos.telefono]);
    return "¡Inscripción exitosa!";
  } catch(e) {
    throw new Error("No se pudo registrar la inscripción: " + e.message);
  }
}

function obtenerConfigPresupuesto(excel) {
  var config = {
    monto: "$2.500.000",
    texto: "Este año, la Municipalidad ha destinado un fondo especial para el mejoramiento de los espacios públicos de Loma Verde. ¡Los vecinos decidimos en qué se invierte!",
    opciones: [
      { id: 0, titulo: "1. Iluminación Sustentable en Plaza La Misión", desc: "Instalación de 15 farolas solares autónomas para mejorar la seguridad y extender el uso de la plaza durante la noche sin consumir energía de red.", presupuestoDetalle: "Farolas Solares (15 unidades): $1.500.000\nMano de obra instalación: $300.000\nFletes y logística: $50.000", donacion: "https://link.mercadopago.com.ar/ejemplo1", imagen: "" },
      { id: 1, titulo: "2. Construcción de Huerta Comunitaria y Compostera", desc: "Cerco perimetral, tierra fértil, cajones de siembra y herramientas para crear un espacio de educación ambiental y soberanía alimentaria en el barrio.", presupuestoDetalle: "Maderas para cajones: $200.000\nTierra fértil y abono: $80.000\nHerramientas comunitarias: $150.000\nSemillas: $20.000", donacion: "https://link.mercadopago.com.ar/ejemplo2", imagen: "" },
      { id: 2, titulo: "3. Refugios Ecológicos para Paradas de Colectivo", desc: "Construcción de 3 refugios de espera con techos vivos (plantas autóctonas) y bancos de madera reciclada en las calles principales.", presupuestoDetalle: "Estructuras de hierro (3x): $1.200.000\nMaderas para bancos: $250.000\nPlantas para techo vivo: $80.000", donacion: "https://link.mercadopago.com.ar/ejemplo3", imagen: "" }
    ],
    lunas: []
  };
  
  if (!excel) return config;
  
  var hojaRecaudacion = garantizarHojaRecaudacion(excel);
  if (hojaRecaudacion) {
    try {
      var uf = hojaRecaudacion.getLastRow();
      if (uf > 1) {
        var vals = hojaRecaudacion.getRange(2, 1, uf - 1, 2).getValues();
        vals.forEach(function(v) {
          if (v[0] && String(v[0]).trim() !== "") {
            config.lunas.push({ nombre: String(v[0]), monto: String(v[1]) });
          }
        });
      }
    } catch(e) {}
  }
  
  var hoja = excel.getSheetByName("Presupuesto");
  if (hoja) {
    try {
      var montoTotal = hoja.getRange("B1").getValue().toString();
      var textoGen = hoja.getRange("B2").getValue().toString();
      if (montoTotal) config.monto = montoTotal;
      if (textoGen) config.texto = textoGen;
      
      var ultFila = hoja.getLastRow();
      if (ultFila >= 5) {
        var datosOpciones = hoja.getRange(5, 1, ultFila - 4, 5).getValues();
        var nuevasOpciones = [];
        datosOpciones.forEach(function(fila, index) {
          if (fila[0] && String(fila[0]).trim() !== "") {
            nuevasOpciones.push({ 
              id: index,
              titulo: String(fila[0]).trim(), 
              desc: String(fila[1]).trim(),
              presupuestoDetalle: fila[2] ? String(fila[2]).trim() : "",
              donacion: fila[3] ? String(fila[3]).trim() : "",
              imagen: fila[4] ? extraerId(String(fila[4]).trim()) : ""
            });
          }
        });
        if (nuevasOpciones.length > 0) config.opciones = nuevasOpciones;
      }
    } catch(e) {
      // Usar defaults si algo falla
    }
  }
  return config;
}

function actualizarProyecto(id, titulo, desc, presupuesto) {
  try {
    var excel = SpreadsheetApp.openById(ID_EXCEL);
    var hoja = excel.getSheetByName("Presupuesto");
    if (!hoja) throw new Error("No se encontró la pestaña Presupuesto.");
    
    // Aseguramos que el ID sea un número para evitar concatenaciones de texto (ej: "1" + 5 = 15)
    var idNumerico = parseInt(id, 10);
    if (isNaN(idNumerico)) idNumerico = 0;
    
    // El id es 0-index. La fila de opciones empieza en la 5.
    var fila = idNumerico + 5; 
    
    hoja.getRange(fila, 1).setValue(titulo); // A: Título
    hoja.getRange(fila, 2).setValue(desc);   // B: Descripción
    hoja.getRange(fila, 3).setValue(presupuesto); // C: Presupuesto Detalle
    
    return "¡Cambios guardados con éxito!";
  } catch(e) {
    throw new Error("Error al guardar: " + e.message);
  }
}

function obtenerDirectorio(excel) {
  var directorio = {};
  if (!excel) return directorio;
  
  var hojas = excel.getSheets();
  hojas.forEach(function(hoja) {
    var nombreHoja = hoja.getName();
    // Filtramos hojas que contengan la palabra "Luna" pero que no sean otras pestañas especiales
    if (nombreHoja.toLowerCase().indexOf('luna') > -1) {
      var uF = hoja.getLastRow();
      if (uF >= 2) {
        var datos = hoja.getRange(2, 1, uF - 1, 9).getValues();
        datos.forEach(function(f) {
          // Si f[1] es un objeto Date, al pasarlo a String queda algo como "Tue May 19..."
          var crudoNombre = f[1];
          var nombre = crudoNombre ? String(crudoNombre).trim() : "";
          var cat = f[3] ? String(f[3]).trim() : "";
          
          if (nombre && cat) {
            // 1. Filtrar basura de planillas viejas
            // Si el nombre parece una fecha (ej. tiene GMT o es muy largo)
            if (nombre.indexOf('GMT') > -1 || nombre.indexOf('hora estándar') > -1) return;
            // Si la categoría son puros números (probablemente es un teléfono)
            if (cat.match(/^[0-9\-\+\s]+$/)) return;
            
            // 2. Normalizar Categoría para unificar "Musica / Arte" con "Musica/Arte"
            cat = normalizarCategoriaStr(cat);
            
            if (!directorio[cat]) directorio[cat] = {};
            
            // Usamos el nombre en minúsculas como clave para evitar duplicados exactos o con distintas mayúsculas
            var nombreKey = nombre.toLowerCase();
            
            // Si no existe, o si queremos actualizar con datos más recientes, lo guardamos
            if (!directorio[cat][nombreKey]) {
              directorio[cat][nombreKey] = {
                nombre: nombre, 
                contacto: f[2] ? String(f[2]).trim() : "", 
                desc: f[4] ? String(f[4]).trim() : "", 
                ig: f[5] ? String(f[5]).trim() : "", 
                tienda: f[6] ? String(f[6]).trim() : "", 
                mapa: f[7] ? String(f[7]).trim() : "",
                nombrePersonal: f[8] ? String(f[8]).trim() : ""
              };
            }
          }
        });
      }
    }
  });
  
  // Convertimos el objeto en un diccionario de arrays ordenados alfabéticamente
  var resultado = {};
  for (var c in directorio) {
    resultado[c] = Object.values(directorio[c]).sort(function(a, b) {
      return a.nombre.localeCompare(b.nombre);
    });
  }
  return resultado;
}

function normalizarCategoriaStr(cat) {
  var c = String(cat).trim();
  // Arreglos heurísticos para unificar rubros
  if (c.toLowerCase().indexOf('música') > -1 || c.toLowerCase().indexOf('musica') > -1 || c.toLowerCase().indexOf('arte') > -1) return 'Música / Arte';
  if (c.toLowerCase().indexOf('gastro') > -1 || c.toLowerCase().indexOf('comida') > -1) return 'Gastronomía';
  if (c.toLowerCase().indexOf('artesan') > -1) return 'Artesanías';
  if (c.toLowerCase().indexOf('huert') > -1 || c.toLowerCase().indexOf('viver') > -1 || c.toLowerCase().indexOf('plant') > -1) return 'Huerta / Vivero';
  if (c.toLowerCase().indexOf('holist') > -1 || c.toLowerCase().indexOf('holíst') > -1) return 'Terapias Holísticas';
  if (c.toLowerCase().indexOf('americana') > -1) return 'Feria Americana';
  if (c.toLowerCase().indexOf('natural') > -1) return 'Productos Naturales';
  
  // Fallback: normalizar mayúsculas y espacios en la barra
  c = c.replace(/\s*\/\s*/g, " / ");
  c = c.toLowerCase().split(' ').map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
  
  return c;
}

/* ==========================================================================
   MERCADO DE VIRTUDES & ESPACIO DE FERIANTES - LOMA VERDE LUNAR ♒
   ========================================================================== */

function garantizarHojaVirtudes(excel) {
  var hoja = excel.getSheetByName("Virtudes");
  if (!hoja) {
    hoja = excel.insertSheet("Virtudes");
    hoja.appendRow(["ID", "Oferente", "Descripción", "Valor ($)", "Stock", "Estado"]);
    hoja.getRange("1:1").setFontWeight("bold");
    
    // Muestras iniciales
    hoja.appendRow([101, "Finca El Nogal", "Miel Orgánica de Monte (500g)", 5000, 5, "Disponible"]);
    hoja.appendRow([102, "Taller Pachamama", "Bolsa de Tela Estampada a Mano", 4000, 3, "Disponible"]);
    hoja.appendRow([103, "Huerta Comunitaria", "Plantín de Albahaca Orgánica", 2500, 8, "Disponible"]);
    hoja.appendRow([104, "Panadería Artesanal", "Pan de Masamadre Multicereal", 3500, 0, "Intercambiada"]);
  }
  return hoja;
}

function garantizarHojaVouchers(excel) {
  var hoja = excel.getSheetByName("Vouchers");
  if (!hoja) {
    hoja = excel.insertSheet("Vouchers");
    hoja.appendRow(["ID Troquel", "Comprador / Familia", "WhatsApp / Teléfono", "Monto Inicial ($)", "Saldo Actual ($)"]);
    hoja.getRange("1:1").setFontWeight("bold");
  }
  return hoja;
}

function garantizarHojaIntercambios(excel) {
  var hoja = excel.getSheetByName("Intercambios");
  if (!hoja) {
    hoja = excel.insertSheet("Intercambios");
    hoja.appendRow(["Fecha", "ID Troquel", "ID Virtud", "Valor Intercambiado ($)"]);
    hoja.getRange("1:1").setFontWeight("bold");
  }
  return hoja;
}

function obtenerVirtudes(excel) {
  var virtudes = [];
  
  if (!excel) {
    return [
      { id: 101, oferente: "Finca El Nogal", descripcion: "Miel Orgánica de Monte (500g)", valor: 5000, stock: 5, estado: "Disponible" },
      { id: 102, oferente: "Taller Pachamama", descripcion: "Bolsa de Tela Estampada a Mano", valor: 4000, stock: 3, estado: "Disponible" },
      { id: 103, oferente: "Huerta Comunitaria", descripcion: "Plantín de Albahaca Orgánica", valor: 2500, stock: 8, estado: "Disponible" },
      { id: 104, oferente: "Panadería Artesanal", descripcion: "Pan de Masamadre Multicereal", valor: 3500, stock: 0, estado: "Intercambiada" }
    ];
  }
  
  try {
    var hoja = garantizarHojaVirtudes(excel);
    var datos = hoja.getDataRange().getValues();
    
    for (var i = 1; i < datos.length; i++) {
      if (datos[i][0] !== "" && datos[i][1] !== "") {
        virtudes.push({
          id: datos[i][0],
          oferente: String(datos[i][1]).trim(),
          descripcion: String(datos[i][2]).trim(),
          valor: parseFloat(datos[i][3]) || 0,
          stock: parseInt(datos[i][4]) || 0,
          estado: datos[i][5] ? String(datos[i][5]).trim() : "Disponible"
        });
      }
    }
  } catch(e) {
    console.error("Error al obtener virtudes desde el Excel: " + e.message);
  }
  
  if (virtudes.length === 0) {
    virtudes = [
      { id: 101, oferente: "Finca El Nogal", descripcion: "Miel Orgánica de Monte (500g)", valor: 5000, stock: 5, estado: "Disponible" },
      { id: 102, oferente: "Taller Pachamama", descripcion: "Bolsa de Tela Estampada a Mano", valor: 4000, stock: 3, estado: "Disponible" },
      { id: 103, oferente: "Huerta Comunitaria", descripcion: "Plantín de Albahaca Orgánica", valor: 2500, stock: 8, estado: "Disponible" }
    ];
  }
  
  return virtudes;
}

function procesarIntercambio(idVoucher, idVirtud) {
  try {
    var excel = SpreadsheetApp.openById(ID_EXCEL);
    var hojaVouchers = garantizarHojaVouchers(excel);
    var hojaVirtudes = garantizarHojaVirtudes(excel);
    var hojaIntercambios = garantizarHojaIntercambios(excel);

    var voucherBuscado = String(idVoucher).trim();

    // 1. Buscar cuánto vale la virtud y si hay stock
    var datosVirtudes = hojaVirtudes.getDataRange().getValues();
    var filaVirtud = -1;
    var valorVirtud = 0;
    var stockActual = 0;
    
    for (var i = 1; i < datosVirtudes.length; i++) {
      if (String(datosVirtudes[i][0]).trim() === String(idVirtud).trim() && String(datosVirtudes[i][5]).trim() === "Disponible") {
        filaVirtud = i + 1; 
        valorVirtud = parseFloat(datosVirtudes[i][3]) || 0; 
        stockActual = parseInt(datosVirtudes[i][4]) || 0;
        break;
      }
    }

    if (filaVirtud === -1 || stockActual <= 0) {
      return "Esa virtud ya fue intercambiada en su totalidad o no está disponible.";
    }

    // 2. Buscar el voucher y ver si tiene saldo
    var datosVouchers = hojaVouchers.getDataRange().getValues();
    var filaVoucher = -1;
    var saldoVoucher = 0;
    
    for (var j = 1; j < datosVouchers.length; j++) {
      if (String(datosVouchers[j][0]).trim() === voucherBuscado) {
        filaVoucher = j + 1;
        var saldoEnHoja = datosVouchers[j][4]; 
        if (saldoEnHoja === "" || saldoEnHoja === undefined) {
          saldoVoucher = parseFloat(datosVouchers[j][3]) || 0; 
        } else {
          saldoVoucher = parseFloat(saldoEnHoja) || 0; 
        }
        break;
      }
    }

    if (filaVoucher === -1) {
      return "No encontramos el número de troquel " + voucherBuscado + ". Por favor revisa tu troquel.";
    }
    
    if (saldoVoucher < valorVirtud) {
      return "Tu troquel no tiene saldo suficiente. Saldo actual: $" + saldoVoucher;
    }

    // 3. Efectuar el intercambio
    var nuevoSaldo = saldoVoucher - valorVirtud;
    var nuevoStock = stockActual - 1;
    
    hojaVouchers.getRange(filaVoucher, 5).setValue(nuevoSaldo); 
    hojaVirtudes.getRange(filaVirtud, 5).setValue(nuevoStock);  
    
    if (nuevoStock <= 0) {
      hojaVirtudes.getRange(filaVirtud, 6).setValue("Intercambiada"); 
    }

    hojaIntercambios.appendRow([new Date(), voucherBuscado, idVirtud, valorVirtud]);

    return "¡Éxito! Has apoyado la economía fraterna. Te quedan $" + nuevoSaldo + " de saldo.";
  } catch(e) {
    throw new Error("Error en el intercambio: " + e.message);
  }
}

function generarVoucher(nombre, telefono, monto) {
  try {
    var excel = SpreadsheetApp.openById(ID_EXCEL);
    var hoja = garantizarHojaVouchers(excel);
    
    var ultimaFila = hoja.getLastRow();
    var nuevoID = 136900; 
    
    if (ultimaFila > 1) {
      var idAnterior = parseInt(hoja.getRange(ultimaFila, 1).getValue()) || 136900;
      nuevoID = idAnterior + Math.floor(Math.random() * 5) + 1; 
    }
    
    var montoNum = parseFloat(monto) || 0;
    hoja.appendRow([nuevoID, nombre, telefono, montoNum, montoNum]);
    return nuevoID;
  } catch(e) {
    // ID aleatorio fallback si falla excel
    return Math.floor(100000 + Math.random() * 900000);
  }
}

function publicarVirtud(datos) {
  try {
    var excel = SpreadsheetApp.openById(ID_EXCEL);
    var hoja = garantizarHojaVirtudes(excel);
    
    var uF = hoja.getLastRow();
    var nuevoID = 101;
    if (uF > 1) {
      var valUlt = parseInt(hoja.getRange(uF, 1).getValue());
      if (!isNaN(valUlt)) nuevoID = valUlt + 1;
      else nuevoID = uF + 100;
    }
    
    var oferente = datos.oferente || "Feriante Anónimo";
    var descripcion = datos.descripcion || "";
    var valor = parseFloat(datos.valor) || 0;
    var stock = parseInt(datos.stock) || 1;
    var estado = stock > 0 ? "Disponible" : "Intercambiada";
    
    hoja.appendRow([nuevoID, oferente, descripcion, valor, stock, estado]);
    return "¡Producto/Virtud publicado con éxito en el Mercado!";
  } catch(e) {
    throw new Error("Error al publicar la virtud: " + e.message);
  }
}
