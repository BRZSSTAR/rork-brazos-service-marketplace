import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, G, Circle } from 'react-native-svg';
import { colors } from '@/constants/theme';

interface BrazosLogoProps {
  size?: number;
  variant?: 'full' | 'mark' | 'stacked';
  tone?: 'onDark' | 'onLight';
  testID?: string;
}

/**
 * Official BRAZOS brand logo.
 *
 * Mark: two overlapping tree-like "canopy" crescents (for "home service that comes to you")
 * sitting atop a grounded bar — evergreen + gold duotone, rendered with SVG so it scales
 * crisply at any size. Wordmark uses the Inter 700 brand setting: tight, heavy, 0.22em track.
 */
export default function BrazosLogo({
  size = 56,
  variant = 'full',
  tone = 'onDark',
  testID,
}: BrazosLogoProps) {
  const gold = colors.accent;
  const goldLight = colors.accentLight;
  const ever = tone === 'onDark' ? '#F0F7F6' : colors.primary;
  const everDeep = tone === 'onDark' ? '#C7E4DE' : colors.primaryDeep;
  const wordColor = tone === 'onDark' ? '#F0F7F6' : colors.primary;

  const markSize = variant === 'stacked' ? size : size;
  const wordHeight = size * 0.42;

  return (
    <View
      style={[
        styles.row,
        variant === 'stacked' ? styles.stacked : null,
        variant === 'mark' ? null : styles.fullGap,
      ]}
      testID={testID ?? 'brazos-logo'}
    >
      <Svg width={markSize} height={markSize} viewBox="0 0 100 100" fill="none">
        <Defs>
          <LinearGradient id="bz_canopy" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={gold} />
            <Stop offset="1" stopColor={goldLight} />
          </LinearGradient>
          <LinearGradient id="bz_ever" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={ever} />
            <Stop offset="1" stopColor={everDeep} />
          </LinearGradient>
        </Defs>

        {/* outer evergreen rounded-square badge */}
        <Path
          d="M22 6 H78 Q94 6 94 22 V78 Q94 94 78 94 H22 Q6 94 6 78 V22 Q6 6 22 6 Z"
          fill="url(#bz_ever)"
        />

        {/* stylized B — bold geometric, with gold counters */}
        <G>
          {/* vertical spine */}
          <Path d="M28 20 H44 V80 H28 Z" fill="url(#bz_canopy)" />
          {/* upper bowl */}
          <Path
            d="M40 20 H58 Q74 20 74 34 Q74 48 58 48 H40 Z M48 30 V38 H57 Q64 38 64 34 Q64 30 57 30 Z"
            fill="url(#bz_canopy)"
            fillRule="evenodd"
          />
          {/* lower bowl (slightly larger) */}
          <Path
            d="M40 44 H60 Q78 44 78 60 Q78 80 60 80 H40 Z M48 54 V70 H59 Q68 70 68 62 Q68 54 59 54 Z"
            fill="url(#bz_canopy)"
            fillRule="evenodd"
          />
          {/* subtle evergreen accent notch connecting the bowls */}
          <Path d="M44 46 H52 V52 H44 Z" fill="url(#bz_ever)" opacity={0.35} />
        </G>
      </Svg>

      {variant === 'full' ? (
        <Svg width={size * 2.6} height={wordHeight} viewBox="0 0 260 44" fill="none">
          {/* BRAZOS wordmark paths (hand-tuned geometry) */}
          <G fill={wordColor}>
            {/* B */}
            <Path d="M4 4 H22 C30 4 34 9 34 14 C34 18 31 21 27 22 C32 23 36 26 36 31 C36 37 31 42 22 42 H4 Z M12 20 H21 C24 20 26 18 26 15 C26 12 24 10 21 10 H12 Z M12 36 H22 C25 36 27 34 27 31 C27 28 25 26 22 26 H12 Z" />
            {/* R */}
            <Path d="M46 4 H65 C73 4 78 9 78 16 C78 21 75 25 70 26 L79 42 H70 L62 27 H54 V42 H46 Z M54 10 V21 H64 C67 21 69 19 69 15 C69 12 67 10 64 10 Z" />
            {/* A */}
            <Path d="M95 4 H103 L117 42 H109 L106 33 H92 L89 42 H81 Z M94 27 H104 L99 12 Z" />
            {/* Z */}
            <Path d="M124 4 H154 V10 L134 36 H154 V42 H124 V36 L144 10 H124 Z" />
            {/* O */}
            <Path d="M180 3 C190 3 197 10 197 23 C197 36 190 43 180 43 C170 43 163 36 163 23 C163 10 170 3 180 3 Z M180 10 C174 10 171 15 171 23 C171 31 174 36 180 36 C186 36 189 31 189 23 C189 15 186 10 180 10 Z" />
            {/* S */}
            <Path d="M205 30 H213 C213 34 216 36 220 36 C224 36 226 34 226 31 C226 28 224 27 219 26 L215 25 C209 24 206 20 206 15 C206 8 211 3 219 3 C227 3 233 8 233 15 H225 C225 12 223 10 219 10 C216 10 214 12 214 14 C214 17 216 18 221 19 L225 20 C231 21 234 25 234 31 C234 38 228 43 220 43 C212 43 205 38 205 30 Z" />
          </G>
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stacked: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  fullGap: {
    gap: 10,
  },
});
