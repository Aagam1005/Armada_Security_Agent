# Armada

Armada is a browser-based security intelligence workspace. It helps teams review a URL, code snippet, or system description and turn that information into a short, prioritized security brief.

## What Armada does

Armada currently supports three assessment modes:

1. **URL analysis** — reviews a target URL for basic signals such as missing HTTPS and exposed admin or login surfaces.
2. **Code review** — checks pasted code or repository descriptions for risky patterns such as secrets, dynamic HTML, or dynamic code execution.
3. **Architecture** — reviews a system description for data protection and trust-boundary concerns.

Each assessment returns findings grouped by severity: critical, high, medium, low, and informational. Every finding includes a description, supporting detail, and a practical recommendation.

## Important: local analysis

Armada runs its current analysis entirely in the browser. It does **not** send the submitted URL, code, or system description to an API, does not actively scan a target, and does not make network requests to the target.

This makes the project safe to demonstrate and easy to run, but it also means the results are advisory heuristics—not a penetration test, vulnerability scanner, or replacement for a professional security assessment.

Only test systems that you own or are explicitly authorized to assess.

## How to use it

1. Open Armada in your browser.
2. Choose **URL analysis**, **Code review**, or **Architecture**.
3. Enter the target URL, paste code, or describe the system.
4. Optionally choose a focus area, such as authentication, injection, API security, or secrets.
5. Select **Run local analysis**.
6. Review the severity summary and remediation guidance.
7. Select **New assessment** to clear the current result and start again.

### Example inputs

**URL analysis**

```text
https://app.example.com/admin
```

**Code review**

```ts
const html = userInput
return <div dangerouslySetInnerHTML={{ __html: html }} />
```

**Architecture**

```text
Next.js application with a PostgreSQL database and an admin dashboard.
Users authenticate with passwords. The database is used for customer records.
```

## Project structure

```text
app/
├── page.tsx              # Main Armada interface and local analysis rules
├── layout.tsx            # Metadata, viewport settings, and analytics
└── globals.css           # Global styles and form styling

public/                   # Static icons and public assets
next.config.mjs           # Next.js configuration
package.json              # Scripts and dependencies
```

## Run locally

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

Create a production build with:

```bash
pnpm build
pnpm start
```

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React icons
- Vercel Analytics in production

## Design and accessibility

Armada uses a dark security-console visual language with cyan accents and severity colors. The interface is responsive, uses semantic form labels, exposes errors with `role="alert"`, and announces completed results with an `aria-live` region.

## Extending Armada

To add a new local rule, update `runLocalAnalysis` in `app/page.tsx`:

1. Identify the relevant assessment mode.
2. Add a narrowly scoped, explainable condition.
3. Return a finding with a severity, description, detail, and recommendation.
4. Test both a matching input and a clean input.

If you later add live scanning or an AI service, keep that work on the server side, validate inputs, protect credentials with environment variables, and clearly distinguish automated analysis from verified security findings.

## Limitations

- Armada does not actively crawl or probe URLs.
- Armada does not execute submitted code.
- Armada cannot confirm whether a credential-like string is a real secret.
- A clean result does not prove that a system is secure.
- Findings should be validated before remediation or reporting.

## Deployment

Armada can be deployed as a standard Next.js application on Vercel. Use the project’s **Publish** action, or connect the project to GitHub for version-controlled deployments.

Because the current implementation has no required backend API or secret environment variable, the local analysis experience works after deployment without additional configuration.

## License and responsible use

Add the license that matches your project before distributing Armada. Use the tool responsibly, obtain authorization before testing, and avoid submitting confidential source code or credentials into shared environments.

## Simple explanation for teammates

> Armada is a lightweight security review assistant. You give it a URL, a piece of code, or a description of your system. It checks that input against a small set of security rules, highlights possible risks by severity, and suggests what to do next. It is designed for early review and education, not for attacking or proving that a system is secure.

## Project name

The product name is **Armada**.

The interface footer identifies it as the **Armada Security Agent**.
