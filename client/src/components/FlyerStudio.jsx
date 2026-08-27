import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle, 
  RotateCcw, 
  Upload, 
  Moon, 
  Type,
  Move,
  AlignCenter,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  MousePointer,
  Scaling,
  Wand2,
  Lock,
  Unlock
} from 'lucide-react';

export default function FlyerStudio({ initialData = {}, config, onSaved }) {
  // Elementos individuales con soporte de anclaje direccional
  const [elements, setElements] = useState({
    logo: {
      id: 'logo',
      name: 'Logo en la Luna',
      x: 400,
      y: 425,
      radius: 46,
      scale: 1,
      visible: true,
      mode: 'emblema', // 'emblema', 'fusion-mistica', 'silueta'
      opacity: 0.95
    },
    ribbon: {
      id: 'ribbon',
      name: 'Listón de Rubro',
      text: initialData.tipo || 'Gastronomía',
      x: 400,
      y: 554,
      w: 280,
      h: 34,
      fontSize: 13.5,
      visible: true
    },
    cartela: {
      id: 'cartela',
      name: 'Cartela Pergamino',
      x: 400,
      y: 660,
      w: 540,
      h: 185,
      visible: true
    },
    title: {
      id: 'title',
      name: 'Nombre del Proyecto',
      text: initialData.nombre || 'Vrde Club',
      x: 400,
      y: 604,
      fontSize: 34,
      visible: true
    },
    author: {
      id: 'author',
      name: 'Autor / Subtítulo',
      text: initialData.nombrePersonal || 'Por María Gómez',
      x: 400,
      y: 632,
      fontSize: 16,
      visible: true
    },
    desc: {
      id: 'desc',
      name: 'Descripción',
      text: initialData.descripcion || 'Miel pura de monte, polen agroecológico y conservas naturales.',
      x: 400,
      y: 672,
      fontSize: 15,
      lineHeight: 21,
      maxW: 460,
      visible: true
    },
    instagram: {
      id: 'instagram',
      name: 'Instagram / Redes',
      text: initialData.instagram || '@vrdeclub',
      x: 400,
      y: 722,
      w: 260,
      h: 32,
      fontSize: 13.5,
      visible: true
    }
  });

  const [selectedId, setSelectedId] = useState('title');
  const [uploadedLogo, setUploadedLogo] = useState(initialData.imagenBase64 || null);
  const [customFlyerBg, setCustomFlyerBg] = useState(null);

  // Estados de Interacción (Drag & Resize con Anclaje)
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState(null); // 'tl', 'tr', 'bl', 'br'
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeAnchor, setResizeAnchor] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [cursorStyle, setCursorStyle] = useState('default');

  const canvasRef = useRef(null);
  const masterImageRef = useRef(null);
  const logoImageRef = useRef(null);

  // Pre-cargar imagen base oficial
  useEffect(() => {
    const img = new Image();
    img.src = '/plantilla_luna_piscis.jpg';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      masterImageRef.current = img;
      renderFlyer();
    };
  }, []);

  // Cargar imagen del logo
  useEffect(() => {
    if (uploadedLogo) {
      const img = new Image();
      img.src = uploadedLogo;
      img.onload = () => {
        logoImageRef.current = img;
        renderFlyer();
      };
    } else {
      logoImageRef.current = null;
      renderFlyer();
    }
  }, [uploadedLogo]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomFlyerBg(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función Mágica: Auto-organizar elementos y resolver superposiciones con separación limpia
  const autoOrganizeLayout = () => {
    setElements(prev => {
      const logoRadius = Math.min(52, prev.logo.radius || 46);
      const titleSize = prev.title.fontSize || 34;
      const authorSize = prev.author.fontSize || 16;
      const descSize = prev.desc.fontSize || 15;
      const descLineH = Math.round(descSize * 1.4);
      
      // Estimar líneas de texto de descripción
      const wordsCount = (prev.desc.text || '').split(' ').length;
      const estimatedLines = Math.max(1, Math.ceil(wordsCount / 6));
      const descHeight = estimatedLines * descLineH;

      // 1. Logo perfectamente centrado en la Luna
      const logoY = 425;
      
      // 2. Listón de Rubro con margen cómodo bajo la luna
      const ribbonY = 554;
      
      // 3. Contenidos de la Cartela
      const titleY = 604;
      const authorY = titleY + Math.round(titleSize * 0.75) + 6;
      const descY = (prev.author.visible && prev.author.text) ? (authorY + 36) : (titleY + 40);
      const igY = descY + descHeight + 22;

      // 4. Cartela envolviendo los textos con padding superior e inferior
      const cartelaTop = ribbonY + 20;
      const cartelaBottom = (prev.instagram.visible && prev.instagram.text) ? (igY + 26) : (descY + descHeight + 20);
      const cartelaHeight = Math.max(160, cartelaBottom - cartelaTop);
      const cartelaY = cartelaTop + cartelaHeight / 2;

      return {
        ...prev,
        logo: {
          ...prev.logo,
          x: 400,
          y: logoY,
          radius: logoRadius
        },
        ribbon: {
          ...prev.ribbon,
          x: 400,
          y: ribbonY
        },
        cartela: {
          ...prev.cartela,
          x: 400,
          y: cartelaY,
          w: Math.max(500, prev.cartela.w || 540),
          h: cartelaHeight
        },
        title: {
          ...prev.title,
          x: 400,
          y: titleY
        },
        author: {
          ...prev.author,
          x: 400,
          y: authorY
        },
        desc: {
          ...prev.desc,
          x: 400,
          y: descY
        },
        instagram: {
          ...prev.instagram,
          x: 400,
          y: igY
        }
      };
    });
  };

  // Centrar horizontalmente el elemento seleccionado
  const centerSelectedElement = () => {
    if (!selectedId || !elements[selectedId]) return;
    setElements(prev => ({
      ...prev,
      [selectedId]: { ...prev[selectedId], x: 400 }
    }));
  };

  // Renderizado del Canvas (800 x 1000)
  const renderFlyer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W = 800;
    const H = 1000;
    canvas.width = W;
    canvas.height = H;

    // 1. Fondo base
    if (customFlyerBg) {
      const customImg = new Image();
      customImg.src = customFlyerBg;
      if (customImg.complete) ctx.drawImage(customImg, 0, 0, W, H);
    } else if (masterImageRef.current) {
      ctx.drawImage(masterImageRef.current, 0, 0, W, H);
    } else {
      let bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#f9f6ef');
      bgGrad.addColorStop(0.5, '#eee4cb');
      bgGrad.addColorStop(1, '#2b5329');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Cartela Pergamino
    const elCartela = elements.cartela;
    if (elCartela.visible) {
      ctx.save();
      const cX = elCartela.x - elCartela.w / 2;
      const cY = elCartela.y - elCartela.h / 2;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 8;

      let cartelaGrad = ctx.createLinearGradient(0, cY, 0, cY + elCartela.h);
      cartelaGrad.addColorStop(0, '#fbf6ea');
      cartelaGrad.addColorStop(0.5, '#f5edd9');
      cartelaGrad.addColorStop(1, '#ebd7b2');
      ctx.fillStyle = cartelaGrad;

      ctx.beginPath();
      ctx.roundRect(cX, cY, elCartela.w, elCartela.h, 20);
      ctx.fill();

      ctx.shadowColor = 'transparent';

      ctx.strokeStyle = '#1d3c1e';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.strokeStyle = '#c48c26';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cX + 4, cY + 4, elCartela.w - 8, elCartela.h - 8, 16);
      ctx.stroke();

      ctx.restore();
    }

    // 3. Listón de Rubro
    const elRibbon = elements.ribbon;
    if (elRibbon.visible) {
      ctx.save();
      const rX = elRibbon.x - elRibbon.w / 2;
      const rY = elRibbon.y - elRibbon.h / 2;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;

      let ribbonGrad = ctx.createLinearGradient(0, rY, 0, rY + elRibbon.h);
      ribbonGrad.addColorStop(0, '#d26a19');
      ribbonGrad.addColorStop(1, '#ad4b0a');
      ctx.fillStyle = ribbonGrad;
      ctx.beginPath();
      ctx.roundRect(rX, rY, elRibbon.w, elRibbon.h, elRibbon.h / 2);
      ctx.fill();

      ctx.shadowColor = 'transparent';

      ctx.strokeStyle = '#fbf7ec';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      const fSize = elRibbon.fontSize || 13.5;
      ctx.font = `bold ${fSize}px Nunito, sans-serif`;
      ctx.textAlign = 'center';
      ctx.letterSpacing = '2px';
      ctx.fillText(`🌿 ${elRibbon.text.toUpperCase()} 🌿`, elRibbon.x, elRibbon.y + (fSize * 0.35));
      ctx.restore();
    }

    // 4. Logo en la Luna
    const elLogo = elements.logo;
    if (elLogo.visible && logoImageRef.current) {
      ctx.save();
      const logoImg = logoImageRef.current;
      const radius = elLogo.radius;

      ctx.beginPath();
      ctx.arc(elLogo.x, elLogo.y, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.globalAlpha = elLogo.opacity;

      if (elLogo.mode === 'fusion-mistica') {
        ctx.globalCompositeOperation = 'multiply';
      } else {
        ctx.fillStyle = elLogo.mode === 'silueta' ? 'rgba(255, 255, 255, 0.5)' : '#ffffff';
        ctx.beginPath();
        ctx.arc(elLogo.x, elLogo.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      const aspect = logoImg.width / logoImg.height;
      const targetSize = (radius * 2 - 8) * elLogo.scale;
      let dW = targetSize;
      let dH = targetSize / aspect;
      if (aspect < 1) {
        dH = targetSize;
        dW = targetSize * aspect;
      }

      ctx.drawImage(logoImg, elLogo.x - dW / 2, elLogo.y - dH / 2, dW, dH);
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = '#c48c26';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(elLogo.x, elLogo.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 5. Título del Proyecto
    const elTitle = elements.title;
    if (elTitle.visible && elTitle.text) {
      ctx.save();
      ctx.fillStyle = '#1d3c1e';
      ctx.font = `bold ${elTitle.fontSize}px Lora, serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 1;
      ctx.fillText(elTitle.text.toUpperCase(), elTitle.x, elTitle.y);
      ctx.restore();
    }

    // 6. Autor / Subtítulo
    const elAuthor = elements.author;
    if (elAuthor.visible && elAuthor.text) {
      ctx.save();
      ctx.fillStyle = '#8f651b';
      ctx.font = `italic 600 ${elAuthor.fontSize}px Lora, serif`;
      ctx.textAlign = 'center';
      ctx.fillText(elAuthor.text, elAuthor.x, elAuthor.y);

      ctx.strokeStyle = 'rgba(196, 140, 38, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(elAuthor.x - 70, elAuthor.y + 8);
      ctx.lineTo(elAuthor.x + 70, elAuthor.y + 8);
      ctx.stroke();
      ctx.restore();
    }

    // 7. Descripción
    const elDesc = elements.desc;
    if (elDesc.visible && elDesc.text) {
      ctx.save();
      ctx.fillStyle = '#2f3b2d';
      const fontSize = elDesc.fontSize || 15;
      const lineHeight = elDesc.lineHeight || Math.round(fontSize * 1.4);
      ctx.font = `${fontSize}px Nunito, sans-serif`;
      ctx.textAlign = 'center';

      const maxTextW = elDesc.maxW || 460;
      const words = elDesc.text.split(' ');
      let line = '';
      let textLines = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextW && n > 0) {
          textLines.push(line.trim());
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      textLines.push(line.trim());

      let currY = elDesc.y;
      for (let i = 0; i < textLines.length; i++) {
        ctx.fillText(textLines[i], elDesc.x, currY);
        currY += lineHeight;
      }
      ctx.restore();
    }

    // 8. Botón Instagram (con altura y tamaño de letra escalables)
    const elIg = elements.instagram;
    if (elIg.visible && elIg.text) {
      ctx.save();
      const igH = elIg.h || 32;
      const igX = elIg.x - elIg.w / 2;
      const igY = elIg.y - igH / 2;

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.beginPath();
      ctx.roundRect(igX, igY, elIg.w, igH, igH / 2);
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#1d3c1e';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#1d3c1e';
      const igFontSize = elIg.fontSize || Math.round(igH * 0.45);
      ctx.font = `bold ${igFontSize}px Nunito, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`📷  ${elIg.text}`, elIg.x, elIg.y + (igFontSize * 0.35));
      ctx.restore();
    }

    // 9. Manijas Interactivas de Redimensionado (Handles)
    if (selectedId && elements[selectedId]) {
      drawInteractiveSelectionAndHandles(ctx, elements[selectedId]);
    }
  };

  // Dibujar Recuadro con Manijas de Esquina
  const drawInteractiveSelectionAndHandles = (ctx, el) => {
    ctx.save();
    let bounds = getElementBounds(el);

    ctx.strokeStyle = '#c48c26';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(bounds.x - 6, bounds.y - 6, bounds.w + 12, bounds.h + 12);
    ctx.setLineDash([]);

    const handles = getCornerHandles(bounds);

    handles.forEach(h => {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = '#c48c26';
      ctx.beginPath();
      ctx.arc(h.x, h.y, 6.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(h.x, h.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

  // Coordenadas de las 4 manijas de esquina
  const getCornerHandles = (bounds) => {
    return [
      { id: 'tl', x: bounds.x - 6, y: bounds.y - 6 },
      { id: 'tr', x: bounds.x + bounds.w + 6, y: bounds.y - 6 },
      { id: 'bl', x: bounds.x - 6, y: bounds.y + bounds.h + 6 },
      { id: 'br', x: bounds.x + bounds.w + 6, y: bounds.y + bounds.h + 6 }
    ];
  };

  // Obtener caja envolvente para selección y manijas
  const getElementBounds = (el) => {
    if (el.id === 'logo') {
      return { x: el.x - el.radius, y: el.y - el.radius, w: el.radius * 2, h: el.radius * 2 };
    }
    if (el.id === 'ribbon') {
      const h = el.h || 34;
      return { x: el.x - el.w / 2, y: el.y - h / 2, w: el.w, h: h };
    }
    if (el.id === 'cartela') {
      return { x: el.x - el.w / 2, y: el.y - el.h / 2, w: el.w, h: el.h };
    }
    if (el.id === 'title') {
      const halfW = Math.max(140, el.fontSize * 6.5);
      return { x: el.x - halfW, y: el.y - el.fontSize, w: halfW * 2, h: el.fontSize + 10 };
    }
    if (el.id === 'author') {
      const halfW = Math.max(100, el.fontSize * 9);
      return { x: el.x - halfW, y: el.y - el.fontSize, w: halfW * 2, h: el.fontSize + 14 };
    }
    if (el.id === 'desc') {
      return { x: el.x - (el.maxW || 460) / 2, y: el.y - (el.fontSize || 15), w: (el.maxW || 460), h: 56 };
    }
    if (el.id === 'instagram') {
      const h = el.h || 32;
      return { x: el.x - el.w / 2, y: el.y - h / 2, w: el.w, h: h };
    }
    return { x: el.x - 50, y: el.y - 20, w: 100, h: 40 };
  };

  // Convertir coordenadas del puntero al espacio Canvas 800x1000
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // Manejar Click / Touch Down con captura de bordes fijos (Anchor)
  const handlePointerDown = (e) => {
    const coords = getCanvasCoords(e);

    // 1. Comprobar si el usuario tocó una manija de esquina (Handle) del elemento ya seleccionado
    if (selectedId && elements[selectedId]) {
      const el = elements[selectedId];
      const bounds = getElementBounds(el);
      const handles = getCornerHandles(bounds);

      for (const h of handles) {
        const dist = Math.hypot(coords.x - h.x, coords.y - h.y);
        if (dist <= 15) {
          setIsResizing(true);
          setActiveHandle(h.id);

          // Fijar los 4 bordes del elemento para que la esquina opuesta quede ANCLADA
          setResizeAnchor({
            left: bounds.x,
            right: bounds.x + bounds.w,
            top: bounds.y,
            bottom: bounds.y + bounds.h,
            centerX: el.x,
            centerY: el.y,
            startW: bounds.w,
            startH: bounds.h
          });
          return;
        }
      }
    }

    // 2. Si no tocó una manija, buscar qué elemento tocó
    const layerOrder = ['logo', 'instagram', 'author', 'title', 'ribbon', 'desc', 'cartela'];
    let hitId = null;

    for (const id of layerOrder) {
      const el = elements[id];
      if (!el || !el.visible) continue;
      const b = getElementBounds(el);
      if (coords.x >= b.x && coords.x <= b.x + b.w && coords.y >= b.y && coords.y <= b.y + b.h) {
        hitId = id;
        break;
      }
    }

    if (hitId) {
      setSelectedId(hitId);
      setIsDragging(true);
      setDragOffset({
        x: coords.x - elements[hitId].x,
        y: coords.y - elements[hitId].y
      });
    } else {
      setSelectedId(null);
    }
  };

  // Manejar Arrastre o Redimensionado con Anclaje Direccional
  const handlePointerMove = (e) => {
    const coords = getCanvasCoords(e);

    // Actualizar cursor según manija o elemento
    if (!isDragging && !isResizing && selectedId && elements[selectedId]) {
      const bounds = getElementBounds(elements[selectedId]);
      const handles = getCornerHandles(bounds);
      let onHandle = false;

      for (const h of handles) {
        if (Math.hypot(coords.x - h.x, coords.y - h.y) <= 15) {
          onHandle = true;
          setCursorStyle(h.id === 'tl' || h.id === 'br' ? 'nwse-resize' : 'nesw-resize');
          break;
        }
      }

      if (!onHandle) {
        if (coords.x >= bounds.x && coords.x <= bounds.x + bounds.w && coords.y >= bounds.y && coords.y <= bounds.y + bounds.h) {
          setCursorStyle('grab');
        } else {
          setCursorStyle('default');
        }
      }
    }

    // ==============================================================
    // A) REDIMENSIONADO ANCLADO (LA ESQUINA OPUESTA NO SE MUEVE)
    // ==============================================================
    if (isResizing && selectedId && elements[selectedId] && activeHandle) {
      const { left, right, top, bottom, centerX, centerY } = resizeAnchor;

      if (selectedId === 'cartela') {
        let newLeft = left;
        let newRight = right;
        let newTop = top;
        let newBottom = bottom;

        if (activeHandle === 'br') {
          // Arrastrando abajo-derecha: la parte de arriba y la izquierda quedan FIJAS
          newRight = Math.max(left + 220, coords.x);
          newBottom = Math.max(top + 90, coords.y);
        } else if (activeHandle === 'bl') {
          // Arrastrando abajo-izquierda: la parte de arriba y la derecha quedan FIJAS
          newLeft = Math.min(right - 220, coords.x);
          newBottom = Math.max(top + 90, coords.y);
        } else if (activeHandle === 'tr') {
          // Arrastrando arriba-derecha: la parte de abajo y la izquierda quedan FIJAS
          newRight = Math.max(left + 220, coords.x);
          newTop = Math.min(bottom - 90, coords.y);
        } else if (activeHandle === 'tl') {
          // Arrastrando arriba-izquierda: la parte de abajo y la derecha quedan FIJAS
          newLeft = Math.min(right - 220, coords.x);
          newTop = Math.min(bottom - 90, coords.y);
        }

        const newW = newRight - newLeft;
        const newH = newBottom - newTop;

        setElements(prev => ({
          ...prev,
          cartela: {
            ...prev.cartela,
            w: Math.round(newW),
            h: Math.round(newH),
            x: Math.round(newLeft + newW / 2),
            y: Math.round(newTop + newH / 2)
          }
        }));
      } else if (selectedId === 'instagram') {
        // Redimensionar Instagram tanto en ancho como en alto
        let newLeft = left;
        let newRight = right;
        let newTop = top;
        let newBottom = bottom;

        if (activeHandle === 'br' || activeHandle === 'bl') {
          newBottom = Math.max(top + 22, coords.y);
        } else {
          newTop = Math.min(bottom - 22, coords.y);
        }

        if (activeHandle === 'br' || activeHandle === 'tr') {
          newRight = Math.max(left + 140, coords.x);
        } else {
          newLeft = Math.min(right - 140, coords.x);
        }

        const newW = Math.max(160, Math.min(420, newRight - newLeft));
        const newH = Math.max(24, Math.min(54, newBottom - newTop));
        const newFontSize = Math.max(11, Math.min(22, Math.round(newH * 0.45)));

        setElements(prev => ({
          ...prev,
          instagram: {
            ...prev.instagram,
            w: Math.round(newW),
            h: Math.round(newH),
            fontSize: newFontSize,
            x: Math.round(newLeft + newW / 2),
            y: Math.round(newTop + newH / 2)
          }
        }));
      } else if (selectedId === 'ribbon') {
        // Redimensionar Rubro
        let newLeft = left;
        let newRight = right;
        let newTop = top;
        let newBottom = bottom;

        if (activeHandle === 'br' || activeHandle === 'bl') {
          newBottom = Math.max(top + 22, coords.y);
        } else {
          newTop = Math.min(bottom - 22, coords.y);
        }

        if (activeHandle === 'br' || activeHandle === 'tr') {
          newRight = Math.max(left + 160, coords.x);
        } else {
          newLeft = Math.min(right - 160, coords.x);
        }

        const newW = Math.max(180, Math.min(480, newRight - newLeft));
        const newH = Math.max(26, Math.min(52, newBottom - newTop));
        const newFontSize = Math.max(10, Math.min(22, Math.round(newH * 0.42)));

        setElements(prev => ({
          ...prev,
          ribbon: {
            ...prev.ribbon,
            w: Math.round(newW),
            h: Math.round(newH),
            fontSize: newFontSize,
            x: Math.round(newLeft + newW / 2),
            y: Math.round(newTop + newH / 2)
          }
        }));
      } else if (selectedId === 'logo') {
        const dist = Math.hypot(coords.x - centerX, coords.y - centerY);
        const newRadius = Math.max(24, Math.min(90, Math.round(dist)));
        setElements(prev => ({
          ...prev,
          logo: { ...prev.logo, radius: newRadius }
        }));
      } else if (selectedId === 'title') {
        const distX = Math.abs(coords.x - centerX);
        const newSize = Math.max(20, Math.min(54, Math.round((distX / 220) * 34)));
        setElements(prev => ({
          ...prev,
          title: { ...prev.title, fontSize: newSize }
        }));
      } else if (selectedId === 'author') {
        const distX = Math.abs(coords.x - centerX);
        const newSize = Math.max(12, Math.min(28, Math.round((distX / 160) * 16)));
        setElements(prev => ({
          ...prev,
          author: { ...prev.author, fontSize: newSize }
        }));
      } else if (selectedId === 'desc') {
        const distX = Math.abs(coords.x - centerX);
        const newSize = Math.max(12, Math.min(26, Math.round((distX / 230) * 15)));
        const newMaxW = Math.max(280, Math.min(680, Math.round(distX * 2)));
        setElements(prev => ({
          ...prev,
          desc: { ...prev.desc, fontSize: newSize, lineHeight: Math.round(newSize * 1.4), maxW: newMaxW }
        }));
      }
      return;
    }

    // ==============================================================
    // B) DESPLAZAMIENTO LIBRE (DRAGGING)
    // ==============================================================
    if (isDragging && selectedId && elements[selectedId]) {
      setElements(prev => ({
        ...prev,
        [selectedId]: {
          ...prev[selectedId],
          x: Math.round(coords.x - dragOffset.x),
          y: Math.round(coords.y - dragOffset.y)
        }
      }));
    }
  };

  // Fin de Arrastre o Redimensionado
  const handlePointerUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setActiveHandle(null);
  };

  // Re-renderizar canvas ante cambios
  useEffect(() => {
    renderFlyer();
  }, [elements, selectedId, customFlyerBg]);

  // Descargar el flyer final
  const downloadFlyer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setSelectedId(null);
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `${(elements.title.text || 'Flyer').replace(/\s+/g, '_')}_Oficial_Loma_Verde.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }, 50);
  };

  const currentSelected = selectedId ? elements[selectedId] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Encabezado */}
      <div className="text-center mb-8">
        <span className="bg-loma-accent/20 text-loma-accent font-extrabold text-xs uppercase px-3.5 py-1.5 rounded-full tracking-wider inline-flex items-center gap-1.5 mb-2">
          <Sparkles className="w-4 h-4" /> Flyer Studio Profesional • Loma Verde ♒
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-loma-green uppercase tracking-tight">
          Editor Visual con Anclaje y Auto-Alineación 🎨
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mt-2">
          ¡Ajusta cualquier esquina sin deformar la otra! Usa el botón de <strong>Auto-Organizar</strong> para evitar superposiciones con un solo clic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Panel de Controles Izquierdo */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border-2 border-loma-green shadow-sm space-y-6">
          
          {/* Barra Superior con Botón Mágico de Auto-Organización */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-extrabold text-loma-wood uppercase flex items-center gap-1.5">
                <MousePointer className="w-3.5 h-3.5 text-loma-accent" />
                <span>Elemento Activo:</span>
              </label>

              <button
                onClick={autoOrganizeLayout}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                title="Acomoda todos los textos y el logo automáticamente para que nunca se tapen"
              >
                <Wand2 className="w-3.5 h-3.5 text-loma-accent" />
                <span>✨ Auto-Organizar y Evitar Superposiciones</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'logo', label: '🌕 Logo en la Luna' },
                { id: 'title', label: '🔤 Título' },
                { id: 'author', label: '✍️ Autor' },
                { id: 'ribbon', label: '🏷️ Rubro' },
                { id: 'desc', label: '📝 Descripción' },
                { id: 'instagram', label: '📷 Instagram' },
                { id: 'cartela', label: '📜 Cartela' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedId(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedId === tab.id
                      ? 'bg-loma-green text-white shadow-xs scale-102'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editor del Elemento Seleccionado */}
          {currentSelected && (
            <div className="bg-[#faf9f5] p-4 sm:p-5 rounded-2xl border border-loma-wood/20 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="font-serif font-bold text-sm text-loma-green flex items-center gap-1.5">
                  <Scaling className="w-4 h-4 text-loma-accent" />
                  <span>Editando: {currentSelected.name}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={centerSelectedElement}
                    className="bg-white hover:bg-gray-100 text-loma-green border border-gray-300 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                    title="Centrar horizontalmente"
                  >
                    <AlignCenter className="w-3 h-3" />
                    <span>Centrar</span>
                  </button>

                  <button
                    onClick={() => setElements(prev => ({
                      ...prev,
                      [selectedId]: { ...prev[selectedId], visible: !prev[selectedId].visible }
                    }))}
                    className={`p-1 rounded-lg border text-xs ${currentSelected.visible ? 'text-gray-600 bg-white' : 'text-red-600 bg-red-50 border-red-200'}`}
                    title={currentSelected.visible ? 'Ocultar elemento' : 'Mostrar elemento'}
                  >
                    {currentSelected.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Controles específicos */}
              {selectedId === 'logo' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cargar Logo / Foto</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-loma-wood file:text-white hover:file:bg-loma-green cursor-pointer bg-white p-1.5 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Tamaño Círculo ({elements.logo.radius}px)</span>
                      <input 
                        type="range" 
                        min="25" 
                        max="85" 
                        value={elements.logo.radius} 
                        onChange={(e) => setElements(prev => ({
                          ...prev,
                          logo: { ...prev.logo, radius: parseInt(e.target.value, 10) }
                        }))}
                        className="w-full accent-loma-green"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Zoom Foto</span>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="2.5" 
                        step="0.05"
                        value={elements.logo.scale} 
                        onChange={(e) => setElements(prev => ({
                          ...prev,
                          logo: { ...prev.logo, scale: parseFloat(e.target.value) }
                        }))}
                        className="w-full accent-loma-accent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedId === 'title' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombre del Proyecto</label>
                    <input 
                      type="text" 
                      value={elements.title.text} 
                      onChange={(e) => setElements(prev => ({
                        ...prev,
                        title: { ...prev.title, text: e.target.value }
                      }))}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white font-serif font-bold text-base text-loma-green focus:outline-none focus:border-loma-accent"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Tamaño de Letra ({elements.title.fontSize}px)</span>
                    <input 
                      type="range" 
                      min="20" 
                      max="54" 
                      value={elements.title.fontSize} 
                      onChange={(e) => setElements(prev => ({
                        ...prev,
                        title: { ...prev.title, fontSize: parseInt(e.target.value, 10) }
                      }))}
                      className="w-full accent-loma-green"
                    />
                  </div>
                </div>
              )}

              {selectedId === 'author' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Texto del Autor</label>
                    <input 
                      type="text" 
                      value={elements.author.text} 
                      onChange={(e) => setElements(prev => ({
                        ...prev,
                        author: { ...prev.author, text: e.target.value }
                      }))}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:border-loma-accent"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Tamaño de Letra ({elements.author.fontSize}px)</span>
                    <input 
                      type="range" 
                      min="12" 
                      max="28" 
                      value={elements.author.fontSize} 
                      onChange={(e) => setElements(prev => ({
                        ...prev,
                        author: { ...prev.author, fontSize: parseInt(e.target.value, 10) }
                      }))}
                      className="w-full accent-loma-accent"
                    />
                  </div>
                </div>
              )}

              {selectedId === 'ribbon' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Rubro / Categoría</label>
                    <input 
                      type="text" 
                      value={elements.ribbon.text} 
                      onChange={(e) => setElements(prev => ({
                        ...prev,
                        ribbon: { ...prev.ribbon, text: e.target.value }
                      }))}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-loma-accent focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Tamaño Letra ({elements.ribbon.fontSize || 13.5}px)</span>
                      <input 
                        type="range" 
                        min="10" 
                        max="22" 
                        step="0.5"
                        value={elements.ribbon.fontSize || 13.5} 
                        onChange={(e) => setElements(prev => ({
                          ...prev,
                          ribbon: { ...prev.ribbon, fontSize: parseFloat(e.target.value) }
                        }))}
                        className="w-full accent-loma-accent"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Ancho Listón</span>
                      <input 
                        type="range" 
                        min="180" 
                        max="480" 
                        value={elements.ribbon.w} 
                        onChange={(e) => setElements(prev => ({
                          ...prev,
                          ribbon: { ...prev.ribbon, w: parseInt(e.target.value, 10) }
                        }))}
                        className="w-full accent-loma-green"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedId === 'desc' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Texto de la Descripción</label>
                    <textarea 
                      rows={2}
                      value={elements.desc.text} 
                      onChange={(e) => setElements(prev => ({
                        ...prev,
                        desc: { ...prev.desc, text: e.target.value }
                      }))}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none leading-relaxed"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Tamaño Letra ({elements.desc.fontSize || 15}px)</span>
                      <input 
                        type="range" 
                        min="11" 
                        max="25" 
                        step="0.5"
                        value={elements.desc.fontSize || 15} 
                        onChange={(e) => {
                          const size = parseFloat(e.target.value);
                          setElements(prev => ({
                            ...prev,
                            desc: { ...prev.desc, fontSize: size, lineHeight: Math.round(size * 1.4) }
                          }));
                        }}
                        className="w-full accent-loma-accent"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Ancho Párrafo</span>
                      <input 
                        type="range" 
                        min="300" 
                        max="620" 
                        value={elements.desc.maxW || 460} 
                        onChange={(e) => setElements(prev => ({
                          ...prev,
                          desc: { ...prev.desc, maxW: parseInt(e.target.value, 10) }
                        }))}
                        className="w-full accent-loma-wood"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedId === 'instagram' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Usuario de Instagram</label>
                    <input 
                      type="text" 
                      value={elements.instagram.text} 
                      onChange={(e) => setElements(prev => ({
                        ...prev,
                        instagram: { ...prev.instagram, text: e.target.value }
                      }))}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Ancho Botón</span>
                      <input 
                        type="range" 
                        min="160" 
                        max="400" 
                        value={elements.instagram.w} 
                        onChange={(e) => setElements(prev => ({
                          ...prev,
                          instagram: { ...prev.instagram, w: parseInt(e.target.value, 10) }
                        }))}
                        className="w-full accent-loma-accent"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Alto Botón ({elements.instagram.h || 32}px)</span>
                      <input 
                        type="range" 
                        min="24" 
                        max="54" 
                        value={elements.instagram.h || 32} 
                        onChange={(e) => {
                          const h = parseInt(e.target.value, 10);
                          setElements(prev => ({
                            ...prev,
                            instagram: { ...prev.instagram, h: h, fontSize: Math.round(h * 0.45) }
                          }));
                        }}
                        className="w-full accent-loma-green"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedId === 'cartela' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Ancho Cartela</span>
                    <input 
                      type="range" 
                      min="350" 
                      max="680" 
                      value={elements.cartela.w} 
                      onChange={(e) => setElements(prev => ({
                        ...prev,
                        cartela: { ...prev.cartela, w: parseInt(e.target.value, 10) }
                      }))}
                      className="w-full accent-loma-green"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Alto Cartela ({elements.cartela.h}px)</span>
                    <input 
                      type="range" 
                      min="110" 
                      max="280" 
                      value={elements.cartela.h} 
                      onChange={(e) => setElements(prev => ({
                        ...prev,
                        cartela: { ...prev.cartela, h: parseInt(e.target.value, 10) }
                      }))}
                      className="w-full accent-loma-accent"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subir Afiche Base Alternativo */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span className="font-semibold">Afiche Base:</span>
            <label className="text-loma-accent font-bold hover:underline cursor-pointer flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              <span>Subir nuevo fondo</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleCustomBgUpload} 
                className="hidden" 
              />
            </label>
          </div>

          {/* Botón Descargar */}
          <button
            onClick={downloadFlyer}
            className="w-full bg-loma-accent hover:bg-amber-600 text-white font-bold text-sm uppercase tracking-wider py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-5 h-5" />
            <span>Descargar Flyer Oficial (PNG HD)</span>
          </button>
        </div>

        {/* Previsualizador Interactivo Derecho */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-loma-wood shadow-xl max-w-sm sm:max-w-md w-full sticky top-20">
            <div className="text-center text-xs font-bold text-loma-wood uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
              <Scaling className="w-4 h-4 text-loma-accent" />
              <span>Arrastra esquinas (la esquina opuesta queda fija)</span>
            </div>
            
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-loma-green/40 bg-gray-100 select-none"
              style={{ cursor: cursorStyle }}
            >
              <canvas 
                ref={canvasRef} 
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                className="w-full h-auto block touch-none"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 font-semibold px-1">
              <span>💡 Puntos dorados anclados</span>
              <button
                onClick={centerSelectedElement}
                className="text-loma-green font-bold hover:underline"
              >
                Centrar Activo
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
