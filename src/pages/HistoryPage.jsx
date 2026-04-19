import { useEffect, useMemo, useRef, useState } from 'react'
import './HistoryPage.css'

const SLOT_WORDS = ['Gloria', 'Historia', 'Grandeza', 'Legado', 'Champions', 'Eternidad']
const BARREL_WORDS = ['Gloria', 'Historia', 'Grandeza', 'Champions', 'Eternidad', 'Pasion']

const SECTION_LABELS = [
  'Canvas Hero',
  'Split Text',
  'Horizontal Scroll',
  'Marquee',
  'Depth',
  'Ring Stats',
  'Curtain',
  'Specular Tilt',
  'Zoom',
  'Flip Cards',
  'Color Morph',
  'Diagonal Wipe',
  'CRT Glitch',
  'Timeline',
  'Iris Reveal',
  'Kinetic Letters',
  'Video Parallax',
  'Noise CTA',
  'Velocity Skew',
  'SVG Path',
  'Magnetic Buttons',
  'Infinite Tunnel',
  'Typewriter',
  'Pixel Reveal',
  'Barrel Roll',
  'Drag Split',
  'Constellation',
  '3D Orbit',
]

const HISTORY_MEDIA = {
  heroBg: '/media/history/s01/hero_bg_master.jpg',
  heroPlayers: '/media/history/s01/hero_players_cutout.png',
  horizontal: [
    '/media/history/s03/card_01_origin.jpg',
    '/media/history/s03/card_02_bernabeu.jpg',
    '/media/history/s03/card_03_squad.jpg',
    '/media/history/s03/card_04_champions.jpg',
    '/media/history/s03/card_05_fans.jpg',
    '/media/history/s03/card_06_store.jpg',
  ],
  curtain: [
    '/media/history/s07/curtain_01_foundation.jpg',
    '/media/history/s07/curtain_02_stadium.jpg',
    '/media/history/s07/curtain_03_europe.jpg',
  ],
  tilt: '/media/history/s08/tilt_editorial.jpg',
  zoom: [
    '/media/history/s09/zoom_01_beginning.jpg',
    '/media/history/s09/zoom_02_bernabeu.jpg',
    '/media/history/s09/zoom_03_new_era.jpg',
  ],
  timeline: [
    '/media/history/s14/timeline_1902.jpg',
    '/media/history/s14/timeline_1956.jpg',
    '/media/history/s14/timeline_1986.jpg',
    '/media/history/s14/timeline_2000.jpg',
    '/media/history/s14/timeline_2014.jpg',
    '/media/history/s14/timeline_2024.jpg',
  ],
  iris: [
    '/media/history/s15/iris_goalkeeper.jpg',
    '/media/history/s15/iris_midfield.jpg',
    '/media/history/s15/iris_attack.jpg',
  ],
  video: '/media/history/s17/video_cover_master.jpg',
  splitBefore: '/media/history/s26/split_before.jpg',
  splitAfter: '/media/history/s26/split_after.jpg',
}

const HS_CARDS = [
  {
    roman: 'I',
    bgLabel: '1902',
    tag: 'Historia · Heritage',
    title: ['El Origen de', 'una Leyenda'],
    text: '1902. El inicio de la historia más grande del fútbol europeo.',
    image: HISTORY_MEDIA.horizontal[0],
  },
  {
    roman: 'II',
    bgLabel: 'B',
    tag: 'Estadio · Bernabeu',
    title: ['La Catedral', 'del Futbol'],
    text: 'Arquitectura, ritual y atmósfera en el estadio que empuja cada noche.',
    image: HISTORY_MEDIA.horizontal[1],
  },
  {
    roman: 'III',
    bgLabel: 'XI',
    tag: 'Plantilla · Generaciones',
    title: ['Los Mejores', 'del Mundo'],
    text: 'Leyendas, líderes y una nueva generación escribiendo la siguiente era.',
    image: HISTORY_MEDIA.horizontal[2],
  },
  {
    roman: 'IV',
    bgLabel: 'XV',
    tag: 'Palmares · Europa',
    title: ['Quince Copas', 'de Europa'],
    text: 'La colección continental más grande del fútbol convertida en cultura.',
    image: HISTORY_MEDIA.horizontal[3],
  },
  {
    roman: 'V',
    bgLabel: 'LIVE',
    tag: 'Aficion · Experiencia',
    title: ['Vive la', 'Magia'],
    text: 'Un madridismo global conectado en tiempo real al ritmo del Bernabeu.',
    image: HISTORY_MEDIA.horizontal[4],
  },
  {
    roman: 'VI',
    bgLabel: 'SHOP',
    tag: 'Tienda · Store Oficial',
    title: ['Viste los', 'Colores'],
    text: 'Colecciones, identidad y producto oficial reunidos en una pagina mas limpia y centrada en el club.',
    image: HISTORY_MEDIA.horizontal[5],
  },
]

const CURTAIN_ITEMS = [
  {
    tag: 'Fundacion · 1902',
    name: 'El Comienzo\nde Todo',
    image: HISTORY_MEDIA.curtain[0],
    sub: 'Los primeros pasos de una institucion historica y una ambicion que nunca se conformo con competir.',
  },
  {
    tag: 'Bernabeu · Presente',
    name: 'La Nueva\nCatedral',
    image: HISTORY_MEDIA.curtain[1],
    sub: 'El estadio del futuro convertido en escenario, tecnologia, ciudad y ritual madridista.',
  },
  {
    tag: 'Europa · Gloria',
    name: 'La Cima\nde Europa',
    image: HISTORY_MEDIA.curtain[2],
    sub: '15 Champions. La coleccion mas poderosa del continente entendida como cultura competitiva.',
  },
]

const MARQUEE_ROWS = [
  [
    { text: 'Real Madrid', variant: 'default' },
    { text: 'Champions', variant: 'out' },
    { text: 'Hala Madrid', variant: 'default' },
    { text: 'Campeones', variant: 'out' },
  ],
  [
    { text: 'La Liga', variant: 'sm' },
    { text: '·', variant: 'sep' },
    { text: 'Champions League', variant: 'sm' },
    { text: '·', variant: 'sep' },
    { text: 'Copa del Rey', variant: 'sm' },
    { text: '·', variant: 'sep' },
    { text: 'Supercopa', variant: 'sm' },
    { text: '·', variant: 'sep' },
    { text: 'Mundial de Clubes', variant: 'sm' },
  ],
  [
    { text: 'El Mejor Club', variant: 'default' },
    { text: 'del Mundo', variant: 'out' },
    { text: '1902', variant: 'default' },
    { text: 'Madrid', variant: 'out' },
  ],
  [
    { text: 'Di Stefano', variant: 'micro' },
    { text: '·', variant: 'sep' },
    { text: 'Raul', variant: 'micro' },
    { text: '·', variant: 'sep' },
    { text: 'Zidane', variant: 'micro' },
    { text: '·', variant: 'sep' },
    { text: 'Ramos', variant: 'micro' },
    { text: '·', variant: 'sep' },
    { text: 'Modric', variant: 'micro' },
    { text: '·', variant: 'sep' },
    { text: 'Vinicius', variant: 'micro' },
  ],
]

const STATS_ITEMS = [
  {
    value: 15,
    suffix: '+',
    label: 'Champions League',
    desc: 'El liston europeo',
    progress: 0.78,
  },
  {
    value: 36,
    suffix: '',
    label: 'Ligas de Espana',
    desc: 'Dominio domestico',
    progress: 0.72,
  },
  {
    value: 8,
    suffix: '',
    label: 'Mundiales de Clubes',
    desc: 'Huella global',
    progress: 0.66,
  },
  {
    value: 85,
    suffix: 'K',
    label: 'Aforo Bernabeu',
    desc: 'La noche se amplifica',
    progress: 0.82,
  },
  {
    value: 500,
    suffix: 'M',
    label: 'Seguidores',
    desc: 'Comunidad mundial',
    progress: 0.84,
  },
  {
    value: 120,
    suffix: '+',
    label: 'Titulos Totales',
    desc: 'Legado competitivo',
    progress: 0.88,
  },
]

const FLIP_ITEMS = [
  {
    num: '01',
    title: 'Noticias',
    tag: 'Contenido',
    body: 'Actualidad, ruedas de prensa y contenido del club integrados en una pagina clara y bien jerarquizada.',
  },
  {
    num: '02',
    title: 'Partidos',
    tag: 'Calendario',
    body: 'Proximos encuentros, resultados y ritmo competitivo ordenados para consumirlos con un vistazo.',
  },
  {
    num: '03',
    title: 'Plantilla',
    tag: 'Equipo',
    body: 'Perfiles, momentos de forma y piezas visuales de la plantilla dentro de una lectura mas precisa de la temporada.',
  },
  {
    num: '04',
    title: 'Historia',
    tag: 'Legado',
    body: 'Cronologia, epocas y trofeos construidos como una experiencia de marca y no solo como un archivo.',
  },
  {
    num: '05',
    title: 'RM TV',
    tag: 'Streaming',
    body: 'Documentales, entrevistas y directos organizados como una parrilla audiovisual con identidad propia.',
  },
  {
    num: '06',
    title: 'Fundacion',
    tag: 'Social',
    body: 'Proyectos educativos, inclusivos y solidarios para mostrar la dimension humana del club.',
  },
]

const DIAGONAL_BLOCKS = [
  {
    className: 'hz-diag-block hz-diag-block--one',
    number: '25-26',
    label: 'Temporada · 2025-26',
    title: ['La Temporada', 'de los Campeones'],
    text: 'Una lectura mas completa de la temporada, con espacio para contexto, objetivos y grandes citas.',
  },
  {
    className: 'hz-diag-block hz-diag-block--two',
    number: '85K',
    label: 'Bernabeu · Matchday',
    title: ['Tu Estadio', 'Te Espera'],
    text: 'CTA principal de experiencia en estadio pensado para entradas, hospitality y dias grandes en casa.',
  },
  {
    className: 'hz-diag-block hz-diag-block--three',
    number: '∞',
    label: 'Madridista · Membership',
    title: ['Hazte', 'Madridista'],
    text: 'Un bloque de conversion claro para membresia, ventajas exclusivas y comunidad global.',
  },
]

const ZOOM_STAGES = [
  {
    act: '· Acto I ·',
    titleLead: 'La ',
    titleAccent: 'Historia',
    titleTail: '',
    titleBottom: 'Comienza',
    text: '1902 — Madrid, España. Nace el club que convertiría la ambición en tradición.',
    image: HISTORY_MEDIA.zoom[0],
  },
  {
    act: '· Acto II ·',
    titleLead: 'El ',
    titleAccent: 'Bernabeu',
    titleTail: '',
    titleBottom: 'Respira',
    text: 'La casa blanca se transforma en arquitectura, espectáculo y noche europea.',
    image: HISTORY_MEDIA.zoom[1],
  },
  {
    act: '· Acto III ·',
    titleLead: 'La nueva ',
    titleAccent: 'era',
    titleTail: '',
    titleBottom: 'Continua',
    text: 'Talento, imagen y exigencia competitiva en una narrativa que sigue abierta.',
    image: HISTORY_MEDIA.zoom[2],
  },
]

const TIMELINE = [
  {
    year: '1902',
    chapter: '· Capitulo I ·',
    title: ['Fundacion', 'del Club'],
    text: 'El Real Madrid Club de Fútbol nace en Madrid el 6 de marzo de 1902. Empieza una historia pensada para competir, ganar y perdurar.',
    image: HISTORY_MEDIA.timeline[0],
  },
  {
    year: '1956',
    chapter: '· Capitulo II ·',
    title: ['Primera Copa', 'de Europa'],
    text: 'Di Stéfano lidera la primera Copa de Europa. No fue un título aislado: fue el comienzo de una hegemonía continental sin precedentes.',
    image: HISTORY_MEDIA.timeline[1],
  },
  {
    year: '1986',
    chapter: '· Capitulo III ·',
    title: ['La Quinta', 'del Buitre'],
    text: 'Una generación irrepetible redefine la época. Técnica, carácter y varias ligas consecutivas consolidan un nuevo ciclo blanco.',
    image: HISTORY_MEDIA.timeline[2],
  },
  {
    year: '2000',
    chapter: '· Capitulo IV ·',
    title: ['Los', 'Galacticos'],
    text: 'Zidane, Figo, Roberto Carlos, Beckham o Ronaldo convierten al club en un símbolo cultural global además de deportivo.',
    image: HISTORY_MEDIA.timeline[3],
  },
  {
    year: '2014',
    chapter: '· Capitulo V ·',
    title: ['La Decima', 'llego'],
    text: 'Lisboa cambia la narrativa moderna. La Décima fue emoción, liberación y la prueba definitiva de que el Madrid nunca desaparece.',
    image: HISTORY_MEDIA.timeline[4],
  },
  {
    year: '2024',
    chapter: '· Capitulo VI ·',
    title: ['La', 'Decimoquinta'],
    text: 'La excelencia se vuelve costumbre. Otra generación vuelve a reinar en Europa y extiende un legado que parece no tener techo.',
    image: HISTORY_MEDIA.timeline[5],
  },
]

const IRIS_ITEMS = [
  {
    eyebrow: 'Perfil I',
    title: 'Porteria',
    subtitle: 'Control del area',
    detail: 'Reflejos, mando y juego aereo',
    image: HISTORY_MEDIA.iris[0],
  },
  {
    eyebrow: 'Perfil II',
    title: 'Mediocampo',
    subtitle: 'Ritmo y lectura',
    detail: 'Pausa, pase y gobierno del partido',
    image: HISTORY_MEDIA.iris[1],
  },
  {
    eyebrow: 'Perfil III',
    title: 'Ataque',
    subtitle: 'Desborde y gol',
    detail: 'Velocidad, desequilibrio y definicion',
    image: HISTORY_MEDIA.iris[2],
  },
]

const MAGNETIC_ITEMS = [
  { code: 'XV', title: 'Palmares', sub: '120+ titulos oficiales' },
  { code: 'XI', title: 'Plantilla', sub: 'Primer equipo 2025-26' },
  { code: 'SB', title: 'Estadio', sub: 'Santiago Bernabeu' },
  { code: 'TKT', title: 'Entradas', sub: 'Proximos partidos' },
  { code: 'KIT', title: 'Tienda', sub: 'Colecciones oficiales' },
  { code: 'TV', title: 'RM Play', sub: 'Directos y documentales' },
]

const ORBIT_RINGS = [
  {
    key: 'a',
    className: 'hz-orbit-ring hz-orbit-ring--a',
    items: [
      {
        title: 'Decimoquinta',
        image: HISTORY_MEDIA.horizontal[3],
        angle: '-6deg',
        size: 'is-lg',
      },
      {
        title: 'Aficion',
        image: HISTORY_MEDIA.horizontal[4],
        angle: '118deg',
        size: 'is-md',
      },
      {
        title: 'Bernabeu',
        image: HISTORY_MEDIA.curtain[1],
        angle: '238deg',
        size: 'is-md',
      },
    ],
  },
  {
    key: 'b',
    className: 'hz-orbit-ring hz-orbit-ring--b',
    items: [
      {
        title: 'Plantilla',
        image: HISTORY_MEDIA.horizontal[2],
        angle: '42deg',
        size: 'is-md',
      },
      {
        title: 'Entrenamiento',
        image: HISTORY_MEDIA.zoom[0],
        angle: '202deg',
        size: 'is-sm',
      },
      {
        title: 'Trofeo',
        image: HISTORY_MEDIA.timeline[5],
        angle: '314deg',
        size: 'is-sm',
      },
    ],
  },
  {
    key: 'c',
    className: 'hz-orbit-ring hz-orbit-ring--c',
    items: [
      {
        title: 'Bellingham',
        image: HISTORY_MEDIA.tilt,
        angle: '82deg',
        size: 'is-sm',
      },
      {
        title: 'Presidente',
        image: HISTORY_MEDIA.zoom[2],
        angle: '262deg',
        size: 'is-sm',
      },
    ],
  },
]

const ARC_CIRCUMFERENCE = 251.327

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function splitRow(text, rowIndex) {
  let order = 0
  return text.split(' ').map((word, wordIndex) => {
    const chars = [...word].map((char, charIndex) => {
      order += 1
      const direction = (rowIndex + wordIndex + charIndex) % 2 === 0 ? 'from-left' : 'from-right'
      return (
        <span
          key={`${word}-${wordIndex}-${charIndex}`}
          className={`hz-split-char ${direction}`}
          style={{ '--d': `${order * 28}ms` }}
        >
          {char}
        </span>
      )
    })

    return (
      <span key={`${word}-${wordIndex}`} className="hz-split-word">
        {chars}
        <span className="hz-split-space" aria-hidden="true">
          &nbsp;
        </span>
      </span>
    )
  })
}

function buildPoints(count, spread = 1) {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0012 * spread,
    vy: (Math.random() - 0.5) * 0.0012 * spread,
  }))
}

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const GLITCH_WORDS = ['GLORY', 'HISTORIA', 'CAMPEON', 'LEYENDA', 'ETERNIDAD']

function getKineticStep() {
  if (typeof window === 'undefined') return 44
  return clamp(window.innerWidth * 0.055, 18, 56)
}

export function HistoryPage() {
  const rootRef = useRef(null)
  const s01Ref = useRef(null)
  const s03Ref = useRef(null)
  const s03StickyRef = useRef(null)
  const s03TrackRef = useRef(null)
  const s05Ref = useRef(null)
  const s09Ref = useRef(null)
  const s14Ref = useRef(null)
  const s14StickyRef = useRef(null)
  const s14TrackRef = useRef(null)
  const s16Ref = useRef(null)
  const s17Ref = useRef(null)
  const s19Ref = useRef(null)
  const splitRef = useRef(null)
  const progressFillRef = useRef(null)
  const heroCanvasRef = useRef(null)
  const constellationCanvasRef = useRef(null)
  const dragRef = useRef(null)

  const [splitVisible, setSplitVisible] = useState(false)
  const [activeHs, setActiveHs] = useState(0)
  const [activeZoom, setActiveZoom] = useState(0)
  const [activeTimeline, setActiveTimeline] = useState(0)
  const [slotIndex, setSlotIndex] = useState(0)
  const [barrelIndex, setBarrelIndex] = useState(0)
  const [splitPercent, setSplitPercent] = useState(50)
  const [glitchText, setGlitchText] = useState('GLORY')
  const [heroCharsVisible, setHeroCharsVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [statValues, setStatValues] = useState(() => STATS_ITEMS.map(() => 0))
  const [s16Snapped, setS16Snapped] = useState(false)
  const [kineticStep, setKineticStep] = useState(getKineticStep)

  const hsIndexRef = useRef(0)
  const zoomIndexRef = useRef(0)
  const timelineIndexRef = useRef(0)
  const s16SnapRef = useRef(false)
  const draggingRef = useRef(false)

  const kineticLetters = useMemo(
    () => {
      const startMap = [
        { x: '-42vw', y: '-30vh', scale: 1.46, rotate: -32, opacity: 0.22 },
        { x: '24vw', y: '-34vh', scale: 0.94, rotate: 18, opacity: 0.16 },
        { x: '-28vw', y: '14vh', scale: 1.18, rotate: -26, opacity: 0.18 },
        { x: '38vw', y: '18vh', scale: 1.34, rotate: 22, opacity: 0.16 },
        { x: '-10vw', y: '28vh', scale: 0.4, rotate: 0, opacity: 0 },
        { x: '-46vw', y: '0vh', scale: 1.6, rotate: -18, opacity: 0.17 },
        { x: '18vw', y: '30vh', scale: 1.06, rotate: 26, opacity: 0.16 },
        { x: '44vw', y: '-8vh', scale: 1.28, rotate: 16, opacity: 0.2 },
        { x: '-18vw', y: '-8vh', scale: 0.92, rotate: -24, opacity: 0.2 },
        { x: '10vw', y: '-24vh', scale: 0.8, rotate: 28, opacity: 0.15 },
        { x: '46vw', y: '26vh', scale: 1.42, rotate: -12, opacity: 0.18 },
      ]
      const offsets = [-5.5, -4.5, -3.5, -2.5, -1.1, 0.5, 1.5, 2.5, 3.5, 4.5, 5.5]

      return 'HALA MADRID'.split('').map((char, index) => ({
        id: `kinetic-${index}`,
        char,
        offset: offsets[index],
        ...startMap[index],
      }))
    },
    [],
  )

  useEffect(() => {
    function handleResize() {
      setKineticStep(getKineticStep())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const splitNode = splitRef.current
    if (!splitNode) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSplitVisible(true)
        }
      },
      { threshold: 0.34 },
    )

    observer.observe(splitNode)
    return () => observer.disconnect()
  }, [])

  /* ── Hero char entrance ── */
  useEffect(() => {
    const timer = setTimeout(() => setHeroCharsVisible(true), 400)
    return () => clearTimeout(timer)
  }, [])

  /* ── Section reveal observer (universal) ── */
  useEffect(() => {
    const sections = rootRef.current?.querySelectorAll('.hz-section')
    if (!sections?.length) return undefined

    function markVisibleNow() {
      const vh = window.innerHeight || 1
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top < vh * 0.92 && rect.bottom > vh * 0.08) {
          section.setAttribute('data-revealed', 'true')
        }
      })
    }

    markVisibleNow()

    if (typeof window.IntersectionObserver !== 'function') {
      sections.forEach((section) => section.setAttribute('data-revealed', 'true'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', 'true')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    )

    sections.forEach((section) => observer.observe(section))
    window.addEventListener('resize', markVisibleNow)

    return () => {
      window.removeEventListener('resize', markVisibleNow)
      observer.disconnect()
    }
  }, [])

  /* ── Stats counter animation ── */
  useEffect(() => {
    if (!statsVisible) return undefined
    const TARGETS = STATS_ITEMS.map((item) => item.value)
    const DURATION = 2200
    const t0 = performance.now()
    let rafId = 0

    function tick() {
      const elapsed = performance.now() - t0
      const progress = clamp(elapsed / DURATION, 0, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setStatValues(TARGETS.map((target) => Math.round(target * ease)))
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [statsVisible])

  /* ── Stats IntersectionObserver ── */
  useEffect(() => {
    const statsSection = document.getElementById('s06')
    if (!statsSection) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true)
      },
      { threshold: 0.35 },
    )
    observer.observe(statsSection)
    return () => observer.disconnect()
  }, [])

  /* ── Glitch text cycling ── */
  useEffect(() => {
    let wordIndex = 0
    const cycleTimer = window.setInterval(() => {
      wordIndex = (wordIndex + 1) % GLITCH_WORDS.length
      const targetWord = GLITCH_WORDS[wordIndex]
      let iteration = 0
      const scrambleTimer = window.setInterval(() => {
        const scrambled = targetWord
          .split('')
          .map((char, i) =>
            i < iteration
              ? char
              : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)],
          )
          .join('')
        setGlitchText(scrambled)
        if (iteration >= targetWord.length) {
          window.clearInterval(scrambleTimer)
          setGlitchText(targetWord)
        }
        iteration += 0.3
      }, 40)
    }, 3500)

    return () => window.clearInterval(cycleTimer)
  }, [])

  useEffect(() => {
    const slotTimer = window.setInterval(() => {
      setSlotIndex((value) => (value + 1) % SLOT_WORDS.length)
    }, 2400)

    const barrelTimer = window.setInterval(() => {
      setBarrelIndex((value) => (value + 1) % BARREL_WORDS.length)
    }, 1800)

    return () => {
      window.clearInterval(slotTimer)
      window.clearInterval(barrelTimer)
    }
  }, [])

  useEffect(() => {
    const rootNode = rootRef.current
    const sectionS03 = s03Ref.current
    const stickyS03 = s03StickyRef.current
    const trackS03 = s03TrackRef.current
    const sectionS05 = s05Ref.current
    const sectionS09 = s09Ref.current
    const sectionS14 = s14Ref.current
    const stickyS14 = s14StickyRef.current
    const trackS14 = s14TrackRef.current
    const sectionS16 = s16Ref.current
    const sectionS17 = s17Ref.current
    const sectionS19 = s19Ref.current

    if (
      !rootNode ||
      !sectionS03 ||
      !stickyS03 ||
      !trackS03 ||
      !sectionS05 ||
      !sectionS09 ||
      !sectionS14 ||
      !stickyS14 ||
      !trackS14 ||
      !sectionS16 ||
      !sectionS17 ||
      !sectionS19
    ) {
      return undefined
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileQuery = window.matchMedia('(max-width: 1024px)')

    let reducedMotion = reducedMotionQuery.matches
    let isMobile = mobileQuery.matches
    let rafId = 0
    let queued = false
    let resizeObserver

    function setVar(name, value) {
      rootNode.style.setProperty(name, value)
    }

    function getSectionProgress(node) {
      const rect = node.getBoundingClientRect()
      const vh = window.innerHeight || 1
      return clamp((vh - rect.top) / Math.max(rect.height + vh, 1), 0, 1)
    }

    function getStickyProgress(node) {
      const rect = node.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const distance = Math.max(rect.height - vh, 1)
      return clamp(-rect.top / distance, 0, 1)
    }

    function syncStickyDurations() {
      const vh = window.innerHeight || 1

      if (!isMobile) {
        const hsTravel = Math.max(trackS03.scrollWidth - stickyS03.clientWidth, 0)
        const hsMinHeight = Math.max(vh * 5.2, vh + hsTravel * 1.55)
        sectionS03.style.minHeight = `${Math.round(hsMinHeight)}px`

        const timelineTravel = Math.max(trackS14.scrollWidth - stickyS14.clientWidth, 0)
        const timelineMinHeight = Math.max(vh * 6.2, vh + timelineTravel * 1.18)
        sectionS14.style.minHeight = `${Math.round(timelineMinHeight)}px`
      } else {
        sectionS03.style.minHeight = ''
        sectionS14.style.minHeight = ''
      }

      const depthMinHeight = isMobile ? vh * 1.55 : vh * 2.35
      const zoomMinHeight = isMobile ? vh * 1.85 : vh * 3.1
      const kineticMinHeight = isMobile ? vh * 2.7 : vh * 3.9
      const videoMinHeight = isMobile ? vh * 2.05 : vh * 2.9

      sectionS05.style.minHeight = `${Math.round(depthMinHeight)}px`
      sectionS09.style.minHeight = `${Math.round(zoomMinHeight)}px`
      sectionS16.style.minHeight = `${Math.round(kineticMinHeight)}px`
      sectionS17.style.minHeight = `${Math.round(videoMinHeight)}px`
    }

    function update() {
      queued = false

      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const nextPageProgress = clamp((window.scrollY / Math.max(docHeight, 1)) * 100, 0, 100)
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${nextPageProgress}%`
      }

      if (reducedMotion) {
        setVar('--hz-s01-progress', '0')
        setVar('--hz-s03-progress', '0')
        setVar('--hz-s05-progress', '0')
        setVar('--hz-s09-progress', '0')
        setVar('--hz-s14-progress', '0')
        setVar('--hz-s16-progress', '0')
        setVar('--hz-s16-snap', '1')
        setVar('--hz-s17-progress', '0')
        setVar('--hz-s19-progress', '0')
        if (!s16SnapRef.current) {
          s16SnapRef.current = true
          setS16Snapped(true)
        }
        trackS03.style.transform = 'translate3d(0,0,0)'
        trackS14.style.transform = 'translate3d(0,0,0)'
        return
      }

      const s01Progress = getSectionProgress(s01Ref.current)
      const s03Progress = getStickyProgress(sectionS03)
      const s05Progress = getStickyProgress(sectionS05)
      const s09Progress = getStickyProgress(sectionS09)
      const s14Progress = getStickyProgress(sectionS14)
      const s16Progress = getStickyProgress(sectionS16)
      const s17Progress = getStickyProgress(sectionS17)
      const s19Progress = getSectionProgress(sectionS19)

      const s03Phase = clamp((s03Progress - 0.02) / 0.96, 0, 1)
      const s05Phase = clamp((s05Progress - 0.03) / 0.94, 0, 1)
      const s09Phase = clamp((s09Progress - 0.07) / 0.86, 0, 1)
      const s14Phase = clamp((s14Progress - 0.04) / 0.92, 0, 1)
      const s16Phase = clamp((s16Progress - 0.06) / 0.88, 0, 1)
      const s16Snap = clamp((s16Phase - 0.08) / 0.74, 0, 1)
      const s17Phase = clamp((s17Progress - 0.08) / 0.84, 0, 1)
      const nextS16Snapped = s16SnapRef.current ? s16Snap > 0.02 : s16Snap > 0.06

      setVar('--hz-s01-progress', s01Progress.toFixed(4))
      setVar('--hz-s03-progress', s03Phase.toFixed(4))
      setVar('--hz-s05-progress', s05Phase.toFixed(4))
      setVar('--hz-s09-progress', s09Phase.toFixed(4))
      setVar('--hz-s14-progress', s14Phase.toFixed(4))
      setVar('--hz-s16-progress', s16Phase.toFixed(4))
      setVar('--hz-s16-snap', s16Snap.toFixed(4))
      setVar('--hz-s17-progress', s17Phase.toFixed(4))
      setVar('--hz-s19-progress', s19Progress.toFixed(4))

      if (nextS16Snapped !== s16SnapRef.current) {
        s16SnapRef.current = nextS16Snapped
        setS16Snapped(nextS16Snapped)
      }

      if (!isMobile) {
        const hsTravel = Math.max(trackS03.scrollWidth - stickyS03.clientWidth, 0)
        trackS03.style.transform = `translate3d(${(-hsTravel * s03Phase).toFixed(2)}px,0,0)`

        const timelineTravel = Math.max(trackS14.scrollWidth - stickyS14.clientWidth, 0)
        trackS14.style.transform = `translate3d(${(-timelineTravel * s14Phase).toFixed(2)}px,0,0)`
      } else {
        trackS03.style.transform = 'translate3d(0,0,0)'
        trackS14.style.transform = 'translate3d(0,0,0)'
      }

      const nextHs = isMobile
        ? 0
        : Math.min(HS_CARDS.length - 1, Math.floor(s03Phase * HS_CARDS.length))
      if (nextHs !== hsIndexRef.current) {
        hsIndexRef.current = nextHs
        setActiveHs(nextHs)
      }

      const nextZoom = s09Phase < 0.34 ? 0 : s09Phase < 0.68 ? 1 : 2
      if (nextZoom !== zoomIndexRef.current) {
        zoomIndexRef.current = nextZoom
        setActiveZoom(nextZoom)
      }

      const nextTimeline = isMobile
        ? 0
        : Math.min(TIMELINE.length - 1, Math.floor(s14Phase * TIMELINE.length))
      if (nextTimeline !== timelineIndexRef.current) {
        timelineIndexRef.current = nextTimeline
        setActiveTimeline(nextTimeline)
      }
    }

    function schedule() {
      if (queued) return
      queued = true
      rafId = window.requestAnimationFrame(update)
    }

    function handleMedia() {
      reducedMotion = reducedMotionQuery.matches
      isMobile = mobileQuery.matches
      syncStickyDurations()
      schedule()
    }

    syncStickyDurations()
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', handleMedia)

    if (typeof window.ResizeObserver === 'function') {
      resizeObserver = new window.ResizeObserver(() => {
        syncStickyDurations()
        schedule()
      })
      resizeObserver.observe(trackS03)
      resizeObserver.observe(stickyS03)
      resizeObserver.observe(trackS14)
      resizeObserver.observe(stickyS14)
    }

    if (typeof reducedMotionQuery.addEventListener === 'function') {
      reducedMotionQuery.addEventListener('change', handleMedia)
      mobileQuery.addEventListener('change', handleMedia)
    } else {
      reducedMotionQuery.addListener(handleMedia)
      mobileQuery.addListener(handleMedia)
    }

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', handleMedia)
      if (typeof reducedMotionQuery.removeEventListener === 'function') {
        reducedMotionQuery.removeEventListener('change', handleMedia)
        mobileQuery.removeEventListener('change', handleMedia)
      } else {
        reducedMotionQuery.removeListener(handleMedia)
        mobileQuery.removeListener(handleMedia)
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    const heroCanvas = heroCanvasRef.current
    const constellationCanvas = constellationCanvasRef.current
    if (!heroCanvas || !constellationCanvas) return undefined

    const heroCtx = heroCanvas.getContext('2d')
    const consCtx = constellationCanvas.getContext('2d')
    if (!heroCtx || !consCtx) return undefined

    const heroPoints = buildPoints(72, 1)
    const consPoints = buildPoints(96, 1.3)

    let heroWidth = 0
    let heroHeight = 0
    let consWidth = 0
    let consHeight = 0
    let rafId = 0

    function resizeCanvas(canvas, type) {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(rect.width * ratio))
      canvas.height = Math.max(1, Math.floor(rect.height * ratio))
      const ctx = type === 'hero' ? heroCtx : consCtx
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      if (type === 'hero') {
        heroWidth = rect.width
        heroHeight = rect.height
      } else {
        consWidth = rect.width
        consHeight = rect.height
      }
    }

    function movePoints(points) {
      points.forEach((point) => {
        point.x += point.vx
        point.y += point.vy

        if (point.x < 0 || point.x > 1) point.vx *= -1
        if (point.y < 0 || point.y > 1) point.vy *= -1

        point.x = clamp(point.x, 0, 1)
        point.y = clamp(point.y, 0, 1)
      })
    }

    function drawConstellation(ctx, points, width, height, nodeRadius, lineAlpha) {
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < points.length; i += 1) {
        const a = points[i]
        const ax = a.x * width
        const ay = a.y * height
        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j]
          const bx = b.x * width
          const by = b.y * height
          const dx = ax - bx
          const dy = ay - by
          const dist = Math.hypot(dx, dy)
          if (dist < 110) {
            const alpha = (1 - dist / 110) * lineAlpha
            ctx.strokeStyle = `rgba(112, 176, 255, ${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(ax, ay)
            ctx.lineTo(bx, by)
            ctx.stroke()
          }
        }

        ctx.beginPath()
        ctx.arc(ax, ay, nodeRadius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(176, 219, 255, 0.88)'
        ctx.fill()
      }
    }

    function frame() {
      movePoints(heroPoints)
      movePoints(consPoints)

      drawConstellation(heroCtx, heroPoints, heroWidth, heroHeight, 1.7, 0.34)
      drawConstellation(consCtx, consPoints, consWidth, consHeight, 1.9, 0.42)

      rafId = window.requestAnimationFrame(frame)
    }

    resizeCanvas(heroCanvas, 'hero')
    resizeCanvas(constellationCanvas, 'constellation')
    frame()

    function onResize() {
      resizeCanvas(heroCanvas, 'hero')
      resizeCanvas(constellationCanvas, 'constellation')
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    function handlePointerMove(event) {
      if (!draggingRef.current || !dragRef.current) return
      const rect = dragRef.current.getBoundingClientRect()
      const ratio = (event.clientX - rect.left) / Math.max(rect.width, 1)
      setSplitPercent(clamp(ratio * 100, 5, 95))
    }

    function handlePointerUp() {
      draggingRef.current = false
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  function onMagneticMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    const gx = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100
    const gy = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100
    event.currentTarget.style.setProperty('--mx', `${dx * 0.14}px`)
    event.currentTarget.style.setProperty('--my', `${dy * 0.14}px`)
    event.currentTarget.style.setProperty('--gx', `${gx.toFixed(2)}%`)
    event.currentTarget.style.setProperty('--gy', `${gy.toFixed(2)}%`)
  }

  function onMagneticLeave(event) {
    event.currentTarget.style.setProperty('--mx', '0px')
    event.currentTarget.style.setProperty('--my', '0px')
    event.currentTarget.style.setProperty('--gx', '50%')
    event.currentTarget.style.setProperty('--gy', '50%')
  }

  function onTiltMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / Math.max(rect.width, 1)
    const py = (event.clientY - rect.top) / Math.max(rect.height, 1)
    const rotateX = (0.5 - py) * 14
    const rotateY = (px - 0.5) * 18
    event.currentTarget.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`)
    event.currentTarget.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`)
    event.currentTarget.style.setProperty('--gx', `${(px * 100).toFixed(2)}%`)
    event.currentTarget.style.setProperty('--gy', `${(py * 100).toFixed(2)}%`)
  }

  function onTiltLeave(event) {
    event.currentTarget.style.setProperty('--rx', '5deg')
    event.currentTarget.style.setProperty('--ry', '-8deg')
    event.currentTarget.style.setProperty('--gx', '30%')
    event.currentTarget.style.setProperty('--gy', '24%')
  }

  return (
    <div className="hz-page" ref={rootRef}>
      <div className="hz-progress" aria-hidden="true">
        <span ref={progressFillRef} />
      </div>

      <section id="s01" ref={s01Ref} className="hz-section hz-s01">
        <div className="hz-badge">
          <span>01</span> {SECTION_LABELS[0]}
        </div>
        <img
          className="hz-s01-bg-img"
          src={HISTORY_MEDIA.heroBg}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hz-s01-veil" aria-hidden="true" />
        <div className="hz-s01-halo hz-s01-halo--left" aria-hidden="true" />
        <div className="hz-s01-halo hz-s01-halo--right" aria-hidden="true" />
        <canvas ref={heroCanvasRef} className="hz-hero-canvas" />
        <div className="hz-s01-back">HALA MADRID</div>
        <h1 className={`hz-s01-title ${heroCharsVisible ? 'is-chars-visible' : ''}`}>
          {'REAL'.split('').map((char, i) => (
            <span key={`r-${i}`} className="hz-hero-char" style={{ '--ci': i }}>{char}</span>
          ))}
          <em>La leyenda eterna</em>
          {'MADRID'.split('').map((char, i) => (
            <span key={`m-${i}`} className="hz-hero-char" style={{ '--ci': i + 5 }}>{char}</span>
          ))}
        </h1>
        <img
          className="hz-s01-players-img"
          src={HISTORY_MEDIA.heroPlayers}
          alt="Jugadores del Real Madrid"
          decoding="async"
        />
        <div className="hz-s01-stats">
          <p>
            <strong>15</strong> Champions
          </p>
          <p>
            <strong>36</strong> Ligas
          </p>
          <p>
            <strong>1902</strong> Fundacion
          </p>
          <p>
            <strong>8</strong> Mundiales
          </p>
        </div>
        <div className="hz-hero-scroll">
          <span>Scroll</span>
          <div className="hz-scroll-line" />
        </div>
      </section>

      <section id="s02" ref={splitRef} className={`hz-section hz-s02 ${splitVisible ? 'is-visible' : ''}`}>
        <div className="hz-badge">
          <span>02</span> {SECTION_LABELS[1]}
        </div>
        <div className="hz-split-row">{splitRow('QUINCE COPAS', 0)}</div>
        <div className="hz-split-row is-accent">{splitRow('DE EUROPA', 1)}</div>
        <div className="hz-split-row is-italic">{splitRow('historia en movimiento', 2)}</div>
      </section>

      <section id="s03" ref={s03Ref} className="hz-section hz-s03">
        <div className="hz-badge">
          <span>03</span> {SECTION_LABELS[2]}
        </div>
        <div ref={s03StickyRef} className="hz-s03-sticky">
          <div className="hz-s03-label">Desliza →</div>
          <div ref={s03TrackRef} className="hz-s03-track">
            {HS_CARDS.map((card, index) => (
              <article key={card.roman} className={`hz-hs-card ${activeHs === index ? 'is-active' : ''}`}>
                <div className="hz-hs-card__bg" aria-hidden="true">
                  {card.bgLabel}
                </div>
                <img
                  className="hz-hs-card__img"
                  src={card.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                />
                <div className="hz-hs-card__veil" aria-hidden="true" />
                <div className="hz-hs-card__num" aria-hidden="true">
                  {card.roman}
                </div>
                <div className="hz-hs-card__content">
                  <small>{card.tag}</small>
                  <h2>
                    {card.title.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h2>
                  <p>{card.text}</p>
                </div>
                <div className="hz-hs-card__bar" aria-hidden="true" />
                <div className="hz-hs-card__arrow" aria-hidden="true">
                  ↗
                </div>
              </article>
            ))}
          </div>
          <div className="hz-s03-progress" aria-hidden="true">
            <span />
          </div>
          <div className="hz-s03-dots">
            {HS_CARDS.map((card, index) => (
              <span key={card.roman} className={activeHs === index ? 'is-active' : ''} />
            ))}
          </div>
        </div>
      </section>

      <section id="s04" className="hz-section hz-s04" aria-hidden="true">
        <div className="hz-badge dark">
          <span>04</span> {SECTION_LABELS[3]}
        </div>
        {MARQUEE_ROWS.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="hz-marquee-row">
            <div className={`hz-marquee-track ${rowIndex % 2 ? 'is-reverse' : ''}`}>
              {row.concat(row).map((item, index) => (
                <span
                  key={`${item.text}-${rowIndex}-${index}`}
                  className={`hz-marquee-item hz-marquee-item--${item.variant}`}
                >
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section id="s05" ref={s05Ref} className="hz-section hz-s05">
        <div className="hz-badge">
          <span>05</span> {SECTION_LABELS[4]}
        </div>
        <div className="hz-s05-sticky">
          <div className="hz-depth-plane hz-depth-plane--ghost">
            <div className="hz-depth-outline">XV</div>
          </div>
          <div className="hz-depth-plane hz-depth-plane--rings">
            <div className="hz-depth-rings">
              <span />
              <span />
              <span />
              <div className="hz-depth-rings-label">Real Madrid CF</div>
            </div>
          </div>
          <div className="hz-depth-plane hz-depth-plane--number">
            <div className="hz-depth-number">15</div>
          </div>
          <div className="hz-depth-plane hz-depth-plane--label">
            <div className="hz-depth-label">Champions League</div>
          </div>
          <div className="hz-depth-plane hz-depth-plane--quote">
            <div className="hz-depth-quote">&quot;La mayor conquista del futbol europeo&quot;</div>
          </div>
          <div className="hz-depth-plane hz-depth-plane--particles" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => (
              <span
                key={`depth-p-${index}`}
                style={{
                  '--i': index,
                  '--x': `${((index * 11) % 88) + 4}%`,
                  '--y': `${((index * 17) % 74) + 8}%`,
                  '--s': `${2 + (index % 3)}px`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="s06" className="hz-section hz-s06">
        <div className="hz-badge">
          <span>06</span> {SECTION_LABELS[5]}
        </div>
        <svg width="0" height="0" className="hz-stats-defs" aria-hidden="true">
          <defs>
            <linearGradient id="hzStatsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dbf1ff" />
              <stop offset="48%" stopColor="#7bc2ff" />
              <stop offset="100%" stopColor="#2f7fff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="hz-shell hz-stats-shell">
          <div className="hz-stats-head">
            <h2>
              Los Numeros
              <br />
              de la Grandeza
            </h2>
            <p>Cada cifra funciona como una puerta de entrada a una era distinta del club.</p>
          </div>
          <div className="hz-ring-grid">
            {STATS_ITEMS.map((item, idx) => (
              <article
                key={item.label}
                className={`hz-ring-item ${statsVisible ? 'is-counted' : ''}`}
              >
                <div className="hz-ring-visual">
                  <svg className="hz-ring-svg" viewBox="0 0 90 90" aria-hidden="true">
                    <circle className="hz-ring-bg" cx="45" cy="45" r="40" />
                    <circle
                      className="hz-ring-arc"
                      cx="45"
                      cy="45"
                      r="40"
                      style={{
                        '--stroke-offset': `${(ARC_CIRCUMFERENCE * (1 - item.progress)).toFixed(2)}`,
                      }}
                    />
                  </svg>
                  <div className="hz-ring-copy">
                    <div className="hz-ring-value">
                      {statValues[idx]}
                      {item.suffix ? <sup>{item.suffix}</sup> : null}
                    </div>
                    <div className="hz-ring-label">{item.label}</div>
                    <div className="hz-ring-desc">{item.desc}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="s07" className="hz-section hz-s07">
        <div className="hz-badge">
          <span>07</span> {SECTION_LABELS[6]}
        </div>
        <div className="hz-curtain-grid">
          {CURTAIN_ITEMS.map((item, idx) => (
            <article
              key={item.tag}
              className="hz-curtain-card"
              style={{ '--curtain-delay': `${idx * 0.15}s` }}
            >
              <div className="hz-curtain-mask" aria-hidden="true" />
              <img className="hz-curtain-card__img" src={item.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <div className="hz-curtain-card__veil" aria-hidden="true" />
              <div className="hz-curtain-card__placeholder" aria-hidden="true">
                <span>Real Madrid Archive</span>
              </div>
              <span>{item.tag}</span>
              <h2>
                {item.name.split('\n').map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p>{item.sub}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="s08" className="hz-section hz-s08">
        <div className="hz-badge">
          <span>08</span> {SECTION_LABELS[7]}
        </div>
        <div
          className="hz-tilt-card"
          onPointerMove={onTiltMove}
          onPointerLeave={onTiltLeave}
        >
          <div className="hz-tilt-face">
            <div
              className="hz-tilt-card__image"
              aria-hidden="true"
              style={{ backgroundImage: `url(${HISTORY_MEDIA.tilt})` }}
            />
            <div className="hz-tilt-scan" aria-hidden="true" />
            <div className="hz-tilt-specular" aria-hidden="true" />
            <div className="hz-tilt-corners" aria-hidden="true">
              <span className="is-tl" />
              <span className="is-tr" />
              <span className="is-bl" />
              <span className="is-br" />
            </div>
            <div className="hz-tilt-inner">
              <div className="hz-tilt-ring">
                <div className="hz-tilt-ring__inner">Real Madrid · 1902</div>
              </div>
              <h2>
                El Club
                <br />
                Eterno
              </h2>
              <p>Una escena con brillo especular, profundidad real y un cierre visual mas serio.</p>
            </div>
          </div>
          <div className="hz-tilt-shadow" aria-hidden="true" />
        </div>
      </section>

      <section id="s09" ref={s09Ref} className="hz-section hz-s09">
        <div className="hz-badge">
          <span>09</span> {SECTION_LABELS[8]}
        </div>
        <div className="hz-s09-sticky">
          <div className="hz-s09-corner-ghost" aria-hidden="true">
            R
          </div>
          <div className="hz-s09-media-stack" aria-hidden="true">
            {ZOOM_STAGES.map((stage, index) => (
              <div
                key={stage.act}
                className={`hz-s09-media ${activeZoom === index ? 'is-active' : ''}`}
                style={{ backgroundImage: `url(${stage.image})` }}
              />
            ))}
          </div>
          <div className="hz-s09-grid" aria-hidden="true" />
          <div className="hz-s09-frame">
            {ZOOM_STAGES.map((stage, index) => (
              <article key={stage.act} className={`hz-zoom-stage ${activeZoom === index ? 'is-active' : ''}`}>
                <div>
                  <span className="hz-zoom-stage__num">{stage.act}</span>
                  <h2>
                    {stage.titleLead}
                    <span>{stage.titleAccent}</span>
                    {stage.titleTail}
                    <br />
                    {stage.titleBottom}
                  </h2>
                  <p>{stage.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="hz-s09-arc" aria-hidden="true">
            {ZOOM_STAGES.map((stage, index) => (
              <span key={stage.act} className={activeZoom === index ? 'is-active' : ''} />
            ))}
          </div>
          <div className="hz-s09-bar" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>

      <section id="s10" className="hz-section hz-s10">
        <div className="hz-badge dark">
          <span>10</span> {SECTION_LABELS[9]}
        </div>
        <p className="hz-flip-heading">· Secciones del Portal — Pasa el cursor ·</p>
        <div className="hz-flip-grid">
          {FLIP_ITEMS.map((item) => (
            <article key={item.title} className="hz-flip-card">
              <div className="hz-flip-card__inner">
                <div className="hz-flip-face hz-flip-front">
                  <div className="hz-flip-front__num">{item.num}</div>
                  <h3>{item.title}</h3>
                  <div className="hz-flip-front__line" aria-hidden="true" />
                </div>
                <div className="hz-flip-face hz-flip-back">
                  <div className="hz-flip-back__tag">· {item.tag} ·</div>
                  <p>{item.body}</p>
                  <div className="hz-flip-back__arrow">→ Acceder</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="s11" className="hz-section hz-s11">
        <div className="hz-badge">
          <span>11</span> {SECTION_LABELS[10]}
        </div>
        <div className="hz-morph-wrap">
          <span className="hz-morph-eyebrow">· Fuerza · Pasion · Gloria ·</span>
          <h2 className="hz-morph-title">
            <span className="hz-morph-word">Somos</span>
            <span className="hz-morph-word is-accent"> El </span>
            <span className="hz-morph-word">Mejor</span>
            <br />
            <span className="hz-morph-word is-accent">Club</span>
            <span className="hz-morph-word"> del </span>
            <span className="hz-morph-word is-accent">Mundo</span>
          </h2>
          <span className="hz-morph-sub">Una declaracion de identidad construida con ritmo tipografico.</span>
        </div>
      </section>

      <section id="s12" className="hz-section hz-s12">
        <div className="hz-badge">
          <span>12</span> {SECTION_LABELS[11]}
        </div>
        <div className="hz-diag-stack">
          {DIAGONAL_BLOCKS.map((block) => (
            <article key={block.number} className={block.className}>
              <div className="hz-diag-mask" aria-hidden="true" />
              <div className="hz-diag-number" aria-hidden="true">
                {block.number}
              </div>
              <div className="hz-diag-content">
                <span className="hz-diag-label">{block.label}</span>
                <h2>
                  {block.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h2>
                <p>{block.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="s13" className="hz-section hz-s13">
        <div className="hz-badge">
          <span>13</span> {SECTION_LABELS[12]}
        </div>
        <div className="hz-crt-scene">
          <div className="hz-crt-scanlines" aria-hidden="true" />
          <h2 className="hz-glitch" data-text={glitchText}>
            {glitchText}
          </h2>
          <p className="hz-crt-sub">Efecto glitch para momentos de impacto maximo</p>
        </div>
      </section>

      <section id="s14" ref={s14Ref} className="hz-section hz-s14">
        <div className="hz-badge">
          <span>14</span> {SECTION_LABELS[13]}
        </div>
        <div ref={s14StickyRef} className="hz-s14-sticky">
          <div className="hz-s14-track-wrap">
            <div ref={s14TrackRef} className="hz-s14-track">
              {TIMELINE.map((item, index) => (
                <article key={item.year} className={`hz-timeline-slide ${activeTimeline === index ? 'is-active' : ''}`}>
                  <img
                    className="hz-timeline-slide__img"
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="hz-timeline-slide__veil" aria-hidden="true" />
                  <strong>{item.year}</strong>
                  <div className="hz-timeline-slide__info">
                    <span>{item.chapter}</span>
                    <h2>
                      {item.title.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </h2>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="hz-s14-progress">
            <span />
          </div>
          <div className="hz-s14-dots" aria-hidden="true">
            {TIMELINE.map((item, index) => (
              <div key={item.year} className={`hz-s14-dot ${activeTimeline === index ? 'is-active' : ''}`}>
                <span className="hz-s14-dot__circle" />
                <span className="hz-s14-dot__year">{item.year}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="s15" className="hz-section hz-s15">
        <div className="hz-badge">
          <span>15</span> {SECTION_LABELS[14]}
        </div>
        <div className="hz-iris-head">
          <span className="hz-iris-eyebrow">· Cantera · Futuro · Promesas ·</span>
          <h2>
            La Proxima
            <br />
            Generacion
          </h2>
        </div>
        <div className="hz-iris-grid">
          {IRIS_ITEMS.map((item) => (
            <article key={item.title} className="hz-iris-cell">
              <img className="hz-iris-cell__img" src={item.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <div className="hz-iris-cell__veil" aria-hidden="true" />
              <div className="hz-iris-cell__placeholder" aria-hidden="true">
                <span>Player Portrait</span>
              </div>
              <span className="hz-iris-cell__eyebrow">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <small>{item.detail}</small>
            </article>
          ))}
        </div>
      </section>

      <section id="s16" ref={s16Ref} className="hz-section hz-s16">
        <div className="hz-badge">
          <span>16</span> {SECTION_LABELS[15]}
        </div>
        <div
          className={`hz-kinetic-scene ${s16Snapped ? 'is-snapped' : ''}`}
          aria-label="Hala Madrid kinetic typography"
        >
          <div className="hz-kinetic-backdrop" aria-hidden="true">
            HALA MADRID
          </div>
          {kineticLetters.map((letter, index) => (
            <span
              key={letter.id}
              className={`hz-kinetic-letter ${letter.char === ' ' ? 'is-space' : ''}`}
              style={{
                '--start-x': letter.x,
                '--start-y': letter.y,
                '--target-x': `${(letter.offset * kineticStep).toFixed(2)}px`,
                '--start-rotate': `${letter.rotate}deg`,
                '--start-scale': letter.scale,
                '--start-opacity': letter.opacity,
                '--letter-delay': `${index * 34}ms`,
              }}
            >
              {letter.char === ' ' ? '\u00A0' : letter.char}
            </span>
          ))}
          <div className="hz-kinetic-note">
            <span>· Las letras se ordenan con el scroll ·</span>
          </div>
        </div>
      </section>

      <section id="s17" ref={s17Ref} className="hz-section hz-s17">
        <div className="hz-badge">
          <span>17</span> {SECTION_LABELS[16]}
        </div>
        <div className="hz-s17-sticky">
          <img
            className="hz-s17-media"
            src={HISTORY_MEDIA.video}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <div className="hz-s17-vignette" aria-hidden="true" />
          <div className="hz-s17-scanlines" aria-hidden="true" />
          <div className="hz-s17-grid" aria-hidden="true" />
          <div className="hz-s17-lines">
            <h2 className="hz-s17-line hz-s17-line--one">HALA</h2>
            <h2 className="hz-s17-line hz-s17-line--two">MADRID</h2>
            <h3 className="hz-s17-line hz-s17-line--three">Y NADA MAS</h3>
          </div>
          <div className="hz-s17-side">Real Madrid Club de Futbol · Est. 1902</div>
          <div className="hz-s17-bottom">
            <span>Temporada 2025-26</span>
            <span>Santiago Bernabeu · Madrid</span>
          </div>
        </div>
      </section>

      <section id="s18" className="hz-section hz-s18">
        <div className="hz-badge dark">
          <span>18</span> {SECTION_LABELS[17]}
        </div>
        <div className="hz-cta-blob" />
        <div className="hz-shell hz-s18-content">
          <h2>Se parte de la historia</h2>
          <p>CTA limpio y moderno con identidad azul.</p>
          <div>
            <button type="button">Hazte socio</button>
            <button type="button">Comprar entradas</button>
          </div>
        </div>
      </section>

      <section id="s19" ref={s19Ref} className="hz-section hz-s19">
        <div className="hz-badge">
          <span>19</span> {SECTION_LABELS[18]}
        </div>
        <div className="hz-velocity-title">
          <span>SIEMPRE</span>
          <span className="is-accent">HACIA</span>
          <span>ADELANTE</span>
        </div>
        <div className="hz-velocity-note">· El texto responde a la velocidad del scroll ·</div>
      </section>

      <section id="s20" className="hz-section hz-s20">
        <div className="hz-badge">
          <span>20</span> {SECTION_LABELS[19]}
        </div>
        <div className="hz-shell hz-s20-content">
          <article>
            <span>· Trazado en scroll ·</span>
            <h2>
              Una Historia
              <br />
              que se Dibuja
            </h2>
            <p>El trazo funciona como divisor narrativo, señal visual y gesto de marca a medida que avanzas.</p>
          </article>
          <div className="hz-s20-path-wrap">
            <svg viewBox="0 0 400 400" aria-hidden="true">
              <defs>
                <filter id="hzPathGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                className="hz-s20-path hz-s20-path--glow"
                d="M200,40 L220,120 L300,80 L250,150 L340,160 L270,210 L300,300 L200,250 L100,300 L130,210 L60,160 L150,150 L100,80 L180,120 Z"
              />
              <path
                className="hz-s20-path hz-s20-path--main"
                d="M200,40 L220,120 L300,80 L250,150 L340,160 L270,210 L300,300 L200,250 L100,300 L130,210 L60,160 L150,150 L100,80 L180,120 Z"
              />
              <circle className="hz-s20-dot" cx="200" cy="40" r="5" />
              <circle className="hz-s20-dot" cx="300" cy="300" r="5" />
              <circle className="hz-s20-dot" cx="100" cy="300" r="5" />
              <circle className="hz-s20-dot hz-s20-dot--core" cx="200" cy="250" r="8" />
              <text x="200" y="370" textAnchor="middle">REAL MADRID CF</text>
            </svg>
          </div>
        </div>
      </section>

      <section id="s21" className="hz-section hz-s21">
        <div className="hz-badge">
          <span>21</span> {SECTION_LABELS[20]}
        </div>
        <div className="hz-mag-scene">
          <span className="hz-mag-eyebrow">· Hover para sentir la atraccion ·</span>
          <h2 className="hz-mag-title">
            Explora
            <br />
            el Portal
          </h2>
        </div>
        <div className="hz-mag-grid">
          {MAGNETIC_ITEMS.map((item) => (
            <button
              key={item.title}
              type="button"
              className="hz-mag-btn"
              onPointerMove={onMagneticMove}
              onPointerLeave={onMagneticLeave}
            >
              <span className="hz-mag-btn__glow" aria-hidden="true" />
              <span className="hz-mag-btn__code">{item.code}</span>
              <span className="hz-mag-btn__title">{item.title}</span>
              <span className="hz-mag-btn__sub">{item.sub}</span>
              <span className="hz-mag-btn__arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section id="s22" className="hz-section hz-s22" aria-hidden="true">
        <div className="hz-badge">
          <span>22</span> {SECTION_LABELS[21]}
        </div>
        <div className="hz-tunnel">
          <div className="hz-tunnel-core">
            <h2>Al infinito</h2>
          </div>
        </div>
      </section>

      <section id="s23" className="hz-section hz-s23">
        <div className="hz-badge">
          <span>23</span> {SECTION_LABELS[22]}
        </div>
        <h2>
          El equipo de la <span>{SLOT_WORDS[slotIndex]}</span>
        </h2>
      </section>

      <section id="s24" className="hz-section hz-s24">
        <div className="hz-badge">
          <span>24</span> {SECTION_LABELS[23]}
        </div>
        <div className="hz-pixel-frame">
          <div className="hz-pixel-overlay" />
          <h2>La Decimoquinta</h2>
        </div>
      </section>

      <section id="s25" className="hz-section hz-s25">
        <div className="hz-badge">
          <span>25</span> {SECTION_LABELS[24]}
        </div>
        <h2>
          Equipo de la <span>{BARREL_WORDS[barrelIndex]}</span>
        </h2>
      </section>

      <section id="s26" className="hz-section hz-s26">
        <div className="hz-badge">
          <span>26</span> {SECTION_LABELS[25]}
        </div>
        <div ref={dragRef} className="hz-drag-wrap">
          <div className="hz-drag-before" style={{ width: `${splitPercent}%` }}>
            <img className="hz-drag-pane__img" src={HISTORY_MEDIA.splitBefore} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <div className="hz-drag-pane__label">
              <h3>Origen</h3>
            </div>
          </div>
          <div className="hz-drag-after">
            <img className="hz-drag-pane__img" src={HISTORY_MEDIA.splitAfter} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <div className="hz-drag-pane__label">
              <h3>Actualidad</h3>
            </div>
          </div>
          <button
            type="button"
            className="hz-drag-handle"
            style={{ left: `${splitPercent}%` }}
            onPointerDown={() => {
              draggingRef.current = true
            }}
          >
            ⇔
          </button>
        </div>
      </section>

      <section id="s27" className="hz-section hz-s27">
        <div className="hz-badge">
          <span>27</span> {SECTION_LABELS[26]}
        </div>
        <canvas ref={constellationCanvasRef} className="hz-constellation-canvas" />
        <div className="hz-shell hz-s27-content">
          <h2>Constelacion Madridista</h2>
          <p>Todo el sistema visual unificado en azul.</p>
        </div>
      </section>

      <section id="s28" className="hz-section hz-s28">
        <div className="hz-badge">
          <span>28</span> {SECTION_LABELS[27]}
        </div>
        <div className="hz-shell hz-s28-layout">
          <div className="hz-orbit-scene" aria-hidden="true">
            <div className="hz-orbit-ambient hz-orbit-ambient--one" />
            <div className="hz-orbit-ambient hz-orbit-ambient--two" />
            <div className="hz-orbit-stars">
              {Array.from({ length: 16 }, (_, index) => (
                <span
                  key={`orbit-star-${index}`}
                  style={{
                    '--x': `${6 + ((index * 13) % 88)}%`,
                    '--y': `${8 + ((index * 19) % 78)}%`,
                    '--s': `${1 + (index % 3)}px`,
                  }}
                />
              ))}
            </div>
            {ORBIT_RINGS.map((ring) => (
              <div key={ring.key} className={ring.className}>
                <div className="hz-orbit-rotator">
                  <div className="hz-orbit-track" />
                  {ring.items.map((item, index) => (
                    <figure
                      key={`${ring.key}-${item.title}`}
                      className={`hz-orbit-card ${item.size}`}
                      style={{ '--angle': item.angle, '--i': index }}
                    >
                      <img src={item.image} alt="" loading="lazy" decoding="async" />
                      <figcaption>{item.title}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
            <div className="hz-orbit-core">
              <span className="hz-orbit-core__mark">RM</span>
              <span className="hz-orbit-core__sub">1902 · Madrid · Europa</span>
            </div>
          </div>
          <div className="hz-s28-content">
            <span className="hz-s28-eyebrow">· Orbitas visuales del club ·</span>
            <h2>Orbita Madridista</h2>
            <p>
              Un sistema de anillos mas fisico y cinematografico donde los momentos,
              jugadores y simbolos del Real Madrid orbitan alrededor del nucleo del club.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

