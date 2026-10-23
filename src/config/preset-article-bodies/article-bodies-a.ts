import type { PresetId } from "../presets";

/**
 * Structured article bodies — Part A: Speed & Viral, Stereo & Spatial,
 * Bass & Equalizer, Reverb & Echo. Rendered by
 * `src/components/blog/preset-article.tsx`; parameter tables are derived
 * directly from `src/config/presets.ts`, so spec claims always match the UI.
 */
export interface PresetArticleBody {
  presetId: PresetId;
  slug: string;
  /** One-paragraph plain-language framing (what it is / when to reach for it). */
  what: string;
  /** Optional second framing paragraph (context, history, physics) from `details.ts`. */
  detail?: string;
  /** Perceptual description of the result. */
  sound: string;
  /** Numbered DSP steps — every claim reflects the actual render pipeline. */
  dsp: string[];
  /** Author-picked practical tips. */
  tips: string[];
  /** Concrete use cases. */
  useCases: string[];
  /** Related guide slugs (must exist in the registry). */
  related: string[];
}

export const articleBodiesA: PresetArticleBody[] = [
  // ============ Speed & Viral Edits ============
  {
    presetId: "slowed",
    slug: "slowed",
    what:
      "Slowed is the pure playback-rate edit: one number, no filters. Because the whole file is resampled by playbackRate, everything falls together — pitch drops, tempo drops, the file gets longer. That coupling is not a bug; it is exactly the texture slowed edits rely on. Reach for it when you want the classic deceleration without reverb gloss.",
    sound:
      "Darker, thicker, slightly older. Formants shift downward so the voice sits deeper in the chest, low-end weight grows faster than the top end, and the whole track feels like it is breathing at half its usual pace.",
    dsp: [
      "Resolve the target rate: presets map to 0.85×, at lower values super-slowed territory begins.",
      "Compute the final playbackRate as base × (speed / 100), so 85% becomes 0.85×.",
      "Set AudioBufferSourceNode.playbackRate to that value in the OfflineAudioContext.",
      "Extend the output window proportionally (duration ÷ rate) so nothing gets clipped at the tail.",
      "Peak protection (on by default) runs after the render: look-ahead sliding-minimum limiting at a −0.3 dBFS sample-peak ceiling. Slowed low-end frequently crosses it.",
    ],
    tips: [
      "0.85× is the cultural sweet spot; below 0.75× vocals start to sound like a different person.",
      "Because pitch drops ~3.6% at 0.85×, keys change — re-pitched samples may clash with acapellas you layer later.",
      "Pair with the Small Room Reverb guide if you eventually want the full slowed-and-reverb look.",
      "Slowed audio magnifies source noise; clean rumble first for the best result.",
    ],
    useCases: ["Viral slowed edits", "Chill/chillhop transitions", "Vocal texture experiments"],
    related: ["slowed-reverb", "super-slowed", "daycore"],
  },
  {
    presetId: "super-slowed",
    slug: "super-slowed",
    what:
      "Super Slowed pushes the rate down to 0.60×–0.70×. At this depth the edit stops being a filter tweak and becomes a time re-reading of the song: drum grooves lay open, consonants smear, and sub energy takes over. It is a statement edit — use it deliberately, not as a default.",
    sound:
      "Deep, syrupy, almost underwater. Timbre sits an octave-feeling darker, bass swells, consonants drift into quiet melody, and any fine detail in the highs is traded away for mood.",
    dsp: [
      "playbackRate resolves to roughly 0.6×–0.7× via the speed parameter.",
      "The render window is recomputed to duration ÷ rate — a 3-minute song at 0.6× renders about 5 minutes of output.",
      "No EQ, no reverb: this is the unadorned resample so you control what gets layered next.",
      "Peak protection (on by default) catches bass transients that grew past full-scale — look-ahead sliding-minimum limiting at a −0.3 dBFS sample-peak ceiling.",
    ],
    tips: [
      "Render a second version at 0.85× and A/B them; super-slow wears out faster than it lands.",
      "For vocals-heavy material, consider the Sub Warmth parameter family instead of stacking a bass preset on top.",
      "No silence trimming happens: the render window is exactly duration ÷ rate, so silence already in the source stays in the export. Trim it first if that matters.",
      "If the result feels hollow rather than deep, add Medium Room Reverb, not more bass.",
    ],
    useCases: ["Dramatic intros", "Sleep/regen playlists", "Remix foundations"],
    related: ["slowed", "slowed-reverb", "underwater"],
  },
  {
    presetId: "sped-up",
    slug: "sped-up",
    what:
      "Sped-Up inverts the slowed formula: playback rate up, pitch up, tempo up, file shorter. It is the edit that made sped-up tags a chart staple. Motion and urgency come free; the risk is candy-bright vocals if you go too fast.",
    sound:
      "Brighter, quicker, tighter. Highs sharpen, low-end thins slightly, and the groove compresses into an eager bounce.",
    dsp: [
      "playbackRate resolves above 1.0 — typical presets land at 1.15×–1.25×.",
      "Source playback rate drives the entire resample, matching the slowed presets in reverse.",
      "Duration shrinks to duration ÷ rate, so a 3-minute track at 1.2× renders about 2:30.",
      "Peak protection (on by default) keeps bright, fast transients under a −0.3 dBFS sample-peak ceiling using look-ahead sliding-minimum limiting.",
    ],
    tips: [
      "Stay under ~1.30× — beyond that, intelligibility collapses and sibilance crowds.",
      "Key rises about +1.75 semitones at 1.1×; if you plan a mashup, check the resulting key first.",
      "Sped-up + Vocal Clarity glosses vocals that the speed boost roughened.",
      "This cannot do tempo-only speedup: pitch moves in lockstep by design.",
    ],
    useCases: ["TikTok/Reels hooks", "Pre-effected demo renders", "Pitched collabs"],
    related: ["nightcore-daycore", "slowed", "pitch-shifter"],
  },
  {
    presetId: "daycore",
    slug: "daycore",
    what:
      "Daycore is nightcore's sleepy twin: instead of running faster, the track runs slower. It is varispeed plus a small low-shelf lift — pitch and tempo move together, and there is no separate reverb or filter stage supplying the mood.",
    sound:
      "Gentle, heavy, half-asleep. The slowdown lowers pitch and tempo together, while a +4 dB low-shelf at 90 Hz thickens the low end.",
    dsp: [
      "playbackRate resolves to roughly 0.70×–0.95× from the Speed slider. Pitch Offset adds more semitones as extra varispeed, not as a separate pitch shift.",
      "A low-shelf biquad at 90 Hz adds +4 dB by default (0–8 dB range) for weight.",
      "No reverb, lowpass or exciter stage: the whole preset is varispeed plus that shelf.",
      "Peak protection, when enabled, limits the result at a −0.3 dBFS sample-peak ceiling.",
    ],
    tips: [
      "Because pitch and tempo are coupled, a −12% speed change is also about −2.2 semitones — check the key before layering.",
      "Jittery consonants are the giveaway that you slowed too far; 85–90% is the usual landing zone.",
      "If the result feels hollow rather than deep, add Medium Room Reverb, not more bass.",
      "Test on small speakers; slowing pushes energy down faster than most phone drivers can reproduce.",
    ],
    useCases: ["Dream-pop edits", "Lo-fi study playlists", "Ambient intros"],
    related: ["nightcore-daycore", "slowed-reverb", "treble-air"],
  },

  // ============ Stereo & Spatial ============
  {
    presetId: "auto-panner",
    slug: "auto-panner",
    what:
      "The Auto Panner rhythmically swings mono material from left to right on a repeating LFO-style curve. Unlike the manual Stereo Panner, it moves continuously — a groove effect as much as a spatial one. Great on pads, arps and ad-libs; dangerous if you forget to disengage before mixing it hard in both speakers.",
    sound:
      "A pendulum: the sound sways with a metronome-like evenness, gently sweeping the stereo field at the cycle time you choose.",
    dsp: [
      "The render creates a StereoPannerNode and drives its pan parameter with an oscillator LFO — a continuous sweep, not stepped automation.",
      "The LFO period is 6 − speed/100 · 5 seconds: 6 s at 0, 1 s at 100.",
      "A mono source is up-mixed to two channels before the panner, so no channel or level is lost.",
      "The sweep happens before peak protection, which is on by default at a −0.3 dBFS ceiling.",
    ],
    tips: [
      "Lock the cycle to a musical division: listen for the swing to land on the downbeat.",
      "On lead vocals, shorten the swing to taste — wide hard-swinging panning masks lyrics.",
      "Width feels widest with Ping-Pong Echo layered underneath it.",
      "The effect is rendered before peak protection; if you disable it, check bass-heavy material for overs.",
    ],
    useCases: ["Synth movement", "Ad-libs and ear candy", "Ambient swells"],
    related: ["stereo-panner", "ping-pong", "stereo-widening"],
  },
  {
    presetId: "stereo-panner",
    slug: "stereo-panner",
    what:
      "Manual Stereo Panning is placement, not motion: one constant position, left or right, decided by you. It is the least glamorous stereo tool and the most-used one in a real session — hard placement is how a mix breathes before any widening is even considered.",
    sound:
      "The source sits at a fixed spot between the speakers; anchoring separates it from the rest of the stereo image without changing its tonal character.",
    dsp: [
      "Material is routed through a StereoPannerNode with a static pan value.",
      "Panning uses the browser's constant-power law, so centered and hard-panned levels are perceptually matched.",
      "Mono sources are up-mixed first, then panned — no channel is lost.",
      "The fixed gain stays at 0 dB, so the source never gets quieter just because it moved sideways.",
    ],
    tips: [
      "Pan before widening or reverb; the space should wrap a placed source, not place the space.",
      "Constant-power law means the perceived loudness barely drops at hard L/R — trust your ears, not level meters.",
      "For motion instead of placement, that's the Auto Panner's job.",
      "Pure placement effects are most convincing when your track was mixed in stereo to begin with.",
    ],
    useCases: ["Instrument placement", "Call-and-response layering", "Dry vocal anchoring"],
    related: ["auto-panner", "stereo-widening", "ping-pong"],
  },
  {
    presetId: "stereo-widening",
    slug: "stereo-widening",
    what:
      "Stereo Widening spreads the difference between your left and right channels. It decomposes the stereo pair into mid (center energy) and side (difference), multiplies the side by a width factor, and rebuilds the pair. Widening is an illusion of space: it can raise peaks and it weakens mono compatibility, so restraint is the whole game.",
    sound:
      "The mix opens outward: reverb tails bloom beyond the speakers, hard-panned elements feel further apart, and the center stays anchored in place.",
    dsp: [
      "Mid = (L + R) / 2; Side = (L − R) / 2 — computed with channel splitters and inverted-gain buses.",
      "The width parameter scales the side signal: 50% is neutral (1.0× side base), 100% doubles side energy, 10% nearly collapses to mono.",
      "L′ = Mid + k·Side and R′ = Mid − k·Side rebuild the widened pair via a channel merger.",
      "Fails safe on mono: width processing is skipped entirely, so a mono file passes through unchanged rather than being faked into stereo.",
      "Processed inside the offline render, before the optional peak limiter.",
    ],
    tips: [
      "Above ~80% width, mono-foldback collapse becomes audible on phone speakers — check by listening to the downmix.",
      "Widen before mid/side-heavy processing like Mastering Polish; order matters.",
      "If you need center vocals to stay put, they do — the mid channel is left untouched by the scale factor.",
      "Pair with the 9 kHz Air shelf to sell the 'bigger speakers' illusion further.",
    ],
    useCases: ["Polished masters", "EDM and ambient finalization", "Fixing a crunched mono mix"],
    related: ["treble-air", "mastering-polish", "auto-panner"],
  },
  {
    presetId: "ping-pong",
    slug: "ping-pong",
    what:
      "Ping-Pong Echo bounces repeats alternately between left and right — each repeat flips sides. It turns a delay line into a bouncing spatial rhythm, legendary on dub vocals and experimental percussion. Echo intensity and feedback are separate controls: how loud the repeats are, and how long they survive.",
    sound:
      "Repeats ping-pong across the stereo field, growing softer with each hop; high feedback blurs into a braided wash, low feedback keeps distinct bounces.",
    dsp: [
      "The echo send is high-passed at 180 Hz and forced to mono before a 320 ms DelayNode.",
      "The feedback loop alternates left and right at ±0.85 pan; feedback gain is 0.2 + size/100 · 0.55, clamped to 0.85.",
      "The wet tail is computed down to −60 dB and added to the render window, so repeats are not cut off.",
      "Peak protection (default on) limits stacked repeats at a −0.3 dBFS sample peak instead of letting feedback clip.",
    ],
    tips: [
      "Feedback above ~60% with heavy echo reads as walls — leave headroom or it will self-oscillate musically.",
      "On percussive stems, sync bounces to the grid by ear before printing.",
      "Great partner to Vocal Reverb if you want space plus movement rather than a static wash.",
      "The group of echoes shouldn't push mids; De-Harsh after bounce keeps the tail bright, not brittle.",
    ],
    useCases: ["Dub-style vocals", "Sound design transitions", "Spatial ear candy"],
    related: ["vocal-reverb", "auto-panner", "de-harsh"],
  },

  // ============ Bass & Equalizer ============
  {
    presetId: "bass-boost-light",
    slug: "bass-boost-light",
    what:
      "Light Bass Boost is the polite tier: a modest low-shelf lift that thickens without asking the limiter for help. If your track plays on phone speakers or is destined for a quiet podcast, this is the amount of bass that survives both worlds.",
    sound:
      "Noticeable weight and warmth, subtle on instruments, barely changes vocal character. On decent speakers it reads as 'richer', not 'bassier'.",
    dsp: [
      "A low-shelf biquad at 95 Hz lifts bass by +3.5 dB by default (0–6 dB range).",
      "No high-pass is applied — this tier only adds gain below the shelf corner.",
      "Peak protection (on by default) rarely engages here; it limits at a −0.3 dBFS sample peak.",
      "Channels are preserved: a stereo source stays stereo and a mono source stays mono.",
    ],
    tips: [
      "If you can hear the boost working, it is probably already too much for dialogue content.",
      "Stack two bands of bass work in this tier rather than one extreme: fewer artifacts, more control.",
      "On small speakers, light bass is often the maximum that doesn't muddy phones.",
      "Check the downmixer guide for mono-safe loudness on delivery.",
    ],
    useCases: ["Podcasts", "Quiet listening", "Subtle thickening"],
    related: ["bass-boost-mod", "downmixer", "equalizer"],
  },
  {
    presetId: "bass-boost-mod",
    slug: "bass-boost-mod",
    what:
      "Medium Bass Boost is the working tier: enough low-shelf gain to feel like a real bass preset, still low enough that the ceiling limiter only trims transients instead of reshaping the groove. If you are unsure which tier to pick, this one does the most while asking the least.",
    sound:
      "Full, obvious sub weight on every playback device, vocals stay clear, and percussive mids stay forward.",
    dsp: [
      "A low-shelf biquad at 85 Hz adds +7 dB by default (4–10 dB range).",
      "No high-pass is applied; the preset is shelf gain only. Run Rumble Cut first if subsonic energy is a problem.",
      "Peak protection (default on) is a look-ahead sliding-minimum limiter at −0.3 dBFS, not a tanh soft-clipper.",
      "Peak normalize (optional) lifts the loudest sample to −0.5 dBFS after the render.",
    ],
    tips: [
      "Heavy gear and cheap gear disagree: audition on both before committing to this tier.",
      "If it pumps, drop to Light — pumped bass boost nearly always means the limiter is doing tone-shaping it should not.",
      "Want the loudness matched feel? Pair with Peak Normalization, not more boost.",
      "For vocals-led tracks, cut De-Harsh around headphones to tuck the sibilance back.",
    ],
    useCases: ["Car stereo tests", "Dance/stream edits", "Sub-forward vocals and beats"],
    related: ["bass-boost-light", "bass-boost-heavy", "mastering-polish"],
  },
  {
    presetId: "bass-boost-heavy",
    slug: "bass-boost-heavy",
    what:
      "Heavy Bass Boost is the tier where peak protection earns its keep: +10.5 dB of low shelf is enough that the limiter engages on most transients. Massive weight, and the trade-off is trusting the ceiling instead of your meters.",
    sound:
      "Bass-forward physical presence, the visual 'speaker slam' on each hit. Details in the mids sit back; everything feels muscular.",
    dsp: [
      "The low-shelf sits at 75 Hz with +10.5 dB by default (8–14 dB range).",
      "Peak protection (default on) catches the resulting overs with look-ahead sliding-minimum limiting at a −0.3 dBFS sample peak.",
      "No saturation or harmonic stage is added; the preset is shelf gain plus the engine's limiter.",
      "Mono-foldback is safe only while peak protection is on — with it off, the boosted sum can exceed full scale.",
    ],
    tips: [
      "Heavy is the limiter's job, not yours: leave peak protection on for this tier.",
      "If it pumps or chugs, the limiter is working hard — drop to Moderate rather than disabling it.",
      "This tier costs headroom; follow up with Mastering Polish only if you actually need glue.",
      "Phone speakers cannot reproduce what this tier adds — judge it on big drivers.",
    ],
    useCases: ["Bass-heavy edits", "Mixdown reference", "Gym/trap edits"],
    related: ["bass-boost-extreme", "mastering-polish", "bass-boost-mod"],
  },
  {
    presetId: "bass-boost-extreme",
    slug: "bass-boost-extreme",
    what:
      "Extreme Bass Boost is advertised by physics: +15 dB at 65 Hz. There is no saturation stage and no hidden harmonic rescue — the result is dramatic on hardware that can move, and a lesson in headroom on anything that can't.",
    sound:
      "Sub feels like structure — the low end carries the energy. On small drivers most of it simply disappears, because nothing in the chain invents harmonics to fake it.",
    dsp: [
      "A single low-shelf at 65 Hz adds +15 dB by default (12–18 dB range).",
      "No saturation, exciter or harmonic stage: what the shelf boosts is all you get.",
      "Peak protection (default on) limits the result with look-ahead sliding-minimum limiting at a −0.3 dBFS sample peak; with it off, the output can clip.",
      "The output stays stereo, and the optional peak normalize stage is the only further gain.",
    ],
    tips: [
      "Leave peak protection on; +15 dB of sub can push peaks well past full scale.",
      "If it sounds like 'one-note bass', that is the room or the driver — this preset adds no harmonics to fix it.",
      "Use the Extreme tier briefly for reference, then step back to Heavy for actual delivery.",
      "For a louder deliverable, export with peak normalize rather than pushing more boost.",
    ],
    useCases: ["Trap/drill demos", "Car comparison tests", "Sub listener culture"],
    related: ["bass-boost-heavy", "mastering-polish", "de-harsh"],
  },
  {
    presetId: "equalizer",
    slug: "equalizer",
    what:
      "The studio's simplest 'what if' tool: three parametric bands you cap in low, mid and high. One band to warm things up, one to carve presence, one to add air. The three-band EQ is where voice-led workflows graduate from volume-only thinking.",
    sound:
      "Hz-band-accurate sculpting: warmth from the low-shelf, clarity or scoop at the mid, openness at the high-shelf — each independent.",
    dsp: [
      "Low band: a low-shelf biquad at 120 Hz with your chosen gain, skipped when the gain is 0 dB.",
      "Mid band: a peaking filter at 2.4 kHz, Q 1.0 — the vocal-presence zone.",
      "High band: a high-shelf at 9 kHz, skipped when its gain is 0.",
      "Filters run in series inside the offline render, before output gain and the optional limiter.",
    ],
    tips: [
      "Cut before you boost: removing mud at 200–300 Hz often ends the need for a huge presence push.",
      "Boost the mid sparingly — the 2.4 kHz region fatigues ears fastest.",
      "Solve 'cheap mic look' with De-Harsh if boosting the high shelf alone sounds brittle.",
      "For mastering-style actions, Mastering Polish presets a musical version of these three curves for you.",
    ],
    useCases: ["Tone shaping", "Vocal rescue", "Tonal balancing before export"],
    related: ["treble-air", "vocal-clarity", "mastering-polish"],
  },
  {
    presetId: "treble-air",
    slug: "treble-air",
    what:
      "Treble & Air is a single ~9 kHz high-shelf boost. Where the full EQ gives you control, this preset gives you one canonical decision: how much sparkle. Sometimes the whole edit need is that a dull record or podcast recording just sounds closed.",
    sound:
      "Open, extended top end: cymbals breathe, vocal consonants pop, clocks and air sit forward. Overshoot and it turns sibilant or brittle.",
    dsp: [
      "A high-shelf biquad at 9 kHz adds gain above the corner only; the default is +5 dB.",
      "Below 9 kHz the response is unchanged — no compression, no distortion.",
      "Peak protection is available on export but is not part of the shelf itself.",
    ],
    tips: [
      "Add air on a bright record and then back off; air is the easiest dB to over-pour.",
      "For vocals with 's' harshness, soften with De-Harsh rather than cutting the air shelf.",
      "On lo-fi sources, air restores perceived detail recorded as dull by codecs.",
      "This is frequency-domain pressure, not compression: dynamics keep their natural shape.",
    ],
    useCases: ["Radio-ready polish", "Podcast openness", "Sibilant rescue after vocoding style edits"],
    related: ["equalizer", "de-harsh", "mastering-polish"],
  },

  // ============ Reverb & Echo ============
  {
    presetId: "bathroom-reverb",
    slug: "bathroom-reverb",
    what:
      "Bathroom Reverb is the small-tile acoustic: crisp early reflections off smooth, hard surfaces, and a very short decay. The effect is almost a gimmick — until you actually want the listener inside the tiles instead of in front of the singer.",
    sound:
      "Tight and dry, a short slap on hard tile: reads as a small hard-walled room, never as a hall — the acoustic signature of a shower wearing amplification.",
    dsp: [
      "A synthesized impulse response: 0.65 s decay, short early reflections, stereo-decorrelated tail.",
      "Heavy damping (0.75) rolls the tail off above roughly 7 kHz, so the tile reads soft rather than glassy.",
      "A 120 Hz high-pass removes low-frequency rumble before the convolver.",
      "Equal-power wet/dry mixing keeps the dry signal present at any wet setting.",
      "The full 0.65 s tail is added to the render window, so the last reflection survives.",
    ],
    tips: [
      "On vocals, a touch of room delay before the effect sells the small-space illusion better than pushing wetness.",
      "Because the tail is short, it stacks well with Delay-based movement as soon as the effect lands.",
      "Do not stack two reverbs at the same brightness; bathroom + cathedral is a contradiction, not a style.",
      "It pairs beautifully with telephone-voice edits when you want 'speaker mic in a bathroom'.",
    ],
    useCases: ["Slapback vocal furniture", "Short-space sound design", "Creative vox character"],
    related: ["telephone-voice", "small-room-reverb", "reverse"],
  },
  {
    presetId: "small-room-reverb",
    slug: "small-room-reverb",
    what:
      "Small Room Reverb is the invisible one: reflections tight enough that you never hear it as an effect, just as presence. Roughly a one-second decay, reflections spaced like a modest bedroom or studio booth. It is the most-used reverb in real mixes for exactly that reason.",
    sound:
      "Intimate and controlled, a touch of glue. The source keeps its front-row position; the room exists only to lend realism.",
    dsp: [
      "Synthesized impulse response with 1.1 s decay and tight reflection spacing.",
      "A 100 Hz high-pass keeps the room from getting cloudy.",
      "Equal-power wet/dry mix; the dry signal dominates at the default 25%.",
      "The full tail is included in the render window rather than cut at the boundary.",
    ],
    tips: [
      "This is the reference reverb for spoken word: start here before reaching for a hall.",
      "Push above ~45% wet and the room becomes noticeable — respect the threshold.",
      "Stack with Vocal Reverb if you need a dialogue inside a performance context.",
      "Short tails mean a near-zero stereo lag: stereo widening pairs well.",
    ],
    useCases: ["Podcast polish", "Vocal anchoring", "Backing vocals"], 
    related: ["vocal-clarity", "medium-room-reverb", "stereo-widening"],
  },
  {
    presetId: "medium-room-reverb",
    slug: "medium-room-reverb",
    what:
      "Medium Room Reverb splits the difference between presence and space: a 2.0-second decay in a balanced, evenly diffused room. It flatters without exaggerating — the broadcast sweet spot for music and voice combined.",
    sound:
      "Comfortable, conversationally spacious. Instruments read as sharing one room; vocals gain comfort without being pushed to the back.",
    dsp: [
      "Impulse response with 2.0 s decay and balanced early/late reflection structure.",
      "Damping at 0.45 rolls the top off gradually, so the room reads warm rather than bright.",
      "Reverb wet defaults to 35% and follows the slider.",
      "The render window grows to include the whole decay tail.",
    ],
    tips: [
      "Flattering default for rough mixes: fix tonal problems first, then let this room do the 'big room' work.",
      "Use medium instead of large when material is mid-dense; large throws energy into the mids.",
      "Slowed + reverb edits inherit this room shape at lighter wet values.",
      "For podcasts with remote guests in separate spaces, settle here before experimenting.",
    ],
    useCases: ["Pop vocals", "Podcast + music hybrid", "Demo mixes"],
    related: ["small-room-reverb", "large-room-reverb", "vocal-reverb"],
  },
  {
    presetId: "large-room-reverb",
    slug: "large-room-reverb",
    what:
      "Large Room Reverb is the first truly dramatic architectural scale: ~3.4-second decay, extensions read as a concert hall rather than a room. With drama comes a rule: keep mid-forward content clean while tails bloom behind them.",
    sound:
      "Spacious, drawn-out tails that read as a stage. Instruments acquire distance; every attack launches into a bigger air volume.",
    dsp: [
      "Impulse response with 3.4 s decay and wider early-reflection spacing.",
      "Damping at 0.35 keeps the long tail from turning harsh.",
      "Wet defaults to 45%; the dry path is still present at every setting.",
      "The render window adds the full 3.4 s tail rather than a fixed ceiling.",
    ],
    tips: [
      "Large hides 400–800 Hz mud well; check the De-Harsh guide if the tails accumulate glassy brightness.",
      "Keep lead vocals close: big reverb plus close panning sells intimacy better than 'everything far'.",
      "Dense EDM with fast arp patterns prefers brief rooms; large is best reserved for gaps and breakdowns.",
      "Long tails mean a longer file: the render window grows with the decay, so plan for the extra seconds.",
    ],
    useCases: ["Concert intros", "Ballad vocals", "Ambient layering"],
    related: ["medium-room-reverb", "church-hall-reverb", "cathedral-reverb"],
  },
  {
    presetId: "church-hall-reverb",
    slug: "church-hall-reverb",
    what:
      "Church Hall Reverb earns its name honestly: ~4.8-second decay from stone-hard reflections with high vaulted volume. It is sacred-space audio — choral music, spoken word in a nave, anything where God-tier emotion is the point.",
    sound:
      "Solemn, cathedral-clear. Mid frequencies bloom, the stereo field opens vertically, consonants float longer than their attacks.",
    dsp: [
      "Impulse response with 4.8 s decay and wide, stone-like reflection spacing.",
      "Damping at 0.30 rolls off the top as distance grows.",
      "Wet defaults to 55%, the highest of the architectural rooms bar the cathedral.",
      "The render window includes the full 4.8 s tail.",
    ],
    tips: [
      "Keep wet high for the sacred mood but watch vocal intelligibility — the tail runs long.",
      "For TTS or podcast narration, this room will swallow words; choose medium instead.",
      "Pairs differently than a concert hall: 'church' vs 'hall' is stated both in reflection plan and volume scale.",
      "Great for staged re-records of live vocals recorded in a dry booth.",
    ],
    useCases: ["Choral arranges", "Ceremonial sound design", "Film-style spatial scenes"],
    related: ["cathedral-reverb", "large-room-reverb", "vocal-reverb"],
  },
  {
    presetId: "cathedral-reverb",
    slug: "cathedral-reverb",
    what:
      "Cathedral Reverb is the ceiling of the family: 5.7–6.5 seconds of exponential decay from an architectural volume that swallows instruments whole. It exists for moments, not mixes — the effect that takes a sound from a stage to a monument.",
    sound:
      "Limitless, Ravel-feeling exponential decay: notes land, sustain apart, and the tail literally outlives the next phrase.",
    dsp: [
      "Decay is 4.8 + size/100 · 1.7 s: 6.4 s at the default size of 95, up to 6.5 s.",
      "Damping at 0.25 keeps stone-coloured highs from turning glassy.",
      "Wet defaults to 65%; the dry path stays audible.",
      "The render window carries the entire tail rather than clipping it.",
    ],
    tips: [
      "Use on sparse, slow material: fast grooves inside a cathedral read as mush.",
      "Layer before the limiter: the throwaway plan is a quiet stem, not a loud one.",
      "Check the tail-truncation rule: phrase boundaries that end abruptly sound best.",
      "Narrow the source — cathedral + wide widening is spatial overkill; the space is already huge.",
    ],
    useCases: ["Filmscore scenes", "Ghost vocal beds", "Sculptural ambient"],
    related: ["church-hall-reverb", "large-room-reverb", "underwater"],
  },
  {
    presetId: "vocal-reverb",
    slug: "vocal-reverb",
    what:
      "Vocal Reverb trades room realism for presence: a shorter ~1.8-second decay with a brighter, tilted response. In professional chains this is the vocal plate; in Audify it is the preset that keeps lyrics crisp while giving them a space that feels bigger than the recording booth.",
    sound:
      "Forward, tight, sung-into-microphone. The reverb surrounds the voice without pulling it into the room.",
    dsp: [
      "Impulse response with 1.8 s decay, a 35 ms pre-delay and a damped tail (0.65).",
      "The pre-delay keeps the direct voice clear of the first reflection.",
      "Wet defaults to 28% — enough space to feel sung, little enough to stay intelligible.",
      "The render window includes the full tail.",
    ],
    tips: [
      "Ideal for speech that must still be sung rather than just ambient — think spoken poetry or voiceover-singing hybrids.",
      "Widen slightly with the Stereo Widening guide if the vocal feels alone in mono.",
      "If you want the more conservative spoken-word look, Small Room Reverb is the safer room.",
      "Bright tails blur De-Harsh work: run de-sibilance after the reverb is printed.",
    ],
    useCases: ["Vocal tracks", "Sung poetry / voiceover hybrids", "Front-row layering"],
    related: ["small-room-reverb", "vocal-clarity", "de-harsh"],
  },
];
