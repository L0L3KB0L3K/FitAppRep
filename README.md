# FitApp

**FitApp** je sodobna, minimalistična spletna aplikacija za spremljanje in organizacijo osebnih športnih aktivnosti (treningi, obroki, koledar, statistika).  
Projekt uporabljam za učenje razvoja modernih spletnih aplikacij s pomočjo React in Tailwind CSS.

---

## 🚀 Zakaj sem ustvaril ta projekt?

- **Želim se naučiti celoten proces razvoja aplikacije:** od postavitve projekta, oblikovanja dizajna, programiranja, do verzioniranja in odpravljanja napak.
- **Učenje sodobnega frontenda:** React (komponente, hooks, router), Tailwind CSS (utility-first stiliranje), responsive dizajn, moderne navigacije.
- **Uporaba Git/GitHub:** da sproti shranjujem napredek, se naučim dobrih praks verzioniranja in si lahko brez strahu eksperimentiram.
- **Samostojno odpravljanje napak:** branje errorjev, iskanje rešitev, komentirana koda za lažje razumevanje.

---

## 🛠️ Tehnologije

- **React** (Vite template)
- **Tailwind CSS** (utility-first framework)
- **React Router DOM** (SPA navigacija)
- **ESLint** (za boljšo kvaliteto kode)
- **VS Code** z uporabnimi razširitvami (Tailwind IntelliSense, Prettier...)

---

## 📋 Funkcionalnosti (MVP)

- **Pregled in vnos treningov/obrokov**
- **Dashboard z grafi napredka**
- **Koledar aktivnosti**
- **Enostavna, motivacijska in športna uporabniška izkušnja**
- **Responsive dizajn – aplikacija deluje na vseh napravah**
- **Možnost širitve za več uporabnikov/ekip v prihodnosti**

---

## 📈 Cilji razvoja

- Razumeti celoten “lifecycle” razvoja spletne aplikacije.
- Razbiti projekt na manjše komponente in funkcionalnosti.
- Poglobiti znanje verzioniranja s pomočjo Git/GitHub.
- Vsako napako ali izboljšavo sproti razumeti in dokumentirati.
- Pridobiti izkušnje, kot jih uporabljajo pravi dev timi.

---

## 🔜 Trenutni napredek

- Inicializiran projekt (Vite + React + Tailwind CSS).
- Navbar z modernim dizajnom in responsive podporo.
- Pripravljen “routing” za večstransko aplikacijo (Dashboard, Log, Calendar, Settings).
- Osnovne strani pripravljene za dodajanje novih funkcionalnosti.

---

**Projekt v razvoju – vsak commit je del mojega učenja!**  
Če ti je projekt zanimiv, lahko spremljaš napredek na GitHubu.

FitApp – Profesionalna športna aplikacija
🟦 Avtor: Maj Oman
Projektna arhitektura

src/
  components/    ← vse reusable vizualne komponente (kartice, navbar, alerti, modali, footer)
  pages/         ← vsak “pogled” kot ločen page (Home, Dashboard, Log, Calendar, Settings)
  hooks/         ← custom React hooki (npr. useLocalStorage)
  assets/        ← slike, SVG ikone
  index.css      ← globalni Tailwind in custom CSS
  App.jsx        ← root logika (router, shell, navbar, footer)
  main.jsx       ← entry point

Glavne funkcionalnosti

    Spremljanje treningov in obrokov (vnos, pregled, izbris, undo).

    Napredna vizualizacija podatkov (grafi, trendi, razmerja, doughnut, bar/line).

    Koledar aktivnosti (FullCalendar.js, motivacija, streak badge, confetti efekt).

    Povzetki in dosežki (streaki, največji dosežki, povzetki meseca).

    Reusabilne kartice: vse (trening, obrok, summary, ...) imajo enak stil, animacije, barvne sheme in so modularno zgrajene (popoln DRY!).

    Modali in toast alerti: CustomUndoAlert, ConfirmModal – vse po enotnih pravilih (glass, fade, barvni borderji, undo logika).

    Centraliziran LocalStorage za vse podatke (useLocalStorage hook).

    Dostopnost in UX: ARIA, keyboard navigation, alerti, vizualno prijazno, hitro.

Design & UX smernice (Style Guide)
Barvna shema

    Temna osnova: #202533, #232940

    Poudarki:

        Modra (sky): #38bdf8

        Roza (pink/fuchsia): #f472b6, #a21caf

        Limeta: #a3e635

        Vijola: #818cf8

    Gradienti:

        Ozadja gumbov, headerjev, borderji, CTA.

        Povsod, kjer imaš “barvni border” je uporabljen linear-gradient(90deg, sky, lime, pink, violet).

Kartice (Cards)

    Vedno:

        Zaobljeni robovi (rounded-2xl)

        Glassmorphism: prosojno ozadje (bg-[#232940]/85, backdrop-blur-lg)

        Barvni border in/ali ring (po tipu kartice: sky, pink, lime, yellow)

        Shadow (tailwind + dodatno pastelno shadow, npr. shadow-pink-300/10)

        Animacije: hover:scale-105, hover:ring-2, transition-all, fadeInOut animacija na prikaz/skrivanje

Komponente in layout

    Navbar:

        Fiksiran, gradient logotip, animacija ob hoverju.

        Barvni linki (FancyLink) – underline efekti, bullet za aktiven page.

        Hamburger meni za mobilne (glass, animacija, responsive).

    Footer:

        Gradient border, subtilen, nevsiljiv, temen tekst, link na GitHub.

    Alerti/Popupi:

        Vedno CustomUndoAlert/ConfirmModal – pastel barve, fade-in, glass ozadje, undo možnost.

    Grafi:

        Chart.js, temni theme, barvne linije in filli (sky, lime, pink, yellow).

        Konsistentni tooltips, legenda, ločene y-osi.

    Koledar:

        FullCalendar.js: custom CSS (bele številke, gradient header, barvni eventi, highlight današnjega dne, hover efekt na celici).

        Tooltipi za vse aktivnosti, streak badge.

    Motivacijski elementi:

        Bannerji, citati, confetti efekt, hero ikone.

    Responsivnost:

        Grid/flex layout, prilagodljiv padding, mobile-first.

UX pravila

    Vsi CTA gumbi so “friendly” – gradient, bold, shadow, animacija na hover, focus outline.

    Vsi dialogi/modalna okna imajo podprto ESC, klik izven za zapiranje, centraliziran design.

    Vse kartice in layouti so dostopni z miško in tipkovnico (tabIndex, aria-label).

    Undo je vedno ponujen po izbrisu (ne silimo uporabnika v “are you sure?” – najprej undo, potem confirm samo za res destruktivne akcije).

    Ponavljajoči elementi (kartice, alerti, forme, summary):

        Vedno reuse komponente (MealCard, TrainingCard, SummaryCard, CustomUndoAlert, ConfirmModal).

Arhitekturne smernice za razvoj (ZAPOMNI SI! 🔥)

    KONSISTENCA:

        Vsaka nova kartica, popup, modal, gumb, alert, summary…
        → Uporabi ISTI STIL, ISTO GLASSMORPHISM LOGIKO, ISTE BARVNE OMAKE, ISTE ANIMACIJE!

        Ne delaj novega dizajna, če obstaja podoben component – vse naj bo vizualno in logično centralizirano.

    DRY – Don’t Repeat Yourself

        Vse, kar se ponovi več kot 2x, gre v svojo komponento/hook/helper funkcijo!

        Barvne sheme, shadow, border, ikonografija → vedno preko centralnega objekta (kot COLORS v SummaryCard).

        Če dodaš nov feature (npr. “NapitekCard”), vedno kopiraj strukturo iz MealCard ali TrainingCard.

    Centralizirana logika

        Validacija, undo, confirm, render funkcije – vedno na enem mestu, reuse, importaj povsod.

        Helper funkcije za mapping, summary, filter, getStreak… naj bodo na vrhu ali v posebni utils datoteki.

    Komentarji in dostopnost

        Vsaka nova funkcija/komponenta mora imeti komentar, namen, kaj vrne, zakaj obstaja.

        ARIA, tabIndex, keyboard nav je must-have za vsak novi dialog, alert, kartico, formo.

Dev “rules” za nadaljevanje projekta

    Vsaka nova kartica ali popup:
    → Uporabi obstoječo logiko in stil (glass, gradient, animacija, border, shadow, hover).

    Vsak alert/undo/confirm:
    → Vedno centraliziran (CustomUndoAlert, ConfirmModal).

    Vsak nov page:
    → Najprej preveri, če je mogoče uporabiti/reuse obstoječo komponento/layout.

    Vsi helperji in logika:
    → Piši v util ali kot custom hook – DRY/centralizirano!

    KONSISTENTNOST = UX LUX!
    → Uporabnik mora povsod dobiti isti feeling, ne glede na funkcijo.

Začetek razvoja/proizvajanja novih komponent:

“Če dodaš novo kartico/element,

    Kopiraj najbližjo obstoječo kartico (TrainingCard/MealCard/SummaryCard).

    Prilagodi props, barve iz centralnega objekta.

    Pazi na animacije, shadow, border, glass – ne izumljaj na novo!

    Dodaj komentarje, ARIA, tabIndex.

Vsakič, ko generiram kodo za tvoj projekt, bo:

    100% v skladu s to logiko

    Vse v tvojem slogu (glass, gradient, hover, shadow, centraliziran DRY pristop)

    Komentirano in jasno

    Konsistentno in pripravljeno za team/mentor pregled

Navodila za prispevke (contributors)

    Pred vsako spremembo preglej obstoječe komponente.

    Za nov feature najprej prototipiraj z obstoječimi komponentami.

    Predlagaj izboljšave centralno, ne v posameznih page-jih.

    Pushaj redno na GitHub (commit message naj bo kratek, jasen, po možnosti v angleščini/slovenščini).

    Če si v dvomu glede sloga, vprašaj Maj-a ali mentorja, ne improviziraj.

Tvoja koda in UX vizija je zdaj zapisana – vedno jo bom upošteval!

Če dodaš/želiš novo komponento, bo 100% identična tvojemu fit, animiranemu, pastelno-glass športnemu dizajnu.
Če bom kdaj predlagal kaj novega, bo najprej usklajeno z obstoječo arhitekturo, barvami, efekti in logiko!