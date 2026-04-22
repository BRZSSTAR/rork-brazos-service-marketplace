import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Copy,
  Share2,
  QrCode,
  Download,
  Check,
  MessageSquare,
  Instagram,
  Mail,
  Sparkles,
  Eye,
} from 'lucide-react-native';
import BrazosLogo from '@/components/BrazosLogo';
import { useProviderStore } from '@/store/providerStore';
import { useAuthStore } from '@/store/authStore';
import { colors, radius, shadow, spacing, typography } from '@/constants/theme';

const PUBLIC_BASE_URL = 'https://brazos.app/p';

function buildShareUrl(providerId: string): string {
  return `${PUBLIC_BASE_URL}/${providerId}`;
}

function buildQrImageUrl(targetUrl: string, size: number = 600): string {
  const params = new URLSearchParams({
    data: targetUrl,
    size: `${size}x${size}`,
    margin: '0',
    bgcolor: 'ffffff',
    color: '0A2D25',
    format: 'png',
    qzone: '1',
  });
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}

async function safeClipboardSet(value: string): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(value);
    return true;
  } catch (error) {
    console.log('[Share] Clipboard error:', error);
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch (webError) {
        console.log('[Share] Web clipboard error:', webError);
      }
    }
    return false;
  }
}

export default function ShareProfileScreen() {
  const profile = useProviderStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);

  const providerId = profile?.id ?? user?.id ?? 'demo';
  const providerName = user?.name ?? 'Profissional BRAZOS';
  const firstName = providerName.split(/\s+/)[0] ?? 'você';

  const shareUrl = useMemo(() => buildShareUrl(providerId), [providerId]);
  const qrUrl = useMemo(() => buildQrImageUrl(shareUrl, 720), [shareUrl]);

  const [copied, setCopied] = useState<boolean>(false);

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    triggerHaptic();
    const ok = await safeClipboardSet(shareUrl);
    if (ok) {
      setCopied(true);
      console.log('[Share] Link copied:', shareUrl);
      setTimeout(() => setCopied(false), 2000);
    } else {
      Alert.alert('Erro', 'Não foi possível copiar o link.');
    }
  }, [shareUrl, triggerHaptic]);

  const shareMessage = useMemo(
    () =>
      `Olá! 👋 Sou ${firstName} e atendo pela BRAZOS — a plataforma de serviços mais confiável do Brasil.\n\nReserve comigo direto pelo app:\n${shareUrl}`,
    [firstName, shareUrl]
  );

  const handleNativeShare = useCallback(async () => {
    triggerHaptic();
    if (Platform.OS === 'web') {
      const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }) : null;
      if (nav?.share) {
        try {
          await nav.share({
            title: `${providerName} · BRAZOS`,
            text: shareMessage,
            url: shareUrl,
          });
          return;
        } catch (err) {
          console.log('[Share] Web share cancelled or failed:', err);
        }
      }
      await handleCopy();
      return;
    }

    try {
      await Share.share({
        message: shareMessage,
        url: shareUrl,
        title: `${providerName} · BRAZOS`,
      });
    } catch (error) {
      console.log('[Share] Share error:', error);
    }
  }, [shareMessage, shareUrl, providerName, handleCopy, triggerHaptic]);

  const handleDownloadQr = useCallback(async () => {
    triggerHaptic();
    const dlUrl = buildQrImageUrl(shareUrl, 1024);
    console.log('[Share] Downloading QR:', dlUrl);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(dlUrl, '_blank');
      return;
    }
    await Linking.openURL(dlUrl);
  }, [shareUrl, triggerHaptic]);

  const handlePreview = useCallback(async () => {
    triggerHaptic();
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(shareUrl, '_blank');
      return;
    }
    await Linking.openURL(shareUrl);
  }, [shareUrl, triggerHaptic]);

  const quickChannels = [
    {
      id: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      color: '#E1306C',
      onPress: handleNativeShare,
    },
    {
      id: 'message',
      label: 'SMS',
      icon: MessageSquare,
      color: '#0284C7',
      onPress: handleNativeShare,
    },
    {
      id: 'email',
      label: 'E-mail',
      icon: Mail,
      color: '#6B7280',
      onPress: async () => {
        triggerHaptic();
        const mailto = `mailto:?subject=${encodeURIComponent(`${providerName} · BRAZOS`)}&body=${encodeURIComponent(shareMessage)}`;
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.location.href = mailto;
          return;
        }
        await Linking.openURL(mailto);
      },
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Compartilhar perfil' }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Sparkles size={12} color={colors.accent} />
            <Text style={styles.heroBadgeText}>SEU LINK EXCLUSIVO</Text>
          </View>
          <Text style={styles.heroTitle}>Transforme seguidores em{'\n'}clientes pagantes</Text>
          <Text style={styles.heroSubtitle}>
            Compartilhe seu QR code ou link. Quem escanear baixa o app e reserva direto com você.
          </Text>
        </View>

        <View style={styles.qrCardWrap}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.qrCard}
          >
            <View style={styles.qrCardHeader}>
              <BrazosLogo size={24} variant="full" tone="onDark" />
              <View style={styles.qrLiveDot}>
                <View style={styles.qrDot} />
                <Text style={styles.qrLiveText}>AO VIVO</Text>
              </View>
            </View>

            <View style={styles.qrFrame}>
              <Image
                source={{ uri: qrUrl }}
                style={styles.qrImage}
                resizeMode="contain"
                testID="provider-qr-image"
              />
              <View style={styles.qrCorner1} />
              <View style={styles.qrCorner2} />
              <View style={styles.qrCorner3} />
              <View style={styles.qrCorner4} />
            </View>

            <Text style={styles.qrProviderName}>{providerName}</Text>
            <Text style={styles.qrProviderTag}>Escaneie para reservar · BRAZOS</Text>
          </LinearGradient>
        </View>

        <View style={styles.linkCard}>
          <QrCode size={18} color={colors.primary} />
          <Text style={styles.linkText} numberOfLines={1} testID="share-url">
            {shareUrl}
          </Text>
          <Pressable
            onPress={handleCopy}
            style={[styles.copyBtn, copied && styles.copyBtnActive]}
            testID="copy-link-btn"
          >
            {copied ? <Check size={14} color={colors.success} /> : <Copy size={14} color={colors.primary} />}
            <Text style={[styles.copyBtnText, copied && styles.copyBtnTextActive]}>
              {copied ? 'Copiado' : 'Copiar'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.actionBtn} onPress={handleNativeShare} testID="share-btn">
            <View style={[styles.actionIcon, { backgroundColor: colors.accent + '20' }]}>
              <Share2 size={18} color={colors.accent} />
            </View>
            <Text style={styles.actionLabel}>Compartilhar</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={handleDownloadQr} testID="download-qr-btn">
            <View style={[styles.actionIcon, { backgroundColor: colors.primary + '18' }]}>
              <Download size={18} color={colors.primary} />
            </View>
            <Text style={styles.actionLabel}>Baixar QR</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={handlePreview} testID="preview-btn">
            <View style={[styles.actionIcon, { backgroundColor: colors.success + '20' }]}>
              <Eye size={18} color={colors.success} />
            </View>
            <Text style={styles.actionLabel}>Pré-visualizar</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enviar direto</Text>
          <View style={styles.channelsRow}>
            {quickChannels.map((ch) => {
              const Icon = ch.icon;
              return (
                <Pressable
                  key={ch.id}
                  style={styles.channel}
                  onPress={() => void ch.onPress()}
                  testID={`channel-${ch.id}`}
                >
                  <View style={[styles.channelIcon, { backgroundColor: ch.color + '18' }]}>
                    <Icon size={20} color={ch.color} />
                  </View>
                  <Text style={styles.channelLabel}>{ch.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 Dicas para ganhar mais clientes</Text>
          <View style={styles.tipRow}>
            <View style={styles.tipNum}><Text style={styles.tipNumText}>1</Text></View>
            <Text style={styles.tipText}>Imprima o QR e coloque no seu veículo, uniforme ou local de trabalho.</Text>
          </View>
          <View style={styles.tipRow}>
            <View style={styles.tipNum}><Text style={styles.tipNumText}>2</Text></View>
            <Text style={styles.tipText}>Adicione o link na bio do seu Instagram e WhatsApp Business.</Text>
          </View>
          <View style={styles.tipRow}>
            <View style={styles.tipNum}><Text style={styles.tipNumText}>3</Text></View>
            <Text style={styles.tipText}>Envie após cada serviço concluído — peça uma avaliação para aumentar seu ranking.</Text>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Todas as reservas via seu link são rastreadas e contam para seu ranking BRAZOS. Comissão padrão do seu plano se aplica.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  hero: { gap: spacing.sm, marginBottom: spacing.xs },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.accent + '18',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  heroBadgeText: { ...typography.small, color: colors.accentDark, fontSize: 10, letterSpacing: 1.2, fontWeight: '700' as const },
  heroTitle: { ...typography.h2, color: colors.text, fontSize: 24, lineHeight: 30 },
  heroSubtitle: { ...typography.caption, color: colors.textSecondary, lineHeight: 20 },
  qrCardWrap: { marginTop: spacing.sm },
  qrCard: {
    borderRadius: radius.lg + 4,
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
    ...shadow.lg,
  },
  qrCardHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qrLiveDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(46,125,84,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  qrDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  qrLiveText: { ...typography.small, color: colors.successLight, fontSize: 9, fontWeight: '700' as const, letterSpacing: 1 },
  qrFrame: {
    width: 240,
    height: 240,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  qrImage: { width: '100%', height: '100%' },
  qrCorner1: { position: 'absolute', top: -2, left: -2, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: colors.accent, borderTopLeftRadius: radius.sm },
  qrCorner2: { position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: colors.accent, borderTopRightRadius: radius.sm },
  qrCorner3: { position: 'absolute', bottom: -2, left: -2, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: colors.accent, borderBottomLeftRadius: radius.sm },
  qrCorner4: { position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: colors.accent, borderBottomRightRadius: radius.sm },
  qrProviderName: { ...typography.h3, color: colors.logo },
  qrProviderTag: { ...typography.small, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingLeft: spacing.md,
    paddingRight: 6,
    paddingVertical: 6,
    ...shadow.sm,
  },
  linkText: { ...typography.caption, color: colors.text, flex: 1, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary + '10',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  copyBtnActive: { backgroundColor: colors.success + '18' },
  copyBtnText: { ...typography.smallMedium, color: colors.primary },
  copyBtnTextActive: { color: colors.success },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xs + 2,
    ...shadow.sm,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { ...typography.smallMedium, color: colors.text },
  section: { gap: spacing.sm, marginTop: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.text, fontSize: 16 },
  channelsRow: { flexDirection: 'row', gap: spacing.sm },
  channel: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xs + 2,
    ...shadow.sm,
  },
  channelIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelLabel: { ...typography.smallMedium, color: colors.text },
  tips: {
    backgroundColor: colors.primary + '08',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    marginTop: spacing.sm,
  },
  tipsTitle: { ...typography.bodyMedium, color: colors.primary },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  tipNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tipNumText: { ...typography.small, color: colors.primary, fontWeight: '700' as const, fontSize: 11 },
  tipText: { ...typography.caption, color: colors.text, flex: 1, lineHeight: 20 },
  disclaimer: { marginTop: spacing.md },
  disclaimerText: { ...typography.small, color: colors.textTertiary, textAlign: 'center', lineHeight: 16 },
});
