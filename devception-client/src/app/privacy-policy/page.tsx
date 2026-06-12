import type { Metadata } from 'next';
import LegalPageLayout from '@/components/landing/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy — Devception',
  description: 'Learn how Devception collects, uses, and protects your personal information when you use our multiplayer coding game.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="PRIVACY POLICY"
      subtitle="Last updated: January 1, 2025. We take your privacy seriously."
    >
      <h2>1. Introduction</h2>
      <p>
        Welcome to Devception (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). Devception is a multiplayer social deduction coding game
        accessible at <a href="https://devception.com">devception.com</a>. We are operated by the Devception team,
        a group of student developers. This Privacy Policy explains how we collect, use, disclose, and safeguard your
        information when you visit our website and use our game. Please read this policy carefully. If you disagree
        with its terms, please discontinue use of the site immediately.
      </p>
      <p>
        We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert
        you about any changes by updating the &quot;Last updated&quot; date of this policy. You are encouraged to
        periodically review this policy to stay informed of updates.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We may collect information about you in a variety of ways. The information we collect includes:</p>
      <ul>
        <li>
          <strong>Google Account Information:</strong> When you sign in via Google OAuth (powered by NextAuth.js),
          we receive your name, email address, profile picture URL, and Google account identifier. We do NOT
          access your Google Drive, Gmail, Docs, Calendar, or any other Google services beyond basic profile data.
        </li>
        <li>
          <strong>Game Data:</strong> Match history, wins and losses, tasks completed, roles assigned, room codes
          generated, and in-game actions. Role assignments are anonymized after 90 days and match details after 12 months.
        </li>
        <li>
          <strong>Usage Data:</strong> Pages you visit, time spent on pages, links clicked, browser type, operating
          system, referring URLs, and IP address. This is collected automatically through server logs and Google Analytics.
        </li>
        <li>
          <strong>Cookies and Tracking Technologies:</strong> Session cookies, preference cookies, analytics cookies
          (Google Analytics), and advertising cookies (Google AdSense). See Section 5 for details.
        </li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customised experience. Specifically, we may use information collected about you to:</p>
      <ul>
        <li>Authenticate you and maintain your session via Google OAuth</li>
        <li>Display your name and profile picture in game lobbies and results screens</li>
        <li>Track your match history and performance statistics</li>
        <li>Pair you with appropriate players through our matchmaking system</li>
        <li>Serve personalised advertisements through Google AdSense</li>
        <li>Analyse usage trends to improve our game and website</li>
        <li>Prevent fraudulent activity, cheating, and abuse of our platform</li>
        <li>Comply with legal obligations</li>
        <li>Respond to your inquiries and support requests</li>
      </ul>

      <h2>4. Google AdSense and Third-Party Advertising</h2>
      <p>
        We use Google AdSense to display advertisements on Devception. Google AdSense is a third-party advertising
        service provided by Google LLC. Google uses cookies, web beacons, and similar tracking technologies to serve
        ads based on your prior visits to our website or other websites on the internet.
      </p>
      <p>
        Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit
        to our site and/or other sites on the internet. You may opt out of personalised advertising by visiting
        Google&apos;s Ads Settings at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">google.com/settings/ads</a>,
        or by visiting <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer">optout.aboutads.info</a>.
        Note that opting out does not mean you will no longer see advertisements — you will still see non-personalised ads.
      </p>
      <p>
        Google AdSense may collect data such as cookie identifiers, IP addresses, and browsing behaviour. This data
        is governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google&apos;s Privacy Policy</a>.
      </p>

      <h2>5. Cookies</h2>
      <p>
        We use cookies and similar tracking technologies to access or store information. Specific information about
        how we use cookies and your choices regarding cookies is set out in our <a href="/cookie-policy">Cookie Policy</a>.
        In summary:
      </p>
      <ul>
        <li><strong>Essential Cookies:</strong> Required for the website to function. These include your authentication session cookie (next-auth.session-token) and CSRF protection token. You cannot opt out of essential cookies.</li>
        <li><strong>Analytics Cookies:</strong> Google Analytics cookies (_ga, _gid) help us understand how visitors interact with the site. These can be disabled in your browser settings.</li>
        <li><strong>Advertising Cookies:</strong> Google AdSense cookies serve personalised advertisements. You can opt out via Google&apos;s Ads Settings.</li>
      </ul>

      <h2>6. Data Sharing and Disclosure</h2>
      <p>We do not sell, trade, rent, or otherwise transfer your personal information to third parties for their marketing purposes. We may share your information in the following limited circumstances:</p>
      <ul>
        <li><strong>Google LLC:</strong> For authentication (Google OAuth via NextAuth) and advertising (Google AdSense). Governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google&apos;s Privacy Policy</a>.</li>
        <li><strong>Vercel Inc.:</strong> Our hosting provider. Vercel processes HTTP requests and may log IP addresses and request metadata. Governed by <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel&apos;s Privacy Policy</a>.</li>
        <li><strong>MongoDB Atlas (MongoDB, Inc.):</strong> Our database hosting provider stores your account and game data. Governed by <a href="https://www.mongodb.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">MongoDB&apos;s Privacy Policy</a>.</li>
        <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests from public authorities.</li>
      </ul>

      <h2>7. Data Retention</h2>
      <p>
        We retain your personal information for as long as your account is active, plus an additional 30-day
        grace period following account deletion to allow for error correction. Specific retention periods:
      </p>
      <ul>
        <li>Account profile data (name, email, profile picture): Retained while account is active + 30 days after deletion</li>
        <li>Match history and game statistics: Retained for 12 months, then anonymized</li>
        <li>Role assignments: Anonymized after 90 days</li>
        <li>Server access logs: Retained for 30 days</li>
      </ul>

      <h2>8. Your Rights</h2>
      <p>Depending on your location, you may have the following rights regarding your personal information:</p>
      <ul>
        <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you</li>
        <li><strong>Right to Correction:</strong> Request correction of inaccurate personal information</li>
        <li><strong>Right to Deletion:</strong> Request deletion of your personal information and account</li>
        <li><strong>Right to Object:</strong> Object to our processing of your personal information for certain purposes</li>
        <li><strong>Right to Data Portability:</strong> Request a machine-readable copy of your data</li>
      </ul>
      <p>
        To exercise any of these rights, please contact us at <a href="mailto:team@devception.com">team@devception.com</a>.
        We will respond to all legitimate requests within 30 days.
      </p>

      <h2>9. Children&apos;s Privacy</h2>
      <p>
        Devception is not directed at children under the age of 13, and we do not knowingly collect personal
        information from children under 13. If you believe a child under 13 has provided us with personal information,
        please contact us immediately at <a href="mailto:team@devception.com">team@devception.com</a> and we will
        take steps to delete that information.
      </p>

      <h2>10. Security</h2>
      <p>
        We use administrative, technical, and physical security measures to help protect your personal information.
        Authentication is handled by Google OAuth through NextAuth.js, an industry-standard protocol. All data in
        transit is encrypted using HTTPS/TLS. Database access is restricted to authenticated server instances only.
        While we have taken reasonable steps to secure the personal information you provide, please be aware that
        no security measures are perfect or impenetrable.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time in order to reflect changes to our practices or for
        other operational, legal, or regulatory reasons. The updated version will be indicated by an updated
        &quot;Last updated&quot; date and the updated version will be effective as soon as it is accessible.
        We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        If you have questions or comments about this Privacy Policy, please contact us at:
      </p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:team@devception.com">team@devception.com</a></li>
        <li><strong>Website:</strong> <a href="/contact">devception.com/contact</a></li>
      </ul>
    </LegalPageLayout>
  );
}
