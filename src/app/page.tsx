import { generateRandomParagraph } from '@/ai/flows/generate-paragraph';
import { TypingTestContainer } from '@/components/typing-test-container';

export default async function Home() {
  const { paragraph } = await generateRandomParagraph({ length: 5 });

  return <TypingTestContainer initialParagraph={paragraph} />;
}
