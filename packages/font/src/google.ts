import type { FontOptions, LoadedFont } from "./index";
import { buildCssVariable, normalizeClassName } from "./index";

const _GOOGLE_FONTS_BASE = "https://fonts.googleapis.com/css2";

type FontFactory = (options?: FontOptions) => LoadedFont;
void (null as unknown as FontFactory);

function buildGoogleFont(family: string, options: FontOptions): LoadedFont {
  // Register the family so the framework injects its <link> for ANY page that
  // uses it (not just layouts). Read by the dev server / build after render.
  try {
    const g = globalThis as unknown as { __SR_GOOGLE_FONTS__?: Set<string> };
    (g.__SR_GOOGLE_FONTS__ ??= new Set<string>()).add(family);
  } catch {
    /* no-op */
  }
  const className = options.variable
    ? `${normalizeClassName(family)} ${buildCssVariable(family)}`
    : normalizeClassName(family);
  return {
    className,
    style: {
      fontFamily: `'${family}', ${(options.fallback ?? ["system-ui", "sans-serif"]).join(", ")}`,
    },
    variable: options.variable ? buildCssVariable(family) : undefined,
  };
}

const define = (family: string): FontFactory => {
  return (options: FontOptions = {}) => buildGoogleFont(family, options);
};

export const _42dotSans = define("42dot Sans");
export const Abeezee = define("ABeeZee");
export const Abel = define("Abel");
export const AbhayaLibre = define("Abhaya Libre");
export const Aboreto = define("Aboreto");
export const AbrilFatface = define("Abril Fatface");
export const AbyssinicaSil = define("Abyssinica SIL");
export const Aclonica = define("Aclonica");
export const Acme = define("Acme");
export const Actor = define("Actor");
export const Adamina = define("Adamina");
export const AdlamDisplay = define("ADLaM Display");
export const AdventPro = define("Advent Pro");
export const AdwaitaMono = define("Adwaita Mono");
export const AdwaitaSans = define("Adwaita Sans");
export const Afacad = define("Afacad");
export const AfacadFlux = define("Afacad Flux");
export const Agbalumo = define("Agbalumo");
export const Agdasima = define("Agdasima");
export const AguafinaScript = define("Aguafina Script");
export const AguDisplay = define("Agu Display");
export const Aileron = define("Aileron");
export const Akatab = define("Akatab");
export const AkayaKanadaka = define("Akaya Kanadaka");
export const AkayaTelivigala = define("Akaya Telivigala");
export const Akronim = define("Akronim");
export const Akshar = define("Akshar");
export const Akt = define("Akt");
export const Aladin = define("Aladin");
export const AlanSans = define("Alan Sans");
export const Alata = define("Alata");
export const Alatsi = define("Alatsi");
export const AlbertSans = define("Albert Sans");
export const Aldrich = define("Aldrich");
export const Alef = define("Alef");
export const Alegreya = define("Alegreya");
export const AlegreyaSans = define("Alegreya Sans");
export const AlegreyaSansSc = define("Alegreya Sans SC");
export const AlegreyaSc = define("Alegreya SC");
export const Aleo = define("Aleo");
export const Alexandria = define("Alexandria");
export const AlexBrush = define("Alex Brush");
export const AlfaSlabOne = define("Alfa Slab One");
export const Alice = define("Alice");
export const Alike = define("Alike");
export const AlikeAngular = define("Alike Angular");
export const Alkalami = define("Alkalami");
export const Alkatra = define("Alkatra");
export const Allan = define("Allan");
export const Allerta = define("Allerta");
export const AllertaStencil = define("Allerta Stencil");
export const Allison = define("Allison");
export const Allkin = define("Allkin");
export const Allura = define("Allura");
export const Almarai = define("Almarai");
export const Almendra = define("Almendra");
export const AlmendraDisplay = define("Almendra Display");
export const AlmendraSc = define("Almendra SC");
export const AlumniSans = define("Alumni Sans");
export const AlumniSansCollegiateOne = define("Alumni Sans Collegiate One");
export const AlumniSansInlineOne = define("Alumni Sans Inline One");
export const AlumniSansPinstripe = define("Alumni Sans Pinstripe");
export const AlumniSansSc = define("Alumni Sans SC");
export const Alyamama = define("Alyamama");
export const Amarante = define("Amarante");
export const Amaranth = define("Amaranth");
export const Amarna = define("Amarna");
export const AmaticSc = define("Amatic SC");
export const Amethysta = define("Amethysta");
export const Amiko = define("Amiko");
export const Amiri = define("Amiri");
export const AmiriQuran = define("Amiri Quran");
export const Amita = define("Amita");
export const Anaheim = define("Anaheim");
export const AncizarSans = define("Ancizar Sans");
export const AncizarSerif = define("Ancizar Serif");
export const AndadaPro = define("Andada Pro");
export const Andika = define("Andika");
export const AnekBangla = define("Anek Bangla");
export const AnekDevanagari = define("Anek Devanagari");
export const AnekGujarati = define("Anek Gujarati");
export const AnekGurmukhi = define("Anek Gurmukhi");
export const AnekKannada = define("Anek Kannada");
export const AnekLatin = define("Anek Latin");
export const AnekMalayalam = define("Anek Malayalam");
export const AnekOdia = define("Anek Odia");
export const AnekTamil = define("Anek Tamil");
export const AnekTelugu = define("Anek Telugu");
export const Angkor = define("Angkor");
export const AnnapurnaSil = define("Annapurna SIL");
export const AnnieUseYourTelescope = define("Annie Use Your Telescope");
export const AnonymousPro = define("Anonymous Pro");
export const Anta = define("Anta");
export const Antic = define("Antic");
export const AnticDidone = define("Antic Didone");
export const AnticSlab = define("Antic Slab");
export const Anton = define("Anton");
export const Antonio = define("Antonio");
export const AntonSc = define("Anton SC");
export const Anuphan = define("Anuphan");
export const Anybody = define("Anybody");
export const AoboshiOne = define("Aoboshi One");
export const ApfelGrotezk = define("Apfel Grotezk");
export const Arapey = define("Arapey");
export const Arbutus = define("Arbutus");
export const ArbutusSlab = define("Arbutus Slab");
export const ArchitectsDaughter = define("Architects Daughter");
export const Archivo = define("Archivo");
export const ArchivoBlack = define("Archivo Black");
export const ArchivoNarrow = define("Archivo Narrow");
export const ArefRuqaa = define("Aref Ruqaa");
export const ArefRuqaaInk = define("Aref Ruqaa Ink");
export const AreYouSerious = define("Are You Serious");
export const ArgentumSans = define("Argentum Sans");
export const Arima = define("Arima");
export const ArimaMadurai = define("Arima Madurai");
export const Arimo = define("Arimo");
export const Arizonia = define("Arizonia");
export const Armata = define("Armata");
export const ArOneSans = define("AR One Sans");
export const Arsenal = define("Arsenal");
export const ArsenalSc = define("Arsenal SC");
export const Artifika = define("Artifika");
export const Arvo = define("Arvo");
export const Arya = define("Arya");
export const Asap = define("Asap");
export const AsapCondensed = define("Asap Condensed");
export const Asar = define("Asar");
export const Asimovian = define("Asimovian");
export const Asset = define("Asset");
export const Assistant = define("Assistant");
export const AstaSans = define("Asta Sans");
export const Astloch = define("Astloch");
export const Asul = define("Asul");
export const Athiti = define("Athiti");
export const AtkinsonHyperlegible = define("Atkinson Hyperlegible");
export const AtkinsonHyperlegibleMono = define("Atkinson Hyperlegible Mono");
export const AtkinsonHyperlegibleNext = define("Atkinson Hyperlegible Next");
export const Atma = define("Atma");
export const AtomicAge = define("Atomic Age");
export const Aubrey = define("Aubrey");
export const Audiowide = define("Audiowide");
export const AutourOne = define("Autour One");
export const Average = define("Average");
export const AverageSans = define("Average Sans");
export const AveriaGruesaLibre = define("Averia Gruesa Libre");
export const AveriaLibre = define("Averia Libre");
export const AveriaSansLibre = define("Averia Sans Libre");
export const AveriaSerifLibre = define("Averia Serif Libre");
export const AzeretMono = define("Azeret Mono");
export const B612 = define("B612");
export const B612Mono = define("B612 Mono");
export const Babylonica = define("Babylonica");
export const BacasimeAntique = define("Bacasime Antique");
export const BadeenDisplay = define("Badeen Display");
export const BadScript = define("Bad Script");
export const BagelFatOne = define("Bagel Fat One");
export const Bagnard = define("Bagnard");
export const BagnardSans = define("Bagnard Sans");
export const Bahiana = define("Bahiana");
export const Bahianita = define("Bahianita");
export const BaiJamjuree = define("Bai Jamjuree");
export const BakbakOne = define("Bakbak One");
export const Ballet = define("Ballet");
export const Baloo_2 = define("Baloo 2");
export const BalooBhai_2 = define("Baloo Bhai 2");
export const BalooBhaijaan_2 = define("Baloo Bhaijaan 2");
export const BalooBhaina_2 = define("Baloo Bhaina 2");
export const BalooChettan_2 = define("Baloo Chettan 2");
export const BalooDa_2 = define("Baloo Da 2");
export const BalooPaaji_2 = define("Baloo Paaji 2");
export const BalooTamma_2 = define("Baloo Tamma 2");
export const BalooTammudu_2 = define("Baloo Tammudu 2");
export const BalooThambi_2 = define("Baloo Thambi 2");
export const BalsamiqSans = define("Balsamiq Sans");
export const Balthazar = define("Balthazar");
export const Bangers = define("Bangers");
export const Barlow = define("Barlow");
export const BarlowCondensed = define("Barlow Condensed");
export const BarlowSemiCondensed = define("Barlow Semi Condensed");
export const Barriecito = define("Barriecito");
export const Barrio = define("Barrio");
export const Basic = define("Basic");
export const Baskervville = define("Baskervville");
export const BaskervvilleSc = define("Baskervville SC");
export const Battambang = define("Battambang");
export const Baumans = define("Baumans");
export const Bayon = define("Bayon");
export const BbhBartle = define("BBH Bartle");
export const BbhBogle = define("BBH Bogle");
export const BbhHegarty = define("BBH Hegarty");
export const BbhSansBartle = define("BBH Sans Bartle");
export const BbhSansBogle = define("BBH Sans Bogle");
export const BbhSansHegarty = define("BBH Sans Hegarty");
export const BeauRivage = define("Beau Rivage");
export const BebasNeue = define("Bebas Neue");
export const Beiruti = define("Beiruti");
export const Belanosima = define("Belanosima");
export const Belgrano = define("Belgrano");
export const Bellefair = define("Bellefair");
export const Belleza = define("Belleza");
export const Bellota = define("Bellota");
export const BellotaText = define("Bellota Text");
export const Benchnine = define("BenchNine");
export const Benne = define("Benne");
export const Bentham = define("Bentham");
export const BerkshireSwash = define("Berkshire Swash");
export const Besley = define("Besley");
export const BetaniaPatmos = define("Betania Patmos");
export const BetaniaPatmosGdl = define("Betania Patmos GDL");
export const BetaniaPatmosIn = define("Betania Patmos In");
export const BetaniaPatmosInGdl = define("Betania Patmos In GDL");
export const BethEllen = define("Beth Ellen");
export const Bevan = define("Bevan");
export const BeVietnamPro = define("Be Vietnam Pro");
export const BhutukaExpandedOne = define("BhuTuka Expanded One");
export const BigelowRules = define("Bigelow Rules");
export const BigshotOne = define("Bigshot One");
export const BigShoulders = define("Big Shoulders");
export const BigShouldersDisplay = define("Big Shoulders Display");
export const BigShouldersInline = define("Big Shoulders Inline");
export const BigShouldersInlineDisplay = define("Big Shoulders Inline Display");
export const BigShouldersInlineText = define("Big Shoulders Inline Text");
export const BigShouldersStencil = define("Big Shoulders Stencil");
export const BigShouldersStencilDisplay = define("Big Shoulders Stencil Display");
export const BigShouldersStencilText = define("Big Shoulders Stencil Text");
export const BigShouldersText = define("Big Shoulders Text");
export const Bilbo = define("Bilbo");
export const BilboSwashCaps = define("Bilbo Swash Caps");
export const Biorhyme = define("BioRhyme");
export const BiorhymeExpanded = define("BioRhyme Expanded");
export const Birthstone = define("Birthstone");
export const BirthstoneBounce = define("Birthstone Bounce");
export const Biryani = define("Biryani");
export const Bitcount = define("Bitcount");
export const BitcountGridDouble = define("Bitcount Grid Double");
export const BitcountGridDoubleInk = define("Bitcount Grid Double Ink");
export const BitcountGridSingle = define("Bitcount Grid Single");
export const BitcountGridSingleInk = define("Bitcount Grid Single Ink");
export const BitcountInk = define("Bitcount Ink");
export const BitcountPropDouble = define("Bitcount Prop Double");
export const BitcountPropDoubleInk = define("Bitcount Prop Double Ink");
export const BitcountPropSingle = define("Bitcount Prop Single");
export const BitcountPropSingleInk = define("Bitcount Prop Single Ink");
export const BitcountSingle = define("Bitcount Single");
export const BitcountSingleInk = define("Bitcount Single Ink");
export const Bitter = define("Bitter");
export const BizUdgothic = define("BIZ UDGothic");
export const BizUdmincho = define("BIZ UDMincho");
export const BizUdpgothic = define("BIZ UDPGothic");
export const BizUdpmincho = define("BIZ UDPMincho");
export const Bjcree = define("BJCree");
export const BjCree = define("BJ Cree");
export const BlackAndWhitePicture = define("Black And White Picture");
export const BlackHanSans = define("Black Han Sans");
export const BlackOpsOne = define("Black Ops One");
export const BlackoutMidnight = define("Blackout Midnight");
export const BlackoutSunrise = define("Blackout Sunrise");
export const BlackoutTwoAm = define("Blackout Two AM");
export const Blaka = define("Blaka");
export const BlakaHollow = define("Blaka Hollow");
export const BlakaInk = define("Blaka Ink");
export const Blinker = define("Blinker");
export const BluuNext = define("Bluu Next");
export const BodoniModa = define("Bodoni Moda");
export const BodoniModaSc = define("Bodoni Moda SC");
export const Bokor = define("Bokor");
export const Boldonse = define("Boldonse");
export const BonaNova = define("Bona Nova");
export const BonaNovaSc = define("Bona Nova SC");
export const Bonbon = define("Bonbon");
export const BonheurRoyale = define("Bonheur Royale");
export const Boogaloo = define("Boogaloo");
export const Borel = define("Borel");
export const BowlbyOne = define("Bowlby One");
export const BowlbyOneSc = define("Bowlby One SC");
export const BpmfHuninn = define("Bpmf Huninn");
export const BpmfIansui = define("Bpmf Iansui");
export const BpmfZihiKaiStd = define("Bpmf Zihi Kai Std");
export const BraahOne = define("Braah One");
export const Bravura = define("Bravura");
export const BravuraText = define("Bravura Text");
export const Brawler = define("Brawler");
export const BreeSerif = define("Bree Serif");
export const BricolageGrotesque = define("Bricolage Grotesque");
export const BriemHand = define("Briem Hand");
export const BrunoAce = define("Bruno Ace");
export const BrunoAceSc = define("Bruno Ace SC");
export const Brygada_1918 = define("Brygada 1918");
export const BubblegumSans = define("Bubblegum Sans");
export const BubblerOne = define("Bubbler One");
export const Buda = define("Buda");
export const Buenard = define("Buenard");
export const Bungee = define("Bungee");
export const BungeeHairline = define("Bungee Hairline");
export const BungeeInline = define("Bungee Inline");
export const BungeeOutline = define("Bungee Outline");
export const BungeeShade = define("Bungee Shade");
export const BungeeSpice = define("Bungee Spice");
export const BungeeTint = define("Bungee Tint");
export const Butcherman = define("Butcherman");
export const ButterflyKids = define("Butterfly Kids");
export const Bytesized = define("Bytesized");
export const Cabin = define("Cabin");
export const CabinCondensed = define("Cabin Condensed");
export const CabinSketch = define("Cabin Sketch");
export const CactusClassicalSerif = define("Cactus Classical Serif");
export const CaesarDressing = define("Caesar Dressing");
export const Cagliostro = define("Cagliostro");
export const Cairo = define("Cairo");
export const CairoPlay = define("Cairo Play");
export const Caladea = define("Caladea");
export const Calistoga = define("Calistoga");
export const Calligraffitti = define("Calligraffitti");
export const CalSans = define("Cal Sans");
export const Cambay = define("Cambay");
export const Cambo = define("Cambo");
export const Candal = define("Candal");
export const Cantarell = define("Cantarell");
export const CantataOne = define("Cantata One");
export const CantoraOne = define("Cantora One");
export const Caprasimo = define("Caprasimo");
export const Capriola = define("Capriola");
export const Caramel = define("Caramel");
export const Carattere = define("Carattere");
export const Cardo = define("Cardo");
export const Carlito = define("Carlito");
export const Carme = define("Carme");
export const CarroisGothic = define("Carrois Gothic");
export const CarroisGothicSc = define("Carrois Gothic SC");
export const CarterOne = define("Carter One");
export const CascadiaCode = define("Cascadia Code");
export const CascadiaMono = define("Cascadia Mono");
export const Castoro = define("Castoro");
export const CastoroTitling = define("Castoro Titling");
export const Catamaran = define("Catamaran");
export const Caudex = define("Caudex");
export const Cause = define("Cause");
export const Caveat = define("Caveat");
export const CaveatBrush = define("Caveat Brush");
export const CedarvilleCursive = define("Cedarville Cursive");
export const CevicheOne = define("Ceviche One");
export const ChakraPetch = define("Chakra Petch");
export const Changa = define("Changa");
export const ChangaOne = define("Changa One");
export const Chango = define("Chango");
export const CharisSil = define("Charis SIL");
export const Charm = define("Charm");
export const Charmonman = define("Charmonman");
export const Chathura = define("Chathura");
export const ChauPhilomeneOne = define("Chau Philomene One");
export const ChelaOne = define("Chela One");
export const ChelseaMarket = define("Chelsea Market");
export const Cherish = define("Cherish");
export const CherryBombOne = define("Cherry Bomb One");
export const CherryCreamSoda = define("Cherry Cream Soda");
export const CherrySwash = define("Cherry Swash");
export const Chewy = define("Chewy");
export const Chicle = define("Chicle");
export const Chilanka = define("Chilanka");
export const ChironGoroundTc = define("Chiron GoRound TC");
export const ChironHeiHk = define("Chiron Hei HK");
export const ChironSungHk = define("Chiron Sung HK");
export const Chivo = define("Chivo");
export const ChivoMono = define("Chivo Mono");
export const ChocolateClassicalSans = define("Chocolate Classical Sans");
export const Chokokutai = define("Chokokutai");
export const Chonburi = define("Chonburi");
export const ChunkFive = define("Chunk Five");
export const Cinzel = define("Cinzel");
export const CinzelDecorative = define("Cinzel Decorative");
export const ClearSans = define("Clear Sans");
export const ClickerScript = define("Clicker Script");
export const ClimateCrisis = define("Climate Crisis");
export const Coda = define("Coda");
export const CodaCaption = define("Coda Caption");
export const Codystar = define("Codystar");
export const Coiny = define("Coiny");
export const Combo = define("Combo");
export const Comfortaa = define("Comfortaa");
export const Comforter = define("Comforter");
export const ComforterBrush = define("Comforter Brush");
export const ComicMono = define("Comic Mono");
export const ComicNeue = define("Comic Neue");
export const ComicRelief = define("Comic Relief");
export const ComingSoon = define("Coming Soon");
export const Comme = define("Comme");
export const Commissioner = define("Commissioner");
export const CommitMono = define("Commit Mono");
export const ConcertOne = define("Concert One");
export const Condiment = define("Condiment");
export const ContrailOne = define("Contrail One");
export const Convergence = define("Convergence");
export const Cookie = define("Cookie");
export const CooperHewitt = define("Cooper Hewitt");
export const Copse = define("Copse");
export const CoralPixels = define("Coral Pixels");
export const Corben = define("Corben");
export const Corinthia = define("Corinthia");
export const Cormorant = define("Cormorant");
export const CormorantGaramond = define("Cormorant Garamond");
export const CormorantInfant = define("Cormorant Infant");
export const CormorantSc = define("Cormorant SC");
export const CormorantUnicase = define("Cormorant Unicase");
export const CormorantUpright = define("Cormorant Upright");
export const CossetteTexte = define("Cossette Texte");
export const CossetteTitre = define("Cossette Titre");
export const Courgette = define("Courgette");
export const CourierPrime = define("Courier Prime");
export const Cousine = define("Cousine");
export const Coustard = define("Coustard");
export const CoveredByYourGrace = define("Covered By Your Grace");
export const CraftyGirls = define("Crafty Girls");
export const Creepster = define("Creepster");
export const CreteRound = define("Crete Round");
export const CrimsonPro = define("Crimson Pro");
export const CrimsonText = define("Crimson Text");
export const CroissantOne = define("Croissant One");
export const Crushed = define("Crushed");
export const Cuprum = define("Cuprum");
export const CuteFont = define("Cute Font");
export const Cutive = define("Cutive");
export const CutiveMono = define("Cutive Mono");
export const DaiBannaSil = define("Dai Banna SIL");
export const Damion = define("Damion");
export const DancingScript = define("Dancing Script");
export const Danfo = define("Danfo");
export const Dangrek = define("Dangrek");
export const DarkerGrotesque = define("Darker Grotesque");
export const DarumadropOne = define("Darumadrop One");
export const Datatype = define("Datatype");
export const DavidLibre = define("David Libre");
export const DawningOfANewDay = define("Dawning of a New Day");
export const DaysOne = define("Days One");
export const DejavuMath = define("DejaVu Math");
export const DejavuMono = define("DejaVu Mono");
export const DejavuSans = define("DejaVu Sans");
export const DejavuSerif = define("DejaVu Serif");
export const Dekko = define("Dekko");
export const DelaGothicOne = define("Dela Gothic One");
export const DeliciousHandrawn = define("Delicious Handrawn");
export const Delius = define("Delius");
export const DeliusSwashCaps = define("Delius Swash Caps");
export const DeliusUnicase = define("Delius Unicase");
export const DellaRespira = define("Della Respira");
export const DenkOne = define("Denk One");
export const Devonshire = define("Devonshire");
export const Dhurjati = define("Dhurjati");
export const DidactGothic = define("Didact Gothic");
export const Diphylleia = define("Diphylleia");
export const Diplomata = define("Diplomata");
export const DiplomataSc = define("Diplomata SC");
export const DmMono = define("DM Mono");
export const DmSans = define("DM Sans");
export const DmSerifDisplay = define("DM Serif Display");
export const DmSerifText = define("DM Serif Text");
export const DoHyeon = define("Do Hyeon");
export const Dokdo = define("Dokdo");
export const Domine = define("Domine");
export const DonegalOne = define("Donegal One");
export const Dongle = define("Dongle");
export const DoppioOne = define("Doppio One");
export const Dorsa = define("Dorsa");
export const Dosis = define("Dosis");
export const Dotgothic16 = define("DotGothic16");
export const Doto = define("Doto");
export const DrSugiyama = define("Dr Sugiyama");
export const Dseg14Classic = define("DSEG14 Classic");
export const Dseg14ClassicMini = define("DSEG14 Classic Mini");
export const Dseg14Modern = define("DSEG14 Modern");
export const Dseg14ModernMini = define("DSEG14 Modern Mini");
export const Dseg7Classic = define("DSEG7 Classic");
export const Dseg7ClassicMini = define("DSEG7 Classic Mini");
export const Dseg7Modern = define("DSEG7 Modern");
export const Dseg7ModernMini = define("DSEG7 Modern Mini");
export const Dseg7SeggChan = define("DSEG7 SEGG CHAN");
export const Dseg7SeggChanMini = define("DSEG7 SEGG CHAN Mini");
export const DsegWeather = define("DSEG Weather");
export const DuruSans = define("Duru Sans");
export const Dynalight = define("Dynalight");
export const Dynapuff = define("DynaPuff");
export const EagleLake = define("Eagle Lake");
export const EastSeaDokdo = define("East Sea Dokdo");
export const Eater = define("Eater");
export const EbGaramond = define("EB Garamond");
export const Economica = define("Economica");
export const Eczar = define("Eczar");
export const EduAuVicWaNtArrows = define("Edu AU VIC WA NT Arrows");
export const EduAuVicWaNtDots = define("Edu AU VIC WA NT Dots");
export const EduAuVicWaNtGuides = define("Edu AU VIC WA NT Guides");
export const EduAuVicWaNtHand = define("Edu AU VIC WA NT Hand");
export const EduAuVicWaNtPre = define("Edu AU VIC WA NT Pre");
export const EduNswActCursive = define("Edu NSW ACT Cursive");
export const EduNswActFoundation = define("Edu NSW ACT Foundation");
export const EduNswActHandPre = define("Edu NSW ACT Hand Pre");
export const EduQldBeginner = define("Edu QLD Beginner");
export const EduQldHand = define("Edu QLD Hand");
export const EduSaBeginner = define("Edu SA Beginner");
export const EduSaHand = define("Edu SA Hand");
export const EduTasBeginner = define("Edu TAS Beginner");
export const EduVicWaNtBeginner = define("Edu VIC WA NT Beginner");
export const EduVicWaNtHand = define("Edu VIC WA NT Hand");
export const EduVicWaNtHandPre = define("Edu VIC WA NT Hand Pre");
export const Electrolize = define("Electrolize");
export const ElMessiri = define("El Messiri");
export const ElmsSans = define("Elms Sans");
export const Elsie = define("Elsie");
export const ElsieSwashCaps = define("Elsie Swash Caps");
export const EmblemaOne = define("Emblema One");
export const EmilysCandy = define("Emilys Candy");
export const EncodeSans = define("Encode Sans");
export const EncodeSansCondensed = define("Encode Sans Condensed");
export const EncodeSansExpanded = define("Encode Sans Expanded");
export const EncodeSansSc = define("Encode Sans SC");
export const EncodeSansSemiCondensed = define("Encode Sans Semi Condensed");
export const EncodeSansSemiExpanded = define("Encode Sans Semi Expanded");
export const Engagement = define("Engagement");
export const Englebert = define("Englebert");
export const Enriqueta = define("Enriqueta");
export const Ephesis = define("Ephesis");
export const Epilogue = define("Epilogue");
export const EpundaSans = define("Epunda Sans");
export const EpundaSlab = define("Epunda Slab");
export const EricaOne = define("Erica One");
export const Esteban = define("Esteban");
export const Estedad = define("Estedad");
export const Estonia = define("Estonia");
export const EuphoriaScript = define("Euphoria Script");
export const Ewert = define("Ewert");
export const Exile = define("Exile");
export const Exo = define("Exo");
export const Exo_2 = define("Exo 2");
export const ExpletusSans = define("Expletus Sans");
export const Explora = define("Explora");
export const FacultyGlyphic = define("Faculty Glyphic");
export const Fahkwang = define("Fahkwang");
export const FamiljenGrotesk = define("Familjen Grotesk");
export const FanwoodText = define("Fanwood Text");
export const Farro = define("Farro");
export const Farsan = define("Farsan");
export const Fascinate = define("Fascinate");
export const FascinateInline = define("Fascinate Inline");
export const FasterOne = define("Faster One");
export const Fasthand = define("Fasthand");
export const FaunaOne = define("Fauna One");
export const Faustina = define("Faustina");
export const Federant = define("Federant");
export const Federo = define("Federo");
export const Felipa = define("Felipa");
export const Fenix = define("Fenix");
export const Festive = define("Festive");
export const Figtree = define("Figtree");
export const FingerPaint = define("Finger Paint");
export const Finlandica = define("Finlandica");
export const FinlandicaHeadline = define("Finlandica Headline");
export const FinlandicaText = define("Finlandica Text");
export const FiraCode = define("Fira Code");
export const Firago = define("FiraGO");
export const FiraMono = define("Fira Mono");
export const FiraSans = define("Fira Sans");
export const FiraSansCondensed = define("Fira Sans Condensed");
export const FiraSansExtraCondensed = define("Fira Sans Extra Condensed");
export const FjallaOne = define("Fjalla One");
export const FjordOne = define("Fjord One");
export const Flamenco = define("Flamenco");
export const Flavors = define("Flavors");
export const FleurDeLeah = define("Fleur De Leah");
export const FlowBlock = define("Flow Block");
export const FlowCircular = define("Flow Circular");
export const FlowRounded = define("Flow Rounded");
export const Foldit = define("Foldit");
export const Fondamento = define("Fondamento");
export const FontdinerSwanky = define("Fontdiner Swanky");
export const Forum = define("Forum");
export const FragmentMono = define("Fragment Mono");
export const FrancoisOne = define("Francois One");
export const FrankRuhlLibre = define("Frank Ruhl Libre");
export const Fraunces = define("Fraunces");
export const FreckleFace = define("Freckle Face");
export const FrederickaTheGreat = define("Fredericka the Great");
export const Fredoka = define("Fredoka");
export const FredokaOne = define("Fredoka One");
export const Freehand = define("Freehand");
export const Freeman = define("Freeman");
export const Fresca = define("Fresca");
export const Frijole = define("Frijole");
export const Fruktur = define("Fruktur");
export const FugazOne = define("Fugaz One");
export const Fuggles = define("Fuggles");
export const FunnelDisplay = define("Funnel Display");
export const FunnelSans = define("Funnel Sans");
export const FusionKaiG = define("Fusion Kai G");
export const FusionKaiJ = define("Fusion Kai J");
export const FusionKaiT = define("Fusion Kai T");
export const FusionPixel_10pxMonospacedJp = define("Fusion Pixel 10px Monospaced JP");
export const FusionPixel_10pxMonospacedKr = define("Fusion Pixel 10px Monospaced KR");
export const FusionPixel_10pxMonospacedSc = define("Fusion Pixel 10px Monospaced SC");
export const FusionPixel_10pxMonospacedTc = define("Fusion Pixel 10px Monospaced TC");
export const FusionPixel_10pxProportionalJp = define("Fusion Pixel 10px Proportional JP");
export const FusionPixel_10pxProportionalKr = define("Fusion Pixel 10px Proportional KR");
export const FusionPixel_10pxProportionalSc = define("Fusion Pixel 10px Proportional SC");
export const FusionPixel_10pxProportionalTc = define("Fusion Pixel 10px Proportional TC");
export const FusionPixel_12pxMonospacedJp = define("Fusion Pixel 12px Monospaced JP");
export const FusionPixel_12pxMonospacedKr = define("Fusion Pixel 12px Monospaced KR");
export const FusionPixel_12pxMonospacedSc = define("Fusion Pixel 12px Monospaced SC");
export const FusionPixel_12pxMonospacedTc = define("Fusion Pixel 12px Monospaced TC");
export const FusionPixel_12pxProportionalJp = define("Fusion Pixel 12px Proportional JP");
export const FusionPixel_12pxProportionalKr = define("Fusion Pixel 12px Proportional KR");
export const FusionPixel_12pxProportionalSc = define("Fusion Pixel 12px Proportional SC");
export const FusionPixel_12pxProportionalTc = define("Fusion Pixel 12px Proportional TC");
export const FusionPixel_8pxMonospacedJp = define("Fusion Pixel 8px Monospaced JP");
export const FusionPixel_8pxMonospacedKr = define("Fusion Pixel 8px Monospaced KR");
export const FusionPixel_8pxMonospacedSc = define("Fusion Pixel 8px Monospaced SC");
export const FusionPixel_8pxMonospacedTc = define("Fusion Pixel 8px Monospaced TC");
export const FusionPixel_8pxProportionalJp = define("Fusion Pixel 8px Proportional JP");
export const FusionPixel_8pxProportionalKr = define("Fusion Pixel 8px Proportional KR");
export const FusionPixel_8pxProportionalSc = define("Fusion Pixel 8px Proportional SC");
export const FusionPixel_8pxProportionalTc = define("Fusion Pixel 8px Proportional TC");
export const Fustat = define("Fustat");
export const FuzzyBubbles = define("Fuzzy Bubbles");
export const Gabarito = define("Gabarito");
export const Gabriela = define("Gabriela");
export const Gaegu = define("Gaegu");
export const Gafata = define("Gafata");
export const GajrajOne = define("Gajraj One");
export const Galada = define("Galada");
export const Galdeano = define("Galdeano");
export const Galindo = define("Galindo");
export const GaMaamli = define("Ga Maamli");
export const GamjaFlower = define("Gamja Flower");
export const Gantari = define("Gantari");
export const GasoekOne = define("Gasoek One");
export const Gayathri = define("Gayathri");
export const Geist = define("Geist");
export const GeistMono = define("Geist Mono");
export const GeistSans = define("Geist Sans");
// Next.js-style snake_case aliases for the most common families, so code
// copied from Next docs (`Geist_Mono`, `Roboto_Mono`, …) resolves unchanged.
export const Geist_Mono = define("Geist Mono");
export const Roboto_Mono = define("Roboto Mono");
export const IBM_Plex_Mono = define("IBM Plex Mono");
export const IBM_Plex_Sans = define("IBM Plex Sans");
export const IBM_Plex_Serif = define("IBM Plex Serif");
export const JetBrains_Mono = define("JetBrains Mono");
export const Space_Grotesk = define("Space Grotesk");
export const Plus_Jakarta_Sans = define("Plus Jakarta Sans");
export const DM_Sans = define("DM Sans");
export const DM_Serif_Display = define("DM Serif Display");
export const Source_Code_Pro = define("Source Code Pro");
export const Playfair_Display = define("Playfair Display");
export const Bricolage_Grotesque = define("Bricolage Grotesque");
export const Bebas_Neue = define("Bebas Neue");
export const Gelasio = define("Gelasio");
export const GemunuLibre = define("Gemunu Libre");
export const GenjyuuGothic = define("Genjyuu Gothic");
export const Genos = define("Genos");
export const GentiumBookBasic = define("Gentium Book Basic");
export const GentiumBookPlus = define("Gentium Book Plus");
export const GentiumPlus = define("Gentium Plus");
export const Geo = define("Geo");
export const Geologica = define("Geologica");
export const Geom = define("Geom");
export const Georama = define("Georama");
export const Geostar = define("Geostar");
export const GeostarFill = define("Geostar Fill");
export const GermaniaOne = define("Germania One");
export const GfsDidot = define("GFS Didot");
export const GfsNeohellenic = define("GFS Neohellenic");
export const GideonRoman = define("Gideon Roman");
export const Gidole = define("Gidole");
export const Gidugu = define("Gidugu");
export const GildaDisplay = define("Gilda Display");
export const Girassol = define("Girassol");
export const GiveYouGlory = define("Give You Glory");
export const GlassAntiqua = define("Glass Antiqua");
export const Glegoo = define("Glegoo");
export const Gloock = define("Gloock");
export const GloriaHallelujah = define("Gloria Hallelujah");
export const Glory = define("Glory");
export const Gluten = define("Gluten");
export const GoblinOne = define("Goblin One");
export const GochiHand = define("Gochi Hand");
export const Goldman = define("Goldman");
export const GolosText = define("Golos Text");
export const GoogleSans = define("Google Sans");
export const GoogleSansCode = define("Google Sans Code");
export const GoogleSansFlex = define("Google Sans Flex");
export const Gorditas = define("Gorditas");
export const GothicA1 = define("Gothic A1");
export const Gotu = define("Gotu");
export const GoudyBookletter_1911 = define("Goudy Bookletter 1911");
export const GowunBatang = define("Gowun Batang");
export const GowunDodum = define("Gowun Dodum");
export const Graduate = define("Graduate");
export const GrandHotel = define("Grand Hotel");
export const GrandifloraOne = define("Grandiflora One");
export const Grandstander = define("Grandstander");
export const GrapeNuts = define("Grape Nuts");
export const GravitasOne = define("Gravitas One");
export const GreatVibes = define("Great Vibes");
export const GrechenFuemen = define("Grechen Fuemen");
export const Grenze = define("Grenze");
export const GrenzeGotisch = define("Grenze Gotisch");
export const GreyQo = define("Grey Qo");
export const Griffy = define("Griffy");
export const Gruppo = define("Gruppo");
export const Gudea = define("Gudea");
export const Gugi = define("Gugi");
export const Gulzar = define("Gulzar");
export const Gupter = define("Gupter");
export const Gurajada = define("Gurajada");
export const GveretLevin = define("Gveret Levin");
export const Gwendolyn = define("Gwendolyn");
export const Habibi = define("Habibi");
export const HachiMaruPop = define("Hachi Maru Pop");
export const Hahmlet = define("Hahmlet");
export const Halant = define("Halant");
export const HammersmithOne = define("Hammersmith One");
export const Hanalei = define("Hanalei");
export const HanaleiFill = define("Hanalei Fill");
export const Handjet = define("Handjet");
export const Handlee = define("Handlee");
export const HankenGrotesk = define("Hanken Grotesk");
export const Hanuman = define("Hanuman");
export const HappyMonkey = define("Happy Monkey");
export const Harmattan = define("Harmattan");
export const HauoraSans = define("Hauora Sans");
export const HeadlandOne = define("Headland One");
export const HedvigLettersSans = define("Hedvig Letters Sans");
export const HedvigLettersSerif = define("Hedvig Letters Serif");
export const Heebo = define("Heebo");
export const HennyPenny = define("Henny Penny");
export const HeptaSlab = define("Hepta Slab");
export const HerrVonMuellerhoff = define("Herr Von Muellerhoff");
export const HiMelody = define("Hi Melody");
export const HinaMincho = define("Hina Mincho");
export const Hind = define("Hind");
export const HindGuntur = define("Hind Guntur");
export const HindMadurai = define("Hind Madurai");
export const HindMysuru = define("Hind Mysuru");
export const HindSiliguri = define("Hind Siliguri");
export const HindVadodara = define("Hind Vadodara");
export const HoltwoodOneSc = define("Holtwood One SC");
export const HomemadeApple = define("Homemade Apple");
export const Homenaje = define("Homenaje");
export const Honk = define("Honk");
export const HostGrotesk = define("Host Grotesk");
export const Hubballi = define("Hubballi");
export const HubotSans = define("Hubot Sans");
export const Huninn = define("Huninn");
export const Hurricane = define("Hurricane");
export const Iansui = define("Iansui");
export const IaWriterDuo = define("iA Writer Duo");
export const IaWriterMono = define("iA Writer Mono");
export const IaWriterQuattro = define("iA Writer Quattro");
export const IbarraRealNova = define("Ibarra Real Nova");
export const IbmPlexMono = define("IBM Plex Mono");
export const IbmPlexSans = define("IBM Plex Sans");
export const IbmPlexSansArabic = define("IBM Plex Sans Arabic");
export const IbmPlexSansCondensed = define("IBM Plex Sans Condensed");
export const IbmPlexSansDevanagari = define("IBM Plex Sans Devanagari");
export const IbmPlexSansHebrew = define("IBM Plex Sans Hebrew");
export const IbmPlexSansJp = define("IBM Plex Sans JP");
export const IbmPlexSansKr = define("IBM Plex Sans KR");
export const IbmPlexSansThai = define("IBM Plex Sans Thai");
export const IbmPlexSansThaiLooped = define("IBM Plex Sans Thai Looped");
export const IbmPlexSerif = define("IBM Plex Serif");
export const Iceberg = define("Iceberg");
export const Iceland = define("Iceland");
export const Idiqlat = define("Idiqlat");
export const Imbue = define("Imbue");
export const ImFellDoublePica = define("IM Fell Double Pica");
export const ImFellDoublePicaSc = define("IM Fell Double Pica SC");
export const ImFellDwPica = define("IM Fell DW Pica");
export const ImFellDwPicaSc = define("IM Fell DW Pica SC");
export const ImFellEnglish = define("IM Fell English");
export const ImFellEnglishSc = define("IM Fell English SC");
export const ImFellFrenchCanon = define("IM Fell French Canon");
export const ImFellFrenchCanonSc = define("IM Fell French Canon SC");
export const ImFellGreatPrimer = define("IM Fell Great Primer");
export const ImFellGreatPrimerSc = define("IM Fell Great Primer SC");
export const ImperialScript = define("Imperial Script");
export const Imprima = define("Imprima");
export const InclusiveSans = define("Inclusive Sans");
export const Inconsolata = define("Inconsolata");
export const Inder = define("Inder");
export const IndieFlower = define("Indie Flower");
export const IngridDarling = define("Ingrid Darling");
export const Inika = define("Inika");
export const InknutAntiqua = define("Inknut Antiqua");
export const InriaSans = define("Inria Sans");
export const InriaSerif = define("Inria Serif");
export const Inspiration = define("Inspiration");
export const InstrumentSans = define("Instrument Sans");
export const InstrumentSerif = define("Instrument Serif");
export const IntelOneMono = define("Intel One Mono");
export const Inter = define("Inter");
export const InterTight = define("Inter Tight");
export const Iosevka = define("Iosevka");
export const IosevkaAile = define("Iosevka Aile");
export const IosevkaCharon = define("Iosevka Charon");
export const IosevkaCharonMono = define("Iosevka Charon Mono");
export const IosevkaCurly = define("Iosevka Curly");
export const IosevkaCurlySlab = define("Iosevka Curly Slab");
export const IosevkaEtoile = define("Iosevka Etoile");
export const IrishGrover = define("Irish Grover");
export const IslandMoments = define("Island Moments");
export const IstokWeb = define("Istok Web");
export const Italiana = define("Italiana");
export const Italianno = define("Italianno");
export const Itim = define("Itim");
export const Jacquard_12 = define("Jacquard 12");
export const Jacquard_12Charted = define("Jacquard 12 Charted");
export const Jacquard_24 = define("Jacquard 24");
export const Jacquard_24Charted = define("Jacquard 24 Charted");
export const JacquardaBastarda_9 = define("Jacquarda Bastarda 9");
export const JacquardaBastarda_9Charted = define("Jacquarda Bastarda 9 Charted");
export const JacquesFrancois = define("Jacques Francois");
export const JacquesFrancoisShadow = define("Jacques Francois Shadow");
export const Jaini = define("Jaini");
export const JainiPurva = define("Jaini Purva");
export const Jaldi = define("Jaldi");
export const Jaro = define("Jaro");
export const Jersey_10 = define("Jersey 10");
export const Jersey_10Charted = define("Jersey 10 Charted");
export const Jersey_15 = define("Jersey 15");
export const Jersey_15Charted = define("Jersey 15 Charted");
export const Jersey_20 = define("Jersey 20");
export const Jersey_20Charted = define("Jersey 20 Charted");
export const Jersey_25 = define("Jersey 25");
export const Jersey_25Charted = define("Jersey 25 Charted");
export const JetbrainsMono = define("JetBrains Mono");
export const JimNightshade = define("Jim Nightshade");
export const Joan = define("Joan");
export const JockeyOne = define("Jockey One");
export const JollyLodger = define("Jolly Lodger");
export const Jomhuria = define("Jomhuria");
export const Jomolhari = define("Jomolhari");
export const JosefinSans = define("Josefin Sans");
export const JosefinSlab = define("Josefin Slab");
export const Jost = define("Jost");
export const JotiOne = define("Joti One");
export const Jua = define("Jua");
export const Judson = define("Judson");
export const Julee = define("Julee");
export const JuliusSansOne = define("Julius Sans One");
export const Junction = define("Junction");
export const Junge = define("Junge");
export const Jura = define("Jura");
export const JustAnotherHand = define("Just Another Hand");
export const JustMeAgainDownHere = define("Just Me Again Down Here");
export const K2d = define("K2D");
export const Kablammo = define("Kablammo");
export const Kadwa = define("Kadwa");
export const KaiseiDecol = define("Kaisei Decol");
export const KaiseiHarunoumi = define("Kaisei HarunoUmi");
export const KaiseiOpti = define("Kaisei Opti");
export const KaiseiTokumin = define("Kaisei Tokumin");
export const Kalam = define("Kalam");
export const Kalnia = define("Kalnia");
export const KalniaGlaze = define("Kalnia Glaze");
export const Kameron = define("Kameron");
export const Kanchenjunga = define("Kanchenjunga");
export const Kanit = define("Kanit");
export const KantumruyPro = define("Kantumruy Pro");
export const Kapakana = define("Kapakana");
export const Karantina = define("Karantina");
export const Karla = define("Karla");
export const Karma = define("Karma");
export const Karmilla = define("Karmilla");
export const Katibeh = define("Katibeh");
export const KaushanScript = define("Kaushan Script");
export const Kavivanar = define("Kavivanar");
export const Kavoon = define("Kavoon");
export const KayPhoDu = define("Kay Pho Du");
export const KdamThmorPro = define("Kdam Thmor Pro");
export const KeaniaOne = define("Keania One");
export const Kedebideri = define("Kedebideri");
export const KellySlab = define("Kelly Slab");
export const Kenia = define("Kenia");
export const Khand = define("Khand");
export const Khula = define("Khula");
export const Kings = define("Kings");
export const KirangHaerang = define("Kirang Haerang");
export const KiteOne = define("Kite One");
export const KiwiMaru = define("Kiwi Maru");
export const KleeOne = define("Klee One");
export const Knewave = define("Knewave");
export const Kodchasan = define("Kodchasan");
export const KodeMono = define("Kode Mono");
export const Koho = define("KoHo");
export const KohSantepheap = define("Koh Santepheap");
export const KolkerBrush = define("Kolker Brush");
export const KonkhmerSleokchher = define("Konkhmer Sleokchher");
export const Kosugi = define("Kosugi");
export const KosugiMaru = define("Kosugi Maru");
export const KottaOne = define("Kotta One");
export const Koulen = define("Koulen");
export const Kranky = define("Kranky");
export const Kreon = define("Kreon");
export const Kristi = define("Kristi");
export const KronaOne = define("Krona One");
export const Krub = define("Krub");
export const Kufam = define("Kufam");
export const KulimPark = define("Kulim Park");
export const KumarOne = define("Kumar One");
export const KumarOneOutline = define("Kumar One Outline");
export const KumbhSans = define("Kumbh Sans");
export const Kurale = define("Kurale");
export const LaBelleAurore = define("La Belle Aurore");
export const Labrada = define("Labrada");
export const Lacquer = define("Lacquer");
export const Laila = define("Laila");
export const LakkiReddy = define("Lakki Reddy");
export const Lalezar = define("Lalezar");
export const Lancelot = define("Lancelot");
export const Langar = define("Langar");
export const Lateef = define("Lateef");
export const Lato = define("Lato");
export const LavishlyYours = define("Lavishly Yours");
export const LeagueGothic = define("League Gothic");
export const LeagueMono = define("League Mono");
export const LeagueScript = define("League Script");
export const LeagueSpartan = define("League Spartan");
export const LeckerliOne = define("Leckerli One");
export const Ledger = define("Ledger");
export const Lekton = define("Lekton");
export const Lemon = define("Lemon");
export const Lemonada = define("Lemonada");
export const Lexend = define("Lexend");
export const LexendDeca = define("Lexend Deca");
export const LexendExa = define("Lexend Exa");
export const LexendGiga = define("Lexend Giga");
export const LexendMega = define("Lexend Mega");
export const LexendPeta = define("Lexend Peta");
export const LexendTera = define("Lexend Tera");
export const LexendZetta = define("Lexend Zetta");
export const Lextrall = define("Lextrall");
export const LibertinusKeyboard = define("Libertinus Keyboard");
export const LibertinusMath = define("Libertinus Math");
export const LibertinusMono = define("Libertinus Mono");
export const LibertinusSans = define("Libertinus Sans");
export const LibertinusSerif = define("Libertinus Serif");
export const LibertinusSerifDisplay = define("Libertinus Serif Display");
export const LibreBarcode_128 = define("Libre Barcode 128");
export const LibreBarcode_128Text = define("Libre Barcode 128 Text");
export const LibreBarcode_39 = define("Libre Barcode 39");
export const LibreBarcode_39Extended = define("Libre Barcode 39 Extended");
export const LibreBarcode_39ExtendedText = define("Libre Barcode 39 Extended Text");
export const LibreBarcode_39Text = define("Libre Barcode 39 Text");
export const LibreBarcodeEan13Text = define("Libre Barcode EAN13 Text");
export const LibreBaskerville = define("Libre Baskerville");
export const LibreBodoni = define("Libre Bodoni");
export const LibreCaslonCondensed = define("Libre Caslon Condensed");
export const LibreCaslonDisplay = define("Libre Caslon Display");
export const LibreCaslonText = define("Libre Caslon Text");
export const LibreFranklin = define("Libre Franklin");
export const Licorice = define("Licorice");
export const LifeSavers = define("Life Savers");
export const Lilex = define("Lilex");
export const LilitaOne = define("Lilita One");
export const LilyScriptOne = define("Lily Script One");
export const Limelight = define("Limelight");
export const LindenHill = define("Linden Hill");
export const Linefont = define("Linefont");
export const LineSeedJp = define("LINE Seed JP");
export const LisuBosa = define("Lisu Bosa");
export const Liter = define("Liter");
export const Literata = define("Literata");
export const LiuJianMaoCao = define("Liu Jian Mao Cao");
export const Livvic = define("Livvic");
export const Lobster = define("Lobster");
export const LobsterTwo = define("Lobster Two");
export const LondrinaOutline = define("Londrina Outline");
export const LondrinaShadow = define("Londrina Shadow");
export const LondrinaSketch = define("Londrina Sketch");
export const LondrinaSolid = define("Londrina Solid");
export const LongCang = define("Long Cang");
export const Lora = define("Lora");
export const LovedByTheKing = define("Loved by the King");
export const LoveLight = define("Love Light");
export const LoversQuarrel = define("Lovers Quarrel");
export const LoveYaLikeASister = define("Love Ya Like A Sister");
export const LuckiestGuy = define("Luckiest Guy");
export const Lugrasimo = define("Lugrasimo");
export const Lumanosimo = define("Lumanosimo");
export const Lunasima = define("Lunasima");
export const Lusitana = define("Lusitana");
export const Lustria = define("Lustria");
export const LuxuriousRoman = define("Luxurious Roman");
export const LuxuriousScript = define("Luxurious Script");
export const LxgwMarkerGothic = define("LXGW Marker Gothic");
export const LxgwWenkai = define("LXGW WenKai");
export const LxgwWenkaiMonoTc = define("LXGW WenKai Mono TC");
export const LxgwWenkaiTc = define("LXGW WenKai TC");
export const Macondo = define("Macondo");
export const MacondoSwashCaps = define("Macondo Swash Caps");
export const Mada = define("Mada");
export const MadimiOne = define("Madimi One");
export const Magra = define("Magra");
export const MaidenOrange = define("Maiden Orange");
export const Maitree = define("Maitree");
export const MajorMonoDisplay = define("Major Mono Display");
export const Mako = define("Mako");
export const Mali = define("Mali");
export const Mallanna = define("Mallanna");
export const Maname = define("Maname");
export const Mandali = define("Mandali");
export const Manjari = define("Manjari");
export const Manrope = define("Manrope");
export const Mansalva = define("Mansalva");
export const Manuale = define("Manuale");
export const ManufacturingConsent = define("Manufacturing Consent");
export const MapleMono = define("Maple Mono");
export const Marcellus = define("Marcellus");
export const MarcellusSc = define("Marcellus SC");
export const MarckScript = define("Marck Script");
export const Margarine = define("Margarine");
export const Marhey = define("Marhey");
export const MarkaziText = define("Markazi Text");
export const MarkoOne = define("Marko One");
export const Marmelad = define("Marmelad");
export const Martel = define("Martel");
export const MartelSans = define("Martel Sans");
export const MartianMono = define("Martian Mono");
export const Marvel = define("Marvel");
export const MaShanZheng = define("Ma Shan Zheng");
export const Matangi = define("Matangi");
export const Mate = define("Mate");
export const Matemasie = define("Matemasie");
export const MaterialIcons = define("Material Icons");
export const MaterialIconsOutlined = define("Material Icons Outlined");
export const MaterialIconsRound = define("Material Icons Round");
export const MaterialIconsSharp = define("Material Icons Sharp");
export const MaterialIconsTwoTone = define("Material Icons Two Tone");
export const MaterialSymbols = define("Material Symbols");
export const MaterialSymbolsOutlined = define("Material Symbols Outlined");
export const MaterialSymbolsRounded = define("Material Symbols Rounded");
export const MaterialSymbolsSharp = define("Material Symbols Sharp");
export const MateSc = define("Mate SC");
export const MavenPro = define("Maven Pro");
export const Mclaren = define("McLaren");
export const MeaCulpa = define("Mea Culpa");
export const Meddon = define("Meddon");
export const Medievalsharp = define("MedievalSharp");
export const MedulaOne = define("Medula One");
export const MeeraInimai = define("Meera Inimai");
export const Megrim = define("Megrim");
export const MeieScript = define("Meie Script");
export const Menbere = define("Menbere");
export const MeowScript = define("Meow Script");
export const Merienda = define("Merienda");
export const MeriendaOne = define("Merienda One");
export const Merriweather = define("Merriweather");
export const MerriweatherSans = define("Merriweather Sans");
export const Metal = define("Metal");
export const MetalMania = define("Metal Mania");
export const Metamorphous = define("Metamorphous");
export const Metrophobic = define("Metrophobic");
export const Metropolis = define("Metropolis");
export const Michroma = define("Michroma");
export const Micro_5 = define("Micro 5");
export const Micro_5Charted = define("Micro 5 Charted");
export const Milonga = define("Milonga");
export const Miltonian = define("Miltonian");
export const MiltonianTattoo = define("Miltonian Tattoo");
export const Mina = define("Mina");
export const Mingzat = define("Mingzat");
export const Miniver = define("Miniver");
export const MirandaSans = define("Miranda Sans");
export const MiriamLibre = define("Miriam Libre");
export const Mirza = define("Mirza");
export const MissFajardose = define("Miss Fajardose");
export const Mitr = define("Mitr");
export const MochiyPopOne = define("Mochiy Pop One");
export const MochiyPopPOne = define("Mochiy Pop P One");
export const Modak = define("Modak");
export const ModernAntiqua = define("Modern Antiqua");
export const Moderustic = define("Moderustic");
export const Mogra = define("Mogra");
export const Mohave = define("Mohave");
export const MoiraiOne = define("Moirai One");
export const Molengo = define("Molengo");
export const Molle = define("Molle");
export const MomoSignature = define("Momo Signature");
export const MomoTrustDisplay = define("Momo Trust Display");
export const MomoTrustSans = define("Momo Trust Sans");
export const MonaSans = define("Mona Sans");
export const MonaspaceArgon = define("Monaspace Argon");
export const MonaspaceKrypton = define("Monaspace Krypton");
export const MonaspaceNeon = define("Monaspace Neon");
export const MonaspaceRadon = define("Monaspace Radon");
export const MonaspaceXenon = define("Monaspace Xenon");
export const Monda = define("Monda");
export const Monofett = define("Monofett");
export const Monomakh = define("Monomakh");
export const MonomaniacOne = define("Monomaniac One");
export const Mononoki = define("Mononoki");
export const Monoton = define("Monoton");
export const MonsieurLaDoulaise = define("Monsieur La Doulaise");
export const Montaga = define("Montaga");
export const MontaguSlab = define("Montagu Slab");
export const Montecarlo = define("MonteCarlo");
export const Montez = define("Montez");
export const Montserrat = define("Montserrat");
export const MontserratAlternates = define("Montserrat Alternates");
export const MontserratSubrayada = define("Montserrat Subrayada");
export const MontserratUnderline = define("Montserrat Underline");
export const MooLahLah = define("Moo Lah Lah");
export const Mooli = define("Mooli");
export const MoonDance = define("Moon Dance");
export const Moul = define("Moul");
export const Moulpali = define("Moulpali");
export const MountainsOfChristmas = define("Mountains of Christmas");
export const MouseMemoirs = define("Mouse Memoirs");
export const MozillaHeadline = define("Mozilla Headline");
export const MozillaText = define("Mozilla Text");
export const MPlus_1 = define("M PLUS 1");
export const MPlus_1Code = define("M PLUS 1 Code");
export const MPlus_1p = define("M PLUS 1p");
export const MPlus_2 = define("M PLUS 2");
export const MPlusCodeLatin = define("M PLUS Code Latin");
export const MPlusRounded_1c = define("M PLUS Rounded 1c");
export const MPlusU = define("M PLUS U");
export const MrBedfort = define("Mr Bedfort");
export const MrDafoe = define("Mr Dafoe");
export const MrDeHaviland = define("Mr De Haviland");
export const MrsSaintDelafield = define("Mrs Saint Delafield");
export const MrsSheppards = define("Mrs Sheppards");
export const MsMadi = define("Ms Madi");
export const Mukta = define("Mukta");
export const MuktaMahee = define("Mukta Mahee");
export const MuktaMalar = define("Mukta Malar");
export const MuktaVaani = define("Mukta Vaani");
export const Mulish = define("Mulish");
export const Murecho = define("Murecho");
export const Museomoderno = define("MuseoModerno");
export const Mynerve = define("Mynerve");
export const MySoul = define("My Soul");
export const MysteryQuest = define("Mystery Quest");
export const Nabla = define("Nabla");
export const Namdhinggo = define("Namdhinggo");
export const NanumBrushScript = define("Nanum Brush Script");
export const NanumGothic = define("Nanum Gothic");
export const NanumGothicCoding = define("Nanum Gothic Coding");
export const NanumMyeongjo = define("Nanum Myeongjo");
export const NanumPenScript = define("Nanum Pen Script");
export const Narnoor = define("Narnoor");
export const NataSans = define("Nata Sans");
export const NationalPark = define("National Park");
export const NebulaSans = define("Nebula Sans");
export const Neonderthaw = define("Neonderthaw");
export const NerkoOne = define("Nerko One");
export const Neucha = define("Neucha");
export const Neuton = define("Neuton");
export const NewAmsterdam = define("New Amsterdam");
export const NewRocker = define("New Rocker");
export const NewsCycle = define("News Cycle");
export const Newsreader = define("Newsreader");
export const NewTegomin = define("New Tegomin");
export const Niconne = define("Niconne");
export const Niramit = define("Niramit");
export const NixieOne = define("Nixie One");
export const Nobile = define("Nobile");
export const Nokora = define("Nokora");
export const Norican = define("Norican");
export const Norwester = define("Norwester");
export const Nosifer = define("Nosifer");
export const Notable = define("Notable");
export const NothingYouCouldDo = define("Nothing You Could Do");
export const NoticiaText = define("Noticia Text");
export const NotoKufiArabic = define("Noto Kufi Arabic");
export const NotoMono = define("Noto Mono");
export const NotoMusic = define("Noto Music");
export const NotoNaskhArabic = define("Noto Naskh Arabic");
export const NotoNastaliqUrdu = define("Noto Nastaliq Urdu");
export const NotoRashiHebrew = define("Noto Rashi Hebrew");
export const NotoSans = define("Noto Sans");
export const NotoSansAdlam = define("Noto Sans Adlam");
export const NotoSansAdlamUnjoined = define("Noto Sans Adlam Unjoined");
export const NotoSansAnatolianHieroglyphs = define("Noto Sans Anatolian Hieroglyphs");
export const NotoSansArabic = define("Noto Sans Arabic");
export const NotoSansArmenian = define("Noto Sans Armenian");
export const NotoSansAvestan = define("Noto Sans Avestan");
export const NotoSansBalinese = define("Noto Sans Balinese");
export const NotoSansBamum = define("Noto Sans Bamum");
export const NotoSansBassaVah = define("Noto Sans Bassa Vah");
export const NotoSansBatak = define("Noto Sans Batak");
export const NotoSansBengali = define("Noto Sans Bengali");
export const NotoSansBhaiksuki = define("Noto Sans Bhaiksuki");
export const NotoSansBrahmi = define("Noto Sans Brahmi");
export const NotoSansBuginese = define("Noto Sans Buginese");
export const NotoSansBuhid = define("Noto Sans Buhid");
export const NotoSansCanadianAboriginal = define("Noto Sans Canadian Aboriginal");
export const NotoSansCarian = define("Noto Sans Carian");
export const NotoSansCaucasianAlbanian = define("Noto Sans Caucasian Albanian");
export const NotoSansChakma = define("Noto Sans Chakma");
export const NotoSansCham = define("Noto Sans Cham");
export const NotoSansCherokee = define("Noto Sans Cherokee");
export const NotoSansChorasmian = define("Noto Sans Chorasmian");
export const NotoSansCoptic = define("Noto Sans Coptic");
export const NotoSansCuneiform = define("Noto Sans Cuneiform");
export const NotoSansCypriot = define("Noto Sans Cypriot");
export const NotoSansCyproMinoan = define("Noto Sans Cypro Minoan");
export const NotoSansDeseret = define("Noto Sans Deseret");
export const NotoSansDevanagari = define("Noto Sans Devanagari");
export const NotoSansDisplay = define("Noto Sans Display");
export const NotoSansDuployan = define("Noto Sans Duployan");
export const NotoSansEgyptianHieroglyphs = define("Noto Sans Egyptian Hieroglyphs");
export const NotoSansElbasan = define("Noto Sans Elbasan");
export const NotoSansElymaic = define("Noto Sans Elymaic");
export const NotoSansEthiopic = define("Noto Sans Ethiopic");
export const NotoSansGeorgian = define("Noto Sans Georgian");
export const NotoSansGlagolitic = define("Noto Sans Glagolitic");
export const NotoSansGothic = define("Noto Sans Gothic");
export const NotoSansGrantha = define("Noto Sans Grantha");
export const NotoSansGujarati = define("Noto Sans Gujarati");
export const NotoSansGunjalaGondi = define("Noto Sans Gunjala Gondi");
export const NotoSansGurmukhi = define("Noto Sans Gurmukhi");
export const NotoSansHanifiRohingya = define("Noto Sans Hanifi Rohingya");
export const NotoSansHanunoo = define("Noto Sans Hanunoo");
export const NotoSansHatran = define("Noto Sans Hatran");
export const NotoSansHebrew = define("Noto Sans Hebrew");
export const NotoSansHk = define("Noto Sans HK");
export const NotoSansImperialAramaic = define("Noto Sans Imperial Aramaic");
export const NotoSansIndicSiyaqNumbers = define("Noto Sans Indic Siyaq Numbers");
export const NotoSansInscriptionalPahlavi = define("Noto Sans Inscriptional Pahlavi");
export const NotoSansInscriptionalParthian = define("Noto Sans Inscriptional Parthian");
export const NotoSansJavanese = define("Noto Sans Javanese");
export const NotoSansJp = define("Noto Sans JP");
export const NotoSansKaithi = define("Noto Sans Kaithi");
export const NotoSansKannada = define("Noto Sans Kannada");
export const NotoSansKawi = define("Noto Sans Kawi");
export const NotoSansKayahLi = define("Noto Sans Kayah Li");
export const NotoSansKharoshthi = define("Noto Sans Kharoshthi");
export const NotoSansKhmer = define("Noto Sans Khmer");
export const NotoSansKhojki = define("Noto Sans Khojki");
export const NotoSansKhudawadi = define("Noto Sans Khudawadi");
export const NotoSansKr = define("Noto Sans KR");
export const NotoSansLao = define("Noto Sans Lao");
export const NotoSansLaoLooped = define("Noto Sans Lao Looped");
export const NotoSansLepcha = define("Noto Sans Lepcha");
export const NotoSansLimbu = define("Noto Sans Limbu");
export const NotoSansLinearA = define("Noto Sans Linear A");
export const NotoSansLinearB = define("Noto Sans Linear B");
export const NotoSansLisu = define("Noto Sans Lisu");
export const NotoSansLydian = define("Noto Sans Lydian");
export const NotoSansMahajani = define("Noto Sans Mahajani");
export const NotoSansMalayalam = define("Noto Sans Malayalam");
export const NotoSansMandaic = define("Noto Sans Mandaic");
export const NotoSansManichaean = define("Noto Sans Manichaean");
export const NotoSansMarchen = define("Noto Sans Marchen");
export const NotoSansMasaramGondi = define("Noto Sans Masaram Gondi");
export const NotoSansMath = define("Noto Sans Math");
export const NotoSansMayanNumerals = define("Noto Sans Mayan Numerals");
export const NotoSansMedefaidrin = define("Noto Sans Medefaidrin");
export const NotoSansMeeteiMayek = define("Noto Sans Meetei Mayek");
export const NotoSansMendeKikakui = define("Noto Sans Mende Kikakui");
export const NotoSansMeroitic = define("Noto Sans Meroitic");
export const NotoSansMiao = define("Noto Sans Miao");
export const NotoSansModi = define("Noto Sans Modi");
export const NotoSansMongolian = define("Noto Sans Mongolian");
export const NotoSansMono = define("Noto Sans Mono");
export const NotoSansMro = define("Noto Sans Mro");
export const NotoSansMultani = define("Noto Sans Multani");
export const NotoSansMyanmar = define("Noto Sans Myanmar");
export const NotoSansNabataean = define("Noto Sans Nabataean");
export const NotoSansNagMundari = define("Noto Sans Nag Mundari");
export const NotoSansNandinagari = define("Noto Sans Nandinagari");
export const NotoSansNewa = define("Noto Sans Newa");
export const NotoSansNewTaiLue = define("Noto Sans New Tai Lue");
export const NotoSansNko = define("Noto Sans NKo");
export const NotoSansNkoUnjoined = define("Noto Sans NKo Unjoined");
export const NotoSansNushu = define("Noto Sans Nushu");
export const NotoSansOgham = define("Noto Sans Ogham");
export const NotoSansOlChiki = define("Noto Sans Ol Chiki");
export const NotoSansOldHungarian = define("Noto Sans Old Hungarian");
export const NotoSansOldItalic = define("Noto Sans Old Italic");
export const NotoSansOldNorthArabian = define("Noto Sans Old North Arabian");
export const NotoSansOldPermic = define("Noto Sans Old Permic");
export const NotoSansOldPersian = define("Noto Sans Old Persian");
export const NotoSansOldSogdian = define("Noto Sans Old Sogdian");
export const NotoSansOldSouthArabian = define("Noto Sans Old South Arabian");
export const NotoSansOldTurkic = define("Noto Sans Old Turkic");
export const NotoSansOriya = define("Noto Sans Oriya");
export const NotoSansOsage = define("Noto Sans Osage");
export const NotoSansOsmanya = define("Noto Sans Osmanya");
export const NotoSansPahawhHmong = define("Noto Sans Pahawh Hmong");
export const NotoSansPalmyrene = define("Noto Sans Palmyrene");
export const NotoSansPauCinHau = define("Noto Sans Pau Cin Hau");
export const NotoSansPhagspa = define("Noto Sans PhagsPa");
export const NotoSansPhoenician = define("Noto Sans Phoenician");
export const NotoSansPsalterPahlavi = define("Noto Sans Psalter Pahlavi");
export const NotoSansRejang = define("Noto Sans Rejang");
export const NotoSansRunic = define("Noto Sans Runic");
export const NotoSansSamaritan = define("Noto Sans Samaritan");
export const NotoSansSaurashtra = define("Noto Sans Saurashtra");
export const NotoSansSc = define("Noto Sans SC");
export const NotoSansSharada = define("Noto Sans Sharada");
export const NotoSansShavian = define("Noto Sans Shavian");
export const NotoSansSiddham = define("Noto Sans Siddham");
export const NotoSansSignwriting = define("Noto Sans SignWriting");
export const NotoSansSinhala = define("Noto Sans Sinhala");
export const NotoSansSogdian = define("Noto Sans Sogdian");
export const NotoSansSoraSompeng = define("Noto Sans Sora Sompeng");
export const NotoSansSoyombo = define("Noto Sans Soyombo");
export const NotoSansSundanese = define("Noto Sans Sundanese");
export const NotoSansSunuwar = define("Noto Sans Sunuwar");
export const NotoSansSylotiNagri = define("Noto Sans Syloti Nagri");
export const NotoSansSymbols = define("Noto Sans Symbols");
export const NotoSansSymbols_2 = define("Noto Sans Symbols 2");
export const NotoSansSyriac = define("Noto Sans Syriac");
export const NotoSansSyriacEastern = define("Noto Sans Syriac Eastern");
export const NotoSansSyriacWestern = define("Noto Sans Syriac Western");
export const NotoSansTagalog = define("Noto Sans Tagalog");
export const NotoSansTagbanwa = define("Noto Sans Tagbanwa");
export const NotoSansTaiLe = define("Noto Sans Tai Le");
export const NotoSansTaiTham = define("Noto Sans Tai Tham");
export const NotoSansTaiViet = define("Noto Sans Tai Viet");
export const NotoSansTakri = define("Noto Sans Takri");
export const NotoSansTamil = define("Noto Sans Tamil");
export const NotoSansTamilSupplement = define("Noto Sans Tamil Supplement");
export const NotoSansTangsa = define("Noto Sans Tangsa");
export const NotoSansTc = define("Noto Sans TC");
export const NotoSansTelugu = define("Noto Sans Telugu");
export const NotoSansThaana = define("Noto Sans Thaana");
export const NotoSansThai = define("Noto Sans Thai");
export const NotoSansThaiLooped = define("Noto Sans Thai Looped");
export const NotoSansTifinagh = define("Noto Sans Tifinagh");
export const NotoSansTirhuta = define("Noto Sans Tirhuta");
export const NotoSansUgaritic = define("Noto Sans Ugaritic");
export const NotoSansVai = define("Noto Sans Vai");
export const NotoSansVithkuqi = define("Noto Sans Vithkuqi");
export const NotoSansWancho = define("Noto Sans Wancho");
export const NotoSansWarangCiti = define("Noto Sans Warang Citi");
export const NotoSansYi = define("Noto Sans Yi");
export const NotoSansZanabazarSquare = define("Noto Sans Zanabazar Square");
export const NotoSerif = define("Noto Serif");
export const NotoSerifAhom = define("Noto Serif Ahom");
export const NotoSerifArmenian = define("Noto Serif Armenian");
export const NotoSerifBalinese = define("Noto Serif Balinese");
export const NotoSerifBengali = define("Noto Serif Bengali");
export const NotoSerifDevanagari = define("Noto Serif Devanagari");
export const NotoSerifDisplay = define("Noto Serif Display");
export const NotoSerifDivesAkuru = define("Noto Serif Dives Akuru");
export const NotoSerifDogra = define("Noto Serif Dogra");
export const NotoSerifEthiopic = define("Noto Serif Ethiopic");
export const NotoSerifGeorgian = define("Noto Serif Georgian");
export const NotoSerifGrantha = define("Noto Serif Grantha");
export const NotoSerifGujarati = define("Noto Serif Gujarati");
export const NotoSerifGurmukhi = define("Noto Serif Gurmukhi");
export const NotoSerifHebrew = define("Noto Serif Hebrew");
export const NotoSerifHentaigana = define("Noto Serif Hentaigana");
export const NotoSerifHk = define("Noto Serif HK");
export const NotoSerifJp = define("Noto Serif JP");
export const NotoSerifKannada = define("Noto Serif Kannada");
export const NotoSerifKhitanSmallScript = define("Noto Serif Khitan Small Script");
export const NotoSerifKhmer = define("Noto Serif Khmer");
export const NotoSerifKhojki = define("Noto Serif Khojki");
export const NotoSerifKr = define("Noto Serif KR");
export const NotoSerifLao = define("Noto Serif Lao");
export const NotoSerifMakasar = define("Noto Serif Makasar");
export const NotoSerifMalayalam = define("Noto Serif Malayalam");
export const NotoSerifNpHmong = define("Noto Serif NP Hmong");
export const NotoSerifOldUyghur = define("Noto Serif Old Uyghur");
export const NotoSerifOriya = define("Noto Serif Oriya");
export const NotoSerifOttomanSiyaq = define("Noto Serif Ottoman Siyaq");
export const NotoSerifSc = define("Noto Serif SC");
export const NotoSerifSinhala = define("Noto Serif Sinhala");
export const NotoSerifTamil = define("Noto Serif Tamil");
export const NotoSerifTangut = define("Noto Serif Tangut");
export const NotoSerifTc = define("Noto Serif TC");
export const NotoSerifTelugu = define("Noto Serif Telugu");
export const NotoSerifThai = define("Noto Serif Thai");
export const NotoSerifTibetan = define("Noto Serif Tibetan");
export const NotoSerifTodhri = define("Noto Serif Todhri");
export const NotoSerifToto = define("Noto Serif Toto");
export const NotoSerifVithkuqi = define("Noto Serif Vithkuqi");
export const NotoSerifYezidi = define("Noto Serif Yezidi");
export const NotoTraditionalNushu = define("Noto Traditional Nushu");
export const NotoZnamennyMusicalNotation = define("Noto Znamenny Musical Notation");
export const NovaCut = define("Nova Cut");
export const NovaFlat = define("Nova Flat");
export const NovaMono = define("Nova Mono");
export const NovaOval = define("Nova Oval");
export const NovaRound = define("Nova Round");
export const NovaScript = define("Nova Script");
export const NovaSlim = define("Nova Slim");
export const NovaSquare = define("Nova Square");
export const Ntr = define("NTR");
export const Numans = define("Numans");
export const Nunito = define("Nunito");
export const NunitoSans = define("Nunito Sans");
export const NuosuSil = define("Nuosu SIL");
export const OdibeeSans = define("Odibee Sans");
export const OdorMeanChey = define("Odor Mean Chey");
export const Offside = define("Offside");
export const Oi = define("Oi");
export const Ojuju = define("Ojuju");
export const Oldenburg = define("Oldenburg");
export const OldStandardTt = define("Old Standard TT");
export const Ole = define("Ole");
export const OleoScript = define("Oleo Script");
export const OleoScriptSwashCaps = define("Oleo Script Swash Caps");
export const Onest = define("Onest");
export const OoohBaby = define("Oooh Baby");
export const Opendyslexic = define("OpenDyslexic");
export const OpenRunde = define("Open Runde");
export const OpenSans = define("Open Sans");
export const OpenSauceOne = define("Open Sauce One");
export const OpenSauceSans = define("Open Sauce Sans");
export const OpenSauceTwo = define("Open Sauce Two");
export const Oranienbaum = define("Oranienbaum");
export const Orbit = define("Orbit");
export const Orbitron = define("Orbitron");
export const Oregano = define("Oregano");
export const OrelegaOne = define("Orelega One");
export const Orienta = define("Orienta");
export const OriginalSurfer = define("Original Surfer");
export const OstrichSans = define("Ostrich Sans");
export const Oswald = define("Oswald");
export const Outfit = define("Outfit");
export const Overlock = define("Overlock");
export const OverlockSc = define("Overlock SC");
export const Overpass = define("Overpass");
export const OverpassMono = define("Overpass Mono");
export const OverTheRainbow = define("Over the Rainbow");
export const Ovo = define("Ovo");
export const Oxanium = define("Oxanium");
export const Oxygen = define("Oxygen");
export const OxygenMono = define("Oxygen Mono");
export const Pacifico = define("Pacifico");
export const Padauk = define("Padauk");
export const PadyakkeExpandedOne = define("Padyakke Expanded One");
export const Palanquin = define("Palanquin");
export const PalanquinDark = define("Palanquin Dark");
export const PaletteMosaic = define("Palette Mosaic");
export const Pangolin = define("Pangolin");
export const Paprika = define("Paprika");
export const Parastoo = define("Parastoo");
export const Parisienne = define("Parisienne");
export const Parkinsans = define("Parkinsans");
export const PasseroOne = define("Passero One");
export const PassionOne = define("Passion One");
export const PassionsConflict = define("Passions Conflict");
export const PathwayExtreme = define("Pathway Extreme");
export const PathwayGothicOne = define("Pathway Gothic One");
export const PatrickHand = define("Patrick Hand");
export const PatrickHandSc = define("Patrick Hand SC");
export const Pattaya = define("Pattaya");
export const PatuaOne = define("Patua One");
export const Pavanam = define("Pavanam");
export const PaytoneOne = define("Paytone One");
export const PeaceSans = define("Peace Sans");
export const Peddana = define("Peddana");
export const Peralta = define("Peralta");
export const PermanentMarker = define("Permanent Marker");
export const Petemoss = define("Petemoss");
export const PetitFormalScript = define("Petit Formal Script");
export const Petrona = define("Petrona");
export const Philosopher = define("Philosopher");
export const Phudu = define("Phudu");
export const Piazzolla = define("Piazzolla");
export const Piedra = define("Piedra");
export const PinyonScript = define("Pinyon Script");
export const PirataOne = define("Pirata One");
export const PitagonSans = define("Pitagon Sans");
export const PitagonSansMono = define("Pitagon Sans Mono");
export const PitagonSansText = define("Pitagon Sans Text");
export const PitagonSerif = define("Pitagon Serif");
export const PixelifySans = define("Pixelify Sans");
export const Plaster = define("Plaster");
export const Platypi = define("Platypi");
export const Play = define("Play");
export const Playball = define("Playball");
export const Playfair = define("Playfair");
export const PlayfairDisplay = define("Playfair Display");
export const PlayfairDisplaySc = define("Playfair Display SC");
export const PlaypenSans = define("Playpen Sans");
export const PlaypenSansArabic = define("Playpen Sans Arabic");
export const PlaypenSansDeva = define("Playpen Sans Deva");
export const PlaypenSansHebrew = define("Playpen Sans Hebrew");
export const PlaypenSansThai = define("Playpen Sans Thai");
export const PlaywriteAr = define("Playwrite AR");
export const PlaywriteArGuides = define("Playwrite AR Guides");
export const PlaywriteAt = define("Playwrite AT");
export const PlaywriteAtGuides = define("Playwrite AT Guides");
export const PlaywriteAuNsw = define("Playwrite AU NSW");
export const PlaywriteAuNswGuides = define("Playwrite AU NSW Guides");
export const PlaywriteAuQld = define("Playwrite AU QLD");
export const PlaywriteAuQldGuides = define("Playwrite AU QLD Guides");
export const PlaywriteAuSa = define("Playwrite AU SA");
export const PlaywriteAuSaGuides = define("Playwrite AU SA Guides");
export const PlaywriteAuTas = define("Playwrite AU TAS");
export const PlaywriteAuTasGuides = define("Playwrite AU TAS Guides");
export const PlaywriteAuVic = define("Playwrite AU VIC");
export const PlaywriteAuVicGuides = define("Playwrite AU VIC Guides");
export const PlaywriteBeVlg = define("Playwrite BE VLG");
export const PlaywriteBeVlgGuides = define("Playwrite BE VLG Guides");
export const PlaywriteBeWal = define("Playwrite BE WAL");
export const PlaywriteBeWalGuides = define("Playwrite BE WAL Guides");
export const PlaywriteBr = define("Playwrite BR");
export const PlaywriteBrGuides = define("Playwrite BR Guides");
export const PlaywriteCa = define("Playwrite CA");
export const PlaywriteCaGuides = define("Playwrite CA Guides");
export const PlaywriteCl = define("Playwrite CL");
export const PlaywriteClGuides = define("Playwrite CL Guides");
export const PlaywriteCo = define("Playwrite CO");
export const PlaywriteCoGuides = define("Playwrite CO Guides");
export const PlaywriteCu = define("Playwrite CU");
export const PlaywriteCuGuides = define("Playwrite CU Guides");
export const PlaywriteCz = define("Playwrite CZ");
export const PlaywriteCzGuides = define("Playwrite CZ Guides");
export const PlaywriteDeGrund = define("Playwrite DE Grund");
export const PlaywriteDeGrundGuides = define("Playwrite DE Grund Guides");
export const PlaywriteDeLa = define("Playwrite DE LA");
export const PlaywriteDeLaGuides = define("Playwrite DE LA Guides");
export const PlaywriteDeSas = define("Playwrite DE SAS");
export const PlaywriteDeSasGuides = define("Playwrite DE SAS Guides");
export const PlaywriteDeVa = define("Playwrite DE VA");
export const PlaywriteDeVaGuides = define("Playwrite DE VA Guides");
export const PlaywriteDkLoopet = define("Playwrite DK Loopet");
export const PlaywriteDkLoopetGuides = define("Playwrite DK Loopet Guides");
export const PlaywriteDkUloopet = define("Playwrite DK Uloopet");
export const PlaywriteDkUloopetGuides = define("Playwrite DK Uloopet Guides");
export const PlaywriteEs = define("Playwrite ES");
export const PlaywriteEsDeco = define("Playwrite ES Deco");
export const PlaywriteEsDecoGuides = define("Playwrite ES Deco Guides");
export const PlaywriteEsGuides = define("Playwrite ES Guides");
export const PlaywriteFrModerne = define("Playwrite FR Moderne");
export const PlaywriteFrModerneGuides = define("Playwrite FR Moderne Guides");
export const PlaywriteFrTrad = define("Playwrite FR Trad");
export const PlaywriteFrTradGuides = define("Playwrite FR Trad Guides");
export const PlaywriteGbJ = define("Playwrite GB J");
export const PlaywriteGbJGuides = define("Playwrite GB J Guides");
export const PlaywriteGbS = define("Playwrite GB S");
export const PlaywriteGbSGuides = define("Playwrite GB S Guides");
export const PlaywriteHr = define("Playwrite HR");
export const PlaywriteHrGuides = define("Playwrite HR Guides");
export const PlaywriteHrLijeva = define("Playwrite HR Lijeva");
export const PlaywriteHrLijevaGuides = define("Playwrite HR Lijeva Guides");
export const PlaywriteHu = define("Playwrite HU");
export const PlaywriteHuGuides = define("Playwrite HU Guides");
export const PlaywriteId = define("Playwrite ID");
export const PlaywriteIdGuides = define("Playwrite ID Guides");
export const PlaywriteIe = define("Playwrite IE");
export const PlaywriteIeGuides = define("Playwrite IE Guides");
export const PlaywriteIn = define("Playwrite IN");
export const PlaywriteInGuides = define("Playwrite IN Guides");
export const PlaywriteIs = define("Playwrite IS");
export const PlaywriteIsGuides = define("Playwrite IS Guides");
export const PlaywriteItModerna = define("Playwrite IT Moderna");
export const PlaywriteItModernaGuides = define("Playwrite IT Moderna Guides");
export const PlaywriteItTrad = define("Playwrite IT Trad");
export const PlaywriteItTradGuides = define("Playwrite IT Trad Guides");
export const PlaywriteMx = define("Playwrite MX");
export const PlaywriteMxGuides = define("Playwrite MX Guides");
export const PlaywriteNgModern = define("Playwrite NG Modern");
export const PlaywriteNgModernGuides = define("Playwrite NG Modern Guides");
export const PlaywriteNl = define("Playwrite NL");
export const PlaywriteNlGuides = define("Playwrite NL Guides");
export const PlaywriteNo = define("Playwrite NO");
export const PlaywriteNoGuides = define("Playwrite NO Guides");
export const PlaywriteNz = define("Playwrite NZ");
export const PlaywriteNzBasic = define("Playwrite NZ Basic");
export const PlaywriteNzBasicGuides = define("Playwrite NZ Basic Guides");
export const PlaywriteNzGuides = define("Playwrite NZ Guides");
export const PlaywritePe = define("Playwrite PE");
export const PlaywritePeGuides = define("Playwrite PE Guides");
export const PlaywritePl = define("Playwrite PL");
export const PlaywritePlGuides = define("Playwrite PL Guides");
export const PlaywritePt = define("Playwrite PT");
export const PlaywritePtGuides = define("Playwrite PT Guides");
export const PlaywriteRo = define("Playwrite RO");
export const PlaywriteRoGuides = define("Playwrite RO Guides");
export const PlaywriteSk = define("Playwrite SK");
export const PlaywriteSkGuides = define("Playwrite SK Guides");
export const PlaywriteTz = define("Playwrite TZ");
export const PlaywriteTzGuides = define("Playwrite TZ Guides");
export const PlaywriteUsModern = define("Playwrite US Modern");
export const PlaywriteUsModernGuides = define("Playwrite US Modern Guides");
export const PlaywriteUsTrad = define("Playwrite US Trad");
export const PlaywriteUsTradGuides = define("Playwrite US Trad Guides");
export const PlaywriteVn = define("Playwrite VN");
export const PlaywriteVnGuides = define("Playwrite VN Guides");
export const PlaywriteZa = define("Playwrite ZA");
export const PlaywriteZaGuides = define("Playwrite ZA Guides");
export const PlusJakartaSans = define("Plus Jakarta Sans");
export const Pochaevsk = define("Pochaevsk");
export const Podkova = define("Podkova");
export const PoetsenOne = define("Poetsen One");
export const PoiretOne = define("Poiret One");
export const PollerOne = define("Poller One");
export const PoltawskiNowy = define("Poltawski Nowy");
export const Poly = define("Poly");
export const Pompiere = define("Pompiere");
export const Ponnala = define("Ponnala");
export const Ponomar = define("Ponomar");
export const PontanoSans = define("Pontano Sans");
export const PoorStory = define("Poor Story");
export const Poppins = define("Poppins");
export const PortLligatSans = define("Port Lligat Sans");
export const PortLligatSlab = define("Port Lligat Slab");
export const PottaOne = define("Potta One");
export const PragatiNarrow = define("Pragati Narrow");
export const Praise = define("Praise");
export const Prata = define("Prata");
export const Preahvihear = define("Preahvihear");
export const PressStart_2p = define("Press Start 2P");
export const Pretendard = define("Pretendard");
export const Pridi = define("Pridi");
export const PrincessSofia = define("Princess Sofia");
export const Prociono = define("Prociono");
export const Prompt = define("Prompt");
export const ProstoOne = define("Prosto One");
export const ProtestGuerrilla = define("Protest Guerrilla");
export const ProtestRevolution = define("Protest Revolution");
export const ProtestRiot = define("Protest Riot");
export const ProtestStrike = define("Protest Strike");
export const ProzaLibre = define("Proza Libre");
export const PtMono = define("PT Mono");
export const PtSans = define("PT Sans");
export const PtSansCaption = define("PT Sans Caption");
export const PtSansNarrow = define("PT Sans Narrow");
export const PtSerif = define("PT Serif");
export const PtSerifCaption = define("PT Serif Caption");
export const PublicSans = define("Public Sans");
export const PuppiesPlay = define("Puppies Play");
export const Puritan = define("Puritan");
export const PurplePurse = define("Purple Purse");
export const Pushster = define("Pushster");
export const Qahiri = define("Qahiri");
export const Quando = define("Quando");
export const Quantico = define("Quantico");
export const Quattrocento = define("Quattrocento");
export const QuattrocentoSans = define("Quattrocento Sans");
export const Questrial = define("Questrial");
export const Quicksand = define("Quicksand");
export const Quintessential = define("Quintessential");
export const Qwigley = define("Qwigley");
export const QwitcherGrypen = define("Qwitcher Grypen");
export const RacingSansOne = define("Racing Sans One");
export const RadioCanada = define("Radio Canada");
export const RadioCanadaBig = define("Radio Canada Big");
export const Radley = define("Radley");
export const Rajdhani = define("Rajdhani");
export const Rakkas = define("Rakkas");
export const Raleway = define("Raleway");
export const RalewayDots = define("Raleway Dots");
export const Ramabhadra = define("Ramabhadra");
export const Ramaraja = define("Ramaraja");
export const Rambla = define("Rambla");
export const RammettoOne = define("Rammetto One");
export const RampartOne = define("Rampart One");
export const Ramsina = define("Ramsina");
export const Ranchers = define("Ranchers");
export const Rancho = define("Rancho");
export const Ranga = define("Ranga");
export const Rasa = define("Rasa");
export const Rationale = define("Rationale");
export const RaviPrakash = define("Ravi Prakash");
export const ReadexPro = define("Readex Pro");
export const Recursive = define("Recursive");
export const Redacted = define("Redacted");
export const RedactedScript = define("Redacted Script");
export const Redaction = define("Redaction");
export const Redaction_10 = define("Redaction 10");
export const Redaction_100 = define("Redaction 100");
export const Redaction_20 = define("Redaction 20");
export const Redaction_35 = define("Redaction 35");
export const Redaction_50 = define("Redaction 50");
export const Redaction_70 = define("Redaction 70");
export const RedditMono = define("Reddit Mono");
export const RedditSans = define("Reddit Sans");
export const RedditSansCondensed = define("Reddit Sans Condensed");
export const RedHatDisplay = define("Red Hat Display");
export const RedHatMono = define("Red Hat Mono");
export const RedHatText = define("Red Hat Text");
export const Redressed = define("Redressed");
export const RedRose = define("Red Rose");
export const ReemKufi = define("Reem Kufi");
export const ReemKufiFun = define("Reem Kufi Fun");
export const ReemKufiInk = define("Reem Kufi Ink");
export const ReenieBeanie = define("Reenie Beanie");
export const ReggaeOne = define("Reggae One");
export const Rem = define("REM");
export const RethinkSans = define("Rethink Sans");
export const Revalia = define("Revalia");
export const RhodiumLibre = define("Rhodium Libre");
export const Ribeye = define("Ribeye");
export const RibeyeMarrow = define("Ribeye Marrow");
export const Righteous = define("Righteous");
export const Risque = define("Risque");
export const RoadRage = define("Road Rage");
export const Roboto = define("Roboto");
export const RobotoCondensed = define("Roboto Condensed");
export const RobotoFlex = define("Roboto Flex");
export const RobotoMono = define("Roboto Mono");
export const RobotoSerif = define("Roboto Serif");
export const RobotoSlab = define("Roboto Slab");
export const Rochester = define("Rochester");
export const Rock_3d = define("Rock 3D");
export const RocknrollOne = define("RocknRoll One");
export const RockSalt = define("Rock Salt");
export const Rokkitt = define("Rokkitt");
export const Romanesco = define("Romanesco");
export const RopaSans = define("Ropa Sans");
export const Rosario = define("Rosario");
export const Rosarivo = define("Rosarivo");
export const RougeScript = define("Rouge Script");
export const Rowdies = define("Rowdies");
export const RozhaOne = define("Rozha One");
export const Rubik = define("Rubik");
export const Rubik_80sFade = define("Rubik 80s Fade");
export const RubikBeastly = define("Rubik Beastly");
export const RubikBrokenFax = define("Rubik Broken Fax");
export const RubikBubbles = define("Rubik Bubbles");
export const RubikBurned = define("Rubik Burned");
export const RubikDirt = define("Rubik Dirt");
export const RubikDistressed = define("Rubik Distressed");
export const RubikDoodleShadow = define("Rubik Doodle Shadow");
export const RubikDoodleTriangles = define("Rubik Doodle Triangles");
export const RubikGemstones = define("Rubik Gemstones");
export const RubikGlitch = define("Rubik Glitch");
export const RubikGlitchPop = define("Rubik Glitch Pop");
export const RubikIso = define("Rubik Iso");
export const RubikLines = define("Rubik Lines");
export const RubikMaps = define("Rubik Maps");
export const RubikMarkerHatch = define("Rubik Marker Hatch");
export const RubikMaze = define("Rubik Maze");
export const RubikMicrobe = define("Rubik Microbe");
export const RubikMonoOne = define("Rubik Mono One");
export const RubikMoonrocks = define("Rubik Moonrocks");
export const RubikOne = define("Rubik One");
export const RubikPixels = define("Rubik Pixels");
export const RubikPuddles = define("Rubik Puddles");
export const RubikScribble = define("Rubik Scribble");
export const RubikSprayPaint = define("Rubik Spray Paint");
export const RubikStorm = define("Rubik Storm");
export const RubikVinyl = define("Rubik Vinyl");
export const RubikWetPaint = define("Rubik Wet Paint");
export const Ruda = define("Ruda");
export const Rufina = define("Rufina");
export const RugeBoogie = define("Ruge Boogie");
export const Ruluko = define("Ruluko");
export const RumRaisin = define("Rum Raisin");
export const RuslanDisplay = define("Ruslan Display");
export const RussoOne = define("Russo One");
export const Ruthie = define("Ruthie");
export const Ruwudu = define("Ruwudu");
export const Rye = define("Rye");
export const Sacramento = define("Sacramento");
export const Sahitya = define("Sahitya");
export const Sail = define("Sail");
export const Saira = define("Saira");
export const SairaCondensed = define("Saira Condensed");
export const SairaExtraCondensed = define("Saira Extra Condensed");
export const SairaSemiCondensed = define("Saira Semi Condensed");
export const SairaStencil = define("Saira Stencil");
export const SairaStencilOne = define("Saira Stencil One");
export const Salsa = define("Salsa");
export const Sanchez = define("Sanchez");
export const Sancreek = define("Sancreek");
export const SankofaDisplay = define("Sankofa Display");
export const Sansation = define("Sansation");
export const Sansita = define("Sansita");
export const SansitaSwashed = define("Sansita Swashed");
export const Sarabun = define("Sarabun");
export const Sarala = define("Sarala");
export const Sarina = define("Sarina");
export const Sarpanch = define("Sarpanch");
export const SassyFrass = define("Sassy Frass");
export const Satisfy = define("Satisfy");
export const Savate = define("Savate");
export const SawarabiGothic = define("Sawarabi Gothic");
export const SawarabiMincho = define("Sawarabi Mincho");
export const Scada = define("Scada");
export const ScheherazadeNew = define("Scheherazade New");
export const SchibstedGrotesk = define("Schibsted Grotesk");
export const Schoolbell = define("Schoolbell");
export const ScienceGothic = define("Science Gothic");
export const ScopeOne = define("Scope One");
export const SeaweedScript = define("Seaweed Script");
export const SecularOne = define("Secular One");
export const Sedan = define("Sedan");
export const SedanSc = define("Sedan SC");
export const SedgwickAve = define("Sedgwick Ave");
export const SedgwickAveDisplay = define("Sedgwick Ave Display");
export const Sekuya = define("Sekuya");
export const Sen = define("Sen");
export const SendFlowers = define("Send Flowers");
export const Sevillana = define("Sevillana");
export const SeymourOne = define("Seymour One");
export const ShadowsIntoLight = define("Shadows Into Light");
export const ShadowsIntoLightTwo = define("Shadows Into Light Two");
export const Shafarik = define("Shafarik");
export const Shalimar = define("Shalimar");
export const ShantellSans = define("Shantell Sans");
export const Shanti = define("Shanti");
export const Share = define("Share");
export const ShareTech = define("Share Tech");
export const ShareTechMono = define("Share Tech Mono");
export const ShipporiAntique = define("Shippori Antique");
export const ShipporiAntiqueB1 = define("Shippori Antique B1");
export const ShipporiMincho = define("Shippori Mincho");
export const ShipporiMinchoB1 = define("Shippori Mincho B1");
export const Shizuru = define("Shizuru");
export const Shojumaru = define("Shojumaru");
export const ShortStack = define("Short Stack");
export const Shrikhand = define("Shrikhand");
export const Sigmar = define("Sigmar");
export const SigmarOne = define("Sigmar One");
export const Signika = define("Signika");
export const SignikaNegative = define("Signika Negative");
export const Silkscreen = define("Silkscreen");
export const Simonetta = define("Simonetta");
export const Sintony = define("Sintony");
export const SirinStencil = define("Sirin Stencil");
export const Sirivennela = define("Sirivennela");
export const SixCaps = define("Six Caps");
export const Sixtyfour = define("Sixtyfour");
export const SixtyfourConvergence = define("Sixtyfour Convergence");
export const Skranji = define("Skranji");
export const Slabo_13px = define("Slabo 13px");
export const Slabo_27px = define("Slabo 27px");
export const Slackey = define("Slackey");
export const SlacksideOne = define("Slackside One");
export const Smokum = define("Smokum");
export const Smooch = define("Smooch");
export const SmoochSans = define("Smooch Sans");
export const Smythe = define("Smythe");
export const Sniglet = define("Sniglet");
export const Snippet = define("Snippet");
export const SnowburstOne = define("Snowburst One");
export const SnPro = define("SN Pro");
export const SofadiOne = define("Sofadi One");
export const Sofia = define("Sofia");
export const SofiaSans = define("Sofia Sans");
export const SofiaSansCondensed = define("Sofia Sans Condensed");
export const SofiaSansExtraCondensed = define("Sofia Sans Extra Condensed");
export const SofiaSansSemiCondensed = define("Sofia Sans Semi Condensed");
export const Solitreo = define("Solitreo");
export const Solway = define("Solway");
export const SometypeMono = define("Sometype Mono");
export const Sono = define("Sono");
export const SonsieOne = define("Sonsie One");
export const Sora = define("Sora");
export const SortsMillGoudy = define("Sorts Mill Goudy");
export const SourceCodePro = define("Source Code Pro");
export const SourceSans_3 = define("Source Sans 3");
export const SourceSansPro = define("Source Sans Pro");
export const SourceSerif_4 = define("Source Serif 4");
export const SourceSerifPro = define("Source Serif Pro");
export const SourGummy = define("Sour Gummy");
export const SpaceGrotesk = define("Space Grotesk");
export const SpaceMono = define("Space Mono");
export const SpecialElite = define("Special Elite");
export const SpecialGothic = define("Special Gothic");
export const SpecialGothicCondensedOne = define("Special Gothic Condensed One");
export const SpecialGothicExpandedOne = define("Special Gothic Expanded One");
export const Spectral = define("Spectral");
export const SpectralSc = define("Spectral SC");
export const SpicyRice = define("Spicy Rice");
export const Spinnaker = define("Spinnaker");
export const Spirax = define("Spirax");
export const Splash = define("Splash");
export const SplineSans = define("Spline Sans");
export const SplineSansMono = define("Spline Sans Mono");
export const SquadaOne = define("Squada One");
export const SquarePeg = define("Square Peg");
export const SreeKrushnadevaraya = define("Sree Krushnadevaraya");
export const Sriracha = define("Sriracha");
export const Srisakdi = define("Srisakdi");
export const Staatliches = define("Staatliches");
export const StackSansHeadline = define("Stack Sans Headline");
export const StackSansNotch = define("Stack Sans Notch");
export const StackSansText = define("Stack Sans Text");
export const Stalemate = define("Stalemate");
export const StalinistOne = define("Stalinist One");
export const StardosStencil = define("Stardos Stencil");
export const Stick = define("Stick");
export const StickNoBills = define("Stick No Bills");
export const StintUltraCondensed = define("Stint Ultra Condensed");
export const StintUltraExpanded = define("Stint Ultra Expanded");
export const StixTwoMath = define("STIX Two Math");
export const StixTwoText = define("STIX Two Text");
export const Stoke = define("Stoke");
export const StoryScript = define("Story Script");
export const Strait = define("Strait");
export const StrichpunktSans = define("Strichpunkt Sans");
export const StyleScript = define("Style Script");
export const SueEllenFrancisco = define("Sue Ellen Francisco");
export const SuezOne = define("Suez One");
export const SulphurPoint = define("Sulphur Point");
export const Sumana = define("Sumana");
export const Sunshiney = define("Sunshiney");
export const SupermercadoOne = define("Supermercado One");
export const Sura = define("Sura");
export const Suranna = define("Suranna");
export const Suravaram = define("Suravaram");
export const Suse = define("SUSE");
export const SuseMono = define("SUSE Mono");
export const Suwannaphum = define("Suwannaphum");
export const SwankyAndMooMoo = define("Swanky and Moo Moo");
export const Syncopate = define("Syncopate");
export const Syne = define("Syne");
export const SyneItalic = define("Syne Italic");
export const SyneMono = define("Syne Mono");
export const SyneTactile = define("Syne Tactile");
export const TacOne = define("Tac One");
export const Tagesschrift = define("Tagesschrift");
export const TaiHeritagePro = define("Tai Heritage Pro");
export const Tajawal = define("Tajawal");
export const Tangerine = define("Tangerine");
export const Tapestry = define("Tapestry");
export const Taprom = define("Taprom");
export const TasaExplorer = define("TASA Explorer");
export const TasaOrbiter = define("TASA Orbiter");
export const Tauri = define("Tauri");
export const Taviraj = define("Taviraj");
export const Teachers = define("Teachers");
export const Teko = define("Teko");
export const Tektur = define("Tektur");
export const Telex = define("Telex");
export const TenaliRamakrishna = define("Tenali Ramakrishna");
export const TenorSans = define("Tenor Sans");
export const TextMeOne = define("Text Me One");
export const Texturina = define("Texturina");
export const Thasadith = define("Thasadith");
export const TheGirlNextDoor = define("The Girl Next Door");
export const TheNautigal = define("The Nautigal");
export const Tienne = define("Tienne");
export const TiktokSans = define("TikTok Sans");
export const Tillana = define("Tillana");
export const TiltNeon = define("Tilt Neon");
export const TiltPrism = define("Tilt Prism");
export const TiltWarp = define("Tilt Warp");
export const Timmana = define("Timmana");
export const Tinos = define("Tinos");
export const Tiny5 = define("Tiny5");
export const TiroBangla = define("Tiro Bangla");
export const TiroDevanagariHindi = define("Tiro Devanagari Hindi");
export const TiroDevanagariMarathi = define("Tiro Devanagari Marathi");
export const TiroDevanagariSanskrit = define("Tiro Devanagari Sanskrit");
export const TiroGurmukhi = define("Tiro Gurmukhi");
export const TiroKannada = define("Tiro Kannada");
export const TiroTamil = define("Tiro Tamil");
export const TiroTelugu = define("Tiro Telugu");
export const Tirra = define("Tirra");
export const TitanOne = define("Titan One");
export const TitilliumWeb = define("Titillium Web");
export const Tomorrow = define("Tomorrow");
export const Tourney = define("Tourney");
export const TradeWinds = define("Trade Winds");
export const TrainOne = define("Train One");
export const Triodion = define("Triodion");
export const Trirong = define("Trirong");
export const Trispace = define("Trispace");
export const Trocchi = define("Trocchi");
export const Trochut = define("Trochut");
export const Truculenta = define("Truculenta");
export const Trykker = define("Trykker");
export const TsukimiRounded = define("Tsukimi Rounded");
export const Tuffy = define("Tuffy");
export const TulpenOne = define("Tulpen One");
export const TurretRoad = define("Turret Road");
export const TwinkleStar = define("Twinkle Star");
export const Ubuntu = define("Ubuntu");
export const UbuntuCondensed = define("Ubuntu Condensed");
export const UbuntuMono = define("Ubuntu Mono");
export const UbuntuSans = define("Ubuntu Sans");
export const UbuntuSansMono = define("Ubuntu Sans Mono");
export const Uchen = define("Uchen");
export const Ultra = define("Ultra");
export const Unbounded = define("Unbounded");
export const UncialAntiqua = define("Uncial Antiqua");
export const UncutSans = define("Uncut Sans");
export const Underdog = define("Underdog");
export const UnicaOne = define("Unica One");
export const Unifont = define("Unifont");
export const Unifontex = define("UnifontEX");
export const Unifrakturcook = define("UnifrakturCook");
export const Unifrakturmaguntia = define("UnifrakturMaguntia");
export const Unkempt = define("Unkempt");
export const Unlock = define("Unlock");
export const Unna = define("Unna");
export const Uoqmunthenkhung = define("UoqMunThenKhung");
export const Updock = define("Updock");
export const Urbanist = define("Urbanist");
export const VampiroOne = define("Vampiro One");
export const Varela = define("Varela");
export const VarelaRound = define("Varela Round");
export const Varta = define("Varta");
export const VastShadow = define("Vast Shadow");
export const Vazirmatn = define("Vazirmatn");
export const VendSans = define("Vend Sans");
export const VesperLibre = define("Vesper Libre");
export const ViaodaLibre = define("Viaoda Libre");
export const Vibes = define("Vibes");
export const Vibur = define("Vibur");
export const VictorMono = define("Victor Mono");
export const Vidaloka = define("Vidaloka");
export const Viga = define("Viga");
export const VinaSans = define("Vina Sans");
export const Voces = define("Voces");
export const Volkhov = define("Volkhov");
export const Vollkorn = define("Vollkorn");
export const VollkornSc = define("Vollkorn SC");
export const Voltaire = define("Voltaire");
export const Vt323 = define("VT323");
export const VujahdayScript = define("Vujahday Script");
export const WaitingForTheSunrise = define("Waiting for the Sunrise");
export const Wallpoet = define("Wallpoet");
export const WalterTurncoat = define("Walter Turncoat");
export const Warnes = define("Warnes");
export const WaterBrush = define("Water Brush");
export const Waterfall = define("Waterfall");
export const Wavefont = define("Wavefont");
export const WdxlLubrifontJpN = define("WDXL Lubrifont JP N");
export const WdxlLubrifontSc = define("WDXL Lubrifont SC");
export const WdxlLubrifontTc = define("WDXL Lubrifont TC");
export const Wellfleet = define("Wellfleet");
export const WendyOne = define("Wendy One");
export const Whisper = define("Whisper");
export const Win95fa = define("WIN95FA");
export const Windsong = define("WindSong");
export const WinkyRough = define("Winky Rough");
export const WinkySans = define("Winky Sans");
export const WireOne = define("Wire One");
export const Wittgenstein = define("Wittgenstein");
export const WixMadeforDisplay = define("Wix Madefor Display");
export const WixMadeforText = define("Wix Madefor Text");
export const Workbench = define("Workbench");
export const WorkSans = define("Work Sans");
export const XanhMono = define("Xanh Mono");
export const Yakuhanjp = define("YakuHanJP");
export const Yakuhanjps = define("YakuHanJPs");
export const Yakuhanmp = define("YakuHanMP");
export const Yakuhanmps = define("YakuHanMPs");
export const Yakuhanrp = define("YakuHanRP");
export const Yakuhanrps = define("YakuHanRPs");
export const Yaldevi = define("Yaldevi");
export const YanoneKaffeesatz = define("Yanone Kaffeesatz");
export const Yantramanav = define("Yantramanav");
export const Yarndings_12 = define("Yarndings 12");
export const Yarndings_12Charted = define("Yarndings 12 Charted");
export const Yarndings_20 = define("Yarndings 20");
export const Yarndings_20Charted = define("Yarndings 20 Charted");
export const YatraOne = define("Yatra One");
export const Yellowtail = define("Yellowtail");
export const YeonSung = define("Yeon Sung");
export const YesevaOne = define("Yeseva One");
export const Yesteryear = define("Yesteryear");
export const Yomogi = define("Yomogi");
export const YoungSerif = define("Young Serif");
export const Yrsa = define("Yrsa");
export const Ysabeau = define("Ysabeau");
export const YsabeauInfant = define("Ysabeau Infant");
export const YsabeauOffice = define("Ysabeau Office");
export const YsabeauSc = define("Ysabeau SC");
export const YujiBoku = define("Yuji Boku");
export const YujiHentaiganaAkari = define("Yuji Hentaigana Akari");
export const YujiHentaiganaAkebono = define("Yuji Hentaigana Akebono");
export const YujiMai = define("Yuji Mai");
export const YujiSyuku = define("Yuji Syuku");
export const YuseiMagic = define("Yusei Magic");
export const Zain = define("Zain");
export const ZalandoSans = define("Zalando Sans");
export const ZalandoSansExpanded = define("Zalando Sans Expanded");
export const ZalandoSansSemiexpanded = define("Zalando Sans SemiExpanded");
export const ZcoolKuaile = define("ZCOOL KuaiLe");
export const ZcoolQingkeHuangyou = define("ZCOOL QingKe HuangYou");
export const ZcoolXiaowei = define("ZCOOL XiaoWei");
export const ZenAntique = define("Zen Antique");
export const ZenAntiqueSoft = define("Zen Antique Soft");
export const ZenDots = define("Zen Dots");
export const ZenKakuGothicAntique = define("Zen Kaku Gothic Antique");
export const ZenKakuGothicNew = define("Zen Kaku Gothic New");
export const ZenKurenaido = define("Zen Kurenaido");
export const ZenLoop = define("Zen Loop");
export const ZenMaruGothic = define("Zen Maru Gothic");
export const ZenOldMincho = define("Zen Old Mincho");
export const ZenTokyoZoo = define("Zen Tokyo Zoo");
export const Zeyada = define("Zeyada");
export const ZhiMangXing = define("Zhi Mang Xing");
export const ZillaSlab = define("Zilla Slab");
export const ZillaSlabHighlight = define("Zilla Slab Highlight");

export const ALL_GOOGLE_FONTS: ReadonlyArray<string> = [
  "42dot Sans",
  "ABeeZee",
  "Abel",
  "Abhaya Libre",
  "Aboreto",
  "Abril Fatface",
  "Abyssinica SIL",
  "Aclonica",
  "Acme",
  "Actor",
  "Adamina",
  "ADLaM Display",
  "Advent Pro",
  "Adwaita Mono",
  "Adwaita Sans",
  "Afacad",
  "Afacad Flux",
  "Agbalumo",
  "Agdasima",
  "Aguafina Script",
  "Agu Display",
  "Aileron",
  "Akatab",
  "Akaya Kanadaka",
  "Akaya Telivigala",
  "Akronim",
  "Akshar",
  "Akt",
  "Aladin",
  "Alan Sans",
  "Alata",
  "Alatsi",
  "Albert Sans",
  "Aldrich",
  "Alef",
  "Alegreya",
  "Alegreya Sans",
  "Alegreya Sans SC",
  "Alegreya SC",
  "Aleo",
  "Alexandria",
  "Alex Brush",
  "Alfa Slab One",
  "Alice",
  "Alike",
  "Alike Angular",
  "Alkalami",
  "Alkatra",
  "Allan",
  "Allerta",
  "Allerta Stencil",
  "Allison",
  "Allkin",
  "Allura",
  "Almarai",
  "Almendra",
  "Almendra Display",
  "Almendra SC",
  "Alumni Sans",
  "Alumni Sans Collegiate One",
  "Alumni Sans Inline One",
  "Alumni Sans Pinstripe",
  "Alumni Sans SC",
  "Alyamama",
  "Amarante",
  "Amaranth",
  "Amarna",
  "Amatic SC",
  "Amethysta",
  "Amiko",
  "Amiri",
  "Amiri Quran",
  "Amita",
  "Anaheim",
  "Ancizar Sans",
  "Ancizar Serif",
  "Andada Pro",
  "Andika",
  "Anek Bangla",
  "Anek Devanagari",
  "Anek Gujarati",
  "Anek Gurmukhi",
  "Anek Kannada",
  "Anek Latin",
  "Anek Malayalam",
  "Anek Odia",
  "Anek Tamil",
  "Anek Telugu",
  "Angkor",
  "Annapurna SIL",
  "Annie Use Your Telescope",
  "Anonymous Pro",
  "Anta",
  "Antic",
  "Antic Didone",
  "Antic Slab",
  "Anton",
  "Antonio",
  "Anton SC",
  "Anuphan",
  "Anybody",
  "Aoboshi One",
  "Apfel Grotezk",
  "Arapey",
  "Arbutus",
  "Arbutus Slab",
  "Architects Daughter",
  "Archivo",
  "Archivo Black",
  "Archivo Narrow",
  "Aref Ruqaa",
  "Aref Ruqaa Ink",
  "Are You Serious",
  "Argentum Sans",
  "Arima",
  "Arima Madurai",
  "Arimo",
  "Arizonia",
  "Armata",
  "AR One Sans",
  "Arsenal",
  "Arsenal SC",
  "Artifika",
  "Arvo",
  "Arya",
  "Asap",
  "Asap Condensed",
  "Asar",
  "Asimovian",
  "Asset",
  "Assistant",
  "Asta Sans",
  "Astloch",
  "Asul",
  "Athiti",
  "Atkinson Hyperlegible",
  "Atkinson Hyperlegible Mono",
  "Atkinson Hyperlegible Next",
  "Atma",
  "Atomic Age",
  "Aubrey",
  "Audiowide",
  "Autour One",
  "Average",
  "Average Sans",
  "Averia Gruesa Libre",
  "Averia Libre",
  "Averia Sans Libre",
  "Averia Serif Libre",
  "Azeret Mono",
  "B612",
  "B612 Mono",
  "Babylonica",
  "Bacasime Antique",
  "Badeen Display",
  "Bad Script",
  "Bagel Fat One",
  "Bagnard",
  "Bagnard Sans",
  "Bahiana",
  "Bahianita",
  "Bai Jamjuree",
  "Bakbak One",
  "Ballet",
  "Baloo 2",
  "Baloo Bhai 2",
  "Baloo Bhaijaan 2",
  "Baloo Bhaina 2",
  "Baloo Chettan 2",
  "Baloo Da 2",
  "Baloo Paaji 2",
  "Baloo Tamma 2",
  "Baloo Tammudu 2",
  "Baloo Thambi 2",
  "Balsamiq Sans",
  "Balthazar",
  "Bangers",
  "Barlow",
  "Barlow Condensed",
  "Barlow Semi Condensed",
  "Barriecito",
  "Barrio",
  "Basic",
  "Baskervville",
  "Baskervville SC",
  "Battambang",
  "Baumans",
  "Bayon",
  "BBH Bartle",
  "BBH Bogle",
  "BBH Hegarty",
  "BBH Sans Bartle",
  "BBH Sans Bogle",
  "BBH Sans Hegarty",
  "Beau Rivage",
  "Bebas Neue",
  "Beiruti",
  "Belanosima",
  "Belgrano",
  "Bellefair",
  "Belleza",
  "Bellota",
  "Bellota Text",
  "BenchNine",
  "Benne",
  "Bentham",
  "Berkshire Swash",
  "Besley",
  "Betania Patmos",
  "Betania Patmos GDL",
  "Betania Patmos In",
  "Betania Patmos In GDL",
  "Beth Ellen",
  "Bevan",
  "Be Vietnam Pro",
  "BhuTuka Expanded One",
  "Bigelow Rules",
  "Bigshot One",
  "Big Shoulders",
  "Big Shoulders Display",
  "Big Shoulders Inline",
  "Big Shoulders Inline Display",
  "Big Shoulders Inline Text",
  "Big Shoulders Stencil",
  "Big Shoulders Stencil Display",
  "Big Shoulders Stencil Text",
  "Big Shoulders Text",
  "Bilbo",
  "Bilbo Swash Caps",
  "BioRhyme",
  "BioRhyme Expanded",
  "Birthstone",
  "Birthstone Bounce",
  "Biryani",
  "Bitcount",
  "Bitcount Grid Double",
  "Bitcount Grid Double Ink",
  "Bitcount Grid Single",
  "Bitcount Grid Single Ink",
  "Bitcount Ink",
  "Bitcount Prop Double",
  "Bitcount Prop Double Ink",
  "Bitcount Prop Single",
  "Bitcount Prop Single Ink",
  "Bitcount Single",
  "Bitcount Single Ink",
  "Bitter",
  "BIZ UDGothic",
  "BIZ UDMincho",
  "BIZ UDPGothic",
  "BIZ UDPMincho",
  "BJCree",
  "BJ Cree",
  "Black And White Picture",
  "Black Han Sans",
  "Black Ops One",
  "Blackout Midnight",
  "Blackout Sunrise",
  "Blackout Two AM",
  "Blaka",
  "Blaka Hollow",
  "Blaka Ink",
  "Blinker",
  "Bluu Next",
  "Bodoni Moda",
  "Bodoni Moda SC",
  "Bokor",
  "Boldonse",
  "Bona Nova",
  "Bona Nova SC",
  "Bonbon",
  "Bonheur Royale",
  "Boogaloo",
  "Borel",
  "Bowlby One",
  "Bowlby One SC",
  "Bpmf Huninn",
  "Bpmf Iansui",
  "Bpmf Zihi Kai Std",
  "Braah One",
  "Bravura",
  "Bravura Text",
  "Brawler",
  "Bree Serif",
  "Bricolage Grotesque",
  "Briem Hand",
  "Bruno Ace",
  "Bruno Ace SC",
  "Brygada 1918",
  "Bubblegum Sans",
  "Bubbler One",
  "Buda",
  "Buenard",
  "Bungee",
  "Bungee Hairline",
  "Bungee Inline",
  "Bungee Outline",
  "Bungee Shade",
  "Bungee Spice",
  "Bungee Tint",
  "Butcherman",
  "Butterfly Kids",
  "Bytesized",
  "Cabin",
  "Cabin Condensed",
  "Cabin Sketch",
  "Cactus Classical Serif",
  "Caesar Dressing",
  "Cagliostro",
  "Cairo",
  "Cairo Play",
  "Caladea",
  "Calistoga",
  "Calligraffitti",
  "Cal Sans",
  "Cambay",
  "Cambo",
  "Candal",
  "Cantarell",
  "Cantata One",
  "Cantora One",
  "Caprasimo",
  "Capriola",
  "Caramel",
  "Carattere",
  "Cardo",
  "Carlito",
  "Carme",
  "Carrois Gothic",
  "Carrois Gothic SC",
  "Carter One",
  "Cascadia Code",
  "Cascadia Mono",
  "Castoro",
  "Castoro Titling",
  "Catamaran",
  "Caudex",
  "Cause",
  "Caveat",
  "Caveat Brush",
  "Cedarville Cursive",
  "Ceviche One",
  "Chakra Petch",
  "Changa",
  "Changa One",
  "Chango",
  "Charis SIL",
  "Charm",
  "Charmonman",
  "Chathura",
  "Chau Philomene One",
  "Chela One",
  "Chelsea Market",
  "Cherish",
  "Cherry Bomb One",
  "Cherry Cream Soda",
  "Cherry Swash",
  "Chewy",
  "Chicle",
  "Chilanka",
  "Chiron GoRound TC",
  "Chiron Hei HK",
  "Chiron Sung HK",
  "Chivo",
  "Chivo Mono",
  "Chocolate Classical Sans",
  "Chokokutai",
  "Chonburi",
  "Chunk Five",
  "Cinzel",
  "Cinzel Decorative",
  "Clear Sans",
  "Clicker Script",
  "Climate Crisis",
  "Coda",
  "Coda Caption",
  "Codystar",
  "Coiny",
  "Combo",
  "Comfortaa",
  "Comforter",
  "Comforter Brush",
  "Comic Mono",
  "Comic Neue",
  "Comic Relief",
  "Coming Soon",
  "Comme",
  "Commissioner",
  "Commit Mono",
  "Concert One",
  "Condiment",
  "Contrail One",
  "Convergence",
  "Cookie",
  "Cooper Hewitt",
  "Copse",
  "Coral Pixels",
  "Corben",
  "Corinthia",
  "Cormorant",
  "Cormorant Garamond",
  "Cormorant Infant",
  "Cormorant SC",
  "Cormorant Unicase",
  "Cormorant Upright",
  "Cossette Texte",
  "Cossette Titre",
  "Courgette",
  "Courier Prime",
  "Cousine",
  "Coustard",
  "Covered By Your Grace",
  "Crafty Girls",
  "Creepster",
  "Crete Round",
  "Crimson Pro",
  "Crimson Text",
  "Croissant One",
  "Crushed",
  "Cuprum",
  "Cute Font",
  "Cutive",
  "Cutive Mono",
  "Dai Banna SIL",
  "Damion",
  "Dancing Script",
  "Danfo",
  "Dangrek",
  "Darker Grotesque",
  "Darumadrop One",
  "Datatype",
  "David Libre",
  "Dawning of a New Day",
  "Days One",
  "DejaVu Math",
  "DejaVu Mono",
  "DejaVu Sans",
  "DejaVu Serif",
  "Dekko",
  "Dela Gothic One",
  "Delicious Handrawn",
  "Delius",
  "Delius Swash Caps",
  "Delius Unicase",
  "Della Respira",
  "Denk One",
  "Devonshire",
  "Dhurjati",
  "Didact Gothic",
  "Diphylleia",
  "Diplomata",
  "Diplomata SC",
  "DM Mono",
  "DM Sans",
  "DM Serif Display",
  "DM Serif Text",
  "Do Hyeon",
  "Dokdo",
  "Domine",
  "Donegal One",
  "Dongle",
  "Doppio One",
  "Dorsa",
  "Dosis",
  "DotGothic16",
  "Doto",
  "Dr Sugiyama",
  "DSEG14 Classic",
  "DSEG14 Classic Mini",
  "DSEG14 Modern",
  "DSEG14 Modern Mini",
  "DSEG7 Classic",
  "DSEG7 Classic Mini",
  "DSEG7 Modern",
  "DSEG7 Modern Mini",
  "DSEG7 SEGG CHAN",
  "DSEG7 SEGG CHAN Mini",
  "DSEG Weather",
  "Duru Sans",
  "Dynalight",
  "DynaPuff",
  "Eagle Lake",
  "East Sea Dokdo",
  "Eater",
  "EB Garamond",
  "Economica",
  "Eczar",
  "Edu AU VIC WA NT Arrows",
  "Edu AU VIC WA NT Dots",
  "Edu AU VIC WA NT Guides",
  "Edu AU VIC WA NT Hand",
  "Edu AU VIC WA NT Pre",
  "Edu NSW ACT Cursive",
  "Edu NSW ACT Foundation",
  "Edu NSW ACT Hand Pre",
  "Edu QLD Beginner",
  "Edu QLD Hand",
  "Edu SA Beginner",
  "Edu SA Hand",
  "Edu TAS Beginner",
  "Edu VIC WA NT Beginner",
  "Edu VIC WA NT Hand",
  "Edu VIC WA NT Hand Pre",
  "Electrolize",
  "El Messiri",
  "Elms Sans",
  "Elsie",
  "Elsie Swash Caps",
  "Emblema One",
  "Emilys Candy",
  "Encode Sans",
  "Encode Sans Condensed",
  "Encode Sans Expanded",
  "Encode Sans SC",
  "Encode Sans Semi Condensed",
  "Encode Sans Semi Expanded",
  "Engagement",
  "Englebert",
  "Enriqueta",
  "Ephesis",
  "Epilogue",
  "Epunda Sans",
  "Epunda Slab",
  "Erica One",
  "Esteban",
  "Estedad",
  "Estonia",
  "Euphoria Script",
  "Ewert",
  "Exile",
  "Exo",
  "Exo 2",
  "Expletus Sans",
  "Explora",
  "Faculty Glyphic",
  "Fahkwang",
  "Familjen Grotesk",
  "Fanwood Text",
  "Farro",
  "Farsan",
  "Fascinate",
  "Fascinate Inline",
  "Faster One",
  "Fasthand",
  "Fauna One",
  "Faustina",
  "Federant",
  "Federo",
  "Felipa",
  "Fenix",
  "Festive",
  "Figtree",
  "Finger Paint",
  "Finlandica",
  "Finlandica Headline",
  "Finlandica Text",
  "Fira Code",
  "FiraGO",
  "Fira Mono",
  "Fira Sans",
  "Fira Sans Condensed",
  "Fira Sans Extra Condensed",
  "Fjalla One",
  "Fjord One",
  "Flamenco",
  "Flavors",
  "Fleur De Leah",
  "Flow Block",
  "Flow Circular",
  "Flow Rounded",
  "Foldit",
  "Fondamento",
  "Fontdiner Swanky",
  "Forum",
  "Fragment Mono",
  "Francois One",
  "Frank Ruhl Libre",
  "Fraunces",
  "Freckle Face",
  "Fredericka the Great",
  "Fredoka",
  "Fredoka One",
  "Freehand",
  "Freeman",
  "Fresca",
  "Frijole",
  "Fruktur",
  "Fugaz One",
  "Fuggles",
  "Funnel Display",
  "Funnel Sans",
  "Fusion Kai G",
  "Fusion Kai J",
  "Fusion Kai T",
  "Fusion Pixel 10px Monospaced JP",
  "Fusion Pixel 10px Monospaced KR",
  "Fusion Pixel 10px Monospaced SC",
  "Fusion Pixel 10px Monospaced TC",
  "Fusion Pixel 10px Proportional JP",
  "Fusion Pixel 10px Proportional KR",
  "Fusion Pixel 10px Proportional SC",
  "Fusion Pixel 10px Proportional TC",
  "Fusion Pixel 12px Monospaced JP",
  "Fusion Pixel 12px Monospaced KR",
  "Fusion Pixel 12px Monospaced SC",
  "Fusion Pixel 12px Monospaced TC",
  "Fusion Pixel 12px Proportional JP",
  "Fusion Pixel 12px Proportional KR",
  "Fusion Pixel 12px Proportional SC",
  "Fusion Pixel 12px Proportional TC",
  "Fusion Pixel 8px Monospaced JP",
  "Fusion Pixel 8px Monospaced KR",
  "Fusion Pixel 8px Monospaced SC",
  "Fusion Pixel 8px Monospaced TC",
  "Fusion Pixel 8px Proportional JP",
  "Fusion Pixel 8px Proportional KR",
  "Fusion Pixel 8px Proportional SC",
  "Fusion Pixel 8px Proportional TC",
  "Fustat",
  "Fuzzy Bubbles",
  "Gabarito",
  "Gabriela",
  "Gaegu",
  "Gafata",
  "Gajraj One",
  "Galada",
  "Galdeano",
  "Galindo",
  "Ga Maamli",
  "Gamja Flower",
  "Gantari",
  "Gasoek One",
  "Gayathri",
  "Geist",
  "Geist Mono",
  "Geist Sans",
  "Gelasio",
  "Gemunu Libre",
  "Genjyuu Gothic",
  "Genos",
  "Gentium Book Basic",
  "Gentium Book Plus",
  "Gentium Plus",
  "Geo",
  "Geologica",
  "Geom",
  "Georama",
  "Geostar",
  "Geostar Fill",
  "Germania One",
  "GFS Didot",
  "GFS Neohellenic",
  "Gideon Roman",
  "Gidole",
  "Gidugu",
  "Gilda Display",
  "Girassol",
  "Give You Glory",
  "Glass Antiqua",
  "Glegoo",
  "Gloock",
  "Gloria Hallelujah",
  "Glory",
  "Gluten",
  "Goblin One",
  "Gochi Hand",
  "Goldman",
  "Golos Text",
  "Google Sans",
  "Google Sans Code",
  "Google Sans Flex",
  "Gorditas",
  "Gothic A1",
  "Gotu",
  "Goudy Bookletter 1911",
  "Gowun Batang",
  "Gowun Dodum",
  "Graduate",
  "Grand Hotel",
  "Grandiflora One",
  "Grandstander",
  "Grape Nuts",
  "Gravitas One",
  "Great Vibes",
  "Grechen Fuemen",
  "Grenze",
  "Grenze Gotisch",
  "Grey Qo",
  "Griffy",
  "Gruppo",
  "Gudea",
  "Gugi",
  "Gulzar",
  "Gupter",
  "Gurajada",
  "Gveret Levin",
  "Gwendolyn",
  "Habibi",
  "Hachi Maru Pop",
  "Hahmlet",
  "Halant",
  "Hammersmith One",
  "Hanalei",
  "Hanalei Fill",
  "Handjet",
  "Handlee",
  "Hanken Grotesk",
  "Hanuman",
  "Happy Monkey",
  "Harmattan",
  "Hauora Sans",
  "Headland One",
  "Hedvig Letters Sans",
  "Hedvig Letters Serif",
  "Heebo",
  "Henny Penny",
  "Hepta Slab",
  "Herr Von Muellerhoff",
  "Hi Melody",
  "Hina Mincho",
  "Hind",
  "Hind Guntur",
  "Hind Madurai",
  "Hind Mysuru",
  "Hind Siliguri",
  "Hind Vadodara",
  "Holtwood One SC",
  "Homemade Apple",
  "Homenaje",
  "Honk",
  "Host Grotesk",
  "Hubballi",
  "Hubot Sans",
  "Huninn",
  "Hurricane",
  "Iansui",
  "iA Writer Duo",
  "iA Writer Mono",
  "iA Writer Quattro",
  "Ibarra Real Nova",
  "IBM Plex Mono",
  "IBM Plex Sans",
  "IBM Plex Sans Arabic",
  "IBM Plex Sans Condensed",
  "IBM Plex Sans Devanagari",
  "IBM Plex Sans Hebrew",
  "IBM Plex Sans JP",
  "IBM Plex Sans KR",
  "IBM Plex Sans Thai",
  "IBM Plex Sans Thai Looped",
  "IBM Plex Serif",
  "Iceberg",
  "Iceland",
  "Idiqlat",
  "Imbue",
  "IM Fell Double Pica",
  "IM Fell Double Pica SC",
  "IM Fell DW Pica",
  "IM Fell DW Pica SC",
  "IM Fell English",
  "IM Fell English SC",
  "IM Fell French Canon",
  "IM Fell French Canon SC",
  "IM Fell Great Primer",
  "IM Fell Great Primer SC",
  "Imperial Script",
  "Imprima",
  "Inclusive Sans",
  "Inconsolata",
  "Inder",
  "Indie Flower",
  "Ingrid Darling",
  "Inika",
  "Inknut Antiqua",
  "Inria Sans",
  "Inria Serif",
  "Inspiration",
  "Instrument Sans",
  "Instrument Serif",
  "Intel One Mono",
  "Inter",
  "Inter Tight",
  "Iosevka",
  "Iosevka Aile",
  "Iosevka Charon",
  "Iosevka Charon Mono",
  "Iosevka Curly",
  "Iosevka Curly Slab",
  "Iosevka Etoile",
  "Irish Grover",
  "Island Moments",
  "Istok Web",
  "Italiana",
  "Italianno",
  "Itim",
  "Jacquard 12",
  "Jacquard 12 Charted",
  "Jacquard 24",
  "Jacquard 24 Charted",
  "Jacquarda Bastarda 9",
  "Jacquarda Bastarda 9 Charted",
  "Jacques Francois",
  "Jacques Francois Shadow",
  "Jaini",
  "Jaini Purva",
  "Jaldi",
  "Jaro",
  "Jersey 10",
  "Jersey 10 Charted",
  "Jersey 15",
  "Jersey 15 Charted",
  "Jersey 20",
  "Jersey 20 Charted",
  "Jersey 25",
  "Jersey 25 Charted",
  "JetBrains Mono",
  "Jim Nightshade",
  "Joan",
  "Jockey One",
  "Jolly Lodger",
  "Jomhuria",
  "Jomolhari",
  "Josefin Sans",
  "Josefin Slab",
  "Jost",
  "Joti One",
  "Jua",
  "Judson",
  "Julee",
  "Julius Sans One",
  "Junction",
  "Junge",
  "Jura",
  "Just Another Hand",
  "Just Me Again Down Here",
  "K2D",
  "Kablammo",
  "Kadwa",
  "Kaisei Decol",
  "Kaisei HarunoUmi",
  "Kaisei Opti",
  "Kaisei Tokumin",
  "Kalam",
  "Kalnia",
  "Kalnia Glaze",
  "Kameron",
  "Kanchenjunga",
  "Kanit",
  "Kantumruy Pro",
  "Kapakana",
  "Karantina",
  "Karla",
  "Karma",
  "Karmilla",
  "Katibeh",
  "Kaushan Script",
  "Kavivanar",
  "Kavoon",
  "Kay Pho Du",
  "Kdam Thmor Pro",
  "Keania One",
  "Kedebideri",
  "Kelly Slab",
  "Kenia",
  "Khand",
  "Khula",
  "Kings",
  "Kirang Haerang",
  "Kite One",
  "Kiwi Maru",
  "Klee One",
  "Knewave",
  "Kodchasan",
  "Kode Mono",
  "KoHo",
  "Koh Santepheap",
  "Kolker Brush",
  "Konkhmer Sleokchher",
  "Kosugi",
  "Kosugi Maru",
  "Kotta One",
  "Koulen",
  "Kranky",
  "Kreon",
  "Kristi",
  "Krona One",
  "Krub",
  "Kufam",
  "Kulim Park",
  "Kumar One",
  "Kumar One Outline",
  "Kumbh Sans",
  "Kurale",
  "La Belle Aurore",
  "Labrada",
  "Lacquer",
  "Laila",
  "Lakki Reddy",
  "Lalezar",
  "Lancelot",
  "Langar",
  "Lateef",
  "Lato",
  "Lavishly Yours",
  "League Gothic",
  "League Mono",
  "League Script",
  "League Spartan",
  "Leckerli One",
  "Ledger",
  "Lekton",
  "Lemon",
  "Lemonada",
  "Lexend",
  "Lexend Deca",
  "Lexend Exa",
  "Lexend Giga",
  "Lexend Mega",
  "Lexend Peta",
  "Lexend Tera",
  "Lexend Zetta",
  "Lextrall",
  "Libertinus Keyboard",
  "Libertinus Math",
  "Libertinus Mono",
  "Libertinus Sans",
  "Libertinus Serif",
  "Libertinus Serif Display",
  "Libre Barcode 128",
  "Libre Barcode 128 Text",
  "Libre Barcode 39",
  "Libre Barcode 39 Extended",
  "Libre Barcode 39 Extended Text",
  "Libre Barcode 39 Text",
  "Libre Barcode EAN13 Text",
  "Libre Baskerville",
  "Libre Bodoni",
  "Libre Caslon Condensed",
  "Libre Caslon Display",
  "Libre Caslon Text",
  "Libre Franklin",
  "Licorice",
  "Life Savers",
  "Lilex",
  "Lilita One",
  "Lily Script One",
  "Limelight",
  "Linden Hill",
  "Linefont",
  "LINE Seed JP",
  "Lisu Bosa",
  "Liter",
  "Literata",
  "Liu Jian Mao Cao",
  "Livvic",
  "Lobster",
  "Lobster Two",
  "Londrina Outline",
  "Londrina Shadow",
  "Londrina Sketch",
  "Londrina Solid",
  "Long Cang",
  "Lora",
  "Loved by the King",
  "Love Light",
  "Lovers Quarrel",
  "Love Ya Like A Sister",
  "Luckiest Guy",
  "Lugrasimo",
  "Lumanosimo",
  "Lunasima",
  "Lusitana",
  "Lustria",
  "Luxurious Roman",
  "Luxurious Script",
  "LXGW Marker Gothic",
  "LXGW WenKai",
  "LXGW WenKai Mono TC",
  "LXGW WenKai TC",
  "Macondo",
  "Macondo Swash Caps",
  "Mada",
  "Madimi One",
  "Magra",
  "Maiden Orange",
  "Maitree",
  "Major Mono Display",
  "Mako",
  "Mali",
  "Mallanna",
  "Maname",
  "Mandali",
  "Manjari",
  "Manrope",
  "Mansalva",
  "Manuale",
  "Manufacturing Consent",
  "Maple Mono",
  "Marcellus",
  "Marcellus SC",
  "Marck Script",
  "Margarine",
  "Marhey",
  "Markazi Text",
  "Marko One",
  "Marmelad",
  "Martel",
  "Martel Sans",
  "Martian Mono",
  "Marvel",
  "Ma Shan Zheng",
  "Matangi",
  "Mate",
  "Matemasie",
  "Material Icons",
  "Material Icons Outlined",
  "Material Icons Round",
  "Material Icons Sharp",
  "Material Icons Two Tone",
  "Material Symbols",
  "Material Symbols Outlined",
  "Material Symbols Rounded",
  "Material Symbols Sharp",
  "Mate SC",
  "Maven Pro",
  "McLaren",
  "Mea Culpa",
  "Meddon",
  "MedievalSharp",
  "Medula One",
  "Meera Inimai",
  "Megrim",
  "Meie Script",
  "Menbere",
  "Meow Script",
  "Merienda",
  "Merienda One",
  "Merriweather",
  "Merriweather Sans",
  "Metal",
  "Metal Mania",
  "Metamorphous",
  "Metrophobic",
  "Metropolis",
  "Michroma",
  "Micro 5",
  "Micro 5 Charted",
  "Milonga",
  "Miltonian",
  "Miltonian Tattoo",
  "Mina",
  "Mingzat",
  "Miniver",
  "Miranda Sans",
  "Miriam Libre",
  "Mirza",
  "Miss Fajardose",
  "Mitr",
  "Mochiy Pop One",
  "Mochiy Pop P One",
  "Modak",
  "Modern Antiqua",
  "Moderustic",
  "Mogra",
  "Mohave",
  "Moirai One",
  "Molengo",
  "Molle",
  "Momo Signature",
  "Momo Trust Display",
  "Momo Trust Sans",
  "Mona Sans",
  "Monaspace Argon",
  "Monaspace Krypton",
  "Monaspace Neon",
  "Monaspace Radon",
  "Monaspace Xenon",
  "Monda",
  "Monofett",
  "Monomakh",
  "Monomaniac One",
  "Mononoki",
  "Monoton",
  "Monsieur La Doulaise",
  "Montaga",
  "Montagu Slab",
  "MonteCarlo",
  "Montez",
  "Montserrat",
  "Montserrat Alternates",
  "Montserrat Subrayada",
  "Montserrat Underline",
  "Moo Lah Lah",
  "Mooli",
  "Moon Dance",
  "Moul",
  "Moulpali",
  "Mountains of Christmas",
  "Mouse Memoirs",
  "Mozilla Headline",
  "Mozilla Text",
  "M PLUS 1",
  "M PLUS 1 Code",
  "M PLUS 1p",
  "M PLUS 2",
  "M PLUS Code Latin",
  "M PLUS Rounded 1c",
  "M PLUS U",
  "Mr Bedfort",
  "Mr Dafoe",
  "Mr De Haviland",
  "Mrs Saint Delafield",
  "Mrs Sheppards",
  "Ms Madi",
  "Mukta",
  "Mukta Mahee",
  "Mukta Malar",
  "Mukta Vaani",
  "Mulish",
  "Murecho",
  "MuseoModerno",
  "Mynerve",
  "My Soul",
  "Mystery Quest",
  "Nabla",
  "Namdhinggo",
  "Nanum Brush Script",
  "Nanum Gothic",
  "Nanum Gothic Coding",
  "Nanum Myeongjo",
  "Nanum Pen Script",
  "Narnoor",
  "Nata Sans",
  "National Park",
  "Nebula Sans",
  "Neonderthaw",
  "Nerko One",
  "Neucha",
  "Neuton",
  "New Amsterdam",
  "New Rocker",
  "News Cycle",
  "Newsreader",
  "New Tegomin",
  "Niconne",
  "Niramit",
  "Nixie One",
  "Nobile",
  "Nokora",
  "Norican",
  "Norwester",
  "Nosifer",
  "Notable",
  "Nothing You Could Do",
  "Noticia Text",
  "Noto Kufi Arabic",
  "Noto Mono",
  "Noto Music",
  "Noto Naskh Arabic",
  "Noto Nastaliq Urdu",
  "Noto Rashi Hebrew",
  "Noto Sans",
  "Noto Sans Adlam",
  "Noto Sans Adlam Unjoined",
  "Noto Sans Anatolian Hieroglyphs",
  "Noto Sans Arabic",
  "Noto Sans Armenian",
  "Noto Sans Avestan",
  "Noto Sans Balinese",
  "Noto Sans Bamum",
  "Noto Sans Bassa Vah",
  "Noto Sans Batak",
  "Noto Sans Bengali",
  "Noto Sans Bhaiksuki",
  "Noto Sans Brahmi",
  "Noto Sans Buginese",
  "Noto Sans Buhid",
  "Noto Sans Canadian Aboriginal",
  "Noto Sans Carian",
  "Noto Sans Caucasian Albanian",
  "Noto Sans Chakma",
  "Noto Sans Cham",
  "Noto Sans Cherokee",
  "Noto Sans Chorasmian",
  "Noto Sans Coptic",
  "Noto Sans Cuneiform",
  "Noto Sans Cypriot",
  "Noto Sans Cypro Minoan",
  "Noto Sans Deseret",
  "Noto Sans Devanagari",
  "Noto Sans Display",
  "Noto Sans Duployan",
  "Noto Sans Egyptian Hieroglyphs",
  "Noto Sans Elbasan",
  "Noto Sans Elymaic",
  "Noto Sans Ethiopic",
  "Noto Sans Georgian",
  "Noto Sans Glagolitic",
  "Noto Sans Gothic",
  "Noto Sans Grantha",
  "Noto Sans Gujarati",
  "Noto Sans Gunjala Gondi",
  "Noto Sans Gurmukhi",
  "Noto Sans Hanifi Rohingya",
  "Noto Sans Hanunoo",
  "Noto Sans Hatran",
  "Noto Sans Hebrew",
  "Noto Sans HK",
  "Noto Sans Imperial Aramaic",
  "Noto Sans Indic Siyaq Numbers",
  "Noto Sans Inscriptional Pahlavi",
  "Noto Sans Inscriptional Parthian",
  "Noto Sans Javanese",
  "Noto Sans JP",
  "Noto Sans Kaithi",
  "Noto Sans Kannada",
  "Noto Sans Kawi",
  "Noto Sans Kayah Li",
  "Noto Sans Kharoshthi",
  "Noto Sans Khmer",
  "Noto Sans Khojki",
  "Noto Sans Khudawadi",
  "Noto Sans KR",
  "Noto Sans Lao",
  "Noto Sans Lao Looped",
  "Noto Sans Lepcha",
  "Noto Sans Limbu",
  "Noto Sans Linear A",
  "Noto Sans Linear B",
  "Noto Sans Lisu",
  "Noto Sans Lydian",
  "Noto Sans Mahajani",
  "Noto Sans Malayalam",
  "Noto Sans Mandaic",
  "Noto Sans Manichaean",
  "Noto Sans Marchen",
  "Noto Sans Masaram Gondi",
  "Noto Sans Math",
  "Noto Sans Mayan Numerals",
  "Noto Sans Medefaidrin",
  "Noto Sans Meetei Mayek",
  "Noto Sans Mende Kikakui",
  "Noto Sans Meroitic",
  "Noto Sans Miao",
  "Noto Sans Modi",
  "Noto Sans Mongolian",
  "Noto Sans Mono",
  "Noto Sans Mro",
  "Noto Sans Multani",
  "Noto Sans Myanmar",
  "Noto Sans Nabataean",
  "Noto Sans Nag Mundari",
  "Noto Sans Nandinagari",
  "Noto Sans Newa",
  "Noto Sans New Tai Lue",
  "Noto Sans NKo",
  "Noto Sans NKo Unjoined",
  "Noto Sans Nushu",
  "Noto Sans Ogham",
  "Noto Sans Ol Chiki",
  "Noto Sans Old Hungarian",
  "Noto Sans Old Italic",
  "Noto Sans Old North Arabian",
  "Noto Sans Old Permic",
  "Noto Sans Old Persian",
  "Noto Sans Old Sogdian",
  "Noto Sans Old South Arabian",
  "Noto Sans Old Turkic",
  "Noto Sans Oriya",
  "Noto Sans Osage",
  "Noto Sans Osmanya",
  "Noto Sans Pahawh Hmong",
  "Noto Sans Palmyrene",
  "Noto Sans Pau Cin Hau",
  "Noto Sans PhagsPa",
  "Noto Sans Phoenician",
  "Noto Sans Psalter Pahlavi",
  "Noto Sans Rejang",
  "Noto Sans Runic",
  "Noto Sans Samaritan",
  "Noto Sans Saurashtra",
  "Noto Sans SC",
  "Noto Sans Sharada",
  "Noto Sans Shavian",
  "Noto Sans Siddham",
  "Noto Sans SignWriting",
  "Noto Sans Sinhala",
  "Noto Sans Sogdian",
  "Noto Sans Sora Sompeng",
  "Noto Sans Soyombo",
  "Noto Sans Sundanese",
  "Noto Sans Sunuwar",
  "Noto Sans Syloti Nagri",
  "Noto Sans Symbols",
  "Noto Sans Symbols 2",
  "Noto Sans Syriac",
  "Noto Sans Syriac Eastern",
  "Noto Sans Syriac Western",
  "Noto Sans Tagalog",
  "Noto Sans Tagbanwa",
  "Noto Sans Tai Le",
  "Noto Sans Tai Tham",
  "Noto Sans Tai Viet",
  "Noto Sans Takri",
  "Noto Sans Tamil",
  "Noto Sans Tamil Supplement",
  "Noto Sans Tangsa",
  "Noto Sans TC",
  "Noto Sans Telugu",
  "Noto Sans Thaana",
  "Noto Sans Thai",
  "Noto Sans Thai Looped",
  "Noto Sans Tifinagh",
  "Noto Sans Tirhuta",
  "Noto Sans Ugaritic",
  "Noto Sans Vai",
  "Noto Sans Vithkuqi",
  "Noto Sans Wancho",
  "Noto Sans Warang Citi",
  "Noto Sans Yi",
  "Noto Sans Zanabazar Square",
  "Noto Serif",
  "Noto Serif Ahom",
  "Noto Serif Armenian",
  "Noto Serif Balinese",
  "Noto Serif Bengali",
  "Noto Serif Devanagari",
  "Noto Serif Display",
  "Noto Serif Dives Akuru",
  "Noto Serif Dogra",
  "Noto Serif Ethiopic",
  "Noto Serif Georgian",
  "Noto Serif Grantha",
  "Noto Serif Gujarati",
  "Noto Serif Gurmukhi",
  "Noto Serif Hebrew",
  "Noto Serif Hentaigana",
  "Noto Serif HK",
  "Noto Serif JP",
  "Noto Serif Kannada",
  "Noto Serif Khitan Small Script",
  "Noto Serif Khmer",
  "Noto Serif Khojki",
  "Noto Serif KR",
  "Noto Serif Lao",
  "Noto Serif Makasar",
  "Noto Serif Malayalam",
  "Noto Serif NP Hmong",
  "Noto Serif Old Uyghur",
  "Noto Serif Oriya",
  "Noto Serif Ottoman Siyaq",
  "Noto Serif SC",
  "Noto Serif Sinhala",
  "Noto Serif Tamil",
  "Noto Serif Tangut",
  "Noto Serif TC",
  "Noto Serif Telugu",
  "Noto Serif Thai",
  "Noto Serif Tibetan",
  "Noto Serif Todhri",
  "Noto Serif Toto",
  "Noto Serif Vithkuqi",
  "Noto Serif Yezidi",
  "Noto Traditional Nushu",
  "Noto Znamenny Musical Notation",
  "Nova Cut",
  "Nova Flat",
  "Nova Mono",
  "Nova Oval",
  "Nova Round",
  "Nova Script",
  "Nova Slim",
  "Nova Square",
  "NTR",
  "Numans",
  "Nunito",
  "Nunito Sans",
  "Nuosu SIL",
  "Odibee Sans",
  "Odor Mean Chey",
  "Offside",
  "Oi",
  "Ojuju",
  "Oldenburg",
  "Old Standard TT",
  "Ole",
  "Oleo Script",
  "Oleo Script Swash Caps",
  "Onest",
  "Oooh Baby",
  "OpenDyslexic",
  "Open Runde",
  "Open Sans",
  "Open Sauce One",
  "Open Sauce Sans",
  "Open Sauce Two",
  "Oranienbaum",
  "Orbit",
  "Orbitron",
  "Oregano",
  "Orelega One",
  "Orienta",
  "Original Surfer",
  "Ostrich Sans",
  "Oswald",
  "Outfit",
  "Overlock",
  "Overlock SC",
  "Overpass",
  "Overpass Mono",
  "Over the Rainbow",
  "Ovo",
  "Oxanium",
  "Oxygen",
  "Oxygen Mono",
  "Pacifico",
  "Padauk",
  "Padyakke Expanded One",
  "Palanquin",
  "Palanquin Dark",
  "Palette Mosaic",
  "Pangolin",
  "Paprika",
  "Parastoo",
  "Parisienne",
  "Parkinsans",
  "Passero One",
  "Passion One",
  "Passions Conflict",
  "Pathway Extreme",
  "Pathway Gothic One",
  "Patrick Hand",
  "Patrick Hand SC",
  "Pattaya",
  "Patua One",
  "Pavanam",
  "Paytone One",
  "Peace Sans",
  "Peddana",
  "Peralta",
  "Permanent Marker",
  "Petemoss",
  "Petit Formal Script",
  "Petrona",
  "Philosopher",
  "Phudu",
  "Piazzolla",
  "Piedra",
  "Pinyon Script",
  "Pirata One",
  "Pitagon Sans",
  "Pitagon Sans Mono",
  "Pitagon Sans Text",
  "Pitagon Serif",
  "Pixelify Sans",
  "Plaster",
  "Platypi",
  "Play",
  "Playball",
  "Playfair",
  "Playfair Display",
  "Playfair Display SC",
  "Playpen Sans",
  "Playpen Sans Arabic",
  "Playpen Sans Deva",
  "Playpen Sans Hebrew",
  "Playpen Sans Thai",
  "Playwrite AR",
  "Playwrite AR Guides",
  "Playwrite AT",
  "Playwrite AT Guides",
  "Playwrite AU NSW",
  "Playwrite AU NSW Guides",
  "Playwrite AU QLD",
  "Playwrite AU QLD Guides",
  "Playwrite AU SA",
  "Playwrite AU SA Guides",
  "Playwrite AU TAS",
  "Playwrite AU TAS Guides",
  "Playwrite AU VIC",
  "Playwrite AU VIC Guides",
  "Playwrite BE VLG",
  "Playwrite BE VLG Guides",
  "Playwrite BE WAL",
  "Playwrite BE WAL Guides",
  "Playwrite BR",
  "Playwrite BR Guides",
  "Playwrite CA",
  "Playwrite CA Guides",
  "Playwrite CL",
  "Playwrite CL Guides",
  "Playwrite CO",
  "Playwrite CO Guides",
  "Playwrite CU",
  "Playwrite CU Guides",
  "Playwrite CZ",
  "Playwrite CZ Guides",
  "Playwrite DE Grund",
  "Playwrite DE Grund Guides",
  "Playwrite DE LA",
  "Playwrite DE LA Guides",
  "Playwrite DE SAS",
  "Playwrite DE SAS Guides",
  "Playwrite DE VA",
  "Playwrite DE VA Guides",
  "Playwrite DK Loopet",
  "Playwrite DK Loopet Guides",
  "Playwrite DK Uloopet",
  "Playwrite DK Uloopet Guides",
  "Playwrite ES",
  "Playwrite ES Deco",
  "Playwrite ES Deco Guides",
  "Playwrite ES Guides",
  "Playwrite FR Moderne",
  "Playwrite FR Moderne Guides",
  "Playwrite FR Trad",
  "Playwrite FR Trad Guides",
  "Playwrite GB J",
  "Playwrite GB J Guides",
  "Playwrite GB S",
  "Playwrite GB S Guides",
  "Playwrite HR",
  "Playwrite HR Guides",
  "Playwrite HR Lijeva",
  "Playwrite HR Lijeva Guides",
  "Playwrite HU",
  "Playwrite HU Guides",
  "Playwrite ID",
  "Playwrite ID Guides",
  "Playwrite IE",
  "Playwrite IE Guides",
  "Playwrite IN",
  "Playwrite IN Guides",
  "Playwrite IS",
  "Playwrite IS Guides",
  "Playwrite IT Moderna",
  "Playwrite IT Moderna Guides",
  "Playwrite IT Trad",
  "Playwrite IT Trad Guides",
  "Playwrite MX",
  "Playwrite MX Guides",
  "Playwrite NG Modern",
  "Playwrite NG Modern Guides",
  "Playwrite NL",
  "Playwrite NL Guides",
  "Playwrite NO",
  "Playwrite NO Guides",
  "Playwrite NZ",
  "Playwrite NZ Basic",
  "Playwrite NZ Basic Guides",
  "Playwrite NZ Guides",
  "Playwrite PE",
  "Playwrite PE Guides",
  "Playwrite PL",
  "Playwrite PL Guides",
  "Playwrite PT",
  "Playwrite PT Guides",
  "Playwrite RO",
  "Playwrite RO Guides",
  "Playwrite SK",
  "Playwrite SK Guides",
  "Playwrite TZ",
  "Playwrite TZ Guides",
  "Playwrite US Modern",
  "Playwrite US Modern Guides",
  "Playwrite US Trad",
  "Playwrite US Trad Guides",
  "Playwrite VN",
  "Playwrite VN Guides",
  "Playwrite ZA",
  "Playwrite ZA Guides",
  "Plus Jakarta Sans",
  "Pochaevsk",
  "Podkova",
  "Poetsen One",
  "Poiret One",
  "Poller One",
  "Poltawski Nowy",
  "Poly",
  "Pompiere",
  "Ponnala",
  "Ponomar",
  "Pontano Sans",
  "Poor Story",
  "Poppins",
  "Port Lligat Sans",
  "Port Lligat Slab",
  "Potta One",
  "Pragati Narrow",
  "Praise",
  "Prata",
  "Preahvihear",
  "Press Start 2P",
  "Pretendard",
  "Pridi",
  "Princess Sofia",
  "Prociono",
  "Prompt",
  "Prosto One",
  "Protest Guerrilla",
  "Protest Revolution",
  "Protest Riot",
  "Protest Strike",
  "Proza Libre",
  "PT Mono",
  "PT Sans",
  "PT Sans Caption",
  "PT Sans Narrow",
  "PT Serif",
  "PT Serif Caption",
  "Public Sans",
  "Puppies Play",
  "Puritan",
  "Purple Purse",
  "Pushster",
  "Qahiri",
  "Quando",
  "Quantico",
  "Quattrocento",
  "Quattrocento Sans",
  "Questrial",
  "Quicksand",
  "Quintessential",
  "Qwigley",
  "Qwitcher Grypen",
  "Racing Sans One",
  "Radio Canada",
  "Radio Canada Big",
  "Radley",
  "Rajdhani",
  "Rakkas",
  "Raleway",
  "Raleway Dots",
  "Ramabhadra",
  "Ramaraja",
  "Rambla",
  "Rammetto One",
  "Rampart One",
  "Ramsina",
  "Ranchers",
  "Rancho",
  "Ranga",
  "Rasa",
  "Rationale",
  "Ravi Prakash",
  "Readex Pro",
  "Recursive",
  "Redacted",
  "Redacted Script",
  "Redaction",
  "Redaction 10",
  "Redaction 100",
  "Redaction 20",
  "Redaction 35",
  "Redaction 50",
  "Redaction 70",
  "Reddit Mono",
  "Reddit Sans",
  "Reddit Sans Condensed",
  "Red Hat Display",
  "Red Hat Mono",
  "Red Hat Text",
  "Redressed",
  "Red Rose",
  "Reem Kufi",
  "Reem Kufi Fun",
  "Reem Kufi Ink",
  "Reenie Beanie",
  "Reggae One",
  "REM",
  "Rethink Sans",
  "Revalia",
  "Rhodium Libre",
  "Ribeye",
  "Ribeye Marrow",
  "Righteous",
  "Risque",
  "Road Rage",
  "Roboto",
  "Roboto Condensed",
  "Roboto Flex",
  "Roboto Mono",
  "Roboto Serif",
  "Roboto Slab",
  "Rochester",
  "Rock 3D",
  "RocknRoll One",
  "Rock Salt",
  "Rokkitt",
  "Romanesco",
  "Ropa Sans",
  "Rosario",
  "Rosarivo",
  "Rouge Script",
  "Rowdies",
  "Rozha One",
  "Rubik",
  "Rubik 80s Fade",
  "Rubik Beastly",
  "Rubik Broken Fax",
  "Rubik Bubbles",
  "Rubik Burned",
  "Rubik Dirt",
  "Rubik Distressed",
  "Rubik Doodle Shadow",
  "Rubik Doodle Triangles",
  "Rubik Gemstones",
  "Rubik Glitch",
  "Rubik Glitch Pop",
  "Rubik Iso",
  "Rubik Lines",
  "Rubik Maps",
  "Rubik Marker Hatch",
  "Rubik Maze",
  "Rubik Microbe",
  "Rubik Mono One",
  "Rubik Moonrocks",
  "Rubik One",
  "Rubik Pixels",
  "Rubik Puddles",
  "Rubik Scribble",
  "Rubik Spray Paint",
  "Rubik Storm",
  "Rubik Vinyl",
  "Rubik Wet Paint",
  "Ruda",
  "Rufina",
  "Ruge Boogie",
  "Ruluko",
  "Rum Raisin",
  "Ruslan Display",
  "Russo One",
  "Ruthie",
  "Ruwudu",
  "Rye",
  "Sacramento",
  "Sahitya",
  "Sail",
  "Saira",
  "Saira Condensed",
  "Saira Extra Condensed",
  "Saira Semi Condensed",
  "Saira Stencil",
  "Saira Stencil One",
  "Salsa",
  "Sanchez",
  "Sancreek",
  "Sankofa Display",
  "Sansation",
  "Sansita",
  "Sansita Swashed",
  "Sarabun",
  "Sarala",
  "Sarina",
  "Sarpanch",
  "Sassy Frass",
  "Satisfy",
  "Savate",
  "Sawarabi Gothic",
  "Sawarabi Mincho",
  "Scada",
  "Scheherazade New",
  "Schibsted Grotesk",
  "Schoolbell",
  "Science Gothic",
  "Scope One",
  "Seaweed Script",
  "Secular One",
  "Sedan",
  "Sedan SC",
  "Sedgwick Ave",
  "Sedgwick Ave Display",
  "Sekuya",
  "Sen",
  "Send Flowers",
  "Sevillana",
  "Seymour One",
  "Shadows Into Light",
  "Shadows Into Light Two",
  "Shafarik",
  "Shalimar",
  "Shantell Sans",
  "Shanti",
  "Share",
  "Share Tech",
  "Share Tech Mono",
  "Shippori Antique",
  "Shippori Antique B1",
  "Shippori Mincho",
  "Shippori Mincho B1",
  "Shizuru",
  "Shojumaru",
  "Short Stack",
  "Shrikhand",
  "Sigmar",
  "Sigmar One",
  "Signika",
  "Signika Negative",
  "Silkscreen",
  "Simonetta",
  "Sintony",
  "Sirin Stencil",
  "Sirivennela",
  "Six Caps",
  "Sixtyfour",
  "Sixtyfour Convergence",
  "Skranji",
  "Slabo 13px",
  "Slabo 27px",
  "Slackey",
  "Slackside One",
  "Smokum",
  "Smooch",
  "Smooch Sans",
  "Smythe",
  "Sniglet",
  "Snippet",
  "Snowburst One",
  "SN Pro",
  "Sofadi One",
  "Sofia",
  "Sofia Sans",
  "Sofia Sans Condensed",
  "Sofia Sans Extra Condensed",
  "Sofia Sans Semi Condensed",
  "Solitreo",
  "Solway",
  "Sometype Mono",
  "Sono",
  "Sonsie One",
  "Sora",
  "Sorts Mill Goudy",
  "Source Code Pro",
  "Source Sans 3",
  "Source Sans Pro",
  "Source Serif 4",
  "Source Serif Pro",
  "Sour Gummy",
  "Space Grotesk",
  "Space Mono",
  "Special Elite",
  "Special Gothic",
  "Special Gothic Condensed One",
  "Special Gothic Expanded One",
  "Spectral",
  "Spectral SC",
  "Spicy Rice",
  "Spinnaker",
  "Spirax",
  "Splash",
  "Spline Sans",
  "Spline Sans Mono",
  "Squada One",
  "Square Peg",
  "Sree Krushnadevaraya",
  "Sriracha",
  "Srisakdi",
  "Staatliches",
  "Stack Sans Headline",
  "Stack Sans Notch",
  "Stack Sans Text",
  "Stalemate",
  "Stalinist One",
  "Stardos Stencil",
  "Stick",
  "Stick No Bills",
  "Stint Ultra Condensed",
  "Stint Ultra Expanded",
  "STIX Two Math",
  "STIX Two Text",
  "Stoke",
  "Story Script",
  "Strait",
  "Strichpunkt Sans",
  "Style Script",
  "Sue Ellen Francisco",
  "Suez One",
  "Sulphur Point",
  "Sumana",
  "Sunshiney",
  "Supermercado One",
  "Sura",
  "Suranna",
  "Suravaram",
  "SUSE",
  "SUSE Mono",
  "Suwannaphum",
  "Swanky and Moo Moo",
  "Syncopate",
  "Syne",
  "Syne Italic",
  "Syne Mono",
  "Syne Tactile",
  "Tac One",
  "Tagesschrift",
  "Tai Heritage Pro",
  "Tajawal",
  "Tangerine",
  "Tapestry",
  "Taprom",
  "TASA Explorer",
  "TASA Orbiter",
  "Tauri",
  "Taviraj",
  "Teachers",
  "Teko",
  "Tektur",
  "Telex",
  "Tenali Ramakrishna",
  "Tenor Sans",
  "Text Me One",
  "Texturina",
  "Thasadith",
  "The Girl Next Door",
  "The Nautigal",
  "Tienne",
  "TikTok Sans",
  "Tillana",
  "Tilt Neon",
  "Tilt Prism",
  "Tilt Warp",
  "Timmana",
  "Tinos",
  "Tiny5",
  "Tiro Bangla",
  "Tiro Devanagari Hindi",
  "Tiro Devanagari Marathi",
  "Tiro Devanagari Sanskrit",
  "Tiro Gurmukhi",
  "Tiro Kannada",
  "Tiro Tamil",
  "Tiro Telugu",
  "Tirra",
  "Titan One",
  "Titillium Web",
  "Tomorrow",
  "Tourney",
  "Trade Winds",
  "Train One",
  "Triodion",
  "Trirong",
  "Trispace",
  "Trocchi",
  "Trochut",
  "Truculenta",
  "Trykker",
  "Tsukimi Rounded",
  "Tuffy",
  "Tulpen One",
  "Turret Road",
  "Twinkle Star",
  "Ubuntu",
  "Ubuntu Condensed",
  "Ubuntu Mono",
  "Ubuntu Sans",
  "Ubuntu Sans Mono",
  "Uchen",
  "Ultra",
  "Unbounded",
  "Uncial Antiqua",
  "Uncut Sans",
  "Underdog",
  "Unica One",
  "Unifont",
  "UnifontEX",
  "UnifrakturCook",
  "UnifrakturMaguntia",
  "Unkempt",
  "Unlock",
  "Unna",
  "UoqMunThenKhung",
  "Updock",
  "Urbanist",
  "Vampiro One",
  "Varela",
  "Varela Round",
  "Varta",
  "Vast Shadow",
  "Vazirmatn",
  "Vend Sans",
  "Vesper Libre",
  "Viaoda Libre",
  "Vibes",
  "Vibur",
  "Victor Mono",
  "Vidaloka",
  "Viga",
  "Vina Sans",
  "Voces",
  "Volkhov",
  "Vollkorn",
  "Vollkorn SC",
  "Voltaire",
  "VT323",
  "Vujahday Script",
  "Waiting for the Sunrise",
  "Wallpoet",
  "Walter Turncoat",
  "Warnes",
  "Water Brush",
  "Waterfall",
  "Wavefont",
  "WDXL Lubrifont JP N",
  "WDXL Lubrifont SC",
  "WDXL Lubrifont TC",
  "Wellfleet",
  "Wendy One",
  "Whisper",
  "WIN95FA",
  "WindSong",
  "Winky Rough",
  "Winky Sans",
  "Wire One",
  "Wittgenstein",
  "Wix Madefor Display",
  "Wix Madefor Text",
  "Workbench",
  "Work Sans",
  "Xanh Mono",
  "YakuHanJP",
  "YakuHanJPs",
  "YakuHanMP",
  "YakuHanMPs",
  "YakuHanRP",
  "YakuHanRPs",
  "Yaldevi",
  "Yanone Kaffeesatz",
  "Yantramanav",
  "Yarndings 12",
  "Yarndings 12 Charted",
  "Yarndings 20",
  "Yarndings 20 Charted",
  "Yatra One",
  "Yellowtail",
  "Yeon Sung",
  "Yeseva One",
  "Yesteryear",
  "Yomogi",
  "Young Serif",
  "Yrsa",
  "Ysabeau",
  "Ysabeau Infant",
  "Ysabeau Office",
  "Ysabeau SC",
  "Yuji Boku",
  "Yuji Hentaigana Akari",
  "Yuji Hentaigana Akebono",
  "Yuji Mai",
  "Yuji Syuku",
  "Yusei Magic",
  "Zain",
  "Zalando Sans",
  "Zalando Sans Expanded",
  "Zalando Sans SemiExpanded",
  "ZCOOL KuaiLe",
  "ZCOOL QingKe HuangYou",
  "ZCOOL XiaoWei",
  "Zen Antique",
  "Zen Antique Soft",
  "Zen Dots",
  "Zen Kaku Gothic Antique",
  "Zen Kaku Gothic New",
  "Zen Kurenaido",
  "Zen Loop",
  "Zen Maru Gothic",
  "Zen Old Mincho",
  "Zen Tokyo Zoo",
  "Zeyada",
  "Zhi Mang Xing",
  "Zilla Slab",
  "Zilla Slab Highlight",
];
