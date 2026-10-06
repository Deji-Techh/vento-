import { useEffect } from "react";
import { Svg, Rect, Circle, Path, G, Text as SvgText } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  useReducedMotion,
} from "react-native-reanimated";

// Navy line-art, themeable + subtly animated. One ember spark per scene.
// Pure vector: no network, crisp at any size.
const NAVY = "#000080";
const EMBER = "#FF5A1F";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <Svg viewBox="0 0 400 300" style={{ width: "100%", aspectRatio: 4 / 3 }}>
      {children}
    </Svg>
  );
}

function useLoop(duration = 1600) {
  const reduced = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    if (!reduced) t.value = withRepeat(withTiming(1, { duration }), -1, true);
  }, [reduced]);
  return { t, reduced };
}

function line(stroke: string) {
  return {
    stroke,
    strokeWidth: 6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none" as const,
  };
}

export function DiscoverArt({ dark = false }: { dark?: boolean }) {
  const S = dark ? "#FFFFFF" : NAVY;
  const card = dark ? "rgba(255,255,255,0.08)" : "#fff";
  const { t, reduced } = useLoop(1800);
  const steam = useAnimatedProps(() => ({ opacity: reduced ? 1 : 0.45 + t.value * 0.55 }));
  const sunR = useAnimatedProps(() => ({ r: reduced ? 26 : 26 + t.value * 3 }));
  return (
    <Frame>
      <AnimatedCircle animatedProps={sunR} cx={322} cy={62} fill={EMBER} />
      <G {...line(S)}>
        <Path d="M70 250 V150 H330 V250" />
        <Path d="M52 150 L70 108 H330 L348 150 Z" fill={S} fillOpacity={0.12} />
        <Path d="M110 150 V122 M150 150 V122 M190 150 V122 M230 150 V122 M270 150 V122" />
        <Rect x={160} y={190} width={80} height={60} rx={6} fill={card} />
        <Rect x={96} y={180} width={44} height={34} rx={6} fill={card} />
        <Rect x={260} y={180} width={44} height={34} rx={6} fill={card} />
        <Path d="M200 78 v-14" />
        <Path d="M186 96 c0-10 28-10 28 0 c0 8 -12 8 -14 14" />
      </G>
      <AnimatedG animatedProps={steam}>
        <Circle cx={200} cy={215} r={4} fill={S} />
        <Circle cx={200} cy={122} r={3} fill={S} />
      </AnimatedG>
      <Circle cx={86} cy={66} r={20} fill={S} />
      <Path d="M86 58 c-6 0 -10 4 -10 9 c0 7 10 15 10 15 s10 -8 10 -15 c0 -5 -4 -9 -10 -9z" fill={dark ? "#0A0A0E" : "#fff"} />
      <Circle cx={86} cy={67} r={3.5} fill={S} />
      <SvgText x={200} y={282} textAnchor="middle" fontSize={21} fontWeight="700" fill={S}>
        IUOK EATS
      </SvgText>
    </Frame>
  );
}

export function TrackArt({ dark = false }: { dark?: boolean }) {
  const S = dark ? "#FFFFFF" : NAVY;
  const { t, reduced } = useLoop(1200);
  const dash = useAnimatedProps(() => ({ strokeDashoffset: reduced ? 0 : -t.value * 32 }));
  return (
    <Frame>
      <AnimatedPath
        animatedProps={dash}
        d="M40 236 C 120 236, 130 150, 210 150 S 300 190, 360 190"
        stroke={S}
        strokeOpacity={0.55}
        strokeWidth={5}
        strokeDasharray="2 14"
        strokeLinecap="round"
        fill="none"
      />
      <G {...line(S)}>
        <Circle cx={118} cy={196} r={24} />
        <Circle cx={252} cy={196} r={24} />
        <Path d="M118 196 L168 130 H226 L252 196 M168 130 L148 92 H182" />
        <Circle cx={165} cy={76} r={14} />
        <Path d="M182 92 L226 130" />
        <Path d="M240 112 v-12 h28 v12" strokeWidth={5} />
        <Path d="M110 196 h16 M244 196 h16" strokeWidth={4} />
      </G>
      <Rect x={228} y={112} width={52} height={40} rx={8} fill={EMBER} />
      <Circle cx={330} cy={80} r={20} fill={S} />
      <Path d="M330 72 c-6 0 -10 4 -10 9 c0 7 10 15 10 15 s10 -8 10 -15 c0 -5 -4 -9 -10 -9z" fill={dark ? "#0A0A0E" : "#fff"} />
      <Circle cx={330} cy={81} r={3.5} fill={S} />
    </Frame>
  );
}

export function ControlArt({ dark = false }: { dark?: boolean }) {
  const S = dark ? "#FFFFFF" : NAVY;
  const card = dark ? "#0A0A0E" : "#fff";
  const { t, reduced } = useLoop(1500);
  const nudge = useAnimatedProps(() => ({ x: reduced ? 0 : t.value * 6 }));
  return (
    <Frame>
      <Rect x={135} y={40} width={130} height={220} rx={26} fill={card} stroke={S} strokeWidth={6} />
      <Rect x={155} y={76} width={90} height={56} rx={12} fill={S} fillOpacity={0.1} stroke={S} strokeWidth={5} />
      <SvgText x={200} y={110} textAnchor="middle" fontSize={20} fontWeight="700" fill={S}>
        ₦3,000
      </SvgText>
      <Rect x={155} y={144} width={90} height={56} rx={12} fill={card} stroke={S} strokeWidth={5} />
      <SvgText x={200} y={178} textAnchor="middle" fontSize={20} fontWeight="700" fill={S}>
        ₦2,200
      </SvgText>
      <AnimatedG animatedProps={nudge}>
        <G stroke={EMBER} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M292 108 c22 -18 22 -52 0 -70" />
          <Path d="M292 192 c22 18 22 52 0 70" />
        </G>
        <Path d="M278 52 l14 -6 l-2 15z" fill={EMBER} />
        <Path d="M278 248 l14 6 l-2 -15z" fill={EMBER} />
      </AnimatedG>
      <Circle cx={92} cy={212} r={30} fill={dark ? EMBER : NAVY} />
      <Path d="M80 212 l9 9 l17 -19" stroke={dark ? "#0A0A0E" : "#fff"} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Frame>
  );
}

export function LocationArt({ dark = false }: { dark?: boolean }) {
  const S = dark ? "#FFFFFF" : NAVY;
  const { t, reduced } = useLoop(2000);
  const ring = useAnimatedProps(() => ({ opacity: reduced ? 0.5 : 0.7 - t.value * 0.55, r: reduced ? 44 : 30 + t.value * 30 }));
  return (
    <Frame>
      <AnimatedCircle animatedProps={ring} cx={200} cy={150} fill="none" stroke={S} strokeWidth={4} strokeDasharray="6 10" />
      <Circle cx={200} cy={150} r={58} fill={S} fillOpacity={0.12} stroke={S} strokeWidth={6} />
      <Circle cx={200} cy={150} r={34} fill={S} />
      <Path d="M200 138 c-9 0 -15 6 -15 13 c0 10 15 22 15 22 s15 -12 15 -22 c0 -7 -6 -13 -15 -13z" fill={dark ? "#0A0A0E" : "#fff"} />
      <Circle cx={200} cy={151} r={5} fill={S} />
    </Frame>
  );
}

export function BellArt({ dark = false }: { dark?: boolean }) {
  const S = dark ? "#FFFFFF" : NAVY;
  const { t, reduced } = useLoop(1600);
  const dot = useAnimatedProps(() => ({ r: reduced ? 10 : 10 + t.value * 2.5, opacity: reduced ? 1 : 0.75 + t.value * 0.25 }));
  return (
    <Frame>
      <G stroke={S} strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.5}>
        <Path d="M104 108 c-14 10 -22 24 -24 42" />
        <Path d="M296 108 c14 10 22 24 24 42" />
      </G>
      <G stroke={S} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <Path d="M200 82 c-26 0 -42 20 -42 48 v30 l-14 26 h112 l-14 -26 v-30 c0 -28 -16 -48 -42 -48z" />
        <Path d="M189 178 c0 10 22 10 22 0" />
      </G>
      <AnimatedCircle animatedProps={dot} cx={200} cy={130} fill={EMBER} />
    </Frame>
  );
}
