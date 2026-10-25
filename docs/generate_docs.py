"""Generate Alehu business and technical PDF presentations."""
from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

NAVY = HexColor('#0B3D4A')
TEAL = HexColor('#0F7A6C')
CREAM = HexColor('#F7F4EE')
AMBER = HexColor('#E8A317')
INK = HexColor('#12323A')

OUT = Path(__file__).resolve().parent


def styles():
    base = getSampleStyleSheet()
    base.add(ParagraphStyle('CoverKicker', fontName='Times-Bold', fontSize=12, textColor=AMBER, spaceAfter=8))
    base.add(ParagraphStyle('CoverTitle', fontName='Times-Bold', fontSize=28, leading=34, textColor=NAVY, spaceAfter=12))
    base.add(ParagraphStyle('CoverSub', fontName='Helvetica', fontSize=12, leading=18, textColor=INK, spaceAfter=10))
    base.add(ParagraphStyle('H', fontName='Times-Bold', fontSize=16, textColor=NAVY, spaceBefore=14, spaceAfter=8))
    base.add(ParagraphStyle('P', fontName='Helvetica', fontSize=10.5, leading=15, textColor=INK, spaceAfter=8))
    base.add(ParagraphStyle('BulletBody', fontName='Helvetica', fontSize=10.5, leading=15, textColor=INK))
    base.add(ParagraphStyle('Footer', fontName='Helvetica', fontSize=8, textColor=TEAL))
    return base


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, A4[1] - 18 * mm, A4[0], 18 * mm, fill=1, stroke=0)
    canvas.setFillColor(white)
    canvas.setFont('Times-Bold', 11)
    canvas.drawString(18 * mm, A4[1] - 11 * mm, 'Alehu AI P.L.C.  ·  Confidential')
    canvas.setFillColor(TEAL)
    canvas.rect(0, 0, A4[0], 12 * mm, fill=1, stroke=0)
    canvas.setFillColor(white)
    canvas.setFont('Helvetica', 8)
    canvas.drawString(18 * mm, 5 * mm, 'Internal startup materials — do not redistribute')
    canvas.drawRightString(A4[0] - 18 * mm, 5 * mm, f'Page {doc.page}')
    canvas.restoreState()


def bullets(items, s):
    return ListFlowable(
        [ListItem(Paragraph(item, s['BulletBody']), leftIndent=8, bulletColor=TEAL) for item in items],
        bulletType='bullet',
        leftIndent=16,
        spaceAfter=8,
    )


def table(rows):
    t = Table(rows, colWidths=[70 * mm, 105 * mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BACKGROUND', (0, 1), (-1, -1), CREAM),
        ('TEXTCOLOR', (0, 1), (-1, -1), INK),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.3, TEAL),
    ]))
    return t


def business_pdf():
    s = styles()
    doc = SimpleDocTemplate(
        str(OUT / 'Alehu_Business_Presentation.pdf'),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=26 * mm,
        bottomMargin=20 * mm,
        title='Alehu AI Business Presentation',
        author='Alehu AI P.L.C.',
    )
    story = [
        Paragraph('CONFIDENTIAL  ·  COMPANY PROFILE', s['CoverKicker']),
        Paragraph('Alehu AI P.L.C.', s['CoverTitle']),
        Paragraph('Smart Child Safety Systems — pioneering next-generation AI safety for children.', s['CoverSub']),
        Paragraph(
            'Alehu AI Public Limited Company is an innovative technology venture dedicated to protecting children through intelligent, real-time edge monitoring. Our proprietary smart gadget combines non-intrusive wearable hardware with advanced AI to deliver instant safety alerts to parents and guardians.',
            s['P'],
        ),
        Paragraph('Mission', s['H']),
        Paragraph(
            'To develop innovative child-safety solutions that combine smart devices, artificial intelligence, and real-time monitoring to help parents protect their children and enable timely responses to potential safety incidents, without compromising their freedom.',
            s['P'],
        ),
        Paragraph('Vision', s['H']),
        Paragraph(
            'To create a world where every child is safer and every parent can have greater peace of mind through intelligent, accessible technology — and to become a globally trusted leader in smart child protection technology.',
            s['P'],
        ),
        Paragraph('Strategic metrics', s['H']),
        table([
            ['Metric', 'Target / claim'],
            ['Alert latency', 'Under 1.2 seconds'],
            ['AI detection accuracy', '99.4%'],
            ['Active protection', '24/7'],
            ['Telemetry', '100% encrypted'],
        ]),
        Paragraph('Core value pillars', s['H']),
        bullets([
            '<b>Proactive protection:</b> shift from passive tracking to on-device threat assessment powered by edge AI.',
            '<b>Privacy first:</b> zero raw audio or image storage. Local inference keeps children’s data private.',
            '<b>Seamless utility:</b> long battery life, water-resistant child-proof design, intuitive guardian controls.',
        ], s),
        PageBreak(),
        Paragraph('The Alehu ecosystem', s['H']),
        Paragraph(
            'The flagship suite integrates smart wearable sensors, localized edge computing, and cloud intelligence to form an unbroken safety umbrella around children in urban, school, and outdoor environments.',
            s['P'],
        ),
        table([
            ['Layer', 'Role'],
            ['Smart gadget wearable', 'Biometrics and geo-sensors on the child'],
            ['On-device edge AI', 'Acoustic and motion analysis without cloud lag'],
            ['Parent / school app', 'Instant alerts and live GPS for guardians'],
            ['Cloud API (this MVP)', 'Accounts, devices, alerts, encrypted telemetry'],
        ]),
        Paragraph('Product modules', s['H']),
        table([
            ['Module', 'Benefit'],
            ['Distress Acoustic AI', 'Immediate local trigger on scream, impact, or distress keyword'],
            ['Smart geofencing', 'Early wander-off warning with predictive route deviation'],
            ['Impact and fall detection', 'Automated accident alert from IMU patterns'],
            ['Silent SOS', 'Hidden double-press button for discreet emergencies'],
            ['Extended battery', 'Up to 5 days of active life'],
            ['Adaptive context awareness', 'Learns routine to cut false alarms'],
            ['Multi-guardian mesh', 'Broadcasts to parents, school staff, or local security'],
        ]),
        Paragraph('Go-to-market', s['H']),
        Paragraph(
            'Initial deployment targets urban parents, primary schools, and daycare centers through direct-to-consumer online channels and strategic B2B educational partnerships. R&D horizon: vital-sign telemetry, biometric wellness, and cellular mesh for remote areas.',
            s['P'],
        ),
        Paragraph('Leadership', s['H']),
        table([
            ['Role', 'Focus'],
            ['Hilina Mulugeta — CEO', 'Vision, product direction, corporate strategy, growth'],
            ['Kaleab Mulugeta — AI & Hardware', 'Firmware, embedded systems, on-device AI'],
            ['Gashaw Taye — Mobile & Cloud', 'Apps, secure backends, real-time notifications'],
        ]),
        Paragraph('Inquiries', s['H']),
        Paragraph('Headquarters: Addis Ababa, Ethiopia<br/>contact@alehu.ai · partnerships@alehu.ai · ir@alehu.ai', s['P']),
    ]
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)


def technical_pdf():
    s = styles()
    doc = SimpleDocTemplate(
        str(OUT / 'Alehu_Technical_Documentation.pdf'),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=26 * mm,
        bottomMargin=20 * mm,
        title='Alehu AI Technical Documentation',
        author='Alehu AI P.L.C.',
    )
    story = [
        Paragraph('CONFIDENTIAL  ·  ENGINEERING PACK', s['CoverKicker']),
        Paragraph('Alehu MVP — Technical Documentation', s['CoverTitle']),
        Paragraph('Next.js frontend, Flask API, PostgreSQL, wearable ingest, and hardware bill of materials.', s['CoverSub']),
        Paragraph('Architecture', s['H']),
        bullets([
            '<b>Frontend:</b> Next.js App Router, TypeScript, Tailwind. Marketing pages (including /hardware) are statically renderable with SEO, generated Open Graph PNG, sitemap, and robots rules. Guardian dashboard is a client app against the API.',
            '<b>Backend:</b> Python 3.12, Flask 3, SQLAlchemy 2, Flask-Migrate, JWT, Marshmallow, CORS.',
            '<b>Database:</b> PostgreSQL. Core tables: users, roles, permissions, customers, devices, alerts.',
            '<b>Wearable path:</b> firmware POSTs compact telemetry to <font face="Courier">/api/ingest/telemetry</font> using JWT or <font face="Courier">X-Device-Key</font>.',
        ], s),
        Paragraph('API surface', s['H']),
        table([
            ['Area', 'Endpoints'],
            ['Health / contact', 'GET /api/health · POST /api/contact'],
            ['Auth', 'register, login, refresh, logout, me'],
            ['Operations', 'users, customers, devices, roles, permissions'],
            ['Safety', 'alerts CRUD + acknowledge · dashboard/summary'],
            ['Ingest', 'POST /api/ingest/telemetry'],
        ]),
        Paragraph('Device telemetry fields', s['H']),
        Paragraph(
            'devices now carry firmware_version, battery_level, last_latitude, last_longitude, and last_seen. Optional alert_type on ingest creates a structured safety event (geofence, fall, sos, battery, distress).',
            s['P'],
        ),
        Paragraph('Security notes', s['H']),
        bullets([
            'Passwords hashed with bcrypt. JWT access + refresh. Logout blocklists JTI (replace with Redis in production).',
            'CORS locked to the Next.js origin via CORS_ORIGINS.',
            'No raw audio or image payload is accepted by the MVP API.',
            'Rotate SECRET_KEY, JWT_SECRET_KEY, DEVICE_INGEST_KEY, and database passwords before any public deploy.',
        ], s),
        Paragraph('Local run', s['H']),
        Paragraph(
            'Backend: create venv, pip install -r backend/requirements.txt, copy .env, create database alehu, flask db upgrade, python run.py --seed, python run.py.<br/>Frontend: cd frontend, npm install, copy .env.example to .env.local, npm run dev. Open http://localhost:3000 and sign in with admin@alehu.com / Admin123!',
            s['P'],
        ),
        PageBreak(),
        Paragraph('Hardware guidance — Alehu Band v1', s['H']),
        Paragraph(
            'Design goal: a child-safe, water-resistant wearable that can classify distress and motion on-device, then send a tiny encrypted event. Prefer parts that are globally sourcable and already have Ethiopia-friendly LTE-M/NB-IoT options.',
            s['P'],
        ),
        table([
            ['Function', 'Recommended starting parts'],
            ['Main MCU', 'ESP32-S3 (Wi-Fi/BLE prototyping) or nRF52840 (BLE + better battery)'],
            ['Cellular (field)', 'SIM7080G or Quectel BG95 LTE-M/NB-IoT + nano-SIM'],
            ['GNSS', 'Quectel L76-L or ATGM336H GNSS module with ceramic patch antenna'],
            ['IMU (fall/impact)', 'Bosch BMI270 or InvenSense ICM-42670-P (low-power 6-axis)'],
            ['Microphone', 'Knowles analog MEMS + local keyword/scream model. Do not stream audio.'],
            ['SOS button', 'Sealed tactile switch, recessed, double-press firmware debounce'],
            ['Battery', '400–800 mAh LiPo, protection PCB, USB-C charge via TP4056 or BQ series'],
            ['Power path', '3.3V LDO or buck; fuel-gauge optional (MAX17048)'],
            ['Enclosure', 'IP67 TPU/PC blend, rounded, no removable small parts, skin-safe finish'],
            ['Indicators', 'One status LED behind diffuser; optional haptic (coin ERM)'],
        ]),
        Paragraph('Firmware responsibilities', s['H']),
        bullets([
            'Sample IMU at 50–100 Hz; run a tiny fall/impact classifier on MCU.',
            'Run a small acoustic model locally; transmit only event labels, never WAV/PCM.',
            'Maintain geofence polygons pushed from the cloud; alert on exit + dwell.',
            'Heartbeat every 30–120 seconds: serial, battery, lat/lng, firmware version.',
            'On SOS/fall/distress: high-priority ingest with severity=critical.',
            'Deep sleep between samples to target 3–5 day battery.',
        ], s),
        Paragraph('Prototype sequence', s['H']),
        bullets([
            'Week 1–2: ESP32-S3 + BMI270 + USB power. Prove fall + button events into /api/ingest/telemetry.',
            'Week 3–4: add GNSS and geofence firmware. Show live last-known point in the dashboard.',
            'Week 5–6: battery + enclosure mock. Measure current in sleep vs alert burst.',
            'Week 7+: swap in LTE-M module for independent-from-phone coverage. Start school pilot with 10 units.',
        ], s),
        Paragraph('Safety and compliance (plan, not yet certified)', s['H']),
        Paragraph(
            'Target IP67, IEC 62115 / toy-adjacent mechanical safety, battery UN38.3 for shipping, RF (CE/FCC or local ETA as applicable), and a child-data policy that matches the privacy page: no raw media retention. Certify before paid school rollout.',
            s['P'],
        ),
    ]
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)


if __name__ == '__main__':
    business_pdf()
    technical_pdf()
    print(f'Wrote PDFs to {OUT}')
