const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const firebase = require('./firebase');
const lunarCalendar = require('./lunarCalendar');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
} catch (e) {
  // Ignorado en entornos Serverless de solo lectura como Vercel
}

const SEED_DATA = {
  config: {
    lunaActiva: "Luna Tauro",
    nombreEvento: "Encuentro Vecinal",
    subtitulo: "Luna Llena en Tauro ♉",
    signo: "Tauro",
    simboloZodiacal: "♉",
    elemento: "Tierra Fija 🌿🐂",
    regente: "Venus 🌸",
    fechaEvento: "Domingo 8 de Noviembre • 12 a 18 hs",
    fechaEventoTexto: "8 DE NOVIEMBRE",
    diaSemanaTexto: "DOMINGO",
    horarioTexto: "DE 12 A 18 HS",
    horarioArmadoTexto: "Armado feriantes: 11 a 12 hs",
    horarioPublicoTexto: "12 a 18 hs",
    motto: "Celebrando la abundancia de la tierra, la soberanía alimentaria, el enraizamiento y el goce consciente.",
    lugar: "Loma Verde - Escobar | Plaza La Misión y Nigromante",
    mistica: "La Luna Llena en Tauro nos enraíza en la belleza y fertilidad de la tierra. Momento de honrar los frutos de la huerta, las manos hacedoras, la economía fraterna y el cuidado paciente de lo que amamos. Conectamos con el valor genuino de la materia viva y la reciprocidad comunitaria. ♉🌿🐂🌾",
    quienesSomos: {
      titulo: "Loma Verde Lunar",
      texto: "Tejiendo redes comunitarias, economía fraterna y soberanía barrial en armonía con los ciclos de la naturaleza y la frecuencia 13:20."
    },
    categorias: [
      "Artesanías",
      "Gastronomía",
      "Oficio / Servicio",
      "Huerta / Vivero",
      "Música / Arte",
      "Terapias Holísticas",
      "Feria Americana",
      "Productos Naturales"
    ],
    idImagenFondo: "",
    claveAdmin: "lomaverde",
    instagramConfig: {
      connected: false,
      metodo: "meta_api",
      instagramAccountId: "",
      accessToken: "",
      webhookUrl: "",
      userName: "@lomaverdelunar",
      lastPublishedAt: null
    }
  },
  noticias: [
    {
          "id": "noticia-tauro-foodtrucks",
          "titulo": "Convocatoria abierta para Foodtrucks en la Feria de Tauro: Loma Verde busca celebrar el buen comer y dar a conocer a sus cocineros locales",
          "volanta": "CONVOCATORIA GASTRONÓMICA • LUNA EN TAURO ♉",
          "copete": "Bajo la influencia sensorial y nutricia de la Luna Llena en Tauro, el gran encuentro del domingo 8 de noviembre en Plaza La Misión abrirá un circuito especial para foodtrucks, fuegos y cocinas sobre ruedas con el objetivo de dar visibilidad al talento gastronómico de nuestro barrio.",
          "bajada": "Bajo la influencia sensorial y nutricia de la Luna Llena en Tauro, el gran encuentro del domingo 8 de noviembre en Plaza La Misión abrirá un circuito especial para foodtrucks, fuegos y cocinas sobre ruedas con el objetivo de dar visibilidad al talento gastronómico de nuestro barrio.",
          "texto": "Tauro es, por excelencia astrológica y mística, el signo del deleite corporal, la materia viva y el amor por los frutos de la tierra. Regido por Venus —planeta de la armonía, la estética y el goce sensible—, el arquetipo taurino nos recuerda que comer no es un mero trámite biológico, sino un ritual sagrado de enraizamiento, conexión y presencia viva.\n\nEn un tiempo vertiginoso dominado por el apuro y los productos ultraprocesados, la próxima Luna Llena en Tauro nos convoca a frenar el reloj, volver al fogón con paciencia, saborear ingredientes nobles y compartir la mesa mirándonos a los ojos. Con esa visión comunitaria como bandera, la coordinación de Loma Verde Lunar lanzó una convocatoria abierta y especial para Foodtrucks, trailers gastronómicos, fuegos y cocinas sobre ruedas de cara al encuentro vecinal del domingo 8 de noviembre en la Plaza La Misión.\n\n«Queremos que el barrio conozca a quienes cocinan con amor en Loma Verde»\n\nUno de los propósitos esenciales de esta iniciativa es poner en primer plano el talento culinario que habita en las calles, quintas y cocinas de nuestro barrio. En Loma Verde y el corredor norte conviven pasteleros de receta familiar, pizzeros de masa madre fermentada lentamente, asadores de fuegos criollos, elaboradores de conservas y fermentos vivos, cocineros vegetarianos y baristas apasionados que muchas veces desarrollan su labor en espacios cerrados o eventos reducidos.\n\n«Loma Verde tiene una identidad gastronómica silenciosa pero riquísima», expresaron desde el equipo organizador del encuentro. «Buscamos que la plaza sea una gran vidriera comunitaria donde los vecinos prueben lo auténtico: quién amasa ese pan crujiente, quién brasea la bondiola a la leña, quién exprime fruta fresca de las quintas locales o quién hornea sin aditivos ni conservantes industriales. Comer rico y casero es un acto de soberanía cultural y de salud colectiva».\n\nPropuestas buscadas: variedad, sabor y conciencia\n\nLa feria priorizará proyectos que combinen calidad, calidez en la atención y amor por las materias primas. Entre las categorías convocadas se destacan:\n\n• Cocina al paso y fuegos de autor: Hamburguesas caseras, sándwiches de carnes desmechadas, empanadas de receta tradicional y platos calientes al disco.\n• Gastronomía vegetariana, vegana y sin TACC: Cocina basada en plantas, vegetales agroecológicos de estación, falafel, tartas rústicas y opciones aptas para personas celíacas.\n• Dulces, pastelería y meriendas: Budines, alfajores de autor con dulce de leche artesanal, crepes y wafles para acompañar la tarde.\n• Bebidas naturales y fermentos: Jugos exprimidos, limonadas con hierbas aromáticas recién cosechadas (menta, albahaca, jengibre), kéfir, kombucha y cerveza artesanal regional.\n• Cafetería de especialidad y mate bar: Infusiones cuidadas para disfrutar bajo los árboles de la plaza.\n\nHorarios y logística en la plaza\n\nPara garantizar una jornada ordenada y fluida para el público y los feriantes, los horarios ya se encuentran fijados:\n\n• Armado e ingreso de Foodtrucks y gazebos gastronómicos: De 11:00 a 12:00 hs.\n• Apertura al público y feria: De 12:00 a 18:00 hs.\n• Ubicación: Plaza La Misión y Nigromante, Loma Verde (Escobar).\n\nEl sector asignado a los foodtrucks dispondrá de accesos vehiculares despejados, mesas y bancos comunitarios al aire libre, y cercanía con el escenario acústico que musicalizará la jornada.\n\n¿Cómo inscribirse?\n\nLos cocineros y titulares de foodtrucks interesados pueden postularse completando el formulario online en la pestaña «Súmate» de la plataforma (https://lomaverdelunar.online/sumate), seleccionando el rubro «Gastronomía» e indicando dimensiones de su vehículo o puesto, menú previsto, requerimientos de energía y fotos o enlaces a sus redes sociales.\n\nLos cupos son limitados para asegurar una oferta armónica, diversa y sustentable para todos los puesteros. Loma Verde enciende sus fuegos: la mesa vecinal está servida bajo el cielo de Tauro.",
          "contenido": "Tauro es, por excelencia astrológica y mística, el signo del deleite corporal, la materia viva y el amor por los frutos de la tierra. Regido por Venus —planeta de la armonía, la estética y el goce sensible—, el arquetipo taurino nos recuerda que comer no es un mero trámite biológico, sino un ritual sagrado de enraizamiento, conexión y presencia viva.\n\nEn un tiempo vertiginoso dominado por el apuro y los productos ultraprocesados, la próxima Luna Llena en Tauro nos convoca a frenar el reloj, volver al fogón con paciencia, saborear ingredientes nobles y compartir la mesa mirándonos a los ojos. Con esa visión comunitaria como bandera, la coordinación de Loma Verde Lunar lanzó una convocatoria abierta y especial para Foodtrucks, trailers gastronómicos, fuegos y cocinas sobre ruedas de cara al encuentro vecinal del domingo 8 de noviembre en la Plaza La Misión.\n\n«Queremos que el barrio conozca a quienes cocinan con amor en Loma Verde»\n\nUno de los propósitos esenciales de esta iniciativa es poner en primer plano el talento culinario que habita en las calles, quintas y cocinas de nuestro barrio. En Loma Verde y el corredor norte conviven pasteleros de receta familiar, pizzeros de masa madre fermentada lentamente, asadores de fuegos criollos, elaboradores de conservas y fermentos vivos, cocineros vegetarianos y baristas apasionados que muchas veces desarrollan su labor en espacios cerrados o eventos reducidos.\n\n«Loma Verde tiene una identidad gastronómica silenciosa pero riquísima», expresaron desde el equipo organizador del encuentro. «Buscamos que la plaza sea una gran vidriera comunitaria donde los vecinos prueben lo auténtico: quién amasa ese pan crujiente, quién brasea la bondiola a la leña, quién exprime fruta fresca de las quintas locales o quién hornea sin aditivos ni conservantes industriales. Comer rico y casero es un acto de soberanía cultural y de salud colectiva».\n\nPropuestas buscadas: variedad, sabor y conciencia\n\nLa feria priorizará proyectos que combinen calidad, calidez en la atención y amor por las materias primas. Entre las categorías convocadas se destacan:\n\n• Cocina al paso y fuegos de autor: Hamburguesas caseras, sándwiches de carnes desmechadas, empanadas de receta tradicional y platos calientes al disco.\n• Gastronomía vegetariana, vegana y sin TACC: Cocina basada en plantas, vegetales agroecológicos de estación, falafel, tartas rústicas y opciones aptas para personas celíacas.\n• Dulces, pastelería y meriendas: Budines, alfajores de autor con dulce de leche artesanal, crepes y wafles para acompañar la tarde.\n• Bebidas naturales y fermentos: Jugos exprimidos, limonadas con hierbas aromáticas recién cosechadas (menta, albahaca, jengibre), kéfir, kombucha y cerveza artesanal regional.\n• Cafetería de especialidad y mate bar: Infusiones cuidadas para disfrutar bajo los árboles de la plaza.\n\nHorarios y logística en la plaza\n\nPara garantizar una jornada ordenada y fluida para el público y los feriantes, los horarios ya se encuentran fijados:\n\n• Armado e ingreso de Foodtrucks y gazebos gastronómicos: De 11:00 a 12:00 hs.\n• Apertura al público y feria: De 12:00 a 18:00 hs.\n• Ubicación: Plaza La Misión y Nigromante, Loma Verde (Escobar).\n\nEl sector asignado a los foodtrucks dispondrá de accesos vehiculares despejados, mesas y bancos comunitarios al aire libre, y cercanía con el escenario acústico que musicalizará la jornada.\n\n¿Cómo inscribirse?\n\nLos cocineros y titulares de foodtrucks interesados pueden postularse completando el formulario online en la pestaña «Súmate» de la plataforma (https://lomaverdelunar.online/sumate), seleccionando el rubro «Gastronomía» e indicando dimensiones de su vehículo o puesto, menú previsto, requerimientos de energía y fotos o enlaces a sus redes sociales.\n\nLos cupos son limitados para asegurar una oferta armónica, diversa y sustentable para todos los puesteros. Loma Verde enciende sus fuegos: la mesa vecinal está servida bajo el cielo de Tauro.",
          "img": "/foodtruck-loma-verde.jpg",
      "imagenUrl": "/foodtruck-loma-verde.jpg",
          "epigrafe": "Puesto gastronómico y foodtruck integrado bajo el arbolado de la plaza, convocando a celebrar la cocina local y el buen comer en comunidad.",
          "lunaId": "luna-tauro-2026",
          "lunaNombre": "Luna Llena en Tauro ♉",
          "seccion": "gastronomia",
          "seccionEtiqueta": "Gastronomía & Sabores",
          "autor": "Redacción Gastronómica Loma Verde",
          "fecha": "2026-10-26",
          "fechaTexto": "26 de Octubre de 2026",
          "destacada": true,
          "tiempoLectura": "4 min",
          "vistas": 188,
          "etiquetas": [
                "#Foodtrucks",
                "#LunaEnTauro",
                "#CocinerosLocales",
                "#BuenComer",
                "#LomaVerdeSabores",
                "#GastronomiaConsciente"
          ]
    },
    {
      id: "noticia-tauro-1",
      titulo: "Loma Verde prepara su gran encuentro de Luna Llena en Tauro: El valor de la materia viva, la tierra fértil y los oficios que conservan el alma humana",
      volanta: "EDICIÓN ESPECIAL LUNA EN TAURO ♉",
      copete: "El próximo domingo 8 de noviembre, la Plaza La Misión será el epicentro de una jornada que combina soberanía alimentaria, arte popular, intercambio de semillas y una feria fraterna con más de 60 productores locales.",
      bajada: "El próximo domingo 8 de noviembre, la Plaza La Misión será el epicentro de una jornada que combina soberanía alimentaria, arte popular, intercambio de semillas y una feria fraterna con más de 60 productores locales.",
      texto: "Bajo la influencia paciente y nutricia de la Luna Llena en Tauro, Loma Verde se prepara para vivir una de las celebraciones comunitarias más esperadas de la primavera. El evento, que congregará a artesanos, huerteros, músicos y familias de toda la región, propone volver al valor genuino de las manos hacedoras y la reciprocidad comunitaria.\n\n«Tauro nos enseña a valorar lo que la tierra nos regala cuando se la cuida con respeto», expresó Marta Almada, productora agroecológica local. «En tiempos de vértigo y pantallas, este encuentro nos invita a tocar la arcilla, oler el pan recién horneado y mirarnos a los ojos sin intermediarios».\n\nDurante toda la jornada habrá talleres abiertos de compostaje, bioconstrucción y medicina herbal, junto con un escenario acústico alimentado con energía solar donde confluirán artistas de raíz folklórica y ensambles vecinales.",
      contenido: "Bajo la influencia paciente y nutricia de la Luna Llena en Tauro, Loma Verde se prepara para vivir una de las celebraciones comunitarias más esperadas de la primavera. El evento, que congregará a artesanos, huerteros, músicos y familias de toda la región, propone volver al valor genuino de las manos hacedoras y la reciprocidad comunitaria.\n\n«Tauro nos enseña a valorar lo que la tierra nos regala cuando se la cuida con respeto», expresó Marta Almada, productora agroecológica local. «En tiempos de vértigo y pantallas, este encuentro nos invita a tocar la arcilla, oler el pan recién horneado y mirarnos a los ojos sin intermediarios».\n\nDurante toda la jornada habrá talleres abiertos de compostaje, bioconstrucción y medicina herbal, junto con un escenario acústico alimentado con energía solar donde confluirán artistas de raíz folklórica y ensambles vecinales.",
      img: "/loma-verde-callecita-opt.jpg",
      imagenUrl: "/loma-verde-callecita-opt.jpg",
      epigrafe: "Entorno natural y calles arboladas de Loma Verde, escenario del encuentro comunitario del domingo 8 de noviembre.",
      lunaId: "luna-tauro-2026",
      lunaNombre: "Luna Llena en Tauro ♉",
      seccion: "comunidad",
      seccionEtiqueta: "Comunidad & Vecinal",
      autor: "Redacción Loma Verde",
      fecha: "2026-10-18",
      fechaTexto: "18 de Octubre de 2026",
      destacada: true,
      tiempoLectura: "4 min",
      vistas: 142,
      etiquetas: ["#LunaEnTauro", "#SoberaniaAlimentaria", "#FeriaLomaVerde", "#Comunidad"]
    },
    {
      id: "noticia-tauro-2",
      titulo: "La Asamblea Vecinal define nuevas acciones legales contra la antena 5G: «Nuestra salud y nuestro cielo no se negocian»",
      volanta: "DEFENSA DEL BARRIO",
      copete: "Vecinos autoconvocados de Los Aromos y El Cazador ratificaron el estado de alerta comunitaria y presentarán un recurso de amparo ante la justicia bonaerense por la instalación inconsulta de torres de telecomunicaciones.",
      bajada: "Vecinos autoconvocados de Los Aromos y El Cazador ratificaron el estado de alerta comunitaria y presentarán un recurso de amparo ante la justicia bonaerense por la instalación inconsulta de torres de telecomunicaciones.",
      texto: "En una concurrida asamblea realizada en la esquina de Los Aromos y Las Palmeras, decenas de familias de Loma Verde acordaron continuar con el plan de lucha en resguardo de la calidad de vida y el arbolado histórico del barrio.\n\n«Ninguna multinacional puede venir a atropellar la voluntad de una comunidad que eligió vivir en calma y en contacto con la naturaleza», sostuvo Jorge Roldán, referente asambleario. Los vecinos recordaron que la ordenanza municipal exige audiencias públicas previas y estudios de impacto ambiental acumulativo.\n\nEn la web comunitaria ya se han superado las 450 adhesiones de apoyo y se coordinarán rondas de vigilia pacífica para evitar trabajos no autorizados.",
      contenido: "En una concurrida asamblea realizada en la esquina de Los Aromos y Las Palmeras, decenas de familias de Loma Verde acordaron continuar con el plan de lucha en resguardo de la calidad de vida y el arbolado histórico del barrio.\n\n«Ninguna multinacional puede venir a atropellar la voluntad de una comunidad que eligió vivir en calma y en contacto con la naturaleza», sostuvo Jorge Roldán, referente asambleario. Los vecinos recordaron que la ordenanza municipal exige audiencias públicas previas y estudios de impacto ambiental acumulativo.\n\nEn la web comunitaria ya se han superado las 450 adhesiones de apoyo y se coordinarán rondas de vigilia pacífica para evitar trabajos no autorizados.",
      img: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80",
      imagenUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80",
      epigrafe: "Vecinos reunidos en asamblea abierta discutiendo los pasos legales en defensa de la tierra.",
      lunaId: "luna-tauro-2026",
      lunaNombre: "Luna Llena en Tauro ♉",
      seccion: "comunidad",
      seccionEtiqueta: "Comunidad & Vecinal",
      autor: "Comisión de Prensa Vecinal",
      fecha: "2026-10-17",
      fechaTexto: "17 de Octubre de 2026",
      destacada: false,
      tiempoLectura: "3 min",
      vistas: 215,
      etiquetas: ["#NoAlaAntena", "#SoberaniaVecinal", "#CieloLimpio", "#LomaVerdeDespierta"]
    },
    {
      id: "noticia-tauro-3",
      titulo: "El Mercado de Virtudes supera los 200 intercambios fraternos: El troquel que desafía la inflación",
      volanta: "ECONOMÍA POPULAR & SOLIDARIA",
      copete: "El sistema de troqueles impresos y digitales permite a huerteros, panaderos y artesanos intercambiar bienes sin necesidad de efectivo bancario, fortaleciendo el circuito económico interno.",
      bajada: "El sistema de troqueles impresos y digitales permite a huerteros, panaderos y artesanos intercambiar bienes sin necesidad de efectivo bancario, fortaleciendo el circuito económico interno.",
      texto: "A tres meses de su puesta en marcha en Loma Verde, el Mercado de Virtudes ya cuenta con 45 puestos adheridos. Frascos de miel agroecológica, plantines nativos, cerámica gres y clases de yoga se intercambian a través del Troquel Comunitario 13:20.\n\n«La virtud no cotiza en dólares ni depende del FMI: su respaldo es la palabra y el trabajo genuino de nuestros vecinos», explicó Luciana, tejedora y feriante activa. Para la Luna en Tauro se habilitará un punto de canje donde quienes no tengan troqueles podrán sumar horas de voluntariado para obtener sus primeros créditos.",
      contenido: "A tres meses de su puesta en marcha en Loma Verde, el Mercado de Virtudes ya cuenta con 45 puestos adheridos. Frascos de miel agroecológica, plantines nativos, cerámica gres y clases de yoga se intercambian a través del Troquel Comunitario 13:20.\n\n«La virtud no cotiza en dólares ni depende del FMI: su respaldo es la palabra y el trabajo genuino de nuestros vecinos», explicó Luciana, tejedora y feriante activa. Para la Luna en Tauro se habilitará un punto de canje donde quienes no tengan troqueles podrán sumar horas de voluntariado para obtener sus primeros créditos.",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      imagenUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      epigrafe: "Puestos del mercado intercambiando alimentos agroecológicos bajo el sistema de troqueles.",
      lunaId: "luna-tauro-2026",
      lunaNombre: "Luna Llena en Tauro ♉",
      seccion: "economia",
      seccionEtiqueta: "Economía Fraterna",
      autor: "Equipo de Economía Solidaria",
      fecha: "2026-10-16",
      fechaTexto: "16 de Octubre de 2026",
      destacada: false,
      tiempoLectura: "3 min",
      vistas: 98,
      etiquetas: ["#MercadoDeVirtudes", "#TroquelLunar", "#EconomiaSocial", "#TruequeFraterno"]
    },
    {
      id: "noticia-tauro-4",
      titulo: "Guía práctica de siembra para Tauro: La fertilidad de la tierra en su punto cúspide",
      volanta: "SOBERANÍA Y HUERTA",
      copete: "Tomates reliquia, albahaca genovesa, zapallos criollos y aromáticas medicinales: especialistas del vivero comunitario comparten los secretos para sembrar con el ciclo lunar.",
      bajada: "Tomates reliquia, albahaca genovesa, zapallos criollos y aromáticas medicinales: especialistas del vivero comunitario comparten los secretos para sembrar con el ciclo lunar.",
      texto: "El signo de tierra fija regido por Venus confiere a los cultivos una fortaleza radicular excepcional. Los huerteros de Loma Verde recomiendan aprovechar los días previos al plenilunio para trasplantar plantines que requieran follaje vigoroso y fruto carnoso.\n\nAdemás, se distribuirán más de 500 sobres de semillas criollas libres de transgénicos para que cada familia inicie su banco de semillas domiciliario.",
      contenido: "El signo de tierra fija regido por Venus confiere a los cultivos una fortaleza radicular excepcional. Los huerteros de Loma Verde recomiendan aprovechar los días previos al plenilunio para trasplantar plantines que requieran follaje vigoroso y fruto carnoso.\n\nAdemás, se distribuirán más de 500 sobres de semillas criollas libres de transgénicos para que cada familia inicie su banco de semillas domiciliario.",
      img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
      imagenUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
      epigrafe: "Plantines de estación listos para trasplante en la huerta comunitaria de Loma Verde.",
      lunaId: "luna-tauro-2026",
      lunaNombre: "Luna Llena en Tauro ♉",
      seccion: "tierra",
      seccionEtiqueta: "Soberanía & Tierra",
      autor: "Doña Carmen (Huerta Orgánica)",
      fecha: "2026-10-15",
      fechaTexto: "15 de Octubre de 2026",
      destacada: false,
      tiempoLectura: "2 min",
      vistas: 160,
      etiquetas: ["#HuertaEnCasa", "#SemillasCriollas", "#Agroecologia", "#TierraViva"]
    },
    {
      id: "noticia-tauro-5",
      titulo: "Escenario Lunar: Se confirma la grilla musical del 8 de Noviembre con ensambles locales y cantoras de raíz",
      volanta: "CULTURA & MÚSICA",
      copete: "Sonidos acústicos, tambores ancestrales y poesía viva acompañarán el atardecer en la Plaza La Misión.",
      bajada: "Sonidos acústicos, tambores ancestrales y poesía viva acompañarán el atardecer en la Plaza La Misión.",
      texto: "La música vuelve a ser el puente que une corazones bajo la luz de la luna. Desde las 14 horas se presentarán ensambles de cuerdas, música andina, charango y cantautoras independientes del corredor norte.\n\nEl cierre estará a cargo del Ensamble de Percusión Comunitaria, donde todos los presentes podrán sumarse con palmas y maracas para celebrar la vida en común.",
      contenido: "La música vuelve a ser el puente que une corazones bajo la luz de la luna. Desde las 14 horas se presentarán ensambles de cuerdas, música andina, charango y cantautoras independientes del corredor norte.\n\nEl cierre estará a cargo del Ensamble de Percusión Comunitaria, donde todos los presentes podrán sumarse con palmas y maracas para celebrar la vida en común.",
      img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      imagenUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      epigrafe: "Artistas locales ensayando al aire libre de cara a la función del domingo 8 de noviembre.",
      lunaId: "luna-tauro-2026",
      lunaNombre: "Luna Llena en Tauro ♉",
      seccion: "cultura",
      seccionEtiqueta: "Cultura & Música",
      autor: "Colectivo Escenario Libre",
      fecha: "2026-10-14",
      fechaTexto: "14 de Octubre de 2026",
      destacada: false,
      tiempoLectura: "3 min",
      vistas: 112,
      etiquetas: ["#MusicaEnVivo", "#EscenarioLunar", "#Folklore", "#ArteComunitario"]
    },
    {
      id: "noticia-tauro-6",
      titulo: "Columna: «Sembrar comunidad en tiempos de incertidumbre: La lección de los árboles añosos»",
      volanta: "VOCES DE LOMA VERDE",
      copete: "Una reflexión sobre el valor del tiempo lento, la vecindad cotidiana y el reencuentro con la tierra que pisamos.",
      bajada: "Una reflexión sobre el valor del tiempo lento, la vecindad cotidiana y el reencuentro con la tierra que pisamos.",
      texto: "Caminar por las calles de tierra de Loma Verde al caer la tarde es un bálsamo. Los paraísos y las casuarinas no se apuran: crecen hacia el cielo porque sus raíces se abrazan en lo invisible.\n\nAsí debe ser una comunidad. Frente al individualismo del siglo XXI, el secreto no es huir del mundo sino construir un mundo adentro del mundo: una red fraterna donde nadie sobre y donde el dolor de uno sea la preocupación de todos.",
      contenido: "Caminar por las calles de tierra de Loma Verde al caer la tarde es un bálsamo. Los paraísos y las casuarinas no se apuran: crecen hacia el cielo porque sus raíces se abrazan en lo invisible.\n\nAsí debe ser una comunidad. Frente al individualismo del siglo XXI, el secreto no es huir del mundo sino construir un mundo adentro del mundo: una red fraterna donde nadie sobre y donde el dolor de uno sea la preocupación de todos.",
      img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
      imagenUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
      epigrafe: "Atardecer arbolado en Loma Verde, escenario de serenidad y encuentro vecinal.",
      lunaId: "luna-tauro-2026",
      lunaNombre: "Luna Llena en Tauro ♉",
      seccion: "opinion",
      seccionEtiqueta: "Opinión & Crónica",
      autor: "Ignacio Pellegrini (Vecino y carpintero)",
      fecha: "2026-10-13",
      fechaTexto: "13 de Octubre de 2026",
      destacada: false,
      tiempoLectura: "2 min",
      vistas: 85,
      etiquetas: ["#Cronica", "#FilosofiaVecinal", "#LomaVerde", "#VivirMejor"]
    },
    {
      id: "noticia-aries-1",
      titulo: "El fuego creador de la primavera brilló en la plaza: Crónica del gran encuentro de Luna Llena en Aries",
      volanta: "MEMORIA LUNAR • ARIES ♈",
      copete: "Más de 400 personas colmaron la Plaza La Misión en una tarde marcada por el inicio de temporada, nuevos proyectos comunitarios y la fuerza del fuego sagrado.",
      bajada: "Más de 400 personas colmaron la Plaza La Misión en una tarde marcada por el inicio de temporada, nuevos proyectos comunitarios y la fuerza del fuego sagrado.",
      texto: "Con el Sol en Libra y la Luna en Aries, el equilibrio y la iniciativa se dieron la mano en Loma Verde. La feria albergó a 50 emprendedores y la participación de jóvenes que presentaron proyectos de reciclaje de plásticos y compostaje barrial.\n\nEl fuego sagrado se encendió al caer la tarde, marcando el compromiso de proteger nuestro territorio ante cualquier intento de invasión inmobiliaria o tecnológica nociva.",
      contenido: "Con el Sol en Libra y la Luna en Aries, el equilibrio y la iniciativa se dieron la mano en Loma Verde. La feria albergó a 50 emprendedores y la participación de jóvenes que presentaron proyectos de reciclaje de plásticos y compostaje barrial.\n\nEl fuego sagrado se encendió al caer la tarde, marcando el compromiso de proteger nuestro territorio ante cualquier intento de invasión inmobiliaria o tecnológica nociva.",
      img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
      imagenUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
      epigrafe: "Cientos de vecinos disfrutando de la feria de artesanos durante la Luna en Aries.",
      lunaId: "luna-aries-2026",
      lunaNombre: "Luna Llena en Aries ♈",
      seccion: "comunidad",
      seccionEtiqueta: "Comunidad & Vecinal",
      autor: "Redacción Loma Verde",
      fecha: "2026-10-04",
      fechaTexto: "4 de Octubre de 2026",
      destacada: true,
      tiempoLectura: "3 min",
      vistas: 320,
      etiquetas: ["#LunaEnAries", "#Primavera", "#FuegoCreador", "#Feria"]
    },
    {
      id: "noticia-aries-2",
      titulo: "Hito astronómico: Plutón arrancó directo en Acuario y marca el despertar de la red humana horizontal",
      volanta: "CLIMA CÓSMICO & CIELO",
      copete: "Tras cinco meses de retrogradación, el planeta de la alquimia profunda inicia su tránsito directo acelerando la caída de estructuras piramidales y el auge de las redes locales.",
      bajada: "Tras cinco meses de retrogradación, el planeta de la alquimia profunda inicia su tránsito directo acelerando la caída de estructuras piramidales y el auge de las redes locales.",
      texto: "Para la cosmovisión astrológica, la estación directa de Plutón a 3 grados de Acuario simboliza la emancipación ciudadana. En Loma Verde, este clima se siente en el fortalecimiento de la asamblea y la articulación vecinal independiente de cualquier partido político.",
      contenido: "Para la cosmovisión astrológica, la estación directa de Plutón a 3 grados de Acuario simboliza la emancipación ciudadana. En Loma Verde, este clima se siente en el fortalecimiento de la asamblea y la articulación vecinal independiente de cualquier partido político.",
      img: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
      imagenUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
      epigrafe: "Bóveda celeste despejada en una noche de plenilunio en Loma Verde.",
      lunaId: "luna-aries-2026",
      lunaNombre: "Luna Llena en Aries ♈",
      seccion: "astrologia",
      seccionEtiqueta: "Astros & Sincronía",
      autor: "Mirada Astrológica 13:20",
      fecha: "2026-10-02",
      fechaTexto: "2 de Octubre de 2026",
      destacada: false,
      tiempoLectura: "3 min",
      vistas: 180,
      etiquetas: ["#PlutonEnAcuario", "#Astrologia", "#Cosmos", "#Transicion"]
    },
    {
      id: "noticia-piscis-1",
      titulo: "El abrazo del agua viva: Poesía, cantos de sanación y medicina natural en la Luna Llena en Piscis",
      volanta: "MEMORIA LUNAR • PISCIS ♓",
      copete: "Una jornada de profunda sensibilidad comunitaria donde la música del corazón y los saberes medicinales de las plantas fueron protagonistas.",
      bajada: "Una jornada de profunda sensibilidad comunitaria donde la música del corazón y los saberes medicinales de las plantas fueron protagonistas.",
      texto: "La Luna en Piscis llenó la plaza de flores, aceites esenciales y cantos compartidos. Se brindaron talleres de botiquín natural de invierno y círculos de palabra para tejer lazos afectivos entre familias recién mudadas al barrio.",
      contenido: "La Luna en Piscis llenó la plaza de flores, aceites esenciales y cantos compartidos. Se brindaron talleres de botiquín natural de invierno y círculos de palabra para tejer lazos afectivos entre familias recién mudadas al barrio.",
      img: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
      imagenUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
      epigrafe: "Ronda de sahumado y música medicinal en la apertura del encuentro de Piscis.",
      lunaId: "luna-piscis-2026",
      lunaNombre: "Luna Llena en Piscis ♓",
      seccion: "cultura",
      seccionEtiqueta: "Cultura & Música",
      autor: "Redacción Loma Verde",
      fecha: "2026-09-06",
      fechaTexto: "6 de Septiembre de 2026",
      destacada: true,
      tiempoLectura: "3 min",
      vistas: 240,
      etiquetas: ["#LunaEnPiscis", "#MedicinaNatural", "#Poesia", "#Sanacion"]
    },
    {
      id: "noticia-acuario-1",
      titulo: "Nace la Red Fraterna 13:20: Loma Verde inaugura su primer sistema de autogestión comunitaria",
      volanta: "MEMORIA LUNAR • ACUARIO ♒",
      copete: "En el signo de la vanguardia social, los vecinos dieron inicio formal al mapa de emprendedores, el mercado sin dinero fiat y la cartelera digital libre.",
      bajada: "En el signo de la vanguardia social, los vecinos dieron inicio formal al mapa de emprendedores, el mercado sin dinero fiat y la cartelera digital libre.",
      texto: "La Luna en Acuario marcó el puntapié fundacional de este sistema que hoy conecta a feriantes, artistas y asambleístas. Un modelo horizontal que inspira a barrios vecinos de Escobar, Pilar y Campana.",
      contenido: "La Luna en Acuario marcó el puntapié fundacional de este sistema que hoy conecta a feriantes, artistas y asambleístas. Un modelo horizontal que inspira a barrios vecinos de Escobar, Pilar y Campana.",
      img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
      imagenUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
      epigrafe: "Vecinos fundadores de la red celebrando la inauguración del espacio comunitario.",
      lunaId: "luna-acuario-2026",
      lunaNombre: "Luna Llena en Acuario ♒",
      seccion: "comunidad",
      seccionEtiqueta: "Comunidad & Vecinal",
      autor: "Redacción Loma Verde",
      fecha: "2026-08-09",
      fechaTexto: "9 de Agosto de 2026",
      destacada: true,
      tiempoLectura: "4 min",
      vistas: 390,
      etiquetas: ["#LunaEnAcuario", "#RedesLibres", "#InnovacionSocial", "#LomaVerde"]
    }
  ],
  publicacionesMuro: [
    {
      id: "post-1",
      titulo: "El Susurro de las Cañas en Plenilunio",
      contenido: "Hay una hora en la tarde de Loma Verde donde el viento del este acaricia las cañas tacuara y el cielo se tiñe de violeta y oro. En esa pausa sagrada, el barrio recuerda su pacto con la tierra: no somos espectadores del paisaje, somos el paisaje haciéndose palabra, silencio y raíz viva.",
      autor: "Loma Verde Lunar",
      redOrigen: "mi_arte",
      redEtiqueta: "Mi Arte & Cosmovisión 🎨",
      urlOriginal: "",
      imagenUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "",
      tags: ["#Poesia", "#Fotografia", "#LomaVerde", "#Frecuencia1320"],
      fijado: true,
      reacciones: { amor: 24, magia: 31, fuego: 12, tierra: 19, luz: 28 },
      createdAt: "2026-10-15T12:00:00.000Z",
      fechaTexto: "15 de Octubre • Plenilunio"
    },
    {
      id: "post-2",
      titulo: "Sembrando con la Luna: Sabiduría de Huerta Vecinal",
      contenido: "Compartido desde el grupo de WhatsApp de huerteros de Loma Verde:\n\n«Vecis, con la Luna en fase ascendente y el calorcito de esta semana, es el momento justo para trasplantar tomates y albahacas. Cubran la tierra con pasto seco para retener la humedad viva y no rieguen con el sol arriba. El agua es medicina si se da a tiempo.»",
      autor: "Comunidad de Huerta Loma Verde",
      redOrigen: "whatsapp",
      redEtiqueta: "Rescatado de WhatsApp 💬",
      urlOriginal: "",
      imagenUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "",
      tags: ["#HuertaOrganica", "#Biodinamica", "#VecinosEnRed", "#SoberaniaAlimentaria"],
      fijado: false,
      reacciones: { amor: 18, magia: 9, fuego: 14, tierra: 35, luz: 15 },
      createdAt: "2026-10-14T18:30:00.000Z",
      fechaTexto: "14 de Octubre"
    },
    {
      id: "post-3",
      titulo: "Geometría Sagrada y Bioconstrucción Ancestral",
      contenido: "Resonancia desde el arte del mundo: cuando miramos un panal de abejas, una flor de girasol o las cúpulas de adobe que levantaban nuestros ancestros, comprendemos que la belleza no es un adorno: es la estructura misma de la vida en armonía. Que nuestras casas y plazas en Loma Verde sigan honrando esa proporción áurea.",
      autor: "Red Global de Arte & Biocultura",
      redOrigen: "mundo",
      redEtiqueta: "El Arte del Mundo 🌍",
      urlOriginal: "https://instagram.com",
      imagenUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "",
      tags: ["#ArteDelMundo", "#GeometriaSagrada", "#Bioconstruccion", "#Armonia"],
      fijado: false,
      reacciones: { amor: 15, magia: 27, fuego: 8, tierra: 22, luz: 33 },
      createdAt: "2026-10-13T10:15:00.000Z",
      fechaTexto: "13 de Octubre"
    },
    {
      id: "post-4",
      titulo: "Alquimia en Barro: El Toque de Manos Feriantes",
      contenido: "Visto en Instagram: El proceso de tornear un cuenco de cerámica gres, paso a paso, hasta que el fuego sella la memoria del artesano. En la feria de Loma Verde celebramos los oficios que conservan el alma humana frente a la producción en masa.",
      autor: "@tallerpachamama.eco",
      redOrigen: "instagram",
      redEtiqueta: "Visto en Instagram 📸",
      urlOriginal: "https://instagram.com/tallerpachamama.eco",
      imagenUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "",
      tags: ["#OficiosVivos", "#Ceramica", "#ManosHacedoras", "#FeriaLomaVerde"],
      fijado: false,
      reacciones: { amor: 22, magia: 16, fuego: 25, tierra: 18, luz: 14 },
      createdAt: "2026-10-12T16:45:00.000Z",
      fechaTexto: "12 de Octubre"
    },
    {
      id: "post-5",
      titulo: "Nuestra Tierra no se Negocia: El Cielo de Loma Verde",
      contenido: "Publicado en los grupos vecinales de Facebook:\n\n«Los vecinos estamos despiertos y alertas. Ninguna antena 5G ni emprendimiento invasivo puede avanzar sin el consentimiento libre e informado de quienes habitamos este suelo. La red real es la humana, mirándonos a los ojos.»",
      autor: "Asamblea Vecinal Loma Verde",
      redOrigen: "facebook",
      redEtiqueta: "Visto en Facebook 👥",
      urlOriginal: "https://facebook.com",
      imagenUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "",
      tags: ["#DefensaDelBarrio", "#NoAlaAntena", "#SoberaniaVecinal", "#CieloLimpio"],
      fijado: false,
      reacciones: { amor: 42, magia: 11, fuego: 38, tierra: 29, luz: 20 },
      createdAt: "2026-10-11T09:20:00.000Z",
      fechaTexto: "11 de Octubre"
    }
  ],
  feriantes: [
    {
      id: "fer-1",
      lunaId: "Luna Acuario",
      nombre: "Finca El Nogal",
      nombrePersonal: "Marcos Almada",
      contacto: "1144332211",
      tipo: "Gastronomía",
      descripcion: "Miel pura de monte, polen agroecológico, mermeladas caseras sin conservantes y frutos secos.",
      instagram: "@fincaelnogal",
      tienda: "https://fincaelnogal.mitiendanube.com",
      mapa: "https://maps.google.com/?q=Loma+Verde+Escobar",
      imagenBase64: "",
      flyerUrl: "",
      estado: "aprobado",
      puestoAsignado: "Sector Gastronomía - Puesto 01",
      createdAt: new Date().toISOString()
    },
    {
      id: "fer-2",
      lunaId: "Luna Acuario",
      nombre: "Taller Pachamama",
      nombrePersonal: "Solange Varela",
      contacto: "1155667788",
      tipo: "Artesanías",
      descripcion: "Bolsas de tela estampadas a mano, toallitas de tela reutilizables y almohadillas terapéuticas de semillas.",
      instagram: "@tallerpachamama.eco",
      tienda: "",
      mapa: "",
      imagenBase64: "",
      flyerUrl: "",
      estado: "aprobado",
      puestoAsignado: "Sector Artesanías - Puesto 05",
      createdAt: new Date().toISOString()
    },
    {
      id: "fer-3",
      lunaId: "Luna Acuario",
      nombre: "Huerta Comunitaria La Misión",
      nombrePersonal: "Clara & Pedro",
      contacto: "1166778899",
      tipo: "Huerta / Vivero",
      descripcion: "Plantines orgánicos de albahaca, lechuga morada, tomates reliquia, semillas libres y biofertilizantes.",
      instagram: "@huerta.lamision",
      tienda: "",
      mapa: "",
      imagenBase64: "",
      flyerUrl: "",
      estado: "aprobado",
      puestoAsignado: "Sector Huerta - Puesto 02",
      createdAt: new Date().toISOString()
    },
    {
      id: "fer-4",
      lunaId: "Luna Acuario",
      nombre: "Dúo Raíces del Viento",
      nombrePersonal: "Nahuel & Sofía",
      contacto: "1177889900",
      tipo: "Música / Arte",
      descripcion: "Música acústica folklórica y latinoamericana en vivo. Instrumentos autóctonos y cantos a la tierra.",
      instagram: "@raicesdelviento.musica",
      tienda: "",
      mapa: "",
      imagenBase64: "",
      flyerUrl: "",
      estado: "aprobado",
      puestoAsignado: "Escenario Acústico",
      createdAt: new Date().toISOString()
    },
    {
      id: "fer-5",
      lunaId: "Luna Acuario",
      nombre: "Espacio Armonía y Sonido",
      nombrePersonal: "Mariana Costa",
      contacto: "1133221100",
      tipo: "Terapias Holísticas",
      descripcion: "Masajes sonoros con cuencos tibetanos, lecturas de oráculo maya 13:20 y armonización energética.",
      instagram: "@espacioarmonia1320",
      tienda: "",
      mapa: "",
      imagenBase64: "",
      flyerUrl: "",
      estado: "aprobado",
      puestoAsignado: "Gazebo de Sanación",
      createdAt: new Date().toISOString()
    }
  ],
  voluntarios: [
    {
      id: "vol-1",
      nombre: "Lucas Benítez",
      telefono: "1123456789",
      areaInteres: "Armado y Logística de Puestos",
      contactado: true,
      notas: "Disponible desde las 09:00hs para descarga de tablones.",
      createdAt: new Date().toISOString()
    },
    {
      id: "vol-2",
      nombre: "Valeria Rossi",
      telefono: "1187654321",
      areaInteres: "Recepción y Troqueles",
      contactado: false,
      notas: "Interesada en coordinar el stand del Mercado de Virtudes.",
      createdAt: new Date().toISOString()
    }
  ],
  presupuesto: {
    monto: "$2.500.000",
    texto: "Este año, la comunidad y el fondo vecinal han destinado un presupuesto especial para el mejoramiento sustentable de los espacios públicos de Loma Verde. ¡Los vecinos decidimos en qué se invierte!",
    lunas: [
      { nombre: "Luna en Capricornio", monto: "$250.000" },
      { nombre: "Luna en Acuario", monto: "$420.000" },
      { nombre: "Luna en Piscis", monto: "Pendiente" },
      { nombre: "Luna en Aries", monto: "Pendiente" },
      { nombre: "Luna en Tauro", monto: "Pendiente" },
      { nombre: "Luna en Géminis", monto: "Pendiente" },
      { nombre: "Luna en Cáncer", monto: "Pendiente" },
      { nombre: "Luna en Leo", monto: "Pendiente" },
      { nombre: "Luna en Virgo", monto: "Pendiente" },
      { nombre: "Luna en Libra", monto: "Pendiente" },
      { nombre: "Luna en Escorpio", monto: "Pendiente" },
      { nombre: "Luna en Sagitario", monto: "Pendiente" }
    ],
    opciones: [
      {
        id: 0,
        titulo: "1. Iluminación Sustentable en Plaza La Misión",
        desc: "Instalación de 15 farolas solares autónomas para mejorar la seguridad y extender el uso de la plaza durante la noche sin consumir energía de red.",
        presupuestoDetalle: "Farolas Solares LED (15 unidades): $1.500.000\nMano de obra instalación y postes: $300.000\nFletes, cables y logística: $50.000",
        donacion: "lomaverde.ilumina.mp",
        imagen: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 1,
        titulo: "2. Construcción de Huerta Comunitaria y Compostera",
        desc: "Cerco perimetral de madera, tierra fértil, cajones de siembra elevados y herramientas para crear un espacio de educación ambiental y soberanía alimentaria.",
        presupuestoDetalle: "Maderas tratadas para cajones y cerco: $200.000\nTierra fértil, compost y abono: $80.000\nHerramientas comunitarias: $150.000\nSemillas libres y plantines: $20.000",
        donacion: "lomaverde.huerta.mp",
        imagen: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 2,
        titulo: "3. Refugios Ecológicos para Paradas de Colectivo",
        desc: "Construcción de 3 refugios de espera con techos vivos (plantas autóctonas) y bancos de madera reciclada en las esquinas principales.",
        presupuestoDetalle: "Estructuras de hierro reforzado (3x): $1.200.000\nMaderas para bancos y respaldo: $250.000\nSustrato y plantas para techo vivo: $80.000",
        donacion: "lomaverde.refugios.mp",
        imagen: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  votos: [
    {
      id: "voto-1",
      proyectoId: 0,
      opcion: "1. Iluminación Sustentable en Plaza La Misión",
      nombre: "Martín Gómez",
      telefono: "1133445566",
      partido: "Escobar",
      localidad: "Loma Verde",
      calles: "Calle Los Nogales 450",
      justificacion: "La plaza queda muy oscura al atardecer y las farolas solares van a permitir que las familias se queden más tiempo.",
      createdAt: new Date().toISOString()
    },
    {
      id: "voto-2",
      proyectoId: 1,
      opcion: "2. Construcción de Huerta Comunitaria y Compostera",
      nombre: "Carla Silveira",
      telefono: "1177665544",
      partido: "Escobar",
      localidad: "Loma Verde",
      calles: "La Misión y Nigromante",
      justificacion: "Es fundamental para que los niños del barrio aprendan de dónde viene la comida y cuidemos la tierra.",
      createdAt: new Date().toISOString()
    }
  ],
  contabilidad: {
    gastos: [
      {
        id: 1,
        fecha: "15/07/2026",
        detalle: "Sonido y micrófonos para escenario acústico",
        montoNum: 85000,
        montoStr: "85.000",
        comprobante: "",
        categoria: "Cultura y Sonido",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        fecha: "22/07/2026",
        detalle: "Bolsas de compost y plantines para taller vecinal",
        montoNum: 32000,
        montoStr: "32.000",
        comprobante: "",
        categoria: "Talleres y Huerta",
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        fecha: "28/07/2026",
        detalle: "Impresión de cartelería y banderines reciclados",
        montoNum: 24500,
        montoStr: "24.500",
        comprobante: "",
        categoria: "Ambientación",
        createdAt: new Date().toISOString()
      }
    ]
  },
  virtudes: [
    {
      id: 101,
      oferente: "Finca El Nogal",
      descripcion: "Miel Orgánica de Monte (500g)",
      valor: 5000,
      stock: 5,
      estado: "Disponible",
      categoria: "Gastronomía",
      imagenUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 102,
      oferente: "Taller Pachamama",
      descripcion: "Bolsa de Tela Estampada a Mano con Tintes Naturales",
      valor: 4000,
      stock: 3,
      estado: "Disponible",
      categoria: "Artesanías",
      imagenUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 103,
      oferente: "Huerta Comunitaria",
      descripcion: "Plantín de Albahaca Orgánica y Romero",
      valor: 2500,
      stock: 8,
      estado: "Disponible",
      categoria: "Huerta",
      imagenUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 104,
      oferente: "Panadería Artesanal La Espiga",
      descripcion: "Pan de Masamadre Multicereal Horneado a Leña",
      valor: 3500,
      stock: 0,
      estado: "Intercambiada",
      categoria: "Gastronomía",
      imagenUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 105,
      oferente: "Espacio Armonía 1320",
      descripcion: "Sesión de Armonización Sonora con Cuencos (30 min)",
      valor: 6000,
      stock: 4,
      estado: "Disponible",
      categoria: "Terapias Holísticas",
      imagenUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 106,
      oferente: "Cerámica Nativa",
      descripcion: "Cuenco de barro quemado en pozo a cielo abierto",
      valor: 4500,
      stock: 2,
      estado: "Disponible",
      categoria: "Artesanías",
      imagenUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=500&q=80"
    }
  ],
  vouchers: [
    {
      id: "vouch-1",
      idTroquel: "136901",
      compradorNombre: "Familia García Gómez",
      telefono: "1144556677",
      montoInicial: 20000,
      saldoActual: 15000,
      tipoAporte: "Aporte Brote",
      createdAt: new Date().toISOString()
    },
    {
      id: "vouch-2",
      idTroquel: "136902",
      compradorNombre: "Mariano Morales",
      telefono: "1188990011",
      montoInicial: 10000,
      saldoActual: 10000,
      tipoAporte: "Aporte Semilla",
      createdAt: new Date().toISOString()
    }
  ],
  intercambios: [
    {
      id: "int-1",
      idTroquel: "136901",
      idVirtud: 101,
      virtudDescripcion: "Miel Orgánica de Monte (500g)",
      oferente: "Finca El Nogal",
      compradorNombre: "Familia García Gómez",
      valor: 5000,
      saldoRestante: 15000,
      createdAt: new Date().toISOString()
    }
  ]
};

class Database {
  constructor() {
    this.data = null;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        if (!this.data.publicacionesMuro || this.data.publicacionesMuro.length === 0) {
          this.data.publicacionesMuro = JSON.parse(JSON.stringify(SEED_DATA.publicacionesMuro || []));
        }
        if (!this.data.noticias || this.data.noticias.length <= 2 || !this.data.noticias.some(n => n.id === 'noticia-tauro-1')) {
          this.data.noticias = JSON.parse(JSON.stringify(SEED_DATA.noticias || []));
          this.save();
        }
      } else {
        this.data = JSON.parse(JSON.stringify(SEED_DATA));
      }
    } catch (err) {
      this.data = JSON.parse(JSON.stringify(SEED_DATA));
    }
  }

  save() {
    try {
      const json = JSON.stringify(this.data, null, 2);
      const tmpFile = DB_FILE + '.tmp';
      fs.writeFileSync(tmpFile, json, 'utf8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      // Ignorado en Vercel cuando se utiliza Firestore en la nube
    }
  }

  createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(this.data, null, 2), 'utf8');
    return backupFile;
  }

  // ==========================================
  // 1. CONFIG / LUNA (SISTEMA AUTOMÁTICO 13:20)
  // ==========================================
  async getConfig() {
    let savedConfig = {};
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const doc = await fdb.collection('config').doc('general').get();
      savedConfig = doc.exists ? doc.data() : SEED_DATA.config;
    } else {
      savedConfig = this.data.config || SEED_DATA.config;
    }

    // Garantizar que 'Oficio / Servicio' esté presente en la lista de categorías
    const baseCats = Array.isArray(savedConfig.categorias) ? [...savedConfig.categorias] : [...SEED_DATA.config.categorias];
    if (!baseCats.includes("Oficio / Servicio")) {
      baseCats.splice(2, 0, "Oficio / Servicio");
    }
    savedConfig.categorias = baseCats;

    // Si el modo automático está activo (por defecto true), obtener el ciclo lunar por fecha actual
    if (savedConfig.modoAutomatico !== false) {
      const autoCycle = lunarCalendar.getAutoLunarCycle();
      const proximasLunas = lunarCalendar.getUpcomingMoons();
      const energiaDelDia = lunarCalendar.getEnergiaDelDia(savedConfig.energiaDelDia);
      return {
        ...savedConfig,
        // En modo automático continuo 13:20, la fecha actual determina la luna activa y próxima:
        lunaActiva: autoCycle.lunaActiva,
        signo: autoCycle.signo,
        simboloZodiacal: autoCycle.simboloZodiacal,
        elemento: autoCycle.elemento,
        fechaEvento: autoCycle.fechaEvento,
        fechaEventoTexto: autoCycle.fechaEventoTexto,
        diaSemanaTexto: autoCycle.diaSemanaTexto,
        horarioTexto: autoCycle.horarioTexto,
        horarioArmadoTexto: autoCycle.horarioArmadoTexto || 'Armado feriantes: 11 a 12 hs',
        horarioPublicoTexto: autoCycle.horarioPublicoTexto || '12 a 18 hs',
        lugarTexto: autoCycle.lugarTexto,
        lema: autoCycle.lema,
        mistica: autoCycle.mistica,
        tags: autoCycle.tags,
        fondoUrl: savedConfig.fondoUrl || '/fondo-loma-verde.jpg',
        modoAutomatico: true,
        proximasLunas,
        ciclosDisponibles: lunarCalendar.getAllLunarCycles(),
        energiaDelDia
      };
    }

    const energiaDelDia = lunarCalendar.getEnergiaDelDia(savedConfig.energiaDelDia);
    return {
      ...savedConfig,
      proximasLunas: lunarCalendar.getUpcomingMoons(),
      ciclosDisponibles: lunarCalendar.getAllLunarCycles(),
      energiaDelDia
    };
  }

  async updateConfig(newConfig) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const docRef = fdb.collection('config').doc('general');
      const doc = await docRef.get();
      const current = doc.exists ? doc.data() : SEED_DATA.config;
      const updated = { ...current, ...newConfig };
      await docRef.set(updated, { merge: true });
      return updated;
    }
    this.data.config = { ...this.data.config, ...newConfig };
    this.save();
    return this.data.config;
  }

  // ==========================================
  // 2. NOTICIAS Y EL DIARIO LUNAR
  // ==========================================
  async getNoticias(filtro = {}) {
    let list = [];
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const snap = await fdb.collection('noticias').get();
      list = snap.docs.map(d => d.data());
      for (const noti of SEED_DATA.noticias) {
        if (!list.some(n => n.id === noti.id)) {
          try {
            await fdb.collection('noticias').doc(noti.id).set(noti);
            list.push(noti);
          } catch (e) {
            list.push(noti);
          }
        }
      }
    } else {
      list = [...(this.data.noticias || [])];
    }

    // Filtros opcionales
    if (filtro.lunaId && filtro.lunaId !== 'todas') {
      list = list.filter(n => n.lunaId === filtro.lunaId);
    }
    if (filtro.seccion && filtro.seccion !== 'todas') {
      list = list.filter(n => (n.seccion || '').toLowerCase() === filtro.seccion.toLowerCase());
    }
    if (filtro.search) {
      const q = filtro.search.toLowerCase().trim();
      list = list.filter(n => 
        (n.titulo || '').toLowerCase().includes(q) ||
        (n.copete || '').toLowerCase().includes(q) ||
        (n.bajada || '').toLowerCase().includes(q) ||
        (n.texto || '').toLowerCase().includes(q) ||
        (n.autor || '').toLowerCase().includes(q) ||
        (Array.isArray(n.etiquetas) && n.etiquetas.some(t => t.toLowerCase().includes(q)))
      );
    }

    return list.sort((a, b) => {
      // Destacadas primero si están en la misma luna o sin filtro, luego por fecha descendente
      if (b.destacada && !a.destacada) return 1;
      if (a.destacada && !b.destacada) return -1;
      return (b.fecha || '').localeCompare(a.fecha || '');
    });
  }

  async getNoticiaById(id) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const doc = await fdb.collection('noticias').doc(id).get();
      return doc.exists ? doc.data() : null;
    }
    return (this.data.noticias || []).find(n => n.id === id) || null;
  }

  async addNoticia(noticia) {
    const id = "noticia-" + Date.now();
    const newNoticia = {
      id,
      titulo: noticia.titulo || "",
      volanta: noticia.volanta || "NOTICIA DEL ENCUENTRO",
      copete: noticia.copete || noticia.bajada || "",
      bajada: noticia.bajada || noticia.copete || "",
      texto: noticia.texto || noticia.contenido || "",
      contenido: noticia.contenido || noticia.texto || "",
      img: noticia.img || noticia.imagenUrl || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      imagenUrl: noticia.imagenUrl || noticia.img || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      epigrafe: noticia.epigrafe || "",
      lunaId: noticia.lunaId || "luna-tauro-2026",
      lunaNombre: noticia.lunaNombre || "Luna Llena en Tauro ♉",
      seccion: (noticia.seccion || "comunidad").toLowerCase(),
      seccionEtiqueta: noticia.seccionEtiqueta || "Comunidad & Vecinal",
      autor: noticia.autor || "Redacción Loma Verde",
      fecha: noticia.fecha || new Date().toISOString().split('T')[0],
      fechaTexto: noticia.fechaTexto || "Octubre de 2026",
      destacada: Boolean(noticia.destacada),
      tiempoLectura: noticia.tiempoLectura || "3 min",
      vistas: 1,
      etiquetas: Array.isArray(noticia.etiquetas) ? noticia.etiquetas : ["#LomaVerde", "#DiarioLunar"]
    };
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      await fdb.collection('noticias').doc(id).set(newNoticia);
      return newNoticia;
    }
    this.data.noticias.unshift(newNoticia);
    this.save();
    return newNoticia;
  }

  async updateNoticia(id, noticia) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      await fdb.collection('noticias').doc(id).set(noticia, { merge: true });
      return noticia;
    }
    const idx = (this.data.noticias || []).findIndex(n => n.id === id);
    if (idx >= 0) {
      this.data.noticias[idx] = { ...this.data.noticias[idx], ...noticia };
      this.save();
      return this.data.noticias[idx];
    }
    return null;
  }

  async incrementarVistasNoticia(id) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const doc = await fdb.collection('noticias').doc(id).get();
      if (doc.exists) {
        const cur = doc.data().vistas || 1;
        await fdb.collection('noticias').doc(id).update({ vistas: cur + 1 });
        return cur + 1;
      }
      return 1;
    }
    const item = (this.data.noticias || []).find(n => n.id === id);
    if (item) {
      item.vistas = (item.vistas || 0) + 1;
      this.save();
      return item.vistas;
    }
    return 1;
  }

  async deleteNoticia(id) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      await fdb.collection('noticias').doc(id).delete();
      return true;
    }
    this.data.noticias = this.data.noticias.filter(n => n.id !== id);
    this.save();
    return true;
  }

  // ==========================================
  // 3. FERIANTES / EMPRENDEDORES (CON PAPELERA DE RECICLAJE)
  // ==========================================
  async getFeriantes(filtro = {}) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const snap = await fdb.collection('feriantes').get();
      let list = snap.docs.map(d => d.data());
      
      // Por defecto no incluir eliminados (Papelera)
      if (!filtro.incluirEliminados) {
        list = list.filter(f => !f.eliminado);
      }
      if (filtro.soloEliminados) {
        list = list.filter(f => f.eliminado === true);
      }
      if (filtro.estado) {
        list = list.filter(f => f.estado === filtro.estado);
      }
      if (filtro.rubro) {
        list = list.filter(f => (f.tipo || '').toLowerCase().includes(filtro.rubro.toLowerCase()));
      }
      if (filtro.lunaId && filtro.lunaId !== 'todas') {
        list = list.filter(f => (f.lunaId || f.origen || '').includes(filtro.lunaId));
      }
      return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
    let list = this.data.feriantes || [];
    if (!filtro.incluirEliminados) {
      list = list.filter(f => !f.eliminado);
    }
    if (filtro.soloEliminados) {
      list = list.filter(f => f.eliminado === true);
    }
    if (filtro.estado) {
      list = list.filter(f => f.estado === filtro.estado);
    }
    if (filtro.rubro) {
      list = list.filter(f => f.tipo.toLowerCase().includes(filtro.rubro.toLowerCase()));
    }
    if (filtro.lunaId && filtro.lunaId !== 'todas') {
      list = list.filter(f => (f.lunaId || f.origen || '').includes(filtro.lunaId));
    }
    return list;
  }

  async getFeriantesEliminados() {
    return this.getFeriantes({ soloEliminados: true, incluirEliminados: true });
  }

  async addFeriante(f) {
    const config = await this.getConfig();
    const id = "fer-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    const tipoVal = String(f.tipo || f.categoria || f.rubro || "Artesanías").trim();
    
    // Proteger contra imágenes base64 gigantes que superen el límite de Firestore
    let imgBase64 = String(f.imagenBase64 || "");
    if (imgBase64.length > 600000) {
      imgBase64 = "";
    }

    const ahora = new Date();
    const isoDate = ahora.toISOString();
    const fechaTexto = ahora.toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const nuevo = {
      id,
      lunaId: f.lunaId || config.lunaActiva || "Luna Tauro",
      origen: f.lunaId || config.lunaActiva || "Luna Tauro",
      nombre: String(f.nombre || "").trim(),
      nombrePersonal: String(f.nombrePersonal || "").trim(),
      contacto: String(f.contacto || f.telefono || "").trim(),
      telefono: String(f.contacto || f.telefono || "").trim(),
      tipo: tipoVal,
      categoria: tipoVal,
      rubro: tipoVal,
      descripcion: String(f.descripcion || "").trim(),
      instagram: String(f.instagram || "").trim(),
      tienda: String(f.tienda || f.web || "").trim(),
      web: String(f.tienda || f.web || "").trim(),
      mapa: String(f.mapa || "").trim(),
      imagenBase64: imgBase64,
      flyerUrl: f.flyerUrl || "",
      estado: f.estado || "aprobado",
      confirmado: true,
      eliminado: false,
      puestoAsignado: f.puestoAsignado || "Sin asignar",
      fechaInscripcion: f.fechaInscripcion || isoDate,
      fechaInscripcionTexto: f.fechaInscripcionTexto || fechaTexto,
      fechaRegistro: f.fechaRegistro || isoDate,
      createdAt: f.createdAt || isoDate
    };

    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      await fdb.collection('feriantes').doc(id).set(nuevo);
      return nuevo;
    }
    this.data.feriantes.unshift(nuevo);
    this.save();
    return nuevo;
  }

  async updateFeriante(id, updates) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const docRef = fdb.collection('feriantes').doc(id);
      const doc = await docRef.get();
      if (!doc.exists) throw new Error("Feriante no encontrado");
      const updated = { ...doc.data(), ...updates };
      await docRef.set(updated, { merge: true });
      return updated;
    }
    const idx = this.data.feriantes.findIndex(f => f.id === id);
    if (idx === -1) throw new Error("Feriante no encontrado");
    this.data.feriantes[idx] = { ...this.data.feriantes[idx], ...updates };
    this.save();
    return this.data.feriantes[idx];
  }

  // Borrado Seguro a la Papelera (Soft Delete)
  async deleteFeriante(id) {
    const ahora = new Date().toISOString();
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const docRef = fdb.collection('feriantes').doc(id);
      const doc = await docRef.get();
      if (!doc.exists) throw new Error("Feriante no encontrado");
      await docRef.update({
        eliminado: true,
        eliminadoAt: ahora
      });
      return true;
    }
    const idx = (this.data.feriantes || []).findIndex(f => f.id === id);
    if (idx !== -1) {
      this.data.feriantes[idx].eliminado = true;
      this.data.feriantes[idx].eliminadoAt = ahora;
      this.save();
    }
    return true;
  }

  // Restaurar desde la Papelera
  async restoreFeriante(id) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const docRef = fdb.collection('feriantes').doc(id);
      const doc = await docRef.get();
      if (!doc.exists) throw new Error("Feriante no encontrado");
      await docRef.update({
        eliminado: false,
        restauradoAt: new Date().toISOString()
      });
      return { id, ...doc.data(), eliminado: false };
    }
    const idx = (this.data.feriantes || []).findIndex(f => f.id === id);
    if (idx !== -1) {
      this.data.feriantes[idx].eliminado = false;
      this.save();
      return this.data.feriantes[idx];
    }
    throw new Error("Feriante no encontrado");
  }

  // Eliminación Definitiva (Purga manual)
  async deleteFerianteDefinitivo(id) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      await fdb.collection('feriantes').doc(id).delete();
      return true;
    }
    this.data.feriantes = (this.data.feriantes || []).filter(f => f.id !== id);
    this.save();
    return true;
  }

  async getDirectorioAgrupado() {
    const feriantes = await this.getFeriantes();
    const directorio = {};
    const feriantesAprobados = feriantes.filter(f => 
      f.estado === 'aprobado' || 
      f.estado === 'confirmado' || 
      f.confirmado === true || 
      !f.estado || 
      f.estado === 'activo'
    );
    
    feriantesAprobados.forEach(f => {
      let cat = this.normalizarCategoria(f.tipo || f.categoria || f.rubro);
      if (!directorio[cat]) directorio[cat] = [];
      directorio[cat].push(f);
    });

    for (let c in directorio) {
      directorio[c].sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
    }
    return directorio;
  }

  normalizarCategoria(cat) {
    let c = String(cat || "Varios").trim();
    const l = c.toLowerCase();
    if (l.includes('oficio') || l.includes('servicio') || l.includes('bici') || l.includes('taller') || l.includes('repara')) return 'Oficio / Servicio';
    if (l.includes('música') || l.includes('musica') || l.includes('arte')) return 'Música / Arte';
    if (l.includes('gastro') || l.includes('comida') || l.includes('alimento')) return 'Gastronomía';
    if (l.includes('artesan')) return 'Artesanías';
    if (l.includes('huert') || l.includes('viver') || l.includes('plant')) return 'Huerta / Vivero';
    if (l.includes('holist') || l.includes('holíst') || l.includes('terapia')) return 'Terapias Holísticas';
    if (l.includes('americana') || l.includes('ropa') || l.includes('indumentaria')) return 'Feria Americana';
    if (l.includes('natural') || l.includes('cosmetica') || l.includes('cosmética')) return 'Productos Naturales';
    return c;
  }

  // ==========================================
  // 4. VOLUNTARIOS
  // ==========================================
  async getVoluntarios() {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const snap = await fdb.collection('voluntarios').get();
      const list = snap.docs.map(d => d.data());
      return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
    return this.data.voluntarios || [];
  }

  async addVoluntario(v) {
    const id = "vol-" + Date.now();
    const ahora = new Date();
    const isoDate = ahora.toISOString();
    const fechaTexto = ahora.toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const nuevo = {
      id,
      nombre: String(v.nombre || "").trim(),
      telefono: String(v.telefono || "").trim(),
      areaInteres: v.areaInteres || "General",
      contactado: false,
      notas: v.notas || "",
      fechaInscripcion: v.fechaInscripcion || isoDate,
      fechaInscripcionTexto: v.fechaInscripcionTexto || fechaTexto,
      createdAt: v.createdAt || isoDate
    };
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      await fdb.collection('voluntarios').doc(id).set(nuevo);
      return nuevo;
    }
    this.data.voluntarios.unshift(nuevo);
    this.save();
    return nuevo;
  }

  async updateVoluntario(id, updates) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const docRef = fdb.collection('voluntarios').doc(id);
      const doc = await docRef.get();
      if (!doc.exists) throw new Error("Voluntario no encontrado");
      const updated = { ...doc.data(), ...updates };
      await docRef.set(updated, { merge: true });
      return updated;
    }
    const idx = this.data.voluntarios.findIndex(v => v.id === id);
    if (idx === -1) throw new Error("Voluntario no encontrado");
    this.data.voluntarios[idx] = { ...this.data.voluntarios[idx], ...updates };
    this.save();
    return this.data.voluntarios[idx];
  }

  async deleteVoluntario(id) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      await fdb.collection('voluntarios').doc(id).delete();
      return true;
    }
    this.data.voluntarios = this.data.voluntarios.filter(v => v.id !== id);
    this.save();
    return true;
  }

  // ==========================================
  // 5. PRESUPUESTO & PROYECTOS
  // ==========================================
  async getPresupuestoData() {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const presDoc = await fdb.collection('presupuesto').doc('general').get();
      const p = presDoc.exists ? presDoc.data() : SEED_DATA.presupuesto;

      const votosSnap = await fdb.collection('votos').get();
      const votos = votosSnap.docs.map(d => d.data());

      const votosPorProyecto = {};
      votos.forEach(v => {
        votosPorProyecto[v.proyectoId] = (votosPorProyecto[v.proyectoId] || 0) + 1;
      });

      const opcionesConVotos = (p.opciones || []).map(op => ({
        ...op,
        votosCount: votosPorProyecto[op.id] || 0
      }));

      return {
        monto: p.monto,
        texto: p.texto,
        lunas: p.lunas,
        opciones: opcionesConVotos,
        totalVotos: votos.length
      };
    }

    const p = this.data.presupuesto;
    const votosPorProyecto = {};
    (this.data.votos || []).forEach(v => {
      votosPorProyecto[v.proyectoId] = (votosPorProyecto[v.proyectoId] || 0) + 1;
    });

    const opcionesConVotos = p.opciones.map(op => ({
      ...op,
      votosCount: votosPorProyecto[op.id] || 0
    }));

    return {
      monto: p.monto,
      texto: p.texto,
      lunas: p.lunas,
      opciones: opcionesConVotos,
      totalVotos: (this.data.votos || []).length
    };
  }

  async getProyectoById(id) {
    const numId = parseInt(id, 10);
    const presData = await this.getPresupuestoData();
    const p = presData.opciones.find(o => o.id === numId);
    return p || null;
  }

  async updateProyecto(id, titulo, desc, presupuestoDetalle, donacion, imagen) {
    const numId = parseInt(id, 10);
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const presDocRef = fdb.collection('presupuesto').doc('general');
      const presDoc = await presDocRef.get();
      const p = presDoc.exists ? presDoc.data() : JSON.parse(JSON.stringify(SEED_DATA.presupuesto));
      const idx = (p.opciones || []).findIndex(o => o.id === numId);
      if (idx === -1) throw new Error("Proyecto no encontrado");

      p.opciones[idx] = {
        ...p.opciones[idx],
        titulo: titulo || p.opciones[idx].titulo,
        desc: desc || p.opciones[idx].desc,
        presupuestoDetalle: presupuestoDetalle !== undefined ? presupuestoDetalle : p.opciones[idx].presupuestoDetalle,
        donacion: donacion !== undefined ? donacion : p.opciones[idx].donacion,
        imagen: imagen !== undefined ? imagen : p.opciones[idx].imagen
      };
      await presDocRef.set(p);
      return p.opciones[idx];
    }

    const idx = this.data.presupuesto.opciones.findIndex(o => o.id === numId);
    if (idx === -1) throw new Error("Proyecto no encontrado");
    
    this.data.presupuesto.opciones[idx] = {
      ...this.data.presupuesto.opciones[idx],
      titulo: titulo || this.data.presupuesto.opciones[idx].titulo,
      desc: desc || this.data.presupuesto.opciones[idx].desc,
      presupuestoDetalle: presupuestoDetalle !== undefined ? presupuestoDetalle : this.data.presupuesto.opciones[idx].presupuestoDetalle,
      donacion: donacion !== undefined ? donacion : this.data.presupuesto.opciones[idx].donacion,
      imagen: imagen !== undefined ? imagen : this.data.presupuesto.opciones[idx].imagen
    };
    this.save();
    return this.data.presupuesto.opciones[idx];
  }

  async addVoto(datos) {
    const id = "voto-" + Date.now();
    const presData = await this.getPresupuestoData();
    const proyecto = (presData.opciones || []).find(o => o.titulo === datos.opcion || o.id === datos.proyectoId);
    const proyectoId = proyecto ? proyecto.id : 0;
    const opcionTitulo = proyecto ? proyecto.titulo : datos.opcion;

    const nuevoVoto = {
      id,
      proyectoId,
      opcion: opcionTitulo,
      nombre: String(datos.nombre || "").trim(),
      telefono: String(datos.telefono || "").trim(),
      partido: String(datos.partido || "Escobar").trim(),
      localidad: String(datos.localidad || "Loma Verde").trim(),
      calles: String(datos.calles || "").trim(),
      justificacion: String(datos.justificacion || "").trim(),
      createdAt: new Date().toISOString()
    };

    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      await fdb.collection('votos').doc(id).set(nuevoVoto);
      return nuevoVoto;
    }

    this.data.votos.unshift(nuevoVoto);
    this.save();
    return nuevoVoto;
  }

  async getVotos() {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const snap = await fdb.collection('votos').get();
      const list = snap.docs.map(d => d.data());
      return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
    return this.data.votos || [];
  }

  // ==========================================
  // 6. CONTABILIDAD
  // ==========================================
  async getContabilidad() {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const snap = await fdb.collection('gastos').get();
      const gastos = snap.docs.map(d => d.data()).sort((a, b) => (b.id || 0) - (a.id || 0));
      let totalGastado = 0;
      gastos.forEach(g => {
        totalGastado += g.montoNum || 0;
      });
      return { gastos, totalGastado };
    }

    const gastos = this.data.contabilidad.gastos || [];
    let totalGastado = 0;
    gastos.forEach(g => {
      totalGastado += g.montoNum || 0;
    });
    return {
      gastos,
      totalGastado
    };
  }

  async addGasto(g) {
    const id = Date.now();
    const montoNum = parseFloat(String(g.monto).replace(/[^0-9.-]+/g, "")) || 0;
    const nuevo = {
      id,
      fecha: g.fecha || new Date().toLocaleDateString('es-AR'),
      detalle: String(g.detalle || "").trim(),
      montoNum,
      montoStr: montoNum.toLocaleString('es-AR'),
      comprobante: g.comprobante || "",
      categoria: g.categoria || "General",
      createdAt: new Date().toISOString()
    };

    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      await fdb.collection('gastos').doc(String(id)).set(nuevo);
      return nuevo;
    }

    this.data.contabilidad.gastos.unshift(nuevo);
    this.save();
    return nuevo;
  }

  async deleteGasto(id) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      await fdb.collection('gastos').doc(String(id)).delete();
      return true;
    }
    this.data.contabilidad.gastos = this.data.contabilidad.gastos.filter(g => g.id !== parseInt(id, 10));
    this.save();
    return true;
  }

  // ==========================================
  // 7. VIRTUDES & TROQUELES (MERCADO)
  // ==========================================
  async getVirtudes() {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const snap = await fdb.collection('virtudes').get();
      const list = snap.docs.map(d => d.data());
      return list.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
    return this.data.virtudes || [];
  }

  async addVirtud(v) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const snap = await fdb.collection('virtudes').get();
      const list = snap.docs.map(d => d.data());
      const lastId = list.reduce((max, cur) => Math.max(max, cur.id || 0), 100);
      const nuevo = {
        id: lastId + 1,
        oferente: String(v.oferente || "Feriante Anónimo").trim(),
        descripcion: String(v.descripcion || "").trim(),
        valor: parseFloat(v.valor) || 0,
        stock: parseInt(v.stock, 10) || 1,
        estado: (parseInt(v.stock, 10) || 1) > 0 ? "Disponible" : "Intercambiada",
        categoria: v.categoria || "General",
        imagenUrl: v.imagenUrl || ""
      };
      await fdb.collection('virtudes').doc(String(nuevo.id)).set(nuevo);
      return nuevo;
    }

    const lastId = this.data.virtudes.reduce((max, cur) => Math.max(max, cur.id || 0), 100);
    const nuevo = {
      id: lastId + 1,
      oferente: String(v.oferente || "Feriante Anónimo").trim(),
      descripcion: String(v.descripcion || "").trim(),
      valor: parseFloat(v.valor) || 0,
      stock: parseInt(v.stock, 10) || 1,
      estado: (parseInt(v.stock, 10) || 1) > 0 ? "Disponible" : "Intercambiada",
      categoria: v.categoria || "General",
      imagenUrl: v.imagenUrl || ""
    };
    this.data.virtudes.unshift(nuevo);
    this.save();
    return nuevo;
  }

  async updateVirtud(id, updates) {
    const numId = parseInt(id, 10);
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const docRef = fdb.collection('virtudes').doc(String(numId));
      const doc = await docRef.get();
      if (!doc.exists) throw new Error("Virtud no encontrada");
      const updated = { ...doc.data(), ...updates };
      if (updated.stock <= 0) {
        updated.estado = "Intercambiada";
      } else if (updated.estado === "Intercambiada" && updated.stock > 0) {
        updated.estado = "Disponible";
      }
      await docRef.set(updated, { merge: true });
      return updated;
    }

    const idx = this.data.virtudes.findIndex(v => v.id === numId);
    if (idx === -1) throw new Error("Virtud no encontrada");
    this.data.virtudes[idx] = { ...this.data.virtudes[idx], ...updates };
    if (this.data.virtudes[idx].stock <= 0) {
      this.data.virtudes[idx].estado = "Intercambiada";
    } else if (this.data.virtudes[idx].estado === "Intercambiada" && this.data.virtudes[idx].stock > 0) {
      this.data.virtudes[idx].estado = "Disponible";
    }
    this.save();
    return this.data.virtudes[idx];
  }

  async deleteVirtud(id) {
    const numId = parseInt(id, 10);
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      await fdb.collection('virtudes').doc(String(numId)).delete();
      return true;
    }
    this.data.virtudes = this.data.virtudes.filter(v => v.id !== numId);
    this.save();
    return true;
  }

  async getVouchers() {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const snap = await fdb.collection('vouchers').get();
      const list = snap.docs.map(d => d.data());
      return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
    return this.data.vouchers || [];
  }

  async getVoucherByTroquel(idTroquel) {
    const buscado = String(idTroquel).trim();
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const snap = await fdb.collection('vouchers').where('idTroquel', '==', buscado).limit(1).get();
      if (snap.empty) return null;
      return snap.docs[0].data();
    }
    return (this.data.vouchers || []).find(v => String(v.idTroquel).trim() === buscado);
  }

  async addVoucher(nombre, telefono, monto, tipoAporte) {
    const montoNum = parseFloat(monto) || 10000;
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const snap = await fdb.collection('vouchers').get();
      const list = snap.docs.map(d => d.data());
      let nextIdTroquel = 136901;
      if (list.length > 0) {
        const maxTroquel = list.reduce((max, v) => Math.max(max, parseInt(v.idTroquel, 10) || 0), 136900);
        nextIdTroquel = maxTroquel + Math.floor(Math.random() * 4) + 1;
      }
      const nuevo = {
        id: "vouch-" + Date.now(),
        idTroquel: String(nextIdTroquel),
        compradorNombre: String(nombre || "Aportante Vecinal").trim(),
        telefono: String(telefono || "").trim(),
        montoInicial: montoNum,
        saldoActual: montoNum,
        tipoAporte: tipoAporte || "Aporte Fraterno",
        createdAt: new Date().toISOString()
      };
      await fdb.collection('vouchers').doc(nuevo.id).set(nuevo);
      return nuevo;
    }

    let nextIdTroquel = 136901;
    if (this.data.vouchers.length > 0) {
      const maxTroquel = this.data.vouchers.reduce((max, v) => Math.max(max, parseInt(v.idTroquel, 10) || 0), 136900);
      nextIdTroquel = maxTroquel + Math.floor(Math.random() * 4) + 1;
    }

    const nuevo = {
      id: "vouch-" + Date.now(),
      idTroquel: String(nextIdTroquel),
      compradorNombre: String(nombre || "Aportante Vecinal").trim(),
      telefono: String(telefono || "").trim(),
      montoInicial: montoNum,
      saldoActual: montoNum,
      tipoAporte: tipoAporte || "Aporte Fraterno",
      createdAt: new Date().toISOString()
    };
    this.data.vouchers.unshift(nuevo);
    this.save();
    return nuevo;
  }

  async procesarIntercambio(idTroquel, idVirtud) {
    const buscadoTroquel = String(idTroquel).trim();
    const numVirtudId = parseInt(idVirtud, 10);

    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      return await fdb.runTransaction(async (t) => {
        const virtudRef = fdb.collection('virtudes').doc(String(numVirtudId));
        const virtudDoc = await t.get(virtudRef);
        if (!virtudDoc.exists) {
          throw new Error("Esa virtud ya no existe o fue eliminada.");
        }
        const virtudData = virtudDoc.data();
        if (virtudData.stock <= 0 || virtudData.estado !== "Disponible") {
          throw new Error("Esa virtud ya fue intercambiada en su totalidad o no está disponible.");
        }

        const vouchersSnap = await fdb.collection('vouchers').where('idTroquel', '==', buscadoTroquel).limit(1).get();
        if (vouchersSnap.empty) {
          throw new Error(`No encontramos el número de troquel ${buscadoTroquel}. Por favor revisa el código o genera uno nuevo.`);
        }
        const voucherDoc = vouchersSnap.docs[0];
        const voucherData = voucherDoc.data();

        if (voucherData.saldoActual < virtudData.valor) {
          throw new Error(`Tu troquel no tiene saldo suficiente. Saldo actual: $${voucherData.saldoActual.toLocaleString('es-AR')}, Valor requerido: $${virtudData.valor.toLocaleString('es-AR')}`);
        }

        const nuevoSaldo = voucherData.saldoActual - virtudData.valor;
        const nuevoStock = virtudData.stock - 1;
        const nuevoEstado = nuevoStock <= 0 ? "Intercambiada" : "Disponible";

        t.update(voucherDoc.ref, { saldoActual: nuevoSaldo });
        t.update(virtudRef, { stock: nuevoStock, estado: nuevoEstado });

        const nuevoIntercambio = {
          id: "int-" + Date.now(),
          idTroquel: buscadoTroquel,
          idVirtud: virtudData.id,
          virtudDescripcion: virtudData.descripcion,
          oferente: virtudData.oferente,
          compradorNombre: voucherData.compradorNombre,
          valor: virtudData.valor,
          saldoRestante: nuevoSaldo,
          createdAt: new Date().toISOString()
        };

        const intRef = fdb.collection('intercambios').doc(nuevoIntercambio.id);
        t.set(intRef, nuevoIntercambio);

        return {
          exito: true,
          mensaje: `¡Éxito! Has apoyado la economía fraterna. Te quedan $${nuevoSaldo.toLocaleString('es-AR')} de saldo.`,
          saldoRestante: nuevoSaldo,
          virtud: { ...virtudData, stock: nuevoStock, estado: nuevoEstado },
          voucher: { ...voucherData, saldoActual: nuevoSaldo },
          intercambio: nuevoIntercambio
        };
      });
    }

    // Local JSON Fallback
    const virtud = this.data.virtudes.find(v => v.id === numVirtudId);
    if (!virtud || virtud.stock <= 0 || virtud.estado !== "Disponible") {
      throw new Error("Esa virtud ya fue intercambiada en su totalidad o no está disponible.");
    }

    const voucher = this.data.vouchers.find(v => String(v.idTroquel).trim() === buscadoTroquel);
    if (!voucher) {
      throw new Error(`No encontramos el número de troquel ${buscadoTroquel}. Por favor revisa el código o genera uno nuevo.`);
    }

    if (voucher.saldoActual < virtud.valor) {
      throw new Error(`Tu troquel no tiene saldo suficiente. Saldo actual: $${voucher.saldoActual.toLocaleString('es-AR')}, Valor requerido: $${virtud.valor.toLocaleString('es-AR')}`);
    }

    voucher.saldoActual -= virtud.valor;
    virtud.stock -= 1;
    if (virtud.stock <= 0) {
      virtud.estado = "Intercambiada";
    }

    const nuevoIntercambio = {
      id: "int-" + Date.now(),
      idTroquel: buscadoTroquel,
      idVirtud: virtud.id,
      virtudDescripcion: virtud.descripcion,
      oferente: virtud.oferente,
      compradorNombre: voucher.compradorNombre,
      valor: virtud.valor,
      saldoRestante: voucher.saldoActual,
      createdAt: new Date().toISOString()
    };
    this.data.intercambios.unshift(nuevoIntercambio);
    this.save();

    return {
      exito: true,
      mensaje: `¡Éxito! Has apoyado la economía fraterna. Te quedan $${voucher.saldoActual.toLocaleString('es-AR')} de saldo.`,
      saldoRestante: voucher.saldoActual,
      virtud,
      voucher,
      intercambio: nuevoIntercambio
    };
  }

  async getIntercambios() {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const snap = await fdb.collection('intercambios').get();
      const list = snap.docs.map(d => d.data());
      return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
    return this.data.intercambios || [];
  }

  // ==========================================
  // 8. EXPORT TO EXCEL (.XLSX)
  // ==========================================
  async exportToExcel() {
    const wb = xlsx.utils.book_new();

    const [feriantes, virtudes, vouchers, intercambios, votos, voluntarios, contabilidad, firmasAntena] = await Promise.all([
      this.getFeriantes(),
      this.getVirtudes(),
      this.getVouchers(),
      this.getIntercambios(),
      this.getVotos(),
      this.getVoluntarios(),
      this.getContabilidad(),
      this.getFirmasAntena()
    ]);

    const lunasList = ['Luna Tauro', 'Luna Aries', 'Luna Piscis', 'Luna Acuario', 'Luna Capricornio', 'Luna Sagitario', 'Luna Escorpio'];

    // 1. Crear hojas individuales por cada Luna (igual que el Excel original)
    lunasList.forEach(lunaName => {
      const feriantesDeEstaLuna = (feriantes || []).filter(f => (f.lunaId || f.origen || '').includes(lunaName));
      if (feriantesDeEstaLuna.length > 0) {
        const rows = feriantesDeEstaLuna.map(f => ({
          Fecha_Inscripcion: f.fechaInscripcionTexto || (f.createdAt ? f.createdAt.split('T')[0] : ''),
          Emprendimiento: f.nombre,
          Responsable: f.nombrePersonal || '',
          Telefono: f.contacto || f.telefono || '',
          Rubro: f.tipo || f.categoria || '',
          Descripcion: f.descripcion || '',
          Instagram: f.instagram || '',
          Tienda_Web: f.tienda || f.web || '',
          Ubicacion_Mapa: f.mapa || '',
          Puesto_Asignado: f.puestoAsignado || '',
          Estado: f.estado || 'aprobado'
        }));
        const ws = xlsx.utils.json_to_sheet(rows);
        xlsx.utils.book_append_sheet(wb, ws, lunaName);
      }
    });

    // 2. Sheet: Directorio Histórico Completo
    const feriantesData = (feriantes || []).map(f => ({
      Fecha_Inscripcion: f.fechaInscripcionTexto || (f.createdAt ? f.createdAt.split('T')[0] : ''),
      Emprendimiento: f.nombre,
      Responsable: f.nombrePersonal || '',
      Telefono: f.contacto || f.telefono || '',
      Rubro: f.tipo || f.categoria || '',
      Descripcion: f.descripcion || '',
      Instagram: f.instagram || '',
      Tienda_Web: f.tienda || f.web || '',
      Lunas_Participadas: f.origen || f.lunaId || '',
      Estado: f.estado || 'aprobado',
      Puesto: f.puestoAsignado || ''
    }));
    const wsFeriantes = xlsx.utils.json_to_sheet(feriantesData);
    xlsx.utils.book_append_sheet(wb, wsFeriantes, "Directorio Completo");

    // Sheet: Virtudes
    const virtudesData = (virtudes || []).map(v => ({
      ID: v.id,
      Oferente: v.oferente,
      Descripcion: v.descripcion,
      Valor: v.valor,
      Stock: v.stock,
      Estado: v.estado,
      Categoria: v.categoria
    }));
    const wsVirtudes = xlsx.utils.json_to_sheet(virtudesData);
    xlsx.utils.book_append_sheet(wb, wsVirtudes, "Virtudes");

    // Sheet: Vouchers / Troqueles
    const vouchersData = (vouchers || []).map(v => ({
      ID_Troquel: v.idTroquel,
      Comprador: v.compradorNombre,
      Telefono: v.telefono,
      TipoAporte: v.tipoAporte,
      MontoInicial: v.montoInicial,
      SaldoActual: v.saldoActual,
      Fecha: v.createdAt
    }));
    const wsVouchers = xlsx.utils.json_to_sheet(vouchersData);
    xlsx.utils.book_append_sheet(wb, wsVouchers, "Troqueles");

    // Sheet: Intercambios
    const intercambiosData = (intercambios || []).map(i => ({
      Fecha: i.createdAt,
      ID_Troquel: i.idTroquel,
      Comprador: i.compradorNombre,
      ID_Virtud: i.idVirtud,
      Virtud: i.virtudDescripcion,
      Oferente: i.oferente,
      Valor: i.valor,
      SaldoRestante: i.saldoRestante
    }));
    const wsIntercambios = xlsx.utils.json_to_sheet(intercambiosData);
    xlsx.utils.book_append_sheet(wb, wsIntercambios, "Intercambios");

    // Sheet: Votos
    const votosData = (votos || []).map(v => ({
      Fecha: v.createdAt,
      Nombre: v.nombre,
      Telefono: v.telefono,
      Partido: v.partido,
      Localidad: v.localidad,
      Calles: v.calles,
      OpcionVotada: v.opcion,
      Justificacion: v.justificacion
    }));
    const wsVotos = xlsx.utils.json_to_sheet(votosData);
    xlsx.utils.book_append_sheet(wb, wsVotos, "Votos Presupuesto");

    // Sheet: Voluntarios
    const voluntariosData = (voluntarios || []).map(v => ({
      Fecha: v.createdAt,
      Nombre: v.nombre,
      Telefono: v.telefono,
      AreaInteres: v.areaInteres,
      Contactado: v.contactado ? "SI" : "NO",
      Notas: v.notas
    }));
    const wsVoluntarios = xlsx.utils.json_to_sheet(voluntariosData);
    xlsx.utils.book_append_sheet(wb, wsVoluntarios, "Voluntarios");

    // Sheet: Contabilidad
    const contabilidadData = (contabilidad.gastos || []).map(g => ({
      Fecha: g.fecha,
      Detalle: g.detalle,
      Monto: g.montoNum,
      Categoria: g.categoria,
      Comprobante: g.comprobante
    }));
    const wsContabilidad = xlsx.utils.json_to_sheet(contabilidadData);
    xlsx.utils.book_append_sheet(wb, wsContabilidad, "Contabilidad");

    // Sheet: Adhesiones No a la Antena 5G
    const firmasData = (firmasAntena || []).map(f => ({
      Fecha: f.fechaTexto || f.createdAt,
      Nombre: f.nombre,
      Telefono: f.telefono,
      Barrio: f.barrio,
      Calle: f.calle,
      Motivo_Observaciones: f.motivo,
      EsVecino: f.esVecino !== false ? "SI" : "NO",
      Contactado: f.contactado ? "SI" : "NO",
      Notas: f.notas || ""
    }));
    const wsFirmas = xlsx.utils.json_to_sheet(firmasData);
    xlsx.utils.book_append_sheet(wb, wsFirmas, "No a la Antena 5G");

    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  // ==========================================
  // 9. MAPA COMUNITARIO & REPORTES VECINALES
  // ==========================================
  async getPuntosMapa(filtro = {}) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const snap = await fdb.collection('puntos_mapa').get();
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (filtro.categoria && filtro.categoria !== 'todos') {
        list = list.filter(p => p.categoria === filtro.categoria);
      }
      return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
    let list = this.data.puntosMapa || [];
    if (filtro.categoria && filtro.categoria !== 'todos') {
      list = list.filter(p => p.categoria === filtro.categoria);
    }
    return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  async addPuntoMapa(p) {
    const id = "pto-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    
    // Proteger contra imágenes base64 gigantes
    let imgFoto = String(p.foto || "");
    if (imgFoto.length > 600000) {
      imgFoto = "";
    }

    const nuevo = {
      id,
      titulo: String(p.titulo || "Reporte Vecinal").trim(),
      categoria: String(p.categoria || "aviso").trim(),
      categoriaLabel: String(p.categoriaLabel || "Novedad / Aviso Barrial 📣").trim(),
      emoji: String(p.emoji || "📣").trim(),
      color: String(p.color || "#c48c26").trim(),
      descripcion: String(p.descripcion || "").trim(),
      autorNombre: String(p.autorNombre || "Vecino de Loma Verde").trim(),
      contacto: String(p.contacto || "").trim(),
      calles: String(p.calles || "Loma Verde").trim(),
      lat: Number(p.lat) || -34.3547,
      lng: Number(p.lng) || -58.8258,
      foto: imgFoto,
      resuelto: false,
      comentarios: [],
      createdAt: new Date().toISOString()
    };

    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      await fdb.collection('puntos_mapa').doc(id).set(nuevo);
      return nuevo;
    }
    if (!this.data.puntosMapa) this.data.puntosMapa = [];
    this.data.puntosMapa.unshift(nuevo);
    this.save();
    return nuevo;
  }

  async addComentarioPunto(puntoId, com) {
    const nuevoComentario = {
      id: "com-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      autorNombre: String(com.autorNombre || "Vecino").trim(),
      texto: String(com.texto || "").trim(),
      contacto: String(com.contacto || "").trim(),
      createdAt: new Date().toISOString()
    };

    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const docRef = fdb.collection('puntos_mapa').doc(puntoId);
      const doc = await docRef.get();
      if (!doc.exists) throw new Error("Punto del mapa no encontrado");
      const current = doc.data();
      const comentarios = current.comentarios || [];
      comentarios.push(nuevoComentario);
      await docRef.update({ comentarios });
      return { ...current, comentarios };
    }

    if (!this.data.puntosMapa) this.data.puntosMapa = [];
    const idx = this.data.puntosMapa.findIndex(p => p.id === puntoId);
    if (idx === -1) throw new Error("Punto no encontrado");
    if (!this.data.puntosMapa[idx].comentarios) this.data.puntosMapa[idx].comentarios = [];
    this.data.puntosMapa[idx].comentarios.push(nuevoComentario);
    this.save();
    return this.data.puntosMapa[idx];
  }

  async toggleResolverPunto(puntoId) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      const docRef = fdb.collection('puntos_mapa').doc(puntoId);
      const doc = await docRef.get();
      if (!doc.exists) throw new Error("Punto no encontrado");
      const current = doc.data();
      const resuelto = !current.resuelto;
      await docRef.update({ resuelto });
      return { ...current, resuelto };
    }
    const idx = (this.data.puntosMapa || []).findIndex(p => p.id === puntoId);
    if (idx === -1) throw new Error("Punto no encontrado");
    this.data.puntosMapa[idx].resuelto = !this.data.puntosMapa[idx].resuelto;
    this.save();
    return this.data.puntosMapa[idx];
  }

  async deletePuntoMapa(puntoId) {
    if (firebase.isFirebaseEnabled()) {
      const fdb = firebase.getDb();
      await fdb.collection('puntos_mapa').doc(puntoId).delete();
      return true;
    }
    this.data.puntosMapa = (this.data.puntosMapa || []).filter(p => p.id !== puntoId);
    this.save();
    return true;
  }

  // ==========================================
  // 12. FIRMAS Y ADHESIONES CONTRA LA ANTENA 5G
  // ==========================================
  async getFirmasAntena() {
    if (firebase.isFirebaseEnabled()) {
      try {
        const fdb = firebase.getDb();
        const snap = await fdb.collection('firmas_antena').get();
        const list = snap.docs.map(d => d.data());
        return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      } catch (e) {
        console.error("Error al traer firmas antena de Firebase:", e);
      }
    }
    return this.data.firmasAntena || [];
  }

  async addFirmaAntena(f) {
    const id = "firma-" + Date.now();
    const ahora = new Date();
    const nuevaFirma = {
      id,
      nombre: String(f.nombre || "").trim(),
      telefono: String(f.telefono || "").trim(),
      barrio: String(f.barrio || "Loma Verde").trim(),
      calle: String(f.calle || "").trim(),
      motivo: String(f.motivo || "").trim(),
      esVecino: f.esVecino !== false,
      createdAt: ahora.toISOString(),
      fechaTexto: ahora.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
    };

    if (firebase.isFirebaseEnabled()) {
      try {
        const fdb = firebase.getDb();
        await fdb.collection('firmas_antena').doc(id).set(nuevaFirma);
        return nuevaFirma;
      } catch (e) {
        console.error("Error guardando firma antena en Firebase:", e);
      }
    }

    if (!this.data.firmasAntena) this.data.firmasAntena = [];
    this.data.firmasAntena.unshift(nuevaFirma);
    this.save();
    return nuevaFirma;
  }

  async updateFirmaAntena(id, updates) {
    if (firebase.isFirebaseEnabled()) {
      try {
        const fdb = firebase.getDb();
        const docRef = fdb.collection('firmas_antena').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) throw new Error("Firma no encontrada");
        const updated = { ...doc.data(), ...updates };
        await docRef.set(updated, { merge: true });
        return updated;
      } catch (e) {
        console.error("Error al actualizar firma antena en Firebase:", e);
      }
    }
    const idx = (this.data.firmasAntena || []).findIndex(f => f.id === id);
    if (idx !== -1) {
      this.data.firmasAntena[idx] = { ...this.data.firmasAntena[idx], ...updates };
      this.save();
      return this.data.firmasAntena[idx];
    }
    throw new Error("Firma no encontrada");
  }

  async deleteFirmaAntena(id) {
    if (firebase.isFirebaseEnabled()) {
      try {
        const fdb = firebase.getDb();
        await fdb.collection('firmas_antena').doc(id).delete();
        return true;
      } catch (e) {
        console.error("Error eliminando firma antena en Firebase:", e);
      }
    }
    this.data.firmasAntena = (this.data.firmasAntena || []).filter(f => f.id !== id);
    this.save();
    return true;
  }

  // ==========================================
  // 13. MURO & RED SOCIAL COMUNITARIA
  // ==========================================
  async getPublicacionesMuro(filtro = {}) {
    if (firebase.isFirebaseEnabled()) {
      try {
        const fdb = firebase.getDb();
        const snap = await fdb.collection('muro_publicaciones').get();
        if (!snap.empty) {
          let list = snap.docs.map(d => d.data());
          if (filtro.red && filtro.red !== 'todas') {
            list = list.filter(p => p.redOrigen === filtro.red);
          }
          if (filtro.tag) {
            list = list.filter(p => (p.tags || []).some(t => t.toLowerCase().includes(filtro.tag.toLowerCase())));
          }
          return list.sort((a, b) => {
            if (a.fijado && !b.fijado) return -1;
            if (!a.fijado && b.fijado) return 1;
            return (b.createdAt || '').localeCompare(a.createdAt || '');
          });
        }
      } catch (e) {
        console.error("Error al traer publicaciones del muro de Firebase:", e);
      }
    }

    let list = this.data.publicacionesMuro || SEED_DATA.publicacionesMuro || [];
    if (filtro.red && filtro.red !== 'todas') {
      list = list.filter(p => p.redOrigen === filtro.red);
    }
    if (filtro.tag) {
      list = list.filter(p => (p.tags || []).some(t => t.toLowerCase().includes(filtro.tag.toLowerCase())));
    }
    return list.slice().sort((a, b) => {
      if (a.fijado && !b.fijado) return -1;
      if (!a.fijado && b.fijado) return 1;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }

  async addPublicacionMuro(p) {
    const id = "post-" + Date.now();
    const ahora = new Date();
    const fechaTexto = ahora.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long'
    });

    const tagsArray = Array.isArray(p.tags) 
      ? p.tags 
      : String(p.tags || '').split(',').map(t => t.trim()).filter(Boolean);

    const nueva = {
      id,
      titulo: String(p.titulo || '').trim(),
      contenido: String(p.contenido || '').trim(),
      autor: String(p.autor || 'Loma Verde Lunar').trim(),
      redOrigen: String(p.redOrigen || 'mi_arte').trim(),
      redEtiqueta: String(p.redEtiqueta || '').trim() || (
        p.redOrigen === 'whatsapp' ? 'Rescatado de WhatsApp 💬' :
        p.redOrigen === 'instagram' ? 'Visto en Instagram 📸' :
        p.redOrigen === 'facebook' ? 'Visto en Facebook 👥' :
        p.redOrigen === 'mundo' ? 'El Arte del Mundo 🌍' :
        p.redOrigen === 'video' ? 'Cápsula Audiovisual 🎥' : 'Mi Arte & Cosmovisión 🎨'
      ),
      urlOriginal: String(p.urlOriginal || '').trim(),
      imagenUrl: String(p.imagenUrl || '').trim(),
      videoUrl: String(p.videoUrl || '').trim(),
      tags: tagsArray,
      fijado: Boolean(p.fijado),
      reacciones: { amor: 0, magia: 0, fuego: 0, tierra: 0, luz: 0 },
      createdAt: ahora.toISOString(),
      fechaTexto: String(p.fechaTexto || fechaTexto)
    };

    if (firebase.isFirebaseEnabled()) {
      try {
        const fdb = firebase.getDb();
        await fdb.collection('muro_publicaciones').doc(id).set(nueva);
        return nueva;
      } catch (e) {
        console.error("Error guardando publicación en Firebase:", e);
      }
    }

    if (!this.data.publicacionesMuro) {
      this.data.publicacionesMuro = JSON.parse(JSON.stringify(SEED_DATA.publicacionesMuro || []));
    }
    this.data.publicacionesMuro.unshift(nueva);
    this.save();
    return nueva;
  }

  async updatePublicacionMuro(id, updates) {
    if (firebase.isFirebaseEnabled()) {
      try {
        const fdb = firebase.getDb();
        const docRef = fdb.collection('muro_publicaciones').doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
          const updated = { ...doc.data(), ...updates };
          await docRef.set(updated, { merge: true });
          return updated;
        }
      } catch (e) {
        console.error("Error al actualizar post en Firebase:", e);
      }
    }

    const idx = (this.data.publicacionesMuro || []).findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.publicacionesMuro[idx] = { ...this.data.publicacionesMuro[idx], ...updates };
      this.save();
      return this.data.publicacionesMuro[idx];
    }
    throw new Error("Publicación no encontrada");
  }

  async deletePublicacionMuro(id) {
    if (firebase.isFirebaseEnabled()) {
      try {
        const fdb = firebase.getDb();
        await fdb.collection('muro_publicaciones').doc(id).delete();
        return true;
      } catch (e) {
        console.error("Error eliminando post en Firebase:", e);
      }
    }

    this.data.publicacionesMuro = (this.data.publicacionesMuro || []).filter(p => p.id !== id);
    this.save();
    return true;
  }

  async reaccionarPublicacionMuro(id, tipo) {
    const tiposValidos = ['amor', 'magia', 'fuego', 'tierra', 'luz'];
    const campo = tiposValidos.includes(tipo) ? tipo : 'amor';

    if (firebase.isFirebaseEnabled()) {
      try {
        const fdb = firebase.getDb();
        const docRef = fdb.collection('muro_publicaciones').doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
          const data = doc.data();
          const reacciones = data.reacciones || { amor: 0, magia: 0, fuego: 0, tierra: 0, luz: 0 };
          reacciones[campo] = (reacciones[campo] || 0) + 1;
          await docRef.update({ reacciones });
          return { id, reacciones };
        }
      } catch (e) {
        console.error("Error al reaccionar en Firebase:", e);
      }
    }

    const post = (this.data.publicacionesMuro || []).find(p => p.id === id);
    if (post) {
      if (!post.reacciones) post.reacciones = { amor: 0, magia: 0, fuego: 0, tierra: 0, luz: 0 };
      post.reacciones[campo] = (post.reacciones[campo] || 0) + 1;
      this.save();
      return { id, reacciones: post.reacciones };
    }
    throw new Error("Publicación no encontrada");
  }
}

const db = new Database();
module.exports = db;
