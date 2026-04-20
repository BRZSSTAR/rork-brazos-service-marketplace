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
 * Mark: three stacked "canopy" crescents (home-service that comes to you) rising from a
 * grounded trunk. The trunk + two canopy leaves form a subtle, implied B in negative space
 * when viewed at small sizes. Evergreen + gold duotone, SVG for crisp scaling.
 * Wordmark: Inter 700, tight geometric glyphs, 0.22em track.
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
          <LinearGradient id="bz_b" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={goldLight} stopOpacity={0.95} />
            <Stop offset="1" stopColor={gold} stopOpacity={0.9} />
          </LinearGradient>
        </Defs>

        {/* outer evergreen ring */}
        <Circle cx="50" cy="50" r="46" stroke="url(#bz_ever)" strokeWidth={3} />

        {/* Subtle "B" spine – evergreen vertical anchor that also doubles as the trunk.
            Paired with the two canopy bowls, the eye reads a soft, implied B. */}
        <Path d="M36 22 H40 V82 H36 Z" fill="url(#bz_ever)" opacity={0.85} />

        {/* Upper canopy bowl — gold (forms top lobe of the B) */}
        <Path
          d="M38 24 H54 Q68 24 68 36 Q68 46 54 46 H38 Z"
          fill="url(#bz_b)"
          opacity={0.18}
        />

        {/* Lower canopy bowl — gold (forms bottom lobe of the B) */}
        <Path
          d="M38 50 H56 Q72 50 72 62 Q72 76 56 76 H38 Z"
          fill="url(#bz_b)"
          opacity={0.18}
        />

        {/* Canopy crescents (primary brand mark — overlapping leaves) */}
        <G>
          <Path
            d="M28 32 Q50 14 72 32 Q60 34 50 30 Q40 34 28 32 Z"
            fill="url(#bz_canopy)"
          />
          <Path
            d="M24 52 Q50 30 76 52 Q60 56 50 50 Q40 56 24 52 Z"
            fill="url(#bz_ever)"
            opacity={0.95}
          />
          <Path
            d="M30 70 Q50 54 70 70 Q58 72 50 68 Q42 72 30 70 Z"
            fill="url(#bz_canopy)"
            opacity={0.9}
          />
          {/* trunk anchor */}
          <Path
            d="M47 68 L53 68 L52 82 L48 82 Z"
            fill="url(#bz_ever)"
          />
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
