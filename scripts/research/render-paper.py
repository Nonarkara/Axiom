"""Render a reviewed Markdown manuscript; requires reportlab, markdown and bs4."""
import argparse
from html import escape
from pathlib import Path

import markdown
from bs4 import BeautifulSoup, NavigableString
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether


def inline(node):
    if isinstance(node, NavigableString):
        return escape(str(node))
    content = ''.join(inline(child) for child in node.children)
    if node.name in ('strong', 'b'):
        return '<b>' + content + '</b>'
    if node.name in ('em', 'i'):
        return '<i>' + content + '</i>'
    if node.name == 'a':
        href = node.get('href', '')
        if href.startswith('https://'):
            return '<a href="' + escape(href, quote=True) + '" color="#00247d">' + content + '</a>'
    if node.name == 'br':
        return '<br/>'
    return content


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('manuscript', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--font-dir', required=True, type=Path)
    args = parser.parse_args()
    for family in ('Serif', 'Sans'):
        for suffix, variant in (('', 'Regular'), ('-Bold', 'Bold'), ('-Italic', 'Italic'), ('-BoldItalic', 'BoldItalic')):
            pdfmetrics.registerFont(TTFont(family + suffix, str(args.font_dir / ('Liberation' + family + '-' + variant + '.ttf'))))
        pdfmetrics.registerFontFamily(family, normal=family, bold=family + '-Bold', italic=family + '-Italic', boldItalic=family + '-BoldItalic')
    paper = args.manuscript.read_text()
    if paper.startswith('---\n'):
        paper = paper.split('---\n', 2)[2]
    soup = BeautifulSoup(markdown.markdown(paper, extensions=['tables', 'fenced_code']), 'html.parser')
    width = A4[0] - 100
    body = ParagraphStyle('body', fontName='Serif', fontSize=10.5, leading=14.3, spaceAfter=7, alignment=TA_LEFT)
    title = ParagraphStyle('title', parent=body, fontName='Sans-Bold', fontSize=21, leading=25, spaceAfter=12, keepWithNext=True)
    heading = ParagraphStyle('heading', parent=body, fontName='Sans-Bold', fontSize=12.5, leading=16, spaceBefore=12, spaceAfter=6, keepWithNext=True)
    subhead = ParagraphStyle('subhead', parent=heading, fontSize=10.5, leading=14, spaceBefore=7)
    small = ParagraphStyle('small', parent=body, fontName='Sans', fontSize=8.4, leading=11, spaceAfter=0, splitLongWords=True)
    story = []
    for node in soup.children:
        if isinstance(node, NavigableString):
            continue
        if node.name in ('h1', 'h2', 'h3', 'h4', 'p', 'blockquote'):
            style = title if node.name == 'h1' else heading if node.name == 'h2' else subhead if node.name in ('h3', 'h4') else body
            story.append(Paragraph(inline(node), style))
        elif node.name in ('ul', 'ol'):
            for i, item in enumerate(node.find_all('li', recursive=False), 1):
                prefix = str(i) + '. ' if node.name == 'ol' else '- '
                story.append(Paragraph(prefix + inline(item), body))
        elif node.name == 'table':
            rows = [[Paragraph(inline(cell), small) for cell in row.find_all(['td', 'th'])] for row in node.find_all('tr')]
            if not rows:
                continue
            table = Table(rows, colWidths=[width / len(rows[0])] * len(rows[0]), repeatRows=1, hAlign='LEFT')
            table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LINEABOVE', (0, 0), (-1, 0), 0.7, colors.HexColor('#00247d')),
                ('LINEBELOW', (0, 0), (-1, 0), 0.4, colors.HexColor('#999999')),
                ('LINEBELOW', (0, -1), (-1, -1), 0.4, colors.HexColor('#999999')),
                ('LEFTPADDING', (0, 0), (-1, -1), 4),
                ('RIGHTPADDING', (0, 0), (-1, -1), 4),
                ('TOPPADDING', (0, 0), (-1, -1), 5),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ]))
            story.extend([KeepTogether([table]), Spacer(1, 9)])
        elif node.name == 'pre':
            story.append(Paragraph(escape(node.get_text()).replace('\n', '<br/>'), small))
    def page(canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor('#00247d'))
        canvas.line(50, A4[1] - 30, A4[0] - 50, A4[1] - 30)
        canvas.setFont('Sans', 8)
        canvas.drawString(50, 28, 'AXIOM / RESEARCH     Preprint - not peer-reviewed     v1 / 5 November 2026')
        canvas.drawRightString(A4[0] - 50, 28, str(doc.page))
        canvas.restoreState()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(args.output), pagesize=A4, leftMargin=50, rightMargin=50, topMargin=47, bottomMargin=48,
                            title=soup.h1.get_text(), author='Poon Thiengburanathum; Non Arkaraprasertkul')
    doc.build(story, onFirstPage=page, onLaterPages=page)
    print(args.output)


if __name__ == '__main__':
    main()
