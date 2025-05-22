This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Question Organization System

This project uses a modular approach to organize statistical practice questions:

- Questions are organized by year and session
- Each question is stored in its own file for better maintainability
- A script automatically updates imports when new questions are added
- Questions can be accessed individually by session or combined via the year file (e.g., `1st_year.ts`)

### Adding New Questions

1. Create a new question file using the helper script:
   ```bash
   npm run create-question 1st_year session1 5
   ```

2. Edit the generated template with your question content

3. Run the update script to refresh all imports:
   ```bash
   npm run update-questions
   ```

4. See the [detailed documentation](./docs/question-organization.md) for more information

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
