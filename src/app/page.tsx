import { generateRandomParagraph } from '@/ai/flows/generate-paragraph';
import { TypingTestContainer } from '@/components/typing-test-container';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { paragraph } = await generateRandomParagraph({
    length: 5,
    seed: Math.random(),
  });

  return <TypingTestContainer initialParagraph={paragraph} />;
}
