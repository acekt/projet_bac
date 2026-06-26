import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Heading,
  Hr,
  Link,
  Button,
  Preview,
  Font,
} from '@react-email/components';
import * as React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OrderReceiptEmailProps {
  /** Prénom ou nom complet du client */
  customerName: string;
  /** Email du client */
  customerEmail: string;
  /** Code lisible de la commande (ex: MCF-A1B2C3) */
  orderCode: string;
  /** Nom du magasin partenaire */
  storeName: string;
  /** Articles de la commande */
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
  /** Sous-total articles (FCFA) */
  subtotal: number;
  /** Frais de livraison (FCFA) */
  deliveryFee: number;
  /** Total TTC (FCFA) */
  total: number;
  /** Adresse de livraison formatée */
  deliveryAddress: string;
  /** Mode de paiement */
  paymentMethod: string;
  /** URL de l'app pour le lien de suivi */
  appUrl: string;
}

// ─── Constantes de design ─────────────────────────────────────────────────────

const BRAND_PRIMARY = '#059669';
const SLATE_900     = '#0F172A';
const SLATE_700     = '#334155';
const SLATE_500     = '#64748B';
const SLATE_100     = '#F1F5F9';
const SLATE_200     = '#E2E8F0';
const WHITE         = '#FFFFFF';

const PAYMENT_LABELS: Record<string, string> = {
  airtel: 'Airtel Money',
  moov:   'Moov Money',
  card:   'Carte Bancaire',
  cash:   'Paiement à la livraison',
};

// ─── Composant Template ───────────────────────────────────────────────────────

export function OrderReceiptEmail({
  customerName,
  customerEmail,
  orderCode,
  storeName,
  items,
  subtotal,
  deliveryFee,
  total,
  deliveryAddress,
  paymentMethod,
  appUrl,
}: OrderReceiptEmailProps) {
  const firstName = customerName.split(' ')[0];
  const trackingUrl = `${appUrl}/profile?tab=orders`;

  return (
    <Html lang="fr" dir="ltr">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>
        ✅ Commande {orderCode} confirmée — Merci pour votre achat sur Mes Courses Faciles !
      </Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>

          {/* ══════════════════════════════════════════
              HEADER — Logo + Fond sombre
          ══════════════════════════════════════════ */}
          <Section style={styles.header}>
            <Text style={styles.logo}>🛒 Mes Courses Faciles</Text>
            <Text style={styles.tagline}>Votre marché à domicile à Libreville</Text>
          </Section>

          {/* ══════════════════════════════════════════
              HÉRO — Confirmation
          ══════════════════════════════════════════ */}
          <Section style={styles.hero}>
            <Text style={styles.successBadge}>✅&nbsp; Commande confirmée</Text>
            <Heading as="h1" style={styles.h1}>
              Merci pour votre commande,&nbsp;{firstName}&nbsp;!
            </Heading>
            <Text style={styles.heroSub}>
              Votre commande{' '}
              <strong style={{ color: BRAND_PRIMARY }}>{orderCode}</strong>{' '}
              a bien été reçue et sera préparée par{' '}
              <strong>{storeName}</strong>. Un livreur vous contactera très bientôt.
            </Text>
          </Section>

          <Hr style={styles.hr} />

          {/* ══════════════════════════════════════════
              TABLEAU RÉCAPITULATIF
          ══════════════════════════════════════════ */}
          <Section style={styles.section}>
            <Heading as="h2" style={styles.h2}>
              📦 Récapitulatif de votre commande
            </Heading>

            {/* En-tête colonnes */}
            <Row style={styles.tableHeader}>
              <Column style={{ ...styles.col, ...styles.colArticle, color: SLATE_500, fontWeight: 700 }}>
                Article
              </Column>
              <Column style={{ ...styles.col, ...styles.colQty, color: SLATE_500, fontWeight: 700 }}>
                Qté
              </Column>
              <Column style={{ ...styles.col, ...styles.colPrice, color: SLATE_500, fontWeight: 700 }}>
                Montant
              </Column>
            </Row>

            {/* Lignes articles */}
            {items.map((item, i) => (
              <Row key={i} style={{ ...styles.tableRow, backgroundColor: i % 2 === 0 ? WHITE : SLATE_100 }}>
                <Column style={{ ...styles.col, ...styles.colArticle, color: SLATE_900, fontWeight: 600 }}>
                  {item.name}
                </Column>
                <Column style={{ ...styles.col, ...styles.colQty, color: SLATE_700 }}>
                  ×{item.quantity}
                </Column>
                <Column style={{ ...styles.col, ...styles.colPrice, color: SLATE_900, fontWeight: 700 }}>
                  {(item.unitPrice * item.quantity).toLocaleString('fr-FR')} CFA
                </Column>
              </Row>
            ))}

            {/* Sous-total */}
            <Row style={styles.subtotalRow}>
              <Column style={{ ...styles.col, ...styles.colArticle, color: SLATE_500 }}>
                Sous-total articles
              </Column>
              <Column style={{ ...styles.col, ...styles.colQty }}></Column>
              <Column style={{ ...styles.col, ...styles.colPrice, color: SLATE_700, fontWeight: 600 }}>
                {subtotal.toLocaleString('fr-FR')} CFA
              </Column>
            </Row>

            {/* Livraison */}
            <Row style={styles.subtotalRow}>
              <Column style={{ ...styles.col, ...styles.colArticle, color: SLATE_500 }}>
                🚚 Frais de livraison
              </Column>
              <Column style={{ ...styles.col, ...styles.colQty }}></Column>
              <Column style={{ ...styles.col, ...styles.colPrice, color: SLATE_700, fontWeight: 600 }}>
                {deliveryFee.toLocaleString('fr-FR')} CFA
              </Column>
            </Row>

            {/* Total TTC */}
            <Row style={styles.totalRow}>
              <Column style={{ ...styles.col, ...styles.colArticle, color: SLATE_900, fontWeight: 800, fontSize: '15px' }}>
                💰 Total TTC
              </Column>
              <Column style={{ ...styles.col, ...styles.colQty }}></Column>
              <Column style={{ ...styles.col, ...styles.colPrice, color: BRAND_PRIMARY, fontWeight: 900, fontSize: '18px' }}>
                {total.toLocaleString('fr-FR')} CFA
              </Column>
            </Row>
          </Section>

          <Hr style={styles.hr} />

          {/* ══════════════════════════════════════════
              INFOS LIVRAISON & PAIEMENT
          ══════════════════════════════════════════ */}
          <Section style={styles.section}>
            <Row>
              <Column style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>📍 Adresse de livraison</Text>
                <Text style={styles.infoCardBody}>{deliveryAddress}</Text>
              </Column>
              <Column style={{ width: '16px' }} />
              <Column style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>🏦 Mode de paiement</Text>
                <Text style={styles.infoCardBody}>
                  {PAYMENT_LABELS[paymentMethod] ?? paymentMethod}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={styles.hr} />

          {/* ══════════════════════════════════════════
              CTA — Suivi de commande
          ══════════════════════════════════════════ */}
          <Section style={{ ...styles.section, textAlign: 'center' as const }}>
            <Heading as="h2" style={{ ...styles.h2, textAlign: 'center' as const }}>
              Suivez votre livraison en temps réel
            </Heading>
            <Text style={{ ...styles.heroSub, textAlign: 'center' as const, marginBottom: '28px' }}>
              Consultez l&apos;avancement de votre commande depuis votre espace client Mes Courses Faciles.
            </Text>
            <Button href={trackingUrl} style={styles.ctaButton}>
              Suivre ma commande →
            </Button>
            <Text style={styles.ctaHelper}>
              Ou copiez ce lien :{' '}
              <Link href={trackingUrl} style={{ color: BRAND_PRIMARY, textDecoration: 'underline' }}>
                {trackingUrl}
              </Link>
            </Text>
          </Section>

          {/* ══════════════════════════════════════════
              BANDEAU RÉASSURANCE
          ══════════════════════════════════════════ */}
          <Section style={styles.reassurance}>
            <Row>
              {[
                { icon: '🔒', label: 'Paiement Sécurisé' },
                { icon: '⚡', label: 'Livraison Rapide' },
                { icon: '💬', label: 'Support WhatsApp' },
              ].map((item) => (
                <Column key={item.label} style={styles.reassuranceCol}>
                  <Text style={styles.reassuranceIcon}>{item.icon}</Text>
                  <Text style={styles.reassuranceLabel}>{item.label}</Text>
                </Column>
              ))}
            </Row>
          </Section>

          {/* ══════════════════════════════════════════
              FOOTER
          ══════════════════════════════════════════ */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Mes Courses Faciles · Libreville, Gabon
            </Text>
            <Text style={styles.footerText}>
              Cet email a été envoyé à <strong>{customerEmail}</strong> suite à votre commande.
            </Text>
            <Text style={{ ...styles.footerText, marginTop: '8px' }}>
              Des questions ? Répondez à cet email ou écrivez-nous sur WhatsApp.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles (inline pour compatibilité maximale clients email) ────────────────

const styles = {
  body: {
    backgroundColor: '#F0FDF4',
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    margin: '0',
    padding: '32px 0',
  } as React.CSSProperties,

  container: {
    backgroundColor: WHITE,
    borderRadius: '16px',
    border: `1px solid ${SLATE_200}`,
    maxWidth: '600px',
    margin: '0 auto',
    overflow: 'hidden' as const,
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  } as React.CSSProperties,

  header: {
    background: `linear-gradient(135deg, ${SLATE_900} 0%, #1E293B 60%, #0C4A2F 100%)`,
    padding: '32px 40px 28px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  logo: {
    fontSize: '26px',
    fontWeight: 900,
    color: WHITE,
    margin: '0',
    letterSpacing: '-0.5px',
  } as React.CSSProperties,

  tagline: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    margin: '6px 0 0',
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  } as React.CSSProperties,

  hero: {
    padding: '44px 40px 36px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  successBadge: {
    display: 'inline-block',
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    borderRadius: '100px',
    padding: '6px 18px',
    fontSize: '13px',
    fontWeight: 700,
    margin: '0 0 20px',
  } as React.CSSProperties,

  h1: {
    fontSize: '28px',
    fontWeight: 900,
    color: SLATE_900,
    lineHeight: '1.3',
    margin: '0 0 16px',
    letterSpacing: '-0.5px',
  } as React.CSSProperties,

  heroSub: {
    fontSize: '15px',
    color: SLATE_700,
    lineHeight: '1.7',
    margin: '0',
  } as React.CSSProperties,

  hr: {
    borderTop: `1px solid ${SLATE_200}`,
    margin: '0',
  } as React.CSSProperties,

  section: {
    padding: '36px 40px',
  } as React.CSSProperties,

  h2: {
    fontSize: '17px',
    fontWeight: 800,
    color: SLATE_900,
    margin: '0 0 20px',
    letterSpacing: '-0.3px',
  } as React.CSSProperties,

  tableHeader: {
    backgroundColor: SLATE_100,
    borderRadius: '8px',
  } as React.CSSProperties,

  tableRow: {
    borderRadius: '4px',
  } as React.CSSProperties,

  col: {
    fontSize: '13px',
    padding: '11px 14px',
    verticalAlign: 'middle' as const,
  } as React.CSSProperties,

  colArticle: { width: '55%' } as React.CSSProperties,
  colQty:     { width: '15%', textAlign: 'center' as const } as React.CSSProperties,
  colPrice:   { width: '30%', textAlign: 'right' as const } as React.CSSProperties,

  subtotalRow: {
    borderTop: `1px solid ${SLATE_100}`,
  } as React.CSSProperties,

  totalRow: {
    backgroundColor: '#ECFDF5',
    borderRadius: '10px',
    marginTop: '4px',
  } as React.CSSProperties,

  infoCard: {
    backgroundColor: SLATE_100,
    borderRadius: '12px',
    padding: '18px 20px',
    verticalAlign: 'top' as const,
  } as React.CSSProperties,

  infoCardTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: SLATE_500,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    margin: '0 0 8px',
  } as React.CSSProperties,

  infoCardBody: {
    fontSize: '14px',
    fontWeight: 600,
    color: SLATE_900,
    lineHeight: '1.55',
    margin: '0',
  } as React.CSSProperties,

  ctaButton: {
    backgroundColor: BRAND_PRIMARY,
    color: WHITE,
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 700,
    padding: '14px 36px',
    textDecoration: 'none',
    display: 'inline-block',
    boxShadow: '0 4px 16px rgba(5,150,105,0.35)',
  } as React.CSSProperties,

  ctaHelper: {
    fontSize: '12px',
    color: SLATE_500,
    marginTop: '18px',
  } as React.CSSProperties,

  reassurance: {
    backgroundColor: '#F0FDF4',
    padding: '24px 40px',
    borderTop: `1px solid #D1FAE5`,
  } as React.CSSProperties,

  reassuranceCol: {
    textAlign: 'center' as const,
    padding: '0 12px',
  } as React.CSSProperties,

  reassuranceIcon: {
    fontSize: '22px',
    margin: '0 0 4px',
  } as React.CSSProperties,

  reassuranceLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: BRAND_PRIMARY,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '0',
  } as React.CSSProperties,

  footer: {
    backgroundColor: SLATE_100,
    padding: '24px 40px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  footerText: {
    fontSize: '12px',
    color: SLATE_500,
    margin: '4px 0',
    lineHeight: '1.65',
  } as React.CSSProperties,
};
