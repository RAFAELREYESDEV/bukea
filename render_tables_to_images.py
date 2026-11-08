import os
import subprocess

BASE_DIR = r"c:\Users\RAFA\Documents\BUKEA"
DOCS_DIR = os.path.join(BASE_DIR, "docs")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

COMMON_HEAD = """
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #08090C;
      color: #E2E8F0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin: 0;
      padding: 0;
    }
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .gold-gradient {
      background: linear-gradient(135deg, #FFFFFF 0%, #E5C158 50%, #9B7816 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .border-gold-glow {
      box-shadow: 0 0 25px -5px rgba(212, 175, 55, 0.15);
    }
  </style>
</head>
<body class="p-8 antialiased">
"""

def make_cintillo(title, category):
    return f"""
    <!-- CINTILLO OFICIAL DE BOOKEALO -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#12141C] via-[#0F1117] to-[#161822] border border-[#262A38] p-6 mb-8 border-gold-glow">
      <div class="absolute -top-12 -right-12 w-56 h-56 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="flex items-center justify-between relative z-10">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D4AF37] via-[#F5E7B2] to-[#B38F1E] flex items-center justify-center text-black font-extrabold text-2xl font-display shadow-lg shadow-[#D4AF37]/20">
            B
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-display font-extrabold text-2xl tracking-tight text-white">Bookealo<span class="text-[#D4AF37]">.</span></span>
              <span class="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#E5C158] text-[10px] font-bold tracking-wider uppercase border border-[#D4AF37]/30">
                Inteligencia de Mercado
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5 font-medium tracking-wide">{category}</p>
          </div>
        </div>
        <div class="text-right">
          <div class="text-xs font-mono font-bold text-[#E5C158]">{title}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Ecosistema Digital de Reservas & Experiencias</div>
        </div>
      </div>
    </div>
    """

def make_footer():
    return """
    <!-- FOOTER CORPORATIVO -->
    <div class="mt-8 pt-4 border-t border-[#202430] flex items-center justify-between text-[11px] text-slate-500">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>bukea.inkbytecorpore.workers.dev</span>
        <span>•</span>
        <span>Plan Express 4 Semanas</span>
      </div>
      <div>© 2026 Bookealo Inc. Todos los derechos reservados. Confidencial.</div>
    </div>
    """

# 1. HTML INTERNACIONAL
html_intl = COMMON_HEAD + make_cintillo("BENCHMARK INTERNACIONAL", "Análisis Comparativo de Referentes Globales") + """
    <!-- TABLA INTERNACIONAL -->
    <div class="rounded-2xl border border-[#232733] bg-[#0E1017] overflow-hidden shadow-2xl">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-[#151822] border-b border-[#232733] text-[11px] uppercase tracking-wider text-slate-400 font-bold">
            <th class="py-4 px-5">Plataforma</th>
            <th class="py-4 px-5">Origen & Respaldo</th>
            <th class="py-4 px-5">Propuesta Central</th>
            <th class="py-4 px-5">Qué Adoptamos para Bookealo</th>
            <th class="py-4 px-5 text-amber-400">Brecha frente a Bookealo</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#1D212C] text-xs">
          
          <tr class="hover:bg-[#12151E]/60 transition-colors">
            <td class="py-4 px-5">
              <div class="font-bold text-white text-sm">OpenTable</div>
              <div class="text-[10px] text-slate-400 mt-0.5">55,000+ Restaurantes • 80+ Países</div>
            </td>
            <td class="py-4 px-5">
              <span class="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20 text-[11px]">
                Booking Holdings
              </span>
              <div class="text-[10px] text-slate-500 mt-1">EE.UU. ($2.6B)</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              Estándar de oro en reservas mundiales y marketplace de comensales.
            </td>
            <td class="py-4 px-5">
              <span class="text-emerald-400 font-medium">✓ Reserve with Google:</span>
              <span class="text-slate-400 text-[11px] block mt-0.5">La reserva vive dentro de la ficha de Google Maps.</span>
            </td>
            <td class="py-4 px-5 text-slate-300 bg-amber-500/[0.02]">
              <span class="text-amber-300 font-semibold">NO opera en VE.</span>
              <div class="text-slate-400 text-[11px] mt-0.5">Comisión por cubierto ($1.50–$2.50) y costo alto ($249–$499/mes). Cero 360° y sin NFC.</div>
            </td>
          </tr>

          <tr class="hover:bg-[#12151E]/60 transition-colors">
            <td class="py-4 px-5">
              <div class="font-bold text-white text-sm">Resy</div>
              <div class="text-[10px] text-slate-400 mt-0.5">16,000+ Restaurantes Top</div>
            </td>
            <td class="py-4 px-5">
              <span class="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20 text-[11px]">
                American Express
              </span>
              <div class="text-[10px] text-slate-500 mt-1">EE.UU. (Adquirida 2019)</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              Reservas premium, curaduría editorial y estatus gastronómico VIP.
            </td>
            <td class="py-4 px-5">
              <span class="text-emerald-400 font-medium">✓ Posicionamiento de Estatus:</span>
              <span class="text-slate-400 text-[11px] block mt-0.5">La exclusividad y el trato VIP venden más que el software plano.</span>
            </td>
            <td class="py-4 px-5 text-slate-300 bg-amber-500/[0.02]">
              <span class="text-amber-300 font-semibold">Inaccesible fuera de EE.UU.</span>
              <div class="text-slate-400 text-[11px] mt-0.5">Cerró en UK en 2024 por economía inviable. Sin tecnología 3D/AR ni pagos NFC.</div>
            </td>
          </tr>

          <tr class="hover:bg-[#12151E]/60 transition-colors">
            <td class="py-4 px-5">
              <div class="font-bold text-white text-sm">SevenRooms</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Hotelería & Clubes Globales</div>
            </td>
            <td class="py-4 px-5">
              <span class="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 font-semibold border border-purple-500/20 text-[11px]">
                Independiente
              </span>
              <div class="text-[10px] text-slate-500 mt-1">EE.UU. / Global</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              CRM de comensales, retención, fidelización y automatización de marketing.
            </td>
            <td class="py-4 px-5">
              <span class="text-emerald-400 font-medium">✓ Fichas & Scoring de Comensal:</span>
              <span class="text-slate-400 text-[11px] block mt-0.5">Perfil de gustos, gasto acumulado y mesa preferida en el CRM (Tier 3).</span>
            </td>
            <td class="py-4 px-5 text-slate-300 bg-amber-500/[0.02]">
              <span class="text-amber-300 font-semibold">Precios corporativos prohibitorios.</span>
              <div class="text-slate-400 text-[11px] mt-0.5">Miles de dólares al mes. Solo para cadenas globales, no para locales independientes.</div>
            </td>
          </tr>

          <tr class="hover:bg-[#12151E]/60 transition-colors">
            <td class="py-4 px-5">
              <div class="font-bold text-white text-sm">Sunday App</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Revolución en Pagos de Mesa</div>
            </td>
            <td class="py-4 px-5">
              <span class="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20 text-[11px]">
                Big Mamma Group
              </span>
              <div class="text-[10px] text-slate-500 mt-1">Francia / UK</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              Pago de cuenta en mesa en 10 segundos mediante código QR y chips NFC.
            </td>
            <td class="py-4 px-5">
              <span class="text-emerald-400 font-medium">✓ Operativa NFC en Mesa:</span>
              <span class="text-slate-400 text-[11px] block mt-0.5">Identificación de mesa, separación de cuentas y propina instantánea (Tier 2/3).</span>
            </td>
            <td class="py-4 px-5 text-slate-300 bg-amber-500/[0.02]">
              <span class="text-amber-300 font-semibold">Solo resuelve el pago.</span>
              <div class="text-slate-400 text-[11px] mt-0.5">Cero visibilidad en Google Maps, sin tours 360°, sin motor de reservas y sin menús AR.</div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
""" + make_footer() + "</body></html>"


# 2. HTML NACIONAL (VENEZUELA)
html_nat = COMMON_HEAD + make_cintillo("ECOSISTEMA NACIONAL (VENEZUELA)", "Mapeo de Actores Locales & Oportunidades Tácticas") + """
    <!-- TABLA NACIONAL -->
    <div class="rounded-2xl border border-[#232733] bg-[#0E1017] overflow-hidden shadow-2xl">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-[#151822] border-b border-[#232733] text-[11px] uppercase tracking-wider text-slate-400 font-bold">
            <th class="py-4 px-5">Competidor</th>
            <th class="py-4 px-5">Enfoque & Territorio</th>
            <th class="py-4 px-5">Propuesta Actual</th>
            <th class="py-4 px-5">Cobro & Modelo</th>
            <th class="py-4 px-5 text-emerald-400">Por qué Gana Bookealo</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#1D212C] text-xs">
          
          <tr class="hover:bg-[#12151E]/60 transition-colors">
            <td class="py-4 px-5">
              <div class="font-bold text-white text-sm">Ganga</div>
              <div class="text-[10px] text-emerald-400 mt-0.5 font-medium">● Activa (Android + Web)</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              <span class="font-medium text-white">Nacional</span>
              <div class="text-[10px] text-slate-500 mt-0.5">Comercios urbanos</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              Cuponera de descuentos canjeables en local con código QR.
            </td>
            <td class="py-4 px-5">
              <span class="font-mono text-white font-semibold">$0 / $4.99 / $9.99</span>
              <div class="text-[10px] text-slate-400 mt-0.5">Prepagado: Pago Móvil / Binance</div>
            </td>
            <td class="py-4 px-5 text-slate-300 bg-emerald-500/[0.02]">
              <span class="text-emerald-400 font-semibold">Cupones $\neq$ Reservas ni Operación.</span>
              <div class="text-slate-400 text-[11px] mt-0.5">Ganga no gestiona mesas, no tiene StreetView/360 ni POS. Valida que el comercio paga prepago sin problema.</div>
            </td>
          </tr>

          <tr class="hover:bg-[#12151E]/60 transition-colors">
            <td class="py-4 px-5">
              <div class="font-bold text-white text-sm">La Perla</div>
              <div class="text-[10px] text-amber-400 mt-0.5 font-medium">● Web-App Turística</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              <span class="font-medium text-white">Nueva Esparta</span>
              <div class="text-[10px] text-slate-500 mt-0.5">Foco turista y cruceros</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              Pase Turista con descuentos en aliados + <em>Perla Points</em> acumulables.
            </td>
            <td class="py-4 px-5">
              <span class="font-mono text-white font-semibold">Pase: $15 / $25 / $35</span>
              <div class="text-[10px] text-slate-400 mt-0.5">El turista paga (USD → BCV)</div>
            </td>
            <td class="py-4 px-5 text-slate-300 bg-emerald-500/[0.02]">
              <span class="text-emerald-400 font-semibold">Sin app nativa ni motor de reservas.</span>
              <div class="text-slate-400 text-[11px] mt-0.5">Bookealo entrega pases en Apple/Google Wallet y resuelve la mesa y la cocina del local. Socio potencial de contenido.</div>
            </td>
          </tr>

          <tr class="hover:bg-[#12151E]/60 transition-colors">
            <td class="py-4 px-5">
              <div class="font-bold text-white text-sm">Cariba</div>
              <div class="text-[10px] text-slate-400 mt-0.5 font-medium">● En Stores (Abr-2026)</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              <span class="font-medium text-white">Margarita</span>
              <div class="text-[10px] text-slate-500 mt-0.5">Directorio de planes</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              Mapa "Explorar" para descubrir planes, restaurantes y experiencias.
            </td>
            <td class="py-4 px-5">
              <span class="font-mono text-slate-400 font-semibold">No publicado</span>
              <div class="text-[10px] text-slate-500 mt-0.5">App gratis para el usuario</div>
            </td>
            <td class="py-4 px-5 text-slate-300 bg-emerald-500/[0.02]">
              <span class="text-emerald-400 font-semibold">Tracción cercana a cero.</span>
              <div class="text-slate-400 text-[11px] mt-0.5">Sin motor de reservas funcional, sin tours 360°, sin POS ni hardware. Bookealo sale con stack completo.</div>
            </td>
          </tr>

          <tr class="hover:bg-[#12151E]/60 transition-colors">
            <td class="py-4 px-5">
              <div class="font-bold text-white text-sm">Queda (Queda App)</div>
              <div class="text-[10px] text-slate-400 mt-0.5 font-medium">● Activa Local</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              <span class="font-medium text-white">Margarita / Caracas</span>
              <div class="text-[10px] text-slate-500 mt-0.5">Nightlife & Gastro</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              Intento local de digitalizar la lista de reservas en discotecas y restaurantes.
            </td>
            <td class="py-4 px-5">
              <span class="font-mono text-slate-400 font-semibold">Por comisión / acuerdo</span>
              <div class="text-[10px] text-slate-500 mt-0.5">1-2 comercios verificados</div>
            </td>
            <td class="py-4 px-5 text-slate-300 bg-emerald-500/[0.02]">
              <span class="text-emerald-400 font-semibold">Sin integración con Google Maps.</span>
              <div class="text-slate-400 text-[11px] mt-0.5">Interfaz básica; no tiene tarjetas Wallet, ni realidad aumentada, ni bot de reseñas con IA.</div>
            </td>
          </tr>

          <tr class="hover:bg-[#12151E]/60 transition-colors">
            <td class="py-4 px-5">
              <div class="font-bold text-white text-sm">La M3sa</div>
              <div class="text-[10px] text-slate-400 mt-0.5 font-medium">● Web / Portal</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              <span class="font-medium text-white">Caracas</span>
              <div class="text-[10px] text-slate-500 mt-0.5">Directorio gastronómico</div>
            </td>
            <td class="py-4 px-5 text-slate-300">
              Directorio de restaurantes con botón de solicitud de reserva.
            </td>
            <td class="py-4 px-5">
              <span class="font-mono text-slate-400 font-semibold">SaaS por definir</span>
              <div class="text-[10px] text-slate-500 mt-0.5">Sin app publicada en stores</div>
            </td>
            <td class="py-4 px-5 text-slate-300 bg-emerald-500/[0.02]">
              <span class="text-emerald-400 font-semibold">Falta de inmersión y presencia física.</span>
              <div class="text-slate-400 text-[11px] mt-0.5">Bookealo cuenta con chips NFC en cada mesa, tours 360° en Maps y suite POS Kamra con modo offline.</div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
""" + make_footer() + "</body></html>"

# 3. HTML INFOGRAFÍA UNIFICADA
html_master = COMMON_HEAD + make_cintillo("REPORTE MAESTRO DE POSICIONAMIENTO", "Ecosistema Competitivo Completo: Internacional vs. Nacional vs. Bookealo") + """
    <!-- COMPARATIVA DE NIVELES BOOKEALO VS MERCADO -->
    <div class="grid grid-cols-3 gap-6 mb-8">
      <div class="p-6 rounded-2xl bg-[#0E1017] border border-[#232733]">
        <div class="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">El Extremo Barato</div>
        <div class="text-xl font-bold text-white font-display mb-2">Cuponeras Locales</div>
        <div class="text-xs text-slate-400 leading-relaxed mb-4">Ganga ($5–$10), directorios estáticos. Solo cupones de descuento.</div>
        <div class="text-xs font-semibold text-rose-400">❌ Cero reservas, sin Maps 360°, sin POS, sin fidelización.</div>
      </div>

      <div class="p-6 rounded-2xl bg-[#0E1017] border-2 border-[#D4AF37]/50 shadow-xl shadow-[#D4AF37]/10 relative">
        <div class="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[#D4AF37] text-black font-extrabold text-[10px] uppercase">El Punto Óptimo</div>
        <div class="text-[11px] uppercase tracking-wider text-[#E5C158] font-bold mb-1">Nuestra Propuesta</div>
        <div class="text-2xl font-extrabold text-white font-display mb-2">Bookealo <span class="text-sm font-normal text-slate-400">($40–$100/mes)</span></div>
        <div class="text-xs text-slate-300 leading-relaxed mb-4">Capa inmersiva completa: Google Maps 360° + Reservas en vivo + Pases Wallet + Chips NFC + POS KDS.</div>
        <div class="text-xs font-semibold text-emerald-400">🏆 Tarifa plana, sin comisiones por venta, pagos en Bs / Binance / Zelle.</div>
      </div>

      <div class="p-6 rounded-2xl bg-[#0E1017] border border-[#232733]">
        <div class="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">El Extremo Costoso</div>
        <div class="text-xl font-bold text-white font-display mb-2">Gigantes de EE.UU.</div>
        <div class="text-xs text-slate-400 leading-relaxed mb-4">OpenTable ($249–$499 + comisiones), Resy, SevenRooms.</div>
        <div class="text-xs font-semibold text-rose-400">❌ No operan en VE, cobran comisiones por cubierto y requieren tarjetas foráneas.</div>
      </div>
    </div>

    <!-- 4 PILARES TÁCTICOS -->
    <div class="grid grid-cols-4 gap-4 p-5 rounded-2xl bg-[#12141C] border border-[#232733]">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/20">🌐</div>
        <div>
          <div class="text-xs font-bold text-white">Google Maps 360°</div>
          <div class="text-[10px] text-slate-400">StreetView y tours virtuales</div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/20">💳</div>
        <div>
          <div class="text-xs font-bold text-white">Pases Apple/Google</div>
          <div class="text-[10px] text-slate-400">Fidelización Wallet & Perks</div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg border border-purple-500/20">⚡</div>
        <div>
          <div class="text-xs font-bold text-white">Chips NFC en Mesa</div>
          <div class="text-[10px] text-slate-400">Identificación & pago rápido</div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/20">🖥️</div>
        <div>
          <div class="text-xs font-bold text-white">POS / KDS Kamra</div>
          <div class="text-[10px] text-slate-400">Comandas y modo offline</div>
        </div>
      </div>
    </div>
""" + make_footer() + "</body></html>"

tasks = [
    ("tabla_competidores_internacionales", html_intl, 1500, 720),
    ("tabla_competidores_nacionales", html_nat, 1500, 780),
    ("infografia_competencia_completa", html_master, 1500, 680)
]

for name, html_content, w, h in tasks:
    html_file = os.path.join(DOCS_DIR, f"{name}.html")
    png_file = os.path.join(DOCS_DIR, f"{name}.png")
    
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--window-size={w},{h}",
        "--force-device-scale-factor=2",
        f"--screenshot={png_file}",
        f"file:///{html_file.replace(os.sep, '/')}"
    ]
    res = subprocess.run(cmd, capture_output=True)
    if os.path.exists(png_file):
        print(f"Rendered: {png_file} ({os.path.getsize(png_file)} bytes)")
    else:
        print(f"Failed to render {png_file}: {res.stderr.decode('utf-8', errors='ignore')}")

print("Rendering complete!")
