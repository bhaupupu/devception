import type { Metadata } from 'next';
import LegalPageLayout from '@/components/landing/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Terms of Service — Devception',
  description: 'Read the Terms of Service for Devception, the multiplayer social deduction coding game.',
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="TERMS OF SERVICE"
      subtitle="Last updated: January 1, 2025. Please read these terms carefully before using Devception."
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using Devception at <a href="https://devception.com">devception.com</a> (the
        &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you
        do not agree to these Terms in their entirety, you may not access or use the Service. These Terms
        constitute a binding legal agreement between you and the Devception team (&quot;Devception,&quot;
        &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).
      </p>

      <h2>2. Description of Service</h2>
      <p>
        Devception is a real-time multiplayer social deduction coding game. Players join rooms of 4–8
        participants, are assigned hidden roles (Developer or Imposter), and collaborate on shared coding
        challenges while attempting to identify the Imposter. The Imposter secretly attempts to introduce
        bugs and sabotage the team&apos;s progress without being detected.
      </p>
      <p>
        The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not
        guarantee uninterrupted, error-free service, and we reserve the right to modify, suspend, or
        discontinue the Service at any time without notice.
      </p>

      <h2>3. Account Requirements</h2>
      <p>To use Devception, you must:</p>
      <ul>
        <li>Be at least 13 years of age. If you are under 18, you represent that you have obtained parental or guardian consent.</li>
        <li>Have a valid Google account, which is used for authentication via Google OAuth.</li>
        <li>Provide accurate and complete information about yourself.</li>
        <li>Maintain the security of your Google account and promptly notify us of any unauthorized use.</li>
        <li>Not share your account or allow others to use your session.</li>
      </ul>

      <h2>4. Acceptable Use</h2>
      <p>You agree to use the Service only for lawful purposes and in a manner consistent with these Terms. You specifically agree NOT to:</p>
      <ul>
        <li>Use automated bots, scripts, or tools to interact with the Service</li>
        <li>Attempt to hack, scrape, or reverse-engineer any part of the Service</li>
        <li>Interfere with the proper functioning of the Service or its servers</li>
        <li>Attempt to gain unauthorized access to other users&apos; accounts</li>
        <li>Use the Service for any commercial purpose without our written consent</li>
        <li>Circumvent any geographic or access restrictions we implement</li>
      </ul>

      <h2>5. Multiplayer Conduct</h2>
      <p>
        Devception is a multiplayer game. You agree to the following conduct standards within the game:
      </p>
      <ul>
        <li><strong>No harassment:</strong> Do not harass, bully, threaten, or intimidate other players in any communication channel.</li>
        <li><strong>No hate speech:</strong> Do not use language that is discriminatory, racist, sexist, homophobic, or otherwise hateful.</li>
        <li><strong>No impersonation:</strong> Do not impersonate other players, Devception staff, or any other person or entity.</li>
        <li><strong>No cheating:</strong> Do not use external tools, scripts, or exploits that give you an unfair advantage outside the designed imposter mechanics.</li>
        <li><strong>Fair play:</strong> The imposter mechanics (bug insertion, misleading hints) are designed features — using them as intended is encouraged. Exploiting unintended bugs in the game code is not.</li>
        <li><strong>Respect game sessions:</strong> Do not deliberately disconnect to ruin matches for other players.</li>
      </ul>

      <h2>6. Intellectual Property</h2>
      <p>
        The Devception platform, including its codebase, design, user interface, branding, logo, and all
        content created by Devception (including coding challenges, game mechanics, and visual assets), is
        owned by the Devception team and is protected by applicable intellectual property laws.
      </p>
      <p>
        Code challenges within Devception games are created by us and may not be reproduced, distributed,
        or used outside of the game context without our written permission. In-game code you write during
        matches is ephemeral and used solely for gameplay purposes. We do not claim ownership of code you
        write during matches.
      </p>
      <p>
        You may not use our name, logo, or branding without our prior written consent.
      </p>

      <h2>7. Prohibited Activities</h2>
      <p>The following activities are strictly prohibited:</p>
      <ul>
        <li>Attempting to disrupt, overload, or disable our servers or network infrastructure</li>
        <li>Distributing malware, viruses, or harmful code through the Service</li>
        <li>Collecting other users&apos; personal information without their consent</li>
        <li>Creating fake accounts or using the Service to spam other users</li>
        <li>Using the Service in violation of any applicable local, national, or international law</li>
        <li>Reselling, sublicensing, or commercialising any part of the Service without permission</li>
      </ul>

      <h2>8. Account Termination</h2>
      <p>
        We reserve the right to suspend or permanently terminate your account at our sole discretion,
        without notice, for conduct that we determine violates these Terms or is harmful to other users,
        the Service, or third parties. Upon termination, your right to use the Service will immediately cease.
      </p>
      <p>
        You may delete your account at any time by contacting us at{' '}
        <a href="mailto:guptadiwanshu2007@gmail.com">guptadiwanshu2007@gmail.com</a>. Upon deletion, your personal data
        will be purged within 30 days in accordance with our Privacy Policy.
      </p>

      <h2>9. Disclaimer of Warranties</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY
        KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
      </p>
      <p>
        We do not warrant that the Service will function uninterrupted, that defects will be corrected,
        or that the Service or the servers that make it available are free of viruses or other harmful components.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL DEVCEPTION, ITS OPERATORS,
        DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS,
        GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR
        INABILITY TO USE, THE SERVICE.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with applicable laws, without regard to
        conflict of law principles. Any disputes arising from these Terms or your use of the Service shall be
        resolved through good-faith negotiation wherever possible.
      </p>

      <h2>12. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. When we make changes, we will update the
        &quot;Last updated&quot; date at the top of this page. Your continued use of the Service after any
        changes constitutes your acceptance of the new Terms. If you do not agree to the modified Terms,
        you must discontinue use of the Service.
      </p>

      <h2>13. Contact Us</h2>
      <p>
        If you have questions about these Terms of Service, please contact us:
      </p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:guptadiwanshu2007@gmail.com">guptadiwanshu2007@gmail.com</a></li>
        <li><strong>Website:</strong> <a href="/contact">devception.com/contact</a></li>
      </ul>
    </LegalPageLayout>
  );
}
