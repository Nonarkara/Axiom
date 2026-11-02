// Diagrams for the field notes. Drawn, not decorated.
//
// Each one carries the argument its note makes in prose. Rams as method rather
// than mood: one weight of line, no shading, no gradient, no corner that is not
// square, no curve that is not doing work. Two accents carry meaning and never
// decoration — navy is the path that works, red is the one that does not — and
// the same rule holds in the dark theme, because every stroke is a token.
//
// Markup is authored here and inserted as-is. Nothing from the catalogue or the
// URL reaches it, so there is no untrusted string in these innerHTML calls.
//
// Drawn phone-first: every viewBox is 316 wide (x from 12), the width a phone column
// actually gives the figure, so a label set at 11 units arrives at about 11px.
// At 440 wide the labels landed near 6px on a phone, which is drawn but not
// read. Comparisons stack — the lane that fails on top, the lane that works
// beneath — instead of halving an already narrow column. Every arrowhead's tip
// sits on the end of the path it finishes; .qa checks that by reading this file.
window.AXIOM_DIAGRAMS = {

  // "The vendor said no. We shipped in fourteen days."
  // The claim is about elapsed time, so the drawing is two lanes on one clock.
  'note-1': `
<svg class="dg" viewBox="12 0 316 238" role="img" aria-labelledby="dg-t1">
  <title id="dg-t1">Two lanes: the proposal loop, and the rough version</title>

  <text class="dg-t dg-t--anti" x="12" y="16">the loop</text>
  <rect class="dg-box dg-box--anti" x="12"  y="26" width="72" height="30"/>
  <rect class="dg-box dg-box--anti" x="94"  y="26" width="72" height="30"/>
  <rect class="dg-box dg-box--anti" x="176" y="26" width="72" height="30"/>
  <rect class="dg-box dg-box--anti" x="258" y="26" width="70" height="30"/>
  <text class="dg-k" x="48"  y="46" text-anchor="middle">spec</text>
  <text class="dg-k" x="130" y="46" text-anchor="middle">quote</text>
  <text class="dg-k" x="212" y="46" text-anchor="middle">committee</text>
  <text class="dg-k dg-t--anti" x="293" y="46" text-anchor="middle">no</text>
  <path class="dg-wire dg-wire--anti" d="M84 41h10M166 41h10M248 41h10"/>
  <polygon class="dg-dot dg-dot--anti" points="88,38 94,41 88,44"/>
  <polygon class="dg-dot dg-dot--anti" points="170,38 176,41 170,44"/>
  <polygon class="dg-dot dg-dot--anti" points="252,38 258,41 252,44"/>
  <path class="dg-wire dg-wire--ghost" d="M293 56v20H48V56"/>
  <polygon class="dg-dot" points="45,63 48,56 51,63"/>
  <text class="dg-t" x="170" y="96" text-anchor="middle">then a new spec, and round again</text>

  <text class="dg-t dg-t--key" x="12" y="132">the rough version</text>
  <rect class="dg-box dg-box--key" x="12"  y="142" width="94" height="46"/>
  <rect class="dg-box dg-box--key" x="123" y="142" width="94" height="46"/>
  <rect class="dg-box dg-box--key" x="234" y="142" width="94" height="46"/>
  <text class="dg-k" x="59"  y="162" text-anchor="middle">Stand it up</text>
  <text class="dg-k dg-k--sm" x="59"  y="179" text-anchor="middle">rough, live</text>
  <text class="dg-k" x="170" y="162" text-anchor="middle">In the room</text>
  <text class="dg-k dg-k--sm" x="170" y="179" text-anchor="middle">governor sees</text>
  <text class="dg-k" x="281" y="162" text-anchor="middle">Decide</text>
  <text class="dg-k dg-k--sm" x="281" y="179" text-anchor="middle">on evidence</text>
  <path class="dg-wire dg-wire--key" d="M106 165h17M217 165h17"/>
  <polygon class="dg-dot dg-dot--key" points="117,162 123,165 117,168"/>
  <polygon class="dg-dot dg-dot--key" points="228,162 234,165 228,168"/>
  <path class="dg-rule dg-rule--key" d="M12 204h316"/>
  <path class="dg-wire dg-wire--key" d="M12 198v12M328 198v12"/>
  <text class="dg-n" x="170" y="228" text-anchor="middle">14 days, end to end</text>
</svg>`,

  // "AI-native is not AI-assisted."
  // The claim is about who does what, so the drawing is two roles and a
  // direction of travel, with the review arrow drawn ghosted because it is the
  // part people forget.
  'note-2': `
<svg class="dg" viewBox="12 0 316 238" role="img" aria-labelledby="dg-t2">
  <title id="dg-t2">Human as architect directs, model as engineer builds, human reviews</title>

  <rect class="dg-box" x="40" y="12" width="288" height="52"/>
  <text class="dg-t dg-t--ink" x="52" y="33">human · architect</text>
  <text class="dg-k dg-k--sm" x="52" y="52">decides what is true</text>

  <path class="dg-wire dg-wire--key" d="M250 64v36"/>
  <polygon class="dg-dot dg-dot--key" points="247,93 250,100 253,93"/>
  <text class="dg-t dg-t--key" x="238" y="80" text-anchor="end">direction</text>
  <text class="dg-t" x="238" y="94" text-anchor="end">not typing</text>

  <rect class="dg-box dg-box--key" x="40" y="100" width="288" height="52"/>
  <text class="dg-t dg-t--key" x="52" y="121">model · engineer</text>
  <text class="dg-k dg-k--sm" x="52" y="140">writes every line</text>

  <path class="dg-wire dg-wire--key" d="M250 152v36"/>
  <polygon class="dg-dot dg-dot--key" points="247,181 250,188 253,181"/>
  <text class="dg-t" x="238" y="174" text-anchor="end">the skill that compounds</text>

  <rect class="dg-box dg-box--fill" x="40" y="188" width="288" height="44"/>
  <text class="dg-t dg-t--ink" x="184" y="206" text-anchor="middle">the system, running</text>
  <text class="dg-k dg-k--sm" x="184" y="223" text-anchor="middle">reviewed, kept or thrown away</text>

  <path class="dg-wire dg-wire--ghost" d="M40 210H24V38H40"/>
  <polygon class="dg-dot" points="33,35 40,38 33,41"/>
</svg>`,

  // "The problem is never the data."
  // The claim is about order, so the drawing is the same things twice, in two
  // orders, and the wrong one dead-ends.
  'note-3': `
<svg class="dg" viewBox="12 0 316 254" role="img" aria-labelledby="dg-t3">
  <title id="dg-t3">The same work in the wrong order and the right order</title>

  <text class="dg-t dg-t--anti" x="12" y="16">start with the feeds</text>
  <rect class="dg-box dg-box--anti" x="12"  y="26" width="70" height="34"/>
  <rect class="dg-box dg-box--anti" x="94"  y="26" width="70" height="34"/>
  <rect class="dg-box dg-box--anti" x="176" y="26" width="70" height="34"/>
  <rect class="dg-box dg-box--anti" x="258" y="26" width="70" height="34"/>
  <text class="dg-t" x="47"  y="47" text-anchor="middle">feeds</text>
  <text class="dg-t" x="129" y="47" text-anchor="middle">stack</text>
  <text class="dg-t" x="211" y="47" text-anchor="middle">screen</text>
  <text class="dg-t dg-t--anti" x="293" y="40" text-anchor="middle">nobody</text>
  <text class="dg-t dg-t--anti" x="293" y="54" text-anchor="middle">opens it</text>
  <path class="dg-wire dg-wire--anti" d="M82 43h12M164 43h12M246 43h12"/>
  <polygon class="dg-dot dg-dot--anti" points="88,40 94,43 88,46"/>
  <polygon class="dg-dot dg-dot--anti" points="170,40 176,43 170,46"/>
  <polygon class="dg-dot dg-dot--anti" points="252,40 258,43 252,46"/>

  <path class="dg-rule" d="M12 82h316"/>

  <text class="dg-t dg-t--key" x="12" y="104">start with the decision</text>
  <rect class="dg-box dg-box--key" x="12" y="114" width="316" height="34"/>
  <text class="dg-k" x="170" y="136" text-anchor="middle">one decision, made faster</text>
  <!-- one bus, three drops: the decision feeds all three, not only the middle -->
  <path class="dg-wire dg-wire--key" d="M170 148v16M60 164h220M60 164v18M170 164v18M280 164v18"/>
  <polygon class="dg-dot dg-dot--key" points="57,176 60,182 63,176"/>
  <polygon class="dg-dot dg-dot--key" points="167,176 170,182 173,176"/>
  <polygon class="dg-dot dg-dot--key" points="277,176 280,182 283,176"/>
  <rect class="dg-box dg-box--key" x="12"  y="182" width="96" height="28"/>
  <rect class="dg-box dg-box--key" x="122" y="182" width="96" height="28"/>
  <rect class="dg-box dg-box--key" x="232" y="182" width="96" height="28"/>
  <text class="dg-t" x="60"  y="200" text-anchor="middle">feeds</text>
  <text class="dg-t" x="170" y="200" text-anchor="middle">stack</text>
  <text class="dg-t" x="280" y="200" text-anchor="middle">screen</text>
  <text class="dg-t" x="170" y="230" text-anchor="middle">these follow the decision</text>
  <text class="dg-t" x="170" y="246" text-anchor="middle">they do not find it</text>
</svg>`,

  // "An org chart is not a team."
  // The claim is a substitution, so the drawing puts a tree above a portfolio
  // and lets the shapes argue it.
  'note-4': `
<svg class="dg" viewBox="12 0 316 288" role="img" aria-labelledby="dg-t4">
  <title id="dg-t4">A reporting tree above a portfolio of archetypes</title>

  <text class="dg-t dg-t--anti" x="12" y="16">who reports to whom</text>
  <rect class="dg-box dg-box--anti" x="125" y="26" width="90" height="26"/>
  <text class="dg-t" x="170" y="43" text-anchor="middle">director</text>
  <rect class="dg-box dg-box--anti" x="20"  y="82" width="90" height="26"/>
  <rect class="dg-box dg-box--anti" x="125" y="82" width="90" height="26"/>
  <rect class="dg-box dg-box--anti" x="230" y="82" width="90" height="26"/>
  <text class="dg-t" x="65"  y="99" text-anchor="middle">reports</text>
  <text class="dg-t" x="170" y="99" text-anchor="middle">reports</text>
  <text class="dg-t" x="275" y="99" text-anchor="middle">reports</text>
  <path class="dg-wire dg-wire--anti" d="M170 52v15M65 67h210M65 67v15M170 67v15M275 67v15"/>
  <text class="dg-t dg-t--anti" x="170" y="128" text-anchor="middle">says nothing about the work</text>

  <path class="dg-rule" d="M12 144h316"/>

  <text class="dg-t dg-t--key" x="12" y="166">who builds what, with whom</text>
  <g class="dg-box dg-box--key">
    <rect x="12"  y="176" width="48" height="24"/><rect x="65"  y="176" width="48" height="24"/>
    <rect x="118" y="176" width="48" height="24"/><rect x="171" y="176" width="48" height="24"/>
    <rect x="224" y="176" width="48" height="24"/><rect x="277" y="176" width="48" height="24"/>
    <rect x="12"  y="206" width="48" height="24"/><rect x="65"  y="206" width="48" height="24"/>
    <rect x="118" y="206" width="48" height="24"/><rect x="171" y="206" width="48" height="24"/>
    <rect x="224" y="206" width="48" height="24"/><rect x="277" y="206" width="48" height="24"/>
  </g>
  <rect class="dg-box dg-box--fill" x="118" y="206" width="48" height="24"/>
  <path class="dg-rule dg-rule--key" d="M12 244h316"/>
  <text class="dg-n" x="170" y="262" text-anchor="middle">a salary cap, not a headcount</text>
  <text class="dg-t dg-t--key" x="170" y="280" text-anchor="middle">archetypes · readiness · fit</text>
</svg>`,

  // "A single model answers. A council deliberates."
  // The claim is about the shape of the output, so the drawing shows one line
  // arriving as one line, and eleven arriving as a spread. Eleven means eleven:
  // the fan is counted by .qa, because the label states the number.
  'note-5': `
<svg class="dg" viewBox="12 0 316 312" role="img" aria-labelledby="dg-t5">
  <title id="dg-t5">One model gives one framing; eleven priors give a defensible position</title>

  <text class="dg-t dg-t--anti" x="12" y="16">one model</text>
  <rect class="dg-box dg-box--anti" x="12" y="26" width="90" height="30"/>
  <text class="dg-t" x="57" y="45" text-anchor="middle">model</text>
  <path class="dg-wire dg-wire--anti" d="M102 41h28"/>
  <polygon class="dg-dot dg-dot--anti" points="124,38 130,41 124,44"/>
  <rect class="dg-box dg-box--anti" x="130" y="26" width="130" height="30"/>
  <text class="dg-t dg-t--anti" x="195" y="45" text-anchor="middle">one framing</text>
  <text class="dg-t" x="12" y="76">the one in its training</text>

  <path class="dg-rule" d="M12 94h316"/>

  <text class="dg-t dg-t--key" x="12" y="116">a council</text>
  <path class="dg-wire dg-wire--key" d="M170 122v18"/>
  <polygon class="dg-dot dg-dot--key" points="167,134 170,140 173,134"/>
  <g class="dg-wire dg-wire--key dg-fan">
    <path d="M170 144L40 170M170 144L66 170M170 144L92 170M170 144L118 170M170 144L144 170M170 144L170 170M170 144L196 170M170 144L222 170M170 144L248 170M170 144L274 170M170 144L300 170"/>
  </g>
  <g class="dg-dot dg-dot--key dg-fan-dots">
    <circle cx="40" cy="172" r="2"/><circle cx="66" cy="172" r="2"/><circle cx="92" cy="172" r="2"/>
    <circle cx="118" cy="172" r="2"/><circle cx="144" cy="172" r="2"/><circle cx="170" cy="172" r="2"/>
    <circle cx="196" cy="172" r="2"/><circle cx="222" cy="172" r="2"/><circle cx="248" cy="172" r="2"/>
    <circle cx="274" cy="172" r="2"/><circle cx="300" cy="172" r="2"/>
  </g>
  <text class="dg-t dg-t--key" x="170" y="192" text-anchor="middle">eleven justices, eleven priors</text>
  <rect class="dg-box dg-box--key" x="12" y="202" width="316" height="30"/>
  <text class="dg-t dg-t--key" x="170" y="221" text-anchor="middle">shared transcript</text>
  <path class="dg-wire dg-wire--key" d="M170 232v20"/>
  <polygon class="dg-dot dg-dot--key" points="167,246 170,252 173,246"/>
  <rect class="dg-box dg-box--fill" x="12" y="252" width="316" height="30"/>
  <text class="dg-t dg-t--ink" x="170" y="271" text-anchor="middle">a position you can defend</text>
  <text class="dg-t dg-t--key" x="170" y="304" text-anchor="middle">the disagreement is the product</text>
</svg>`,

  // "Instrument from day one."
  // The claim is about a loop that has to close, so the drawing is that loop,
  // and the tempting shortcut — skipping straight to "measure later" — is the
  // thing struck through. The consequence beneath it is true, so it stands.
  'note-6': `
<svg class="dg" viewBox="12 0 316 214" role="img" aria-labelledby="dg-t6">
  <title id="dg-t6">Ship, measure, learn, ship again — with the shortcut struck out</title>

  <rect class="dg-box dg-box--key" x="12"  y="26" width="90" height="34"/>
  <rect class="dg-box dg-box--key" x="125" y="26" width="90" height="34"/>
  <rect class="dg-box dg-box--key" x="238" y="26" width="90" height="34"/>
  <text class="dg-t dg-t--key" x="57"  y="47" text-anchor="middle">ship</text>
  <text class="dg-t dg-t--key" x="170" y="47" text-anchor="middle">measure</text>
  <text class="dg-t dg-t--key" x="283" y="47" text-anchor="middle">learn</text>
  <path class="dg-wire dg-wire--key" d="M102 43h23M215 43h23"/>
  <polygon class="dg-dot dg-dot--key" points="119,40 125,43 119,46"/>
  <polygon class="dg-dot dg-dot--key" points="232,40 238,43 232,46"/>
  <path class="dg-wire dg-wire--key" d="M283 60v30H57V60"/>
  <polygon class="dg-dot dg-dot--key" points="54,67 57,60 60,67"/>
  <text class="dg-n" x="170" y="110" text-anchor="middle">the next version is built from this one</text>

  <path class="dg-wire dg-wire--ghost" d="M35 60v89h75"/>
  <polygon class="dg-dot" points="104,146 110,149 104,152"/>
  <rect class="dg-box" x="110" y="134" width="120" height="30"/>
  <text class="dg-t" x="170" y="153" text-anchor="middle">measure later</text>
  <path class="dg-strike" d="M104 149h132"/>
  <text class="dg-t dg-t--anti" x="170" y="188" text-anchor="middle">measuring a live system afterwards</text>
  <text class="dg-t dg-t--anti" x="170" y="204" text-anchor="middle">is close to impossible</text>
</svg>`,

  // "The desk"
  // The claim is about where the work happens, so the drawing is one machine
  // with the whole chain inside it. The cloud is drawn, not struck: it is used,
  // only for what cannot run in the room.
  'stack': `
<svg class="dg" viewBox="12 0 316 216" role="img" aria-labelledby="dg-t7">
  <title id="dg-t7">One machine in Bangkok runs inference, build and deploy</title>

  <rect class="dg-box" x="44" y="26" width="252" height="130"/>
  <text class="dg-t dg-t--ink" x="52" y="46">one machine · bangkok</text>

  <rect class="dg-box dg-box--key" x="52"  y="60" width="70" height="30"/>
  <rect class="dg-box dg-box--key" x="137" y="60" width="70" height="30"/>
  <rect class="dg-box dg-box--key" x="222" y="60" width="70" height="30"/>
  <text class="dg-t dg-t--key" x="87"  y="79" text-anchor="middle">inference</text>
  <text class="dg-t dg-t--key" x="172" y="79" text-anchor="middle">build</text>
  <text class="dg-t dg-t--key" x="257" y="79" text-anchor="middle">deploy</text>
  <path class="dg-wire dg-wire--key" d="M122 75h15M207 75h15"/>
  <polygon class="dg-dot dg-dot--key" points="131,72 137,75 131,78"/>
  <polygon class="dg-dot dg-dot--key" points="216,72 222,75 216,78"/>
  <text class="dg-k dg-k--sm" x="170" y="120" text-anchor="middle">no build team</text>
  <text class="dg-k dg-k--sm" x="170" y="138" text-anchor="middle">no vendor in the middle</text>

  <text class="dg-t" x="12" y="66">code</text>
  <path class="dg-wire" d="M12 75h32"/>
  <polygon class="dg-dot" points="38,72 44,75 38,78"/>
  <text class="dg-t" x="328" y="66" text-anchor="end">site</text>
  <path class="dg-wire" d="M296 75h32"/>
  <polygon class="dg-dot" points="322,72 328,75 322,78"/>

  <rect class="dg-box dg-box--anti" x="44" y="176" width="252" height="30"/>
  <text class="dg-t dg-t--anti" x="170" y="195" text-anchor="middle">cloud: only what cannot run here</text>
</svg>`

};
