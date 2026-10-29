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
window.AXIOM_DIAGRAMS = {

  // "The vendor said no. We shipped in fourteen days."
  // The claim is about elapsed time, so the drawing is two lanes on one clock.
  'note-1': `
<svg class="dg" viewBox="0 0 440 250" role="img" aria-labelledby="dg-t1">
  <title id="dg-t1">Two lanes: the proposal loop, and the rough version</title>

  <text class="dg-t dg-t--anti" x="12" y="16">the loop</text>
  <rect class="dg-box dg-box--anti" x="12"  y="28" width="84" height="30"/>
  <rect class="dg-box dg-box--anti" x="116" y="28" width="84" height="30"/>
  <rect class="dg-box dg-box--anti" x="220" y="28" width="84" height="30"/>
  <rect class="dg-box dg-box--anti" x="324" y="28" width="84" height="30"/>
  <text class="dg-t" x="54"  y="47" text-anchor="middle">spec</text>
  <text class="dg-t" x="158" y="47" text-anchor="middle">quote</text>
  <text class="dg-t" x="262" y="47" text-anchor="middle">committee</text>
  <text class="dg-t dg-t--anti" x="366" y="47" text-anchor="middle">no</text>
  <path class="dg-wire dg-wire--anti" d="M96 43h16M200 43h16M304 43h16" marker-end="none"/>
  <polygon class="dg-dot dg-dot--anti" points="104,40 112,43 104,46"/>
  <polygon class="dg-dot dg-dot--anti" points="208,40 216,43 208,46"/>
  <polygon class="dg-dot dg-dot--anti" points="312,40 320,43 312,46"/>
  <path class="dg-wire dg-wire--ghost" d="M366 62v22H54V64"/>
  <polygon class="dg-dot" points="51,72 54,64 57,72"/>
  <text class="dg-t" x="210" y="96" text-anchor="middle">and the committee asks for a different spec</text>

  <text class="dg-t dg-t--key" x="12" y="140">the rough version</text>
  <rect class="dg-box dg-box--key" x="12"  y="152" width="120" height="34"/>
  <rect class="dg-box dg-box--key" x="160" y="152" width="120" height="34"/>
  <rect class="dg-box dg-box--key" x="308" y="152" width="120" height="34"/>
  <text class="dg-k" x="72"  y="167" text-anchor="middle">Stand it up</text>
  <text class="dg-k dg-k--sm" x="72"  y="180" text-anchor="middle">rough, live</text>
  <text class="dg-k" x="220" y="167" text-anchor="middle">In the room</text>
  <text class="dg-k dg-k--sm" x="220" y="180" text-anchor="middle">with a governor</text>
  <text class="dg-k" x="368" y="167" text-anchor="middle">Decide</text>
  <text class="dg-k dg-k--sm" x="368" y="180" text-anchor="middle">on evidence</text>
  <path class="dg-wire dg-wire--key" d="M132 169h24M280 169h24"/>
  <polygon class="dg-dot dg-dot--key" points="148,166 156,169 148,172"/>
  <polygon class="dg-dot dg-dot--key" points="296,166 304,169 296,172"/>
  <path class="dg-rule dg-rule--key" d="M12 206h416"/>
  <path class="dg-wire dg-wire--key" d="M12 206v8M428 206v8"/>
  <text class="dg-n" x="220" y="232" text-anchor="middle">14 days, end to end</text>
</svg>`,

  // "AI-native is not AI-assisted."
  // The claim is about who does what, so the drawing is two roles and a
  // direction of travel, with the review arrow drawn ghosted because it is the
  // part people forget.
  'note-2': `
<svg class="dg" viewBox="0 0 440 250" role="img" aria-labelledby="dg-t2">
  <title id="dg-t2">Human as architect directs, model as engineer builds, human reviews</title>

  <rect class="dg-box" x="12" y="30" width="150" height="76"/>
  <text class="dg-t dg-t--ink" x="28" y="52">human</text>
  <text class="dg-k" x="28" y="72">architect</text>
  <text class="dg-k dg-k--sm" x="28" y="90">decides what is true</text>

  <rect class="dg-box dg-box--key" x="278" y="30" width="150" height="76"/>
  <text class="dg-t dg-t--key" x="294" y="52">model</text>
  <text class="dg-k" x="294" y="72">engineer</text>
  <text class="dg-k dg-k--sm" x="294" y="90">writes every line</text>

  <path class="dg-wire dg-wire--key" d="M162 68h112"/>
  <polygon class="dg-dot dg-dot--key" points="266,65 274,68 266,71"/>
  <text class="dg-t dg-t--key" x="218" y="60" text-anchor="middle">direction</text>
  <text class="dg-t" x="218" y="86" text-anchor="middle">not typing</text>

  <rect class="dg-box dg-box--fill" x="12" y="170" width="416" height="44"/>
  <text class="dg-t dg-t--ink" x="220" y="189" text-anchor="middle">the system, running</text>
  <text class="dg-k dg-k--sm" x="220" y="205" text-anchor="middle">reviewed, kept or thrown away</text>

  <path class="dg-wire dg-wire--key" d="M353 106v58"/>
  <polygon class="dg-dot dg-dot--key" points="350,162 353,170 356,162"/>
  <path class="dg-wire dg-wire--ghost" d="M150 170v-58"/>
  <polygon class="dg-dot" points="147,116 150,108 153,116"/>
  <text class="dg-t" x="60" y="146">the skill that compounds</text>
</svg>`,

  // "The problem is never the data."
  // The claim is about order, so the drawing is the same four things twice, in
  // two orders, and the wrong one dead-ends.
  'note-3': `
<svg class="dg" viewBox="0 0 440 260" role="img" aria-labelledby="dg-t3">
  <title id="dg-t3">The same work in the wrong order and the right order</title>

  <text class="dg-t dg-t--anti" x="12" y="18">if you start with feeds</text>
  <rect class="dg-box dg-box--anti" x="12" y="30" width="86" height="26"/>
  <rect class="dg-box dg-box--anti" x="12" y="70" width="86" height="26"/>
  <rect class="dg-box dg-box--anti" x="12" y="110" width="86" height="26"/>
  <text class="dg-t" x="55" y="47" text-anchor="middle">feeds</text>
  <text class="dg-t" x="55" y="87" text-anchor="middle">stack</text>
  <text class="dg-t" x="55" y="127" text-anchor="middle">screen</text>
  <path class="dg-wire dg-wire--anti" d="M55 56v12M55 96v12"/>
  <polygon class="dg-dot dg-dot--anti" points="52,62 55,70 58,62"/>
  <polygon class="dg-dot dg-dot--anti" points="52,102 55,110 58,102"/>
  <rect class="dg-box dg-box--anti" x="12" y="158" width="86" height="26"/>
  <text class="dg-t dg-t--anti" x="55" y="175" text-anchor="middle">nobody opens it</text>
  <path class="dg-wire dg-wire--anti" d="M55 136v20"/>
  <polygon class="dg-dot dg-dot--anti" points="52,150 55,158 58,150"/>
  <path class="dg-strike" d="M6 171h98"/>

  <path class="dg-rule" d="M220 14v226"/>

  <text class="dg-t dg-t--key" x="252" y="18">if you start with the decision</text>
  <rect class="dg-box dg-box--key" x="252" y="30" width="176" height="34"/>
  <text class="dg-k" x="340" y="52" text-anchor="middle">one decision, made faster</text>
  <rect class="dg-box dg-box--key" x="252" y="102" width="54" height="24"/>
  <rect class="dg-box dg-box--key" x="314" y="102" width="54" height="24"/>
  <rect class="dg-box dg-box--key" x="376" y="102" width="52" height="24"/>
  <text class="dg-t" x="279" y="118" text-anchor="middle">feeds</text>
  <text class="dg-t" x="341" y="118" text-anchor="middle">stack</text>
  <text class="dg-t" x="402" y="118" text-anchor="middle">iface</text>
  <!-- one bus, three drops: the decision feeds all three, not only the middle -->
  <path class="dg-wire dg-wire--key" d="M340 64v20M279 84h123M279 84v14M341 84v14M402 84v14"/>
  <polygon class="dg-dot dg-dot--key" points="276,98 279,106 282,98"/>
  <polygon class="dg-dot dg-dot--key" points="338,98 341,106 344,98"/>
  <polygon class="dg-dot dg-dot--key" points="399,98 402,106 405,98"/>
  <text class="dg-t" x="340" y="152" text-anchor="middle">these follow the decision</text>
  <text class="dg-t" x="340" y="168" text-anchor="middle">they do not find it</text>
</svg>`,

  // "An org chart is not a team."
  // The claim is a substitution, so the drawing puts a tree beside a portfolio
  // and lets the shapes argue it.
  'note-4': `
<svg class="dg" viewBox="0 0 440 240" role="img" aria-labelledby="dg-t4">
  <title id="dg-t4">A reporting tree beside a portfolio of archetypes</title>

  <text class="dg-t dg-t--anti" x="12" y="18">who reports to whom</text>
  <rect class="dg-box dg-box--anti" x="46" y="30" width="84" height="24"/>
  <text class="dg-t" x="88" y="46" text-anchor="middle">director</text>
  <rect class="dg-box dg-box--anti" x="12" y="86" width="60" height="24"/>
  <rect class="dg-box dg-box--anti" x="80" y="86" width="60" height="24"/>
  <rect class="dg-box dg-box--anti" x="148" y="86" width="60" height="24"/>
  <text class="dg-t" x="42"  y="102" text-anchor="middle">reports</text>
  <text class="dg-t" x="110" y="102" text-anchor="middle">reports</text>
  <text class="dg-t" x="178" y="102" text-anchor="middle">reports</text>
  <path class="dg-wire dg-wire--anti" d="M88 54v14H42v16M88 68h22v16M88 68h104v16"/>
  <text class="dg-t dg-t--anti" x="110" y="140" text-anchor="middle">says nothing about the work</text>

  <path class="dg-rule" d="M220 14v212"/>

  <text class="dg-t dg-t--key" x="252" y="18">who builds what, with whom</text>
  <g class="dg-box dg-box--key">
    <rect x="252" y="32" width="40" height="26"/>
    <rect x="298" y="32" width="40" height="26"/>
    <rect x="344" y="32" width="40" height="26"/>
    <rect x="390" y="32" width="38" height="26"/>
    <rect x="252" y="64" width="40" height="26"/>
    <rect x="298" y="64" width="40" height="26"/>
    <rect x="344" y="64" width="40" height="26"/>
    <rect x="390" y="64" width="38" height="26"/>
    <rect x="252" y="96" width="40" height="26"/>
    <rect x="298" y="96" width="40" height="26"/>
    <rect x="344" y="96" width="40" height="26"/>
    <rect x="390" y="96" width="38" height="26"/>
  </g>
  <rect class="dg-box dg-box--fill" x="298" y="64" width="40" height="26"/>
  <path class="dg-rule dg-rule--key" d="M248 136h184"/>
  <text class="dg-n" x="340" y="152" text-anchor="middle">a salary cap, not a headcount</text>
  <text class="dg-t dg-t--key" x="340" y="176" text-anchor="middle">archetypes · readiness · fit</text>
</svg>`,

  // "A single model answers. A council deliberates."
  // The claim is about the shape of the output, so the drawing shows one line
  // arriving as one line, and eleven arriving as a spread.
  'note-5': `
<svg class="dg" viewBox="0 0 440 250" role="img" aria-labelledby="dg-t5">
  <title id="dg-t5">One model gives one framing; eleven priors give a defensible position</title>

  <text class="dg-t dg-t--anti" x="12" y="18">one model</text>
  <rect class="dg-box dg-box--anti" x="12" y="58" width="62" height="30"/>
  <text class="dg-t" x="43" y="77" text-anchor="middle">model</text>
  <path class="dg-wire dg-wire--anti" d="M74 73h30"/>
  <polygon class="dg-dot dg-dot--anti" points="96,70 104,73 96,76"/>
  <rect class="dg-box dg-box--anti" x="106" y="58" width="104" height="30"/>
  <text class="dg-t dg-t--anti" x="158" y="77" text-anchor="middle">one framing</text>
  <text class="dg-t" x="12" y="118">the one in its training</text>

  <path class="dg-rule" d="M220 14v222"/>

  <text class="dg-t dg-t--key" x="252" y="18">a council</text>
  <path class="dg-wire dg-wire--key" d="M330 30v22"/>
  <polygon class="dg-dot dg-dot--key" points="327,46 330,54 333,46"/>
  <g class="dg-wire dg-wire--key">
    <path d="M330 62L268 84M330 62L290 84M330 62L312 84M330 62L334 84M330 62L356 84M330 62L378 84M330 62L400 84"/>
  </g>
  <g class="dg-dot dg-dot--key">
    <circle cx="268" cy="88" r="2"/><circle cx="290" cy="88" r="2"/><circle cx="312" cy="88" r="2"/>
    <circle cx="334" cy="88" r="2"/><circle cx="356" cy="88" r="2"/><circle cx="378" cy="88" r="2"/><circle cx="400" cy="88" r="2"/>
  </g>
  <text class="dg-t dg-t--key" x="334" y="108" text-anchor="middle">eleven justices, eleven priors</text>
  <rect class="dg-box dg-box--key" x="252" y="124" width="176" height="30"/>
  <text class="dg-t dg-t--key" x="340" y="143" text-anchor="middle">shared transcript</text>
  <path class="dg-wire dg-wire--key" d="M340 154v22"/>
  <polygon class="dg-dot dg-dot--key" points="337,180 340,188 343,180"/>
  <rect class="dg-box dg-box--fill" x="252" y="188" width="176" height="30"/>
  <text class="dg-t dg-t--ink" x="340" y="207" text-anchor="middle">a position you can defend</text>
  <text class="dg-t dg-t--key" x="334" y="240" text-anchor="middle">the disagreement is the product</text>
</svg>`,

  // "Instrument from day one."
  // The claim is about a loop that has to close, so the drawing is that loop,
  // with the tempting shortcut struck through.
  'note-6': `
<svg class="dg" viewBox="0 0 440 250" role="img" aria-labelledby="dg-t6">
  <title id="dg-t6">Ship, measure, learn, ship again — with the shortcut struck out</title>

  <rect class="dg-box dg-box--key" x="12"   y="40" width="94" height="34"/>
  <rect class="dg-box dg-box--key" x="173" y="40" width="94" height="34"/>
  <rect class="dg-box dg-box--key" x="334" y="40" width="94" height="34"/>
  <text class="dg-t dg-t--key" x="59"  y="61" text-anchor="middle">ship</text>
  <text class="dg-t dg-t--key" x="220" y="61" text-anchor="middle">measure</text>
  <text class="dg-t dg-t--key" x="381" y="61" text-anchor="middle">learn</text>
  <path class="dg-wire dg-wire--key" d="M106 57h63M267 57h63"/>
  <polygon class="dg-dot dg-dot--key" points="161,54 169,57 161,60"/>
  <polygon class="dg-dot dg-dot--key" points="322,54 330,57 322,60"/>

  <path class="dg-wire dg-wire--key" d="M381 74v46H59V78"/>
  <polygon class="dg-dot dg-dot--key" points="56,82 59,74 62,82"/>
  <text class="dg-n" x="220" y="134" text-anchor="middle">the next version is built from this one</text>

  <rect class="dg-box" x="173" y="160" width="94" height="30"/>
  <text class="dg-t" x="220" y="179" text-anchor="middle">measure later</text>
  <path class="dg-wire dg-wire--ghost" d="M173 175h-60v-46"/>
  <polygon class="dg-dot" points="110,137 113,129 116,137"/>
  <text class="dg-t dg-t--anti" x="59" y="206" text-anchor="middle">measuring a live system</text>
  <text class="dg-t dg-t--anti" x="59" y="220" text-anchor="middle">afterwards is close to impossible</text>
  <path class="dg-strike" d="M9 198h104"/>
</svg>`,

  // "The desk"
  // The claim is about where the work happens, so the drawing is one machine
  // with three jobs inside it and nothing outside it.
  'stack': `
<svg class="dg" viewBox="0 0 440 250" role="img" aria-labelledby="dg-t7">
  <title id="dg-t7">One machine in Bangkok runs inference, build and deploy</title>

  <rect class="dg-box" x="60" y="26" width="320" height="150"/>
  <text class="dg-t dg-t--ink" x="76" y="48">one machine · bangkok</text>

  <rect class="dg-box dg-box--key" x="76"  y="62" width="88" height="34"/>
  <rect class="dg-box dg-box--key" x="176" y="62" width="88" height="34"/>
  <rect class="dg-box dg-box--key" x="276" y="62" width="88" height="34"/>
  <text class="dg-t dg-t--key" x="120" y="83" text-anchor="middle">inference</text>
  <text class="dg-t dg-t--key" x="220" y="83" text-anchor="middle">build</text>
  <text class="dg-t dg-t--key" x="320" y="83" text-anchor="middle">deploy</text>
  <path class="dg-wire dg-wire--key" d="M120 100v24h100v-24"/>
  <polygon class="dg-dot dg-dot--key" points="217,116 220,124 223,116"/>
  <path class="dg-wire dg-wire--key" d="M320 100v24H220"/>
  <text class="dg-k dg-k--sm" x="220" y="152" text-anchor="middle">no build team · no vendor in the middle</text>

  <path class="dg-wire" d="M12 101h42"/>
  <polygon class="dg-dot" points="46,98 54,101 46,104"/>
  <text class="dg-t" x="12" y="88">code</text>
  <path class="dg-wire" d="M386 101h42"/>
  <polygon class="dg-dot" points="420,98 428,101 420,104"/>
  <text class="dg-t" x="428" y="88" text-anchor="end">site</text>

  <rect class="dg-box dg-box--anti" x="60" y="200" width="320" height="30"/>
  <text class="dg-t dg-t--anti" x="220" y="219" text-anchor="middle">the cloud, for things that do not run here</text>
  <path class="dg-strike" d="M52 215h336"/>
</svg>`

};