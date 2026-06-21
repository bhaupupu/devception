import type { Metadata } from 'next';
import LegalPageLayout from '@/components/landing/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Cookie Policy — Devception',
  description: 'Information about how Devception uses cookies and how you can manage your preferences.',
};

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="COOKIE POLICY"
      subtitle="Last updated: January 1, 2025. This policy explains what cookies are and how we use them."
    >
      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you
        visit a website. They are widely used to make websites work efficiently, to remember your preferences,
        and to provide information to website owners about how visitors use their site.
      </p>
      <p>
        Cookies are not programs and cannot execute code on your device. They cannot carry viruses or install
        malware. Each cookie is unique to your browser and contains anonymous information such as a unique
        identifier, the website domain, and some digits and numbers.
      </p>

      <h2>2. Why We Use Cookies</h2>
      <p>Devception uses cookies for the following purposes:</p>
      <ul>
        <li><strong>Essential functionality:</strong> To keep you logged in and maintain your session securely</li>
        <li><strong>Security:</strong> To prevent cross-site request forgery (CSRF) attacks</li>
        <li><strong>Analytics:</strong> To understand how visitors use our website so we can improve it</li>
        <li><strong>Advertising:</strong> To serve relevant advertisements through Google AdSense</li>
      </ul>

      <h2>3. Types of Cookies We Use</h2>

      <h2>3.1 Essential Cookies</h2>
      <p>
        These cookies are strictly necessary for the website to function. Without them, you cannot log in
        or use the game. You cannot opt out of essential cookies.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie Name</th>
            <th>Purpose</th>
            <th>Duration</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>next-auth.session-token</td>
            <td>Maintains your authenticated session after Google login</td>
            <td>30 days</td>
            <td>Essential</td>
          </tr>
          <tr>
            <td>next-auth.csrf-token</td>
            <td>Protects against cross-site request forgery attacks</td>
            <td>Session</td>
            <td>Essential</td>
          </tr>
          <tr>
            <td>next-auth.callback-url</td>
            <td>Stores the URL to redirect to after authentication</td>
            <td>Session</td>
            <td>Essential</td>
          </tr>
        </tbody>
      </table>

      <h2>3.2 Analytics Cookies</h2>
      <p>
        These cookies help us understand how visitors interact with Devception by collecting and reporting
        information anonymously. This helps us improve the site over time. You can opt out via your browser
        settings or the Google Analytics opt-out browser add-on.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie Name</th>
            <th>Purpose</th>
            <th>Duration</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>_ga</td>
            <td>Google Analytics — distinguishes unique users</td>
            <td>2 years</td>
            <td>Analytics</td>
          </tr>
          <tr>
            <td>_gid</td>
            <td>Google Analytics — distinguishes users within 24 hours</td>
            <td>24 hours</td>
            <td>Analytics</td>
          </tr>
          <tr>
            <td>_gat</td>
            <td>Google Analytics — throttles request rate</td>
            <td>1 minute</td>
            <td>Analytics</td>
          </tr>
        </tbody>
      </table>

      <h2>3.3 Advertising Cookies (Google AdSense)</h2>
      <p>
        We use Google AdSense to display advertisements. AdSense uses cookies and similar technologies to
        serve ads based on your prior visits to our site and other sites across the internet. These cookies
        help make advertising more relevant to you.
      </p>
      <p>
        You may opt out of personalised advertising by visiting{' '}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>{' '}
        or{' '}
        <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer">
          aboutads.info opt-out
        </a>
        . Opting out means you will still see advertisements, but they will not be personalised to your interests.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie Name</th>
            <th>Purpose</th>
            <th>Duration</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>__gads</td>
            <td>Google AdSense — registers ad clicks and impressions</td>
            <td>13 months</td>
            <td>Advertising</td>
          </tr>
          <tr>
            <td>__gpi</td>
            <td>Google AdSense — stores information about how ads perform</td>
            <td>13 months</td>
            <td>Advertising</td>
          </tr>
          <tr>
            <td>IDE</td>
            <td>Google DoubleClick — used for targeting and measuring ad effectiveness</td>
            <td>13 months</td>
            <td>Advertising</td>
          </tr>
          <tr>
            <td>test_cookie</td>
            <td>Google — checks if the browser supports cookies</td>
            <td>Session</td>
            <td>Advertising</td>
          </tr>
        </tbody>
      </table>

      <h2>4. How to Manage Cookies</h2>
      <p>
        You can control and manage cookies in various ways. Most web browsers automatically accept cookies,
        but you can modify your browser settings to decline cookies if you prefer. Please note that disabling
        cookies may affect the functionality of Devception — in particular, you will not be able to log in
        without essential cookies enabled.
      </p>
      <p>
        Here are links to cookie management guides for major browsers:
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
        <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>
      <p>
        For analytics cookies specifically, you can install the{' '}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          Google Analytics Opt-out Browser Add-on
        </a>.
      </p>

      <h2>5. Third-Party Cookies</h2>
      <p>
        In addition to our own cookies, we may also use various third-party cookies to report usage statistics,
        deliver advertisements, and so on. These third-party cookies are governed by the respective
        privacy policies of those providers:
      </p>
      <ul>
        <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a> (Analytics &amp; AdSense)</li>
        <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a> (Hosting)</li>
      </ul>

      <h2>6. Changes to This Cookie Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in the cookies we use or
        for operational, legal, or regulatory reasons. Please revisit this policy regularly to stay informed
        about our use of cookies. The date at the top of this policy indicates when it was last updated.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have questions about our use of cookies, please contact us at{' '}
        <a href="mailto:guptadiwanshu2007@gmail.com">guptadiwanshu2007@gmail.com</a> or visit our{' '}
        <a href="/contact">contact page</a>.
      </p>
    </LegalPageLayout>
  );
}
