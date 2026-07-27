/**
 * Turning what the child made into a plate: the same object the rest of the
 * guide is made of. Every tool renders its artefact as an <svg>, and this
 * composites that drawing onto paper with a caption block, then hands back a
 * PNG. Printing uses the browser, driven by `print.css`.
 */
export interface PlateCaption {
  /** The name of the thing he made. */
  readonly title: string;
  /** Measured, factual lines. No praise. */
  readonly lines?: readonly string[];
  /** Defaults to "Rikki's Field Guide". */
  readonly imprint?: string;
}

const PAPER = '#f4f0e6';
const INK = '#22211b';
const FAINT = '#6b6757';
const RULE = '#ddd6c4';

/** Serialise an <svg> element to a same-origin data URL. */
function svgToUrl(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  if (!clone.getAttribute('width') && clone.viewBox.baseVal.width) {
    clone.setAttribute('width', String(clone.viewBox.baseVal.width));
    clone.setAttribute('height', String(clone.viewBox.baseVal.height));
  }
  const xml = new XMLSerializer().serializeToString(clone);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
}

/**
 * Compose the drawing and its caption onto a paper plate and download a PNG.
 * Resolves false when the browser refuses (canvas or download unavailable).
 */
export async function exportPlate(
  svg: SVGSVGElement,
  caption: PlateCaption,
  filename: string,
): Promise<boolean> {
  try {
    const W = 1400;
    const margin = 72;
    const capH = 60 + (caption.lines?.length ?? 0) * 34 + 46;
    const box = svg.viewBox.baseVal;
    const aspect = box && box.width ? box.height / box.width : 0.78;
    const drawW = W - margin * 2;
    const drawH = Math.round(drawW * aspect);
    const H = margin + drawH + capH + margin;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const g = canvas.getContext('2d');
    if (!g) return false;

    g.fillStyle = PAPER;
    g.fillRect(0, 0, W, H);

    const img = new Image();
    img.decoding = 'sync';
    const url = svgToUrl(svg);
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('svg did not load'));
      img.src = url;
    });
    g.drawImage(img, margin, margin, drawW, drawH);

    // hairline around the drawing, as on the naturalist plates
    g.strokeStyle = RULE;
    g.lineWidth = 2;
    g.strokeRect(margin + 0.5, margin + 0.5, drawW, drawH);

    let y = margin + drawH + 52;
    g.fillStyle = INK;
    g.font = '600 34px Literata, Georgia, serif';
    g.fillText(caption.title, margin, y);

    g.font = '400 24px Inter, system-ui, sans-serif';
    g.fillStyle = FAINT;
    for (const line of caption.lines ?? []) {
      y += 34;
      g.fillText(line, margin, y);
    }

    y += 40;
    g.strokeStyle = RULE;
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(margin, y - 18);
    g.lineTo(W - margin, y - 18);
    g.stroke();
    g.fillStyle = FAINT;
    g.font = '400 20px Inter, system-ui, sans-serif';
    g.fillText(caption.imprint ?? "Rikki's Field Guide", margin, y + 8);

    const href = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = href;
    a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return true;
  } catch {
    return false;
  }
}

/** Print the current tool. `print.css` hides everything but `.plate-print`. */
export function printPlate(): void {
  try {
    window.print();
  } catch {
    /* nothing to do */
  }
}
