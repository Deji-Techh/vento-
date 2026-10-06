import { Svg, Rect, Circle, Path, G, Text as SvgText } from "react-native-svg";

// Option A — navy line-art on cream. One ember spark per scene.
// Pure vector: no network, crisp at any size, themeable.
const NAVY = "#000080";
const EMBER = "#FF5A1F";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <Svg viewBox="0 0 400 300" style={{ width: "100%", aspectRatio: 4 / 3 }}>
      {children}
    </Svg>
  );
}

const line = {
  stroke: NAVY,
  strokeWidth: 6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none" as const,
};

export function DiscoverArt() {
  return (
    <Frame>
      <Circle cx={322} cy={62} r={26} fill={EMBER} />
      <G {...line}>
        <Path d="M70 250 V150 H330 V250" />
        <Path d="M52 150 L70 108 H330 L348 150 Z" fill={NAVY} fillOpacity={0.12} />
        <Path d="M110 150 V122 M150 150 V122 M190 150 V122 M230 150 V122 M270 150 V122" />
        <Rect x={160} y={190} width={80} height={60} rx={6} />
        <Rect x={96} y={180} width={44} height={34} rx={6} />
        <Rect x={260} y={180} width={44} height={34} rx={6} />
        <Path d="M200 78 v-14" />
        <Path d="M186 96 c0-10 28-10 28 0 c0 8 -12 8 -14 14" />
      </G>
      <Circle cx={200} cy={215} r={4} fill={NAVY} />
      <Circle cx={200} cy={122} r={3} fill={NAVY} />
      <Circle cx={86} cy={66} r={20} fill={NAVY} />
      <Path d="M86 58 c-6 0 -10 4 -10 9 c0 7 10 15 10 15 s10 -8 10 -15 c0 -5 -4 -9 -10 -9z" fill="#fff" />
      <Circle cx={86} cy={67} r={3.5} fill={NAVY} />
      <SvgText x={200} y={282} textAnchor="middle" fontSize={21} fontWeight="700" fill={NAVY}>
        IUOK EATS
      </SvgText>
    </Frame>
  );
}

export function TrackArt() {
  return (
    <Frame>
      <Path
        d="M40 236 C 120 236, 130 150, 210 150 S 300 190, 360 190"
        stroke={NAVY}
        strokeWidth={5}
        strokeDasharray="2 14"
        strokeLinecap="round"
        fill="none"
      />
      <G {...line}>
        <Circle cx={118} cy={196} r={24} />
        <Circle cx={252} cy={196} r={24} />
        <Path d="M118 196 L168 130 H226 L252 196 M168 130 L148 92 H182" />
        <Circle cx={165} cy={76} r={14} />
        <Path d="M182 92 L226 130" />
        <Path d="M240 112 v-12 h28 v12" strokeWidth={5} />
      </G>
      <Rect x={228} y={112} width={52} height={40} rx={8} fill={EMBER} />
      <Circle cx={330} cy={80} r={20} fill={NAVY} />
      <Path d="M330 72 c-6 0 -10 4 -10 9 c0 7 10 15 10 15 s10 -8 10 -15 c0 -5 -4 -9 -10 -9z" fill="#fff" />
      <Circle cx={330} cy={81} r={3.5} fill={NAVY} />
    </Frame>
  );
}

export function ControlArt() {
  return (
    <Frame>
      <Rect x={135} y={40} width={130} height={220} rx={26} fill="#fff" stroke={NAVY} strokeWidth={6} />
      <Rect x={155} y={76} width={90} height={56} rx={12} fill={NAVY} fillOpacity={0.1} stroke={NAVY} strokeWidth={5} />
      <SvgText x={200} y={110} textAnchor="middle" fontSize={20} fontWeight="700" fill={NAVY}>
        ₦3,000
      </SvgText>
      <Rect x={155} y={144} width={90} height={56} rx={12} fill="#fff" stroke={NAVY} strokeWidth={5} />
      <SvgText x={200} y={178} textAnchor="middle" fontSize={20} fontWeight="700" fill={NAVY}>
        ₦2,200
      </SvgText>
      <G stroke={EMBER} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <Path d="M292 108 c22 -18 22 -52 0 -70" />
        <Path d="M292 192 c22 18 22 52 0 70" />
      </G>
      <Path d="M278 52 l14 -6 l-2 15z" fill={EMBER} />
      <Path d="M278 248 l14 6 l-2 -15z" fill={EMBER} />
      <Circle cx={92} cy={212} r={30} fill={NAVY} />
      <Path d="M80 212 l9 9 l17 -19" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Frame>
  );
}
